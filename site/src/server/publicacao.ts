// Publicação (DEV-141, 143, 160, 163): o que o servidor confere e grava quando a creator pede para publicar e quando o
// pedido é pago. A versão no ar (`publicado`) é uma cópia do rascunho tirada na hora de publicar: editar depois não
// muda o que está no ar até publicar de novo.
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { acessoDa, type PedidoParaAcesso } from '@lib/acesso';
import { analisarWhatsapp } from '@lib/formatos';
import { PLANOS, PLANOS_DE_EDICAO, type IdDoPlano } from '@lib/planos';
import { projetoSchema, type Projeto } from '@lib/projeto';
import { podePublicar, revisar } from '@lib/revisao';
import { problemaDoSlug } from '@lib/slug';
import { consulta } from './banco';

const DIAS_DE_EDICAO = 7;

const SEM_WHATSAPP = 'Informe o seu WhatsApp para a equipe mandar o link de pagamento. Escreva o número com DDD.';
const SEM_SERVIDOR = 'Não conseguimos falar com o servidor agora. Tente de novo em instantes.';

/** O WhatsApp do perfil é por onde a equipe manda o link de pagamento: sem um número válido o pedido não abre. `null`: banco fora. */
async function temWhatsappValido(donoId: string): Promise<boolean | null> {
  const r = await consulta<{ whatsapp: string }>(`profiles?id=eq.${donoId}&select=whatsapp`);
  if (!r.ok) return null;
  return analisarWhatsapp(r.dados[0]?.whatsapp ?? '').ok;
}

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
  menu: boolean;
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
    menu: l.menu,
    link: l.slug ?? l.link_desejado ?? undefined,
    numeros: l.numeros ?? undefined,
    blocos: l.blocos,
    guardados: l.guardados,
  });
  return lido.success ? lido.data : null;
};

export type ResultadoDaPublicacao =
  | { ok: true; estado: 'aguardando_pagamento' | 'no_ar'; slug: string; /** quando foi ao ar */ projetoId?: string }
  | { ok: false; status: number; erro: string };

const falha = (status: number, erro: string): ResultadoDaPublicacao => ({ ok: false, status, erro });

/** A creator pediu para publicar: confere tudo de novo (o navegador já conferiu, mas o servidor não confia nele). */
export async function pedirPublicacao(
  donoId: string,
  slug: string,
  plano: IdDoPlano = 'pdf',
): Promise<ResultadoDaPublicacao> {
  if (PLANOS[plano]?.tipo !== 'publicacao') return falha(422, 'Escolha um plano para publicar.');
  const erroDoLink = problemaDoSlug(slug);
  if (erroDoLink) return falha(422, erroDoLink);

  const { ok, dados } = await consulta<LinhaDoProjeto>(`projects?dono=eq.${donoId}&tipo=eq.site&select=*`);
  const linha = dados[0];
  if (!ok) return falha(503, 'Não conseguimos falar com o servidor agora. Tente de novo em instantes.');
  if (!linha) return falha(404, 'Não encontramos o seu portfólio. Abra o editor e tente de novo.');
  const acesso = await acessoDoProjeto(linha);
  if (!acesso.podePublicar) return falha(409, acesso.motivo ?? 'Não dá para publicar agora.');

  const projeto = projetoDaLinha(linha);
  if (!projeto) return falha(422, 'Seu portfólio tem algum dado fora do formato. Abra o editor e salve de novo.');
  const alertas = revisar(projeto, PROJETO_DE_EXEMPLO, REGISTRO);
  if (!podePublicar(alertas))
    return falha(422, 'Ainda há pontos em vermelho na revisão. Resolva todos antes de publicar.');

  // link livre? (o índice único do banco é a garantia final; aqui só dá a mensagem certa)
  const emUso = await consulta<{ id: string }>(`projects?slug=ilike.${encodeURIComponent(slug)}&select=id`);
  if (emUso.dados.some((p) => p.id !== linha.id))
    return falha(409, 'Esse link já é de outra pessoa. Escolha outro, por exemplo com seu @ ou sua cidade.');

  if (acesso.pago) return publicarAgora(linha, projeto, slug);

  // vai abrir um pedido: a equipe precisa do WhatsApp para mandar o link de pagamento (DEV-238)
  const comWhats = await temWhatsappValido(donoId);
  if (comWhats === null) return falha(503, SEM_SERVIDOR);
  if (!comWhats) return falha(422, SEM_WHATSAPP);

  // ainda sem pagamento: reserva o link e abre o pedido (uma vez só)
  const reservou = await consulta(`projects?id=eq.${linha.id}`, {
    metodo: 'PATCH',
    corpo: {
      slug,
      status: linha.status === 'rascunho' || linha.status === 'fora_do_ar' ? 'aguardando_pagamento' : linha.status,
    },
  });
  if (!reservou.ok) return falha(409, 'Esse link acabou de ser escolhido por outra pessoa. Escolha outro.');
  // um pedido de publicação aberto por vez; se ela trocou de plano, o pedido aberto muda junto
  const abertos = await consulta<{ id: string; plano: string }>(
    `orders?projeto_id=eq.${linha.id}&status=eq.aguardando_pagamento&plano=in.(pdf,site)&select=id,plano`,
  );
  const aberto = abertos.dados[0];
  if (!aberto) await consulta('orders', { metodo: 'POST', corpo: { projeto_id: linha.id, dono: donoId, plano } });
  else if (aberto.plano !== plano) await consulta(`orders?id=eq.${aberto.id}`, { metodo: 'PATCH', corpo: { plano } });
  await consulta('events', {
    metodo: 'POST',
    corpo: { dono: donoId, nome: 'pedido_criado', propriedades: { slug, plano } },
  });
  return { ok: true, estado: 'aguardando_pagamento', slug };
}

