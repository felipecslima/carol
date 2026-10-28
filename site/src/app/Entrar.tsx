// Login sem senha: e-mail → código de 6 dígitos (DEV-030). Código funciona melhor que link no celular, porque o link
// abre no app de e-mail e perde a sessão. Mensagens em português e sem culpar a creator.
import { Marca } from './Marca';
import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { analisarEmail } from '@lib/formatos';
import './assistente/assistente.css';
import './refino.css';
import './tema.css';

const ESPERA = 30;

const PAPEIS_EQUIPE = ['admin', 'operacao', 'assistente'];

/** `equipe`: entrada separada do admin (/admin/entrar/): não cria conta nova e só deixa passar quem é da equipe. */
export default function Entrar({ equipe = false }: { equipe?: boolean }) {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [espera, setEspera] = useState(0);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => campo.current?.focus(), [etapa]);
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
    const { error } = await supabase.auth.signInWithOtp({ email: limpo, options: { shouldCreateUser: !equipe } });
    setOcupado(false);
    if (error) {
      return setErro(
        error.status === 429 || /rate|seconds/i.test(error.message)
          ? 'Muitos pedidos seguidos. Espere um pouco e peça o código de novo.'
          : 'Não deu para enviar o código agora. Tente de novo em instantes.',
      );
    }
    setEmail(limpo);
    setCodigo('');
    setEtapa('codigo');
    setEspera(ESPERA);
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
        return setErro('Esta conta não é da equipe. Se você é creator, entre pela página da creator.');
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
      <main className="as-corpo">
        {etapa === 'email' ? (
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
                : 'Sem senha: a gente manda um código de 6 números para o seu e-mail.'}
            </p>
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
              <button type="submit" className="as-botao" disabled={ocupado || !email.trim()}>
                {ocupado ? 'Enviando…' : 'Enviar código'}
              </button>
              {import.meta.env.DEV && (
                <button
                  type="button"
                  className="as-link"
                  disabled={!analisarEmail(email).ok}
                  onClick={() => {
                    setEmail(email.trim().toLowerCase());
                    setErro(null);
                    setEtapa('codigo');
                  }}
                >
                  Já tenho um código (só em desenvolvimento)
                </button>
              )}
            </form>
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
