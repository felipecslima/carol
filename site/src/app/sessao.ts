// Quem está logado agora, atualizado quando a sessão muda (entrar, sair, renovar).
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { esquecerRascunhoAoSair } from './editor/persistencia';
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

/** Sai da conta e tira do aparelho o rascunho já guardado na conta (aparelho compartilhado, DEV-034). */
export const sair = async () => {
  await supabase.auth.signOut();
  esquecerRascunhoAoSair();
};

/** Papel da equipe (`admin`, `operacao`, `assistente`) gravado no servidor em app_metadata; vazio para creators. */
export const papelDaEquipe = (sessao: Session): string => {
  const papel = String((sessao.user.app_metadata as { papel?: string }).papel ?? '');
  return ['admin', 'operacao', 'assistente'].includes(papel) ? papel : '';
};
