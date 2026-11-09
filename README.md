# Next.js Frontend Template

Next.js App Routerを使ったフロントエンド開発用のテンプレートです。
開発・テスト・品質管理の設定を用意しています。認証、データベース、永続化など、プロダクト固有の機能は含みません。

## Stack

| 用途               | ツール                             |
| ------------------ | ---------------------------------- |
| フレームワーク     | Next.js / React / TypeScript       |
| スタイリング・UI   | Tailwind CSS / Base UI / Lucide    |
| バリデーション     | Zod / T3 Env                       |
| テスト             | Vitest / Storybook / Playwright    |
| 品質管理           | Oxlint / Oxfmt / Knip / Lefthook   |
| パッケージ管理・CI | pnpm / GitHub Actions / Dependabot |

## Getting Started

Node.jsとpnpmのバージョンは`package.json`で固定しています。

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm exec playwright install chromium
pnpm dev
```

開発サーバーは`http://localhost:3000`で起動します。

## Env

環境変数は`src/lib/env.ts`で検証し、アプリケーションコードでは`process.env`を直接参照せず、検証済みの`env`を使います。
`APP_URL`はmetadata、robots、sitemapの基準URLです。共有可能な値は`.env.example`に記載し、ローカル用の`.env*`はGitの管理対象外です。

## Commands

| コマンド         | 内容                                                   |
| ---------------- | ------------------------------------------------------ |
| `pnpm dev`       | 開発サーバーを起動                                     |
| `pnpm verify`    | 整形、Lint、型検査、未使用コード、テスト、ビルドを確認 |
| `pnpm test:e2e`  | E2Eを実行。`verify`には含まれません                    |
| `pnpm storybook` | Storybookを起動                                        |

実装完了時は`pnpm verify`でまとめて確認できます。E2Eは必要に応じて別途実行します。その他のコマンドは`package.json`を参照してください。

## Docs

設計と運用の詳細は[ドキュメント一覧](docs/README.md)を参照してください。
AIエージェント向けの実装規約は[AGENTS.md](AGENTS.md)にあります。
