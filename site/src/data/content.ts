export const EMAIL = 'parceria.eucarollimah@gmail.com';
/** WhatsApp comercial da Carol, com DDI; vazio = o botão não aparece (site e media kit). */
const WHATSAPP_NUMBER = '+55 12 99137-6550';
/** só dígitos, como o wa.me exige */
export const WHATSAPP = WHATSAPP_NUMBER.replace(/\D/g, '');
export const RESPONSE_TIME = 'Respondo em até 2 dias úteis.';
/** o que a marca deve mandar no primeiro e-mail; vira o corpo do mailto (com "Marca" antes) */
export const BRIEF = ['Objetivo da campanha', 'Período ou datas', 'Formato desejado', 'Verba (opcional)'];
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Parceria com Carol Limah')}&body=${encodeURIComponent(
  `Oi, Carol!\n\n${['Marca', ...BRIEF].map((b) => `${b}: `).join('\n')}\n`,
)}`;
export const WA_HREF = WHATSAPP
  ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Oi, Carol! Quero falar sobre uma parceria com a marca ')}`
  : null;
/** gerado por `npm run pdf` a partir de /media-kit/ */
export const MEDIA_KIT_PDF = '/carol-limah-media-kit.pdf';

// Vídeos no Cloudinary (pasta carol-limah/, enviados por scripts/cloudinary-upload.mjs). Sem
// PUBLIC_CLOUDINARY_CLOUD_NAME no .env, o site usa os arquivos locais de public/media.
const CLOUD = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME as string | undefined;
export const CLOUDINARY_ORIGIN = CLOUD ? 'https://res.cloudinary.com' : null;
/** segundo do vídeo usado como capa (os mesmos quadros dos antigos *-poster.jpg) */
const POSTER_T: Record<string, number> = {
  v02: 0.9, v05: 0.9, v14: 0.9, v17: 0.9, v20: 23.6, v21: 1.1, v22: 3.4, v23: 1.9, v24: 0.4, v25: 28.1, v26: 17.5, v27: 24, v28: 0.5, v29: 7.5, v30: 14, v31: 27, v32: 6.5, v33: 8, v34: 3, v35: 12, v36: 6, v37: 8, v38: 19, v39: 36, v40: 11, v41: 0.5, v43: 0.3, v44: 49, v46: 3, v47: 24, v48: 120, v49: 0.5, v50: 2, v51: 1.5, v52: 0.5,
};
const cld = (t: string, id: string) => `https://res.cloudinary.com/${CLOUD}/video/upload/${t}/carol-limah/${id}`;
// vídeo sem transformação: o mp4 enviado já é 720p otimizado (f_auto,q_auto deixava maior e gasta créditos)
export const videoSrc = (id: string) => (CLOUD ? `https://res.cloudinary.com/${CLOUD}/video/upload/carol-limah/${id}.mp4` : `/media/${id}.mp4`);
export const posterSrc = (id: string, w = 360) =>
  CLOUD ? `${cld(`so_${POSTER_T[id] ?? 0.8},w_${w},f_auto,q_auto`, id)}.jpg` : `/media/${id}-poster.jpg`;

/** rótulo exibido no card (o que o conteúdo é) */
export type Cat = 'Viagem' | 'Hospedagem' | 'Gastronomia' | 'Moda' | 'Achadinhos' | 'Evento' | 'Bem-estar' | 'Beleza' | 'UGC';

/** filtros do portfólio: alinhados aos formatos que a Carol vende (seção Formatos) */
export const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'publis', label: 'Publis' },
  { key: 'viagem', label: 'Viagem & hospedagem' },
  { key: 'gastronomia', label: 'Gastronomia' },
] as const;

export interface MediaItem {
  video: boolean;
  /** nome do arquivo sem extensão em /media */
  id: string;
  cat: Cat;
  title: string;
  /** marca da parceria; item com marca entra no filtro Publis */
  brand?: string;
  /** views do reel no Instagram, só quando a capa no print da aba Reels bate com o vídeo */
  views?: string;
}

/** grupos de filtro de um item (além de "todos") */
export const groupsOf = (m: MediaItem) => [
  m.brand && 'publis',
  (m.cat === 'Viagem' || m.cat === 'Hospedagem') && 'viagem',
  m.cat === 'Gastronomia' && 'gastronomia',
].filter(Boolean) as string[];

