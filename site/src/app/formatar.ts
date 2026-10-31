// Textos de tamanho e data para a interface.
export function textoDeTamanho(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const espacoUsado = (itens: Array<{ bytes: number }>) => itens.reduce((total, i) => total + i.bytes, 0);

export const dataCurta = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
