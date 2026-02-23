# 詳細設計書 - REQ-003: 記事分類機能

## 1. 概要

### 1.1 要件概要
- **要件ID**: REQ-003
- **要件名**: 記事分類機能
- **概要**: 記事の分類・絞り込み機能
- **優先度**: Medium
- **実装状況**: 🟡 部分完了（カテゴリ別一覧未実装）

### 1.2 機能詳細
- タグベースでの記事分類
- タグ一覧ページ
- タグ別記事一覧ページ
- カテゴリ機能（オプション）

## 2. アーキテクチャ設計

### 2.1 システム構成図

```mermaid
graph TB
    A[記事分類システム] --> B[タグ機能]
    A --> C[カテゴリ機能]
    
    B --> D[tags/index.astro]
    B --> E[tags/[tag].astro]
    
    C --> F[categories/index.astro - 未実装]
    C --> G[categories/[category].astro - 未実装]
    
    D --> H[全タグ一覧表示]
    E --> I[タグ別記事フィルタリング]
    
    H --> J[タグクラウド表示]
    H --> K[記事数カウント]
    
    I --> L[BlogCard表示]
    I --> M[パンくずナビ]
    
    F --> N[全カテゴリ一覧]
    G --> O[カテゴリ別記事一覧]
```

### 2.2 データフロー

```
【タグ機能】
1. タグ一覧リクエスト (/tags/)
   ↓
2. 全記事からタグ抽出
   ↓
3. タグ別記事数カウント
   ↓
4. タグクラウド表示

【タグ別記事一覧】
1. タグページリクエスト (/tags/[tag]/)
   ↓
2. getStaticPaths() - 全タグのパス生成
   ↓
3. 指定タグでの記事フィルタリング
   ↓
4. 公開日降順ソート
   ↓
5. BlogCard表示 + パンくずナビ
```

## 3. コンポーネント設計

### 3.1 実装済みコンポーネント

#### 3.1.1 tags/index.astro (タグ一覧ページ)

**ファイルパス**: `src/pages/tags/index.astro`

**責務**:
- 全タグの収集と整理
- タグ別記事数の計算
- タグクラウドの表示

**実装詳細**:
```typescript
// 全記事取得
const posts = await getCollection('blog', ({ data }) => !data.draft);

// 全タグを抽出してカウント
const tagCount = posts.reduce((acc, post) => {
  post.data.tags.forEach(tag => {
    acc[tag] = (acc[tag] || 0) + 1;
  });
  return acc;
}, {} as Record<string, number>);

// タグを記事数順でソート
const sortedTags = Object.entries(tagCount)
  .sort(([,a], [,b]) => b - a);
```

**表示構造**:
```html
<BaseLayout title="タグ一覧">
  <Header />
  <main>
    <!-- ヘッダーセクション -->
    <section class="bg-gray-50">
      <h1>タグ一覧</h1>
      <p>{totalTags}個のタグ、{totalPosts}件の記事</p>
    </section>
    
    <!-- タグクラウド -->
    <section>
      <div class="flex flex-wrap gap-4">
        {sortedTags.map(([tag, count]) => (
          <a href={`/tags/${tag}/`} class="tag-link">
            <span class="tag-name">#{tag}</span>
            <span class="tag-count">({count})</span>
          </a>
        ))}
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

#### 3.1.2 tags/[tag].astro (タグ別記事一覧ページ)

**ファイルパス**: `src/pages/tags/[tag].astro`

**責務**:
- 動的ルーティング処理
- 特定タグでの記事フィルタリング
- パンくずナビゲーション

**静的パス生成**:
```typescript
export async function getStaticPaths() {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const uniqueTags = [...new Set(allPosts.flatMap(post => post.data.tags))];

  return uniqueTags.map(tag => {
    const filteredPosts = allPosts
      .filter(post => post.data.tags.includes(tag))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return {
      params: { tag },
      props: { posts: filteredPosts, tag },
    };
  });
}
```

**パンくずナビゲーション**:
```html
<nav aria-label="Breadcrumb">
  <ol class="inline-flex items-center space-x-1 md:space-x-3">
    <li>
      <a href="/" class="breadcrumb-link">ホーム</a>
    </li>
    <li>
      <svg class="breadcrumb-separator">...</svg>
      <a href="/tags/" class="breadcrumb-link">タグ</a>
    </li>
    <li aria-current="page">
      <svg class="breadcrumb-separator">...</svg>
      <span class="breadcrumb-current">#{tag}</span>
    </li>
  </ol>
</nav>
```

**記事一覧表示**:
```html
<section>
  <div class="text-center mb-8">
    <div class="tag-badge">#{tag}</div>
    <h1>「{tag}」の記事一覧</h1>
    <p>{posts.length} 件の記事があります</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {posts.map(post => (
      <BlogCard post={post} client:visible />
    ))}
  </div>
