// Mídia kit em 1 página A4 (DEV-150): os mesmos blocos do projeto, reduzidos até caberem na folha. "Salvar como
// PDF" usa a impressão do navegador por enquanto; o PDF de verdade (marca d'água, arquivo guardado) vem do
// Cloudflare Browser Rendering, a partir desta mesma rota.
import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Bloco } from '@blocks/Bloco';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis } from '@lib/projeto';
import { carregarRascunho } from '../editor/persistencia';
import { temaDoProjeto } from '../editor/tema';
import './midia-kit.css';

/** A4 a 96 dpi */
const LARGURA = 794;
const ALTURA = 1123;
/** largura do layout antes de reduzir (as seções foram pensadas para 1000 px, em duas colunas) */
const LAYOUT = 1000;

export default function MidiaKit() {
  const projeto = useMemo(() => carregarRascunho() ?? PROJETO_DE_EXEMPLO, []);
  const conteudo = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  const marcaDagua = new URLSearchParams(window.location.search).get('marca') !== '0';

  // cabe numa folha só: o layout tem largura fixa (LAYOUT) e é reduzido até caber na largura e na altura do A4,
  // centralizado. Nunca amplia.
  useLayoutEffect(() => {
    const el = conteudo.current;
    if (!el) return;
    const ajustar = () => setEscala(Math.min(LARGURA / LAYOUT, ALTURA / el.scrollHeight));
    ajustar();
    void document.fonts?.ready.then(ajustar);
  }, [projeto]);

  return (
    <div className="mk">
      <div className="mk-barra">
        <a href="/app/editor/">Voltar ao editor</a>
        <button type="button" onClick={() => window.print()}>
          Salvar como PDF
        </button>
      </div>
      <div
        className="mk-folha pagina"
        style={{
          ...temaDoProjeto(projeto),
          ...({ '--respiro': '20px' } as CSSProperties),
          width: LARGURA,
          height: ALTURA,
        }}
      >
        <div
          ref={conteudo}
          className="mk-conteudo"
          style={{
            width: LAYOUT,
            transform: `scale(${escala})`,
            marginLeft: (LARGURA - LAYOUT * escala) / 2,
          }}
        >
          {blocosVisiveis(projeto, REGISTRO).map((b) => (
            <Bloco key={b.id} bloco={b} modo="publicado" />
          ))}
        </div>
        {marcaDagua && (
          <div className="mk-marca" aria-hidden="true">
            PORTFÓLIO CREATOR • TESTE
          </div>
        )}
      </div>
    </div>
  );
}
