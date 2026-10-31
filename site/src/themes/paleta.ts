// Paleta a partir de uma cor de origem, pela regra de cor dinâmica do Material Design 3 (docs/02-construtor.md,
// "Paletas"). Da cor saem famílias de tons; cada papel (`--destaque`, `--fundo`…) é um tom fixo de uma família,
// por isso qualquer cor escolhida mantém o contraste. Os blocos só usam os papéis, nunca cor direta.
import {
  argbFromHex,
  Contrast,
  Hct,
  hexFromArgb,
  lstarFromArgb,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  type DynamicScheme,
} from '@material/material-color-utilities';

export const PAPEIS = [
  'destaque',
  'sobre-destaque',
  'destaque-suave',
  'apoio',
  'fundo',
  'superficie',
  'texto',
  'texto-suave',
  'borda',
] as const;
export type Papel = (typeof PAPEIS)[number];
export type Papeis = Record<Papel, string>;

/** Esquemas do Material. Fidelity é o padrão: mantém a intensidade da cor da creator (Tonal Spot a desbota). */
export const ESQUEMAS = {
  fidelity: SchemeFidelity,
  content: SchemeContent,
  vibrant: SchemeVibrant,
  neutral: SchemeNeutral,
  expressive: SchemeExpressive,
  tonal: SchemeTonalSpot,
  monochrome: SchemeMonochrome,
} as const;
export type Esquema = keyof typeof ESQUEMAS;

export interface Paleta {
  origem: string;
  esquema: Esquema;
  claro: Papeis;
  escuro: Papeis;
}

/** Cada papel é um tom fixo de uma família (tabela do docs/02-construtor.md). Claro e escuro. */
const TONS: Record<
  Papel,
  {
    familia: 'primaryPalette' | 'tertiaryPalette' | 'neutralPalette' | 'neutralVariantPalette';
    claro: number;
    escuro: number;
  }
> = {
  destaque: { familia: 'primaryPalette', claro: 40, escuro: 80 },
  'sobre-destaque': { familia: 'primaryPalette', claro: 100, escuro: 20 },
  'destaque-suave': { familia: 'primaryPalette', claro: 90, escuro: 30 },
  apoio: { familia: 'tertiaryPalette', claro: 40, escuro: 80 },
  fundo: { familia: 'neutralPalette', claro: 98, escuro: 6 },
  superficie: { familia: 'neutralPalette', claro: 94, escuro: 12 },
  texto: { familia: 'neutralPalette', claro: 10, escuro: 90 },
  'texto-suave': { familia: 'neutralVariantPalette', claro: 30, escuro: 80 },
  borda: { familia: 'neutralVariantPalette', claro: 80, escuro: 30 },
};

const HEX = /^#[0-9a-f]{6}$/i;

function papeis(esquema: DynamicScheme, escuro: boolean): Papeis {
  const saida = {} as Papeis;
  for (const papel of PAPEIS) {
    const { familia, claro, escuro: tomEscuro } = TONS[papel];
    saida[papel] = hexFromArgb(esquema[familia].tone(escuro ? tomEscuro : claro)).toLowerCase();
  }
  return saida;
}

/**
 * Gera os papéis claro e escuro de uma cor de origem (`#rrggbb`).
 * `contraste`: -1 a 1 (0 = padrão do Material; só subir se a conferência de acessibilidade pedir).
 */
export function gerarPaleta(origem: string, esquema: Esquema = 'fidelity', contraste = 0): Paleta {
  if (!HEX.test(origem)) throw new Error(`Cor inválida: ${origem}. Use #rrggbb.`);
  const hct = Hct.fromInt(argbFromHex(origem));
  const Esquema = ESQUEMAS[esquema];
  return {
    origem: origem.toLowerCase(),
    esquema,
    claro: papeis(new Esquema(hct, false, contraste), false),
    escuro: papeis(new Esquema(hct, true, contraste), true),
  };
}

/** Razão de contraste WCAG entre duas cores `#rrggbb` (1 a 21). Texto normal precisa de 4,5. */
export function contraste(a: string, b: string): number {
  return Contrast.ratioOfTones(lstarFromArgb(argbFromHex(a)), lstarFromArgb(argbFromHex(b)));
}

/** Pares texto/fundo que aparecem nos blocos: [texto, fundo]. Todos precisam de 4,5:1. */
export const PARES_DE_TEXTO: ReadonlyArray<readonly [Papel, Papel]> = [
  ['texto', 'fundo'],
  ['texto', 'superficie'],
  ['texto', 'destaque-suave'],
  ['texto-suave', 'fundo'],
  ['texto-suave', 'superficie'],
  ['destaque', 'fundo'],
  ['destaque', 'superficie'],
  ['apoio', 'fundo'],
  ['apoio', 'superficie'],
  ['texto-suave', 'destaque-suave'],
  ['destaque', 'destaque-suave'],
  ['sobre-destaque', 'destaque'],
];

/** Pares abaixo de 4,5:1 numa paleta (vazio = tudo certo). */
export function paresReprovados(papeisDaPaleta: Papeis): Array<{ par: readonly [Papel, Papel]; razao: number }> {
  return PARES_DE_TEXTO.map((par) => ({
    par,
    razao: contraste(papeisDaPaleta[par[0]], papeisDaPaleta[par[1]]),
  })).filter(({ razao }) => razao < 4.5);
}

/** Variáveis CSS dos papéis (`--destaque: #…`), para aplicar num elemento ou `:root`. */
export function variaveisCss(papeisDaPaleta: Papeis): Record<string, string> {
  return Object.fromEntries(PAPEIS.map((papel) => [`--${papel}`, papeisDaPaleta[papel]]));
}
