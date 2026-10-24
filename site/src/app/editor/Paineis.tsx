// Painéis das abas de baixo: Seções (ordem e bandeja), Adicionar bloco e Estilo.
import { REGISTRO } from '@blocks/registro';
import { MAXIMO_DE_BLOCOS, type Projeto } from '@lib/projeto';
import { gerarPaleta } from '@themes/paleta';
import { NUVEM } from '@themes/modelos/nuvem';
import type { Cantos, Fontes } from '@themes/tokens';
import { Descer, Esconder, Subir } from './icones';
import type { EstadoDoEditor } from './estado';

const nomeDe = (tipo: string) => REGISTRO[tipo]?.nome ?? tipo;

export function PainelSecoes({ projeto, e }: { projeto: Projeto; e: EstadoDoEditor }) {
  return (
    <div className="ed-form">
      <p className="ed-dica">
        {projeto.blocos.length} de {MAXIMO_DE_BLOCOS} seções na página
      </p>
      <ol className="ed-secoes">
        {projeto.blocos.map((b, i) => {
          const fixo = REGISTRO[b.tipo]?.fixo;
          return (
            <li key={b.id}>
              <span>{nomeDe(b.tipo)}</span>
              <div>
                <button
                  type="button"
                  className="ed-icone"
                  aria-label={`Subir ${nomeDe(b.tipo)}`}
                  disabled={i === 0}
                  onClick={() => e.mover(b.id, -1)}
                >
                  <Subir />
                </button>
                <button
                  type="button"
                  className="ed-icone"
                  aria-label={`Descer ${nomeDe(b.tipo)}`}
                  disabled={i === projeto.blocos.length - 1}
                  onClick={() => e.mover(b.id, 1)}
                >
                  <Descer />
                </button>
                {fixo ? (
                  <span className="ed-fixa">sempre na página</span>
                ) : (
                  <button
                    type="button"
                    className="ed-icone"
                    aria-label={`Esconder ${nomeDe(b.tipo)}`}
                    onClick={() => e.esconder(b.id)}
                  >
                    <Esconder />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <h3 className="ed-subtitulo">Guardados</h3>
      {projeto.guardados.length === 0 ? (
        <p className="ed-dica">Quando você esconde uma seção, ela fica guardada aqui, com tudo o que você escreveu.</p>
      ) : (
        <ul className="ed-secoes">
          {projeto.guardados.map((b) => (
            <li key={b.id}>
              <span>{nomeDe(b.tipo)}</span>
              <button
                type="button"
                className="ed-botao-claro"
                disabled={projeto.blocos.length >= MAXIMO_DE_BLOCOS}
                onClick={() => e.devolver(b.id)}
              >
                Devolver
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PainelAdicionar({
  projeto,
  e,
  aoAdicionar,
}: {
  projeto: Projeto;
  e: EstadoDoEditor;
  aoAdicionar: () => void;
}) {
  const cheio = projeto.blocos.length >= MAXIMO_DE_BLOCOS;
  return (
    <div className="ed-form">
      {cheio && (
        <p className="ed-aviso">A página já tem {MAXIMO_DE_BLOCOS} seções. Esconda uma para adicionar outra.</p>
      )}
      <ul className="ed-biblioteca">
        {Object.values(REGISTRO).map((d) => (
          <li key={d.tipo}>
            <b>{d.nome}</b>
            <span>{d.variacoes.map((v) => v.nome).join(' · ')}</span>
            {d.fixo ? (
              <span className="ed-fixa">já está na página</span>
            ) : (
              <button
                type="button"
                className="ed-botao-claro"
                disabled={cheio}
                onClick={() => {
                  e.adicionar(d.tipo);
                  aoAdicionar();
                }}
              >
                Adicionar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const CANTOS: Array<[Cantos, string]> = [
  ['retos', 'Retos'],
  ['suaves', 'Suaves'],
  ['redondos', 'Redondos'],
];
const FONTES: Array<[Fontes, string]> = [
  ['par-nuvem', 'Nunito'],
  ['par-1', 'Serifada e grotesca'],
];

export function PainelEstilo({
  projeto,
  aoMudar,
}: {
  projeto: Projeto;
  aoMudar: (mudanca: Partial<Projeto>, aviso: string) => void;
}) {
  return (
    <div className="ed-form">
      <fieldset className="ed-variacoes">
        <legend>Cor</legend>
        <div className="ed-amostras" role="radiogroup">
          {NUVEM.paletas.map((p, i) => (
            <button
              key={p.nome}
              type="button"
              role="radio"
              aria-checked={!projeto.corPropria && projeto.paleta === i}
              onClick={() => aoMudar({ paleta: i, corPropria: undefined }, `Cor ${p.nome}`)}
            >
              <span
                className="ed-amostra"
                style={{ background: gerarPaleta(p.origem, NUVEM.esquema).claro.destaque }}
                aria-hidden="true"
              />
              {p.nome}
            </button>
          ))}
        </div>
        <label className="ed-chip-cor" data-ativo={Boolean(projeto.corPropria)}>
          <span
            className="ed-amostra"
            style={{ background: projeto.corPropria ?? NUVEM.paletas[projeto.paleta]?.origem ?? '#8c77e0' }}
            aria-hidden="true"
          />
          {projeto.corPropria ? '✓ ' : ''}Minha cor
          <input
            type="color"
            aria-label="Escolher minha cor"
            value={projeto.corPropria ?? NUVEM.paletas[projeto.paleta]?.origem ?? '#8c77e0'}
            onChange={(ev) => aoMudar({ corPropria: ev.target.value }, 'Cor própria')}
          />
        </label>
      </fieldset>
      <fieldset className="ed-variacoes">
        <legend>Cantos</legend>
        <div role="radiogroup">
          {CANTOS.map(([id, nome]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={projeto.cantos === id}
              onClick={() => aoMudar({ cantos: id }, `Cantos ${nome.toLowerCase()}`)}
            >
              {nome}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="ed-variacoes">
        <legend>Fonte</legend>
        <div role="radiogroup">
          {FONTES.map(([id, nome]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={projeto.fontes === id}
              onClick={() => aoMudar({ fontes: id }, `Fonte ${nome}`)}
            >
              {nome}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="ed-variacoes">
        <legend>Modo iniciante</legend>
        <p className="ed-dica">
          Esconde Números, Marcas e Público e destaca seus vídeos e o que você entrega. Nada se perde: é só ligar de
          novo.
        </p>
        <div role="radiogroup">
          {([false, true] as const).map((v) => (
            <button
              key={String(v)}
              type="button"
              role="radio"
              aria-checked={projeto.modoIniciante === v}
              onClick={() => aoMudar({ modoIniciante: v }, v ? 'Modo iniciante ligado' : 'Modo iniciante desligado')}
            >
              {v ? 'Ligado' : 'Desligado'}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="ed-variacoes">
        <legend>Clima</legend>
        <div role="radiogroup">
          {(['claro', 'escuro'] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={projeto.clima === c}
              onClick={() => aoMudar({ clima: c }, `Clima ${c}`)}
            >
              {c === 'claro' ? 'Claro' : 'Escuro'}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
