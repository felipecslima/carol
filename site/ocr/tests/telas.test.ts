import { describe, expect, it } from 'vitest';
import { classificar } from '../classificar';
import { consolidar } from '../consolidar';
import { faixaDoNumero, faseDasAncoras, geometria, pesVisiveis } from '../extrair/grade-reels';
import { lerPrints } from '../index';
import { lerPrint } from '../ler-print';
import { acharRotulos } from '../rotulo';
import type { Caixa, Imagem, OcrLinha } from '../tipos';
import { HOJE, imagem, linha, linhaEm, palavraNaFaixa } from './helpers';

// Prints simulados com a geometria dos prints reais (iOS, 721 × 1568).
const W = 721;
const H = 1568;
const opts = { largura: W, altura: H, tema: 'escuro' as const };

const painelInicio = (extra: Partial<Record<'views' | 'seg' | 'liq', string>> = {}) => [
  linha('< Seu painel O O', 30, 130, 0.9, 26),
  linha('Página inicial Desempenho Conteúdo Público', 12, 237, 0.9, 24),
  linha('Resumo 30 dias v', 31, 343, 0.95, 26),
  linha('Visualizações', 59, 440, 0.96, 26), linha('Seguidores', 430, 439, 0.96, 21),
  linha(extra.views ?? '8,663', 59, 485, 0.96, 33), linha(extra.seg ?? '992', 431, 490, 0.96, 27),
  linha('+144,4% em relação a 22 de', 59, 533, 0.9, 20), linha('+1,0% em relação a 22 de set', 430, 533, 0.9, 20),
  linha('Seguidores líquidos', 430, 634, 0.95, 21),
  linha(extra.liq ?? '+10', 430, 685, 0.96, 24),
  linha('23 de set. 22 de out.', 59, 730, 0.96, 20),
  linha('Ferramentas >', 31, 869, 0.96, 26),
  linha('Status Ferramentas Monetização', 50, 958, 0.96, 20),
];

const painelDesempenho = (extra: Partial<Record<'views' | 'vis' | 'stories' | 'reels' | 'posts', string>> = {}) => [
  linha('< Seu painel MW O', 30, 130, 0.9, 26),
  linha('Página inicial Desempenho Conteúdo Público', 12, 237, 0.9, 24),
  linha('Todos os conteúdos 30 dias v', 31, 340, 0.96, 26),
  linha('Visualizações', 59, 422, 0.96, 22), linha('Visualizadores', 351, 422, 0.96, 22), linha('Visualizaç', 640, 422, 0.92, 22),
  linha(extra.views ?? '8,663', 59, 477, 0.96, 30), linha(extra.vis ?? '1,597', 351, 477, 0.91, 30), linha('6,76', 640, 477, 0.77, 30),
  linha('+144,4% em relação a 22...', 59, 522, 0.9, 18), linha('+59,2% em relação a 22 d...', 351, 522, 0.9, 18),
  linha('1,1 mil', 14, 667, 0.9, 20),
  linha('0', 60, 892, 0.95, 20),
  linha('set. 23 out. 7 out. 22', 90, 919, 0.95, 20),
  linha('Visualizações por tipo de conteúdo O', 30, 1029, 0.96, 24),
  linha('O Seguidores @ Nao seguidores', 30, 1101, 0.9, 20),
  linha('Stories', 30, 1156, 0.96, 22), linha(`TMN NES ${extra.stories ?? '7,4 mil'}`, 400, 1189, 0.96, 22),
  linha('Reels', 30, 1236, 0.96, 22), linha(`Cm. ${extra.reels ?? '857'}`, 500, 1268, 0.96, 22),
  linha('Posts', 30, 1317, 0.96, 22), linha(`( ${extra.posts ?? '94'}`, 600, 1353, 0.96, 22),
  linha('Vídeos ao vivo', 30, 1395, 0.96, 22), linha('0', 675, 1433, 0.9, 22),
  linha('Interações por tipo de conteúdo (O)', 30, 1539, 0.96, 24),
];

