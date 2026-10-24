// Campo de foto ou vídeo: botão que abre a galeria do celular, prévia, barra de progresso no próprio campo e
// mensagens claras. O envio roda em segundo plano; o resto da gaveta continua usável.
import { useId, useState } from 'react';
import { chaveDeFoco, type Campo } from '@lib/bloco';
import { Lixeira } from './icones';
import { listarMidias, registrarMidia, type Midia } from '../nuvem';
import { supabase } from '../supabase';
import { enviarArquivo, mensagemDeErro, problemaDoArquivo, type TipoDeArquivo } from './upload';

export function CampoDeArquivo({
  campo,
  valor,
  capa,
  foco,
  aoMudar,
}: {
  campo: Campo;
  valor: string;
  /** capa já escolhida (só para vídeo): prévia */
  capa?: string;
  /** enquadramento atual, "x y" em % (vazio = centro) */
  foco?: string;
  /** vídeo preenche também `capa`; foto preenche só o próprio campo */
  aoMudar: (parte: Record<string, string>) => void;
}) {
  const id = useId();
  const tipo: TipoDeArquivo = campo.tipo === 'video' ? 'video' : 'image';
  const chaveCapa = campo.capaEm ?? 'capa'; // campo que recebe o quadro de capa do vídeo
  const [progresso, setProgresso] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [escolhendo, setEscolhendo] = useState(false);
  const [minhas, setMinhas] = useState<Midia[] | null>(null);
  const [ajustando, setAjustando] = useState(false);
  const chaveFoco = chaveDeFoco(campo);

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
      aoMudar(
        tipo === 'video'
          ? { [campo.id]: enviado.url, ...(guardaCapa ? {} : { [chaveCapa]: enviado.capa, [chaveFoco]: '' }) }
          : { [campo.id]: enviado.url, [chaveFoco]: '' },
      );
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setProgresso(null);
    }
  }

  const previa = tipo === 'video' ? capa : valor;
  const guardaCapa = Boolean(campo.capaSoSeVazia && capa);
  const enviando = progresso !== null;
  return (
    <div className="ed-arquivo">
      <span className="ed-arquivo-rotulo">{campo.rotulo}</span>
      <div className="ed-arquivo-corpo">
        {previa ? (
          <span className={`ed-arquivo-miniatura${tipo === 'video' && valor ? ' ed-arquivo-miniatura--video' : ''}`}>
            <img src={previa} alt="" className="ed-arquivo-previa" />
          </span>
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
          <div className="ed-arquivo-links">
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
                Minhas mídias
              </button>
            )}
            {previa && !enviando && (
              <button
                type="button"
                className="ed-link"
                aria-expanded={ajustando}
                onClick={() => setAjustando(!ajustando)}
              >
                Enquadramento
              </button>
            )}
            {valor && !enviando && (
              <button
                type="button"
                className="ed-link"
                onClick={() =>
                  aoMudar(
                    tipo === 'video' && !campo.capaSoSeVazia
                      ? { [campo.id]: '', [chaveCapa]: '', [chaveFoco]: '' }
                      : tipo === 'video'
                        ? { [campo.id]: '' }
                        : { [campo.id]: '', [chaveFoco]: '' },
                  )
                }
              >
                <Lixeira /> Remover
              </button>
            )}
          </div>
        </div>
      </div>
      {ajustando && previa && (
        <Enquadramento imagem={previa} foco={foco} aoMudar={(novo) => aoMudar({ [chaveFoco]: novo })} />
      )}
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
                    aoMudar(
                      tipo === 'video'
                        ? { [campo.id]: m.url, ...(guardaCapa ? {} : { [chaveCapa]: m.capa, [chaveFoco]: '' }) }
                        : { [campo.id]: m.url, [chaveFoco]: '' },
                    );
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

const lerFoco = (foco?: string): [number, number] => {
  const m = foco?.match(/^(\d{1,3}) (\d{1,3})$/);
  return m ? [Math.min(100, Number(m[1])), Math.min(100, Number(m[2]))] : [50, 50];
};

/** Toque ou arraste na foto para marcar onde está o rosto ou o assunto; o recorte da página acompanha esse ponto.
 *  Os dois controles deslizantes fazem o mesmo para quem usa teclado ou prefere ajustar fino. */
function Enquadramento({ imagem, foco, aoMudar }: { imagem: string; foco?: string; aoMudar: (foco: string) => void }) {
  const [x, y] = lerFoco(foco);
  const marcar = (ev: React.PointerEvent<HTMLDivElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const px = Math.round(Math.min(100, Math.max(0, ((ev.clientX - r.left) / r.width) * 100)));
    const py = Math.round(Math.min(100, Math.max(0, ((ev.clientY - r.top) / r.height) * 100)));
    aoMudar(`${px} ${py}`);
  };
  return (
    <div className="ed-enquadra">
      <p className="ed-dica">Toque na foto onde está o rosto ou o que não pode ser cortado.</p>
      <div
        className="ed-enquadra-foto"
        onPointerDown={(ev) => {
          ev.currentTarget.setPointerCapture(ev.pointerId);
          marcar(ev);
        }}
        onPointerMove={(ev) => ev.buttons === 1 && marcar(ev)}
      >
        <img src={imagem} alt="" draggable={false} />
        <span className="ed-enquadra-ponto" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" />
      </div>
      <label className="ed-enquadra-eixo">
        Esquerda e direita
        <input type="range" min={0} max={100} value={x} onChange={(ev) => aoMudar(`${ev.target.value} ${y}`)} />
      </label>
      <label className="ed-enquadra-eixo">
        Cima e baixo
        <input type="range" min={0} max={100} value={y} onChange={(ev) => aoMudar(`${x} ${ev.target.value}`)} />
      </label>
      <button type="button" className="ed-link" onClick={() => aoMudar('')}>
        Centralizar
      </button>
    </div>
  );
}
