// "Meus números": formulário guiado com o caminho no Instagram para achar cada número. Grava no formato do
// consolidado (lib/numeros.ts) e preenche os blocos Números e Público. Os valores vêm da creator, nunca de exemplo.
import { useState } from 'react';
import { FAIXAS_DE_IDADE, numerosVazios, validarNumeros, type Numeros } from '@lib/numeros';
import { Mais, Lixeira } from './icones';

const num = (t: string): number | null => {
  const limpo = t.replace(/\./g, '').replace(',', '.').trim();
  const n = Number(limpo);
  return limpo === '' || Number.isNaN(n) || n < 0 ? null : n;
};
const texto = (n: number | null | undefined) => (n === null || n === undefined ? '' : String(n).replace('.', ','));

function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  dica,
  sufixo,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  dica?: string;
  sufixo?: string;
}) {
  return (
    <div className="ed-campo">
      <label htmlFor={id}>{rotulo}</label>
      <div className="ed-com-sufixo">
        <input id={id} type="text" inputMode="decimal" value={valor} onChange={(e) => aoMudar(e.target.value)} />
        {sufixo && <span>{sufixo}</span>}
      </div>
      {dica && <span className="ed-dica">{dica}</span>}
    </div>
  );
}

export function PainelNumeros({ inicial, aoSalvar }: { inicial: Numeros | undefined; aoSalvar: (n: Numeros) => void }) {
  const [n, setN] = useState<Numeros>(inicial ?? numerosVazios());
  const avisos = validarNumeros(n);
  const aviso = (campo: string) => avisos.find((a) => a.campo === campo)?.mensagem;
  const faixaDe = (faixa: string) => n.publico.faixa_etaria.find((f) => f.faixa === faixa)?.pct;
  const mudarFaixa = (faixa: string, v: string) => {
    const pct = num(v);
    const resto = n.publico.faixa_etaria.filter((f) => f.faixa !== faixa);
    setN({ ...n, publico: { ...n.publico, faixa_etaria: pct === null ? resto : [...resto, { faixa, pct }] } });
  };

  return (
    <div className="ed-form">
      <p className="ed-dica">
        Abra o Instagram → seu perfil → <b>Painel profissional</b> → <b>Insights</b> e escolha o período (por exemplo,
        “Últimos 30 dias”). Digite aqui o que aparece; deixe em branco o que você não tiver.
      </p>

      <fieldset className="ed-lista">
        <legend>Período</legend>
        <div className="ed-duas">
          <div className="ed-campo">
            <label htmlFor="n-inicio">De</label>
            <input
              id="n-inicio"
              type="date"
              value={n.periodo.inicio}
              onChange={(e) => setN({ ...n, periodo: { ...n.periodo, inicio: e.target.value } })}
            />
          </div>
          <div className="ed-campo">
            <label htmlFor="n-fim">Até</label>
            <input
              id="n-fim"
              type="date"
              value={n.periodo.fim}
              onChange={(e) => setN({ ...n, periodo: { ...n.periodo, fim: e.target.value } })}
            />
          </div>
        </div>
        {aviso('periodo') && <p className="ed-aviso">{aviso('periodo')}</p>}
      </fieldset>

      <fieldset className="ed-lista">
        <legend>Seus números</legend>
        <Campo
          id="n-seg"
          rotulo="Seguidores"
          valor={texto(n.perfil.seguidores)}
          aoMudar={(v) => setN({ ...n, perfil: { seguidores: num(v) } })}
          dica="No topo do seu perfil."
        />
        <Campo
          id="n-views"
          rotulo="Visualizações"
          valor={texto(n.visualizacoes.total)}
          aoMudar={(v) => setN({ ...n, visualizacoes: { ...n.visualizacoes, total: num(v) } })}
          dica="Insights → Visualizações, o número grande no topo."
        />
        <Campo
          id="n-alc"
          rotulo="Contas alcançadas"
          valor={texto(n.visualizacoes.contas_alcancadas)}
          aoMudar={(v) => setN({ ...n, visualizacoes: { ...n.visualizacoes, contas_alcancadas: num(v) } })}
          dica="Insights → Visualizações → Contas alcançadas."
        />
        {aviso('visualizacoes') && <p className="ed-aviso">{aviso('visualizacoes')}</p>}
        <Campo
          id="n-int"
          rotulo="Interações"
          valor={texto(n.interacoes.total)}
          aoMudar={(v) => setN({ ...n, interacoes: { ...n.interacoes, total: num(v) } })}
          dica="Insights → Interações."
        />
      </fieldset>

      <fieldset className="ed-lista">
        <legend>Views dos seus vídeos</legend>
        <p className="ed-dica">
          Na aba Reels do seu perfil, digite as views de alguns vídeos. A média vira “média por vídeo”.
        </p>
        {n.reels.map((r, i) => (
          <div className="ed-item ed-item--linha" key={i}>
            <input
              type="text"
              inputMode="decimal"
              aria-label={`Views do vídeo ${i + 1}`}
              value={texto(r.views)}
              onChange={(e) =>
                setN({ ...n, reels: n.reels.map((x, k) => (k === i ? { views: num(e.target.value) ?? 0 } : x)) })
              }
            />
            <button
              type="button"
              className="ed-icone"
              aria-label={`Remover vídeo ${i + 1}`}
              onClick={() => setN({ ...n, reels: n.reels.filter((_, k) => k !== i) })}
            >
              <Lixeira />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="ed-botao-claro"
          onClick={() => setN({ ...n, reels: [...n.reels, { views: 0 }] })}
        >
          <Mais /> Adicionar vídeo
        </button>
      </fieldset>

      <fieldset className="ed-lista">
        <legend>Quem assiste</legend>
        <p className="ed-dica">Insights → Público. Digite as porcentagens.</p>
        <div className="ed-duas">
          <Campo
            id="n-mul"
            rotulo="Mulheres"
            sufixo="%"
            valor={texto(n.publico.genero.mulheres)}
            aoMudar={(v) =>
              setN({ ...n, publico: { ...n.publico, genero: { ...n.publico.genero, mulheres: num(v) } } })
            }
          />
          <Campo
            id="n-hom"
            rotulo="Homens"
            sufixo="%"
            valor={texto(n.publico.genero.homens)}
            aoMudar={(v) => setN({ ...n, publico: { ...n.publico, genero: { ...n.publico.genero, homens: num(v) } } })}
          />
        </div>
        {aviso('publico.genero') && <p className="ed-aviso">{aviso('publico.genero')}</p>}
        <div className="ed-duas">
          {FAIXAS_DE_IDADE.map((f) => (
            <Campo
              key={f}
              id={`n-f-${f}`}
              rotulo={`${f} anos`}
              sufixo="%"
              valor={texto(faixaDe(f))}
              aoMudar={(v) => mudarFaixa(f, v)}
            />
          ))}
        </div>
        {aviso('publico.faixa_etaria') && <p className="ed-aviso">{aviso('publico.faixa_etaria')}</p>}
        <p className="ed-dica">Principais cidades</p>
        {n.publico.cidades.map((c, i) => (
          <div className="ed-item ed-item--linha ed-item--cidade" key={i}>
            <input
              type="text"
              aria-label={`Cidade ${i + 1}`}
              value={c.nome}
              maxLength={40}
              onChange={(e) =>
                setN({
                  ...n,
                  publico: {
                    ...n.publico,
                    cidades: n.publico.cidades.map((x, k) => (k === i ? { ...x, nome: e.target.value } : x)),
                  },
                })
              }
            />
            <input
              type="text"
              inputMode="decimal"
              aria-label={`Porcentagem da cidade ${i + 1}`}
              value={texto(c.pct)}
              onChange={(e) =>
                setN({
                  ...n,
                  publico: {
                    ...n.publico,
                    cidades: n.publico.cidades.map((x, k) => (k === i ? { ...x, pct: num(e.target.value) ?? 0 } : x)),
                  },
                })
              }
            />
            <button
              type="button"
              className="ed-icone"
              aria-label={`Remover cidade ${i + 1}`}
              onClick={() =>
                setN({ ...n, publico: { ...n.publico, cidades: n.publico.cidades.filter((_, k) => k !== i) } })
              }
            >
              <Lixeira />
            </button>
          </div>
        ))}
        {n.publico.cidades.length < 5 && (
          <button
            type="button"
            className="ed-botao-claro"
            onClick={() =>
              setN({ ...n, publico: { ...n.publico, cidades: [...n.publico.cidades, { nome: '', pct: 0 }] } })
            }
          >
            <Mais /> Adicionar cidade
          </button>
        )}
        {aviso('publico.cidades') && <p className="ed-aviso">{aviso('publico.cidades')}</p>}
      </fieldset>

      <button
        type="button"
        className="ed-primario"
        onClick={() =>
          aoSalvar({ ...n, publico: { ...n.publico, cidades: n.publico.cidades.filter((c) => c.nome.trim()) } })
        }
      >
        Usar esses números
      </button>
    </div>
  );
}
