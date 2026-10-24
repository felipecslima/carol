// Cria (ou atualiza) a conta de TESTE da Carol no Supabase `Creators`, preenchida só com dados reais que já estão no site
// dela (src/data/content.ts e src/i18n/ui.ts): nada inventado. Uso: `npm run seed:carol <caminho-da-foto>`.
// Idempotente: rodar de novo atualiza perfil, projeto e foto em vez de duplicar. Precisa do .env (secret key e Cloudinary).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';

const FOTO = process.argv[2];
if (!FOTO || !existsSync(FOTO)) {
  console.error('Passe o caminho da foto da Carol: npm run seed:carol <foto.jpg>');
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
const BASE = env.PUBLIC_SUPABASE_URL;
const CHAVE = env.SUPABASE_SERVICE_ROLE_KEY;
const [, cKey, cSecret, CLOUD] = env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
export const EMAIL_DE_TESTE = 'carol.limah.teste@example.com';

const h = { apikey: CHAVE, Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' };
const api = async (caminho, init = {}) => {
  const r = await fetch(BASE + caminho, { ...init, headers: { ...h, ...(init.headers ?? {}) } });
  const texto = await r.text();
  if (!r.ok) throw new Error(`${init.method ?? 'GET'} ${caminho} → ${r.status} ${texto.slice(0, 200)}`);
  return texto ? JSON.parse(texto) : null;
};

// ---------- 1) usuário ----------
const lista = await api('/auth/v1/admin/users?per_page=200');
let usuario = (lista.users ?? []).find((u) => u.email === EMAIL_DE_TESTE);
if (!usuario) usuario = await api('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email: EMAIL_DE_TESTE, email_confirm: true }) });
const uid = usuario.id;
console.log('usuário:', EMAIL_DE_TESTE, uid.slice(0, 8) + '…');

// ---------- 2) foto (Cloudinary, pasta da creator) ----------
let foto = (await api(`/rest/v1/media?dono=eq.${uid}&nome=eq.${encodeURIComponent(basename(FOTO))}&select=public_id`))[0];
if (!foto) {
  const params = { folder: `creators/${uid}`, timestamp: Math.floor(Date.now() / 1000) };
  const assinatura = createHash('sha1')
    .update(Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&') + cSecret)
    .digest('hex');
  const form = new FormData();
  form.append('file', new Blob([readFileSync(FOTO)]), basename(FOTO));
  form.append('api_key', cKey);
  form.append('signature', assinatura);
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  const r = await (await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body: form })).json();
  if (!r.public_id) throw new Error('Falha no envio da foto: ' + JSON.stringify(r).slice(0, 200));
  foto = { public_id: r.public_id };
  await api('/rest/v1/media', {
    method: 'POST',
    body: JSON.stringify({ dono: uid, tipo: 'image', public_id: r.public_id, url: `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1200/${r.public_id}`, capa: `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1200/${r.public_id}`, nome: basename(FOTO), bytes: r.bytes }),
  });
}
const img = (t) => `https://res.cloudinary.com/${CLOUD}/image/upload/${t}/${foto.public_id}`;
const fotoCapa = img('c_thumb,g_face,w_600,h_600,f_auto,q_auto'); // recorte no rosto para o círculo da capa
const fotoSobre = img('c_fill,ar_4:5,g_auto,w_800,f_auto,q_auto');
console.log('foto no Cloudinary:', foto.public_id.slice(0, 30) + '…');

// ---------- 3) perfil (dados do site) ----------
await api(`/rest/v1/profiles?id=eq.${uid}`, {
  method: 'PATCH',
  body: JSON.stringify({ nome: 'Carol Limah', arroba: '@eu.carollimah', whatsapp: '+55 12 99137-6550', cidade: 'São Paulo', nicho: 'Viagem e gastronomia', modo_iniciante: false }),
});

// ---------- 4) projeto ----------
// vídeos do portfólio dela no Cloudinary (pasta carol-limah/); títulos, marcas e views de MEDIA em content.ts
const video = (id, t, titulo, visualizacoes, marca) => ({
  titulo,
  visualizacoes,
  ...(marca ? { marca } : {}),
  video: `https://res.cloudinary.com/${CLOUD}/video/upload/carol-limah/${id}.mp4`,
  capa: `https://res.cloudinary.com/${CLOUD}/video/upload/so_${t},w_360,f_auto,q_auto/carol-limah/${id}.jpg`,
});
const selo = 'Informado pela creator · 20/09 a 19/10';
// público (AUDIENCE em content.ts, Insights de 20/set a 19/out/2026)
const faixas = [['13-17', 1.8], ['18-24', 11.4], ['25-34', 38.5], ['35-44', 29.7], ['45-54', 13.3], ['55-64', 3.9], ['65+', 1.5]];
const cidades = [['São Paulo', 45], ['São José dos Campos', 22], ['Jacareí', 12], ['Ribeirão Preto', 2.3]];
const pt = (n) => `${n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
const topFaixas = [...faixas].sort((a, b) => b[1] - a[1]).slice(0, 3);

const projeto = {
  dono: uid,
  tipo: 'site',
  modelo: 'nuvem',
  paleta: 0,
  cor_propria: '#c7863a', // caramelo da marca dela (accent do site)
  fontes: 'par-nuvem',
  cantos: 'redondos',
  clima: 'claro',
  modo_iniciante: false,
  link_desejado: 'eu-carollimah',
  numeros: {
    periodo: { dias: 30, inicio: '2026-09-20', fim: '2026-10-19' },
    perfil: { seguidores: 58400 },
    visualizacoes: { total: 1670000, contas_alcancadas: null },
    interacoes: { total: null, contas_com_engajamento: null },
    publico: { cidades: cidades.map(([nome, p]) => ({ nome, pct: p })), faixa_etaria: faixas.map(([faixa, p]) => ({ faixa, pct: p })), genero: { mulheres: 67.7, homens: 32.3 } },
    reels: [],
    origem: 'creator',
  },
  blocos: [
    { id: 'capa', tipo: 'capa', variacao: 'foto-redonda', oculto: false, dados: { arroba: '@eu.carollimah · São Paulo', titulo: 'Uma amazonense morando em São Paulo te levando em lugares incríveis.', subtitulo: 'Amazonense morando em São Paulo, cria conteúdo sobre restaurantes, hotéis, pousadas e viagens.', foto: fotoCapa, botao: 'Quero uma parceria' } },
    { id: 'numeros', tipo: 'numeros', variacao: 'cards', oculto: false, dados: { itens: [{ valor: '58,4 mil', rotulo: 'seguidores' }, { valor: '1,67 mi', rotulo: 'views em 30 dias' }, { valor: '242 mil', rotulo: 'média por reel' }], selo } },
    { id: 'videos', tipo: 'videos', variacao: 'carrossel', oculto: false, dados: { titulo: 'Conteúdos que eu já criei', itens: [
      video('v44', 49, 'Tacacá perto da Paulista', '1,1 mi'),
      video('v27', 24, 'Noite de bumbá em SP', '1 mi'),
      video('v02', 0.9, 'Fit check', '478 mil', 'Shein'),
      video('v23', 1.9, 'Microfone sem fio', '458 mil', 'Mercado Livre'),
      video('v22', 3.4, 'Montagem do On Fire', '293 mil', 'Churrasco On Fire'),
      video('v46', 3, 'Presente de Dia dos Pais', '292 mil', 'Buddha Spa'),
    ] } },
    { id: 'sobre', tipo: 'sobre', variacao: 'texto-foto', oculto: false, dados: { titulo: 'Do Amazonas pra São Paulo, te mostrando tudo.', texto: 'Sou a Carol, amazonense morando em SP. No meu perfil eu levo quem me acompanha pra conhecer restaurantes, hotéis, pousadas e destinos como Ilhabela e Campos do Jordão, sempre com o meu jeito: espontânea, divertida e muito sincera.', foto: fotoSobre, nichos: ['Viagem', 'Gastronomia', 'Hospedagem', 'Moda', 'Lifestyle'] } },
    { id: 'publico', tipo: 'publico', variacao: 'idade', oculto: false, dados: { titulo: 'Quem acompanha meu perfil', itens: [...topFaixas.map(([f, p]) => ({ valor: pt(p), rotulo: `${f} anos`, proporcao: p })), { valor: pt(67.7), rotulo: 'mulheres', proporcao: 67.7 }], selo } },
    { id: 'marcas', tipo: 'marcas', variacao: 'lista', oculto: false, dados: { titulo: 'Marcas e lugares com quem já trabalhei', itens: ['Mercado Livre', 'Shein', 'Casas Bahia', 'LG', 'Samsung Brasil', 'Churrasco On Fire', 'Kome', 'Gusto Cucina', 'Paparoto Cucina', 'Buddha Spa', 'Reserva Ilhabela', 'Aimê Pousada', 'Tempo by Porsche', 'HC Helicópteros', 'CASACOR', 'Palmolive', 'Alva', 'Emma', 'Café de la Musique', 'Mana Poke', 'Arena Movie', 'Espaço Simone Zagallo'].map((nome) => ({ nome })) } },
    { id: 'formatos', tipo: 'formatos', variacao: 'cards', oculto: false, dados: { titulo: 'Formatos que eu entrego', itens: [
      { titulo: 'Reels & stories', descricao: 'Publicação no meu perfil, com roteiro no meu tom e entrega para a audiência que já confia nas minhas dicas.' },
      { titulo: 'Hotéis & pousadas', descricao: 'Cobertura da hospedagem e do destino: quartos, experiências, café da manhã e o roteiro ao redor.' },
      { titulo: 'Restaurantes em SP', descricao: 'Visita, prato a prato, com o clima da casa. Conteúdo que faz o seguidor querer reservar.' },
      { titulo: 'Vídeos UGC', descricao: 'Vídeos para a marca usar nos próprios canais e anúncios, sem precisar de postagem no meu perfil.' },
    ] } },
    { id: 'contato', tipo: 'contato', variacao: 'botoes', oculto: false, dados: { titulo: 'Bora levar a sua marca pra um lugar incrível?', email: 'parceria.eucarollimah@gmail.com', whatsapp: '+55 12 99137-6550', prazo: 'Respondo em até 2 dias úteis.' } },
  ],
  guardados: [],
};
await api('/rest/v1/projects?on_conflict=dono,tipo', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(projeto) });
console.log('perfil, projeto e foto prontos.');
