import { useEffect, useRef, useState } from 'react';

/** Vídeo de portfólio: na página, sempre mudo, em loop e tocando sozinho, sem controle de volume (nenhuma marca é
 *  surpreendida por som; o som só existe no visor, que o visitante abre tocando). Só toca enquanto aparece na tela, para não baixar 6 vídeos de uma vez no 4G, e quem pede menos movimento
 *  vê só a capa. O botão pausa e retoma, para quem não quer o movimento. */
export function VideoSemSom({
  src,
  capa,
  titulo,
  posicao,
  precarregar = 'metadata',
  aoAbrir,
}: {
  src: string;
  capa?: string;
  titulo: string;
  /** object-position do enquadramento escolhido pela creator */
  posicao?: string;
  precarregar?: 'none' | 'metadata';
  /** tocar no vídeo abre o visor, com som */
  aoAbrir?: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [pausado, setPausado] = useState(false);
  const pausadoPelaPessoa = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.muted = true; // alguns navegadores só liberam o autoplay com o atributo ligado também na propriedade
    const obs = new IntersectionObserver(
      ([visto]) => {
        if (!visto) return;
        if (visto.isIntersecting && !pausadoPelaPessoa.current) void v.play().catch(() => undefined);
        else if (!visto.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bl-video-moldura">
      <video
        ref={video}
        className="bl-video-capa"
        src={src}
        poster={capa}
        style={{ objectPosition: posicao }}
        muted
        loop
        playsInline
        preload={precarregar}
        aria-label={titulo}
      />
      {aoAbrir && (
        <button type="button" className="bl-video-abrir" aria-label={`Assistir com som: ${titulo}`} onClick={aoAbrir}>
          <span className="bl-video-som" aria-hidden="true">
            Com som
          </span>
        </button>
      )}
      <button
        type="button"
        className="bl-video-pausa"
        data-pausado={pausado || undefined}
        aria-label={`${pausado ? 'Tocar' : 'Pausar'} vídeo: ${titulo}`}
        onClick={() => {
          const v = video.current;
          if (!v) return;
          if (v.paused) {
            pausadoPelaPessoa.current = false;
            void v.play();
            setPausado(false);
          } else {
            pausadoPelaPessoa.current = true;
            v.pause();
            setPausado(true);
          }
        }}
      />
    </div>
  );
}
