# Development

この文書では、ローカル開発に使う実行環境、パッケージ管理、静的検査、Git hookの役割を説明します。設定値は各設定ファイルを参照してください。

## 実行環境とパッケージ管理

Node.jsとpnpmのバージョンは`package.json`で固定しています。Node.jsは`devEngines.runtime`、pnpmは`packageManager`が参照先です。GitHub Actionsも同じNode.jsの指定を読みます。

`pnpm-workspace.yaml`では、直接依存を正確なバージョンで保存します。公開から7日未満のバージョンは通常の解決対象に含めません。緊急のセキュリティ更新では、対象を確認したうえで例外を追加します。

依存パッケージのインストールスクリプトは、fresh installで必要と確認したものだけを許可します。現在の対象は`esbuild`と`lefthook`です。

```bash
pnpm install --frozen-lockfile
```

CIと検証時はlockfileを変更しないこのコマンドを使います。

## TypeScript

`tsconfig.json`は`strict: true`に加え、次の設定を有効にしています。

```text
noUncheckedIndexedAccess
exactOptionalPropertyTypes
noImplicitReturns
noFallthroughCasesInSwitch
noUnusedLocals
noUnusedParameters
noUncheckedSideEffectImports
verbatimModuleSyntax
forceConsistentCasingInFileNames
```

`@/*`は`src/*`を指すaliasです。型だけを読む場合は`import type`を使ってください。

TypeScriptは6系を使用します。TypeScript 6は従来のJavaScript実装をベースとする最後のメジャーリリースです。TypeScript 7への移行に備えるためのリリースでもあります。TypeScript 7ではネイティブ実装への移行により、従来のCompiler APIとの互換性が変わります。現在のツールチェーン全体が正式に対応するまでは採用しません。

`pnpm typecheck`は`next typegen`の後に`tsc --noEmit`を実行し、Next.jsが生成するルート型も検査します。

## 静的検査と整形

Oxlintの担当はコード上の問題と依存境界、Oxfmtの担当は書式、import、Tailwind CSSクラスの並び順です。Oxlintでは`correctness`、`suspicious`、`perf`をエラーとし、`oxlint-tsgolint`による型情報付きの検査を有効にしています。

Oxlintは[Architecture](./architecture.md)で定めた依存方向と、Base UIとLucideのimport境界を`no-restricted-imports`で検査します。`import/no-cycle`では循環依存を禁止します。

Lintの抑制には理由をコメントで残してください。不要になった抑制はエラーです。

Oxfmtは`src/app/globals.css`を参照してTailwind CSSクラスを並べ替え、`clsx`と`cn`の引数も対象にします。`.next`、`storybook-static`、`playwright-report`、`test-results`、`coverage`などの生成物は検査しません。

Knipは未使用のファイル、export、依存関係と、未登録の依存関係を検出します。標準のフレームワーク検出を優先し、`entry`や`ignore`は実際に誤検出が起きた場合だけ追加します。

## コミット前の検査

Lefthookによるコミット前の実行順は、Oxfmt、再ステージ、Oxlintです。Oxfmtが直したファイルをOxlintへ渡すため、並列にはしません。

型チェック、Knip、テスト、E2E、ビルドはpre-commitで実行せず、`pnpm verify`とGitHub Actionsに任せます。pre-push hookも設けていません。

## 完了条件

`pnpm verify`は次の順番で検査します。

```text
format:check → lint → typecheck → knip → test → build
```
