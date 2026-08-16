import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { autokeyDecode, autokeyEncode, autokeySteps, normalizeKey } from "../ciphers/autokey";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "ATTACKATDAWN";
const DEFAULT_PRIMER = "K";

export default function AutokeyPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [primer, setPrimer] = useState(DEFAULT_PRIMER);

  const cleanPrimer = normalizeKey(primer);

  const output = useMemo(() => {
    if (!cleanPrimer) return "";
    return mode === "encode" ? autokeyEncode(input, primer) : autokeyDecode(input, primer);
  }, [input, primer, mode, cleanPrimer]);

  const steps = useMemo(
    () => autokeySteps(input, primer, mode === "encode" ? 1 : -1).filter((s) => s.isAlpha),
    [input, primer, mode],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>オートキー暗号</h1>
        <p className="cipher-page-era">1586年・フランス（ブレーズ・ド・ヴィジュネル）</p>
      </header>

      <section className="explanation">
        <p>
          実は「<Link to="/vigenere" className="cipher-link">ヴィジュネル暗号</Link>」として広く知られている、
          鍵を短い単語のまま繰り返し使う仕組みは、1553年にジョヴァン・バッティスタ・ベラーゾが考案したものです。
          19世紀に誤ってヴィジュネルの名で呼ばれるようになりました。ヴィジュネル自身が1586年に発表したのは、
          こちらのより強力な「オートキー（自己鍵）」方式でした。
        </p>
        <p>
          仕組みはヴィジュネル暗号とほぼ同じですが、<strong>短い初期鍵を使い切ったあとは、
          平文そのものを鍵の続きとして使います</strong>。例えば初期鍵が1文字の「K」でも、
          2文字目以降は「平文の1文字前」がそのまま鍵になっていきます。
        </p>
        <p className="note-text">
          鍵が二度と同じパターンを繰り返さないため、
          <Link to="/cryptanalysis/kasiski" className="cipher-link">カシスキー試験</Link>
          で鍵の長さを推測することができません。ヴィジュネル暗号よりも解読が難しい、
          という点では理にかなった発展形と言えます。ただし平文の一部が推測できれば、
          <Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>
          で初期鍵とその後のキーストリームが一気に判明してしまいます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="field key-field">
            初期鍵（英字）
            <input
              type="text"
              value={primer}
              onChange={(e) => setPrimer(e.target.value)}
              className="key-input mono"
              placeholder="例: K"
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
          <p className="result-text">
            {cleanPrimer ? output || "（入力すると結果が表示されます）" : "初期鍵に英字を1文字以上入力してください"}
          </p>
        </div>

        {steps.length > 0 && (
          <div className="steps-table-wrap">
            <p className="steps-caption">
              文字ごとの変換過程（先頭 {Math.min(steps.length, 40)} 文字。鍵の行で、初期鍵の後は平文がそのまま鍵になっていく様子がわかります）
            </p>
            <table className="steps-table">
              <tbody>
                <tr>
                  <th scope="row">{mode === "encode" ? "平文" : "暗号文"}</th>
                  {steps.slice(0, 40).map((s, i) => (
                    <td key={i}>{s.char.toUpperCase()}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">鍵</th>
                  {steps.slice(0, 40).map((s, i) => (
                    <td key={i} className="key-cell">
                      {s.keyChar}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">{mode === "encode" ? "暗号文" : "平文"}</th>
                  {steps.slice(0, 40).map((s, i) => (
                    <td key={i} className="result-cell">
                      {s.result.toUpperCase()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </article>
  );
}
