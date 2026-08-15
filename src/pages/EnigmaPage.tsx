import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DEFAULT_SETTINGS,
  ROTOR_IDS,
  enigmaProcess,
  letterToIndex,
  positionsToLetters,
  validatePlugboard,
  validateRotorSelection,
  type RotorId,
} from "../ciphers/enigma";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "HELLOCLASSICALCIPHER";
const SLOT_LABELS = ["左", "中央", "右"];

function toLetter(raw: string, fallback: string): string {
  const upper = raw.toUpperCase().replace(/[^A-Z]/g, "");
  return upper.length > 0 ? upper[0] : fallback;
}

export default function EnigmaPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [rotorIds, setRotorIds] = useState<[RotorId, RotorId, RotorId]>(DEFAULT_SETTINGS.rotorIds);
  const [ringLetters, setRingLetters] = useState<[string, string, string]>(["A", "A", "A"]);
  const [posLetters, setPosLetters] = useState<[string, string, string]>(["A", "A", "A"]);
  const [plugboard, setPlugboard] = useState("");

  const rotorValidation = useMemo(() => validateRotorSelection(rotorIds), [rotorIds]);
  const plugValidation = useMemo(() => validatePlugboard(plugboard), [plugboard]);

  const settings = useMemo(
    () => ({
      rotorIds,
      ringSettings: ringLetters.map((l) => letterToIndex(l)) as [number, number, number],
      positions: posLetters.map((l) => letterToIndex(l)) as [number, number, number],
    }),
    [rotorIds, ringLetters, posLetters],
  );

  const result = useMemo(() => {
    if (!rotorValidation.valid || !plugValidation.valid) return null;
    return enigmaProcess(input, settings, plugboard);
  }, [input, settings, plugboard, rotorValidation.valid, plugValidation.valid]);

  const output = result?.output ?? "";
  const windowPositions = result ? positionsToLetters(result.finalPositions) : positionsToLetters(settings.positions);
  const steps = result?.steps.slice(0, 40) ?? [];

  const updateRotor = (slot: 0 | 1 | 2, value: RotorId) => {
    const next = [...rotorIds] as [RotorId, RotorId, RotorId];
    next[slot] = value;
    setRotorIds(next);
  };
  const updateRing = (slot: 0 | 1 | 2, value: string) => {
    const next = [...ringLetters] as [string, string, string];
    next[slot] = toLetter(value, ringLetters[slot]);
    setRingLetters(next);
  };
  const updatePos = (slot: 0 | 1 | 2, value: string) => {
    const next = [...posLetters] as [string, string, string];
    next[slot] = toLetter(value, posLetters[slot]);
    setPosLetters(next);
  };

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>エニグマ暗号</h1>
        <p className="cipher-page-era">1920年代〜第二次世界大戦・ドイツ軍が使用した機械式暗号</p>
      </header>

      <section className="explanation">
        <p>
          エニグマは、キーを押すたびに<strong>回転するローター（歯車状の円盤）</strong>
          を複数枚組み合わせて、1文字ごとに異なる換字表を自動的に切り替える機械式暗号機です。
          信号は「プラグボード → ローター3枚（往路）→ リフレクター（反転板） →
          ローター3枚（復路）→ プラグボード」という経路を通ってランプを光らせます。
          リフレクターで信号が折り返す構造のおかげで<strong>暗号化と復号がまったく同じ操作</strong>
          になるのが特徴です（同じ設定で暗号文をもう一度エニグマに通すと平文に戻ります）。
        </p>
        <p>
          ローターの組み合わせ・順序・リング設定・初期位置・プラグボードの配線をすべて掛け合わせると
          鍵の組み合わせは天文学的な数になり、ドイツ軍は解読不可能と信じていました。
          しかし、ポーランドの暗号局とイギリス・ブレッチリー・パークのアラン・チューリングらの解読チームが
          弱点を突いて解読に成功し、第二次世界大戦の行方に大きな影響を与えたことで知られています。
          天気予報の決まり文句のような、推測できる平文（クリブ）を手がかりにする
          <Link to="/cryptanalysis/known-plaintext" className="cipher-link">既知平文攻撃</Link>が解読の突破口になりました。
        </p>
        <p className="note-text">
          ※ このページはドイツ陸軍・空軍で使われた3ローター式（Enigma I）を再現しています。
          リフレクターは最も一般的な「Wide B」に固定しています。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        <div className="enigma-config">
          <div className="enigma-rotor-row">
            {([0, 1, 2] as const).map((slot) => (
              <div key={slot} className="enigma-rotor-col">
                <span className="enigma-slot-label">{SLOT_LABELS[slot]}</span>
                <select value={rotorIds[slot]} onChange={(e) => updateRotor(slot, e.target.value as RotorId)}>
                  {ROTOR_IDS.map((id) => (
                    <option key={id} value={id}>
                      ローター{id}
                    </option>
                  ))}
                </select>
                <label className="enigma-letter-field">
                  リング
                  <input
                    type="text"
                    maxLength={1}
                    value={ringLetters[slot]}
                    onChange={(e) => updateRing(slot, e.target.value)}
                    className="mono"
                  />
                </label>
                <label className="enigma-letter-field">
                  初期位置
                  <input
                    type="text"
                    maxLength={1}
                    value={posLetters[slot]}
                    onChange={(e) => updatePos(slot, e.target.value)}
                    className="mono"
                  />
                </label>
              </div>
            ))}
          </div>
          {!rotorValidation.valid && <p className="key-status error">{rotorValidation.message}</p>}

          <label className="field">
            プラグボード配線（半角スペース区切りで最大10組。例: AB CD EF）
            <input
              type="text"
              value={plugboard}
              onChange={(e) => setPlugboard(e.target.value)}
              className="mono"
              placeholder="例: AB CD EF"
            />
          </label>
          <p className={plugValidation.valid ? "key-status ok" : "key-status error"}>{plugValidation.message}</p>
        </div>

        <div className="enigma-window-row">
          <span className="steps-caption">現在のローター表示窓（入力全体を処理した後の位置）</span>
          <div className="enigma-window">
            {windowPositions.split("").map((letter, i) => (
              <span key={i} className="enigma-window-cell">
                {letter}
              </span>
            ))}
          </div>
        </div>

        <label className="field">
          {mode === "encode" ? "平文" : "暗号文"}（アルファベットのみが処理されます。同じ設定なら暗号化・復号は同じ操作です）
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
        </label>

        <div className="result-box">
          <div className="result-header">
            <span>{mode === "encode" ? "暗号文" : "平文"}</span>
            <CopyButton text={output} />
          </div>
          <p className="result-text">
            {rotorValidation.valid && plugValidation.valid
              ? output || "（入力すると結果が表示されます）"
              : "設定を確認してください"}
          </p>
        </div>

        {steps.length > 0 && (
          <div className="steps-table-wrap">
            <p className="steps-caption">
              文字ごとの変換過程（先頭 {steps.length} 文字。中段は暗号化直前のローター位置＝左中右）
            </p>
            <table className="steps-table">
              <tbody>
                <tr>
                  <th scope="row">文字</th>
                  {steps.map((s, i) => (
                    <td key={i}>{s.char}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">ローター位置</th>
                  {steps.map((s, i) => (
                    <td key={i} className="key-cell">
                      {s.positions}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">結果</th>
                  {steps.map((s, i) => (
                    <td key={i} className="result-cell">
                      {s.result}
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
