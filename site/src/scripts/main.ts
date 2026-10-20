const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Menu mobile ----
const burger = $('burger');
const links = $('nav-links');
const isOpen = () => links.classList.contains('open');
const setMenu = (open: boolean) => {
  links.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
burger.addEventListener('click', () => setMenu(!isOpen()));
links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen()) { setMenu(false); burger.focus(); }
});
document.addEventListener('click', (e) => {
  if (isOpen() && !(e.target as Element).closest('.nav')) setMenu(false);
});

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
        b.setAttribute('aria-label', paused ? 'Retomar animação' : 'Pausar animação');
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

const play = (c: HTMLElement) => c.querySelector('video')?.play().catch(() => {});
const pause = (c: HTMLElement) => c.querySelector('video')?.pause();
cards.forEach((c) => {
  if (!reduceMotion) {
    c.addEventListener('mouseenter', () => play(c));
    c.addEventListener('mouseleave', () => pause(c));
    c.addEventListener('focus', () => play(c));
    c.addEventListener('blur', () => pause(c));
  }
  c.addEventListener('click', () => open(visible().indexOf(c)));
});

// ---- Lightbox (<dialog> modal: foco preso, fundo inerte e Esc nativos) ----
const lb = $<HTMLDialogElement>('lb');
const lbMedia = $('lb-media');
let idx: number | null = null;

function render() {
  const list = visible();
  const c = list[idx!];
  const { id, video, cat, title, brand, views, src, poster } = c.dataset;
  lbMedia.replaceChildren();
  if (video === '1') {
    const v = document.createElement('video');
    v.src = src!;
    v.poster = poster!;
    v.controls = true;
    v.muted = true; // começa mudo; o som fica nos controles
    v.playsInline = true;
    if (!reduceMotion) v.autoplay = true;
    v.setAttribute('aria-label', title!);
    lbMedia.append(v);
  } else {
    const img = document.createElement('img');
    img.src = `/media/${id}.webp`;
    img.alt = title!;
    lbMedia.append(img);
  }
  $('lb-cat').textContent = `${video === '1' ? 'Vídeo' : 'Foto'} · ${cat}`;
  $('lb-title').textContent = title!;
  const b = $('lb-brand');
  b.hidden = !brand;
  b.textContent = brand ? `Parceria com ${brand}` : '';
  const vw = $('lb-views');
  vw.hidden = !views;
  vw.textContent = views ? `${views} views no Instagram` : '';
  $('lb-count').textContent = `${idx! + 1} de ${list.length}`;
  $('lb-prev').hidden = $('lb-next').hidden = list.length < 2;
  $('lb-live').textContent = `${title}, ${idx! + 1} de ${list.length}`;
}

function open(i: number) {
  idx = i;
  render();
  lb.showModal();
  document.body.style.overflow = 'hidden';
  $('lb-close').focus();
}

function step(d: number) {
  const n = visible().length;
  idx = (idx! + d + n) % n;
  render();
}

// Roda logo depois de lb.close(): o <dialog> devolve o foco a quem abriu, e aqui ele
// vai para o card do último item visto. O Esc nativo passa pelo mesmo caminho via 'cancel'.
function cleanup() {
  if (idx === null) return;
  const last = visible()[idx];
  idx = null;
  lbMedia.replaceChildren(); // para o vídeo
  document.body.style.overflow = '';
  last?.focus();
}
const close = () => { lb.close(); cleanup(); };
lb.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
lb.addEventListener('close', cleanup);
lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
$('lb-close').addEventListener('click', close);
$('lb-prev').addEventListener('click', () => step(-1));
$('lb-next').addEventListener('click', () => step(1));
lb.addEventListener('keydown', (e) => {
  if ((e.target as Element).closest('video')) return; // setas controlam o vídeo
  if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === 'ArrowRight') step(1);
});

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
      copy.textContent = 'Copiado!';
      status.textContent = 'E-mail copiado.';
      status.classList.add('sr-only');
      t = window.setTimeout(() => {
        copy.textContent = 'Copiar';
        status.textContent = '';
      }, 2500);
    } catch {
      copy.textContent = 'Copiar';
      const range = document.createRange();
      range.selectNodeContents(emailText);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      status.classList.remove('sr-only');
      status.textContent = 'Não deu pra copiar. O e-mail está selecionado: é só copiar.';
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
