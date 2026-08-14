import { useMemo, useState } from "react";
import { normalizeKey, vigenereDecode, vigenereEncode, vigenereSteps } from "../ciphers/vigenere";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HELLO CLASSICAL CIPHER";
const DEFAULT_KEY = "KEY";

export default function VigenerePage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [key, setKey] = useState(DEFAULT_KEY);

  const cleanKey = normalizeKey(key);

  const output = useMemo(() => {
    if (!cleanKey) return "";
    return mode === "encode" ? vigenereEncode(input, key) : vigenereDecode(input, key);
  }, [input, key, mode, cleanKey]);

  const steps = useMemo(
    () => vigenereSteps(input, key, mode === "encode" ? 1 : -1).filter((s) => s.isAlpha),
    [input, key, mode],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>ヴィジュネル暗号</h1>
        <p className="cipher-page-era">16世紀・フランス（ブレーズ・ド・ヴィジュネル）</p>
      </header>

      <section className="explanation">
        <p>
          シーザー暗号は「ずらし数」が文章全体で固定でした。ヴィジュネル暗号は、
          <strong>鍵となる単語を繰り返し文章に重ね</strong>、鍵の1文字ごとに違うずらし数を使います。
          例えば鍵が <code>KEY</code> なら、1文字目は K（10）、2文字目は E（4）、3文字目は Y（24）だけずらし、
          4文字目でまた K に戻ります。
        </p>
        <p>
          1文字ごとにずらし数が変わるため、単一換字式暗号を破った頻度分析が効きにくくなります。
          19世紀半ばまで解読法が見つからず、「解読不能な暗号（le chiffre indéchiffrable）」と呼ばれていました。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="field key-field">
            鍵（英単語）
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="key-input mono"
              placeholder="例: KEY"
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
            {cleanKey ? output || "（入力すると結果が表示されます）" : "鍵に英字を1文字以上入力してください"}
          </p>
        </div>

        {steps.length > 0 && (
          <div className="steps-table-wrap">
            <p className="steps-caption">文字ごとの変換過程（先頭 {Math.min(steps.length, 40)} 文字）</p>
            <table className="steps-table">
              <thead>
                <tr>
                  <th>{mode === "encode" ? "平文" : "暗号文"}</th>
                  <th>鍵</th>
                  <th>{mode === "encode" ? "暗号文" : "平文"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {steps.slice(0, 40).map((s, i) => (
                    <td key={i}>{s.char.toUpperCase()}</td>
                  ))}
                </tr>
                <tr>
                  {steps.slice(0, 40).map((s, i) => (
                    <td key={i} className="key-cell">
                      {s.keyChar}
                    </td>
                  ))}
                </tr>
                <tr>
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
