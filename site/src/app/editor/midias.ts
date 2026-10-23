// Biblioteca de mídias da creator (DEV-116). Por enquanto vive no aparelho (localStorage); com a conta passa para a
// tabela `media` do Supabase (E2). Tirar uma mídia daqui só a esconde da biblioteca: apagar do Cloudinary exige
// servidor e login, e fica para depois.
import type { Enviado, TipoDeArquivo } from './upload';

export interface Midia extends Enviado {
  id: string;
  tipo: TipoDeArquivo;
  nome: string;
  bytes: number;
  data: string;
}

const CHAVE = 'pc:midias:v1';

export function listarMidias(): Midia[] {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? '[]') as Midia[];
    return Array.isArray(bruto) ? bruto : [];
  } catch {
    return [];
  }
}

function gravar(midias: Midia[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(midias));
  } catch {
    /* sem espaço no aparelho: a mídia continua no Cloudinary, só não entra na lista */
  }
}

export function registrarMidia(item: Omit<Midia, 'id' | 'data'>): Midia {
  const midia = { ...item, id: crypto.randomUUID(), data: new Date().toISOString() };
  gravar([midia, ...listarMidias().filter((m) => m.url !== item.url)]);
  return midia;
}

export function removerMidia(id: string) {
  gravar(listarMidias().filter((m) => m.id !== id));
}

export const espacoUsado = (midias: Midia[]) => midias.reduce((total, m) => total + m.bytes, 0);

export function textoDeTamanho(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
