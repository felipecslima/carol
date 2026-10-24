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

// ---- Mídias (tabela `media`; os arquivos ficam no Cloudinary, na pasta da creator) ----

export interface Midia {
  id: string;
  tipo: 'image' | 'video';
  publicId: string;
  url: string;
  capa: string;
  nome: string;
  bytes: number;
  criadoEm: string;
}

export async function listarMidias(): Promise<Midia[]> {
  const { data, error } = await supabase.from('media').select('*').order('criado_em', { ascending: false });
  if (error || !data) return [];
  return data.map((m) => ({
    id: m.id,
    tipo: m.tipo as Midia['tipo'],
    publicId: m.public_id,
    url: m.url,
    capa: m.capa,
    nome: m.nome,
    bytes: m.bytes,
    criadoEm: m.criado_em,
  }));
}

export async function registrarMidia(donoId: string, m: Omit<Midia, 'id' | 'criadoEm'>): Promise<boolean> {
  // 2 tentativas: o arquivo já subiu, perder o registro é perder a mídia da biblioteca
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    const { error } = await supabase
      .from('media')
      .upsert(
        { dono: donoId, tipo: m.tipo, public_id: m.publicId, url: m.url, capa: m.capa, nome: m.nome, bytes: m.bytes },
        { onConflict: 'dono,public_id', ignoreDuplicates: true },
      );
    if (!error) return true;
  }
  return false;
}

/** Apaga o arquivo no Cloudinary e depois o registro. `false` se o arquivo não saiu (o registro fica, para tentar de novo). */
export async function removerMidia(m: Midia): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return false;
  const resposta = await fetch('/api/upload/apagar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ publicId: m.publicId, tipo: m.tipo }),
  });
  if (!resposta.ok) return false;
  const { error } = await supabase.from('media').delete().eq('id', m.id);
  return !error;
}

// ---- Área da creator: resumo do projeto, perfil, direitos (LGPD) ----

export interface Resumo {
  id: string;
  projeto: Projeto;
  estado: string;
  atualizadoEm: string;
}

export async function carregarResumo(): Promise<Resumo | null> {
  const { data } = await supabase.from('projects').select('id, status, atualizado_em').eq('tipo', 'site').maybeSingle();
  const projeto = await carregarDaNuvem();
  return data && projeto ? { id: data.id, projeto, estado: data.status, atualizadoEm: data.atualizado_em } : null;
}

export interface Perfil {
  nome: string;
  arroba: string;
  whatsapp: string;
  cidade: string;
  nicho: string;
  modoIniciante: boolean;
  exclusaoPedidaEm: string | null;
}

export async function carregarPerfil(): Promise<Perfil | null> {
  const { data } = await supabase.from('profiles').select('*').maybeSingle();
  return data
    ? {
        nome: data.nome,
        arroba: data.arroba,
        whatsapp: data.whatsapp,
        cidade: data.cidade,
        nicho: data.nicho,
        modoIniciante: data.modo_iniciante,
        exclusaoPedidaEm: data.exclusao_pedida_em,
      }
    : null;
}

export async function salvarPerfil(id: string, p: Omit<Perfil, 'exclusaoPedidaEm'>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({
      nome: p.nome,
      arroba: p.arroba,
      whatsapp: p.whatsapp,
      cidade: p.cidade,
      nicho: p.nicho,
      modo_iniciante: p.modoIniciante,
    })
    .eq('id', id);
  return !error;
}

export async function apagarProjeto(id: string): Promise<boolean> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  return !error;
}

export async function pedirExclusao(): Promise<boolean> {
  const { error } = await supabase.rpc('pedir_exclusao_da_conta');
  return !error;
}

export async function cancelarExclusao(): Promise<boolean> {
  const { error } = await supabase.rpc('cancelar_exclusao_da_conta');
  return !error;
}

/** Tudo o que a creator escreveu e enviou, para ela baixar (direito da LGPD). Não inclui produtos da plataforma. */
export async function reunirDados() {
  const [perfil, projetos, midias, pedidos] = await Promise.all([
    supabase.from('profiles').select('*'),
    supabase.from('projects').select('*'),
    supabase.from('media').select('*'),
    supabase.from('orders').select('*'),
  ]);
  const { data } = await supabase.auth.getUser();
  return {
    geradoEm: new Date().toISOString(),
    conta: { email: data.user?.email, criadaEm: data.user?.created_at },
    perfil: perfil.data ?? [],
    projetos: projetos.data ?? [],
    midias: midias.data ?? [],
    pedidos: pedidos.data ?? [],
  };
}
