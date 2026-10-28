// Estados de um projeto (DEV-044): rascunho → aguardando pagamento → no ar → edição travada → fora do ar. O servidor
// muda o estado; aqui ficam o texto, a regra de edição e o botão principal de cada um (área Projetos).

export const ESTADOS = ['rascunho', 'aguardando_pagamento', 'no_ar', 'edicao_travada', 'fora_do_ar'] as const;
export type EstadoDoProjeto = (typeof ESTADOS)[number];

export type AcaoDoProjeto = 'editar' | 'ver';

export interface InfoDoEstado {
  rotulo: string;
  descricao: string;
  /** pode mexer no conteúdo? (edição travada = só ver) */
  editavel: boolean;
  botao: { texto: string; acao: AcaoDoProjeto };
}

export const INFO_DO_ESTADO: Record<EstadoDoProjeto, InfoDoEstado> = {
  rascunho: {
    rotulo: 'Rascunho',
    descricao: 'Só você vê. Continue montando.',
    editavel: true,
    botao: { texto: 'Continuar editando', acao: 'editar' },
  },
  aguardando_pagamento: {
    rotulo: 'Aguardando pagamento',
    descricao: 'Seu pedido foi enviado. Você ainda pode ajustar o conteúdo.',
    editavel: true,
    botao: { texto: 'Continuar editando', acao: 'editar' },
  },
  no_ar: {
    rotulo: 'No ar',
    descricao: 'Seu portfólio está publicado.',
    editavel: true,
    botao: { texto: 'Editar', acao: 'editar' },
  },
  edicao_travada: {
    rotulo: 'Edição travada',
    descricao: 'O prazo de edição acabou. O portfólio continua no ar; para publicar mudanças, libere a edição.',
    editavel: false,
    botao: { texto: 'Ver portfólio', acao: 'ver' },
  },
  fora_do_ar: {
    rotulo: 'Fora do ar',
    descricao: 'Seu portfólio saiu do ar. O conteúdo continua guardado.',
    editavel: true,
    botao: { texto: 'Editar', acao: 'editar' },
  },
};

/** Estado desconhecido (valor novo no banco) cai em rascunho em vez de quebrar a tela. */
export const infoDoEstado = (estado: string): InfoDoEstado =>
  INFO_DO_ESTADO[estado as EstadoDoProjeto] ?? INFO_DO_ESTADO.rascunho;
