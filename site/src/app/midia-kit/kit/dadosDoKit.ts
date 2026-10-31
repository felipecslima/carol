// Conteúdo do mídia kit em 2 páginas (DEV-154): lê as seções visíveis do projeto e monta um objeto só, na ordem
// editorial (quem eu sou, quanto alcanço, quem me acompanha, o que já fiz, com quem, o que eu vendo, como falar
// comigo), que não segue a ordem do site. Itens de exemplo nunca entram; seção repetida soma itens na mesma região;
// cada região tem um limite, e o que passa dele fica de fora (no lugar de encolher a folha). Os cortes viram avisos
// amarelos na Revisão (`cortesDoKit`).
import type { Registro } from '@lib/bloco';
import { whatsappParaLink } from '@lib/formatos';
import { blocosVisiveis, type Bloco, type Projeto } from '@lib/projeto';
import type {
  DadosDaCapa,
  DadosDeContato,
  DadosDeMarcas,
  DadosDeNumeros,
  DadosDePublico,
  DadosDeResumo,
  DadosDoSobre,
  ItemDeFormato,
  ItemDeMarca,
  ItemDeNumero,
  ItemDeVideo,
  Marcavel,
} from '@blocks/tipos';

export const LIMITES = {
  sobre: 520,
  numeros: 4,
  publico: 6,
  videos: 6,
  logos: 12,
  nomes: 16,
  formatos: 4,
} as const;

export interface Kit {
  arroba?: string;
  manchete?: string;
  /** subtítulo da capa: vira a frase em destaque ao lado do Sobre (ou o texto sob a manchete, sem Sobre) */
  frase?: string;
  foto?: { src: string; foco?: string };
  numeros: { itens: ItemDeNumero[]; selo?: string };
  /** "Nicho: Viagem e gastronomia", sem repetir o que já está na faixa de números */
  resumo: { rotulo: string; valor: string }[];
  /** dados do público em grupos (Idade, Gênero, Cidades): cada grupo tem a própria escala de leitura */
  publico?: { titulo: string; itens: ItemDeNumero[]; grupos: { nome: string; itens: ItemDeNumero[] }[]; selo?: string };
  sobre?: { titulo: string; texto: string };
  videos?: { titulo: string; itens: ItemDeVideo[] };
  marcas?: { titulo: string; itens: ItemDeMarca[]; comLogo: boolean };
  formatos?: { titulo: string; itens: ItemDeFormato[] };
  contato?: { titulo?: string; email?: string; whatsapp?: string; linkDoWhatsapp?: string; prazo?: string };
  /** endereço da página no ar (QR e vídeos clicáveis); sem link escolhido, nada leva para fora do papel */
  linkNoAr?: string;
}

export interface Corte {
  bloco: string;
  mensagem: string;
}

const deVerdade = <T extends Marcavel>(itens: T[] | undefined) => (itens ?? []).filter((i) => !i.exemplo);
const preenchido = (t?: string) => (t?.trim() ? t.trim() : undefined);

/** Corta no fim de uma palavra e põe reticências; texto curto passa como está. */
export function cortarTexto(texto: string, maximo: number): string {
  if (texto.length <= maximo) return texto;
  const corte = texto.slice(0, maximo);
  const ultimoEspaco = corte.lastIndexOf(' ');
  return `${corte.slice(0, ultimoEspaco > maximo * 0.6 ? ultimoEspaco : maximo).replace(/[\s,.;:–-]+$/, '')}…`;
}

/** Endereço público do portfólio. Não usa a origem da página: no PDF ela é `kit.interno` (server/pdf.ts). */
export function linkDoPortfolio(link?: string): string | undefined {
  if (!link) return undefined;
  const site = (import.meta.env.SITE ?? 'https://eucarollimah.com.br').replace(/\/$/, '');
  return `${site}/c/${link}/`;
}

const semAcento = (t = '') =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
/** Radicais (5 primeiras letras) das palavras de 4 letras ou mais: "amazonas" e "amazonense" contam como a mesma. */
const palavras = (t = '') =>
  new Set(
    semAcento(t)
      .split(/[^a-z0-9]+/)
      .filter((p) => p.length >= 4)
      .map((p) => p.slice(0, 5)),
  );
