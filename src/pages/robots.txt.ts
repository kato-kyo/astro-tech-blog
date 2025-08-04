import type { APIRoute } from 'astro';
import { getSiteConfig } from '../utils/site-config.ts';

export const GET: APIRoute = async () => {
  const siteConfig = await getSiteConfig();

  const robotsTxt = `User-agent: *
Allow: /

# サイトマップの場所を指定
Sitemap: ${siteConfig.url}/sitemap-index.xml

# 不要なページのクロールを制限
Disallow: /api/
Disallow: /*.json

# クロール頻度制限
Crawl-delay: 1`;

  return new globalThis.Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
