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
  const { title, description, heroImage, pubDate, tags, category, draft } =
    data;

  const stats = readingTime(post.body);

  // 開発環境でのみドラフトバッジを表示
  const showDraftBadge = import.meta.env.DEV && draft;

  return (
    <article
      className={`group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 ${className}`}
    >
      {showDraftBadge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 shadow-sm">
            🚧
          </span>
        </div>
      )}
      <a
        href={`/blog/${slug}/`}
        className="block relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-900 rounded-lg"
      >
        {heroImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              width={400}
              height={225}
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={pubDate.toISOString()}>
              {format(parseISO(pubDate.toISOString()), 'yyyy年M月d日', {
                locale: ja,
              })}
            </time>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {stats.text}
            </span>
            {category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {category}
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            <span className="hover:underline">{title}</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
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
