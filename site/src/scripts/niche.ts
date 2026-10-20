import { initMenu } from './menu';
import { bindCards, initLightbox } from './lightbox';

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
    nowCount.textContent = `${current + 1} de ${stops.length}`;
    now.setAttribute('aria-label', `Voltar ao roteiro. Parada atual: ${nowName.textContent}, ${current + 1} de ${stops.length}`);
  }
};
if (route && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => { routeSeen = e.isIntersecting || e.boundingClientRect.top > 0; updateNow(); }).observe(route);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = stops.indexOf(e.target as HTMLElement);
      current = i;
      updateNow();
      marks.forEach((a, j) => {
        a.classList.toggle('passed', j < i);
        if (j === i) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  stops.forEach((s) => io.observe(s));
}
