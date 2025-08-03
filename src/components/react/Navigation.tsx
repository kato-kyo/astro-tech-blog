import { SITE_CONFIG } from '../../config/site';

interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  mobile?: boolean;
  currentPath: string;
  className?: string;
}

const allNavItems: NavItem[] = [
  { href: '/', label: 'ホーム' },
  { href: '/blog/', label: 'ブログ' },
  { href: '/categories/', label: 'カテゴリ' },
  { href: '/tags/', label: 'タグ' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'お問い合わせ' },
];

// 設定値に基づいてナビゲーションアイテムをフィルタリング
const navItems: NavItem[] = allNavItems.filter(item => {
  if (item.href === '/about/' && !SITE_CONFIG.pages.showAbout) {
    return false;
  }
  if (item.href === '/contact/' && !SITE_CONFIG.pages.showContact) {
    return false;
  }
  return true;
});

export default function Navigation({
  mobile = false,
  currentPath,
  className = '',
}: NavigationProps) {
  const isActiveLink = (href: string) => {
    return (
      currentPath === href || (href !== '/' && currentPath.startsWith(href))
    );
  };

  const getLinkClasses = (href: string) => {
    const baseClasses =
      'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-900';
    const activeClasses =
      'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20';
    const inactiveClasses =
      'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800';

    if (mobile) {
      return `block px-3 py-2 rounded-md text-sm font-medium ${baseClasses} ${
        isActiveLink(href) ? activeClasses : inactiveClasses
      }`;
    }

    return `px-3 py-2 text-sm font-medium rounded-md ${baseClasses} ${
      isActiveLink(href) ? activeClasses : inactiveClasses
    }`;
  };

  if (mobile) {
    return (
      <nav
        className={`space-y-1 ${className}`}
        aria-label="モバイルメインナビゲーション"
      >
        {navItems.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={getLinkClasses(item.href)}
            aria-current={isActiveLink(item.href) ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={`flex items-center justify-center space-x-8 ${className}`}
      aria-label="メインナビゲーション"
    >
      {navItems.map(item => (
        <a
          key={item.href}
          href={item.href}
          className={getLinkClasses(item.href)}
          aria-current={isActiveLink(item.href) ? 'page' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
