// Páginas de nicho (/restaurantes-em-sao-paulo/, /viagens-e-hospedagem/, /publis-e-ugc/ e as versões em /en/ e /es/):
// cada uma é um roteiro de paradas (lugar, casa ou marca) com os vídeos do portfólio. Só fatos de content.ts e do
// CATALOGO-videos.md; lugar que não está confirmado no catálogo não vira nome de parada.
import { home, num, type L, type Lang } from '../i18n';
import { MEDIA, REELS_STATS, type MediaItem } from './content';

interface StopSrc { id: string; name: L; where?: L; text: L; ids: string[] }
interface NicheSrc {
  /** identificador fixo (o slug em português), usado em SERVICES e entre idiomas */
  key: string;
  slug: L; label: L; title: L; description: L; h1: L; lead: L; contact?: L;
  stops: StopSrc[];
}

export interface Stop {
  /** âncora da parada (#id) */
  id: string;
  name: string;
  /** região, bairro ou tipo, ao lado do número */
  where?: string;
  text: string;
  ids: string[];
}

export interface Niche {
  key: string;
  slug: string;
  /** rótulo curto (trilha, links entre páginas, nav) */
  label: string;
  title: string;
  description: string;
  /** H1 com <em> no trecho em itálico */
  h1: string;
  lead: string;
  /** H2 do contato, com <em>; sem ele vale o da home */
  contact?: string;
  stops: Stop[];
}

const same = (s: string): L => ({ pt: s, en: s, es: s });
const mlAverage = (lang: Lang) => num(REELS_STATS.mlAverage, lang);