/** A frase repete o outro texto quando metade ou mais das palavras dela (pelo radical) já estão nele. */
export function repete(frase: string, outro = ''): boolean {
  const daFrase = [...palavras(frase)];
  const doOutro = palavras(outro);
  if (daFrase.length === 0) return false;
  return daFrase.filter((p) => doOutro.has(p)).length / daFrase.length >= 0.5;
}

/** Em que grupo do público um dado entra, pelo rótulo (faixa de idade, gênero); o resto são lugares. */
function grupoDoDado(rotulo: string): string {
  const r = semAcento(rotulo);
  if (/mulher|homem|feminin|masculin|binari/.test(r)) return 'Gênero';
  if (/anos|^\s*\d+\s*[-–a+]|^\s*\+?\s*\d+\s*$/.test(r)) return 'Idade';
  return 'Cidades';
}
const ORDEM_DOS_GRUPOS = ['Idade', 'Gênero', 'Cidades'];

function montar(projeto: Projeto, registro: Registro) {
  const visiveis = blocosVisiveis(projeto, registro);
  const doTipo = (tipo: string) => visiveis.filter((b) => b.tipo === tipo);
  const cortes: Corte[] = [];
  const somar = <T extends Marcavel>(blocos: Bloco[], limite: number, aviso: (n: number) => string) => {
    const todos = blocos.flatMap((b) => deVerdade((b.dados as { itens?: T[] }).itens));
    if (todos.length > limite) cortes.push({ bloco: blocos[0]!.id, mensagem: aviso(limite) });
    return todos.slice(0, limite);
  };
  const tituloDe = (blocos: Bloco[], padrao: string) =>
    preenchido(blocos.map((b) => (b.dados as { titulo?: string }).titulo).find(preenchido)) ?? padrao;

  const kit: Kit = { numeros: { itens: [] }, resumo: [], linkNoAr: linkDoPortfolio(projeto.link) };

  const capa = doTipo('capa')[0];
  if (capa) {
    const d = capa.dados as DadosDaCapa;
    kit.manchete = preenchido(d.titulo);
    kit.arroba = preenchido(d.arroba);
    kit.frase = preenchido(d.subtitulo);
    const comFoto = capa.variacao === 'fundo' ? (d.fundo ?? d.foto) : (d.foto ?? d.fundo);
    if (comFoto)
      kit.foto = {
        src: comFoto,
        foco: comFoto === d.fundo ? d.fundo_foco : d.foto_foco,
      };
  }

  const numeros = doTipo('numeros');
  if (numeros.length) {
    kit.numeros = {
      itens: somar<ItemDeNumero>(numeros, LIMITES.numeros, (n) => `No mídia kit entram os ${n} primeiros números.`),
      selo: preenchido(numeros.map((b) => (b.dados as DadosDeNumeros).selo).find(preenchido)),
    };
  }

  // o resumo repete muitas vezes os números (seguidores, views): na folha eles já estão na faixa
  const valoresDosNumeros = new Set(kit.numeros.itens.map((i) => i.valor.trim()));
  kit.resumo = doTipo('resumo')
    .flatMap((b) => deVerdade((b.dados as DadosDeResumo).itens))
    .filter((i) => preenchido(i.valor) && !valoresDosNumeros.has(i.valor.trim()))
    // "Cidade: São Paulo" ao lado de "@eu.carollimah · São Paulo" diria a cidade duas vezes
    .filter((i) => !semAcento(kit.arroba).includes(semAcento(i.valor).trim()))
    .slice(0, 3);

  const publico = doTipo('publico');
  if (publico.length) {
    const itens = somar<ItemDeNumero>(
      publico,
      LIMITES.publico,
      (n) => `No mídia kit entram os ${n} primeiros dados do público.`,
    );
    const grupos = ORDEM_DOS_GRUPOS.map((nome) => ({
      nome,
      itens: itens.filter((i) => grupoDoDado(i.rotulo) === nome),
    })).filter((g) => g.itens.length > 0);
    if (itens.length)
      kit.publico = {
        titulo: tituloDe(publico, 'Quem me acompanha'),
        itens,
        grupos,
        selo: preenchido(publico.map((b) => (b.dados as DadosDePublico).selo).find(preenchido)),
      };
  }

  const sobre = doTipo('sobre');
  const textoDoSobre = sobre
    .map((b) => preenchido((b.dados as DadosDoSobre).texto))
    .filter(Boolean)
    .join('\n\n');
  if (textoDoSobre) {
    if (textoDoSobre.length > LIMITES.sobre)
      cortes.push({
        bloco: sobre[0]!.id,
        mensagem: `No mídia kit, o Sobre mim vai até umas ${LIMITES.sobre} letras; o resto fica só na página.`,
      });
    kit.sobre = { titulo: tituloDe(sobre, 'Sobre mim'), texto: cortarTexto(textoDoSobre, LIMITES.sobre) };
  }

  const videos = doTipo('videos');
  if (videos.length) {
    const itens = somar<ItemDeVideo>(videos, LIMITES.videos, (n) => `No mídia kit entram os ${n} primeiros vídeos.`);
    if (itens.length) kit.videos = { titulo: tituloDe(videos, 'Conteúdos que eu já criei'), itens };
  }

  const marcas = doTipo('marcas');
  if (marcas.length) {
    const todas = marcas.flatMap((b) => deVerdade((b.dados as DadosDeMarcas).itens)).filter((m) => preenchido(m.nome));
    // logos só quando todas as marcas têm um (logo ao lado de nome solto quebra a linha de créditos)
    const comLogo = marcas.some((b) => b.variacao === 'logos') && todas.length > 0 && todas.every((m) => m.logo);
    const limite = comLogo ? LIMITES.logos : LIMITES.nomes;
    if (todas.length > limite)
      cortes.push({
        bloco: marcas[0]!.id,
        mensagem: `No mídia kit entram ${comLogo ? `os ${limite} primeiros logos` : `as ${limite} primeiras marcas`}.`,
      });
    if (todas.length)
      kit.marcas = {
        titulo: tituloDe(marcas, 'Marcas com quem já trabalhei'),
        itens: todas.slice(0, limite),
        comLogo,
      };
  }

  const formatos = doTipo('formatos');
  if (formatos.length) {
    const itens = somar<ItemDeFormato>(
      formatos,
      LIMITES.formatos,
      (n) => `No mídia kit entram os ${n} primeiros formatos.`,
    );
    if (itens.length) kit.formatos = { titulo: tituloDe(formatos, 'Formatos'), itens };
  }

  const contato = doTipo('contato')[0];
  if (contato) {
    const d = contato.dados as DadosDeContato;
    const whatsapp = preenchido(d.whatsapp);
    kit.contato = {
      titulo: preenchido(d.titulo),
      email: preenchido(d.email),
      whatsapp,
      linkDoWhatsapp: whatsapp
        ? `https://wa.me/${whatsappParaLink(whatsapp) || whatsapp.replace(/\D/g, '')}`
        : undefined,
      prazo: preenchido(d.prazo),
    };
  }

  // o título do Sobre que repete a manchete vira só "Sobre mim"
  if (kit.sobre && repete(kit.sobre.titulo, kit.manchete)) kit.sobre.titulo = 'Sobre mim';
  // a frase em destaque é para dizer algo novo: se repete a manchete ou o Sobre, fica de fora (a página não diz a
  // mesma coisa duas vezes)
  if (kit.frase && (repete(kit.frase, kit.manchete) || repete(kit.frase, kit.sobre?.texto))) delete kit.frase;
  // o período do público costuma ser o mesmo dos números: aparece uma vez só, na faixa
  if (kit.publico?.selo && kit.publico.selo === kit.numeros.selo) delete kit.publico.selo;

  return { kit, cortes };
}

export const dadosDoKit = (projeto: Projeto, registro: Registro): Kit => montar(projeto, registro).kit;

/** O que fica de fora do mídia kit por causa dos limites (aviso amarelo na Revisão, não bloqueia). */
export const cortesDoKit = (projeto: Projeto, registro: Registro): Corte[] => montar(projeto, registro).cortes;

/** Tamanho da manchete pelo comprimento do título (até 90 letras); a Folha ainda confere as linhas medindo. */
export const TAMANHOS_DA_MANCHETE = [56, 44, 36] as const;
export const tamanhoDaManchete = (titulo = '') => (titulo.length <= 34 ? 56 : titulo.length <= 60 ? 44 : 36);
