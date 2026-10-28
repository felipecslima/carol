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

/** Apaga um usuário do Auth (DEV-203). O cascade do banco leva o perfil e o que é dele. `true` se apagou ou não existia. */
export async function apagarUsuarioDoAuth(id: string): Promise<boolean> {
  if (!bancoConfigurado() || !/^[0-9a-f-]{36}$/.test(id)) return false;
  const resposta = await fetch(`${PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${id}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  });
  return resposta.ok || resposta.status === 404;
}

/** Grava (ou substitui) um arquivo no Supabase Storage com a chave de serviço (DEV-151). */
export async function guardarArquivo(
  balde: string,
  caminho: string,
  corpo: ArrayBuffer,
  tipo: string,
): Promise<boolean> {
  if (!bancoConfigurado()) return false;
  const resposta = await fetch(`${PUBLIC_SUPABASE_URL}/storage/v1/object/${balde}/${caminho}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': tipo,
      'x-upsert': 'true',
    },
    body: corpo,
  });
  return resposta.ok;
}

/** Link temporário para baixar um arquivo privado do Storage; `null` se o arquivo não existe. */
export async function linkAssinado(balde: string, caminho: string, segundos: number): Promise<string | null> {
  if (!bancoConfigurado()) return null;
  const resposta = await fetch(`${PUBLIC_SUPABASE_URL}/storage/v1/object/sign/${balde}/${caminho}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn: segundos }),
  });
  if (!resposta.ok) return null;
  const { signedURL } = (await resposta.json()) as { signedURL?: string };
  return signedURL ? `${PUBLIC_SUPABASE_URL}/storage/v1${signedURL}` : null;
}
