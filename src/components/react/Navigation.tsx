interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  mobile?: boolean;
  currentPath: string;
  className?: string;
}

const navItems: NavItem[] = [
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
      <nav className={`space-y-1 ${className}`}>
        {navItems.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={getLinkClasses(item.href)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav className={`flex items-center justify-center space-x-8 ${className}`}>
      {navItems.map(item => (
        <a
          key={item.href}
          href={item.href}
          className={getLinkClasses(item.href)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
