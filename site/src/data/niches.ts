// Páginas de nicho (/restaurantes-em-sao-paulo/, /viagens-e-hospedagem/, /publis-e-ugc/): cada uma é um roteiro
// de paradas (lugar, casa ou marca) com os vídeos do portfólio. Só fatos de content.ts e do CATALOGO-videos.md;
// lugar que não está confirmado no catálogo não vira nome de parada.
import { MEDIA, REELS_STATS, type MediaItem } from './content';

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
  slug: string;
  /** rótulo curto (trilha, links entre páginas, nav) */
  label: string;
  title: string;
  description: string;
  /** H1 com <em> no trecho em itálico */
  h1: string;
  lead: string;
  stops: Stop[];
}

export const NICHES: Niche[] = [
  {
    slug: 'restaurantes-em-sao-paulo',
    label: 'Restaurantes em SP',
    title: 'Restaurantes em SP · Carol Limah, influenciadora de gastronomia',
    description: 'Restaurantes de SP nos reels da Carol Limah (@eu.carollimah): tacacá perto da Paulista, Kome na Bela Vista, Gusto Cucina e On Fire. Parcerias com restaurantes.',
    h1: 'Restaurantes em São Paulo, <em>prato a prato.</em>',
    lead: 'Do tacacá perto da Paulista ao rodízio do Kome na Bela Vista: eu visito, provo e mostro o clima da casa. Conteúdo que faz o seguidor querer reservar.',
    stops: [
      { id: 'amazonas', name: 'Sabores do Amazonas', where: 'Perto da Paulista', text: 'O tacacá perto da Paulista é o reel mais visto do meu perfil. E, num restaurante manauara, tambaqui, açaí e guaraná Baré.', ids: ['v44', 'v34'] },
      { id: 'kome', name: 'Kome', where: 'Bela Vista', text: 'Três reels da parceria: sushi e sashimi, o jantar e o rodízio executivo.', ids: ['v50', 'v52', 'v20'] },
      { id: 'on-fire', name: 'Churrasco On Fire', where: 'Jacareí', text: 'Churrasco com show, da montagem do palco até a noite do evento.', ids: ['v22', 'v48', 'p1'] },
      { id: 'gusto-cucina', name: 'Gusto Cucina', text: 'Almoço em parceria com a casa.', ids: ['v49'] },
      { id: 'outras-mesas', name: 'Outras mesas', text: 'Almoço no jardim, jantar a dois e o dia em que eu virei blogueira.', ids: ['v51', 'v17', 'v05'] },
    ],
  },
  {
    slug: 'viagens-e-hospedagem',
    label: 'Viagens e hospedagem',
    title: 'Viagens e hospedagem no interior e litoral de SP · Carol Limah',
    description: 'Passeios e hospedagem nos reels da Carol Limah (@eu.carollimah): Jacareí, Igaratá, Campos do Jordão, Ilhabela e pousadas. Parcerias com hotéis e pousadas.',
    h1: 'Fins de semana pelo interior e o litoral de SP, <em>de perto.</em>',
    lead: 'Cavalgada, quadriciclo, fazenda e hospedagem: passeios de um ou dois dias a partir de São Paulo, mostrados com humor e sem roteiro decorado.',
    stops: [
      { id: 'vale-do-paraiba', name: 'Jacareí e Igaratá', where: 'Vale do Paraíba', text: 'Passeio a cavalo em haras de Jacareí, aula de três tambores e um dia de jet ski e quadriciclo em Igaratá.', ids: ['v41', 'v37', 'v14'] },
      { id: 'campos-do-jordao', name: 'Campos do Jordão', where: 'Serra da Mantiqueira', text: 'Cavalgada num rancho da serra.', ids: ['v35'] },
      { id: 'ilhabela', name: 'Ilhabela', where: 'Litoral norte', text: 'Hospedagem com quarto, ioga e vista.', ids: ['v21'] },
      { id: 'pousada', name: 'Pousada na mata', where: 'Hospedagem', text: 'Quarto, piscina e jardim de uma pousada cercada de verde.', ids: ['v30'] },
      { id: 'campo', name: 'Dia de campo', text: 'Um dia inteiro de fazenda e um passeio de quadriciclo com a turma.', ids: ['v25', 'v47'] },
    ],
  },
  {
    slug: 'publis-e-ugc',
    label: 'Publis e UGC',
    title: 'Publis e vídeos UGC · Carol Limah, criadora de conteúdo em SP',
    description: `Publis e vídeos UGC da Carol Limah (@eu.carollimah) para Mercado Livre, Shein, Kome e outras marcas. Os reels do Mercado Livre têm média de ${REELS_STATS.mlAverage} views.`,
    h1: 'Publis que <em>entregam alcance.</em>',
    lead: `Reels no meu perfil e vídeos UGC para a marca usar nos próprios canais. Os ${REELS_STATS.mlCount} reels para o Mercado Livre têm média de ${REELS_STATS.mlAverage} views.`,
    stops: [
      { id: 'mercado-livre', name: 'Mercado Livre', where: 'Achadinhos e datas', text: 'Datas como 8.8 e 10/10, achadinhos e o espaço da marca na CASACOR.', ids: ['v23', 'v32', 'v24', 'v28', 'v31'] },
      { id: 'restaurantes', name: 'Restaurantes e eventos', where: 'Kome · On Fire · Gusto Cucina', text: 'Parcerias com casas e eventos: o cardápio, o clima e o movimento.', ids: ['v22', 'v50', 'v52', 'v49', 'v48', 'v20'] },
      { id: 'moda-beleza', name: 'Moda e beleza', where: 'Shein · Illustratum', text: 'O fit check da Shein e o shampoo ozonizado da Illustratum.', ids: ['v02', 'v36'] },
      { id: 'bem-estar', name: 'Bem-estar', where: 'Buddha Spa', text: 'Presente de Dia dos Pais no spa.', ids: ['v46'] },
      { id: 'ugc', name: 'Vídeo UGC', where: 'Vagas Goiânia', text: 'Vídeo para a marca usar nos próprios canais e anúncios, sem postagem no meu perfil.', ids: ['v33'] },
    ],
  },
];

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
/** reel mais visto da parada, para a linha do roteiro */
export const topViews = (s: Stop) =>
  stopMedia(s).reduce<string | undefined>((best, m) => (viewsK(m.views) > viewsK(best) ? m.views : best), undefined);
