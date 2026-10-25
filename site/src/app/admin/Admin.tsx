// Admin da equipe (DEV-300 a 303, 210, 211): Painel, Pedidos, Creators, No ar e Registro. Ler é direto no banco (as
// regras de linha só deixam a equipe ver tudo); alterar passa por /api/admin/acao, que confere o papel no servidor.
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { sair, useSessao } from '../sessao';
import { supabase } from '../supabase';
import { Marca } from '../Marca';
import '../editor/editor.css';
import '../refino.css';
import '../tema.css';
import './admin.css';

type Aba = 'painel' | 'pedidos' | 'creators' | 'no-ar' | 'registro';
const ABAS: Array<[Aba, string]> = [
  ['painel', 'Painel'],
  ['pedidos', 'Pedidos'],
  ['creators', 'Creators'],
  ['no-ar', 'No ar'],
  ['registro', 'Registro'],
];

interface Perfil {
  id: string;
  nome: string;
  arroba: string;
  whatsapp: string;
  cidade: string;
  criado_em: string;
}
interface Projeto {
  id: string;
  dono: string;
  status: string;
  slug: string | null;
  publicado_em: string | null;
  atualizado_em: string;
  criado_em: string;
}
interface Pedido {
  id: string;
  projeto_id: string;
  dono: string;
  plano: string;
  status: string;
  criado_em: string;
  pago_em: string | null;
}
interface Premium {
  id: string;
  creator: string;
  molde: string;
  motivo: string;
  validade: string | null;
}
interface Registro {
  id: number;
  acao: string;
  alvo: string | null;
  criado_em: string;
}
interface Dados {
  perfis: Perfil[];
  projetos: Projeto[];
  pedidos: Pedido[];
  premium: Premium[];
  registro: Registro[];
  aberturas: number;
}

const ESTADO: Record<string, string> = {
  rascunho: 'Rascunho',
  aguardando_pagamento: 'Aguardando pagamento',
  no_ar: 'No ar',
  edicao_travada: 'Edição travada',
  fora_do_ar: 'Fora do ar',
  pago: 'Pago',
  cancelado: 'Cancelado',
};
const ACAO: Record<string, string> = {
  pedido_pago: 'Pedido pago',
  pedido_cancelado: 'Pedido cancelado',
  tirar_do_ar: 'Tirou do ar',
  recolocar_no_ar: 'Recolocou no ar',
  premium_liberado: 'Premium liberado',
  premium_removido: 'Premium removido',
};
const MOLDE: Record<string, string> = { site: 'Site', 'midia-kit': 'Mídia kit', 'os-dois': 'Os dois' };
const data = (iso: string) =>
  new Date(iso)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    .replace('.', '');
const DIA = 24 * 60 * 60 * 1000;

async function carregar(): Promise<Dados | null> {
  const [perfis, projetos, pedidos, premium, registro, aberturas] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, nome, arroba, whatsapp, cidade, criado_em')
      .order('criado_em', { ascending: false }),
    supabase.from('projects').select('id, dono, status, slug, publicado_em, atualizado_em, criado_em'),
    supabase
      .from('orders')
      .select('id, projeto_id, dono, plano, status, criado_em, pago_em')
      .order('criado_em', { ascending: false }),
    supabase.from('premium_grants').select('id, creator, molde, motivo, validade'),
    supabase.from('audit_log').select('id, acao, alvo, criado_em').order('criado_em', { ascending: false }).limit(60),
    supabase.from('brand_opens').select('id', { count: 'exact', head: true }),
  ]);
  if (perfis.error || projetos.error || pedidos.error) return null;
  return {
    perfis: perfis.data,
    projetos: projetos.data,
    pedidos: pedidos.data,
    premium: premium.data ?? [],
    registro: registro.data ?? [],
    aberturas: aberturas.count ?? 0,
  };
}

async function agir(corpo: Record<string, string>): Promise<string | null> {
  const { data: s } = await supabase.auth.getSession();
  try {
    const r = await fetch('/api/admin/acao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.session?.access_token ?? ''}` },
      body: JSON.stringify(corpo),
    });
    if (r.ok) return null;
    return ((await r.json().catch(() => null)) as { erro?: string } | null)?.erro ?? 'Não deu para fazer isso agora.';
  } catch {
    return 'Sem conexão com o servidor. Confira a internet e tente de novo.';
  }
}