const painelInteracoes = () => [
  linha('< Seu painel VW O', 30, 130, 0.9, 26),
  linha('Página inicial Desempenho Conteudo Público', 12, 237, 0.9, 24),
  linha('Interações por tipo de conteúdo (O', 30, 369, 0.96, 24),
  linha('Tudo Q Curtidas Q Comentarios 7 Reposts', 30, 451, 0.9, 22),
  linha('O Seguidores é Nao seguidores', 30, 535, 0.9, 20),
  linha('Stories', 30, 590, 0.96, 22), linha('C1] 440', 560, 622, 0.96, 22),
  linha('Reels', 30, 670, 0.96, 22), linha('C1 77', 600, 707, 0.96, 22),
  linha('Posts', 30, 751, 0.96, 22), linha("' 4", 650, 788, 0.96, 22),
  linha('Vídeos ao vivo', 30, 830, 0.96, 22), linha('0', 675, 868, 0.94, 22),
  linha('Atividade do perfil O', 30, 973, 0.95, 24),
  linha('© Visitas ao perfil 160', 30, 1069, 0.96, 22),
  linha('(7 Toques no link da bio 0', 30, 1212, 0.96, 22),
  linha('tw Toques no endereço comercial 0', 30, 1358, 0.96, 22),
];

const perfil = (seguidores = '992', conta = 'joelcslima') => [
  linha(`+ ${conta} v º E =`, 60, 119, 0.9, 30),
  linha('Deixe a', 70, 227, 0.9, 18),
  linha('musica rol... Felipe Lima', 70, 249, 0.95, 20),
  linhaEm([['9', 225], [seguidores, 352], ['1.054', 545]], 303, 0.96, 28),
  linhaEm([['posts', 220], ['seguidores', 352], ['seguindo', 545]], 336, 0.9, 20),
  linha('® Felipe Lima', 40, 456, 0.9, 20),
  linha('Seu painel', 55, 536, 0.9, 22),
  linha('2 8,7 mil visualizações nos últimos 30 dias.', 55, 567, 0.9, 20),
  linha('Editar Compartilhar perfil +2', 140, 644, 0.96, 24),
];

describe('acharRotulos', () => {
  it('tolera acento, caixa e uma letra errada', () => {
    const l = [linha('CONTAS ALCANCADAS', 0, 0), linha('Contas alcancadas', 0, 40), linha('Contas alcançadae', 0, 80)];
    expect(acharRotulos(l, [{ id: 'a', texto: 'Contas alcançadas' }]).map((o) => o.fator)).toEqual([1, 1, 0.9]);
  });

  it('rótulo curto não aceita erro', () => {
    expect(acharRotulos([linha('Views', 0, 0)], [{ id: 'a', texto: 'Views' }])).toHaveLength(1);
    expect(acharRotulos([linha('Viers', 0, 0)], [{ id: 'a', texto: 'Views' }])).toHaveLength(0);
  });

  it('rótulos parecidos não se roubam: cada palavra vai para o mais próximo', () => {
    const cat = [{ id: 'views', texto: 'Visualizações' }, { id: 'viewers', texto: 'Visualizadores' }];
    const occs = acharRotulos([linha('Visualizações Visualizadores', 0, 0)], cat);
    expect(occs.map((o) => o.ids)).toEqual([['views'], ['viewers']]);
  });

  it('o rótulo maior vence o menor contido nele', () => {
    const cat = [{ id: 'v', texto: 'Visualizações' }, { id: 't', texto: 'Visualizações por tipo de conteúdo' }, { id: 's', texto: 'Seguidores' }, { id: 'l', texto: 'Seguidores líquidos' }];
    const occs = acharRotulos([linha('Visualizações por tipo de conteúdo O', 0, 0), linha('Seguidores líquidos', 0, 40)], cat);
    expect(occs.map((o) => o.ids)).toEqual([['t'], ['l']]);
  });
});

