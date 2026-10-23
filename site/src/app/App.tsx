// Raiz da área logada do Portfólio Creator (/app). Por enquanto só marca o lugar: login, painel e editor
// entram nas próximas tarefas (E3 em diante).
export default function App() {
  return (
    <main className="app-shell">
      <p className="app-brand">Portfólio <i>Creator</i></p>
      <h1 className="app-title">Sua área está <em>chegando.</em></h1>
      <p className="app-lead">
        Aqui você vai montar o portfólio e o mídia kit, baixar o PDF e publicar o seu link.
        Enquanto isso, a Carol atende pelo Instagram.
      </p>
      <a className="app-cta" href="/portfolio-creator/">Voltar para a página do produto</a>
    </main>
  );
}
