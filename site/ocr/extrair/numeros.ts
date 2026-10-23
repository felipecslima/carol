import { limparToken, parseNumero } from '../normalizar';
import type { Caixa, OcrLinha, OcrPalavra } from '../tipos';
import { chaveCaixa, media, uniao } from '../util';

export interface Candidato {
  texto: string;
  valor: number;
  pct: boolean;
  caixa: Caixa;
  /** média da confiança das palavras que formam o número */
  confianca: number;
  linha: number;
  /** identifica o número na imagem (para um número não servir a dois campos) */
  chave: string;
}

/** sufixo numa palavra separada: "mil", "mi", "%" em qualquer caixa; "K"/"M" só maiúsculos */
const SUFIXO_SOLTO = /^(mil|mi|%|K|M)$/i;
const LETRA_SOLTA = /^[km]$/;

/**
 * Todos os números que o OCR achou na página, já com sufixo colado ("1,2" + "mi" → "1,2 mi").
 * Traços soltos e textos que não passam na gramática da seção 7 não viram candidato.
 */
export function candidatosNumericos(linhas: OcrLinha[]): Candidato[] {
  const saida: Candidato[] = [];

  linhas.forEach((linha, idx) => {
    const palavras: OcrPalavra[] = linha.palavras
      .map((p) => ({ ...p, texto: limparToken(p.texto) }))
      .filter((p) => p.texto);

    for (let i = 0; i < palavras.length; i++) {
      const p = palavras[i];
      const prox = palavras[i + 1];
      const perto =
        prox && prox.caixa[0] - (p.caixa[0] + p.caixa[2]) <= 1.5 * Math.max(p.caixa[3], prox.caixa[3]);

      let grupo = [p];
      let lido: ReturnType<typeof parseNumero>;
      if (perto && SUFIXO_SOLTO.test(prox.texto) && !LETRA_SOLTA.test(prox.texto)) {
        lido = parseNumero(`${p.texto} ${prox.texto}`);
        if (lido && lido.valor !== null) grupo = [p, prox];
        else lido = undefined;
      }
      if (!lido) lido = parseNumero(p.texto);
      if (!lido || lido.valor === null) continue;

      if (grupo.length === 2) i++;
      const caixa = uniao(grupo.map((g) => g.caixa));
      saida.push({
        texto: grupo.map((g) => g.texto).join(' '),
        valor: lido.valor,
        pct: lido.pct,
        caixa,
        confianca: media(grupo.map((g) => g.confianca)),
        linha: idx,
        chave: chaveCaixa(caixa),
      });
    }
  });

  return saida;
}
