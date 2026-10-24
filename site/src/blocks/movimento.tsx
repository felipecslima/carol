// Movimento da página publicada (motion.dev). Regras: só no modo `publicado` (no editor tudo fica parado e estável);
// só quando a seção entra na tela, uma vez; quem pede menos movimento (`prefers-reduced-motion`) vê tudo no lugar,
// sem deslocamento (o MotionConfig desliga transformações). Cada efeito mostra algo: lista que entra em cadeia
// ensina a ordem de leitura, número que sobe mostra a escala, barra que enche mostra a proporção.
import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  animate,
  domAnimation,
  LazyMotion,
  m,
  MotionConfig,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from 'motion/react';
import type { ModoDeRender } from './tipos';

/** Envolve um bloco: carrega só os recursos de animação de que a página precisa e respeita "reduzir movimento". */
export function Movimento({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}

const SUAVE = [0.22, 1, 0.36, 1] as const; // desacelera no fim, sem quicar
const NA_TELA = { once: true, margin: '0px 0px -12% 0px' } as const;

const efeitos: Record<'surgir' | 'pop' | 'entrar', Variants> = {
  surgir: {
    oculto: { opacity: 0, y: 18 },
    visivel: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SUAVE } },
  },
  // etiquetas e marcas: surgem com uma mola curta, como um selo sendo colocado
  pop: {
    oculto: { opacity: 0, scale: 0.82 },
    visivel: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 24 } },
  },
  // carrossel: cada cartão vem da direita, na direção em que a pessoa vai rolar
  entrar: {
    oculto: { opacity: 0, x: 36 },
    visivel: { opacity: 1, x: 0, transition: { duration: 0.65, ease: SUAVE } },
  },
};

type Efeito = keyof typeof efeitos;

/** Bloco de texto que sobe e aparece quando entra na tela. */
export function Revela({
  modo,
  tag = 'div',
  atraso = 0,
  className,
  children,
}: {
  modo: ModoDeRender;
  tag?: 'div' | 'h2' | 'p';
  atraso?: number;
  className?: string;
  children: ReactNode;
}) {
  if (modo === 'editor') {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
  }
  const Tag = m[tag];
  return (
    <Tag
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={NA_TELA}
      variants={{
        oculto: efeitos.surgir.oculto,
        visivel: { ...(efeitos.surgir.visivel as object), transition: { duration: 0.6, ease: SUAVE, delay: atraso } },
      }}
    >
      {children}
    </Tag>
  );
}

/** Lista cujos itens entram em cadeia (um depois do outro). Use `Item` para os filhos. */
export function Lista({
  modo,
  tag = 'ul',
  passo = 0.07,
  className,
  children,
}: {
  modo: ModoDeRender;
  tag?: 'ul' | 'ol';
  passo?: number;
  className?: string;
  children: ReactNode;
}) {
  if (modo === 'editor') {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
  }
  const Tag = m[tag];
  return (
    <Tag
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={NA_TELA}
      variants={{ oculto: {}, visivel: { transition: { staggerChildren: passo } } }}
    >
      {children}
    </Tag>
  );
}

export function Item({
  modo,
  efeito = 'surgir',
  eleva = false,
  className,
  children,
}: {
  modo: ModoDeRender;
  efeito?: Efeito;
  /** sobe um pouco sob o dedo ou o cursor */
  eleva?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (modo === 'editor') return <li className={className}>{children}</li>;
  return (
    <m.li
      className={className}
      variants={efeitos[efeito]}
      whileHover={eleva ? { y: -5, transition: { duration: 0.2 } } : undefined}
      whileTap={eleva ? { scale: 0.985 } : undefined}
    >
      {children}
    </m.li>
  );
}

/** "58,4 mil", "1,67 mi", "13,3%": o número sobe de 0 até o valor, mantendo as casas decimais e o resto do texto. */
export function Contagem({ texto, modo }: { texto: string; modo: ModoDeRender }) {
  const partes = texto.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  const ref = useRef<HTMLElement>(null);
  const naTela = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const alvo = partes ? Number(partes[2]!.replace(',', '.')) : 0;
  const casas = partes?.[2]?.split(/[.,]/)[1]?.length ?? 0;
  const animavel = modo === 'publicado' && partes !== null && alvo > 0;

  useEffect(() => {
    const el = ref.current;
    if (!naTela || !animavel || !el || !partes) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const controle = animate(0, alvo, {
      duration: 1.3,
      ease: SUAVE,
      onUpdate: (v) => {
        el.textContent = `${partes[1]}${v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}${partes[3]}`;
      },
      onComplete: () => {
        el.textContent = texto; // termina exatamente no texto que a creator escreveu
      },
    });
    return () => controle.stop();
  }, [naTela, animavel, alvo, casas, texto, partes]);

  return (
    <b ref={ref} className="bl-numero">
      {texto}
    </b>
  );
}

/** Barra de proporção que enche da esquerda para a direita quando aparece. */
export function Preenche({ pct, modo }: { pct: number; modo: ModoDeRender }) {
  if (modo === 'editor') return <span style={{ width: `${pct}%` }} />;
  return (
    <m.span
      initial={{ width: 0 }}
      whileInView={{ width: `${pct}%` }}
      viewport={NA_TELA}
      transition={{ duration: 1.1, ease: SUAVE, delay: 0.15 }}
    />
  );
}

/** Botão com resposta ao toque: cresce um pouco sob o cursor e afunda ao ser pressionado. */
export function BotaoVivo({ modo, ...props }: { modo: ModoDeRender } & ComponentPropsWithoutRef<'a'>) {
  if (modo === 'editor') return <a {...props} />;
  return (
    <m.a
      {...(props as object)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    />
  );
}

/** Fio que liga as etapas e se desenha conforme a pessoa rola a página. */
export function FioDasEtapas({ alvo, modo }: { alvo: React.RefObject<HTMLElement | null>; modo: ModoDeRender }) {
  const { scrollYProgress } = useScroll({ target: alvo, offset: ['start 75%', 'end 55%'] });
  const escala = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <span className="bl-fio" aria-hidden="true">
      <m.span className="bl-fio-preenchido" style={modo === 'editor' ? { scaleY: 1 } : { scaleY: escala }} />
    </span>
  );
}

/** Desloca o fundo da capa mais devagar que a página (paralaxe), para dar profundidade. */
export function usePralaxe(alvo: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: alvo, offset: ['start start', 'end start'] });
  return useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
}

/** Título que sobe palavra por palavra, cada uma saindo de uma "janela" (o texto lido pelo leitor de tela é o título inteiro). */
export function Palavras({ texto, modo, className }: { texto: string; modo: ModoDeRender; className?: string }) {
  if (modo === 'editor') return <h1 className={className}>{texto}</h1>;
  return (
    <h1 className={className} aria-label={texto}>
      <m.span
        aria-hidden="true"
        style={{ display: 'inline' }}
        initial="oculto"
        animate="visivel"
        variants={{ oculto: {}, visivel: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } } }}
      >
        {texto.split(' ').map((p, i, todas) => (
          <span
            key={i}
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em' }}
          >
            <m.span
              style={{ display: 'inline-block' }}
              variants={{
                oculto: { y: '110%' },
                visivel: { y: 0, transition: { duration: 0.75, ease: SUAVE } },
              }}
            >
              {p}
              {i < todas.length - 1 ? '\u00a0' : ''}
            </m.span>
          </span>
        ))}
      </m.span>
    </h1>
  );
}

export { m };
