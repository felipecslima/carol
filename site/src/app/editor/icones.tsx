// Ícones em traço fino do editor (sem emoji na interface, como pede a marca).
import type { ReactNode } from 'react';

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;
const icone = (caminho: ReactNode) => () => <svg {...base}>{caminho}</svg>;

export const Subir = icone(<path d="M12 19V5M5 12l7-7 7 7" />);
export const Descer = icone(<path d="M12 5v14M5 12l7 7 7-7" />);
export const Lapis = icone(<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />);
export const Esconder = icone(
  <path d="M3 3l18 18M10.6 6.2A10 10 0 0 1 12 6c5 0 9 6 9 6a15 15 0 0 1-3 3.5M6.6 7.6C4 9.3 3 12 3 12s4 6 9 6c1.3 0 2.5-.3 3.6-.8M9.9 9.9a3 3 0 0 0 4.2 4.2" />,
);
export const Desfazer = icone(<path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />);
export const Refazer = icone(<path d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />);
export const Camadas = icone(<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />);
export const Mais = icone(<path d="M12 5v14M5 12h14" />);
export const Paleta = icone(
  <path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-1.4-1-1.7-1-2.7 0-.9.7-1.5 1.7-1.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3zM7.5 12a1 1 0 1 0 0-.01M10 7.5a1 1 0 1 0 0-.01M15 7.5a1 1 0 1 0 0-.01" />,
);
export const Fechar = icone(<path d="M6 6l12 12M18 6L6 18" />);
export const Lixeira = icone(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />);
export const Olho = icone(
  <>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const Foguete = icone(
  <path d="M5 15c-1 1-2 4-2 6 2 0 5-1 6-2M12 15l-3-3c1-4 4-8 11-9 0 7-4 10-9 9zM9 12l-4 1 1-4 4-1M15 9a1 1 0 1 0 0 .01" />,
);
export const Imagem = icone(<path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9a1 1 0 1 0 0 .01" />);
export const Casa = icone(<path d="M4 11l8-7 8 7M6 10v10h12V10M10 20v-6h4v6" />);
export const Pessoa = icone(<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-7 8-7s8 3 8 7" />);
export const Pasta = icone(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />);
