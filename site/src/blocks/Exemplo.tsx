import type { ModoDeRender } from './tipos';

/** Etiqueta "Exemplo · toque para trocar": só no editor, e só onde o conteúdo ainda é de placeholder. */
export function Exemplo({ ativo, modo }: { ativo?: boolean; modo: ModoDeRender }) {
  if (!ativo || modo !== 'editor') return null;
  return <small className="bl-exemplo">Exemplo · toque para trocar</small>;
}
