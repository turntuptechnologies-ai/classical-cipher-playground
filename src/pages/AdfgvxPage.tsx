import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adfgvxDecode, adfgvxEncodeSteps, buildAdfgvxSquare } from "../ciphers/adfgvx";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "ATTACK AT DAWN";
const DEFAULT_SQUARE_KEY = "GERMANY";
const DEFAULT_TRANS_KEY = "SECRET";
const LABELS = ["A", "D", "F", "G", "V", "X"];

export default function AdfgvxPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [squareKey, setSquareKey] = useState(DEFAULT_SQUARE_KEY);
  const [transKey, setTransKey] = useState(DEFAULT_TRANS_KEY);

  const square = useMemo(() => buildAdfgvxSquare(squareKey), [squareKey]);

  const encodeSteps = useMemo(
    () => (mode === "encode" ? adfgvxEncodeSteps(input, squareKey, transKey) : null),
    [mode, input, squareKey, transKey],
  );

  const output = useMemo(
    () => (mode === "encode" ? (encodeSteps?.ciphertext ?? "") : adfgvxDecode(input, squareKey, transKey)),
    [mode, input, squareKey, transKey, encodeSteps],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>ADFGVX暗号</h1>
        <p className="cipher-page-era">1918年・第一次世界大戦・ドイツ軍</p>
      </header>

      <section className="explanation">
        <p>
          第一次世界大戦でドイツ軍が西部戦線の攻勢（皇帝の戦い）で使用した、
          当時「解読不能」と評された2段階の暗号です。まず26文字と数字0〜9の36種類を
          6×6の<Link to="/polybius" className="cipher-link">ポリュビオス</Link>方陣に並べ、各文字を <code>A D F G V X</code> の2文字の座標に変換します
          （この6文字は、モールス信号で送ったときに聞き間違えにくいという理由で選ばれました）。
          次に、その結果を<strong>別の鍵（転置鍵）で列の順番を並べ替える</strong>
          <Link to="/columnar" className="cipher-link">列転置暗号</Link>にかけます。
          <Link to="/uesugi" className="cipher-link">上杉暗号</Link>のような座標変換と、
          <Link to="/geometric" className="cipher-link">図形転置式暗号</Link>のような並べ替えを組み合わせた、いわば合わせ技です。
        </p>
        <p className="note-text">
          ※ フランスの暗号解読者ジョルジュ・パンヴァンがこの暗号を解読したことは、
          第一次世界大戦の帰趨に影響を与えたとされています。攻撃してくる部隊や時刻など、
          平文の一部を推測する<Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>
          が手がかりになりました。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        <div className="control-row">
          <label className="field key-field">
            方陣の鍵
            <input
              type="text"
              value={squareKey}
              onChange={(e) => setSquareKey(e.target.value)}
              className="key-input mono"
              placeholder="例: GERMANY"
            />
          </label>
          <label className="field key-field">
            転置の鍵
            <input
              type="text"
              value={transKey}
              onChange={(e) => setTransKey(e.target.value)}
              className="key-input mono"
              placeholder="例: SECRET"
            />
          </label>
        </div>

        <label className="field">
          {mode === "encode" ? "平文（アルファベット・数字）" : "暗号文（ADFGVXの並び）"}
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="mono" />
        </label>

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文" : "平文"}</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        {mode === "encode" && encodeSteps && encodeSteps.fractionated && (
          <div className="result-box">
            <div className="result-header">
              <span>途中経過：座標変換（分数化）の結果</span>
            </div>
            <p className="result-text mono">{encodeSteps.fractionated}</p>
          </div>
        )}

        <div className="playfair-grid-wrap">
          <p className="steps-caption">
            6×6の<Link to="/polybius" className="cipher-link">ポリュビオス</Link>方陣（方陣の鍵から生成）
          </p>
          <table className="uesugi-grid">
            <thead>
              <tr>
                <th className="corner-cell">＼</th>
                {LABELS.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LABELS.map((rowLabel, r) => (
                <tr key={rowLabel}>
                  <th scope="row">{rowLabel}</th>
                  {LABELS.map((_, c) => (
                    <td key={c}>{square[r * 6 + c]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
