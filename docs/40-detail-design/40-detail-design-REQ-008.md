# 詳細設計書 - REQ-008: RSS配信機能

## 1. 概要

### 1.1 要件概要
- **要件ID**: REQ-008
- **要件名**: RSS配信機能
- **概要**: RSS/Atomフィードの配信機能
- **優先度**: Medium
- **実装状況**: ✅ 完了

### 1.2 機能詳細
- 最新記事のRSSフィード生成
- フィードメタデータの設定
- 購読用URLの提供

## 2. アーキテクチャ設計

### 2.1 システム構成図

```mermaid
graph TB
    A[RSS配信システム] --> B[@astrojs/rss]
    A --> C[RSS生成エンドポイント]
    
    B --> D[RSS 2.0フォーマット]
    B --> E[XMLエンコーディング]
    B --> F[メタデータ処理]
    
    C --> G[rss.xml.js]
    C --> H[GET リクエスト処理]
    C --> I[Content Collections API]
    
    D --> J[チャンネル情報]
    D --> K[アイテム情報]
    D --> L[日本語対応]
    
    I --> M[記事データ取得]
    I --> N[下書き除外]
    I --> O[日付ソート]
    
    M --> P[タイトル]
    M --> Q[説明]
    M --> R[URL]
    M --> S[公開日]
    M --> T[カテゴリ(タグ)]
```

### 2.2 データフロー

```
1. RSS配信リクエスト (GET /rss.xml)
   ↓
2. Content Collections API呼び出し
   ↓
3. 公開記事の取得
   ({ data }) => !data.draft
   ↓
4. 記事データの整理
   ├─ タイトル・説明の抽出
   ├─ URL生成 (/blog/[slug]/)
   ├─ 公開日の形式変換
   └─ タグの配列変換
   ↓
5. RSS XML生成
   ├─ チャンネル情報の設定
   ├─ アイテム配列の構築
   └─ XML形式での出力
   ↓
6. Content-Type: application/rss+xml で配信
```

## 3. 実装設計

### 3.1 RSS生成エンドポイント

**ファイルパス**: `src/pages/rss.xml.js`

**基本実装**:
```javascript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // 公開記事のみ取得
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Tech Blog',
    description: '技術に関する記事や学習記録、開発の知見を共有するブログです。',
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
```

### 3.2 RSS設定詳細

**チャンネル情報**:
```javascript
const rssConfig = {
  title: 'Tech Blog',                    // フィードタイトル
  description: '技術ブログの記事配信',      // フィード説明
  site: context.site,                    // サイトURL（astro.config.mjsから取得）
  language: 'ja',                        // 言語設定
  ttl: 60,                              // キャッシュ時間（分）
  managingEditor: 'noreply@example.com', // 編集者メール
  webMaster: 'webmaster@example.com',    // ウェブマスターメール
  copyright: '© 2024 Tech Blog',         // 著作権表示
};
```

**アイテム設定**:
```javascript
const rssItem = {
  title: post.data.title,                // 記事タイトル
  link: `/blog/${post.slug}/`,          // 記事URL（相対パス）
  pubDate: post.data.pubDate,           // 公開日（Date型）
  description: post.data.description,    // 記事説明
  categories: post.data.tags,           // カテゴリ（タグ配列）
  guid: `/blog/${post.slug}/`,          // 一意識別子
  author: 'noreply@example.com',        // 著者メール
  enclosure: post.data.heroImage ? {    // 添付ファイル（ヒーロー画像）
    url: post.data.heroImage,
    type: 'image/jpeg',
    length: 0,
  } : undefined,
};
```

## 4. XMLフォーマット詳細

### 4.1 RSS 2.0 構造

**生成されるXML例**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <!-- チャンネル情報 -->
    <title>Tech Blog</title>
    <description>技術に関する記事や学習記録、開発の知見を共有するブログです。</description>
    <link>https://yourdomain.com/</link>
    <language>ja</language>
    <lastBuildDate>Mon, 15 Jan 2024 09:00:00 GMT</lastBuildDate>
    <generator>@astrojs/rss</generator>
    
    <!-- 記事アイテム -->
    <item>
      <title>TypeScriptのベストプラクティス</title>
      <link>https://yourdomain.com/blog/typescript-best-practices/</link>
      <guid>https://yourdomain.com/blog/typescript-best-practices/</guid>
      <description>TypeScriptを使った開発でのベストプラクティスをまとめました</description>
      <pubDate>Mon, 15 Jan 2024 00:00:00 GMT</pubDate>
      <category>TypeScript</category>
      <category>JavaScript</category>
      <category>プログラミング</category>
    </item>
    
    <!-- 追加の記事... -->
  </channel>
</rss>
```

### 4.2 日本語対応

**エンコーディング設定**:
```javascript
customData: `
  <language>ja</language>
  <generator>Astro with @astrojs/rss</generator>
  <docs>https://www.rssboard.org/rss-specification</docs>
`
```

**日本語コンテンツのエスケープ**:
```javascript
// @astrojs/rssが自動的に処理
// - HTMLエンティティのエスケープ
// - UTF-8エンコーディング
// - CDATAセクションの適切な利用
```

## 5. サイト設定連携

### 5.1 Astro設定との統合

**astro.config.mjs**:
```javascript
export default defineConfig({
  site: 'https://yourdomain.com',  // RSS配信で使用
  integrations: [
    // @astrojs/rss は自動的に site を参照
  ],
});
```

**context.site の利用**:
```javascript
export async function GET(context) {
  // context.site = 'https://yourdomain.com'
  return rss({
    site: context.site,
    // 絶対URLが自動生成される
    // /blog/article/ → https://yourdomain.com/blog/article/
  });
}
```

### 5.2 環境別設定

**開発環境**:
```javascript
const isProduction = import.meta.env.PROD;
const siteUrl = context.site || 'http://localhost:4321';

