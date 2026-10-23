import { Exemplo } from './Exemplo';
import type { DadosDeFormatos, PropsDoBloco } from './tipos';

export function Formatos({ variacao, dados, modo }: PropsDoBloco<DadosDeFormatos, 'cards' | 'tabela'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-formatos bl-formatos--${variacao}`} id="formatos">
      {titulo && <h2 className="bl-titulo">{titulo}</h2>}
      <ul className="bl-lista-formatos">
        {itens.map((f, n) => (
          <li key={n} className={variacao === 'cards' ? 'bl-cartao' : undefined}>
            <b>{f.titulo}</b>
            {f.descricao && <span>{f.descricao}</span>}
            {f.preco && <em>{f.preco}</em>}
            <Exemplo ativo={f.exemplo} modo={modo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
