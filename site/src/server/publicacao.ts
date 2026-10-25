// Publicação (DEV-141, 143, 160, 163): o que o servidor confere e grava quando a creator pede para publicar e quando o
// pedido é pago. A versão no ar (`publicado`) é uma cópia do rascunho tirada na hora de publicar: editar depois não
// muda o que está no ar até publicar de novo.
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { projetoSchema, type Projeto } from '@lib/projeto';
import { podePublicar, revisar } from '@lib/revisao';
import { problemaDoSlug } from '@lib/slug';
import { consulta } from './banco';

const DIAS_DE_EDICAO = 7;

interface LinhaDoProjeto {
  id: string;
  dono: string;
  tipo: string;
  modelo: string;
  paleta: number;
  cor_propria: string | null;
  fontes: string;
  cantos: string;
  clima: string;
  modo_iniciante: boolean;
  blocos: unknown;
  guardados: unknown;
  numeros: unknown;
  link_desejado: string | null;
  status: string;
  slug: string | null;
  prazo_edicao: string | null;
}

export const projetoDaLinha = (l: Pick<LinhaDoProjeto, keyof LinhaDoProjeto>): Projeto | null => {
  const lido = projetoSchema.safeParse({
    tipo: l.tipo,
    modelo: l.modelo,
    paleta: l.paleta,
    corPropria: l.cor_propria ?? undefined,
    fontes: l.fontes,
    cantos: l.cantos,
    clima: l.clima,
    modoIniciante: l.modo_iniciante,
    link: l.slug ?? l.link_desejado ?? undefined,
    numeros: l.numeros ?? undefined,
    blocos: l.blocos,
    guardados: l.guardados,
  });
  return lido.success ? lido.data : null;
};

export type ResultadoDaPublicacao =
  { ok: true; estado: 'aguardando_pagamento' | 'no_ar'; slug: string } | { ok: false; status: number; erro: string };

const falha = (status: number, erro: string): ResultadoDaPublicacao => ({ ok: false, status, erro });

/** A creator pediu para publicar: confere tudo de novo (o navegador já conferiu, mas o servidor não confia nele). */
export async function pedirPublicacao(donoId: string, slug: string): Promise<ResultadoDaPublicacao> {
  const erroDoLink = problemaDoSlug(slug);
  if (erroDoLink) return falha(422, erroDoLink);

  const { ok, dados } = await consulta<LinhaDoProjeto>(`projects?dono=eq.${donoId}&tipo=eq.site&select=*`);
  const linha = dados[0];
  if (!ok) return falha(503, 'Não conseguimos falar com o servidor agora. Tente de novo em instantes.');
  if (!linha) return falha(404, 'Não encontramos o seu portfólio. Abra o editor e tente de novo.');
  if (linha.status === 'edicao_travada')
    return falha(409, 'O prazo de edição acabou. Fale com a gente para liberar uma nova edição.');

  const projeto = projetoDaLinha(linha);
  if (!projeto) return falha(422, 'Seu portfólio tem algum dado fora do formato. Abra o editor e salve de novo.');
  const alertas = revisar(projeto, PROJETO_DE_EXEMPLO, REGISTRO);
  if (!podePublicar(alertas))
    return falha(422, 'Ainda há pontos em vermelho na revisão. Resolva todos antes de publicar.');

  // link livre? (o índice único do banco é a garantia final; aqui só dá a mensagem certa)
  const emUso = await consulta<{ id: string }>(`projects?slug=ilike.${encodeURIComponent(slug)}&select=id`);
  if (emUso.dados.some((p) => p.id !== linha.id))
    return falha(409, 'Esse link já é de outra pessoa. Escolha outro, por exemplo com seu @ ou sua cidade.');

  const pago = await temPagamento(linha.id, donoId);
  if (pago) return publicarAgora(linha, projeto, slug);

  // ainda sem pagamento: reserva o link e abre o pedido (uma vez só)
  const reservou = await consulta(`projects?id=eq.${linha.id}`, {
    metodo: 'PATCH',
    corpo: {
      slug,
      status: linha.status === 'rascunho' || linha.status === 'fora_do_ar' ? 'aguardando_pagamento' : linha.status,
    },
  });
  if (!reservou.ok) return falha(409, 'Esse link acabou de ser escolhido por outra pessoa. Escolha outro.');
  const pedidos = await consulta<{ id: string }>(
    `orders?projeto_id=eq.${linha.id}&status=eq.aguardando_pagamento&select=id`,
  );
  if (pedidos.dados.length === 0)
    await consulta('orders', { metodo: 'POST', corpo: { projeto_id: linha.id, dono: donoId, plano: 'site' } });
  await consulta('events', {
    metodo: 'POST',
    corpo: { dono: donoId, nome: 'pedido_criado', propriedades: { slug } },
  });
  return { ok: true, estado: 'aguardando_pagamento', slug };
}

