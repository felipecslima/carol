// "Adicionar vários": escolhe de uma vez vários arquivos (do aparelho ou de Minhas mídias) e cria um item para cada um.
// O título do item fica em branco para a creator escrever; a revisão cobra antes de publicar.
import { useRef, useState } from 'react';
import type { Campo } from '@lib/bloco';
import { listarMidias, registrarMidia, type Midia } from '../nuvem';
import { supabase } from '../supabase';
import { dataCurta, textoDeTamanho } from '../formatar';
import { enviarArquivo, mensagemDeErro, problemaDoArquivo } from './upload';
import { Mais } from './icones';

type Dados = Record<string, unknown>;
type Varios = NonNullable<Campo['varios']>;

export function AdicionarVarios({ varios, aoAdicionar }: { varios: Varios; aoAdicionar: (itens: Dados[]) => void }) {
  const [aberto, setAberto] = useState(false);
  const [minhas, setMinhas] = useState<Midia[] | null>(null);
  const [marcadas, setMarcadas] = useState<string[]>([]);
  const [fila, setFila] = useState<{ atual: number; total: number; fracao: number } | null>(null);
  const [erros, setErros] = useState<string[]>([]);
  const entrada = useRef<HTMLInputElement>(null);
  const plural = varios.tipo === 'video' ? 'vídeos' : 'fotos';
  const doItem = (m: { url: string; capa: string }): Dados =>
    varios.tipo === 'video' ? { [varios.campo]: m.url, capa: m.capa } : { [varios.campo]: m.url };

  const abrir = () => {
    setAberto(!aberto);
    if (!aberto && minhas === null) void listarMidias().then(setMinhas);
  };

  async function enviar(arquivos: File[]) {
    const falhas: string[] = [];
    const prontos: Dados[] = [];
    const { data } = await supabase.auth.getSession();
    for (const [i, arquivo] of arquivos.entries()) {
      const problema = problemaDoArquivo(arquivo, varios.tipo);
      if (problema) {
        falhas.push(`${arquivo.name}: ${problema}`);
        continue;
      }
      setFila({ atual: i + 1, total: arquivos.length, fracao: 0 });
      try {
        const enviado = await enviarArquivo(arquivo, varios.tipo, (fracao) =>
          setFila({ atual: i + 1, total: arquivos.length, fracao }),
        );
        if (data.session)
          await registrarMidia(data.session.user.id, {
            ...enviado,
            tipo: varios.tipo,
            nome: arquivo.name,
            bytes: arquivo.size,
          });
        prontos.push(doItem(enviado));
      } catch (e) {
        falhas.push(`${arquivo.name}: ${mensagemDeErro(e)}`);
      }
    }
    setFila(null);
    setErros(falhas);
    setMinhas(null);
    if (prontos.length) {
      aoAdicionar(prontos);
      setAberto(false);
    }
  }

  const disponiveis = (minhas ?? []).filter((m) => m.tipo === varios.tipo);
  const alternar = (id: string) => setMarcadas((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

  return (
    <div className="ed-varios">
      <button type="button" className="ed-botao-claro" aria-expanded={aberto} onClick={abrir} disabled={fila !== null}>
        <Mais /> {varios.rotulo}
      </button>
      {aberto && (
        <div className="ed-varios-painel">
          <label className="ed-botao-claro ed-enviar" aria-disabled={fila !== null}>
            Enviar do aparelho
            <input
              ref={entrada}
              type="file"
              multiple
              accept={varios.tipo === 'video' ? 'video/*,.mov,.mp4' : 'image/*,.heic,.heif'}
              onChange={(e) => {
                const arquivos = Array.from(e.target.files ?? []);
                e.target.value = '';
                if (arquivos.length) void enviar(arquivos);
              }}
            />
          </label>
          <p className="ed-dica">Ou marque {plural} que você já enviou:</p>
          <ul className="ed-escolher ed-escolher--varios" aria-label="Minhas mídias">
            {minhas === null && <li className="ed-dica">Carregando…</li>}
            {minhas && disponiveis.length === 0 && <li className="ed-dica">Você ainda não enviou {plural}.</li>}
            {disponiveis.map((m) => {
              const marcada = marcadas.includes(m.id);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={marcada}
                    aria-label={`${m.nome}, ${textoDeTamanho(m.bytes)}`}
                    onClick={() => alternar(m.id)}
                  >
                    <img src={m.capa} alt="" loading="lazy" />
                    <span className="ed-escolher-nome">{m.nome}</span>
                    <span className="ed-escolher-info">
                      {textoDeTamanho(m.bytes)} · {dataCurta(m.criadoEm)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="ed-primario"
            disabled={marcadas.length === 0}
            onClick={() => {
              aoAdicionar(disponiveis.filter((m) => marcadas.includes(m.id)).map(doItem));
              setMarcadas([]);
              setAberto(false);
            }}
          >
            {marcadas.length === 0
              ? `Marque ${plural} para adicionar`
              : `Adicionar ${marcadas.length} ${marcadas.length === 1 ? plural.slice(0, -1) + '' : plural}`}
          </button>
        </div>
      )}
      {fila && (
        <>
          <div
            className="ed-progresso-envio"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(fila.fracao * 100)}
            aria-label={`Enviando ${fila.atual} de ${fila.total}`}
          >
            <span style={{ width: `${Math.round(fila.fracao * 100)}%` }} />
          </div>
          <span className="ed-dica" role="status">
            Enviando {fila.atual} de {fila.total}… {Math.round(fila.fracao * 100)}%. Não feche a página.
          </span>
        </>
      )}
      {erros.length > 0 && (
        <ul className="ed-aviso" role="alert">
          {erros.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
