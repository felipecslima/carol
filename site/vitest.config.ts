import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// mesmos aliases do tsconfig.json
const src = (pasta: string) => fileURLToPath(new URL(`./src/${pasta}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@app': src('app'),
      '@blocks': src('blocks'),
      '@themes': src('themes'),
      '@lib': src('lib'),
      '@server': src('server'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    // os imports da biblioteca de cores não têm extensão `.js`; o Vite precisa processá-la
    server: { deps: { inline: ['@material/material-color-utilities'] } },
  },
});
