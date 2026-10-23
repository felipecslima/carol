import { classificar } from './classificar';
import { calcularConfianca, LIMITE_CONFIANCA, precisaReserva } from './confianca';
import { FIM_DO_CABECALHO, NAO_E_CONTA, TELAS, TRIPLA_PERFIL, rotulosDe } from './dicionario';
import { extrairTela } from './extrair/campos';
import { lerGradeReels } from './extrair/grade-reels';
import { candidatosNumericos } from './extrair/numeros';
import { extrairPeriodo, parseNumeroSolto } from './normalizar';
import { acharRotulos, type Rotulo } from './rotulo';
import type { Campo, Idioma, Imagem, OcrResultado, PrintLido } from './tipos';
import { arredondar, fimY, media } from './util';
import { aplicarFalhas, validarPrint } from './validar';

/** a grade de um print sem cabeçalho começa depois da barra de título */
const TOPO_SEM_CABECALHO = 0.08;
/** folga entre o último rótulo do cabeçalho e a grade (linha de abas) */
const FOLGA_ABAS = 0.04;
/** o nome da conta fica na barra de título */
const ALTURA_TITULO = 0.12;
const CONTA = /^[a-z0-9._]{3,30}$/;
/** confirmação: quando a página leu com menos que isto e o recorte com mais que aquilo, vale o recorte */
const PAGINA_DESCARTAVEL = 0.5;
const RECORTE_CONFIAVEL = 0.9;
const DESCONTO_RECORTE = 0.95;

function fimDoCabecalho(ocr: OcrResultado, idioma: Idioma | 'desconhecido', altura: number): number {
  const catalogo: Rotulo[] = [
    ...rotulosDe(FIM_DO_CABECALHO, idioma).map((texto) => ({ id: 'fim', texto })),
    ...Object.values(TRIPLA_PERFIL).flatMap((r) => rotulosDe(r, idioma).map((texto) => ({ id: 'tripla', texto }))),
  ];
  const fundo = Math.max(0, ...acharRotulos(ocr.linhas, catalogo).map((o) => fimY(o.caixa)));
  return fundo + altura * FOLGA_ABAS;
}

/** Nome da conta: a maior palavra com cara de usuário na barra de título; senão, um "@" qualquer. */
function acharConta(ocr: OcrResultado, altura: number): PrintLido['conta'] {
  const doTitulo = ocr.linhas
    .filter((l) => l.caixa[1] < altura * ALTURA_TITULO)
    .flatMap((l) => l.palavras)
    .map((p) => ({ texto: p.texto, valor: p.texto.replace(/^@/, '').toLowerCase() }))
    .filter((p) => CONTA.test(p.valor) && !/^[\d.]+$/.test(p.valor) && !NAO_E_CONTA.includes(p.valor))
    .sort((a, b) => b.valor.length - a.valor.length)[0];
  if (doTitulo) return doTitulo;
  for (const l of ocr.linhas) {
    for (const p of l.palavras) {
      const m = p.texto.match(/^@([a-z0-9._]{3,30})$/i);
      if (m) return { texto: p.texto, valor: m[1].toLowerCase() };
    }
  }
  return null;
}

/** Segunda passada nos números lidos com pouca confiança: recorta e lê de novo só com dígitos. */
async function confirmarCampos(imagem: Imagem, campos: Record<string, Campo>): Promise<void> {
  for (const c of Object.values(campos)) {
    if (c.valor === null || c.confianca >= LIMITE_CONFIANCA || c.fatores.validacao < 1) continue;
    const [x, y, w, h] = c.caixa;
    const margem = Math.max(4, h * 0.3);
    const palavras = await imagem.regiao([x - margem, y - margem, w + 2 * margem, h + 2 * margem], 'numero');
    if (!palavras.length) continue;
    const n = parseNumeroSolto(palavras.map((p) => p.texto).join(' '));
    if (!n || n.valor === null) continue;
    const confRecorte = media(palavras.map((p) => p.confianca));
    if (n.valor === c.valor) {
      c.fatores.ocr = arredondar(Math.max(c.fatores.ocr, confRecorte));
      c.confianca = calcularConfianca(c.fatores);
      c.confirmado = true;
    } else if (c.fatores.ocr < PAGINA_DESCARTAVEL && confRecorte >= RECORTE_CONFIAVEL) {
      // a página leu lixo ("S859") e o recorte, só com dígitos, leu limpo: vale o recorte, com desconto
      c.texto = n.texto;
      c.valor = n.valor;
      c.fatores.ocr = arredondar(confRecorte * DESCONTO_RECORTE);
      c.confianca = calcularConfianca(c.fatores);
    }
  }
}

/** Pipeline de um print: OCR, classificação, extração, grade, validação e decisão. */
export async function lerPrint(imagem: Imagem, hoje: Date = new Date()): Promise<PrintLido> {
  const ocr = await imagem.pagina();
  const { tela, idioma } = classificar(ocr);
  const candidatos = candidatosNumericos(ocr.linhas);

  const print: PrintLido = {
    arquivo: imagem.nome,
    tela,
    idioma,
    tema: imagem.tema,
    periodo: null,
    conta: null,
    campos: {},
    nao_lidos: [],
    avisos: [],
    precisa_reserva: false,
  };

  if (tela !== 'desconhecida' && tela !== 'aba_reels') {
    const r = extrairTela(ocr.linhas, candidatos, TELAS[tela], idioma);
    print.campos = r.campos;
    if (Object.keys(r.listas).length) print.listas = r.listas;
    print.nao_lidos = r.naoLidos;
  }

  // grade de reels: no perfil (aba Reels aberta) ou num print sem cabeçalho
  if (tela === 'perfil' || tela === 'desconhecida') {
    const topo = tela === 'perfil' ? fimDoCabecalho(ocr, idioma, imagem.altura) : imagem.altura * TOPO_SEM_CABECALHO;
    const grade = await lerGradeReels(imagem, candidatos, topo);
    if (grade.encontrou) {
      print.reels = grade.celulas;
      print.avisos.push(...grade.avisos);
      if (tela === 'desconhecida') print.tela = 'aba_reels';
    }
  }

  if (print.tela === 'perfil' || print.tela === 'aba_reels') print.conta = acharConta(ocr, imagem.altura);

  if (print.tela !== 'aba_reels' && print.tela !== 'desconhecida') {
    const { periodo, avisos } = extrairPeriodo(ocr.linhas.map((l) => l.texto), hoje);
    print.periodo = periodo;
    print.avisos.push(...avisos);
    if (periodo?.dias != null && periodo.dias !== 30) print.avisos.push('periodo_diferente_de_30_dias');
  }

  await confirmarCampos(imagem, print.campos);
  aplicarFalhas([print], validarPrint(print));
  print.precisa_reserva = precisaReserva(print);
  return print;
}
