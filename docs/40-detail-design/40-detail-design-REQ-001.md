# 詳細設計書 - REQ-001: 記事表示機能

## 1. 概要

### 1.1 要件概要
- **要件ID**: REQ-001
- **要件名**: 記事表示機能
- **概要**: ブログ記事の表示機能
- **優先度**: High
- **実装状況**: ✅ 完了

### 1.2 機能詳細
- Markdownで記述された記事をHTMLに変換して表示
- 記事メタ情報（タイトル、説明、公開日、更新日、タグ、カテゴリ）の表示
- ヒーロー画像の表示（設定されている場合）
- 読了時間の算出・表示
- 目次の自動生成・表示（記事内見出しベース）

## 2. アーキテクチャ設計

### 2.1 システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                     記事表示システム                        │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │ [...slug].astro│  │  BlogLayout.astro│  │TableOfContents│  │
│  │   (ルーティング) │  │   (レイアウト)   │  │  (目次生成)   │  │
│  └───────────────┘  └─────────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │Content Collections│  │  reading-time   │  │   date-fns    │  │
│  │  (データソース)   │  │ (読了時間計算)  │  │ (日付フォーマット)│  │
│  └───────────────┘  └─────────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │   Markdown    │  │     Astro       │  │  TailwindCSS  │  │
│  │   (コンテンツ)  │  │ (静的サイト生成) │  │ (スタイリング) │  │
│  └───────────────┘  └─────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 データフロー

```
1. URL Request (/blog/article-slug/)
   ↓
2. getStaticPaths() - 全記事のパス生成
   ↓
3. Content Collections - 記事データ取得
   ↓
4. BlogLayout.astro - レイアウト適用
   ↓
5. 並列処理:
   ├─ post.render() - Markdown → HTML変換
   ├─ readingTime() - 読了時間計算
   ├─ format() - 日付フォーマット
   └─ headings抽出 - 目次データ生成
   ↓
6. HTML出力 + TableOfContents（client:load）
```

## 3. コンポーネント設計

### 3.1 主要コンポーネント

#### 3.1.1 [...slug].astro (ルーティングコンポーネント)

**ファイルパス**: `src/pages/blog/[...slug].astro`

**責務**:
- 動的ルーティング処理
- 記事データの取得とBlogLayoutへの受け渡し

**実装詳細**:
```typescript
// 静的パス生成
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}

type Props = CollectionEntry<'blog'>;
const post = Astro.props;
```

**設計ポイント**:
- 下書き記事（`draft: true`）を除外
- 各記事のslugをURLパラメータとして使用
- CollectionEntry型でプロパティの型安全性を確保

#### 3.1.2 BlogLayout.astro (レイアウトコンポーネント)

**ファイルパス**: `src/layouts/BlogLayout.astro`

**責務**:
- 記事表示の全体レイアウト
- メタ情報の表示
- ヒーロー画像の表示
- 読了時間の計算・表示
- 目次との連携

**Props Interface**:
```typescript
export interface Props {
  post: CollectionEntry<'blog'>;
}
```

**主要処理**:
```typescript
// データ抽出
const { title, description, pubDate, updatedDate, heroImage, tags, category } = post.data;

// Markdownレンダリング
const { Content, headings } = await post.render();

// 読了時間計算
const readTime = readingTime(post.body);

// 日付フォーマット
const formattedDate = format(pubDate, 'yyyy年MM月dd日', { locale: ja });
```

**レイアウト構造**:
```html
<BaseLayout>
  <Header />
  <main>
    <article>
      <!-- ヒーローセクション -->
      <header>
        - ヒーロー画像（条件付き表示）
        - メタ情報（公開日、更新日、読了時間、カテゴリ）
        - タイトル
        - 説明
        - タグ一覧
      </header>
      
      <!-- コンテンツ+目次 -->
      <div class="grid">
        - TableOfContents（サイドバー）
        - Content（記事本文）
      </div>
      
      <!-- 記事フッター -->
      <footer>
        - タグ再表示
        - 戻るボタン
      </footer>
    </article>
  </main>
  <Footer />
</BaseLayout>
```

#### 3.1.3 TableOfContents.tsx (目次コンポーネント)

**ファイルパス**: `src/components/react/TableOfContents.tsx`

**責務**:
- 記事内見出しからの目次自動生成
- 現在位置のハイライト表示
- スムーズスクロール機能

**Props Interface**:
```typescript
interface TableOfContentsProps {
  headings: MarkdownHeading[];
  className?: string;
}
```

