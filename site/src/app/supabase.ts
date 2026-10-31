// Cliente do Supabase no navegador: só a chave publishable (pública). A sessão fica no aparelho e se renova sozinha
// (DEV-032): a creator não precisa entrar de novo a cada visita. A secret key nunca passa por aqui.
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from 'astro:env/client';
import type { Database } from '@lib/banco.tipos';

export const supabaseConfigurado = Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient<Database>(
  PUBLIC_SUPABASE_URL ?? 'http://localhost:0',
  PUBLIC_SUPABASE_ANON_KEY ?? 'sem-chave',
  // PKCE: a volta do Google traz `?code=` e só a tela de entrar troca pela sessão (DEV-031). O código por e-mail
  // (verifyOtp) entra direto; o pedido do código também grava um verificador, por isso a tela de entrar guarda o fluxo
  // da ida ao Google e o passa na troca.
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: 'pkce' } },
);

/** O Google está ligado no Supabase? Enquanto não estiver, o botão não aparece (o clique daria erro em inglês). */
export async function googleLigado(): Promise<boolean> {
  if (!supabaseConfigurado) return false;
  try {
    const r = await fetch(`${PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: PUBLIC_SUPABASE_ANON_KEY! },
    });
    const config = (await r.json()) as { external?: { google?: boolean } };
    return Boolean(config.external?.google);
  } catch {
    return false;
  }
}
