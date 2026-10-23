/**
 * Todos os rótulos do Instagram ficam aqui, nunca espalhados no código. Acentos e caixa não
 * importam: a comparação normaliza os dois lados.
 *
 * Conferido em prints reais (iOS, out/2026, PT): `perfil`, `painel` e a grade de reels.
 * Os rótulos em EN e as telas `publico`, `visualizacoes`, `interacoes`, `visao_geral` e
 * `reel_individual` vêm da spec e precisam de prints para fechar.
 */
import type { Idioma, Tela } from './tipos';

export interface Rotulos {
  pt: string[];
  en: string[];
}

/**
 * Onde procurar o número a partir do rótulo:
 * - `direita` / `esquerda`: na mesma linha
 * - `abaixo` / `acima`: na linha vizinha, alinhado pela esquerda (cartões e perfil)
 * - `abaixo_direita`: na linha seguinte, em qualquer ponto à direita (linhas com barra)
 */
export type Direcao = 'direita' | 'esquerda' | 'abaixo' | 'acima' | 'abaixo_direita';

export interface DefCampo {
  rotulos: Rotulos;
  /** `pct` só aceita número com %; `numero` só aceita sem */
  tipo: 'numero' | 'pct';
  busca: Direcao[];
  /** saldo de seguidores pode ser negativo */
  permiteNegativo?: boolean;
}

export type TipoLista = 'cidades' | 'faixa_etaria' | 'genero';

/** Uma seção da tela: título e, abaixo dele até o próximo título, itens fixos ou uma lista livre. */
export interface DefSecao {
  titulo: Rotulos;
  itens?: Record<string, DefCampo>;
  lista?: TipoLista;
}

export interface DefTela {
  /** palavras-chave de classificação com peso; só rótulos que distinguem a tela */
  palavras: { rotulos: Rotulos; peso: number }[];
  /** campos fora de seções (cartões, cabeçalho do perfil) */
  campos: Record<string, DefCampo>;
  secoes: Record<string, DefSecao>;
  /** títulos que só servem para encerrar a seção anterior */
  fim: Rotulos;
  /** campos ou seções que, se faltarem no print, mandam para a reserva */
  essenciais: string[];
}

const DIREITA: Direcao[] = ['direita', 'abaixo_direita'];
const CARTAO: Direcao[] = ['abaixo', 'direita'];
const SOBRE: Direcao[] = ['acima'];

const campo = (pt: string[], en: string[], busca: Direcao[], tipo: 'numero' | 'pct' = 'numero'): DefCampo => ({
  rotulos: { pt, en }, tipo, busca,
});

/** Linhas "Stories / Reels / Posts / Vídeos ao vivo" das seções por tipo de conteúdo. */
const porFormato = (prefixo: string): Record<string, DefCampo> => ({
  [`${prefixo}_stories`]: campo(['Stories'], ['Stories'], DIREITA),
  [`${prefixo}_reels`]: campo(['Reels'], ['Reels'], DIREITA),
  [`${prefixo}_posts`]: campo(['Posts', 'Publicações'], ['Posts'], DIREITA),
  [`${prefixo}_videos_ao_vivo`]: campo(['Vídeos ao vivo'], ['Live videos'], DIREITA),
});

