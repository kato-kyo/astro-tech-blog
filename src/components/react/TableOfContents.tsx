import { useState, useEffect } from 'react';
import type { MarkdownHeading } from 'astro';

interface TableOfContentsProps {
  headings: MarkdownHeading[];
  className?: string;
}

export default function TableOfContents({
  headings,
  className = '',
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Filter headings to only include h2 and h3
  const tocHeadings = headings.filter(h => h.depth <= 3);

  useEffect(() => {
    setMounted(true);

    if (tocHeadings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -80% 0%',
        threshold: 0,
      }
    );

    // 全ての見出し要素を監視
    tocHeadings.forEach(heading => {
      const element = document.getElementById(heading.slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocHeadings]);

  const handleClick = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (!mounted || tocHeadings.length === 0) {
    return null;
  }

  return (
    <nav
      className={`toc bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}
      aria-label="記事の目次"
      role="navigation"
    >
      <h3
        className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider"
        id="toc-heading"
      >
        目次
      </h3>
      <ul className="space-y-2 text-sm" aria-labelledby="toc-heading">
        {tocHeadings.map(heading => (
          <li key={heading.slug}>
            <button
              onClick={() => handleClick(heading.slug)}
              aria-label={`${heading.text}の章へ移動`}
              aria-current={activeId === heading.slug ? 'location' : undefined}
              className={`
                block w-full text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-primary-400 rounded-sm
                ${
                  activeId === heading.slug
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                }
                ${heading.depth === 2 ? 'font-medium' : ''}
                ${heading.depth === 3 ? 'ml-4 text-xs' : ''}
              `}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 transition-colors duration-200 ${
                  activeId === heading.slug
                    ? 'bg-primary-600 dark:bg-primary-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-hidden="true"
              />
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
