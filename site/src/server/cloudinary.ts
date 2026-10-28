// Assinatura de upload do Cloudinary (DEV-110): o servidor assina os parâmetros com o segredo e o celular envia o
// arquivo direto ao Cloudinary, sem passar pelo Worker. O segredo (CLOUDINARY_URL) nunca vai ao navegador.

export interface ContaCloudinary {
  nome: string;
  chave: string;
  segredo: string;
}

/** `cloudinary://CHAVE:SEGREDO@NOME` → partes; `undefined` se a variável faltar ou estiver malformada. */
export function lerConta(url: string | undefined): ContaCloudinary | undefined {
  const m = url?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  return m ? { chave: m[1]!, segredo: m[2]!, nome: m[3]! } : undefined;
}

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

/** Assinatura SHA-1 do Cloudinary: parâmetros em ordem alfabética (`k=v&k=v`) + segredo. */
export async function assinar(params: Record<string, string | number>, segredo: string): Promise<string> {
  const texto = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return hex(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(texto + segredo)));
}

export const FORMATOS = {
  image: 'jpg,jpeg,png,webp,heic,heif',
  video: 'mp4,mov,m4v,webm',
} as const;
export type TipoDeArquivo = keyof typeof FORMATOS;

/** Pasta de cada creator: o id do usuário no Supabase (só o servidor decide, nunca o corpo do pedido). */
export const pastaDoUsuario = (idDoUsuario: string) => `creators/${idDoUsuario}`;

/** O arquivo é da pasta do usuário? (impede apagar arquivo de outra creator) */
export const arquivoDoUsuario = (publicId: string, idDoUsuario: string) =>
  publicId.startsWith(`${pastaDoUsuario(idDoUsuario)}/`) && !publicId.includes('..');

/** Apaga um arquivo do Cloudinary (destroy assinado). `true` se apagou ou já não existia. */
export async function apagarArquivo(conta: ContaCloudinary, publicId: string, tipo: TipoDeArquivo): Promise<boolean> {
  const params = { public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const corpo = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    api_key: conta.chave,
    signature: await assinar(params, conta.segredo),
  });
  const resposta = await fetch(`https://api.cloudinary.com/v1_1/${conta.nome}/${tipo}/destroy`, {
    method: 'POST',
    body: corpo,
  });
  const dados = (await resposta.json().catch(() => ({}))) as { result?: string };
  return resposta.ok && (dados.result === 'ok' || dados.result === 'not found');
}

/**
 * Apaga todos os arquivos (imagens e vídeos) da pasta de uma creator e a pasta (DEV-203). Usa a Admin API, que apaga
 * até 1000 por chamada (`partial` = ainda tem). `false` se alguma chamada falhou; a pasta vazia que não sair não conta.
 */
export async function apagarPastaDoUsuario(conta: ContaCloudinary, idDoUsuario: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/.test(idDoUsuario)) return false;
  const pasta = pastaDoUsuario(idDoUsuario);
  const autorizacao = `Basic ${btoa(`${conta.chave}:${conta.segredo}`)}`;
  const api = `https://api.cloudinary.com/v1_1/${conta.nome}`;
  for (const tipo of ['image', 'video'] as const) {
    for (let rodada = 0; rodada < 20; rodada++) {
      const resposta = await fetch(`${api}/resources/${tipo}/upload?prefix=${encodeURIComponent(`${pasta}/`)}`, {
        method: 'DELETE',
        headers: { Authorization: autorizacao },
      });
      if (!resposta.ok) return false;
      const dados = (await resposta.json().catch(() => ({}))) as { partial?: boolean };
      if (!dados.partial) break;
      if (rodada === 19) return false;
    }
  }
  await fetch(`${api}/folders/${pasta}`, { method: 'DELETE', headers: { Authorization: autorizacao } }).catch(
    () => undefined,
  );
  return true;
}
