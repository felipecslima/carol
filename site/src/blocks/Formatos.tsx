import { Exemplo } from './Exemplo';
import { Item, Lista, Revela } from './movimento';
import type { DadosDeFormatos, PropsDoBloco } from './tipos';

export function Formatos({ variacao, dados, modo }: PropsDoBloco<DadosDeFormatos, 'cards' | 'tabela'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-formatos bl-formatos--${variacao}`} id="formatos">
      {titulo && (
        <Revela modo={modo} tag="h2" className="bl-titulo">
          {titulo}
        </Revela>
      )}
      <Lista modo={modo} className="bl-lista-formatos">
        {itens.map((f, n) => (
          <Item
            modo={modo}
            key={n}
            eleva={variacao === 'cards'}
            className={variacao === 'cards' ? 'bl-cartao' : undefined}
          >
            <div className="bl-formato-corpo">
              <b>{f.titulo}</b>
              {f.descricao && <span>{f.descricao}</span>}
              {f.inclui && <span className="bl-inclui">{f.inclui}</span>}
              {f.prazo && <small className="bl-prazo-formato">Prazo: {f.prazo}</small>}
            </div>
            {f.preco ? <em>{f.preco}</em> : <em className="bl-sob-consulta">Valor sob consulta</em>}
            <Exemplo ativo={f.exemplo} modo={modo} />
          </Item>
        ))}
      </Lista>
    </section>
  );
}
