/**
 * Regras 8.1 e 8.2 da spec: rótulo + número vizinho, em cartões (fora de seções) e em itens
 * de seção (do título até o próximo título). Um número só serve a um campo.
 */
import { calcularConfianca, FATOR_POSICAO_DUVIDOSA, novosFatores } from '../confianca';
import {
  ABAS_IGNORADAS, FAIXAS_ETARIAS, GENEROS, MAX_CIDADES, rotulosDe,
  type DefCampo, type DefSecao, type DefTela, type Direcao, type TipoLista,
} from '../dicionario';
import { acharRotulos, type Ocorrencia, type Rotulo } from '../rotulo';
import type { Campo, Caixa, Idioma, ItemLista, Listas, OcrLinha, OcrPalavra } from '../tipos';
import { centroY, compacto, fimX, fimY } from '../util';
import type { Candidato } from './numeros';

export interface Extracao {
  campos: Record<string, Campo>;
  listas: Listas;
  naoLidos: string[];
  conflitos: string[];
}

interface Escolha {
  candidato: Candidato;
  /** quantos candidatos disputavam a posição */
  disputa: number;
}

/** limites verticais onde o número pode estar (não pular para o item seguinte) */
interface Janela {
  y0: number;
  y1: number;
}

const SEM_LIMITE: Janela = { y0: -Infinity, y1: Infinity };
/** em alturas de rótulo */
const ALCANCE_LINHA_VIZINHA = 3;
const ALCANCE_LINHA_SEGUINTE = 2.5;
/** cartões e perfil: número alinhado pela esquerda com o rótulo (em alturas de rótulo) */
const DESALINHAMENTO_MAXIMO = 2.5;

const sobrepoe = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && a1 > b0;

export function escolher(rotulo: Caixa, candidatos: Candidato[], direcao: Direcao, janela: Janela = SEM_LIMITE): Escolha | undefined {
  const h = rotulo[3];
  const cyR = centroY(rotulo);
  const elegiveis: { c: Candidato; gap: number; x: number }[] = [];

  for (const c of candidatos) {
    const [x, y, w, ch] = c.caixa;
    const cy = y + ch / 2;
    if (cy < janela.y0 || cy >= janela.y1) continue;
    const mesmaLinha = Math.abs(cy - cyR) <= Math.max(h, ch) / 2;
    const mesmaColuna = sobrepoe(x, x + w, rotulo[0] - h, fimX(rotulo) + h) && Math.abs(x - rotulo[0]) <= DESALINHAMENTO_MAXIMO * h;
    switch (direcao) {
      case 'direita':
        if (mesmaLinha && x >= fimX(rotulo) - h / 2) elegiveis.push({ c, gap: x - fimX(rotulo), x });
        break;
      case 'esquerda':
        if (mesmaLinha && x + w <= rotulo[0] + h / 2) elegiveis.push({ c, gap: rotulo[0] - (x + w), x });
        break;
      case 'abaixo': {
        const gap = y - fimY(rotulo);
        if (cy > fimY(rotulo) && gap <= ALCANCE_LINHA_VIZINHA * h && mesmaColuna) elegiveis.push({ c, gap, x });
        break;
      }
      case 'acima': {
        const gap = rotulo[1] - (y + ch);
        if (cy < rotulo[1] && gap <= ALCANCE_LINHA_VIZINHA * h && mesmaColuna) elegiveis.push({ c, gap, x });
        break;
      }
      case 'abaixo_direita': {
        const gap = y - fimY(rotulo);
        if (cy > fimY(rotulo) - h / 2 && gap <= ALCANCE_LINHA_SEGUINTE * h && x >= rotulo[0]) elegiveis.push({ c, gap, x });
        break;
      }
    }
  }
  if (!elegiveis.length) return undefined;

  elegiveis.sort((a, b) => a.gap - b.gap);
  if (direcao === 'direita' || direcao === 'esquerda') {
    // só disputa quem está perto do vencedor (um ícone lido como "2" longe não conta)
    const perto = elegiveis.filter((e) => e.gap - elegiveis[0].gap <= 2 * h);
    return { candidato: elegiveis[0].c, disputa: perto.length };
  }
  // acima e abaixo: só a linha mais próxima conta como disputa
  const mesmaFila = elegiveis.filter((e) => e.gap - elegiveis[0].gap <= h / 2);
  if (direcao === 'abaixo_direita') mesmaFila.sort((a, b) => b.x - a.x); // valor alinhado à direita
  else mesmaFila.sort((a, b) => Math.abs(a.x - rotulo[0]) - Math.abs(b.x - rotulo[0]));
  return { candidato: mesmaFila[0].c, disputa: mesmaFila.length };
}

