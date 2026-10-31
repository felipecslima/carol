// Liberar a edição depois do prazo (DEV-193): assinatura mensal, anual ou 30 dias avulsos. Abre o pedido; a equipe
// manda o link de pagamento pelo WhatsApp e, quando marca como pago, a edição volta sozinha.
import { useState } from 'react';
import { PLANOS_DE_EDICAO, type IdDoPlano } from '@lib/planos';
import { AceiteDosTermos, EscolhaDePlano } from '../EscolhaDePlano';
import { pedirEdicao } from '../nuvem';

export function LiberarEdicao({ jaPedida }: { jaPedida: boolean }) {
  const [plano, setPlano] = useState<IdDoPlano>('atualizacao-mensal');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(jaPedida);

  async function aoPedir() {
    setEnviando(true);
    setErro(null);
    const falha = await pedirEdicao(plano);
    setEnviando(false);
    if (falha) setErro(falha);
    else setEnviado(true);
  }

  return (
    <section className="ar-liberar" id="liberar-edicao" aria-label="Liberar a edição">
      {enviado ? (
        <p className="ed-ok" role="status">
          Pedido de liberação enviado. A equipe te chama no WhatsApp com o link de pagamento; assim que for confirmado,
          a edição volta sozinha.
        </p>
      ) : (
        <>
          <EscolhaDePlano
            legenda="Escolha como liberar a edição"
            nome="plano-de-edicao"
            planos={PLANOS_DE_EDICAO}
            valor={plano}
            aoMudar={setPlano}
          />
          {erro && (
            <p className="ed-aviso" role="alert">
              {erro}
            </p>
          )}
          <p className="ed-dica">
            Nada é cobrado agora. A equipe te chama no WhatsApp com o link de pagamento; quando for confirmado, a edição
            volta sozinha.
          </p>
          <AceiteDosTermos acao="Ao pedir a liberação" />
          <button type="button" className="ed-primario ar-botao" disabled={enviando} onClick={() => void aoPedir()}>
            {enviando ? 'Enviando…' : 'Pedir a liberação'}
          </button>
        </>
      )}
    </section>
  );
}
