import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CRYPTANALYSIS_CATALOG } from "../cryptanalysis/catalog";
import { findRepeatedSequences, suggestKeyLengths } from "../cryptanalysis/kasiski";
import { vigenereEncode } from "../ciphers/vigenere";

const METHOD = CRYPTANALYSIS_CATALOG.find((m) => m.id === "kasiski")!;

const SAMPLE_PLAINTEXT =
  "THEENEMYATTACKSATDAWN THEENEMYATTACKSATDAWN SOONAGAIN SOONAGAIN NEXT WEEK";
const DEFAULT_TEXT = vigenereEncode(SAMPLE_PLAINTEXT, "KEY");

const MAX_ROWS = 10;
const MAX_KEY_LENGTH = 12;

export default function KasiskiPage() {
  const [input, setInput] = useState(DEFAULT_TEXT);

  const repeats = useMemo(() => findRepeatedSequences(input), [input]);
  const candidates = useMemo(() => suggestKeyLengths(repeats, MAX_KEY_LENGTH), [repeats]);

  return (
    <article className="cipher-page cryptanalysis-method-page">
      <header className="cipher-page-header">
        <h1>{METHOD.name}</h1>
        <p className="cipher-page-era">19世紀・プロイセンの将校フリードリヒ・カシスキーが体系化</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/vigenere" className="cipher-link">ヴィジュネル暗号</Link>のように鍵の文字ごとにずらし幅を変える暗号には、
          <Link to="/cryptanalysis/frequency" className="cipher-link">頻度分析</Link>がそのままでは通用しません。
          そこでまず必要になるのが「鍵の長さ」を推測することです。
        </p>
        <p>
          平文の中に同じ単語やフレーズが繰り返し登場し、その間隔がたまたま鍵の長さの倍数になっていると、
          暗号文の中にも<strong>同じ文字列がそのまま繰り返して</strong>現れます。
          この繰り返しを見つけて間隔を測り、間隔の約数を鍵の長さの候補とするのがカシスキー試験です。
        </p>
        <p className="note-text">
          鍵の長さが分かれば、暗号文をその長さごとに列に分けることで各列は単一換字式暗号と同じ扱いになり、
          列ごとに頻度分析にかけられます。
        </p>
      </section>

      <section className="playground">
        <label className="field">
          暗号文を貼り付けてみましょう
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} />
        </label>

        <div>
          <p className="steps-caption">
            繰り返し現れる3文字の並び{repeats.length > MAX_ROWS && `（上位${MAX_ROWS}件を表示、全${repeats.length}件）`}
          </p>
          <div className="steps-table-wrap">
            <table className="steps-table bruteforce-table">
              <thead>
                <tr>
                  <th scope="col">文字列</th>
                  <th scope="col">出現位置</th>
                  <th scope="col">間隔</th>
                </tr>
              </thead>
              <tbody>
                {repeats.slice(0, MAX_ROWS).map((r) => (
                  <tr key={r.sequence}>
                    <th scope="row">{r.sequence}</th>
                    <td className="bruteforce-result">{r.positions.join(", ")}</td>
                    <td className="bruteforce-result">{r.distances.join(", ")}</td>
                  </tr>
                ))}
                {repeats.length === 0 && (
                  <tr>
                    <td colSpan={3}>繰り返しが見つかりませんでした</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="steps-caption">鍵の長さの候補（間隔の約数として一致した回数が多い順）</p>
          <div className="steps-table-wrap">
            <table className="steps-table bruteforce-table">
              <thead>
                <tr>
                  <th scope="col">鍵の長さ</th>
                  <th scope="col">一致した回数</th>
                </tr>
              </thead>
              <tbody>
                {candidates.slice(0, 8).map((c) => (
                  <tr key={c.length}>
                    <th scope="row">{c.length}</th>
                    <td className="bruteforce-result">{c.votes}</td>
                  </tr>
                ))}
                {candidates.length === 0 && (
                  <tr>
                    <td colSpan={2}>候補が見つかりませんでした</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="note-text">
          候補が複数並ぶこともあります（間隔6は3の倍数でもあるため、鍵長3と6の両方に投票されるなど）。
          その場合は候補ごとに列分けして頻度分析を試し、いちばん英文らしい分布になるものを選びます。
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
