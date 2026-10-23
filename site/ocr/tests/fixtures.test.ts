/**
 * Repete a leitura dos prints reais a partir das gravações do motor (tests/fixtures/*.json,
 * geradas por `node scripts/ocr-spike.mjs`) e compara com a resposta certa (tests/esperado).
 *
 * O que reprova o teste é a regra de ouro: número errado com confiança alta. Número que o
 * script não leu (ou mandou para a reserva) só conta nas métricas impressas no fim.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { lerPrint } from '../ler-print';
import { imagemGravada, type Gravacao } from '../motor-tesseract';
import type { PrintLido } from '../tipos';
import { distancia } from '../util';
import { HOJE } from './helpers';

interface Esperado {
  tela: string;
  conta?: string;
  periodo?: { dias?: number; inicio?: string; fim?: string };
  campos?: Record<string, number>;
  reels?: number[][];
}

const pasta = join(import.meta.dirname, 'fixtures');
const fixtures = existsSync(pasta) ? readdirSync(pasta).filter((a) => a.endsWith('.json')).sort() : [];

function reelsLidos(p: PrintLido): Record<string, number> {
  return Object.fromEntries((p.reels ?? []).map((c) => [`${c.linha},${c.coluna}`, c.valor]));
}

describe.runIf(fixtures.length)('prints reais', () => {
  const metricas = { campos: 0, corretos: 0, lidos: 0, errados: 0, prints: 0, reserva: 0, semErro: 0 };

  for (const arquivo of fixtures) it(arquivo, async () => {
    const gravacao: Gravacao = JSON.parse(readFileSync(join(pasta, arquivo), 'utf8'));
    const caminhoEsperado = join(import.meta.dirname, 'esperado', arquivo);
    if (!existsSync(caminhoEsperado)) return;
    const esperado: Esperado = JSON.parse(readFileSync(caminhoEsperado, 'utf8'));

    const p = await lerPrint(imagemGravada(gravacao), HOJE);
    metricas.prints++;
    if (p.precisa_reserva) metricas.reserva++;
    const errosDoPrint: string[] = [];

    expect(p.tela, `${arquivo}: tela`).toBe(esperado.tela);
    // o OCR troca uma ou duas letras do nome; a validação tolera isso
    if (esperado.conta) expect(distancia(p.conta?.valor ?? '', esperado.conta), `${arquivo}: conta lida ${p.conta?.valor}`).toBeLessThanOrEqual(2);
    if (esperado.periodo) expect(p.periodo, `${arquivo}: período`).toMatchObject(esperado.periodo);

    const lidos = { ...Object.fromEntries(Object.entries(p.campos).map(([k, c]) => [k, c.valor])), ...reelsLidos(p) };
    const certos = { ...esperado.campos, ...Object.fromEntries((esperado.reels ?? []).flatMap((f, r) => f.map((v, c) => [`${r + 1},${c + 1}`, v]))) };

    for (const [nome, valor] of Object.entries(certos)) {
      metricas.campos++;
      if (lidos[nome] === undefined) continue;
      metricas.lidos++;
      if (lidos[nome] === valor) metricas.corretos++;
      else {
        metricas.errados++;
        errosDoPrint.push(`${nome}: lido ${lidos[nome]}, certo ${valor}`);
      }
    }
    // números lidos que não existem na tela também são erro
    for (const nome of Object.keys(lidos)) {
      if (!(nome in certos) && !/^(visualizacoes_resumo|seguindo|publicacoes)$/.test(nome)) errosDoPrint.push(`${nome}: lido ${lidos[nome]}, não está na tela`);
    }
    if (!errosDoPrint.length) metricas.semErro++;

    // regra de ouro: errar só é tolerado se o print foi para a reserva
    if (!p.precisa_reserva) expect(errosDoPrint, `${arquivo}: números errados com confiança alta`).toEqual([]);
  });

  it('métricas', () => {
    const m = metricas;
    process.stdout.write(
      `\nprints reais: ${m.prints} prints, ${m.reserva} para a reserva (${Math.round((100 * m.reserva) / m.prints)}%), ` +
      `${m.semErro} sem nenhum erro\n` +
      `campos: ${m.campos} esperados, ${m.lidos} lidos, ${m.corretos} corretos, ${m.errados} errados ` +
      `(cobertura ${Math.round((100 * m.lidos) / m.campos)}%, acerto entre lidos ${m.lidos ? Math.round((100 * m.corretos) / m.lidos) : 0}%)\n\n`,
    );
  });
});
