---
title: "GitHub Actions CI/CD パイプライン構築"
description: "GitHub Actionsを使用した継続的インテグレーション・デプロイメントパイプラインの設計と実装方法を詳しく解説します。"
pubDate: 2024-01-09
heroImage: "/images/github-actions-cicd.jpg"
tags: ["GitHub Actions", "CI/CD", "DevOps", "自動化"]
category: "DevOps"
draft: false
---

# GitHub Actions CI/CD パイプライン構築

GitHub Actionsを活用した効率的なCI/CDパイプラインの構築方法を解説します。

## 基本的なワークフロー

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run tests
        run: npm run test:coverage
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## マルチステージビルド

```yaml
# .github/workflows/build-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
      image-uri: ${{ steps.build.outputs.image-uri }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            
      - name: Build and push
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  security-scan:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build.outputs.image-uri }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

## 環境別デプロイメント

```yaml
# .github/workflows/deploy.yml
name: Deploy to Environments

on:
  workflow_run:
    workflows: ["Build and Deploy"]
    types: [completed]
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    environment: staging
    
    steps:
      - name: Deploy to Staging
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/staging/deployment.yaml
            k8s/staging/service.yaml
          images: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          kubectl-version: 'latest'

  integration-tests:
    runs-on: ubuntu-latest
    needs: deploy-staging
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Run integration tests
        run: |
          npm install
          npm run test:integration
        env:
          API_BASE_URL: https://staging.example.com

  deploy-production:
    runs-on: ubuntu-latest
    needs: [deploy-staging, integration-tests]
    environment: production
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to Production
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/production/deployment.yaml
            k8s/production/service.yaml
          images: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          kubectl-version: 'latest'
```

## セキュリティとコード品質

```yaml
# .github/workflows/security.yml
name: Security and Quality Checks

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1' # 毎週月曜日 2:00 AM

jobs:
  codeql-analysis:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript
          
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2
        
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  dependency-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Dependency Review
        uses: actions/dependency-review-action@v3

  sonarcloud:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests with coverage
        run: npm run test:coverage
        
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## パフォーマンス監視

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse-ci:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  load-testing:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Run k6 load test
        uses: grafana/k6-action@v0.2.0
        with:
          filename: tests/load/script.js
        env:
          K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
```

## 再利用可能なワークフロー

```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deployment Workflow

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image-tag:
        required: true
        type: string
      kubectl-version:
        required: false
        type: string
        default: 'latest'
    secrets:
      kubeconfig:
        required: true
      registry-password:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: ${{ inputs.kubectl-version }}
          
      - name: Setup kubeconfig
        run: |
          echo "${{ secrets.kubeconfig }}" | base64 -d > kubeconfig
          echo "KUBECONFIG=$(pwd)/kubeconfig" >> $GITHUB_ENV
          
      - name: Deploy application
        run: |
          envsubst < k8s/${{ inputs.environment }}/deployment.yaml | kubectl apply -f -
          kubectl set image deployment/app app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ inputs.image-tag }}
          kubectl rollout status deployment/app --timeout=300s

# 使用例
# .github/workflows/main.yml
name: Main Workflow

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image-tag: ${{ github.sha }}
    secrets:
      kubeconfig: ${{ secrets.STAGING_KUBECONFIG }}
      registry-password: ${{ secrets.GITHUB_TOKEN }}
```

## 条件付き実行とマトリックス

```yaml
# .github/workflows/conditional.yml
name: Conditional Workflows

on:
  push:
    paths:
      - 'src/**'
      - 'package*.json'
      - '.github/workflows/**'

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      frontend-changed: ${{ steps.changes.outputs.frontend }}
      backend-changed: ${{ steps.changes.outputs.backend }}
      docs-changed: ${{ steps.changes.outputs.docs }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Detect changes
        uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            frontend:
              - 'frontend/**'
              - 'shared/**'
            backend:
              - 'backend/**'
              - 'shared/**'
            docs:
              - 'docs/**'
              - '*.md'

  test-frontend:
    runs-on: ubuntu-latest
    needs: detect-changes
    if: needs.detect-changes.outputs.frontend-changed == 'true'
    
    strategy:
      matrix:
        browser: [chrome, firefox, safari]
        
    steps:
      - name: Test Frontend on ${{ matrix.browser }}
        run: npm run test:e2e -- --browser=${{ matrix.browser }}

  test-backend:
    runs-on: ubuntu-latest
    needs: detect-changes
    if: needs.detect-changes.outputs.backend-changed == 'true'
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Test Backend
        run: npm run test:backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
```

これらのGitHub Actionsワークフローにより、堅牢で効率的なCI/CDパイプラインを構築できます。 