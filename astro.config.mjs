import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import react from '@astrojs/react';
import { readFileSync } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// YAML設定を同期的に読み込み
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, 'src/content/site/config.yaml');
const siteConfig = yamlLoad(readFileSync(configPath, 'utf8'));

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  build: {
    format: 'file',
  },
  // 画像最適化設定
  image: {
    // リモート画像の認証設定（セキュリティ強化）
    // https://docs.astro.build/en/guides/images/#authorizing-remote-images
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
    ],
  },
  integrations: [
    react({
      include: ['**/react/*'],
    }),
    tailwind(),
    sitemap({
      filter: page => {
        // RSS配信やAPI エンドポイントを除外
        if (page.includes('/rss.xml') || page.includes('/api/')) {
          return false;
        }

        // 設定で無効化されたページを除外
        if (page.includes('/about') && !siteConfig.pages.showAbout) {
          return false;
        }
        if (page.includes('/contact') && !siteConfig.pages.showContact) {
          return false;
        }

        return true;
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
