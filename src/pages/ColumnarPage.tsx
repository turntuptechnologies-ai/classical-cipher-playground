import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { columnarDecode, columnarEncode, columnarGrid, transpositionRanks } from "../ciphers/columnar";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "DEFENDTHEEASTWALLOFTHECASTLE";
const DEFAULT_KEY = "PRIVACY";
const MAX_GRID_CHARS = 60;

export default function ColumnarPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [key, setKey] = useState(DEFAULT_KEY);

  const keyLetters = [...key.toUpperCase().replace(/[^A-Z]/g, "")];
  const ranks = useMemo(() => transpositionRanks(key), [key]);

  const output = useMemo(
    () => (mode === "encode" ? columnarEncode(input, key) : columnarDecode(input, key)),
    [input, key, mode],
  );

  const gridSource = mode === "encode" ? input : output;
  const grid = useMemo(
    () => (keyLetters.length >= 2 && gridSource.length <= MAX_GRID_CHARS ? columnarGrid(gridSource, key) : null),
    [gridSource, key, keyLetters.length],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>列転置暗号</h1>
        <p className="cipher-page-era">転置式暗号の代表的な発展形（図形転置式の鍵付きバージョン）</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/geometric" className="cipher-link">図形転置式暗号</Link>
          は読み出しのルート自体が鍵でしたが、列転置暗号は<strong>キーワード</strong>を使って
          列を読み出す順番を決めます。平文を升目に横方向で書き込み、キーワードの各文字を
          アルファベット順に並べたときの順位（同じ文字がある場合は左にあるものを先に）で列を読み出すと、
          暗号文になります。
        </p>
        <p>
          <Link to="/railfence" className="cipher-link">レールフェンス暗号</Link>や
          <Link to="/scytale" className="cipher-link">スキュタレー暗号</Link>よりも並べ方のパターンが格段に多く
          （キーワードの長さの階乗ぶんの並べ方があります）、単純な総当たりが難しくなります。
          第一次世界大戦の<Link to="/adfgvx" className="cipher-link">ADFGVX暗号</Link>
          は、この列転置暗号を第2段階として使っています。キーワードを総当たりする代わりに、
          列数と読み出し順そのものを直接試す<Link to="/cryptanalysis/anagram" className="cipher-link">アナグラム法</Link>
          が有効です。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="field key-field">
            鍵（キーワード）
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="key-input mono"
              placeholder="例: PRIVACY"
            />
          </label>
        </div>

        <label className="field">
          {mode === "encode" ? "平文（暗号化したい文章）" : "暗号文（復号したい文章）"}
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="mono" />
        </label>

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文" : "平文"}</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        {grid && (
          <div className="railfence-grid-wrap">
            <p className="steps-caption">
              升目（{mode === "encode" ? "平文" : "暗号文"}を書き込んだ様子。上段は鍵の文字、下段は読み出し順）
            </p>
            <div className="railfence-grid">
              <div className="railfence-row">
                {keyLetters.map((letter, i) => (
                  <span key={i} className="rail-cell filled">
                    {letter}
                  </span>
                ))}
              </div>
              <div className="railfence-row">
                {ranks.map((rank, i) => (
                  <span key={i} className="rail-cell order-cell">
                    {rank}
                  </span>
                ))}
              </div>
              {grid.map((row, r) => (
                <div className="railfence-row" key={r}>
                  {row.map((cell, c) => (
                    <span key={c} className={cell ? "rail-cell filled" : "rail-cell"}>
                      {cell ?? ""}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {!grid && keyLetters.length < 2 && (
          <p className="steps-caption">鍵はアルファベット2文字以上で入力してください。</p>
        )}
        {!grid && keyLetters.length >= 2 && gridSource.length > MAX_GRID_CHARS && (
          <p className="steps-caption">（{MAX_GRID_CHARS}文字を超えると升目は表示されません）</p>
        )}
      </section>
    </article>
  );
}
