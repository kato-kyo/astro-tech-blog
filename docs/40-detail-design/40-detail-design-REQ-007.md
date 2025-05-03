# 詳細設計書 - REQ-007: ダークモード機能

## 1. 概要

### 1.1 要件概要
- **要件ID**: REQ-007
- **要件名**: ダークモード機能
- **概要**: ライト/ダークテーマの切り替え機能
- **優先度**: High
- **実装状況**: 🟡 部分完了（システム設定対応・永続化未実装）

### 1.2 機能詳細
- システム設定に対応したテーマ自動切り替え
- 手動でのテーマ切り替え
- 設定の永続化（localStorage）
- 全ページでの一貫したテーマ適用

## 2. アーキテクチャ設計

### 2.1 システム構成図

```mermaid
graph TB
    A[ダークモードシステム] --> B[ThemeToggle Component]
    A --> C[テーマ管理システム]
    A --> D[CSS Dark Mode]
    
    B --> E[テーマ切り替えボタン]
    B --> F[状態表示アイコン]
    B --> G[ハイドレーション対応]
    
    C --> H[システム設定検出]
    C --> I[LocalStorage永続化]
    C --> J[DOM class管理]
    
    D --> K[TailwindCSS dark:]
    D --> L[CSS Variables]
    D --> M[メディアクエリ]
    
    E --> N[ライト→ダーク切り替え]
    E --> O[ダーク→ライト切り替え]
    
    H --> P[prefers-color-scheme]
    I --> Q[theme設定保存]
    J --> R[html.dark class]
    
    K --> S[ダークモード専用スタイル]
    L --> T[カラーテーマ変数]
    M --> U[@media (prefers-color-scheme)]
```

### 2.2 テーマ状態管理

```
【テーマ状態の流れ】
1. ページ読み込み
   ↓
2. テーマ設定確認
   ├─ LocalStorage確認
   ├─ システム設定確認
   └─ デフォルト（ライト）
   ↓
3. html要素にclass適用
   ├─ .dark → ダークモード
   └─ class無し → ライトモード
   ↓
4. CSS適用
   ├─ dark:text-white
   └─ text-black
   ↓
5. React状態同期
   ├─ ThemeToggleの表示更新
   └─ アイコン切り替え
```

## 3. 実装設計

### 3.1 BaseLayout でのテーマ初期化

**ファイルパス**: `src/layouts/BaseLayout.astro`

**テーマ初期化スクリプト**:
```html
<script is:inline>
  // Theme handling
  const getThemePreference = () => {
    if (
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('theme')
    ) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');

  if (typeof localStorage !== 'undefined') {
    const observer = new MutationObserver(mutations => {
      // class属性の変更のみを処理
      const classChanges = mutations.filter(
        mutation =>
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
      );

      if (classChanges.length > 0) {
        const darkThemeSelected =
          document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', darkThemeSelected ? 'dark' : 'light');
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
</script>
```

**重要な設計ポイント**:
- `is:inline`: サーバーサイドでインライン展開（フラッシュ防止）
- `MutationObserver`: DOM変更の監視とLocalStorage同期
- フォールバック: LocalStorage無効時の対応

### 3.2 ThemeToggle Component

**ファイルパス**: `src/components/react/ThemeToggle.tsx`

**基本実装**:
```typescript
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 初期テーマの確認
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    // テーマ変更の監視
    const observer = new MutationObserver(() => {
      const currentIsDark = document.documentElement.classList.contains('dark');
      setIsDark(currentIsDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (mounted) {
      document.documentElement.classList.toggle('dark');
    }
  };

  // SSR中は何も表示しない
  if (!mounted) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${className}`}
      aria-label="テーマを切り替える"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
```

**実装上の課題**:
1. **システム設定対応未実装**: `prefers-color-scheme` の自動反映
2. **永続化未実装**: LocalStorage への設定保存
3. **初期フラッシュ**: ハイドレーション時の一瞬の表示切り替え

## 4. CSS設計

### 4.1 TailwindCSS Dark Mode設定

**tailwind.config.mjs**:
```javascript
export default {
  darkMode: 'class', // html.dark クラスでダークモード切り替え
  theme: {
    extend: {
      colors: {
        primary: {
          // カスタムカラーパレット
          50: '#fdfcfd',
          100: '#f8f4f7',
          // ...
          900: '#3b1732',
          950: '#1f0c1a',
        },
        gray: {
          // グレーカラーの調整
          50: '#f9fafb',
          100: '#f3f4f6',
          // ...
          900: '#111827',
        },
      },
    },
  },
}
```

### 4.2 ダークモード対応スタイル例

**基本的な使用パターン**:
```css
/* 背景色 */
.bg-white.dark\\:bg-gray-900 {
  background-color: white;
}

.dark .bg-white.dark\\:bg-gray-900 {
  background-color: #111827;
}

/* テキスト色 */
.text-gray-900.dark\\:text-gray-100 {
  color: #111827;
}

.dark .text-gray-900.dark\\:text-gray-100 {
  color: #f3f4f6;
}

/* ボーダー */
.border-gray-200.dark\\:border-gray-700 {
  border-color: #e5e7eb;
}

.dark .border-gray-200.dark\\:border-gray-700 {
  border-color: #374151;
}
```

### 4.3 コンポーネント別ダークモード対応

**Header**:
```jsx
<header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
```

**BlogCard**:
```jsx
<article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <h2 className="text-gray-900 dark:text-white">タイトル</h2>
  <p className="text-gray-600 dark:text-gray-300">説明</p>
