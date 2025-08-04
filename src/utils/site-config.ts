/**
 * サイト設定管理ユーティリティ
 *
 * AstroのContent Collectionsを使用してサイト設定を管理します。
 * 設定は src/content/site/config.yaml で定義されています。
 */

import { getEntry } from 'astro:content';

/**
 * サイト設定取得関数
 * @returns サイト設定オブジェクト
 */
export const getSiteConfig = async () => {
  const config = await getEntry('site', 'config');
  if (!config) {
    throw new Error(
      'Site config not found. Please check src/content/site/config.yaml exists.'
    );
  }
  return config.data;
};

/**
 * ページタイトル生成ヘルパー関数
 * @param pageTitle ページ固有のタイトル
 * @returns 完全なページタイトル
 *
 * 使用例:
 * - createPageTitle('記事一覧') → '記事一覧 - Tech Blog'
 * - createPageTitle('') → 'Tech Blog - 技術記事と学習記録'（ホームページ用）
 */
export const createPageTitle = async (
  pageTitle: string = ''
): Promise<string> => {
  const config = await getSiteConfig();

  if (!pageTitle) {
    // ホームページの場合
    return `${config.title}${config.seo.titleSeparator}${config.subtitle}`;
  }

  // その他のページの場合
  return `${pageTitle}${config.seo.titleSeparator}${config.title}`;
};

/**
 * カノニカルURL生成ヘルパー関数
 * @param path パス（先頭の/は自動付与）
 * @returns 完全なURL
 */
export const createCanonicalUrl = async (
  path: string = ''
): Promise<string> => {
  const config = await getSiteConfig();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.url}${cleanPath}`;
};

/**
 * 設定の型定義をエクスポート（Content Collectionsから自動生成）
 */
export type SiteConfig = Awaited<ReturnType<typeof getSiteConfig>>;
