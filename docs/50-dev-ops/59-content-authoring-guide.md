# コンテンツ作成ガイド

## 1. 概要

このドキュメントでは、Tech Blog (astoro-tech-blog) でのコンテンツ作成に関するガイドラインを説明します。

### 1.1 対象読者
- ブログ記事作成者
- コンテンツエディター
- 技術ライター

### 1.2 コンテンツ作成の流れ
1. 記事企画・構成
2. Markdownファイル作成
3. フロントマター設定
4. 本文執筆
5. 画像・メディア追加
6. プレビュー確認
7. 公開

## 2. Markdownフロントマター仕様

### 2.1 基本構造

```yaml
---
title: '記事タイトル'
description: '記事の概要説明'
pubDate: 2024-01-15
updatedDate: 2024-01-20
heroImage: 'https://example.com/hero.jpg'
tags: ['TypeScript', 'React', 'Astro']
category: '技術'
draft: false
---
```

### 2.2 各フィールド詳細

#### 2.2.1 必須フィールド

| フィールド | 型 | 説明 | 例 |
|------------|-----|------|-----|
| `title` | string | 記事タイトル（SEO重要） | `'TypeScriptのベストプラクティス'` |
| `description` | string | 記事の概要（160文字以内推奨） | `'TypeScriptを使った開発でのベストプラクティスをまとめました'` |
| `pubDate` | date | 公開日（YYYY-MM-DD形式） | `2024-01-15` |
| `tags` | array | タグ配列（3-5個推奨） | `['TypeScript', 'プログラミング']` |

#### 2.2.2 オプションフィールド

| フィールド | 型 | 説明 | 例 |
|------------|-----|------|-----|
| `updatedDate` | date | 更新日（更新時のみ設定） | `2024-01-20` |
| `heroImage` | string | ヒーロー画像URL | `'/images/blog/typescript-guide.jpg'` |
| `category` | string | カテゴリ | `'技術'`, `'学習記録'`, `'チュートリアル'` |
| `draft` | boolean | 下書きフラグ（デフォルト: false） | `true` |

### 2.3 フロントマター例

#### 2.3.1 技術記事の例

```yaml
---
title: 'Astroで高速な技術ブログを構築する方法'
description: 'Astroを使って静的サイト生成による高速な技術ブログの構築方法を詳しく解説します。'
pubDate: 2024-01-15
updatedDate: 2024-01-20
heroImage: '/images/blog/2024/01/astro-blog-guide/hero.jpg'
tags: ['Astro', 'TypeScript', 'ブログ', 'SSG']
category: '技術'
draft: false
---
```

#### 2.3.2 学習記録の例

```yaml
---
title: 'React 19の新機能を試してみた'
description: 'React 19で追加された新機能を実際に試して、その使用感と実用性をレポートします。'
pubDate: 2024-01-10
tags: ['React', '学習記録', 'フロントエンド']
category: '学習記録'
draft: false
---
```

#### 2.3.3 下書き記事の例

```yaml
---
title: 'TypeScript 5.0の新機能解説（執筆中）'
description: 'TypeScript 5.0で追加された新機能について詳しく解説します。'
pubDate: 2024-01-25
tags: ['TypeScript', '新機能']
category: '技術'
draft: true
---
```

## 3. Markdown記法

### 3.1 基本的な記法

#### 3.1.1 見出し

```markdown
# H1見出し（記事タイトル - 自動生成されるため使用しない）
## H2見出し（大セクション）
### H3見出し（小セクション）
#### H4見出し（詳細項目）
```

#### 3.1.2 段落とテキスト装飾

```markdown
通常の段落です。

**太字テキスト**
*斜体テキスト*
`インラインコード`
~~取り消し線~~

> 引用文です。
> 複数行の引用も可能です。
```

#### 3.1.3 リスト

```markdown
# 順序なしリスト
- 項目1
- 項目2
  - サブ項目2-1
  - サブ項目2-2

# 順序ありリスト
1. 手順1
2. 手順2
3. 手順3

# チェックリスト
- [x] 完了済みタスク
- [ ] 未完了タスク
```

