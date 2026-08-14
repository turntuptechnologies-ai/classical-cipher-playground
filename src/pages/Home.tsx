import { Link } from "react-router-dom";
import { CIPHER_CATALOG } from "../ciphers/catalog";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>古典暗号を、実際に使って学ぶ</h1>
        <p>
          コンピュータが生まれるずっと前から、人は秘密のメッセージを送り合ってきました。
          このサイトでは、歴史上実際に使われた古典暗号（クラシカル・サイファー）の仕組みを、
          文章を打ち込んで暗号化・復号しながら体験できます。
        </p>
      </section>

      <section className="cipher-grid">
        {CIPHER_CATALOG.map((cipher) => (
          <Link key={cipher.id} to={cipher.path} className="cipher-card">
            <span className={`type-badge type-${cipher.type === "換字式" ? "substitution" : "transposition"}`}>
              {cipher.type}
            </span>
            <h2>{cipher.name}</h2>
            <p className="cipher-era">{cipher.era}</p>
            <p className="cipher-tagline">{cipher.tagline}</p>
            <span className="cipher-cta">試してみる →</span>
          </Link>
        ))}
      </section>

      <section className="roadmap">
        <h2>今後追加予定</h2>
        <ul>
          <li>暗号解読チャレンジ（ヒント付きでciphertextを解読する問題）</li>
          <li>エニグマ暗号（第二次世界大戦で使われた機械式暗号）</li>
        </ul>
      </section>
    </div>
  );
}
