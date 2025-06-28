---
title: "Docker コンテナ運用のベストプラクティス"
description: "本番環境でのDockerコンテナ運用におけるセキュリティ、パフォーマンス、監視のベストプラクティスを解説します。"
pubDate: 2024-01-17
heroImage: "/images/docker-best-practices.jpg"
tags: ["Docker", "DevOps", "コンテナ", "インフラ"]
category: "インフラ"
draft: false
---

# Docker コンテナ運用のベストプラクティス

本番環境でDockerコンテナを運用する際の重要なポイントを解説します。

## セキュリティ対策

### 最小権限の原則

```dockerfile
# 非rootユーザーでの実行
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

WORKDIR /app
COPY --chown=nextjs:nodejs . .

CMD ["npm", "start"]
```

### セキュリティスキャン

```bash
# 脆弱性スキャン
docker scan my-app:latest

# Trivyを使用したスキャン
trivy image my-app:latest
```

## イメージ最適化

```dockerfile
# マルチステージビルド
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## ヘルスチェック設定

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

## リソース制限

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    image: my-app:latest
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## ログ管理

```javascript
// 構造化ログ
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

logger.info('Application started', {
  port: 3000,
  environment: process.env.NODE_ENV
});
```

## 監視とメトリクス

```yaml
# Prometheus設定
version: '3.8'
services:
  app:
    image: my-app:latest
    labels:
      - "prometheus.io/scrape=true"
      - "prometheus.io/port=3000"
      - "prometheus.io/path=/metrics"
```

## 機密情報管理

```yaml
# Docker Secrets使用例
version: '3.8'
services:
  app:
    image: my-app:latest
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    external: true
  api_key:
    external: true
```

## 継続的デプロイメント

```yaml
# GitHub Actions
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push Docker image
        run: |
          docker build -t my-app:${{ github.sha }} .
          docker push my-app:${{ github.sha }}
      
      - name: Deploy to production
        run: |
          kubectl set image deployment/my-app app=my-app:${{ github.sha }}
```

これらのベストプラクティスに従うことで、安全で効率的なコンテナ運用が可能になります。 