/**
 * 構造化データ（JSON-LD）生成ヘルパー
 *
 * SEO改善のためのSchema.org準拠の構造化データを生成します。
 * 対応スキーマ: Article, WebSite, Organization, BreadcrumbList, Blog
 */

import type { CollectionEntry } from 'astro:content';
import { getSiteConfig } from './site-config';

// ===========================================
// 型定義
// ===========================================

export interface StructuredDataBase {
  '@context': 'https://schema.org';
  '@type': string;
}

export interface ArticleStructuredData extends StructuredDataBase {
  '@type': 'Article';
  headline: string;
  description: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  url: string;
  image?: string[];
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string[];
  articleSection?: string;
}

export interface WebSiteStructuredData extends StructuredDataBase {
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface BreadcrumbStructuredData extends StructuredDataBase {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface BlogStructuredData extends StructuredDataBase {
  '@type': 'Blog';
  name: string;
  description: string;
  url: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
  };
}

// ===========================================
// Article Schema（ブログ記事詳細用）
// ===========================================

export async function generateArticleStructuredData(
  post: CollectionEntry<'blog'>,
  url: string
): Promise<ArticleStructuredData> {
  const {
    title,
    description,
    pubDate,
    updatedDate,
    heroImage,
    tags,
    category,
  } = post.data;

  const siteConfig = await getSiteConfig();

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.seo.siteName,
    },
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate || pubDate).toISOString(),
    url: url,
    ...(heroImage && { image: [heroImage] }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(tags && tags.length > 0 && { keywords: tags }),
    ...(category && { articleSection: category }),
  };
}

// ===========================================
// WebSite Schema（サイト全体用）
// ===========================================

export async function generateWebSiteStructuredData(
  url: string
): Promise<WebSiteStructuredData> {
  const siteConfig = await getSiteConfig();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.seo.siteName,
    description: siteConfig.seo.description,
    url: url,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ===========================================
// BreadcrumbList Schema（パンくずナビ用）
// ===========================================

export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
): BreadcrumbStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

// ===========================================
// Blog Schema（ブログ一覧用）
// ===========================================

export async function generateBlogStructuredData(
  url: string
): Promise<BlogStructuredData> {
  const siteConfig = await getSiteConfig();

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.seo.siteName} - ブログ`,
    description: siteConfig.seo.description,
    url: url,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.seo.siteName,
    },
  };
}

// ===========================================
// JSON-LD出力ヘルパー
// ===========================================

/**
 * 構造化データをJSON-LD形式の文字列として出力
 */
export function toJsonLd(structuredData: StructuredDataBase): string {
  return JSON.stringify(structuredData, null, 2);
}

/**
 * 複数の構造化データを配列として結合出力
 */
export function combineStructuredData(
  structuredDataArray: StructuredDataBase[]
): string {
  return JSON.stringify(structuredDataArray, null, 2);
}
