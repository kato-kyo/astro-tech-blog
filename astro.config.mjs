import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import react from '@astrojs/react';
import { SITE_CONFIG } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_CONFIG.url, // 設定ファイルから読み込み
  build: {
    format: 'file',
  },
  integrations: [
    react({
      include: ['**/react/*'],
    }),
    tailwind(),
    sitemap({
      filter: page => {
        // RSS配信やAPI エンドポイントを除外
        return !page.includes('/rss.xml') && !page.includes('/api/');
      },
      serialize: item => {
        // ページタイプ別の優先度と更新頻度を設定

        // ホームページ
        if (item.url.endsWith('/')) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        // ブログ一覧、、個別ページ
        else if (item.url.includes('/blog')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Aboutページ
        else if (item.url.includes('/about')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // タグページ
        else if (item.url.includes('/tags/')) {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        }
        // カテゴリページ
        else if (item.url.includes('/categories/')) {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        }
        // その他固定ページ（Contact、Privacy等）
        else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }

        return item;
      },
    }),
    pagefind(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
