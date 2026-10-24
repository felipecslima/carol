import type { Bloco } from '@lib/projeto';

const soDigitos = (t: string) => t.replace(/\D/g, '');

/** Botão de WhatsApp que acompanha a rolagem no celular, para a marca nunca ficar longe do contato.
 *  Vai no fim da página (o trilho tem altura zero e gruda na borda de baixo da tela). Some perto do Contato. */
export function ContatoFixo({ blocos }: { blocos: Bloco[] }) {
  const contato = blocos.find((b) => b.tipo === 'contato');
  const whatsapp = String((contato?.dados as { whatsapp?: string } | undefined)?.whatsapp ?? '');
  if (soDigitos(whatsapp).length < 10) return null;
  return (
    <div className="bl-fixo-trilho">
      <a className="bl-botao bl-fixo" href={`https://wa.me/${soDigitos(whatsapp)}`} rel="noopener">
        Chamar no WhatsApp
      </a>
    </div>
  );
}
