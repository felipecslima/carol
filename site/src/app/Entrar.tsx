// Login sem senha: Google (DEV-031) ou e-mail → código de 6 dígitos (DEV-030). Código funciona melhor que link no
// celular, porque o link abre no app de e-mail e perde a sessão. Mensagens em português e sem culpar a creator.
// O Google volta para esta mesma tela com `?code=` (PKCE), que vira sessão aqui; a equipe entra só por código.
import { Marca } from './Marca';
import { useEffect, useRef, useState } from 'react';
import { googleLigado, supabase } from './supabase';
import { Turnstile, turnstileLigado, type ControleTurnstile } from './Turnstile';
import { analisarEmail } from '@lib/formatos';
import './assistente/estilos.css';

const ESPERA = 30;

const PAPEIS_EQUIPE = ['admin', 'operacao', 'assistente'];

const GOOGLE_CANCELADO = 'Você cancelou a entrada com o Google. Tente de novo ou receba um código no e-mail.';
const MARCAR_CAIXA = 'Marque a caixa “Confirme que é humano” e toque de novo para enviar.';
const ACESSO_NAO_CONFERIDO = 'Não conseguimos confirmar o acesso. Recarregue a página e tente de novo.';
const GOOGLE_FALHOU = 'Não deu para entrar com o Google agora. Tente de novo ou receba um código no e-mail.';

// navegador de dentro do Instagram, Facebook, TikTok e Line: o Google bloqueia a entrada ali (disallowed_useragent)
const NAVEGADOR_INTERNO = /Instagram|FBAN|FBAV|FB_IAB|musical_ly|Bytedance|TikTok|Line\/|; wv\)/i;
const GUARDA_GOOGLE = 'pc:google-ligado';
// fluxo PKCE desta ida ao Google, guardado na aba: na volta, escolhe o verificador certo mesmo se outro pedido de
// código (em outra aba) tiver trocado o verificador padrão
const FLUXO_GOOGLE = 'pc:google-fluxo';

type VoltaDoGoogle = { code: string | null; flowId: string | null; erro: string | null } | null;
let volta: VoltaDoGoogle | undefined;
let trocaFeita = false;

function lerDaAba(chave: string): string | null {
  try {
    const valor = sessionStorage.getItem(chave);
    sessionStorage.removeItem(chave);
    return valor;
  } catch {
    return null;
  }
}

/** Volta do Google: `?code=` vira sessão; `?error=` (no endereço ou depois do #) vira mensagem em português. Lida uma
 * vez só (o código vale para uma troca) e tirada do endereço, para recarregar a página não repetir. */
function lerVoltaDoGoogle(): VoltaDoGoogle {
  if (volta !== undefined) return volta;
  const busca = new URLSearchParams(window.location.search);
  const depois = new URLSearchParams(window.location.hash.slice(1));
  const falha = busca.get('error') ?? depois.get('error');
  const code = busca.get('code');
  volta =
    falha || code
      ? {
          code: falha ? null : code,
          flowId: busca.get('sb_flow_id') ?? lerDaAba(FLUXO_GOOGLE),
          erro: falha ? (falha === 'access_denied' ? GOOGLE_CANCELADO : GOOGLE_FALHOU) : null,
        }
      : null;
  if (volta) window.history.replaceState(null, '', window.location.pathname);
  return volta;
}