function primeiraEscolha(o: Ocorrencia, def: DefCampo, candidatos: Candidato[], janela: Janela): Escolha | undefined {
  for (const direcao of def.busca) {
    const e = escolher(o.caixa, candidatos, direcao, janela);
    if (e) return e;
  }
  return undefined;
}

interface Faixa {
  nome: string;
  def: DefSecao;
  titulo: Ocorrencia;
  y0: number;
  y1: number;
}

export function extrairTela(linhas: OcrLinha[], candidatos: Candidato[], def: DefTela, idioma: Idioma | 'desconhecido'): Extracao {
  const catalogo: Rotulo[] = [];
  for (const [nome, c] of Object.entries(def.campos)) {
    for (const texto of rotulosDe(c.rotulos, idioma)) catalogo.push({ id: `campo:${nome}`, texto });
  }
  for (const [nome, s] of Object.entries(def.secoes)) {
    for (const texto of rotulosDe(s.titulo, idioma)) catalogo.push({ id: `secao:${nome}`, texto });
    for (const [item, c] of Object.entries(s.itens ?? {})) {
      for (const texto of rotulosDe(c.rotulos, idioma)) catalogo.push({ id: `item:${nome}:${item}`, texto });
    }
  }
  for (const texto of rotulosDe(def.fim, idioma)) catalogo.push({ id: 'fim', texto });

  const ocorrencias = acharRotulos(linhas, catalogo);
  const porId = new Map<string, Ocorrencia[]>();
  for (const o of ocorrencias) for (const id of o.ids) porId.set(id, [...(porId.get(id) ?? []), o]);
  const de = (id: string) => (porId.get(id) ?? []).slice().sort((a, b) => b.fator - a.fator || a.caixa[1] - b.caixa[1]);

  // faixas das seções: do fim do título até o início do próximo título
  const titulos = ocorrencias
    .filter((o) => o.ids.some((id) => id.startsWith('secao:') || id === 'fim'))
    .sort((a, b) => a.caixa[1] - b.caixa[1]);
  const faixas: Faixa[] = [];
  for (const [nome, s] of Object.entries(def.secoes)) {
    const titulo = de(`secao:${nome}`)[0];
    if (!titulo) continue;
    const y0 = fimY(titulo.caixa);
    const proximo = titulos.find((t) => t !== titulo && t.caixa[1] > y0);
    faixas.push({ nome, def: s, titulo, y0, y1: proximo ? proximo.caixa[1] : Infinity });
  }
  const dentroDeSecao = (y: number) => faixas.some((f) => y >= f.y0 && y < f.y1);

  const achados: { nome: string; campo: Campo; chave: string }[] = [];
  const registrar = (nome: string, o: Ocorrencia, e: Escolha) => {
    const c = e.candidato;
    const fatores = novosFatores(c.confianca, o.fator, e.disputa > 1 ? FATOR_POSICAO_DUVIDOSA : 1);
    achados.push({
      nome, chave: c.chave,
      campo: { texto: c.texto, valor: c.valor, caixa: c.caixa, fatores, confianca: calcularConfianca(fatores) },
    });
  };
  const doTipo = (d: DefCampo) => candidatos.filter((c) => c.pct === (d.tipo === 'pct'));
  const naoLidos: string[] = [];

  // cartões: só ocorrências fora das seções
  for (const [nome, c] of Object.entries(def.campos)) {
    let achou = false;
    for (const o of de(`campo:${nome}`).filter((o) => !dentroDeSecao(centroY(o.caixa)))) {
      const e = primeiraEscolha(o, c, doTipo(c), SEM_LIMITE);
      if (e) {
        registrar(nome, o, e);
        achou = true;
        break;
      }
    }
    if (!achou) naoLidos.push(nome);
  }

  // seções
  const listas: Listas = {};
  for (const f of faixas) {
    if (f.def.itens) {
      const itens = Object.entries(f.def.itens)
        .map(([item, c]) => ({ item, c, o: de(`item:${f.nome}:${item}`).find((o) => centroY(o.caixa) >= f.y0 && centroY(o.caixa) < f.y1) }))
        .filter((x): x is { item: string; c: DefCampo; o: Ocorrencia } => Boolean(x.o))
        .sort((a, b) => a.o.caixa[1] - b.o.caixa[1]);
      const lidos = new Set<string>();
      itens.forEach(({ item, c, o }, k) => {
        const proximo = itens[k + 1];
        const e = primeiraEscolha(o, c, doTipo(c), { y0: f.y0, y1: proximo ? proximo.o.caixa[1] : f.y1 });
        if (e) {
          registrar(item, o, e);
          lidos.add(item);
        }
      });
      naoLidos.push(...Object.keys(f.def.itens).filter((i) => !lidos.has(i)));
    } else if (f.def.lista) {
      const itens = lerLista(f, linhas, candidatos);
      if (itens.length) listas[f.def.lista] = itens;
      else naoLidos.push(f.nome);
    }
  }

  // um número só serve a um campo
  const porChave = new Map<string, string[]>();
  for (const a of achados) porChave.set(a.chave, [...(porChave.get(a.chave) ?? []), a.nome]);
  const conflitos = [...porChave.values()].filter((n) => n.length > 1).flat();
  const campos: Record<string, Campo> = {};
  for (const a of achados) {
    if (conflitos.includes(a.nome)) naoLidos.push(a.nome);
    else campos[a.nome] = a.campo;
  }
  return { campos, listas, naoLidos, conflitos };
}