describe('classificar', () => {
  it('painel (página inicial e desempenho)', () => {
    expect(classificar({ linhas: painelInicio() })).toMatchObject({ tela: 'painel', idioma: 'pt' });
    expect(classificar({ linhas: painelDesempenho() })).toMatchObject({ tela: 'painel', idioma: 'pt' });
    expect(classificar({ linhas: painelInteracoes() })).toMatchObject({ tela: 'painel' });
  });

  it('perfil pela tripla "posts seguidores seguindo"', () => {
    expect(classificar({ linhas: perfil() })).toMatchObject({ tela: 'perfil', idioma: 'pt' });
    const en = [linha('9 992 1,054', 200, 303, 0.96, 28), linha('posts followers following', 200, 336), linha('Edit profile Share profile', 140, 644)];
    expect(classificar({ linhas: en })).toMatchObject({ tela: 'perfil', idioma: 'en' });
  });

  it('"Seguidores" e "Posts" soltos (legenda e linha de formato) não fazem um painel virar perfil', () => {
    expect(classificar({ linhas: painelInteracoes() }).tela).toBe('painel');
  });

  it('pouca pista → desconhecida', () => {
    expect(classificar({ linhas: [linha('Configurações', 60, 100)] }).tela).toBe('desconhecida');
  });
});

describe('painel', () => {
  it('página inicial: cartões, saldo com sinal e período com datas do gráfico', async () => {
    const p = await lerPrint(imagem(painelInicio(), opts), HOJE);
    expect(p.tela).toBe('painel');
    expect(p.campos.visualizacoes).toMatchObject({ texto: '8,663', valor: 8663 });
    expect(p.campos.seguidores.valor).toBe(992);
    expect(p.campos.seguidores_liquidos.valor).toBe(10);
    expect(p.periodo).toMatchObject({ dias: 30, inicio: '2026-09-23', fim: '2026-10-22' });
    expect(p.avisos).toEqual([]);
    expect(p.precisa_reserva).toBe(false);
  });

  it('saldo negativo é aceito só no campo que permite', async () => {
    const p = await lerPrint(imagem(painelInicio({ liq: '-5' }), opts), HOJE);
    expect(p.campos.seguidores_liquidos.valor).toBe(-5);
    expect(p.avisos).toEqual([]);
  });

  it('desempenho: cartões lado a lado e seção por formato', async () => {
    const p = await lerPrint(imagem(painelDesempenho(), opts), HOJE);
    expect(p.campos.visualizacoes.valor).toBe(8663);
    expect(p.campos.visualizadores.valor).toBe(1597);
    expect(p.campos.views_stories.valor).toBe(7400);
    expect(p.campos.views_reels.valor).toBe(857);
    expect(p.campos.views_posts.valor).toBe(94);
    expect(p.campos.views_videos_ao_vivo.valor).toBe(0);
    expect(p.periodo).toMatchObject({ dias: 30, inicio: '2026-09-23', fim: '2026-10-22' });
    expect(p.campos.visualizacoes.confianca).toBeGreaterThanOrEqual(0.85);
    expect(p.precisa_reserva).toBe(false);
  });

  it('a mesma linha "Stories" nas duas seções vai para o campo certo', async () => {
    const p = await lerPrint(imagem(painelInteracoes(), opts), HOJE);
    expect(p.campos.interacoes_stories.valor).toBe(440);
    expect(p.campos.interacoes_reels.valor).toBe(77);
    expect(p.campos.interacoes_posts.valor).toBe(4);
    expect(p.campos.visitas_perfil.valor).toBe(160);
    expect(p.campos.toques_link.valor).toBe(0);
    expect(p.campos.toques_endereco.valor).toBe(0);
    expect(p.campos.views_stories).toBeUndefined();
    expect(p.campos.seguidores).toBeUndefined();
    expect(p.precisa_reserva).toBe(false);
  });

  it('formatos que não batem com o total → aviso e reserva', async () => {
    const p = await lerPrint(imagem(painelDesempenho({ stories: '3,4 mil' }), opts), HOJE);
    expect(p.avisos).toContain('formatos_nao_batem_com_total');
    expect(p.precisa_reserva).toBe(true);
  });

  it('visualizadores maior que visualizações → aviso', async () => {
    const p = await lerPrint(imagem(painelDesempenho({ vis: '9,597' }), opts), HOJE);
    expect(p.avisos).toContain('alcance_maior_que_visualizacoes');
  });

  it('número ambíguo sem sufixo não é lido, não é chutado', async () => {
    const p = await lerPrint(imagem(painelInicio({ views: '8,6' }), opts), HOJE);
    expect(p.campos.visualizacoes).toBeUndefined();
    expect(p.nao_lidos).toContain('visualizacoes');
  });

  it('número com confiança baixa: a segunda passada confirma e sobe a confiança', async () => {
    const linhas = painelInicio();
    linhas[5].palavras[0].confianca = 0.7;
    const semConfirmar = await lerPrint(imagem(linhas, opts), HOJE);
    expect(semConfirmar.precisa_reserva).toBe(true);
    const confirmando = await lerPrint(imagem(linhas, { ...opts, regiao: (c) => [palavraNaFaixa('8,663', c, 0.97)] }), HOJE);
    expect(confirmando.campos.visualizacoes).toMatchObject({ valor: 8663, confirmado: true });
    expect(confirmando.precisa_reserva).toBe(false);
  });

  it('período de 90 dias avisa mas não manda para a reserva', async () => {
    const linhas = painelInicio();
    linhas[2] = linha('Resumo 90 dias v', 31, 343, 0.95, 26);
    linhas[11] = linha('25 de jul. 22 de out.', 59, 730, 0.96, 20);
    const p = await lerPrint(imagem(linhas, opts), HOJE);
    expect(p.avisos).toEqual(['periodo_diferente_de_30_dias']);
    expect(p.precisa_reserva).toBe(false);
  });
});

