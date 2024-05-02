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
│   └── styles/                      # スタイルファイル
│       └── global.css               # グローバルスタイル
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

## 🔧 開発のポイント

### ハイドレーション戦略
- `client:load`: 即座にハイドレーションが必要（Header、ThemeToggle）
- `client:visible`: 表示時にハイドレーション（BlogCard、TableOfContents）

### TypeScript設定
- React JSXサポート有効化
- 厳密な型チェック
- Astroコンポーネントとの型安全な連携

## 📚 参考リンク

- [Astro公式ドキュメント](https://docs.astro.build)
- [React公式ドキュメント](https://react.dev)
- [TailwindCSS公式ドキュメント](https://tailwindcss.com)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org)
