# 推奨コマンド

## 開発コマンド
```bash
npm run dev        # 開発サーバー起動（localhost:4321）
npm run build      # 本番用ビルド（dist/フォルダに出力）
npm run preview    # ビルド結果のプレビュー
```

## コード品質チェック
```bash
npm run lint           # ESLintでコードチェック
npm run lint:fix       # ESLintでコードチェックと自動修正
npm run format         # Prettierでコードフォーマット
npm run format:check   # Prettierでフォーマットチェック
npm run check          # lintとformat:checkを両方実行
```

## 基本コマンド
```bash
npm install       # 依存関係をインストール
npm run astro     # Astro CLIコマンド実行
```

## Gitコマンド（Darwin用）
```bash
git status        # 変更状況確認
git add .         # 全変更をステージング
git commit -m     # コミット
git push          # プッシュ
git pull          # プル
```

## 検索機能テスト用
```bash
npm run build && npm run preview  # 検索機能テスト（ビルド→プレビュー）
```

**重要**: 検索機能は開発環境（npm run dev）では動作しません。検索機能をテストする際は必ずbuild→previewの手順で確認してください。