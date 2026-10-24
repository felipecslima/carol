import type { DadosDeResumo, PropsDoBloco } from './tipos';
import { Exemplo } from './Exemplo';

/** "Em 1 olhada": o essencial logo depois da capa, para a marca decidir se continua lendo. */
export function Resumo({ variacao, dados, modo }: PropsDoBloco<DadosDeResumo, 'faixa' | 'lista'>) {
  const { itens = [] } = dados;
  return (
    <section className={`bl bl-resumo bl-resumo--${variacao}`} id="resumo" aria-label="Em 1 olhada">
      <ul className="bl-lista-resumo">
        {itens.map((r, n) => (
          <li key={n}>
            <span>{r.rotulo}</span>
            <b>{r.valor}</b>
            <Exemplo ativo={r.exemplo} modo={modo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
