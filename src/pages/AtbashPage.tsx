import { useMemo, useState } from "react";
import { ALPHABET, atbashTransform, REVERSED_ALPHABET } from "../ciphers/atbash";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HELLO CLASSICAL CIPHER";

export default function AtbashPage() {
  const [input, setInput] = useState(DEFAULT_TEXT);

  const output = useMemo(() => atbashTransform(input), [input]);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>アトバシュ暗号</h1>
        <p className="cipher-page-era">紀元前〜・古代ヘブライ（旧約聖書に由来）</p>
      </header>

      <section className="explanation">
        <p>
          現存する最古級の換字式暗号のひとつです。仕組みは非常にシンプルで、
          アルファベットを<strong>先頭と末尾から向かい合わせにペアにして入れ替える</strong>だけ
          （A↔Z、B↔Y、C↔X…）です。旧約聖書のヘブライ語本文にこの手法で書かれた単語が
          見られることが名前の由来（ヘブライ文字の最初のא(アレフ)と最後のת(タウ)、
          2番目のב(ベート)と最後から2番目のש(シン)を組み合わせた語）とされています。
        </p>
        <p>
          鍵となるパラメータが一切なく、変換の規則は常に同じ1通りだけです。
          そのため<strong>暗号化と復号がまったく同じ操作</strong>になります
          （もう一度アトバシュ変換をかければ元に戻ります）。鍵がない分、
          仕組みさえ知られてしまえば誰でも即座に解読できてしまう、もっとも弱い暗号のひとつでもあります。
        </p>
      </section>

      <section className="playground">
        <div className="alphabet-map" aria-hidden="true">
          <div className="alphabet-row">
            {ALPHABET.split("").map((char) => (
              <span key={`plain-${char}`} className="alphabet-cell">
                {char}
              </span>
            ))}
          </div>
          <div className="alphabet-row shifted">
            {REVERSED_ALPHABET.split("").map((char, i) => (
              <span key={`cipher-${i}`} className="alphabet-cell">
                {char}
              </span>
            ))}
          </div>
        </div>

        <label className="field">
          文章（暗号化・復号は同じ操作です）
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
        </label>

        <div className="result-box">
          <div className="result-header">
            <span>変換結果</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>
      </section>
    </article>
  );
}
