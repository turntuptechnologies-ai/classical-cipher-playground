import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PIGPEN_TABLE, pigpenDecode, pigpenDecodeTokens, pigpenEncode, pigpenEncodeTokens } from "../ciphers/pigpen";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";
import PigpenSymbol from "../components/PigpenSymbol";

const DEFAULT_TEXT = "HELLO SECRET";
const DEFAULT_CODE = "32 22 13. 13. 23. T 22 13 33. 22 R";

const GRID_ROWS: string[] = ["ABC", "DEF", "GHI"];
const GRID_ROWS_DOTTED: string[] = ["JKL", "MNO", "PQR"];
const X_LETTERS: string[] = ["S", "T", "U", "V"];
const X_LETTERS_DOTTED: string[] = ["W", "X", "Y", "Z"];

export default function PigpenPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [plainInput, setPlainInput] = useState(DEFAULT_TEXT);
  const [codeInput, setCodeInput] = useState(DEFAULT_CODE);

  const encodeTokens = useMemo(() => pigpenEncodeTokens(plainInput), [plainInput]);
  const decodeTokens = useMemo(() => pigpenDecodeTokens(codeInput), [codeInput]);

  const codeOutput = useMemo(() => pigpenEncode(plainInput), [plainInput]);
  const plainOutput = useMemo(() => pigpenDecode(codeInput), [codeInput]);

  const displayTokens = mode === "encode" ? encodeTokens : decodeTokens;

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>ピッグペン暗号（豚小屋暗号）</h1>
        <p className="cipher-page-era">18世紀ごろ・フリーメイソンで使われたとされる</p>
      </header>

      <section className="explanation">
        <p>
          アルファベットを文字ではなく<strong>幾何学的な記号</strong>に置き換える換字式暗号です。
          3×3の格子を2枚（1枚は点つき）と、X字型の図形を2枚（同じく1枚は点つき）用意し、
          それぞれの区画の形が26文字ぶんの記号になります。1区画を囲む線の形がそのまま暗号記号になる、
          という発想がユニークです。
        </p>
        <p>
          フリーメイソンが使ったという逸話でよく知られていますが、実際には配置の異なる亜種が複数存在し、
          「これが唯一正しい配置」というものはありません。このページでは「格子・格子・X・X」という
          もっとも広く紹介される構成を採用しています。記号は見た目こそ違いますが1文字1記号の単純な置き換えなので、
          <Link to="/cryptanalysis/frequency" className="cipher-link">頻度分析</Link>で解読できます。
        </p>
        <p className="note-text">
          ※ 記号はテキストで直接入力できないため、下の対応表にある座標表記
          （格子は「行番号＋列番号」、点つきは末尾に「.」／Xは上下左右の頭文字T・R・B・L）を使って
          暗号文を表しています。空白は暗号化の際に読み飛ばされます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        {mode === "encode" ? (
          <label className="field">
            平文（アルファベット）
            <textarea value={plainInput} onChange={(e) => setPlainInput(e.target.value)} rows={3} />
          </label>
        ) : (
          <label className="field">
            暗号文（座標表記を半角スペース区切りで。例: 32 22 21）
            <textarea value={codeInput} onChange={(e) => setCodeInput(e.target.value)} rows={3} className="mono" />
          </label>
        )}

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文（座標表記）" : "平文"}</span>
            <CopyButton text={mode === "encode" ? codeOutput : plainOutput} />
          </div>
          <p className="result-text">
            {mode === "encode"
              ? codeOutput || "（入力すると結果が表示されます）"
              : plainOutput || "（入力すると結果が表示されます）"}
          </p>
        </div>

        {displayTokens.length > 0 && (
          <div className="pigpen-symbol-row">
            {displayTokens.map((token, i) =>
              token.symbol ? (
                <PigpenSymbol key={i} symbol={token.symbol} />
              ) : (
                <span key={i} className="pigpen-literal">
                  {token.original}
                </span>
              ),
            )}
          </div>
        )}

        <div className="pigpen-chart">
          <p className="steps-caption">記号対応表</p>
          <div className="pigpen-chart-groups">
            <div className="pigpen-chart-group">
              <p className="pigpen-chart-label">A〜I（点なし）</p>
              <div className="pigpen-grid-chart">
                {GRID_ROWS.map((rowLetters, r) => (
                  <div key={r} className="pigpen-grid-chart-row">
                    {[...rowLetters].map((letter) => (
                      <div key={letter} className="pigpen-chart-cell">
                        <PigpenSymbol symbol={PIGPEN_TABLE[letter]} size={32} />
                        <span>{letter}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pigpen-chart-group">
              <p className="pigpen-chart-label">J〜R（点つき）</p>
              <div className="pigpen-grid-chart">
                {GRID_ROWS_DOTTED.map((rowLetters, r) => (
                  <div key={r} className="pigpen-grid-chart-row">
                    {[...rowLetters].map((letter) => (
                      <div key={letter} className="pigpen-chart-cell">
                        <PigpenSymbol symbol={PIGPEN_TABLE[letter]} size={32} />
                        <span>{letter}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pigpen-chart-group">
              <p className="pigpen-chart-label">S〜V（点なしX）</p>
              <div className="pigpen-x-chart">
                {X_LETTERS.map((letter) => (
                  <div key={letter} className="pigpen-chart-cell">
                    <PigpenSymbol symbol={PIGPEN_TABLE[letter]} size={32} />
                    <span>{letter}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pigpen-chart-group">
              <p className="pigpen-chart-label">W〜Z（点つきX）</p>
              <div className="pigpen-x-chart">
                {X_LETTERS_DOTTED.map((letter) => (
                  <div key={letter} className="pigpen-chart-cell">
                    <PigpenSymbol symbol={PIGPEN_TABLE[letter]} size={32} />
                    <span>{letter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
