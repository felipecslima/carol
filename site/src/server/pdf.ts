// PDF do mídia kit gerado no servidor (DEV-151, 153): o navegador da Cloudflare (Browser Run, binding BROWSER) abre
// /c/<link>/midia-kit, espera a página avisar que está pronta (window.renderState) e imprime em A4. Como no
// document-renderer, o navegador não fala direto com o site: abre um endereço interno e cada pedido para ele é
// respondido por este Worker, que busca no próprio site (funciona em localhost sem expor nada e em produção igual). O arquivo fica no
// Supabase Storage (bucket privado `midia-kits`, `<id do projeto>.pdf`). No plano grátis da Cloudflare são 10 min de
// navegador por dia: passou disso, o PDF não sai e a creator continua com "Salvar como PDF" pelo próprio navegador.
import puppeteer from '@cloudflare/puppeteer';
import { env } from 'cloudflare:workers';
import { guardarArquivo, linkAssinado } from './banco';

export const BALDE_DOS_KITS = 'midia-kits';
const caminhoDoKit = (projetoId: string) => `${projetoId}.pdf`;
/** endereço que o navegador da Cloudflare abre; nunca sai para a rede (ver `setRequestInterception` abaixo) */
const INTERNO = 'https://kit.interno';

export type ResultadoDoPdf =
  | { ok: true; bytes: number; ms: number; etapas?: Record<string, number> }
  | { ok: false; motivo: 'sem-navegador' | 'limite' | 'pagina' | 'guardar'; mensagem: string };

/** Gera o PDF da versão publicada e guarda. `origem`: endereço do próprio site, de onde o Worker busca a página. */
export async function gerarPdfDoKit(origem: string, slug: string, projetoId: string): Promise<ResultadoDoPdf> {
  const navegador = (env as { BROWSER?: Parameters<typeof puppeteer.launch>[0] }).BROWSER;
  if (!navegador)
    return { ok: false, motivo: 'sem-navegador', mensagem: 'Browser Run não configurado (binding BROWSER).' };
  const inicio = Date.now();
  // tempo de cada etapa, para o log (o plano grátis mede o tempo de navegador aberto)
  const etapas = { abrir: 0, carregar: 0, pronto: 0, imprimir: 0, guardar: 0, pedidos: 0 };
  let marca = inicio;
  const anotar = (k: keyof typeof etapas) => {
    etapas[k] = Date.now() - marca;
    marca = Date.now();
  };
  let browser: Awaited<ReturnType<typeof puppeteer.launch>>;
  try {
    browser = await puppeteer.launch(navegador);
    anotar('abrir');
  } catch (e) {
    const texto = String((e as Error)?.message ?? e);
    return { ok: false, motivo: /429|limit/i.test(texto) ? 'limite' : 'sem-navegador', mensagem: texto.slice(0, 300) };
  }
  try {
    const pagina = await browser.newPage();
    await pagina.setViewport({ width: 794, height: 1123 });
    // sem as entradas animadas: a folha já sai no estado final
    await pagina.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    // pedidos ao endereço interno: o Worker busca no site e responde; o resto (imagens do Cloudinary) segue normal
    await pagina.setRequestInterception(true);
    pagina.on('request', (pedido) => {
      const url = pedido.url();
      etapas.pedidos++;
      if (!url.startsWith(INTERNO)) return void pedido.continue();
      void fetch(origem + url.slice(INTERNO.length), { headers: { Accept: pedido.headers().accept ?? '*/*' } })
        .then(async (r) =>
          pedido.respond({
            status: r.status,
            contentType: r.headers.get('content-type') ?? undefined,
            body: new Uint8Array(await r.arrayBuffer()) as unknown as string,
          }),
        )
        .catch(() => pedido.abort());
    });
    const resposta = await pagina.goto(`${INTERNO}/c/${slug}/midia-kit/`, {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    });
    anotar('carregar');
    if (!resposta?.ok())
      return { ok: false, motivo: 'pagina', mensagem: `A página do kit respondeu ${resposta?.status()}` };
    await pagina.waitForFunction("window.renderState === 'ready' || window.renderState === 'error'", {
      timeout: 20000,
    });
    const pdf = await pagina.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    anotar('imprimir');
    const corpo = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;
    if (!(await guardarArquivo(BALDE_DOS_KITS, caminhoDoKit(projetoId), corpo, 'application/pdf')))
      return { ok: false, motivo: 'guardar', mensagem: 'O Storage recusou o arquivo.' };
    anotar('guardar');
    return { ok: true, bytes: pdf.byteLength, ms: Date.now() - inicio, etapas };
  } catch (e) {
    return { ok: false, motivo: 'pagina', mensagem: String((e as Error)?.message ?? e).slice(0, 300) };
  } finally {
    await browser.close().catch(() => undefined);
  }
}

/** Link de 1 hora para baixar o PDF guardado; `null` se ainda não foi gerado. */
export const linkDoKit = (projetoId: string) => linkAssinado(BALDE_DOS_KITS, caminhoDoKit(projetoId), 3600);

/** `waitUntil` do pedido (o adaptador do Cloudflare põe em `locals.cfContext`), para terminar depois da resposta. */
export const contextoDe = (locals: unknown) =>
  (locals as { cfContext?: { waitUntil?: (p: Promise<unknown>) => void } } | undefined)?.cfContext;

/** Endereço do próprio site, de onde o Worker busca a página do kit. */
export const origemDoSite = (pedido: Request) => new URL(pedido.url).origin;

/**
 * Depois de publicar (DEV-153): gera o PDF novo em segundo plano, sem atrasar a resposta. Falha não desfaz a
 * publicação; fica no log e a creator gera de novo pela área.
 */
export function regerarKitDepois(
  contexto: { waitUntil?: (p: Promise<unknown>) => void } | undefined,
  origem: string,
  slug: string,
  projetoId: string,
) {
  const tarefa = gerarPdfDoKit(origem, slug, projetoId).then((r) =>
    console.log(JSON.stringify({ tipo: 'pdf-do-kit', slug, ...r })),
  );
  if (contexto?.waitUntil) contexto.waitUntil(tarefa);
  else void tarefa;
}
