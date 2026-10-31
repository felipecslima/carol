// Gaveta de baixo (Vaul): um nível só, nunca uma gaveta dentro de outra. O teclado do celular não cobre o campo
// porque a gaveta acompanha a área visível (repositionInputs) e rola por dentro.
import { useEffect, useRef, type ReactNode } from 'react';
import { Drawer } from 'vaul';
import { Fechar } from './icones';

export function Gaveta({
  aberta,
  aoFechar,
  titulo,
  descricao,
  children,
}: {
  aberta: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  // foco (DEV-232): ao abrir vai para o título da gaveta (leitor de tela anuncia e o Tab segue para os campos; no
  // celular não abre o teclado); ao fechar volta para quem abriu (a seção ou a aba)
  const deOnde = useRef<HTMLElement | null>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (aberta) deOnde.current = document.activeElement as HTMLElement | null;
  }, [aberta]);
  return (
    <Drawer.Root open={aberta} onOpenChange={(a) => !a && aoFechar()} modal={false} repositionInputs>
      <Drawer.Portal>
        <Drawer.Content
          className="ed-gaveta"
          aria-describedby={undefined}
          onOpenAutoFocus={(ev) => {
            ev.preventDefault();
            tituloRef.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(ev) => {
            ev.preventDefault();
            const volta = deOnde.current;
            if (volta?.isConnected) volta.focus({ preventScroll: true });
          }}
          // as abas de baixo cuidam de abrir, trocar e fechar sozinhas: o toque nelas não conta como "fora da gaveta"
          // (senão a gaveta fecha no toque e o clique da aba a reabre)
          onInteractOutside={(ev) => {
            if ((ev.target as Element | null)?.closest?.('.ed-abas')) ev.preventDefault();
          }}
        >
          <div className="ed-gaveta-topo">
            <div>
              <Drawer.Title ref={tituloRef} className="ed-gaveta-titulo" tabIndex={-1}>
                {titulo}
              </Drawer.Title>
              {descricao && <p className="ed-dica">{descricao}</p>}
            </div>
            <button type="button" className="ed-icone" onClick={aoFechar} aria-label="Fechar">
              <Fechar />
            </button>
          </div>
          <div className="ed-gaveta-corpo">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
