// Mídia kit para o PDF guardado (DEV-151): as 2 folhas com a versão publicada, sem barra nem marca d'água (publicado =
// pago ou Premium). Quando a folha está diagramada e as fontes e as imagens carregaram, avisa
// em `window.renderState = 'ready'`: é por esse sinal que o servidor espera antes de imprimir (server/pdf.ts).
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Projeto } from '@lib/projeto';
import { Folha } from './Folha';
import '../tema.css';

declare global {
  interface Window {
    renderState?: 'ready' | 'error';
  }
}

/**
 * Imagens do Cloudinary em JPEG e menores para o PDF: WebP e AVIF (o que o `f_auto` entrega ao Chrome) entram no PDF
 * regravados sem compressão (um kit de 1 página passava de 8 MB); JPEG entra como está. A foto da abertura ocupa
 * ~330 × 480 px na folha: 900 px de largura deixam ela nítida na impressão sem pesar.
 */
const paraPdf = (p: Projeto): Projeto =>
  JSON.parse(
    JSON.stringify(p)
      .replace(/(res\.cloudinary\.com\/[^/"]+\/image\/upload\/)f_auto,q_auto,w_1200\//g, '$1f_jpg,q_auto:eco,w_900/')
      .replace(/(res\.cloudinary\.com\/[^"]+?)f_auto/g, '$1f_jpg'),
  ) as Projeto;

export default function KitParaPdf({ projeto: original }: { projeto: Projeto }) {
  const projeto = useMemo(() => paraPdf(original), [original]);
  const [ajustada, setAjustada] = useState(false);
  const aoAjustar = useCallback(() => setAjustada(true), []);

  useEffect(() => {
    if (!ajustada) return;
    let vivo = true;
    const imagens = [...document.images].map((i) =>
      i.complete
        ? Promise.resolve()
        : new Promise((ok) => {
            i.addEventListener('load', ok, { once: true });
            i.addEventListener('error', ok, { once: true });
          }),
    );
    // no kit tudo é <img> e nada se anima: só uma folga para o navegador pintar as imagens recém-carregadas
    void Promise.all(imagens)
      .then(() => new Promise((ok) => setTimeout(ok, 300)))
      .then(() => vivo && (window.renderState = 'ready'));
    return () => {
      vivo = false;
    };
  }, [ajustada]);

  return (
    <div className="mk mk--pdf">
      <Folha projeto={projeto} marcaDagua={false} aoAjustar={aoAjustar} />
    </div>
  );
}
