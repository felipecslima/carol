// Início: abre sempre num cartão grande com o próximo passo (DEV-041); embaixo, o portfólio dela em miniatura.
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { infoDoEstado } from '@lib/estados';
import { proximoPasso } from '@lib/proximo-passo';
import { progresso } from '@lib/progresso';
import { revisar } from '@lib/revisao';
import type { Resumo } from '../nuvem';
import { Miniatura } from './Miniatura';

export function Inicio({ resumo, nome }: { resumo: Resumo | null; nome: string }) {
  const projeto = resumo?.projeto;
  const { seus, total } = projeto ? progresso(projeto, PROJETO_DE_EXEMPLO, REGISTRO) : { seus: 0, total: 0 };
  const passo = proximoPasso({
    temProjeto: Boolean(projeto),
    estado: resumo?.estado ?? 'rascunho',
    alertas: projeto ? revisar(projeto, PROJETO_DE_EXEMPLO, REGISTRO) : [],
    seus,
    total,
    temLink: Boolean(projeto?.link),
  });
  const incompleto = Boolean(projeto) && seus < total;
  return (
    <section className="ar-secao">
      <h1 className="ar-ola">
        Oi{nome ? ', ' : ''}
        {nome && <em>{nome}</em>}
      </h1>
      <article className="ar-passo">
        <span className="ar-etiqueta">Próximo passo</span>
        <h2>{passo.titulo}</h2>
        <p>{passo.texto}</p>
        {incompleto && (
          <div className="ar-barra" role="img" aria-label={`${seus} de ${total} itens já são seus`}>
            <span style={{ width: `${(seus / total) * 100}%` }} />
          </div>
        )}
        <div className="ar-acoes">
          <a className="ed-primario ar-botao" href={passo.acao.href}>
            {passo.acao.rotulo}
          </a>
          {passo.secundaria && (
            <a className="ar-link-claro" href={passo.secundaria.href}>
              {passo.secundaria.rotulo}
            </a>
          )}
        </div>
      </article>
      {projeto && resumo && (
        <div className="ar-portfolio">
          <Miniatura projeto={projeto} />
          <span className="ar-portfolio-info">
            <b>Seu portfólio</b>
            <span>
              {infoDoEstado(resumo.estado).rotulo} · {seus} de {total} itens já são seus
            </span>
          </span>
          <a className="ar-portfolio-link" href="/app/editor/" aria-label="Abrir o editor do seu portfólio" />
        </div>
      )}
    </section>
  );
}
