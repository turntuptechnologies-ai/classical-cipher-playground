import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buildPlayfairGrid, playfairDecode, playfairEncode } from "../ciphers/playfair";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HIDE THE GOLD IN THE TREE STUMP";
const DEFAULT_KEY = "PLAYFAIR EXAMPLE";

export default function PlayfairPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [key, setKey] = useState(DEFAULT_KEY);

  const grid = useMemo(() => buildPlayfairGrid(key), [key]);

  const output = useMemo(
    () => (mode === "encode" ? playfairEncode(input, key) : playfairDecode(input, key)),
    [input, key, mode],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>プレイフェア暗号</h1>
        <p className="cipher-page-era">1854年・イギリス（チャールズ・ホイートストン考案）</p>
      </header>

      <section className="explanation">
        <p>
          これまでの換字式暗号は1文字ずつ置き換えていましたが、プレイフェア暗号は
          <strong>2文字のペア（ダイグラム）を一度に置き換える</strong>点が大きく異なります。
          キーワードから作った5×5の表（IとJは同じマス扱い）の中で、2文字の位置関係に応じて
          「同じ行なら右へ」「同じ列なら下へ」「それ以外は長方形の対角」という3つのルールで置き換えます。
        </p>
        <p>
          考案者の名を冠していますが実際に考案したのはチャールズ・ホイートストンで、外交官の
          ライオネル・プレイフェアが普及に努めたためこの名で呼ばれています。手作業で運用できる割に
          単純な頻度分析が効きにくく、ボア戦争・第一次世界大戦・第二次世界大戦でも実際に使われました。
          実際の解読では、平文の一部を推測する
          <Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>が手がかりになります。
        </p>
        <p className="note-text">
          ※ 同じ文字が連続するペアには埋め文字（X、Xが使われている場合はQ）を挿入し、
          文字数が奇数の場合は末尾にも埋め文字を補います。アルファベット以外の文字は暗号化前に取り除かれます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="field key-field">
            鍵（キーワード）
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="key-input mono"
              placeholder="例: PLAYFAIR EXAMPLE"
            />
          </label>
        </div>

        <label className="field">
          {mode === "encode" ? "平文（暗号化したい文章）" : "暗号文（2文字ずつ半角スペース区切り）"}
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
        </label>

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文" : "平文"}</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        <div className="playfair-grid-wrap">
          <p className="steps-caption">5×5の表（鍵から生成）</p>
          <div className="playfair-grid">
            {Array.from({ length: 5 }, (_, r) => (
              <div className="playfair-grid-row" key={r}>
                {grid.slice(r * 5, r * 5 + 5).map((letter, c) => (
                  <span key={c} className="playfair-cell">
                    {letter}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
