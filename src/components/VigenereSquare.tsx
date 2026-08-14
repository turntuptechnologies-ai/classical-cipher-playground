import { tabulaRecta } from "../ciphers/vigenere";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SQUARE = tabulaRecta();

interface VigenereSquareProps {
  activeKeyLetters: string[];
}

export default function VigenereSquare({ activeKeyLetters }: VigenereSquareProps) {
  const activeSet = new Set(activeKeyLetters);

  return (
    <div className="vigenere-square-wrap">
      <table className="vigenere-square">
        <thead>
          <tr>
            <th className="corner-cell">鍵＼平文</th>
            {ALPHABET.split("").map((col) => (
              <th key={col} className="col-header">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALPHABET.split("").map((rowLabel, r) => (
            <tr key={rowLabel} className={activeSet.has(rowLabel) ? "square-row active" : "square-row"}>
              <th className="row-header">{rowLabel}</th>
              {SQUARE[r].map((cell, c) => (
                <td key={c}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
