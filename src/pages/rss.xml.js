import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getSiteConfig } from '../utils/site-config.ts';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const siteConfig = await getSiteConfig();

  return rss({
    title: siteConfig.rss.title,
    description: siteConfig.rss.description,
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(post => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        categories: post.data.tags,
      })),
    customData: `<language>ja</language>`,
  });
}
