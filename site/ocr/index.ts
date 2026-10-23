import { consolidar } from './consolidar';
import { precisaReserva } from './confianca';
import { lerPrint } from './ler-print';
import type { ArquivoEntrada, MotorOcr, PrintLido, ResultadoLeitura } from './tipos';
import { aplicarFalhas, validarEntrePrints } from './validar';

export interface OpcoesLeitura {
  /** Motor de OCR. No navegador, `criarMotorTesseract()` de motor-tesseract.ts. */
  ocr: MotorOcr;
  hoje?: Date;
}

export const MAX_PRINTS = 7;

/**
 * 1 a 7 prints → um JSON por print e o consolidado da creator.
 * `contaCadastrada` é o @ do cadastro, usado só para conferir (`conta_diferente`).
 */
export async function lerPrints(
  arquivos: ArquivoEntrada[],
  contaCadastrada: string | undefined,
  opcoes: OpcoesLeitura,
): Promise<ResultadoLeitura> {
  if (arquivos.length < 1 || arquivos.length > MAX_PRINTS) {
    throw new RangeError(`Envie de 1 a ${MAX_PRINTS} prints.`);
  }

  const prints: PrintLido[] = [];
  for (const arquivo of arquivos) {
    // um por vez: o OCR é pesado e o celular tem pouca memória
    const imagem = await opcoes.ocr(arquivo);
    try {
      prints.push(await lerPrint(imagem, opcoes.hoje));
    } finally {
      imagem.liberar?.();
    }
  }

  aplicarFalhas(prints, validarEntrePrints(prints, contaCadastrada));
  for (const p of prints) p.precisa_reserva = precisaReserva(p);

  return { prints, consolidado: consolidar(prints, contaCadastrada) };
}

export * from './tipos';
export { consolidar } from './consolidar';
export { lerPrint } from './ler-print';
export { LIMITE_CONFIANCA } from './confianca';