/** Regras de acesso (DEV-190) com os pedidos e o Premium do banco. O prazo de edição conta da primeira publicação. */
async function acessoDoProjeto(linha: LinhaDoProjeto) {
  const [pedidos, premium] = await Promise.all([
    consulta<{ plano: string; status: string; pago_em: string | null }>(
      `orders?projeto_id=eq.${linha.id}&select=plano,status,pago_em`,
    ),
    consulta<{ validade: string | null }>(
      `premium_grants?creator=eq.${linha.dono}&molde=in.(site,os-dois)&select=validade`,
    ),
  ]);
  const agora = new Date().toISOString();
  return acessoDa({
    logado: true,
    estado: linha.status,
    prazoEdicao: linha.prazo_edicao,
    pedidos: pedidos.dados.map((p): PedidoParaAcesso => ({ plano: p.plano, status: p.status, pagoEm: p.pago_em })),
    premium: premium.dados.some((g) => !g.validade || g.validade > agora),
  });
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
  return { ok: true, estado: 'no_ar', slug, projetoId: linha.id };
}

/** Botão Pago (DEV-163): marca o pedido, coloca o portfólio no ar e devolve o link. `null` se o link não existe. */
export async function marcarComoPago(
  slug: string,
): Promise<{ ok: boolean; erro?: string; slug?: string; projetoId?: string }> {
  const { dados } = await consulta<LinhaDoProjeto>(
    `projects?slug=ilike.${encodeURIComponent(slug)}&tipo=eq.site&select=*`,
  );
  const linha = dados[0];
  if (!linha) return { ok: false, erro: 'Nenhum portfólio com esse link.' };
  const projeto = projetoDaLinha(linha);
  if (!projeto) return { ok: false, erro: 'O conteúdo do portfólio está fora do formato.' };
  const pedido = await consulta<{ id: string }>(
    `orders?projeto_id=eq.${linha.id}&status=eq.aguardando_pagamento&plano=in.(pdf,site)&select=id&order=criado_em.desc&limit=1`,
  );
  if (pedido.dados[0])
    await consulta(`orders?id=eq.${pedido.dados[0].id}`, {
      metodo: 'PATCH',
      corpo: { status: 'pago', pago_em: new Date().toISOString() },
    });
  const r = await publicarAgora(linha, projeto, linha.slug ?? slug);
  return r.ok ? { ok: true, slug: r.slug, projetoId: r.projetoId } : { ok: false, erro: r.erro };
}

/** Admin marca um pedido como pago (DEV-163, 193): publicação põe no ar; edição só libera a edição pelo período do plano. */
export async function marcarPedidoPago(
  pedidoId: string,
): Promise<{ ok: boolean; erro?: string; tipo?: string; slug?: string; projetoId?: string }> {
  const { dados } = await consulta<{ id: string; plano: string; status: string; projeto_id: string }>(
    `orders?id=eq.${pedidoId}&select=id,plano,status,projeto_id`,
  );
  const pedido = dados[0];
  if (!pedido) return { ok: false, erro: 'Pedido não encontrado.' };
  if (pedido.status !== 'aguardando_pagamento')
    return { ok: false, erro: 'Esse pedido não está aguardando pagamento.' };
  const tipo = PLANOS[pedido.plano as IdDoPlano]?.tipo ?? 'publicacao';
  if (tipo === 'edicao') {
    const r = await consulta(`orders?id=eq.${pedido.id}&status=eq.aguardando_pagamento`, {
      metodo: 'PATCH',
      corpo: { status: 'pago', pago_em: new Date().toISOString() },
    });
    return r.ok ? { ok: true, tipo } : { ok: false, erro: 'Não deu para marcar agora.' };
  }
  const projeto = await consulta<{ slug: string | null }>(`projects?id=eq.${pedido.projeto_id}&select=slug`);
  const slug = projeto.dados[0]?.slug;
  if (!slug) return { ok: false, erro: 'O portfólio desse pedido ainda não tem link.' };
  const r = await marcarComoPago(slug);
  return r.ok ? { ok: true, tipo, slug: r.slug, projetoId: r.projetoId } : { ok: false, erro: r.erro };
}