describe('perfil', () => {
  it('lê a tripla acima dos rótulos, o resumo, a conta e o período', async () => {
    const p = await lerPrint(imagem(perfil(), opts), HOJE);
    expect(p.tela).toBe('perfil');
    expect(p.campos.seguidores.valor).toBe(992);
    expect(p.campos.publicacoes.valor).toBe(9);
    expect(p.campos.seguindo.valor).toBe(1054);
    expect(p.campos.visualizacoes_resumo.valor).toBe(8700);
    expect(p.conta).toEqual({ texto: 'joelcslima', valor: 'joelcslima' });
    expect(p.periodo?.dias).toBe(30);
    expect(p.reels).toBeUndefined();
    expect(p.precisa_reserva).toBe(false);
  });

  it('sem seguidores legível → reserva', async () => {
    const p = await lerPrint(imagem(perfil('9,9'), opts), HOJE);
    expect(p.nao_lidos).toContain('seguidores');
    expect(p.precisa_reserva).toBe(true);
  });
});

describe('grade de reels', () => {
  const g = geometria(W, H);

  it('geometria: 3 colunas de células 9:16', () => {
    expect(g.cellW).toBeCloseTo(240.33, 1);
    expect(g.cellH).toBeCloseTo(427.26, 1);
    const f = faixaDoNumero(1, 712, g);
    expect(f[0]).toBeGreaterThan(g.cellW);
    expect(f[1] + f[3]).toBeLessThan(712);
  });

  it('fase votada pelas âncoras, ignorando a que destoa', () => {
    const fase = faseDasAncoras([{ yc: 682, peso: 0.9 }, { yc: 1109, peso: 0.9 }, { yc: 900, peso: 0.5 }], g.cellH)!;
    // pé da fileira 1 ≈ 682 + 0,07·cellH ≈ 712
    expect(Math.abs(((712 - fase) % g.cellH + g.cellH) % g.cellH)).toBeLessThan(2);
  });

  it('pés visíveis param na borda de baixo e começam depois do topo', () => {
    const pes = pesVisiveis(712 % g.cellH, g, 0.08 * H);
    expect(pes.map(Math.round)).toEqual([712, 1139, 1567]);
  });

  /** grade sem cabeçalho: o OCR da página acha uns números (âncoras); a faixa devolve os certos */
  const grade = (valores: string[][], paginaAcha: Record<string, string> = {}) => {
    const pes = valores.map((_, r) => 285 + (r + 1) * g.cellH);
    const linhas: OcrLinha[] = [linha('< yuriog7 aE', 30, 136, 0.9, 26)];
    valores.forEach((fileira, r) => fileira.forEach((v, c) => {
      const lido = paginaAcha[`${r},${c}`];
      if (lido) linhas.push(linha(lido, c * g.cellW + 48, pes[r] - 0.07 * g.cellH - 11, 0.85, 22));
    }));
    const regiao = (caixa: Caixa) => {
      const col = Math.floor(caixa[0] / g.cellW);
      const r = pes.findIndex((pe) => Math.abs(pe - (caixa[1] + 0.125 * g.cellH)) < 5);
      const v = valores[r]?.[col];
      return v ? [palavraNaFaixa(v, caixa, 0.93)] : [];
    };
    return imagem(linhas, { ...opts, regiao }, 'reels.png');
  };

  it('âncoras da página + segunda passada por célula, ordenada por linha e coluna', async () => {
    const p = await lerPrint(grade([['2.839', '1.782', '1.808'], ['1.244', '798', '1.518'], ['1.566', '2.148', '2.059']], { '0,2': '1.808', '1,1': '798', '2,1': '2.148', '2,2': '2.059' }), HOJE);
    expect(p.tela).toBe('aba_reels');
    expect(p.conta?.valor).toBe('yuriog7');
    expect(p.reels?.map((c) => [c.linha, c.coluna, c.valor])).toEqual([
      [1, 1, 2839], [1, 2, 1782], [1, 3, 1808],
      [2, 1, 1244], [2, 2, 798], [2, 3, 1518],
      [3, 1, 1566], [3, 2, 2148], [3, 3, 2059],
    ]);
    expect(p.avisos).toEqual([]);
    expect(p.precisa_reserva).toBe(false);
  });

  it('página e recorte discordam → confiança cai e vai para a reserva', async () => {
    const p = await lerPrint(grade([['2.839', '1.782', '1.808'], ['1.244', '798', '1.518'], ['1.566', '2.148', '2.059']], { '2,0': '1.586', '2,1': '2.148', '2,2': '2.059' }), HOJE);
    const c = p.reels!.find((c) => c.linha === 3 && c.coluna === 1)!;
    expect(c.valor).toBe(1566);
    expect(c.confianca).toBeLessThan(0.85);
    expect(p.precisa_reserva).toBe(true);
  });

  it('célula visível sem número → grade_incompleta', async () => {
    const p = await lerPrint(grade([['2.839', '', '1.808'], ['1.244', '798', '1.518'], ['1.566', '2.148', '2.059']], { '0,2': '1.808', '1,1': '798' }), HOJE);
    expect(p.avisos).toContain('grade_incompleta');
    expect(p.precisa_reserva).toBe(true);
  });

  it('sem âncora, procura a fase pela luminância das faixas', async () => {
    const valores = [['3.907', '5.179', '1.648'], ['2.208', '2.457', '1.776']];
    const pes = [305 + g.cellH, 305 + 2 * g.cellH];
    const regiao = (caixa: Caixa) => {
      const col = Math.floor(caixa[0] / g.cellW);
      const r = pes.findIndex((pe) => Math.abs(pe - (caixa[1] + 0.125 * g.cellH)) < 0.03 * g.cellH);
      const v = valores[r]?.[col];
      return v ? [palavraNaFaixa(v, caixa, 0.9)] : [];
    };
    const luminancia = (caixa: Caixa) => {
      const perto = pes.some((pe) => Math.abs(pe - (caixa[1] + 0.125 * g.cellH)) < 0.03 * g.cellH);
      return perto ? { media: 0.2, brancos: 0.05 } : { media: 0.5, brancos: 0.3 };
    };
    const p = await lerPrint(imagem([linha('< bigstudiooficial o', 30, 136, 0.9, 26)], { ...opts, regiao, luminancia }, 'r.png'), HOJE);
    expect(p.tela).toBe('aba_reels');
    expect(p.reels?.map((c) => c.valor)).toEqual([3907, 5179, 1648, 2208, 2457, 1776]);
  });

  it('perfil com a aba Reels aberta: cabeçalho e grade no mesmo print', async () => {
    const pe = 785 + g.cellH;
    const linhas = [...perfil(), linha('+ 601 1.081 À', 44, pe - 0.07 * g.cellH - 10, 0.95, 20)];
    const regiao = (caixa: Caixa) => {
      const col = Math.floor(caixa[0] / g.cellW);
      return Math.abs(pe - (caixa[1] + 0.125 * g.cellH)) < 5 ? [palavraNaFaixa(['601', '1.081', '3.959'][col], caixa, 0.92)] : [];
    };
    const p = await lerPrint(imagem(linhas, { ...opts, regiao }), HOJE);
    expect(p.tela).toBe('perfil');
    expect(p.campos.seguidores.valor).toBe(992);
    expect(p.reels?.map((c) => c.valor)).toEqual([601, 1081, 3959]);
    expect(p.precisa_reserva).toBe(false);
  });

  it('grade de posts (sem números) não vira grade de reels', async () => {
    const p = await lerPrint(imagem(perfil(), opts), HOJE);
    expect(p.reels).toBeUndefined();
    expect(p.tela).toBe('perfil');
  });
});

