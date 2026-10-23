// Montagem do projeto a partir das respostas do assistente (sem IA): as respostas entram nos blocos do modelo
// e o resto continua como exemplo (placeholder). O que a creator escreve nunca é trocado por exemplo.
import type { Projeto } from './projeto';

export interface Respostas {
  nome: string;
  arroba: string;
  cidade: string;
  nicho: string;
  /** "Já fez alguma publi?" — `false` liga o modo iniciante */
  jaFezPubli: boolean;
  /** o que ela grava, em poucas palavras (entra na frase da capa) */
  oQueGrava: string;
  /** frase opcional que a define (vira o subtítulo da capa) */
  frase?: string;
}

const MAXIMO_TITULO_CAPA = 90;

/** `joana.lima`, `@joana.lima` e ` Joana.Lima ` viram `@joana.lima`; vazio continua vazio. */
export function normalizarArroba(texto: string): string {
  const limpo = texto.trim().replace(/^@+/, '').replace(/\s+/g, '').toLowerCase();
  return limpo ? `@${limpo}` : '';
}

export function montarProjeto(base: Projeto, r: Respostas): Projeto {
  const nome = r.nome.trim();
  const grava = r.oQueGrava.trim();
  const composto = `Oi, eu sou ${nome} e mostro ${grava} do meu jeito`;
  const titulo = grava && composto.length <= MAXIMO_TITULO_CAPA ? composto : `Oi, eu sou ${nome}`;
  const arroba = [normalizarArroba(r.arroba), r.cidade.trim()].filter(Boolean).join(' · ');
  const nicho = r.nicho.trim();

  const blocos = base.blocos.map((b) => {
    if (b.tipo === 'capa') {
      return {
        ...b,
        dados: { ...b.dados, titulo, ...(arroba && { arroba }), ...(r.frase?.trim() && { subtitulo: r.frase.trim() }) },
      };
    }
    if (b.tipo === 'sobre' && nicho) return { ...b, dados: { ...b.dados, nichos: [nicho] } };
    return b;
  });
  return { ...base, modoIniciante: !r.jaFezPubli, blocos };
}
