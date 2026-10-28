// Página no ar (DEV-142): o mesmo Bloco do editor, em modo publicado. Renderiza no servidor e hidrata no navegador
// (o movimento, o vídeo que só toca à vista e o botão fixo precisam de JavaScript; sem ele o <noscript> mostra tudo).
import { useEffect } from 'react';
import { ConteudoDaPagina } from '@blocks/ConteudoDaPagina';
import type { Projeto } from '@lib/projeto';
import { temaDoProjeto } from '../editor/tema';

/** Token da sessão da creator, se houver neste aparelho: o servidor não conta a abertura quando é ela mesma. */
function tokenDaCreator(): string | null {
  try {
    const chave = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    const valor = chave
      ? (JSON.parse(localStorage.getItem(chave) ?? 'null') as { access_token?: string } | null)
      : null;
    return valor?.access_token ?? null;
  } catch {
    return null;
  }
}

export default function PaginaPublicada({
  projeto,
  slug,
  codigo,
}: {
  projeto: Projeto;
  slug: string;
  codigo?: string;
}) {
  // aviso de abertura (DEV-181/182): só navegador de verdade, página à vista, uma vez por visita
  useEffect(() => {
    if (!codigo || sessionStorage.getItem(`pc:aberto:${slug}:${codigo}`)) return;
    const timer = window.setTimeout(() => {
      if (document.visibilityState !== 'visible') return;
      sessionStorage.setItem(`pc:aberto:${slug}:${codigo}`, '1');
      const token = tokenDaCreator();
      void fetch('/api/c/abertura', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ slug, codigo }),
      });
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [slug, codigo]);

  return (
    <div className="pagina" style={temaDoProjeto(projeto)}>
      <ConteudoDaPagina projeto={projeto} />
      <footer className="bl-selo">
        <a href="/portfolio-creator/" rel="noopener">
          Feito com Portfólio Creator
        </a>
      </footer>
    </div>
  );
}
