# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Marcas e agências (restaurantes, hotéis, pousadas, marcas de varejo e de beleza, agências de influência) que avaliam a Carol Limah para uma parceria. Chegam pelo link na bio, por indicação ou pela busca ("influenciadora gastronomia SP", "influenciadora viagem", "Carol Limah"). Querem decidir rápido se o perfil, o público e os resultados combinam com a campanha, e saber como contratar. Seguidores são público secundário.

## Product Purpose
Portfólio e media kit da Carol Limah (@eu.carollimah), criadora de conteúdo amazonense morando em São Paulo. O site existe para gerar pedidos de parceria: sucesso é a marca escrever pelo e-mail (ou WhatsApp) com o roteiro do brief, ou baixar o media kit.

## Positioning
Amazonense em São Paulo que mostra restaurantes, hotéis, pousadas e viagens de perto, com humor e sem roteiro decorado. Os reels passam bem do tamanho da base (média de 242 mil views por reel com 58,4 mil seguidores), e as publis também entregam (Mercado Livre: média de 480 mil).

## Operating Context
- Site estático em Astro, deploy no Cloudflare Workers, domínio eucarollimah.com.br.
- Vídeos no Cloudinary; dados de alcance e público vêm de prints do Instagram Insights e da aba Reels, registrados em `src/data/content.ts`.
- Media kit em PDF gerado da página `/media-kit/` (`npm run pdf`).
- Páginas por nicho para busca: Restaurantes em SP, Viagens e hospedagem, Publis e UGC.
- Três idiomas: português na raiz (`/`), inglês em `/en/` e espanhol latino-americano neutro em `/es/`, com slugs traduzidos e um media kit em PDF por idioma. Textos das páginas em `src/i18n/ui.ts`; textos do conteúdo ao lado do dado em `src/data/`. O seletor PT · EN · ES fica sempre visível na nav.

## Capabilities and Constraints
- Formatos vendidos: Reels & stories, Hotéis & pousadas, Restaurantes em SP, Vídeos UGC.
- Contato: e-mail parceria.eucarollimah@gmail.com (mailto com brief), WhatsApp comercial, media kit PDF. Prazo: "Respondo em até 2 dias úteis."
- Sem preços, pacotes, taxa de engajamento ou métricas de stories confirmados.

## Brand Commitments
- Nome "Carol Limah", @eu.carollimah. Voz em primeira pessoa, espontânea, divertida e sincera; português do Brasil como original, e as versões em inglês e espanhol no mesmo tom.
- Tom visual chique e editorial; nada de ornamentos kitsch.
- Nunca mencionar a avó da Carol ("vozinha") em site, PDF ou textos.

## Evidence on Hand
- Mídias do portfólio, títulos, marcas e views por reel em `src/data/content.ts` (catálogo em `../CATALOGO-videos.md`).
- Insights de 20/set–19/out/2026 e print da aba Reels de 20/out/2026.
- Marcas com quem já trabalhou: lista `BRANDS` em `content.ts`.
- Não há depoimentos, cases escritos, imprensa nem preços: não inventar.

## Product Principles
1. Toda afirmação sai de um dado confirmado em `content.ts`; nada de número ou fato novo sem a Carol confirmar.
2. A marca precisa achar prova (vídeo, views, marca parceira) antes de ler argumento.
3. O caminho para o contato está sempre a um gesto de distância.
4. A personalidade da Carol é o diferencial: o texto soa como ela, não como agência.
