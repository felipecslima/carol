/**
 * Motor de OCR para o navegador: pré-processamento em canvas + Tesseract.js (que já roda em
 * Web Worker próprio). Cada imagem aberta oferece o OCR da página, o OCR de um recorte (com
 * lista de caracteres permitidos para números) e a luminância de uma região.
 *
 * Com `gravar`, toda chamada é registrada em `Gravacao`: é o que vira fixture dos testes,
 * para repetir a leitura sem navegador.
 */
import { createWorker, PSM, type Worker } from 'tesseract.js';
import type { ArquivoEntrada, Caixa, Imagem, Luminancia, ModoRegiao, MotorOcr, OcrLinha, OcrPalavra, OcrResultado, Tema } from './tipos';
import { chaveCaixa } from './util';

/** largura em que o texto de rótulo fica com ~35 px de altura; abaixo disso o Tesseract perde dígitos */
const LARGURA_ALVO = 1500;
const ESCALA_MAXIMA = 2.5;
const BARRA_DE_STATUS = 0.05;
/** altura do recorte depois de escalar, para o Tesseract ler números pequenos */
const ALTURA_RECORTE = 96;
const MARGEM_RECORTE = 16;
const CARACTERES_NUMERO = '0123456789.,milkMK%+-';
/** isolamento do texto branco: abaixo deste nível de claridade tudo vira fundo */
const PISO_TEXTO_BRANCO = 140;

export interface Gravacao {
  nome: string;
  largura: number;
  altura: number;
  tema: Tema;
  pagina: OcrResultado | null;
  regioes: { caixa: Caixa; modo: ModoRegiao; palavras: OcrPalavra[]; imagem?: string }[];
  luminancias: { caixa: Caixa; media: number; brancos: number }[];
  tempos: { pagina: number; regioes: number; luminancias: number };
}

export type Preparo = 'auto' | 'isolar' | 'inverter' | 'cinza';

export interface OpcoesRecorte {
  /** segmentação do Tesseract no recorte */
  psm?: PSM;
  /** lista de caracteres permitidos no modo número */
  whitelist?: boolean;
  /** pré-processamento; `auto` escolhe pelo modo e pela claridade */
  preparo?: Preparo;
  /** guarda a imagem enviada ao Tesseract (data URL) na gravação */
  depurar?: boolean;
}

export interface OpcoesMotor {
  /** modelos do Tesseract. `por` sozinho é mais rápido, mas perde dígitos pequenos */
  idiomas?: string[];
  recorte?: OpcoesRecorte;
  gravar?: (g: Gravacao) => void;
}

interface Bbox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

let workerCompartilhado: Promise<Worker> | undefined;
let idiomasCarregados = '';

function obterWorker(idiomas: string[]): Promise<Worker> {
  const chave = idiomas.join('+');
  if (!workerCompartilhado || idiomasCarregados !== chave) {
    idiomasCarregados = chave;
    workerCompartilhado = createWorker(idiomas);
  }
  return workerCompartilhado;
}

const luma = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

function recortar(ctx: CanvasRenderingContext2D, largura: number, altura: number, caixa: Caixa) {
  const x = Math.max(0, Math.floor(caixa[0]));
  const y = Math.max(0, Math.floor(caixa[1]));
  const w = Math.min(largura, Math.ceil(caixa[0] + caixa[2])) - x;
  const h = Math.min(altura, Math.ceil(caixa[1] + caixa[3])) - y;
  if (w < 2 || h < 2) return undefined;
  return { x, y, w, h, dados: ctx.getImageData(x, y, w, h) };
}

function mediaLuma(img: ImageData): number {
  const px = img.data;
  let soma = 0;
  for (let i = 0; i < px.length; i += 4) soma += luma(px[i], px[i + 1], px[i + 2]);
  return soma / (px.length / 4) / 255;
}

/**
 * Transforma o recorte em texto escuro sobre fundo claro:
 * - `cinza`: só tons de cinza (texto já é escuro)
 * - `inverter`: cinza invertido (texto branco em fundo escuro)
 * - `isolar`: texto branco vira preto e tudo abaixo do piso vira branco; apaga a miniatura
 *   atrás do número do reel, porque ela está escurecida pelo degradê e o número não
 */
