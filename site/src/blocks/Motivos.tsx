import { Exemplo } from './Exemplo';
import { Item, Lista, Revela } from './movimento';
import type { DadosDeMotivos, PropsDoBloco } from './tipos';

/** "Por que trabalhar comigo": o argumento da creator em poucas linhas, escrito por ela. */
export function Motivos({ variacao, dados, modo }: PropsDoBloco<DadosDeMotivos, 'lista' | 'cards'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-motivos bl-motivos--${variacao}`} id="motivos">
      {titulo && (
        <Revela modo={modo} tag="h2" className="bl-titulo">
          {titulo}
        </Revela>
      )}
      <Lista modo={modo} className="bl-lista-motivos">
        {itens.map((m, n) => (
          <Item
            modo={modo}
            key={n}
            eleva={variacao === 'cards'}
            className={variacao === 'cards' ? 'bl-cartao' : undefined}
          >
            <b>{m.titulo}</b>
            {m.texto && <span>{m.texto}</span>}
            <Exemplo ativo={m.exemplo} modo={modo} />
          </Item>
        ))}
      </Lista>
    </section>
  );
}
