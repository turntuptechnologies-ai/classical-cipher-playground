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

各ページで暗号化・復号の両方向を試せるほか、シーザー暗号／単一換字式暗号ではアルファベット対応表、
ヴィジュネル暗号では文字ごとの変換過程、レールフェンス暗号ではジグザグ図を表示し、
仕組みが視覚的にわかるようにしています。

### 今後追加予定

- 暗号解読チャレンジ（ヒント付きでciphertextを解読する問題）
- エニグマ暗号

## 技術スタック

- React + TypeScript + Vite
- react-router-dom（HashRouter）
- GitHub Pages（GitHub Actions で自動デプロイ）

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # 型チェック + 本番ビルド
npm run lint     # oxlint
```

`main` ブランチへの push で GitHub Actions が自動的にビルドし、GitHub Pages に反映されます。
