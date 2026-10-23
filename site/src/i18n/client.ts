// Textos dos scripts do navegador (menu, lightbox, cópia do e-mail, roteiro). O idioma vem do <html lang>.
import type { L, Lang } from '.';

const T: L<{
  openMenu: string; closeMenu: string; pauseAnim: string; resumeAnim: string;
  video: string; photo: string; partnerWith: (b: string) => string; viewsOn: (v: string) => string; of: (i: number, n: number) => string;
  copy: string; copied: string; copiedStatus: string; copyFailed: string; backToRoute: string;
}> = {
  pt: {
    openMenu: 'Abrir menu', closeMenu: 'Fechar menu', pauseAnim: 'Pausar animação', resumeAnim: 'Retomar animação',
    video: 'Vídeo', photo: 'Foto', partnerWith: (b) => `Parceria com ${b}`, viewsOn: (v) => `${v} views no Instagram`, of: (i, n) => `${i} de ${n}`,
    copy: 'Copiar', copied: 'Copiado!', copiedStatus: 'E-mail copiado.', copyFailed: 'Não deu pra copiar. O e-mail está selecionado: é só copiar.',
    backToRoute: 'voltar ao roteiro',
  },
  en: {
    openMenu: 'Open menu', closeMenu: 'Close menu', pauseAnim: 'Pause animation', resumeAnim: 'Resume animation',
    video: 'Video', photo: 'Photo', partnerWith: (b) => `Partnership with ${b}`, viewsOn: (v) => `${v} views on Instagram`, of: (i, n) => `${i} of ${n}`,
    copy: 'Copy', copied: 'Copied!', copiedStatus: 'Email copied.', copyFailed: 'Couldn’t copy. The email is selected, so you can copy it yourself.',
    backToRoute: 'back to the route',
  },
  es: {
    openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', pauseAnim: 'Pausar animación', resumeAnim: 'Reanudar animación',
    video: 'Video', photo: 'Foto', partnerWith: (b) => `Colaboración con ${b}`, viewsOn: (v) => `${v} vistas en Instagram`, of: (i, n) => `${i} de ${n}`,
    copy: 'Copiar', copied: '¡Copiado!', copiedStatus: 'Correo copiado.', copyFailed: 'No se pudo copiar. El correo está seleccionado: solo cópialo.',
    backToRoute: 'volver a la ruta',
  },
};

const lang = document.documentElement.lang.slice(0, 2) as Lang;
export const t = T[lang] ?? T.pt;
