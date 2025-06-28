import { useState, useEffect, useRef } from 'react';
import SearchBox from './SearchBox';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  currentPath: string;
  className?: string;
}

export default function MobileMenu({
  navItems,
  currentPath,
  className = '',
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 外部クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActiveLink = (href: string) => {
    return (
      currentPath === href || (href !== '/' && currentPath.startsWith(href))
    );
  };

  return (
    <div className={`md:hidden ${className}`}>
      {/* Mobile menu button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
      >
        <span className="sr-only">メニューを開く</span>
        <svg
          className="block h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-all duration-200 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Search Box for Mobile */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          <SearchBox compact placeholder="記事を検索..." />
        </div>

        <nav
          className="px-4 pt-2 pb-3 space-y-1"
          aria-label="モバイルメインナビゲーション"
        >
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              aria-current={isActiveLink(item.href) ? 'page' : undefined}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActiveLink(item.href)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
