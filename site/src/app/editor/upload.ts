// Envio de foto e vídeo do celular direto ao Cloudinary, com progresso. Exige login: o servidor assina o pedido e
// decide a pasta (a da própria creator).
import { supabase } from '../supabase';
export type TipoDeArquivo = 'image' | 'video';

export interface Enviado {
  /** identificador no Cloudinary (para apagar depois) */
  publicId: string;
  /** endereço para exibir (imagem otimizada ou vídeo leve) */
  url: string;
  /** capa: a própria imagem, ou o primeiro quadro do vídeo */
  capa: string;
}

// Limites do plano do Cloudinary (foto 10 MB, vídeo 100 MB no plano grátis). A foto é reduzida aqui, no aparelho,
// antes de subir; o vídeo não dá para reduzir no celular, então só confere o tamanho. Nada vai ao servidor para falhar
// lá: tudo o que dá para saber antes é conferido antes.
export const LIMITES = { image: 10 * 1024 * 1024, video: 100 * 1024 * 1024 } as const;
/** acima disto nem tentamos reduzir a foto (o aparelho pode ficar sem memória) */
const FOTO_MAXIMA_PARA_REDUZIR = 60 * 1024 * 1024;
/** foto até este tamanho, em formato de web, sobe como está */
const FOTO_LEVE = 4 * 1024 * 1024;
const LADO_MAXIMO = 2400;
const mb = (n: number) => (n / 1024 / 1024).toFixed(n < 10 * 1024 * 1024 ? 1 : 0).replace('.', ',');

/** Erro com texto já em português, pronto para mostrar. Qualquer outro erro vira a mensagem genérica. */
export class ErroDeEnvio extends Error {}
export const mensagemDeErro = (e: unknown) =>
  e instanceof ErroDeEnvio ? e.message : 'O envio falhou. Tente de novo em instantes.';

export function tipoDoArquivo(arquivo: File): TipoDeArquivo | null {
  if (arquivo.type.startsWith('image/') || /\.(heic|heif)$/i.test(arquivo.name)) return 'image';
  if (arquivo.type.startsWith('video/') || /\.(mov|mp4|m4v|webm)$/i.test(arquivo.name)) return 'video';
  return null;
}

/** Mensagem clara se o arquivo não serve; `null` se pode enviar. */
export function problemaDoArquivo(arquivo: File, esperado: TipoDeArquivo): string | null {
  const tipo = tipoDoArquivo(arquivo);
  if (tipo !== esperado)
    return esperado === 'image' ? 'Escolha uma foto (JPG, PNG, WebP ou HEIC).' : 'Escolha um vídeo (MP4 ou MOV).';
  if (arquivo.size === 0) return 'Esse arquivo está vazio. Escolha outro.';
  if (esperado === 'video' && arquivo.size > LIMITES.video)
    return `Esse vídeo tem ${mb(arquivo.size)} MB e o máximo é ${mb(LIMITES.video)} MB. Corte um trecho ou grave em resolução menor e tente de novo.`;
  if (esperado === 'image' && arquivo.size > FOTO_MAXIMA_PARA_REDUZIR)
    return `Essa foto tem ${mb(arquivo.size)} MB, grande demais até para reduzir. Escolha outra.`;
  return null;
}

/** Foto grande ou fora do padrão da web: reduz no aparelho (lado maior 2400 px, JPG ou WebP). `null` se não deu. */
async function reduzirFoto(arquivo: File): Promise<File | null> {
  try {
    const imagem = await createImageBitmap(arquivo);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(imagem.width, imagem.height));
    const tela = document.createElement('canvas');
    tela.width = Math.max(1, Math.round(imagem.width * escala));
    tela.height = Math.max(1, Math.round(imagem.height * escala));
    tela.getContext('2d')?.drawImage(imagem, 0, 0, tela.width, tela.height);
    imagem.close();
    const comTransparencia = arquivo.type === 'image/png' || arquivo.type === 'image/webp';
    const tipo = comTransparencia ? 'image/webp' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((r) => tela.toBlob(r, tipo, 0.86));
    if (!blob || blob.type !== tipo) return null;
    return new File([blob], arquivo.name.replace(/\.\w+$/, '') + (comTransparencia ? '.webp' : '.jpg'), { type: tipo });
  } catch {
    return null;
  }
}

