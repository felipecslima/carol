// Gaveta de baixo (Vaul): um nível só, nunca uma gaveta dentro de outra. O teclado do celular não cobre o campo
// porque a gaveta acompanha a área visível (repositionInputs) e rola por dentro.
import type { ReactNode } from 'react';
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
  return (
    <Drawer.Root open={aberta} onOpenChange={(a) => !a && aoFechar()} modal={false} repositionInputs>
      <Drawer.Portal>
        <Drawer.Content
          className="ed-gaveta"
          aria-describedby={undefined}
          // as abas de baixo cuidam de abrir, trocar e fechar sozinhas: o toque nelas não conta como "fora da gaveta"
          // (senão a gaveta fecha no toque e o clique da aba a reabre)
          onInteractOutside={(ev) => {
            if ((ev.target as Element | null)?.closest?.('.ed-abas')) ev.preventDefault();
          }}
        >
          <div className="ed-gaveta-topo">
            <div>
              <Drawer.Title className="ed-gaveta-titulo">{titulo}</Drawer.Title>
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
