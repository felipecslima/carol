// Revisão final: o que impede de publicar (vermelho) e o que ela pode ignorar (amarelo). Cada alerta leva ao bloco.
import { useState } from 'react';
import type { Projeto } from '@lib/projeto';
import { podePublicar, type Alerta } from '@lib/revisao';
import { normalizarSlug, problemaDoSlug, sugerirSlugs } from '@lib/slug';
import { publicar, type RespostaDePublicar } from '../nuvem';

export function PainelRevisao({
  alertas,
  aoIr,
  link,
  arroba,
  aoMudarLink,
  projeto,
  donoId,
}: {
  alertas: Alerta[];
  aoIr: (bloco: string) => void;
  link: string;
  /** do @ da capa; base das sugestões */
  arroba: string;
  aoMudarLink: (link: string) => void;
  projeto: Projeto;
  /** sem conta (null) o rascunho fica só no aparelho e não dá para publicar */
  donoId: string | null;
}) {
  const [enviando, setEnviando] = useState(false);
  const [resposta, setResposta] = useState<RespostaDePublicar | null>(null);
  const ok = podePublicar(alertas);
  const problema = link ? problemaDoSlug(link) : null;
  const pronto = ok && Boolean(link) && !problema;
  const motivo = !donoId
    ? 'Para publicar, entre na sua conta.'
    : !link
      ? 'Escolha o seu link para publicar.'
      : problema
        ? 'Corrija o link para publicar.'
        : !ok
          ? 'Resolva os pontos em vermelho para publicar.'
          : null;

  async function aoPublicar() {
    if (!donoId || !pronto) return;
    setEnviando(true);
    setResposta(await publicar(donoId, projeto, link));
    setEnviando(false);
  }
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
      {resposta?.ok ? (
        <div className="ed-ok" role="status">
          {resposta.estado === 'no_ar' ? (
            <>
              <p>Seu portfólio está no ar.</p>
              <a href={`/c/${resposta.slug}/`} target="_blank" rel="noopener">
                {window.location.origin}/c/{resposta.slug}/
              </a>
            </>
          ) : (
            <>
              <p>Pedido enviado. Seu link está reservado:</p>
              <b>/c/{resposta.slug}</b>
              <p>
                A equipe te chama no WhatsApp com o link de pagamento. Assim que for confirmado, o portfólio vai ao ar
                sozinho. Enquanto isso, você pode continuar ajustando.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {resposta && !resposta.ok && (
            <p className="ed-aviso" role="alert">
              {resposta.erro}
            </p>
          )}
          {!donoId ? (
            <a className="ed-primario" href="/app/entrar/">
              Entrar para publicar
            </a>
          ) : (
            <button
              type="button"
              className="ed-primario"
              disabled={!pronto || enviando}
              onClick={() => void aoPublicar()}
            >
              {enviando ? 'Publicando…' : 'Publicar'}
            </button>
          )}
          {motivo && <p className="ed-dica">{motivo}</p>}
        </>
      )}
    </div>
  );
}
