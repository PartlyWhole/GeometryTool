// Turning a lesson or a checkpoint into the run of questions a student sees.
import type { Lesson, Unit } from "./path";
import type { Progress } from "./progress";
import type { Maker, Question } from "./questions";
import { shuffle } from "./questions";

export type Slot = {
  maker: Maker;
  phase: "guided" | "core" | "review" | "retry";
  q: Question;
};

/** A seeded generator, so a session can be rebuilt and a test can replay one. */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/**
 * Review draws on earlier lessons' core questions, weakest concept first,
 * then whichever is most overdue.
 */
function reviewMakers(earlier: Lesson[], p: Progress): Maker[] {
  // A whole proof is a lesson's work, not a review question.
  const pool = earlier.filter((l) => !l.optional).flatMap((l) => l.core ?? []);
  const score = (m: Maker) =>
    Math.min(...m.concepts.map((c) => (p.skill[c]?.s ?? 0) * 100 + (p.skill[c] ? Date.parse(p.skill[c].due) / 864e5 : 0)));
  const seen = new Set<string>();
  return pool
    .filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)))
    .sort((a, b) => score(a) - score(b));
}

/** What makes two questions the same question: the words and the answer. */
const sameness = (q: Question) =>
  q.kind + "|" + q.prompt + "|" + JSON.stringify(q.kind === "choice" ? q.choices : q.kind === "flow" || q.kind === "proof" ? "" : "answer" in q ? q.answer : "");

/**
 * A question from this maker that the lesson has not already asked, if a
 * few tries find one. The same words and answer twice in nine questions
 * reads as a mistake; a fresh figure with the same prompt does not.
 */
function fresh(m: Maker, r: () => number, asked: Set<string>): Question {
  let q = m.make(r);
  for (let t = 0; t < 6 && asked.has(sameness(q)); t++) q = m.make(r);
  asked.add(sameness(q));
  return q;
}

/** Two guided, five core, two review — or more core when nothing is earlier. */
export function buildLesson(lesson: Lesson, earlier: Lesson[], p: Progress, r: () => number): Slot[] {
  const slots: Slot[] = [];
  const guided = lesson.guided ?? [];
  const core = lesson.core ?? [];
  const shape = lesson.shape ?? { guided: 2, core: 5, review: 2 };
  const asked = new Set<string>();
  for (let i = 0; i < shape.guided && guided.length; i++) {
    const m = guided[i % guided.length];
    slots.push({ maker: m, phase: "guided", q: fresh(m, r, asked) });
  }
  const review = reviewMakers(earlier, p).slice(0, shape.review);
  const coreCount = shape.core + (shape.review - review.length);
  const order = shuffle(r, core);
  for (let i = 0; i < coreCount && core.length; i++) {
    const m = order[i % order.length];
    slots.push({ maker: m, phase: "core", q: fresh(m, r, asked) });
  }
  // Review goes in among the core questions, not tacked on the end.
  for (const m of review) {
    const at = shape.guided + Math.floor(r() * (slots.length - shape.guided + 1));
    slots.splice(at, 0, { maker: m, phase: "review", q: fresh(m, r, asked) });
  }
  return slots;
}

/** A checkpoint: twelve core questions across a unit's lessons, or several units'. */
export function buildCheckpoint(units: Unit[], r: () => number, count = 12): Slot[] {
  const makers = units.flatMap((u) => u.lessons.filter((l) => !l.optional).flatMap((l) => l.core ?? []));
  const order = shuffle(r, makers);
  const slots: Slot[] = [];
  const asked = new Set<string>();
  for (let i = 0; i < count && makers.length; i++) {
    const m = order[i % order.length];
    slots.push({ maker: m, phase: "core", q: fresh(m, r, asked) });
  }
  return slots;
}

export const PASS_MARK = 0.8;
