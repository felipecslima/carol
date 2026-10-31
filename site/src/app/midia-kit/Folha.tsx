// O mídia kit em 1 ou 2 páginas A4 (DEV-154), diagramado como matéria de revista: conteúdo próprio (kit/dadosDoKit.ts),
// e não os blocos do site encolhidos. Usada na tela do editor (MidiaKit.tsx, com o rascunho) e na página que o
// servidor transforma em PDF (KitParaPdf.tsx, com a versão publicada, DEV-151). Tamanho real, sem redução: o que
// não cabe fica de fora pelos limites de cada região, e a Revisão avisa; a sobra vira foto maior e respiro igual.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { REGISTRO } from '@blocks/registro';
import type { Projeto } from '@lib/projeto';
import { temaDoProjeto } from '../editor/tema';
import { dadosDoKit, TAMANHOS_DA_MANCHETE } from './kit/dadosDoKit';
import { PrimeiraParte, SegundaParte } from './kit/Paginas';
import { Rodape } from './kit/partes';
import './midia-kit.css';
import './kit/kit.css';

/** A4 a 96 dpi */
export const LARGURA = 794;
export const ALTURA = 1123;
/** espaço entre as folhas na tela */
const ENTRE = 24;

/**
 * Manchete no maior tamanho (56, 44 ou 36 px) que cabe no número de linhas pedido, medido com a fonte já carregada
 * (a Instrument Serif é estreita e costuma caber maior que a Nunito). Abaixo de 36 px não desce: passa de linha.
 */
function caberEmLinhas(raiz: HTMLElement) {
  raiz.querySelectorAll<HTMLElement>('[data-cabe-em-linhas]').forEach((el) => {
    const linhas = Number(el.dataset.cabeEmLinhas);
    for (const tamanho of TAMANHOS_DA_MANCHETE) {
      el.style.fontSize = `${tamanho}px`;
      const altura = parseFloat(getComputedStyle(el).lineHeight) || tamanho * 1.05;
      // conta as linhas arredondando: acentos e descendentes passam alguns pixels da altura da linha
      if (Math.round(el.scrollHeight / altura) <= linhas) break;
    }
  });
}

/**
 * Ao lado da foto, a manchete ocupa a coluna: depois que a altura da abertura está decidida, sobe para o maior
 * tamanho (até 56 px, no máximo 6 linhas) que ainda cabe na coluna do texto. Sem isso, uma manchete de 36 px no pé
 * de uma coluna de 640 px deixa um buraco em cima.
 */
function crescerManchete(raiz: HTMLElement) {
  raiz.querySelectorAll<HTMLElement>('.mk-abertura:not(.mk-abertura--sem-foto) .mk-manchete').forEach((el) => {
    const coluna = el.parentElement!;
    const inicial = el.style.fontSize;
    for (const tamanho of TAMANHOS_DA_MANCHETE) {
      el.style.fontSize = `${tamanho}px`;
      const linha = parseFloat(getComputedStyle(el).lineHeight) || tamanho * 1.05;
      if (coluna.scrollHeight <= coluna.clientHeight && Math.round(el.scrollHeight / linha) <= 6) return;
    }
    el.style.fontSize = inicial;
  });
}

type Arranjo = 'juntas' | 'marcas-na-1' | 'separadas';

/** Margem de baixo (o rodapé fica dentro dela). */
const MARGEM = 48;
/** Intervalo entre regiões: mínimo confortável, teto do primeiro crescimento, teto final e piso de emergência. */
const ESPACO = { base: 24, folgado: 40, maximo: 64, minimo: 16 };
/** Altura da foto da abertura: padrão, menor e maior. */
const FOTO = { base: 480, minima: 400, maxima: 640 };

/**
 * Distribui a sobra da folha, no lugar de deixar buraco: primeiro os intervalos entre regiões crescem até 40 px,
 * depois a foto da abertura cresce até 640 px, depois os intervalos até 64 px; o resto vai para cima do contato (que
 * fica na base). Se faltar espaço, a foto desce até 400 px e os intervalos até 16 px. Mede com offsetTop, que não
 * sofre a escala de tela. Devolve 1 se coube com folga, 0 se coube apertando e −1 se vazou.
 */
function distribuir(folha: HTMLElement): number {
  const regioes = [...folha.children].filter(
    (el): el is HTMLElement => el instanceof HTMLElement && !el.matches('.mk-rodape, .mk-marca'),
  );
  const intervalos = regioes.filter((el, i) => i > 0 && !el.matches('.mk-faixa')).length;
  // a abertura cresce com ou sem foto (sem foto, cresce o espaço acima da manchete)
  const temFoto = Boolean(folha.querySelector(':scope > .mk-abertura'));
  const temContato = Boolean(folha.querySelector(':scope > .mk-contato'));
  const aplicar = (espaco: number, foto: number, resto: number) => {
    folha.style.setProperty('--mk-espaco', `${espaco}px`);
    folha.style.setProperty('--mk-foto', `${foto}px`);
    folha.style.setProperty('--mk-resto', `${resto}px`);
  };
  aplicar(ESPACO.base, FOTO.base, 0);
  const ultima = regioes.at(-1);
  let sobra = ALTURA - MARGEM - (ultima ? ultima.offsetTop + ultima.offsetHeight : 0);
  let espaco = ESPACO.base;
  let foto = FOTO.base;

  if (sobra < 0) {
    if (temFoto) {
      const menos = Math.min(FOTO.base - FOTO.minima, -sobra);
      foto -= menos;
      sobra += menos;
    }
    if (sobra < 0 && intervalos) {
      const menos = Math.min(ESPACO.base - ESPACO.minimo, -sobra / intervalos);
      espaco -= menos;
      sobra += menos * intervalos;
    }
    aplicar(espaco, foto, 0);
    return sobra >= -1 ? 0 : -1;
  }

  const crescer = (teto: number) => {
    if (!intervalos || sobra <= 0) return;
    const mais = Math.min(sobra / intervalos, teto - espaco);
    if (mais <= 0) return;
    espaco += mais;
    sobra -= mais * intervalos;
  };
  crescer(ESPACO.folgado);
  if (temFoto) {
    const mais = Math.min(sobra, FOTO.maxima - foto);
    foto += mais;
    sobra -= mais;
  }
  crescer(ESPACO.maximo);
  aplicar(espaco, foto, temContato ? sobra : 0);
  return 1;
}

