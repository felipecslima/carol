import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Exemplo } from './Exemplo';
import { posicaoDoFoco } from './foco';
import { BotaoVivo, m, Palavras, usePralaxe } from './movimento';
import type { DadosDaCapa, ModoDeRender, PropsDoBloco } from './tipos';

type VariacaoDaCapa = 'foto-grande' | 'foto-redonda' | 'fundo';

export function Capa({ variacao, dados, modo }: PropsDoBloco<DadosDaCapa, VariacaoDaCapa>) {
  const { titulo, subtitulo, arroba, foto, botao, fundo, video_fundo, foto_foco, fundo_foco, veu, usar } = dados;
  const secao = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(true);
  const deslocamento = usePralaxe(secao);
  const posFoto = posicaoDoFoco(foto_foco);
  const posFundo = posicaoDoFoco(fundo_foco);
  const vivo = modo === 'publicado';
  // na página publicada o vídeo de fundo só começa a baixar depois que a página monta: até lá aparece o pôster (a
  // imagem do fundo), que é o maior elemento da primeira tela e não disputa a internet com o vídeo (DEV-146)
  useEffect(() => {
    const v = video.current;
    if (!vivo || !v || !video_fundo || v.getAttribute('src') === video_fundo) return;
    v.src = video_fundo;
    void v.play().catch(() => undefined);
  }, [vivo, video_fundo]);

  // entrada em CSS (blocos.css), não em JavaScript: na página publicada a capa aparece e anima já no primeiro desenho,
  // sem esperar o JS chegar pelo 4G (DEV-146). No editor não anima.
  const surgir = (i: number) =>
    vivo
      ? { className: 'bl-surgir', style: { '--i': i } as CSSProperties }
      : { className: undefined, style: undefined };
  const texto = (
    <div className="bl-capa-texto">
      {arroba && (
        <p className={['bl-etiqueta', surgir(0).className].filter(Boolean).join(' ')} style={surgir(0).style}>
          {arroba}
        </p>
      )}
      <Palavras texto={titulo ?? ''} modo={modo} className="bl-titulo-grande" />
      {subtitulo && (
        <p className={['bl-texto', surgir(2).className].filter(Boolean).join(' ')} style={surgir(2).style}>
          {subtitulo}
        </p>
      )}
      {botao && (
        <div {...surgir(3)}>
          <BotaoVivo modo={modo} className="bl-botao" href="#contato">
            {botao}
          </BotaoVivo>
        </div>
      )}
    </div>
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
            src={vivo ? undefined : video_fundo}
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
  // entrada em CSS, como o texto da capa (DEV-146)
  const entrada = variacao === 'foto-redonda' ? 'bl-entrada-redonda' : 'bl-entrada-cortina';
  return (
    <div {...props} className={`${props.className} ${entrada}`}>
      {conteudo}
    </div>
  );
}
