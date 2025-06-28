import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 環境に応じてドラフト記事の表示可否を判定する
 * 開発環境ではドラフト記事も表示、本番環境では非表示
 */
export function shouldShowDraft(): boolean {
  return import.meta.env.DEV;
}

/**
 * 環境に応じてブログ記事を取得する
 * 開発環境: すべての記事（ドラフト含む）
 * 本番環境: 公開記事のみ
 */
export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const showDrafts = shouldShowDraft();

  return await getCollection('blog', ({ data }) => {
    // 開発環境ではすべての記事を表示
    // 本番環境ではドラフトを除外
    return showDrafts || !data.draft;
  });
}

/**
 * 公開日順にソートされたブログ記事を取得する
 */
export async function getSortedBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getBlogPosts();
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * 特定のスラッグのブログ記事を取得する（環境に応じてドラフトを考慮）
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<CollectionEntry<'blog'> | undefined> {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug);
}
