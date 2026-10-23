// Portfólio Creator: produto da Carol para creators iniciantes montarem portfólio e mídia kit.
// Página de vendas em /portfolio-creator/ (só em português). Textos, preços e regras vêm do handoff
// (portfolio-creator-handoff.zip: 01-especificacao.md, 02-planos-e-precos.md). Frases que só estavam no
// protótipo e não na especificação ("menos de 15 minutos", "acompanhamento da Carol", "contato que fecha")
// ficam de fora até a Carol confirmar.

export const PC_PATH = '/portfolio-creator/';

const DM_CAROL = 'https://ig.me/m/eu.carollimah';

export const PC = {
  instagram: 'https://www.instagram.com/eu.carollimah',
  // Enquanto o cadastro e o pagamento não existem, todo botão de ação abre a DM da Carol (e a página diz isso).
  // Quando existirem, troque aqui (ex.: '/portfolio-creator/criar-conta/') e tire os avisos de "direct" da view.
  cta: DM_CAROL,
  // wa.me/55DDDNÚMERO; vazio esconde os links de WhatsApp
  whatsapp: '',
  // PENDENTE antes de vender: página de Termos e Privacidade (o rascunho do handoff ainda não tem razão social,
  // CNPJ nem e-mail). Vazio mostra o texto sem link.
  termos: '',
  cupom: 'LANCAMENTO10',
  cupomAte: '30/11',
  /** fim do cupom (fim do dia em Brasília): depois disso a faixa e os avisos de cupom somem sozinhos */
  cupomFim: '2026-11-30T23:59:59-03:00',
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
  { title: 'Escolha seu modelo', text: '15 modelos com layouts diferentes: suave, colorido, sério, casual, luxo, neon… e 3 paletas em cada um.' },
  { title: 'Suba vídeos e prints', text: 'Você sobe até 10 vídeos e os prints das estatísticas do Instagram. A IA lê os prints e preenche os números, e você só confere.' },
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
  { title: 'Prints do Instagram junto dos números', text: 'Seus prints entram no portfólio ao lado dos números que você mostra.' },
  { title: 'Vídeos em galeria vertical', text: 'Até 10 vídeos, com a marca de cada publi quando você tiver.' },
  { title: 'Quem assiste você', text: 'Gênero, idade e cidades do seu público em gráficos fáceis de ler.' },
];

// imagens geradas por scripts/portfolio-creator-shots.mjs (public/media/pc/modelo-<file>.webp)
export const MODELS = [
  { name: 'Nuvem', vibe: 'centralizado', file: 'nuvem' },
  { name: 'Clean', vibe: 'coluna lateral', file: 'clean' },
  { name: 'Pop Color', vibe: 'bento', file: 'pop' },
  { name: 'Executivo', vibe: 'relatório', file: 'executivo' },
  { name: 'Editorial', vibe: 'revista', file: 'editorial' },
  { name: 'Casual', vibe: 'scrapbook', file: 'casual' },
  { name: 'Glow Rosé', vibe: 'arcos', file: 'glow' },
  { name: 'Neon', vibe: 'painel gamer', file: 'neon' },
  { name: 'Terra', vibe: 'capítulos', file: 'terra' },
  { name: 'Tropical', vibe: 'embarque', file: 'tropical' },
  { name: 'Assinatura', vibe: 'elegante', file: 'assinatura' },
  { name: 'Cinema', vibe: 'trailer', file: 'cinema' },
  { name: 'Retrô', vibe: 'anos 2000', file: 'retro' },
  { name: 'Placar', vibe: 'esportivo', file: 'placar' },
  { name: 'Galeria', vibe: 'museu', file: 'galeria' },
];

export const TRIAL = [
  'Sem cartão de crédito',
  '5 dos 15 modelos liberados para montar, com marca d’água',
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
      'Escolha entre os 15 modelos e 3 paletas',
      'IA que lê seus prints do Instagram',
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
      'Troque de modelo e de cores quando quiser',
      'Mensal: cancele quando quiser, sem multa. Anual: sem reembolso proporcional depois dos 7 dias',
    ],
    action: 'Quero este plano',
  },
];

export const FAQ = [
  { q: 'Posso usar sem seguidores ou sem nunca ter feito publi?', a: 'Pode. O modo iniciante esconde números e marcas e destaca seus vídeos de exemplo e o que você entrega. O guia que vou lançar ensina a gravar com produtos que você já tem.' },
  { q: 'Quanto custa no total?', a: 'PDF + link: R$ 49,90, uma vez. Site: R$ 149,90 mais R$ 40 de domínio no 1º ano, R$ 189,90 no total; renovar no 2º ano é opcional, R$ 79,90 por ano. Atualização: R$ 19,90 por mês ou R$ 179 por ano.' },
  { q: 'O domínio fica no meu nome?', a: 'Fica. O domínio .com.br é registrado no seu nome e no seu CPF. Você cria a conta no Registro.br, a gente te orienta, e a equipe publica seu site em até 2 dias úteis. Já tem o PDF + link? Passe para o domínio próprio por R$ 100,00 mais a taxa do domínio.' },
  { q: 'Como funciona o cupom?', a: 'O LANCAMENTO10 dá 10% no valor do plano até 30/11. Não vale para a taxa do domínio e não soma com outros descontos.' },
  { q: 'E se eu não gostar?', a: 'Você tem 7 dias depois da compra para desistir e receber o dinheiro de volta. É só me chamar no direct do Instagram. Antes de pagar, dá para testar de graça.' },
  { q: 'O que eu preciso ter em mãos?', a: 'Os vídeos que você gravou (até 10, de até 50 MB e 60 segundos cada) e, se quiser mostrar números, os prints das estatísticas do Instagram.' },
  { q: 'Como a IA lê meus prints?', a: 'Você sobe os prints das estatísticas e os números são preenchidos automaticamente. Você confere e corrige se precisar.' },
  { q: 'O teste grátis tem limite?', a: 'No teste, 5 modelos ficam liberados para você montar seu portfólio, com marca d’água. Os outros 10 aparecem com cadeado e são liberados quando você escolhe um plano, assim como baixar o PDF e publicar o site.' },
  { q: 'Posso mudar meu site depois de publicado?', a: 'Pode. Com a atualização mensal, a aba Editar fica liberada e você mesma muda o que quiser: o site e o PDF se atualizam na hora. Sem assinatura, dá para liberar a aba Editar por 30 dias por R$ 49,90. Sem um dos dois, o site fica como foi publicado.' },
  { q: 'Posso cancelar a atualização mensal?', a: 'Pode, quando quiser e sem multa, e a aba Editar continua liberada até o fim do mês já pago. No plano anual (R$ 179), o pagamento já cobre os 12 meses, sem reembolso proporcional depois dos 7 dias de desistência.' },
];
