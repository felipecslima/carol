import { Exemplo } from './Exemplo';
import type { DadosDeMotivos, PropsDoBloco } from './tipos';

/** "Por que trabalhar comigo": o argumento da creator em poucas linhas, escrito por ela. */
export function Motivos({ variacao, dados, modo }: PropsDoBloco<DadosDeMotivos, 'lista' | 'cards'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-motivos bl-motivos--${variacao}`} id="motivos">
      {titulo && <h2 className="bl-titulo">{titulo}</h2>}
      <ul className="bl-lista-motivos">
        {itens.map((m, n) => (
          <li key={n} className={variacao === 'cards' ? 'bl-cartao' : undefined}>
            <b>{m.titulo}</b>
            {m.texto && <span>{m.texto}</span>}
            <Exemplo ativo={m.exemplo} modo={modo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
