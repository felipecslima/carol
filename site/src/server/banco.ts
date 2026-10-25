// Acesso ao banco com a chave de serviço (só no servidor, passa por cima das regras de linha). Usado só pelas rotas
// de publicação e de pedidos, que conferem sozinhas quem está pedindo. Nunca chamar com id vindo do corpo do pedido.
import { PUBLIC_SUPABASE_URL } from 'astro:env/client';
import { SUPABASE_SERVICE_ROLE_KEY } from 'astro:env/server';

export const bancoConfigurado = () => Boolean(PUBLIC_SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

interface Opcoes {
  metodo?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  corpo?: unknown;
  /** devolve a linha gravada */
  retornar?: boolean;
}

/** `{ ok, dados }`: `dados` é a lista de linhas do PostgREST (vazia quando não há nada). */
export async function consulta<T = Record<string, unknown>>(
  caminho: string,
  { metodo = 'GET', corpo, retornar }: Opcoes = {},
): Promise<{ ok: boolean; dados: T[] }> {
  if (!bancoConfigurado()) return { ok: false, dados: [] };
  const resposta = await fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/${caminho}`, {
    method: metodo,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: retornar ? 'return=representation' : 'return=minimal',
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (!resposta.ok) return { ok: false, dados: [] };
  const texto = await resposta.text();
  return { ok: true, dados: texto ? (JSON.parse(texto) as T[]) : [] };
}
