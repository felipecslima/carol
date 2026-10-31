import 'astro';

declare module 'astro' {
  interface AstroClientDirectives {
    'client:carregada'?: boolean;
  }
}