</section>
```

### 3.2 未実装コンポーネント

#### 3.2.1 categories/index.astro (カテゴリ一覧ページ)

**要件**: TASK-009で実装予定

**設計仕様**:
```typescript
// カテゴリ別記事数の計算
const categoryCount = posts.reduce((acc, post) => {
  if (post.data.category) {
    acc[post.data.category] = (acc[post.data.category] || 0) + 1;
  }
  return acc;
}, {} as Record<string, number>);
```

#### 3.2.2 categories/[category].astro (カテゴリ別記事一覧)

**設計仕様**:
```typescript
export async function getStaticPaths() {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const uniqueCategories = [...new Set(
    allPosts
      .map(post => post.data.category)
      .filter(Boolean)
  )];

  return uniqueCategories.map(category => {
    const filteredPosts = allPosts
      .filter(post => post.data.category === category)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return {
      params: { category },
      props: { posts: filteredPosts, category },
    };
  });
}
```

## 4. データ設計

### 4.1 タグ管理

**データ構造**:
```typescript
// 記事内のタグ配列
tags: ['TypeScript', 'React', 'Astro']

// タグカウントオブジェクト
tagCount: {
  'TypeScript': 15,
  'React': 12,
  'Astro': 8,
  'JavaScript': 20
}
```

**タグ正規化**:
```typescript
// 大文字小文字の統一
const normalizeTag = (tag: string): string => {
  return tag.trim().toLowerCase();
};

// 重複タグの除去
const uniqueTags = [...new Set(allTags.map(normalizeTag))];
```

### 4.2 カテゴリ管理

**データ構造**:
```typescript
// 記事内のカテゴリ（単一値）
category: '技術'

// 推奨カテゴリ一覧
const CATEGORIES = [
  '技術',
  '学習記録', 
  '開発日記',
  '雑記',
  'レビュー'
] as const;
```

### 4.3 URL設計

**タグURL構造**:
```
/tags/                    # タグ一覧
/tags/typescript/         # TypeScriptタグの記事一覧
/tags/react/             # Reactタグの記事一覧
```

**カテゴリURL構造（未実装）**:
```
/categories/             # カテゴリ一覧
/categories/技術/         # 技術カテゴリの記事一覧
/categories/学習記録/      # 学習記録カテゴリの記事一覧
```

## 5. スタイリング設計

### 5.1 タグクラウドデザイン

**タグサイズ設計**:
```css
/* 記事数に応じたタグサイズ */
.tag-xs   { font-size: 0.75rem; }  /* 1-2記事 */
.tag-sm   { font-size: 0.875rem; } /* 3-5記事 */
.tag-base { font-size: 1rem; }     /* 6-10記事 */
.tag-lg   { font-size: 1.125rem; } /* 11-15記事 */
.tag-xl   { font-size: 1.25rem; }  /* 16+記事 */
```

**実装ロジック**:
```typescript
const getTagSize = (count: number): string => {
  if (count >= 16) return 'tag-xl';
  if (count >= 11) return 'tag-lg';
  if (count >= 6) return 'tag-base';
  if (count >= 3) return 'tag-sm';
  return 'tag-xs';
};
```

### 5.2 タグバッジデザイン

**基本スタイル**:
```css
.tag-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tag-badge:hover {
  background-color: #a06d95;
  color: white;
  transform: translateY(-1px);
}

/* ダークモード */
.dark .tag-badge {
  background-color: #374151;
  color: #d1d5db;
}

.dark .tag-badge:hover {
  background-color: #a06d95;
}
```

### 5.3 パンくずナビゲーション

**レスポンシブデザイン**:
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .breadcrumb {
    gap: 0.75rem;
  }
}

.breadcrumb-separator {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #a06d95;
}
```

## 6. SEO設計

### 6.1 タグページのSEO

**メタタグ設計**:
```typescript
const seoTitle = `タグ「${tag}」の記事一覧 | Tech Blog`;
const seoDescription = `「${tag}」タグが付いた記事の一覧ページです。${posts.length}件の記事があります。`;
```

**canonical URL**:
```html
<link rel="canonical" href={`https://yourdomain.com/tags/${tag}/`} />
```

### 6.2 構造化データ

**CollectionPage Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "TypeScriptタグの記事一覧",
  "description": "TypeScriptに関する記事の一覧",
  "url": "https://yourdomain.com/tags/typescript/",
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 15,
    "itemListElement": [...]
  }
}
```

