# コードスタイル・命名規則

## TypeScript設定
- **厳密な型チェック**: `astro/tsconfigs/strict` を継承
- **React JSX**: `jsx: "react-jsx"` 設定
- **型安全性**: 全ての変数、関数、プロパティに適切な型定義

## ESLint設定
- TypeScript、Astro、React対応
- 未使用変数エラー: `@typescript-eslint/no-unused-vars: 'error'`
- any型警告: `@typescript-eslint/no-explicit-any: 'warn'`  
- console.log警告: `no-console: 'warn'`
- const推奨: `prefer-const: 'error'`

## ファイル命名規則
- **Reactコンポーネント**: PascalCase（例: `BlogCard.tsx`, `ThemeToggle.tsx`）
- **Astroコンポーネント**: PascalCase（例: `BaseLayout.astro`, `SearchBox.astro`）
- **ユーティリティ**: kebab-case（例: `structured-data.ts`, `content.ts`）
- **設定ファイル**: kebab-case（例: `site.ts`, `config.ts`）

## コンポーネント設計
- **Astroコンポーネント**: 静的なレイアウト、SEO対応、検索機能
- **Reactコンポーネント**: インタラクティブなUI（テーマ切り替え、ナビゲーション、目次など）
- **技術的で簡潔なコード**: .astroファイルでは冗長性を避ける

## TailwindCSS使用ルール
- **@apply禁止**: ユーティリティクラスを直接使用
- **モバイルファースト**: レスポンシブ対応
- **utility classesの直接使用**: カスタムCSSは最小限

## ハイドレーション戦略
- `client:load`: 即座にハイドレーション（Header、ThemeToggle）
- `client:visible`: 表示時にハイドレーション（BlogCard、TableOfContents）