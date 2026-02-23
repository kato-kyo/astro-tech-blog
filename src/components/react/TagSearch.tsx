import React, { useState, useMemo, useRef } from 'react';

interface TagData {
  tag: string;
  count: number;
}

interface TagSearchProps {
  tags: TagData[];
  onFilteredTagsChange: (filteredTags: TagData[]) => void;
  onSearchQueryChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TagSearch({
  tags,
  onFilteredTagsChange,
  onSearchQueryChange,
  placeholder = 'タグを検索...',
  className = '',
}: TagSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 検索クエリに基づいてタグをフィルタリング
  const filteredTags = useMemo(() => {
    if (!query.trim()) {
      return tags;
    }

    const searchTerm = query.toLowerCase().trim();
    return tags.filter(({ tag }) => tag.toLowerCase().includes(searchTerm));
  }, [tags, query]);

  // フィルタリング結果が変更されたら親コンポーネントに通知
  React.useEffect(() => {
    onFilteredTagsChange(filteredTags);
  }, [filteredTags, onFilteredTagsChange]);

  // 検索クエリが変更されたら親コンポーネントに通知
  React.useEffect(() => {
    if (onSearchQueryChange) {
      onSearchQueryChange(query);
    }
  }, [query, onSearchQueryChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  // キーボードイベントハンドラ
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div className="relative max-w-md mx-auto">
        {/* 検索アイコン */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 検索入力フィールド */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors"
        />

        {/* クリアボタン */}
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 rounded-md"
            aria-label="検索をクリア"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 検索結果情報 */}
      {query && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            "{query}" の検索結果: {filteredTags.length} 個のタグ
          </p>
        </div>
      )}

      {/* 検索結果が0件の場合 */}
      {query && filteredTags.length === 0 && (
        <div className="text-center mt-6 py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            該当するタグが見つかりません
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            検索条件を変更してみてください。
          </p>
        </div>
      )}
    </div>
  );
}
