import { useState, useCallback } from 'react';
import CategorySearch from './CategorySearch';

interface CategoryData {
  category: string;
  count: number;
}

interface CategoryGridProps {
  initialCategories: CategoryData[];
}

// カテゴリ名をURLセーフにする関数
const sanitizeCategory = (category: string): string => {
  return category.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
};

export default function CategoryGrid({ initialCategories }: CategoryGridProps) {
  const [filteredCategories, setFilteredCategories] =
    useState<CategoryData[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleFilteredCategoriesChange = useCallback(
    (categories: CategoryData[]) => {
      setFilteredCategories(categories);
    },
    []
  );

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div>
      {/* 検索機能 */}
      <CategorySearch
        categories={initialCategories}
        onFilteredCategoriesChange={handleFilteredCategoriesChange}
        onSearchQueryChange={handleSearchQueryChange}
      />

      {/* カテゴリ一覧表示 */}
      {filteredCategories.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          role="list"
          aria-label="カテゴリ一覧"
        >
          {filteredCategories.map(({ category, count }) => (
            <a
              key={category}
              href={`/categories/${sanitizeCategory(category)}/`}
              role="listitem"
              aria-label={`カテゴリ「${category}」の記事${count}件を表示`}
              className="group flex items-center gap-4 pl-4 py-4 border-l-2 border-l-gray-200 dark:border-l-gray-700 hover:border-l-primary-500 dark:hover:border-l-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-r-sm"
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category}
                </h2>
                <p
                  className="text-sm text-gray-500 dark:text-gray-400 mt-0.5"
                  aria-label={`このカテゴリには${count}件の記事があります`}
                >
                  {count} 記事
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 dark:group-hover:text-primary-500 transition-colors flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          ))}
        </div>
      ) : (
        // 検索中でない場合のみ「カテゴリがありません」メッセージを表示
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              カテゴリがありません
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              まだカテゴリが作成されていません。
            </p>
          </div>
        )
      )}
    </div>
  );
}
