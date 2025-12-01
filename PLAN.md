# 実装計画 (Implementation Plan)

`AGENTS.md` の要件に基づき、以下のステップで開発を進めます。

## フェーズ 1: プロジェクト設定と基盤構築
1. **Tailwind CSS のセットアップ**
   - Tailwind CSS, PostCSS, Autoprefixer のインストールと設定。
   - `index.css` の設定。
2. **基本ライブラリのインストール**
   - `uuid`: ID生成用
   - `react-markdown`: Markdownレンダリング用
   - `lucide-react`: アイコン用
   - `clsx`, `tailwind-merge`: クラス名操作用
3. **型定義とデータ構造の設計**
   - `Memo` インターフェースの定義 (id, title, content, createdAt, updatedAt, isMarkdown)。
4. **ストレージ層の実装**
   - localStorage への保存・読み出しを行うユーティリティ関数の作成。

## フェーズ 2: ステート管理と基本的なCRUD
1. **カスタムフック `useMemos` の実装**
   - メモの読み込み、作成、更新、削除のロジックを実装。
   - 変更時の localStorage への自動同期。
2. **基本レイアウトの作成**
   - レスポンシブな 2カラムレイアウト (モバイルでは画面切り替え)。
   - サイドバー (リスト), メインエリア (エディタ)。

## フェーズ 3: UIコンポーネント実装 (基本)
1. **メモリスト (`MemoList`)**
   - サイドバーへのメモ一覧表示。
   - タイトルと内容の抜粋表示。
   - 選択中のメモのハイライト。
2. **メモエディタ (`MemoEditor`)**
   - タイトル入力欄。
   - 本文入力欄 (`textarea`)。
   - 自動保存の実装 (入力イベントでのステート更新)。

## フェーズ 4: 詳細機能の実装
1. **編集モード切替**
   - プレーンテキストモード (textarea) と Markdownプレビューモードの切り替え実装。
   - Markdown表示時のスタイル調整 (`@tailwindcss/typography` pluginの使用を検討)。
2. **削除機能と確認**
   - 削除ボタンの配置。
   - `window.confirm` またはカスタムモーダルによる確認ダイアログ。
3. **検索機能**
   - 検索ボックスの配置。
   - タイトルと本文に対するフィルタリング処理。
4. **ソート機能**
   - 作成日時、更新日時、タイトルでの並び替えロジック実装。
   - ソート順切り替えUIの追加。

## フェーズ 5: 仕上げと非機能要件の確認
1. **レスポンシブ対応の調整**
   - モバイル表示時のリスト/詳細ビューのナビゲーション。
2. **セキュリティ対策**
   - Markdownレンダリング時のXSS対策確認 (react-markdownのデフォルト動作確認)。
3. **コード整理とリファクタリング**
   - 不要なコードの削除。
   - コンポーネントの分割。

## 実行予定コマンドメモ
- `npm install -D tailwindcss postcss autoprefixer`
- `npx tailwindcss init -p`
- `npm install uuid react-markdown lucide-react clsx tailwind-merge`
