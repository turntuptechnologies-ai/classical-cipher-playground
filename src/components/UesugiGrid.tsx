import { GRID_SIZE, uesugiGrid } from "../ciphers/uesugi";

const GRID = uesugiGrid();
const HEADERS = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);

interface UesugiGridProps {
  activeChars: Set<string>;
}

export default function UesugiGrid({ activeChars }: UesugiGridProps) {
  return (
    <div className="uesugi-grid-wrap">
      <table className="uesugi-grid">
        <thead>
          <tr>
            <th className="corner-cell">列＼行</th>
            {HEADERS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HEADERS.map((row) => (
            <tr key={row}>
              <th scope="row">{row}</th>
              {HEADERS.map((col) => {
                const char = GRID[row - 1][col - 1];
                const isActive = char !== "" && activeChars.has(char);
                return (
                  <td key={col} className={isActive ? "uesugi-cell active" : "uesugi-cell"}>
                    {char || "―"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
