// Desenhos dos layouts na gaveta: um esquema de 44×28 por layout, para a creator escolher olhando, e o nome curto
// que cabe numa linha com os outros. Quem não aparece aqui continua com os botões de texto.
import type { ReactNode } from 'react';

const d = (conteudo: ReactNode) => () => (
  <svg
    width={44}
    height={28}
    viewBox="0 0 44 28"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {conteudo}
  </svg>
);
const linhas = (x: number, y: number, larguras: number[], passo = 4) =>
  larguras.map((l, i) => <path key={i} d={`M${x} ${y + i * passo}h${l}`} opacity=".6" />);

export const DESENHOS: Record<string, Record<string, () => ReactNode>> = {
  capa: {
    'foto-grande': d(
      <>
        <rect x="6" y="2" width="32" height="15" rx="2" />
        {linhas(10, 21, [24, 16])}
      </>,
    ),
    'foto-redonda': d(
      <>
        <circle cx="22" cy="9" r="6" />
        {linhas(10, 21, [24, 16])}
      </>,
    ),
    fundo: d(
      <>
        <rect x="4" y="2" width="36" height="24" rx="2" opacity=".5" />
        {linhas(10, 12, [24, 16, 20])}
      </>,
    ),
  },
  resumo: {
    faixa: d(
      <>
        <rect x="2" y="9" width="12" height="10" rx="3" />
        <rect x="16" y="9" width="12" height="10" rx="3" />
        <rect x="30" y="9" width="12" height="10" rx="3" />
      </>,
    ),
    lista: d(
      <>
        <path d="M5 6h14M25 6h14M5 14h10M25 14h14M5 22h12M25 22h10" opacity=".7" />
      </>,
    ),
  },
  sobre: {
    'texto-foto': d(
      <>
        {linhas(4, 6, [18, 14, 18, 10], 5)}
        <rect x="27" y="4" width="13" height="20" rx="2" />
      </>,
    ),
    'so-texto': d(linhas(8, 6, [28, 22, 28, 18], 5)),
  },
  motivos: {
    lista: d(
      <>
        <path d="M5 7l2 2 3-4M5 15l2 2 3-4M5 23l2 2 3-4" />
        {linhas(15, 7, [24], 0)}
        {linhas(15, 15, [20], 0)}
        {linhas(15, 23, [22], 0)}
      </>,
    ),
    cards: d(
      <>
        <rect x="3" y="4" width="17" height="20" rx="2" />
        <rect x="24" y="4" width="17" height="20" rx="2" />
      </>,
    ),
  },
  numeros: {
    cards: d(
      <>
        <rect x="2" y="7" width="12" height="14" rx="2" />
        <rect x="16" y="7" width="12" height="14" rx="2" />
        <rect x="30" y="7" width="12" height="14" rx="2" />
      </>,
    ),
    barras: d(
      <>
        <rect x="4" y="5" width="36" height="5" rx="2.5" opacity=".5" />
        <rect x="4" y="5" width="24" height="5" rx="2.5" />
        <rect x="4" y="13" width="36" height="5" rx="2.5" opacity=".5" />
        <rect x="4" y="13" width="14" height="5" rx="2.5" />
        <rect x="4" y="21" width="36" height="5" rx="2.5" opacity=".5" />
        <rect x="4" y="21" width="30" height="5" rx="2.5" />
      </>,
    ),
  },
  marcas: {
    logos: d(
      <>
        <circle cx="9" cy="9" r="5" />
        <circle cx="22" cy="9" r="5" />
        <circle cx="35" cy="9" r="5" />
        <circle cx="9" cy="21" r="5" />
        <circle cx="22" cy="21" r="5" />
        <circle cx="35" cy="21" r="5" />
      </>,
    ),
    lista: d(
      <>
        <rect x="3" y="4" width="16" height="7" rx="3.5" />
        <rect x="22" y="4" width="19" height="7" rx="3.5" />
        <rect x="3" y="14" width="21" height="7" rx="3.5" />
        <rect x="27" y="14" width="14" height="7" rx="3.5" />
      </>,
    ),
  },
  publico: {
    idade: d(
      <>
        <path d="M5 25V16M13 25V8M21 25V12M29 25V5M37 25V14" strokeWidth={4} />
      </>,
    ),
    cidades: d(
      <>
        <path d="M4 6h30M4 14h22M4 22h14" strokeWidth={4} />
      </>,
    ),
  },
  formatos: {
    cards: d(
      <>
        <rect x="3" y="3" width="17" height="22" rx="2" />
        <rect x="24" y="3" width="17" height="22" rx="2" />
        {linhas(6, 18, [11])}
        {linhas(27, 18, [11])}
      </>,
    ),
    tabela: d(
      <>
        <rect x="3" y="3" width="38" height="22" rx="2" />
        <path d="M3 10h38M3 17.500h38M22 3v22" opacity=".7" />
      </>,
    ),
  },
  processo: {
    passos: d(
      <>
        <rect x="3" y="2" width="38" height="7" rx="2" />
        <rect x="3" y="10.500" width="38" height="7" rx="2" />
        <rect x="3" y="19" width="38" height="7" rx="2" />
      </>,
    ),
    linha: d(
      <>
        <path d="M8 4v20" opacity=".6" />
        <circle cx="8" cy="5" r="2.500" />
        <circle cx="8" cy="14" r="2.500" />
        <circle cx="8" cy="23" r="2.500" />
        {linhas(16, 5, [22], 0)}
        {linhas(16, 14, [18], 0)}
        {linhas(16, 23, [20], 0)}
      </>,
    ),
  },
  contato: {
    botoes: d(
      <>
        <rect x="4" y="5" width="36" height="8" rx="4" />
        <rect x="4" y="16" width="36" height="8" rx="4" opacity=".6" />
      </>,
    ),
    formulario: d(
      <>
        <rect x="4" y="2" width="36" height="6" rx="2" opacity=".6" />
        <rect x="4" y="10" width="36" height="6" rx="2" opacity=".6" />
        <rect x="4" y="19" width="20" height="7" rx="3.500" />
      </>,
    ),
  },
  videos: {
    carrossel: d(
      <>
        <rect x="1" y="5" width="8" height="18" rx="2" opacity=".45" />
        <rect x="13" y="3" width="18" height="22" rx="2" />
        <rect x="35" y="5" width="8" height="18" rx="2" opacity=".45" />
      </>,
    ),
    grade: d(
      <>
        <rect x="4" y="2" width="16" height="11" rx="2" />
        <rect x="24" y="2" width="16" height="11" rx="2" />
        <rect x="4" y="15" width="16" height="11" rx="2" />
        <rect x="24" y="15" width="16" height="11" rx="2" />
      </>,
    ),
    destaque: d(
      <>
        <rect x="12" y="1" width="20" height="16" rx="2" />
        <rect x="2" y="20" width="8" height="7" rx="1.500" />
        <rect x="12" y="20" width="8" height="7" rx="1.500" />
        <rect x="22" y="20" width="8" height="7" rx="1.500" />
        <rect x="32" y="20" width="8" height="7" rx="1.500" />
      </>,
    ),
  },
};

/** Nomes que cabem lado a lado; o resto usa o nome do registro. */
export const NOMES_CURTOS: Record<string, string> = {
  'capa.fundo': 'Foto ou vídeo',
  'videos.destaque': 'Um em destaque',
  'numeros.barras': 'Barras',
  'marcas.lista': 'Nomes',
  'processo.passos': 'Cartões',
  'contato.formulario': 'Formulário',
};
