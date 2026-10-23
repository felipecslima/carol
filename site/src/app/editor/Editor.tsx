// Editor do Portfólio Creator (mobile primeiro): a creator edita em cima do resultado final. Primeiro toque
// seleciona o bloco, segundo abre a edição; controles embaixo, onde o polegar alcança; um nível de gaveta só.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useStore } from 'zustand';
import { Bloco } from '@blocks/Bloco';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis, type Projeto } from '@lib/projeto';
import { variaveisDeTema } from '@themes/aplicar';
import { gerarPaleta } from '@themes/paleta';
import { NUVEM } from '@themes/modelos/nuvem';
import type { Fontes } from '@themes/tokens';
import { CamposDoBloco } from './CamposDoBloco';
import { criarEditor } from './estado';
import { progresso } from '@lib/progresso';
import { Gaveta } from './Gaveta';
import { Camadas, Desfazer, Esconder, Lapis, Olho, Mais, Paleta, Refazer, Subir, Descer } from './icones';
import { PainelAdicionar, PainelEstilo, PainelSecoes } from './Paineis';
import { carregarRascunho, salvarRascunho } from './persistencia';
import './editor.css';

type Painel = 'editar' | 'secoes' | 'adicionar' | 'estilo' | null;

function temaDoProjeto(p: Projeto): CSSProperties {
  const origem = p.corPropria ?? NUVEM.paletas[p.paleta]?.origem ?? NUVEM.paletas[0].origem;
  const paleta = gerarPaleta(origem, NUVEM.esquema);
  const estilo = {
    ...NUVEM.estilo,
    fontes: p.fontes as Fontes,
    cantos: p.cantos,
  };
  return variaveisDeTema(paleta, estilo, p.clima) as CSSProperties;
}

export default function Editor() {
  const editor = useMemo(() => criarEditor(carregarRascunho() ?? PROJETO_DE_EXEMPLO, REGISTRO), []);
  const e = useStore(editor);
  const { projeto, selecionado } = e;
  const passados = useStore(editor.temporal, (s) => s.pastStates.length);
  const futuros = useStore(editor.temporal, (s) => s.futureStates.length);
  const [painel, setPainel] = useState<Painel>(null);
  const [situacao, setSituacao] = useState<'salvo' | 'salvando' | 'erro'>('salvo');
  const [ver, setVer] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const primeiraVez = useRef(true);

  // salvar sozinho: espera a creator parar de mexer (600 ms) e grava no aparelho
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    setSituacao('salvando');
    const espera = setTimeout(() => setSituacao(salvarRascunho(projeto) ? 'salvo' : 'erro'), 600);
    return () => clearTimeout(espera);
  }, [projeto]);

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
  const bloco = projeto.blocos.find((b) => b.id === selecionado);
  const definicao = bloco && REGISTRO[bloco.tipo];
  const indice = bloco ? projeto.blocos.indexOf(bloco) : -1;
  const visiveis = blocosVisiveis(projeto, REGISTRO);
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
        <span className="ed-marca">
          portfólio<i>creator</i>
        </span>
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
              ? 'Salvo ✓'
              : situacao === 'salvando'
                ? 'Salvando…'
                : 'Não salvou: sem espaço no aparelho'}
          </span>
        </div>
      </header>

      <div className="ed-progresso" role="status">
        <span>
          {seus} de {total} itens já são seus
        </span>
        <span className="ed-progresso-barra" aria-hidden="true">
          <span style={{ width: `${total ? (seus / total) * 100 : 0}%` }} />
        </span>
      </div>

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
            <Bloco bloco={b} modo="editor" />
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
            <button type="button" onClick={() => e.esconder(bloco.id)}>
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
          aria-pressed={painel === 'estilo'}
          onClick={() => setPainel(painel === 'estilo' ? null : 'estilo')}
        >
          <Paleta /> Estilo
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
            definicao={definicao}
            bloco={bloco}
            aoMudarDados={(dados) => e.atualizarDados(bloco.id, dados)}
            aoTrocarVariacao={(v) => e.trocarVariacao(bloco.id, v)}
          />
        )}
      </Gaveta>
      <Gaveta aberta={painel === 'secoes'} aoFechar={() => setPainel(null)} titulo="Seções">
        <PainelSecoes projeto={projeto} e={e} />
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
