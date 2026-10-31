// Variáveis de tema (cores, fonte, cantos, clima) de um projeto, como estilo de elemento. Usado pelo editor, pelo
// mídia kit e, no servidor, pela página publicada.
import type { CSSProperties } from 'react';
import type { Projeto } from '@lib/projeto';
import { variaveisDeTema } from '@themes/aplicar';
import { NUVEM } from '@themes/modelos/nuvem';
import { gerarPaleta } from '@themes/paleta';
import type { Fontes } from '@themes/tokens';

export function temaDoProjeto(p: Projeto): CSSProperties {
  const origem = p.corPropria ?? NUVEM.paletas[p.paleta]?.origem ?? NUVEM.paletas[0].origem;
  const paleta = gerarPaleta(origem, NUVEM.esquema);
  const estilo = { ...NUVEM.estilo, fontes: p.fontes as Fontes, cantos: p.cantos };
  return variaveisDeTema(paleta, estilo, p.clima) as CSSProperties;
}
