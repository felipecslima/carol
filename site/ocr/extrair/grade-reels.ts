/**
 * Regra 8.3: grade de reels. A grade tem 3 colunas de células 9:16, e o número de
 * visualizações fica numa faixa escura no pé de cada célula, depois do ícone de olho.
 *
 * O OCR da página inteira erra muito nas miniaturas, então ele serve só de âncora: os números
 * que ele acha dão a fase das fileiras. Com a fase, cada faixa é recortada e lida de novo,
 * só com caracteres de número. Sem âncora, a fase é procurada pela luminância das faixas.
 */
import { calcularConfianca, novosFatores } from '../confianca';
import { limparToken, parseNumeroSolto } from '../normalizar';
import type { Caixa, CelulaReel, Imagem, OcrPalavra } from '../tipos';
import { arredondar, centroX, centroY, fimX, fimY, media, uniao } from '../util';
import type { Candidato } from './numeros';

export const COLUNAS = 3;
export const PROPORCAO_CELULA = 16 / 9;
/** centro do número: fração da altura da célula, medida do pé dela */
const CENTRO_NUMERO = 0.07;
/** faixa "👁 1.234": x em frações da largura da célula; y em frações da altura, do pé */
const FAIXA = { x0: 0.19, x1: 0.85, y0: 0.125, y1: 0.015 };
const TOLERANCIA_FASE = 0.06;
const PASSO_BUSCA = 0.05;
/** âncora: número da página com altura mínima (fração da largura), confiança e 2+ dígitos */
const ALTURA_MINIMA_ANCORA = 0.012;
const CONFIANCA_MINIMA_ANCORA = 0.5;
const MINIMO_CELULAS = 2;
/** a faixa precisa caber inteira na imagem */
const LIMITE_INFERIOR = 1;

export interface Geometria {
  largura: number;
  altura: number;
  cellW: number;
  cellH: number;
}

export const geometria = (largura: number, altura: number): Geometria => ({
  largura, altura, cellW: largura / COLUNAS, cellH: (largura / COLUNAS) * PROPORCAO_CELULA,
});

export function faixaDoNumero(coluna: number, fim: number, g: Geometria): Caixa {
  return [
    coluna * g.cellW + FAIXA.x0 * g.cellW,
    fim - FAIXA.y0 * g.cellH,
    (FAIXA.x1 - FAIXA.x0) * g.cellW,
    (FAIXA.y0 - FAIXA.y1) * g.cellH,
  ];
}

const mod = (a: number, m: number) => ((a % m) + m) % m;

export interface Ancora {
  /** centro vertical do número */
  yc: number;
  peso: number;
}

/** Fase (pé da fileira módulo cellH) votada pelas âncoras, com agrupamento circular. */
export function faseDasAncoras(ancoras: Ancora[], cellH: number): number | undefined {
  const fases = ancoras.map((a) => ({ f: mod(a.yc + CENTRO_NUMERO * cellH, cellH), w: a.peso }));
  const tol = TOLERANCIA_FASE * cellH;
  let melhor: { peso: number; fase: number } | undefined;
  for (const base of fases) {
    let peso = 0;
    let soma = 0;
    for (const f of fases) {
      const d = mod(f.f - base.f + cellH / 2, cellH) - cellH / 2;
      if (Math.abs(d) <= tol) {
        peso += f.w;
        soma += f.w * (base.f + d);
      }
    }
    if (!melhor || peso > melhor.peso) melhor = { peso, fase: mod(soma / peso, cellH) };
  }
  return melhor?.fase;
}

/** Pés das fileiras cuja faixa do número está inteira na imagem e abaixo do cabeçalho. */
export function pesVisiveis(fase: number, g: Geometria, topo: number): number[] {
  const pes: number[] = [];
  for (let pe = fase; pe < g.altura + g.cellH; pe += g.cellH) {
    if (pe - g.cellH < topo - 0.15 * g.cellH) continue;
    if (pe - FAIXA.y0 * g.cellH < topo) continue;
    if (pe - FAIXA.y1 * g.cellH > g.altura * LIMITE_INFERIOR) break;
    pes.push(pe);
  }
  return pes;
}

function naColunaCerta(caixa: Caixa, g: Geometria): boolean {
  const xRel = (caixa[0] % g.cellW) / g.cellW;
  return xRel >= FAIXA.x0 - 0.05 && xRel <= 0.6;
}

function dentro(caixa: Caixa, faixa: Caixa): boolean {
  const cx = centroX(caixa);
  const cy = centroY(caixa);
  return cx >= faixa[0] && cx <= fimX(faixa) && cy >= faixa[1] && cy <= fimY(faixa);
}

interface FaixaLida {
  texto: string;
  valor: number;
  confianca: number;
  caixa: Caixa;
}

