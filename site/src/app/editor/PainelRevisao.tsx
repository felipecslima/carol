// Revisão final: o que impede de publicar (vermelho) e o que ela pode ignorar (amarelo). Cada alerta leva ao bloco.
import { podePublicar, type Alerta } from '@lib/revisao';

export function PainelRevisao({ alertas, aoIr }: { alertas: Alerta[]; aoIr: (bloco: string) => void }) {
  const ok = podePublicar(alertas);
  return (
    <div className="ed-form">
      {alertas.length === 0 ? (
        <p className="ed-ok">Tudo certo. Seu portfólio está pronto para publicar.</p>
      ) : (
        <>
          <p className={ok ? 'ed-ok' : 'ed-aviso'}>
            {ok ? 'Pode publicar. Estes pontos são só sugestões:' : 'Antes de publicar, resolva os pontos em vermelho:'}
          </p>
          <ul className="ed-alertas">
            {alertas.map((a, i) => (
              <li key={i} className={`ed-alerta ed-alerta--${a.gravidade}`}>
                <span>
                  <b>{a.gravidade === 'vermelho' ? 'Resolver' : 'Sugestão'}</b>
                  {a.mensagem}
                </span>
                {a.bloco && (
                  <button type="button" className="ed-botao-claro" onClick={() => aoIr(a.bloco!)}>
                    Ir para a seção
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <a className="ed-botao-claro" href="/app/midia-kit/">
        Ver mídia kit em PDF
      </a>
      <button type="button" className="ed-primario" disabled>
        Publicar (em breve)
      </button>
      <p className="ed-dica">A publicação chega junto com a conta e o link do seu portfólio.</p>
    </div>
  );
}