// Títulos conferidos contra a própria mídia (frames + transcrição Whisper); catálogo em CATALOGO-videos.md.
// v26–v52 (exceto v42, outra edição do v26, e v45, que é o vídeo do hero) entraram em 20/out/2026 a pedido do usuário;
// origem em HANDOFF §15. Views de v46–v52 casadas por cena (mesma roupa, lugar e fachada) com as capas do print.
// Ordem: os reels de 1,1 mi e 1 mi primeiro, depois publis por views, depois o resto por views. Ainda dependem da Carol:
//  - v43: Carol de uniforme no consultório; confirmar se entra no media kit. (O v01, mesmo vídeo do hero v45, saiu da grade.)
//  - v17: restaurante do jantar (não identificado).
//  - v21: nome da hospedagem em Ilhabela (placa e fala: "Reserva").
//  - v27: nome da festa (palco "Sampa Tribal"); v30: nome da pousada (placa "…imê Pousada em…").
// views = capa do print da aba Reels (20/out/2026) casada frame a frame com o vídeo.
export const MEDIA: MediaItem[] = [
  { video: true, id: 'v44', cat: 'Gastronomia', title: 'Tacacá perto da Paulista', views: '1,1 mi' },
  { video: true, id: 'v27', cat: 'Evento', title: 'Noite de bumbá em SP', views: '1 mi' },
  { video: true, id: 'v02', cat: 'Moda', title: 'Fit check', brand: 'Shein', views: '478 mil' },
  { video: true, id: 'v23', cat: 'Achadinhos', title: 'Microfone sem fio', brand: 'Mercado Livre', views: '458 mil' },
  { video: true, id: 'v32', cat: 'Achadinhos', title: '8.8 do Mercado Livre', brand: 'Mercado Livre', views: '307 mil' },
  { video: true, id: 'v22', cat: 'Evento', title: 'Montagem do On Fire', brand: 'Churrasco On Fire', views: '293 mil' },
  { video: true, id: 'v46', cat: 'Bem-estar', title: 'Presente de Dia dos Pais', brand: 'Buddha Spa', views: '292 mil' },
  { video: true, id: 'v24', cat: 'Achadinhos', title: 'Carrinho do 10/10', brand: 'Mercado Livre', views: '267 mil' },
  { video: true, id: 'v50', cat: 'Gastronomia', title: 'Sushi e sashimi no Kome', brand: 'Kome Bela Vista', views: '237 mil' },
  { video: true, id: 'v52', cat: 'Gastronomia', title: 'Jantar no Kome', brand: 'Kome', views: '188 mil' },
  { video: true, id: 'v28', cat: 'Evento', title: 'Mercado Livre na CASACOR', brand: 'Mercado Livre', views: '185 mil' },
  { video: true, id: 'v49', cat: 'Gastronomia', title: 'Almoço no Gusto Cucina', brand: 'Gusto Cucina', views: '179 mil' },
  { video: true, id: 'v48', cat: 'Evento', title: 'Noite no Churrasco On Fire', brand: 'Churrasco On Fire', views: '67 mil' },
  { video: true, id: 'v20', cat: 'Gastronomia', title: 'Rodízio executivo no Kome', brand: 'Kome Bela Vista' },
  { video: true, id: 'v31', cat: 'Achadinhos', title: 'Travesseiro de corpo', brand: 'Mercado Livre' },
  { video: true, id: 'v36', cat: 'Beleza', title: 'Shampoo ozonizado', brand: 'Illustratum' },
  { video: true, id: 'v33', cat: 'UGC', title: 'Portal de vagas', brand: 'Vagas Goiânia' },
  { video: false, id: 'p1', cat: 'Gastronomia', title: 'Churrasco On Fire', brand: 'Churrasco On Fire' },
  { video: true, id: 'v41', cat: 'Viagem', title: 'Passeio a cavalo em Jacareí', views: '425 mil' },
  { video: true, id: 'v47', cat: 'Viagem', title: 'Quadriciclo em grupo', views: '335 mil' },
  { video: true, id: 'v25', cat: 'Viagem', title: 'Dia na fazenda', views: '287 mil' },
  { video: true, id: 'v37', cat: 'Viagem', title: 'Aula de três tambores', views: '208 mil' },
  { video: true, id: 'v51', cat: 'Gastronomia', title: 'Almoço no jardim', views: '161 mil' },
  { video: true, id: 'v26', cat: 'Moda', title: 'Conjunto fitness no parque', views: '109 mil' },
  { video: true, id: 'v21', cat: 'Hospedagem', title: 'Hospedagem em Ilhabela' },
  { video: true, id: 'v30', cat: 'Hospedagem', title: 'Pousada em meio à mata' },
  { video: true, id: 'v34', cat: 'Gastronomia', title: 'Sabores do Amazonas em SP' },
  { video: true, id: 'v35', cat: 'Viagem', title: 'Cavalgada em Campos do Jordão' },
  { video: true, id: 'v14', cat: 'Viagem', title: 'Jet ski e quadri em Igaratá' },
  { video: true, id: 'v17', cat: 'Gastronomia', title: 'Jantar a dois' },
  { video: true, id: 'v39', cat: 'Evento', title: 'Coletiva do Festival de Parintins' },
  { video: true, id: 'v38', cat: 'Bem-estar', title: 'Dia de spa' },
  { video: true, id: 'v40', cat: 'Bem-estar', title: 'Aula de pilates' },
  { video: true, id: 'v29', cat: 'Beleza', title: 'Protocolo facial' },
  { video: true, id: 'v43', cat: 'Moda', title: 'Uniforme de consultório' },
  { video: true, id: 'v05', cat: 'Gastronomia', title: '“Virei blogueira”' },
];

