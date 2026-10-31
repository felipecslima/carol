// Ações da equipe no Admin (DEV-211, 210, 163). Cada uma confere o papel no servidor e entra no registro de ações.
import type { APIRoute } from 'astro';
import { consulta } from '@server/banco';
import { equipeDoPedido } from '@server/equipe';
import { paginaNoAr } from '@server/pagina';
import { contextoDe, gerarPdfDoKit, linkDoKit, origemDoSite, regerarKitDepois } from '@server/pdf';
import { marcarComoPago, marcarPedidoPago } from '@server/publicacao';

export const prerender = false;

type Corpo = {
  acao?: string;
  slug?: string;
  pedido?: string;
  creator?: string;
  molde?: string;
  motivo?: string;
  id?: string;
};
const MOLDES = ['site', 'midia-kit', 'os-dois'];
const SLUG = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

export const POST: APIRoute = async ({ request, locals }) => {
  const quem = await equipeDoPedido(request);
  if (!quem) return Response.json({ erro: 'Entre com uma conta da equipe.' }, { status: 401 });
  if (quem.papel === 'assistente')
    return Response.json({ erro: 'Seu papel só permite ver, não alterar.' }, { status: 403 });

  const c = (await request.json().catch(() => null)) as Corpo | null;
  const registrar = (acao: string, alvo: string, detalhes: object = {}) =>
    consulta('audit_log', { metodo: 'POST', corpo: { ator: quem.id, acao, alvo, detalhes } });
  const erro = (m: string, status = 400) => Response.json({ erro: m }, { status });
  const slugOk = c?.slug && SLUG.test(c.slug) ? c.slug : null;

  switch (c?.acao) {
    case 'pago': {
      // por pedido (publicação ou edição); por link fica para o card do Slack e chamadas antigas
      if (c.pedido) {
        if (!/^[0-9a-f-]{36}$/.test(c.pedido)) return erro('Pedido inválido.');
        const r = await marcarPedidoPago(c.pedido);
        if (!r.ok) return erro(r.erro ?? 'Não deu para marcar como pago.', 404);
        if (r.slug && r.projetoId) regerarKitDepois(contextoDe(locals), origemDoSite(request), r.slug, r.projetoId);
        await registrar('pedido_pago', c.pedido, { tipo: r.tipo });
        return Response.json({ ok: true, tipo: r.tipo });
      }
      if (!slugOk) return erro('Link inválido.');
      const r = await marcarComoPago(slugOk);
      if (!r.ok) return erro(r.erro ?? 'Não deu para marcar como pago.', 404);
      if (r.slug && r.projetoId) regerarKitDepois(contextoDe(locals), origemDoSite(request), r.slug, r.projetoId);
      await registrar('pedido_pago', slugOk);
      return Response.json({ ok: true });
    }
    case 'gerar_pdf': {
      // suporte (DEV-151): gera de novo o PDF do mídia kit de um portfólio no ar e devolve o link de 1 hora
      if (!slugOk) return erro('Link inválido.');
      const pagina = await paginaNoAr(slugOk);
      if (!pagina) return erro('Nenhum portfólio no ar com esse link.', 404);
      const r = await gerarPdfDoKit(origemDoSite(request), pagina.slug, pagina.projetoId);
      if (!r.ok) return erro(`Não deu para gerar o PDF: ${r.mensagem}`, r.motivo === 'limite' ? 429 : 502);
      await registrar('pdf_gerado', slugOk, { bytes: r.bytes, ms: r.ms });
      return Response.json({
        ok: true,
        bytes: r.bytes,
        ms: r.ms,
        etapas: r.etapas,
        link: await linkDoKit(pagina.projetoId),
      });
    }
    case 'cancelar_pedido': {
      if (!c.pedido || !/^[0-9a-f-]{36}$/.test(c.pedido)) return erro('Pedido inválido.');
      const r = await consulta(`orders?id=eq.${c.pedido}&status=eq.aguardando_pagamento`, {
        metodo: 'PATCH',
        corpo: { status: 'cancelado' },
      });
      if (!r.ok) return erro('Não deu para cancelar agora.', 502);
      await registrar('pedido_cancelado', c.pedido);
      return Response.json({ ok: true });
    }
    case 'tirar_do_ar':
    case 'recolocar_no_ar': {
      if (!slugOk) return erro('Link inválido.');
      const ar = c.acao === 'tirar_do_ar';
      const r = await consulta(`projects?slug=eq.${slugOk}&status=eq.${ar ? 'no_ar' : 'fora_do_ar'}`, {
        metodo: 'PATCH',
        corpo: { status: ar ? 'fora_do_ar' : 'no_ar' },
      });
      if (!r.ok) return erro('Não deu para mudar agora.', 502);
      await registrar(c.acao, slugOk);
      return Response.json({ ok: true });
    }
    case 'premium_dar': {
      if (!c.creator || !/^[0-9a-f-]{36}$/.test(c.creator) || !c.molde || !MOLDES.includes(c.molde))
        return erro('Escolha a conta e o molde.');
      const r = await consulta('premium_grants', {
        metodo: 'POST',
        corpo: { creator: c.creator, molde: c.molde, motivo: (c.motivo ?? '').slice(0, 200), liberado_por: quem.id },
      });
      if (!r.ok) return erro('Não deu para liberar agora.', 502);
      await registrar('premium_liberado', c.creator, { molde: c.molde });
      return Response.json({ ok: true });
    }
    case 'premium_tirar': {
      if (!c.id || !/^[0-9a-f-]{36}$/.test(c.id)) return erro('Premium inválido.');
      const r = await consulta(`premium_grants?id=eq.${c.id}`, { metodo: 'DELETE' });
      if (!r.ok) return erro('Não deu para tirar agora.', 502);
      await registrar('premium_removido', c.id);
      return Response.json({ ok: true });
    }
    default:
      return erro('Ação desconhecida.');
  }
};
