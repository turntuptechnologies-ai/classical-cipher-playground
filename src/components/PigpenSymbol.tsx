import type { PigpenSymbol as PigpenSymbolType } from "../ciphers/pigpen";

const SIZE = 40;
const PAD = 4;
const MIN = PAD;
const MAX = SIZE - PAD;
const MID = SIZE / 2;

interface PigpenSymbolProps {
  symbol: PigpenSymbolType;
  size?: number;
}

export default function PigpenSymbol({ symbol, size = SIZE }: PigpenSymbolProps) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      className="pigpen-symbol"
      role="img"
      aria-hidden="true"
    >
      {symbol.kind === "grid" ? <GridGlyph symbol={symbol} /> : <XGlyph symbol={symbol} />}
    </svg>
  );
}

function GridGlyph({ symbol }: { symbol: Extract<PigpenSymbolType, { kind: "grid" }> }) {
  const { row, col, dotted } = symbol;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  if (col > 0) lines.push({ x1: MIN, y1: MIN, x2: MIN, y2: MAX }); // 左辺
  if (col < 2) lines.push({ x1: MAX, y1: MIN, x2: MAX, y2: MAX }); // 右辺
  if (row > 0) lines.push({ x1: MIN, y1: MIN, x2: MAX, y2: MIN }); // 上辺
  if (row < 2) lines.push({ x1: MIN, y1: MAX, x2: MAX, y2: MAX }); // 下辺

  return (
    <>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="currentColor" strokeWidth={3} />
      ))}
      {dotted && <circle cx={MID} cy={MID} r={2.6} fill="currentColor" />}
    </>
  );
}

function XGlyph({ symbol }: { symbol: Extract<PigpenSymbolType, { kind: "x" }> }) {
  const { side, dotted } = symbol;
  const corners = {
    top: [
      { x: MIN, y: MIN },
      { x: MAX, y: MIN },
    ],
    right: [
      { x: MAX, y: MIN },
      { x: MAX, y: MAX },
    ],
    bottom: [
      { x: MIN, y: MAX },
      { x: MAX, y: MAX },
    ],
    left: [
      { x: MIN, y: MIN },
      { x: MIN, y: MAX },
    ],
  }[side];

  const dotPos = {
    top: { x: MID, y: MID - 8 },
    right: { x: MID + 8, y: MID },
    bottom: { x: MID, y: MID + 8 },
    left: { x: MID - 8, y: MID },
  }[side];

  return (
    <>
      <line x1={corners[0].x} y1={corners[0].y} x2={MID} y2={MID} stroke="currentColor" strokeWidth={3} />
      <line x1={corners[1].x} y1={corners[1].y} x2={MID} y2={MID} stroke="currentColor" strokeWidth={3} />
      {dotted && <circle cx={dotPos.x} cy={dotPos.y} r={2.6} fill="currentColor" />}
    </>
  );
}