export const TELAS: Record<Exclude<Tela, 'aba_reels'>, DefTela> = {
  perfil: {
    // a linha "posts · seguidores · seguindo" vale 3 pontos (regra em classificar.ts)
    palavras: [
      { rotulos: { pt: ['Editar perfil', 'Compartilhar perfil', 'Mensagem', 'Seguido(a) por'], en: ['Edit profile', 'Share profile', 'Message', 'Followed by'] }, peso: 2 },
      { rotulos: { pt: ['Editar', 'Contato'], en: ['Edit', 'Contact'] }, peso: 1 },
    ],
    // no perfil o número fica em cima do rótulo
    campos: {
      seguidores: campo(['seguidores'], ['followers'], SOBRE),
      publicacoes: campo(['posts', 'publicações'], ['posts'], SOBRE),
      seguindo: campo(['seguindo'], ['following'], SOBRE),
      // cartão "Seu painel: 8,7 mil visualizações nos últimos 30 dias" (número arredondado, só confere)
      visualizacoes_resumo: campo(['visualizações nos últimos'], ['views in the last'], ['esquerda']),
    },
    secoes: {},
    fim: { pt: [], en: [] },
    essenciais: ['seguidores'],
  },

  // "Seu painel" (abas Página inicial, Desempenho, Conteúdo, Público). A tela rola: cada print
  // mostra um pedaço, por isso nada é essencial por print; o consolidado diz o que faltou.
  painel: {
    palavras: [
      {
        rotulos: {
          pt: ['Seu painel', 'Resumo', 'Todos os conteúdos', 'Seguidores líquidos', 'Visualizadores',
            'Visualizações por tipo de conteúdo', 'Interações por tipo de conteúdo', 'Atividade do perfil', 'Visitas ao perfil'],
          en: ['Your dashboard', 'Summary', 'All content', 'Net followers', 'Viewers',
            'Views by content type', 'Interactions by content type', 'Profile activity', 'Profile visits'],
        },
        peso: 2,
      },
      { rotulos: { pt: ['Página inicial', 'Desempenho'], en: ['Home', 'Performance'] }, peso: 1 },
    ],
    campos: {
      visualizacoes: campo(['Visualizações'], ['Views'], CARTAO),
      visualizadores: campo(['Visualizadores'], ['Viewers'], CARTAO),
      seguidores: campo(['Seguidores'], ['Followers'], CARTAO),
      seguidores_liquidos: { ...campo(['Seguidores líquidos'], ['Net followers'], CARTAO), permiteNegativo: true },
    },
    secoes: {
      visualizacoes_por_formato: {
        titulo: { pt: ['Visualizações por tipo de conteúdo'], en: ['Views by content type'] },
        itens: porFormato('views'),
      },
      interacoes_por_formato: {
        titulo: { pt: ['Interações por tipo de conteúdo'], en: ['Interactions by content type'] },
        itens: porFormato('interacoes'),
      },
      atividade_perfil: {
        titulo: { pt: ['Atividade do perfil'], en: ['Profile activity'] },
        itens: {
          visitas_perfil: campo(['Visitas ao perfil'], ['Profile visits'], DIREITA),
          toques_link: campo(['Toques no link da bio'], ['Bio link taps'], DIREITA),
          toques_endereco: campo(['Toques no endereço comercial'], ['Business address taps'], DIREITA),
        },
      },
    },
    fim: { pt: ['Ferramentas', 'Resumo', 'Todos os conteúdos'], en: ['Tools', 'Summary', 'All content'] },
    essenciais: [],
  },

  publico: {
    palavras: [
      { rotulos: { pt: ['Principais localizações', 'Principais cidades', 'Faixa etária', 'Gênero'], en: ['Top locations', 'Top cities', 'Age range', 'Gender'] }, peso: 2 },
    ],
    campos: {},
    secoes: {
      cidades: { titulo: { pt: ['Principais localizações', 'Principais cidades'], en: ['Top locations', 'Top cities'] }, lista: 'cidades' },
      faixa_etaria: { titulo: { pt: ['Faixa etária'], en: ['Age range'] }, lista: 'faixa_etaria' },
      genero: { titulo: { pt: ['Gênero'], en: ['Gender'] }, lista: 'genero' },
    },
    fim: { pt: ['Horários mais ativos', 'Principais países'], en: ['Most active times', 'Top countries'] },
    essenciais: [],
  },

  // --- Telas da spec ainda não vistas no app atual ---
  visualizacoes: {
    palavras: [
      { rotulos: { pt: ['Contas alcançadas'], en: ['Accounts reached'] }, peso: 2 },
      { rotulos: { pt: ['Por tipo de conteúdo'], en: ['By content type'] }, peso: 1 },
    ],
    campos: {
      visualizacoes: campo(['Visualizações'], ['Views'], CARTAO),
      contas_alcancadas: campo(['Contas alcançadas'], ['Accounts reached'], ['direita', 'abaixo']),
      pct_seguidores: campo(['Seguidores'], ['Followers'], ['direita', 'abaixo'], 'pct'),
      pct_nao_seguidores: campo(['Não seguidores'], ['Non-followers'], ['direita', 'abaixo'], 'pct'),
    },
    secoes: {},
    fim: { pt: [], en: [] },
    essenciais: ['visualizacoes'],
  },
  interacoes: {
    palavras: [
      { rotulos: { pt: ['Contas com engajamento'], en: ['Accounts engaged'] }, peso: 2 },
      { rotulos: { pt: ['Curtidas', 'Salvamentos'], en: ['Likes', 'Saves'] }, peso: 1 },
    ],
    campos: {
      interacoes: campo(['Interações'], ['Interactions'], CARTAO),
      contas_com_engajamento: campo(['Contas com engajamento'], ['Accounts engaged'], ['direita', 'abaixo']),
    },
    secoes: {},
    fim: { pt: [], en: [] },
    essenciais: ['interacoes'],
  },
  visao_geral: {
    palavras: [
      { rotulos: { pt: ['Visão geral', 'Conteúdo compartilhado'], en: ['Overview', 'Content you shared'] }, peso: 2 },
    ],
    campos: {
      visualizacoes: campo(['Visualizações'], ['Views'], CARTAO),
      interacoes: campo(['Interações'], ['Interactions'], CARTAO),
    },
    secoes: {},
    fim: { pt: [], en: [] },
    essenciais: [],
  },
  reel_individual: {
    palavras: [
      { rotulos: { pt: ['Tempo médio de visualização', 'Visão geral do reel'], en: ['Average watch time', 'Reel insights'] }, peso: 2 },
    ],
    campos: {
      visualizacoes: campo(['Visualizações'], ['Views'], CARTAO),
    },
    secoes: {},
    fim: { pt: [], en: [] },
    essenciais: ['visualizacoes'],
  },
};

