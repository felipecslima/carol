import { LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';
// Painéis das abas de baixo: Seções (ordem e bandeja), Adicionar bloco e Estilo.
import { REGISTRO } from '@blocks/registro';
import { MAXIMO_DE_BLOCOS, type Projeto } from '@lib/projeto';
import { gerarPaleta } from '@themes/paleta';
import { NUVEM } from '@themes/modelos/nuvem';
import type { Cantos, Fontes } from '@themes/tokens';
import { Descer, Esconder, Lixeira, Subir } from './icones';
import type { EstadoDoEditor } from './estado';

const nomeDe = (tipo: string) => REGISTRO[tipo]?.nome ?? tipo;

export function PainelSecoes({ projeto, e }: { projeto: Projeto; e: EstadoDoEditor }) {
  return (
    <div className="ed-form">
      <p className="ed-dica">
        {projeto.blocos.length} de {MAXIMO_DE_BLOCOS} seções na página
      </p>
      <LayoutGroup>
        <motion.ol layout className="ed-secoes">
          {projeto.blocos.map((b, i) => {
            const fixo = REGISTRO[b.tipo]?.fixo;
            return (
              <motion.li layout key={b.id} transition={{ type: 'spring', stiffness: 520, damping: 38 }}>
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
                  {!fixo && (
                    <button
                      type="button"
                      className="ed-icone"
                      aria-label={`Remover ${nomeDe(b.tipo)}`}
                      onClick={() => e.remover(b.id)}
                    >
                      <Lixeira />
                    </button>
                  )}
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </LayoutGroup>
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
              <button
                type="button"
                className="ed-icone"
                aria-label={`Remover ${nomeDe(b.tipo)}`}
                onClick={() => e.remover(b.id)}
              >
                <Lixeira />
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

// aceita "#8c77e0", "8c77e0" e "#c7e" (forma curta); devolve "#rrggbb" ou null
function lerHexa(texto: string): string | null {
  const m = texto.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(m)) return `#${[...m].map((c) => c + c).join('')}`.toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(m)) return `#${m}`.toLowerCase();
  return null;
}

export function PainelEstilo({
  projeto,
  aoMudar,
}: {
  projeto: Projeto;
  aoMudar: (mudanca: Partial<Projeto>, aviso: string) => void;
}) {
  const corAtual = projeto.corPropria ?? NUVEM.paletas[projeto.paleta]?.origem ?? '#8c77e0';
  const [hexa, setHexa] = useState(corAtual);
  const [hexaInvalido, setHexaInvalido] = useState(false);
  // a cor mudou por fora (paleta pronta, desfazer): o campo volta a mostrar a cor em uso
  const [corVista, setCorVista] = useState(corAtual);
  if (corVista !== corAtual) {
    setCorVista(corAtual);
    setHexa(corAtual);
    setHexaInvalido(false);
  }
  const digitarHexa = (texto: string) => {
    setHexa(texto);
    const cor = lerHexa(texto);
    setHexaInvalido(false);
    if (cor && cor !== projeto.corPropria) aoMudar({ corPropria: cor }, 'Cor própria');
  };
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
          Minha cor
          <input
            type="color"
            aria-label="Escolher minha cor"
            value={projeto.corPropria ?? NUVEM.paletas[projeto.paleta]?.origem ?? '#8c77e0'}
            onChange={(ev) => aoMudar({ corPropria: ev.target.value }, 'Cor própria')}
          />
        </label>
        <div className="ed-campo ed-hexa">
          <label htmlFor="ed-hexa">Ou digite o código da cor (hexa)</label>
          <input
            id="ed-hexa"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={7}
            placeholder="#8c77e0"
            value={hexa}
            aria-invalid={hexaInvalido}
            aria-describedby={hexaInvalido ? 'ed-hexa-erro' : undefined}
            onChange={(ev) => digitarHexa(ev.target.value)}
            onBlur={() => {
              if (lerHexa(hexa)) setHexa(lerHexa(hexa) as string);
              else setHexaInvalido(true);
            }}
          />
          {hexaInvalido && (
            <p id="ed-hexa-erro" className="ed-erro" role="alert">
              Esse código não parece uma cor. Use 6 letras ou números, como #8c77e0.
            </p>
          )}
        </div>
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
