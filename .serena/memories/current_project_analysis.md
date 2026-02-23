# 現在のプロジェクト分析（2025年1月更新）

## プロジェクト概要
**astro-tech-blog** - Astro + Reactハイブリッド構成のテックブログサイト

### 最新アーキテクチャ特徴
- **設定管理**: `src/content/site/config.yaml` でのYAMLベース一元管理
- **再利用性**: 98%のコードが他プロジェクトで再利用可能
- **動的robots.txt**: `src/pages/robots.txt.ts`で設定ファイルから自動生成
- **Content Collections**: TypeScript型安全なコンテンツ管理

## 現在の技術スタック
- **Astro 5.2.5**: 静的サイトジェネレーター
- **React 19.1.0**: インタラクティブUI（17コンポーネント）
- **TypeScript 5.8.3**: strict設定での型安全性
- **TailwindCSS 3.4.15**: @applyディレクティブ禁止、ユーティリティクラス直接使用
- **Pagefind**: 全文検索（本番ビルド時のみ動作）
- **js-yaml**: YAML設定パース

## Reactコンポーネント構成（17個）
**インタラクティブ機能担当**:
- BlogCard, CategoryGrid, CategorySearch, Footer, Header
- ImageWithFallback, MobileMenu, MobileTableOfContents, Navigation
- Pagination, SearchBox, SocialShare, TableOfContents
- TagGrid, TagSearch, ThemeToggle, Welcome

**ハイドレーション戦略**:
- `client:load`: Header, ThemeToggle（即座）
- `client:visible`: BlogCard, TableOfContents（表示時）

## Content Collections設定
**3つのコレクション**:
1. **blog**: ブログ記事（Markdown + フロントマター）
2. **pages**: Aboutページ等（プロフィール、スキル、経歴含む）
3. **site**: サイト全体設定（YAML）

**スキーマ型定義**: 完全なTypeScript型安全性を実現

## 開発・品質管理コマンド
- `npm run dev`: 開発サーバー（検索機能は動作しない）
- `npm run build && npm run preview`: 検索機能テスト用
- `npm run check`: lint + format:check
- `npm run lint:fix`: ESLintによる自動修正

## 重要な制約・注意点
- **検索機能**: 開発環境では動作しない（Pagefindは本番ビルド時のみ）
- **UI/UX変更**: レイアウト、色、フォント等の変更は事前承認必要
- **技術スタック**: バージョン変更は承認が必要
- **@apply禁止**: Tailwindのディレクティブではなくユーティリティクラス使用

## アーキテクチャの進化
**従来**: `src/config/site.ts`での設定管理
**現在**: `src/content/site/config.yaml` + Content Collections での一元管理

**メリット**:
- 完全な再利用性（設定ファイル変更のみで新プロジェクト対応）
- TypeScript型安全性
- 構造化データ自動生成
- SEO最適化