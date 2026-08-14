import { Link, NavLink, Outlet } from "react-router-dom";
import CipherDropdown from "./CipherDropdown";

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="site-title">
          古典暗号プレイグラウンド
        </Link>
        <nav className="site-nav">
          <CipherDropdown />
          <NavLink to="/cryptanalysis" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            🔍 解読方法
          </NavLink>
          <NavLink to="/challenges" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            🏆 チャレンジ
          </NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>
          古典暗号プレイグラウンド ―
          <a href="https://github.com/turntuptechnologies-ai/classical-cipher-playground" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
