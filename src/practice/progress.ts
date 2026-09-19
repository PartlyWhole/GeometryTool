// Per-mode tallies, kept in local storage so a session survives a reload.
export type Tally = { correct: number; attempted: number; streak: number };

export const emptyTally = (): Tally => ({ correct: 0, attempted: 0, streak: 0 });

const KEY = "geometry-practice-v1";

type Store = Record<string, Tally>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

export function loadTally(mode: string): Tally {
  const t = read()[mode];
  return t && typeof t.correct === "number" ? t : emptyTally();
}

export function saveTally(mode: string, t: Tally) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), [mode]: t }));
  } catch {
    /* Private browsing and blocked storage are not errors here. */
  }
}

export const record = (t: Tally, ok: boolean): Tally => ({
  correct: t.correct + (ok ? 1 : 0),
  attempted: t.attempted + 1,
  streak: ok ? t.streak + 1 : 0,
});

export const percent = (t: Tally) =>
  t.attempted ? Math.round((t.correct / t.attempted) * 100) : 0;

export function resetAll() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
