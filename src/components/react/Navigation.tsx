interface NavItem {
  href: string;
  label: string;
}

interface SiteConfig {
  pages: {
    showAbout: boolean;
    showContact: boolean;
  };
}

interface NavigationProps {
  mobile?: boolean;
  currentPath: string;
  className?: string;
  siteConfig: SiteConfig;
}

const allNavItems: NavItem[] = [
  { href: '/', label: 'ホーム' },
  { href: '/blog/', label: 'ブログ' },
  { href: '/categories/', label: 'カテゴリ' },
  { href: '/tags/', label: 'タグ' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'お問い合わせ' },
];

export default function Navigation({
  mobile = false,
  currentPath,
  className = '',
  siteConfig,
}: NavigationProps) {
  // 設定値に基づいてナビゲーションアイテムをフィルタリング
  const navItems: NavItem[] = allNavItems.filter(item => {
    if (item.href === '/about/' && !siteConfig.pages.showAbout) {
      return false;
    }
    if (item.href === '/contact/' && !siteConfig.pages.showContact) {
      return false;
    }
    return true;
  });
  const isActiveLink = (href: string) => {
    return (
      currentPath === href || (href !== '/' && currentPath.startsWith(href))
    );
  };

  const getLinkClasses = (href: string) => {
    const baseClasses =
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-900';
    const activeClasses =
      'text-primary-600 dark:text-primary-400 font-semibold';
    const inactiveClasses =
      'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100';

    if (mobile) {
      return `block px-3 py-2 rounded-md text-sm font-medium ${baseClasses} ${
        isActiveLink(href) ? activeClasses : inactiveClasses
      }`;
    }

    return `relative px-1 py-2 text-sm ${baseClasses} ${
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
      className={`flex items-center justify-center gap-6 ${className}`}
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
          {isActiveLink(item.href) && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
          )}
        </a>
      ))}
    </nav>
  );
}
