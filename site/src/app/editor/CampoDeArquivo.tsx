// Campo de foto ou vídeo: botão que abre a galeria do celular, prévia, barra de progresso no próprio campo e
// mensagens claras. O envio roda em segundo plano; o resto da gaveta continua usável.
import { useId, useState } from 'react';
import type { Campo } from '@lib/bloco';
import { Lixeira } from './icones';
import { listarMidias, registrarMidia, type Midia } from '../nuvem';
import { supabase } from '../supabase';
import { enviarArquivo, problemaDoArquivo, type TipoDeArquivo } from './upload';

export function CampoDeArquivo({
  campo,
  valor,
  capa,
  aoMudar,
}: {
  campo: Campo;
  valor: string;
  /** capa já escolhida (só para vídeo): prévia */
  capa?: string;
  /** vídeo preenche também `capa`; foto preenche só o próprio campo */
  aoMudar: (parte: Record<string, string>) => void;
}) {
  const id = useId();
  const tipo: TipoDeArquivo = campo.tipo === 'video' ? 'video' : 'image';
  const [progresso, setProgresso] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [escolhendo, setEscolhendo] = useState(false);
  const [minhas, setMinhas] = useState<Midia[] | null>(null);

  async function escolher(arquivo: File | undefined) {
    if (!arquivo) return;
    const problema = problemaDoArquivo(arquivo, tipo);
    if (problema) return setErro(problema);
    setErro(null);
    setProgresso(0);
    try {
      const enviado = await enviarArquivo(arquivo, tipo, setProgresso);
      const { data } = await supabase.auth.getSession();
      if (data.session)
        await registrarMidia(data.session.user.id, { ...enviado, tipo, nome: arquivo.name, bytes: arquivo.size });
      setMinhas(null);
      aoMudar(tipo === 'video' ? { [campo.id]: enviado.url, capa: enviado.capa } : { [campo.id]: enviado.url });
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'O envio falhou. Tente de novo.');
    } finally {
      setProgresso(null);
    }
  }

  const previa = tipo === 'video' ? capa : valor;
  const enviando = progresso !== null;
  return (
    <div className="ed-arquivo">
      <span className="ed-arquivo-rotulo">{campo.rotulo}</span>
      <div className="ed-arquivo-corpo">
        {previa ? (
          <img src={previa} alt="" className="ed-arquivo-previa" />
        ) : (
          <span className="ed-arquivo-previa ed-arquivo-vazio" aria-hidden="true" />
        )}
        <div className="ed-arquivo-acoes">
          <label className="ed-botao-claro ed-enviar" aria-disabled={enviando}>
            {valor ? 'Trocar' : tipo === 'video' ? 'Enviar vídeo' : 'Enviar foto'}
            <input
              id={id}
              type="file"
              accept={tipo === 'video' ? 'video/*,.mov,.mp4' : 'image/*,.heic,.heif'}
              disabled={enviando}
              onChange={(e) => {
                void escolher(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          {!enviando && (
            <button
              type="button"
              className="ed-link"
              aria-expanded={escolhendo}
              onClick={() => {
                setEscolhendo(!escolhendo);
                if (!escolhendo && minhas === null) void listarMidias().then(setMinhas);
              }}
            >
              Das minhas mídias
            </button>
          )}
          {valor && !enviando && (
            <button
              type="button"
              className="ed-link"
              onClick={() => aoMudar(tipo === 'video' ? { [campo.id]: '', capa: '' } : { [campo.id]: '' })}
            >
              <Lixeira /> Remover
            </button>
          )}
        </div>
      </div>
      {escolhendo && (
        <ul className="ed-escolher" aria-label="Minhas mídias">
          {minhas === null && <li className="ed-dica">Carregando…</li>}
          {minhas?.filter((m) => m.tipo === tipo).length === 0 && (
            <li className="ed-dica">Você ainda não enviou {tipo === 'video' ? 'vídeos' : 'fotos'}.</li>
          )}
          {(minhas ?? [])
            .filter((m) => m.tipo === tipo)
            .map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  aria-label={`Usar ${m.nome}`}
                  onClick={() => {
                    aoMudar(tipo === 'video' ? { [campo.id]: m.url, capa: m.capa } : { [campo.id]: m.url });
                    setEscolhendo(false);
                  }}
                >
                  <img src={m.capa} alt="" loading="lazy" />
                </button>
              </li>
            ))}
        </ul>
      )}
      {enviando && (
        <div
          className="ed-progresso-envio"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progresso * 100)}
          aria-label={`Enviando ${campo.rotulo}`}
        >
          <span style={{ width: `${Math.round(progresso * 100)}%` }} />
        </div>
      )}
      {enviando && (
        <span className="ed-dica">Enviando… {Math.round(progresso * 100)}%. Você pode continuar editando.</span>
      )}
      {erro && (
        <p className="ed-aviso" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
