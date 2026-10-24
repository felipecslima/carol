import { useRef, useState, type CSSProperties } from 'react';
import { Exemplo } from './Exemplo';
import { posicaoDoFoco } from './foco';
import { BotaoVivo, m, Palavras, usePralaxe } from './movimento';
import type { DadosDaCapa, ModoDeRender, PropsDoBloco } from './tipos';

type VariacaoDaCapa = 'foto-grande' | 'foto-redonda' | 'fundo';

const SUAVE = [0.22, 1, 0.36, 1] as const;
const surgir = {
  oculto: { opacity: 0, y: 16 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SUAVE } },
};

export function Capa({ variacao, dados, modo }: PropsDoBloco<DadosDaCapa, VariacaoDaCapa>) {
  const { titulo, subtitulo, arroba, foto, botao, fundo, video_fundo, foto_foco, fundo_foco, veu, usar } = dados;
  const secao = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(true);
  const deslocamento = usePralaxe(secao);
  const posFoto = posicaoDoFoco(foto_foco);
  const posFundo = posicaoDoFoco(fundo_foco);
  const vivo = modo === 'publicado';

  const texto = (
    <m.div
      className="bl-capa-texto"
      initial={vivo ? 'oculto' : false}
      animate="visivel"
      variants={{ oculto: {}, visivel: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
    >
      {arroba && (
        <m.p className="bl-etiqueta" variants={surgir}>
          {arroba}
        </m.p>
      )}
      <Palavras texto={titulo ?? ''} modo={modo} className="bl-titulo-grande" />
      {subtitulo && (
        <m.p className="bl-texto" variants={surgir}>
          {subtitulo}
        </m.p>
      )}
      {botao && (
        <m.div variants={surgir}>
          <BotaoVivo modo={modo} className="bl-botao" href="#contato">
            {botao}
          </BotaoVivo>
        </m.div>
      )}
    </m.div>
  );

  // foto ou vídeo ocupando a capa inteira; o véu escuro garante o contraste do texto em qualquer imagem.
  // Na página, o fundo se move mais devagar que o texto ao rolar (paralaxe): por isso ele é mais alto que a seção.
  if (variacao === 'fundo') {
    const temVideo = Boolean(video_fundo) && usar !== 'imagem';
    const paralaxe: CSSProperties = { top: '-16%', height: '116%' };
    return (
      <section
        ref={secao}
        className="bl bl-capa bl-capa--fundo"
        style={veu === undefined ? undefined : ({ '--veu': Math.max(0, Math.min(100, veu)) / 60 } as CSSProperties)}
      >
        <m.div
          className="bl-capa-fundo"
          aria-hidden="true"
          style={{
            ...(fundo ? { backgroundImage: `url(${fundo})`, backgroundPosition: posFundo } : {}),
            ...(vivo ? { ...paralaxe, y: deslocamento } : {}),
          }}
        />
        {temVideo && (
          <m.video
            ref={video}
            className="bl-capa-video"
            src={video_fundo}
            poster={fundo}
            style={{ objectPosition: posFundo, ...(vivo ? { ...paralaxe, y: deslocamento } : {}) }}
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
    <section ref={secao} className={`bl bl-capa bl-capa--${variacao}`}>
      <FotoDaCapa modo={modo} variacao={variacao} foto={foto} posicao={posFoto} />
      {texto}
      <Exemplo ativo={!foto || !titulo} modo={modo} />
    </section>
  );
}

/** A foto redonda entra com uma mola curta; a foto grande se revela de baixo para cima. */
function FotoDaCapa({
  modo,
  variacao,
  foto,
  posicao,
}: {
  modo: ModoDeRender;
  variacao: VariacaoDaCapa;
  foto?: string;
  posicao?: string;
}) {
  const props = {
    className: 'bl-capa-foto',
    role: foto ? ('img' as const) : undefined,
    style: foto ? { backgroundImage: `url(${foto})`, backgroundPosition: posicao } : undefined,
  };
  const conteudo = !foto && <span className="bl-capa-vazia" aria-hidden="true" />;
  if (modo === 'editor') return <div {...props}>{conteudo}</div>;
  return variacao === 'foto-redonda' ? (
    <m.div
      {...props}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
    >
      {conteudo}
    </m.div>
  ) : (
    <m.div
      {...props}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      transition={{ duration: 0.95, ease: SUAVE }}
    >
      {conteudo}
    </m.div>
  );
}
