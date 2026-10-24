// Projetos: o site (e o mídia kit, que sai do mesmo conteúdo), com miniatura, estado e botão principal (DEV-042).
// Limite de 1 site e 1 mídia kit por conta.
import { useState } from 'react';
import { Bloco } from '@blocks/Bloco';
import { infoDoEstado } from '@lib/estados';
import { REGISTRO } from '@blocks/registro';
import { blocosVisiveis } from '@lib/projeto';
import { temaDoProjeto } from '../editor/tema';
import { dataCurta } from '../formatar';
import { apagarProjeto, type Resumo } from '../nuvem';

export function Projetos({ resumo, aoMudar }: { resumo: Resumo | null; aoMudar: () => void }) {
  const [confirmando, setConfirmando] = useState(false);
  const [apagando, setApagando] = useState(false);

  if (!resumo)
    return (
      <section className="ar-secao">
        <h1 className="ar-titulo">Projetos</h1>
        <div className="ar-vazio">
          <p>Você ainda não tem um portfólio. Leva uns minutos.</p>
          <a className="ed-primario ar-botao" href="/app/novo/">
            Criar meu portfólio
          </a>
        </div>
      </section>
    );

  const info = infoDoEstado(resumo.estado);
  const capa = blocosVisiveis(resumo.projeto, REGISTRO).find((b) => b.tipo === 'capa');
  const titulo = String(capa?.dados.titulo ?? 'Meu portfólio');

  async function apagar() {
    setApagando(true);
    const ok = await apagarProjeto(resumo!.id);
    setApagando(false);
    if (ok) aoMudar();
  }

  return (
    <section className="ar-secao">
      <h1 className="ar-titulo">Projetos</h1>
      <article className="ar-projeto">
        <div className="ar-miniatura pagina" style={temaDoProjeto(resumo.projeto)} aria-hidden="true">
          {capa && <Bloco bloco={capa} modo="publicado" />}
        </div>
        <div className="ar-projeto-info">
          <span className={`ar-estado ar-estado--${resumo.estado}`}>{info.rotulo}</span>
          <h2>Site</h2>
          <p className="ar-projeto-titulo">{titulo}</p>
          <p className="ed-dica">
            {info.descricao} Atualizado em {dataCurta(resumo.atualizadoEm).replace('.', '')}
          </p>
          <div className="ar-acoes">
            <a className="ed-primario ar-botao" href="/app/editor/">
              {info.botao.texto}
            </a>
            <a className="ed-botao-claro" href="/app/midia-kit/">
              Mídia kit em PDF
            </a>
          </div>
          {!confirmando ? (
            <button type="button" className="ed-link" onClick={() => setConfirmando(true)}>
              Apagar este projeto
            </button>
          ) : (
            <div className="ed-aviso" role="alert">
              <p>
                Apagar o projeto tira o site e o mídia kit da sua conta. Suas fotos e vídeos continuam em Mídias. Isso
                não tem volta.
              </p>
              <div className="ar-acoes">
                <button type="button" className="ed-botao-claro" disabled={apagando} onClick={() => void apagar()}>
                  {apagando ? 'Apagando…' : 'Sim, apagar'}
                </button>
                <button type="button" className="ed-link" onClick={() => setConfirmando(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
      <p className="ed-dica">
        Cada conta tem 1 site e 1 mídia kit. O mídia kit usa o mesmo conteúdo do site: mudou um, mudou o outro.
      </p>
    </section>
  );
}
