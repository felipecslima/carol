import { describe, expect, it } from 'vitest';
import { REGISTRO } from '../blocks/registro';
import { blocosVisiveis, MAXIMO_DE_BLOCOS, projetoSchema, validarProjeto } from './projeto';

const base = {
  tipo: 'site',
  modelo: 'nuvem',
  paleta: 0,
  fontes: 'par-1',
  cantos: 'suaves',
  modoIniciante: false,
  blocos: [
    { id: 'b1', tipo: 'capa', variacao: 'foto-grande', oculto: false, dados: { titulo: 'Oi' } },
    { id: 'b2', tipo: 'numeros', variacao: 'cards', oculto: false, dados: {} },
    {
      id: 'b3',
      tipo: 'contato',
      variacao: 'botoes',
      oculto: false,
      dados: { titulo: 'Fale comigo', whatsapp: '11999999999', email: 'a@b.com' },
    },
  ],
  guardados: [],
};
const com = (mudanca: object) => ({ ...base, ...mudanca });

describe('registro de blocos', () => {
  it('lista os 11 blocos, cada um com variação e tipo igual à chave', () => {
    expect(Object.keys(REGISTRO)).toHaveLength(11);
    for (const [chave, d] of Object.entries(REGISTRO)) {
      expect(d.tipo).toBe(chave);
      expect(d.variacoes.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('Capa e Contato são fixos; Números, Marcas e Público somem no modo iniciante', () => {
    expect(
      Object.values(REGISTRO)
        .filter((d) => d.fixo)
        .map((d) => d.tipo)
        .sort(),
    ).toEqual(['capa', 'contato']);
    expect(
      Object.values(REGISTRO)
        .filter((d) => d.ocultoNoModoIniciante)
        .map((d) => d.tipo)
        .sort(),
    ).toEqual(['marcas', 'numeros', 'publico']);
  });
});

describe('validarProjeto', () => {
  it('aceita um projeto válido', () => {
    expect(validarProjeto(base, REGISTRO)).toEqual([]);
  });

  it('recusa forma errada', () => {
    expect(validarProjeto({ ...base, tipo: 'outro' }, REGISTRO)[0]?.onde).toBe('projeto');
  });

  it('recusa bloco ou variação desconhecidos e ids repetidos', () => {
    const blocos = [
      ...base.blocos,
      { id: 'b1', tipo: 'inexistente', variacao: 'x', oculto: false, dados: {} },
      { id: 'b9', tipo: 'videos', variacao: 'nao-existe', oculto: false, dados: {} },
    ];
    const msgs = validarProjeto(com({ blocos }), REGISTRO).map((p) => p.mensagem);
    expect(msgs).toContain('Id repetido');
    expect(msgs).toContain('Bloco desconhecido: inexistente');
    expect(msgs).toContain('Variação desconhecida: nao-existe');
  });

  it('respeita o limite de letras e a obrigatoriedade', () => {
    const blocos = structuredClone(base.blocos);
    blocos[0]!.dados = { titulo: 'x'.repeat(91) };
    blocos[2]!.dados = { titulo: 'ok', whatsapp: '', email: 'a@b.com' };
    const problemas = validarProjeto(com({ blocos }), REGISTRO);
    expect(problemas.find((p) => p.onde === 'b1')?.mensagem).toContain('No máximo 90 letras');
    expect(problemas.find((p) => p.onde === 'b3')?.mensagem).toContain('Campo obrigatório');
  });

  it('recusa campo que o bloco não tem', () => {
    const blocos: Array<{ id: string; tipo: string; variacao: string; oculto: boolean; dados: object }> =
      structuredClone(base.blocos);
    blocos[0]!.dados = { titulo: 'Oi', inventado: 'x' };
    expect(validarProjeto(com({ blocos }), REGISTRO).some((p) => p.onde === 'b1')).toBe(true);
  });

  it('Capa e Contato precisam existir e ficar visíveis', () => {
    const semCapa = com({ blocos: base.blocos.filter((b) => b.tipo !== 'capa') });
    expect(validarProjeto(semCapa, REGISTRO).map((p) => p.mensagem)).toContain('Falta o bloco Capa');
    const contatoOculto = com({ blocos: base.blocos.map((b) => (b.tipo === 'contato' ? { ...b, oculto: true } : b)) });
    expect(validarProjeto(contatoOculto, REGISTRO).map((p) => p.mensagem)).toContain(
      'Contato não pode ficar escondido',
    );
  });

  it('limita a 15 blocos', () => {
    const blocos = Array.from({ length: MAXIMO_DE_BLOCOS + 1 }, (_, i) => ({ ...base.blocos[1]!, id: `n${i}` }));
    expect(projetoSchema.safeParse(com({ blocos })).success).toBe(false);
  });
});

describe('blocosVisiveis', () => {
  it('modo iniciante esconde Números; blocos ocultos nunca aparecem', () => {
    const projeto = projetoSchema.parse(com({ modoIniciante: true }));
    expect(blocosVisiveis(projeto, REGISTRO).map((b) => b.tipo)).toEqual(['capa', 'contato']);
    const normal = projetoSchema.parse(
      com({ blocos: base.blocos.map((b) => (b.id === 'b2' ? { ...b, oculto: true } : b)) }),
    );
    expect(blocosVisiveis(normal, REGISTRO).map((b) => b.id)).toEqual(['b1', 'b3']);
  });
});
