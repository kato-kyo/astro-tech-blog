---
title: "Redis実践活用ガイド"
description: "Redisの基本機能からパフォーマンス最適化、高可用性構成まで、実際のプロダクション環境での活用方法を詳しく解説します。"
pubDate: 2024-01-08
heroImage: "/images/redis-guide.jpg"
tags: ["Redis", "キャッシュ", "NoSQL", "パフォーマンス"]
category: "データベース"
draft: false
---

# Redis実践活用ガイド

Redisの様々な機能とプロダクション環境での実践的な活用方法を解説します。

## 基本的なデータ構造

```javascript
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  password: 'your-password',
  db: 0
});

// 文字列操作
await client.set('user:1001:name', 'John Doe');
await client.setEx('session:abc123', 3600, 'user-data'); // 1時間で期限切れ
const name = await client.get('user:1001:name');

// カウンター
await client.incr('page-views');
await client.incrBy('downloads', 10);
const views = await client.get('page-views');

// ハッシュ
await client.hSet('user:1001', {
  name: 'John Doe',
  email: 'john@example.com',
  age: '30'
});
const user = await client.hGetAll('user:1001');
await client.hIncr('user:1001', 'login-count', 1);
```

## リスト操作とキューイング

```javascript
// リスト操作
await client.lPush('tasks', 'task-1', 'task-2', 'task-3');
await client.rPush('logs', new Date().toISOString() + ': User logged in');

// キューとしての使用
const task = await client.blPop('tasks', 10); // 10秒でタイムアウト
if (task) {
  console.log('Processing task:', task.element);
  // タスク処理
  await processTask(task.element);
}

// 最近のアクティビティ管理
await client.lPush('user:1001:activity', 'login');
await client.lTrim('user:1001:activity', 0, 99); // 最新100件のみ保持

// リーダーボード
await client.zAdd('leaderboard', { score: 1000, value: 'player1' });
await client.zAdd('leaderboard', { score: 1500, value: 'player2' });
const topPlayers = await client.zRevRange('leaderboard', 0, 9, { withScores: true });
```

## Pub/Sub メッセージング

```javascript
// パブリッシャー
const publisher = redis.createClient();

async function publishMessage(channel, message) {
  await publisher.publish(channel, JSON.stringify(message));
}

// サブスクライバー
const subscriber = redis.createClient();

subscriber.on('message', (channel, message) => {
  const data = JSON.parse(message);
  console.log(`Received message on ${channel}:`, data);
  
  switch (channel) {
    case 'user-events':
      handleUserEvent(data);
      break;
    case 'notifications':
      sendNotification(data);
      break;
  }
});

await subscriber.subscribe('user-events', 'notifications');

// パターンサブスクリプション
await subscriber.pSubscribe('user:*:activity');
```

## セッション管理

```javascript
class SessionManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.prefix = 'session:';
    this.defaultTTL = 3600; // 1時間
  }

  async createSession(userId, sessionData) {
    const sessionId = this.generateSessionId();
    const key = this.prefix + sessionId;
    
    const session = {
      userId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ...sessionData
    };
    
    await this.redis.setEx(key, this.defaultTTL, JSON.stringify(session));
    return sessionId;
  }

  async getSession(sessionId) {
    const key = this.prefix + sessionId;
    const sessionData = await this.redis.get(key);
    
    if (!sessionData) {
      return null;
    }
    
    const session = JSON.parse(sessionData);
    
    // 最終アクティビティ時間を更新
    session.lastActivity = Date.now();
    await this.redis.setEx(key, this.defaultTTL, JSON.stringify(session));
    
    return session;
  }

  async destroySession(sessionId) {
    const key = this.prefix + sessionId;
    await this.redis.del(key);
  }

  async refreshSession(sessionId, newTTL = this.defaultTTL) {
    const key = this.prefix + sessionId;
    await this.redis.expire(key, newTTL);
  }

  generateSessionId() {
    return require('crypto').randomBytes(32).toString('hex');
  }
}
```

## キャッシュ戦略

```javascript
class CacheManager {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  // Read-Through キャッシュ
  async get(key, fetchFunction, ttl = 3600) {
    let value = await this.redis.get(key);
    
    if (value === null) {
      // キャッシュミス時のデータ取得
      value = await fetchFunction();
      if (value !== null) {
        await this.redis.setEx(key, ttl, JSON.stringify(value));
      }
    } else {
      value = JSON.parse(value);
    }
    
    return value;
  }

  // Write-Through キャッシュ
  async set(key, value, ttl = 3600) {
    // データベースに書き込み
    await this.writeToDatabase(key, value);
    
    // キャッシュに保存
    await this.redis.setEx(key, ttl, JSON.stringify(value));
  }

  // Write-Behind キャッシュ
  async setDeferred(key, value, ttl = 3600) {
    // 即座にキャッシュに保存
    await this.redis.setEx(key, ttl, JSON.stringify(value));
    
    // データベース書き込みをキューに追加
    await this.redis.lPush('write-queue', JSON.stringify({ key, value }));
  }

  // キャッシュ無効化
  async invalidate(pattern) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // バルク操作
  async mget(keys) {
    const values = await this.redis.mGet(keys);
    return values.map(value => value ? JSON.parse(value) : null);
  }

  async mset(keyValuePairs, ttl = 3600) {
    const pipeline = this.redis.multi();
    
    for (const [key, value] of keyValuePairs) {
      pipeline.setEx(key, ttl, JSON.stringify(value));
    }
    
    await pipeline.exec();
  }
}
```

