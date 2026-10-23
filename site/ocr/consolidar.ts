import { LIMITE_CONFIANCA } from './confianca';
import type { Campo, Consolidado, ItemLista, PorFormato, PrintLido } from './tipos';

type Fonte = { valor: number; arquivo: string };

/** Números sem os quais o mídia kit não fecha. */
const ESSENCIAIS_DO_KIT = ['perfil.seguidores', 'visualizacoes.total', 'reels'];

/** Melhor leitura confiável de um campo, entre as telas dadas (maior confiança vence). */
function melhor(prints: PrintLido[], telas: string[], nome: string): Fonte | null {
  let escolhido: { campo: Campo; arquivo: string } | undefined;
  for (const p of prints) {
    const campo = p.campos[nome];
    if (!telas.includes(p.tela) || !campo || campo.valor === null || campo.confianca < LIMITE_CONFIANCA) continue;
    if (!escolhido || campo.confianca > escolhido.campo.confianca) escolhido = { campo, arquivo: p.arquivo };
  }
  return escolhido ? { valor: escolhido.campo.valor!, arquivo: escolhido.arquivo } : null;
}

const minimo = (itens: ItemLista[]) => Math.min(...itens.map((i) => i.confianca));

function lista(prints: PrintLido[], nome: 'cidades' | 'faixa_etaria' | 'genero') {
  const p = prints
    .filter((p) => p.listas?.[nome]?.length && p.listas[nome]!.every((i) => i.confianca >= LIMITE_CONFIANCA))
    .sort((a, b) => minimo(b.listas![nome]!) - minimo(a.listas![nome]!))[0];
  return p ? { itens: p.listas![nome]!, arquivo: p.arquivo } : null;
}

/**
 * Junta os prints no JSON da creator. Só copia o que foi lido com confiança (nada é calculado)
 * e guarda em `origem` de qual print veio cada número. Os totais vêm do painel atual; as telas
 * antigas da spec entram como alternativa.
 */
export function consolidar(prints: PrintLido[], contaCadastrada?: string): Consolidado {
  const origem: Record<string, string> = {};
  const registrar = (caminho: string, ...fontes: (Fonte | null)[]) => {
    const f = fontes.find((x) => x);
    if (f) origem[caminho] = f.arquivo;
    return f?.valor ?? null;
  };
  const painel = ['painel'];

  const porFormato = (prefixo: string, caminho: string): PorFormato => ({
    stories: registrar(`${caminho}.stories`, melhor(prints, painel, `${prefixo}_stories`)),
    reels: registrar(`${caminho}.reels`, melhor(prints, painel, `${prefixo}_reels`)),
    posts: registrar(`${caminho}.posts`, melhor(prints, painel, `${prefixo}_posts`)),
    videos_ao_vivo: registrar(`${caminho}.videos_ao_vivo`, melhor(prints, painel, `${prefixo}_videos_ao_vivo`)),
  });

  const comPeriodo = prints.find((p) => p.periodo?.inicio) ?? prints.find((p) => p.periodo);
  // o cadastro vale mais que o OCR do nome (o OCR troca letras: "joeleslima")
  const conta = contaCadastrada?.replace(/^@/, '').toLowerCase() ?? prints.find((p) => p.conta)?.conta?.valor ?? null;

  const cidades = lista(prints, 'cidades');
  const faixas = lista(prints, 'faixa_etaria');
  const genero = lista(prints, 'genero');
  if (cidades) origem['publico.cidades'] = cidades.arquivo;
  if (faixas) origem['publico.faixa_etaria'] = faixas.arquivo;
  if (genero) origem['publico.genero'] = genero.arquivo;
  const pctGenero = (nome: string) => genero?.itens.find((i) => i.nome === nome)?.pct ?? null;

  const comGrade = prints.filter((p) => p.reels?.length);
  const reels = comGrade.flatMap((p) =>
    p.reels!.filter((c) => c.confianca >= LIMITE_CONFIANCA).map((c) => ({
      arquivo: p.arquivo, linha: c.linha, coluna: c.coluna, views: c.valor,
    })),
  );
  if (reels.length) origem.reels = [...new Set(reels.map((r) => r.arquivo))].join(', ');

  const avisos = [...new Set(prints.flatMap((p) => p.avisos))];
  if (comGrade.length > 1) avisos.push('reels_de_varios_prints');

  const consolidado: Consolidado = {
    conta,
    periodo: comPeriodo?.periodo
      ? { dias: comPeriodo.periodo.dias, inicio: comPeriodo.periodo.inicio, fim: comPeriodo.periodo.fim }
      : null,
    perfil: {
      seguidores: registrar('perfil.seguidores', melhor(prints, ['perfil'], 'seguidores'), melhor(prints, painel, 'seguidores')),
      publicacoes: registrar('perfil.publicacoes', melhor(prints, ['perfil'], 'publicacoes')),
      seguindo: registrar('perfil.seguindo', melhor(prints, ['perfil'], 'seguindo')),
      seguidores_liquidos: registrar('perfil.seguidores_liquidos', melhor(prints, painel, 'seguidores_liquidos')),
      visitas: registrar('perfil.visitas', melhor(prints, painel, 'visitas_perfil')),
      toques_link: registrar('perfil.toques_link', melhor(prints, painel, 'toques_link')),
    },
    visualizacoes: {
      total: registrar(
        'visualizacoes.total',
        melhor(prints, painel, 'visualizacoes'),
        melhor(prints, ['visualizacoes'], 'visualizacoes'),
        melhor(prints, ['visao_geral'], 'visualizacoes'),
      ),
      visualizadores: registrar('visualizacoes.visualizadores', melhor(prints, painel, 'visualizadores')),
      contas_alcancadas: registrar('visualizacoes.contas_alcancadas', melhor(prints, ['visualizacoes'], 'contas_alcancadas')),
      pct_seguidores: registrar('visualizacoes.pct_seguidores', melhor(prints, ['visualizacoes'], 'pct_seguidores')),
      pct_nao_seguidores: registrar('visualizacoes.pct_nao_seguidores', melhor(prints, ['visualizacoes'], 'pct_nao_seguidores')),
      por_formato: porFormato('views', 'visualizacoes.por_formato'),
    },
    interacoes: {
      total: registrar(
        'interacoes.total',
        melhor(prints, ['interacoes'], 'interacoes'),
        melhor(prints, ['visao_geral'], 'interacoes'),
      ),
      contas_com_engajamento: registrar('interacoes.contas_com_engajamento', melhor(prints, ['interacoes'], 'contas_com_engajamento')),
      por_formato: porFormato('interacoes', 'interacoes.por_formato'),
    },
    publico: {
      cidades: cidades?.itens.map((i) => ({ nome: i.nome, pct: i.pct })) ?? [],
      faixa_etaria: faixas?.itens.map((i) => ({ faixa: i.nome, pct: i.pct })) ?? [],
      genero: { mulheres: pctGenero('mulheres'), homens: pctGenero('homens') },
    },
    reels,
    origem,
    avisos,
    faltando: [],
  };
  consolidado.faltando = ESSENCIAIS_DO_KIT.filter((c) => !(c in origem));
  return consolidado;
}
