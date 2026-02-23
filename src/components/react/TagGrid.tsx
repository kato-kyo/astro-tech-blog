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
      {filteredTags.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="grid"
          aria-label="タグ一覧"
        >
          {filteredTags.map(({ tag, count }) => (
            <a
              key={tag}
              href={`/tags/${sanitizeTag(tag)}/`}
              role="gridcell"
              aria-label={`タグ「${tag}」の記事${count}件を表示`}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-900"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  #{tag}
                </h2>
                <p
                  className="text-sm text-gray-500 dark:text-gray-400"
                  aria-label={`このタグには${count}件の記事があります`}
                >
                  {count} 記事
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        // 検索中でない場合のみ「タグがありません」メッセージを表示
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
        )
      )}
    </div>
  );
}
