# blocks/

Componentes React dos blocos do portfólio (capa, sobre, números, vídeos, contato…).

**Regra:** uma renderização só. O mesmo componente roda no editor (interativo) e no servidor para a página publicada (HTML puro, quase sem JavaScript). Nunca criar duas versões de um bloco.

Cada bloco recebe `dados` e `variacao` e não conhece cores nem fontes: usa os tokens de `themes/`.
