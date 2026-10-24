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
  compacto: { '--respiro': 'clamp(32px, 6cqi, 56px)' },
  normal: { '--respiro': 'clamp(48px, 8cqi, 96px)' },
  amplo: { '--respiro': 'clamp(72px, 12cqi, 144px)' },
} as const;
export type Respiro = keyof typeof RESPIRO;

/** Pares de fontes que já combinam. Só entra par com os arquivos hospedados em public/fonts/. */
export const FONTES = {
  'par-1': {
    '--fonte-titulo': "'Instrument Serif', serif",
    '--fonte-texto': "'Hanken Grotesk', system-ui, sans-serif",
  },
  'par-nuvem': {
    '--fonte-titulo': "'Nunito', system-ui, sans-serif",
    '--fonte-texto': "'Nunito', system-ui, sans-serif",
  },
} as const;
export type Fontes = keyof typeof FONTES;

export const ORNAMENTOS = {
  nenhum: { '--ornamento': 'none' },
  linha: { '--ornamento': '1px solid var(--borda)' },
} as const;
export type Ornamento = keyof typeof ORNAMENTOS;

/** Em que papel de cor ficam o fundo da página e os cartões (o modelo decide; os blocos só leem `--pagina` e `--cartao`). */
export const CENARIOS = {
  claro: { '--pagina': 'var(--fundo)', '--cartao': 'var(--superficie)' },
  /** página na cor suave da paleta, cartões quase brancos (modelo Nuvem) */
  nuvem: { '--pagina': 'var(--destaque-suave)', '--cartao': 'var(--fundo)' },
} as const;
export type Cenario = keyof typeof CENARIOS;

export interface EstiloGlobal {
  cenario: Cenario;
  fontes: Fontes;
  cantos: Cantos;
  respiro: Respiro;
  ornamento: Ornamento;
}

/** Variáveis CSS de um estilo global (sem cores). */
export function variaveisDeEstilo({
  cenario,
  fontes,
  cantos,
  respiro,
  ornamento,
}: EstiloGlobal): Record<string, string> {
  return { ...CENARIOS[cenario], ...FONTES[fontes], ...CANTOS[cantos], ...RESPIRO[respiro], ...ORNAMENTOS[ornamento] };
}
