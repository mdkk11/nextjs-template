# Architecture

このテンプレートは、変更の影響範囲を狭くするために層ごとの責務と依存方向を定めています。空の層や将来用の共通化は作りません。

## ディレクトリの責務

```text
src/
├─ app/          ルーティング、ページ構成、Route Handler
├─ features/     機能固有の状態、操作、API関数、スキーマ
├─ components/
│  ├─ ui/        Base UIの薄いラッパー
│  └─ icons/     利用中のLucideアイコンのラッパー
└─ lib/          機能に属さない汎用処理と環境変数の境界

e2e/             Playwrightの利用者フロー
docs/            設計と運用の判断基準
scripts/         リポジトリ運用の自動化
```

`app`はNext.jsとの接点に限定し、機能の振る舞いは`features`へ置きます。`components`と`lib`は複数の機能から利用できる共有層です。

## 依存方向

```text
app
 ↓
features
 ↓
components / lib

components/ui    → @base-ui/react
components/icons → lucide-react
```

機能同士を直接参照してはいけません。共有層である`components`と`lib`から`features`への逆依存も禁止です。複数の機能で同じ処理が必要になった時点で、責務に応じて共有層へ移します。

Base UIの直接読み込みは`src/components/ui/**`、Lucideは`src/components/icons/**`に限定しています。これらの境界とエイリアスを使った層間依存は、Oxlintの`no-restricted-imports`の検査対象です。相対パスを含む完全な依存グラフまでは検査しません。

## 外部入力の境界

ブラウザからの更新処理は、Server ActionsではなくRoute Handlerを経由します。

```text
コンポーネント
 ↓
機能別API関数
 ↓
fetch
 ↓
Route Handler
 ↓
Zod
```

Route Handlerがリクエストを、機能別API関数がJSONレスポンスをZodで検証した後、内部では通常のTypeScript型として扱います。

環境変数の検証場所は`src/lib/env.ts`です。アプリケーションから`process.env`を直接参照せず、公開してよい値だけに`NEXT_PUBLIC_`を付けます。

## ファイルを増やす基準

barrel exportとルート直下の`hooks/`、`types/`、`utils/`は原則として作りません。所有元のファイルを直接読み込み、同じ責務が複数箇所に現れてから共通化します。