function preparar(img: ImageData, preparo: Exclude<Preparo, 'auto'>): void {
  const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const l = luma(px[i], px[i + 1], px[i + 2]);
    let g = l;
    if (preparo === 'inverter') g = 255 - l;
    if (preparo === 'isolar') g = 255 - Math.max(0, Math.min(255, ((l - PISO_TEXTO_BRANCO) * 255) / (255 - PISO_TEXTO_BRANCO)));
    px[i] = px[i + 1] = px[i + 2] = g;
  }
}

export function criarMotorTesseract(opcoes: OpcoesMotor = {}): MotorOcr {
  const idiomas = opcoes.idiomas ?? ['por', 'eng'];
  const recorte: Required<OpcoesRecorte> = {
    psm: PSM.SINGLE_LINE, whitelist: true, preparo: 'auto', depurar: false, ...opcoes.recorte,
  };

  return async (arquivo: ArquivoEntrada): Promise<Imagem> => {
    const bmp = await createImageBitmap(arquivo.dados);
    const largura = bmp.width;
    const altura = bmp.height;
    const original = document.createElement('canvas');
    original.width = largura;
    original.height = altura;
    const ctx = original.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(bmp, 0, 0);
    bmp.close();

    const tema: Tema = mediaLuma(ctx.getImageData(0, 0, largura, altura)) > 0.5 ? 'claro' : 'escuro';
    const gravacao: Gravacao = {
      nome: arquivo.nome, largura, altura, tema, pagina: null, regioes: [], luminancias: [],
      tempos: { pagina: 0, regioes: 0, luminancias: 0 },
    };

    const paraOriginal = (bb: Bbox, escala: number, dx = 0, dy = 0): Caixa => [
      Math.round(bb.x0 / escala + dx), Math.round(bb.y0 / escala + dy),
      Math.round((bb.x1 - bb.x0) / escala), Math.round((bb.y1 - bb.y0) / escala),
    ];

    const imagem: Imagem & { gravacao: Gravacao } = {
      nome: arquivo.nome,
      largura,
      altura,
      tema,
      gravacao,

      async pagina() {
        const t0 = performance.now();
        const escala = Math.min(ESCALA_MAXIMA, Math.max(1, LARGURA_ALVO / largura));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(largura * escala);
        canvas.height = Math.round(altura * escala);
        const c = canvas.getContext('2d', { willReadFrequently: true })!;
        c.drawImage(original, 0, 0, canvas.width, canvas.height);
        const img = c.getImageData(0, 0, canvas.width, canvas.height);
        preparar(img, tema === 'escuro' ? 'inverter' : 'cinza');
        c.putImageData(img, 0, 0);
        // apaga a barra de status (hora, bateria) sem mudar as coordenadas
        c.fillStyle = '#fff';
        c.fillRect(0, 0, canvas.width, canvas.height * BARRA_DE_STATUS);

        const w = await obterWorker(idiomas);
        await w.setParameters({ tessedit_pageseg_mode: PSM.AUTO, tessedit_char_whitelist: '' });
        const { data } = await w.recognize(canvas, {}, { blocks: true });

        const linhas: OcrLinha[] = [];
        for (const b of data.blocks ?? []) {
          for (const p of b.paragraphs) {
            for (const l of p.lines) {
              const palavras = l.words
                .filter((x) => x.text.trim())
                .map((x) => ({ texto: x.text.trim(), confianca: x.confidence / 100, caixa: paraOriginal(x.bbox, escala) }));
              if (palavras.length) linhas.push({ texto: l.text.trim(), caixa: paraOriginal(l.bbox, escala), palavras });
            }
          }
        }
        const resultado = { linhas };
        gravacao.pagina = resultado;
        gravacao.tempos.pagina += performance.now() - t0;
        return resultado;
      },

      async regiao(caixa, modo) {
        const t0 = performance.now();
        const r = recortar(ctx, largura, altura, caixa);
        let palavras: OcrPalavra[] = [];
        let imagemDepuracao: string | undefined;
        if (r) {
          let preparo = recorte.preparo;
          if (preparo === 'auto') {
            if (modo === 'numero_branco') preparo = 'isolar';
            else preparo = mediaLuma(r.dados) < 0.5 ? 'inverter' : 'cinza';
          }
          preparar(r.dados, preparo);
          const escala = Math.min(4, Math.max(1, ALTURA_RECORTE / r.h));
          const pedaco = document.createElement('canvas');
          pedaco.width = r.w;
          pedaco.height = r.h;
          pedaco.getContext('2d')!.putImageData(r.dados, 0, 0);

          const canvas = document.createElement('canvas');
          canvas.width = Math.round(r.w * escala) + 2 * MARGEM_RECORTE;
          canvas.height = Math.round(r.h * escala) + 2 * MARGEM_RECORTE;
          const c = canvas.getContext('2d')!;
          c.fillStyle = '#fff';
          c.fillRect(0, 0, canvas.width, canvas.height);
          c.drawImage(pedaco, MARGEM_RECORTE, MARGEM_RECORTE, Math.round(r.w * escala), Math.round(r.h * escala));
          if (recorte.depurar) imagemDepuracao = canvas.toDataURL('image/png');

          const w = await obterWorker(idiomas);
          await w.setParameters({
            tessedit_pageseg_mode: recorte.psm,
            tessedit_char_whitelist: modo !== 'texto' && recorte.whitelist ? CARACTERES_NUMERO : '',
          });
          const { data } = await w.recognize(canvas, {}, { blocks: true });
          palavras = (data.blocks ?? [])
            .flatMap((b) => b.paragraphs.flatMap((p) => p.lines.flatMap((l) => l.words)))
            .filter((x) => x.text.trim())
            .map((x) => ({
              texto: x.text.trim(),
              confianca: x.confidence / 100,
              caixa: paraOriginal(
                { x0: x.bbox.x0 - MARGEM_RECORTE, y0: x.bbox.y0 - MARGEM_RECORTE, x1: x.bbox.x1 - MARGEM_RECORTE, y1: x.bbox.y1 - MARGEM_RECORTE },
                escala, r.x, r.y,
              ),
            }));
        }
        gravacao.regioes.push({ caixa, modo, palavras, ...(imagemDepuracao ? { imagem: imagemDepuracao } : {}) });
        gravacao.tempos.regioes += performance.now() - t0;
        return palavras;
      },

      async luminancia(caixa): Promise<Luminancia> {
        const t0 = performance.now();
        const r = recortar(ctx, largura, altura, caixa);
        let resultado: Luminancia = { media: 0, brancos: 0 };
        if (r) {
          const px = r.dados.data;
          let soma = 0;
          let brancos = 0;
          for (let i = 0; i < px.length; i += 4) {
            const l = luma(px[i], px[i + 1], px[i + 2]);
            soma += l;
            if (l > 230) brancos++;
          }
          const n = px.length / 4;
          resultado = { media: soma / n / 255, brancos: brancos / n };
        }
        gravacao.luminancias.push({ caixa, ...resultado });
        gravacao.tempos.luminancias += performance.now() - t0;
        return resultado;
      },

      liberar() {
        original.width = 0;
        original.height = 0;
        opcoes.gravar?.(gravacao);
      },
    };
    return imagem;
  };
}

/** Repete uma gravação sem navegador: mesma página, mesmos recortes, mesmas luminâncias. */
export function imagemGravada(g: Gravacao): Imagem {
  const regioes = new Map(g.regioes.map((r) => [`${r.modo}:${chaveCaixa(r.caixa)}`, r.palavras]));
  const luminancias = new Map(g.luminancias.map((l) => [chaveCaixa(l.caixa), { media: l.media, brancos: l.brancos }]));
  return {
    nome: g.nome,
    largura: g.largura,
    altura: g.altura,
    tema: g.tema,
    async pagina() {
      return g.pagina ?? { linhas: [] };
    },
    async regiao(caixa, modo) {
      return regioes.get(`${modo}:${chaveCaixa(caixa)}`) ?? [];
    },
    async luminancia(caixa) {
      return luminancias.get(chaveCaixa(caixa)) ?? { media: 1, brancos: 0 };
    },
  };
}
