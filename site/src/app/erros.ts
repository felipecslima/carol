// Monitoramento de erros no navegador (DEV-233): erro de JavaScript ou promessa recusada sem tratamento vai para
// /api/erro, que grava no log do Worker (Cloudflare → Workers → Logs). Sem dado pessoal: mensagem, pilha, página e
// navegador. No máximo 5 por página aberta, sem repetir o mesmo erro. Quando houver Sentry, é aqui que ele entra.
const MAXIMO = 5;

export function ligarMonitoramento() {
  if (typeof window === 'undefined' || (window as { __pcErros?: boolean }).__pcErros) return;
  (window as { __pcErros?: boolean }).__pcErros = true;
  const vistos = new Set<string>();
  const enviar = (mensagem: string, pilha?: string) => {
    const chave = `${mensagem}|${pilha?.slice(0, 200) ?? ''}`;
    if (vistos.has(chave) || vistos.size >= MAXIMO) return;
    vistos.add(chave);
    const corpo = JSON.stringify({
      mensagem: mensagem.slice(0, 500),
      pilha: pilha?.slice(0, 3000),
      pagina: location.pathname,
      navegador: navigator.userAgent.slice(0, 200),
    });
    try {
      if (!navigator.sendBeacon?.('/api/erro', new Blob([corpo], { type: 'application/json' })))
        void fetch('/api/erro', {
          method: 'POST',
          body: corpo,
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
        });
    } catch {
      /* o monitoramento nunca pode quebrar a página */
    }
  };
  window.addEventListener('error', (ev) => {
    // erro de carregar imagem ou script não tem mensagem útil; o que importa é erro de código
    if (!ev.message) return;
    enviar(ev.message, (ev.error as Error | undefined)?.stack);
  });
  window.addEventListener('unhandledrejection', (ev) => {
    const motivo = ev.reason as Error | string | undefined;
    enviar(typeof motivo === 'string' ? motivo : (motivo?.message ?? 'Promessa recusada'), (motivo as Error)?.stack);
  });
}
