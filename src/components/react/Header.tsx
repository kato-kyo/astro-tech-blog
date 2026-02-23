import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import SearchBox from './SearchBox';

interface NavItem {
  href: string;
  label: string;
}

interface SiteConfig {
  nav: {
    headerTitle: string;
  };
  pages: {
    showAbout: boolean;
    showContact: boolean;
  };
}

interface HeaderProps {
  currentPath: string;
  siteConfig: SiteConfig;
}

const allNavItems: NavItem[] = [
  { href: '/', label: 'ホーム' },
  { href: '/blog/', label: 'ブログ' },
  { href: '/tags/', label: 'タグ' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'お問い合わせ' },
];

export default function Header({ currentPath, siteConfig }: HeaderProps) {
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
  return (
    <header
      className="sticky top-0 z-50 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.4)]"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="flex items-center gap-3 group"
              aria-label={`${siteConfig.nav.headerTitle} - ホームページへ`}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-white font-mono font-bold text-sm leading-none">
                  K
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {siteConfig.nav.headerTitle}
              </span>
            </a>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:block">
            <Navigation currentPath={currentPath} siteConfig={siteConfig} />
          </div>

          {/* Search Box - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBox compact placeholder="記事を検索..." />
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <MobileMenu navItems={navItems} currentPath={currentPath} />
          </div>
        </div>
      </div>
    </header>
  );
}
