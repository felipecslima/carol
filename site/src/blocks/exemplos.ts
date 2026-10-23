// Conteúdo de exemplo do modelo: o que a creator vê no primeiro toque, para entender o que vai em cada espaço.
// Tudo aqui é placeholder (`exemplo: true`) e nunca vai para o ar: número de exemplo bloqueia a publicação.
// Os números são só para mostrar o desenho do bloco, não representam ninguém.
import type { Projeto } from '@lib/projeto';

const exemplo = true;

export const PROJETO_DE_EXEMPLO: Projeto = {
  tipo: 'site',
  modelo: 'nuvem',
  paleta: 0,
  fontes: 'par-nuvem',
  cantos: 'redondos',
  modoIniciante: false,
  guardados: [],
  blocos: [
    {
      id: 'capa',
      tipo: 'capa',
      variacao: 'foto-redonda',
      oculto: false,
      dados: {
        arroba: '@seuarroba · sua cidade',
        titulo: 'Oi, eu sou [seu nome] e mostro [o que você faz] do meu jeito',
        botao: 'Vamos fazer uma parceria?',
      },
    },
    {
      id: 'numeros',
      tipo: 'numeros',
      variacao: 'cards',
      oculto: false,
      dados: {
        itens: [
          { valor: '00 mil', rotulo: 'seguidores', exemplo },
          { valor: '0,0 mi', rotulo: 'views em 30 dias', exemplo },
          { valor: '00 mil', rotulo: 'média por vídeo', exemplo },
        ],
      },
    },
    {
      id: 'videos',
      tipo: 'videos',
      variacao: 'carrossel',
      oculto: false,
      dados: {
        titulo: 'Meus vídeos',
        itens: [
          { titulo: 'Título do seu vídeo', visualizacoes: '000 mil', exemplo },
          { titulo: 'Outro vídeo seu', visualizacoes: '000 mil', marca: 'marca parceira', exemplo },
          { titulo: 'Mais um vídeo', visualizacoes: '000 mil', exemplo },
          { titulo: 'Seu melhor vídeo', visualizacoes: '000 mil', exemplo },
        ],
      },
    },
    {
      id: 'sobre',
      tipo: 'sobre',
      variacao: 'texto-foto',
      oculto: false,
      dados: {
        titulo: 'Sobre mim',
        texto:
          'Conte em poucas linhas quem você é, o que você mostra e por que as marcas gostam de trabalhar com você.',
        nichos: ['seu nicho', 'outro nicho'],
      },
    },
    {
      id: 'publico',
      tipo: 'publico',
      variacao: 'idade',
      oculto: false,
      dados: {
        titulo: 'Quem me assiste',
        itens: [
          { valor: '00%', rotulo: 'faixa de idade', exemplo },
          { valor: '00%', rotulo: 'gênero', exemplo },
          { valor: '00%', rotulo: 'cidade principal', exemplo },
        ],
      },
    },
    {
      id: 'formatos',
      tipo: 'formatos',
      variacao: 'cards',
      oculto: false,
      dados: {
        titulo: 'Como podemos trabalhar juntas',
        itens: [
          { titulo: 'Reels e stories', descricao: 'No meu perfil, no meu jeito', exemplo },
          { titulo: 'Vídeos UGC', descricao: 'Para os seus anúncios', exemplo },
          { titulo: 'Visita e cobertura', descricao: 'Eu vou até você', exemplo },
        ],
      },
    },
    {
      id: 'contato',
      tipo: 'contato',
      variacao: 'botoes',
      oculto: false,
      dados: {
        titulo: 'Vamos criar algo lindo juntas?',
        email: 'voce@email.com',
        whatsapp: '+55 11 90000-0000',
        prazo: 'Respondo em até 2 dias úteis',
      },
    },
  ],
};
