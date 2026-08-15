import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { scytaleDecode, scytaleEncode, scytaleGrid } from "../ciphers/scytale";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "WEAREDISCOVEREDFLEEATONCE";
const MAX_GRID_CHARS = 60;

export default function ScytalePage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [faces, setFaces] = useState(3);

  const output = useMemo(
    () => (mode === "encode" ? scytaleEncode(input, faces) : scytaleDecode(input, faces)),
    [input, faces, mode],
  );

  const gridSource = mode === "encode" ? input : output;
  const grid = useMemo(
    () => (gridSource.length <= MAX_GRID_CHARS ? scytaleGrid(gridSource, faces) : null),
    [gridSource, faces],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>スキュタレー暗号</h1>
        <p className="cipher-page-era">紀元前5世紀ごろ・古代スパルタ</p>
      </header>

      <section className="explanation">
        <p>
          転置式暗号の中でもっとも古いとされる暗号のひとつです。特定の太さの棒（スキュタレー）に紙や革ひもを
          螺旋状に巻きつけ、棒に沿って文字を書いていきます。ほどくと文字はバラバラの順に散らばりますが、
          <strong>同じ太さの棒に巻きつければ元の文章が読める</strong>という仕組みでした。
        </p>
        <p>
          仕組みを表にすると、平文を「棒に1周で書き込める文字数（面数）」を行数として升目に横方向で書き込み、
          縦方向に読み出したものが暗号文になります。鍵は事実上「棒の太さ」だけなので、
          太さの候補を<Link to="/cryptanalysis/bruteforce" className="cipher-link">総当たり</Link>
          されると比較的簡単に解読されてしまいます。仕組みを知らなくても、
          面数の候補を変えながら読める並びを探す<Link to="/cryptanalysis/anagram" className="cipher-link">アナグラム法</Link>
          で崩すこともできます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="shift-control">
            面数（棒の1周で書ける文字数）
            <input
              type="range"
              min={2}
              max={8}
              value={faces}
              onChange={(e) => setFaces(Number(e.target.value))}
            />
            <input
              type="number"
              min={2}
              max={8}
              value={faces}
              onChange={(e) => setFaces(Math.max(2, Math.min(8, Number(e.target.value) || 2)))}
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
            <p className="steps-caption">
              棒に巻きつけた升目（{mode === "encode" ? "平文" : "暗号文"}を横方向に書き込んだ様子）
            </p>
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
          <p className="steps-caption">（{MAX_GRID_CHARS}文字を超えると升目は表示されません）</p>
        )}
      </section>
    </article>
  );
}