// Print completo da aba Reels do Instagram (20/out/2026, 15h32): 165 reels, todos com contador, nenhum fixado.
// Soma 39,88 mi · média 241,7 mil · mediana 183 mil · 74 acima de 200 mil · 18 acima de 500 mil · 2 com 1 mi ou mais.
// ("1 mi"/"1,1 mi" contados como 1.000.000/1.100.000; os números do Instagram já vêm arredondados.)
// Mercado Livre (10 reels, média 479,8 mil): capa com "Mercado Livre", "9.9" ou "10.10" → 683, 661, 645, 601,
// 243, 201 mil; capa casada frame a frame com vídeo de publi ML em medias/ → 458 mil (microfone Hollyland,
// copy_61202D8F…) e 267 mil (10/10, copy_3C49A37F…); 762 mil = post "Meus favoritos de beleza" (#Publi
// @mercadolivre, 18/set, print do post enviado pelo usuário); 277 mil = capa com "ID: 31HZ1H-VQYY" (código de
// produto do Mercado Livre, o mesmo formato da legenda daquele post). Provável e não contado: 315 mil (tela
// amarela de app de compras, sem a marca escrita).
export const REELS_STATS = {
  count: 165,
  total: '39,9 mi',
  average: '242 mil',
  averageK: 241.7,
  median: '183 mil',
  over500: 18,
  overMillion: 2,
  mlCount: 10,
  mlAverage: '480 mil',
  mlAverageK: 479.8,
  period: '20/out/2026',
};

// Os 8 mais vistos entre os 165. Título só quando a capa diz do que se trata;
// a miniatura (recortada do print) é a própria capa do reel.
// Sem texto na capa: 1,1 mi, 1 mi e 762 mil. Os dois primeiros têm vídeo casado frame a frame (v44 tacacá, v27 bumbá);
// o de 762 mil é a publi "Meus favoritos de beleza" do Mercado Livre (print do post; o vídeo não está em medias/).
export const TOP_REELS: { views: string; k: number; title?: string; brand?: string }[] = [
  { views: '1,1 mi', k: 1100, title: 'Tacacá perto da Paulista' },
  { views: '1 mi', k: 1000, title: 'Noite de bumbá em SP' },
  { views: '762 mil', k: 762, title: 'Favoritos de beleza', brand: 'Mercado Livre' },
  { views: '760 mil', k: 760, title: '“De onde você é?” Do Amazonas' },
  { views: '750 mil', k: 750, title: 'Passeio de helicóptero' },
  { views: '688 mil', k: 688, title: 'Realizando o sonho do helicóptero' },
  { views: '683 mil', k: 683, title: 'Ofertas do 9.9', brand: 'Mercado Livre' },
  { views: '669 mil', k: 669, title: '“Coisas que eu acho chique”' },
];

