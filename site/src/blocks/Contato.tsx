import type { DadosDeContato, PropsDoBloco } from './tipos';

const soDigitos = (t: string) => t.replace(/\D/g, '');

export function Contato({ variacao, dados }: PropsDoBloco<DadosDeContato, 'botoes' | 'formulario'>) {
  const { titulo, whatsapp, email, prazo } = dados;
  return (
    <section className={`bl bl-contato bl-contato--${variacao}`} id="contato">
      {titulo && <h2 className="bl-titulo-grande">{titulo}</h2>}
      {variacao === 'botoes' ? (
        <div className="bl-contato-botoes">
          {email && (
            <a className="bl-botao" href={`mailto:${email}`}>
              Escrever e-mail
            </a>
          )}
          {whatsapp && (
            <a className="bl-botao bl-botao--vazado" href={`https://wa.me/${soDigitos(whatsapp)}`} rel="noopener">
              Chamar no WhatsApp
            </a>
          )}
        </div>
      ) : (
        <form className="bl-briefing" action={email ? `mailto:${email}` : undefined} method="post" encType="text/plain">
          <label>
            Sua marca
            <input name="marca" autoComplete="organization" />
          </label>
          <label>
            Conte a ideia da campanha
            <textarea name="ideia" rows={4} />
          </label>
          <button className="bl-botao" type="submit">
            Enviar briefing
          </button>
        </form>
      )}
      {prazo && <p className="bl-prazo">{prazo}</p>}
    </section>
  );
}
