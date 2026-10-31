// Portfólio Creator: produto da Carol para creators iniciantes montarem portfólio e mídia kit.
// Página de vendas em /portfolio-creator/ (só em português). Textos, preços e regras vêm do handoff
// (portfolio-creator-handoff.zip, apagado em 31/out: 01-especificacao.md, 02-planos-e-precos.md). Frases que só estavam no
// protótipo e não na especificação ("menos de 15 minutos", "acompanhamento da Carol", "contato que fecha")
// ficam de fora até a Carol confirmar.

export const PC_PATH = '/portfolio-creator/';

const DM_CAROL = 'https://ig.me/m/eu.carollimah';

export const PC = {
  instagram: 'https://www.instagram.com/eu.carollimah',
  // Todo botão de ação leva ao assistente que monta o portfólio (teste grátis, sem conta até publicar).
  cta: '/app/novo/',
  /** direct da Carol: dúvidas, desistência e as 5 ferramentas em breve */
  dm: DM_CAROL,
  // wa.me/55DDDNÚMERO; vazio esconde os links de WhatsApp
  whatsapp: '',
  // PENDENTE antes de vender: página de Termos e Privacidade (o rascunho do handoff ainda não tem razão social,
  // CNPJ nem e-mail). Vazio mostra o texto sem link.
  termos: '/portfolio-creator/termos/',
  // vagas abertas para as 5 primeiras creators; null esconde a contagem
  vagas: null as number | null,
};

/** link de um item; vazio = ainda não existe e o cartão aparece como "em breve" */
type Link = { href: string };

export const PAINS = [
  { title: 'Você trava quando a marca pede', text: 'Montar um mídia kit do zero leva dias e geralmente fica com cara de amador.' },
  { title: 'Seus números não aparecem', text: 'Views muito acima dos seguidores é um argumento forte, mas só se estiver bem mostrado.' },
  { title: 'Atualizar sai caro', text: 'Mídia kit feito por designer costuma ser um gasto novo a cada vez que seus números crescem.' },
];

export const CAROL = {
  stats: [
    { value: '+400', label: 'publis feitas' },
    { value: '+40', label: 'marcas atendidas' },
    { value: '+58 mil', label: 'seguidores' },
  ],
  segments: ['Restaurantes', 'Hotéis', 'Turismo', 'Eventos e shows', 'Lifestyle'],
};

export const STEPS = [
  { title: 'Monte com seções prontas', text: '11 seções pensadas para o que a marca procura: capa, vídeos, números, público, marcas e mais. Você escolhe quais entram, a ordem e o layout de cada uma.' },
  { title: 'Suba vídeos e seus números', text: 'Você sobe os vídeos que gravou e digita os números do seu Instagram. Eles entram formatados no portfólio, e você confere tudo antes de concluir.' },
  { title: 'Baixe ou publique', text: 'Baixe o PDF para mandar para a marca, ou peça para a equipe colocar seu site no ar.' },
];

export const BEGINNER = [
  'Funciona com 0 publis e qualquer número de seguidores',
  'Vídeos de exemplo com produtos que você já tem em casa',
  'Quando seus números crescerem, é só mostrar as seções de números',
];

// o que a marca vê no portfólio pronto (só o que a especificação sustenta)
export const BENEFITS = [
  { title: 'Seus números em destaque', text: 'Seguidores, views em 30 dias e média por reel logo no começo, do jeito que as marcas procuram.' },
  { title: 'Vídeos em galeria vertical', text: 'Seus vídeos em carrossel, grade ou um em destaque, com a marca de cada publi quando você tiver.' },
  { title: 'Quem assiste você', text: 'Gênero, idade e cidades do seu público em gráficos fáceis de ler.' },
];

// vitrine de seções: o portfólio real da Carol no editor, fotografado por scripts/portfolio-creator-secoes.mjs
// (public/media/pc/secao-<file>.webp); os layouts são os nomes das variações em src/blocks/registro.ts
export const SECOES = [
  { name: 'Capa', layouts: 'foto grande, foto redonda ou foto e vídeo de fundo', file: 'capa' },
  { name: 'Vídeos', layouts: 'carrossel, grade ou um grande e os outros pequenos', file: 'videos' },
  { name: 'Números', layouts: 'cards ou barras comparando', file: 'numeros' },
  { name: 'Público', layouts: 'idade ou cidades', file: 'publico' },
  { name: 'Marcas', layouts: 'logos ou nomes em lista', file: 'marcas' },
  { name: 'Formatos e pacotes', layouts: 'cards ou tabela', file: 'formatos' },
];

export const TRIAL = [
  'Sem cartão de crédito',
  'Monte o portfólio inteiro e veja como fica, com marca d’água',
  'Feito primeiro para o celular',
];

export const FOUNDERS = [
  { title: 'Plano PDF liberado de graça', text: 'Portfólio completo e mídia kit, sem marca d’água.' },
  { title: 'Seu depoimento aqui', text: 'Com seu nome e @, depois de usar de verdade.' },
];