**主要機能**:
```typescript
// 見出しフィルタリング（h2, h3のみ）
const tocHeadings = headings.filter(h => h.depth <= 3);

// IntersectionObserver設定
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
      }
    });
  },
  {
    rootMargin: '-20% 0% -80% 0%',
    threshold: 0,
  }
);

// スムーズスクロール
const handleClick = (slug: string) => {
  const element = document.getElementById(slug);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
```

**ハイドレーション設定**:
```astro
<TableOfContents headings={headings} client:load />
```

## 4. データ設計

### 4.1 Content Collections スキーマ

**ファイルパス**: `src/content/config.ts`

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),                    // 記事タイトル（必須）
    description: z.string(),              // 記事説明（必須）
    pubDate: z.coerce.date(),            // 公開日（必須、自動変換）
    updatedDate: z.coerce.date().optional(), // 更新日（任意）
    heroImage: z.string().optional(),     // ヒーロー画像URL（任意）
    tags: z.array(z.string()),           // タグ配列（必須）
    category: z.string().optional(),      // カテゴリ（任意）
    draft: z.boolean().default(false),   // 下書きフラグ（デフォルト: false）
  }),
});
```

### 4.2 フロントマター例

```yaml
---
title: 'TypeScriptのベストプラクティス'
description: 'TypeScriptを使った開発でのベストプラクティスをまとめました'
pubDate: 2024-01-15
updatedDate: 2024-01-20
heroImage: 'https://example.com/hero.jpg'
tags: ['TypeScript', 'JavaScript', 'プログラミング']
category: '技術'
draft: false
---

# TypeScriptのベストプラクティス

記事の本文をここに記述...
```

### 4.3 Astro Content API

**記事データ取得**:
```typescript
// 単一記事取得
const post = await getEntry('blog', slug);

// 複数記事取得（下書き除外）
const posts = await getCollection('blog', ({ data }) => !data.draft);

// レンダリング
const { Content, headings } = await post.render();
```

**MarkdownHeading型**:
```typescript
interface MarkdownHeading {
  depth: number;    // 見出しレベル（1-6）
  slug: string;     // URLフラグメント用ID
  text: string;     // 見出しテキスト
}
```

## 5. スタイリング設計

### 5.1 レスポンシブレイアウト

**グリッドシステム**:
```css
/* デスクトップ: 目次 + コンテンツ */
.lg:grid.lg:grid-cols-4.lg:gap-8 {
  grid-template-columns: 1fr 3fr; /* 目次25% : コンテンツ75% */
}

/* モバイル: コンテンツのみ */
.hidden.lg:block {
  display: none; /* 目次非表示 */
}
```

**アスペクト比固定**:
```css
.aspect-video {
  aspect-ratio: 16 / 9; /* ヒーロー画像 */
}
```

### 5.2 タイポグラフィ

**プロースタイル**:
```css
.prose.prose-lg.dark:prose-invert {
  /* TailwindCSS Typography plugin */
  max-width: none;
  color: #374151;
  line-height: 1.75;
}

/* ダークモード対応 */
.dark .prose-invert {
  color: #d1d5db;
}
```

**見出しスタイル**:
```css
.text-3xl.lg:text-4xl.font-bold {
  font-size: 1.875rem; /* 30px */
  font-weight: 700;
  line-height: 2.25rem;
}

@media (min-width: 1024px) {
  .lg:text-4xl {
    font-size: 2.25rem; /* 36px */
  }
}
```

### 5.3 目次スタイリング

**スティッキー配置**:
```css
.sticky.top-8 {
  position: sticky;
  top: 2rem; /* ヘッダー分のオフセット */
}
```

**階層表示**:
```css
/* h3見出しのインデント */
.ml-4.text-xs {
  margin-left: 1rem;
  font-size: 0.75rem;
}

/* アクティブ状態 */
.text-primary-600.dark:text-primary-400.font-medium {
  color: #a06d95;
  font-weight: 500;
}
```

## 6. パフォーマンス設計

### 6.1 静的生成最適化

**ビルド時処理**:
```typescript
// 全記事を事前生成
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}
```

**利点**:
- サーバーレスポンス時間: 0ms（静的ファイル配信）
- SEO最適化: 完全なHTML事前生成
- CDN最適化: エッジキャッシュ対応

### 6.2 画像最適化

**ヒーロー画像**:
```html
<img
  src={heroImage}
  alt={title}
  class="w-full h-full object-cover"
  loading="eager"  <!-- Above-the-fold画像は即座読み込み -->