/** Deixa o arquivo pronto para subir dentro dos limites; explica em português quando não dá. */
export async function prepararArquivo(arquivo: File, tipo: TipoDeArquivo): Promise<File> {
  const problema = problemaDoArquivo(arquivo, tipo);
  if (problema) throw new ErroDeEnvio(problema);
  if (tipo === 'video') return arquivo;
  const jaServe = /^image\/(jpeg|png|webp)$/.test(arquivo.type) && arquivo.size <= FOTO_LEVE;
  if (jaServe) return arquivo;
  const reduzida = await reduzirFoto(arquivo);
  const pronta = reduzida && reduzida.size < arquivo.size ? reduzida : arquivo;
  if (pronta.size > LIMITES.image)
    throw new ErroDeEnvio(
      `Essa foto tem ${mb(arquivo.size)} MB e o máximo é ${mb(LIMITES.image)} MB. Não conseguimos reduzir no seu aparelho: salve como JPG ou escolha outra.`,
    );
  return pronta;
}

/** Texto do Cloudinary (em inglês) vira mensagem em português; o que não conhecemos vira a genérica. */
function traduzirRespostaDoServico(texto?: string): string {
  const m = texto ?? '';
  if (/file size too large/i.test(m)) return 'O arquivo passou do tamanho permitido. Escolha um menor.';
  if (/invalid (image|video) file|corrupt|unsupported|not a valid/i.test(m))
    return 'Não conseguimos ler esse arquivo. Tente outro, em JPG, PNG, MP4 ou MOV.';
  if (/format|not allowed/i.test(m)) return 'Esse formato não é aceito. Use JPG, PNG, WebP, HEIC, MP4 ou MOV.';
  if (/signature|timestamp|stale|api[_ ]key/i.test(m)) return 'O envio expirou. Tente de novo.';
  return 'O envio falhou. Tente de novo em instantes.';
}

/** Endereços de entrega: imagem em até 1200 px e formato/qualidade automáticos; vídeo leve; capa = quadro 0 do vídeo. */
export function enderecos(nome: string, tipo: TipoDeArquivo, publicId: string): Enviado {
  const base = `https://res.cloudinary.com/${nome}`;
  if (tipo === 'image') {
    const url = `${base}/image/upload/f_auto,q_auto,w_1200/${publicId}`;
    return { publicId, url, capa: url };
  }
  return {
    publicId,
    url: `${base}/video/upload/f_mp4,q_auto,w_720/${publicId}.mp4`,
    capa: `${base}/video/upload/so_0,f_jpg,q_auto,w_540/${publicId}.jpg`,
  };
}

export async function enviarArquivo(
  original: File,
  tipo: TipoDeArquivo,
  aoProgredir: (fracao: number) => void,
): Promise<Enviado> {
  const arquivo = await prepararArquivo(original, tipo);
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new ErroDeEnvio('Entre na sua conta para enviar fotos e vídeos.');
  const resposta = await fetch('/api/upload/assinatura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tipo }),
  }).catch(() => {
    throw new ErroDeEnvio('Sem conexão. Verifique a internet e tente de novo.');
  });
  const dados = (await resposta.json().catch(() => ({}))) as {
    erro?: string;
    nome: string;
    chave: string;
    params: Record<string, string | number>;
    assinatura: string;
  };
  if (!resposta.ok) throw new ErroDeEnvio(dados.erro ?? 'Não deu para preparar o envio. Tente de novo.');

  const form = new FormData();
  form.append('file', arquivo);
  form.append('api_key', dados.chave);
  form.append('signature', dados.assinatura);
  for (const [k, v] of Object.entries(dados.params)) form.append(k, String(v));

  return new Promise((resolver, rejeitar) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${dados.nome}/${tipo}/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && aoProgredir(e.loaded / e.total);
    xhr.onerror = () => rejeitar(new ErroDeEnvio('Sem conexão. Verifique a internet e tente de novo.'));
    xhr.ontimeout = () => rejeitar(new ErroDeEnvio('O envio demorou demais. Verifique a internet e tente de novo.'));
    xhr.onload = () => {
      try {
        const r = JSON.parse(xhr.responseText) as { public_id?: string; error?: { message: string } };
        if (xhr.status >= 200 && xhr.status < 300 && r.public_id) resolver(enderecos(dados.nome, tipo, r.public_id));
        else rejeitar(new ErroDeEnvio(traduzirRespostaDoServico(r.error?.message)));
      } catch {
        rejeitar(new ErroDeEnvio('O envio falhou. Tente de novo.'));
      }
    };
    xhr.send(form);
  });
}