/** `equipe`: entrada separada do admin (/admin/entrar/): não cria conta nova e só deixa passar quem é da equipe. */
export default function Entrar({ equipe = false }: { equipe?: boolean }) {
  // só em desenvolvimento: `?teste=<e-mail>` abre direto na etapa do código (o `npm run acesso:teste` imprime esse
  // link), para entrar nas contas de teste sem mandar e-mail para endereço que não existe
  const [teste] = useState(() =>
    import.meta.env.DEV ? new URLSearchParams(window.location.search).get('teste')?.trim().toLowerCase() || null : null,
  );
  const [email, setEmail] = useState(teste ?? '');
  const [codigo, setCodigo] = useState('');
  const [etapa, setEtapa] = useState<'email' | 'codigo'>(teste ? 'codigo' : 'email');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [espera, setEspera] = useState(0);
  // o último "ligado" fica no aparelho, para o botão já nascer no lugar (sem empurrar o formulário depois)
  const [google, setGoogle] = useState(() => {
    try {
      return !equipe && localStorage.getItem(GUARDA_GOOGLE) === '1';
    } catch {
      return false;
    }
  });
  const [indoProGoogle, setIndoProGoogle] = useState(false);
  const [interno] = useState(() => NAVEGADOR_INTERNO.test(navigator.userAgent));
  const [voltaDoGoogle] = useState(() => (equipe ? null : lerVoltaDoGoogle()));
  const [erroGoogle, setErroGoogle] = useState<string | null>(voltaDoGoogle?.erro ?? null);
  const [voltando, setVoltando] = useState(Boolean(voltaDoGoogle?.code));
  // já logada: vai direto para o app (ou o admin, se for da equipe) sem mostrar o formulário. A volta do Google e o
  // `?teste=` seguem o caminho deles
  const [conferindo, setConferindo] = useState(!voltaDoGoogle && !teste);
  const campo = useRef<HTMLInputElement>(null);
  const turnstile = useRef<ControleTurnstile>(null);

  useEffect(() => {
    if (equipe) return;
    let vivo = true;
    void googleLigado().then((ligado) => {
      try {
        localStorage.setItem(GUARDA_GOOGLE, ligado ? '1' : '0');
      } catch {
        // sem armazenamento: só não guarda
      }
      if (vivo) setGoogle(ligado);
    });
    // voltou do Google pelo botão Voltar: a página volta do cache do navegador com o botão travado
    const aoVoltar = (e: PageTransitionEvent) => e.persisted && setIndoProGoogle(false);
    window.addEventListener('pageshow', aoVoltar);
    return () => {
      vivo = false;
      window.removeEventListener('pageshow', aoVoltar);
    };
  }, [equipe]);

  useEffect(() => {
    const code = voltaDoGoogle?.code;
    if (!code || trocaFeita) return;
    trocaFeita = true;
    const falhou = () => {
      setVoltando(false);
      setErroGoogle(GOOGLE_FALHOU);
    };
    const flowId = voltaDoGoogle.flowId;
    supabase.auth
      .exchangeCodeForSession(code, flowId ? { flowId } : undefined)
      .then(({ error }) => (error ? falhou() : void (window.location.href = '/app/')))
      .catch(falhou);
  }, [voltaDoGoogle]);

  useEffect(() => {
    if (!conferindo) return;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        const sessao = data.session;
        if (sessao && !equipe) return window.location.replace('/app/');
        const papel = String((sessao?.user.app_metadata as { papel?: string } | undefined)?.papel ?? '');
        if (sessao && PAPEIS_EQUIPE.includes(papel)) return window.location.replace('/admin/');
        setConferindo(false);
      })
      .catch(() => setConferindo(false));
  }, [conferindo, equipe]);

  useEffect(() => campo.current?.focus(), [etapa, conferindo]);
  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera(espera - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  async function enviarCodigo() {
    // mesma regra do editor: diz o que falta (o @, o .com) e aponta erro comum no fim, como gmail.con
    const analise = analisarEmail(email);
    if (!analise.ok) return setErro(analise.mensagem ?? 'Confira o e-mail e tente de novo.');
    const limpo = analise.arrumado;
    setErro(null);
    setOcupado(true);
    // Turnstile (DEV-035): o Supabase recusa o pedido de código sem o comprovante da Cloudflare
    let captchaToken: string | undefined;
    if (turnstileLigado) {
      const r = await turnstile.current?.comprovante();
      if (!r || !('token' in r)) {
        setOcupado(false);
        return setErro(r && r.falta === 'marcar' ? MARCAR_CAIXA : ACESSO_NAO_CONFERIDO);
      }
      captchaToken = r.token;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: limpo,
      options: { shouldCreateUser: !equipe, captchaToken },
    });
    turnstile.current?.renovar(); // cada comprovante vale um pedido
    setOcupado(false);
    if (error) {
      return setErro(
        /captcha/i.test(error.message)
          ? ACESSO_NAO_CONFERIDO
          : error.status === 429 || /rate|seconds/i.test(error.message)
            ? 'Muitos pedidos seguidos. Espere um pouco e peça o código de novo.'
            : 'Não deu para enviar o código agora. Tente de novo em instantes.',
      );
    }
    setEmail(limpo);
    setCodigo('');
    setEtapa('codigo');
    setEspera(ESPERA);
  }

  async function entrarComGoogle() {
    setErroGoogle(null);
    setIndoProGoogle(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app/entrar/`,
        // `select_account`: quem tem mais de uma conta Google escolhe, em vez de entrar direto na última usada
        queryParams: { prompt: 'select_account' },
        // a ida é feita aqui, depois de guardar o fluxo
        skipBrowserRedirect: true,
      },
    });
    if (error || !data.url) {
      setIndoProGoogle(false);
      return setErroGoogle(GOOGLE_FALHOU);
    }
    try {
      if (data.flowId) sessionStorage.setItem(FLUXO_GOOGLE, data.flowId);
    } catch {
      // sem armazenamento da aba: a volta usa o verificador padrão
    }
    window.location.assign(data.url);
  }

  async function confirmar() {
    if (codigo.length !== 6) return setErro('O código tem 6 números.');
    setErro(null);
    setOcupado(true);
    const { data, error } = await supabase.auth.verifyOtp({ email, token: codigo, type: 'email' });
    if (error) {
      setOcupado(false);
      return setErro('Esse código não funcionou. Confira os 6 números ou peça um novo.');
    }
    if (equipe) {
      const papel = String((data.user?.app_metadata as { papel?: string } | undefined)?.papel ?? '');
      if (!PAPEIS_EQUIPE.includes(papel)) {
        await supabase.auth.signOut();
        setOcupado(false);
        return setErro('Esta conta não é da equipe. Se você é creator, entre pela página de entrada do Portfólio Creator.');
      }
    }
    window.location.href = equipe ? '/admin/' : '/app/';
  }

  return (
    <div className="as">
      <header className="as-topo">
        {equipe ? (
          <Marca />
        ) : (
          <a
            href="/portfolio-creator/"
            className="marca-link"
            aria-label="Portfólio Creator: voltar para a página inicial"
          >
            <Marca />
          </a>
        )}
      </header>
      <main className="as-corpo" aria-busy={conferindo || undefined}>
        {conferindo ? null : voltando ? (
          <>
            <h1 className="as-titulo">
              Entrando com o <em>Google</em>
            </h1>
            <p className="as-texto" role="status">
              Só um instante.
            </p>
          </>
        ) : etapa === 'email' ? (
          <>
            <h1 className="as-titulo">
              {equipe ? (
                <>
                  Área da <em>equipe</em>
                </>
              ) : (
                <>
                  Entre para guardar <em>seu portfólio</em>
                </>
              )}
            </h1>
            <p className="as-texto">
              {equipe
                ? 'Acesso só para quem é da equipe. Sem senha: mandamos um código de 6 números para o seu e-mail.'
                : google && !interno
                  ? 'Sem senha: entre com a sua conta Google ou receba um código de 6 números no e-mail.'
                  : 'Sem senha: a gente manda um código de 6 números para o seu e-mail.'}
            </p>
            {(google || erroGoogle) && (
              <div className="as-google">
                {google && interno && (
                  <p className="as-dica as-google-interno">
                    Para entrar com o Google, abra esta página no Safari ou no Chrome (no menu do app, “Abrir no
                    navegador”).
                  </p>
                )}
                {google && !interno && (
                  <button
                    type="button"
                    className="as-botao-google"
                    disabled={indoProGoogle || ocupado}
                    onClick={() => void entrarComGoogle()}
                  >
                    <LogoGoogle />
                    {indoProGoogle ? 'Abrindo o Google…' : 'Continuar com o Google'}
                  </button>
                )}
                {erroGoogle && (
                  <span className="as-erro" role="alert">
                    {erroGoogle}
                  </span>
                )}
                {google && !interno && (
                  <p className="as-ou" aria-hidden="true">
                    <span>ou com um código no e-mail</span>
                  </p>
                )}
              </div>
            )}
            <form
              noValidate
              className="as-campo"
              onSubmit={(e) => {
                e.preventDefault();
                void enviarCodigo();
              }}
            >
              <label htmlFor="email">Seu e-mail</label>
              <input
                id="email"
                ref={campo}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {erro && (
                <span className="as-erro" role="alert">
                  {erro}
                </span>
              )}
              <Turnstile ref={turnstile} />
              <button type="submit" className="as-botao" disabled={ocupado || !email.trim()}>
                {ocupado ? 'Enviando…' : 'Enviar código'}
              </button>
            </form>
            {!equipe && (
              <p className="as-legal">
                Ao entrar, você concorda com os <a href="/portfolio-creator/termos/">Termos de Uso</a> e a{' '}
                <a href="/portfolio-creator/privacidade/">Política de Privacidade</a>.
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="as-titulo">
              Digite o <em>código</em>
            </h1>
            <p className="as-texto">
              Enviamos 6 números para <b>{email}</b>. Veja também a caixa de spam.
            </p>
            <form
              noValidate
              className="as-campo"
              onSubmit={(e) => {
                e.preventDefault();
                void confirmar();
              }}
            >
              <label htmlFor="codigo">Código de 6 números</label>
              <input
                id="codigo"
                aria-invalid={erro ? true : undefined}
                ref={campo}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              {erro && (
                <span className="as-erro" role="alert">
                  {erro}
                </span>
              )}
              <button type="submit" className="as-botao" disabled={ocupado || codigo.length !== 6}>
                {ocupado ? 'Entrando…' : 'Entrar'}
              </button>
              <Turnstile ref={turnstile} />
              <button
                type="button"
                className="as-link"
                disabled={espera > 0 || ocupado}
                onClick={() => void enviarCodigo()}
              >
                {espera > 0 ? `Pedir outro código em ${espera}s` : 'Pedir outro código'}
              </button>
              <button type="button" className="as-link" onClick={() => (setEtapa('email'), setErro(null))}>
                Trocar o e-mail
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

/** O "G" do Google nas cores oficiais (o guia de marca do Google pede o logo assim no botão de entrar). */
function LogoGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
