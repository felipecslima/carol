// Exclusão definitiva de conta (DEV-203, LGPD). A creator pede na Conta; a conta fica desativada por 7 dias e ela
// pode voltar atrás entrando de novo. Vencido o prazo, uma rotina diária apaga, nesta ordem: arquivos no Cloudinary,
// PDFs do mídia kit no Storage, dados no banco e o usuário no Auth. Apagar o usuário leva o perfil e, pelo
// cascade, projetos, mídias, links e eventos; os pedidos ficam, sem ligação com a pessoa (registro de pagamentos).
// Se os arquivos não saem, nada mais é apagado: a rotina tenta de novo no dia seguinte.

export const DIAS_PARA_EXCLUIR = 7;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export interface DependenciasDaExclusao {
  /** ids das contas com exclusão pedida antes de `limite` */
  listarVencidas: (limite: Date) => Promise<string[] | null>;
  /** apaga todos os arquivos da pasta da creator; `false` se algum não saiu */
  apagarArquivos: (id: string) => Promise<boolean>;
  /** apaga o usuário no Auth (o cascade do banco leva os dados); `false` se falhou */
  apagarUsuario: (id: string) => Promise<boolean>;
  registrar: (id: string, detalhes: object) => Promise<void>;
  agora?: () => Date;
}

export interface ResultadoDaExclusao {
  ok: boolean;
  excluidas: string[];
  falhas: { id: string; etapa: 'arquivos' | 'usuario' | 'id' }[];
}

export async function excluirContasVencidas(dep: DependenciasDaExclusao): Promise<ResultadoDaExclusao> {
  const agora = dep.agora?.() ?? new Date();
  const limite = new Date(agora.getTime() - DIAS_PARA_EXCLUIR * 24 * 60 * 60 * 1000);
  const ids = await dep.listarVencidas(limite);
  if (!ids) return { ok: false, excluidas: [], falhas: [] };
  const resultado: ResultadoDaExclusao = { ok: true, excluidas: [], falhas: [] };
  for (const id of ids) {
    // id fora do formato nunca vira prefixo de pasta (um id vazio apagaria a pasta de todas as creators)
    if (!UUID.test(id)) {
      resultado.falhas.push({ id, etapa: 'id' });
      continue;
    }
    if (!(await dep.apagarArquivos(id))) {
      resultado.falhas.push({ id, etapa: 'arquivos' });
      continue;
    }
    if (!(await dep.apagarUsuario(id))) {
      resultado.falhas.push({ id, etapa: 'usuario' });
      continue;
    }
    resultado.excluidas.push(id);
    await dep.registrar(id, { via: 'rotina diaria' });
  }
  return resultado;
}
