---
title: "CSS Grid Layout実践テクニック"
description: "CSS Grid Layoutを使用した実践的なレイアウトテクニックとデザインパターンを紹介します。"
pubDate: 2024-01-19
heroImage: "/images/css-grid.jpg"
tags: ["CSS", "Grid", "レイアウト", "フロントエンド"]
category: "Web開発"
draft: false
---

# CSS Grid Layout実践テクニック

CSS Grid Layoutは、2次元のレイアウトシステムとして非常に強力なツールです。この記事では、実用的なテクニックを紹介します。

## 基本的なGrid設定

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  min-height: 100vh;
}
```

## レスポンシブなカードレイアウト

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
```

## Holy Grail Layout

```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main ads"
    "footer footer footer";
  grid-template-columns: 200px 1fr 150px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.ads { grid-area: ads; }
.footer { grid-area: footer; }
```

## 複雑なマガジンレイアウト

```css
.magazine-layout {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 200px;
  gap: 1rem;
}

.article-1 {
  grid-column: 1 / 4;
  grid-row: 1 / 3;
}

.article-2 {
  grid-column: 4 / 7;
  grid-row: 1 / 2;
}

.article-3 {
  grid-column: 4 / 7;
  grid-row: 2 / 3;
}
```

## アニメーション効果

```css
.grid-item {
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
```

## 実用的なTips

1. **auto-fit vs auto-fill**: レスポンシブグリッドでの使い分け
2. **subgrid**: ネストしたグリッドアイテムの整列
3. **grid-area**: 名前付きエリアでの直感的なレイアウト

CSS Grid Layoutをマスターすることで、従来のFloatやFlexboxでは困難だった複雑なレイアウトも簡潔に実装できるようになります。 