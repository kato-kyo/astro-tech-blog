# 基本設計書

## 1. システム概要

### 1.1 システム名
Tech Blog (astoro-tech-blog)

### 1.2 システムアーキテクチャ
```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│                     Static HTML/CSS/JS                     │
│  ┌───────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │  Astro Pages  │  │ React Components│  │  Static Assets│  │
│  │  (Pre-built)  │  │  (Hydrated)     │  │  (Optimized)  │  │
│  └───────────────┘  └─────────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Build Time (SSG)                        │
│  ┌───────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │     Astro     │  │    Pagefind     │  │   TailwindCSS │  │
│  │  (Generator)  │  │ (Search Index)  │  │  (Processor)  │  │
│  └───────────────┘  └─────────────────┘  └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Content Layer                          │
│  ┌───────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │   Markdown    │  │   Frontmatter   │  │     Assets    │  │
│  │    Files      │  │   (Metadata)    │  │   (Images)    │  │
│  └───────────────┘  └─────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 技術スタック詳細
- **静的サイトジェネレーター**: Astro 5.x
- **UIライブラリ**: React 19.x
- **型安全性**: TypeScript 5.x (strict mode)
- **スタイリング**: TailwindCSS 3.x + Typography plugin
- **検索エンジン**: astro-pagefind (静的全文検索)
- **日付処理**: date-fns (日本語ローカル対応)
- **読了時間算出**: reading-time
- **開発ツール**: ESLint, Prettier, Vite (開発サーバー)
- **フォント**: Inter (UI), JetBrains Mono (Code)

## 2. システムアーキテクチャ詳細

### 2.1 ハイブリッド構成の設計思想

#### 2.1.1 Astroコンポーネントの責務
- **静的コンテンツレンダリング**: SEO重要部分、レイアウト構造
- **サーバーサイドロジック**: ファイルシステムアクセス、メタデータ処理
- **ビルド時処理**: 静的ページ生成、ルーティング設定

#### 2.1.2 Reactコンポーネントの責務
- **インタラクティブUI**: ユーザー操作に応答する機能
- **状態管理**: テーマ設定、メニュー開閉状態
- **クライアントサイド処理**: 動的な見た目の変更、アニメーション

#### 2.1.3 ハイドレーション戦略
```typescript
// 即座にハイドレーション（UX重要）
<Header client:load />
<ThemeToggle client:load />
<TableOfContents client:load />  // 記事読み上げに重要

// 表示時にハイドレーション（パフォーマンス重視）
<BlogCard client:visible />

// 静的レンダリング（SEO重視）
<SearchBox /> // Astroコンポーネント
```

### 2.2 ディレクトリ構造設計

```
src/
├── components/
│   ├── react/                    # React専用フォルダ
│   │   ├── BlogCard.tsx         # ブログカード
│   │   ├── Footer.tsx           # フッター
│   │   ├── Header.tsx           # ヘッダー
│   │   ├── MobileMenu.tsx       # モバイルメニュー
│   │   ├── Navigation.tsx       # ナビゲーション
│   │   ├── TableOfContents.tsx  # 目次
│   │   ├── ThemeToggle.tsx      # テーマ切り替え
│   │   └── Welcome.tsx          # ヒーローセクション
│   └── SearchBox.astro          # 検索ボックス（Astro）
├── content/
│   ├── blog/                    # ブログ記事
│   │   ├── *.md                 # Markdownファイル
│   └── config.ts                # Content Collections設定
├── layouts/
│   ├── BaseLayout.astro         # ベースレイアウト
│   └── BlogLayout.astro         # ブログレイアウト
├── pages/                       # ルーティング
│   ├── blog/
│   │   ├── [...slug].astro      # 動的ブログページ
│   │   └── index.astro          # ブログ一覧
│   ├── tags/
│   │   ├── [tag].astro          # 動的タグページ
│   │   └── index.astro          # タグ一覧
│   ├── about.astro              # 固定ページ
│   ├── contact.astro
│   ├── index.astro              # ホーム
│   ├── privacy.astro
│   └── rss.xml.js               # RSS生成
└── styles/
    └── global.css               # グローバルスタイル
```

## 3. コンポーネント設計詳細

### 3.1 Reactコンポーネント設計

#### 3.1.1 Header コンポーネント
```typescript
interface HeaderProps {
  currentPath: string;
}

// 機能:
// - ロゴ表示とサイトタイトル
// - ナビゲーションメニュー統合
// - テーマ切り替えボタン統合
// - モバイルメニュー統合
// - スティッキーヘッダー（backdrop-blur効果）
```

#### 3.1.2 Navigation コンポーネント
```typescript
interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  mobile?: boolean;      // モバイル表示モード
  currentPath: string;
  className?: string;    // 追加スタイル
}

// 機能:
// - デスクトップ用水平ナビゲーション
// - モバイル用縦型ナビゲーション（mobile=true時）
// - アクティブページのハイライト表示
// - ホバーエフェクト
```

#### 3.1.3 ThemeToggle コンポーネント
```typescript
// 機能:
// - ライト/ダークモードの切り替え
// - システム設定の自動検出
// - LocalStorageでの設定永続化
// - スムーズなトランジション効果
```

#### 3.1.4 BlogCard コンポーネント
```typescript
import type { CollectionEntry } from 'astro:content';

