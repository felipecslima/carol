// Aba Mídias do editor e da área: tudo o que a creator já enviou, o espaço usado e como reaproveitar.
import { useEffect, useState } from 'react';
import { dataCurta, espacoUsado, textoDeTamanho } from '../formatar';
import { listarMidias, removerMidia, type Midia } from '../nuvem';
import { Lixeira } from './icones';

export function PainelMidias({ dica = true }: { dica?: boolean }) {
  const [midias, setMidias] = useState<Midia[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [apagando, setApagando] = useState<string | null>(null);

  useEffect(() => {
    void listarMidias().then(setMidias);
  }, []);

  async function tirar(m: Midia) {
    setApagando(m.id);
    setErro(null);
    const ok = await removerMidia(m);
    setApagando(null);
    if (!ok) return setErro('Não deu para apagar agora. Tente de novo em instantes.');
    setMidias((lista) => (lista ?? []).filter((x) => x.id !== m.id));
  }

  if (midias === null)
    return (
      <p className="ed-dica" role="status">
        Carregando suas mídias…
      </p>
    );
  return (
    <div className="ed-form">
      <p className="ed-dica">
        {midias.length === 0
          ? 'Fotos e vídeos que você enviar ficam guardados aqui, para usar em qualquer seção sem enviar de novo.'
          : `${midias.length} ${midias.length === 1 ? 'arquivo' : 'arquivos'} · ${textoDeTamanho(espacoUsado(midias))} usados.${dica ? ' Para usar um arquivo, abra uma seção e escolha em “Das minhas mídias”.' : ''}`}
      </p>
      {erro && (
        <p className="ed-aviso" role="alert">
          {erro}
        </p>
      )}
      <ul className="ed-midias">
        {midias.map((m) => (
          <li key={m.id}>
            <img src={m.capa} alt="" loading="lazy" />
            <span className="ed-midia-nome">{m.nome || (m.tipo === 'video' ? 'Vídeo' : 'Foto')}</span>
            <span className="ed-dica">
              {m.tipo === 'video' ? 'Vídeo' : 'Foto'} · {textoDeTamanho(m.bytes)} · {dataCurta(m.criadoEm)}
            </span>
            <button type="button" className="ed-link" disabled={apagando === m.id} onClick={() => void tirar(m)}>
              <Lixeira /> {apagando === m.id ? 'Apagando…' : 'Apagar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
