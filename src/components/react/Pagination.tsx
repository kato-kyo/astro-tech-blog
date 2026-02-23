interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  className = '',
}: PaginationProps) {
  // ページネーションが不要な場合（1ページ以下）は表示しない
  if (totalPages <= 1) {
    return null;
  }

  // 表示するページ番号の範囲を計算（前後2ページ）
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  // URLを生成する関数
  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}/page/${page}`;
  };

  // 前のページのURL
  const prevUrl = currentPage > 1 ? getPageUrl(currentPage - 1) : null;

  // 次のページのURL
  const nextUrl = currentPage < totalPages ? getPageUrl(currentPage + 1) : null;

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="ページネーション"
    >
      {/* 前のページボタン */}
      {prevUrl ? (
        <a
          href={prevUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
          aria-label="前のページ"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">前へ</span>
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 dark:text-gray-600 cursor-default">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">前へ</span>
        </span>
      )}

      {/* ページ番号 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="px-2 py-1.5 text-sm text-gray-400 dark:text-gray-500"
              >
                …
              </span>
            );
          }

          const isCurrentPage = pageNum === currentPage;
          const pageUrl = getPageUrl(pageNum as number);

          return isCurrentPage ? (
            <span
              key={pageNum}
              className="relative flex flex-col items-center px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white"
              aria-current="page"
            >
              {pageNum}
              <span className="absolute -bottom-0 w-1 h-1 bg-primary-500 rounded-full" />
            </span>
          ) : (
            <a
              key={pageNum}
              href={pageUrl}
              className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
              aria-label={`ページ ${pageNum} へ`}
            >
              {pageNum}
            </a>
          );
        })}
      </div>

      {/* 次のページボタン */}
      {nextUrl ? (
        <a
          href={nextUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
          aria-label="次のページ"
        >
          <span className="hidden sm:inline">次へ</span>
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 dark:text-gray-600 cursor-default">
          <span className="hidden sm:inline">次へ</span>
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </nav>
  );
}
