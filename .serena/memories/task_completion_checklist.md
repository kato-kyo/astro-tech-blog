# タスク完了時のチェックリスト

## 必須実行コマンド
タスク完了後は以下のコマンドを**必ず**実行してコードの品質を確認：

```bash
npm run check    # lint + format:check を両方実行
```

または個別に：
```bash
npm run lint           # ESLintでコードチェック
npm run format:check   # Prettierでフォーマットチェック
```

## エラー修正
エラーが発生した場合：
```bash
npm run lint:fix    # ESLint自動修正
npm run format      # Prettier自動フォーマット
```

## 検索機能の動作確認
記事やコンテンツを変更した場合：
```bash
npm run build       # 検索インデックス再生成
npm run preview     # 検索機能テスト
```

## コミット前チェック
- [ ] `npm run check` でエラーなし
- [ ] TypeScriptコンパイルエラーなし
- [ ] 検索機能動作確認（記事変更時）
- [ ] レスポンシブデザイン確認
- [ ] ダークモード動作確認

## 重要な注意点
- **UI/UXデザインの変更禁止**: レイアウト、色、フォント、間隔の変更は事前承認必須
- **技術スタックバージョン変更禁止**: 明示的な指示なしにバージョン変更しない
- **@apply ディレクティブ禁止**: Tailwindはユーティリティクラスのみ使用