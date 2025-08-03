# コードベース構造

## ディレクトリ構成
```
src/
├── components/
│   ├── react/           # 全てのReactコンポーネント（8個）
│   │   ├── BlogCard.tsx         # ブログカードコンポーネント
│   │   ├── Footer.tsx           # フッターコンポーネント  
│   │   ├── Header.tsx           # ヘッダーコンポーネント
│   │   ├── MobileMenu.tsx       # モバイルメニューコンポーネント
│   │   ├── Navigation.tsx       # ナビゲーションコンポーネント
│   │   ├── TableOfContents.tsx  # 目次コンポーネント
│   │   ├── ThemeToggle.tsx      # テーマ切り替えコンポーネント
│   │   ├── Welcome.tsx          # ウェルカムコンポーネント
│   │   ├── CategoryGrid.tsx     # カテゴリグリッド
│   │   ├── TagGrid.tsx          # タググリッド
│   │   ├── SearchBox.tsx        # 検索ボックス（React版）
│   │   ├── SocialShare.tsx      # ソーシャルシェア
│   │   └── Pagination.tsx       # ページネーション
│   └── SearchBox.astro     # 検索ボックス（Astro版）
├── content/
│   ├── blog/               # ブログ記事のMarkdownファイル
│   └── config.ts           # Content Collections設定
├── layouts/
│   ├── BaseLayout.astro    # ベースレイアウト
│   └── BlogLayout.astro    # ブログ記事レイアウト
├── pages/                  # ルーティング（Astroファイルベースルーティング）
│   ├── blog/
│   ├── tags/
│   ├── index.astro
│   └── rss.xml.js
├── utils/
│   ├── content.ts          # コンテンツ管理関数
│   └── structured-data.ts  # 構造化データ生成関数
├── config/
│   └── site.ts             # サイト設定
└── styles/
    └── global.css          # グローバルスタイル
```

## 重要なファイル
- **astro.config.mjs**: Astro設定（React統合、Tailwind、Pagefind）
- **package.json**: 依存関係とスクリプト
- **eslint.config.js**: コード品質設定
- **tsconfig.json**: TypeScript設定
- **CLAUDE.md**: プロジェクト固有の指示書