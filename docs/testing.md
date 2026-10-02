# Testing

テストは対象の責務に合わせて実行環境を分けます。Componentでは局所的な描画、状態遷移、アクセシビリティを、E2Eではそれらを統合した重要な利用者フローを確認します。同じ目的のアサーションを複数の階層へ重複して持たせません。

| 対象      | 実行環境               | 責務                         |
| --------- | ---------------------- | ---------------------------- |
| Unit      | VitestのNode環境       | 純粋関数とZodスキーマ        |
| Component | StorybookとChromium    | 描画、操作、アクセシビリティ |
| E2E       | Playwrightと本番ビルド | 重要な利用者フロー           |

## UnitとComponent

Vitestは`unit`と`storybook`の2プロジェクトで構成しています。`pnpm test:unit`はNode環境で`src/**/*.test.ts(x)`を実行し、現在はTaskのZodスキーマを検査します。

コンポーネントテストの実行環境は`@storybook/nextjs-vite`、Vitest Browser Mode、PlaywrightのChromiumです。jsdomとhappy-domは導入していません。

すべてのStoryを描画テストとして実行し、操作に意味があるStoryだけに`play`を追加します。Dialogではキーボード操作とフォーカス移動、Task機能では追加、完了状態の切り替え、削除、削除失敗を確認します。

`@storybook/addon-a11y`で検出した違反はテスト失敗です。自動検査だけでは保証できないため、名前、状態、キーボード操作、フォーカス順は操作テストでも確認してください。snapshot testは標準では使いません。

## E2E

Playwrightは`pnpm start`で起動した本番ビルドへ接続します。既存の3000番ポートは再利用しません。

| プロジェクト       | 画面サイズ                |
| ------------------ | ------------------------- |
| `chromium-desktop` | 1440 × 900                |
| `chromium-mobile`  | 390 × 844、タッチ操作あり |

ローカルでは再試行せず、CIのみ1回再試行します。失敗時はトレースとスクリーンショットを残し、動画は保存しません。

`e2e/task.spec.ts`は`/example`で次の操作を確認します。

```text
追加 → 表示 → 完了 → 削除確認 → 削除
```

要素を探す順番はrole、アクセシブルな名前、label、表示文字です。test IDは、利用者に見える意味で特定できない場合に限ります。

## コマンド

```bash
pnpm test:unit
pnpm test:storybook
pnpm test
pnpm build
pnpm test:e2e
pnpm test:e2e:ui
```

`pnpm test`はUnitとComponentを実行し、E2Eは含みません。初回は`pnpm exec playwright install chromium`でブラウザを導入してください。
