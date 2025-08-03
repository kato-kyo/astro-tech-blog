# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

### 開発コマンド
- `npm run dev` - 開発サーバー起動（localhost:4321）
- `npm run build` - 本番用ビルド（dist/フォルダに出力）
- `npm run preview` - ビルド結果のプレビュー

### コード品質チェック
- `npm run lint` - ESLintでコードチェック
- `npm run lint:fix` - ESLintでコードチェックと自動修正
- `npm run format` - Prettierでコードフォーマット
- `npm run format:check` - Prettierでフォーマットチェック
- `npm run check` - lintとformat:checkを両方実行

### 重要なルール
- **Tailwind CSS**: @apply ディレクティブは使用しない（utility classesを直接使用）
- **コンポーネント**: .astro ファイルでは技術的で簡潔なコードを書く
- **パフォーマンス**: 静的生成を優先し、JavaScriptは最小限に抑える

## アーキテクチャ

### ハイブリッド構成
このプロジェクトはAstroとReactのハイブリッド構成を採用しています：

- **Astroコンポーネント**: 静的なレイアウト、SEO対応、検索機能
- **Reactコンポーネント**: インタラクティブなUI（テーマ切り替え、ナビゲーション、目次など）
- **Content Collections**: `src/content/blog/`でMarkdown記事を管理

### ディレクトリ構造の重要なポイント
- `src/components/react/` - 全てのReactコンポーネント（8個）
- `src/content/blog/` - ブログ記事のMarkdownファイル
- `src/layouts/` - ページレイアウト（BaseLayout、BlogLayout）
- `src/pages/` - ルーティング（Astroファイルベースルーティング）

### Reactコンポーネントのハイドレーション戦略
Astro設定で `include: ['**/react/*']` により、Reactコンポーネントは`src/components/react/`フォルダ内でのみ利用可能。

重要なハイドレーション指定：
- `client:load` - 即座にハイドレーション（Header、ThemeToggle）
- `client:visible` - 表示時にハイドレーション（BlogCard、TableOfContents）

### コンテンツ管理
- ブログ記事は`src/content/blog/`にMarkdownで管理
- フロントマターで記事メタデータを定義
- Content Collections APIでTypeScript型安全性を確保

### 技術スタック
- **Astro** - 静的サイトジェネレーター
- **React 19** - インタラクティブコンポーネント
- **TypeScript** - 型安全性（strict設定）
- **TailwindCSS** - ユーティリティファーストCSS
- **Pagefind** - 全文検索機能
- **ESLint + Prettier** - コード品質管理

### 設定ファイル
- `astro.config.mjs` - Astro設定（React統合、Tailwind、Pagefind）
- `eslint.config.js` - TypeScript、Astro、React対応のESLint設定
- `tsconfig.json` - React JSX対応のTypeScript設定

## 重要な制約事項

### 検索機能について
**重要**: 検索機能は開発環境（`npm run dev`）では動作しません。

- **開発環境**: 検索ボックスに入力しても「検索結果が見つかりませんでした」と表示
- **原因**: Pagefindの検索インデックスは本番ビルド時のみ生成
- **解決方法**: 検索機能をテストする際は以下を実行：
```bash
npm run build && npm run preview
```

### 開発・プレビューの使い分け
| 用途 | コマンド | 検索機能 | ホットリロード | 適用場面 |
|------|----------|----------|----------------|----------|
| 開発 | `npm run dev` | ❌ 動作しない | ✅ 有効 | コンテンツ作成・UI開発 |
| プレビュー | `npm run preview` | ✅ 動作する | ❌ 無効 | 検索機能テスト・最終確認 |

## 設定管理

### サイト設定（`src/config/site.ts`）
全てのサイト固有設定は `SITE_CONFIG` オブジェクトで一元管理：

- **基本情報**: サイトタイトル、URL、著者情報
- **SEO設定**: メタディスクリプション、OGP画像、サイト名
- **ナビゲーション**: ヘッダータイトル
- **RSS設定**: フィード情報
- **About/Footer情報**: 各ページ固有の設定

### Content Collections設定
- `src/content/config.ts` - ブログ記事の型定義とスキーマ
- `src/content/blog/` - Markdownファイルによる記事管理
- フロントマターで記事メタデータ（タイトル、日付、タグ、下書き状態等）を定義

## ユーティリティ関数

### コンテンツ管理（`src/utils/content.ts`）
- `getBlogPosts()` - 全ブログ記事取得
- `getSortedBlogPosts()` - 日付順ソート済み記事取得
- `getBlogPostBySlug()` - スラッグによる個別記事取得
- `shouldShowDraft()` - 下書き記事表示判定

### 構造化データ（`src/utils/structured-data.ts`）
Schema.org準拠のJSON-LD形式でSEO最適化：
- Article、WebSite、Blog、BreadcrumbList schema対応
- TypeScript型安全性を確保した構造化データ生成
- `generateArticleStructuredData()` - 記事用構造化データ
- `generateWebSiteStructuredData()` - サイト全体用構造化データ