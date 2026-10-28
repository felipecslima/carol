import { BotaoVivo, Revela } from './movimento';
import type { DadosDeContato, PropsDoBloco } from './tipos';

const soDigitos = (t: string) => t.replace(/\D/g, '');

export function Contato({ variacao, dados, modo, ancora }: PropsDoBloco<DadosDeContato, 'botoes' | 'formulario'>) {
  const { titulo, whatsapp, email, prazo } = dados;
  return (
    <section className={`bl bl-contato bl-contato--${variacao}`} id={ancora ?? 'contato'}>
      {titulo && (
        <Revela modo={modo} tag="h2" className="bl-titulo-grande">
          {titulo}
        </Revela>
      )}
      {variacao === 'botoes' ? (
        <div className="bl-contato-botoes">
          {email && (
            <BotaoVivo modo={modo} className="bl-botao" href={`mailto:${email}`}>
              Escrever e-mail
            </BotaoVivo>
          )}
          {whatsapp && (
            <BotaoVivo
              modo={modo}
              className="bl-botao bl-botao--vazado"
              href={`https://wa.me/${soDigitos(whatsapp)}`}
              rel="noopener"
            >
              Chamar no WhatsApp
            </BotaoVivo>
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
