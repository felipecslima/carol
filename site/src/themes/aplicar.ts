// Aplica paleta e estilo num elemento como variáveis CSS. Trocar a cor ou o modelo é só chamar de novo:
// a página muda na hora, sem recarregar. Funciona no editor (navegador) e, com o mesmo resultado, serve de
// referência para o HTML gerado no servidor (`estiloInline`).
import { variaveisCss, type Paleta } from './paleta';
import { variaveisDeEstilo, type EstiloGlobal } from './tokens';

export type Modo = 'claro' | 'escuro';

/** Todas as variáveis de tema de um projeto, no modo pedido. */
export function variaveisDeTema(paleta: Paleta, estilo: EstiloGlobal, modo: Modo): Record<string, string> {
  return { ...variaveisCss(paleta[modo]), ...variaveisDeEstilo(estilo) };
}

/** Escreve as variáveis no elemento (ex.: a raiz do editor). Não mexe em outras propriedades. */
export function aplicarTema(elemento: Pick<HTMLElement, 'style'>, paleta: Paleta, estilo: EstiloGlobal, modo: Modo) {
  for (const [nome, valor] of Object.entries(variaveisDeTema(paleta, estilo, modo)))
    elemento.style.setProperty(nome, valor);
}

/** Mesmas variáveis como texto de atributo `style`, para a página publicada (HTML do servidor). */
export function estiloInline(paleta: Paleta, estilo: EstiloGlobal, modo: Modo): string {
  return Object.entries(variaveisDeTema(paleta, estilo, modo))
    .map(([nome, valor]) => `${nome}:${valor}`)
    .join(';');
}
