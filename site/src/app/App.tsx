// Raiz da área da creator (/app). Por enquanto leva ao assistente (quem não tem rascunho) ou ao editor (quem
// tem); login, painel e Projetos entram na E3 e na E4.
import Area from './area/Area';
import { carregarRascunho } from './editor/persistencia';
import { useSessao } from './sessao';
import { supabaseConfigurado } from './supabase';
import './tema.css';

export default function App() {
  const sessao = useSessao();
  const temRascunho = carregarRascunho() !== null;
  if (sessao === undefined)
    return (
      <p className="app-lead" role="status">
        Carregando…
      </p>
    );
  if (sessao) return <Area sessao={sessao} />;
  return (
    <main className="app-shell">
      <p className="app-brand">
        Portfólio <i>Creator</i>
      </p>
      <h1 className="app-title">
        {temRascunho ? 'Seu portfólio está ' : 'Monte seu portfólio '}
        <em>{temRascunho ? 'te esperando.' : 'em minutos.'}</em>
      </h1>
      <p className="app-lead">
        {temRascunho
          ? 'Continue de onde parou: tudo o que você escreveu está salvo neste aparelho.'
          : 'Responda algumas perguntas, escolha o modelo e ajuste tudo no celular, em cima do resultado final.'}
      </p>
      <a className="app-cta" href={temRascunho ? '/app/editor/' : '/app/novo/'}>
        {temRascunho ? 'Continuar editando' : 'Começar'}
      </a>
      {temRascunho && (
        <a className="app-link" href="/app/novo/">
          Começar um novo
        </a>
      )}
      {supabaseConfigurado && sessao === null && (
        <a className="app-link" href="/app/entrar/">
          Já tenho conta: entrar
        </a>
      )}
    </main>
  );
}