const SRC: NicheSrc[] = [
  {
    key: 'restaurantes-em-sao-paulo',
    slug: { pt: 'restaurantes-em-sao-paulo', en: 'restaurants-in-sao-paulo', es: 'restaurantes-en-sao-paulo' },
    label: { pt: 'Restaurantes em SP', en: 'Restaurants in São Paulo', es: 'Restaurantes en São Paulo' },
    title: {
      pt: 'Restaurantes em SP · Carol Limah, influenciadora de gastronomia',
      en: 'Restaurants in São Paulo · Carol Limah, food influencer',
      es: 'Restaurantes en São Paulo · Carol Limah, influencer de gastronomía',
    },
    description: {
      pt: 'Restaurantes de SP nos reels da Carol Limah (@eu.carollimah): tacacá perto da Paulista, Kome, Gusto Cucina e On Fire.',
      en: 'São Paulo restaurants in Carol Limah’s reels (@eu.carollimah): tacacá near Avenida Paulista, Kome, Gusto Cucina and On Fire.',
      es: 'Restaurantes de São Paulo en los reels de Carol Limah (@eu.carollimah): tacacá cerca de la Paulista, Kome, Gusto Cucina y On Fire.',
    },
    h1: {
      pt: 'Restaurantes em São Paulo, <em>prato a prato.</em>',
      en: 'Restaurants in São Paulo, <em>dish by dish.</em>',
      es: 'Restaurantes en São Paulo, <em>plato a plato.</em>',
    },
    lead: {
      pt: 'Do tacacá perto da Paulista ao rodízio do Kome na Bela Vista: eu visito, provo e mostro o clima da casa. Conteúdo que faz o seguidor querer reservar.',
      en: 'From tacacá near Avenida Paulista to the all-you-can-eat at Kome in Bela Vista: I visit, I taste and I show what the place feels like. Content that makes followers want to book a table.',
      es: 'Del tacacá cerca de la Paulista al rodizio de Kome en Bela Vista: visito, pruebo y muestro el ambiente de la casa. Contenido que da ganas de reservar.',
    },
    stops: [
      {
        id: 'amazonas',
        name: { pt: 'Sabores do Amazonas', en: 'Flavors of the Amazon', es: 'Sabores del Amazonas' },
        where: { pt: 'Perto da Paulista', en: 'Near Avenida Paulista', es: 'Cerca de la Paulista' },
        text: {
          pt: 'O tacacá perto da Paulista é o reel mais visto do meu perfil. E, num restaurante manauara, tambaqui, açaí e guaraná Baré.',
          en: 'The tacacá near Avenida Paulista is the most-watched reel on my profile. And, at a restaurant from Manaus, tambaqui, açaí and Baré guaraná.',
          es: 'El tacacá cerca de la Paulista es el reel más visto de mi perfil. Y, en un restaurante manauara, tambaquí, açaí y guaraná Baré.',
        },
        ids: ['v44', 'v34'],
      },
      {
        id: 'kome', name: same('Kome'), where: same('Bela Vista'),
        text: {
          pt: 'Três reels da parceria: sushi e sashimi, o jantar e o rodízio executivo.',
          en: 'Three reels from the partnership: sushi and sashimi, dinner and the executive all-you-can-eat.',
          es: 'Tres reels de la colaboración: sushi y sashimi, la cena y el rodizio ejecutivo.',
        },
        ids: ['v50', 'v52', 'v20'],
      },
      {
        id: 'on-fire', name: same('Churrasco On Fire'), where: same('Jacareí'),
        text: {
          pt: 'Churrasco com show, da montagem do palco até a noite do evento.',
          en: 'Barbecue with a live show, from setting up the stage to the night of the event.',
          es: 'Asado con show, desde el montaje del escenario hasta la noche del evento.',
        },
        ids: ['v22', 'v48', 'p1'],
      },
      {
        id: 'gusto-cucina', name: same('Gusto Cucina'),
        text: { pt: 'Almoço em parceria com a casa.', en: 'Lunch in partnership with the restaurant.', es: 'Almuerzo en colaboración con la casa.' },
        ids: ['v49'],
      },
      {
        id: 'outras-mesas',
        name: { pt: 'Outras mesas', en: 'Other tables', es: 'Otras mesas' },
        text: {
          pt: 'Almoço no jardim, jantar a dois e o dia em que eu virei blogueira.',
          en: 'Lunch in the garden, dinner for two and the day I became a blogger.',
          es: 'Almuerzo en el jardín, cena para dos y el día en que me volví blogger.',
        },
        ids: ['v51', 'v17', 'v05'],
      },
    ],
  },
  {
    key: 'viagens-e-hospedagem',
    slug: { pt: 'viagens-e-hospedagem', en: 'travel-and-stays', es: 'viajes-y-hospedaje' },
    label: { pt: 'Viagens e hospedagem', en: 'Travel and stays', es: 'Viajes y hospedaje' },
    title: {
      pt: 'Viagens e hospedagem no interior e litoral de SP · Carol Limah',
      en: 'Travel and stays in São Paulo’s countryside and coast · Carol Limah',
      es: 'Viajes y hospedaje en el interior y la costa de São Paulo · Carol Limah',
    },
    description: {
      pt: 'Passeios e hospedagem da Carol Limah (@eu.carollimah): Jacareí, Igaratá, Campos do Jordão, Ilhabela e pousadas.',
      en: 'Carol Limah’s trips and stays (@eu.carollimah): Jacareí, Igaratá, Campos do Jordão, Ilhabela and countryside inns.',
      es: 'Paseos y hospedaje de Carol Limah (@eu.carollimah): Jacareí, Igaratá, Campos do Jordão, Ilhabela y posadas.',
    },
    h1: {
      pt: 'Fins de semana pelo interior e o litoral de SP, <em>de perto.</em>',
      en: 'Weekends across São Paulo’s countryside and coast, <em>up close.</em>',
      es: 'Fines de semana por el interior y la costa de São Paulo, <em>de cerca.</em>',
    },
    lead: {
      pt: 'Cavalgada, quadriciclo, fazenda e hospedagem: passeios de um ou dois dias a partir de São Paulo, mostrados com humor e sem roteiro decorado.',
      en: 'Horseback rides, ATVs, farms and places to stay: one- or two-day trips from São Paulo, shown with humor and never scripted.',
      es: 'Cabalgatas, cuatrimotos, haciendas y hospedaje: paseos de uno o dos días desde São Paulo, mostrados con humor y sin guion aprendido.',
    },
    stops: [
      {
        id: 'vale-do-paraiba',
        name: { pt: 'Jacareí e Igaratá', en: 'Jacareí and Igaratá', es: 'Jacareí e Igaratá' },
        where: { pt: 'Vale do Paraíba', en: 'Paraíba Valley', es: 'Valle del Paraíba' },
        text: {
          pt: 'Passeio a cavalo em haras de Jacareí, aula de três tambores e um dia de jet ski e quadriciclo em Igaratá.',
          en: 'Horseback riding at a stud farm in Jacareí, a barrel racing lesson and a day of jet ski and ATVs in Igaratá.',
          es: 'Paseo a caballo en un haras de Jacareí, clase de carrera de barriles y un día de moto de agua y cuatrimoto en Igaratá.',
        },
        ids: ['v41', 'v37', 'v14'],
      },
      {
        id: 'campos-do-jordao', name: same('Campos do Jordão'),
        where: { pt: 'Serra da Mantiqueira', en: 'Mantiqueira Mountains', es: 'Sierra de la Mantiqueira' },
        text: { pt: 'Cavalgada num rancho da serra.', en: 'A horseback ride at a mountain ranch.', es: 'Cabalgata en un rancho de la sierra.' },
        ids: ['v35'],
      },
      {
        id: 'ilhabela', name: same('Ilhabela'),
        where: { pt: 'Litoral norte', en: 'North coast', es: 'Litoral norte' },
        text: { pt: 'Hospedagem com quarto, ioga e vista.', en: 'A stay with the room, yoga and the view.', es: 'Hospedaje con habitación, yoga y vista.' },
        ids: ['v21'],
      },
      {
        id: 'pousada',
        name: { pt: 'Pousada na mata', en: 'Inn in the forest', es: 'Posada en el bosque' },
        where: { pt: 'Hospedagem', en: 'Stay', es: 'Hospedaje' },
        text: {
          pt: 'Quarto, piscina e jardim de uma pousada cercada de verde.',
          en: 'Room, pool and garden at an inn surrounded by green.',
          es: 'Habitación, piscina y jardín de una posada rodeada de verde.',
        },
        ids: ['v30'],
      },
      {
        id: 'campo',
        name: { pt: 'Dia de campo', en: 'A day in the country', es: 'Día de campo' },
        text: {
          pt: 'Um dia inteiro de fazenda e um passeio de quadriciclo com a turma.',
          en: 'A full day on a farm and an ATV ride with friends.',
          es: 'Un día entero en la hacienda y un paseo en cuatrimoto con amigos.',
        },
        ids: ['v25', 'v47'],
      },
    ],
  },
  {
    key: 'publis-e-ugc',
    slug: { pt: 'publis-e-ugc', en: 'brand-deals-and-ugc', es: 'colaboraciones-y-ugc' },
    label: { pt: 'Publis e UGC', en: 'Brand deals and UGC', es: 'Colaboraciones y UGC' },
    title: {
      pt: 'Publis e vídeos UGC · Carol Limah, criadora de conteúdo em SP',
      en: 'Brand deals and UGC videos · Carol Limah, São Paulo content creator',
      es: 'Colaboraciones y videos UGC · Carol Limah, creadora de contenido en São Paulo',
    },
    description: {
      pt: `Publis e UGC da Carol Limah (@eu.carollimah) para Mercado Livre, Shein e Kome. Média de ${mlAverage('pt')} views nos reels do Mercado Livre.`,
      en: `Carol Limah’s brand deals and UGC (@eu.carollimah) for Mercado Livre, Shein and Kome. The Mercado Livre reels average ${mlAverage('en')} views.`,
      es: `Colaboraciones y UGC de Carol Limah (@eu.carollimah) para Mercado Livre, Shein y Kome. Promedio de ${mlAverage('es')} vistas en los reels de Mercado Livre.`,
    },
    h1: {
      pt: 'Publis que <em>entregam alcance.</em>',
      en: 'Brand deals that <em>deliver reach.</em>',
      es: 'Colaboraciones que <em>generan alcance.</em>',
    },
    lead: {
      pt: `Reels no meu perfil e vídeos UGC para a marca usar nos próprios canais. Os ${REELS_STATS.mlCount} reels para o Mercado Livre têm média de ${mlAverage('pt')} views.`,
      en: `Reels on my profile and UGC videos for the brand to use on its own channels. The ${REELS_STATS.mlCount} reels for Mercado Livre average ${mlAverage('en')} views.`,
      es: `Reels en mi perfil y videos UGC para que la marca los use en sus propios canales. Los ${REELS_STATS.mlCount} reels para Mercado Livre tienen un promedio de ${mlAverage('es')} vistas.`,
    },
    contact: {
      pt: 'Bora colocar a sua marca <em>no meu feed?</em>',
      en: 'Shall we put your brand <em>in my feed?</em>',
      es: '¿Ponemos tu marca <em>en mi feed?</em>',
    },
    stops: [
      {
        id: 'mercado-livre', name: same('Mercado Livre'),
        where: { pt: 'Achadinhos e datas', en: 'Finds and sale days', es: 'Hallazgos y fechas' },
        text: {
          pt: 'Datas como 8.8 e 10/10, achadinhos e o espaço da marca na CASACOR.',
          en: 'Sale days like 8.8 and 10/10, product finds and the brand’s space at CASACOR.',
          es: 'Fechas como el 8.8 y el 10/10, hallazgos y el espacio de la marca en CASACOR.',
        },
        ids: ['v23', 'v32', 'v24', 'v28', 'v31'],
      },
      {
        id: 'restaurantes',
        name: { pt: 'Restaurantes e eventos', en: 'Restaurants and events', es: 'Restaurantes y eventos' },
        where: same('Kome · On Fire · Gusto Cucina'),
        text: {
          pt: 'Parcerias com casas e eventos: o cardápio, o clima e o movimento.',
          en: 'Partnerships with restaurants and events: the menu, the vibe and the crowd.',
          es: 'Colaboraciones con restaurantes y eventos: el menú, el ambiente y el movimiento.',
        },
        ids: ['v22', 'v50', 'v52', 'v49', 'v48', 'v20'],
      },
      {
        id: 'moda-beleza',
        name: { pt: 'Moda e beleza', en: 'Fashion and beauty', es: 'Moda y belleza' },
        where: same('Shein · Illustratum'),
        text: {
          pt: 'O fit check da Shein e o shampoo ozonizado da Illustratum.',
          en: 'The Shein fit check and Illustratum’s ozonized shampoo.',
          es: 'El fit check de Shein y el champú ozonizado de Illustratum.',
        },
        ids: ['v02', 'v36'],
      },
      {
        id: 'bem-estar',
        name: { pt: 'Bem-estar', en: 'Wellness', es: 'Bienestar' },
        where: same('Buddha Spa'),
        text: { pt: 'Presente de Dia dos Pais no spa.', en: 'A Father’s Day gift at the spa.', es: 'Regalo del Día del Padre en el spa.' },
        ids: ['v46'],
      },
      {
        id: 'ugc',
        name: { pt: 'Vídeo UGC', en: 'UGC video', es: 'Video UGC' },
        where: same('Vagas Goiânia'),
        text: {
          pt: 'Vídeo para a marca usar nos próprios canais e anúncios, sem postagem no meu perfil.',
          en: 'A video for the brand to use on its own channels and ads, with no post on my profile.',
          es: 'Video para que la marca lo use en sus propios canales y anuncios, sin publicación en mi perfil.',
        },
        ids: ['v33'],
      },
    ],
  },
];

