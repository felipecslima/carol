// O projeto da creator é um JSON validado por este schema (docs/00-guia-ia.md, seção 6). Trocar modelo, paleta
// ou formato muda só a pele; o conteúdo vai junto, e o que não cabe vai para `guardados`.
import { z } from 'zod';
import { schemaDosDados, type Registro } from './bloco';
import { numerosSchema } from './numeros';

export const MAXIMO_DE_BLOCOS = 15;

const bloco = z.object({
  id: z.string().min(1),
  tipo: z.string().min(1),
  variacao: z.string().min(1),
  oculto: z.boolean().default(false),
  dados: z.record(z.string(), z.unknown()).default({}),
});
export type Bloco = z.infer<typeof bloco>;

export const projetoSchema = z.object({
  tipo: z.enum(['site', 'midia-kit', 'os-dois']),
  modelo: z.string().min(1),
  paleta: z.number().int().nonnegative(),
  /** cor própria da creator (#rrggbb); quando existe, vale no lugar da paleta pronta */
  corPropria: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .optional(),
  fontes: z.string().min(1),
  cantos: z.enum(['retos', 'suaves', 'redondos']),
  clima: z.enum(['claro', 'escuro']).default('claro'),
  modoIniciante: z.boolean().default(false),
  /** números informados pela creator (formato do docs/04-ocr-prints.md, 3.2); alimentam Números e Público */
  numeros: numerosSchema.optional(),
  blocos: z.array(bloco).max(MAXIMO_DE_BLOCOS, `No máximo ${MAXIMO_DE_BLOCOS} blocos`),
  guardados: z.array(bloco).default([]),
});
export type Projeto = z.infer<typeof projetoSchema>;

export interface Problema {
  /** id do bloco, ou 'projeto' para problemas gerais */
  onde: string;
  mensagem: string;
}

/**
 * Confere um projeto contra o registro de blocos: tipo e variação existem, ids únicos, dados dentro dos limites,
 * blocos fixos (Capa e Contato) presentes e visíveis. Devolve a lista de problemas (vazia = válido).
 */
export function validarProjeto(entrada: unknown, registro: Registro): Problema[] {
  const lido = projetoSchema.safeParse(entrada);
  if (!lido.success)
    return lido.error.issues.map((i) => ({ onde: 'projeto', mensagem: `${i.path.join('.')}: ${i.message}` }));
  const projeto = lido.data;
  const problemas: Problema[] = [];
  const ids = new Set<string>();

  for (const b of [...projeto.blocos, ...projeto.guardados]) {
    if (ids.has(b.id)) problemas.push({ onde: b.id, mensagem: 'Id repetido' });
    ids.add(b.id);
    const definicao = registro[b.tipo];
    if (!definicao) {
      problemas.push({ onde: b.id, mensagem: `Bloco desconhecido: ${b.tipo}` });
      continue;
    }
    if (!definicao.variacoes.some((v) => v.id === b.variacao))
      problemas.push({ onde: b.id, mensagem: `Variação desconhecida: ${b.variacao}` });
    const dados = schemaDosDados(definicao).safeParse(b.dados);
    if (!dados.success)
      for (const i of dados.error.issues)
        problemas.push({ onde: b.id, mensagem: `${i.path.join('.') || 'dados'}: ${i.message}` });
  }

  for (const definicao of Object.values(registro).filter((d) => d.fixo)) {
    const presente = projeto.blocos.find((b) => b.tipo === definicao.tipo);
    if (!presente) problemas.push({ onde: 'projeto', mensagem: `Falta o bloco ${definicao.nome}` });
    else if (presente.oculto)
      problemas.push({ onde: presente.id, mensagem: `${definicao.nome} não pode ficar escondido` });
  }
  return problemas;
}

/** Blocos que a creator vê no modo atual (o modo iniciante esconde Números, Marcas e Público). */
export function blocosVisiveis(projeto: Projeto, registro: Registro): Bloco[] {
  return projeto.blocos.filter((b) => !b.oculto && !(projeto.modoIniciante && registro[b.tipo]?.ocultoNoModoIniciante));
}
