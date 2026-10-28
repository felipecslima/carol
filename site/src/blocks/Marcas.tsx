import { Exemplo } from './Exemplo';
import { Item, Lista, Revela } from './movimento';
import type { DadosDeMarcas, PropsDoBloco } from './tipos';

export function Marcas({ variacao, dados, modo, ancora }: PropsDoBloco<DadosDeMarcas, 'logos' | 'lista'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-marcas bl-marcas--${variacao}`} id={ancora ?? 'marcas'}>
      {titulo && (
        <Revela modo={modo} tag="h2" className="bl-titulo">
          {titulo}
        </Revela>
      )}
      <Lista modo={modo} passo={0.03} className="bl-lista-marcas">
        {itens.map((m, n) => (
          <Item modo={modo} efeito="pop" key={n}>
            {variacao === 'logos' && m.logo ? <img src={m.logo} alt={m.nome} loading="lazy" /> : <b>{m.nome}</b>}
            {m.resultado && <span>{m.resultado}</span>}
            <Exemplo ativo={m.exemplo} modo={modo} />
          </Item>
        ))}
      </Lista>
    </section>
  );
}
