// Rascunho no aparelho (localStorage): a creator começa sem conta e o rascunho migra para a conta ao entrar
// (DEV-033). Enquanto não há servidor (E2), é aqui que o editor salva.
import { projetoSchema, type Projeto } from '@lib/projeto';

const CHAVE = 'pc:rascunho:v1';
// DEV-034: de quem é o rascunho (id da conta; ausente = feito sem conta). Num aparelho compartilhado, o rascunho de
// uma conta não aparece para quem está sem conta nem vai para a conta de outra pessoa.
const DONO = 'pc:rascunho:dono';

/**
 * `quem`: id da conta que está abrindo (`null` = sem conta). Rascunho de outra conta volta `null`. Sem `quem`, não
 * confere (mídia kit, que abre a partir do editor).
 */
export function carregarRascunho(quem?: string | null): Projeto | null {
  try {
    const dono = localStorage.getItem(DONO);
    if (quem !== undefined && dono && dono !== quem) return null;
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const lido = projetoSchema.safeParse(JSON.parse(bruto));
    return lido.success ? lido.data : null;
  } catch {
    return null;
  }
}

/** `dono`: id da conta (`null` sem conta). Devolve `false` se o aparelho recusou gravar (sem espaço, modo privado). */
export function salvarRascunho(projeto: Projeto, dono: string | null): boolean {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(projeto));
    if (dono) localStorage.setItem(DONO, dono);
    else localStorage.removeItem(DONO);
    return true;
  } catch {
    return false;
  }
}

export function apagarRascunho() {
  try {
    localStorage.removeItem(CHAVE);
    localStorage.removeItem(DONO);
    localStorage.removeItem(PENDENTE);
  } catch {
    /* sem armazenamento: nada a apagar */
  }
}

// DEV-082: o rascunho do aparelho tem mudança que ainda não chegou à conta (sem conexão, servidor fora). Enquanto
// houver pendência, ao abrir o editor o aparelho vale mais que a conta; sem isso, a versão da conta apagava a edição.
// Guarda o id da conta: a pendência de uma conta não vale para outra (DEV-034).
const PENDENTE = 'pc:rascunho:pendente';

export function marcarPendente(dono: string) {
  try {
    localStorage.setItem(PENDENTE, dono);
  } catch {
    /* sem armazenamento: o rascunho também não foi gravado; o editor já avisa */
  }
}

export function temPendente(dono: string): boolean {
  try {
    return localStorage.getItem(PENDENTE) === dono;
  } catch {
    return false;
  }
}

export function limparPendente() {
  try {
    localStorage.removeItem(PENDENTE);
  } catch {
    /* sem armazenamento: nada a limpar */
  }
}

/** Ao sair da conta: o rascunho sai do aparelho, menos quando ainda não chegou à conta (fica, só para a mesma conta). */
export function esquecerRascunhoAoSair() {
  try {
    if (!localStorage.getItem(PENDENTE)) apagarRascunho();
  } catch {
    /* sem armazenamento: nada a apagar */
  }
}
