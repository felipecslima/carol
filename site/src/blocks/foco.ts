// Enquadramento de foto e vídeo: a creator toca onde está o rosto ou o assunto e o recorte (círculo, retrato, capa
// larga) acompanha esse ponto. Guardado como "x y" em % (ver `chaveDeFoco` em lib/bloco.ts).

/** "50 30" vira "50% 30%" para background-position e object-position; vazio ou inválido usa o padrão da seção. */
export function posicaoDoFoco(foco?: string): string | undefined {
  const m = foco?.match(/^(\d{1,3}) (\d{1,3})$/);
  if (!m) return undefined;
  return `${Math.min(100, Number(m[1]))}% ${Math.min(100, Number(m[2]))}%`;
}
