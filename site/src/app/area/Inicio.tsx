// Início: abre sempre num cartão grande com o próximo passo (DEV-041); embaixo, o portfólio dela em miniatura.
import { motion } from 'motion/react';
import { entrada, SUAVE } from '../movimento';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { REGISTRO } from '@blocks/registro';
import { infoDoEstado } from '@lib/estados';
import { proximoPasso } from '@lib/proximo-passo';
import { progresso } from '@lib/progresso';
import { revisar } from '@lib/revisao';
import type { Resumo } from '../nuvem';
import { LiberarEdicao } from './LiberarEdicao';
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
    slug: resumo?.slug,
  });
  const travada = resumo?.acesso.momento === 'travada';
  const incompleto = Boolean(projeto) && seus < total && !travada;
  return (
    <section className="ar-secao ar-secao--inicio">
      <motion.h1 className="ar-ola" {...entrada()}>
        Oi{nome ? ', ' : ''}
        {nome && <em>{nome}</em>}
      </motion.h1>
      <motion.article className="ar-passo" {...entrada(0.05)}>
        <h2>{passo.titulo}</h2>
        <p>{passo.texto}</p>
        {incompleto && (
          <div className="ar-barra" role="img" aria-label={`${seus} de ${total} itens já são seus`}>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${(seus / total) * 100}%` }}
              transition={{ duration: 0.9, ease: SUAVE, delay: 0.3 }}
            />
          </div>
        )}
        <div className="ar-acoes">
          <a className={passo.discreta ? 'ar-link-claro' : 'ed-primario ar-botao'} href={passo.acao.href}>
            {passo.acao.rotulo}
          </a>
          {passo.secundaria && (
            <a className="ar-link-claro" href={passo.secundaria.href}>
              {passo.secundaria.rotulo}
            </a>
          )}
        </div>
      </motion.article>
      {travada && (
        <motion.div {...entrada(0.1)}>
          <LiberarEdicao jaPedida={resumo.acesso.edicaoPedida} />
        </motion.div>
      )}
      {projeto && resumo && (
        <motion.div className="ar-portfolio" {...entrada(0.18)}>
          <Miniatura projeto={projeto} />
          <span className="ar-portfolio-info">
            <b>Seu portfólio</b>
            <span>
              {travada
                ? 'No ar · edição travada'
                : `${infoDoEstado(resumo.estado).rotulo} · ${seus} de ${total} itens já são seus`}
            </span>
          </span>
          <a className="ar-portfolio-link" href="/app/editor/" aria-label="Abrir o editor do seu portfólio" />
        </motion.div>
      )}
    </section>
  );
}
