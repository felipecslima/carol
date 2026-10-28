import { posicaoDoFoco } from './foco';
import { Item, Lista, m, Revela } from './movimento';
import type { DadosDoSobre, PropsDoBloco } from './tipos';

export function Sobre({ variacao, dados, modo, ancora }: PropsDoBloco<DadosDoSobre, 'texto-foto' | 'so-texto'>) {
  const { titulo, texto, foto, nichos, foto_foco } = dados;
  const comFoto = variacao === 'texto-foto';
  const propsDaFoto = {
    className: 'bl-sobre-foto',
    role: foto ? ('img' as const) : undefined,
    style: foto ? { backgroundImage: `url(${foto})`, backgroundPosition: posicaoDoFoco(foto_foco) } : undefined,
  };
  return (
    <section className={`bl bl-sobre bl-sobre--${variacao}`} id={ancora ?? 'sobre'}>
      {comFoto &&
        (modo === 'editor' ? (
          <div {...propsDaFoto} />
        ) : (
          // a foto se revela de cima para baixo, como uma cortina que sobe
          <m.div
            {...propsDaFoto}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      <div className="bl-sobre-texto">
        {titulo && (
          <Revela modo={modo} tag="h2" className="bl-titulo">
            {titulo}
          </Revela>
        )}
        {texto && (
          <Revela modo={modo} tag="p" atraso={0.1} className="bl-texto">
            {texto}
          </Revela>
        )}
        {nichos && nichos.length > 0 && (
          <Lista modo={modo} passo={0.06} className="bl-etiquetas">
            {nichos.map((n) => (
              <Item modo={modo} efeito="pop" key={n}>
                {n}
              </Item>
            ))}
          </Lista>
        )}
      </div>
    </section>
  );
}
