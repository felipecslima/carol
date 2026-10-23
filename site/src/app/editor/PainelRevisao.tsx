// Revisão final: o que impede de publicar (vermelho) e o que ela pode ignorar (amarelo). Cada alerta leva ao bloco.
import { podePublicar, type Alerta } from '@lib/revisao';
import { normalizarSlug, problemaDoSlug, sugerirSlugs } from '@lib/slug';

export function PainelRevisao({
  alertas,
  aoIr,
  link,
  arroba,
  aoMudarLink,
}: {
  alertas: Alerta[];
  aoIr: (bloco: string) => void;
  link: string;
  /** do @ da capa; base das sugestões */
  arroba: string;
  aoMudarLink: (link: string) => void;
}) {
  const ok = podePublicar(alertas);
  const problema = link ? problemaDoSlug(link) : null;
  const sugestoes = sugerirSlugs('', arroba).filter((x) => x !== link);
  return (
    <div className="ed-form">
      <div className="ed-campo">
        <label htmlFor="link-do-portfolio">Seu link</label>
        <div className="ed-link-campo">
          <span>/c/</span>
          <input
            id="link-do-portfolio"
            type="text"
            value={link}
            maxLength={30}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => aoMudarLink(normalizarSlug(e.target.value))}
            aria-invalid={problema ? true : undefined}
            aria-describedby="link-ajuda"
          />
        </div>
        <span id="link-ajuda" className={problema ? 'ed-erro' : 'ed-dica'}>
          {problema ??
            (link
              ? 'Formato certo. Vemos se está livre quando você publicar.'
              : 'Letras, números e hífen. É o que você coloca na bio.')}
        </span>
        {sugestoes.length > 0 && (
          <div className="ed-sugestoes" role="group" aria-label="Sugestões de link">
            {sugestoes.map((x) => (
              <button key={x} type="button" className="ed-botao-claro" onClick={() => aoMudarLink(x)}>
                {x}
              </button>
            ))}
          </div>
        )}
      </div>

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
