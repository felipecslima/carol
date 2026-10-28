// Regras de acesso num lugar só (DEV-190): o que a creator pode fazer em cada momento. Usado pelo servidor (que é quem
// decide) e pela tela (que só explica). Momentos: sem conta, grátis, pago no prazo, prazo vencido, edição liberada,
// Premium. O prazo de edição (DEV-192) é até concluir + 7 dias; vencido, a edição trava e o portfólio continua no ar.
import { edicaoLiberadaAte, PLANOS, ehPlano } from './planos';

export interface PedidoParaAcesso {
  plano: string;
  status: string;
  pagoEm: string | null;
}

export interface SituacaoDeAcesso {
  logado: boolean;
  /** `status` do projeto no banco */
  estado: string;
  /** começa a contar na primeira publicação; `null` = nunca publicou */
  prazoEdicao: string | null;
  pedidos: PedidoParaAcesso[];
  /** Premium do site válido (liberado pela equipe) */
  premium: boolean;
  agora?: Date;
}

export type Momento = 'sem-conta' | 'gratis' | 'no-prazo' | 'edicao-liberada' | 'premium' | 'travada';

export interface Acesso {
  momento: Momento;
  /** pode publicar de novo o que mudou (o rascunho no aparelho e na conta ela sempre pode mexer) */
  podePublicar: boolean;
  /** já pagou um plano de publicação (ou tem Premium): PDF sem marca d'água */
  pago: boolean;
  /** até quando dá para publicar mudanças (prazo ou edição liberada); `null` sem limite ou sem pagamento */
  editaAte: Date | null;
  /** explicação curta para a tela quando não pode publicar */
  motivo: string | null;
  /** já pediu para liberar a edição e o pagamento ainda não foi confirmado */
  edicaoPedida: boolean;
}

/** Fim da edição liberada por pedidos pagos de edição (assinatura ou avulsa). `null` se nenhum. */
export function fimDaEdicaoLiberada(pedidos: PedidoParaAcesso[]): Date | null {
  let fim: Date | null = null;
  for (const p of pedidos) {
    if (p.status !== 'pago' || !p.pagoEm) continue;
    const ate = edicaoLiberadaAte(p.plano, p.pagoEm);
    if (ate && (!fim || ate > fim)) fim = ate;
  }
  return fim;
}

export function acessoDa(s: SituacaoDeAcesso): Acesso {
  const edicaoPedida = s.pedidos.some(
    (p) => p.status === 'aguardando_pagamento' && ehPlano(p.plano) && PLANOS[p.plano].tipo === 'edicao',
  );
  return { ...regra(s), edicaoPedida };
}

function regra(s: SituacaoDeAcesso): Omit<Acesso, 'edicaoPedida'> {
  const agora = s.agora ?? new Date();
  if (!s.logado)
    return {
      momento: 'sem-conta',
      podePublicar: false,
      pago: false,
      editaAte: null,
      motivo: 'Para publicar, entre na sua conta.',
    };
  const pagouPublicacao = s.pedidos.some(
    (p) => p.status === 'pago' && ehPlano(p.plano) && PLANOS[p.plano].tipo === 'publicacao',
  );
  const pago = s.premium || pagouPublicacao || s.prazoEdicao !== null;
  if (s.premium) return { momento: 'premium', podePublicar: true, pago, editaAte: null, motivo: null };
  // nunca publicou: monta à vontade; publicar abre o pedido
  if (!s.prazoEdicao) return { momento: 'gratis', podePublicar: true, pago, editaAte: null, motivo: null };

  const prazo = new Date(s.prazoEdicao);
  const liberada = fimDaEdicaoLiberada(s.pedidos);
  // `edicao_travada` gravado pela equipe trava mesmo dentro do prazo; só a edição liberada paga destrava
  const noPrazo = prazo > agora && s.estado !== 'edicao_travada';
  if (liberada && liberada > agora && (!noPrazo || liberada > prazo))
    return { momento: 'edicao-liberada', podePublicar: true, pago, editaAte: liberada, motivo: null };
  if (noPrazo) return { momento: 'no-prazo', podePublicar: true, pago, editaAte: prazo, motivo: null };
  return {
    momento: 'travada',
    podePublicar: false,
    pago,
    editaAte: null,
    motivo:
      'O prazo de edição acabou. Seu portfólio continua no ar como está e o que você muda aqui fica salvo. Para publicar mudanças, libere a edição.',
  };
}

/** Estado para mostrar: um portfólio no ar com o prazo vencido aparece como "Edição travada", sem sair do ar. */
export function estadoParaMostrar(estado: string, acesso: Acesso): string {
  if (estado === 'no_ar' && acesso.momento === 'travada') return 'edicao_travada';
  if (estado === 'edicao_travada' && acesso.momento !== 'travada') return 'no_ar';
  return estado;
}
