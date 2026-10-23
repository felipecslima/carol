import type { Caixa, OcrLinha, OcrPalavra } from './tipos';
import { compacto, distancia, media, uniao } from './util';

export interface Rotulo {
  /** quem usa esse rótulo (campo, seção, tela); dois ids com o mesmo texto viram ocorrência com dois ids */
  id: string;
  texto: string;
}

export interface Ocorrencia {
  ids: string[];
  /** rótulo do dicionário que bateu */
  rotulo: string;
  /** 1,0 se bateu exato; 0,9 se precisou de tolerância */
  fator: number;
  caixa: Caixa;
  palavras: OcrPalavra[];
  confianca: number;
  linha: number;
  /** índices (na linha, só palavras não vazias) da primeira palavra e da seguinte à última */
  inicio: number;
  fim: number;
}

/** 0 erros para rótulos curtos; 1 para até 10 letras; 2 acima disso (seção 6 da spec). */
function tolerancia(alvo: string): number {
  return alvo.length <= 5 ? 0 : alvo.length <= 10 ? 1 : 2;
}

interface Alvo {
  ids: string[];
  texto: string;
  n: number;
  tol: number;
}

/**
 * Acha os rótulos de um catálogo no texto do OCR, sem acento nem caixa, tolerando letras
 * trocadas e palavras coladas ou separadas. Duas regras evitam confusão entre rótulos:
 *
 * - **maior rótulo vence**: "Visualizações por tipo de conteúdo" consome as palavras, e o
 *   "Visualizações" solto não vira cartão;
 * - **exclusividade**: numa janela que parece com dois rótulos ("Visualizações" × "Visualizadores"),
 *   só o mais próximo conta; empate não conta para ninguém.
 */
export function acharRotulos(linhas: OcrLinha[], catalogo: Rotulo[]): Ocorrencia[] {
  const alvos = new Map<string, Alvo>();
  for (const r of catalogo) {
    const forma = compacto(r.texto);
    if (!forma) continue;
    const a = alvos.get(forma) ?? { ids: [], texto: r.texto, n: r.texto.trim().split(/\s+/).length, tol: tolerancia(forma) };
    if (!a.ids.includes(r.id)) a.ids.push(r.id);
    alvos.set(forma, a);
  }

  const saida: Ocorrencia[] = [];
  linhas.forEach((linha, idx) => {
    const palavras = linha.palavras.filter((p) => compacto(p.texto));
    const formas = palavras.map((p) => compacto(p.texto));
    if (!palavras.length) return;

    const candidatos: { d: number; i: number; tam: number; forma: string }[] = [];
    for (const [forma, a] of alvos) {
      for (let tam = Math.max(1, a.n - 1); tam <= a.n + 1; tam++) {
        for (let i = 0; i + tam <= palavras.length; i++) {
          const janela = formas.slice(i, i + tam).join('');
          if (Math.abs(janela.length - forma.length) > a.tol) continue;
          const d = distancia(janela, forma);
          if (d <= a.tol) candidatos.push({ d, i, tam, forma });
        }
      }
    }

    // exclusividade por janela
    const porJanela = new Map<string, typeof candidatos>();
    for (const c of candidatos) {
      const k = `${c.i}:${c.tam}`;
      porJanela.set(k, [...(porJanela.get(k) ?? []), c]);
    }
    const aceitos: typeof candidatos = [];
    for (const grupo of porJanela.values()) {
      grupo.sort((a, b) => a.d - b.d);
      if (grupo.length > 1 && grupo[1].d === grupo[0].d) continue;
      aceitos.push(grupo[0]);
    }

    // rótulo maior primeiro; para o mesmo rótulo, a janela mais exata e com o número certo de
    // palavras (senão "Toques no link da bio 0" engole o número). Sobreposta a uma aceita, cai.
    const n = (c: { forma: string }) => alvos.get(c.forma)!.n;
    aceitos.sort((a, b) =>
      b.forma.length - a.forma.length || a.d - b.d || Math.abs(a.tam - n(a)) - Math.abs(b.tam - n(b)) || a.i - b.i,
    );
    const usadas = new Set<number>();
    for (const c of aceitos) {
      const indices = Array.from({ length: c.tam }, (_, k) => c.i + k);
      if (indices.some((k) => usadas.has(k))) continue;
      indices.forEach((k) => usadas.add(k));
      const janela = palavras.slice(c.i, c.i + c.tam);
      const alvo = alvos.get(c.forma)!;
      saida.push({
        ids: alvo.ids,
        rotulo: alvo.texto,
        fator: c.d === 0 ? 1 : 0.9,
        caixa: uniao(janela.map((p) => p.caixa)),
        palavras: janela,
        confianca: media(janela.map((p) => p.confianca)),
        linha: idx,
        inicio: c.i,
        fim: c.i + c.tam,
      });
    }
  });

  return saida.sort((a, b) => a.linha - b.linha || a.inicio - b.inicio);
}

export function temRotulo(linhas: OcrLinha[], rotulo: string): boolean {
  return acharRotulos(linhas, [{ id: 'x', texto: rotulo }]).length > 0;
}
