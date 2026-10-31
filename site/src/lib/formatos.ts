// Formatos de contato (WhatsApp e e-mail): uma regra só para o editor, a Conta, o login e a revisão. Cada análise diz
// se está certo, o que está errado em palavras da creator e como fica arrumado. Nada vai ao servidor para conferir.

export interface Analise {
  ok: boolean;
  /** o que está errado e como resolver (só quando não está ok) */
  mensagem?: string;
  /** valor arrumado para gravar (ex.: "+55 (12) 99137-6550", e-mail em minúsculas) */
  arrumado: string;
  /** sugestão de correção de um erro comum de digitação (ex.: gmail.con → gmail.com) */
  sugestao?: string;
}

const so = (t: string) => t.replace(/\D/g, '');

// DDDs que existem no Brasil (Anatel)
const DDDS = new Set(
  '11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(
    ' ',
  ),
);

const EXEMPLO_WHATSAPP = 'Ex.: (11) 91234-5678';

/** Número de WhatsApp. Aceita com ou sem +55, com ou sem espaços e traços; número de fora começa com + e o código. */
export function analisarWhatsapp(entrada: string): Analise {
  const texto = entrada.trim();
  const digitos = so(texto);
  if (!digitos) return { ok: false, mensagem: `Escreva o número com DDD. ${EXEMPLO_WHATSAPP}.`, arrumado: texto };

  // número de fora do Brasil: + e código do país diferente de 55
  if (texto.startsWith('+') && !digitos.startsWith('55')) {
    if (digitos.length < 8 || digitos.length > 15)
      return {
        ok: false,
        mensagem: 'Confira o número: com o código do país, fica entre 8 e 15 números.',
        arrumado: texto,
      };
    return { ok: true, arrumado: `+${digitos}` };
  }

  // tira o 55 do Brasil (e o zero de longa distância) para olhar DDD e número
  let nacional = digitos.replace(/^0+/, '');
  if (nacional.length >= 12 && nacional.startsWith('55')) nacional = nacional.slice(2);

  if (nacional.length < 10)
    return { ok: false, mensagem: `Faltam números. Use o DDD e o número. ${EXEMPLO_WHATSAPP}.`, arrumado: texto };
  if (nacional.length > 11)
    return { ok: false, mensagem: 'Número longo demais. Confira se não repetiu algum dígito.', arrumado: texto };

  const ddd = nacional.slice(0, 2);
  const numero = nacional.slice(2);
  if (!DDDS.has(ddd))
    return { ok: false, mensagem: `O DDD ${ddd} não existe. Confira os 2 primeiros números.`, arrumado: texto };
  if (numero.length === 9 && !numero.startsWith('9'))
    return { ok: false, mensagem: 'Celular tem 9 números depois do DDD e começa com 9.', arrumado: texto };
  if (numero.length === 8 && !/^[2-5]/.test(numero))
    return {
      ok: false,
      mensagem: `Parece celular sem o 9 da frente. Escreva com 9 dígitos depois do DDD. ${EXEMPLO_WHATSAPP}.`,
      arrumado: texto,
    };

  const meio =
    numero.length === 9 ? `${numero.slice(0, 5)}-${numero.slice(5)}` : `${numero.slice(0, 4)}-${numero.slice(4)}`;
  return { ok: true, arrumado: `+55 (${ddd}) ${meio}` };
}

/** Só os números, com o código do país, para o link do WhatsApp (wa.me). Vazio se o número não for válido. */
export function whatsappParaLink(entrada: string): string {
  const a = analisarWhatsapp(entrada);
  return a.ok ? so(a.arrumado) : '';
}

// erros comuns de digitação no fim do e-mail
const DOMINIOS: Record<string, string> = {
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmail.com.br': 'gmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'outlook.con': 'outlook.com',
  'outlok.com': 'outlook.com',
  'yahoo.con': 'yahoo.com',
  'icloud.con': 'icloud.com',
};

/** E-mail. Arruma espaços e maiúsculas; aponta o que falta e erros comuns no fim (gmail.con). */
export function analisarEmail(entrada: string): Analise {
  const arrumado = entrada.trim().toLowerCase();
  if (!arrumado) return { ok: false, mensagem: 'Escreva o e-mail. Ex.: nome@gmail.com.', arrumado };
  if (/\s/.test(arrumado)) return { ok: false, mensagem: 'E-mail não pode ter espaço.', arrumado };
  const partes = arrumado.split('@');
  if (partes.length === 1) return { ok: false, mensagem: 'Falta o @. Ex.: nome@gmail.com.', arrumado };
  if (partes.length > 2) return { ok: false, mensagem: 'Tem mais de um @. O e-mail só tem um.', arrumado };
  const [nome, dominio] = partes as [string, string];
  if (!nome) return { ok: false, mensagem: 'Falta o nome antes do @. Ex.: nome@gmail.com.', arrumado };
  if (!dominio) return { ok: false, mensagem: 'Falta o endereço depois do @, como gmail.com.', arrumado };
  const certo = DOMINIOS[dominio];
  if (certo)
    return { ok: false, mensagem: `Você quis dizer ${nome}@${certo}?`, arrumado, sugestao: `${nome}@${certo}` };
  if (!/^[^.]+(\.[^.]+)*\.[a-z]{2,}$/.test(dominio))
    return { ok: false, mensagem: 'Falta o final do endereço, como .com ou .com.br.', arrumado };
  return { ok: true, arrumado };
}

export type Formato = 'whatsapp' | 'email';

export const analisar = (formato: Formato, valor: string): Analise =>
  formato === 'whatsapp' ? analisarWhatsapp(valor) : analisarEmail(valor);