/** Rótulos que fecham o cabeçalho do perfil; a grade de posts/reels começa abaixo deles. */
export const FIM_DO_CABECALHO: Rotulos = {
  pt: ['Editar', 'Editar perfil', 'Compartilhar perfil', 'Mensagem', 'Contato', 'Seguindo', 'Seguido(a) por', 'visualizações nos últimos'],
  en: ['Edit', 'Edit profile', 'Share profile', 'Message', 'Contact', 'Following', 'Followed by', 'views in the last'],
};

/** Rótulos da tripla do perfil: dois deles na mesma linha identificam a tela. */
export const TRIPLA_PERFIL: Record<string, Rotulos> = {
  publicacoes: { pt: ['posts', 'publicações'], en: ['posts'] },
  seguidores: { pt: ['seguidores'], en: ['followers'] },
  seguindo: { pt: ['seguindo'], en: ['following'] },
};

/** Mínimo de pontos para aceitar uma tela (e precisa passar a segunda colocada). */
export const PONTOS_MINIMOS = 2;

export const FAIXAS_ETARIAS = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

export const GENEROS: Record<string, 'mulheres' | 'homens'> = {
  mulheres: 'mulheres', women: 'mulheres', homens: 'homens', men: 'homens',
};

/** Abas que aparecem acima da lista de cidades e não são cidade. */
export const ABAS_IGNORADAS = ['cidades', 'paises', 'cities', 'countries', 'todos', 'all'];

export const MAX_CIDADES = 5;

/** Palavras do título que não podem ser nome de conta. */
export const NAO_E_CONTA = ['painel', 'dashboard', 'insights', 'seu', 'your'];

export function rotulosDe(r: Rotulos, idioma: Idioma | 'desconhecido'): string[] {
  return idioma === 'desconhecido' ? [...new Set([...r.pt, ...r.en])] : r[idioma];
}
