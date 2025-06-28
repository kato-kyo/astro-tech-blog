/**
 * サイト全体の設定を一元管理
 *
 * このファイルで定義された設定は、以下の箇所で使用されます：
 * - astro.config.mjs (サイトURL、sitemap設定)
 * - BaseLayout.astro (メタタグ、タイトル)
 * - 各ページファイル (ページタイトル)
 * - RSS配信 (フィード情報)
 * - Header/Footer コンポーネント (サイト名、コピーライト)
 */

export const SITE_CONFIG = {
  // ===========================================
  // 基本情報
  // ===========================================
  title: 'Tech Blog',
  subtitle: '技術記事と学習記録',
  url: 'https://yourdomain.com', // 本番環境のURL（末尾の/は不要）
  locale: 'ja',
  author: 'Your Name',

  // ===========================================
  // SEO・メタデータ
  // ===========================================
  seo: {
    // サイト全体のデフォルト説明文
    description: '技術に関する記事や学習記録、開発の知見を共有するブログです。',

    // ホームページ用の詳細説明文
    homeDescription:
      '技術に関する記事や学習記録、開発の知見を共有するブログです。プログラミング、Web開発、インフラなどの情報を発信しています。',

    // OGP画像（public/配下のパス）
    defaultOgImage: '/og-image.jpg',

    // ページタイトルの区切り文字
    titleSeparator: ' - ',

    // サイト名（OGPなどで使用）
    siteName: 'Tech Blog',
  },

  // ===========================================
  // ナビゲーション
  // ===========================================
  nav: {
    // ヘッダーのサイトタイトル表示名
    headerTitle: 'Tech Blog',
  },

  // ===========================================
  // RSS設定
  // ===========================================
  rss: {
    title: 'Tech Blog RSS Feed',
    description: '技術に関する記事や学習記録、開発の知見を共有するブログです。',
  },

  // ===========================================
  // ページネーション
  // ===========================================
  pagination: {
    postsPerPage: 10,
  },

  // ===========================================
  // Aboutページ
  // ===========================================
  about: {
    // Aboutページの説明文
    description:
      'Tech Blogの管理人のプロフィールページです。経歴、スキル、実績などを紹介しています。',
    // Aboutページの挨拶文
    greeting: 'こんにちは！{siteName}の管理人です。',
  },

  // ===========================================
  // フッター情報
  // ===========================================
  footer: {
    siteName: 'Tech Blog',
    description: '技術に関する記事や学習記録、開発の知見を共有するブログです。',
    extendedDescription:
      '日々の学習や実務で得た知識を記録し、同じ道を歩む方々と情報を共有しています。',
    copyright: 'Tech Blog. All rights reserved.',
  },

  // ===========================================
  // ソーシャルメディア（将来用）
  // ===========================================
  social: {
    twitter: '@yourusername',
    github: 'https://github.com/yourusername',
  },
} as const;

/**
 * ページタイトル生成ヘルパー関数
 * @param pageTitle ページ固有のタイトル
 * @returns 完全なページタイトル
 *
 * 使用例:
 * - createPageTitle('記事一覧') → '記事一覧 - Tech Blog'
 * - createPageTitle('') → 'Tech Blog - 技術記事と学習記録'（ホームページ用）
 */
export const createPageTitle = (pageTitle: string = ''): string => {
  if (!pageTitle) {
    // ホームページの場合
    return `${SITE_CONFIG.title}${SITE_CONFIG.seo.titleSeparator}${SITE_CONFIG.subtitle}`;
  }

  // その他のページの場合
  return `${pageTitle}${SITE_CONFIG.seo.titleSeparator}${SITE_CONFIG.title}`;
};

/**
 * カノニカルURL生成ヘルパー関数
 * @param path パス（先頭の/は自動付与）
 * @returns 完全なURL
 */
export const createCanonicalUrl = (path: string = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
};

/**
 * 設定の型定義をエクスポート
 */
export type SiteConfig = typeof SITE_CONFIG;