### 3.2 コードブロック

#### 3.2.1 基本的なコードブロック

````markdown
```typescript
// TypeScriptコードの例
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};
```
````

#### 3.2.2 ファイル名付きコードブロック

````markdown
```typescript:src/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```
````

#### 3.2.3 行番号・ハイライト

````markdown
```typescript {2,4-6}
const users = [
  { id: 1, name: 'Alice' },  // ハイライト行
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }, // ハイライト行
  { id: 4, name: 'David' },   // ハイライト行
  { id: 5, name: 'Eve' }      // ハイライト行
];
```
````

### 3.3 リンクと画像

#### 3.3.1 リンク

```markdown
# 外部リンク
[Astro公式サイト](https://astro.build/)

# 内部リンク
[他の記事へのリンク](/blog/other-article/)

# 参照形式のリンク
[リンクテキスト][1]

[1]: https://example.com
```

#### 3.3.2 画像

```markdown
# 基本的な画像
![代替テキスト](./images/example.jpg)

# 画像にタイトル付き
![代替テキスト](./images/example.jpg "画像のタイトル")

# レスポンシブ画像（推奨）
![代替テキスト](./images/example.jpg)
```

### 3.4 表

```markdown
| 項目 | 説明 | 必須 |
|------|------|------|
| title | 記事タイトル | ✅ |
| description | 記事説明 | ✅ |
| tags | タグ配列 | ✅ |
| heroImage | ヒーロー画像 | ❌ |
```

### 3.5 注意書き・警告

```markdown
> **注意**: 重要な注意事項です。

> **ヒント**: 役立つヒントです。

> **警告**: 注意が必要な事項です。
```

## 4. 画像・メディア管理

### 4.1 画像保存構造

```
public/
├── images/
│   ├── blog/
│   │   ├── 2024/
│   │   │   ├── 01/
│   │   │   │   ├── article-slug/
│   │   │   │   │   ├── hero.jpg
│   │   │   │   │   ├── screenshot1.png
│   │   │   │   │   ├── diagram.svg
│   │   │   │   │   └── code-example.png
```

### 4.2 画像命名規則

#### 4.2.1 ファイル名

```
# 推奨
hero.jpg
screenshot-login-form.png
diagram-architecture.svg
code-example-typescript.png

# 避ける
IMG_001.jpg
スクリーンショット 2024-01-15.png
図1.svg
```

#### 4.2.2 ディレクトリ名

```
# 記事スラッグと同名
/blog/typescript-best-practices/  # 記事URL
/images/blog/typescript-best-practices/  # 画像ディレクトリ
```

### 4.3 画像最適化ガイドライン

#### 4.3.1 画像サイズ

| 用途 | 推奨サイズ | 最大ファイルサイズ |
|------|------------|-------------------|
| ヒーロー画像 | 1200x630px | 200KB |
| 本文画像 | 800px幅以内 | 100KB |
| アイコン | 64x64px | 10KB |
| スクリーンショット | 1024px幅以内 | 150KB |

#### 4.3.2 ファイル形式

```
# 優先順位
1. WebP（最新ブラウザ対応）
2. JPEG（写真・複雑な画像）
3. PNG（透明背景・シンプルな画像）
4. SVG（アイコン・ロゴ・図解）
```

#### 4.3.3 画像最適化コマンド例

```bash
# WebP変換
cwebp input.jpg -q 85 -o output.webp

# JPEG最適化
jpegoptim --max=85 --strip-all input.jpg

# PNG最適化
optipng -o7 input.png

# SVG最適化
svgo input.svg -o output.svg
```

### 4.4 画像の使用方法

#### 4.4.1 Markdownでの画像挿入

```markdown
# 基本的な使用方法
![TypeScriptのコード例](./images/typescript-example.png)

# 詳細な説明付き
![ログイン画面のスクリーンショット。ユーザー名とパスワードの入力フィールドが表示されている](./images/login-screenshot.png "ログイン画面")
```

#### 4.4.2 代替テキストのベストプラクティス

