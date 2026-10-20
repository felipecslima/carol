// ---- Lightbox (<dialog> modal: foco preso, fundo inerte e Esc nativos) ----
// `cards` devolve a lista navegável do momento (na home, só os cards visíveis no filtro).
import { posterSrc, videoSrc } from '../data/content';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

export function initLightbox(cards: () => HTMLElement[], reduceMotion: boolean) {
  const lb = $<HTMLDialogElement>('lb');
  const lbMedia = $('lb-media');
  let idx: number | null = null;

  function render() {
    const list = cards();
    const c = list[idx!];
    const { id, video, cat, title, brand, views } = c.dataset;
    lbMedia.replaceChildren();
    if (video === '1') {
      const v = document.createElement('video');
      v.src = videoSrc(id!);
      v.poster = posterSrc(id!, 720);
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
    const n = cards().length;
    idx = (idx! + d + n) % n;
    render();
  }

  // Roda logo depois de lb.close(): o <dialog> devolve o foco a quem abriu, e aqui ele
  // vai para o card do último item visto. O Esc nativo passa pelo mesmo caminho via 'cancel'.
  function cleanup() {
    if (idx === null) return;
    const last = cards()[idx];
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

  return open;
}

/** hover/foco toca o vídeo do card; clique abre o lightbox na posição do card na lista */
export function bindCards(all: HTMLElement[], list: () => HTMLElement[], open: (i: number) => void, reduceMotion: boolean) {
  const play = (c: HTMLElement) => c.querySelector('video')?.play().catch(() => {});
  const pause = (c: HTMLElement) => c.querySelector('video')?.pause();
  all.forEach((c) => {
    c.querySelector('video')?.addEventListener('playing', () => c.classList.add('playing'), { once: true });
    if (!reduceMotion) {
      c.addEventListener('mouseenter', () => play(c));
      c.addEventListener('mouseleave', () => pause(c));
      c.addEventListener('focus', () => play(c));
      c.addEventListener('blur', () => pause(c));
    }
    c.addEventListener('click', () => open(list().indexOf(c)));
  });
}
