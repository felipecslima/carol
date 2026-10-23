import { initMenu } from './menu';
import { bindCards, initLightbox } from './lightbox';
import { t } from '../i18n/client';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
initMenu();

// todos os cards da página formam uma lista só no lightbox (as setas atravessam as paradas)
const cards = [...document.querySelectorAll<HTMLElement>('.stop .card')];
bindCards(cards, () => cards, initLightbox(() => cards, reduceMotion), reduceMotion);

// ---- Roteiro: a parada no meio da tela acende no índice e a linha se preenche até ela ----
// No mobile o índice fica lá em cima; quando ele sai da tela, a parada atual aparece numa faixa na nav.
const route = document.getElementById('route');
const stops = [...document.querySelectorAll<HTMLElement>('.stop')];
const marks = [...(route?.querySelectorAll<HTMLAnchorElement>('a') ?? [])];
const now = document.getElementById('route-now') as HTMLAnchorElement;
const nowName = document.getElementById('route-now-name')!;
const nowCount = document.getElementById('route-now-count')!;
let routeSeen = true;
let current = -1;
const updateNow = () => {
  now.hidden = routeSeen || current < 0;
  if (current >= 0) {
    nowName.textContent = stops[current].querySelector('h2')!.textContent;
    nowCount.textContent = t.of(current + 1, stops.length);
    now.setAttribute('aria-label', `${nowName.textContent} ${t.of(current + 1, stops.length)}, ${t.backToRoute}`);
  }
};
if (route && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => { routeSeen = e.isIntersecting || e.boundingClientRect.top > 0; updateNow(); }).observe(route);
  const setCurrent = (i: number) => {
    current = i;
    updateNow();
    marks.forEach((a, j) => {
      a.classList.toggle('passed', i >= 0 && j < i);
      if (j === i) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };
  // a parada atual é a última cujo topo já passou do meio da tela; acima da primeira, o roteiro fica apagado.
  // Calculado na rolagem (e não por IntersectionObserver) para valer também num salto direto ao topo.
  let ticking = false;
  const sync = () => {
    ticking = false;
    const mid = window.innerHeight / 2;
    let i = -1;
    stops.forEach((s, j) => { if (s.getBoundingClientRect().top <= mid) i = j; });
    if (i !== current) setCurrent(i);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(sync); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  sync();
}
