import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CRYPTANALYSIS_CATALOG } from "../cryptanalysis/catalog";
import { columnarEncode, decodeColumns } from "../ciphers/columnar";
import { parseColumnOrder } from "../cryptanalysis/transposition";

const METHOD = CRYPTANALYSIS_CATALOG.find((m) => m.id === "anagram")!;

const SAMPLE_PLAINTEXT = "MEETMEATTHEOLDBRIDGEATMIDNIGHT";
const DEFAULT_TEXT = columnarEncode(SAMPLE_PLAINTEXT, "ZEBRA");
const DEFAULT_COLUMNS = 5;

export default function AnagramPage() {
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [orderInput, setOrderInput] = useState(
    Array.from({ length: DEFAULT_COLUMNS }, (_, i) => i + 1).join(","),
  );

  const parsed = useMemo(() => parseColumnOrder(orderInput, columns), [orderInput, columns]);
  const result = useMemo(
    () => (parsed.valid ? decodeColumns(input, columns, parsed.order) : ""),
    [input, columns, parsed],
  );

  return (
    <article className="cipher-page cryptanalysis-method-page">
      <header className="cipher-page-header">
        <h1>{METHOD.name}</h1>
        <p className="cipher-page-era">転置式暗号に対する、地道だが確実な崩し方</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/scytale" className="cipher-link">スキュタレー暗号</Link>や
          <Link to="/railfence" className="cipher-link">レールフェンス暗号</Link>、
          <Link to="/columnar" className="cipher-link">列転置暗号</Link>のような転置式暗号は、
          文字を<strong>置き換えず並び替えるだけ</strong>です。そのため暗号文の文字の出現頻度は平文とまったく同じで、
          <Link to="/cryptanalysis/frequency" className="cipher-link">頻度分析</Link>は通用しません。
        </p>
        <p>
          かわりに、文章の長さの約数を列数の候補として試し、列の並び順を入れ替えながら
          「読める文章になるか」を実際に確かめていきます。これはアナグラム（文字の並べ替えパズル）を解くのと同じ作業です。
        </p>
      </section>

      <section className="playground">
        <label className="field">
          暗号文を貼り付けてみましょう
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
        </label>

        <div className="control-row">
          <label className="shift-control">
            列数
            <input
              type="number"
              min={2}
              max={26}
              value={columns}
              onChange={(e) => setColumns(Math.max(2, Math.min(26, Number(e.target.value) || 2)))}
              className="shift-number"
            />
          </label>
        </div>

        <label className="field key-field">
          列の並び順（1〜{columns}の数字をカンマ区切りで、何番目に読み出す列かを指定）
          <input
            type="text"
            className="key-input"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
          />
        </label>
        {!parsed.valid && <p className="key-status error">{parsed.error}</p>}

        <div className="result-box">
          <div className="result-header">
            <span>この並び順での復号結果</span>
          </div>
          <p className="result-text">{result || "（列数と並び順を入力すると結果が表示されます）"}</p>
        </div>

        <p className="note-text">
          読める文章にならなければ、並び順を入れ替えて試してみましょう。文章の長さが列数で割り切れない場合、
          最後の行は途中の列までしか埋まらない点にも注意が必要です。
        </p>
      </section>

      <section className="explanation">
        <h2>この手法が効く暗号</h2>
        <p className="cryptanalysis-applies-to">
          {METHOD.appliesTo.map((cipher, i) => (
            <span key={cipher.path}>
              {i > 0 && "・"}
              <Link to={cipher.path} className="cipher-link">{cipher.name}</Link>
            </span>
          ))}
        </p>
      </section>
    </article>
  );
}
