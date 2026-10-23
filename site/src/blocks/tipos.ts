// Formas dos dados de cada bloco (o que vai em `bloco.dados` no JSON do projeto) e props comuns dos componentes.
// Os blocos guardam dados, não visual; a pele vem das variáveis de tema (src/themes).

/** `exemplo: true` marca conteúdo de placeholder: aparece no editor com a etiqueta e nunca vai para o ar. */
export interface Marcavel {
  exemplo?: boolean;
}

export interface ItemDeNumero extends Marcavel {
  valor: string;
  rotulo: string;
  /** 0 a 100, só para as variações com barra */
  proporcao?: number;
}

export interface ItemDeVideo extends Marcavel {
  titulo: string;
  visualizacoes?: string;
  marca?: string;
  /** URL da capa (Cloudinary); sem ela o bloco desenha um fundo de cor */
  capa?: string;
}

export interface ItemDeMarca extends Marcavel {
  nome: string;
  resultado?: string;
  logo?: string;
}

export interface ItemDeFormato extends Marcavel {
  titulo: string;
  descricao?: string;
  /** só aparece se a creator preencher; nunca vem de exemplo */
  preco?: string;
}

export interface DadosDaCapa {
  titulo?: string;
  subtitulo?: string;
  arroba?: string;
  foto?: string;
  botao?: string;
}
export interface DadosDoSobre {
  titulo?: string;
  texto?: string;
  foto?: string;
  nichos?: string[];
}
export interface DadosDeNumeros {
  itens?: ItemDeNumero[];
  /** "Informado pela creator · 20/09 a 19/10": aparece quando os números vêm da creator */
  selo?: string;
}
export interface DadosDeVideos {
  titulo?: string;
  itens?: ItemDeVideo[];
}
export interface DadosDeMarcas {
  titulo?: string;
  itens?: ItemDeMarca[];
}
export interface DadosDePublico {
  titulo?: string;
  itens?: ItemDeNumero[];
  selo?: string;
}
export interface DadosDeFormatos {
  titulo?: string;
  itens?: ItemDeFormato[];
}
export interface DadosDeContato {
  titulo?: string;
  whatsapp?: string;
  email?: string;
  prazo?: string;
}

/** `editor`: mostra etiquetas de exemplo; `publicado`: HTML limpo, sem etiquetas. */
export type ModoDeRender = 'editor' | 'publicado';

export interface PropsDoBloco<D, V extends string = string> {
  variacao: V;
  dados: D;
  modo: ModoDeRender;
}