/**
 * Admin marca um pedido pago como reembolsado (DEV-239, arrependimento de 7 dias; Termos, item 6). O pedido deixa de
 * contar como pago e, em qualquer desistência, o portfólio sai do ar. Nada é apagado: o rascunho fica na conta.
 * Pedido de publicação sem outro pedido de publicação pago: o prazo de edição também zera e a conta volta ao modo de
 * teste (sem isso ela seguiria "paga" pelo prazo e publicaria de graça, ver `acessoDa`); para voltar ao ar, novo pedido.
 * Pedido de edição: a edição liberada por ele deixa de valer; a publicação paga continua valendo. O valor é devolvido
 * fora do sistema.
 */
export async function reembolsarPedido(
  pedidoId: string,
): Promise<{ ok: boolean; erro?: string; tipo?: string; saiuDoAr?: boolean; modoDeTeste?: boolean }> {
  const lido = await consulta<{ id: string; plano: string; status: string; projeto_id: string | null }>(
    `orders?id=eq.${pedidoId}&select=id,plano,status,projeto_id`,
  );
  if (!lido.ok) return { ok: false, erro: 'Não deu para falar com o banco agora. Tente de novo.' };
  const pedido = lido.dados[0];
  if (!pedido) return { ok: false, erro: 'Pedido não encontrado.' };
  if (pedido.status !== 'pago') return { ok: false, erro: 'Só dá para reembolsar um pedido que está pago.' };

  const marcou = await consulta(`orders?id=eq.${pedido.id}&status=eq.pago`, {
    metodo: 'PATCH',
    corpo: { status: 'reembolsado' },
  });
  if (!marcou.ok) return { ok: false, erro: 'Não deu para marcar agora.' };

  const tipo = PLANOS[pedido.plano as IdDoPlano]?.tipo ?? 'publicacao';
  if (!pedido.projeto_id) return { ok: true, tipo, saiuDoAr: false, modoDeTeste: false };

  const semAviso =
    'O pedido foi marcado como reembolsado, mas não deu para tirar o portfólio do ar. Tire pela aba No ar.';
  let modoDeTeste = false;
  if (tipo === 'publicacao') {
    const restantes = await consulta<{ id: string }>(
      `orders?projeto_id=eq.${pedido.projeto_id}&status=eq.pago&plano=in.(pdf,site)&select=id&limit=1`,
    );
    if (!restantes.ok) return { ok: false, erro: semAviso };
    modoDeTeste = restantes.dados.length === 0;
  }
  const tirou = await consulta(`projects?id=eq.${pedido.projeto_id}`, {
    metodo: 'PATCH',
    corpo: modoDeTeste ? { status: 'fora_do_ar', prazo_edicao: null } : { status: 'fora_do_ar' },
  });
  if (!tirou.ok) return { ok: false, erro: semAviso };
  return { ok: true, tipo, saiuDoAr: true, modoDeTeste };
}

export type ResultadoDoPedidoDeEdicao = { ok: true; jaPedido: boolean } | { ok: false; status: number; erro: string };

/** A creator pede para liberar a edição (DEV-193): abre um pedido do plano escolhido, um aberto por plano. */
export async function pedirEdicao(donoId: string, plano: IdDoPlano): Promise<ResultadoDoPedidoDeEdicao> {
  // só os planos à venda (a "Edição por 30 dias" saiu em 31/out)
  if (!PLANOS_DE_EDICAO.some((p) => p.id === plano))
    return { ok: false, status: 422, erro: 'Escolha uma forma de liberar a edição.' };
  const { ok, dados } = await consulta<{ id: string; prazo_edicao: string | null }>(
    `projects?dono=eq.${donoId}&tipo=eq.site&select=id,prazo_edicao`,
  );
  if (!ok)
    return { ok: false, status: 503, erro: 'Não conseguimos falar com o servidor agora. Tente de novo em instantes.' };
  const linha = dados[0];
  if (!linha) return { ok: false, status: 404, erro: 'Não encontramos o seu portfólio.' };
  if (!linha.prazo_edicao)
    return {
      ok: false,
      status: 409,
      erro: 'Seu portfólio ainda não foi publicado: a edição está liberada até publicar.',
    };
  const aberto = await consulta<{ id: string }>(
    `orders?projeto_id=eq.${linha.id}&status=eq.aguardando_pagamento&plano=eq.${plano}&select=id`,
  );
  if (aberto.dados.length > 0) return { ok: true, jaPedido: true };
  const comWhats = await temWhatsappValido(donoId);
  if (comWhats === null) return { ok: false, status: 503, erro: SEM_SERVIDOR };
  if (!comWhats) return { ok: false, status: 422, erro: SEM_WHATSAPP };
  const criou = await consulta('orders', { metodo: 'POST', corpo: { projeto_id: linha.id, dono: donoId, plano } });
  if (!criou.ok)
    return { ok: false, status: 502, erro: 'Não conseguimos enviar o pedido agora. Tente de novo em instantes.' };
  await consulta('events', { metodo: 'POST', corpo: { dono: donoId, nome: 'pedido_criado', propriedades: { plano } } });
  return { ok: true, jaPedido: false };
}
