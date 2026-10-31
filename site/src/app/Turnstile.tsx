// Cloudflare Turnstile no pedido do código por e-mail (DEV-035). O Supabase confere o comprovante (Attack Protection);
// aqui só se gera um. Modo "só quando precisa": quase sempre não aparece nada; a caixinha surge se a Cloudflare
// desconfiar. Cada comprovante vale um pedido: quem usa chama `renovar()` depois de enviar.
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { PUBLIC_TURNSTILE_SITE_KEY } from 'astro:env/client';

type Opcoes = {
  sitekey: string;
  theme: 'dark';
  language: string;
  appearance: 'interaction-only';
  size: 'flexible';
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => boolean;
  'before-interactive-callback': () => void;
  'after-interactive-callback': () => void;
};
type ApiTurnstile = {
  render: (onde: HTMLElement, opcoes: Opcoes) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: ApiTurnstile;
  }
}

export const turnstileLigado = Boolean(PUBLIC_TURNSTILE_SITE_KEY);

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let carregando: Promise<ApiTurnstile> | null = null;

function carregarScript(): Promise<ApiTurnstile> {
  carregando ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    s.onerror = () => {
      carregando = null;
      reject(new Error('turnstile'));
    };
    document.head.appendChild(s);
  });
  return carregando;
}

/** `marcar`: a Cloudflare mostrou a caixa "Confirme que é humano" e espera a pessoa marcar */
export type Comprovante = { token: string } | { falta: 'marcar' | 'sem-resposta' };

export type ControleTurnstile = {
  /** espera o comprovante (até `ms`) */
  comprovante: (ms?: number) => Promise<Comprovante>;
  /** descarta o comprovante usado e pede outro */
  renovar: () => void;
};

export const Turnstile = forwardRef<ControleTurnstile>(function Turnstile(_, ref) {
  const onde = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  // o script não carregou (bloqueador, rede): não adianta esperar o comprovante
  const semScript = useRef(false);
  const pedeMarcar = useRef(false);

  useEffect(() => {
    if (!turnstileLigado) return;
    let vivo = true;
    carregarScript()
      .then((api) => {
        if (!vivo || !onde.current) return;
        id.current = api.render(onde.current, {
          sitekey: PUBLIC_TURNSTILE_SITE_KEY!,
          theme: 'dark',
          language: 'pt-br',
          appearance: 'interaction-only',
          size: 'flexible',
          callback: (t) => {
            token.current = t;
            pedeMarcar.current = false;
          },
          'before-interactive-callback': () => (pedeMarcar.current = true),
          'after-interactive-callback': () => (pedeMarcar.current = false),
          'expired-callback': () => (token.current = null),
          // a Cloudflare tenta de novo sozinha; a mensagem, se faltar o comprovante, é nossa e em português
          'error-callback': () => {
            token.current = null;
            return true;
          },
        });
      })
      .catch(() => (semScript.current = true));
    return () => {
      vivo = false;
      if (id.current) window.turnstile?.remove(id.current);
      id.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    async comprovante(ms = 15000) {
      const fim = Date.now() + ms;
      while (!token.current && !semScript.current && !pedeMarcar.current && Date.now() < fim)
        await new Promise((r) => setTimeout(r, 200));
      if (token.current) return { token: token.current };
      return { falta: pedeMarcar.current ? 'marcar' : 'sem-resposta' };
    },
    renovar() {
      token.current = null;
      if (id.current) window.turnstile?.reset(id.current);
    },
  }));

  if (!turnstileLigado) return null;
  return <div ref={onde} className="as-turnstile" />;
});
