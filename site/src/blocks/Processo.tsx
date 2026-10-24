import { Exemplo } from './Exemplo';
import type { DadosDeProcesso, PropsDoBloco } from './tipos';

/** "Como eu trabalho": as etapas, em ordem (por isso a numeração é conteúdo, não enfeite). */
export function Processo({ variacao, dados, modo }: PropsDoBloco<DadosDeProcesso, 'passos' | 'linha'>) {
  const { titulo, itens = [] } = dados;
  return (
    <section className={`bl bl-processo bl-processo--${variacao}`} id="processo">
      {titulo && <h2 className="bl-titulo">{titulo}</h2>}
      <ol className="bl-lista-processo">
        {itens.map((p, n) => (
          <li key={n} className={variacao === 'passos' ? 'bl-cartao' : undefined}>
            <span className="bl-passo-n" aria-hidden="true">
              {n + 1}
            </span>
            <div>
              <b>{p.titulo}</b>
              {p.texto && <span>{p.texto}</span>}
              {p.prazo && <small className="bl-prazo-formato">Prazo: {p.prazo}</small>}
            </div>
            <Exemplo ativo={p.exemplo} modo={modo} />
          </li>
        ))}
      </ol>
    </section>
  );
}
