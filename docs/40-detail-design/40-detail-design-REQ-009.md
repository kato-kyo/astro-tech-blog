# 詳細設計書 - REQ-009: サイトマップ機能

## 1. 概要

### 1.1 要件概要
- **要件ID**: REQ-009
- **要件名**: サイトマップ機能
- **概要**: 検索エンジン向けサイトマップの生成
- **優先度**: Medium
- **実装状況**: ✅ 完了

### 1.2 機能詳細
- XML形式のサイトマップ自動生成
- 全ページのURL情報を含む
- 検索エンジンクローラー向け最適化

## 2. アーキテクチャ設計

### 2.1 システム構成図

```mermaid
graph TB
    A[サイトマップシステム] --> B[@astrojs/sitemap]
    A --> C[ビルド時生成]
    
    B --> D[XML生成]
    B --> E[URL収集]
    B --> F[sitemap.xml出力]
    
    C --> G[全ページスキャン]
    C --> H[動的ルート処理]
    C --> I[除外設定]
    
    D --> J[sitemap.xml]
    D --> K[robots.txt連携]
    
    E --> L[静的ページ]
    E --> M[動的ページ]
    E --> N[Content Collections]
    
    G --> O[pages/ディレクトリ]
    G --> P[.astro ファイル]
    G --> Q[.md ファイル]
    
    H --> R[ブログ記事]
    H --> S[タグページ]
    H --> T[カテゴリページ]
```

### 2.2 データフロー

```
【ビルド時処理】
1. astro build 実行
   ↓
2. @astrojs/sitemap が全ページをスキャン
   ↓
3. URL収集処理
   ├─ 静的ページ（pages/*.astro）
   ├─ 動的ページ（[...slug].astro）
   ├─ Content Collections ベースページ
   └─ RSS・API除外
   ↓
4. XML sitemap生成
   ├─ <url> 要素の作成
   ├─ <lastmod> 日付設定
   ├─ <changefreq> 頻度設定
   └─ <priority> 優先度設定
   ↓
5. sitemap.xml ファイル出力（dist/sitemap.xml）
```

## 3. 実装設計

### 3.1 Astro設定

**ファイルパス**: `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com', // サイトマップ生成に必要
  integrations: [
    // 他のintegrations...
    sitemap({
      // カスタム設定（デフォルトでも動作）
      customPages: [
        // 手動で追加したいページがあれば指定
      ],
      serialize(item) {
        // URL毎のカスタマイズが可能
        return item;
      },
    }),
  ],
});
```

### 3.2 自動URL収集

**収集対象ページ**:
```
静的ページ:
/                     (index.astro)
/about/               (about.astro)
/contact/             (contact.astro)
/privacy/             (privacy.astro)
/blog/                (blog/index.astro)
/tags/                (tags/index.astro)

動的ページ:
/blog/article-1/      (blog/[...slug].astro)
/blog/article-2/      (blog/[...slug].astro)
/tags/typescript/     (tags/[tag].astro)
/tags/react/          (tags/[tag].astro)
```

**除外対象**:
```
API エンドポイント:
/rss.xml             (RSS配信)
/api/*               (API ルート)

管理画面:
/admin/*             (存在しないが将来の拡張)

404ページ:
/404                 (エラーページ)
```

## 4. 生成されるXML構造

### 4.1 サイトマップXML例

**sitemap.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- ホームページ -->
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- ブログ一覧 -->
  <url>
    <loc>https://yourdomain.com/blog/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- 個別記事 -->
  <url>
    <loc>https://yourdomain.com/blog/typescript-best-practices/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- タグページ -->
  <url>
    <loc>https://yourdomain.com/tags/typescript/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- 固定ページ -->
  <url>
    <loc>https://yourdomain.com/about/</loc>
    <lastmod>2024-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### 4.2 XML要素説明

**必須要素**:
- `<loc>`: ページの完全URL
- `<lastmod>`: 最終更新日（ISO 8601形式）
- `<changefreq>`: 更新頻度（always, hourly, daily, weekly, monthly, yearly, never）
- `<priority>`: ページ優先度（0.0〜1.0）

## 5. カスタマイズ設定

### 5.1 カスタム設定例

**詳細設定版**:
```javascript
// astro.config.mjs
sitemap({
  // 除外パターン
  filter: (page) => {
    // 特定パターンを除外
    return !page.includes('/admin/') && 
           !page.includes('/draft/') &&
           !page.endsWith('/rss.xml');
  },
  
  // カスタムページ追加
  customPages: [
    'https://yourdomain.com/external-page/', // 外部ページも追加可能
  ],
  
  // 各URLのカスタマイズ
  serialize: (item) => {
    // ホームページの優先度を最高に
    if (item.url === 'https://yourdomain.com/') {
      item.priority = 1.0;
      item.changefreq = 'daily';
    }
    
    // ブログ記事の設定
    if (item.url.includes('/blog/') && item.url !== 'https://yourdomain.com/blog/') {
      item.priority = 0.8;
      item.changefreq = 'monthly';
    }
    
    // タグページの設定
    if (item.url.includes('/tags/')) {
      item.priority = 0.6;
      item.changefreq = 'weekly';
    }
    
    return item;
  },
  
  // 国際化サポート（将来の拡張）
  i18n: {
    defaultLocale: 'ja',
    locales: {
      ja: 'https://yourdomain.com',
      en: 'https://en.yourdomain.com',
    },
  },
})
```

### 5.2 動的lastmod設定

