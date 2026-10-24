// Quem está pedindo (DEV-034, no servidor): confere o token da sessão no Supabase Auth. Rotas de API que mexem em
// arquivos ou dados usam isto; nunca confiam em id vindo do corpo do pedido.
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from 'astro:env/client';

export interface UsuarioLogado {
  id: string;
  email: string | undefined;
}

export async function usuarioDoPedido(request: Request): Promise<UsuarioLogado | null> {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return null;
  const resposta = await fetch(`${PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) return null;
  const usuario = (await resposta.json()) as { id?: string; email?: string };
  return usuario.id ? { id: usuario.id, email: usuario.email } : null;
}
