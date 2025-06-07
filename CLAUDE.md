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