// ferramentas grátis: cada uma ganha a sua página; até lá, o cartão aparece como "em breve"
export const FREE: (Link & { title: string; text: string; action: string })[] = [
  { title: 'Qual caminho é o seu?', text: 'A diferença entre criadora de conteúdo, influencer, UGC, UGC Tech e UGC Canvas, explicada de um jeito simples.', action: 'Entender as diferenças', href: '' },
  { title: 'Desafio 7 dias', text: 'Uma missão por dia no WhatsApp, por 7 dias, com dicas de ouro.', action: 'Entrar no desafio', href: '' },
  { title: 'Guia do iniciante', text: 'Banco de ganchos e roteiros por nicho (beleza, tech, restaurante, casa, moda, pet e mais), gravação e CapCut.', action: 'Ler o guia', href: '' },
  { title: 'Apps de vagas', text: '30 plataformas e apps de UGC, vagas, testes de produto e afiliados, com o que cada um pede.', action: 'Ver a lista', href: '' },
  { title: 'Mensagens prontas', text: 'Textos para tipos de marca e para as situações difíceis, como responder “qual o seu valor?”.', action: 'Copiar mensagens', href: '' },
];
export const GUIDE = FREE[2];

export const PLANS = [
  {
    key: 'pdf',
    label: 'Portfólio em PDF + link',
    price: 'R$ 49,90',
    note: 'pagamento único',
    items: [
      'Todas as seções e o Estilo completo: cores, fontes e cantos',
      'Portfólio completo em PDF, sem marca d’água',
      'Mídia kit de 1 página no mesmo estilo',
      'Seu link portfoliocreator.com.br/seunome',
      'Você edita até concluir e ainda ajusta por mais 7 dias',
      'Revisão guiada antes de concluir, para não sair nada errado',
    ],
    action: 'Quero este plano',
  },
  {
    key: 'site',
    label: 'Portfólio em site',
    price: 'R$ 149,90',
    note: '+ R$ 40 de domínio no 1º ano: R$ 189,90 no total. Pagamento único, domínio anual.',
    items: [
      'Tudo do plano PDF',
      '12 meses no ar, com domínio .com.br no seu nome e no seu CPF',
      'Você cria a conta no Registro.br e a equipe publica seu site',
      'A equipe te chama no WhatsApp em até 2 dias úteis',
      'No 2º ano, renovar é opcional: R$ 79,90',
    ],
    action: 'Quero este plano',
  },
  {
    key: 'atualizacao',
    label: 'Atualização mensal',
    price: 'R$ 19,90',
    per: '/mês',
    note: 'assinatura recorrente, para quem já tem o PDF ou o site',
    yearly: 'ou R$ 179 por ano (sai a R$ 14,92/mês)',
    items: [
      'Libera a aba Editar no seu painel',
      'Inclui seu link portfoliocreator.com.br/seunome',
      'Você mesma muda números, vídeos e marcas, quando quiser',
      'Site e PDF se atualizam na hora',
      'Troque seções, layouts e cores quando quiser',
      'Mensal: cancele quando quiser, sem multa. Anual: sem reembolso proporcional depois dos 7 dias',
    ],
    action: 'Quero este plano',
  },
];

export const FAQ = [
  { q: 'Posso usar sem seguidores ou sem nunca ter feito publi?', a: 'Pode. O modo iniciante esconde números e marcas e destaca seus vídeos de exemplo e o que você entrega. O guia que vou lançar ensina a gravar com produtos que você já tem.' },
  { q: 'Quanto custa no total?', a: 'PDF + link: R$ 49,90, uma vez. Site: R$ 149,90 mais R$ 40 de domínio no 1º ano, R$ 189,90 no total; renovar no 2º ano é opcional, R$ 79,90 por ano. Atualização: R$ 19,90 por mês ou R$ 179 por ano.' },
  { q: 'O domínio fica no meu nome?', a: 'Fica. O domínio .com.br é registrado no seu nome e no seu CPF. Você cria a conta no Registro.br, a gente te orienta, e a equipe publica seu site em até 2 dias úteis. Já tem o PDF + link? Passe para o domínio próprio por R$ 100,00 mais a taxa do domínio.' },
  { q: 'E se eu não gostar?', a: 'Você tem 7 dias depois da compra para desistir e receber o dinheiro de volta. É só me chamar no direct do Instagram. Antes de pagar, dá para testar de graça.' },
  { q: 'O que eu preciso ter em mãos?', a: 'Os vídeos que você gravou (até 100 MB cada) e, se quiser mostrar números, as estatísticas do seu Instagram abertas para copiar.' },
  { q: 'Como entram os meus números?', a: 'Você digita seguidores, views e dados do público, e eles aparecem formatados no portfólio, com o período de referência. Antes de concluir, a revisão aponta o que ainda está com número de exemplo.' },
  { q: 'O teste grátis tem limite?', a: 'No teste você monta o portfólio inteiro, com todas as seções, e vê como fica, com marca d’água. Baixar o PDF e publicar o site são liberados quando você escolhe um plano.' },
  { q: 'Posso mudar meu site depois de publicado?', a: 'Pode. Com a atualização mensal, a aba Editar fica liberada e você mesma muda o que quiser: o site e o PDF se atualizam na hora. Sem assinatura, dá para liberar a aba Editar por 30 dias por R$ 49,90. Sem um dos dois, o site fica como foi publicado.' },
  { q: 'Posso cancelar a atualização mensal?', a: 'Pode, quando quiser e sem multa, e a aba Editar continua liberada até o fim do mês já pago. No plano anual (R$ 179), o pagamento já cobre os 12 meses, sem reembolso proporcional depois dos 7 dias de desistência.' },
];
