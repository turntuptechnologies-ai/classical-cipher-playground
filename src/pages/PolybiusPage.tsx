import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buildPolybiusSquare, polybiusDecode, polybiusEncode } from "../ciphers/polybius";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HELLO CLASSICAL CIPHER";
const HEADERS = [1, 2, 3, 4, 5];

export default function PolybiusPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [keyword, setKeyword] = useState("");

  const square = useMemo(() => buildPolybiusSquare(keyword), [keyword]);

  const output = useMemo(
    () => (mode === "encode" ? polybiusEncode(input, keyword) : polybiusDecode(input, keyword)),
    [input, keyword, mode],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>ポリュビオス暗号</h1>
        <p className="cipher-page-era">紀元前2世紀ごろ・古代ギリシャ（歴史家ポリュビオス）</p>
      </header>

      <section className="explanation">
        <p>
          現存する最古級の座標式の仕組みです。アルファベットを5×5の表（IとJは同じマス扱い）に並べ、
          各文字を「行の数字」と「列の数字」の組で表します。もともとは暗号というより
          <strong>通信の手段</strong>として考えられたもので、離れた場所から松明（たいまつ）を掲げる本数で
          行と列の数字を伝える、原始的な電信のような運用が想定されていました。
        </p>
        <p>
          鍵を使わずアルファベット順のまま表を使えば、この松明通信のように誰でも読み書きできる
          「公開された符号」になります。一方、キーワードで表の並びを混ぜれば、鍵を知らない人には
          読めない立派な暗号になります。この座標変換という発想は、日本の
          <Link to="/uesugi" className="cipher-link">上杉暗号</Link>
          や第一次世界大戦の<Link to="/adfgvx" className="cipher-link">ADFGVX暗号</Link>にも受け継がれています。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="field key-field">
            鍵（空欄なら素のアルファベット順）
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="key-input mono"
              placeholder="空欄でもOK"
            />
          </label>
        </div>

        <label className="field">
          {mode === "encode" ? "平文（アルファベット）" : "暗号文（行-列を半角スペース区切りで）"}
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="mono" />
        </label>

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文" : "平文"}</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        <div className="uesugi-grid-wrap">
          <p className="steps-caption">5×5の表（鍵から生成、IとJは同じマス）</p>
          <table className="uesugi-grid">
            <thead>
              <tr>
                <th className="corner-cell">列＼行</th>
                {HEADERS.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEADERS.map((row) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {HEADERS.map((col) => (
                    <td key={col}>{square[(row - 1) * 5 + (col - 1)]}</td>
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
