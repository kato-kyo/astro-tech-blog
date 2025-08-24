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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="grid"
          aria-label="カテゴリ一覧"
        >
          {filteredCategories.map(({ category, count }) => (
            <a
              key={category}
              href={`/categories/${sanitizeCategory(category)}/`}
              role="gridcell"
              aria-label={`カテゴリ「${category}」の記事${count}件を表示`}
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
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {category}
                </h2>
                <p
                  className="text-sm text-gray-500 dark:text-gray-400"
                  aria-label={`このカテゴリには${count}件の記事があります`}
                >
                  {count} 記事
                </p>
              </div>
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
