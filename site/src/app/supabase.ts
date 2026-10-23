// Cliente do Supabase no navegador: só a chave publishable (pública). A sessão fica no aparelho e se renova sozinha
// (DEV-032): a creator não precisa entrar de novo a cada visita. A secret key nunca passa por aqui.
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from 'astro:env/client';
import type { Database } from '@lib/banco.tipos';

export const supabaseConfigurado = Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient<Database>(
  PUBLIC_SUPABASE_URL ?? 'http://localhost:0',
  PUBLIC_SUPABASE_ANON_KEY ?? 'sem-chave',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: 'implicit' } },
);
