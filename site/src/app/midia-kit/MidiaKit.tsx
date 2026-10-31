// Mídia kit em 2 páginas A4 (DEV-150, DEV-154), na tela do editor: as folhas com o rascunho deste aparelho. Marca d'água de teste
// até pagar um plano; pago, sai o selo discreto (DEV-152). "Salvar como PDF" usa a impressão do navegador; o PDF
// guardado de verdade sai da versão publicada, no servidor (KitParaPdf.tsx, DEV-151).
import { useEffect, useMemo, useState } from 'react';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { carregarRascunho } from '../editor/persistencia';
import { carregarAcesso } from '../nuvem';
import { useSessao } from '../sessao';
import { Folha, LARGURA } from './Folha';
import '../tema.css';

export default function MidiaKit() {
  const projeto = useMemo(() => carregarRascunho() ?? PROJETO_DE_EXEMPLO, []);
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

  return (
    <div className="mk">
      <div className="mk-barra">
        <a href="/app/editor/">Voltar ao editor</a>
        <button type="button" onClick={() => window.print()}>
          Salvar como PDF
        </button>
      </div>
      <Folha projeto={projeto} marcaDagua={!pago} tela={tela} />
    </div>
  );
}