interface BlogCardProps {
  post: CollectionEntry<'blog'>;  // Astro Content Collections型
  className?: string;             // 追加スタイル
}

// 機能:
// - カード型レイアウト
// - ヒーロー画像表示（プレースホルダー対応）
// - メタ情報表示（日付、読了時間、タグ、カテゴリ）
// - reading-timeライブラリによる読了時間算出
// - date-fnsライブラリによる日付フォーマット
// - ホバーエフェクト（画像ズーム、カード影）
```

#### 3.1.5 TableOfContents コンポーネント
```typescript
import type { MarkdownHeading } from 'astro';

interface TableOfContentsProps {
  headings: MarkdownHeading[];  // Astro標準の見出し型
  className?: string;           // 追加スタイル
}

// 機能:
// - 見出し階層の表現（h2, h3のみ表示）
// - IntersectionObserverによる現在位置のハイライト
// - スムーズスクロール
// - 深さ別インデント（h3は左にマージン）
// - アクティブ状態の視覚的フィードバック
```

#### 3.1.6 MobileMenu コンポーネント
```typescript
interface MobileMenuProps {
  navItems: NavItem[];
  currentPath: string;
}

// 機能:
// - ハンバーガーメニューアイコン
// - スライドアニメーション
// - オーバーレイ表示
// - アクティブページハイライト
```

#### 3.1.7 Footer コンポーネント
```typescript
interface FooterProps {
  className?: string;  // 追加スタイル
}

// 機能:
// - サイトリンク
// - SNSリンク（GitHub, Twitter等）
// - 著作権表示
// - RSS購読リンク
```

#### 3.1.8 Welcome コンポーネント
```typescript
interface WelcomeProps {
  title: string;
  description: string;
  className?: string;  // 追加スタイル
}

// 機能:
// - ヒーローセクション
// - アニメーション効果
// - レスポンシブデザイン
// - CTA（行動喚起）
```

### 3.2 Astroコンポーネント設計

#### 3.2.1 BaseLayout コンポーネント
```typescript
interface Props {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}

// 機能:
// - HTML文書構造
// - SEOメタタグ
// - OGP設定
// - テーマ初期化スクリプト
// - フォント読み込み
// - グローバルスタイル適用
```

#### 3.2.2 BlogLayout コンポーネント
```typescript
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  tags: string[];
  readingTime: string;
}

// 機能:
// - ブログ記事専用レイアウト
// - 記事メタ情報表示
// - 構造化データ（JSON-LD）
// - 目次統合
// - 関連記事表示
```

#### 3.2.3 SearchBox コンポーネント
```astro
// 実装: astro-pagefindパッケージを使用
import Search from 'astro-pagefind/components/Search';

export interface Props {
  id?: string;
  className?: string;
  placeholder?: string;
}

// 機能:
// - astro-pagefindパッケージを使用した検索機能
// - 日本語ローカライゼーション対応
// - カスタムスタイリング（ダークモード対応）
// - 検索結果のリアルタイム表示
// - 検索結果のハイライト表示
```

## 4. データ構造設計

### 4.1 Content Collections スキーマ
```typescript
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),                    // 記事タイトル（必須）
    description: z.string(),              // 記事説明（必須）
    pubDate: z.coerce.date(),            // 公開日（必須）
    updatedDate: z.coerce.date().optional(), // 更新日（任意）
    heroImage: z.string().optional(),     // ヒーロー画像URL（任意）
    tags: z.array(z.string()),           // タグ配列（必須）
    category: z.string().optional(),      // カテゴリ（任意）
    draft: z.boolean().default(false),   // 下書きフラグ（デフォルト: false）
  }),
});
```

### 4.2 ブログ記事フロントマター例
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
```

### 4.3 ナビゲーションデータ構造
```typescript
interface NavItem {
  href: string;    // リンク先URL
  label: string;   // 表示テキスト
}

const navItems: NavItem[] = [
  { href: '/', label: 'ホーム' },
  { href: '/blog/', label: 'ブログ' },
  { href: '/tags/', label: 'タグ' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'お問い合わせ' },
];
```

## 5. スタイリング設計

### 5.1 TailwindCSS設定

#### 5.1.1 カラーパレット
```javascript
colors: {
  primary: {
    50: '#fdfcfd',   // 最も明るい
    100: '#f8f4f7',
    // ... 中間色
    900: '#3b1732',  // 最も暗い
    950: '#1f0c1a',
  },
  gray: {
    // システムグレー（ライト/ダークモード対応）
  }
}
```

#### 5.1.2 タイポグラフィ
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],           // UI用
  mono: ['JetBrains Mono', 'Menlo', 'monospace'],      // コード用
}
```

#### 5.1.3 ダークモード対応
```css
/* ライトモード */
.bg-white.dark\:bg-gray-900

