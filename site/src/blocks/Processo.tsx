import { useRef } from 'react';
import { Exemplo } from './Exemplo';
import { FioDasEtapas, Item, Lista, Revela } from './movimento';
import type { DadosDeProcesso, PropsDoBloco } from './tipos';

/** "Como eu trabalho": as etapas, em ordem (por isso a numeração é conteúdo, não enfeite). */
export function Processo({ variacao, dados, modo, ancora }: PropsDoBloco<DadosDeProcesso, 'passos' | 'linha'>) {
  const { titulo, itens = [] } = dados;
  const corpo = useRef<HTMLDivElement>(null);
  return (
    <section className={`bl bl-processo bl-processo--${variacao}`} id={ancora ?? 'processo'}>
      {titulo && (
        <Revela modo={modo} tag="h2" className="bl-titulo">
          {titulo}
        </Revela>
      )}
      <div className="bl-processo-corpo" ref={corpo}>
        <FioDasEtapas alvo={corpo} modo={modo} />
        <Lista modo={modo} tag="ol" passo={0.16} className="bl-lista-processo">
          {itens.map((p, n) => (
            <Item modo={modo} key={n} className={variacao === 'passos' ? 'bl-cartao' : undefined}>
              <span className="bl-passo-n" aria-hidden="true">
                {n + 1}
              </span>
              <div>
                <b>{p.titulo}</b>
                {p.texto && <span>{p.texto}</span>}
                {p.prazo && <small className="bl-prazo-formato">Prazo: {p.prazo}</small>}
              </div>
              <Exemplo ativo={p.exemplo} modo={modo} />
            </Item>
          ))}
        </Lista>
      </div>
    </section>
  );
}
