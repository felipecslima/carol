import type { Caixa } from './tipos';

/** minúsculas e sem acentos (mantém o comprimento: os índices continuam valendo no texto original) */
export function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** forma compacta para comparar rótulos: sem acento, caixa, espaço ou pontuação */
export function compacto(s: string): string {
  return normalizar(s).replace(/[^a-z0-9%@+]/g, '');
}

export function distancia(a: string, b: string): number {
  if (a === b) return 0;
  const linha = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let anterior = linha[0];
    linha[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = linha[j];
      linha[j] = Math.min(linha[j] + 1, linha[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
      anterior = guardado;
    }
  }
  return linha[b.length];
}

export function uniao(caixas: Caixa[]): Caixa {
  const x0 = Math.min(...caixas.map((c) => c[0]));
  const y0 = Math.min(...caixas.map((c) => c[1]));
  const x1 = Math.max(...caixas.map((c) => c[0] + c[2]));
  const y1 = Math.max(...caixas.map((c) => c[1] + c[3]));
  return [x0, y0, x1 - x0, y1 - y0];
}

export const centroX = (c: Caixa) => c[0] + c[2] / 2;
export const centroY = (c: Caixa) => c[1] + c[3] / 2;
export const fimX = (c: Caixa) => c[0] + c[2];
export const fimY = (c: Caixa) => c[1] + c[3];

export function chaveCaixa(c: Caixa): string {
  return c.map(Math.round).join(',');
}

export function media(ns: number[]): number {
  return ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0;
}

export function arredondar(n: number, casas = 4): number {
  const f = 10 ** casas;
  return Math.round(n * f) / f;
}
