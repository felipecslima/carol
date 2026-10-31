// Movimento da interface do app (motion.dev). Responde a uma ação (trocar de aba, abrir um aviso, mover uma seção) ou
// recebe a pessoa numa tela; nada se move sozinho depois. Quem pede menos movimento (`prefers-reduced-motion`) vê as
// trocas sem deslocamento: o MotionConfig desliga transformações e mantém só o esmaecer.
import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

export const SUAVE = [0.22, 1, 0.36, 1] as const;

export function MovimentoDoApp({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Entrada de um bloco de tela: sobe e aparece, com atraso opcional para formar uma cascata. */
export const entrada = (atraso = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: SUAVE, delay: atraso },
});
