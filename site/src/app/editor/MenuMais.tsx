// Menu "Mais" da barra flutuante (DEV-095): Esconder e Remover saem da barra, que fica com o que se usa sempre
// (Editar, Subir, Descer). Teclado: abre com o foco no primeiro item, setas andam, Esc fecha e devolve o foco ao botão.
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

export interface ItemDoMenu {
  rotulo: string;
  icone: ReactNode;
  aoEscolher: () => void;
  /** ação que apaga: aparece em vermelho */
  perigo?: boolean;
  /** linha de apoio: o que a ação faz */
  detalhe?: string;
  /** atalho de teclado (aparece só em telas com mouse) */
  atalho?: string;
}

export function MenuMais({ itens, rotulo }: { itens: ItemDoMenu[]; rotulo: string }) {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!aberto) return;
    lista.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    // tocar fora só fecha: o clique que vem junto é engolido, senão viraria o "toque 2" na seção e abriria a edição
    const fora = (ev: PointerEvent) => {
      if (lista.current?.contains(ev.target as Node) || botao.current?.contains(ev.target as Node)) return;
      setAberto(false);
      const engolir = (c: MouseEvent) => {
        c.stopPropagation();
        c.preventDefault();
      };
      document.addEventListener('click', engolir, { capture: true, once: true });
      // sem clique logo em seguida (arrastou para rolar), o filtro sai: não pode engolir um clique de verdade depois
      window.setTimeout(() => document.removeEventListener('click', engolir, { capture: true }), 600);
    };
    const rolou = () => setAberto(false);
    document.addEventListener('pointerdown', fora);
    window.addEventListener('scroll', rolou, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', fora);
      window.removeEventListener('scroll', rolou);
    };
  }, [aberto]);

  const fechar = () => {
    setAberto(false);
    botao.current?.focus();
  };

  return (
    <div className="ed-mais">
      <button
        ref={botao}
        type="button"
        className="ed-mais-botao"
        aria-label={rotulo}
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={aberto ? id : undefined}
        onClick={() => setAberto(!aberto)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" fill="currentColor" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <circle cx="19" cy="12" r="1.8" fill="currentColor" />
        </svg>
        Mais
      </button>
      {aberto && (
        <div
          ref={lista}
          id={id}
          className="ed-mais-menu"
          role="menu"
          aria-label={rotulo}
          onKeyDown={(ev) => {
            const todos = [...(lista.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
            const atual = todos.indexOf(document.activeElement as HTMLElement);
            // o stopPropagation do React impede que o Esc chegue ao atalho global do editor (que tiraria a seleção)
            if (ev.key === 'Escape' || ev.key === 'Tab') {
              ev.preventDefault();
              ev.stopPropagation();
              fechar();
            } else if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
              ev.preventDefault();
              const passo = ev.key === 'ArrowDown' ? 1 : -1;
              todos[(atual + passo + todos.length) % todos.length]?.focus();
            } else if (ev.key === 'Home' || ev.key === 'End') {
              ev.preventDefault();
              todos[ev.key === 'Home' ? 0 : todos.length - 1]?.focus();
            }
          }}
        >
          {itens.map((item) => (
            <button
              key={item.rotulo}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={item.perigo ? 'ed-mais-item ed-mais-item--perigo' : 'ed-mais-item'}
              aria-keyshortcuts={item.atalho}
              onClick={() => {
                setAberto(false);
                item.aoEscolher();
              }}
            >
              {item.icone}
              <span className="ed-mais-texto">
                <span className="ed-mais-rotulo">
                  {item.rotulo}
                  {item.atalho && (
                    <kbd className="ed-mais-atalho" aria-hidden="true">
                      {item.atalho}
                    </kbd>
                  )}
                </span>
                {item.detalhe && <span className="ed-mais-detalhe">{item.detalhe}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