describe('público', () => {
  const publico = (soma = '41,0%') => [
    linha('Principais localizações', 60, 200),
    linha('Cidades Países', 60, 250),
    linha('Recife', 60, 300), linha('18,2%', 900, 300),
    linha('São Paulo', 60, 350), linha('12,5%', 900, 350),
    linha('Faixa etária', 60, 500),
    linha('13-17', 60, 550), linha('1,0%', 900, 550),
    linha('18-24', 60, 600), linha('20,0%', 900, 600),
    linha('25-34', 60, 650), linha(soma, 900, 650),
    linha('35-44', 60, 700), linha('25,0%', 900, 700),
    linha('45-54', 60, 750), linha('8,0%', 900, 750),
    linha('55-64', 60, 800), linha('3,0%', 900, 800),
    linha('65+', 60, 850), linha('2,0%', 900, 850),
    linha('Gênero', 60, 1000),
    linha('Mulheres', 60, 1050), linha('72,5%', 900, 1050),
    linha('Homens', 60, 1100), linha('27,5%', 900, 1100),
  ];

  it('lê cidades, faixas e gênero', async () => {
    const p = await lerPrint(imagem(publico()), HOJE);
    expect(p.tela).toBe('publico');
    expect(p.listas?.cidades?.map((c) => [c.nome, c.pct])).toEqual([['Recife', 18.2], ['São Paulo', 12.5]]);
    expect(p.listas?.faixa_etaria).toHaveLength(7);
    expect(p.listas?.genero?.map((g) => [g.nome, g.pct])).toEqual([['mulheres', 72.5], ['homens', 27.5]]);
    expect(p.precisa_reserva).toBe(false);
  });

  it('faixa etária que não fecha 100% → aviso e reserva', async () => {
    const p = await lerPrint(imagem(publico('11,0%')), HOJE);
    expect(p.avisos).toContain('soma_faixa_etaria_invalida');
    expect(p.precisa_reserva).toBe(true);
  });
});

