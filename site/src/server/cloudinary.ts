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
