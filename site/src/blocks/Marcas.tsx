import { Exemplo } from './Exemplo';
import type { DadosDeMarcas, PropsDoBloco } from './tipos';

export function Marcas({ variacao, dados, modo }: PropsDoBloco<DadosDeMarcas, 'logos' | 'lista'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-marcas bl-marcas--${variacao}`} id="marcas">
      {titulo && <h2 className="bl-titulo">{titulo}</h2>}
      <ul className="bl-lista-marcas">
        {itens.map((m, n) => (
          <li key={n}>
            {variacao === 'logos' && m.logo ? <img src={m.logo} alt={m.nome} loading="lazy" /> : <b>{m.nome}</b>}
            {m.resultado && <span>{m.resultado}</span>}
            <Exemplo ativo={m.exemplo} modo={modo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
