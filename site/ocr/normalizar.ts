import type { Periodo } from './tipos';
import { normalizar } from './util';

// ---------------------------------------------------------------------------
// Números
// ---------------------------------------------------------------------------

export interface NumeroLido {
  valor: number | null;
  pct: boolean;
  /** houve troca O→0, l→1, S→5 ou B→8 */
  corrigido: boolean;
}

const CONFUSAO: Record<string, string> = { O: '0', o: '0', l: '1', I: '1', '|': '1', S: '5', B: '8' };
const MULTIPLICADOR: Record<string, number> = { mil: 1e3, k: 1e3, mi: 1e6, m: 1e6 };
const SINAL = /^([+\-−–])\s?(?=\d)/;

/** Tira ícone ou pontuação colada nas pontas ("▷212", "22...", "(11)"), preservando sinal e `%`. */
export function limparToken(texto: string): string {
  let t = texto.trim();
  const sinal = t.match(SINAL)?.[1];
  if (sinal) t = t.slice(1).trim();
  t = t.replace(/^[^\p{L}\p{N}]+/u, '').replace(/[^\p{L}\p{N}%]+$/u, '');
  return t && sinal ? `${sinal}${t}` : t;
}

/**
 * Converte o texto de um número do Instagram. Devolve `undefined` quando o texto não é um
 * número seguro. O formato decide, não o idioma: o app mistura "8,663", "1.054" e "7,4 mil".
 *
 * - milhar: grupos de exatamente 3 dígitos (`1.234`, `1,234`, `1.234.567`)
 * - decimal (1 ou 2 casas) só com sufixo (`mil`, `K`, `mi`, `M`) ou `%`
 * - `12,3` ou `12.3` sozinhos são ambíguos → `undefined`
 * - sinal na frente (`+10`, `-5`) é aceito; "—" sozinho é "sem dado" (`valor: null`)
 */
export function parseNumero(texto: string): NumeroLido | undefined {
  let t = texto.trim();
  if (/^[-–—−]$/.test(t)) return { valor: null, pct: false, corrigido: false };

  let sinal = 1;
  const s = t.match(SINAL);
  if (s) {
    sinal = s[1] === '+' ? 1 : -1;
    t = t.slice(s[0].length);
  }

  const m = t.match(/^(.*?)\s*(mil|mi|k|m)?\s*(%)?$/i);
  if (!m || !m[1]) return undefined;
  const sufixo = m[2]?.toLowerCase();
  const pct = Boolean(m[3]);
  if (sufixo && pct) return undefined;
  // "4 m" / "4 k": letra solta depois de espaço não é sufixo
  if (sufixo && sufixo.length === 1 && /\s[km]$/i.test(t)) return undefined;

  const bruto = m[1].replace(/\s+/g, '');
  const simbolos = bruto.replace(/[.,]/g, '');
  if (!simbolos) return undefined;
  const plausiveis = [...simbolos].filter((c) => /[0-9]/.test(c) || c in CONFUSAO).length;
  const digitos = [...simbolos].filter((c) => /[0-9]/.test(c)).length;
  if (digitos < 1 || plausiveis / simbolos.length < 0.5) return undefined;

  let corrigido = false;
  const limpo = [...bruto]
    .map((c) => {
      if (c in CONFUSAO) {
        corrigido = true;
        return CONFUSAO[c];
      }
      return c;
    })
    .join('');

  if (!sufixo && !pct) {
    if (/^\d{1,3}([.,]\d{3})+$/.test(limpo)) {
      return { valor: sinal * Number(limpo.replace(/[.,]/g, '')), pct: false, corrigido };
    }
    // o Instagram sempre separa milhares ("3.359", "1,597"): 4+ dígitos sem separador é leitura errada
    if (/^\d{1,3}$/.test(limpo)) return { valor: sinal * Number(limpo), pct: false, corrigido };
    return undefined;
  }

  const partes = limpo.match(/^(\d+)(?:[.,](\d{1,2}))?$/);
  if (!partes) return undefined;
  const inteiro = partes[1];
  const fracao = partes[2] ?? '';

  if (pct) {
    const valor = Number(fracao ? `${inteiro}.${fracao}` : inteiro);
    // percentual de público não passa de 100; com sinal é crescimento ("+144,4%") e pode
    if (valor > 100 && !s) return undefined;
    return { valor: sinal * valor, pct: true, corrigido };
  }
  // aritmética inteira: evita 12.3 × 1000 = 12300.000000000002
  const escala = MULTIPLICADOR[sufixo!] / 10 ** fracao.length;
  return { valor: sinal * Number(inteiro + fracao) * escala, pct: false, corrigido };
}

export interface NumeroSolto extends NumeroLido {
  texto: string;
}

const SOLTO = /[+\-−–]?\d[\d.,]*(?:\s*(?:mil|mi|k|m)(?![a-z]))?\s*%?/gi;

/**
 * Acha um número dentro de um texto curto e ruidoso (recorte da segunda passada, onde o
 * ícone e a borda viram lixo). Fica com o maior trecho que passa na gramária.
 */
export function parseNumeroSolto(texto: string): NumeroSolto | undefined {
  let melhor: NumeroSolto | undefined;
  for (const m of texto.matchAll(SOLTO)) {
    const bruto = limparToken(m[0]);
    const tentativas = [bruto, bruto.replace(/\s*(mil|mi|k|m)\s*%?$/i, '')];
    for (const t of tentativas) {
      const n = parseNumero(t);
      if (n && n.valor !== null) {
        if (!melhor || t.length > melhor.texto.length) melhor = { ...n, texto: t };
        break;
      }
    }
  }
  return melhor;
}

