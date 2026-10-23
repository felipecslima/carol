// Projeto da creator na nuvem (tabela `projects`, uma linha por tipo). Só o conteúdo: estado, link e versão publicada
// são do servidor. Chamado quando há sessão; sem sessão o editor salva só no aparelho (persistencia.ts).
import type { Json } from '@lib/banco.tipos';
import { projetoSchema, type Projeto } from '@lib/projeto';
import { supabase } from './supabase';

export async function carregarDaNuvem(): Promise<Projeto | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('tipo', 'site').maybeSingle();
  if (error || !data) return null;
  const lido = projetoSchema.safeParse({
    tipo: data.tipo,
    modelo: data.modelo,
    paleta: data.paleta,
    corPropria: data.cor_propria ?? undefined,
    fontes: data.fontes,
    cantos: data.cantos,
    clima: data.clima,
    modoIniciante: data.modo_iniciante,
    link: data.link_desejado ?? undefined,
    numeros: data.numeros ?? undefined,
    blocos: data.blocos,
    guardados: data.guardados,
  });
  return lido.success ? lido.data : null;
}

/** Grava (cria ou atualiza) o projeto do usuário logado. `true` se deu certo. */
export async function salvarNaNuvem(donoId: string, projeto: Projeto): Promise<boolean> {
  const { error } = await supabase.from('projects').upsert(
    {
      dono: donoId,
      tipo: projeto.tipo,
      modelo: projeto.modelo,
      paleta: projeto.paleta,
      cor_propria: projeto.corPropria ?? null,
      fontes: projeto.fontes,
      cantos: projeto.cantos,
      clima: projeto.clima,
      modo_iniciante: projeto.modoIniciante,
      link_desejado: projeto.link || null,
      numeros: (projeto.numeros ?? null) as Json | null,
      blocos: projeto.blocos as unknown as Json,
      guardados: projeto.guardados as unknown as Json,
    },
    { onConflict: 'dono,tipo' },
  );
  return !error;
}
