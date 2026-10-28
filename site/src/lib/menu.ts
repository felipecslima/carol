// Menu do topo da página (DEV-098): nasce das seções visíveis, na ordem delas. A Capa não entra (é o topo), o Contato
// entra por último como botão. Cada seção pode ter nome próprio no menu ou sair dele; a página inteira pode ficar sem.
import type { Registro } from './bloco';
import { blocosVisiveis, type Bloco, type Projeto } from './projeto';

export interface ItemDoMenu {
  /** id do bloco */
  id: string;
  rotulo: string;
  /** âncora da seção na página (sem o #) */
  ancora: string;
  /** o Contato aparece como botão */
  destaque: boolean;
}

/** Âncora de cada bloco: o tipo na primeira seção daquele tipo (#videos, #contato) e tipo-2, tipo-3 nas repetidas. */
export function ancorasDosBlocos(blocos: readonly Bloco[]): Map<string, string> {
  const vistos = new Map<string, number>();
  const ancoras = new Map<string, string>();
  for (const b of blocos) {
    const n = (vistos.get(b.tipo) ?? 0) + 1;
    vistos.set(b.tipo, n);
    ancoras.set(b.id, n === 1 ? b.tipo : `${b.tipo}-${n}`);
  }
  return ancoras;
}

/** Nome que a seção mostra no menu quando ela não escolheu um: o curto do registro, ou o nome da seção. */
export const rotuloPadrao = (tipo: string, registro: Registro) =>
  registro[tipo]?.nomeNoMenu ?? registro[tipo]?.nome ?? tipo;

/** Itens do menu, na ordem das seções da página. Vazio se o menu estiver desligado. */
export function itensDoMenu(projeto: Projeto, registro: Registro): ItemDoMenu[] {
  if (!projeto.menu) return [];
  const visiveis = blocosVisiveis(projeto, registro);
  const ancoras = ancorasDosBlocos(visiveis);
  return visiveis
    .filter((b) => b.tipo !== 'capa' && !b.menu?.oculto)
    .map((b) => ({
      id: b.id,
      rotulo: b.menu?.rotulo?.trim() || rotuloPadrao(b.tipo, registro),
      ancora: ancoras.get(b.id) ?? b.tipo,
      destaque: b.tipo === 'contato',
    }));
}
