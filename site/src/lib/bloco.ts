// Contrato de bloco: o que um bloco declara para o editor e para a validação (docs/02-construtor.md, "Blocos
// prontos" e "Três níveis de liberdade"). Os blocos guardam DADOS, não visual: o modelo cuida da pele.
import { z } from 'zod';

export const TIPOS_DE_CAMPO = [
  'titulo',
  'texto',
  'botao',
  'imagem',
  'etiqueta',
  'numero',
  'icone',
  'video',
  'lista',
  'proporcao',
] as const;
export type TipoDeCampo = (typeof TIPOS_DE_CAMPO)[number];

export interface Campo {
  id: string;
  rotulo: string;
  tipo: TipoDeCampo;
  /** limite de letras (texto livre); o editor mostra o contador e a fonte nunca diminui */
  maximo?: number;
  obrigatorio?: boolean;
  /** texto de exemplo ("Exemplo · toque para trocar"); some quando a creator escreve o dela */
  placeholder?: string;
  /** dica da Carol, mostrada na gaveta de edição */
  dica?: string;
  /** só aparece na gaveta (e só vale) nestas variações do bloco; sem isto, vale em todas */
  soNasVariacoes?: readonly string[];
  /** campo de vídeo: id do campo de imagem que recebe o quadro de capa do vídeo (padrão: `capa`) */
  capaEm?: string;
  /** campos de cada item de uma lista; sem isto, a lista é de textos simples (ex.: nichos) */
  itens?: readonly Campo[];
  /** o texto de exemplo serve como está (ex.: título "Como eu trabalho"): a revisão não cobra troca */
  serveComoEsta?: boolean;
  /** exemplo que não pode ir para o ar (ex.: número inventado): bloqueia a publicação enquanto for o placeholder */
  bloqueiaPublicacao?: boolean;
}

export interface Variacao {
  id: string;
  nome: string;
}

export interface DefinicaoDeBloco {
  tipo: string;
  nome: string;
  variacoes: readonly [Variacao, ...Variacao[]];
  campos: readonly Campo[];
  /** Capa e Contato: a creator não pode remover nem esconder */
  fixo?: boolean;
  /** não aparece para quem está no modo iniciante */
  ocultoNoModoIniciante?: boolean;
  /** dados com que o bloco nasce ao ser adicionado (sem isto, nasce vazio); itens de placeholder vão marcados `exemplo` */
  inicial?: Readonly<Record<string, unknown>>;
}

export type Registro = Readonly<Record<string, DefinicaoDeBloco>>;

/** Onde o enquadramento de uma foto ou vídeo fica guardado ("50 30" = 50% da largura, 30% da altura). Vídeo guarda no
 *  campo do quadro de capa (`capa`, ou `capaEm`), porque é a imagem que a creator vê e ajusta; vídeo e imagem de
 *  fundo da capa compartilham o mesmo enquadramento. */
export const chaveDeFoco = (campo: Pick<Campo, 'id' | 'tipo' | 'capaEm'>) =>
  `${campo.tipo === 'video' ? (campo.capaEm ?? 'capa') : campo.id}_foco`;

function schemaDoCampo(campo: Campo): z.ZodType {
  let base: z.ZodType;
  if (
    campo.tipo === 'titulo' ||
    campo.tipo === 'texto' ||
    campo.tipo === 'botao' ||
    campo.tipo === 'etiqueta' ||
    campo.tipo === 'numero'
  ) {
    const texto = z.string().trim();
    base = campo.maximo ? texto.max(campo.maximo, `No máximo ${campo.maximo} letras`) : texto;
    if (campo.obrigatorio) base = (base as z.ZodString).min(1, 'Campo obrigatório');
  } else if (campo.tipo === 'proporcao') {
    base = z.number().min(0).max(100);
  } else if (campo.tipo === 'lista') {
    base = z.array(campo.itens ? schemaDeCampos(campo.itens, true) : z.string());
  } else {
    // imagem, vídeo, ícone: referência (URL ou id do Cloudinary, nome do ícone); validada pelo bloco que a usa
    base = campo.obrigatorio ? z.string().min(1, 'Campo obrigatório') : z.string();
  }
  return campo.obrigatorio ? base : base.optional();
}

function schemaDeCampos(campos: readonly Campo[], item = false) {
  const forma: Record<string, z.ZodType> = {};
  for (const campo of campos) {
    forma[campo.id] = schemaDoCampo(campo);
    if (campo.tipo === 'imagem' || campo.tipo === 'video')
      forma[chaveDeFoco(campo)] = z
        .string()
        .regex(/^(\d{1,3} \d{1,3})?$/)
        .optional();
  }
  // item de lista pode vir marcado como exemplo (placeholder)
  if (item) forma.exemplo = z.boolean().optional();
  return z.object(forma).strict();
}

/** Schema Zod dos dados de um bloco, gerado dos campos (limite de letras e obrigatoriedade). */
export function schemaDosDados(definicao: DefinicaoDeBloco) {
  return schemaDeCampos(definicao.campos);
}