async function lerFaixa(imagem: Imagem, faixa: Caixa): Promise<FaixaLida | undefined> {
  const palavras = await imagem.regiao(faixa, 'numero_branco');
  if (!palavras.length) return undefined;
  const n = parseNumeroSolto(palavras.map((p) => p.texto).join(' '));
  if (!n || n.valor === null || n.valor < 0) return undefined;

  const usadas = palavras.filter((p) => limparToken(p.texto) && n.texto.includes(limparToken(p.texto)));
  const base: OcrPalavra[] = usadas.length ? usadas : palavras;
  // letras que não são sufixo = lixo do ícone ou da miniatura dentro da faixa
  const ruido = palavras.some((p) => /[^\d.,%+\-\smilkMK]/i.test(p.texto));
  return {
    texto: n.texto,
    valor: n.valor,
    confianca: arredondar(media(base.map((p) => p.confianca)) * (ruido ? 0.9 : 1)),
    caixa: uniao(base.map((p) => p.caixa)),
  };
}

/** Sem âncora: varre fases para a primeira fileira pela luminância das faixas e confirma com OCR. */
async function procurarFase(imagem: Imagem, g: Geometria, topo: number): Promise<number | undefined> {
  const inicio = topo + (1 - 0.15) * g.cellH;
  const opcoes: { pe: number; pontos: number }[] = [];
  for (let pe = inicio; pe < inicio + g.cellH; pe += PASSO_BUSCA * g.cellH) {
    if (pe - FAIXA.y1 * g.cellH > g.altura * LIMITE_INFERIOR) break;
    let pontos = 0;
    for (let col = 0; col < COLUNAS; col++) {
      const l = await imagem.luminancia(faixaDoNumero(col, pe, g));
      if (l.media <= 0.5 && l.brancos >= 0.004 && l.brancos <= 0.4) pontos += 1 + (0.5 - l.media);
    }
    if (pontos >= 2) opcoes.push({ pe, pontos });
  }
  opcoes.sort((a, b) => b.pontos - a.pontos);

  for (const o of opcoes.slice(0, 3)) {
    const lidas: FaixaLida[] = [];
    for (let col = 0; col < COLUNAS; col++) {
      const r = await lerFaixa(imagem, faixaDoNumero(col, o.pe, g));
      if (r && r.confianca >= CONFIANCA_MINIMA_ANCORA) lidas.push(r);
    }
    if (lidas.length >= MINIMO_CELULAS) {
      // refina a fase pela posição real dos números lidos
      return faseDasAncoras(lidas.map((l) => ({ yc: centroY(l.caixa), peso: l.confianca })), g.cellH) ?? mod(o.pe, g.cellH);
    }
  }
  return undefined;
}

export interface GradeLida {
  celulas: CelulaReel[];
  avisos: string[];
  encontrou: boolean;
}

const NADA: GradeLida = { celulas: [], avisos: [], encontrou: false };

/**
 * Lê a grade a partir de `topo` (fim do cabeçalho do perfil, ou da barra de título).
 * Células cuja faixa fica fora da imagem são ignoradas; célula visível sem número → `grade_incompleta`.
 */
export async function lerGradeReels(imagem: Imagem, candidatosPagina: Candidato[], topo: number): Promise<GradeLida> {
  const g = geometria(imagem.largura, imagem.altura);

  const ancoras: Ancora[] = candidatosPagina
    .filter((c) => !c.pct && c.caixa[1] >= topo && c.caixa[3] >= ALTURA_MINIMA_ANCORA * g.largura)
    .filter((c) => c.confianca >= CONFIANCA_MINIMA_ANCORA && /\d{2}/.test(c.texto) && naColunaCerta(c.caixa, g))
    .map((c) => ({ yc: centroY(c.caixa), peso: c.confianca }));
  let fase = ancoras.length ? faseDasAncoras(ancoras, g.cellH) : undefined;
  if (fase === undefined) fase = await procurarFase(imagem, g, topo);
  if (fase === undefined) return NADA;

  const pes = pesVisiveis(fase, g, topo);
  if (!pes.length) return NADA;

  const celulas: CelulaReel[] = [];
  for (const [i, pe] of pes.entries()) {
    for (let col = 0; col < COLUNAS; col++) {
      const faixa = faixaDoNumero(col, pe, g);
      const lida = await lerFaixa(imagem, faixa);
      if (!lida) continue;
      // confere com o que o OCR da página viu na mesma faixa
      const ancora = candidatosPagina.find((c) => !c.pct && dentro(c.caixa, faixa));
      let ocr = lida.confianca;
      if (ancora) ocr = ancora.valor === lida.valor ? Math.max(ocr, ancora.confianca) : Math.min(ocr, ancora.confianca) * 0.8;
      const fatores = novosFatores(ocr);
      celulas.push({
        linha: i + 1, coluna: col + 1, texto: lida.texto, valor: lida.valor, caixa: lida.caixa,
        fatores, confianca: calcularConfianca(fatores),
      });
    }
  }
  if (celulas.length < MINIMO_CELULAS) return NADA;
  const avisos = celulas.length < pes.length * COLUNAS ? ['grade_incompleta'] : [];
  return { celulas, avisos, encontrou: true };
}
