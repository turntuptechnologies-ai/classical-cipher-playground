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

      <section className="challenge-cta">
        <div>
          <h2>ひととおり試したら、解読チャレンジに挑戦してみましょう</h2>
          <p>学んだ暗号を使って、実際に暗号文を解読するミニパズルです。ヒントは段階的に開示されます。</p>
        </div>
        <Link to="/challenges" className="cipher-cta">
          チャレンジ一覧へ →
        </Link>
      </section>
    </div>
  );
}
