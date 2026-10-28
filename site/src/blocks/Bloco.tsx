// Despachante: recebe um bloco do JSON do projeto e renderiza o componente certo. É o mesmo caminho no editor
// e na página publicada (uma renderização só); `modo` só decide se as etiquetas de exemplo aparecem.
import { Capa } from './Capa';
import { Contato } from './Contato';
import { Formatos } from './Formatos';
import { Marcas } from './Marcas';
import { Numeros } from './Numeros';
import { Motivos } from './Motivos';
import { Processo } from './Processo';
import { Publico } from './Publico';
import { Resumo } from './Resumo';
import { Sobre } from './Sobre';
import { Movimento } from './movimento';
import type { ModoDeRender } from './tipos';
import { Videos } from './Videos';
import type { Bloco as BlocoDoProjeto } from '@lib/projeto';

const COMPONENTES = {
  capa: Capa,
  resumo: Resumo,
  motivos: Motivos,
  processo: Processo,
  sobre: Sobre,
  numeros: Numeros,
  videos: Videos,
  marcas: Marcas,
  publico: Publico,
  formatos: Formatos,
  contato: Contato,
};

export function Bloco({ bloco, modo, ancora }: { bloco: BlocoDoProjeto; modo: ModoDeRender; ancora?: string }) {
  const Componente = COMPONENTES[bloco.tipo as keyof typeof COMPONENTES] as
    React.ComponentType<{ variacao: string; dados: object; modo: ModoDeRender; ancora?: string }> | undefined;
  if (!Componente) return null;
  return (
    <Movimento>
      <Componente variacao={bloco.variacao} dados={bloco.dados} modo={modo} ancora={ancora} />
    </Movimento>
  );
}
