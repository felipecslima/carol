// Planos e preços (DEV-160, 193). Os mesmos valores da página de vendas (`src/data/portfolio-creator.ts`); quando um
// preço mudar, mudar nos dois. O pedido guarda só o id do plano; o valor sai daqui.

export type IdDoPlano = 'pdf' | 'site' | 'atualizacao-mensal' | 'atualizacao-anual' | 'edicao-avulsa';

export interface Plano {
  id: IdDoPlano;
  nome: string;
  /** em centavos */
  valor: number;
  /** cobrado à parte no 1º ano (domínio do plano Site), em centavos; `nome` completa "Mais R$ 40,00 …" */
  extra?: { nome: string; valor: number };
  /** cobrança periódica: aparece depois do valor ("/mês") */
  periodo?: 'mês';
  /** `publicacao` põe o portfólio no ar; `edicao` libera a edição depois do prazo */
  tipo: 'publicacao' | 'edicao';
  /** quanto tempo a edição fica liberada a partir do pagamento (planos de edição) */
  libera?: { meses?: number; dias?: number };
  resumo: string;
}

export const PLANOS: Record<IdDoPlano, Plano> = {
  pdf: {
    id: 'pdf',
    nome: 'Portfólio em PDF + link',
    valor: 4990,
    tipo: 'publicacao',
    resumo: 'Pagamento único. PDF sem marca d’água e um link para compartilhar.',
  },
  site: {
    id: 'site',
    nome: 'Portfólio em site',
    valor: 14990,
    extra: { nome: 'do domínio no 1º ano', valor: 4000 },
    tipo: 'publicacao',
    resumo: 'Tudo do PDF, num site com domínio .com.br no seu nome.',
  },
  'atualizacao-mensal': {
    id: 'atualizacao-mensal',
    nome: 'Atualização mensal',
    valor: 1990,
    tipo: 'edicao',
    periodo: 'mês',
    libera: { meses: 1 },
    resumo: 'Edição liberada por 1 mês a cada pagamento.',
  },
  'atualizacao-anual': {
    id: 'atualizacao-anual',
    nome: 'Atualização anual',
    valor: 17900,
    tipo: 'edicao',
    libera: { meses: 12 },
    resumo: 'Pagamento único. Edição liberada por 12 meses.',
  },
  'edicao-avulsa': {
    id: 'edicao-avulsa',
    nome: 'Edição por 30 dias',
    valor: 4990,
    tipo: 'edicao',
    libera: { dias: 30 },
    resumo: 'Pagamento único, sem assinatura. Edição liberada por 30 dias.',
  },
};

export const PLANOS_DE_PUBLICACAO = (['pdf', 'site'] as const).map((id) => PLANOS[id]);
export const PLANOS_DE_EDICAO = (['atualizacao-mensal', 'atualizacao-anual', 'edicao-avulsa'] as const).map(
  (id) => PLANOS[id],
);

export const ehPlano = (id: unknown): id is IdDoPlano => typeof id === 'string' && id in PLANOS;

/** "R$ 49,90" */
export const formatarValor = (centavos: number) =>
  `R$ ${(centavos / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Até quando um pedido pago de edição deixa editar. `null` para planos de publicação ou plano desconhecido. */
export function edicaoLiberadaAte(plano: string, pagoEm: string): Date | null {
  const p = ehPlano(plano) ? PLANOS[plano] : null;
  if (!p?.libera) return null;
  const ate = new Date(pagoEm);
  if (p.libera.meses) ate.setMonth(ate.getMonth() + p.libera.meses);
  if (p.libera.dias) ate.setDate(ate.getDate() + p.libera.dias);
  return ate;
}