## レート制限

```javascript
class RateLimiter {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  // スライディングウィンドウログ
  async checkLimit(identifier, limit, windowMs) {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const cutoff = now - windowMs;

    // 古いエントリを削除
    await this.redis.zRemRangeByScore(key, 0, cutoff);

    // 現在のカウントを取得
    const current = await this.redis.zCard(key);

    if (current >= limit) {
      return {
        allowed: false,
        current,
        remaining: 0,
        resetTime: await this.getResetTime(key, windowMs)
      };
    }

    // 新しいリクエストを記録
    await this.redis.zAdd(key, { score: now, value: `${now}-${Math.random()}` });
    await this.redis.expire(key, Math.ceil(windowMs / 1000));

    return {
      allowed: true,
      current: current + 1,
      remaining: limit - current - 1,
      resetTime: now + windowMs
    };
  }

  // トークンバケット方式
  async checkTokenBucket(identifier, capacity, refillRate, tokensRequested = 1) {
    const key = `bucket:${identifier}`;
    const now = Date.now();

    const bucket = await this.redis.hGetAll(key);
    let tokens = parseFloat(bucket.tokens) || capacity;
    let lastRefill = parseInt(bucket.lastRefill) || now;

    // トークンの補充
    const timePassed = now - lastRefill;
    const tokensToAdd = (timePassed / 1000) * refillRate;
    tokens = Math.min(capacity, tokens + tokensToAdd);

    if (tokens >= tokensRequested) {
      tokens -= tokensRequested;
      
      await this.redis.hSet(key, {
        tokens: tokens.toString(),
        lastRefill: now.toString()
      });
      await this.redis.expire(key, 3600);

      return { allowed: true, tokens };
    }

    return { allowed: false, tokens };
  }

  async getResetTime(key, windowMs) {
    const oldest = await this.redis.zRange(key, 0, 0, { withScores: true });
    if (oldest.length > 0) {
      return oldest[0].score + windowMs;
    }
    return Date.now() + windowMs;
  }
}
```

## 高可用性とクラスタリング

```javascript
// Redis Sentinel設定
const redis = require('redis');

const sentinelClient = redis.createClient({
  sentinels: [
    { host: 'sentinel1', port: 26379 },
    { host: 'sentinel2', port: 26379 },
    { host: 'sentinel3', port: 26379 }
  ],
  name: 'mymaster',
  role: 'master'
});

// Redis Cluster設定
const clusterClient = redis.createCluster({
  rootNodes: [
    { url: 'redis://cluster-node1:7000' },
    { url: 'redis://cluster-node2:7001' },
    { url: 'redis://cluster-node3:7002' }
  ],
  defaults: {
    password: 'your-password'
  }
});

// 接続エラーハンドリング
sentinelClient.on('error', (err) => {
  console.error('Redis Sentinel error:', err);
});

sentinelClient.on('reconnecting', () => {
  console.log('Redis Sentinel reconnecting...');
});

clusterClient.on('error', (err) => {
  console.error('Redis Cluster error:', err);
});
```

## 監視とメトリクス

```javascript
class RedisMonitor {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async getInfo() {
    const info = await this.redis.info();
    const lines = info.split('\r\n');
    const result = {};

    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    });

    return result;
  }

  async getMemoryUsage() {
    const info = await this.getInfo();
    return {
      usedMemory: parseInt(info.used_memory),
      usedMemoryHuman: info.used_memory_human,
      usedMemoryPeak: parseInt(info.used_memory_peak),
      usedMemoryPeakHuman: info.used_memory_peak_human,
      memoryFragmentationRatio: parseFloat(info.mem_fragmentation_ratio)
    };
  }

  async getConnectionStats() {
    const info = await this.getInfo();
    return {
      connectedClients: parseInt(info.connected_clients),
      totalConnectionsReceived: parseInt(info.total_connections_received),
      rejectedConnections: parseInt(info.rejected_connections)
    };
  }

  async getCommandStats() {
    const info = await this.getInfo();
    return {
      totalCommandsProcessed: parseInt(info.total_commands_processed),
      instantaneousOpsPerSec: parseInt(info.instantaneous_ops_per_sec)
    };
  }

  async checkHealth() {
    try {
      const pong = await this.redis.ping();
      const info = await this.getInfo();
      
      return {
        status: pong === 'PONG' ? 'healthy' : 'unhealthy',
        uptime: parseInt(info.uptime_in_seconds),
        version: info.redis_version
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}
```

Redisを適切に活用することで、アプリケーションのパフォーマンスと拡張性を大幅に向上させることができます。 