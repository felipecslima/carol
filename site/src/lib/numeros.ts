// Números informados pela creator (DEV-130 e 131), no formato "consolidado" do docs/04-ocr-prints.md (3.2), para
// que a leitura de prints entre depois sem mudar nada. Validações simples, sem IA. Os blocos Números e Público
// são preenchidos a partir daqui (`aplicarNumeros`) e ganham o selo "informado pela creator".
import { z } from 'zod';
import type { Projeto } from './projeto';

const naoNegativo = z.number().min(0);
const pct = z.number().min(0).max(100);

export const numerosSchema = z.object({
  periodo: z.object({ dias: z.number().int().positive(), inicio: z.string(), fim: z.string() }),
  perfil: z.object({ seguidores: naoNegativo.nullable() }),
  visualizacoes: z.object({ total: naoNegativo.nullable(), contas_alcancadas: naoNegativo.nullable() }),
  interacoes: z.object({ total: naoNegativo.nullable(), contas_com_engajamento: naoNegativo.nullable() }),
  publico: z.object({
    cidades: z.array(z.object({ nome: z.string().trim().min(1), pct })),
    faixa_etaria: z.array(z.object({ faixa: z.string().trim().min(1), pct })),
    genero: z.object({ mulheres: pct.nullable(), homens: pct.nullable() }),
  }),
  /** views de cada reel (a média vira "média por vídeo") */
  reels: z.array(z.object({ views: naoNegativo })),
  /** sempre "creator" aqui; a leitura de prints (depois) grava "print" */
  origem: z.enum(['creator', 'print']).default('creator'),
});
export type Numeros = z.infer<typeof numerosSchema>;

export const FAIXAS_DE_IDADE = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'] as const;

export const numerosVazios = (): Numeros => ({
  periodo: { dias: 30, inicio: '', fim: '' },
  perfil: { seguidores: null },
  visualizacoes: { total: null, contas_alcancadas: null },
  interacoes: { total: null, contas_com_engajamento: null },
  publico: { cidades: [], faixa_etaria: [], genero: { mulheres: null, homens: null } },
  reels: [],
  origem: 'creator',
});

export interface Aviso {
  /** caminho do campo, ex. `publico.genero` */
  campo: string;
  mensagem: string;
}

const soma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Validações simples: números não negativos (o schema já cobre), percentuais que somam perto de 100, datas em ordem. */
export function validarNumeros(n: Numeros): Aviso[] {
  const avisos: Aviso[] = [];
  const perto = (valor: number, alvo = 100, folga = 3) => Math.abs(valor - alvo) <= folga;
  const { mulheres, homens } = n.publico.genero;
  if (mulheres !== null && homens !== null && !perto(mulheres + homens))
    avisos.push({ campo: 'publico.genero', mensagem: 'Mulheres e homens deveriam somar perto de 100%.' });
  const faixas = n.publico.faixa_etaria;
  if (faixas.length > 0 && soma(faixas.map((f) => f.pct)) > 103)
    avisos.push({ campo: 'publico.faixa_etaria', mensagem: 'As faixas de idade passam de 100% no total.' });
  const cidades = n.publico.cidades;
  if (cidades.length > 0 && soma(cidades.map((c) => c.pct)) > 103)
    avisos.push({ campo: 'publico.cidades', mensagem: 'As cidades passam de 100% no total.' });
  const { inicio, fim } = n.periodo;
  if (inicio && fim && inicio > fim) avisos.push({ campo: 'periodo', mensagem: 'A data inicial vem depois da final.' });
  const { total, contas_alcancadas } = n.visualizacoes;
  if (total !== null && contas_alcancadas !== null && contas_alcancadas > total)
    avisos.push({ campo: 'visualizacoes', mensagem: 'As contas alcançadas não podem ser mais que as visualizações.' });
  return avisos;
}

/** 18400 → "18,4 mil"; 212000 → "212 mil"; 1200000 → "1,2 mi"; 950 → "950". */
export function formatarNumero(valor: number): string {
  const casas = (x: number) => x.toLocaleString('pt-BR', { maximumFractionDigits: x >= 100 ? 0 : 1 });
  if (valor >= 1_000_000) return `${casas(valor / 1_000_000)} mi`;
  if (valor >= 1_000) return `${casas(valor / 1_000)} mil`;
  return String(Math.round(valor));
}

const pctTexto = (x: number) => `${x.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;

/** "20/09 a 19/10" a partir de datas ISO; vazio se faltar alguma. */
export function textoDoPeriodo({ inicio, fim }: Numeros['periodo']): string {
  const dia = (iso: string) => iso.split('-').reverse().slice(0, 2).join('/');
  return inicio && fim ? `${dia(inicio)} a ${dia(fim)}` : '';
}

type Item = { valor: string; rotulo: string; proporcao?: number };

function itensDeNumeros(n: Numeros): Item[] {
  const itens: Array<[number | null | undefined, string]> = [
    [n.perfil.seguidores, 'seguidores'],
    [n.visualizacoes.total, `views em ${n.periodo.dias} dias`],
    [n.visualizacoes.contas_alcancadas, 'contas alcançadas'],
    [n.interacoes.total, 'interações'],
    [n.reels.length ? soma(n.reels.map((r) => r.views)) / n.reels.length : null, 'média por vídeo'],
  ];
  const preenchidos = itens.filter((i): i is [number, string] => typeof i[0] === 'number');
  const maior = Math.max(1, ...preenchidos.map(([v]) => v));
  return preenchidos.map(([v, rotulo]) => ({
    valor: formatarNumero(v),
    rotulo,
    proporcao: Math.round((v / maior) * 100),
  }));
}

function itensDePublico(n: Numeros, variacao: string): Item[] {
  if (variacao === 'cidades')
    return [...n.publico.cidades]
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5)
      .map((c) => ({ valor: pctTexto(c.pct), rotulo: c.nome, proporcao: c.pct }));
  const faixas = [...n.publico.faixa_etaria]
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3)
    .map((f) => ({ valor: pctTexto(f.pct), rotulo: `${f.faixa} anos`, proporcao: f.pct }));
  const { mulheres, homens } = n.publico.genero;
  const genero =
    mulheres !== null && homens !== null
      ? [
          mulheres >= homens
            ? { valor: pctTexto(mulheres), rotulo: 'mulheres', proporcao: mulheres }
            : { valor: pctTexto(homens), rotulo: 'homens', proporcao: homens },
        ]
      : [];
  return [...faixas, ...genero];
}

/** Grava os números no projeto e preenche os blocos Números e Público (sem marca de exemplo, com selo e período). */
export function aplicarNumeros(projeto: Projeto, n: Numeros): Projeto {
  const periodo = textoDoPeriodo(n.periodo);
  const selo = `Informado pelo próprio perfil${periodo ? ` · ${periodo}` : ''}`;
  const blocos = projeto.blocos.map((b) => {
    if (b.tipo === 'numeros') return { ...b, dados: { ...b.dados, itens: itensDeNumeros(n), selo } };
    if (b.tipo === 'publico') return { ...b, dados: { ...b.dados, itens: itensDePublico(n, b.variacao), selo } };
    return b;
  });
  return { ...projeto, numeros: n, blocos };
}
