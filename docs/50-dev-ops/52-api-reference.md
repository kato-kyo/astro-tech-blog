# API・コンポーネントリファレンス

## 1. 概要

このドキュメントでは、Tech Blog (astoro-tech-blog) プロジェクトで使用されているコンポーネント、API、ユーティリティ関数の詳細な仕様を説明します。

### 1.1 文書の構成
- Reactコンポーネント仕様
- Astroコンポーネント仕様
- Content Collections API
- ユーティリティ関数
- 型定義一覧

## 2. Reactコンポーネント

### 2.1 BlogCard

ブログ記事をカード形式で表示するコンポーネント

#### インターフェース

```typescript
import type { CollectionEntry } from 'astro:content';

interface BlogCardProps {
  post: CollectionEntry<'blog'>;
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `post` | `CollectionEntry<'blog'>` | ✅ | - | ブログ記事データ |
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```astro
---
import BlogCard from '../components/react/BlogCard.tsx';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---

{posts.map((post) => (
  <BlogCard post={post} className="mb-6" />
))}
```

#### 機能
- カード型レイアウト
- ヒーロー画像表示（プレースホルダー対応）
- メタ情報表示（日付、読了時間、タグ）
- ホバーエフェクト
- レスポンシブデザイン

### 2.2 Header

サイトヘッダーを表示するコンポーネント

#### インターフェース

```typescript
interface HeaderProps {
  currentPath: string;
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `currentPath` | `string` | ✅ | - | 現在のページパス |
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```astro
---
import Header from '../components/react/Header.tsx';
const currentPath = Astro.url.pathname;
---

<Header client:load currentPath={currentPath} />
```

#### 機能
- ロゴ・サイトタイトル表示
- ナビゲーションメニュー統合
- テーマ切り替えボタン統合
- モバイルメニュー統合
- スティッキーヘッダー

### 2.3 Navigation

ナビゲーションメニューを表示するコンポーネント

#### インターフェース

```typescript
interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  mobile?: boolean;
  currentPath: string;
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `mobile` | `boolean` | ❌ | `false` | モバイル表示モード |
| `currentPath` | `string` | ✅ | - | 現在のページパス |
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```tsx
// デスクトップ用
<Navigation currentPath="/blog/" />

// モバイル用
<Navigation mobile currentPath="/blog/" />
```

#### 機能
- デスクトップ用水平ナビゲーション
- モバイル用縦型ナビゲーション
- アクティブページのハイライト
- ホバーエフェクト

### 2.4 ThemeToggle

ダークモード切り替えボタンコンポーネント

#### インターフェース

```typescript
interface ThemeToggleProps {
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```astro
<ThemeToggle client:load />
```

#### 機能
- ライト/ダークモードの切り替え
- アイコンでの視覚的フィードバック
- アニメーション効果
- アクセシビリティ対応

### 2.5 TableOfContents

記事の目次を表示するコンポーネント

#### インターフェース

```typescript
import type { MarkdownHeading } from 'astro';

interface TableOfContentsProps {
  headings: MarkdownHeading[];
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `headings` | `MarkdownHeading[]` | ✅ | - | 見出しデータ配列 |
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```astro
---
import TableOfContents from '../components/react/TableOfContents.tsx';
const { headings } = Astro.props;
---

<TableOfContents client:load headings={headings} />
```

#### 機能
- 見出し階層の表現（h2, h3のみ）
- 現在位置のハイライト（IntersectionObserver）
- スムーズスクロール
- 深さ別インデント

### 2.6 MobileMenu

モバイル用ハンバーガーメニューコンポーネント

#### インターフェース

```typescript
interface MobileMenuProps {
  navItems: NavItem[];
  currentPath: string;
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `navItems` | `NavItem[]` | ✅ | - | ナビゲーション項目 |
| `currentPath` | `string` | ✅ | - | 現在のページパス |
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```tsx
const navItems = [
  { href: '/', label: 'ホーム' },
  { href: '/blog/', label: 'ブログ' },
];

<MobileMenu navItems={navItems} currentPath="/blog/" />
```

#### 機能
- ハンバーガーメニューアイコン
- スライドアニメーション
- オーバーレイ表示
- アクティブページハイライト

### 2.7 Footer

サイトフッターを表示するコンポーネント

#### インターフェース

```typescript
interface FooterProps {
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```astro
<Footer />
```

#### 機能
- サイトリンク
- SNSリンク（GitHub, Twitter等）
- 著作権表示
- RSS購読リンク

### 2.8 Welcome

ヒーローセクションを表示するコンポーネント

#### インターフェース

```typescript
interface WelcomeProps {
  title: string;
  description: string;
  className?: string;
}
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `title` | `string` | ✅ | - | メインタイトル |
| `description` | `string` | ✅ | - | 説明文 |
| `className` | `string` | ❌ | `''` | 追加CSSクラス |

#### 使用例

```astro
<Welcome 
  client:visible
  title="Tech Blog"
  description="技術に関する記事や学習記録を共有"
/>
```

#### 機能
- ヒーローセクション
- アニメーション効果
- レスポンシブデザイン
- CTA（行動喚起）

## 3. Astroコンポーネント

### 3.1 BaseLayout

基本的なHTMLレイアウトを提供するコンポーネント

#### インターフェース

```astro
---
export interface Props {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}
---
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `title` | `string` | ✅ | - | ページタイトル |
| `description` | `string` | ❌ | サイトのデフォルト説明 | ページ説明 |
| `image` | `string` | ❌ | デフォルトOGP画像 | OGP画像URL |
| `noindex` | `boolean` | ❌ | `false` | 検索エンジン除外 |

#### 使用例

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout 
  title="ページタイトル"
  description="ページの説明"
  image="/images/og-image.jpg"
>
  <main>
    <h1>コンテンツ</h1>
  </main>
</BaseLayout>
```

#### 機能
- HTML文書構造
- SEOメタタグ
- OGP設定
- テーマ初期化スクリプト
- フォント読み込み

### 3.2 BlogLayout

ブログ記事専用レイアウトコンポーネント

#### インターフェース

```astro
---
export interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  heroImage?: string;
  tags: string[];
  readingTime: string;
}
---
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `title` | `string` | ✅ | - | 記事タイトル |
| `description` | `string` | ✅ | - | 記事説明 |
| `pubDate` | `Date` | ✅ | - | 公開日 |
| `updatedDate` | `Date` | ❌ | - | 更新日 |
| `heroImage` | `string` | ❌ | - | ヒーロー画像URL |
| `tags` | `string[]` | ✅ | - | タグ配列 |
| `readingTime` | `string` | ✅ | - | 読了時間 |

#### 使用例

```astro
---
import BlogLayout from '../layouts/BlogLayout.astro';
---

<BlogLayout 
  title="記事タイトル"
  description="記事の説明"
  pubDate={new Date('2024-01-15')}
  tags={['TypeScript', 'React']}
  readingTime="5分で読めます"
>
  <article>
    記事内容
  </article>
</BlogLayout>
```

#### 機能
- ブログ記事専用レイアウト
- 記事メタ情報表示
- 構造化データ（JSON-LD）
- 目次統合
- 関連記事表示

### 3.3 SearchBox

検索ボックスを表示するコンポーネント

#### インターフェース

```astro
---
export interface Props {
  id?: string;
  className?: string;
  placeholder?: string;
}
---
```

#### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| `id` | `string` | ❌ | `'search'` | 要素ID |
| `className` | `string` | ❌ | `''` | 追加CSSクラス |
| `placeholder` | `string` | ❌ | `'検索...'` | プレースホルダー |

#### 使用例

```astro
---
import SearchBox from '../components/SearchBox.astro';
---

<SearchBox placeholder="記事を検索" />
```

#### 機能
- astro-pagefindを使用した検索
- 日本語ローカライゼーション
- カスタムスタイリング
- リアルタイム検索結果
- ハイライト表示

## 4. Content Collections API

### 4.1 ブログコレクション

#### スキーマ定義

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()),
    category: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

#### 型定義

```typescript
import type { CollectionEntry } from 'astro:content';

// ブログエントリ型
type BlogEntry = CollectionEntry<'blog'>;

// フロントマター型
type BlogFrontmatter = BlogEntry['data'];

// レンダー関数型
type BlogRender = BlogEntry['render'];
```

### 4.2 コレクション操作関数

#### getCollection

```typescript
import { getCollection } from 'astro:content';

// 全記事取得
const allPosts = await getCollection('blog');

// 公開記事のみ取得
const publishedPosts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});

// タグでフィルタリング
const reactPosts = await getCollection('blog', ({ data }) => {
  return data.tags.includes('React');
});
```

#### getEntry

```typescript
import { getEntry } from 'astro:content';

// 特定記事取得
const post = await getEntry('blog', 'my-first-post');
```

#### getEntries

```typescript
import { getEntries } from 'astro:content';

// 複数記事取得
const posts = await getEntries([
  { collection: 'blog', slug: 'post-1' },
  { collection: 'blog', slug: 'post-2' },
]);
```

## 5. ユーティリティ関数

### 5.1 日付フォーマット

```typescript
// src/utils/date.ts
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function formatDate(date: Date, pattern: string = 'yyyy年MM月dd日'): string {
  return format(date, pattern, { locale: ja });
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function isDateAfter(date: Date, compareDate: Date): boolean {
  return date > compareDate;
}
```

#### 使用例

```typescript
const date = new Date('2024-01-15');
console.log(formatDate(date)); // "2024年01月15日"
console.log(formatDateISO(date)); // "2024-01-15"
```

### 5.2 読了時間計算

```typescript
// src/utils/reading-time.ts
import readingTime from 'reading-time';

export function calculateReadingTime(content: string): string {
  const stats = readingTime(content, {
    wordsPerMinute: 400, // 日本語の場合の調整
  });
  
  return `${Math.ceil(stats.minutes)}分で読めます`;
}
```

#### 使用例

```typescript
const content = "記事の本文コンテンツ...";
const time = calculateReadingTime(content);
console.log(time); // "5分で読めます"
```

### 5.3 タグ操作

```typescript
// src/utils/tags.ts
import type { CollectionEntry } from 'astro:content';

export function getAllTags(posts: CollectionEntry<'blog'>[]): string[] {
  const tags = posts.flatMap(post => post.data.tags);
  return [...new Set(tags)].sort();
}

export function getPostsByTag(
  posts: CollectionEntry<'blog'>[],
  tag: string
): CollectionEntry<'blog'>[] {
  return posts.filter(post => post.data.tags.includes(tag));
}

export function getTagCounts(posts: CollectionEntry<'blog'>[]): Record<string, number> {
  const tagCounts: Record<string, number> = {};
  
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return tagCounts;
}
```

#### 使用例

```typescript
const posts = await getCollection('blog');
const allTags = getAllTags(posts);
const reactPosts = getPostsByTag(posts, 'React');
const tagCounts = getTagCounts(posts);
```

### 5.4 スラッグ操作

```typescript
// src/utils/slug.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 特殊文字除去
    .replace(/[\s_-]+/g, '-') // スペース・アンダースコアをハイフンに
    .replace(/^-+|-+$/g, ''); // 前後のハイフン除去
}

export function getSlugFromPath(path: string): string {
  return path.split('/').pop()?.replace('.md', '') || '';
}
```

#### 使用例

```typescript
const title = "TypeScriptのベストプラクティス";
const slug = slugify(title); // "typescript"
```

## 6. 型定義一覧

### 6.1 基本型

```typescript
// src/types/index.ts

// ナビゲーション項目
export interface NavItem {
  href: string;
  label: string;
}

// サイト設定
export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
  };
}

