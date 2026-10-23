// Registro central dos blocos (DEV-060): a lista que o editor, a validação e a página publicada consultam.
// Cada bloco novo entra aqui e ganha o componente em src/blocks/<tipo>/ (um componente só, no editor e no ar).
// Variações: as duas primeiras de cada bloco na tabela do docs/02-construtor.md (escopo da v1, ver backlog);
// as demais entram depois. Limites de letras são ponto de partida e se ajustam bloco a bloco (DEV-061 a 068).
import type { DefinicaoDeBloco, Registro } from '@lib/bloco';

const titulo = { id: 'titulo', rotulo: 'Título', tipo: 'titulo', maximo: 60 } as const;

export const BLOCOS = {
  capa: {
    tipo: 'capa',
    nome: 'Capa',
    fixo: true,
    variacoes: [
      { id: 'foto-grande', nome: 'Foto grande' },
      { id: 'foto-redonda', nome: 'Foto redonda centralizada' },
    ],
    campos: [
      { ...titulo, obrigatorio: true },
      { id: 'subtitulo', rotulo: 'Subtítulo', tipo: 'texto', maximo: 120 },
      { id: 'foto', rotulo: 'Foto', tipo: 'imagem' },
      { id: 'botao', rotulo: 'Botão', tipo: 'botao', maximo: 24 },
    ],
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
  numeros: {
    tipo: 'numeros',
    nome: 'Números',
    ocultoNoModoIniciante: true,
    variacoes: [
      { id: 'cards', nome: 'Cards' },
      { id: 'barras', nome: 'Barras comparando' },
    ],
    // os números são sempre da creator: nenhum exemplo pode ir para o ar (regra 1 do guia)
    campos: [{ id: 'itens', rotulo: 'Números', tipo: 'lista', bloqueiaPublicacao: true }],
  },
  videos: {
    tipo: 'videos',
    nome: 'Vídeos',
    variacoes: [
      { id: 'carrossel', nome: 'Carrossel' },
      { id: 'grade', nome: 'Grade' },
    ],
    campos: [titulo, { id: 'itens', rotulo: 'Vídeos', tipo: 'lista' }],
  },
  marcas: {
    tipo: 'marcas',
    nome: 'Marcas',
    ocultoNoModoIniciante: true,
    variacoes: [
      { id: 'logos', nome: 'Logos' },
      { id: 'lista', nome: 'Nomes em lista' },
    ],
    campos: [titulo, { id: 'itens', rotulo: 'Marcas', tipo: 'lista' }],
  },
  publico: {
    tipo: 'publico',
    nome: 'Público',
    ocultoNoModoIniciante: true,
    variacoes: [
      { id: 'idade', nome: 'Idade' },
      { id: 'cidades', nome: 'Cidades' },
    ],
    campos: [titulo, { id: 'itens', rotulo: 'Dados do público', tipo: 'lista', bloqueiaPublicacao: true }],
  },
  formatos: {
    tipo: 'formatos',
    nome: 'Formatos e pacotes',
    variacoes: [
      { id: 'cards', nome: 'Cards' },
      { id: 'tabela', nome: 'Tabela' },
    ],
    campos: [titulo, { id: 'itens', rotulo: 'Formatos', tipo: 'lista' }],
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
    ],
  },
} as const satisfies Record<string, DefinicaoDeBloco>;

export type TipoDeBloco = keyof typeof BLOCOS;

/** O registro como o `validarProjeto` espera. */
export const REGISTRO: Registro = BLOCOS;
