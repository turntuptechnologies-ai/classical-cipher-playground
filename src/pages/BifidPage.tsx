import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bifidDecode, bifidEncodeDetailed, buildPolybiusSquare } from "../ciphers/bifid";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "FLEEATONCE";
const DEFAULT_KEY = "GERMAN";
const ROW_LABELS = [1, 2, 3, 4, 5];

export default function BifidPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [key, setKey] = useState(DEFAULT_KEY);

  const square = useMemo(() => buildPolybiusSquare(key), [key]);
  const detail = useMemo(() => bifidEncodeDetailed(input, key), [input, key]);

  const output = mode === "encode" ? detail.ciphertext : bifidDecode(input, key);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>バイフィッド暗号</h1>
        <p className="cipher-page-era">1901年・フランス（フェリックス・ドラステル）</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/polybius" className="cipher-link">ポリュビオス暗号</Link>と同じ5×5の方陣（I/Jは同じマス扱い）を使い、
          各文字を「行・列」の座標に分解します。ここまではポリュビオス暗号と同じですが、
          バイフィッド暗号はさらにひと手間加えます。
        </p>
        <p>
          文章全体の<strong>行の並びをすべて先に書き出し、続けて列の並びをすべて書き出して</strong>
          1本の数字の列にします。この数字の列を先頭から2個ずつ新しいペアとして読み直すと、
          元とは違う「行・列」の組み合わせになります。これを方陣に当てはめ直すと暗号文になります。
          文字の座標をこうして混ぜ合わせる操作を「分別（fractionation）」と呼びます。
        </p>
        <p className="note-text">
          文字を置き換えるだけでなく並び順まで混ぜるため、
          <Link to="/cryptanalysis/frequency" className="cipher-link">頻度分析</Link>にも
          <Link to="/cryptanalysis/anagram" className="cipher-link">アナグラム法</Link>にも単純には対抗しにくい、
          比較的堅牢な換字式暗号です。それでも平文の一部が推測できれば、
          <Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>
          が方陣を推測する足がかりになります。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="field key-field">
            方陣の鍵
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="key-input mono"
              placeholder="例: GERMAN"
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
          <p className="result-text mono">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        {mode === "encode" && detail.steps.length > 0 && (
          <>
            <div className="steps-table-wrap">
              <p className="steps-caption">1. 各文字を方陣の座標(行・列)に分解</p>
              <table className="steps-table">
                <tbody>
                  <tr>
                    <th scope="row">文字</th>
                    {detail.steps.map((s, i) => (
                      <td key={i}>{s.letter}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">行</th>
                    {detail.steps.map((s, i) => (
                      <td key={i} className="key-cell">
                        {s.row + 1}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">列</th>
                    {detail.steps.map((s, i) => (
                      <td key={i} className="key-cell">
                        {s.col + 1}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="steps-table-wrap">
              <p className="steps-caption">
                2. 行の並び→列の並びの順に1本につなげ、先頭から2個ずつ新しいペアとして読み直す
              </p>
              <table className="steps-table">
                <tbody>
                  <tr>
                    <th scope="row">新しい行</th>
                    {detail.steps.map((_, i) => (
                      <td key={i}>{detail.regroupedRows[i] + 1}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">新しい列</th>
                    {detail.steps.map((_, i) => (
                      <td key={i}>{detail.regroupedCols[i] + 1}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">暗号文</th>
                    {[...detail.ciphertext].map((ch, i) => (
                      <td key={i} className="result-cell">
                        {ch}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="playfair-grid-wrap">
          <p className="steps-caption">方陣（鍵から生成、I/Jは同じマス扱い）</p>
          <table className="uesugi-grid">
            <thead>
              <tr>
                <th className="corner-cell">＼</th>
                {ROW_LABELS.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROW_LABELS.map((rowLabel, r) => (
                <tr key={rowLabel}>
                  <th scope="row">{rowLabel}</th>
                  {ROW_LABELS.map((_, c) => (
                    <td key={c}>{square[r * 5 + c]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
