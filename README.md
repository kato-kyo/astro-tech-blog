# Tech Blog - Astro + React

技術に関する記事や学習記録、開発の知見を共有するブログサイトです。AstroフレームワークとReactコンポーネントを組み合わせたハイブリッド構成で構築されています。

## ✨ 特徴

- **静的サイト生成**: Astroによる高速な静的サイト生成
- **React統合**: インタラクティブなUIコンポーネントにReactを使用
- **TypeScript**: 型安全性を重視した開発
- **TailwindCSS**: ユーティリティファーストのスタイリング
- **コンテンツ管理**: Astro Content Collectionsによる記事管理
- **検索機能**: Pagefindによる全文検索
- **レスポンシブデザイン**: モバイルファーストのレスポンシブ対応
- **ダークモード**: システム設定に対応したテーマ切り替え
- **構造化データ**: Schema.org準拠のJSON-LD形式でSEO最適化

## 🚀 プロジェクト構成

```text
/
├── public/                          # 静的ファイル
│   ├── favicon.svg
│   ├── og-image.jpg
│   └── robots.txt
├── src/
│   ├── assets/                      # アセットファイル
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/                  # コンポーネント
│   │   ├── react/                   # Reactコンポーネント
│   │   │   ├── BlogCard.tsx         # ブログカードコンポーネント
│   │   │   ├── Footer.tsx           # フッターコンポーネント
│   │   │   ├── Header.tsx           # ヘッダーコンポーネント
│   │   │   ├── MobileMenu.tsx       # モバイルメニューコンポーネント
│   │   │   ├── Navigation.tsx       # ナビゲーションコンポーネント
│   │   │   ├── TableOfContents.tsx  # 目次コンポーネント
│   │   │   ├── ThemeToggle.tsx      # テーマ切り替えコンポーネント
│   │   │   └── Welcome.tsx          # ウェルカムコンポーネント
│   │   └── SearchBox.astro          # 検索ボックス（Astro）
│   ├── content/                     # コンテンツファイル
│   │   ├── blog/                    # ブログ記事
│   │   │   ├── astro-blog-setup.md
│   │   │   └── ...
│   │   └── config.ts                # コンテンツ設定
│   ├── layouts/                     # レイアウトコンポーネント
│   │   ├── BaseLayout.astro         # ベースレイアウト
│   │   └── BlogLayout.astro         # ブログ記事レイアウト
│   ├── pages/                       # ページファイル
│   │   ├── blog/                    # ブログ関連ページ
│   │   │   ├── [...slug].astro      # 動的ブログ記事ページ
│   │   │   └── index.astro          # ブログ一覧ページ
│   │   ├── tags/                    # タグ関連ページ
│   │   │   ├── [tag].astro          # 動的タグページ
│   │   │   └── index.astro          # タグ一覧ページ
│   │   ├── about.astro              # Aboutページ
│   │   ├── contact.astro            # お問い合わせページ
│   │   ├── index.astro              # ホームページ
│   │   ├── privacy.astro            # プライバシーポリシー
│   │   └── rss.xml.js               # RSSフィード
│   ├── styles/                      # スタイルファイル
│   │   └── global.css               # グローバルスタイル
│   └── utils/                       # ユーティリティ関数
│       ├── content.ts               # コンテンツ管理関数
│       └── structured-data.ts       # 構造化データ生成関数
├── astro.config.mjs                 # Astro設定
├── eslint.config.js                 # ESLint設定
├── package.json                     # 依存関係
├── tailwind.config.mjs              # TailwindCSS設定
└── tsconfig.json                    # TypeScript設定
```

## 🏗️ 技術スタック

### フレームワーク・ライブラリ
- **Astro**: 静的サイトジェネレーター
- **React**: UIコンポーネントライブラリ
- **TypeScript**: 型安全な開発

### スタイリング
- **TailwindCSS**: ユーティリティファーストCSS
- **Responsive Design**: モバイルファーストアプローチ

