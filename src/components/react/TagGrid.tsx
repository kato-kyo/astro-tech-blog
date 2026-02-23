import { useState, useCallback } from 'react';
import TagSearch from './TagSearch';

interface TagData {
  tag: string;
  count: number;
}

interface TagGridProps {
  initialTags: TagData[];
}

// タグ名をURLセーフにする関数
const sanitizeTag = (tag: string): string => {
  return tag.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
};

export default function TagGrid({ initialTags }: TagGridProps) {
  const [filteredTags, setFilteredTags] = useState<TagData[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleFilteredTagsChange = useCallback((tags: TagData[]) => {
    setFilteredTags(tags);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div>
      {/* 検索機能 */}
      <TagSearch
        tags={initialTags}
        onFilteredTagsChange={handleFilteredTagsChange}
        onSearchQueryChange={handleSearchQueryChange}
      />

      {/* タグ一覧表示 */}
      {filteredTags.length > 0
        ? (() => {
            const maxCount = Math.max(...filteredTags.map(t => t.count));
            const minCount = Math.min(...filteredTags.map(t => t.count));
            const getSize = (count: number) => {
              if (maxCount === minCount) return 'base';
              const ratio = (count - minCount) / (maxCount - minCount);
              if (ratio >= 0.7) return 'lg';
              if (ratio >= 0.35) return 'base';
              return 'sm';
            };
            const sizeClass: Record<string, string> = {
              sm: 'text-xs px-3 py-1.5',
              base: 'text-sm px-4 py-1.5',
              lg: 'text-base px-4 py-2',
            };
            return (
              <div
                className="flex flex-wrap gap-2"
                role="list"
                aria-label="タグ一覧"
              >
                {filteredTags.map(({ tag, count }) => {
                  const size = getSize(count);
                  return (
                    <a
                      key={tag}
                      href={`/tags/${sanitizeTag(tag)}/`}
                      role="listitem"
                      aria-label={`タグ「${tag}」の記事${count}件を表示`}
                      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 ${sizeClass[size]}`}
                    >
                      <span>#{tag}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">
                        {count}
                      </span>
                    </a>
                  );
                })}
              </div>
            );
          })()
        : // 検索中でない場合のみ「タグがありません」メッセージを表示
          !searchQuery && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                タグがありません
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                まだタグが作成されていません。
              </p>
            </div>
          )}
    </div>
  );
}