/* ダークモード */
.dark .bg-white.dark\:bg-gray-900 {
  background-color: #111827;
}
```

### 5.2 コンポーネント別スタイル戦略

#### 5.2.1 レスポンシブブレークポイント
```javascript
// sm: 640px  - スマートフォン
// md: 768px  - タブレット
// lg: 1024px - デスクトップ
// xl: 1280px - 大画面
```

#### 5.2.2 アニメーション設計
```css
/* トランジション */
.transition-colors.duration-300
.transition-transform.duration-200

/* ホバーエフェクト */
.hover\:scale-105
.hover\:text-primary-600
```

## 6. ルーティング設計

### 6.1 静的ルート
```
/                    # ホームページ（index.astro）
/blog/              # ブログ一覧（blog/index.astro）
/tags/              # タグ一覧（tags/index.astro）
/about/             # Aboutページ（about.astro）
/contact/           # お問い合わせ（contact.astro）
/privacy/           # プライバシーポリシー（privacy.astro）
/rss.xml            # RSSフィード（rss.xml.js）
```

### 6.2 動的ルート
```
/blog/[...slug]/    # ブログ記事詳細（blog/[...slug].astro）
/tags/[tag]/        # タグ別記事一覧（tags/[tag].astro）
```

### 6.3 ルート生成ロジック
```typescript
// blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });
  
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
```

## 7. 検索機能設計

### 7.1 Pagefind統合
```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    pagefind()
  ]
});
```

### 7.2 検索インデックス構成
```html
<!-- 検索対象要素 -->
<main data-pagefind-body>
  <article data-pagefind-meta="title,date,tags">
    <!-- 記事コンテンツ -->
  </article>
</main>
```

### 7.3 検索UI設計
```typescript
// SearchBoxコンポーネント
interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  metadata: {
    date: string;
    tags: string[];
  };
}
```

## 8. SEO・OGP設計

### 8.1 メタタグ構成
```html
<!-- 基本メタタグ -->
<title>記事タイトル | Tech Blog</title>
<meta name="description" content="記事の説明" />
<link rel="canonical" href="https://example.com/blog/article" />

<!-- OGP -->
<meta property="og:type" content="article" />
<meta property="og:title" content="記事タイトル" />
<meta property="og:description" content="記事の説明" />
<meta property="og:image" content="https://example.com/hero.jpg" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
```

### 8.2 構造化データ
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "記事タイトル",
  "description": "記事の説明",
  "author": {
    "@type": "Person",
    "name": "著者名"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20"
}
```

## 9. パフォーマンス最適化

### 9.1 静的生成最適化
- **完全静的生成**: 全ページをビルド時に生成
- **部分ハイドレーション**: 必要な部分のみJavaScript実行
- **コード分割**: コンポーネント単位でのバンドル分割
- **画像最適化**: Astroの画像最適化機能活用

### 9.2 読み込み最適化
```html
<!-- フォントプリロード -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- 重要なCSSインライン化 -->
<style>
  /* クリティカルCSS */
</style>
```

### 9.3 ハイドレーション最適化
```typescript
// 遅延ハイドレーション
<BlogCard client:visible />

// 即座にハイドレーション（重要なUX機能）
<Header client:load />
<ThemeToggle client:load />
<TableOfContents client:load />

// 静的レンダリング（ハイドレーションなし）
<Footer /> // シンプルなリンク集のため
```

## 10. 開発・ビルドプロセス

### 10.1 開発コマンド
```bash
npm run dev      # 開発サーバー起動（localhost:4321）
npm run build    # 本番ビルド
npm run preview  # ビルド結果プレビュー
```

### 10.2 コード品質管理
```bash
npm run lint         # ESLintチェック
npm run lint:fix     # ESLint自動修正
npm run format       # Prettier実行
npm run format:check # Prettierチェック
npm run check        # lint + format:check
```

### 10.3 ビルド出力
```
dist/
├── index.html              # ホームページ
├── blog/
│   ├── index.html         # ブログ一覧
│   └── article-slug/
│       └── index.html     # 各記事
├── _astro/
│   ├── *.css             # 最適化されたCSS
│   └── *.js              # 最適化されたJS
└── pagefind/
    ├── pagefind.js       # 検索エンジン
    └── index/            # 検索インデックス
```

## 11. 拡張性・保守性

### 11.1 コンポーネント再利用
- **Props型定義**: TypeScriptによる型安全性
- **デフォルト値設定**: 柔軟な利用を可能にする
- **責務分離**: 単一責任の原則に従った設計

### 11.2 設定外部化
```typescript
// astro.config.mjs - 統合設定
// tailwind.config.mjs - スタイル設定
// tsconfig.json - TypeScript設定
// eslint.config.js - リント設定
```

### 11.3 将来の拡張ポイント
- **多言語対応**: i18n統合の準備
- **CMS統合**: ヘッドレスCMS連携
- **コメント機能**: 外部サービス統合
- **PWA対応**: サービスワーカー追加

---

**文書作成日**: 2025-01-15  
**作成者**: リバースエンジニアリングによる自動生成  
**バージョン**: 1.0  
**関連文書**: 10-requirements.md