import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CHALLENGES, DIFFICULTY_LABEL } from "../challenges/data";
import { getSolvedIds } from "../challenges/progress";

export default function ChallengesPage() {
  const [solved, setSolved] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSolved(getSolvedIds());
  }, []);

  return (
    <div className="challenges-page">
      <header className="cipher-page-header">
        <h1>暗号解読チャレンジ</h1>
        <p className="cipher-page-era">
          クリア済み {solved.size} / {CHALLENGES.length}
        </p>
      </header>

      <p className="explanation-lead">
        各ページで学んだ暗号を使って、実際にちょっとした暗号文を解読してみましょう。
        ヒントは段階的に開示されるので、まずはヒントなしで挑戦してみるのがおすすめです。
      </p>

      <div className="cipher-grid">
        {CHALLENGES.map((challenge) => (
          <Link key={challenge.id} to={`/challenges/${challenge.id}`} className="cipher-card">
            <span className={`type-badge difficulty-${challenge.difficulty}`}>
              {DIFFICULTY_LABEL[challenge.difficulty]}
            </span>
            <h2>
              {challenge.title}
              {solved.has(challenge.id) && <span className="solved-badge"> ✓ クリア</span>}
            </h2>
            <p className="cipher-era">{challenge.cipherName}</p>
            <p className="cipher-tagline">{challenge.prompt}</p>
            <span className="card-chevron" aria-hidden="true">
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
