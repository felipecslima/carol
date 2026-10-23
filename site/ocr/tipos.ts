/** [x, y, w, h] em pixels da imagem original. */
export type Caixa = [number, number, number, number];

/**
 * Telas conhecidas. `perfil`, `painel` e `aba_reels` foram conferidas em prints reais
 * (iOS, out/2026). As outras vêm da spec e ainda não foram vistas nesta versão do app.
 */
export type Tela =
  | 'perfil'
  | 'painel'
  | 'publico'
  | 'aba_reels'
  | 'visualizacoes'
  | 'interacoes'
  | 'visao_geral'
  | 'reel_individual';

export type Idioma = 'pt' | 'en';
export type Tema = 'claro' | 'escuro';
/** `numero_branco`: número branco sobre fundo escurecido (faixa dos reels), em qualquer tema */
export type ModoRegiao = 'numero' | 'numero_branco' | 'texto';

// --- O que o motor de OCR entrega ---

export interface OcrPalavra {
  texto: string;
  /** 0 a 1 */
  confianca: number;
  caixa: Caixa;
}

export interface OcrLinha {
  texto: string;
  palavras: OcrPalavra[];
  caixa: Caixa;
}

export interface OcrResultado {
  linhas: OcrLinha[];
}

export interface Luminancia {
  /** claridade média, 0 a 1 */
  media: number;
  /** fração de pixels quase brancos */
  brancos: number;
}

/**
 * Uma imagem aberta no motor. `pagina()` é o OCR da tela inteira; `regiao()` recorta um
 * pedaço e lê de novo (com lista de caracteres permitidos no modo `numero`); `luminancia()`
 * serve para achar a faixa escura onde fica o número de cada reel. Todas as caixas, de
 * entrada e de saída, estão em pixels da imagem original.
 */
export interface Imagem {
  nome: string;
  largura: number;
  altura: number;
  tema: Tema;
  pagina(): Promise<OcrResultado>;
  regiao(caixa: Caixa, modo: ModoRegiao): Promise<OcrPalavra[]>;
  luminancia(caixa: Caixa): Promise<Luminancia>;
  liberar?(): void;
}

export interface ArquivoEntrada {
  nome: string;
  dados: Blob;
}

export type MotorOcr = (arquivo: ArquivoEntrada) => Promise<Imagem>;

// --- Saída da leitura ---

export interface Fatores {
  ocr: number;
  rotulo: number;
  posicao: number;
  validacao: number;
}

export interface Campo {
  texto: string;
  valor: number | null;
  confianca: number;
  caixa: Caixa;
  fatores: Fatores;
  /** a segunda passada (recorte) leu o mesmo valor */
  confirmado?: boolean;
}

export interface ItemLista {
  nome: string;
  pct: number;
  texto: string;
  confianca: number;
  caixa: Caixa;
  fatores: Fatores;
}

export interface Listas {
  cidades?: ItemLista[];
  faixa_etaria?: ItemLista[];
  genero?: ItemLista[];
}

export interface CelulaReel {
  linha: number;
  coluna: number;
  texto: string;
  valor: number;
  confianca: number;
  caixa: Caixa;
  fatores: Fatores;
}

export interface Periodo {
  texto: string;
  inicio: string | null;
  fim: string | null;
  dias: number | null;
}

export interface PrintLido {
  arquivo: string;
  tela: Tela | 'desconhecida';
  idioma: Idioma | 'desconhecido';
  tema: Tema | null;
  periodo: Periodo | null;
  conta: { texto: string; valor: string } | null;
  campos: Record<string, Campo>;
  listas?: Listas;
  reels?: CelulaReel[];
  nao_lidos: string[];
  avisos: string[];
  precisa_reserva: boolean;
}

export interface PorFormato {
  stories: number | null;
  reels: number | null;
  posts: number | null;
  videos_ao_vivo: number | null;
}

export interface Consolidado {
  conta: string | null;
  periodo: { dias: number | null; inicio: string | null; fim: string | null } | null;
  perfil: {
    seguidores: number | null;
    publicacoes: number | null;
    seguindo: number | null;
    seguidores_liquidos: number | null;
    visitas: number | null;
    toques_link: number | null;
  };
  visualizacoes: {
    total: number | null;
    /** "Visualizadores" do painel atual (contas distintas que viram algo) */
    visualizadores: number | null;
    contas_alcancadas: number | null;
    pct_seguidores: number | null;
    pct_nao_seguidores: number | null;
    por_formato: PorFormato;
  };
  interacoes: {
    total: number | null;
    contas_com_engajamento: number | null;
    por_formato: PorFormato;
  };
  publico: {
    cidades: { nome: string; pct: number }[];
    faixa_etaria: { faixa: string; pct: number }[];
    genero: { mulheres: number | null; homens: number | null };
  };
  reels: { arquivo: string; linha: number; coluna: number; views: number }[];
  /** caminho do número (ex.: "perfil.seguidores") → arquivo de onde veio */
  origem: Record<string, string>;
  avisos: string[];
  /** números essenciais do mídia kit que nenhum print confiável trouxe */
  faltando: string[];
}

export interface ResultadoLeitura {
  prints: PrintLido[];
  consolidado: Consolidado;
}
