// As partes do mídia kit (DEV-154). Primeira: quem eu sou e quanto alcanço. Segunda: o que eu entrego e como fechamos.
// Com conteúdo para encher, cada parte é uma página; com pouco, as duas dividem uma folha só (Folha.tsx decide
// medindo). Cada página é uma coluna de regiões; região sem conteúdo some e o espaço fecha. O contato fica sempre na
// base da última página.
import type { Kit } from './dadosDoKit';
import { Abertura, Barras, Contato, Creditos, FaixaDeNumeros, FolhaDeContato, Formatos, Sobre } from './partes';

/** `comMarcas`: as marcas sobem para o pé da página 1 quando cabem lá (a Folha decide medindo). */
export function PrimeiraParte({ kit, comMarcas = false }: { kit: Kit; comMarcas?: boolean }) {
  // a frase em destaque (o subtítulo da capa) vai para a coluna que tem espaço: embaixo do Sobre curto, embaixo de
  // até 4 barras do público, ou, sem lugar no meio (ou sem Sobre), sob a manchete, como linha fina
  const meio = [kit.publico, kit.sobre].filter(Boolean).length;
  const sobreCurto = (kit.sobre?.texto.length ?? 0) <= 320;
  const ondeFrase = !kit.frase
    ? null
    : kit.sobre && (meio === 1 || sobreCurto)
      ? 'sobre'
      : kit.sobre && kit.publico && kit.publico.itens.length <= 4
        ? 'publico'
        : 'abertura';
  return (
    <>
      <Abertura kit={kit} linhaFina={ondeFrase === 'abertura'} />
      {kit.numeros.itens.length > 0 && <FaixaDeNumeros numeros={kit.numeros} />}
      {meio > 0 && (
        <div className={`mk-meio${meio === 1 ? ' mk-meio--um' : ''}`}>
          {kit.publico && <Barras publico={kit.publico} frase={ondeFrase === 'publico' ? kit.frase : undefined} />}
          {kit.sobre && <Sobre sobre={kit.sobre} frase={ondeFrase === 'sobre' ? kit.frase : undefined} />}
        </div>
      )}
      {comMarcas && kit.marcas && <Creditos marcas={kit.marcas} />}
    </>
  );
}

export function SegundaParte({ kit, semMarcas = false }: { kit: Kit; semMarcas?: boolean }) {
  // as regiões são filhas diretas da folha: a Folha distribui o espaço livre entre elas (sem buraco no fim)
  return (
    <>
      {kit.videos && <FolhaDeContato videos={kit.videos} link={kit.linkNoAr} />}
      {kit.marcas && !semMarcas && <Creditos marcas={kit.marcas} />}
      {kit.formatos && <Formatos formatos={kit.formatos} />}
      {kit.contato && <Contato contato={kit.contato} link={kit.linkNoAr} />}
    </>
  );
}
