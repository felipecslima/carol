// "Próximo passo" do Início (DEV-041): um cartão só, calculado pelo estado do projeto. A pergunta que guia tudo:
// "o meu portfólio está pronto para mandar para uma marca?". Sem publicação por enquanto: o último passo é ver como a marca vê.
import type { Alerta } from './revisao';
import { infoDoEstado } from './estados';

export interface PassoSeguinte {
  titulo: string;
  texto: string;
  acao: { rotulo: string; href: string };
  /** segunda ação, mais discreta */
  secundaria?: { rotulo: string; href: string };
}

export interface EntradaDoPasso {
  temProjeto: boolean;
  estado: string;
  alertas: Alerta[];
  seus: number;
  total: number;
  temLink: boolean;
  /** link no ar ou reservado */
  slug?: string;
}

export function proximoPasso(e: EntradaDoPasso): PassoSeguinte {
  if (!e.temProjeto)
    return {
      titulo: 'Monte seu portfólio',
      texto: 'Responda algumas perguntas, escolha o modelo e ajuste tudo no celular.',
      acao: { rotulo: 'Começar', href: '/app/novo/' },
    };

  if (!infoDoEstado(e.estado).editavel)
    return {
      titulo: 'Seu portfólio está travado para edição',
      texto: 'O prazo de edição acabou. Você ainda pode ver como ficou.',
      acao: { rotulo: 'Ver portfólio', href: '/app/editor/' },
    };

  if (e.estado === 'aguardando_pagamento')
    return {
      titulo: 'Pedido enviado, falta o pagamento',
      texto: `Seu link /c/${e.slug ?? ''} está reservado. A equipe te chama no WhatsApp com o link de pagamento; depois disso o portfólio vai ao ar.`,
      acao: { rotulo: 'Continuar editando', href: '/app/editor/' },
      secundaria: { rotulo: 'Ver como a marca vê', href: '/app/editor/?ver=1' },
    };
  if (e.estado === 'no_ar' && e.slug)
    return {
      titulo: 'Seu portfólio está no ar',
      texto: 'Agora é mandar para as marcas. Cada marca recebe um link próprio e você é avisada quando abrir.',
      acao: { rotulo: 'Mandar para uma marca', href: '/app/#projetos' },
      secundaria: { rotulo: 'Abrir meu link', href: `/c/${e.slug}/` },
    };

  const vermelhos = e.alertas.filter((a) => a.gravidade === 'vermelho');
  const amarelos = e.alertas.filter((a) => a.gravidade === 'amarelo');
  const faltam = e.total - e.seus;
  // exemplo que sobrou é o primeiro passo: o texto fala do que ela mais reconhece
  if (faltam > 0 && vermelhos.some((a) => /exemplo/i.test(a.mensagem)))
    return {
      titulo: `Troque os itens de exemplo: ${e.seus} de ${e.total} já são seus`,
      texto: 'Os textos, vídeos e números de exemplo nunca vão para o ar. Troque pelos seus, um de cada vez.',
      acao: { rotulo: 'Continuar editando', href: '/app/editor/' },
    };
  if (vermelhos.length > 0)
    return {
      titulo: `Resolva ${vermelhos.length === 1 ? 'um ponto' : `${vermelhos.length} pontos`} antes de publicar`,
      texto: vermelhos[0]!.mensagem,
      acao: { rotulo: 'Abrir a revisão', href: '/app/editor/' },
    };
  if (!e.temLink)
    return {
      titulo: 'Escolha o link do seu portfólio',
      texto: 'É o endereço que você coloca na bio. Letras, números e hífen.',
      acao: { rotulo: 'Escolher o link', href: '/app/editor/' },
    };
  if (amarelos.length > 0)
    return {
      titulo: `Falta pouco: ${amarelos.length === 1 ? 'uma sugestão' : `${amarelos.length} sugestões`}`,
      texto: amarelos[0]!.mensagem,
      acao: { rotulo: 'Continuar editando', href: '/app/editor/' },
    };
  return {
    titulo: 'Seu portfólio está pronto',
    texto: 'É assim que a marca vai ver. Publique quando estiver pronto.',
    acao: { rotulo: 'Publicar', href: '/app/editor/?publicar=1' },
    secundaria: { rotulo: 'Ver como a marca vê', href: '/app/editor/?ver=1' },
  };
}
