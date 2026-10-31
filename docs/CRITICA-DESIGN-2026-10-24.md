# Crítica de design do app (24/out/2026)

Método: dois avaliadores isolados em paralelo (A: revisão de design navegando o app; B: detector `impeccable detect` e medições no navegador), conta de teste própria, celular (390 px) e desktop (1280 px). Nota de A: **26/40** (aceitável, "bruto na superfície"). Veredito: o chrome do app servia a qualquer app; a identidade vinha do conteúdo da creator. B: 0 erros de console, 0 fontes abaixo de 12 px; o detector deu 108 avisos de "design system", todos falsos positivos (o `DESIGN.md` é do site da Carol, outro produto).

## Feito nesta rodada
- **Identidade:** títulos em Instrument Serif (a mesma família editorial da página de vendas), rosa só como grifo, **uma marca só** em todas as telas (`app/Marca.tsx`), tudo em `app/refino.css`.
- **Hierarquia:** Início com um cartão de próximo passo e o portfólio em miniatura (some o par de métricas vazias); Conta com seções por fio e só o perigo como cartão colorido; Projetos com 1 botão preenchido e o resto em texto.
- **Fim da jornada:** quando está pronto, o principal é "Ver como a marca vê" (`?ver=1` abre o modo Ver), com o mídia kit como secundário.
- **Estados e controles:** selecionado com ✓ nas opções de Estilo, "Minha cor" no formato das outras, controle deslizante com cor e valor, desabilitado legível (antes 1,8:1), erro de código com cor e ícone, foco visível nos campos, contagem de passos em texto no assistente.
- **Acessibilidade:** conteúdo dos blocos no editor e miniaturas viraram `inert` (antes 12 paradas de Tab em links da prévia), nomes únicos nos campos repetidos, "Fechar" com 44×44, texto de apoio a 14 px e 7:1, `prefers-reduced-motion`.
- **Editor:** gaveta mais baixa no celular (e continua lateral e inteira no desktop), esconder agora avisa com "Desfazer", barra de progresso só aparece quando falta algo, apagar mídia pede confirmação.
- **Mídia kit:** a folha A4 cabe na largura da tela (antes rolava 810 px no celular), grade reorganizada (marcas em linha corrida) e vídeos sem sobreposição. O ajuste do `<video>` também corrige a página publicada.

## Ainda aberto (ideias, não feitas)
1. **Gaveta com alturas** (prévia, meia, cheia) ou **edição direta no texto** para o que não é foto/layout: a gaveta ainda cobre cerca de metade do resultado no celular.
2. **Primeiro uso do editor:** explicar "toque 1 seleciona, toque 2 edita" (dica de primeira vez).
3. **Experiente com pressa:** arrastar para reordenar, duplicar seção, editar vídeo sem rolar 5 campos por cartão.
4. **Assistente:** o passo dos números tem ~10 campos; dividir em dois. Um momento de celebração ao concluir (foto dela e "veja como a marca vai ver").
5. **Rótulos:** "Layout" (talvez "Como aparece"), "Clima" (talvez "Tema da página"), "Modo iniciante" com prévia do efeito.
6. **Tokens de CSS** (raios e tamanhos de fonte estão soltos) e um `DESIGN.md` próprio do app, para o detector parar de comparar com o do site da Carol.
7. Teclado dentro das gavetas (foco preso, Esc) e `aria-live` dos avisos: não medidos.
