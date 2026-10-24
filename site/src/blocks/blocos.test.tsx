import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { blocosVisiveis, projetoSchema, validarProjeto } from '@lib/projeto';
import { Bloco } from './Bloco';
import { PROJETO_DE_EXEMPLO } from './exemplos';
import { REGISTRO } from './registro';

const html = (modo: 'editor' | 'publicado', projeto = PROJETO_DE_EXEMPLO) =>
  renderToStaticMarkup(
    <>
      {projeto.blocos.map((b) => (
        <Bloco key={b.id} bloco={b} modo={modo} />
      ))}
    </>,
  );

describe('projeto de exemplo (modelo Nuvem)', () => {
  it('é um projeto válido para o registro', () => {
    expect(validarProjeto(PROJETO_DE_EXEMPLO, REGISTRO)).toEqual([]);
  });

  it('todo bloco renderiza no servidor com o id da seção', () => {
    const saida = html('editor');
    for (const b of PROJETO_DE_EXEMPLO.blocos) expect(saida).toContain(`bl-${b.tipo}`);
  });

  it('o editor mostra a etiqueta de exemplo; a página publicada não', () => {
    expect(html('editor')).toContain('Exemplo · toque para trocar');
    expect(html('publicado')).not.toContain('Exemplo ·');
  });

  it('o mesmo bloco gera o mesmo texto nos dois modos (só as etiquetas mudam; a página publicada ainda tem o movimento)', () => {
    const soTexto = (s: string) =>
      s
        .replace(/<small class="bl-exemplo">[^<]*<\/small>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ');
    expect(soTexto(html('editor'))).toBe(soTexto(html('publicado')));
  });

  it('cada variação de cada bloco renderiza sem erro', () => {
    for (const d of Object.values(REGISTRO)) {
      for (const v of d.variacoes) {
        const projeto = {
          ...PROJETO_DE_EXEMPLO,
          blocos: [{ id: 'x', tipo: d.tipo, variacao: v.id, oculto: false, dados: {} }],
        };
        expect(() => html('publicado', projeto)).not.toThrow();
        expect(html('publicado', projeto)).toContain(`bl-${d.tipo}--${v.id}`);
      }
    }
  });

  it('modo iniciante esconde Números e Público do exemplo', () => {
    const iniciante = projetoSchema.parse({ ...PROJETO_DE_EXEMPLO, modoIniciante: true });
    const tipos = blocosVisiveis(iniciante, REGISTRO).map((b) => b.tipo);
    expect(tipos).not.toContain('numeros');
    expect(tipos).not.toContain('publico');
    expect(tipos).toContain('capa');
  });
});
