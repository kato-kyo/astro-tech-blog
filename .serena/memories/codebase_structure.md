# コードベース構造

## ディレクトリ構成
```
src/
├── components/
│   ├── react/           # 全てのReactコンポーネント（17個）
│   │   ├── BlogCard.tsx              # ブログカードコンポーネント
│   │   ├── CategoryGrid.tsx          # カテゴリグリッド
│   │   ├── CategorySearch.tsx        # カテゴリ検索
│   │   ├── Footer.tsx                # フッターコンポーネント
│   │   ├── Header.tsx                # ヘッダーコンポーネント
│   │   ├── ImageWithFallback.tsx     # フォールバック付き画像
│   │   ├── MobileMenu.tsx            # モバイルメニューコンポーネント
│   │   ├── MobileTableOfContents.tsx # モバイル目次
│   │   ├── Navigation.tsx            # ナビゲーションコンポーネント
│   │   ├── Pagination.tsx            # ページネーション
│   │   ├── SearchBox.tsx             # 検索ボックス（React版）
│   │   ├── SocialShare.tsx           # ソーシャルシェア
│   │   ├── TableOfContents.tsx       # 目次コンポーネント
│   │   ├── TagGrid.tsx               # タググリッド
│   │   ├── TagSearch.tsx             # タグ検索
│   │   ├── ThemeToggle.tsx           # テーマ切り替えコンポーネント
│   │   └── Welcome.tsx               # ウェルカムコンポーネント
│   └── page/               # ページ専用コンポーネント
│       ├── ProfileSection.astro      # プロフィールセクション
│       ├── SkillsSection.astro       # スキルセクション
│       └── ExperienceSection.astro   # 経歴セクション
├── content/
│   ├── blog/               # ブログ記事のMarkdownファイル（13個）
│   ├── pages/              # ページコンテンツ
│   │   └── about.md        # Aboutページ内容
│   ├── site/               # サイト設定
│   │   └── config.yaml     # サイト全体設定（YAML）
│   └── config.ts           # Content Collections設定
├── layouts/
│   ├── BaseLayout.astro    # ベースレイアウト
│   ├── BlogLayout.astro    # ブログ記事レイアウト
│   └── PageLayout.astro    # 汎用ページレイアウト
├── pages/                  # ルーティング（Astroファイルベースルーティング）
│   ├── blog/
│   │   ├── [...slug].astro      # 動的ブログ記事ページ
│   │   ├── index.astro          # ブログ一覧ページ
│   │   └── page/[page].astro    # ページネーション
│   ├── categories/
│   │   ├── index.astro          # カテゴリ一覧
│   │   └── [category].astro     # 動的カテゴリページ
│   ├── tags/
│   │   ├── index.astro          # タグ一覧
│   │   └── [tag].astro          # 動的タグページ
│   ├── about.astro         # Aboutページ
│   ├── contact.astro       # コンタクトページ
│   ├── index.astro         # ホームページ
│   ├── privacy.astro       # プライバシーポリシー
│   ├── robots.txt.ts       # 動的robots.txt生成
│   └── rss.xml.js          # RSSフィード
├── utils/
│   ├── content.ts          # コンテンツ管理関数
│   ├── site-config.ts      # サイト設定管理関数
│   └── structured-data.ts  # 構造化データ生成関数
├── assets/
│   ├── astro.svg           # Astroロゴ
│   └── background.svg      # 背景画像
└── styles/
    └── global.css          # グローバルスタイル
```

## 重要なファイル
- **astro.config.mjs**: Astro設定（React統合、Tailwind、Pagefind、YAML設定読み込み）
- **package.json**: 依存関係とスクリプト
- **eslint.config.js**: TypeScript、Astro、React対応のESLint設定
- **tsconfig.json**: React JSX対応のTypeScript設定
- **src/content/site/config.yaml**: サイト全体設定（Content Collections）
- **CLAUDE.md**: プロジェクト固有の指示書

## アーキテクチャ特徴
- **ハイブリッド構成**: Astro（静的）+ React（インタラクティブ）
- **部分ハイドレーション**: 必要な部分のみReactでハイドレーション
- **Content Collections**: TypeScript型安全なコンテンツ管理
- **YAML設定**: `src/content/site/config.yaml`での一元管理
- **動的robots.txt**: 設定ファイルから自動生成（`src/pages/robots.txt.ts`）
- **再利用性**: 約98%のコードが他プロジェクトで再利用可能