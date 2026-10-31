// Esqueleto do editor (DEV-094): a barra de cima e as abas de baixo, nas cores e alturas do editor, com "Carregando seu
// portfólio…". O Astro desenha este mesmo componente como HTML antes do JavaScript chegar (fallback do client:only) e o
// editor o usa enquanto busca o projeto: a tela não fica em branco nem pisca entre um e outro.
import './esqueleto.css';

const ABAS = ['Seções', 'Adicionar', 'Mídias', 'Estilo', 'Publicar'];

export function Esqueleto() {
  return (
    <div className="esq">
      <header className="esq-topo">
        <span className="esq-marca">
          Portfólio <i>Creator</i>
        </span>
      </header>
      <p className="esq-msg" role="status">
        Carregando seu portfólio…
      </p>
      <div className="esq-abas" aria-hidden="true">
        {ABAS.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
    </div>
  );
}
