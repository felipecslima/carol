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

// limites de partida (DEV-114 define os definitivos)
export const LIMITES = { image: 15 * 1024 * 1024, video: 200 * 1024 * 1024 } as const;
const mb = (n: number) => Math.round(n / 1024 / 1024);

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
  if (arquivo.size > LIMITES[esperado])
    return `O arquivo tem ${mb(arquivo.size)} MB; o máximo é ${mb(LIMITES[esperado])} MB.`;
  return null;
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
  arquivo: File,
  tipo: TipoDeArquivo,
  aoProgredir: (fracao: number) => void,
): Promise<Enviado> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Entre na sua conta para enviar fotos e vídeos.');
  const resposta = await fetch('/api/upload/assinatura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tipo }),
  });
  const dados = (await resposta.json()) as {
    erro?: string;
    nome: string;
    chave: string;
    params: Record<string, string | number>;
    assinatura: string;
  };
  if (!resposta.ok) throw new Error(dados.erro ?? 'Não deu para preparar o envio. Tente de novo.');

  const form = new FormData();
  form.append('file', arquivo);
  form.append('api_key', dados.chave);
  form.append('signature', dados.assinatura);
  for (const [k, v] of Object.entries(dados.params)) form.append(k, String(v));

  return new Promise((resolver, rejeitar) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${dados.nome}/${tipo}/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && aoProgredir(e.loaded / e.total);
    xhr.onerror = () => rejeitar(new Error('Sem conexão. Verifique a internet e tente de novo.'));
    xhr.onload = () => {
      try {
        const r = JSON.parse(xhr.responseText) as { public_id?: string; error?: { message: string } };
        if (xhr.status >= 200 && xhr.status < 300 && r.public_id) resolver(enderecos(dados.nome, tipo, r.public_id));
        else rejeitar(new Error(r.error?.message ?? 'O envio falhou. Tente de novo.'));
      } catch {
        rejeitar(new Error('O envio falhou. Tente de novo.'));
      }
    };
    xhr.send(form);
  });
}
