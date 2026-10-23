import { describe, expect, it } from 'vitest';
import { ESQUEMAS, gerarPaleta, paresReprovados, PAPEIS, variaveisCss, type Esquema } from './paleta';

// cores variadas: matizes ao redor do círculo, cinzas, extremos escuros/claros e a cor do Creators
const ORIGENS = [
  '#d42a5b',
  '#e5386a',
  '#ff0000',
  '#ffcf4a',
  '#0b4a35',
  '#00bcd4',
  '#3f51b5',
  '#9c27b0',
  '#808080',
  '#000000',
  '#ffffff',
  '#fffb00',
  '#0000ff',
];

describe('gerarPaleta', () => {
  it('gera os 9 papéis em hex, claro e escuro', () => {
    const p = gerarPaleta('#d42a5b');
    for (const modo of [p.claro, p.escuro]) {
      expect(Object.keys(modo).sort()).toEqual([...PAPEIS].sort());
      for (const cor of Object.values(modo)) expect(cor).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(p.claro.fundo).not.toBe(p.escuro.fundo);
  });

  it('é determinística e aceita maiúsculas', () => {
    expect(gerarPaleta('#D42A5B')).toEqual(gerarPaleta('#d42a5b'));
  });

  it('o destaque guarda a matiz da cor de origem (Fidelity)', () => {
    const p = gerarPaleta('#d42a5b', 'fidelity');
    expect(p.claro.destaque).not.toBe(p.claro.texto);
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(p.claro.destaque.slice(i, i + 2), 16));
    expect(r!).toBeGreaterThan(g!);
    expect(r!).toBeGreaterThan(b!);
  });

  it('recusa cor inválida', () => {
    expect(() => gerarPaleta('rosa')).toThrow();
    expect(() => gerarPaleta('#fff')).toThrow();
  });

  it('variaveisCss devolve --papel para cada papel', () => {
    const vars = variaveisCss(gerarPaleta('#d42a5b').claro);
    expect(Object.keys(vars)).toHaveLength(PAPEIS.length);
    expect(vars['--fundo']).toMatch(/^#/);
  });

  // DEV-052: contraste 4,5:1 em todo par de texto e fundo, em qualquer cor e esquema
  describe.each(Object.keys(ESQUEMAS) as Esquema[])('contraste, esquema %s', (esquema) => {
    it.each(ORIGENS)('origem %s: claro e escuro', (origem) => {
      const p = gerarPaleta(origem, esquema);
      expect(paresReprovados(p.claro), 'claro').toEqual([]);
      expect(paresReprovados(p.escuro), 'escuro').toEqual([]);
    });
  });
});
