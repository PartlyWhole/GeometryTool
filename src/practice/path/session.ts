// Turning a lesson, a checkpoint or a stretch of endless practice into the
// run of questions a student sees.
//
// A lesson introduces; it does not drill. It asks each kind of exercise once —
// the guided form first, and a full form only of a different kind — and then
// a couple of review questions from earlier lessons. Repetition belongs to
// review and to endless practice, where it can be spaced.
import type { Lesson, Unit } from "./path";
import { type Progress, today } from "./progress";
import type { Maker, Question } from "./questions";
import { familyOf, shuffle } from "./questions";

export type Slot = {
  maker: Maker;
  phase: "guided" | "core" | "review" | "practice";
  q: Question;
};

/** A seeded generator, so a session can be rebuilt and a test can replay one. */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** How much a concept wants practice: weak ones most, then overdue ones. */
export function need(p: Progress, concept: string): number {
  const k = p.skill[concept];
  if (!k) return 6;
  const overdue = k.due <= today() ? 2 : 1;
  return (6 - k.s) * overdue;
}

/**
 * Review draws on earlier lessons' questions, the concepts most in need of
 * practice first, with a little chance so ties do not always fall the same way.
 */
function reviewMakers(earlier: Lesson[], p: Progress, r: () => number): Maker[] {
  // A whole proof is a lesson's work, not a review question.
  const pool = earlier.filter((l) => !l.optional).flatMap((l) => l.core ?? []).filter((m) => !m.heavy);
  const seen = new Set<string>();
  const score = new Map(pool.map((m) => [m.id, Math.max(...m.concepts.map((c) => need(p, c))) + r()]));
  return pool.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true))).sort((a, b) => score.get(b.id)! - score.get(a.id)!);
}

/** What makes two questions the same question: the words and the answer. */
const sameness = (q: Question) =>
  q.kind + "|" + q.prompt + "|" + JSON.stringify(q.kind === "choice" ? q.choices : q.kind === "flow" || q.kind === "proof" ? "" : "answer" in q ? q.answer : "");

/**
 * A question from this maker that has not already been asked, if a few
 * tries find one. The same words and answer twice reads as a mistake; a
 * fresh figure with the same prompt does not.
 */
export function freshQuestion(m: Maker, r: () => number, asked: Set<string>): Question {
  let q = m.make(r);
  for (let t = 0; t < 6 && asked.has(sameness(q)); t++) q = m.make(r);
  asked.add(sameness(q));
  return q;
}

/** Each kind of exercise once, guided first; then review from earlier lessons. */
export function buildLesson(lesson: Lesson, earlier: Lesson[], p: Progress, r: () => number): Slot[] {
  const slots: Slot[] = [];
  const asked = new Set<string>();
  const used = new Set<string>();
  const once = (m: Maker, phase: Slot["phase"]) => {
    if (used.has(familyOf(m))) return;
    used.add(familyOf(m));
    slots.push({ maker: m, phase, q: freshQuestion(m, r, asked) });
  };
  for (const m of lesson.guided ?? []) once(m, "guided");
  for (const m of shuffle(r, lesson.core ?? [])) once(m, "core");
  // Review: other kinds of exercise, one of each, on the concepts most in need.
  const want = lesson.review ?? 2;
  const review: Maker[] = [];
  for (const m of reviewMakers(earlier, p, r)) {
    if (review.length >= want) break;
    if (used.has(familyOf(m))) continue;
    used.add(familyOf(m));
    review.push(m);
  }
  // In among the new questions, not tacked on the end — but never first.
  for (const m of review) {
    const at = 1 + Math.floor(r() * slots.length);
    slots.splice(at, 0, { maker: m, phase: "review", q: freshQuestion(m, r, asked) });
  }
  return slots;
}

/** A checkpoint: each of the units' exercises once, up to twelve. */
export function buildCheckpoint(units: Unit[], r: () => number, count = 12): Slot[] {
  const seen = new Set<string>();
  const makers = units
    .flatMap((u) => u.lessons.filter((l) => !l.optional).flatMap((l) => [...(l.core ?? []), ...(l.guided ?? [])]))
    .filter((m) => !m.heavy && (seen.has(m.id) ? false : (seen.add(m.id), true)));
  const asked = new Set<string>();
  return shuffle(r, makers)
    .slice(0, count)
    .map((m) => ({ maker: m, phase: "core" as const, q: freshQuestion(m, r, asked) }));
}

export const PASS_MARK = 0.8;

// ---------------------------------------------------------------------------
// Endless practice
// ---------------------------------------------------------------------------

/** Every exercise on the path, once, whole proofs aside. */
export function allMakers(units: Unit[]): Maker[] {
  const seen = new Set<string>();
  return units
    .flatMap((u) => u.lessons.flatMap((l) => [...(l.guided ?? []), ...(l.core ?? [])]))
    .filter((m) => !m.heavy && (seen.has(m.id) ? false : (seen.add(m.id), true)));
}

/**
 * The concepts open to practice: those of the lessons done, and of the
 * lessons skipped to. A learner who skips ahead is taken at their word that
 * they know what they skipped; the strength bars start empty, so those ideas
 * come up often until the answers say otherwise.
 */
export function learnedConcepts(units: Unit[], p: Progress): Set<string> {
  return new Set(units.flatMap((u) => u.lessons.filter((l) => p.done[l.id] || p.unlocked?.[l.id]).flatMap((l) => l.learn)));
}

/** The exercises that practise the chosen concepts and ask about nothing unlearned. */
export function practiceMakers(units: Unit[], chosen: Set<string>, learned: Set<string>): Maker[] {
  return allMakers(units).filter((m) => m.concepts.every((c) => learned.has(c)) && m.concepts.some((c) => chosen.has(c)));
}

/**
 * The next exercise in endless practice: weighted toward the chosen concepts
 * most in need, never the exercise just asked, and not the same kind twice in
 * a row when there is anything else. A miss comes back a few questions later.
 */
export function nextPractice(
  makers: Maker[],
  chosen: Set<string>,
  p: Progress,
  history: { maker: Maker; ok?: boolean }[],
  r: () => number,
): Maker {
  // A miss three or more questions back, not asked again since, comes first.
  for (let i = 0; i <= history.length - 3; i++) {
    const h = history[i];
    if (h.ok === false && !history.slice(i + 1).some((x) => x.maker.id === h.maker.id)) return h.maker;
  }
  const last = history.slice(-2).map((h) => h.maker.id);
  const lastFamily = history.length ? familyOf(history[history.length - 1].maker) : "";
  let pool = makers.filter((m) => !last.includes(m.id) && familyOf(m) !== lastFamily);
  if (!pool.length) pool = makers.filter((m) => m.id !== last[last.length - 1]);
  if (!pool.length) pool = makers;
  const weight = (m: Maker) => Math.max(1, ...m.concepts.filter((c) => chosen.has(c)).map((c) => need(p, c)));
  const total = pool.reduce((s, m) => s + weight(m), 0);
  let x = r() * total;
  for (const m of pool) if ((x -= weight(m)) <= 0) return m;
  return pool[pool.length - 1];
}
