// Miniatura do portfólio: a capa de verdade, num quadro fixo de 390 px (como num celular) reduzido para caber no espaço
// que houver, em qualquer largura de tela. Só para ver: nada nela é clicável.
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Bloco } from '@blocks/Bloco';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis, type Projeto } from '@lib/projeto';
import { temaDoProjeto } from '../editor/tema';

/** largura do quadro "celular" que é reduzido */
const LARGURA_DO_QUADRO = 390;

/** Reduz o quadro até a largura do espaço onde a miniatura mora (ResizeObserver: acompanha a janela). */
export function Miniatura({ projeto, blocos = ['capa'] }: { projeto: Projeto; blocos?: string[] }) {
  const moldura = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(0.3);
  useLayoutEffect(() => {
    const el = moldura.current;
    if (!el) return;
    const medir = () => setEscala(el.clientWidth / LARGURA_DO_QUADRO);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const mostrar = blocosVisiveis(projeto, REGISTRO).filter((b) => blocos.includes(b.tipo));
  return (
    <div ref={moldura} className="ar-miniatura" aria-hidden="true" inert>
      <div
        className="mini-tela pagina"
        style={{ ...temaDoProjeto(projeto), width: LARGURA_DO_QUADRO, transform: `scale(${escala})` } as CSSProperties}
      >
        {mostrar.map((b) => (
          <Bloco key={b.id} bloco={b} modo="publicado" />
        ))}
      </div>
    </div>
  );
}