describe('disputa pelo mesmo número', () => {
  it('dois campos no mesmo número → nenhum é lido', async () => {
    const linhas = [
      linha('Contas com engajamento', 60, 345),
      linha('Interações', 60, 320),
      linha('48,2 mil', 60, 400, 0.97, 30),
      linha('Curtidas', 60, 700),
      linha('Salvamentos', 60, 760),
    ];
    const p = await lerPrint(imagem(linhas), HOJE);
    expect(p.tela).toBe('interacoes');
    expect(p.campos).toEqual({});
    expect(p.precisa_reserva).toBe(true);
  });
});

describe('lerPrints e consolidação', () => {
  const motor = (imagens: Record<string, Imagem>) => async ({ nome }: { nome: string }) => imagens[nome];
  const arq = (nome: string) => ({ nome, dados: new Blob([]) });

  it('junta perfil e painel, guarda a origem e diz o que falta', async () => {
    const { prints, consolidado } = await lerPrints(
      [arq('perfil.png'), arq('inicio.png'), arq('desempenho.png')],
      '@JoelCSLima',
      { ocr: motor({ 'perfil.png': imagem(perfil(), opts, 'perfil.png'), 'inicio.png': imagem(painelInicio(), opts, 'inicio.png'), 'desempenho.png': imagem(painelDesempenho(), opts, 'desempenho.png') }), hoje: HOJE },
    );
    expect(prints.map((p) => p.avisos)).toEqual([[], [], []]);
    expect(prints.every((p) => !p.precisa_reserva)).toBe(true);
    expect(consolidado).toMatchObject({
      conta: 'joelcslima',
      periodo: { dias: 30, inicio: '2026-09-23', fim: '2026-10-22' },
      perfil: { seguidores: 992, publicacoes: 9, seguindo: 1054, seguidores_liquidos: 10 },
      visualizacoes: { total: 8663, visualizadores: 1597, por_formato: { stories: 7400, reels: 857, posts: 94, videos_ao_vivo: 0 } },
      origem: { 'perfil.seguidores': 'perfil.png', 'visualizacoes.total': 'inicio.png' },
      faltando: ['reels'],
    });
  });

  it('conta diferente da cadastrada → aviso; uma letra trocada pelo OCR passa', async () => {
    const lerCom = (cadastro: string) => lerPrints([arq('p.png')], cadastro, { ocr: motor({ 'p.png': imagem(perfil('992', 'vuriog7'), opts, 'p.png') }), hoje: HOJE });
    expect((await lerCom('yuriog7')).prints[0].avisos).toEqual([]);
    expect((await lerCom('maria')).prints[0].avisos).toContain('conta_diferente');
  });

  it('seguidores divergentes entre perfil e painel (tolerância de 1%)', async () => {
    const ler = (seg: string) => lerPrints([arq('p.png'), arq('i.png')], undefined, { ocr: motor({ 'p.png': imagem(perfil(seg), opts, 'p.png'), 'i.png': imagem(painelInicio(), opts, 'i.png') }), hoje: HOJE });
    expect((await ler('995')).prints[0].avisos).toEqual([]);
    expect((await ler('1.200')).prints[0].avisos).toContain('seguidores_divergentes');
  });

  it('resumo "8,7 mil" do perfil contra o total do painel', async () => {
    const linhas = perfil();
    linhas[7] = linha('2 5,1 mil visualizações nos últimos 30 dias.', 55, 567, 0.9, 20);
    const { prints } = await lerPrints([arq('p.png'), arq('i.png')], undefined, { ocr: motor({ 'p.png': imagem(linhas, opts, 'p.png'), 'i.png': imagem(painelInicio(), opts, 'i.png') }), hoje: HOJE });
    expect(prints[1].avisos).toContain('visualizacoes_divergentes');
  });

  it('períodos: datas do painel e "30 dias" do perfil não conflitam', async () => {
    const { prints } = await lerPrints([arq('p.png'), arq('i.png')], undefined, { ocr: motor({ 'p.png': imagem(perfil(), opts, 'p.png'), 'i.png': imagem(painelInicio(), opts, 'i.png') }), hoje: HOJE });
    expect(prints.flatMap((p) => p.avisos)).not.toContain('periodos_diferentes');
  });

  it('não aceita zero prints nem mais de 7', async () => {
    await expect(lerPrints([], undefined, { ocr: motor({}) })).rejects.toThrow(RangeError);
    await expect(lerPrints(Array.from({ length: 8 }, (_, i) => arq(`${i}.png`)), undefined, { ocr: motor({}) })).rejects.toThrow(RangeError);
  });

  it('consolidar ignora campos com confiança baixa', async () => {
    const linhas = painelInicio();
    linhas[5].palavras[0].confianca = 0.6;
    const c = consolidar([await lerPrint(imagem(linhas, opts), HOJE)]);
    expect(c.visualizacoes.total).toBeNull();
    expect(c.perfil.seguidores).toBe(992);
    expect(c.faltando).toEqual(['visualizacoes.total', 'reels']);
  });
});
