# Crítica: hierarquia e contenção do editor (DEV-095)

Dois revisores isolados (A: hierarquia e acessibilidade; B: uso no celular e descoberta). Capturas em 320, 390 e 1280 px.

## A (antes das correções: hierarquia 8, clareza 7, acessibilidade 7, consistência 7)
1. Aviso "Seção removida de vez." com Desfazer, e tempo que não pausa. **Corrigido:** "Seção removida."; 10 s que param com mouse ou foco no aviso; duração passada junto com o aviso.
2. Publicar aberto com sinal diferente das outras abas. **Corrigido:** aberto = fundo mais forte; abas abertas com fio de 3 px e texto mais forte.
3. `role="toolbar"` sem setas. **Corrigido:** vira `role="group"` com rótulo.
4. Atalho do Esconder só no `title`. **Corrigido:** `aria-keyshortcuts` e "Delete" visível no item em telas com mouse.
5. Selo de pendências apertado. **Corrigido:** selo sai do botão, com borda escura.

## B
1. Tocar fora do menu abria a edição da seção. **Corrigido:** o clique seguinte é engolido (com limite de 600 ms); o menu fecha ao rolar.
2. Esconder difícil de achar; Esconder e Remover sem explicação. **Corrigido:** botão "Mais" com texto; linha de apoio em cada item.
3. "de vez" contradiz o Desfazer. **Corrigido** (A1).
4. Tab no menu deixava o foco solto. **Corrigido:** Tab fecha e devolve o foco ao botão.
5. Publicar rosa cheio com 13 pendências chamava cedo demais. **Corrigido:** com pendências só contorno rosa; rosa cheio quando dá para publicar.

Verificação: `/tmp/rev/dev095.mjs` (30/30), `/tmp/rev/dev095b.mjs` (4/4), `/tmp/rev/dev232.mjs` (21/21), `/tmp/rev/dev093.mjs` (13/13).
