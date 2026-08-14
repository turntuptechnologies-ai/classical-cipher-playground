import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CHALLENGES, DIFFICULTY_LABEL, isCorrectAnswer } from "../challenges/data";
import { markSolved } from "../challenges/progress";
import CopyButton from "../components/CopyButton";

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const index = CHALLENGES.findIndex((c) => c.id === id);
  const challenge = index === -1 ? null : CHALLENGES[index];

  const [guess, setGuess] = useState("");
  const [revealedHints, setRevealedHints] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  if (!challenge) {
    return <Navigate to="/challenges" replace />;
  }

  const next = CHALLENGES[index + 1];

  const handleCheck = () => {
    if (isCorrectAnswer(challenge, guess)) {
      setFeedback("correct");
      markSolved(challenge.id);
    } else {
      setFeedback("incorrect");
    }
  };

  return (
    <article className="cipher-page">
      <p className="breadcrumb">
        <Link to="/challenges">← チャレンジ一覧</Link>
      </p>

      <header className="cipher-page-header">
        <h1>{challenge.title}</h1>
        <p className="cipher-page-era">
          <span className={`type-badge difficulty-${challenge.difficulty}`}>
            {DIFFICULTY_LABEL[challenge.difficulty]}
          </span>
          <Link to={challenge.cipherPath} className="cipher-link"> {challenge.cipherName}のページを開く →</Link>
        </p>
      </header>

      <section className="explanation">
        <p>{challenge.prompt}</p>
      </section>

      <section className="playground">
        <div className="result-box">
          <div className="result-header">
            <span>暗号文</span>
            <CopyButton text={challenge.ciphertext} />
          </div>
          <p className="result-text mono">{challenge.ciphertext}</p>
        </div>

        <div className="hint-area">
          {challenge.hints.slice(0, revealedHints).map((hint, i) => (
            <p key={i} className="note-text hint-text">
              ヒント{i + 1}: {hint}
            </p>
          ))}
          {revealedHints < challenge.hints.length && (
            <button type="button" className="secondary-button" onClick={() => setRevealedHints((n) => n + 1)}>
              ヒントを見る（{revealedHints + 1}/{challenge.hints.length}）
            </button>
          )}
        </div>

        <label className="field">
          平文（解読結果）を入力してください
          <input
            type="text"
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              setFeedback("idle");
            }}
            className="mono"
            placeholder="解読した平文を入力"
          />
        </label>

        <div className="control-row">
          <button type="button" className="toggle-button active" onClick={handleCheck}>
            答え合わせ
          </button>
          {!showAnswer && (
            <button type="button" className="secondary-button" onClick={() => setShowAnswer(true)}>
              答えを見る
            </button>
          )}
        </div>

        {feedback === "correct" && <p className="key-status ok">正解です！お見事。</p>}
        {feedback === "incorrect" && <p className="key-status error">ちがいます。もう一度試してみましょう。</p>}
        {showAnswer && (
          <p className="note-text">
            答え: <span className="mono">{challenge.answer}</span>
          </p>
        )}

        {feedback === "correct" && next && (
          <p>
            <Link to={`/challenges/${next.id}`} className="cipher-cta">
              次のチャレンジへ（{next.title}） →
            </Link>
          </p>
        )}
      </section>
    </article>
  );
}
