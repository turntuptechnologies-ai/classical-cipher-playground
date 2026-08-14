import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CIPHER_CATALOG } from "../ciphers/catalog";

export default function CipherDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActive = CIPHER_CATALOG.some((cipher) => location.pathname === cipher.path);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="cipher-dropdown" ref={rootRef}>
      <button
        type="button"
        className={isActive ? "nav-link dropdown-trigger active" : "nav-link dropdown-trigger"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        暗号 <span className="dropdown-caret">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="dropdown-menu" role="menu">
          {CIPHER_CATALOG.map((cipher) => (
            <Link key={cipher.id} to={cipher.path} role="menuitem" className="dropdown-item">
              {cipher.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
