import { useMemo, useState } from "react";
import { uesugiDecode, uesugiEncode, uesugiEncodeTokens } from "../ciphers/uesugi";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";
import UesugiGrid from "../components/UesugiGrid";

const DEFAULT_PLAIN = "てきみゆ";
const DEFAULT_CIPHER = "5-7 6-3 6-6 6-4";

export default function UesugiPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [plainInput, setPlainInput] = useState(DEFAULT_PLAIN);
  const [cipherInput, setCipherInput] = useState(DEFAULT_CIPHER);

  const encodeTokens = useMemo(() => uesugiEncodeTokens(plainInput), [plainInput]);
  const output = useMemo(() => {
    return mode === "encode" ? uesugiEncode(plainInput) : uesugiDecode(cipherInput);
  }, [mode, plainInput, cipherInput]);

  const activeChars = useMemo(() => {
    if (mode === "encode") {
      return new Set(encodeTokens.filter((t) => t.row !== null).map((t) => t.normalized));
    }
    return new Set([...output].filter((c) => c.trim().length > 0));
  }, [mode, encodeTokens, output]);

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>上杉暗号</h1>
        <p className="cipher-page-era">戦国時代（伝）・上杉謙信の軍師 宇佐美定行が考案したと伝わる</p>
      </header>

      <section className="explanation">
        <p>
          「いろは48文字」（いろは47音に「ん」を加えたもの）を7×7の表に並べ、
          文字を<strong>「行の番号」と「列の番号」の組み合わせ</strong>で表す暗号です。
          例えば「て」は5行7列目にあるので「5-7」と表されます。
          ヨーロッパのポリュビオス暗号（座標式暗号）と同じ考え方を、独自にいろは表で実現したものといえます。
        </p>
        <p>
          上杉謙信の軍師・宇佐美定行が考案したという説がよく紹介されますが、
          確実な史料による裏付けは薄く、江戸時代以降に創作された可能性も指摘されています。
          真偽はともかく、「表の並べ替えパターンを合言葉のように使い分ければ鍵を増やせる」という発想は、
          後の暗号にも通じる面白い工夫です。
        </p>
        <p className="note-text">
          ※ 濁点・半濁点・拗音（ゃゅょ）・促音（っ）は、清音の文字に変換してから表を引きます。
          ひらがな・カタカナ以外の文字（漢字・記号など）はそのまま暗号文に残り、空白は読み飛ばされます。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        {mode === "encode" ? (
          <label className="field">
            平文（ひらがな・カタカナ）
            <textarea value={plainInput} onChange={(e) => setPlainInput(e.target.value)} rows={3} />
          </label>
        ) : (
          <label className="field">
            暗号文（「行-列」を半角スペース区切りで。例: 5-7 6-3）
            <textarea
              value={cipherInput}
              onChange={(e) => setCipherInput(e.target.value)}
              rows={3}
              className="mono"
            />
          </label>
        )}

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文" : "平文"}</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        <UesugiGrid activeChars={activeChars} />

        {mode === "encode" && encodeTokens.length > 0 && (
          <div className="steps-table-wrap">
            <p className="steps-caption">文字ごとの変換過程</p>
            <table className="steps-table">
              <tbody>
                <tr>
                  <th scope="row">文字</th>
                  {encodeTokens.map((t, i) => (
                    <td key={i}>{t.normalized}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">座標</th>
                  {encodeTokens.map((t, i) => (
                    <td key={i} className="result-cell">
                      {t.code}
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
