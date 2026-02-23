# デプロイメントガイド

## 1. 概要

このドキュメントでは、Tech Blog (astoro-tech-blog) プロジェクトのデプロイメント手順について説明します。

### 1.1 対象環境
- **開発環境**: ローカル開発サーバー
- **ステージング環境**: テスト用本番環境
- **本番環境**: 公開サイト

### 1.2 技術要件
- Node.js 18.x以上
- npm 9.x以上
- Git
- 静的ホスティングサービス

## 2. ビルドプロセス

### 2.1 ローカルビルド

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

### 2.2 ビルド出力

```
dist/
├── index.html                # ホームページ
├── blog/
│   ├── index.html           # ブログ一覧
│   └── [記事スラッグ]/
│       └── index.html       # 各記事ページ
├── tags/
│   ├── index.html           # タグ一覧
│   └── [タグ名]/
│       └── index.html       # タグ別記事一覧
├── about/
│   └── index.html           # Aboutページ
├── contact/
│   └── index.html           # お問い合わせ
├── privacy/
│   └── index.html           # プライバシーポリシー
├── rss.xml                  # RSSフィード
├── sitemap-0.xml           # サイトマップ
├── sitemap-index.xml       # サイトマップインデックス
├── _astro/
│   ├── *.css               # 最適化されたCSS
│   ├── *.js                # 最適化されたJavaScript
│   └── *.woff2             # フォントファイル
└── pagefind/
    ├── pagefind.js         # 検索エンジン
    ├── pagefind_ui.js      # 検索UI
    └── index/              # 検索インデックス
```

### 2.3 ビルド最適化

#### 2.3.1 パフォーマンス最適化
- 静的サイト生成による高速化
- 部分ハイドレーションによる最小限のJavaScript
- 自動コード分割
- 画像最適化

#### 2.3.2 SEO最適化
- 適切なメタタグ設定
- サイトマップ自動生成
- RSS配信設定
- 構造化データ対応（今後実装予定）

## 3. 環境変数設定

### 3.1 必須環境変数

```bash
# サイトURL（本番環境）
SITE_URL=https://yourdomain.com

# サイトタイトル
SITE_TITLE=Tech Blog

# サイト説明
SITE_DESCRIPTION=技術に関する記事や学習記録、開発の知見を共有するブログサイト

# 著者情報
AUTHOR_NAME=Your Name
AUTHOR_EMAIL=your.email@example.com
```

### 3.2 オプション環境変数

```bash
# Google Analytics ID（アナリティクス設定時）
GA_TRACKING_ID=G-XXXXXXXXXX

# Google Search Console（サーチコンソール設定時）
GOOGLE_SITE_VERIFICATION=your-verification-code

# SNSアカウント
TWITTER_HANDLE=@yourhandle
GITHUB_USERNAME=yourusername
```

## 4. ホスティングサービス別設定

### 4.1 Netlify

#### 4.1.1 基本設定

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/admin"
  to = "/admin/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/pagefind/*"
  [headers.values]
    Cache-Control = "max-age=31536000, immutable"
```

#### 4.1.2 デプロイ手順

1. **リポジトリ連携**
   - NetlifyダッシュボードでGitリポジトリを連携
   - ブランチ: `main`または`develop`

2. **ビルド設定**
   - ビルドコマンド: `npm run build`
   - 公開ディレクトリ: `dist`

3. **環境変数設定**
   - Site Settings > Environment variables
   - 必要な環境変数を設定

4. **カスタムドメイン設定**
   - Domain settings > Custom domains
   - DNSレコードの設定

### 4.2 Vercel

#### 4.2.1 基本設定

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "astro",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### 4.2.2 デプロイ手順

1. **Vercel CLI使用**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Git連携**
   - VercelダッシュボードでGitリポジトリ連携
   - 自動デプロイ設定

### 4.3 Cloudflare Pages

#### 4.3.1 基本設定

```toml
# wrangler.toml
name = "astoro-tech-blog"
compatibility_date = "2024-01-01"

[env.production]
vars = { NODE_ENV = "production" }

