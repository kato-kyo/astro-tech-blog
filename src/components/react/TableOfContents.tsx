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
      className={`toc ${className}`}
      aria-label="記事の目次"
      role="navigation"
    >
      <p
        className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3"
        id="toc-heading"
      >
        目次
      </p>
      <ul
        className="border-l border-gray-200 dark:border-gray-700 space-y-0.5 text-sm"
        aria-labelledby="toc-heading"
      >
        {tocHeadings.map(heading => (
          <li key={heading.slug}>
            <button
              onClick={() => handleClick(heading.slug)}
              aria-label={`${heading.text}の章へ移動`}
              aria-current={activeId === heading.slug ? 'location' : undefined}
              className={`
                block w-full text-left py-1 pl-4 border-l-2 -ml-px transition-colors duration-150 focus:outline-none
                ${
                  activeId === heading.slug
                    ? 'border-l-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                    : 'border-l-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-l-gray-300 dark:hover:border-l-gray-600'
                }
                ${heading.depth === 3 ? 'pl-7 text-xs' : ''}
              `}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
