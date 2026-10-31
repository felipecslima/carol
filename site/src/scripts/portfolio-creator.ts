// Scripts do /portfolio-creator/: menu, pausa da faixa, revelação da vitrine de seções e CTA fixo no mobile.
// Mesmo comportamento do site da Carol (scripts/main.ts), só o que esta página usa.
import { initMenu } from './menu';
import { t } from '../i18n/client';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initMenu();

// ---- Faixa: pausa permanente além do hover (WCAG 2.2.2); com reduced-motion ela já fica parada ----
const marquee = document.querySelector('.marquee');
const toggle = document.querySelector<HTMLButtonElement>('.marquee-toggle');
if (marquee && toggle && !reduceMotion) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const paused = !toggle.classList.contains('paused');
    marquee.classList.toggle('paused', paused);
    toggle.classList.toggle('paused', paused);
    toggle.setAttribute('aria-label', paused ? t.resumeAnim : t.pauseAnim);
  });
}

// ---- Vitrine de seções: aparecem em sequência, uma vez, quando a grade entra na tela ----
const grid = document.querySelector<HTMLElement>('.models');
if (grid && !reduceMotion && 'IntersectionObserver' in window && grid.getBoundingClientRect().top > window.innerHeight) {
  grid.classList.add('reveal-ready');
  new IntersectionObserver(([e], io) => {
    if (e.isIntersecting) { grid.classList.add('in'); io.disconnect(); }
  }, { threshold: 0.12 }).observe(grid);
  // rede de segurança: se algo impedir a observação, as seções aparecem
  setTimeout(() => grid.classList.add('in'), 6000);
}

// ---- CTA fixo no mobile: aparece depois do hero e some nas seções que já têm botão (teste, planos, final) ----
const dock = document.getElementById('dock');
const withCta = ['topo', 'plano', 'teste', 'contato'].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
const mobile = window.matchMedia('(max-width: 720px)');
if (dock && withCta.length && 'IntersectionObserver' in window) {
  const visible = new Set<string>(['topo']);
  const update = () => dock.classList.toggle('show', mobile.matches && visible.size === 0);
  dock.hidden = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
    update();
  });
  withCta.forEach((el) => io.observe(el));
  mobile.addEventListener('change', update);
}
