import { reprovar } from './confianca';
import { TELAS } from './dicionario';
import type { ItemLista, PrintLido } from './tipos';
import { distancia } from './util';

/** Uma validação reprovada: o aviso, os prints e os campos que ela põe em dúvida. */
export interface Falha {
  aviso: string;
  arquivos: string[];
  /** nomes em `campos`, ou nome de lista (`faixa_etaria`, `genero`) */
  campos: string[];
}

const TELAS_DE_INSIGHTS = ['painel', 'visao_geral', 'visualizacoes', 'interacoes', 'publico'];
/** diferença aceita entre o mesmo número em prints diferentes */
const TOLERANCIA_RELATIVA = 0.01;
/** "8,7 mil" do cartão do perfil é arredondado: aceita 6% de diferença para o total */
const TOLERANCIA_RESUMO = 0.06;
/** soma por formato em relação ao total (os formatos vêm arredondados, "7,4 mil") */
const FORMATO_MINIMO = 0.8;
const FORMATO_MAXIMO = 1.05;
/** letras trocadas pelo OCR no nome da conta */
const TOLERANCIA_CONTA = 2;

const soma = (ns: number[]) => ns.reduce((a, b) => a + b, 0);
const divergem = (a: number, b: number, tolerancia: number) => Math.abs(a - b) > Math.max(a, b) * tolerancia;

/** Validações que cabem em um print só (seção 9.1). */
export function validarPrint(p: PrintLido): Falha[] {
  const falhas: Falha[] = [];
  const falha = (aviso: string, campos: string[]) => falhas.push({ aviso, arquivos: [p.arquivo], campos });
  const v = (nome: string): number | undefined => p.campos[nome]?.valor ?? undefined;

  const pctSeg = v('pct_seguidores');
  const pctNao = v('pct_nao_seguidores');
  if (pctSeg !== undefined && pctNao !== undefined) {
    const s = pctSeg + pctNao;
    if (s < 98 || s > 102) falha('soma_seguidores_invalida', ['pct_seguidores', 'pct_nao_seguidores']);
  }

  const views = v('visualizacoes');
  for (const nome of ['contas_alcancadas', 'visualizadores']) {
    const n = v(nome);
    if (n !== undefined && views !== undefined && n > views) falha('alcance_maior_que_visualizacoes', [nome, 'visualizacoes']);
  }

  // Stories + Reels + Posts + ao vivo ≈ total (os formatos aparecem arredondados)
  const formatos = ['views_stories', 'views_reels', 'views_posts', 'views_videos_ao_vivo'].filter((n) => v(n) !== undefined);
  if (views !== undefined && formatos.length >= 2) {
    const s = soma(formatos.map((n) => v(n)!));
    if (s < views * FORMATO_MINIMO || s > views * FORMATO_MAXIMO) falha('formatos_nao_batem_com_total', ['visualizacoes', ...formatos]);
  }

  const faixas = p.listas?.faixa_etaria;
  if (faixas) {
    const s = soma(faixas.map((i) => i.pct));
    if (s < 97 || s > 103) falha('soma_faixa_etaria_invalida', ['faixa_etaria']);
  }
  const genero = p.listas?.genero;
  if (genero) {
    const s = soma(genero.map((i) => i.pct));
    if (s < 97 || s > 103) falha('soma_genero_invalida', ['genero']);
  }

  const defs = p.tela === 'desconhecida' || p.tela === 'aba_reels' ? undefined : TELAS[p.tela];
  const permiteNegativo = (nome: string) =>
    defs?.campos[nome]?.permiteNegativo ||
    Object.values(defs?.secoes ?? {}).some((s) => s.itens?.[nome]?.permiteNegativo);
  const negativos = Object.entries(p.campos)
    .filter(([nome, c]) => (c.valor ?? 0) < 0 && !permiteNegativo(nome))
    .map(([n]) => n);
  const listasNegativas = Object.entries(p.listas ?? {})
    .filter(([, l]) => (l as ItemLista[]).some((i) => i.pct < 0))
    .map(([n]) => n);
  if (negativos.length || listasNegativas.length) falha('valor_negativo', [...negativos, ...listasNegativas]);

  return falhas;
}