// ---------------------------------------------------------------------------
// Período
// ---------------------------------------------------------------------------

const MESES: Record<string, number> = {
  jan: 1, janeiro: 1, january: 1,
  fev: 2, feb: 2, fevereiro: 2, february: 2,
  mar: 3, marco: 3, march: 3,
  abr: 4, apr: 4, abril: 4, april: 4,
  mai: 5, may: 5, maio: 5,
  jun: 6, junho: 6, june: 6,
  jul: 7, julho: 7, july: 7,
  ago: 8, aug: 8, agosto: 8, august: 8,
  set: 9, sep: 9, sept: 9, setembro: 9, september: 9,
  out: 10, oct: 10, outubro: 10, october: 10,
  nov: 11, novembro: 11, november: 11,
  dez: 12, dec: 12, dezembro: 12, december: 12,
};

interface DiaMes {
  dia: number;
  mes: number;
}

function data(ano: number, mes: number, dia: number): Date | undefined {
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  return d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia ? d : undefined;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Datas numa linha já normalizada, em qualquer das duas ordens: "23 de set." / "20 set" (dia
 * primeiro) ou "set. 23" / "Sep 20" (mês primeiro). A ordem que casa mais vezes vence, porque
 * "set. 23 out. 7" também casaria "23 out" na ordem errada.
 */
export function datasNaLinha(n: string): DiaMes[] {
  const diaMes = [...n.matchAll(/(?<!\d)(\d{1,2})\s*(?:de\s+)?([a-z]{3,9})\.?(?![a-z])/g)]
    .filter((m) => MESES[m[2]])
    .map((m) => ({ dia: Number(m[1]), mes: MESES[m[2]] }));
  const mesDia = [...n.matchAll(/(?<![a-z])([a-z]{3,9})\.?\s*(\d{1,2})(?!\d)/g)]
    .filter((m) => MESES[m[1]])
    .map((m) => ({ dia: Number(m[2]), mes: MESES[m[1]] }));
  return mesDia.length > diaMes.length ? mesDia : diaMes;
}

/**
 * Ano resolvido a partir do fim: o de `hoje`, ou o anterior se a data cair no futuro; o início
 * fica no mesmo ano do fim, ou no anterior se cruzar janeiro. `dias` conta os dois extremos.
 */
function montarIntervalo(ini: DiaMes, fimDM: DiaMes, hoje: Date): Omit<Periodo, 'texto'> | undefined {
  const anoHoje = hoje.getUTCFullYear();
  let fim = data(anoHoje, fimDM.mes, fimDM.dia);
  if (!fim) return undefined;
  if (fim > hoje) fim = data(anoHoje - 1, fimDM.mes, fimDM.dia);
  if (!fim) return undefined;
  let inicio = data(fim.getUTCFullYear(), ini.mes, ini.dia);
  if (inicio && inicio > fim) inicio = data(fim.getUTCFullYear() - 1, ini.mes, ini.dia);
  if (!inicio) return undefined;
  const dias = Math.round((fim.getTime() - inicio.getTime()) / 864e5) + 1;
  return { inicio: iso(inicio), fim: iso(fim), dias };
}

export interface PeriodoExtraido {
  periodo: Periodo | null;
  avisos: string[];
}

/**
 * Procura o período nas linhas do print: "Últimos 30 dias", o seletor "30 dias" do painel e o
 * eixo do gráfico ("23 de set. 22 de out." ou "set. 23 out. 7 out. 22"), que dá as datas de
 * verdade. Quando os dois existem e não batem, avisa `periodo_inconsistente`.
 */
export function extrairPeriodo(textos: string[], hoje: Date = new Date()): PeriodoExtraido {
  let dias: { texto: string; dias: number } | undefined;
  let intervalo: Periodo | undefined;

  for (const texto of textos) {
    const n = normalizar(texto);
    if (!dias) {
      const m = n.match(/(?:ultimos|last)\s+(\d{1,3})\s+(?:dias|days)/) ?? n.match(/(?:^|\s)(\d{1,3})\s+(?:dias|days)(?![a-z])/);
      if (m) dias = { texto: texto.slice(m.index!, m.index! + m[0].length).trim(), dias: Number(m[1]) };
    }
    if (!intervalo) {
      const datas = datasNaLinha(n);
      if (datas.length >= 2) {
        const i = montarIntervalo(datas[0], datas[datas.length - 1], hoje);
        if (i && i.inicio !== i.fim) intervalo = { ...i, texto: texto.trim() };
      }
    }
  }

  if (!dias && !intervalo) return { periodo: null, avisos: [] };
  if (!intervalo) return { periodo: { texto: dias!.texto, inicio: null, fim: null, dias: dias!.dias }, avisos: [] };
  const avisos: string[] = [];
  if (dias && Math.abs(dias.dias - intervalo.dias!) > 1) avisos.push('periodo_inconsistente');
  const texto = dias ? `${dias.texto} · ${intervalo.texto}` : intervalo.texto;
  return { periodo: { ...intervalo, texto }, avisos };
}

/** Atalho para uma linha só (testes e usos simples). */
export function parsePeriodo(texto: string, hoje: Date = new Date()): Periodo | undefined {
  return extrairPeriodo([texto], hoje).periodo ?? undefined;
}
