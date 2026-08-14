# 古典暗号プレイグラウンド (classical-cipher-playground)

コンピュータが生まれる前から使われてきた**古典暗号（クラシカル・サイファー）**を、
実際に文章を暗号化・復号しながら体験できる学習サイトです。

🔗 https://turntuptechnologies-ai.github.io/classical-cipher-playground/

## 収録している暗号

| 暗号 | 種類 | 時代 |
| --- | --- | --- |
| シーザー暗号 | 換字式 | 紀元前1世紀・古代ローマ |
| 単一換字式暗号 | 換字式 | 9世紀ごろ・アラビア〜中世ヨーロッパ |
| ヴィジュネル暗号 | 換字式 | 16世紀・フランス |
| レールフェンス暗号 | 転置式 | 古代〜（スキュタレー暗号の系譜） |
| 上杉暗号 | 換字式（座標式） | 戦国時代（伝）・宇佐美定行考案説 |
| エニグマ暗号 | 換字式（機械式） | 1920年代〜第二次世界大戦・ドイツ |

各ページで暗号化・復号の両方向を試せるほか、シーザー暗号／単一換字式暗号ではアルファベット対応表、
ヴィジュネル暗号では方陣（tabula recta）と文字ごとの変換過程、レールフェンス暗号ではジグザグ図、
上杉暗号ではいろは48文字の7×7表、エニグマ暗号ではローター表示窓と文字ごとの変換過程を表示し、
仕組みが視覚的にわかるようにしています。

### 暗号解読チャレンジ

各暗号につき1問、ヒント付きの解読チャレンジ（/challenges）も用意しています。
クリア状況はlocalStorageに保存されます。

## 技術スタック

- React + TypeScript + Vite
- react-router-dom（HashRouter）
- vitest（ユニットテスト）
- GitHub Actions（CI + GitHub Pages自動デプロイ）

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # 型チェック + 本番ビルド
npm run lint     # oxlint
npm run test     # vitest
```

`main` への直接pushは禁止しており、Issue → ブランチ → PR → マージの運用です。
PRでは `ci`（build + lint + test）のチェックが必須で、マージ後にGitHub Actionsが
GitHub Pagesへ自動デプロイします。