/** Validações que cruzam prints. `contaCadastrada` é o @ da creator no cadastro (sem @). */
export function validarEntrePrints(prints: PrintLido[], contaCadastrada?: string): Falha[] {
  const falhas: Falha[] = [];
  const com = (nome: string) => prints.filter((p) => p.campos[nome]?.valor != null);
  const valor = (p: PrintLido, nome: string) => p.campos[nome].valor!;

  // o mesmo número em prints diferentes tem que bater
  for (const nome of ['seguidores', 'visualizacoes', 'visualizadores']) {
    const lista = com(nome);
    if (lista.length < 2) continue;
    const valores = lista.map((p) => valor(p, nome));
    if (divergem(Math.max(...valores), Math.min(...valores), TOLERANCIA_RELATIVA)) {
      falhas.push({ aviso: `${nome}_divergentes`, arquivos: lista.map((p) => p.arquivo), campos: [nome] });
    }
  }

  // "8,7 mil visualizações" do perfil contra o total do painel
  for (const r of com('visualizacoes_resumo')) {
    for (const t of com('visualizacoes')) {
      if (divergem(valor(r, 'visualizacoes_resumo'), valor(t, 'visualizacoes'), TOLERANCIA_RESUMO)) {
        falhas.push({ aviso: 'visualizacoes_divergentes', arquivos: [r.arquivo, t.arquivo], campos: ['visualizacoes_resumo', 'visualizacoes'] });
      }
    }
  }

  for (const e of com('contas_com_engajamento')) {
    for (const a of com('contas_alcancadas')) {
      if (valor(e, 'contas_com_engajamento') > valor(a, 'contas_alcancadas')) {
        falhas.push({ aviso: 'engajamento_maior_que_alcance', arquivos: [e.arquivo, a.arquivo], campos: ['contas_com_engajamento', 'contas_alcancadas'] });
      }
    }
  }

  const contas = prints.filter((p) => p.conta !== null);
  const referencia = contaCadastrada?.replace(/^@/, '').toLowerCase() ?? contas[0]?.conta?.valor;
  if (referencia) {
    const diferentes = contas.filter((p) => distancia(p.conta!.valor, referencia) > TOLERANCIA_CONTA);
    if (diferentes.length) falhas.push({ aviso: 'conta_diferente', arquivos: diferentes.map((p) => p.arquivo), campos: [] });
  }

  // período: datas quando os dois têm; senão, o número de dias
  const insights = prints.filter((p) => TELAS_DE_INSIGHTS.includes(p.tela) && p.periodo !== null);
  const chavesDatas = new Set(insights.filter((p) => p.periodo!.inicio).map((p) => `${p.periodo!.inicio}/${p.periodo!.fim}`));
  const chavesDias = new Set(insights.map((p) => p.periodo!.dias));
  if (chavesDatas.size > 1 || chavesDias.size > 1) {
    falhas.push({ aviso: 'periodos_diferentes', arquivos: insights.map((p) => p.arquivo), campos: [] });
  }

  return falhas;
}

/** Registra os avisos e baixa a confiança dos campos reprovados. */
export function aplicarFalhas(prints: PrintLido[], falhas: Falha[]): void {
  for (const f of falhas) {
    for (const p of prints.filter((x) => f.arquivos.includes(x.arquivo))) {
      if (!p.avisos.includes(f.aviso)) p.avisos.push(f.aviso);
      for (const nome of f.campos) {
        if (p.campos[nome]) reprovar(p.campos[nome]);
        p.listas?.[nome as keyof typeof p.listas]?.forEach(reprovar);
      }
    }
  }
}
