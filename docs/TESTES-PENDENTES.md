# Testes pendentes

Decisão de 23/out/2026: focar na entrega do produto e escrever os testes unitários numa rodada depois. Cada tarefa registra aqui o que precisa de teste. Não apagar linhas até o teste existir.

| Tarefa | O que testar | Onde |
|---|---|---|
| DEV-081 | Operações puras: `mover` (limites), `esconder` (Capa/Contato não saem), `devolver` (antes do Contato), `adicionar` (máximo de 15, variação padrão), `duplicar` (fixos não duplicam), `atualizarDados`, `trocarVariacao` (variação inválida). Projeto continua válido após qualquer sequência | `src/lib/operacoes.ts` |
| DEV-081 | Estado do editor: desfazer/refazer, selecionar não entra no histórico, mudança sem efeito não vira passo, esconder o selecionado limpa a seleção | `src/app/editor/estado.ts` |
| DEV-069 | Contraste dos pares de texto/fundo com `--pagina` e `--cartao` do cenário Nuvem nas 3 paletas | `src/themes/modelos/nuvem.ts` |
| DEV-082 a 088 | Editor (`app/editor/`): selecionar e abrir edição por toque, barra flutuante, gaveta de edição (contador, itens de lista, trocar variação), painéis Seções/Adicionar/Estilo, desfazer pelo aviso, salvar no aparelho (`persistencia.ts`) e recarregar. Sugestão: Playwright em 390 px, a partir do roteiro que já rodei à mão (`/app/editor/`) | `src/app/editor/` |
| DEV-060/081 | Schema dos campos de item de lista (`schemaDosDados` com `itens`, `proporcao`, `exemplo`) | `src/lib/bloco.ts` |
| DEV-090 | `progresso()`: texto igual ao exemplo não conta; item marcado `exemplo` não conta; item novo preenchido conta; item vazio não conta | `src/lib/progresso.ts` |
| DEV-091 | Modo Ver (sem interface e sem etiquetas de exemplo) e modo iniciante (esconde Números, Marcas e Público e volta sem perder dados). Playwright em 390 px; atenção: a barra do Astro em `dev` intercepta toques embaixo, rodar contra o build | `src/app/editor/Editor.tsx` |
| DEV-100/101/104 | `montarProjeto` (título longo cai para "Oi, eu sou X"; arroba normalizado; "Ainda não" liga modo iniciante; nicho vira etiqueta) e `normalizarArroba`. Fluxo do assistente em Playwright (modelo → 7 perguntas → editor com o nome na capa) | `src/lib/montagem.ts`, `src/app/assistente/` |
| DEV-130/131 | `validarNumeros` (gênero e faixas somando perto de 100, datas em ordem, alcançadas ≤ visualizações), `formatarNumero` (950, 18,4 mil, 212 mil, 1,2 mi), `aplicarNumeros` (itens sem `exemplo`, selo com período, variação cidades x idade). Painel "Meus números" em Playwright | `src/lib/numeros.ts`, `src/app/editor/PainelNumeros.tsx` |
| DEV-140 | `revisar()`: número de exemplo é vermelho; texto igual ao exemplo é vermelho; contato sem e-mail/WhatsApp válido é vermelho; capa sem foto, @ vazio, sem vídeos e vídeo sem capa são amarelos; seções escondidas não geram alerta; `podePublicar`. Painel de revisão em Playwright | `src/lib/revisao.ts` |
| DEV-150 | Mídia kit: gera exatamente 1 página A4 (contar páginas do PDF), escala nunca maior que 1, marca d'água some com `?marca=0`, seções escondidas não entram | `src/app/midia-kit/` |
