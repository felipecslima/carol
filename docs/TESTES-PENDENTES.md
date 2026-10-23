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