### 機能・ツール
- **Astro Content Collections**: コンテンツ管理
- **Pagefind**: 全文検索機能
- **date-fns**: 日付フォーマット
- **ESLint**: コード品質管理

## 🎨 コンポーネント設計

### Reactコンポーネント（8個）
インタラクティブな機能を持つコンポーネントはReactで実装：

- **Header**: サイトヘッダー（ナビゲーション統合）
- **Navigation**: メインナビゲーション（デスクトップ・モバイル対応）
- **Footer**: サイトフッター（リンク・SNS・著作権情報）
- **BlogCard**: ブログ記事カード（サムネイル・メタ情報）
- **ThemeToggle**: ダークモード切り替えボタン
- **TableOfContents**: 記事目次（スクロール連動）
- **MobileMenu**: モバイル用ハンバーガーメニュー
- **Welcome**: ヒーローセクション（アニメーション付き）

### Astroコンポーネント（3個）
静的な機能やレイアウトはAstroで実装：

- **SearchBox**: 検索機能（Pagefind統合）
- **BaseLayout**: ベースHTMLレイアウト
- **BlogLayout**: ブログ記事専用レイアウト

## 🧞 コマンド

プロジェクトルートから以下のコマンドを実行：

| コマンド                   | 動作                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | 依存関係をインストール                            |
| `npm run dev`             | 開発サーバーを起動（`localhost:4321`）            |
| `npm run build`           | 本番用サイトを`./dist/`にビルド                   |
| `npm run preview`         | ビルド結果をローカルでプレビュー                   |
| `npm run astro ...`       | Astro CLIコマンドを実行                          |
| `npm run astro -- --help` | Astro CLIのヘルプを表示                          |

## ⚠️ 運用上の注意点

### 検索機能について

**重要**: 検索機能は開発環境（`npm run dev`）では動作しません。

- **開発環境**: 検索ボックスに入力しても「検索結果が見つかりませんでした」と表示される
- **原因**: Pagefindの検索インデックスは本番ビルド時のみ生成される
- **解決方法**: 検索機能をテストする際は以下の手順を実行：

```bash
# 1. 本番ビルドを実行（検索インデックス生成）
npm run build

# 2. プレビューサーバーを起動
npm run preview
```

### 記事更新時の対応

記事の追加・更新・削除を行った際は、検索インデックスの更新が必要です：

1. **新しい記事の追加**: 再ビルドで自動的にインデックスに追加
2. **既存記事の更新**: 再ビルドでインデックス内容が更新
3. **記事の削除**: 再ビルドでインデックスから削除

### 開発とプレビューの使い分け

| 用途 | コマンド | 検索機能 | ホットリロード | 用途 |
|------|----------|----------|----------------|------|
| 開発 | `npm run dev` | ❌ 動作しない | ✅ 有効 | コンテンツ作成・UI開発 |
| プレビュー | `npm run preview` | ✅ 動作する | ❌ 無効 | 検索機能テスト・最終確認 |

## 📝 記事の追加方法

1. `src/content/blog/`ディレクトリに新しいMarkdownファイルを作成
2. フロントマターに必要な情報を記述：

```markdown
---
title: "記事タイトル"
description: "記事の説明"
pubDate: 2024-01-01
heroImage: "/blog-placeholder.jpg"
tags: ["tag1", "tag2"]
draft: false
---

記事の内容をここに書く...
```

## 🎯 パフォーマンス最適化

- **部分ハイドレーション**: 必要な部分のみReactでハイドレーション
- **静的生成**: ビルド時に全ページを静的生成
- **画像最適化**: Astroの画像最適化機能を活用
- **コード分割**: コンポーネント単位での適切なコード分割
- **SEO対応**: メタタグ、構造化データ、サイトマップ

## 🔍 SEO・構造化データ

本サイトは検索エンジン最適化（SEO）のため、Schema.org準拠の構造化データを実装しています。

