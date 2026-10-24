// Registro central dos blocos (DEV-060): a lista que o editor, a validação e a página publicada consultam.
// Cada bloco novo entra aqui e ganha o componente em src/blocks/<tipo>/ (um componente só, no editor e no ar).
// Variações: as duas primeiras de cada bloco na tabela do docs/02-construtor.md (escopo da v1, ver backlog);
// as demais entram depois. Limites de letras são ponto de partida e se ajustam bloco a bloco (DEV-061 a 068).
import type { DefinicaoDeBloco, Registro } from '@lib/bloco';

const titulo = { id: 'titulo', rotulo: 'Título', tipo: 'titulo', maximo: 60 } as const;

// campos de cada item das listas (cada item pode vir marcado `exemplo`, ver blocks/tipos.ts)
const itemDeNumero = [
  { id: 'valor', rotulo: 'Número', tipo: 'numero', maximo: 12, obrigatorio: true },
  { id: 'rotulo', rotulo: 'O que é', tipo: 'etiqueta', maximo: 40, obrigatorio: true },
  { id: 'proporcao', rotulo: 'Tamanho da barra (0 a 100)', tipo: 'proporcao' },
] as const;

export const BLOCOS = {
  capa: {
    tipo: 'capa',
    nome: 'Capa',
    fixo: true,
    variacoes: [
      { id: 'foto-grande', nome: 'Foto grande' },
      { id: 'foto-redonda', nome: 'Foto redonda' },
      { id: 'fundo', nome: 'Foto ou vídeo de fundo' },
    ],
    campos: [
      { id: 'foto', rotulo: 'Foto', tipo: 'imagem', grupo: 'Foto', soNasVariacoes: ['foto-grande', 'foto-redonda'] },
      {
        id: 'fundo',
        rotulo: 'Imagem',
        tipo: 'imagem',
        grupo: 'Fundo da capa',
        soNasVariacoes: ['fundo'],
        dica: 'Aparece enquanto o vídeo carrega e para quem prefere menos movimento.',
      },
      {
        id: 'video_fundo',
        rotulo: 'Vídeo (opcional)',
        tipo: 'video',
        grupo: 'Fundo da capa',
        capaEm: 'fundo',
        capaSoSeVazia: true,
        soNasVariacoes: ['fundo'],
        dica: 'Toca sem som, em loop. Prefira um vídeo curto e sem fala.',
      },
      {
        id: 'usar',
        rotulo: 'Qual aparece na capa?',
        tipo: 'escolha',
        grupo: 'Fundo da capa',
        opcoes: [
          { id: 'video', nome: 'Vídeo' },
          { id: 'imagem', nome: 'Imagem' },
        ],
        padrao: 'video',
        seTem: ['fundo', 'video_fundo'],
        soNasVariacoes: ['fundo'],
      },
      {
        id: 'veu',
        rotulo: 'Película escura sobre o fundo',
        tipo: 'proporcao',
        padrao: 60,
        grupo: 'Fundo da capa',
        soNasVariacoes: ['fundo'],
        dica: 'Em 0% o fundo aparece puro. Com pouca película, o texto branco pode ficar difícil de ler.',
      },
      { ...titulo, maximo: 90, obrigatorio: true, grupo: 'Textos' },
      { id: 'arroba', rotulo: '@ e cidade', tipo: 'etiqueta', maximo: 40, grupo: 'Textos' },
      { id: 'subtitulo', rotulo: 'Subtítulo', tipo: 'texto', maximo: 120, grupo: 'Textos' },
      { id: 'botao', rotulo: 'Botão', tipo: 'botao', maximo: 30, grupo: 'Textos' },
    ],
  },
  resumo: {
    tipo: 'resumo',
    nome: 'Em 1 olhada',
    variacoes: [
      { id: 'faixa', nome: 'Faixa' },
      { id: 'lista', nome: 'Lista' },
    ],
    campos: [
      {
        id: 'itens',
        rotulo: 'Itens',
        tipo: 'lista',
        itens: [
          { id: 'rotulo', rotulo: 'O que é (ex.: Nicho)', tipo: 'etiqueta', maximo: 24, obrigatorio: true },
          { id: 'valor', rotulo: 'Resposta', tipo: 'etiqueta', maximo: 48, obrigatorio: true },
        ],
      },
    ],
    inicial: {
      itens: [
        { rotulo: 'Nicho', valor: 'seu nicho', exemplo: true },
        { rotulo: 'Cidade', valor: 'sua cidade', exemplo: true },
        { rotulo: 'Faço', valor: 'o que você grava', exemplo: true },
      ],
    },
  },
  sobre: {
    tipo: 'sobre',
    nome: 'Sobre mim',
    variacoes: [
      { id: 'texto-foto', nome: 'Texto e foto' },
      { id: 'so-texto', nome: 'Só texto' },
    ],
    campos: [
      titulo,
      { id: 'texto', rotulo: 'Texto', tipo: 'texto', maximo: 600 },
      { id: 'foto', rotulo: 'Foto', tipo: 'imagem' },
      { id: 'nichos', rotulo: 'Nichos', tipo: 'lista' },
    ],
  },
  motivos: {
    tipo: 'motivos',
    nome: 'Por que eu',
    variacoes: [
      { id: 'lista', nome: 'Lista' },
      { id: 'cards', nome: 'Cards' },
    ],
    campos: [
      { ...titulo, serveComoEsta: true },
      {
        id: 'itens',
        rotulo: 'Motivos',
        tipo: 'lista',
        itens: [
          {
            id: 'titulo',
            rotulo: 'Motivo',
            tipo: 'titulo',
            maximo: 50,
            obrigatorio: true,
            dica: 'Escreva só o que é verdade para você.',
          },
          { id: 'texto', rotulo: 'Em uma frase', tipo: 'texto', maximo: 140 },
        ],
      },
    ],
    inicial: {
      titulo: 'Por que trabalhar comigo',
      itens: [
        { titulo: 'Um motivo seu', texto: 'Ex.: o que você faz de melhor ou de diferente.', exemplo: true },
        { titulo: 'Outro motivo seu', texto: 'Ex.: como você cuida da entrega.', exemplo: true },
        { titulo: 'Mais um motivo', texto: 'Ex.: o que a marca ganha com o seu público.', exemplo: true },
      ],
    },
  },
  numeros: {
    tipo: 'numeros',
    nome: 'Números',
    ocultoNoModoIniciante: true,
    variacoes: [
      { id: 'cards', nome: 'Cards' },
      { id: 'barras', nome: 'Barras comparando' },
    ],
    // os números são sempre da creator: nenhum exemplo pode ir para o ar (regra 1 do guia)
    campos: [
      { id: 'itens', rotulo: 'Números', tipo: 'lista', itens: itemDeNumero, bloqueiaPublicacao: true },
      { id: 'selo', rotulo: 'Selo', tipo: 'etiqueta', maximo: 60 },
    ],
  },
  videos: {
    tipo: 'videos',
    nome: 'Vídeos',
    variacoes: [
      { id: 'carrossel', nome: 'Carrossel' },
      { id: 'grade', nome: 'Grade' },
      { id: 'destaque', nome: 'Um grande e os outros pequenos' },
    ],
    campos: [
      titulo,
      {
        id: 'itens',
        rotulo: 'Vídeos',
        tipo: 'lista',
        itens: [
          { id: 'titulo', rotulo: 'Título do vídeo', tipo: 'titulo', maximo: 60, obrigatorio: true },
          { id: 'visualizacoes', rotulo: 'Visualizações', tipo: 'etiqueta', maximo: 12 },
          { id: 'marca', rotulo: 'Marca parceira', tipo: 'etiqueta', maximo: 40 },
          { id: 'video', rotulo: 'Vídeo', tipo: 'video' },
          { id: 'capa', rotulo: 'Capa (troque se quiser outra)', tipo: 'imagem' },
        ],
      },
    ],
  },
  marcas: {
    tipo: 'marcas',
    nome: 'Marcas',
    ocultoNoModoIniciante: true,
    variacoes: [
      { id: 'logos', nome: 'Logos' },
      { id: 'lista', nome: 'Nomes em lista' },
    ],
    campos: [
      titulo,
      {
        id: 'itens',
        rotulo: 'Marcas',
        tipo: 'lista',
        itens: [
          { id: 'nome', rotulo: 'Nome da marca', tipo: 'titulo', maximo: 40, obrigatorio: true },
          { id: 'resultado', rotulo: 'Resultado da publi', tipo: 'etiqueta', maximo: 60 },
          { id: 'logo', rotulo: 'Logo', tipo: 'imagem' },
        ],
      },
    ],
  },
  publico: {
    tipo: 'publico',
    nome: 'Público',
    ocultoNoModoIniciante: true,
    variacoes: [
      { id: 'idade', nome: 'Idade' },
      { id: 'cidades', nome: 'Cidades' },
    ],
    campos: [
      titulo,
      { id: 'itens', rotulo: 'Dados do público', tipo: 'lista', itens: itemDeNumero, bloqueiaPublicacao: true },
      { id: 'selo', rotulo: 'Selo', tipo: 'etiqueta', maximo: 60 },
    ],
  },
  formatos: {
    tipo: 'formatos',
    nome: 'Formatos e pacotes',
    variacoes: [
      { id: 'cards', nome: 'Cards' },
      { id: 'tabela', nome: 'Tabela' },
    ],
    campos: [
      titulo,
      {
        id: 'itens',
        rotulo: 'Formatos',
        tipo: 'lista',
        itens: [
          { id: 'titulo', rotulo: 'Nome do formato', tipo: 'titulo', maximo: 40, obrigatorio: true },
          { id: 'descricao', rotulo: 'Descrição', tipo: 'texto', maximo: 140 },
          {
            id: 'inclui',
            rotulo: 'O que inclui',
            tipo: 'texto',
            maximo: 140,
            dica: 'Ex.: quantos vídeos, formato, uso do conteúdo.',
          },
          { id: 'prazo', rotulo: 'Prazo de entrega (opcional)', tipo: 'etiqueta', maximo: 30 },
          { id: 'preco', rotulo: 'Preço (só se você quiser mostrar)', tipo: 'etiqueta', maximo: 30 },
        ],
      },
    ],
  },
  processo: {
    tipo: 'processo',
    nome: 'Como eu trabalho',
    variacoes: [
      { id: 'passos', nome: 'Passos em cartões' },
      { id: 'linha', nome: 'Linha' },
    ],
    campos: [
      { ...titulo, serveComoEsta: true },
      {
        id: 'itens',
        rotulo: 'Etapas',
        tipo: 'lista',
        itens: [
          { id: 'titulo', rotulo: 'Etapa', tipo: 'titulo', maximo: 30, obrigatorio: true },
          { id: 'texto', rotulo: 'O que acontece', tipo: 'texto', maximo: 100 },
          { id: 'prazo', rotulo: 'Prazo (opcional)', tipo: 'etiqueta', maximo: 24 },
        ],
      },
    ],
    inicial: {
      titulo: 'Como eu trabalho',
      itens: [
        { titulo: 'Briefing', texto: 'Você me conta o objetivo e o que não pode faltar.' },
        { titulo: 'Roteiro', texto: 'Eu proponho o roteiro e você aprova antes de gravar.' },
        { titulo: 'Gravação', texto: 'Eu gravo e edito do meu jeito, com o seu produto em cena.' },
        { titulo: 'Entrega', texto: 'Você recebe o vídeo pronto para publicar.' },
      ],
    },
  },
  contato: {
    tipo: 'contato',
    nome: 'Contato',
    fixo: true,
    variacoes: [
      { id: 'botoes', nome: 'Botões' },
      { id: 'formulario', nome: 'Formulário de briefing' },
    ],
    campos: [
      titulo,
      { id: 'whatsapp', rotulo: 'WhatsApp', tipo: 'botao', obrigatorio: true, maximo: 20 },
      { id: 'email', rotulo: 'E-mail', tipo: 'botao', obrigatorio: true, maximo: 120 },
      { id: 'prazo', rotulo: 'Prazo de resposta', tipo: 'etiqueta', maximo: 60 },
    ],
  },
} as const satisfies Record<string, DefinicaoDeBloco>;

export type TipoDeBloco = keyof typeof BLOCOS;

/** O registro como o `validarProjeto` espera. */
export const REGISTRO: Registro = BLOCOS;
