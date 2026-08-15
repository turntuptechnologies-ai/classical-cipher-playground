import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { caesarDecode, caesarEncode } from "../ciphers/caesar";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DEFAULT_TEXT = "HELLO CLASSICAL CIPHER";

export default function CaesarPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [shift, setShift] = useState(3);

  const output = useMemo(
    () => (mode === "encode" ? caesarEncode(input, shift) : caesarDecode(input, shift)),
    [input, shift, mode],
  );

  const mappedAlphabet = useMemo(() => caesarEncode(ALPHABET, shift), [shift]);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>シーザー暗号</h1>
        <p className="cipher-page-era">紀元前1世紀ごろ・古代ローマ</p>
      </header>

      <section className="explanation">
        <p>
          ユリウス・カエサルが軍事通信に使ったとされる、暗号史上もっとも有名な暗号です。
          アルファベットを決まった数だけ「ずらす」だけのシンプルな仕組みで、
          例えば <strong>ずらし数 3</strong> なら A → D、B → E のように文字を置き換えます。
        </p>
        <p>
          仕組みが単純なぶん、ずらし数はたった26通りしかありません。
          <Link to="/cryptanalysis/bruteforce" className="cipher-link">総当たり（ブルートフォース）</Link>
          ですぐに解読できてしまう、暗号としては最も弱い部類に入ります。文章が長ければ
          <Link to="/cryptanalysis/frequency" className="cipher-link">頻度分析</Link>でも同じように解読できます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="shift-control">
            ずらし数
            <input
              type="range"
              min={0}
              max={25}
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
            />
            <input
              type="number"
              min={0}
              max={25}
              value={shift}
              onChange={(e) => setShift(Math.max(0, Math.min(25, Number(e.target.value) || 0)))}
              className="shift-number"
            />
          </label>
        </div>

        <div className="alphabet-map" aria-hidden="true">
          <div className="alphabet-row">
            {ALPHABET.split("").map((char) => (
              <span key={`plain-${char}`} className="alphabet-cell">
                {char}
              </span>
            ))}
          </div>
          <div className="alphabet-row shifted">
            {mappedAlphabet.split("").map((char, i) => (
              <span key={`cipher-${i}`} className="alphabet-cell">
                {char}
              </span>
            ))}
          </div>
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
      </section>
    </article>
  );
}
