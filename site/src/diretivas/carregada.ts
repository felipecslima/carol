// `client:carregada` (DEV-146): hidrata a ilha só depois do evento `load`, quando a imagem da capa (pedida com
// prioridade alta no <head>) já chegou. No 4G o JavaScript da página publicada disputava a internet com essa imagem,
// que é o maior elemento da primeira tela. A página já vem pronta do servidor; o JS só liga movimento, vídeos e menu.
import type { ClientDirective } from 'astro';

const carregada: ClientDirective = (carregar) => {
  const hidratar = async () => (await carregar())();
  if (document.readyState === 'complete') void hidratar();
  else window.addEventListener('load', () => void hidratar(), { once: true });
};

export default carregada;
