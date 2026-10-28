// Formulário de um bloco, gerado dos campos do registro: texto com contador de letras, listas de itens e a
// escolha de variação. Tocar em "Exemplo" e trocar o texto tira a marca de exemplo do item.
import { Fragment, useId, useState, type ReactNode } from 'react';
import { chaveDeFoco, type Campo, type DefinicaoDeBloco } from '@lib/bloco';
import { rotuloPadrao } from '@lib/menu';
import type { Bloco } from '@lib/projeto';
import { REGISTRO } from '@blocks/registro';
import { CampoDeArquivo } from './CampoDeArquivo';
import { AdicionarVarios } from './AdicionarVarios';
import { Copiar, Descer, Lixeira, Mais, Play, Seta, Subir } from './icones';
import { DESENHOS, NOMES_CURTOS } from './desenhos';
import { capaDeVideo } from './upload';

type Dados = Record<string, unknown>;

function CampoDeTexto({
  campo,
  valor,
  aoMudar,
  textoLongo,
}: {
  campo: Campo;
  valor: string;
  aoMudar: (v: string) => void;
  textoLongo?: boolean;
}) {
  const id = useId(); // único por campo: antes, itens repetidos dividiam o mesmo id e ficavam sem nome para o leitor de tela
  const comum = {
    id,
    value: valor,
    maxLength: campo.maximo,
    onChange: (e: { target: { value: string } }) => aoMudar(e.target.value),
    // texto de exemplo com [colchetes]: tocar já seleciona tudo, para escrever por cima sem apagar
    onFocus: (e: { target: { select: () => void } }) => /\[[^\]]+\]/.test(valor) && e.target.select(),
  };
  return (
    <div className="ed-campo">
      <label htmlFor={id}>{campo.rotulo}</label>
      {textoLongo || campo.tipo === 'texto' ? (
        <textarea rows={3} {...comum} />
      ) : (
        <input type="text" {...comum} inputMode={campo.tipo === 'numero' ? 'text' : undefined} />
      )}
      {campo.maximo && (
        <span className="ed-contador" aria-live="polite">
          {valor.length} de {campo.maximo} letras
        </span>
      )}
      {campo.dica && <span className="ed-dica">{campo.dica}</span>}
    </div>
  );
}

function CampoDeProporcao({ campo, valor, aoMudar }: { campo: Campo; valor: number; aoMudar: (v: number) => void }) {
  const id = useId();
  return (
    <div className="ed-campo">
      <label htmlFor={id}>
        {campo.rotulo}: <b>{valor === 0 ? 'nenhuma' : `${valor}%`}</b>
      </label>
      <input id={id} type="range" min={0} max={100} value={valor} onChange={(e) => aoMudar(Number(e.target.value))} />
      {campo.dica && <span className="ed-dica">{campo.dica}</span>}
    </div>
  );
}

function Miniatura({ item, cartao, numero }: { item: Dados; cartao: NonNullable<Campo['cartao']>; numero: number }) {
  const [falhou, setFalhou] = useState(false);
  if (!cartao.miniatura && !cartao.video)
    return (
      <span className="ed-cartao-mini ed-cartao-mini--numero" aria-hidden="true">
        {numero}
      </span>
    );
  const video = cartao.video ? String(item[cartao.video] ?? '') : '';
  const origem = String(cartao.miniatura ? (item[cartao.miniatura] ?? '') : '') || (video && capaDeVideo(video)) || '';
  return (
    <span className={`ed-cartao-mini${video ? ' ed-cartao-mini--video' : ''}`} aria-hidden="true">
      {origem && !falhou ? <img src={origem} alt="" onError={() => setFalhou(true)} /> : video ? <Play /> : null}
    </span>
  );
}