```markdown
# 良い例
![Astroのビルドプロセスを示すフローチャート。ソースコードから静的HTMLファイルが生成される流れが図示されている](./images/astro-build-process.svg)

# 悪い例
![画像](./images/image1.png)
![](./images/screenshot.png)
```

## 5. SEO対策ガイドライン

### 5.1 タイトル設定

#### 5.1.1 タイトルのベストプラクティス

```yaml
# 良い例
title: 'Astroで高速な技術ブログを構築する完全ガイド'
title: 'TypeScript 5.0の新機能：Decoratorsとconst assertionを解説'
title: 'React 19のuseFormState Hookの使い方と実践例'

# 避けるべき例
title: 'ブログ'
title: 'TypeScriptについて'
title: 'あれこれやってみた結果wwwww'
```

#### 5.1.2 タイトル文字数

- **推奨**: 30-40文字
- **最大**: 60文字以内
- **SEO**: Googleの検索結果で切り捨てられない長さ

### 5.2 説明文（description）

#### 5.2.1 説明文のベストプラクティス

```yaml
# 良い例
description: 'Astroを使って静的サイト生成による高速な技術ブログの構築方法を、実際のコード例と設定ファイルを交えて詳しく解説します。パフォーマンス最適化のコツも紹介。'

# 避けるべき例  
description: 'ブログを作りました'
description: 'TypeScriptについて書きます'
```

#### 5.2.2 説明文の要件

- **文字数**: 120-160文字
- **内容**: 記事の要約と読者メリット
- **キーワード**: 重要なキーワードを自然に含める

### 5.3 タグ設定

#### 5.3.1 タグ選択のガイドライン

```yaml
# 良い例
tags: ['TypeScript', 'React', 'フロントエンド', 'プログラミング']
tags: ['Astro', 'SSG', 'パフォーマンス', 'ブログ構築']

# 避けるべき例
tags: ['あれ', 'これ', 'それ', 'やつ']
tags: ['プログラミング'] # タグが少なすぎる
tags: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Svelte', 'Node.js'] # タグが多すぎる
```

#### 5.3.2 タグ数の推奨

- **推奨**: 3-5個
- **最小**: 2個
- **最大**: 7個以内

### 5.4 URL構造

#### 5.4.1 スラッグの命名規則

```
# 良い例
/blog/typescript-best-practices/
/blog/astro-performance-optimization/
/blog/react-19-new-features/

# 避けるべき例
/blog/記事1/
/blog/2024-01-15-post/
/blog/untitled/
```

#### 5.4.2 スラッグの要件

- **言語**: 英語（日本語可だが英語推奨）
- **文字**: 小文字、ハイフン区切り
- **長さ**: 3-5単語程度
- **内容**: 記事内容を表す

## 6. 記事構成のベストプラクティス

### 6.1 記事構造テンプレート

```markdown
---
title: '記事タイトル'
description: '記事の説明'
pubDate: 2024-01-15
tags: ['タグ1', 'タグ2']
---

## 概要

記事の要点を3-5行で説明します。

## 前提条件

- 必要な前提知識
- 実行環境の要件
- 準備すべきツール

## 手順1: セットアップ

具体的な手順を説明します。

### 詳細手順

1. 具体的なステップ
2. コード例の提示
3. 結果の確認方法

## 手順2: 実装

実際のコード実装を説明します。

```typescript
// コード例
const example = 'Hello, World!';
```

## トラブルシューティング

よくある問題と解決方法を記載します。

## まとめ

- 記事の要点
- 学んだこと
- 次のステップ

## 参考資料

- [公式ドキュメント](https://example.com)
- [関連記事](./related-article/)
```

### 6.2 読みやすさの向上

#### 6.2.1 段落構成

- **1段落**: 3-5行以内
- **改行**: 適切な改行で読みやすさ向上
- **リスト**: 要点を箇条書きで整理

#### 6.2.2 見出し構成

```markdown
## 大セクション（H2）
### 中セクション（H3）
#### 小セクション（H4）

# H2 → H4への直接ジャンプは避ける
## 大セクション
#### 小セクション # ❌ H3をスキップ
```

#### 6.2.3 コードブロック

