// Limites contra abuso (DEV-234), por conta. São limites técnicos para proteger o Cloudinary e o banco, não regras
// de venda: confirmar os valores antes do lançamento. Os mesmos números estão na migração `limites` (trigger do banco).

/** fotos e vídeos guardados na biblioteca */
export const MIDIAS_POR_CONTA = 300;
/** espaço total das mídias (bytes) */
export const ESPACO_POR_CONTA = 3 * 1024 ** 3;
/** links de marca criados em 24 horas */
export const LINKS_DE_MARCA_POR_DIA = 50;
/** a mesma marca abrindo o mesmo link de novo dentro deste tempo não conta outra abertura */
export const MINUTOS_ENTRE_ABERTURAS = 10;

/** Mensagem quando a biblioteca está cheia; `null` se ainda cabe. */
export function problemaDeEspaco(quantidade: number, bytes: number): string | null {
  if (quantidade >= MIDIAS_POR_CONTA)
    return `Sua biblioteca chegou ao limite de ${MIDIAS_POR_CONTA} arquivos. Apague alguns em Mídias para enviar outros.`;
  if (bytes >= ESPACO_POR_CONTA)
    return 'Sua biblioteca chegou ao limite de 3 GB. Apague alguns vídeos em Mídias para enviar outros.';
  return null;
}
