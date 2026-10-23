import { Exemplo } from './Exemplo';
import type { DadosDeVideos, PropsDoBloco } from './tipos';

export function Videos({ variacao, dados, modo }: PropsDoBloco<DadosDeVideos, 'carrossel' | 'grade'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-videos bl-videos--${variacao}`} id="videos">
      {titulo && <h2 className="bl-titulo">{titulo}</h2>}
      <ul className="bl-lista-videos">
        {itens.map((v, n) => (
          <li key={n} className="bl-video">
            {v.video && modo === 'publicado' ? (
              <video
                className="bl-video-capa"
                src={v.video}
                poster={v.capa}
                controls
                playsInline
                preload="none"
                aria-label={v.titulo}
              />
            ) : (
              <div
                className="bl-video-capa"
                role={v.capa ? 'img' : undefined}
                aria-label={v.capa ? v.titulo : undefined}
                style={v.capa ? { backgroundImage: `url(${v.capa})` } : undefined}
              />
            )}
            <b>{v.titulo}</b>
            <span>
              {v.visualizacoes && `${v.visualizacoes} views`}
              {v.marca && ` · ${v.marca}`}
            </span>
            <Exemplo ativo={v.exemplo} modo={modo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