/>
```

**最適化ポイント**:
- `loading="eager"`: ファーストビュー画像の優先読み込み
- `object-cover`: アスペクト比維持でのトリミング
- WebP/AVIF対応（将来的に`@astrojs/image`で実装予定）

### 6.3 JavaScript最適化

**部分ハイドレーション**:
```astro
<!-- 目次は即座にハイドレーション（UX重要） -->
<TableOfContents headings={headings} client:load />

<!-- 他のコンポーネントは必要時のみ -->
<SocialShare client:visible />
```

**バンドルサイズ**:
- TableOfContents: ~3KB（gzip圧縮後）
- IntersectionObserver polyfill: 不要（モダンブラウザ対応）

## 7. SEO・アクセシビリティ設計

### 7.1 構造化データ

**Article Schema（実装予定）**:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "記事タイトル",
  "description": "記事の説明",
  "author": {
    "@type": "Person",
    "name": "著者名"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20",
  "image": "https://example.com/hero.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Tech Blog"
  }
}
```

### 7.2 セマンティックHTML

**記事構造**:
```html
<article>
  <header>                    <!-- 記事ヘッダー -->
    <h1>記事タイトル</h1>      <!-- メインタイトル -->
    <time datetime="...">     <!-- 機械可読な日付 -->
  </header>
  
  <main>                      <!-- 記事本文 -->
    <nav>                     <!-- 目次ナビゲーション -->
      <ol>                    <!-- 順序付きリスト -->
    </nav>
    <div class="prose">       <!-- 記事コンテンツ -->
  </main>
  
  <footer>                    <!-- 記事フッター -->
    <div>タグ一覧</div>
  </footer>
</article>
```

### 7.3 アクセシビリティ

**キーボード操作**:
```typescript
// 目次リンク
<button
  onClick={() => handleClick(heading.slug)}
  className="block w-full text-left"
  aria-label={`${heading.text}にジャンプ`}
>
```

**スクリーンリーダー対応**:
```html
<!-- 読み上げ用テキスト -->
<span className="sr-only">目次</span>

<!-- ARIAラベル -->
<nav aria-label="記事目次">
  <ol role="list">
```

## 8. エラーハンドリング

### 8.1 404エラー対応

**存在しない記事**:
```typescript
// getStaticPaths()で事前生成されていない場合は自動的に404
// Astroが自動的に404ページを表示
```

### 8.2 画像読み込みエラー

**ヒーロー画像**:
```astro
{heroImage && (
  <div class="mb-8 aspect-video rounded-lg overflow-hidden">
    <img
      src={heroImage}
      alt={title}
      class="w-full h-full object-cover"
      loading="eager"
      onerror="this.style.display='none'"  <!-- エラー時非表示 -->
    />
  </div>
)}
```

### 8.3 JavaScript無効時の対応

**目次機能**:
- JavaScript無効でも静的HTMLで目次表示
- スムーズスクロールはブラウザネイティブにフォールバック
- アクティブハイライトのみJavaScript依存

## 9. 測定・監視

### 9.1 パフォーマンス指標

**Core Web Vitals**:
- **LCP (Largest Contentful Paint)**: 1.5秒以下目標
  - ヒーロー画像の最適化が重要
- **FID (First Input Delay)**: 100ms以下目標
  - 部分ハイドレーションで軽量化
- **CLS (Cumulative Layout Shift)**: 0.1以下目標
  - aspect-ratio指定で画像レイアウトシフト防止

### 9.2 ユーザビリティ指標

**読了率**:
- 目次クリック率の測定
- スクロール深度の追跡
- 滞在時間の分析

**検索性**:
- 記事内検索の利用率
- 目次からのナビゲーション率

## 10. 今後の拡張計画

### 10.1 近期実装予定

1. **構造化データ実装** (TASK-030)
   - Article Schema.orgの埋め込み
   - リッチスニペット対応

2. **関連記事表示** (TASK-040)
   - タグベースの関連記事算出
   - 記事末尾での表示

### 10.2 将来的な拡張

1. **読了進捗表示**
   - プログレスバーの追加
   - 推定残り時間の表示

2. **記事評価機能**
   - ハートボタンによる評価
   - 評価データの集計

3. **印刷最適化**
   - 印刷用CSSの改善
   - 目次の印刷時非表示

---

**文書作成日**: 2025-01-15  
**最終更新日**: 2025-01-15  
**作成者**: システム設計書自動生成  
**バージョン**: 1.0  
**関連文書**: 10-requirements.md, 20-basic-design.md, 30-todo-list.md