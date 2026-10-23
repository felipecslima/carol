// Tokens de modelo: tudo o que muda a cara do projeto menos as cores (que vêm de paleta.ts). Um modelo é uma
// combinação de fontes, cantos, respiro e ornamentos; os blocos só leem as variáveis CSS que saem daqui.

export const CANTOS = {
  retos: { '--raio': '0px', '--raio-grande': '0px' },
  suaves: { '--raio': '8px', '--raio-grande': '16px' },
  redondos: { '--raio': '16px', '--raio-grande': '32px' },
} as const;
export type Cantos = keyof typeof CANTOS;

/** Espaço vertical entre seções e dentro dos blocos. */
export const RESPIRO = {
  compacto: { '--respiro': 'clamp(32px, 6vw, 56px)' },
  normal: { '--respiro': 'clamp(48px, 8vw, 96px)' },
  amplo: { '--respiro': 'clamp(72px, 12vw, 144px)' },
} as const;
export type Respiro = keyof typeof RESPIRO;

/** Pares de fontes que já combinam. Só entra par com os arquivos hospedados em public/fonts/. */
export const FONTES = {
  'par-1': {
    '--fonte-titulo': "'Instrument Serif', serif",
    '--fonte-texto': "'Hanken Grotesk', system-ui, sans-serif",
  },
} as const;
export type Fontes = keyof typeof FONTES;

export const ORNAMENTOS = {
  nenhum: { '--ornamento': 'none' },
  linha: { '--ornamento': '1px solid var(--borda)' },
} as const;
export type Ornamento = keyof typeof ORNAMENTOS;

export interface EstiloGlobal {
  fontes: Fontes;
  cantos: Cantos;
  respiro: Respiro;
  ornamento: Ornamento;
}

/** Variáveis CSS de um estilo global (sem cores). */
export function variaveisDeEstilo({ fontes, cantos, respiro, ornamento }: EstiloGlobal): Record<string, string> {
  return { ...FONTES[fontes], ...CANTOS[cantos], ...RESPIRO[respiro], ...ORNAMENTOS[ornamento] };
}
