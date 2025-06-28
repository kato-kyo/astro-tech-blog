---
title: "Next.js アプリ最適化テクニック"
description: "Next.jsアプリケーションのパフォーマンス最適化、SEO改善、ビルド時間短縮の実践的な手法を解説します。"
pubDate: 2024-01-13
heroImage: "/images/nextjs-optimization.jpg"
tags: ["Next.js", "React", "パフォーマンス", "最適化"]
category: "Web開発"
draft: false
---

# Next.js アプリ最適化テクニック

Next.jsアプリケーションを最適化するための実践的な手法を紹介します。

## 動的インポート

```jsx
import dynamic from 'next/dynamic';

// 遅延読み込みコンポーネント
const DynamicComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

// 条件付き読み込み
const AdminPanel = dynamic(() => import('../components/AdminPanel'), {
  ssr: false
});

function Dashboard({ user }) {
  return (
    <div>
      <h1>ダッシュボード</h1>
      {user.isAdmin && <AdminPanel />}
      <DynamicComponent />
    </div>
  );
}
```

## 画像最適化

```jsx
import Image from 'next/image';

function OptimizedImages() {
  return (
    <div>
      {/* 最適化された画像 */}
      <Image
        src="/hero-image.jpg"
        alt="Hero Image"
        width={1200}
        height={600}
        priority={true}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />
      
      {/* レスポンシブ画像 */}
      <Image
        src="/product.jpg"
        alt="Product"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
```

## フォント最適化

```jsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
});

export default function Layout({ children }) {
  return (
    <html lang="ja" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```

## ISR (Incremental Static Regeneration)

```jsx
// pages/posts/[slug].js
export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: {
      post,
    },
    revalidate: 3600, // 1時間ごとに再生成
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: 'blocking', // 新しいページを動的生成
  };
}
```

## API ルート最適化

```js
// pages/api/posts/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  
  // リクエストメソッドで分岐
  switch (req.method) {
    case 'GET':
      try {
        const post = await getPost(id);
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        
        // キャッシュヘッダー設定
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(post);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
      break;
      
    case 'PUT':
      // 更新処理
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## ミドルウェア活用

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // 地域別リダイレクト
  const country = request.geo?.country || 'US';
  
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${country.toLowerCase()}`, request.url));
  }
  
  // 認証チェック
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Bundle Analyzer

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  swcMinify: true,
});
```

## Lighthouse CI設定

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

## Core Web Vitals最適化

```jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  
  // Navigator APIまたはfetch APIを使用
  if ('sendBeacon' in navigator) {
    navigator.sendBeacon('/api/analytics', body);
  } else {
    fetch('/api/analytics', { body, method: 'POST', keepalive: true });
  }
}

// メトリクス収集
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

これらの最適化手法により、Next.jsアプリケーションの性能を大幅に改善できます。 