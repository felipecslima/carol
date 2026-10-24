// Editor do Portfólio Creator (mobile primeiro): a creator edita em cima do resultado final. Primeiro toque
// seleciona o bloco, segundo abre a edição; controles embaixo, onde o polegar alcança; um nível de gaveta só.
import { Marca } from '../Marca';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { Bloco } from '@blocks/Bloco';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis, type Projeto } from '@lib/projeto';
import { temaDoProjeto } from './tema';
import { CamposDoBloco } from './CamposDoBloco';
import { criarEditor } from './estado';
import { progresso } from '@lib/progresso';
import { aplicarNumeros } from '@lib/numeros';
import { podePublicar, revisar } from '@lib/revisao';
import { PainelMidias } from './PainelMidias';
import { PainelRevisao } from './PainelRevisao';
import { Gaveta } from './Gaveta';
import { PainelNumeros } from './PainelNumeros';
import {
  Foguete,
  Imagem,
  Camadas,
  Desfazer,
  Esconder,
  Lapis,
  Olho,
  Mais,
  Paleta,
  Refazer,
  Subir,
  Descer,
} from './icones';
import { PainelAdicionar, PainelEstilo, PainelSecoes } from './Paineis';
import { carregarRascunho, salvarRascunho } from './persistencia';
import { carregarDaNuvem, salvarNaNuvem } from '../nuvem';
import { useSessao } from '../sessao';
import { supabaseConfigurado } from '../supabase';
import './editor.css';
import '../refino.css';

type Painel = 'editar' | 'secoes' | 'adicionar' | 'estilo' | 'numeros' | 'revisao' | 'midias' | null;