/** Distribui o espaço de cada folha; devolve o pior resultado entre elas (1 folga, 0 apertada, −1 vazou). */
function diagramarFolhas(raiz: HTMLElement): number {
  return Math.min(...[...raiz.querySelectorAll<HTMLElement>('.mk-folha')].map(distribuir));
}

export function Folha({
  projeto,
  marcaDagua,
  tela = 1,
  aoAjustar,
}: {
  projeto: Projeto;
  /** conta sem plano pago: "PORTFÓLIO CREATOR • TESTE" por cima; paga: só o selo no rodapé */
  marcaDagua: boolean;
  /** escala só de visualização (o PDF sai em tamanho real) */
  tela?: number;
  /** chamado quando a folha está diagramada, com as fontes carregadas */
  aoAjustar?: () => void;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const kit = useMemo(() => dadosDoKit(projeto, REGISTRO), [projeto]);
  // arranjos em ordem de preferência; se um só cabe apertando, tenta o próximo (e lembra para este kit). Sem vídeos,
  // tudo numa folha só (sem página 2 vazia); depois, cada parte na sua página; por fim, as marcas sobem para o pé da
  // página 1. O último é aceito mesmo apertado
  const arranjos = useMemo(
    () => [!kit.videos && 'juntas', 'separadas', kit.marcas && 'marcas-na-1'].filter(Boolean) as Arranjo[],
    [kit],
  );
  const [falhas, setFalhas] = useState<{ kit: typeof kit; n: number }>({ kit, n: 0 });
  const tentativa = falhas.kit === kit ? falhas.n : 0;
  const arranjo = arranjos[Math.min(tentativa, arranjos.length - 1)]!;
  const ultimo = tentativa >= arranjos.length - 1;

  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    let vivo = true;
    // `decidir`: só troca de arranjo com as fontes carregadas (com a fonte reserva as medidas enganam e o arranjo
    // errado ficaria guardado para este kit)
    const diagramar = (decidir: boolean) => {
      caberEmLinhas(el);
      const resultado = diagramarFolhas(el);
      crescerManchete(el);
      if (decidir && resultado < 1 && !ultimo) {
        setFalhas({ kit, n: tentativa + 1 });
        return false;
      }
      return true;
    };
    diagramar(false);
    // a serifa do kit só começa a baixar quando aparece na página: pede as duas faces e espera todas as fontes
    const fontes = document.fonts
      ? Promise.all([
          document.fonts.load("400 24px 'Instrument Serif'"),
          document.fonts.load("italic 400 24px 'Instrument Serif'"),
        ])
          .catch(() => undefined)
          .then(() => document.fonts.ready)
      : Promise.resolve();
    void fontes.then(() => {
      if (vivo && diagramar(true)) aoAjustar?.();
    });
    return () => {
      vivo = false;
    };
  }, [kit, tentativa, ultimo, aoAjustar]);

  const estilo = { ...temaDoProjeto(projeto), width: LARGURA, height: ALTURA };
  const paginas = arranjo === 'juntas' ? 1 : 2;
  return (
    <div
      className="mk-vista"
      style={{ width: LARGURA * tela, height: (ALTURA * paginas + ENTRE * (paginas - 1)) * tela }}
    >
      <div ref={raiz} className="mk-folhas" style={{ transform: `scale(${tela})`, gap: ENTRE }}>
        {arranjo === 'juntas' ? (
          <article className="mk-folha mk-pagina-1 mk-pagina-unica" style={estilo}>
            <PrimeiraParte kit={kit} />
            <SegundaParte kit={kit} />
            <Rodape kit={kit} pagina={1} total={1} marcaDagua={marcaDagua} />
          </article>
        ) : (
          <>
            <article className="mk-folha mk-pagina-1" style={estilo}>
              <PrimeiraParte kit={kit} comMarcas={arranjo === 'marcas-na-1'} />
              <Rodape kit={kit} pagina={1} total={2} marcaDagua={marcaDagua} />
            </article>
            <article className="mk-folha mk-pagina-2" style={estilo}>
              <SegundaParte kit={kit} semMarcas={arranjo === 'marcas-na-1'} />
              <Rodape kit={kit} pagina={2} total={2} marcaDagua={marcaDagua} />
            </article>
          </>
        )}
      </div>
    </div>
  );
}