/** os nichos com os textos de um idioma */
export const nichesIn = (lang: Lang): Niche[] => SRC.map((n) => ({
  key: n.key,
  slug: n.slug[lang],
  label: n.label[lang],
  title: n.title[lang],
  description: n.description[lang],
  h1: n.h1[lang],
  lead: n.lead[lang],
  contact: n.contact?.[lang],
  stops: n.stops.map((s) => ({ id: s.id, name: s.name[lang], where: s.where?.[lang], text: s.text[lang], ids: s.ids })),
}));

/** caminho da página de nicho no idioma ('/en/travel-and-stays/') */
export const nichePath = (lang: Lang, key: string) => `${home(lang)}${SRC.find((n) => n.key === key)!.slug[lang]}/`;
/** a mesma página de nicho nos três idiomas (seletor de idioma e hreflang) */
export const nicheAlternates = (key: string): L => ({ pt: nichePath('pt', key), en: nichePath('en', key), es: nichePath('es', key) });

/** getStaticPaths das páginas de nicho de um idioma */
export const nicheStaticPaths = (lang: Lang) => nichesIn(lang).map((niche) => ({ params: { nicho: niche.slug }, props: { lang, niche } }));

const byId = new Map(MEDIA.map((m) => [m.id, m]));
export const stopMedia = (s: Stop): MediaItem[] => s.ids.map((id) => {
  const m = byId.get(id);
  if (!m) throw new Error(`niches.ts: mídia ${id} não existe em MEDIA`);
  return m;
});

/** "425 mil" → 425; "1,1 mi" → 1100 */
const viewsK = (v?: string) => {
  if (!v) return 0;
  const n = parseFloat(v.replace(',', '.'));
  return v.endsWith('mi') ? n * 1000 : n;
};
/** reel mais visto da parada, para a linha do roteiro (escrito em pt; formatar com num()) */
export const topViews = (s: Stop) =>
  stopMedia(s).reduce<string | undefined>((best, m) => (viewsK(m.views) > viewsK(best) ? m.views : best), undefined);
