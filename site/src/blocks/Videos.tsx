import { Exemplo } from './Exemplo';
import { Item, Lista, Revela } from './movimento';
import { posicaoDoFoco } from './foco';
import { VideoSemSom } from './VideoSemSom';
import type { DadosDeVideos, PropsDoBloco } from './tipos';

export function Videos({ variacao, dados, modo }: PropsDoBloco<DadosDeVideos, 'carrossel' | 'grade' | 'destaque'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-videos bl-videos--${variacao}`} id="videos">
      {titulo && (
        <Revela modo={modo} tag="h2" className="bl-titulo">
          {titulo}
        </Revela>
      )}
      <Lista modo={modo} passo={0.09} className="bl-lista-videos">
        {itens.map((v, n) => (
          <Item
            modo={modo}
            key={n}
            efeito={variacao === 'carrossel' ? 'entrar' : 'surgir'}
            eleva
            className={variacao === 'destaque' && n === 0 ? 'bl-video bl-video--destaque' : 'bl-video'}
          >
            {v.video && modo === 'publicado' ? (
              <VideoSemSom
                src={v.video}
                capa={v.capa}
                titulo={v.titulo}
                posicao={posicaoDoFoco(v.capa_foco)}
                precarregar={variacao === 'destaque' && n === 0 ? 'metadata' : 'none'}
              />
            ) : (
              <div
                className="bl-video-capa"
                role={v.capa ? 'img' : undefined}
                aria-label={v.capa ? v.titulo : undefined}
                style={
                  v.capa
                    ? { backgroundImage: `url(${v.capa})`, backgroundPosition: posicaoDoFoco(v.capa_foco) }
                    : undefined
                }
              />
            )}
            <b>{v.titulo}</b>
            <span>
              {v.visualizacoes && `${v.visualizacoes} views`}
              {v.marca && ` · ${v.marca}`}
            </span>
            <Exemplo ativo={v.exemplo} modo={modo} />
          </Item>
        ))}
      </Lista>
    </section>
  );
}
