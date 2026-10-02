# Repository

この文書では、GitHub Actions、依存関係の定期更新、リポジトリ設定の役割をまとめます。

## CI

`.github/workflows/ci.yml`はpull request、`main`へのpush、手動実行で動きます。権限は`contents: read`に限定。同じブランチの古い実行は中止します。利用するActionは完全なcommit SHAで固定しています。

| ジョブ    | 責務                                         | 必須チェック |
| --------- | -------------------------------------------- | ------------ |
| `quality` | `format:check`、`lint`、`typecheck`、`knip`  | はい         |
| `test`    | Chromiumを導入し、UnitとComponentを実行      | はい         |
| `build`   | Next.jsをビルド                              | はい         |
| `e2e`     | Chromiumを導入し、ビルド後にPlaywrightを実行 | いいえ       |

各ジョブのインストールに使うのは`pnpm install --frozen-lockfile`です。`build`だけが`.next/cache`を再利用し、ビルド成果物はジョブ間で共有しません。

E2Eが失敗した場合は`playwright-report`と`test-results`を14日間保存します。成功時は成果物をアップロードしません。

## 依存関係の更新

DependabotはnpmパッケージとGitHub Actionsを毎週更新します。実行時刻はAsia/Tokyoの08:00、公開直後の更新を避ける期間は7日です。

npmは`all-dependencies`、GitHub Actionsは`all-actions`として、それぞれ1つのグループへまとめます。自動マージは行いません。

通常更新の7日間という基準は、pnpmの`minimumReleaseAge`と揃えています。緊急のセキュリティ修正は通常更新と分け、必要なバージョンを確認して対応します。

## リポジトリ設定

`pnpm setup:repo`の担当は、ソースコードに含まれないGitHubリポジトリ設定です。`gh` CLIで適用するため、実行には`gh`、`jq`、管理権限が必要です。

```text
マージ方法               squashのみ
マージ後のブランチ削除   有効
デフォルトブランチ削除   禁止
force push               禁止
pull request             必須
必須チェック             quality、test、build
必須承認数               0
strict status policy     無効
```

E2Eは必須チェックに含めません。テンプレートリポジトリとしての設定も、生成先へ引き継ぐ項目ではないため対象外です。

スクリプトは現在の設定を読み、必要な項目だけ更新します。rulesetはAPIの追加フィールドを除いて比較するため、同じ状態で再実行しても更新履歴を増やしません。

```bash
gh auth login
pnpm setup:repo
```
