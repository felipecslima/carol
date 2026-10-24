import { useRef, useState } from 'react';
import { Exemplo } from './Exemplo';
import { posicaoDoFoco } from './foco';
import type { DadosDaCapa, PropsDoBloco } from './tipos';

type VariacaoDaCapa = 'foto-grande' | 'foto-redonda' | 'fundo';

export function Capa({ variacao, dados, modo }: PropsDoBloco<DadosDaCapa, VariacaoDaCapa>) {
  const { titulo, subtitulo, arroba, foto, botao, fundo, video_fundo, foto_foco, fundo_foco } = dados;
  const posFoto = posicaoDoFoco(foto_foco);
  const posFundo = posicaoDoFoco(fundo_foco);
  const video = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(true);

  const texto = (
    <div className="bl-capa-texto">
      {arroba && <p className="bl-etiqueta">{arroba}</p>}
      <h1 className="bl-titulo-grande">{titulo}</h1>
      {subtitulo && <p className="bl-texto">{subtitulo}</p>}
      {botao && (
        <a className="bl-botao" href="#contato">
          {botao}
        </a>
      )}
    </div>
  );

  // foto ou vídeo ocupando a capa inteira; o véu escuro garante o contraste do texto em qualquer imagem
  if (variacao === 'fundo') {
    const temVideo = Boolean(video_fundo) && modo === 'publicado';
    return (
      <section className="bl bl-capa bl-capa--fundo">
        <div
          className="bl-capa-fundo"
          aria-hidden="true"
          style={fundo ? { backgroundImage: `url(${fundo})`, backgroundPosition: posFundo } : undefined}
        />
        {temVideo && (
          <video
            ref={video}
            className="bl-capa-video"
            src={video_fundo}
            poster={fundo}
            style={{ objectPosition: posFundo }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        {texto}
        {temVideo && (
          <button
            type="button"
            className="bl-capa-pausa"
            onClick={() => {
              const v = video.current;
              if (!v) return;
              if (v.paused) void v.play();
              else v.pause();
              setTocando(!v.paused);
            }}
          >
            {tocando ? 'Pausar vídeo' : 'Tocar vídeo'}
          </button>
        )}
        <Exemplo ativo={(!fundo && !video_fundo) || !titulo} modo={modo} />
      </section>
    );
  }

  return (
    <section className={`bl bl-capa bl-capa--${variacao}`}>
      <div
        className="bl-capa-foto"
        role={foto ? 'img' : undefined}
        style={foto ? { backgroundImage: `url(${foto})`, backgroundPosition: posFoto } : undefined}
      >
        {!foto && <span className="bl-capa-vazia" aria-hidden="true" />}
      </div>
      {texto}
      <Exemplo ativo={!foto || !titulo} modo={modo} />
    </section>
  );
}
