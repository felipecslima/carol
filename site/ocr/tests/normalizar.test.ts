import { describe, expect, it } from 'vitest';
import { datasNaLinha, extrairPeriodo, limparToken, parseNumero, parseNumeroSolto, parsePeriodo } from '../normalizar';
import { HOJE } from './helpers';

const valor = (t: string) => parseNumero(t)?.valor;

describe('parseNumero', () => {
  it.each([
    ['1.234', 1234],
    ['1,234', 1234],
    ['8,663', 8663],
    ['1.234.567', 1234567],
    ['312', 312],
    ['12,3 mil', 12300],
    ['12.3K', 12300],
    ['12,3K', 12300],
    ['1,2 mi', 1200000],
    ['1.2M', 1200000],
    ['1,2mi', 1200000],
    ['8,7 mil', 8700],
    ['48,6%', 48.6],
    ['48.6%', 48.6],
    ['41%', 41],
    ['312 mil', 312000],
    ['+10', 10],
    ['-5', -5],
    ['+144,4%', 144.4],
  ])('%s → %d', (texto, esperado) => {
    expect(valor(texto)).toBe(esperado);
  });

  it('traço é "sem dado"', () => {
    expect(parseNumero('—')).toEqual({ valor: null, pct: false, corrigido: false });
  });

  it.each(['12.3', '12,3', '1,23', '6,76', '1.234 mil', '1.234%', '120%', 'mil', '', '@joana', 'seguidores', '4 m', '4 k', '5859', '30102026'])(
    'recusa o ambíguo ou inválido: "%s"',
    (texto) => {
      expect(parseNumero(texto)).toBeUndefined();
    },
  );

  it('marca percentual', () => {
    expect(parseNumero('78,4%')?.pct).toBe(true);
    expect(parseNumero('78')?.pct).toBe(false);
  });

  it('corrige confusões do OCR só dentro de número', () => {
    expect(parseNumero('1O5')).toMatchObject({ valor: 105, corrigido: true });
    expect(parseNumero('S.859')).toMatchObject({ valor: 5859, corrigido: true });
    expect(parseNumero('l2 mil')).toMatchObject({ valor: 12000, corrigido: true });
    expect(parseNumero('S,2 mi')).toMatchObject({ valor: 5200000 });
    expect(parseNumero('B8%')).toMatchObject({ valor: 88, pct: true });
    expect(parseNumero('SOBRE')).toBeUndefined();
    expect(parseNumero('OOO')).toBeUndefined();
  });

  it('não cria erro de ponto flutuante', () => {
    expect(valor('0,7 mi')).toBe(700000);
    expect(valor('1,1 mil')).toBe(1100);
  });
});

describe('limparToken', () => {
  it.each([
    ['▷212', '212'],
    ['22...', '22'],
    ['(11)', '11'],
    ['+10', '+10'],
    ['-5', '-5'],
    ['48,6%,', '48,6%'],
    ['—', ''],
  ])('%s → %s', (a, b) => {
    expect(limparToken(a)).toBe(b);
  });
});

describe('parseNumeroSolto', () => {
  it('acha o número num recorte com lixo', () => {
    expect(parseNumeroSolto('o 2.839')).toMatchObject({ valor: 2839, texto: '2.839' });
    expect(parseNumeroSolto('© 1.081 |')).toMatchObject({ valor: 1081 });
    expect(parseNumeroSolto('12,3 mil')).toMatchObject({ valor: 12300 });
    expect(parseNumeroSolto('l1.566')).toMatchObject({ valor: 1566 });
  });

  it('recusa o que não é número seguro', () => {
    expect(parseNumeroSolto('ABC')).toBeUndefined();
    expect(parseNumeroSolto('1,56')).toBeUndefined();
    expect(parseNumeroSolto('30.10.2026')).toBeUndefined();
  });
});