**記事の更新日を反映**:
```javascript
// 拡張設定（将来実装）
sitemap({
  serialize: async (item) => {
    // ブログ記事の場合、記事データから更新日を取得
    if (item.url.includes('/blog/')) {
      const slug = item.url.split('/blog/')[1].replace('/', '');
      try {
        const post = await getEntryBySlug('blog', slug);
        if (post?.data.updatedDate) {
          item.lastmod = post.data.updatedDate.toISOString();
        } else if (post?.data.pubDate) {
          item.lastmod = post.data.pubDate.toISOString();
        }
      } catch (error) {
        console.warn(`サイトマップ: ${slug} の更新日取得に失敗`, error);
      }
    }
    
    return item;
  },
})
```

## 6. robots.txt連携

### 6.1 robots.txt設定

**ファイルパス**: `public/robots.txt`

```
User-agent: *
Allow: /

# サイトマップの場所を指定
Sitemap: https://yourdomain.com/sitemap.xml

# クロール制限（例）
Disallow: /admin/
Disallow: /api/
Disallow: *.json
Disallow: /*?*

# クロール頻度制限
Crawl-delay: 1
```

### 6.2 動的robots.txt生成

**動的生成版**（将来実装）:
```javascript
// src/pages/robots.txt.js
export async function GET({ site }) {
  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${site}sitemap.xml

Disallow: /admin/
Disallow: /api/
  `.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
```

## 7. 検索エンジン最適化

### 7.1 クロール最適化

**優先度設定戦略**:
```
1.0: ホームページ
0.9: ブログ一覧、主要カテゴリ
0.8: 個別記事（人気記事は高めに）
0.6: タグページ、アーカイブ
0.5: 固定ページ（About、Contact等）
0.3: 古い記事、マイナータグ
```

**更新頻度設定**:
```
daily:   ホームページ、ブログ一覧
weekly:  人気タグ、カテゴリページ
monthly: 個別記事、固定ページ
yearly:  アーカイブ、古い記事
```

### 7.2 クロールバジェット最適化

**URL数の管理**:
```javascript
// 大量ページ対策（将来必要に応じて）
sitemap({
  serialize: (item) => {
    // 古い記事の優先度を下げる
    if (item.url.includes('/blog/')) {
      const currentYear = new Date().getFullYear();
      if (item.lastmod && new Date(item.lastmod).getFullYear() < currentYear - 2) {
        item.priority = 0.3;
        item.changefreq = 'yearly';
      }
    }
    
    return item;
  },
})
```

## 8. 分割サイトマップ（将来対応）

### 8.1 大規模サイト対応

**サイトマップ分割**:
```
sitemap.xml         (インデックス)
├── sitemap-pages.xml     (固定ページ)
├── sitemap-blog.xml      (ブログ記事)
├── sitemap-tags.xml      (タグページ)
└── sitemap-categories.xml (カテゴリページ)
```

**インデックスサイトマップ**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://yourdomain.com/sitemap-pages.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://yourdomain.com/sitemap-blog.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
</sitemapindex>
```

## 9. 監視・分析

### 9.1 サイトマップ送信

**Google Search Console**:
```
1. Google Search Console にログイン
2. 対象プロパティを選択
3. サイトマップ → 新しいサイトマップの追加
4. URL: https://yourdomain.com/sitemap.xml
5. 送信
```

**Bing Webmaster Tools**:
```
同様の手順でBingにも送信
```

### 9.2 エラー監視

**サイトマップエラーチェック**:
```javascript
// scripts/check-sitemap.mjs
import { JSDOM } from 'jsdom';

const response = await fetch('https://yourdomain.com/sitemap.xml');
const sitemapXml = await response.text();

const dom = new JSDOM(sitemapXml, { contentType: 'text/xml' });
const urls = dom.window.document.querySelectorAll('url loc');

console.log(`サイトマップ内URL数: ${urls.length}`);

// 各URLの存在確認
for (const urlElement of urls) {
  const url = urlElement.textContent;
  try {
    const pageResponse = await fetch(url);
    if (pageResponse.status !== 200) {
      console.error(`エラー ${pageResponse.status}: ${url}`);
    }
  } catch (error) {
    console.error(`アクセス失敗: ${url}`, error.message);
  }
}
```

## 10. パフォーマンス考慮

### 10.1 生成時間最適化

**ビルド時間への影響**:
```javascript
// @astrojs/sitemap は軽量で高速
// 通常、数百〜数千ページでも数秒以内で完了
```

### 10.2 ファイルサイズ管理

**XMLファイルサイズ**:
```
目安:
- 100ページ: 約10KB
- 1,000ページ: 約100KB  
- 10,000ページ: 約1MB

Google推奨上限: 50MB、50,000URL
```

## 11. 今後の拡張計画

### 11.1 動的サイトマップ

**実装予定**:
- 記事更新時のサイトマップ自動更新
- 人気度に基づく優先度動的調整
- 国際化サイトマップ対応

### 11.2 サイトマップ分析

**実装予定**:
- クロール状況の可視化
- インデックス率の追跡
- SEOパフォーマンス分析

### 11.3 画像サイトマップ

**実装予定**:
```xml
<url>
  <loc>https://yourdomain.com/blog/article/</loc>
  <image:image>
    <image:loc>https://yourdomain.com/images/hero.jpg</image:loc>
    <image:caption>記事のヒーロー画像</image:caption>
  </image:image>
</url>
```

---

**文書作成日**: 2025-01-15  
**最終更新日**: 2025-01-15  
**作成者**: システム設計書自動生成  
**バージョン**: 1.0  
**関連文書**: 10-requirements.md, 20-basic-design.md, 30-todo-list.md