function ListaDeItens({
  campo,
  itens,
  variacao,
  aoMudar,
}: {
  campo: Campo;
  itens: Dados[];
  variacao: string;
  aoMudar: (itens: Dados[]) => void;
}) {
  const campos = campo.itens ?? [];
  const cartao = campo.cartao;
  // cartões: um aberto por vez; o item recém-criado já abre para a creator escrever
  const [aberto, setAberto] = useState<number | null>(cartao ? null : -1);
  const [confirmando, setConfirmando] = useState<number | null>(null);
  const mudarItem = (i: number, id: string, valor: unknown) => mudarItemVarios(i, { [id]: valor });
  const mudarItemVarios = (i: number, parte: Dados) =>
    aoMudar(itens.map((item, n) => (n === i ? { ...item, ...parte, exemplo: undefined } : item)));
  const mover = (i: number, para: number) => {
    if (para < 0 || para >= itens.length) return;
    const nova = [...itens];
    nova.splice(para, 0, ...nova.splice(i, 1));
    aoMudar(nova);
    setConfirmando(null);
    if (aberto === i) setAberto(para);
    else if (aberto === para) setAberto(i);
  };
  const duplicar = (i: number) => {
    aoMudar([...itens.slice(0, i + 1), { ...itens[i], exemplo: undefined }, ...itens.slice(i + 1)]);
    setAberto(i + 1);
  };
  const remover = (i: number) => {
    aoMudar(itens.filter((_, n) => n !== i));
    setConfirmando(null);
    setAberto(null);
  };

  const camposDoItem = (item: Dados, i: number) =>
    campos.map((c) =>
      c.tipo === 'proporcao' ? (
        <div className="ed-campo" key={c.id}>
          <label htmlFor={`prop-${i}`}>
            {c.rotulo}: <b>{Number(item[c.id] ?? 0)}</b>
          </label>
          <input
            id={`prop-${i}`}
            type="range"
            min={0}
            max={100}
            value={Number(item[c.id] ?? 0)}
            onChange={(e) => mudarItem(i, c.id, Number(e.target.value))}
          />
        </div>
      ) : c.tipo === 'imagem' || c.tipo === 'video' ? (
        <CampoDeArquivo
          key={c.id}
          campo={c}
          valor={String(item[c.id] ?? '')}
          capa={String(item.capa ?? '')}
          foco={String(item[chaveDeFoco(c)] ?? '')}
          aoMudar={(parte) => mudarItemVarios(i, parte)}
        />
      ) : (
        <CampoDeTexto key={c.id} campo={c} valor={String(item[c.id] ?? '')} aoMudar={(v) => mudarItem(i, c.id, v)} />
      ),
    );

  const confirmacao = (i: number) =>
    confirmando === i ? (
      <div className="ed-confirma" role="alertdialog" aria-label="Confirmar remoção">
        <span>Remover este item?</span>
        <button type="button" className="ed-link ed-link--perigo" onClick={() => remover(i)}>
          Remover
        </button>
        <button type="button" className="ed-link" onClick={() => setConfirmando(null)}>
          Cancelar
        </button>
      </div>
    ) : (
      <button type="button" className="ed-link" onClick={() => setConfirmando(i)}>
        <Lixeira /> Remover
      </button>
    );

  return (
    <fieldset className="ed-lista">
      <legend>{campo.rotulo}</legend>
      {itens.map((item, i) => {
        if (!cartao)
          return (
            <div className="ed-item" key={i}>
              {camposDoItem(item, i)}
              <div className="ed-item-acoes">
                {confirmacao(i)}
                <button type="button" className="ed-link" onClick={() => duplicar(i)}>
                  <Copiar /> Duplicar
                </button>
              </div>
            </div>
          );
        const titulo = String(item[cartao.titulo] ?? '').trim();
        const detalhe = cartao.detalhe ? String(item[cartao.detalhe] ?? '').trim() : '';
        const aberta = aberto === i;
        const destaque = i === 0 && cartao.destaqueNaVariacao === variacao;
        return (
          <div className={`ed-cartao${aberta ? ' ed-cartao--aberto' : ''}`} key={i}>
            <div className="ed-cartao-topo">
              <button
                type="button"
                className="ed-cartao-resumo"
                aria-expanded={aberta}
                onClick={() => (setAberto(aberta ? null : i), setConfirmando(null))}
              >
                <Miniatura item={item} cartao={cartao} numero={i + 1} />
                <span className="ed-cartao-texto">
                  <span className={`ed-cartao-titulo${titulo ? '' : ' ed-cartao-titulo--vazio'}`}>
                    {titulo || cartao.vazio}
                  </span>
                  <span className="ed-cartao-detalhe">
                    {destaque && <b className="ed-cartao-selo">Destaque</b>}
                    {detalhe}
                  </span>
                </span>
                <span className="ed-cartao-seta" aria-hidden="true">
                  <Seta />
                </span>
              </button>
              <button
                type="button"
                className="ed-icone"
                aria-label={`Subir ${titulo || cartao.vazio}`}
                disabled={i === 0}
                onClick={() => mover(i, i - 1)}
              >
                <Subir />
              </button>
              <button
                type="button"
                className="ed-icone"
                aria-label={`Descer ${titulo || cartao.vazio}`}
                disabled={i === itens.length - 1}
                onClick={() => mover(i, i + 1)}
              >
                <Descer />
              </button>
            </div>
            {aberta && (
              <div className="ed-cartao-corpo">
                {camposDoItem(item, i)}
                <div className="ed-item-acoes">
                  {confirmacao(i)}
                  <button type="button" className="ed-link" onClick={() => duplicar(i)}>
                    <Copiar /> Duplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div className="ed-lista-rodape">
        <button
          type="button"
          className="ed-botao-claro"
          onClick={() => {
            aoMudar([...itens, {}]);
            if (cartao) setAberto(itens.length);
          }}
        >
          <Mais /> Adicionar
        </button>
        {campo.varios && (
          <AdicionarVarios varios={campo.varios} aoAdicionar={(novos) => aoMudar([...itens, ...novos])} />
        )}
      </div>
    </fieldset>
  );
}

function ListaDeTextos({
  campo,
  itens,
  aoMudar,
}: {
  campo: Campo;
  itens: string[];
  aoMudar: (itens: string[]) => void;
}) {
  return (
    <fieldset className="ed-lista">
      <legend>{campo.rotulo}</legend>
      {itens.map((texto, i) => (
        <div className="ed-item ed-item--linha" key={i}>
          <input
            type="text"
            aria-label={`${campo.rotulo} ${i + 1}`}
            value={texto}
            maxLength={30}
            onChange={(e) => aoMudar(itens.map((t, n) => (n === i ? e.target.value : t)))}
          />
          <button
            type="button"
            className="ed-icone"
            aria-label={`Remover ${texto || 'item'}`}
            onClick={() => aoMudar(itens.filter((_, n) => n !== i))}
          >
            <Lixeira />
          </button>
        </div>
      ))}
      <button type="button" className="ed-botao-claro" onClick={() => aoMudar([...itens, ''])}>
        <Mais /> Adicionar
      </button>
    </fieldset>
  );
}

export function CamposDoBloco({
  definicao,
  bloco,
  aoMudarDados,
  aoTrocarVariacao,
  aoInformarNumeros,
  menuLigado,
  aoMudarMenu,
}: {
  definicao: DefinicaoDeBloco;
  bloco: Bloco;
  aoMudarDados: (dados: Dados) => void;
  aoTrocarVariacao: (variacao: string) => void;
  aoInformarNumeros?: () => void;
  /** o menu do topo da página está ligado em Estilo (DEV-098) */
  menuLigado?: boolean;
  /** muda o nome e o "mostrar no menu" desta seção; sem isto, o grupo No menu não aparece */
  aoMudarMenu?: (menu: NonNullable<Bloco['menu']>) => void;
}) {
  const padraoNoMenu = rotuloPadrao(definicao.tipo, REGISTRO);
  const noMenu = !bloco.menu?.oculto;
  return (
    <div className="ed-form">
      {(definicao.tipo === 'numeros' || definicao.tipo === 'publico') && aoInformarNumeros && (
        <button type="button" className="ed-primario" onClick={aoInformarNumeros}>
          Informar meus números do Instagram
        </button>
      )}
      {definicao.variacoes.length > 1 && (
        <fieldset className={`ed-variacoes${DESENHOS[definicao.tipo] ? ' ed-variacoes--desenhos' : ''}`}>
          <legend>Layout</legend>
          <div
            role="radiogroup"
            style={
              DESENHOS[definicao.tipo]
                ? { gridTemplateColumns: `repeat(${definicao.variacoes.length}, 1fr)` }
                : undefined
            }
          >
            {definicao.variacoes.map((v) => {
              const Desenho = DESENHOS[definicao.tipo]?.[v.id];
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={bloco.variacao === v.id}
                  aria-label={v.nome}
                  onClick={() => aoTrocarVariacao(v.id)}
                >
                  {Desenho && <Desenho />}
                  <span>{NOMES_CURTOS[`${definicao.tipo}.${v.id}`] ?? v.nome}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      {definicao.campos
        .filter((campo) => !campo.soNasVariacoes || campo.soNasVariacoes.includes(bloco.variacao))
        .filter((campo) => !campo.seTem || campo.seTem.every((id) => Boolean(bloco.dados[id])))
        .map((campo, i, lista) => {
          const valor = bloco.dados[campo.id];
          const cabecalho =
            campo.grupo && campo.grupo !== lista[i - 1]?.grupo ? (
              <h3 className="ed-grupo" key={`g-${campo.grupo}`}>
                {campo.grupo}
              </h3>
            ) : null;
          let conteudo: ReactNode;
          if (campo.tipo === 'lista')
            conteudo = campo.itens ? (
              <ListaDeItens
                key={campo.id}
                campo={campo}
                itens={(valor as Dados[] | undefined) ?? []}
                variacao={bloco.variacao}
                aoMudar={(itens) => aoMudarDados({ [campo.id]: itens })}
              />
            ) : (
              <ListaDeTextos
                key={campo.id}
                campo={campo}
                itens={(valor as string[] | undefined) ?? []}
                aoMudar={(itens) => aoMudarDados({ [campo.id]: itens })}
              />
            );
          else if (campo.tipo === 'escolha')
            conteudo = (
              <fieldset className="ed-variacoes ed-variacoes--segmentos" key={campo.id}>
                <legend>{campo.rotulo}</legend>
                <div role="radiogroup">
                  {(campo.opcoes ?? []).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={(typeof valor === 'string' ? valor : campo.padrao) === o.id}
                      onClick={() => aoMudarDados({ [campo.id]: o.id })}
                    >
                      {o.nome}
                    </button>
                  ))}
                </div>
                {campo.dica && <span className="ed-dica">{campo.dica}</span>}
              </fieldset>
            );
          else if (campo.tipo === 'proporcao')
            conteudo = (
              <CampoDeProporcao
                key={campo.id}
                campo={campo}
                valor={typeof valor === 'number' ? valor : Number(campo.padrao ?? 0)}
                aoMudar={(v) => aoMudarDados({ [campo.id]: v })}
              />
            );
          else if (campo.tipo === 'imagem' || campo.tipo === 'video')
            conteudo = (
              <CampoDeArquivo
                key={campo.id}
                campo={campo}
                valor={String(valor ?? '')}
                capa={String(bloco.dados[campo.capaEm ?? 'capa'] ?? '')}
                foco={String(bloco.dados[chaveDeFoco(campo)] ?? '')}
                aoMudar={(parte) => aoMudarDados(parte)}
              />
            );
          else
            conteudo = (
              <CampoDeTexto
                key={campo.id}
                campo={campo}
                valor={String(valor ?? '')}
                aoMudar={(v) => aoMudarDados({ [campo.id]: v })}
              />
            );
          return (
            <Fragment key={campo.id}>
              {cabecalho}
              {conteudo}
            </Fragment>
          );
        })}
      {aoMudarMenu && definicao.tipo !== 'capa' && (
        <>
          <h3 className="ed-grupo">No menu</h3>
          {menuLigado === false ? (
            <p className="ed-dica">O menu do topo está desligado. Ligue em Estilo para ele aparecer na página.</p>
          ) : (
            <>
              <fieldset className="ed-variacoes ed-variacoes--segmentos">
                <legend>Aparece no menu do topo?</legend>
                <div role="radiogroup">
                  {[
                    [true, 'Sim'],
                    [false, 'Não'],
                  ].map(([valor, nome]) => (
                    <button
                      key={String(valor)}
                      type="button"
                      role="radio"
                      aria-checked={noMenu === valor}
                      onClick={() => aoMudarMenu({ oculto: !valor })}
                    >
                      {nome}
                    </button>
                  ))}
                </div>
              </fieldset>
              {noMenu && (
                <CampoDeTexto
                  campo={{
                    id: 'menu-rotulo',
                    rotulo: 'Nome no menu',
                    tipo: 'etiqueta',
                    maximo: 24,
                    dica: `Em branco, aparece "${padraoNoMenu}". Nomes curtos cabem melhor no celular.`,
                  }}
                  valor={bloco.menu?.rotulo ?? ''}
                  aoMudar={(rotulo) => aoMudarMenu({ rotulo })}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
