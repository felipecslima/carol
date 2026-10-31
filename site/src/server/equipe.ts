// Quem da equipe está pedindo (DEV-300): o papel vem de app_metadata, que só o servidor grava. `assistente` só vê.
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from 'astro:env/client';

export type PapelDaEquipe = 'admin' | 'operacao' | 'assistente';
export interface MembroDaEquipe {
  id: string;
  email: string | undefined;
  papel: PapelDaEquipe;
}

export async function equipeDoPedido(request: Request): Promise<MembroDaEquipe | null> {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return null;
  const resposta = await fetch(`${PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) return null;
  const u = (await resposta.json()) as { id?: string; email?: string; app_metadata?: { papel?: string } };
  const papel = u.app_metadata?.papel;
  return u.id && (papel === 'admin' || papel === 'operacao' || papel === 'assistente')
    ? { id: u.id, email: u.email, papel }
    : null;
}