[[env.production.routes]]
pattern = "yourdomain.com/*"
zone_name = "yourdomain.com"
```

#### 4.3.2 デプロイ手順

1. **Pages設定**
   - ビルドコマンド: `npm run build`
   - ビルド出力ディレクトリ: `dist`
   - Node.jsバージョン: `18`

2. **環境変数設定**
   - Settings > Environment variables
   - Production環境の変数設定

### 4.4 GitHub Pages

#### 4.4.1 基本設定

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          SITE_URL: ${{ steps.pages.outputs.base_url }}
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 5. CI/CDパイプライン

### 5.1 基本的なワークフロー

```mermaid
graph LR
    A[コード変更] --> B[Git Push]
    B --> C[CI/CD トリガー]
    C --> D[依存関係インストール]
    D --> E[リント・テスト実行]
    E --> F[ビルド実行]
    F --> G[デプロイ実行]
    G --> H[デプロイ完了通知]
```

### 5.2 品質チェック

```yaml
# .github/workflows/quality-check.yml
name: Quality Check

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run format check
        run: npm run format:check
      
      - name: Build test
        run: npm run build
```

## 6. ドメイン・SSL設定

### 6.1 カスタムドメイン設定

#### 6.1.1 DNS設定例
```
# Aレコード（ルートドメイン）
@ IN A 192.0.2.1

# CNAMEレコード（サブドメイン）
www IN CNAME example.netlify.app

# ホスティング先指定
blog IN CNAME your-site.pages.dev
```

#### 6.1.2 SSL証明書
- 自動SSL（Let's Encrypt）を使用
- ワイルドカード証明書対応
- HTTP/2対応

### 6.2 セキュリティヘッダー

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 7. デプロイ後の確認事項

### 7.1 基本機能確認

- [ ] ホームページの表示
- [ ] ブログ記事一覧の表示
- [ ] 個別記事の表示
- [ ] 検索機能の動作
- [ ] ナビゲーションの動作
- [ ] テーマ切り替えの動作

### 7.2 SEO・メタデータ確認

- [ ] メタタグの適切な設定
- [ ] OGP画像の表示
- [ ] サイトマップの生成
- [ ] RSSフィードの配信
- [ ] 構造化データの実装（今後）

### 7.3 パフォーマンス確認

- [ ] ページ読み込み速度
- [ ] Core Web Vitals
- [ ] 画像最適化
- [ ] フォント読み込み

### 7.4 アクセシビリティ確認

- [ ] キーボードナビゲーション
- [ ] スクリーンリーダー対応
- [ ] カラーコントラスト
- [ ] フォーカス管理

## 8. トラブルシューティング

### 8.1 よくある問題

#### 8.1.1 ビルドエラー
```bash
# 依存関係の問題
rm -rf node_modules package-lock.json
npm install

# TypeScriptエラー
npm run check
```

#### 8.1.2 検索機能が動作しない
- Pagefindインデックスの生成確認
- 検索スクリプトの読み込み確認
- コンテンツマークアップの確認

#### 8.1.3 パフォーマンス問題
- 画像サイズの最適化
- 不要なJavaScriptの除去
- キャッシュ設定の確認

### 8.2 デバッグ方法

```bash
# 開発環境でのデバッグ
npm run dev -- --host 0.0.0.0

# ビルド詳細ログ
npm run build -- --verbose

# プレビューサーバーでの確認
npm run preview -- --host 0.0.0.0
```

## 9. バックアップ・復旧

### 9.1 バックアップ対象

- [ ] ソースコード（Git管理）
- [ ] コンテンツファイル（`src/content/blog/`）
- [ ] 設定ファイル
- [ ] 環境変数設定

### 9.2 復旧手順

1. **リポジトリクローン**
   ```bash
   git clone [repository-url]
   cd astoro-tech-blog
   ```

2. **依存関係インストール**
   ```bash
   npm install
   ```

3. **環境変数設定**
   - `.env`ファイルの作成
   - 必要な環境変数の設定

4. **ビルド・デプロイ**
   ```bash
   npm run build
   # ホスティングサービスへのデプロイ
   ```

---

**文書作成日**: 2025-01-15  
**作成者**: Claude Code  
**バージョン**: 1.0  
**関連文書**: 20-basic-design.md, 30-todo-list.md