describe('datasNaLinha', () => {
  it('dia primeiro e mês primeiro, escolhendo a ordem que casa mais', () => {
    expect(datasNaLinha('23 de set. 22 de out.')).toEqual([{ dia: 23, mes: 9 }, { dia: 22, mes: 10 }]);
    expect(datasNaLinha('set. 23 out. 7 out. 22')).toEqual([{ dia: 23, mes: 9 }, { dia: 7, mes: 10 }, { dia: 22, mes: 10 }]);
    expect(datasNaLinha('sep 20 - oct 19')).toEqual([{ dia: 20, mes: 9 }, { dia: 19, mes: 10 }]);
    expect(datasNaLinha('20 set - 19 out')).toEqual([{ dia: 20, mes: 9 }, { dia: 19, mes: 10 }]);
  });

  it('"mais" e "dias" não são meses', () => {
    expect(datasNaLinha('3 coracoes, ambiente confortavel 2 mais')).toEqual([]);
    expect(datasNaLinha('ultimos 30 dias')).toEqual([]);
  });
});

describe('período', () => {
  it('últimos N dias, PT e EN, e o seletor "30 dias" do painel', () => {
    expect(parsePeriodo('Últimos 30 dias', HOJE)).toMatchObject({ dias: 30, inicio: null, fim: null });
    expect(parsePeriodo('Last 7 days', HOJE)).toMatchObject({ dias: 7 });
    expect(parsePeriodo('Resumo 30 dias v', HOJE)).toMatchObject({ dias: 30, texto: '30 dias' });
    expect(parsePeriodo('8,7 mil visualizações nos últimos 30 dias.', HOJE)).toMatchObject({ dias: 30 });
  });

  it('intervalo em PT e EN, contando os dois extremos', () => {
    const esperado = { inicio: '2026-09-20', fim: '2026-10-19', dias: 30 };
    expect(parsePeriodo('20 set - 19 out', HOJE)).toMatchObject(esperado);
    expect(parsePeriodo('Sep 20 - Oct 19', HOJE)).toMatchObject(esperado);
    expect(parsePeriodo('20 set. – 19 out.', HOJE)).toMatchObject(esperado);
  });

  it('eixo do gráfico vira intervalo com datas', () => {
    expect(parsePeriodo('23 de set. 22 de out.', HOJE)).toMatchObject({ inicio: '2026-09-23', fim: '2026-10-22', dias: 30 });
    expect(parsePeriodo('set. 23 out. 7 out. 22', HOJE)).toMatchObject({ inicio: '2026-09-23', fim: '2026-10-22', dias: 30 });
  });

  it('intervalo que cruza janeiro: o início fica no ano anterior', () => {
    expect(parsePeriodo('20 dez - 18 jan', HOJE)).toMatchObject({ inicio: '2025-12-20', fim: '2026-01-18', dias: 30 });
  });

  it('fim no futuro vai para o ano anterior', () => {
    expect(parsePeriodo('1 dez - 30 dez', HOJE)).toMatchObject({ inicio: '2025-12-01', fim: '2025-12-30' });
  });

  it('data inexistente, texto qualquer ou uma data só → nada', () => {
    expect(parsePeriodo('30 fev - 10 mar', HOJE)).toBeUndefined();
    expect(parsePeriodo('Visão geral', HOJE)).toBeUndefined();
    expect(parsePeriodo('+1,0% em relação a 22 de set', HOJE)).toBeUndefined();
  });

  it('junta o seletor com o eixo do gráfico e avisa quando não batem', () => {
    const ok = extrairPeriodo(['Resumo 30 dias v', '23 de set. 22 de out.'], HOJE);
    expect(ok.periodo).toMatchObject({ dias: 30, inicio: '2026-09-23', fim: '2026-10-22' });
    expect(ok.avisos).toEqual([]);
    const ruim = extrairPeriodo(['Resumo 90 dias v', '23 de set. 22 de out.'], HOJE);
    expect(ruim.avisos).toEqual(['periodo_inconsistente']);
  });
});
