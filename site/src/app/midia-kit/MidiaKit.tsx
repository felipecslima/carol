// Mídia kit em 1 página A4 (DEV-150): os mesmos blocos do projeto, reduzidos até caberem na folha. "Salvar como
// PDF" usa a impressão do navegador por enquanto; o PDF de verdade (marca d'água, arquivo guardado) vem do
// Cloudflare Browser Rendering, a partir desta mesma rota. Marca d'água de teste até pagar um plano; pago, sai o
// selo discreto (DEV-152). Aqui é só a tela: a garantia de verdade vem com o PDF gerado no servidor (DEV-151).
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Bloco } from '@blocks/Bloco';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis } from '@lib/projeto';
import { carregarRascunho } from '../editor/persistencia';
import { temaDoProjeto } from '../editor/tema';
import { carregarAcesso } from '../nuvem';
import { useSessao } from '../sessao';
import './midia-kit.css';
import '../tema.css';

/** A4 a 96 dpi */
const LARGURA = 794;
const ALTURA = 1123;
/** largura do layout antes de reduzir (as seções foram pensadas para 1000 px, em duas colunas) */
const LAYOUT = 1000;
/** a folha é um resumo de 1 página: o argumento e as etapas ficam só no link */
const NAO_VAI_PARA_O_KIT = new Set(['motivos', 'processo']);

export default function MidiaKit() {
  const projeto = useMemo(() => carregarRascunho() ?? PROJETO_DE_EXEMPLO, []);
  const conteudo = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  // escala só de visualização: a folha cabe na largura da tela (no celular fica pequena; o PDF sai em tamanho real)
  const [tela, setTela] = useState(() => Math.min(1, (window.innerWidth - 32) / LARGURA));
  useEffect(() => {
    const aoRedimensionar = () => setTela(Math.min(1, (window.innerWidth - 32) / LARGURA));
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, []);
  // sem conta ou sem pagamento: marca d'água. Enquanto carrega, também (nunca mostra a versão paga por engano)
  const sessao = useSessao();
  const [pago, setPago] = useState(false);
  useEffect(() => {
    if (!sessao) return;
    let vivo = true;
    void carregarAcesso().then((a) => vivo && setPago(Boolean(a?.pago)));
    return () => {
      vivo = false;
    };
  }, [sessao]);
  const marcaDagua = !pago;

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
    </div>
  );
}
