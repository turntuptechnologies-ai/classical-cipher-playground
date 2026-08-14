const SEQUENCE_LENGTH = 3;

export interface RepeatedSequence {
  sequence: string;
  positions: number[];
  distances: number[];
}

export interface KeyLengthCandidate {
  length: number;
  votes: number;
}

export function findRepeatedSequences(text: string): RepeatedSequence[] {
  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, "");
  const positionsBySequence = new Map<string, number[]>();

  for (let i = 0; i + SEQUENCE_LENGTH <= cleaned.length; i++) {
    const sequence = cleaned.slice(i, i + SEQUENCE_LENGTH);
    const positions = positionsBySequence.get(sequence);
    if (positions) positions.push(i);
    else positionsBySequence.set(sequence, [i]);
  }

  const repeats: RepeatedSequence[] = [];
  for (const [sequence, positions] of positionsBySequence) {
    if (positions.length < 2) continue;
    const distances = positions.slice(1).map((pos) => pos - positions[0]);
    repeats.push({ sequence, positions, distances });
  }

  return repeats.sort((a, b) => b.positions.length - a.positions.length || a.sequence.localeCompare(b.sequence));
}

export function suggestKeyLengths(repeats: RepeatedSequence[], maxLength = 12): KeyLengthCandidate[] {
  const votes = new Map<number, number>();

  for (const repeat of repeats) {
    for (const distance of repeat.distances) {
      for (let length = 2; length <= maxLength; length++) {
        if (distance % length === 0) {
          votes.set(length, (votes.get(length) ?? 0) + 1);
        }
      }
    }
  }

  return Array.from(votes.entries())
    .map(([length, voteCount]) => ({ length, votes: voteCount }))
    .sort((a, b) => b.votes - a.votes || a.length - b.length);
}
