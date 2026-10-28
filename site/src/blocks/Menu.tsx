// Menu do topo da página (DEV-098): as seções na ordem da página, numa faixa fixa que desliza para o lado no celular e
// marca a seção que está à vista. O Contato fica no fim, como botão. No editor é a mesma faixa: tocar num item leva a
// creator até a seção (quem decide o que fazer é o editor, por `aoEscolher`).
import { useEffect, useRef, useState } from 'react';
import type { ItemDoMenu } from '@lib/menu';
import type { ModoDeRender } from './tipos';

export function Menu({
  itens,
  modo,
  aoEscolher,
}: {
  itens: readonly ItemDoMenu[];
  modo: ModoDeRender;
  /** no editor: o que fazer ao tocar num item (em vez de rolar a página publicada) */
  aoEscolher?: (id: string) => void;
}) {
  const [ativo, setAtivo] = useState<string | null>(null);
  const trilho = useRef<HTMLUListElement>(null);

  // seção à vista: a mais de cima entre as que cruzam a faixa logo abaixo do menu
  useEffect(() => {
    if (modo !== 'publicado' || typeof IntersectionObserver === 'undefined') return;
    const alvos = itens.map((i) => document.getElementById(i.ancora)).filter((el): el is HTMLElement => el !== null);
    const visiveis = new Set<string>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visiveis.add(e.target.id);
          else visiveis.delete(e.target.id);
        }
        setAtivo(itens.find((i) => visiveis.has(i.ancora))?.ancora ?? null);
      },
      { rootMargin: '-72px 0px -55% 0px' },
    );
    for (const el of alvos) observador.observe(el);
    return () => observador.disconnect();
  }, [itens, modo]);

  // o item ativo fica à vista dentro da faixa (só a faixa rola, a página não se mexe)
  useEffect(() => {
    const ul = trilho.current;
    const item = ul?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!ul || !item) return;
    const fora = item.offsetLeft < ul.scrollLeft || item.offsetLeft + item.offsetWidth > ul.scrollLeft + ul.clientWidth;
    if (fora) ul.scrollTo({ left: item.offsetLeft - 20, behavior: 'smooth' });
  }, [ativo]);

  if (itens.length === 0) return null;

  const ir = (ev: React.MouseEvent, item: ItemDoMenu) => {
    ev.preventDefault();
    if (aoEscolher) return aoEscolher(item.id);
    const alvo = document.getElementById(item.ancora);
    if (!alvo) return;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    alvo.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
    history.replaceState(null, '', `#${item.ancora}`);
    setAtivo(item.ancora);
  };

  const link = (item: ItemDoMenu) => (
    <a
      href={`#${item.ancora}`}
      aria-current={ativo === item.ancora ? 'location' : undefined}
      onClick={(ev) => ir(ev, item)}
    >
      {item.rotulo}
    </a>
  );
  const secoes = itens.filter((i) => !i.destaque);
  const contato = itens.find((i) => i.destaque);

  // o Contato fica fora da faixa que desliza: sempre à vista, na ponta direita, mesmo no celular
  return (
    <nav className="bl-menu" aria-label="Seções da página">
      <div className="bl-menu-dentro">
        <ul ref={trilho} className="bl-menu-trilho">
          {secoes.map((item) => (
            <li key={item.id}>{link(item)}</li>
          ))}
        </ul>
        {contato && <div className="bl-menu-contato">{link(contato)}</div>}
      </div>
    </nav>
  );
}
