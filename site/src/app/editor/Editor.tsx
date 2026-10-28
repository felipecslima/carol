// Editor do Portfólio Creator (mobile primeiro): a creator edita em cima do resultado final. Primeiro toque
// seleciona o bloco, segundo abre a edição; controles embaixo, onde o polegar alcança; um nível de gaveta só.
import { Marca } from '../Marca';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { Bloco } from '@blocks/Bloco';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { animate, AnimatePresence, motion } from 'motion/react';
import { MovimentoDoApp, SUAVE } from '../movimento';
import { ConteudoDaPagina } from '@blocks/ConteudoDaPagina';
import { Menu } from '@blocks/Menu';
import { itensDoMenu } from '@lib/menu';
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
  Lixeira,
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
import '../tema.css';

type Painel = 'editar' | 'secoes' | 'adicionar' | 'estilo' | 'numeros' | 'revisao' | 'midias' | null;

function EditorInterno({ inicial, donoId }: { inicial: Projeto; donoId: string | null }) {
  const editor = useMemo(() => criarEditor(inicial, REGISTRO), [inicial]);
  const e = useStore(editor);
  const { projeto, selecionado } = e;
  const passados = useStore(editor.temporal, (s) => s.pastStates.length);
  const futuros = useStore(editor.temporal, (s) => s.futureStates.length);
  const [painel, setPainel] = useState<Painel>(() =>
    new URLSearchParams(window.location.search).get('publicar') === '1' ? 'revisao' : null,
  );
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

  // seção recém-adicionada (ou devolvida): rola a página até ela e a deixa selecionada
  const rolarParaNova = useRef(false);
  const idsAntes = useRef(new Set(projeto.blocos.map((b) => b.id)));
  useEffect(() => {
    const nova = projeto.blocos.find((b) => !idsAntes.current.has(b.id));
    idsAntes.current = new Set(projeto.blocos.map((b) => b.id));
    if (!rolarParaNova.current || !nova) return;
    rolarParaNova.current = false;
    e.selecionar(nova.id);
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-bloco="${nova.id}"]`);
      el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      // um anel rosa se abre em volta da seção nova, para o olho achar onde ela entrou
      if (el)
        void animate(
          el,
          { boxShadow: ['0 0 0 0 rgba(255,143,176,0.75)', '0 0 0 18px rgba(255,143,176,0)'] },
          { duration: 1.1, ease: SUAVE, delay: 0.45 },
        );
    });
  }, [projeto.blocos, e]);

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
  const remover = (id: string) => {
    e.remover(id);
    setAviso('Seção removida de vez.');
  };
  const desfazer = () => editor.temporal.getState().undo();
  const refazer = () => editor.temporal.getState().redo();

  // modo Ver: a página como a marca vai ver, sem nenhuma interface do editor
  // dica de primeiro uso: o gesto "toque 1 seleciona, toque 2 edita" não é óbvio; aparece uma vez e some ao selecionar
  const [dica, setDica] = useState(() => {
    try {
      return localStorage.getItem('pc:dica-toque') === null;
    } catch {
      return false;
    }
  });
  const fecharDica = useCallback(() => {
    setDica(false);
    try {
      localStorage.setItem('pc:dica-toque', '1');
    } catch {
      /* sem armazenamento: a dica volta na próxima visita, sem problema */
    }
  }, []);

  if (ver) {
    return (
      <div className="pagina ed-ver" style={temaDoProjeto(projeto)}>
        <ConteudoDaPagina projeto={projeto} />
        <button type="button" className="ed-sair-ver" onClick={() => setVer(false)}>
          Voltar a editar
        </button>
      </div>
    );
  }

  return (
    <MovimentoDoApp>
      <div className={`ed${painel ? ' ed--gaveta' : ''}`}>
        <header className="ed-topo">
          {/* a marca leva para a área (Início): o editor salva sozinho, nada se perde ao sair */}
          <a href="/app/" className="marca-link" aria-label="Portfólio Creator: ir para o início">
            <Marca />
          </a>
          <div className="ed-topo-acoes">
            <button
              type="button"
              className="ed-icone"
              onClick={() => (e.selecionar(null), setPainel(null), setVer(true))}
              aria-label="Ver como a marca vê"
            >
              <Olho />
            </button>
            <button
              type="button"
              className="ed-icone"
              onClick={desfazer}
              disabled={passados === 0}
              aria-label="Desfazer"
            >
              <Desfazer />
            </button>
            <button type="button" className="ed-icone" onClick={refazer} disabled={futuros === 0} aria-label="Refazer">
              <Refazer />
            </button>
            <span className={`ed-salvo ed-salvo--${situacao}`} role="status">
              {situacao === 'salvo'
                ? donoId
                  ? 'Salvo'
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
          {/* o menu como vai ficar na página; tocar num item seleciona a seção e leva até ela */}
          <Menu
            itens={itensDoMenu(projeto, REGISTRO)}
            modo="editor"
            aoEscolher={(id) => {
              fecharDica();
              e.selecionar(id);
              document.querySelector(`[data-bloco="${id}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }}
          />
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
              onClick={() => (b.id === selecionado ? setPainel('editar') : (fecharDica(), e.selecionar(b.id)))}
              onKeyDown={(ev) =>
                (ev.key === 'Enter' || ev.key === ' ') &&
                (ev.preventDefault(), b.id === selecionado ? setPainel('editar') : (fecharDica(), e.selecionar(b.id)))
              }
            >
              <div className="ed-bloco-conteudo" inert>
                <Bloco bloco={b} modo="editor" />
              </div>
            </div>
          ))}
        </main>

        {dica && !aviso && !selecionado && !painel && (
          <div className="ed-toast ed-toast--dica" role="status">
            Toque numa seção para selecionar. Toque de novo para editar.
            <button type="button" onClick={fecharDica}>
              Entendi
            </button>
          </div>
        )}

        <AnimatePresence>
          {aviso && (
            <motion.div
              key="aviso"
              className="ed-toast"
              role="status"
              style={{ x: '-50%' }}
              initial={{ opacity: 0, y: -14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              {aviso}
              <button type="button" onClick={() => (desfazer(), setAviso(null))}>
                Desfazer
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {bloco && !painel && (
          <motion.div
            key={bloco.id}
            className="ed-flutuante"
            role="toolbar"
            aria-label={`Ações de ${definicao?.nome}`}
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 460, damping: 30 }}
          >
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
            {!definicao?.fixo && (
              <button type="button" onClick={() => remover(bloco.id)}>
                <Lixeira /> Remover
              </button>
            )}
          </motion.div>
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
              menuLigado={projeto.menu}
              aoMudarMenu={(menu) => e.atualizarMenu(bloco.id, menu)}
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
            projeto={projeto}
            donoId={donoId}
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
          <PainelSecoes
            projeto={projeto}
            e={{
              ...e,
              esconder,
              remover,
              devolver: (id) => {
                rolarParaNova.current = true;
                e.devolver(id);
              },
            }}
          />
        </Gaveta>
        <Gaveta aberta={painel === 'adicionar'} aoFechar={() => setPainel(null)} titulo="Adicionar seção">
          <PainelAdicionar
            projeto={projeto}
            e={{
              ...e,
              adicionar: (tipo) => {
                rolarParaNova.current = true;
                e.adicionar(tipo);
              },
            }}
            aoAdicionar={() => setPainel(null)}
          />
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
    </MovimentoDoApp>
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
