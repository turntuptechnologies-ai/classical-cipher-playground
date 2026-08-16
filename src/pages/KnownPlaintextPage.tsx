import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CRYPTANALYSIS_CATALOG } from "../cryptanalysis/catalog";
import { recoverKeyFragment } from "../cryptanalysis/knownPlaintext";
import { vigenereEncode } from "../ciphers/vigenere";

const METHOD = CRYPTANALYSIS_CATALOG.find((m) => m.id === "known-plaintext")!;

const SAMPLE_PLAINTEXT = "ATTACKATDAWN";
const SAMPLE_KEY = "LION";
const DEFAULT_CIPHER_TEXT = vigenereEncode(SAMPLE_PLAINTEXT, SAMPLE_KEY);
const DEFAULT_CIPHER_FRAGMENT = DEFAULT_CIPHER_TEXT.slice(0, 8);
const DEFAULT_PLAIN_GUESS = "ATTACKAT";

export default function KnownPlaintextPage() {
  const [cipherFragment, setCipherFragment] = useState(DEFAULT_CIPHER_FRAGMENT);
  const [plainGuess, setPlainGuess] = useState(DEFAULT_PLAIN_GUESS);

  const result = useMemo(() => recoverKeyFragment(cipherFragment, plainGuess), [cipherFragment, plainGuess]);

  return (
    <article className="cipher-page cryptanalysis-method-page">
      <header className="cipher-page-header">
        <h1>{METHOD.name}</h1>
        <p className="cipher-page-era">第二次世界大戦、連合国のエニグマ解読でも使われた「クリブ」の考え方</p>
      </header>

      <section className="explanation">
        <p>
          軍隊の通信文には「本日晴天」のような決まり文句、日付、部隊名など、内容をある程度<strong>推測できる部分</strong>がよく含まれます。
          この推測した平文の断片を「クリブ（crib）」と呼びます。クリブが暗号文のどこに対応するか分かれば、
          頻度分析や総当たりに頼らず、その部分から直接<strong>鍵を逆算</strong>できます。
        </p>
        <p className="note-text">
          第二次世界大戦で連合国が<Link to="/enigma" className="cipher-link">エニグマ暗号</Link>を解読した際も、
          天気予報の決まり文句などのクリブを手がかりにローター設定を絞り込みました。
          <Link to="/playfair" className="cipher-link">プレイフェア暗号</Link>や
          <Link to="/adfgvx" className="cipher-link">ADFGVX暗号</Link>も同様にクリブから解読された記録が残っていますが、
          仕組みが複雑なぶん逆算の手順も複雑になります。ここでは仕組みがシンプルな
          <Link to="/vigenere" className="cipher-link">ヴィジュネル暗号</Link>を例に、考え方を体験してみましょう。
        </p>
        <p className="note-text">
          <Link to="/homophonic" className="cipher-link">ホモフォニック換字式暗号</Link>のようにコード表そのものが鍵になっている暗号でも、
          クリブが分かればコードと文字の対応がその場で判明します。
          <Link to="/porta" className="cipher-link">ポルタ暗号</Link>や
          <Link to="/autokey" className="cipher-link">オートキー暗号</Link>のような多表式暗号では、
          クリブから使用中の表や鍵そのものを直接絞り込めます。特にオートキー暗号は鍵が周期的に繰り返さず
          <Link to="/cryptanalysis/kasiski" className="cipher-link">カシスキー試験</Link>が効かないぶん、
          クリブが数少ない有効な手がかりになります。
          <Link to="/bifid" className="cipher-link">バイフィッド暗号</Link>のような座標を混ぜ合わせる暗号でも、
          クリブは方陣を推測する足がかりになります。
        </p>
      </section>

      <section className="playground">
        <p className="steps-caption">
          ヴィジュネル暗号は「暗号文 = 平文 + 鍵」で作られるため、「暗号文 − 平文」でその位置の鍵の文字が分かります。
        </p>

        <label className="field">
          暗号文の断片（クリブがあると思われる部分）
          <input
            type="text"
            className="key-input"
            value={cipherFragment}
            onChange={(e) => setCipherFragment(e.target.value)}
          />
        </label>

        <label className="field">
          推測した平文（クリブ）
          <input
            type="text"
            className="key-input"
            value={plainGuess}
            onChange={(e) => setPlainGuess(e.target.value)}
          />
        </label>
        {!result.valid && <p className="key-status error">{result.error}</p>}

        {result.valid && (
          <div className="result-box">
            <div className="result-header">
              <span>逆算できた鍵の断片</span>
            </div>
            <p className="result-text">{result.keyFragment}</p>
            {result.guessedKey !== result.keyFragment && (
              <p className="note-text">
                周期的に繰り返しているのが分かります。推定される鍵: <strong>{result.guessedKey}</strong>
              </p>
            )}
          </div>
        )}

        <p className="note-text">
          クリブの推測が間違っていると、鍵の断片はでたらめな（繰り返しのない）文字列になります。
          規則的な繰り返しが見えたら、クリブが正しく、鍵の周期も見つかったサインです。
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
