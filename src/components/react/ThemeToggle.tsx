import { useState, useEffect } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemePreference>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // テーマ設定の取得
  const getThemePreference = (): ThemePreference => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
    return 'system';
  };

  // 実効テーマの計算
  const getEffectiveTheme = (preference: ThemePreference): 'light' | 'dark' => {
    if (preference === 'system' && typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return preference === 'dark' ? 'dark' : 'light';
  };

  // テーマの適用
  const applyTheme = (preference: ThemePreference) => {
    const effective = getEffectiveTheme(preference);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', effective === 'dark');
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', preference);
    }
    setTheme(preference);
    setEffectiveTheme(effective);
  };

  useEffect(() => {
    setMounted(true);

    // 初期テーマの設定
    const initialTheme = getThemePreference();
    const initialEffective = getEffectiveTheme(initialTheme);
    setTheme(initialTheme);
    setEffectiveTheme(initialEffective);

    // システム設定変更の監視
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = (e: any) => {
        const currentTheme = getThemePreference();
        if (currentTheme === 'system') {
          const newEffective = e.matches ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newEffective === 'dark');
          }
          setEffectiveTheme(newEffective);
        }
      };

      mediaQuery.addEventListener('change', handleSystemChange);

      return () => {
        mediaQuery.removeEventListener('change', handleSystemChange);
      };
    }
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

    // 3つの状態をサイクル: light → dark → system → light
    let newTheme: ThemePreference;
    switch (theme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'system';
        break;
      case 'system':
      default:
        newTheme = 'light';
        break;
    }

    applyTheme(newTheme);
  };

  // 表示アイコンの決定
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      case 'system':
        return 'computer';
      default:
        return 'sun';
    }
  };

  // ARIA ラベルの決定
  const getAriaLabel = () => {
    switch (theme) {
      case 'light':
        return 'ライトモード（クリックでダークモードに切り替え）';
      case 'dark':
        return 'ダークモード（クリックでシステム設定に切り替え）';
      case 'system':
        return `システム設定（現在: ${effectiveTheme === 'dark' ? 'ダーク' : 'ライト'}、クリックでライトモードに切り替え）`;
      default:
        return 'テーマを切り替える';
    }
  };

  // SSR中は何も表示しない
  if (!mounted) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  const themeIcon = getThemeIcon();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${className}`}
      aria-label={getAriaLabel()}
    >
      {themeIcon === 'moon' ? (
        // ダークモード - 月のアイコン
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : themeIcon === 'computer' ? (
        // システム設定 - コンピューター/ディスプレイのアイコン
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 1 1.1 1.677A.75.75 0 0 1 13.26 18H8.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 1 9.355 15H4.25A2.25 2.25 0 0 1 2 12.75V4.25ZM4.25 3.5c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75h11.5c.414 0 .75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75H4.25Z" clipRule="evenodd" />
        </svg>
      ) : (
        // ライトモード - 太陽のアイコン
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
