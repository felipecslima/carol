// Despachante: recebe um bloco do JSON do projeto e renderiza o componente certo. É o mesmo caminho no editor
// e na página publicada (uma renderização só); `modo` só decide se as etiquetas de exemplo aparecem.
import { Capa } from './Capa';
import { Contato } from './Contato';
import { Formatos } from './Formatos';
import { Marcas } from './Marcas';
import { Numeros } from './Numeros';
import { Publico } from './Publico';
import { Sobre } from './Sobre';
import type { ModoDeRender } from './tipos';
import { Videos } from './Videos';
import type { Bloco as BlocoDoProjeto } from '@lib/projeto';

const COMPONENTES = {
  capa: Capa,
  sobre: Sobre,
  numeros: Numeros,
  videos: Videos,
  marcas: Marcas,
  publico: Publico,
  formatos: Formatos,
  contato: Contato,
};

export function Bloco({ bloco, modo }: { bloco: BlocoDoProjeto; modo: ModoDeRender }) {
  const Componente = COMPONENTES[bloco.tipo as keyof typeof COMPONENTES] as
    React.ComponentType<{ variacao: string; dados: object; modo: ModoDeRender }> | undefined;
  if (!Componente) return null;
  return <Componente variacao={bloco.variacao} dados={bloco.dados} modo={modo} />;
}
