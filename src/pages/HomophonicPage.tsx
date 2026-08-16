import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { validateKey } from "../ciphers/substitution";
import { buildCodeTable, homophonicDecode, homophonicEncode, randomKey } from "../ciphers/homophonic";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HELLO CLASSICAL CIPHER";
const DEFAULT_KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";

export default function HomophonicPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [key, setKey] = useState(DEFAULT_KEY);

  const validation = useMemo(() => validateKey(key), [key]);
  const table = useMemo(() => (validation.valid ? buildCodeTable(key) : []), [key, validation.valid]);

  const output = useMemo(() => {
    if (!validation.valid) return "";
    return mode === "encode" ? homophonicEncode(input, key) : homophonicDecode(input, key);
  }, [input, key, mode, validation.valid]);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>ホモフォニック換字式暗号</h1>
        <p className="cipher-page-era">1401年・マントヴァ公国（現存する最古級の記録）</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/substitution" className="cipher-link">単一換字式暗号</Link>は1文字を必ず同じ1文字に置き換えるため、
          <Link to="/cryptanalysis/frequency" className="cipher-link">頻度分析</Link>で簡単に破られてしまいます。
          ホモフォニック換字式暗号はその弱点に対する古典的な対策で、1文字を<strong>複数の「同音記号」</strong>
          （このページでは2桁の数字コード）に対応させます。
        </p>
        <p>
          英文でよく出てくる文字（E・T・Aなど）ほど多くのコードを割り当て、
          珍しい文字（Q・Z・Xなど）には少ないコードしか割り当てません。
          こうすると、暗号文中で「どのコードも似たような頻度」で出現するようになり、
          頻度分析で手がかりを掴みにくくなります。実際、マントヴァ公国のフランチェスコ1世ゴンザーガが
          1401年に使った例では、母音にのみ複数の記号を割り当てていました。
        </p>
        <p className="note-text">
          00〜99の100個のコードを、どの文字にいくつ割り当てるかは頻度によって決まっていますが、
          「どのコードがどの文字か」は鍵（26文字の並び順）によって変わります。
          頻度分析には強くても、平文の一部が推測できれば
          <Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>
          でコードと文字の対応がその場で判明してしまいます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <button type="button" className="secondary-button" onClick={() => setKey(randomKey())}>
            鍵をランダム生成
          </button>
        </div>

        <label className="field">
          鍵（A〜Zの並び替え・26文字。コードを割り当てる順番を決めます）
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            maxLength={26}
            className="key-input mono"
          />
        </label>
        <p className={validation.valid ? "key-status ok" : "key-status error"}>{validation.message}</p>

        <label className="field">
          {mode === "encode" ? "平文（暗号化したい文章）" : "暗号文（半角スペース区切りの2桁コード）"}
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
        </label>

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文" : "平文"}</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        {mode === "encode" && (
          <p className="note-text">
            ※ 同じ文字でも暗号化のたびに違うコードが選ばれます（同音記号をランダムに選ぶため）。
            もう一度暗号化すると結果が変わることを確かめてみましょう。
          </p>
        )}

        {validation.valid && (
          <div>
            <p className="steps-caption">コード割り当て表（鍵の順番どおりに00から割り振っています）</p>
            <div className="steps-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">文字</th>
                    <th scope="col">コード数</th>
                    <th scope="col">割り当てコード</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((entry) => (
                    <tr key={entry.letter}>
                      <th scope="row">{entry.letter}</th>
                      <td className="data-table-result">{entry.codes.length}</td>
                      <td className="data-table-result">{entry.codes.join(" ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
