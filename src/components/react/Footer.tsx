import React from 'react';

interface FooterProps {
  className?: string;
}

interface LinkItem {
  href: string;
  label: string;
}

interface SocialLink {
  href: string;
  label: string;
  IconComponent: React.ComponentType;
}

const quickLinks: LinkItem[] = [
  { href: '/blog/', label: 'ブログ一覧' },
  { href: '/tags/', label: 'タグ一覧' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'お問い合わせ' },
];

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
      clipRule="evenodd"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const RSSIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3.429 2.063C8.731 2.063 13.071 6.404 13.071 11.706h2.994c0-8.056-6.53-14.586-14.586-14.586v2.994c0 .414.336.749.75.749zM3.429 6.428c3.018 0 5.465 2.447 5.465 5.465h2.994c0-4.677-3.782-8.459-8.459-8.459v2.994zM6.193 13.193c.826 0 1.495.669 1.495 1.495s-.669 1.495-1.495 1.495-1.495-.669-1.495-1.495.669-1.495 1.495-1.495z" />
  </svg>
);

const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com',
    label: 'GitHub',
    IconComponent: GitHubIcon,
  },
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    IconComponent: TwitterIcon,
  },
  {
    href: '/rss.xml',
    label: 'RSS',
    IconComponent: RSSIcon,
  },
];

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Tech Blog
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              技術に関する記事や学習記録、開発の知見を共有するブログです。
              日々の学習や実務で得た知識を記録し、同じ道を歩む方々と情報を共有しています。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              リンク
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              SNS
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <a
                  key={social.href}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    social.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.IconComponent />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Tech Blog. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a
                href="/privacy/"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                プライバシーポリシー
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
