import { keyPairLabel, portaSquare } from "../ciphers/porta";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SQUARE = portaSquare();

interface PortaTableProps {
  activeRows: number[];
}

export default function PortaTable({ activeRows }: PortaTableProps) {
  const activeSet = new Set(activeRows);

  return (
    <div className="vigenere-square-wrap">
      <table className="vigenere-square">
        <thead>
          <tr>
            <th className="corner-cell">鍵ペア＼平文</th>
            {ALPHABET.split("").map((col) => (
              <th key={col} className="col-header">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SQUARE.map((row, r) => (
            <tr key={keyPairLabel(r)} className={activeSet.has(r) ? "square-row active" : "square-row"}>
              <th className="row-header">{keyPairLabel(r)}</th>
              {row.map((cell, c) => (
                <td key={c}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
