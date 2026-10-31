// O que a marca vê: o menu do topo, as seções visíveis (cada uma com a sua âncora) e o botão fixo de contato. Usado
// pela página no ar (/c/<link>) e pelo modo Ver do editor, para os dois mostrarem exatamente a mesma página. O botão
// fixo só aparece quando o Contato não está no menu.
import { ancorasDosBlocos, itensDoMenu } from '@lib/menu';
import { blocosVisiveis, type Projeto } from '@lib/projeto';
import { Bloco } from './Bloco';
import { ContatoFixo } from './ContatoFixo';
import { Menu } from './Menu';
import { REGISTRO } from './registro';

export function ConteudoDaPagina({ projeto }: { projeto: Projeto }) {
  const visiveis = blocosVisiveis(projeto, REGISTRO);
  const ancoras = ancorasDosBlocos(visiveis);
  const itens = itensDoMenu(projeto, REGISTRO);
  // com o Contato sempre à vista no menu, o botão flutuante do WhatsApp sobraria: dois chamados fixos na tela
  const contatoNoMenu = itens.some((i) => i.destaque);
  return (
    <>
      <Menu itens={itens} modo="publicado" />
      <main>
        {visiveis.map((b) => (
          <Bloco key={b.id} bloco={b} modo="publicado" ancora={ancoras.get(b.id)} />
        ))}
      </main>
      {!contatoNoMenu && <ContatoFixo blocos={visiveis} />}
    </>
  );
}
