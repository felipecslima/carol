// Registros de acesso (Marco Civil da Internet, art. 15) e prazos de guarda da Política de Privacidade (item 4):
// registros de acesso por 6 meses; registro de ações da equipe por 5 anos. A rotina diária apaga o que passou do prazo.
import { consulta } from './banco';

export const MESES_DOS_REGISTROS_DE_ACESSO = 6;
export const ANOS_DO_REGISTRO_DE_ACOES = 5;

/** IP de quem fez o pedido: no Cloudflare vem em `cf-connecting-ip`; em desenvolvimento não há, e fica "local". */
export function ipDoPedido(request: Request): string {
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0];
  return (ip?.trim() || 'local').slice(0, 64);
}

export async function registrarAcesso(conta: string, ip: string): Promise<boolean> {
  const r = await consulta('registros_de_acesso', { metodo: 'POST', corpo: { conta, ip } });
  return r.ok;
}

/** Data limite: `agora` menos `meses` (ou anos × 12). */
export function antesDe(agora: Date, meses: number): Date {
  const limite = new Date(agora);
  limite.setMonth(limite.getMonth() - meses);
  return limite;
}

/** Apaga o que passou do prazo de guarda. `ok` falso se alguma das duas limpezas falhou (tenta de novo no dia seguinte). */
export async function apagarRegistrosVencidos(agora = new Date()) {
  const acessos = antesDe(agora, MESES_DOS_REGISTROS_DE_ACESSO).toISOString();
  const acoes = antesDe(agora, ANOS_DO_REGISTRO_DE_ACOES * 12).toISOString();
  const [a, b] = await Promise.all([
    consulta(`registros_de_acesso?em=lt.${encodeURIComponent(acessos)}`, { metodo: 'DELETE' }),
    consulta(`audit_log?criado_em=lt.${encodeURIComponent(acoes)}`, { metodo: 'DELETE' }),
  ]);
  return { ok: a.ok && b.ok, acessosAntesDe: acessos, acoesAntesDe: acoes };
}
