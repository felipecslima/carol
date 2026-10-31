import { Exemplo } from './Exemplo';
import { Contagem, Item, Lista, Preenche, Revela } from './movimento';
import type { DadosDePublico, PropsDoBloco } from './tipos';

export function Publico({ variacao, dados, modo, ancora }: PropsDoBloco<DadosDePublico, 'idade' | 'cidades'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-publico bl-publico--${variacao}`} id={ancora ?? 'publico'}>
      {titulo && (
        <Revela modo={modo} tag="h2" className="bl-titulo">
          {titulo}
        </Revela>
      )}
      {variacao === 'idade' ? (
        <Lista modo={modo} passo={0.1} className="bl-cards-numero">
          {itens.map((i, n) => (
            <Item modo={modo} key={n} eleva className="bl-cartao">
              <Contagem texto={i.valor} modo={modo} />
              <span>{i.rotulo}</span>
              <Exemplo ativo={i.exemplo} modo={modo} />
            </Item>
          ))}
        </Lista>
      ) : (
        <Lista modo={modo} passo={0.12} className="bl-barras">
          {itens.map((i, n) => (
            <Item modo={modo} key={n}>
              <p className="bl-barra-rotulo">
                {i.rotulo} <b>{i.valor}</b>
              </p>
              <div className="bl-barra" role="presentation">
                <Preenche pct={Math.min(100, Math.max(0, i.proporcao ?? 0))} modo={modo} />
              </div>
              <Exemplo ativo={i.exemplo} modo={modo} />
            </Item>
          ))}
        </Lista>
      )}
      {dados.selo && <p className="bl-selo">{dados.selo}</p>}
    </section>
  );
}
