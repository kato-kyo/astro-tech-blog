import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://yourdomain.com', // 実際のドメインに変更
  build: {
    format: 'file',
  },
  integrations: [
    react({
      include: ['**/react/*'],
    }),
    tailwind(),
    sitemap(),
    pagefind(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
