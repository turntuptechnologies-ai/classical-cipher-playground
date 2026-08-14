import { useMemo, useState } from "react";
import {
  ALPHABET,
  randomKey,
  substitutionDecode,
  substitutionEncode,
  validateKey,
} from "../ciphers/substitution";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HELLO CLASSICAL CIPHER";

export default function SubstitutionPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [key, setKey] = useState(() => randomKey());

  const validation = useMemo(() => validateKey(key), [key]);

  const output = useMemo(() => {
    if (!validation.valid) return "";
    return mode === "encode" ? substitutionEncode(input, key) : substitutionDecode(input, key);
  }, [input, key, mode, validation.valid]);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>単一換字式暗号</h1>
        <p className="cipher-page-era">9世紀ごろ・アラビアで解読理論が確立</p>
      </header>

      <section className="explanation">
        <p>
          シーザー暗号は「決まった数だけずらす」という規則がありましたが、
          単一換字式暗号はもっと自由に、<strong>アルファベット26文字をバラバラに並べ替えた表</strong>{" "}
          を使って一文字ずつ置き換えます。組み合わせは 26! （約4×10²⁶通り）あり、総当たりでは事実上解読不可能です。
        </p>
        <p>
          ところが実際には、9世紀のアラビアの学者アル・キンディーが発見した
          <strong>頻度分析</strong>（言語ごとに文字の出現頻度に偏りがあることを利用する手法）によって、
          文章がある程度長ければ簡単に解読できてしまいます。「組み合わせの多さ」だけでは安全にならない、という好例です。
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
          換字表の鍵（A〜Zの並び替え・26文字）
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            maxLength={26}
            className="key-input mono"
          />
        </label>
        <p className={validation.valid ? "key-status ok" : "key-status error"}>{validation.message}</p>

        <div className="alphabet-map" aria-hidden="true">
          <div className="alphabet-row">
            {ALPHABET.split("").map((char) => (
              <span key={`plain-${char}`} className="alphabet-cell">
                {char}
              </span>
            ))}
          </div>
          <div className="alphabet-row shifted">
            {key
              .padEnd(26, "?")
              .slice(0, 26)
              .split("")
              .map((char, i) => (
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
          <p className="result-text">
            {validation.valid ? output || "（入力すると結果が表示されます）" : "鍵が不正なため計算できません"}
          </p>
        </div>
      </section>
    </article>
  );
}
