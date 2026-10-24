// Operações sobre o projeto da creator, todas puras: recebem o projeto e devolvem um novo (nunca alteram o
// de entrada). O editor usa estas funções; o histórico de desfazer/refazer fica no estado (app/editor/estado.ts).
// "Esconder" tira o bloco da página e guarda na bandeja (`guardados`); "devolver" traz de volta. Nada se perde.
import type { Registro } from './bloco';
import { MAXIMO_DE_BLOCOS, type Bloco, type Projeto } from './projeto';

const indiceDe = (lista: Bloco[], id: string) => lista.findIndex((b) => b.id === id);

/** Troca o bloco `id` de lugar com o vizinho (-1 sobe, +1 desce). Nos limites, não muda nada. */
export function mover(projeto: Projeto, id: string, direcao: -1 | 1): Projeto {
  const de = indiceDe(projeto.blocos, id);
  const para = de + direcao;
  if (de < 0 || para < 0 || para >= projeto.blocos.length) return projeto;
  const blocos = [...projeto.blocos];
  [blocos[de], blocos[para]] = [blocos[para]!, blocos[de]!];
  return { ...projeto, blocos };
}

/** Guarda o bloco na bandeja. Blocos fixos (Capa e Contato) não saem da página. */
export function esconder(projeto: Projeto, id: string, registro: Registro): Projeto {
  const bloco = projeto.blocos.find((b) => b.id === id);
  if (!bloco || registro[bloco.tipo]?.fixo) return projeto;
  return { ...projeto, blocos: projeto.blocos.filter((b) => b.id !== id), guardados: [...projeto.guardados, bloco] };
}

/** Traz um bloco guardado de volta ao fim da página, mas antes do Contato, que fica sempre por último. */
export function devolver(projeto: Projeto, id: string, registro: Registro): Projeto {
  const bloco = projeto.guardados.find((b) => b.id === id);
  if (!bloco || projeto.blocos.length >= MAXIMO_DE_BLOCOS) return projeto;
  const antesDoContato = projeto.blocos.findLastIndex((b) => registro[b.tipo]?.fixo && b.tipo !== 'capa');
  const blocos = [...projeto.blocos];
  blocos.splice(antesDoContato < 0 ? blocos.length : antesDoContato, 0, bloco);
  return { ...projeto, blocos, guardados: projeto.guardados.filter((b) => b.id !== id) };
}

/** Adiciona um bloco novo (variação padrão = a primeira), antes do Contato. Respeita o máximo de blocos. */
export function adicionar(projeto: Projeto, tipo: string, id: string, registro: Registro): Projeto {
  const definicao = registro[tipo];
  if (!definicao || projeto.blocos.length >= MAXIMO_DE_BLOCOS) return projeto;
  const novo: Bloco = {
    id,
    tipo,
    variacao: definicao.variacoes[0].id,
    oculto: false,
    dados: structuredClone((definicao.inicial ?? {}) as Record<string, unknown>),
  };
  const antesDoContato = projeto.blocos.findLastIndex((b) => registro[b.tipo]?.fixo && b.tipo !== 'capa');
  const blocos = [...projeto.blocos];
  blocos.splice(antesDoContato < 0 ? blocos.length : antesDoContato, 0, novo);
  return { ...projeto, blocos };
}

/** Copia um bloco logo abaixo dele, com id novo. Blocos fixos não duplicam. */
export function duplicar(projeto: Projeto, id: string, novoId: string, registro: Registro): Projeto {
  const de = indiceDe(projeto.blocos, id);
  const bloco = projeto.blocos[de];
  if (!bloco || registro[bloco.tipo]?.fixo || projeto.blocos.length >= MAXIMO_DE_BLOCOS) return projeto;
  const blocos = [...projeto.blocos];
  blocos.splice(de + 1, 0, { ...structuredClone(bloco), id: novoId });
  return { ...projeto, blocos };
}

/** Atualiza só os campos informados dos dados de um bloco. */
export function atualizarDados(projeto: Projeto, id: string, dados: Record<string, unknown>): Projeto {
  return {
    ...projeto,
    blocos: projeto.blocos.map((b) => (b.id === id ? { ...b, dados: { ...b.dados, ...dados } } : b)),
  };
}

/** Troca a variação de layout de um bloco; o conteúdo continua o mesmo. Ignora variação que o bloco não tem. */
export function trocarVariacao(projeto: Projeto, id: string, variacao: string, registro: Registro): Projeto {
  const bloco = projeto.blocos.find((b) => b.id === id);
  if (!bloco || !registro[bloco.tipo]?.variacoes.some((v) => v.id === variacao)) return projeto;
  return { ...projeto, blocos: projeto.blocos.map((b) => (b.id === id ? { ...b, variacao } : b)) };
}
