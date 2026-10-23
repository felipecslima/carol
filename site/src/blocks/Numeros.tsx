import { Exemplo } from './Exemplo';
import type { DadosDeNumeros, PropsDoBloco } from './tipos';

export function Numeros({ variacao, dados, modo }: PropsDoBloco<DadosDeNumeros, 'cards' | 'barras'>) {
  const itens = dados.itens ?? [];
  if (variacao === 'barras') {
    return (
      <section className="bl bl-numeros bl-numeros--barras" id="numeros">
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
        {dados.selo && <p className="bl-selo">{dados.selo}</p>}
      </section>
    );
  }
  return (
    <section className="bl bl-numeros bl-numeros--cards" id="numeros">
      <ul className="bl-cards-numero">
        {itens.map((i) => (
          <li key={i.rotulo} className="bl-cartao">
            <b className="bl-numero">{i.valor}</b>
            <span>{i.rotulo}</span>
            <Exemplo ativo={i.exemplo} modo={modo} />
          </li>
        ))}
      </ul>
      {dados.selo && <p className="bl-selo">{dados.selo}</p>}
    </section>
  );
}
