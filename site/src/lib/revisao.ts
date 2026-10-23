// Revisão final antes de publicar (DEV-140). Vermelho bloqueia: exemplo que sobrou, número de exemplo, contato
// faltando ou inválido. Amarelo a creator pode ignorar: foto, vídeo e @ vazios. Só olha as seções visíveis.
import type { Registro } from './bloco';
import { blocosVisiveis, type Bloco, type Projeto } from './projeto';
import { problemaDoSlug } from './slug';

export type Gravidade = 'vermelho' | 'amarelo';

export interface Alerta {
  gravidade: Gravidade;
  /** id do bloco a abrir; ausente = problema do projeto todo */
  bloco?: string;
  mensagem: string;
}

const ESCALARES = new Set(['titulo', 'texto', 'botao', 'etiqueta', 'numero']);
const vazio = (v: unknown) => v === undefined || v === null || v === '';

export const emailValido = (t: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim());
export const whatsappValido = (t: string) => t.replace(/\D/g, '').length >= 10;

export function revisar(projeto: Projeto, referencia: Projeto, registro: Registro): Alerta[] {
  const alertas: Alerta[] = [];
  const nomeDe = (b: Bloco) => registro[b.tipo]?.nome ?? b.tipo;

  for (const b of blocosVisiveis(projeto, registro)) {
    const definicao = registro[b.tipo];
    const exemplo = referencia.blocos.find((r) => r.tipo === b.tipo);
    if (!definicao) continue;

    // itens de lista ainda marcados como exemplo: número de exemplo é o pior caso
    for (const campo of definicao.campos.filter((c) => c.tipo === 'lista' && c.itens)) {
      const itens = (b.dados[campo.id] as Array<{ exemplo?: boolean }> | undefined) ?? [];
      const sobrando = itens.filter((i) => i.exemplo === true).length;
      if (sobrando > 0)
        alertas.push({
          gravidade: 'vermelho',
          bloco: b.id,
          mensagem: campo.bloqueiaPublicacao
            ? `${nomeDe(b)}: ${sobrando === 1 ? 'tem um número' : `tem ${sobrando} números`} de exemplo. Informe os seus ou esconda a seção.`
            : `${nomeDe(b)}: ${sobrando === 1 ? 'um item ainda é' : `${sobrando} itens ainda são`} de exemplo. Troque ou remova.`,
        });
    }

    // texto igual ao do exemplo = placeholder que ficou
    const iguais = definicao.campos.filter(
      (c) => ESCALARES.has(c.tipo) && !vazio(exemplo?.dados[c.id]) && b.dados[c.id] === exemplo?.dados[c.id],
    );
    if (iguais.length > 0)
      alertas.push({
        gravidade: 'vermelho',
        bloco: b.id,
        mensagem: `${nomeDe(b)}: ${iguais.map((c) => `“${c.rotulo}”`).join(', ')} ainda ${iguais.length === 1 ? 'está' : 'estão'} com o texto de exemplo.`,
      });
  }

  const problemaLink = projeto.link ? problemaDoSlug(projeto.link) : 'Escolha o link do seu portfólio.';
  if (problemaLink) alertas.push({ gravidade: 'vermelho', mensagem: `Link: ${problemaLink}` });

  const contato = blocosVisiveis(projeto, registro).find((b) => b.tipo === 'contato');
  if (!contato) {
    alertas.push({ gravidade: 'vermelho', mensagem: 'A página precisa de uma seção de Contato.' });
  } else {
    const { email, whatsapp } = contato.dados as { email?: string; whatsapp?: string };
    if (!email || !emailValido(email))
      alertas.push({ gravidade: 'vermelho', bloco: contato.id, mensagem: 'Contato: o e-mail está vazio ou inválido.' });
    if (!whatsapp || !whatsappValido(whatsapp))
      alertas.push({
        gravidade: 'vermelho',
        bloco: contato.id,
        mensagem: 'Contato: o WhatsApp está vazio ou inválido (com DDD).',
      });
  }

  const capa = blocosVisiveis(projeto, registro).find((b) => b.tipo === 'capa');
  if (capa && vazio(capa.dados.foto))
    alertas.push({
      gravidade: 'amarelo',
      bloco: capa.id,
      mensagem: 'Capa: sem foto. Sua cara na primeira tela aproxima a marca.',
    });
  if (capa && vazio(capa.dados.arroba))
    alertas.push({ gravidade: 'amarelo', bloco: capa.id, mensagem: 'Capa: falta o seu @ e a cidade.' });
  const videos = blocosVisiveis(projeto, registro).find((b) => b.tipo === 'videos');
  if (!videos || ((videos.dados.itens as unknown[] | undefined) ?? []).length === 0)
    alertas.push({
      gravidade: 'amarelo',
      bloco: videos?.id,
      mensagem: 'Sem vídeos na página. A marca procura prova antes de argumento.',
    });
  else {
    const semCapa = ((videos.dados.itens as Array<{ capa?: string }>) ?? []).filter((v) => vazio(v.capa)).length;
    if (semCapa > 0)
      alertas.push({
        gravidade: 'amarelo',
        bloco: videos.id,
        mensagem: `Vídeos: ${semCapa === 1 ? 'um vídeo está' : `${semCapa} vídeos estão`} sem capa.`,
      });
  }

  // vermelhos primeiro
  return alertas.sort((a, b) => Number(b.gravidade === 'vermelho') - Number(a.gravidade === 'vermelho'));
}

export const podePublicar = (alertas: Alerta[]) => !alertas.some((a) => a.gravidade === 'vermelho');
