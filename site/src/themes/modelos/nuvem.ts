// Modelo Nuvem: página na cor suave da paleta, cartões claros, cantos redondos e muito respiro. Visual de
// referência: prototipo/ModeloNuvem do pacote de handoff. As 3 paletas são 3 cores de origem (lavanda,
// pêssego, menta); o resto sai da mesma regra de cor das paletas da creator.
import type { Esquema } from '../paleta';
import type { EstiloGlobal } from '../tokens';

export const NUVEM = {
  id: 'nuvem',
  nome: 'Nuvem',
  esquema: 'fidelity' as Esquema,
  estilo: {
    cenario: 'nuvem',
    fontes: 'par-nuvem',
    cantos: 'redondos',
    respiro: 'normal',
    ornamento: 'nenhum',
  } satisfies EstiloGlobal,
  paletas: [
    { nome: 'Lavanda', origem: '#8c77e0' },
    { nome: 'Pêssego', origem: '#f08a62' },
    { nome: 'Menta', origem: '#4bb08b' },
  ],
} as const;
