// Formulário de um bloco, gerado dos campos do registro: texto com contador de letras, listas de itens e a
// escolha de variação. Tocar em "Exemplo" e trocar o texto tira a marca de exemplo do item.
import type { Campo, DefinicaoDeBloco } from '@lib/bloco';
import type { Bloco } from '@lib/projeto';
import { Lixeira, Mais } from './icones';

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
  const id = `campo-${campo.id}-${campo.rotulo}`;
  const comum = {
    id,
    value: valor,
    maxLength: campo.maximo,
    onChange: (e: { target: { value: string } }) => aoMudar(e.target.value),
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

function ListaDeItens({ campo, itens, aoMudar }: { campo: Campo; itens: Dados[]; aoMudar: (itens: Dados[]) => void }) {
  const campos = campo.itens ?? [];
  const mudarItem = (i: number, id: string, valor: unknown) =>
    aoMudar(itens.map((item, n) => (n === i ? { ...item, [id]: valor, exemplo: undefined } : item)));
  return (
    <fieldset className="ed-lista">
      <legend>{campo.rotulo}</legend>
      {itens.map((item, i) => (
        <div className="ed-item" key={i}>
          {campos.map((c) =>
            c.tipo === 'proporcao' ? (
              <div className="ed-campo" key={c.id}>
                <label htmlFor={`prop-${i}`}>{c.rotulo}</label>
                <input
                  id={`prop-${i}`}
                  type="range"
                  min={0}
                  max={100}
                  value={Number(item[c.id] ?? 0)}
                  onChange={(e) => mudarItem(i, c.id, Number(e.target.value))}
                />
              </div>
            ) : (
              <CampoDeTexto
                key={c.id}
                campo={c}
                valor={String(item[c.id] ?? '')}
                aoMudar={(v) => mudarItem(i, c.id, v)}
              />
            ),
          )}
          <button type="button" className="ed-link" onClick={() => aoMudar(itens.filter((_, n) => n !== i))}>
            <Lixeira /> Remover
          </button>
        </div>
      ))}
      <button type="button" className="ed-botao-claro" onClick={() => aoMudar([...itens, {}])}>
        <Mais /> Adicionar
      </button>
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
}: {
  definicao: DefinicaoDeBloco;
  bloco: Bloco;
  aoMudarDados: (dados: Dados) => void;
  aoTrocarVariacao: (variacao: string) => void;
}) {
  return (
    <div className="ed-form">
      {definicao.variacoes.length > 1 && (
        <fieldset className="ed-variacoes">
          <legend>Layout</legend>
          <div role="radiogroup">
            {definicao.variacoes.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={bloco.variacao === v.id}
                onClick={() => aoTrocarVariacao(v.id)}
              >
                {v.nome}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {definicao.campos.map((campo) => {
        const valor = bloco.dados[campo.id];
        if (campo.tipo === 'lista')
          return campo.itens ? (
            <ListaDeItens
              key={campo.id}
              campo={campo}
              itens={(valor as Dados[] | undefined) ?? []}
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
        if (campo.tipo === 'imagem' || campo.tipo === 'video' || campo.tipo === 'icone')
          return (
            <CampoDeTexto
              key={campo.id}
              campo={{
                ...campo,
                rotulo: `${campo.rotulo} (endereço)`,
                dica: 'O envio de arquivos chega em breve; por enquanto, cole o endereço da imagem.',
              }}
              valor={String(valor ?? '')}
              aoMudar={(v) => aoMudarDados({ [campo.id]: v })}
            />
          );
        return (
          <CampoDeTexto
            key={campo.id}
            campo={campo}
            valor={String(valor ?? '')}
            aoMudar={(v) => aoMudarDados({ [campo.id]: v })}
          />
        );
      })}
    </div>
  );
}
