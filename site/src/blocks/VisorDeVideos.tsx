import { useCallback, useEffect, useRef, useState } from 'react';
import { posicaoDoFoco } from './foco';

export interface VideoDoVisor {
  video: string;
  capa?: string;
  capa_foco?: string;
  titulo: string;
  visualizacoes?: string;
  marca?: string;
}

const ARRASTE_MINIMO = 50;

/** Visor de vídeos: abre por cima da página quando o visitante toca num vídeo, toca com som (foi ele quem pediu) e
 *  deixa passar para o lado: arrastando, pelas setas, pelo teclado ou pelas miniaturas. Um único `<video>` troca de
 *  endereço, porque o navegador só libera som no elemento que o toque do visitante já ativou. */
export function VisorDeVideos({
  videos,
  inicio,
  aoFechar,
}: {
  videos: VideoDoVisor[];
  inicio: number;
  aoFechar: () => void;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const tira = useRef<HTMLDivElement>(null);
  const toqueInicial = useRef<number | null>(null);
  const [indice, setIndice] = useState(inicio);
  const [tocando, setTocando] = useState(true);
  const [mudo, setMudo] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const atual = videos[indice];

  useEffect(() => {
    const d = dialogo.current;
    const v = video.current;
    if (d && !d.open) d.showModal();
    const rolagem = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = rolagem;
      v?.pause();
    };
  }, []);

  // troca de vídeo: carrega o novo, toca com som e leva a miniatura para a vista
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.load();
    setProgresso(0);
    void v.play().then(
      () => setTocando(true),
      () => setTocando(false), // o navegador recusou tocar sozinho: o toque do visitante resolve
    );
    tira.current
      ?.querySelector('[aria-current="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [indice]);

  const ir = useCallback(
    (novo: number, direcao: number) => {
      if (novo < 0 || novo >= videos.length || novo === indice) return;
      setIndice(novo);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        palco.current?.animate(
          [
            { transform: `translateX(${direcao * 48}px)`, opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)' },
        );
    },
    [indice, videos.length],
  );

  const alternar = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play().then(() => setTocando(true));
    else {
      v.pause();
      setTocando(false);
    }
  };

  return (
    <dialog
      ref={dialogo}
      className="bl-visor"
      aria-label={`Vídeos: ${atual.titulo}`}
      onClose={aoFechar}
      onClick={(e) => e.target === e.currentTarget && dialogo.current?.close()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') ir(indice + 1, 1);
        if (e.key === 'ArrowLeft') ir(indice - 1, -1);
      }}
    >
      <header className="bl-visor-topo">
        <span className="bl-visor-contagem" aria-live="polite">
          {indice + 1} de {videos.length}
        </span>
        <button
          type="button"
          className="bl-visor-botao"
          aria-label="Fechar vídeo"
          onClick={() => dialogo.current?.close()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      <div className="bl-visor-meio">
        <button
          type="button"
          className="bl-visor-seta bl-visor-seta--ant"
          aria-label="Vídeo anterior"
          disabled={indice === 0}
          onClick={() => ir(indice - 1, -1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <div
          ref={palco}
          className="bl-visor-palco"
          onPointerDown={(e) => (toqueInicial.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = e.clientX - (toqueInicial.current ?? e.clientX);
            toqueInicial.current = null;
            if (Math.abs(dx) >= ARRASTE_MINIMO) ir(indice + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
            else alternar();
          }}
          onPointerCancel={() => (toqueInicial.current = null)}
        >
          <video
            ref={video}
            className="bl-visor-video"
            src={atual.video}
            poster={atual.capa}
            muted={mudo}
            playsInline
            loop
            preload="auto"
            aria-label={atual.titulo}
            onTimeUpdate={(e) =>
              setProgresso(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)
            }
            style={{ objectPosition: posicaoDoFoco(atual.capa_foco) }}
          />
          {!tocando && (
            <span className="bl-visor-tocar" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 4.5v15l12-7.5z" />
              </svg>
            </span>
          )}
          <span className="bl-visor-barra" aria-hidden="true">
            <span style={{ transform: `scaleX(${progresso})` }} />
          </span>
        </div>
        <button
          type="button"
          className="bl-visor-seta bl-visor-seta--prox"
          aria-label="Próximo vídeo"
          disabled={indice === videos.length - 1}
          onClick={() => ir(indice + 1, 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="bl-visor-legenda">
        <div>
          <b>{atual.titulo}</b>
          <span>
            {atual.visualizacoes && `${atual.visualizacoes} views`}
            {atual.marca && ` · ${atual.marca}`}
          </span>
        </div>
        <button
          type="button"
          className="bl-visor-botao"
          aria-label={mudo ? 'Ligar o som' : 'Desligar o som'}
          aria-pressed={mudo}
          onClick={() => setMudo(!mudo)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            {mudo ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
        </button>
      </div>

      <div className="bl-visor-tira" ref={tira} role="list" aria-label="Todos os vídeos">
        {videos.map((v, n) => (
          <button
            key={n}
            type="button"
            role="listitem"
            className="bl-visor-mini"
            aria-current={n === indice}
            aria-label={`Ver ${v.titulo}`}
            onClick={() => ir(n, n > indice ? 1 : -1)}
            style={
              v.capa ? { backgroundImage: `url(${v.capa})`, backgroundPosition: posicaoDoFoco(v.capa_foco) } : undefined
            }
          />
        ))}
      </div>
    </dialog>
  );
}
