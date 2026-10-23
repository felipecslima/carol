import type { Caixa, Imagem, Luminancia, ModoRegiao, OcrLinha, OcrPalavra, Tema } from '../tipos';

export const HOJE = new Date(Date.UTC(2026, 9, 23)); // 23/out/2026

/** Linha de OCR simulada: palavras separadas por espaço, cada uma com caixa própria. */
export function linha(texto: string, x: number, y: number, conf = 0.96, h = 20): OcrLinha {
  let cursor = x;
  const palavras: OcrPalavra[] = texto.split(' ').map((t) => {
    const w = Math.max(8, Math.round(t.length * h * 0.55));
    const p = { texto: t, confianca: conf, caixa: [cursor, y, w, h] as Caixa };
    cursor += w + Math.round(h * 0.4);
    return p;
  });
  return { texto, palavras, caixa: [x, y, cursor - x, h] };
}

/** Linha de OCR com cada palavra numa posição explícita: [texto, x][] */
export function linhaEm(partes: [string, number][], y: number, conf = 0.96, h = 20): OcrLinha {
  const palavras: OcrPalavra[] = partes.map(([t, x]) => ({ texto: t, confianca: conf, caixa: [x, y, Math.max(8, Math.round(t.length * h * 0.55)), h] as Caixa }));
  const x0 = Math.min(...palavras.map((p) => p.caixa[0]));
  const x1 = Math.max(...palavras.map((p) => p.caixa[0] + p.caixa[2]));
  return { texto: partes.map(([t]) => t).join(' '), palavras, caixa: [x0, y, x1 - x0, h] };
}

export interface OpcoesFake {
  largura?: number;
  altura?: number;
  tema?: Tema;
  /** o que a segunda passada devolve para um recorte */
  regiao?: (caixa: Caixa, modo: ModoRegiao) => OcrPalavra[];
  luminancia?: (caixa: Caixa) => Luminancia;
}

/** Imagem simulada: só texto e caixas; a segunda passada devolve nada, salvo se configurada. */
export function imagem(linhas: OcrLinha[], opcoes: OpcoesFake = {}, nome = 'print.png'): Imagem {
  return {
    nome,
    largura: opcoes.largura ?? 1170,
    altura: opcoes.altura ?? 2532,
    tema: opcoes.tema ?? 'claro',
    async pagina() {
      return { linhas };
    },
    async regiao(caixa, modo) {
      return opcoes.regiao?.(caixa, modo) ?? [];
    },
    async luminancia(caixa) {
      return opcoes.luminancia?.(caixa) ?? { media: 1, brancos: 0 };
    },
  };
}

/** Uma palavra de número para a segunda passada, centrada na caixa pedida. */
export function palavraNaFaixa(texto: string, faixa: Caixa, conf = 0.95): OcrPalavra {
  const h = faixa[3] * 0.5;
  const w = texto.length * h * 0.55;
  return { texto, confianca: conf, caixa: [faixa[0] + 4, faixa[1] + (faixa[3] - h) / 2, w, h] };
}