// ページメタデータ
export interface PageMeta {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}
```

### 6.2 コンポーネント型

```typescript
// src/types/components.ts
import type { ReactNode } from 'react';
import type { CollectionEntry } from 'astro:content';

// 共通Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// ブログ関連型
export type BlogPost = CollectionEntry<'blog'>;
export type BlogData = BlogPost['data'];

// テーマ型
export type Theme = 'light' | 'dark';

// 検索結果型
export interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  metadata: {
    date: string;
    tags: string[];
  };
}
```

### 6.3 ユーティリティ型

```typescript
// src/types/utils.ts

// 日付フォーマット型
export type DateFormat = 'iso' | 'japanese' | 'relative';

// ソート順序型
export type SortOrder = 'asc' | 'desc';

// ページネーション型
export interface PaginationParams {
  page: number;
  perPage: number;
  total: number;
}

// フィルター型
export interface FilterParams {
  tags?: string[];
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
```

## 7. 環境変数

### 7.1 必須環境変数

```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly SITE_TITLE: string;
  readonly SITE_DESCRIPTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 7.2 オプション環境変数

```typescript
interface ImportMetaEnv {
  readonly GA_TRACKING_ID?: string;
  readonly GOOGLE_SITE_VERIFICATION?: string;
  readonly TWITTER_HANDLE?: string;
  readonly GITHUB_USERNAME?: string;
}
```

## 8. Astro内蔵型

### 8.1 ページProps

```typescript
// Astroページで使用可能なProps
interface AstroPageProps {
  params: Record<string, string>;
  request: Request;
  url: URL;
}
```

### 8.2 マークダウン型

```typescript
import type { MarkdownHeading, MarkdownInstance } from 'astro';

// マークダウン見出し
interface MarkdownHeading {
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  slug: string;
  text: string;
}

// マークダウンインスタンス
interface MarkdownInstance<T = Record<string, any>> {
  frontmatter: T;
  file: string;
  url: string | undefined;
  getHeadings(): Promise<MarkdownHeading[]>;
  Content: AstroComponent;
  rawContent(): string;
  compiledContent(): string;
}
```

---

**文書作成日**: 2025-01-15  
**作成者**: Claude Code  
**バージョン**: 1.0  
**関連文書**: 07-development-guide.md, 20-basic-design.md