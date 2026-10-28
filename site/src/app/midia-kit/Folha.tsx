// A folha A4 do mídia kit: os blocos do projeto reduzidos até caberem numa página. Usada na tela do editor
// (MidiaKit.tsx, com o rascunho) e na página que o servidor transforma em PDF (KitParaPdf.tsx, com a versão
// publicada, DEV-151).
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Bloco } from '@blocks/Bloco';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis, type Projeto } from '@lib/projeto';
import { temaDoProjeto } from '../editor/tema';
import './midia-kit.css';

/** A4 a 96 dpi */
export const LARGURA = 794;
export const ALTURA = 1123;
/** largura do layout antes de reduzir (as seções foram pensadas para 1000 px, em duas colunas) */
const LAYOUT = 1000;
/** a folha é um resumo de 1 página: o argumento e as etapas ficam só no link */
const NAO_VAI_PARA_O_KIT = new Set(['motivos', 'processo']);

export function Folha({
  projeto,
  marcaDagua,
  tela = 1,
  aoAjustar,
}: {
  projeto: Projeto;
  /** conta sem plano pago: "PORTFÓLIO CREATOR • TESTE" por cima; paga: só o selo no rodapé */
  marcaDagua: boolean;
  /** escala só de visualização (o PDF sai em tamanho real) */
  tela?: number;
  /** chamado quando a escala final foi calculada, com as fontes carregadas */
  aoAjustar?: () => void;
}) {
  const conteudo = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);

  // cabe numa folha só: o layout tem largura fixa (LAYOUT) e é reduzido até caber na largura e na altura do A4,
  // centralizado. Nunca amplia.
  useLayoutEffect(() => {
    const el = conteudo.current;
    if (!el) return;
    // na folha tudo está à vista: as miniaturas que esperariam rolar a página (loading="lazy") carregam já
    el.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
    const ajustar = () => setEscala(Math.min(LARGURA / LAYOUT, ALTURA / el.scrollHeight));
    ajustar();
    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      ajustar();
      aoAjustar?.();
    });
  }, [projeto, aoAjustar]);

  return (
    <div className="mk-vista" style={{ width: LARGURA * tela, height: ALTURA * tela }}>
      <div
        className="mk-folha pagina"
        inert
        style={{
          ...temaDoProjeto(projeto),
          ...({ '--respiro': '20px' } as CSSProperties),
          width: LARGURA,
          height: ALTURA,
          transform: `scale(${tela})`,
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
          {blocosVisiveis(projeto, REGISTRO)
            .filter((b) => !NAO_VAI_PARA_O_KIT.has(b.tipo))
            .map((b) => (
              <Bloco key={b.id} bloco={b} modo="publicado" />
            ))}
        </div>
        {marcaDagua ? (
          <div className="mk-marca" aria-hidden="true">
            PORTFÓLIO CREATOR • TESTE
          </div>
        ) : (
          <p className="mk-selo">Feito com Portfólio Creator</p>
        )}
      </div>
    </div>
  );
}
