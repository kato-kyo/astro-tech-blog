import type { CollectionEntry } from 'astro:content';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import readingTime from 'reading-time';

interface BlogCardProps {
  post: CollectionEntry<'blog'>;
  className?: string;
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
  const { slug, data } = post;
  const { title, description, emoji, pubDate, tags, category, draft } = data;

  const stats = readingTime(post.body);

  // 開発環境でのみドラフトバッジを表示
  const showDraftBadge = import.meta.env.DEV && draft;

  return (
    <article
      className={`group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 ${className}`}
      aria-labelledby={`blog-title-${slug}`}
      aria-describedby={`blog-meta-${slug}`}
    >
      {showDraftBadge && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 shadow-sm"
            aria-label="下書き記事"
            role="status"
          >
            🚧
          </span>
        </div>
      )}
      <a
        href={`/blog/${slug}/`}
        className="block relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-900 rounded-lg"
        aria-label={`ブログ記事「${title}」を読む`}
      >
        <div className="p-6">
          <div
            className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400"
            id={`blog-meta-${slug}`}
            aria-label="記事のメタ情報"
          >
            <time
              dateTime={pubDate.toISOString()}
              aria-label={`投稿日: ${format(parseISO(pubDate.toISOString()), 'yyyy年M月d日', { locale: ja })}`}
            >
              {format(parseISO(pubDate.toISOString()), 'yyyy年M月d日', {
                locale: ja,
              })}
            </time>
            <span
              className="flex items-center gap-1"
              aria-label={`読了時間: ${stats.text}`}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {stats.text}
            </span>
            {category && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                aria-label={`カテゴリ: ${category}`}
              >
                {category}
              </span>
            )}
          </div>

          <h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 flex items-center gap-2"
            id={`blog-title-${slug}`}
          >
            {emoji && (
              <span className="text-2xl" role="img" aria-label="記事のアイコン">
                {emoji}
              </span>
            )}
            <span className="hover:underline">{title}</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label="記事のタグ">
              {tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  aria-label={`タグ: ${tag}`}
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  aria-label={`他に${tags.length - 3}個のタグ`}
                >
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </a>
    </article>
  );
}
