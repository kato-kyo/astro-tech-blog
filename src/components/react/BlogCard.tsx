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
  const readMinutes = Math.ceil(stats.minutes);

  // 開発環境でのみドラフトバッジを表示
  const showDraftBadge = import.meta.env.DEV && draft;

  return (
    <article
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(237,123,32,0.15)] dark:hover:shadow-[0_8px_30px_-12px_rgba(237,123,32,0.1)] dark:ring-1 dark:ring-gray-700/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${className}`}
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
        className="block focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset dark:focus:ring-primary-400 rounded-xl"
        aria-label={`ブログ記事「${title}」を読む`}
      >
        {/* Emoji hero area */}
        <div className="h-24 flex items-center justify-center bg-primary-50 dark:bg-primary-950/20">
          <span className="text-5xl" role="img" aria-label="記事のアイコン">
            {emoji || '📝'}
          </span>
        </div>

        <div className="px-5 pt-4 pb-5">
          {/* Category badge */}
          {category && (
            <span
              className="inline-block text-xs font-medium text-primary-600 dark:text-primary-400 mb-2"
              aria-label={`カテゴリ: ${category}`}
            >
              {category}
            </span>
          )}

          <h2
            className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 leading-snug"
            id={`blog-title-${slug}`}
          >
            {title}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Meta */}
          <div
            className="flex items-center justify-between"
            id={`blog-meta-${slug}`}
          >
            <time
              dateTime={pubDate.toISOString()}
              className="text-xs text-gray-400 dark:text-gray-500"
              aria-label={`投稿日: ${format(parseISO(pubDate.toISOString()), 'yyyy年M月d日', { locale: ja })}`}
            >
              {format(parseISO(pubDate.toISOString()), 'yyyy/MM/dd', {
                locale: ja,
              })}
            </time>
            <span
              className="text-xs text-gray-400 dark:text-gray-500"
              aria-label={`読了時間: 約${readMinutes}分`}
            >
              約{readMinutes}分
            </span>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"
              aria-label="記事のタグ"
            >
              {tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="font-mono text-xs text-gray-400 dark:text-gray-500"
                  aria-label={`タグ: ${tag}`}
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span
                  className="font-mono text-xs text-gray-400 dark:text-gray-500"
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
