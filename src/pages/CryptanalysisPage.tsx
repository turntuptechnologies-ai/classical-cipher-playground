import { Link } from "react-router-dom";
import { CRYPTANALYSIS_CATALOG } from "../cryptanalysis/catalog";

export default function CryptanalysisPage() {
  return (
    <div className="cryptanalysis-page">
      <header className="cipher-page-header">
        <h1>解読方法</h1>
      </header>

      <p className="explanation-lead">
        各暗号のページでは「暗号化・復号のやり方」を学びましたが、実際の解読者は鍵を知らない状態から暗号文に挑みます。
        ここでは、鍵を持たずに暗号文を読み解くための古典的な考え方・手法を紹介します。
        ひととおり読んだら、<Link to="/challenges" className="cipher-link">解読チャレンジ</Link>
        で実際に試してみましょう。
      </p>

      <div className="cipher-grid">
        {CRYPTANALYSIS_CATALOG.map((method) => (
          <Link key={method.id} to={method.path} className="cipher-card">
            <h2>{method.name}</h2>
            <p className="cipher-tagline">{method.tagline}</p>
            <p className="cryptanalysis-applies-to">
              対応: {method.appliesTo.map((c) => c.name).join("・")}
            </p>
            <span className="card-chevron" aria-hidden="true">
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
