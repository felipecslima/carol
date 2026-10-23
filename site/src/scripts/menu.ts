// ---- Menu mobile (home e páginas de nicho) ----
import { t } from '../i18n/client';

export function initMenu() {
  const burger = document.getElementById('burger')!;
  const links = document.getElementById('nav-links')!;
  const isOpen = () => links.classList.contains('open');
  const setMenu = (open: boolean) => {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? t.closeMenu : t.openMenu);
  };
  burger.addEventListener('click', () => setMenu(!isOpen()));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) { setMenu(false); burger.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (isOpen() && !(e.target as Element).closest('.nav')) setMenu(false);
  });
  return links;
}
