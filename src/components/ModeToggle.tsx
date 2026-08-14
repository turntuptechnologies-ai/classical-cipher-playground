export type CipherMode = "encode" | "decode";

interface ModeToggleProps {
  mode: CipherMode;
  onChange: (mode: CipherMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle" role="group" aria-label="暗号化・復号の切り替え">
      <button
        type="button"
        className={mode === "encode" ? "toggle-button active" : "toggle-button"}
        onClick={() => onChange("encode")}
      >
        暗号化
      </button>
      <button
        type="button"
        className={mode === "decode" ? "toggle-button active" : "toggle-button"}
        onClick={() => onChange("decode")}
      >
        復号
      </button>
    </div>
  );
}
