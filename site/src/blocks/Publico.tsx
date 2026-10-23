import { Exemplo } from './Exemplo';
import type { DadosDePublico, PropsDoBloco } from './tipos';

export function Publico({ variacao, dados, modo }: PropsDoBloco<DadosDePublico, 'idade' | 'cidades'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-publico bl-publico--${variacao}`} id="publico">
      {titulo && <h2 className="bl-titulo">{titulo}</h2>}
      {variacao === 'idade' ? (
        <ul className="bl-cards-numero">
          {itens.map((i) => (
            <li key={i.rotulo} className="bl-cartao">
              <b className="bl-numero">{i.valor}</b>
              <span>{i.rotulo}</span>
              <Exemplo ativo={i.exemplo} modo={modo} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="bl-barras">
          {itens.map((i) => (
            <li key={i.rotulo}>
              <p className="bl-barra-rotulo">
                {i.rotulo} <b>{i.valor}</b>
              </p>
              <div className="bl-barra" role="presentation">
                <span style={{ width: `${Math.min(100, Math.max(0, i.proporcao ?? 0))}%` }} />
              </div>
              <Exemplo ativo={i.exemplo} modo={modo} />
            </li>
          ))}
        </ul>
      )}
      {dados.selo && <p className="bl-selo">{dados.selo}</p>}
    </section>
  );
}
