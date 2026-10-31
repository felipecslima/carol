// Tipos mínimos do módulo do runtime do Cloudflare usado no servidor (bindings do wrangler.jsonc, como BROWSER).
declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>;
}
