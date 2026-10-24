// Miniatura do portfólio (a capa, reduzida), usada no Início e em Projetos. Só para ver: nada nela é clicável.
import { Bloco } from '@blocks/Bloco';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis, type Projeto } from '@lib/projeto';
import { temaDoProjeto } from '../editor/tema';

export function Miniatura({ projeto }: { projeto: Projeto }) {
  const capa = blocosVisiveis(projeto, REGISTRO).find((b) => b.tipo === 'capa');
  return (
    <div className="ar-miniatura pagina" style={temaDoProjeto(projeto)} aria-hidden="true" inert>
      {capa && <Bloco bloco={capa} modo="publicado" />}
    </div>
  );
}
