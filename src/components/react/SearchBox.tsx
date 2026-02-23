import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SearchResult {
  id: string;
  url: string;
  content: string;
  sub_results: {
    title: string;
    url: string;
    excerpt: string;
  }[];
  meta: {
    title: string;
  };
}

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    content: string;
    sub_results: {
      title: string;
      url: string;
      excerpt: string;
    }[];
    meta: {
      title: string;
    };
  }>;
}

interface PagefindAPI {
  search: (
    query: string,
    options?: { limit?: number; excerpt_length?: number }
  ) => Promise<{
    results: PagefindResult[];
  }>;
  init: () => Promise<void>;
}

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export default function SearchBox({
  placeholder = '記事を検索...',
  className = '',
  compact = false,
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pagefind, setPagefind] = useState<PagefindAPI | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  // Pagefindの初期化
  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window === 'undefined') return;

    const initializePagefind = async () => {
      try {
        // 動的importでPagefindを読み込み（実行時のみ）
        const pagefindModule = await (async () => {
          const url = '/pagefind/pagefind.js';
          // @ts-ignore: Pagefindは動的に生成されるため型定義が利用できない
          return await import(/* @vite-ignore */ url);
        })();

        // Pagefindを初期化
        await pagefindModule.init();

        setPagefind(pagefindModule);
        setIsInitialized(true);
      } catch {
        setIsInitialized(false);
      }
    };

    // 少し遅延させてから初期化（DOMが完全に読み込まれてから）
    const timer = setTimeout(initializePagefind, 100);

    return () => clearTimeout(timer);
  }, []);

  // 検索実行
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !pagefind || !isInitialized) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);

        const searchResponse = await pagefind.search(searchQuery, {
          limit: 10,
          excerpt_length: 30,
        });

        // 全ての検索結果の詳細データを取得
        const allResultData = await Promise.all(
          searchResponse.results.map(async result => {
            const data = await result.data();
            return {
              id: result.id,
              url: data.url,
              content: data.content,
              sub_results: data.sub_results,
              meta: data.meta,
            };
          })
        );

        // ブログ記事のみをフィルタリング（記事一覧やページネーションは除外）
        const blogArticleResults = allResultData.filter(result => {
          const url = result.url;
          // /blog/記事スラッグ.html または /blog/記事スラッグ/ の形式のみを許可
          return /^\/blog\/[^/]+(\/$|\.html$)/.test(url);
        });

        // 最初の10件まで表示
        setResults(blogArticleResults.slice(0, 10));
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [pagefind, isInitialized]
  );

  // デバウンス付き検索
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      // 既存のタイマーをクリア
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      // 新しいタイマーを設定
      debounceRef.current = window.setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    },
    [performSearch]
  );

  // Enterキーでの検索とキーボードナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        // 選択された結果に移動
        const selectedResult = results[selectedIndex];
        window.location.href = selectedResult.url;
        setIsOpen(false);
      } else {
        // 通常の検索実行
        if (debounceRef.current) {
          window.clearTimeout(debounceRef.current);
        }
        performSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
      setQuery('');
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      }
    }
  };

  // 結果アイテムのクリック
  const handleResultClick = (url: string) => {
    window.location.href = url;
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // 検索結果リセット時にselectedIndexもリセット
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      setIsOpen(true);
      debouncedSearch(value);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  };

  // 外部クリックで閉じる
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // selectedIndexが変更されたときに選択された項目にスクロール
  useEffect(() => {
    if (selectedIndex >= 0 && isOpen) {
      const selectedElement = dropdownRef.current?.querySelector(
        `[data-result-index="${selectedIndex}"]`
      );

      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex, isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 検索入力フィールド */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-label="記事検索"
          aria-describedby="search-help"
          aria-expanded={isOpen && results.length > 0}
          aria-haspopup="listbox"
          aria-activedescendant={
            selectedIndex >= 0 && results.length > 0
              ? `search-result-${selectedIndex}`
              : undefined
          }
          aria-autocomplete="list"
          className={`
            w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 
            rounded-lg bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100 
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-colors duration-200
            ${compact ? 'text-sm py-1.5' : ''}
          `}
        />

        {/* ヘルプテキスト（スクリーンリーダー用） */}
        <div id="search-help" className="sr-only">
          検索後、矢印キーで結果を選択し、Enterで移動できます
        </div>

        {/* 検索アイコン */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <div
              className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"
              aria-label="検索中"
            ></div>
          ) : (
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* 検索結果ドロップダウン */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          role="region"
          aria-live="polite"
          aria-label="検索結果"
        >
          {isLoading ? (
            <div
              className="p-4 text-center text-gray-500 dark:text-gray-400"
              role="status"
              aria-live="polite"
            >
              検索中...
            </div>
          ) : results.length > 0 ? (
            <ul role="listbox" aria-label="検索結果">
              {results.map((result, index) => (
                <li
                  key={result.id}
                  id={`search-result-${index}`}
                  data-result-index={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                  aria-label={`${result.meta.title || 'タイトルなし'} - ${result.url}`}
                  className={`p-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors focus:outline-none ${
                    index === selectedIndex
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleResultClick(result.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div
                    className={`font-medium mb-1 ${
                      index === selectedIndex
                        ? 'text-primary-900 dark:text-primary-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {result.meta.title || 'タイトルなし'}
                  </div>
                  {result.sub_results.length > 0 && (
                    <div
                      className={`text-sm line-clamp-2 ${
                        index === selectedIndex
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: result.sub_results[0].excerpt,
                      }}
                    />
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      index === selectedIndex
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-accent-600 dark:text-accent-400'
                    }`}
                  >
                    {result.url}
                  </div>
                </li>
              ))}
            </ul>
          ) : query.trim() && !isLoading ? (
            <div
              className="p-4 text-center text-gray-500 dark:text-gray-400"
              role="status"
              aria-live="polite"
            >
              "{query}" の検索結果が見つかりませんでした
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
