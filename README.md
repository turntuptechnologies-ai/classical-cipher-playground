# 古典暗号プレイグラウンド (classical-cipher-playground)

[![CI](https://github.com/turntuptechnologies-ai/classical-cipher-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/turntuptechnologies-ai/classical-cipher-playground/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/turntuptechnologies-ai/classical-cipher-playground/actions/workflows/deploy.yml/badge.svg)](https://github.com/turntuptechnologies-ai/classical-cipher-playground/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://turntuptechnologies-ai.github.io/classical-cipher-playground/)

コンピュータが生まれる前から使われてきた**古典暗号（クラシカル・サイファー）**を、
実際に文章を暗号化・復号しながら体験できる学習サイトです。

## 収録している暗号

生まれたとされる時代の古い順（諸説あるため目安）に並べています。

| 暗号 | 種類 | 時代 |
| --- | --- | --- |
| アトバシュ暗号 | 換字式 | 紀元前〜・古代ヘブライ |
| スキュタレー暗号 | 転置式 | 紀元前5世紀ごろ・古代スパルタ |
| ポリュビオス暗号 | 換字式（座標式） | 紀元前2世紀ごろ・古代ギリシャ |
| 図形転置式暗号 | 転置式 | 転置式暗号の基本形 |
| レールフェンス暗号 | 転置式 | 古代〜（スキュタレー暗号の系譜） |
| シーザー暗号 | 換字式 | 紀元前1世紀・古代ローマ |
| 単一換字式暗号 | 換字式 | 9世紀ごろ・アラビア〜中世ヨーロッパ |
| ホモフォニック換字式暗号 | 換字式 | 1401年・マントヴァ公国 |
| 上杉暗号 | 換字式（座標式） | 戦国時代（伝）・宇佐美定行考案説 |
| ポルタ暗号 | 換字式 | 1563年・ナポリ |
| ヴィジュネル暗号 | 換字式 | 16世紀・フランス |
| オートキー暗号 | 換字式 | 1586年・フランス（ブレーズ・ド・ヴィジュネル） |
| ピッグペン暗号 | 換字式 | 18世紀ごろ（伝）フリーメイソン |
| 列転置暗号 | 転置式 | 19世紀ごろ（発展の時期は諸説あり） |
| プレイフェア暗号 | 換字式（ダイグラム） | 1854年・イギリス |
| バイフィッド暗号 | 換字式（座標式） | 1901年・フランス |
| ADFGVX暗号 | 転置式（座標変換＋列転置） | 1918年・第一次世界大戦・ドイツ |
| エニグマ暗号 | 換字式（機械式） | 1920年代〜第二次世界大戦・ドイツ |

各ページで暗号化・復号の両方向を試せるほか、シーザー暗号／単一換字式暗号ではアルファベット対応表、
ヴィジュネル暗号では方陣（tabula recta）と文字ごとの変換過程、レールフェンス暗号ではジグザグ図、
上杉暗号ではいろは48文字の7×7表、エニグマ暗号ではローター表示窓と文字ごとの変換過程を表示し、
仕組みが視覚的にわかるようにしています。

### 解読方法

「暗号を学ぶ」と「解読チャレンジ」の間を埋めるコンテンツとして、鍵を知らない状態から暗号文を読み解く
古典的な手法を紹介するページ（/cryptanalysis）も用意しています。頻度分析・総当たり攻撃・カシスキー試験・
アナグラム法・既知平文攻撃の5手法を、暗号文を貼って試せるインタラクティブなツール付きで解説しています。

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

## License

MIT — see [LICENSE](LICENSE).