return rss({
  site: siteUrl,
  title: isProduction ? 'Tech Blog' : 'Tech Blog (開発環境)',
  // ...
});
```

## 6. フィード最適化

### 6.1 記事件数制限

**最新記事の制限**:
```javascript
const posts = await getCollection('blog', ({ data }) => !data.draft);

const recentPosts = posts
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 20); // 最新20件のみ配信

return rss({
  items: recentPosts.map(post => ({
    // ...
  })),
});
```

### 6.2 内容の最適化

**説明文の調整**:
```javascript
const truncateDescription = (text, maxLength = 200) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

const rssItems = posts.map(post => ({
  title: post.data.title,
  description: truncateDescription(post.data.description),
  // ...
}));
```

**HTML内容の配信**:
```javascript
// 記事本文をHTML形式で配信（オプション）
const { Content } = await post.render();

const rssItem = {
  title: post.data.title,
  description: post.data.description,
  content: await renderToString(Content), // HTML内容
  // ...
};
```

## 7. RSS配信の告知

### 7.1 HTMLでの配信告知

**head要素での設定**:
```html
<!-- BaseLayout.astro -->
<head>
  <link 
    rel="alternate" 
    type="application/rss+xml" 
    title="Tech Blog RSS Feed" 
    href="/rss.xml" 
  />
</head>
```

### 7.2 フッターでのリンク

**Footer.tsx**:
```jsx
<div>
  <h3 className="footer-heading">購読</h3>
  <ul className="footer-links">
    <li>
      <a 
        href="/rss.xml" 
        className="flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.429 2.571c0-.952.771-1.714 1.714-1.714a1.71 1.71 0 011.715 1.714 1.71 1.71 0 01-1.715 1.715c-.943 0-1.714-.763-1.714-1.715zM3.429 7.571c0-.952.771-1.714 1.714-1.714a1.71 1.71 0 011.715 1.714 1.71 1.71 0 01-1.715 1.715c-.943 0-1.714-.763-1.714-1.715z"/>
        </svg>
        RSS配信
      </a>
    </li>
  </ul>
</div>
```

## 8. パフォーマンス・キャッシュ設計

### 8.1 静的生成

**ビルド時RSS生成**:
```javascript
// ビルド時に /rss.xml が静的ファイルとして生成される
// 動的処理不要でCDN配信可能
```

### 8.2 キャッシュ設定

**HTTPヘッダー設定**:
```javascript
export async function GET(context) {
  const rssResponse = rss({
    // RSS設定...
  });

  // キャッシュヘッダーの設定
  rssResponse.headers.set('Cache-Control', 'public, max-age=3600'); // 1時間キャッシュ
  rssResponse.headers.set('Content-Type', 'application/rss+xml; charset=utf-8');

  return rssResponse;
}
```

## 9. RSS配信の検証

### 9.1 バリデーション

**RSS検証ツール**:
- W3C Feed Validation Service
- RSS仕様準拠チェック
- エンコーディング確認

**自動検証スクリプト**:
```javascript
// scripts/validate-rss.mjs
import { JSDOM } from 'jsdom';

const response = await fetch('http://localhost:4321/rss.xml');
const rssXml = await response.text();

// RSS要素の存在確認
const dom = new JSDOM(rssXml, { contentType: 'text/xml' });
const rss = dom.window.document.querySelector('rss');

console.assert(rss, 'RSS要素が見つかりません');
console.assert(rss.getAttribute('version') === '2.0', 'RSS 2.0ではありません');
```

### 9.2 購読テスト

**RSSリーダーでのテスト**:
- Feedly での購読確認
- RSS Bandit での表示確認
- ブラウザでの直接表示確認

## 10. 今後の拡張計画

### 10.1 フィード機能拡張

**実装予定**:
- **カテゴリ別RSS**: `/rss/category/[category].xml`
- **タグ別RSS**: `/rss/tag/[tag].xml` 
- **全文配信**: 記事本文のHTML配信
- **画像配信**: enclosure要素でのメディア配信

**カテゴリ別RSS実装例**:
```javascript
// src/pages/rss/category/[category].xml.js
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const categories = [...new Set(posts.map(p => p.data.category).filter(Boolean))];
  
  return categories.map(category => ({
    params: { category },
    props: { category },
  }));
}

export async function GET({ props, request }) {
  const { category } = props;
  const posts = await getCollection('blog', ({ data }) => 
    !data.draft && data.category === category
  );

  return rss({
    title: `Tech Blog - ${category}カテゴリ`,
    description: `${category}カテゴリの記事配信`,
    // ...
  });
}
```

### 10.2 配信統計

**実装予定**:
- RSS購読者数の追跡
- 人気記事の分析
- 配信頻度の最適化

### 10.3 通知機能

**実装予定**:
- 新記事公開時の自動通知
- Webhook連携でのSNS投稿
- メール配信との統合

---

**文書作成日**: 2025-01-15  
**最終更新日**: 2025-01-15  
**作成者**: システム設計書自動生成  
**バージョン**: 1.0  
**関連文書**: 10-requirements.md, 20-basic-design.md, 30-todo-list.md