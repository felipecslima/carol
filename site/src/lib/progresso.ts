// "7 de 12 itens já são seus": quanto do portfólio a creator já trocou do exemplo. Compara com o projeto de
// exemplo do modelo (a referência): campo de texto igual ao exemplo, ou item de lista ainda marcado `exemplo`,
// ainda não é dela. Item novo e preenchido conta como dela.
import type { Registro } from './bloco';
import type { Projeto } from './projeto';

const ESCALARES = new Set(['titulo', 'texto', 'botao', 'etiqueta', 'numero']);

export interface Progresso {
  seus: number;
  total: number;
}

const vazio = (v: unknown) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

export function progresso(projeto: Projeto, referencia: Projeto, registro: Registro): Progresso {
  let seus = 0;
  let total = 0;
  for (const bloco of projeto.blocos) {
    const definicao = registro[bloco.tipo];
    const exemplo = referencia.blocos.find((b) => b.tipo === bloco.tipo);
    if (!definicao || !exemplo) continue;
    for (const campo of definicao.campos) {
      if (ESCALARES.has(campo.tipo) && !vazio(exemplo.dados[campo.id])) {
        total += 1;
        if (!vazio(bloco.dados[campo.id]) && bloco.dados[campo.id] !== exemplo.dados[campo.id]) seus += 1;
      } else if (campo.tipo === 'lista' && campo.itens) {
        const itens = (bloco.dados[campo.id] as Array<Record<string, unknown>> | undefined) ?? [];
        const quantosNoExemplo = ((exemplo.dados[campo.id] as unknown[] | undefined) ?? []).length;
        const preenchidos = itens.filter(
          (i) => i.exemplo !== true && Object.entries(i).some(([k, v]) => k !== 'exemplo' && !vazio(v)),
        ).length;
        total += Math.max(quantosNoExemplo, itens.length);
        seus += preenchidos;
      }
    }
  }
  return { seus, total };
}
