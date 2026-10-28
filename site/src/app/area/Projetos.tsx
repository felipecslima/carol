// Projetos: o site (e o mídia kit, que sai do mesmo conteúdo), com miniatura, estado e botão principal (DEV-042).
// Limite de 1 site e 1 mídia kit por conta.
import { motion } from 'motion/react';
import { entrada } from '../movimento';
import { useState } from 'react';
import { infoDoEstado } from '@lib/estados';
import { Miniatura } from './Miniatura';
import { dataCurta } from '../formatar';
import { apagarProjeto, pedirPdfDoKit, type Resumo } from '../nuvem';
import { Marcas } from './Marcas';

function LinkDoPortfolio({ slug, noAr }: { slug: string; noAr: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const url = `${window.location.origin}/c/${slug}/`;
  return (
    <div className="ar-link">
      <span className="ar-link-url">{noAr ? url : `/c/${slug} (reservado)`}</span>
      {noAr && (
        <>
          <button
            type="button"
            className="ed-botao-claro"
            onClick={() => void navigator.clipboard.writeText(url).then(() => setCopiado(true))}
          >
            {copiado ? 'Link copiado' : 'Copiar link'}
          </button>
          <a className="ar-link-texto" href={url} target="_blank" rel="noopener">
            Abrir
          </a>
        </>
      )}
    </div>
  );
}

export function Projetos({ resumo, aoMudar }: { resumo: Resumo | null; aoMudar: () => void }) {
  const [confirmando, setConfirmando] = useState(false);
  const [apagando, setApagando] = useState(false);
  const [preparando, setPreparando] = useState(false);
  const [erroDoPdf, setErroDoPdf] = useState<string | null>(null);

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
  const noAr = resumo.estado === 'no_ar' || resumo.estado === 'edicao_travada';
  async function baixarPdf() {
    setPreparando(true);
    setErroDoPdf(null);
    const r = await pedirPdfDoKit();
    setPreparando(false);
    if ('link' in r) window.location.href = r.link;
    else setErroDoPdf(r.erro);
  }

  async function apagar() {
    setApagando(true);
    const ok = await apagarProjeto(resumo!.id);
    setApagando(false);
    if (ok) aoMudar();
  }

  return (
    <section className="ar-secao">
      <h1 className="ar-titulo">Projetos</h1>
      <motion.article className="ar-projeto" {...entrada(0.05)}>
        <Miniatura projeto={resumo.projeto} />
        <div className="ar-projeto-info">
          <span className={`ar-estado ar-estado--${resumo.estado}`}>{info.rotulo}</span>
          <h2>Site</h2>
          <p className="ed-dica">
            {info.descricao} Atualizado em {dataCurta(resumo.atualizadoEm).replace('.', '')}
          </p>
          <div className="ar-acoes">
            <a className="ed-primario ar-botao" href="/app/editor/">
              {info.botao.texto}
            </a>
          </div>
          {resumo.slug && <LinkDoPortfolio slug={resumo.slug} noAr={noAr} />}
          <div className="ar-secundarios">
            <a className="ar-link-texto" href="/app/editor/?ver=1">
              Ver como a marca vê
            </a>
            {/* no ar: o PDF guardado, gerado no servidor da versão publicada (DEV-151); antes disso, a prévia com marca
                d'água pelo próprio navegador */}
            {noAr ? (
              <button type="button" className="ar-link-texto" disabled={preparando} onClick={() => void baixarPdf()}>
                {preparando ? 'Preparando o PDF…' : 'Baixar mídia kit em PDF'}
              </button>
            ) : (
              <a className="ar-link-texto" href="/app/midia-kit/">
                Mídia kit em PDF
              </a>
            )}
          </div>
          {erroDoPdf && (
            <p className="ed-aviso" role="alert">
              {erroDoPdf} <a href="/app/midia-kit/">Abrir o mídia kit para salvar pelo navegador</a>
            </p>
          )}
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
      </motion.article>
      {(resumo.estado === 'no_ar' || resumo.estado === 'edicao_travada') && <Marcas resumo={resumo} />}
      <p className="ed-dica">
        Cada conta tem 1 site e 1 mídia kit. O mídia kit usa o mesmo conteúdo do site: mudou um, mudou o outro.
      </p>
    </section>
  );
}
