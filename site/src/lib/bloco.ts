// Contrato de bloco: o que um bloco declara para o editor e para a validação (docs/02-construtor.md, "Blocos
// prontos" e "Três níveis de liberdade"). Os blocos guardam DADOS, não visual: o modelo cuida da pele.
import { z } from 'zod';
import type { Formato } from './formatos';

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
  'escolha',
] as const;
export type TipoDeCampo = (typeof TIPOS_DE_CAMPO)[number];

export interface Campo {
  id: string;
  rotulo: string;
  tipo: TipoDeCampo;
  /** limite de letras (texto livre); o editor mostra o contador e a fonte nunca diminui */
  maximo?: number;
  /** formato conferido enquanto ela digita (WhatsApp, e-mail): no lugar do contador, diz se está certo e o que falta */
  formato?: Formato;
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
  /** valor de um controle deslizante (`proporcao`) quando a creator ainda não mexeu */
  padrao?: number | string;
  /** campo `escolha`: as opções (quem escolhe vê todas lado a lado) */
  opcoes?: readonly { id: string; nome: string }[];
  /** título do grupo de campos na gaveta; campos seguidos com o mesmo grupo ficam juntos */
  grupo?: string;
  /** só aparece na gaveta quando todos estes campos já têm valor (ex.: escolher entre vídeo e foto só com os dois) */
  seTem?: readonly string[];
  /** campo de vídeo: só grava o quadro de capa se `capaEm` ainda estiver vazio (não troca a imagem que a creator já pôs) */
  capaSoSeVazia?: boolean;
  /** lista de itens: cada item vira um cartão recolhido (miniatura, título e detalhe) que abre para editar */
  cartao?: {
    /** campo do item usado como título do cartão */
    titulo: string;
    /** campo mostrado em letra menor ao lado do título */
    detalhe?: string;
    /** campo de imagem (ou o quadro de capa do vídeo) usado como miniatura */
    miniatura?: string;
    /** campo de vídeo do item (a miniatura cai no quadro dele) */
    video?: string;
    /** texto quando o item ainda não tem título */
    vazio: string;
    /** nesta variação do bloco, o primeiro item é o grande e ganha a etiqueta "Destaque" */
    destaqueNaVariacao?: string;
  };
  /** lista de itens: oferece "Adicionar vários", criando um item por arquivo; vale o id do campo do item que recebe o arquivo */
  varios?: { campo: string; tipo: 'video' | 'image'; rotulo: string };
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
  /** nome curto no menu do topo da página (DEV-098), quando difere do nome; a creator pode trocar por seção */
  nomeNoMenu?: string;
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
  } else if (campo.tipo === 'escolha') {
    const ids = (campo.opcoes ?? []).map((o) => o.id);
    base = z.string().refine((v) => ids.includes(v), 'Opção inválida');
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
