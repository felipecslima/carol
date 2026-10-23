import { Exemplo } from './Exemplo';
import type { DadosDaCapa, PropsDoBloco } from './tipos';

export function Capa({ variacao, dados, modo }: PropsDoBloco<DadosDaCapa, 'foto-grande' | 'foto-redonda'>) {
  const { titulo, subtitulo, arroba, foto, botao } = dados;
  return (
    <section className={`bl bl-capa bl-capa--${variacao}`}>
      <div
        className="bl-capa-foto"
        role={foto ? 'img' : undefined}
        style={foto ? { backgroundImage: `url(${foto})` } : undefined}
      >
        {!foto && <span className="bl-capa-vazia" aria-hidden="true" />}
      </div>
      <div className="bl-capa-texto">
        {arroba && <p className="bl-etiqueta">{arroba}</p>}
        <h1 className="bl-titulo-grande">{titulo}</h1>
        {subtitulo && <p className="bl-texto">{subtitulo}</p>}
        {botao && (
          <a className="bl-botao" href="#contato">
            {botao}
          </a>
        )}
        <Exemplo ativo={!foto || !titulo} modo={modo} />
      </div>
    </section>
  );
}
