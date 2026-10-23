import { TELAS } from './dicionario';
import type { Fatores, PrintLido } from './tipos';
import { arredondar } from './util';

/** Abaixo disto o campo vai para a reserva. Calibrar com o conjunto anotado (seção 10 da spec). */
export const LIMITE_CONFIANCA = 0.85;
export const FATOR_POSICAO_DUVIDOSA = 0.8;
export const FATOR_VALIDACAO_FALHA = 0.5;

/** Avisos que só informam: não mandam o print para a reserva. */
export const AVISOS_INFORMATIVOS = new Set(['periodo_diferente_de_30_dias', 'reels_de_varios_prints']);

export function calcularConfianca(f: Fatores): number {
  return arredondar(f.ocr * f.rotulo * f.posicao * f.validacao);
}

export function novosFatores(ocr: number, rotulo = 1, posicao = 1): Fatores {
  return { ocr: arredondar(ocr), rotulo, posicao, validacao: 1 };
}

/** Aplica o fator de validação reprovada e recalcula a confiança. */
export function reprovar<T extends { confianca: number; fatores: Fatores }>(item: T): void {
  item.fatores.validacao = FATOR_VALIDACAO_FALHA;
  item.confianca = calcularConfianca(item.fatores);
}

/**
 * `precisa_reserva`: tela desconhecida, validação reprovada, qualquer número lido com pouca
 * confiança, campo essencial da tela ausente, ou print do qual não se leu nada.
 */
export function precisaReserva(p: PrintLido): boolean {
  if (p.tela === 'desconhecida') return true;
  if (p.avisos.some((a) => !AVISOS_INFORMATIVOS.has(a))) return true;

  const listas = Object.values(p.listas ?? {}).flat();
  if (Object.values(p.campos).some((c) => c.confianca < LIMITE_CONFIANCA)) return true;
  if (listas.some((i) => i.confianca < LIMITE_CONFIANCA)) return true;
  if (p.reels?.some((c) => c.confianca < LIMITE_CONFIANCA)) return true;

  if (p.tela === 'aba_reels') return !p.reels?.length;

  const def = TELAS[p.tela];
  const lidos = new Set([...Object.keys(p.campos), ...Object.keys(p.listas ?? {})]);
  if (def.essenciais.some((e) => !lidos.has(e))) return true;
  return lidos.size === 0 && !p.reels?.length;
}