```markdown
# 短いコードはインライン
変数`const userName = 'John'`を使用します。

# 長いコードはブロック
```typescript
interface User {
  id: number;
  name: string;
}
```
```

### 6.3 技術記事特有の要素

#### 6.3.1 前提条件の記載

```markdown
## 前提条件

この記事を読む前に、以下の知識があることを前提としています：

- JavaScript ES6+の基本構文
- Node.js 18以上がインストール済み
- GitとGitHubの基本操作

## 実行環境

- Node.js: 18.0.0以上
- npm: 9.0.0以上
- OS: macOS, Windows, Linux
```

#### 6.3.2 手順の明確化

```markdown
## 実装手順

### ステップ1: プロジェクトの作成

1. 新しいディレクトリを作成します

```bash
mkdir my-project
cd my-project
```

2. package.jsonを初期化します

```bash
npm init -y
```

3. 必要な依存関係をインストールします

```bash
npm install astro react
```
```

#### 6.3.3 結果の確認方法

```markdown
## 動作確認

実装が正しくできているか確認しましょう。

1. 開発サーバーを起動

```bash
npm run dev
```

2. ブラウザで http://localhost:4321 にアクセス

3. 以下のような画面が表示されることを確認

![期待される結果の画面](./images/expected-result.png)
```

## 7. コンテンツ品質チェックリスト

### 7.1 公開前チェック

#### 7.1.1 基本要素

- [ ] タイトルが適切（30-40文字）
- [ ] 説明文が適切（120-160文字）
- [ ] タグが3-5個設定済み
- [ ] 公開日が設定済み
- [ ] draft: falseに設定済み

#### 7.1.2 コンテンツ品質

- [ ] 記事構成が論理的
- [ ] コード例が動作確認済み
- [ ] 画像の代替テキストが設定済み
- [ ] 外部リンクが有効
- [ ] 誤字脱字のチェック完了

#### 7.1.3 SEO対策

- [ ] 重要キーワードがタイトルに含まれている
- [ ] 見出し構造が適切（H2→H3→H4の順序）
- [ ] メタ説明が魅力的
- [ ] 画像ファイルサイズが最適化済み

### 7.2 公開後チェック

#### 7.2.1 表示確認

- [ ] デスクトップ表示の確認
- [ ] モバイル表示の確認  
- [ ] ダークモード表示の確認
- [ ] 検索機能での検索確認

#### 7.2.2 機能確認

- [ ] 内部リンクの動作確認
- [ ] 外部リンクの動作確認
- [ ] 画像の表示確認
- [ ] コードブロックの表示確認

## 8. 記事更新・メンテナンス

### 8.1 更新のタイミング

#### 8.1.1 定期更新

- **技術記事**: 年1-2回の見直し
- **チュートリアル**: ツールバージョンアップ時
- **ライブラリ紹介**: メジャーバージョンアップ時

#### 8.1.2 緊急更新

- 重大なセキュリティ問題の発見
- 記載内容の重大な誤り
- リンク切れの発生

### 8.2 更新時の作業

#### 8.2.1 更新日の設定

```yaml
---
title: '既存記事タイトル'
pubDate: 2024-01-15
updatedDate: 2024-06-20  # 更新日を追加・変更
---
```

#### 8.2.2 更新内容の記録

```markdown
## 更新履歴

- **2024-06-20**: TypeScript 5.5対応、コード例を最新版に更新
- **2024-03-15**: 新しいAPIの説明を追加
- **2024-01-15**: 初回公開
```

### 8.3 アーカイブ・削除

#### 8.3.1 アーカイブの判断基準

- 技術的に古くなった内容
- ライブラリ・ツールのサポート終了
- 読者のアクセスが著しく少ない

#### 8.3.2 削除時の対応

```yaml
---
title: '古い記事タイトル'
draft: true  # 一旦下書きに変更
# 削除予定日をコメントに記載
# 削除予定: 2024-12-31
---
```

---

**文書作成日**: 2025-01-15  
**作成者**: Claude Code  
**バージョン**: 1.0  
**関連文書**: 06-maintenance-guide.md, 08-api-reference.md