function papelDe(sessao: Session): string {
  return String((sessao.user.app_metadata as { papel?: string }).papel ?? '');
}

export default function Admin() {
  const sessao = useSessao();
  if (sessao === undefined)
    return (
      <p className="app-lead" role="status">
        Carregando…
      </p>
    );
  if (!sessao)
    return (
      <main className="app-shell">
        <p className="app-brand">
          Portfólio <i>Creator</i>
        </p>
        <h1 className="app-title">
          Área da <em>equipe.</em>
        </h1>
        <p className="app-lead">Entre com a sua conta da equipe para continuar.</p>
        <a className="app-cta" href="/app/entrar/">
          Entrar
        </a>
      </main>
    );
  if (!['admin', 'operacao', 'assistente'].includes(papelDe(sessao)))
    return (
      <main className="app-shell">
        <p className="app-brand">
          Portfólio <i>Creator</i>
        </p>
        <h1 className="app-title">
          Sem <em>permissão.</em>
        </h1>
        <p className="app-lead">Esta conta não é da equipe. Se deveria ser, peça para liberarem o seu acesso.</p>
        <a className="app-link" href="/app/">
          Voltar para a minha área
        </a>
      </main>
    );
  return <Painel sessao={sessao} />;
}

function Painel({ sessao }: { sessao: Session }) {
  const [aba, setAba] = useState<Aba>('painel');
  const [dados, setDados] = useState<Dados | null | undefined>(undefined);
  const [aviso, setAviso] = useState<{ texto: string; erro: boolean } | null>(null);
  const podeAgir = papelDe(sessao) !== 'assistente';

  const recarregar = useCallback(() => carregar().then(setDados), []);
  useEffect(() => {
    void carregar().then(setDados);
  }, []);

  const executar = async (corpo: Record<string, string>, ok: string) => {
    const erro = await agir(corpo);
    setAviso(erro ? { texto: erro, erro: true } : { texto: ok, erro: false });
    if (!erro) await recarregar();
  };

  const perfilDe = useMemo(() => new Map(dados?.perfis.map((p) => [p.id, p])), [dados]);
  const projetoDe = useMemo(() => new Map(dados?.projetos.map((p) => [p.id, p])), [dados]);

  return (
    <div className="ad">
      <header className="ad-topo">
        <Marca />
        <nav aria-label="Seções do admin" className="ad-abas">
          {ABAS.map(([id, nome]) => (
            <button key={id} type="button" aria-current={aba === id ? 'page' : undefined} onClick={() => setAba(id)}>
              {nome}
            </button>
          ))}
        </nav>
        <span className="ad-quem">
          {papelDe(sessao)} · {sessao.user.email}
        </span>
        <button
          type="button"
          className="ed-botao-claro"
          onClick={() => void sair().then(() => (window.location.href = '/app/entrar/'))}
        >
          Sair
        </button>
      </header>
      <main className="ad-corpo">
        {aviso && (
          <p className={aviso.erro ? 'ad-aviso ad-aviso--erro' : 'ad-aviso'} role={aviso.erro ? 'alert' : 'status'}>
            {aviso.texto}
            <button type="button" className="ed-link" onClick={() => setAviso(null)}>
              Fechar
            </button>
          </p>
        )}
        {dados === undefined && (
          <p className="ed-carregando" role="status">
            Carregando…
          </p>
        )}
        {dados === null && (
          <p className="ad-aviso ad-aviso--erro" role="alert">
            Não conseguimos carregar os dados. Atualize a página.
          </p>
        )}
        {dados && aba === 'painel' && <VisaoGeral d={dados} />}
        {dados && aba === 'pedidos' && (
          <Pedidos d={dados} perfilDe={perfilDe} projetoDe={projetoDe} podeAgir={podeAgir} executar={executar} />
        )}
        {dados && aba === 'creators' && <Creators d={dados} podeAgir={podeAgir} executar={executar} />}
        {dados && aba === 'no-ar' && <NoAr d={dados} perfilDe={perfilDe} podeAgir={podeAgir} executar={executar} />}
        {dados && aba === 'registro' && (
          <section>
            <h1>Registro de ações</h1>
            {dados.registro.length === 0 ? (
              <p className="ed-dica">Nada registrado ainda.</p>
            ) : (
              <ul className="ad-lista">
                {dados.registro.map((r) => (
                  <li key={r.id}>
                    <b>{ACAO[r.acao] ?? r.acao}</b>
                    <span>{r.alvo}</span>
                    <time>{data(r.criado_em)}</time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

type Executar = (corpo: Record<string, string>, ok: string) => Promise<void>;

function VisaoGeral({ d }: { d: Dados }) {
  const [agora] = useState(() => Date.now());
  const semana = (iso: string | null) => Boolean(iso) && agora - new Date(iso!).getTime() < 7 * DIA;
  const parados = d.pedidos.filter(
    (p) => p.status === 'aguardando_pagamento' && agora - new Date(p.criado_em).getTime() > 2 * DIA,
  );
  const noAr = d.projetos.filter((p) => p.status === 'no_ar' || p.status === 'edicao_travada');
  const numeros: Array<[string, number, string?]> = [
    ['Creators', d.perfis.length],
    ['Novas na semana', d.perfis.filter((p) => semana(p.criado_em)).length],
    ['Portfólios no ar', noAr.length],
    ['Publicados na semana', d.projetos.filter((p) => semana(p.publicado_em)).length],
    ['Pedidos aguardando', d.pedidos.filter((p) => p.status === 'aguardando_pagamento').length],
    ['Pedidos pagos', d.pedidos.filter((p) => p.status === 'pago').length],
    ['Aberturas por marcas', d.aberturas],
  ];
  return (
    <section>
      <h1>Painel</h1>
      <dl className="ad-numeros">
        {numeros.map(([rotulo, valor]) => (
          <div key={rotulo}>
            <dd>{valor}</dd>
            <dt>{rotulo}</dt>
          </div>
        ))}
      </dl>
      {parados.length > 0 ? (
        <p className="ad-aviso">
          {parados.length === 1 ? '1 pedido está parado' : `${parados.length} pedidos estão parados`} há mais de 2 dias
          sem pagamento. Veja em Pedidos.
        </p>
      ) : (
        <p className="ed-dica">Nenhum pedido parado há mais de 2 dias.</p>
      )}
      <p className="ed-dica">Vendas em reais aparecem quando os planos e preços forem definidos.</p>
    </section>
  );
}

function Pedidos({
  d,
  perfilDe,
  projetoDe,
  podeAgir,
  executar,
}: {
  d: Dados;
  perfilDe: Map<string, Perfil>;
  projetoDe: Map<string, Projeto>;
  podeAgir: boolean;
  executar: Executar;
}) {
  const [filtro, setFiltro] = useState<'aguardando_pagamento' | 'pago' | 'cancelado' | 'todos'>('aguardando_pagamento');
  const lista = d.pedidos.filter((p) => filtro === 'todos' || p.status === filtro);
  return (
    <section>
      <h1>Pedidos</h1>
      <div className="ad-filtros" role="group" aria-label="Filtrar pedidos">
        {(['aguardando_pagamento', 'pago', 'cancelado', 'todos'] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
            {f === 'todos' ? 'Todos' : ESTADO[f]}
          </button>
        ))}
      </div>
      {lista.length === 0 && <p className="ed-dica">Nenhum pedido aqui.</p>}
      <ul className="ad-cartoes">
        {lista.map((p) => {
          const creator = perfilDe.get(p.dono);
          const projeto = projetoDe.get(p.projeto_id);
          const wa = creator?.whatsapp.replace(/\D/g, '');
          return (
            <li key={p.id}>
              <div>
                <b>{creator?.nome || 'Sem nome'}</b>{' '}
                <span className={`ad-estado ad-estado--${p.status}`}>{ESTADO[p.status] ?? p.status}</span>
                <p className="ed-dica">
                  Plano {p.plano} · pedido em {data(p.criado_em)}
                  {p.pago_em ? ` · pago em ${data(p.pago_em)}` : ''} · link {projeto?.slug ? `/c/${projeto.slug}` : '—'}
                </p>
              </div>
              <div className="ad-acoes">
                {wa && (
                  <a className="ed-botao-claro" href={`https://wa.me/${wa}`} target="_blank" rel="noopener">
                    Chamar no WhatsApp
                  </a>
                )}
                {podeAgir && p.status === 'aguardando_pagamento' && projeto?.slug && (
                  <>
                    <button
                      type="button"
                      className="ed-primario"
                      onClick={() =>
                        void executar({ acao: 'pago', slug: projeto.slug! }, 'Pedido pago. O portfólio já está no ar.')
                      }
                    >
                      Marcar como pago
                    </button>
                    <button
                      type="button"
                      className="ed-link"
                      onClick={() => void executar({ acao: 'cancelar_pedido', pedido: p.id }, 'Pedido cancelado.')}
                    >
                      Cancelar pedido
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Creators({ d, podeAgir, executar }: { d: Dados; podeAgir: boolean; executar: Executar }) {
  const [busca, setBusca] = useState('');
  const [molde, setMolde] = useState('site');
  const lista = d.perfis.filter((p) =>
    `${p.nome} ${p.arroba} ${p.cidade}`.toLowerCase().includes(busca.trim().toLowerCase()),
  );
  return (
    <section>
      <h1>Creators</h1>
      <input
        className="ad-busca"
        type="search"
        value={busca}
        placeholder="Buscar por nome, @ ou cidade"
        aria-label="Buscar creator"
        onChange={(e) => setBusca(e.target.value)}
      />
      {lista.length === 0 && <p className="ed-dica">Ninguém encontrado.</p>}
      <ul className="ad-cartoes">
        {lista.map((p) => {
          const projeto = d.projetos.find((x) => x.dono === p.id);
          const premium = d.premium.filter((g) => g.creator === p.id);
          return (
            <li key={p.id}>
              <div>
                <b>{p.nome || 'Sem nome'}</b>{' '}
                {projeto && <span className={`ad-estado ad-estado--${projeto.status}`}>{ESTADO[projeto.status]}</span>}
                <p className="ed-dica">
                  {[p.arroba, p.cidade, p.whatsapp].filter(Boolean).join(' · ')} · entrou em {data(p.criado_em)}
                </p>
                {premium.map((g) => (
                  <p key={g.id} className="ad-premium">
                    Premium: {MOLDE[g.molde] ?? g.molde}
                    {g.motivo ? ` (${g.motivo})` : ''}
                    {podeAgir && (
                      <button
                        type="button"
                        className="ed-link"
                        onClick={() => void executar({ acao: 'premium_tirar', id: g.id }, 'Premium removido.')}
                      >
                        Tirar
                      </button>
                    )}
                  </p>
                ))}
              </div>
              {podeAgir && (
                <div className="ad-acoes">
                  <select aria-label="Molde do Premium" value={molde} onChange={(e) => setMolde(e.target.value)}>
                    {Object.entries(MOLDE).map(([id, nome]) => (
                      <option key={id} value={id}>
                        {nome}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="ed-botao-claro"
                    onClick={() =>
                      void executar(
                        { acao: 'premium_dar', creator: p.id, molde, motivo: 'Liberado pela equipe' },
                        'Premium liberado.',
                      )
                    }
                  >
                    Liberar Premium
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function NoAr({
  d,
  perfilDe,
  podeAgir,
  executar,
}: {
  d: Dados;
  perfilDe: Map<string, Perfil>;
  podeAgir: boolean;
  executar: Executar;
}) {
  const lista = d.projetos.filter((p) => p.slug && ['no_ar', 'edicao_travada', 'fora_do_ar'].includes(p.status));
  return (
    <section>
      <h1>Portfólios no ar</h1>
      {lista.length === 0 && <p className="ed-dica">Nenhum portfólio publicado ainda.</p>}
      <ul className="ad-cartoes">
        {lista.map((p) => (
          <li key={p.id}>
            <div>
              <b>/c/{p.slug}</b> <span className={`ad-estado ad-estado--${p.status}`}>{ESTADO[p.status]}</span>
              <p className="ed-dica">
                {perfilDe.get(p.dono)?.nome || 'Sem nome'}
                {p.publicado_em ? ` · publicado em ${data(p.publicado_em)}` : ''}
              </p>
            </div>
            <div className="ad-acoes">
              {p.status !== 'fora_do_ar' && (
                <a className="ed-botao-claro" href={`/c/${p.slug}/`} target="_blank" rel="noopener">
                  Abrir
                </a>
              )}
              {podeAgir && p.status === 'no_ar' && (
                <button
                  type="button"
                  className="ed-botao-claro"
                  onClick={() => void executar({ acao: 'tirar_do_ar', slug: p.slug! }, 'Portfólio fora do ar.')}
                >
                  Tirar do ar
                </button>
              )}
              {podeAgir && p.status === 'fora_do_ar' && (
                <button
                  type="button"
                  className="ed-primario"
                  onClick={() => void executar({ acao: 'recolocar_no_ar', slug: p.slug! }, 'Portfólio de volta ao ar.')}
                >
                  Recolocar no ar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
