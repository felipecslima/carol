// Campo de WhatsApp para pedir publicação ou edição (ver whatsappDoPerfil.ts). Mesma marcação dos campos da área Conta.
import type { useWhatsappDoPerfil } from './whatsappDoPerfil';

export function CampoDeWhatsapp({ id, whats }: { id: string; whats: ReturnType<typeof useWhatsappDoPerfil> }) {
  if (!whats.pede) return null;
  return (
    <div className="ed-campo">
      <label htmlFor={id}>Seu WhatsApp</label>
      <input
        id={id}
        // type="text" porque o CSS do editor só estiliza esse tipo; inputMode="tel" mantém o teclado de números no celular
        type="text"
        inputMode="tel"
        autoComplete="tel"
        maxLength={30}
        value={whats.valor}
        onChange={(e) => whats.aoMudar(e.target.value)}
        onBlur={whats.aoSair}
        aria-invalid={whats.erro ? true : undefined}
        aria-describedby={`${id}-dica`}
      />
      {whats.erro ? (
        <span id={`${id}-dica`} className="ed-erro" aria-live="polite">
          {whats.erro}
        </span>
      ) : (
        <span id={`${id}-dica`} className="ed-dica">
          Com DDD. A equipe manda o link de pagamento por aqui.
        </span>
      )}
    </div>
  );
}
