import { describe, expect, it } from 'vitest';
import { aplicarTema, estiloInline, variaveisDeTema } from './aplicar';
import { gerarPaleta } from './paleta';
import { CANTOS, FONTES, RESPIRO, type EstiloGlobal } from './tokens';

const ESTILO: EstiloGlobal = { fontes: 'par-1', cantos: 'suaves', respiro: 'normal', ornamento: 'nenhum' };

// elemento falso: só guarda o que for escrito em style.setProperty
function elementoFalso() {
  const props: Record<string, string> = {};
  return {
    props,
    el: { style: { setProperty: (n: string, v: string) => void (props[n] = v) } } as unknown as HTMLElement,
  };
}

describe('aplicarTema', () => {
  it('escreve papéis de cor e tokens de estilo como variáveis CSS', () => {
    const { el, props } = elementoFalso();
    const paleta = gerarPaleta('#d42a5b');
    aplicarTema(el, paleta, ESTILO, 'claro');
    expect(props['--destaque']).toBe(paleta.claro.destaque);
    expect(props['--fundo']).toBe(paleta.claro.fundo);
    expect(props['--raio']).toBe(CANTOS.suaves['--raio']);
    expect(props['--respiro']).toBe(RESPIRO.normal['--respiro']);
    expect(props['--fonte-titulo']).toBe(FONTES['par-1']['--fonte-titulo']);
  });

  it('trocar a cor recalcula as variáveis sem tocar no estilo', () => {
    const { el, props } = elementoFalso();
    aplicarTema(el, gerarPaleta('#d42a5b'), ESTILO, 'claro');
    const antes = { ...props };
    aplicarTema(el, gerarPaleta('#0b4a35'), ESTILO, 'claro');
    expect(props['--destaque']).not.toBe(antes['--destaque']);
    expect(props['--raio']).toBe(antes['--raio']);
  });

  it('modo escuro usa os papéis escuros', () => {
    const paleta = gerarPaleta('#d42a5b');
    expect(variaveisDeTema(paleta, ESTILO, 'escuro')['--fundo']).toBe(paleta.escuro.fundo);
  });

  it('estiloInline tem as mesmas variáveis do aplicarTema', () => {
    const paleta = gerarPaleta('#d42a5b');
    const css = estiloInline(paleta, ESTILO, 'claro');
    for (const [nome, valor] of Object.entries(variaveisDeTema(paleta, ESTILO, 'claro')))
      expect(css).toContain(`${nome}:${valor}`);
  });
});
