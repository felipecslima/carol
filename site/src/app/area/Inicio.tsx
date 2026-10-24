// Início: abre sempre num cartão grande com o próximo passo (DEV-041), mais o resumo do portfólio.
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { infoDoEstado } from '@lib/estados';
import { proximoPasso } from '@lib/proximo-passo';
import { progresso } from '@lib/progresso';
import { revisar } from '@lib/revisao';
import type { Resumo } from '../nuvem';

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
  return (
    <section className="ar-secao">
      <h1 className="ar-ola">{nome ? `Oi, ${nome}` : 'Oi'}</h1>
      <article className="ar-passo">
        <span className="ar-etiqueta">Próximo passo</span>
        <h2>{passo.titulo}</h2>
        <p>{passo.texto}</p>
        <a className="ed-primario ar-botao" href={passo.acao.href}>
          {passo.acao.rotulo}
        </a>
      </article>
      {projeto && (
        <div className="ar-resumo">
          <div>
            <b>{infoDoEstado(resumo.estado).rotulo}</b>
            <span>Estado do portfólio</span>
          </div>
          <div>
            <b>
              {seus} de {total}
            </b>
            <span>itens já são seus</span>
          </div>
        </div>
      )}
    </section>
  );
}
