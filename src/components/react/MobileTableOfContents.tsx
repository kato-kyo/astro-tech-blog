import { useState } from 'react';
import type { MarkdownHeading } from 'astro';

interface Props {
  headings: MarkdownHeading[];
}

export default function MobileTableOfContents({ headings }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleToc = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* フローティングボタン */}
      <button
        onClick={toggleToc}
        className="fixed top-20 right-4 z-40 bg-gray-600/90 hover:bg-gray-700 text-white px-3 py-2 rounded-md shadow-md transition-all duration-200 backdrop-blur-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400"
        aria-label="目次を開く"
      >
        目次
      </button>

      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドパネル */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white dark:bg-gray-800 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              目次
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-primary-400"
              aria-label="目次を閉じる"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 目次リスト */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav>
              <ul className="space-y-2">
                {headings.map((heading, index) => (
                  <li key={index}>
                    <a
                      href={`#${heading.slug}`}
                      onClick={handleLinkClick}
                      className={`block text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-primary-400 rounded-sm ${
                        heading.depth === 1
                          ? 'font-semibold text-gray-900 dark:text-white'
                          : heading.depth === 2
                            ? 'font-medium text-gray-800 dark:text-gray-200 pl-4'
                            : heading.depth === 3
                              ? 'text-gray-700 dark:text-gray-300 pl-8'
                              : 'text-gray-600 dark:text-gray-400 pl-12'
                      }`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