// Instagram Insights, prints de 19/out/2026 (últimos 30 dias).
export const INSIGHTS = {
  period: '20/set–19/out/2026',
  views: '1,67 mi',
  viewsGrowth: '+94%',
  followers: '58,4 mil',
  followersK: 58.4,
  followersGrowth: '+11,9%',
  newFollowers: '6.248',
};

export interface Share { label: string; pct: number; key?: boolean }

export const AUDIENCE: { gender: Share[]; age: Share[]; cities: Share[] } = {
  gender: [
    { label: 'Mulheres', pct: 67.7 },
    { label: 'Homens', pct: 32.3 },
  ],
  age: [
    { label: '13–17', pct: 1.8 },
    { label: '18–24', pct: 11.4 },
    { label: '25–34', pct: 38.5, key: true },
    { label: '35–44', pct: 29.7, key: true },
    { label: '45–54', pct: 13.3 },
    { label: '55–64', pct: 3.9 },
    { label: '65+', pct: 1.5 },
  ],
  cities: [
    { label: 'São Paulo', pct: 45, key: true },
    { label: 'São José dos Campos', pct: 22, key: true },
    { label: 'Jacareí', pct: 12, key: true },
    { label: 'Ribeirão Preto', pct: 2.3 },
  ],
};

// Síntese do público (index e media kit): somas das faixas/cidades marcadas como `key`.
const keySum = (list: Share[]) => Math.round(list.filter((s) => s.key).reduce((n, s) => n + s.pct, 0));
const keyAges = AUDIENCE.age.filter((s) => s.key);
const topGender = AUDIENCE.gender[0];
export const AUDIENCE_SUMMARY = [
  { value: `${keySum(AUDIENCE.age)}%`, text: `têm entre ${keyAges[0].label.split('–')[0]} e ${keyAges.at(-1)!.label.split('–')[1]} anos` },
  { value: `${keySum(AUDIENCE.cities)}%`, text: 'estão em São Paulo e no Vale do Paraíba' },
  { value: `${Math.round((topGender.pct / 100) * 3)} em cada 3`, text: `são ${topGender.label.toLowerCase()}` },
];

// "mais de N vezes": média por reel ÷ seguidores, arredondada para baixo
const NUM_WORDS = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
const reach = Math.floor(REELS_STATS.averageK / INSIGHTS.followersK);
export const REACH_MULTIPLE = `${NUM_WORDS[reach] ?? reach} vezes`;

// "Marcas e lugares com quem já trabalhei" (faixa animada em Formatos). Lista do usuário (20/out/2026) +
// marcas das publis do portfólio e das capas do print da aba Reels.
export const BRANDS = [
  'Mercado Livre', 'Shein', 'Casas Bahia', 'LG', 'Samsung Brasil', 'Churrasco On Fire', 'Kome', 'Gusto Cucina',
  'Paparoto Cucina', 'Buddha Spa', 'Reserva Ilhabela', 'Aimê Pousada', 'Tempo by Porsche', 'HC Helicópteros',
  'CASACOR', 'Palmolive', 'Alva', 'Emma', 'Café de la Musique', 'Mana Poke', 'Arena Movie', 'Espaço Simone Zagallo',
];

export const SERVICES = [
  { title: 'Reels & <i>stories</i>', text: 'Publicação no meu perfil, com roteiro no meu tom e entrega para a audiência que já confia nas minhas dicas.' },
  { title: 'Hotéis & <i>pousadas</i>', text: 'Cobertura da hospedagem e do destino: quartos, experiências, café da manhã e o roteiro ao redor.' },
  { title: 'Restaurantes <i>em SP</i>', text: 'Visita, prato a prato, com o clima da casa. Conteúdo que faz o seguidor querer reservar.' },
  { title: 'Vídeos <i>UGC</i>', text: 'Vídeos para a marca usar nos próprios canais e anúncios, sem precisar de postagem no meu perfil.' },
];
