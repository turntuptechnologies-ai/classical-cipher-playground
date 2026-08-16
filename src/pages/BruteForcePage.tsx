import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CRYPTANALYSIS_CATALOG } from "../cryptanalysis/catalog";
import { caesarDecode, caesarEncode } from "../ciphers/caesar";
import { scytaleDecode, scytaleEncode } from "../ciphers/scytale";

const METHOD = CRYPTANALYSIS_CATALOG.find((m) => m.id === "bruteforce")!;

const CAESAR_SAMPLE = caesarEncode("BRUTE FORCE ATTACKS TRY EVERY POSSIBLE KEY", 11);
const SCYTALE_SAMPLE = scytaleEncode("BRUTEFORCEATTACKSTRYEVERYPOSSIBLEKEY", 5);

const MAX_SCYTALE_FACES = 12;

export default function BruteForcePage() {
  const [caesarInput, setCaesarInput] = useState(CAESAR_SAMPLE);
  const [scytaleInput, setScytaleInput] = useState(SCYTALE_SAMPLE);

  const caesarCandidates = useMemo(
    () => Array.from({ length: 26 }, (_, shift) => ({ shift, text: caesarDecode(caesarInput, shift) })),
    [caesarInput],
  );

  const scytaleCandidates = useMemo(() => {
    const maxFaces = Math.min(MAX_SCYTALE_FACES, Math.max(2, scytaleInput.replace(/\s/g, "").length - 1));
    return Array.from({ length: maxFaces - 1 }, (_, i) => {
      const faces = i + 2;
      return { faces, text: scytaleDecode(scytaleInput, faces) };
    });
  }, [scytaleInput]);

  return (
    <article className="cipher-page cryptanalysis-method-page">
      <header className="cipher-page-header">
        <h1>{METHOD.name}</h1>
        <p className="cipher-page-era">鍵の候補が少ない暗号に対して有効な、もっとも単純な解読法</p>
      </header>

      <section className="explanation">
        <p>
          暗号によっては、鍵として考えられるパターンが数えられるほどしかないものがあります。
          そういう暗号は、鍵を推測しようとせず<strong>すべてのパターンを実際に試してしまう</strong>のが手っ取り早い解読法です。
          これを総当たり攻撃（ブルートフォース）と呼びます。
        </p>
        <p className="note-text">
          鍵の候補が膨大な暗号（<Link to="/vigenere" className="cipher-link">ヴィジュネル暗号</Link>や
          <Link to="/enigma" className="cipher-link">エニグマ暗号</Link>など）には現実的に使えません。
          その場合は他の手法で鍵の絞り込みが必要になります。
        </p>
      </section>

      <section className="playground">
        <h2>シーザー暗号: ずらし数は26通り</h2>
        <label className="field">
          暗号文を貼り付けてみましょう
          <textarea value={caesarInput} onChange={(e) => setCaesarInput(e.target.value)} rows={2} />
        </label>
        <div className="steps-table-wrap">
          <table className="steps-table data-table">
            <thead>
              <tr>
                <th scope="col">ずらし数</th>
                <th scope="col">復号結果</th>
              </tr>
            </thead>
            <tbody>
              {caesarCandidates.map(({ shift, text }) => (
                <tr key={shift}>
                  <th scope="row">{shift}</th>
                  <td className="data-table-result">{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="playground">
        <h2>スキュタレー暗号: 棒の面数（太さ）を総当たり</h2>
        <label className="field">
          暗号文を貼り付けてみましょう
          <textarea value={scytaleInput} onChange={(e) => setScytaleInput(e.target.value)} rows={2} />
        </label>
        <div className="steps-table-wrap">
          <table className="steps-table data-table">
            <thead>
              <tr>
                <th scope="col">面数</th>
                <th scope="col">復号結果</th>
              </tr>
            </thead>
            <tbody>
              {scytaleCandidates.map(({ faces, text }) => (
                <tr key={faces}>
                  <th scope="row">{faces}</th>
                  <td className="data-table-result">{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