**BreadcrumbList Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://yourdomain.com/"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "タグ",
      "item": "https://yourdomain.com/tags/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "TypeScript",
      "item": "https://yourdomain.com/tags/typescript/"
    }
  ]
}
```

## 7. パフォーマンス設計

### 7.1 静的パス生成最適化

**ビルド時処理**:
```typescript
// 全タグを事前計算
const allTags = [...new Set(allPosts.flatMap(post => post.data.tags))];

// 各タグページを静的生成
return allTags.map(tag => ({
  params: { tag: encodeURIComponent(tag) },
  props: { 
    posts: filteredPosts,
    tag,
    totalPosts: allPosts.length,
    relatedTags: getRelatedTags(tag, allPosts)
  }
}));
```

### 7.2 メモリ効率化

**大量タグ対応**:
```typescript
// タグ別記事マップをメモ化
const tagPostsMap = new Map<string, CollectionEntry<'blog'>[]>();

allPosts.forEach(post => {
  post.data.tags.forEach(tag => {
    if (!tagPostsMap.has(tag)) {
      tagPostsMap.set(tag, []);
    }
    tagPostsMap.get(tag)!.push(post);
  });
});
```

## 8. ユーザビリティ設計

### 8.1 タグクラウドのインタラクション

**ホバーエフェクト**:
```css
.tag-cloud-item {
  position: relative;
  transition: all 0.3s ease;
}

.tag-cloud-item:hover {
  transform: scale(1.1);
  z-index: 10;
}

.tag-cloud-item:hover::after {
  content: attr(data-count) "件の記事";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
}
```

### 8.2 空状態の処理

**タグに記事が0件の場合**:
```jsx
{posts.length === 0 ? (
  <div className="text-center py-12">
    <svg className="mx-auto h-12 w-12 text-gray-400">...</svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      記事がありません
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      このタグの記事はまだありません。
    </p>
    <div className="mt-6">
      <a href="/tags/" className="btn-primary">
        すべてのタグを見る
      </a>
    </div>
  </div>
) : (
  // 記事一覧表示
)}
```

## 9. アクセシビリティ設計

### 9.1 タグナビゲーション

**スクリーンリーダー対応**:
```html
<nav aria-label="タグ一覧" role="navigation">
  <h2 class="sr-only">記事をタグで絞り込む</h2>
  <ul role="list" class="tag-cloud">
    <li>
      <a href="/tags/typescript/" 
         aria-label="TypeScriptタグ、15件の記事">
        <span aria-hidden="true">#</span>TypeScript
        <span class="tag-count" aria-hidden="true">(15)</span>
      </a>
    </li>
  </ul>
</nav>
```

### 9.2 キーボード操作

**フォーカス管理**:
```css
.tag-link:focus {
  outline: 2px solid #a06d95;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.tag-link:focus-visible {
  box-shadow: 0 0 0 3px rgba(160, 109, 149, 0.1);
}
```

## 10. 今後の実装計画

### 10.1 TASK-009: カテゴリ別記事一覧実装

**実装優先度**: Low

**実装内容**:
1. `categories/index.astro`作成
2. `categories/[category].astro`作成  
3. カテゴリナビゲーション追加
4. ヘッダーメニューにカテゴリ追加

**技術的課題**:
- 日本語カテゴリのURL エンコーディング
- カテゴリ階層構造の将来対応

### 10.2 関連タグ機能

**実装内容**:
- タグ詳細ページでの関連タグ表示
- タグ間の関連度計算
- タグ推薦システム

**関連度計算アルゴリズム**:
```typescript
const calculateTagRelatedness = (targetTag: string, allPosts: Post[]) => {
  const tagCooccurrence = new Map<string, number>();
  
  allPosts
    .filter(post => post.data.tags.includes(targetTag))
    .forEach(post => {
      post.data.tags
        .filter(tag => tag !== targetTag)
        .forEach(tag => {
          tagCooccurrence.set(tag, (tagCooccurrence.get(tag) || 0) + 1);
        });
    });
    
  return Array.from(tagCooccurrence.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
};
```

### 10.3 タグ管理機能

**実装内容**:
- タグ統合機能（同義語タグの統合）
- タグ階層化（親子関係）
- タグ説明文機能

## 11. 測定・監視

### 11.1 タグ利用率分析

**指標**:
- タグクリック率
- タグページ滞在時間
- タグ経由の記事到達率
- 人気タグランキング

### 11.2 ユーザー行動分析

**測定内容**:
- タグクラウドでの探索パターン
- パンくずナビゲーション利用率
- タグページからの記事遷移率

---

**文書作成日**: 2025-01-15  
**最終更新日**: 2025-01-15  
**作成者**: システム設計書自動生成  
**バージョン**: 1.0  
**関連文書**: 10-requirements.md, 20-basic-design.md, 30-todo-list.md