// Rascunho no aparelho (localStorage): a creator começa sem conta e o rascunho migra para a conta ao entrar
// (DEV-033). Enquanto não há servidor (E2), é aqui que o editor salva.
import { projetoSchema, type Projeto } from '@lib/projeto';

const CHAVE = 'pc:rascunho:v1';

export function carregarRascunho(): Projeto | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const lido = projetoSchema.safeParse(JSON.parse(bruto));
    return lido.success ? lido.data : null;
  } catch {
    return null;
  }
}

/** Devolve `false` se o aparelho recusou gravar (sem espaço, modo privado). */
export function salvarRascunho(projeto: Projeto): boolean {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(projeto));
    return true;
  } catch {
    return false;
  }
}

export function apagarRascunho() {
  try {
    localStorage.removeItem(CHAVE);
    localStorage.removeItem(PENDENTE);
  } catch {
    /* sem armazenamento: nada a apagar */
  }
}

// DEV-082: o rascunho do aparelho tem mudança que ainda não chegou à conta (sem conexão, servidor fora). Enquanto
// houver pendência, ao abrir o editor o aparelho vale mais que a conta; sem isso, a versão da conta apagava a edição.
const PENDENTE = 'pc:rascunho:pendente';

export function marcarPendente() {
  try {
    localStorage.setItem(PENDENTE, '1');
  } catch {
    /* sem armazenamento: o rascunho também não foi gravado; o editor já avisa */
  }
}

export function temPendente(): boolean {
  try {
    return localStorage.getItem(PENDENTE) === '1';
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
