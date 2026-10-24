// Login sem senha: e-mail → código de 6 dígitos (DEV-030). Código funciona melhor que link no celular, porque o link
// abre no app de e-mail e perde a sessão. Mensagens em português e sem culpar a creator.
import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import './assistente/assistente.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ESPERA = 30;

export default function Entrar() {
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
    const limpo = email.trim().toLowerCase();
    if (!EMAIL.test(limpo)) return setErro('Esse e-mail parece incompleto. Confira e tente de novo.');
    setErro(null);
    setOcupado(true);
    const { error } = await supabase.auth.signInWithOtp({ email: limpo, options: { shouldCreateUser: true } });
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
    const { error } = await supabase.auth.verifyOtp({ email, token: codigo, type: 'email' });
    setOcupado(false);
    if (error) return setErro('Esse código não funcionou. Confira os 6 números ou peça um novo.');
    window.location.href = '/app/';
  }

  return (
    <div className="as">
      <header className="as-topo">
        <span className="as-marca">
          portfólio<i>creator</i>
        </span>
      </header>
      <main className="as-corpo">
        {etapa === 'email' ? (
          <>
            <h1 className="as-titulo">Entre para guardar seu portfólio</h1>
            <p className="as-texto">Sem senha: a gente manda um código de 6 números para o seu e-mail.</p>
            <form
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
                <span className="as-dica" role="alert">
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
                  disabled={!EMAIL.test(email.trim())}
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
            <h1 className="as-titulo">Digite o código</h1>
            <p className="as-texto">
              Enviamos 6 números para <b>{email}</b>. Veja também a caixa de spam.
            </p>
            <form
              className="as-campo"
              onSubmit={(e) => {
                e.preventDefault();
                void confirmar();
              }}
            >
              <label htmlFor="codigo">Código de 6 números</label>
              <input
                id="codigo"
                ref={campo}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              {erro && (
                <span className="as-dica" role="alert">
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
