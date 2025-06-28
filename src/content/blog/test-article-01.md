---
title: "React Hooks完全ガイド"
description: "React HooksのuseState、useEffect、useContextなどの基本的な使い方から応用まで詳しく解説します。"
pubDate: 2024-01-20
heroImage: "/images/react-hooks.jpg"
tags: ["React", "JavaScript", "Hooks", "フロントエンド"]
category: "Web開発"
draft: false
---

# React Hooks完全ガイド

React Hooksは、関数コンポーネントでstate管理や副作用を扱うための仕組みです。この記事では、主要なHooksの使い方を詳しく解説します。

## useState - 状態管理

useStateは最も基本的なHookで、関数コンポーネントに状態を追加できます。

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        増加
      </button>
    </div>
  );
}
```

## useEffect - 副作用の処理

useEffectは、コンポーネントのレンダリング後に実行される副作用を定義します。

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>経過時間: {seconds}秒</div>;
}
```

## useContext - コンテキストの利用

useContextを使用すると、コンポーネント間でデータを共有できます。

```jsx
import React, { useContext, createContext } from 'react';

const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  return <header className={theme}>ヘッダー</header>;
}
```

## カスタムHooks

独自のHooksを作成して、ロジックを再利用可能にできます。

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

## まとめ

React Hooksを活用することで、関数コンポーネントでも柔軟な状態管理と副作用の処理が可能になります。適切に使い分けることで、より保守性の高いReactアプリケーションを構築できます。 