import type { DadosDeResumo, PropsDoBloco } from './tipos';
import { Exemplo } from './Exemplo';
import { Item, Lista } from './movimento';

/** "Em 1 olhada": o essencial logo depois da capa, para a marca decidir se continua lendo. */
export function Resumo({ variacao, dados, modo }: PropsDoBloco<DadosDeResumo, 'faixa' | 'lista'>) {
  const { itens = [] } = dados;
  return (
    <section className={`bl bl-resumo bl-resumo--${variacao}`} id="resumo" aria-label="Em 1 olhada">
      <Lista modo={modo} className="bl-lista-resumo">
        {itens.map((r, n) => (
          <Item modo={modo} key={n}>
            <span>{r.rotulo}</span>
            <b>{r.valor}</b>
            <Exemplo ativo={r.exemplo} modo={modo} />
          </Item>
        ))}
      </Lista>
    </section>
  );
}
