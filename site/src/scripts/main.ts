import { initMenu } from './menu';
import { bindCards, initLightbox } from './lightbox';
import { t as tr } from '../i18n/client';

// carregado pelo script da Amplitude no SeoHead; pode faltar se um bloqueador barrar o CDN
declare global {
  interface Window { amplitude?: { track(eventType: string): void } }
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const links = initMenu();

// ---- Marquee: pausa permanente além do hover (WCAG 2.2.2); com reduced-motion ele já fica parado ----
const marquees = document.querySelectorAll('.marquee');
const marqueeToggles = document.querySelectorAll<HTMLButtonElement>('.marquee-toggle');
if (!reduceMotion) {
  // um botão pausa todas as faixas (texto e marcas)
  marqueeToggles.forEach((btn) => {
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const paused = !btn.classList.contains('paused');
      marquees.forEach((m) => m.classList.toggle('paused', paused));
      marqueeToggles.forEach((b) => {
        b.classList.toggle('paused', paused);
        b.setAttribute('aria-label', paused ? tr.resumeAnim : tr.pauseAnim);
      });
    });
  });
}

// ---- Nav: marca a seção que está no meio da tela ----
const navLinks = [...links.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => {
        if (a.hash === `#${e.target.id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['topo', ...navLinks.map((a) => a.hash.slice(1))].forEach((id) => {
    const el = document.getElementById(id);
    if (el) navIo.observe(el);
  });
}

// ---- Filtro + hover play ----
const cards = [...document.querySelectorAll<HTMLButtonElement>('#grid .card')];
const filters = [...document.querySelectorAll<HTMLButtonElement>('.filter')];
let filter = 'todos';
const visible = () => cards.filter((c) => !c.hidden);

// Em "Todos" a grade começa com os primeiros itens e um botão abre o resto; os filtros mostram tudo o que bate.
const FIRST = 12;
const more = $<HTMLButtonElement>('more');
let expanded = false;
const applyFilter = () => {
  cards.forEach((c, i) => {
    c.hidden = filter === 'todos' ? !expanded && i >= FIRST : !c.dataset.groups!.split(' ').includes(filter);
  });
  more.hidden = filter !== 'todos' || expanded || cards.length <= FIRST;
};
applyFilter();
more.addEventListener('click', () => {
  expanded = true;
  applyFilter();
  cards[FIRST]?.focus();
});

filters.forEach((b) =>
  b.addEventListener('click', () => {
    filter = b.dataset.filter!;
    filters.forEach((f) => f.setAttribute('aria-pressed', String(f === b)));
    applyFilter();
    cards.forEach((c) => {
      // reinicia o fade de entrada
      c.style.animation = 'none';
      void c.offsetWidth;
      c.style.animation = '';
    });
  }),
);

bindCards(cards, visible, initLightbox(visible, reduceMotion), reduceMotion);

// ---- Barras: visíveis por padrão; animam de 0 só com JS e sem reduced-motion ----
const bars = $('bars');
if (!reduceMotion && 'IntersectionObserver' in window && bars.getBoundingClientRect().top > window.innerHeight) {
  bars.classList.add('js-anim');
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { bars.classList.add('in'); obs.disconnect(); }
  }, { threshold: 0.25 }).observe(bars);
}

// ---- Copiar e-mail (o link mailto funciona sem isto) ----
const copy = $<HTMLButtonElement>('copy');
const emailText = $('email-text');
const status = $('copy-status');
let t: number;
if (navigator.clipboard?.writeText) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    clearTimeout(t);
    try {
      await navigator.clipboard.writeText(copy.dataset.email!);
      window.amplitude?.track('Email Copied');
      copy.textContent = tr.copied;
      status.textContent = tr.copiedStatus;
      status.classList.add('sr-only');
      t = window.setTimeout(() => {
        copy.textContent = tr.copy;
        status.textContent = '';
      }, 2500);
    } catch {
      copy.textContent = tr.copy;
      const range = document.createRange();
      range.selectNodeContents(emailText);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      status.classList.remove('sr-only');
      status.textContent = tr.copyFailed;
    }
  });
}

// ---- CTA fixo no mobile: aparece depois do hero e some quando o contato entra na tela ----
const dock = $('dock');
const mobile = window.matchMedia('(max-width: 720px)');
if ('IntersectionObserver' in window) {
  const seen = { topo: true, contato: false };
  const update = () => dock.classList.toggle('show', mobile.matches && !seen.topo && !seen.contato);
  dock.hidden = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { seen[e.target.id as keyof typeof seen] = e.isIntersecting; });
    update();
  });
  io.observe($('topo'));
  io.observe($('contato'));
  mobile.addEventListener('change', update);
}
