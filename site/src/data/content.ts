import { pct, type L, type Lang } from '../i18n';

export const EMAIL = 'parceria.eucarollimah@gmail.com';
/** WhatsApp comercial da Carol, com DDI; vazio = o botão não aparece (site e media kit). */
const WHATSAPP_NUMBER = '+55 12 99137-6550';
/** só dígitos, como o wa.me exige */
export const WHATSAPP = WHATSAPP_NUMBER.replace(/\D/g, '');
export const RESPONSE_TIME: L = {
  pt: 'Respondo em até 2 dias úteis.',
  en: 'I reply within 2 business days.',
  es: 'Respondo en hasta 2 días hábiles.',
};
/** o que a marca deve mandar no primeiro e-mail; vira o corpo do mailto (com "Marca" antes) */
export const BRIEF: L<string[]> = {
  pt: ['Objetivo da campanha', 'Período ou datas', 'Formato desejado', 'Verba (opcional)'],
  en: ['Campaign goal', 'Timing or dates', 'Preferred format', 'Budget (optional)'],
  es: ['Objetivo de la campaña', 'Período o fechas', 'Formato deseado', 'Presupuesto (opcional)'],
};
const MAIL: L<{ subject: string; hi: string; brand: string; wa: string }> = {
  pt: { subject: 'Parceria com Carol Limah', hi: 'Oi, Carol!', brand: 'Marca', wa: 'Oi, Carol! Quero falar sobre uma parceria com a marca ' },
  en: { subject: 'Partnership with Carol Limah', hi: 'Hi Carol!', brand: 'Brand', wa: 'Hi Carol! I’d like to talk about a partnership with the brand ' },
  es: { subject: 'Colaboración con Carol Limah', hi: '¡Hola, Carol!', brand: 'Marca', wa: '¡Hola, Carol! Quiero hablar sobre una colaboración con la marca ' },
};
export const mailto = (lang: Lang) => `mailto:${EMAIL}?subject=${encodeURIComponent(MAIL[lang].subject)}&body=${encodeURIComponent(
  `${MAIL[lang].hi}\n\n${[MAIL[lang].brand, ...BRIEF[lang]].map((b) => `${b}: `).join('\n')}\n`,
)}`;
export const waHref = (lang: Lang) => (WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MAIL[lang].wa)}` : null);

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
export const CAT_LABEL: Record<Cat, L> = {
  Viagem: { pt: 'Viagem', en: 'Travel', es: 'Viajes' },
  Hospedagem: { pt: 'Hospedagem', en: 'Stay', es: 'Hospedaje' },
  Gastronomia: { pt: 'Gastronomia', en: 'Food', es: 'Gastronomía' },
  Moda: { pt: 'Moda', en: 'Fashion', es: 'Moda' },
  Achadinhos: { pt: 'Achadinhos', en: 'Finds', es: 'Hallazgos' },
  Evento: { pt: 'Evento', en: 'Event', es: 'Evento' },
  'Bem-estar': { pt: 'Bem-estar', en: 'Wellness', es: 'Bienestar' },
  Beleza: { pt: 'Beleza', en: 'Beauty', es: 'Belleza' },
  UGC: { pt: 'UGC', en: 'UGC', es: 'UGC' },
};

/** filtros do portfólio: alinhados aos formatos que a Carol vende (seção Formatos) */
export const FILTERS: { key: string; label: L }[] = [
  { key: 'todos', label: { pt: 'Todos', en: 'All', es: 'Todos' } },
  { key: 'publis', label: { pt: 'Publis', en: 'Brand deals', es: 'Colaboraciones' } },
  { key: 'viagem', label: { pt: 'Viagem & hospedagem', en: 'Travel & stays', es: 'Viajes y hospedaje' } },
  { key: 'gastronomia', label: { pt: 'Gastronomia', en: 'Food', es: 'Gastronomía' } },
];

export interface MediaItem {
  video: boolean;
  /** nome do arquivo sem extensão em /media */
  id: string;
  cat: Cat;
  title: L;
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
  { video: true, id: 'v44', cat: 'Gastronomia', title: { pt: 'Tacacá perto da Paulista', en: 'Tacacá near Avenida Paulista', es: 'Tacacá cerca de la Paulista' }, views: '1,1 mi' },
  { video: true, id: 'v27', cat: 'Evento', title: { pt: 'Noite de bumbá em SP', en: 'Bumbá night in São Paulo', es: 'Noche de bumbá en São Paulo' }, views: '1 mi' },
  { video: true, id: 'v02', cat: 'Moda', title: { pt: 'Fit check', en: 'Fit check', es: 'Fit check' }, brand: 'Shein', views: '478 mil' },
  { video: true, id: 'v23', cat: 'Achadinhos', title: { pt: 'Microfone sem fio', en: 'Wireless microphone', es: 'Micrófono inalámbrico' }, brand: 'Mercado Livre', views: '458 mil' },
  { video: true, id: 'v32', cat: 'Achadinhos', title: { pt: '8.8 do Mercado Livre', en: 'Mercado Livre’s 8.8 sale', es: 'El 8.8 de Mercado Livre' }, brand: 'Mercado Livre', views: '307 mil' },
  { video: true, id: 'v22', cat: 'Evento', title: { pt: 'Montagem do On Fire', en: 'Setting up On Fire', es: 'Montaje del On Fire' }, brand: 'Churrasco On Fire', views: '293 mil' },
  { video: true, id: 'v46', cat: 'Bem-estar', title: { pt: 'Presente de Dia dos Pais', en: 'Father’s Day gift', es: 'Regalo del Día del Padre' }, brand: 'Buddha Spa', views: '292 mil' },
  { video: true, id: 'v24', cat: 'Achadinhos', title: { pt: 'Carrinho do 10/10', en: '10/10 shopping cart', es: 'Carrito del 10/10' }, brand: 'Mercado Livre', views: '267 mil' },
  { video: true, id: 'v50', cat: 'Gastronomia', title: { pt: 'Sushi e sashimi no Kome', en: 'Sushi and sashimi at Kome', es: 'Sushi y sashimi en Kome' }, brand: 'Kome Bela Vista', views: '237 mil' },
  { video: true, id: 'v52', cat: 'Gastronomia', title: { pt: 'Jantar no Kome', en: 'Dinner at Kome', es: 'Cena en Kome' }, brand: 'Kome', views: '188 mil' },
  { video: true, id: 'v28', cat: 'Evento', title: { pt: 'Mercado Livre na CASACOR', en: 'Mercado Livre at CASACOR', es: 'Mercado Livre en CASACOR' }, brand: 'Mercado Livre', views: '185 mil' },
  { video: true, id: 'v49', cat: 'Gastronomia', title: { pt: 'Almoço no Gusto Cucina', en: 'Lunch at Gusto Cucina', es: 'Almuerzo en Gusto Cucina' }, brand: 'Gusto Cucina', views: '179 mil' },
  { video: true, id: 'v48', cat: 'Evento', title: { pt: 'Noite no Churrasco On Fire', en: 'A night at Churrasco On Fire', es: 'Noche en Churrasco On Fire' }, brand: 'Churrasco On Fire', views: '67 mil' },
  { video: true, id: 'v20', cat: 'Gastronomia', title: { pt: 'Rodízio executivo no Kome', en: 'Executive all-you-can-eat at Kome', es: 'Rodizio ejecutivo en Kome' }, brand: 'Kome Bela Vista' },
  { video: true, id: 'v31', cat: 'Achadinhos', title: { pt: 'Travesseiro de corpo', en: 'Body pillow', es: 'Almohada de cuerpo' }, brand: 'Mercado Livre' },
  { video: true, id: 'v36', cat: 'Beleza', title: { pt: 'Shampoo ozonizado', en: 'Ozonized shampoo', es: 'Champú ozonizado' }, brand: 'Illustratum' },
  { video: true, id: 'v33', cat: 'UGC', title: { pt: 'Portal de vagas', en: 'Job board', es: 'Portal de empleos' }, brand: 'Vagas Goiânia' },
  { video: false, id: 'p1', cat: 'Gastronomia', title: { pt: 'Churrasco On Fire', en: 'Churrasco On Fire', es: 'Churrasco On Fire' }, brand: 'Churrasco On Fire' },
  { video: true, id: 'v41', cat: 'Viagem', title: { pt: 'Passeio a cavalo em Jacareí', en: 'Horseback ride in Jacareí', es: 'Paseo a caballo en Jacareí' }, views: '425 mil' },
  { video: true, id: 'v47', cat: 'Viagem', title: { pt: 'Quadriciclo em grupo', en: 'Group ATV ride', es: 'Cuatrimoto en grupo' }, views: '335 mil' },
  { video: true, id: 'v25', cat: 'Viagem', title: { pt: 'Dia na fazenda', en: 'A day on the farm', es: 'Un día en la hacienda' }, views: '287 mil' },
  { video: true, id: 'v37', cat: 'Viagem', title: { pt: 'Aula de três tambores', en: 'Barrel racing lesson', es: 'Clase de carrera de barriles' }, views: '208 mil' },
  { video: true, id: 'v51', cat: 'Gastronomia', title: { pt: 'Almoço no jardim', en: 'Lunch in the garden', es: 'Almuerzo en el jardín' }, views: '161 mil' },
  { video: true, id: 'v26', cat: 'Moda', title: { pt: 'Conjunto fitness no parque', en: 'Activewear set in the park', es: 'Conjunto deportivo en el parque' }, views: '109 mil' },
  { video: true, id: 'v21', cat: 'Hospedagem', title: { pt: 'Hospedagem em Ilhabela', en: 'A stay in Ilhabela', es: 'Hospedaje en Ilhabela' } },
  { video: true, id: 'v30', cat: 'Hospedagem', title: { pt: 'Pousada em meio à mata', en: 'An inn in the forest', es: 'Posada en medio del bosque' } },
  { video: true, id: 'v34', cat: 'Gastronomia', title: { pt: 'Sabores do Amazonas em SP', en: 'Amazon flavors in São Paulo', es: 'Sabores del Amazonas en São Paulo' } },
  { video: true, id: 'v35', cat: 'Viagem', title: { pt: 'Cavalgada em Campos do Jordão', en: 'Horseback ride in Campos do Jordão', es: 'Cabalgata en Campos do Jordão' } },
  { video: true, id: 'v14', cat: 'Viagem', title: { pt: 'Jet ski e quadri em Igaratá', en: 'Jet ski and ATV in Igaratá', es: 'Moto de agua y cuatrimoto en Igaratá' } },
  { video: true, id: 'v17', cat: 'Gastronomia', title: { pt: 'Jantar a dois', en: 'Dinner for two', es: 'Cena para dos' } },
  { video: true, id: 'v39', cat: 'Evento', title: { pt: 'Coletiva do Festival de Parintins', en: 'Parintins Festival press conference', es: 'Rueda de prensa del Festival de Parintins' } },
  { video: true, id: 'v38', cat: 'Bem-estar', title: { pt: 'Dia de spa', en: 'Spa day', es: 'Día de spa' } },
  { video: true, id: 'v40', cat: 'Bem-estar', title: { pt: 'Aula de pilates', en: 'Pilates class', es: 'Clase de pilates' } },
  { video: true, id: 'v29', cat: 'Beleza', title: { pt: 'Protocolo facial', en: 'Facial treatment', es: 'Tratamiento facial' } },
  { video: true, id: 'v43', cat: 'Moda', title: { pt: 'Uniforme de consultório', en: 'Clinic uniform', es: 'Uniforme de consultorio' } },
  { video: true, id: 'v05', cat: 'Gastronomia', title: { pt: '“Virei blogueira”', en: '“I became a blogger”', es: '“Me volví blogger”' } },
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
  period: { pt: '20/out/2026', en: 'Oct 20, 2026', es: '20/oct/2026' } as L,
};

// Os 8 mais vistos entre os 165. Título só quando a capa diz do que se trata;
// a miniatura (recortada do print) é a própria capa do reel.
// Sem texto na capa: 1,1 mi, 1 mi e 762 mil. Os dois primeiros têm vídeo casado frame a frame (v44 tacacá, v27 bumbá);
// o de 762 mil é a publi "Meus favoritos de beleza" do Mercado Livre (print do post; o vídeo não está em medias/).
export const TOP_REELS: { views: string; k: number; title?: L; brand?: string }[] = [
  { views: '1,1 mi', k: 1100, title: { pt: 'Tacacá perto da Paulista', en: 'Tacacá near Avenida Paulista', es: 'Tacacá cerca de la Paulista' } },
  { views: '1 mi', k: 1000, title: { pt: 'Noite de bumbá em SP', en: 'Bumbá night in São Paulo', es: 'Noche de bumbá en São Paulo' } },
  { views: '762 mil', k: 762, title: { pt: 'Favoritos de beleza', en: 'Beauty favorites', es: 'Favoritos de belleza' }, brand: 'Mercado Livre' },
  { views: '760 mil', k: 760, title: { pt: '“De onde você é?” Do Amazonas', en: '“Where are you from?” The Amazon', es: '“¿De dónde eres?” Del Amazonas' } },
  { views: '750 mil', k: 750, title: { pt: 'Passeio de helicóptero', en: 'Helicopter ride', es: 'Paseo en helicóptero' } },
  { views: '688 mil', k: 688, title: { pt: 'Realizando o sonho do helicóptero', en: 'Living my helicopter dream', es: 'Cumpliendo el sueño del helicóptero' } },
  { views: '683 mil', k: 683, title: { pt: 'Ofertas do 9.9', en: '9.9 deals', es: 'Ofertas del 9.9' }, brand: 'Mercado Livre' },
  { views: '669 mil', k: 669, title: { pt: '“Coisas que eu acho chique”', en: '“Things I think are classy”', es: '“Cosas que me parecen chic”' } },
];

// Instagram Insights, prints de 19/out/2026 (últimos 30 dias).
export const INSIGHTS = {
  period: { pt: '20/set–19/out/2026', en: 'Sep 20–Oct 19, 2026', es: '20/sep–19/oct/2026' } as L,
  views: '1,67 mi',
  viewsGrowth: '+94%',
  followers: '58,4 mil',
  followersK: 58.4,
  followersGrowth: '+11,9%',
  newFollowers: '6.248',
};

/** `label` é texto (L) no gênero e nome próprio/faixa nas idades e cidades */
export interface Share<T = string> { label: T; pct: number; key?: boolean }

export const AUDIENCE: { gender: Share<L>[]; age: Share[]; cities: Share[] } = {
  gender: [
    { label: { pt: 'Mulheres', en: 'Women', es: 'Mujeres' }, pct: 67.7 },
    { label: { pt: 'Homens', en: 'Men', es: 'Hombres' }, pct: 32.3 },
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
const [ageFrom, ageTo] = [keyAges[0].label.split('–')[0], keyAges.at(-1)!.label.split('–')[1]];
const topGender = AUDIENCE.gender[0];
const inThree = Math.round((topGender.pct / 100) * 3);
export const audienceSummary = (lang: Lang) => [
  {
    value: pct(keySum(AUDIENCE.age), lang),
    text: { pt: `têm entre ${ageFrom} e ${ageTo} anos`, en: `are between ${ageFrom} and ${ageTo}`, es: `tienen entre ${ageFrom} y ${ageTo} años` }[lang],
  },
  {
    value: pct(keySum(AUDIENCE.cities), lang),
    text: { pt: 'estão em São Paulo e no Vale do Paraíba', en: 'live in São Paulo and the Paraíba Valley', es: 'están en São Paulo y el Valle del Paraíba' }[lang],
  },
  {
    value: { pt: `${inThree} em cada 3`, en: `${inThree} in 3`, es: `${inThree} de cada 3` }[lang],
    text: { pt: 'são', en: 'are', es: 'son' }[lang] + ' ' + topGender.label[lang].toLowerCase(),
  },
];

// "mais de N vezes": média por reel ÷ seguidores, arredondada para baixo
const NUM_WORDS: L<string[]> = {
  pt: ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  es: ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],
};
const reach = Math.floor(REELS_STATS.averageK / INSIGHTS.followersK);
export const reachMultiple = (lang: Lang) => `${NUM_WORDS[lang][reach] ?? reach} ${{ pt: 'vezes', en: 'times', es: 'veces' }[lang]}`;

// "Marcas e lugares com quem já trabalhei" (faixa animada em Formatos). Lista do usuário (20/out/2026) +
// marcas das publis do portfólio e das capas do print da aba Reels.
export const BRANDS = [
  'Mercado Livre', 'Shein', 'Casas Bahia', 'LG', 'Samsung Brasil', 'Churrasco On Fire', 'Kome', 'Gusto Cucina',
  'Paparoto Cucina', 'Buddha Spa', 'Reserva Ilhabela', 'Aimê Pousada', 'Tempo by Porsche', 'HC Helicópteros',
  'CASACOR', 'Palmolive', 'Alva', 'Emma', 'Café de la Musique', 'Mana Poke', 'Arena Movie', 'Espaço Simone Zagallo',
];

/** `niche`: `key` da página de nicho que mostra esse formato (data/niches.ts) */
export const SERVICES: { title: L; text: L; niche: string; more: L }[] = [
  {
    title: { pt: 'Reels & <i>stories</i>', en: 'Reels & <i>stories</i>', es: 'Reels y <i>stories</i>' },
    text: {
      pt: 'Publicação no meu perfil, com roteiro no meu tom e entrega para a audiência que já confia nas minhas dicas.',
      en: 'Posted on my profile, scripted in my own voice and delivered to an audience that already trusts my tips.',
      es: 'Publicación en mi perfil, con guion en mi tono y llegada a una audiencia que ya confía en mis recomendaciones.',
    },
    niche: 'publis-e-ugc',
    more: { pt: 'Ver publis', en: 'See brand deals', es: 'Ver colaboraciones' },
  },
  {
    title: { pt: 'Hotéis & <i>pousadas</i>', en: 'Hotels & <i>inns</i>', es: 'Hoteles y <i>posadas</i>' },
    text: {
      pt: 'Cobertura da hospedagem e do destino: quartos, experiências, café da manhã e o roteiro ao redor.',
      en: 'Coverage of the stay and the destination: rooms, experiences, breakfast and what to do nearby.',
      es: 'Cobertura del hospedaje y del destino: habitaciones, experiencias, desayuno y la ruta alrededor.',
    },
    niche: 'viagens-e-hospedagem',
    more: { pt: 'Ver viagens e hospedagem', en: 'See travel and stays', es: 'Ver viajes y hospedaje' },
  },
  {
    title: { pt: 'Restaurantes <i>em SP</i>', en: 'Restaurants <i>in São Paulo</i>', es: 'Restaurantes <i>en São Paulo</i>' },
    text: {
      pt: 'Visita, prato a prato, com o clima da casa. Conteúdo que faz o seguidor querer reservar.',
      en: 'A visit, dish by dish, with the feel of the place. Content that makes followers want to book a table.',
      es: 'Una visita plato a plato, con el ambiente de la casa. Contenido que da ganas de reservar.',
    },
    niche: 'restaurantes-em-sao-paulo',
    more: { pt: 'Ver restaurantes', en: 'See restaurants', es: 'Ver restaurantes' },
  },
  {
    title: { pt: 'Vídeos <i>UGC</i>', en: '<i>UGC</i> videos', es: 'Videos <i>UGC</i>' },
    text: {
      pt: 'Vídeos para a marca usar nos próprios canais e anúncios, sem precisar de postagem no meu perfil.',
      en: 'Videos for the brand to use on its own channels and ads, with no need for a post on my profile.',
      es: 'Videos para que la marca los use en sus propios canales y anuncios, sin necesidad de publicar en mi perfil.',
    },
    niche: 'publis-e-ugc',
    more: { pt: 'Ver UGC', en: 'See UGC', es: 'Ver UGC' },
  },
];

export const SOCIAL = [
  { label: 'Instagram @eu.carollimah', href: 'https://www.instagram.com/eu.carollimah' },
  { label: 'Threads @eu.carollimah', href: 'https://www.threads.net/@eu.carollimah' },
];
