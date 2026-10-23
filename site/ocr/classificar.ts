import { PONTOS_MINIMOS, TELAS, TRIPLA_PERFIL } from './dicionario';
import { acharRotulos, type Rotulo } from './rotulo';
import type { Idioma, OcrResultado, Tela } from './tipos';

export interface Classificacao {
  tela: Tela | 'desconhecida';
  idioma: Idioma | 'desconhecido';
  pontos: Record<string, number>;
}

const IDIOMAS: Idioma[] = ['pt', 'en'];

/**
 * Pontua cada tela pelas palavras-chave achadas (com peso). Vence a de mais pontos, desde que
 * tenha o mínimo e passe a segunda; senão `desconhecida`. A aba Reels não tem palavra-chave:
 * é decidida depois, pela grade (ler-print.ts). O idioma é o que teve mais rótulos achados;
 * espanhol e outros caem em `desconhecido`.
 */
export function classificar(ocr: OcrResultado): Classificacao {
  const catalogo: Rotulo[] = [];
  for (const [tela, def] of Object.entries(TELAS)) {
    for (const grupo of def.palavras) {
      for (const idioma of IDIOMAS) {
        for (const texto of grupo.rotulos[idioma]) catalogo.push({ id: `${tela}|${idioma}|${grupo.peso}`, texto });
      }
    }
  }
  for (const [nome, rotulos] of Object.entries(TRIPLA_PERFIL)) {
    for (const idioma of IDIOMAS) {
      for (const texto of rotulos[idioma]) catalogo.push({ id: `tripla|${idioma}|${nome}`, texto });
    }
  }

  const pontos: Record<string, number> = Object.fromEntries(Object.keys(TELAS).map((t) => [t, 0]));
  const porIdioma: Record<Idioma, number> = { pt: 0, en: 0 };
  const triplaPorLinha = new Map<number, Set<string>>();

  for (const o of acharRotulos(ocr.linhas, catalogo)) {
    for (const id of o.ids) {
      const [tela, idioma, extra] = id.split('|');
      porIdioma[idioma as Idioma] += 1;
      if (tela === 'tripla') {
        const s = triplaPorLinha.get(o.linha) ?? new Set();
        s.add(extra);
        triplaPorLinha.set(o.linha, s);
      } else {
        pontos[tela] += Number(extra);
      }
    }
  }
  // "posts · seguidores · seguindo" na mesma linha: só o perfil tem isso
  if ([...triplaPorLinha.values()].some((s) => s.size >= 2)) pontos.perfil += 3;

  const idioma: Classificacao['idioma'] =
    porIdioma.pt === porIdioma.en ? 'desconhecido' : porIdioma.pt > porIdioma.en ? 'pt' : 'en';

  const [melhor, segundo] = Object.entries(pontos).sort((a, b) => b[1] - a[1]);
  if (melhor[1] >= PONTOS_MINIMOS && melhor[1] > (segundo?.[1] ?? 0)) {
    return { tela: melhor[0] as Tela, idioma, pontos };
  }
  return { tela: 'desconhecida', idioma, pontos };
}