/** Pedido pago (ou Premium liberado) = pode ir ao ar. Prazo de edição conta a partir da primeira publicação. */
async function temPagamento(projetoId: string, donoId: string): Promise<boolean> {
  const pagos = await consulta(`orders?projeto_id=eq.${projetoId}&status=eq.pago&select=id&limit=1`);
  if (pagos.dados.length > 0) return true;
  const agora = new Date().toISOString();
  const premium = await consulta<{ validade: string | null; molde: string }>(
    `premium_grants?creator=eq.${donoId}&molde=in.(site,os-dois)&select=validade,molde`,
  );
  return premium.dados.some((g) => !g.validade || g.validade > agora);
}

async function publicarAgora(linha: LinhaDoProjeto, projeto: Projeto, slug: string): Promise<ResultadoDaPublicacao> {
  const agora = new Date();
  const prazo = linha.prazo_edicao ?? new Date(agora.getTime() + DIAS_DE_EDICAO * 24 * 60 * 60 * 1000).toISOString();
  const gravou = await consulta(`projects?id=eq.${linha.id}`, {
    metodo: 'PATCH',
    corpo: {
      slug,
      status: 'no_ar',
      publicado: { ...projeto, link: slug },
      publicado_em: agora.toISOString(),
      prazo_edicao: prazo,
    },
  });
  if (!gravou.ok) return falha(409, 'Não conseguimos colocar no ar agora. Tente de novo em instantes.');
  await consulta('events', {
    metodo: 'POST',
    corpo: { dono: linha.dono, nome: 'publicado', propriedades: { slug } },
  });
  return { ok: true, estado: 'no_ar', slug };
}

/** Botão Pago (DEV-163): marca o pedido, coloca o portfólio no ar e devolve o link. `null` se o link não existe. */
export async function marcarComoPago(slug: string): Promise<{ ok: boolean; erro?: string; slug?: string }> {
  const { dados } = await consulta<LinhaDoProjeto>(
    `projects?slug=ilike.${encodeURIComponent(slug)}&tipo=eq.site&select=*`,
  );
  const linha = dados[0];
  if (!linha) return { ok: false, erro: 'Nenhum portfólio com esse link.' };
  const projeto = projetoDaLinha(linha);
  if (!projeto) return { ok: false, erro: 'O conteúdo do portfólio está fora do formato.' };
  const pedido = await consulta<{ id: string }>(
    `orders?projeto_id=eq.${linha.id}&status=eq.aguardando_pagamento&select=id&order=criado_em.desc&limit=1`,
  );
  if (pedido.dados[0])
    await consulta(`orders?id=eq.${pedido.dados[0].id}`, {
      metodo: 'PATCH',
      corpo: { status: 'pago', pago_em: new Date().toISOString() },
    });
  const r = await publicarAgora(linha, projeto, linha.slug ?? slug);
  return r.ok ? { ok: true, slug: r.slug } : { ok: false, erro: r.erro };
}
