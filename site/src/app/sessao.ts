// Quem está logado agora, atualizado quando a sessão muda (entrar, sair, renovar).
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase, supabaseConfigurado } from './supabase';

/** `undefined` = ainda carregando; `null` = ninguém logado. */
export function useSessao(): Session | null | undefined {
  const [sessao, setSessao] = useState<Session | null | undefined>(supabaseConfigurado ? undefined : null);
  useEffect(() => {
    if (!supabaseConfigurado) return;
    void supabase.auth.getSession().then(({ data }) => setSessao(data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => setSessao(nova));
    return () => data.subscription.unsubscribe();
  }, []);
  return sessao;
}

export const sair = () => supabase.auth.signOut();