// --- listas com percentual (público) ---

/** "25 – 34" → "25-34" */
function faixaEtaria(nome: string): string | undefined {
  const f = nome.replace(/\s+/g, '').replace(/[–—−_]/g, '-');
  return FAIXAS_ETARIAS.find((x) => x === f || (x === '65+' && f === '65'));
}

function limparNome(nome: string): string {
  return nome.replace(/^[^\p{L}\p{N}+]+/u, '').replace(/[^\p{L}\p{N}+)]+$/u, '').trim();
}

function nomeDaLista(tipo: TipoLista, nome: string): string | undefined {
  if (tipo === 'faixa_etaria') return faixaEtaria(nome);
  if (tipo === 'genero') return GENEROS[compacto(nome)];
  return ABAS_IGNORADAS.includes(compacto(nome)) ? undefined : nome;
}

function lerLista(f: Faixa, linhas: OcrLinha[], candidatos: Candidato[]): ItemLista[] {
  const tipo = f.def.lista!;
  // nome e % alinhados na mesma altura, mesmo que o OCR os tenha separado em linhas diferentes
  const palavras: OcrPalavra[] = linhas.flatMap((l) => l.palavras);
  const itens: ItemLista[] = [];

  candidatos
    .filter((c) => c.pct && centroY(c.caixa) >= f.y0 && centroY(c.caixa) < f.y1)
    .sort((a, b) => a.caixa[1] - b.caixa[1])
    .forEach((pct) => {
      const cy = centroY(pct.caixa);
      const nome = limparNome(
        palavras
          .filter((p) => Math.abs(centroY(p.caixa) - cy) <= p.caixa[3] / 2 && fimX(p.caixa) <= pct.caixa[0] + 1)
          .sort((a, b) => a.caixa[0] - b.caixa[0])
          .map((p) => p.texto)
          .join(' '),
      );
      const nomeFinal = nome && nomeDaLista(tipo, nome);
      if (!nomeFinal) return;
      const fatores = novosFatores(pct.confianca, f.titulo.fator);
      itens.push({ nome: nomeFinal, pct: pct.valor, texto: pct.texto, caixa: pct.caixa, fatores, confianca: calcularConfianca(fatores) });
    });

  return tipo === 'cidades' ? itens.slice(0, MAX_CIDADES) : itens;
}
