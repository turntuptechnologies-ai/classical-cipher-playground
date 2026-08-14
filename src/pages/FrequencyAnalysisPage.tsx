import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CRYPTANALYSIS_CATALOG } from "../cryptanalysis/catalog";
import { ENGLISH_REFERENCE_ENTRIES, computeFrequency } from "../cryptanalysis/frequency";
import { caesarEncode } from "../ciphers/caesar";
import FrequencyChart from "../components/FrequencyChart";

const METHOD = CRYPTANALYSIS_CATALOG.find((m) => m.id === "frequency")!;

const SAMPLE_PLAINTEXT =
  "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG. PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS.";
const DEFAULT_TEXT = caesarEncode(SAMPLE_PLAINTEXT, 7);

export default function FrequencyAnalysisPage() {
  const [input, setInput] = useState(DEFAULT_TEXT);

  const inputFrequency = useMemo(() => computeFrequency(input), [input]);

  return (
    <article className="cipher-page cryptanalysis-method-page">
      <header className="cipher-page-header">
        <h1>{METHOD.name}</h1>
        <p className="cipher-page-era">9世紀ごろ・アラビアの学者アル＝キンディーが考案したと言われる</p>
      </header>

      <section className="explanation">
        <p>
          <Link to="/caesar" className="cipher-link">シーザー暗号</Link>や
          <Link to="/substitution" className="cipher-link">単一換字式暗号</Link>のような換字式暗号では、
          平文のある文字は暗号文の中でも常に同じ文字に置き換わります。つまり文章全体の
          「どの文字がどれだけ出てくるか」という<strong>出現頻度の偏り</strong>は、暗号化されても崩れずそのまま暗号文に引き継がれます。
        </p>
        <p>
          英文には出現しやすい文字の偏りがあり、E・T・A…の順に多く登場することが知られています。
          暗号文の中でいちばん多く出てくる文字を「おそらくE」と仮定するところから解読が始まる、というのが頻度分析の基本的な考え方です。
        </p>
        <p className="note-text">
          ただし文章が短いと頻度の偏りが出にくく効果は弱まります。また
          <Link to="/vigenere" className="cipher-link">ヴィジュネル暗号</Link>のように1文字ごとにずらし幅を変える暗号には、
          このままでは通用しません（鍵の長さを推測する別の手法が必要になります）。
        </p>
      </section>

      <section className="playground">
        <label className="field">
          暗号文を貼り付けてみましょう
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} />
        </label>

        <div className="frequency-charts-row">
          <FrequencyChart title="この文章の頻度" entries={inputFrequency} />
          <FrequencyChart title="英文の一般的な頻度（目安）" entries={ENGLISH_REFERENCE_ENTRIES} />
        </div>

        <p className="note-text">
          2つのグラフの形（山の位置）が似ていれば、暗号文中で頻度の高い文字ほど平文ではE・T・Aである可能性が高い、と読めます。
          上の例文は<Link to="/caesar" className="cipher-link">シーザー暗号</Link>で暗号化したものなので、
          いちばん多い文字から逆算するとずらし数を推測できます。
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
