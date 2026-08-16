import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { normalizeKey, uniqueKeyLetters, vigenereDecode, vigenereEncode, vigenereSteps } from "../ciphers/vigenere";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";
import VigenereSquare from "../components/VigenereSquare";

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

  const activeKeyLetters = useMemo(() => uniqueKeyLetters(key), [key]);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>ヴィジュネル暗号</h1>
        <p className="cipher-page-era">16世紀・フランス（ブレーズ・ド・ヴィジュネル）</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/caesar" className="cipher-link">シーザー暗号</Link>は「ずらし数」が文章全体で固定でした。ヴィジュネル暗号は、
          <strong>鍵となる単語を繰り返し文章に重ね</strong>、鍵の1文字ごとに違うずらし数を使います。
          例えば鍵が <code>KEY</code> なら、1文字目は K（10）、2文字目は E（4）、3文字目は Y（24）だけずらし、
          4文字目でまた K に戻ります。
        </p>
        <p>
          1文字ごとにずらし数が変わるため、<Link to="/substitution" className="cipher-link">単一換字式暗号</Link>を破った頻度分析が効きにくくなります。
          19世紀半ばまで解読法が見つからず、「解読不能な暗号（le chiffre indéchiffrable）」と呼ばれていました。
          実際に破るには、<Link to="/cryptanalysis/kasiski" className="cipher-link">カシスキー試験</Link>で鍵の長さを、
          <Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>で鍵そのものを推測する方法が知られています。
        </p>
        <p className="note-text">
          ※ この「鍵を繰り返す」方式は実は1553年にジョヴァン・バッティスタ・ベラーゾが考案したもので、
          19世紀に誤ってヴィジュネルの名で呼ばれるようになりました。ヴィジュネル自身が1586年に発表したのは、
          鍵が尽きたあと平文自身を鍵として使い続ける、より強力な
          <Link to="/autokey" className="cipher-link">オートキー暗号</Link>でした。
        </p>
      </section>

      <section className="explanation">
        <h2>ヴィジュネル方陣（tabula recta）</h2>
        <p>
          実際の暗号化は、26×26のこの表を使って手計算できます。<strong>行を鍵の文字</strong>、
          <strong>列を平文の文字</strong>として選び、その交点にある文字が暗号文になります
          （復号はこの逆で、鍵の行の中から暗号文の文字を探し、その列見出しが平文になります）。
          下の表では、いま入力している鍵に含まれる文字の行を赤色でハイライトしています。
          行ごとに違うアルファベットの並び（＝ずらし数の異なる<Link to="/caesar" className="cipher-link">シーザー暗号</Link>）を使っていることが視覚的にわかります。
        </p>
        <VigenereSquare activeKeyLetters={activeKeyLetters} />
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
