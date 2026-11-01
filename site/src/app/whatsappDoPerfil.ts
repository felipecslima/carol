// WhatsApp do perfil na hora de pedir (publicar ou liberar a edição): a equipe manda o link de pagamento por ele, então
// sem um número válido o pedido não segue. Só aparece o campo para quem ainda não tem um número válido no perfil.
import { useEffect, useState } from 'react';
import { analisarWhatsapp } from '@lib/formatos';
import { carregarPerfil, salvarWhatsappDoPerfil } from './nuvem';

export function useWhatsappDoPerfil(ativo: boolean) {
  const [carregado, setCarregado] = useState(false);
  const [falta, setFalta] = useState(false);
  const [valor, setValor] = useState('');
  const [tocou, setTocou] = useState(false);

  useEffect(() => {
    if (!ativo) return;
    let vivo = true;
    void carregarPerfil().then((perfil) => {
      if (!vivo) return;
      const salvo = perfil?.whatsapp ?? '';
      setFalta(!analisarWhatsapp(salvo).ok);
      setValor(salvo);
      setCarregado(true);
    });
    return () => {
      vivo = false;
    };
  }, [ativo]);

  const analise = analisarWhatsapp(valor);
  const pede = ativo && carregado && falta;
  return {
    /** mostrar o campo: a pessoa ainda não tem um WhatsApp válido no perfil */
    pede,
    /** pode seguir: já tem número válido no perfil ou acabou de digitar um */
    pronto: !pede || analise.ok,
    valor,
    aoMudar: setValor,
    erro: pede && tocou && !analise.ok ? analise.mensagem : undefined,
    aoSair() {
      setTocou(true);
      if (analise.ok) setValor(analise.arrumado);
    },
    /** guarda o número no perfil; devolve a mensagem de erro, ou `null` se deu certo (ou se não precisava) */
    async salvar(): Promise<string | null> {
      if (!pede) return null;
      setTocou(true);
      if (!analise.ok) return analise.mensagem ?? 'Escreva o número do WhatsApp com DDD.';
      return (await salvarWhatsappDoPerfil(analise.arrumado))
        ? null
        : 'Não conseguimos salvar o seu WhatsApp agora. Tente de novo em instantes.';
    },
  };
}
