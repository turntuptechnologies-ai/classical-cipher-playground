const STORAGE_KEY = "classical-cipher-playground:challenge-progress";

export function getSolvedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function markSolved(id: string): void {
  const solved = getSolvedIds();
  if (solved.has(id)) return;
  solved.add(id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...solved]));
  } catch {
    // localStorageが使えない環境(プライベートブラウズ等)では進捗を保存しない
  }
}