</article>
```

**Footer**:
```jsx
<footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
```

## 5. 未実装機能の設計

### 5.1 システム設定対応 (TASK-019)

**実装予定機能**:
```typescript
// 拡張版 getThemePreference
const getThemePreference = (): 'light' | 'dark' | 'system' => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  }
  return 'system'; // デフォルトはシステム設定に従う
};

const getEffectiveTheme = (preference: string): 'light' | 'dark' => {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }
  return preference as 'light' | 'dark';
};
```

**メディアクエリ監視**:
```typescript
// システム設定変更の監視
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    const preference = getThemePreference();
    if (preference === 'system') {
      setIsDark(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

### 5.2 LocalStorage永続化 (TASK-020)

**実装予定機能**:
```typescript
const saveTheme = (theme: 'light' | 'dark' | 'system') => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};

const toggleTheme = () => {
  const currentTheme = getThemePreference();
  let newTheme: 'light' | 'dark' | 'system';
  
  // 3つの状態をサイクル: light → dark → system → light
  switch (currentTheme) {
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
  
  saveTheme(newTheme);
  const effectiveTheme = getEffectiveTheme(newTheme);
  document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
};
```

### 5.3 3状態テーマセレクター

**UI拡張版**:
```jsx
const ThemeSelector = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  return (
    <div className="theme-selector">
      <button onClick={() => handleThemeChange('light')}>
        <SunIcon />
        ライト
      </button>
      <button onClick={() => handleThemeChange('dark')}>
        <MoonIcon />
        ダーク
      </button>
      <button onClick={() => handleThemeChange('system')}>
        <ComputerIcon />
        システム
      </button>
    </div>
  );
};
```

## 6. パフォーマンス設計

### 6.1 フラッシュ防止

**CSS-in-JS回避**:
```html
<!-- インラインスクリプトでフラッシュ防止 -->
<script is:inline>
  const theme = localStorage.getItem('theme') || 'system';
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
</script>
```

### 6.2 ハイドレーション最適化

**SSR対応**:
```jsx
// ハイドレーション前は空の領域を表示
if (!mounted) {
  return <div className={`w-10 h-10 ${className}`} />;
}
```

## 7. アクセシビリティ設計

### 7.1 スクリーンリーダー対応

**ARIA属性**:
```jsx
<button
  type="button"
  onClick={toggleTheme}
  aria-label={`現在のテーマ: ${isDark ? 'ダーク' : 'ライト'}モード。クリックで切り替え`}
  aria-pressed={isDark}
>
```

### 7.2 キーボード操作

**フォーカス管理**:
```css
.theme-toggle:focus {
  outline: 2px solid #a06d95;
  outline-offset: 2px;
}

.theme-toggle:focus-visible {
  box-shadow: 0 0 0 3px rgba(160, 109, 149, 0.1);
}
```

## 8. デザインシステム統合

### 8.1 カラーパレット管理

**CSS変数による管理**:
```css
:root {
  --color-primary: #a06d95;
  --color-background: #ffffff;
  --color-text: #111827;
  --color-border: #e5e7eb;
}

.dark {
  --color-background: #111827;
  --color-text: #f3f4f6;
  --color-border: #374151;
}

.bg-background {
  background-color: var(--color-background);
}

.text-primary {
  color: var(--color-text);
}
```

### 8.2 コンポーネント統一設計

**ダークモード対応ガイドライン**:
```typescript
// 基本パターン
const baseClasses = "bg-white dark:bg-gray-800 text-gray-900 dark:text-white";
const borderClasses = "border border-gray-200 dark:border-gray-700";
const hoverClasses = "hover:bg-gray-50 dark:hover:bg-gray-700";

// 使用例
<div className={`${baseClasses} ${borderClasses} ${hoverClasses}`}>
  コンテンツ
</div>
```

## 9. 今後の拡張計画

### 9.1 TASK-019: システム設定対応実装

**実装スコープ**:
- `prefers-color-scheme` メディアクエリ対応
- システム設定変更の動的監視
- 3状態テーマ管理（light/dark/system）

### 9.2 TASK-020: 設定永続化実装

**実装スコープ**:
- LocalStorage での設定保存
- 設定読み込み時のエラーハンドリング
- ブラウザ間での設定同期

### 9.3 高度なテーマ機能

**将来実装予定**:
- **カスタムカラーテーマ**: ユーザー定義カラー
- **時間帯自動切り替え**: 日の出・日の入りに連動
- **アニメーション**: テーマ切り替え時のスムーズな遷移
- **プリセットテーマ**: 複数のカラーバリエーション

**自動切り替え実装例**:
```typescript
const getTimeBasedTheme = (): 'light' | 'dark' => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
};

// 時間ベース + システム設定の組み合わせ
const getAutoTheme = (): 'light' | 'dark' => {
  const preference = getThemePreference();
  
  switch (preference) {
    case 'auto-time':
      return getTimeBasedTheme();
    case 'auto-system':
      return getSystemTheme();
    default:
      return preference;
  }
};
```

---

**文書作成日**: 2025-01-15  
**最終更新日**: 2025-01-15  
**作成者**: システム設計書自動生成  
**バージョン**: 1.0  
**関連文書**: 10-requirements.md, 20-basic-design.md, 30-todo-list.md