function EditorInterno({ inicial, donoId }: { inicial: Projeto; donoId: string | null }) {
  const editor = useMemo(() => criarEditor(inicial, REGISTRO), [inicial]);
  const e = useStore(editor);
  const { projeto, selecionado } = e;
  const passados = useStore(editor.temporal, (s) => s.pastStates.length);
  const futuros = useStore(editor.temporal, (s) => s.futureStates.length);
  const [painel, setPainel] = useState<Painel>(null);
  const [situacao, setSituacao] = useState<'salvo' | 'salvando' | 'erro' | 'offline'>('salvo');
  // /app/editor/?ver=1 abre direto no modo Ver (o botão "Ver como a marca vê" da área)
  const [ver, setVer] = useState(() => new URLSearchParams(window.location.search).get('ver') === '1');
  const [aviso, setAviso] = useState<string | null>(null);
  const primeiraVez = useRef(true);

  // salvar sozinho: espera a creator parar de mexer (600 ms) e grava no aparelho
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    setSituacao('salvando');
    const espera = setTimeout(() => {
      void (async () => {
        const noAparelho = salvarRascunho(projeto);
        const naNuvem = donoId ? await salvarNaNuvem(donoId, projeto) : true;
        setSituacao(!naNuvem ? 'offline' : !noAparelho && !donoId ? 'erro' : 'salvo');
      })();
    }, 600);
    return () => clearTimeout(espera);
  }, [projeto, donoId]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 6000);
    return () => clearTimeout(t);
  }, [aviso]);

  // com a gaveta aberta, leva o bloco em edição para o alto da área visível, acima da gaveta
  useEffect(() => {
    if (painel === 'editar' && selecionado) {
      document.querySelector(`[data-bloco="${selecionado}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [painel, selecionado]);

  const { seus, total } = useMemo(() => progresso(projeto, PROJETO_DE_EXEMPLO, REGISTRO), [projeto]);
  const alertas = useMemo(() => revisar(projeto, PROJETO_DE_EXEMPLO, REGISTRO), [projeto]);
  const vermelhos = alertas.filter((x) => x.gravidade === 'vermelho').length;
  const bloco = projeto.blocos.find((b) => b.id === selecionado);
  const definicao = bloco && REGISTRO[bloco.tipo];
  const indice = bloco ? projeto.blocos.indexOf(bloco) : -1;
  const visiveis = blocosVisiveis(projeto, REGISTRO);
  // esconder avisa e oferece desfazer: a seção não some sem rastro
  const esconder = (id: string) => {
    e.esconder(id);
    setAviso('Seção escondida. Ela fica guardada em Seções.');
  };
  const desfazer = () => editor.temporal.getState().undo();
  const refazer = () => editor.temporal.getState().redo();

  // modo Ver: a página como a marca vai ver, sem nenhuma interface do editor
  if (ver) {
    return (
      <div className="pagina ed-ver" style={temaDoProjeto(projeto)}>
        {visiveis.map((b) => (
          <Bloco key={b.id} bloco={b} modo="publicado" />
        ))}
        <button type="button" className="ed-sair-ver" onClick={() => setVer(false)}>
          Voltar a editar
        </button>
      </div>
    );
  }

  return (
    <div className={`ed${painel ? ' ed--gaveta' : ''}`}>
      <header className="ed-topo">
        <Marca />
        <div className="ed-topo-acoes">
          <button
            type="button"
            className="ed-icone"
            onClick={() => (e.selecionar(null), setPainel(null), setVer(true))}
            aria-label="Ver como a marca vê"
          >
            <Olho />
          </button>
          <button type="button" className="ed-icone" onClick={desfazer} disabled={passados === 0} aria-label="Desfazer">
            <Desfazer />
          </button>
          <button type="button" className="ed-icone" onClick={refazer} disabled={futuros === 0} aria-label="Refazer">
            <Refazer />
          </button>
          <span className={`ed-salvo ed-salvo--${situacao}`} role="status">
            {situacao === 'salvo'
              ? donoId
                ? 'Salvo ✓'
                : 'Salvo no aparelho'
              : situacao === 'salvando'
                ? 'Salvando…'
                : situacao === 'offline'
                  ? 'Sem conexão: salvo no aparelho'
                  : 'Não salvou: sem espaço no aparelho'}
          </span>
          {!donoId && supabaseConfigurado && (
            <a className="ed-entrar" href="/app/entrar/">
              Entrar
            </a>
          )}
        </div>
      </header>

      {seus < total && (
        <div className="ed-progresso" role="status">
          <span>
            {seus} de {total} itens já são seus
          </span>
          <span className="ed-progresso-barra" aria-hidden="true">
            <span style={{ width: `${total ? (seus / total) * 100 : 0}%` }} />
          </span>
        </div>
      )}

      <main
        className="ed-tela pagina"
        style={temaDoProjeto(projeto)}
        onClick={(ev) => ev.target === ev.currentTarget && e.selecionar(null)}
      >
        {visiveis.map((b) => (
          <div
            key={b.id}
            className="ed-bloco"
            data-bloco={b.id}
            data-selecionado={b.id === selecionado || undefined}
            role="button"
            tabIndex={0}
            aria-pressed={b.id === selecionado}
            aria-label={`${REGISTRO[b.tipo]?.nome ?? b.tipo}: ${b.id === selecionado ? 'tocar para editar' : 'tocar para selecionar'}`}
            onClick={() => (b.id === selecionado ? setPainel('editar') : e.selecionar(b.id))}
            onKeyDown={(ev) =>
              (ev.key === 'Enter' || ev.key === ' ') &&
              (ev.preventDefault(), b.id === selecionado ? setPainel('editar') : e.selecionar(b.id))
            }
          >
            <div className="ed-bloco-conteudo" inert>
              <Bloco bloco={b} modo="editor" />
            </div>
          </div>
        ))}
      </main>

      {aviso && (
        <div className="ed-toast" role="status">
          {aviso}
          <button type="button" onClick={() => (desfazer(), setAviso(null))}>
            Desfazer
          </button>
        </div>
      )}

      {bloco && !painel && (
        <div className="ed-flutuante" role="toolbar" aria-label={`Ações de ${definicao?.nome}`}>
          <button type="button" onClick={() => setPainel('editar')}>
            <Lapis /> Editar
          </button>
          <button
            type="button"
            className="ed-icone"
            aria-label="Subir"
            disabled={indice === 0}
            onClick={() => e.mover(bloco.id, -1)}
          >
            <Subir />
          </button>
          <button
            type="button"
            className="ed-icone"
            aria-label="Descer"
            disabled={indice === projeto.blocos.length - 1}
            onClick={() => e.mover(bloco.id, 1)}
          >
            <Descer />
          </button>
          {!definicao?.fixo && (
            <button type="button" onClick={() => esconder(bloco.id)}>
              <Esconder /> Esconder
            </button>
          )}
        </div>
      )}

      <nav className="ed-abas" aria-label="Editor">
        <button
          type="button"
          aria-pressed={painel === 'secoes'}
          onClick={() => setPainel(painel === 'secoes' ? null : 'secoes')}
        >
          <Camadas /> Seções
        </button>
        <button
          type="button"
          aria-pressed={painel === 'adicionar'}
          onClick={() => setPainel(painel === 'adicionar' ? null : 'adicionar')}
        >
          <Mais /> Adicionar
        </button>
        <button
          type="button"
          aria-pressed={painel === 'midias'}
          onClick={() => setPainel(painel === 'midias' ? null : 'midias')}
        >
          <Imagem /> Mídias
        </button>
        <button
          type="button"
          aria-pressed={painel === 'estilo'}
          onClick={() => setPainel(painel === 'estilo' ? null : 'estilo')}
        >
          <Paleta /> Estilo
        </button>
        <button
          type="button"
          aria-pressed={painel === 'revisao'}
          onClick={() => setPainel(painel === 'revisao' ? null : 'revisao')}
        >
          <Foguete /> Publicar
          {!podePublicar(alertas) && (
            <span className="ed-pendencias" aria-label={`${vermelhos} pontos a resolver`}>
              {vermelhos}
            </span>
          )}
        </button>
      </nav>

      <Gaveta
        aberta={painel === 'editar' && !!bloco}
        aoFechar={() => setPainel(null)}
        titulo={definicao?.nome ?? ''}
        descricao="As mudanças aparecem na página na hora."
      >
        {bloco && definicao && (
          <CamposDoBloco
            aoInformarNumeros={() => setPainel('numeros')}
            definicao={definicao}
            bloco={bloco}
            aoMudarDados={(dados) => e.atualizarDados(bloco.id, dados)}
            aoTrocarVariacao={(v) => e.trocarVariacao(bloco.id, v)}
          />
        )}
      </Gaveta>
      <Gaveta aberta={painel === 'midias'} aoFechar={() => setPainel(null)} titulo="Minhas mídias">
        {painel === 'midias' && <PainelMidias />}
      </Gaveta>
      <Gaveta
        aberta={painel === 'revisao'}
        aoFechar={() => setPainel(null)}
        titulo="Revisão final"
        descricao="Confira antes de publicar."
      >
        <PainelRevisao
          link={projeto.link ?? ''}
          arroba={
            String(projeto.blocos.find((b) => b.tipo === 'capa')?.dados.arroba ?? '')
              .split('·')[0]
              ?.trim() ?? ''
          }
          aoMudarLink={(link) => e.substituir({ ...projeto, link })}
          alertas={alertas}
          aoIr={(id) => {
            e.selecionar(id);
            setPainel('editar');
          }}
        />
      </Gaveta>
      <Gaveta
        aberta={painel === 'numeros'}
        aoFechar={() => setPainel(null)}
        titulo="Meus números"
        descricao="Só você sabe esses números. Eles preenchem Números e Público na página."
      >
        {painel === 'numeros' && (
          <PainelNumeros
            inicial={projeto.numeros}
            aoSalvar={(n) => {
              e.substituir(aplicarNumeros(projeto, n));
              setPainel(null);
              setAviso('Números aplicados.');
            }}
          />
        )}
      </Gaveta>
      <Gaveta aberta={painel === 'secoes'} aoFechar={() => setPainel(null)} titulo="Seções">
        <PainelSecoes projeto={projeto} e={{ ...e, esconder }} />
      </Gaveta>
      <Gaveta aberta={painel === 'adicionar'} aoFechar={() => setPainel(null)} titulo="Adicionar seção">
        <PainelAdicionar projeto={projeto} e={e} aoAdicionar={() => setPainel(null)} />
      </Gaveta>
      <Gaveta
        aberta={painel === 'estilo'}
        aoFechar={() => setPainel(null)}
        titulo="Estilo"
        descricao="Tudo se ajusta sozinho; o que você escreveu continua igual."
      >
        <PainelEstilo
          projeto={projeto}
          aoMudar={(mudanca, texto) => {
            e.substituir({ ...projeto, ...mudanca });
            setAviso(`${texto} aplicado.`);
          }}
        />
      </Gaveta>
    </div>
  );
}

/** Carrega o projeto certo (da conta, se houver sessão; senão o rascunho do aparelho) e abre o editor. */
export default function Editor() {
  const sessao = useSessao();
  const [inicial, setInicial] = useState<Projeto | null>(null);
  const donoId = sessao?.user.id ?? null;

  useEffect(() => {
    if (sessao === undefined) return;
    let vivo = true;
    void (async () => {
      const local = carregarRascunho();
      if (!sessao) return vivo && setInicial(local ?? PROJETO_DE_EXEMPLO);
      const nuvem = await carregarDaNuvem();
      // primeira entrada: o rascunho feito antes do login vai junto para a conta (DEV-033)
      if (!nuvem && local) await salvarNaNuvem(sessao.user.id, local);
      if (nuvem) salvarRascunho(nuvem);
      if (vivo) setInicial(nuvem ?? local ?? PROJETO_DE_EXEMPLO);
    })();
    return () => {
      vivo = false;
    };
  }, [sessao, donoId]);

  if (!inicial)
    return (
      <p className="ed-carregando" role="status">
        Carregando seu portfólio…
      </p>
    );
  return <EditorInterno key={donoId ?? 'aparelho'} inicial={inicial} donoId={donoId} />;
}
