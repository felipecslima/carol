import type { DadosDoSobre, PropsDoBloco } from './tipos';

export function Sobre({ variacao, dados }: PropsDoBloco<DadosDoSobre, 'texto-foto' | 'so-texto'>) {
  const { titulo, texto, foto, nichos } = dados;
  const comFoto = variacao === 'texto-foto';
  return (
    <section className={`bl bl-sobre bl-sobre--${variacao}`} id="sobre">
      {comFoto && (
        <div
          className="bl-sobre-foto"
          role={foto ? 'img' : undefined}
          style={foto ? { backgroundImage: `url(${foto})` } : undefined}
        />
      )}
      <div className="bl-sobre-texto">
        {titulo && <h2 className="bl-titulo">{titulo}</h2>}
        {texto && <p className="bl-texto">{texto}</p>}
        {nichos && nichos.length > 0 && (
          <ul className="bl-etiquetas">
            {nichos.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
