# Next.jsフロントエンドテンプレート

Next.js App Routerを使ったフロントエンド開発用のテンプレートです。
開発・テスト・品質管理の土台を、プロダクト固有の機能を含めずに用意しています。
認証、データベース、永続化などは含みません。

## 技術構成

- Framework: Next.js / React / TypeScript
- Styling: Tailwind CSS
- UI: Base UI / Lucide
- Validation: Zod / T3 Env
- Testing: Vitest / Storybook / Playwright
- Lint: Oxlint
- Format: Oxfmt
- Unused Code: Knip
- Git Hooks: Lefthook
- Package Manager: pnpm
- CI: GitHub Actions / Dependabot

## 開発を始める

Node.jsとpnpmのバージョンは`package.json`で固定しています。

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm exec playwright install chromium
pnpm dev
```

開発サーバーは`http://localhost:3000`で起動します。
実装完了時は、次のコマンドで整形、Lint、型検査、未使用コード、テスト、ビルドをまとめて確認できます。

```bash
pnpm verify
```

E2Eは`verify`に含まれないため、必要に応じて別途実行します。

```bash
pnpm test:e2e
```

## 環境変数

環境変数は`src/lib/env.ts`で検証します。
`APP_URL`はmetadata、robots、sitemapの基準URLです。
共有可能な値は`.env.example`に記載し、アプリケーションコードでは`process.env`を直接参照せず、検証済みの`env`を利用します。
ローカル用の`.env*`ファイルはGitの管理対象外です。

## コマンド

```bash
pnpm dev
pnpm verify
pnpm test:e2e
pnpm storybook
```

その他のコマンドは`package.json`を参照してください。

## ドキュメント

設計と運用の詳細は[ドキュメント一覧](docs/README.md)を参照してください。
AIエージェント向けの実装規約は[AGENTS.md](AGENTS.md)にあります。
