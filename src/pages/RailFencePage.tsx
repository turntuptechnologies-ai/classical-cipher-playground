import { useMemo, useState } from "react";
import { railFenceDecode, railFenceEncode, railFenceGrid } from "../ciphers/railfence";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HELLOCLASSICALCIPHER";
const MAX_GRID_CHARS = 60;

export default function RailFencePage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [rails, setRails] = useState(3);

  const output = useMemo(
    () => (mode === "encode" ? railFenceEncode(input, rails) : railFenceDecode(input, rails)),
    [input, rails, mode],
  );

  const gridSource = mode === "encode" ? input : output;
  const grid = useMemo(
    () => (gridSource.length <= MAX_GRID_CHARS ? railFenceGrid(gridSource, rails) : null),
    [gridSource, rails],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>レールフェンス暗号</h1>
        <p className="cipher-page-era">スキュタレー暗号にはじまる「転置式」の系譜</p>
      </header>

      <section className="explanation">
        <p>
          これまでの暗号は文字を「別の文字に置き換える」換字式でしたが、レールフェンス暗号は文字自体は変えず、
          <strong>並び順だけを入れ替える</strong>「転置式」の暗号です。文字を線路（レール）の上をジグザグに
          書き進め、レールを上から順番に読み出すことで暗号文を作ります。
        </p>
        <p>
          仕組みは単純ですが、置き換え表を持たない転置式暗号の代表例として、
          後のより複雑な暗号（列転置暗号など）の基礎になりました。鍵は「レールの本数」だけです。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="shift-control">
            レール数
            <input
              type="range"
              min={2}
              max={8}
              value={rails}
              onChange={(e) => setRails(Number(e.target.value))}
            />
            <input
              type="number"
              min={2}
              max={8}
              value={rails}
              onChange={(e) => setRails(Math.max(2, Math.min(8, Number(e.target.value) || 2)))}
              className="shift-number"
            />
          </label>
        </div>

        <label className="field">
          {mode === "encode" ? "平文（暗号化したい文章）" : "暗号文（復号したい文章）"}
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
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
            <p className="steps-caption">ジグザグ図（{mode === "encode" ? "平文" : "暗号文"}を並べた様子）</p>
            <div className="railfence-grid">
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
        {!grid && gridSource.length > MAX_GRID_CHARS && (
          <p className="steps-caption">（{MAX_GRID_CHARS}文字を超えるとジグザグ図は表示されません）</p>
        )}
      </section>
    </article>
  );
}
