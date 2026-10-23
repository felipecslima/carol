// Aba Mídias: tudo o que a creator já enviou, o espaço usado e como reaproveitar em qualquer seção.
import { useState } from 'react';
import { espacoUsado, listarMidias, removerMidia, textoDeTamanho } from './midias';
import { Lixeira } from './icones';

export function PainelMidias() {
  const [midias, setMidias] = useState(listarMidias);
  return (
    <div className="ed-form">
      <p className="ed-dica">
        {midias.length === 0
          ? 'Fotos e vídeos que você enviar ficam guardados aqui, para usar em qualquer seção sem enviar de novo.'
          : `${midias.length} ${midias.length === 1 ? 'arquivo' : 'arquivos'} · ${textoDeTamanho(espacoUsado(midias))} usados. Para usar um arquivo, abra uma seção e escolha em “Das minhas mídias”.`}
      </p>
      <ul className="ed-midias">
        {midias.map((m) => (
          <li key={m.id}>
            <img src={m.capa} alt="" loading="lazy" />
            <span className="ed-midia-nome">{m.nome}</span>
            <span className="ed-dica">
              {m.tipo === 'video' ? 'Vídeo' : 'Foto'} · {textoDeTamanho(m.bytes)}
            </span>
            <button
              type="button"
              className="ed-link"
              onClick={() => {
                removerMidia(m.id);
                setMidias(listarMidias());
              }}
            >
              <Lixeira /> Tirar da lista
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
