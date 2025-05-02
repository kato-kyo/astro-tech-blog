import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  site: 'https://yourdomain.com', // 実際のドメインに変更
  build: {
    format: 'file',
  },
  integrations: [tailwind(), sitemap(), pagefind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
