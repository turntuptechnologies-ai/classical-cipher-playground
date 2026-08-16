import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { normalizeKey, portaTransform, uniqueKeyRows } from "../ciphers/porta";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";
import PortaTable from "../components/PortaTable";

const DEFAULT_TEXT = "HELLO CLASSICAL CIPHER";
const DEFAULT_KEY = "PORTA";

export default function PortaPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [key, setKey] = useState(DEFAULT_KEY);

  const cleanKey = normalizeKey(key);
  const activeRows = useMemo(() => uniqueKeyRows(key), [key]);

  const output = useMemo(() => {
    if (!cleanKey) return "";
    return portaTransform(input, key);
  }, [input, key, cleanKey]);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>ポルタ暗号</h1>
        <p className="cipher-page-era">1563年・ナポリ（ジャンバッティスタ・デッラ・ポルタ）</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/vigenere" className="cipher-link">ヴィジュネル暗号</Link>と同じく、
          鍵の1文字ごとに違う換字表を切り替える多表式暗号です。ただし表の切り替え方が独特で、
          鍵文字を<strong>AB・CD・EF…YZという13組のペア</strong>のどちらかとして扱い、
          ペアごとに用意された13種類の表のうち1つを選びます（AでもBでも同じ表になります）。
        </p>
        <p>
          各表は、アルファベットの前半（A〜M）と後半（N〜Z）を入れ替えるように作られていて、
          <strong>同じ表をもう一度適用すると元に戻る</strong>という性質を持っています。
          そのため、ポルタ暗号は<strong>暗号化と復号がまったく同じ操作</strong>という珍しい特徴を持ちます。
        </p>
        <p className="note-text">
          考案者のジャンバッティスタ・デッラ・ポルタは1563年の著書『デ・フルティヴィス・リテラルム・ノーティス』
          でこの方式を発表しました。同時代のベラーゾ（後に
          <Link to="/vigenere" className="cipher-link">ヴィジュネル暗号</Link>と誤って呼ばれるようになった暗号の考案者）
          とは、先に表を発表した功績を巡って論争になったと伝わっています。
        </p>
        <p className="note-text">
          ヴィジュネル暗号と同じく鍵が周期的に繰り返すため、
          <Link to="/cryptanalysis/kasiski" className="cipher-link">カシスキー試験</Link>で鍵の長さを推測できます。
          平文の一部が推測できれば、<Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>
          で使用中の表を直接絞り込むこともできます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        <label className="field key-field">
          鍵（英単語）
          <input
            type="text"
            className="key-input"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </label>
        {!cleanKey && <p className="key-status error">鍵にアルファベットを1文字以上入力してください</p>}

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

        <p className="steps-caption">
          ポルタ方陣（鍵に含まれるペアの行をハイライトしています）
        </p>
        <PortaTable activeRows={activeRows} />
      </section>
    </article>
  );
}
