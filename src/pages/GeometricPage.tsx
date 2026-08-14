import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ROUTE_LABEL,
  geometricDecode,
  geometricEncode,
  geometricGrid,
  routeOrderGrid,
  type Route,
} from "../ciphers/geometric";
import ModeToggle, { type CipherMode } from "../components/ModeToggle";
import CopyButton from "../components/CopyButton";

const DEFAULT_TEXT = "ATTACKATDAWNBRINGSUPPLIES";
const MAX_GRID_CHARS = 48;
const ROUTES: Route[] = ["column", "diagonal", "spiral"];

export default function GeometricPage() {
  const [mode, setMode] = useState<CipherMode>("encode");
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [rows, setRows] = useState(4);
  const [route, setRoute] = useState<Route>("column");

  const output = useMemo(
    () => (mode === "encode" ? geometricEncode(input, rows, route) : geometricDecode(input, rows, route)),
    [input, rows, route, mode],
  );

  const gridSource = mode === "encode" ? input : output;
  const writeGrid = useMemo(
    () => (gridSource.length <= MAX_GRID_CHARS ? geometricGrid(gridSource, rows) : null),
    [gridSource, rows],
  );
  const cols = writeGrid?.[0]?.length ?? 0;
  const orderGrid = useMemo(
    () => (writeGrid ? routeOrderGrid(rows, cols, route) : null),
    [writeGrid, rows, cols, route],
  );

  return (
    <article className="cipher-page">
      <header className="cipher-page-header">
        <h1>図形転置式暗号</h1>
        <p className="cipher-page-era">
          転置式暗号の基本形（<Link to="/scytale" className="cipher-link">スキュタレー暗号</Link>・
          <Link to="/railfence" className="cipher-link">レールフェンス暗号</Link>の仲間）
        </p>
      </header>

      <section className="explanation">
        <p>
          平文を長方形の升目に<strong>横方向（行優先）で書き込み</strong>、書き込みとは違う向き・経路で
          <strong>読み出す</strong>ことで文字を並べ替える、転置式暗号の基本パターンです。
          読み出し方（ルート）自体が鍵になり、キーワードは使いません。
        </p>
        <p>
          「列読み（縦方向にそのまま読む）」は<Link to="/scytale" className="cipher-link">スキュタレー暗号</Link>とまったく同じ仕組みです。
          このページでは、それに加えて「斜め読み」「渦巻き読み」というルートも試せます。
          升目の作り方や読み方を変えるだけで、同じ平文からまったく違う暗号文が作れることを体感してみましょう。
        </p>
      </section>

      <section className="playground">
        <div className="control-row">
          <ModeToggle mode={mode} onChange={setMode} />
          <label className="shift-control">
            行数
            <input type="range" min={2} max={8} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
            <input
              type="number"
              min={2}
              max={8}
              value={rows}
              onChange={(e) => setRows(Math.max(2, Math.min(8, Number(e.target.value) || 2)))}
              className="shift-number"
            />
          </label>
        </div>

        <div className="mode-toggle" role="group" aria-label="読み出しルートの切り替え">
          {ROUTES.map((r) => (
            <button
              key={r}
              type="button"
              className={r === route ? "toggle-button active" : "toggle-button"}
              onClick={() => setRoute(r)}
            >
              {ROUTE_LABEL[r]}
            </button>
          ))}
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
          <p className="result-text">{output || "（入力すると結果が表示されます）"}</p>
        </div>

        {writeGrid && orderGrid && (
          <>
            <div className="railfence-grid-wrap">
              <p className="steps-caption">
                升目への書き込み（{mode === "encode" ? "平文" : "暗号文"}を横方向に書き込んだ様子）
              </p>
              <div className="railfence-grid">
                {writeGrid.map((rowCells, r) => (
                  <div className="railfence-row" key={r}>
                    {rowCells.map((cell, c) => (
                      <span key={c} className={cell ? "rail-cell filled" : "rail-cell"}>
                        {cell ?? ""}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="railfence-grid-wrap">
              <p className="steps-caption">読み出し順（{ROUTE_LABEL[route]}・数字が小さい順に読みます）</p>
              <div className="railfence-grid">
                {orderGrid.map((rowCells, r) => (
                  <div className="railfence-row" key={r}>
                    {rowCells.map((n, c) => (
                      <span key={c} className="rail-cell filled order-cell">
                        {n}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {!writeGrid && gridSource.length > MAX_GRID_CHARS && (
          <p className="steps-caption">（{MAX_GRID_CHARS}文字を超えると升目は表示されません）</p>
        )}
      </section>
    </article>
  );
}
