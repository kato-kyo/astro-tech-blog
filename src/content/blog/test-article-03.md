---
title: "Node.jsパフォーマンス最適化"
description: "Node.jsアプリケーションのパフォーマンス最適化手法とベストプラクティスを詳しく解説します。"
pubDate: 2024-01-18
heroImage: "/images/nodejs-performance.jpg"
tags: ["Node.js", "パフォーマンス", "バックエンド", "最適化"]
category: "バックエンド"
draft: false
---

# Node.jsパフォーマンス最適化

Node.jsアプリケーションのパフォーマンスを向上させるための手法を紹介します。

## イベントループの理解

Node.jsはシングルスレッドのイベントループで動作します。

```javascript
// 非同期処理の適切な使用
const fs = require('fs').promises;

async function readMultipleFiles() {
  try {
    const [file1, file2, file3] = await Promise.all([
      fs.readFile('file1.txt', 'utf8'),
      fs.readFile('file2.txt', 'utf8'),
      fs.readFile('file3.txt', 'utf8')
    ]);
    
    return { file1, file2, file3 };
  } catch (error) {
    console.error('Error reading files:', error);
  }
}
```

## メモリ使用量の最適化

```javascript
// ストリームを使用した大容量ファイル処理
const fs = require('fs');
const readline = require('readline');

async function processLargeFile(filename) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // 各行を処理
    processLine(line);
  }
}
```

## データベース最適化

```javascript
// コネクションプール設定
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test',
  connectionLimit: 10,
  queueLimit: 0
});

// 効率的なクエリ実行
async function getUsersWithPagination(page, limit) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.execute(
    'SELECT * FROM users LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows;
}
```

## キャッシング戦略

```javascript
const Redis = require('redis');
const client = Redis.createClient();

class CacheService {
  static async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key, value, ttl = 3600) {
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}
```

## プロファイリングツール

```javascript
// パフォーマンス測定
console.time('operation');
await heavyOperation();
console.timeEnd('operation');

// メモリ使用量監視
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log('Memory usage:', {
    rss: `${Math.round(memUsage.rss / 1024 / 1024 * 100) / 100} MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`
  });
}, 5000);
```

## クラスタリング

```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  require('./app.js');
}
```

適切な最適化により、Node.jsアプリケーションのパフォーマンスを大幅に改善できます。 