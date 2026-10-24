// Área da creator (DEV-040): barra fixa de 4 abas (Início, Projetos, Mídias, Conta), áreas de toque de 44 px e safe
// areas do celular. O editor abre em tela cheia por cima, e o voltar leva de volta a Projetos.
import { Marca } from '../Marca';
import { useCallback, useEffect, useState, type ReactElement } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Casa, Imagem, Pasta, Pessoa } from '../editor/icones';
import { PainelMidias } from '../editor/PainelMidias';
import { carregarPerfil, carregarResumo, cancelarExclusao, type Perfil, type Resumo } from '../nuvem';
import { Conta } from './Conta';
import { Inicio } from './Inicio';
import { Projetos } from './Projetos';
import '../editor/editor.css';
import './area.css';
import '../refino.css';
import '../tema.css';

type Aba = 'inicio' | 'projetos' | 'midias' | 'conta';
const ABAS: Array<[Aba, string, () => ReactElement]> = [
  ['inicio', 'Início', Casa],
  ['projetos', 'Projetos', Pasta],
  ['midias', 'Mídias', Imagem],
  ['conta', 'Conta', Pessoa],
];

const abaDaUrl = (): Aba => ABAS.find(([id]) => `#${id}` === window.location.hash)?.[0] ?? 'inicio';

export default function Area({ sessao }: { sessao: Session }) {
  const [aba, setAba] = useState<Aba>(abaDaUrl);
  const [resumo, setResumo] = useState<Resumo | null | undefined>(undefined);
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const aplicar = useCallback(([r, p]: [Resumo | null, Perfil | null]) => {
    setResumo(r);
    setPerfil(p);
  }, []);
  const carregar = useCallback(() => Promise.all([carregarResumo(), carregarPerfil()]).then(aplicar), [aplicar]);

  useEffect(() => {
    let vivo = true;
    void Promise.all([carregarResumo(), carregarPerfil()]).then((dados) => vivo && aplicar(dados));
    const aoMudarHash = () => setAba(abaDaUrl());
    window.addEventListener('hashchange', aoMudarHash);
    return () => {
      vivo = false;
      window.removeEventListener('hashchange', aoMudarHash);
    };
  }, [aplicar]);

  const ir = (nova: Aba) => {
    window.history.replaceState(null, '', `#${nova}`);
    setAba(nova);
    window.scrollTo({ top: 0 });
  };
  const nome = (perfil?.nome || '').split(' ')[0] ?? '';

  return (
    <div className="ar">
      <header className="ar-topo">
        <Marca />
      </header>

      {perfil?.exclusaoPedidaEm && (
        <div className="ar-faixa" role="status">
          Sua conta será apagada 7 dias depois de {new Date(perfil.exclusaoPedidaEm).toLocaleDateString('pt-BR')}.{' '}
          <button type="button" className="ed-link" onClick={() => void cancelarExclusao().then(carregar)}>
            Cancelar a exclusão
          </button>
        </div>
      )}

      <main className="ar-corpo">
        {resumo === undefined || !perfil ? (
          <p className="ed-carregando" role="status">
            Carregando…
          </p>
        ) : (
          <>
            {aba === 'inicio' && <Inicio resumo={resumo} nome={nome} />}
            {aba === 'projetos' && <Projetos resumo={resumo} aoMudar={() => void carregar()} />}
            {aba === 'midias' && (
              <section className="ar-secao">
                <h1 className="ar-titulo">Mídias</h1>
                <PainelMidias dica={false} />
              </section>
            )}
            {aba === 'conta' && (
              <Conta
                usuarioId={sessao.user.id}
                email={sessao.user.email ?? ''}
                perfil={perfil}
                aoMudar={() => void carregar()}
              />
            )}
          </>
        )}
      </main>

      <nav className="ar-abas" aria-label="Área da creator">
        {ABAS.map(([id, rotulo, Icone]) => (
          <button key={id} type="button" aria-current={aba === id ? 'page' : undefined} onClick={() => ir(id)}>
            <Icone /> {rotulo}
          </button>
        ))}
      </nav>
    </div>
  );
}