### 実装済み構造化データ

#### 1. Article Schema（ブログ記事詳細ページ）
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "記事タイトル",
  "description": "記事の説明",
  "author": { "@type": "Person", "name": "著者名" },
  "publisher": { "@type": "Organization", "name": "サイト名" },
  "datePublished": "2024-01-01T00:00:00.000Z",
  "dateModified": "2024-01-01T00:00:00.000Z",
  "url": "https://yourdomain.com/blog/article-slug/",
  "image": ["https://yourdomain.com/hero-image.jpg"],
  "keywords": ["tag1", "tag2"],
  "articleSection": "カテゴリ名"
}
```

#### 2. WebSite Schema（サイト全体）
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tech Blog",
  "description": "技術に関する記事や学習記録を共有するブログ",
  "url": "https://yourdomain.com",
  "author": { "@type": "Person", "name": "著者名" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yourdomain.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

#### 3. Blog Schema（ブログ一覧ページ）
```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Tech Blog - ブログ",
  "description": "技術に関する記事や学習記録を共有するブログ",
  "url": "https://yourdomain.com/blog/",
  "author": { "@type": "Person", "name": "著者名" },
  "publisher": { "@type": "Organization", "name": "Tech Blog" }
}
```

#### 4. BreadcrumbList Schema（パンくずナビゲーション）
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://yourdomain.com/"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "ブログ",
      "item": "https://yourdomain.com/blog/"
    }
  ]
}
```

### 構造化データの設定

#### ファイル構成
- **`src/utils/structured-data.ts`**: 構造化データ生成関数
- **`src/layouts/BaseLayout.astro`**: WebSite schema、JSON-LD出力
- **`src/layouts/BlogLayout.astro`**: Article + BreadcrumbList schema
- **`src/pages/blog/index.astro`**: Blog schema（一覧ページ）
- **`src/pages/blog/page/[page].astro`**: Blog schema（ページネーション）

#### 実装の特徴
- **型安全性**: TypeScriptによる完全な型定義
- **自動生成**: 記事のメタデータから自動的に構造化データを生成
- **JSON-LD形式**: Google推奨のJSON-LD形式で出力
- **Schema.org準拠**: 最新のSchema.org仕様に準拠
- **SEO効果**: リッチスニペット、検索結果の表示改善

#### 確認方法
構造化データの実装状況は以下のツールで確認できます：

1. **Google Search Console**
   - [構造化データレポート](https://search.google.com/search-console)で検証

2. **Google Rich Results Test**
   - [Rich Results Test](https://search.google.com/test/rich-results)でテスト

3. **Schema Markup Validator**
   - [Schema.org Validator](https://validator.schema.org/)で検証

### 設定のカスタマイズ

構造化データの設定は`src/config/site.ts`で一元管理されています：

```typescript
export const SITE_CONFIG = {
  title: 'Tech Blog',
  author: 'Your Name',  // 構造化データの著者情報に使用
  url: 'https://yourdomain.com',  // URLの生成に使用
  seo: {
    siteName: 'Tech Blog',  // 構造化データのサイト名に使用
    description: '...',  // 構造化データの説明に使用
  }
};
```

## 🔧 開発のポイント

### ハイドレーション戦略
- `client:load`: 即座にハイドレーションが必要（Header、ThemeToggle）
- `client:visible`: 表示時にハイドレーション（BlogCard、TableOfContents）

### TypeScript設定
- React JSXサポート有効化
- 厳密な型チェック
- Astroコンポーネントとの型安全な連携

### 構造化データの開発
- `src/utils/structured-data.ts`で型安全な構造化データ生成
- 各レイアウトでの適切な構造化データ実装
- JSON-LD形式でのSEO最適化

## 📚 参考リンク

- [Astro公式ドキュメント](https://docs.astro.build)
- [React公式ドキュメント](https://react.dev)
- [TailwindCSS公式ドキュメント](https://tailwindcss.com)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org)
