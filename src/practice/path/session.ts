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
  const pool = earlier.flatMap((l) => l.core ?? []);
  const score = (m: Maker) =>
    Math.min(...m.concepts.map((c) => (p.skill[c]?.s ?? 0) * 100 + (p.skill[c] ? Date.parse(p.skill[c].due) / 864e5 : 0)));
  const seen = new Set<string>();
  return pool
    .filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)))
    .sort((a, b) => score(a) - score(b));
}

/** Two guided, five core, two review — or more core when nothing is earlier. */
export function buildLesson(lesson: Lesson, earlier: Lesson[], p: Progress, r: () => number): Slot[] {
  const slots: Slot[] = [];
  const guided = lesson.guided ?? [];
  const core = lesson.core ?? [];
  for (let i = 0; i < 2 && guided.length; i++) {
    const m = guided[i % guided.length];
    slots.push({ maker: m, phase: "guided", q: m.make(r) });
  }
  const review = reviewMakers(earlier, p).slice(0, 2);
  const coreCount = 5 + (2 - review.length);
  const order = shuffle(r, core);
  for (let i = 0; i < coreCount && core.length; i++) {
    const m = order[i % order.length];
    slots.push({ maker: m, phase: "core", q: m.make(r) });
  }
  // Review goes in among the core questions, not tacked on the end.
  for (const m of review) {
    const at = 2 + Math.floor(r() * (slots.length - 1));
    slots.splice(at, 0, { maker: m, phase: "review", q: m.make(r) });
  }
  return slots;
}

/** A checkpoint: twelve core questions across a unit's lessons, or several units'. */
export function buildCheckpoint(units: Unit[], r: () => number, count = 12): Slot[] {
  const makers = units.flatMap((u) => u.lessons.flatMap((l) => l.core ?? []));
  const order = shuffle(r, makers);
  const slots: Slot[] = [];
  for (let i = 0; i < count && makers.length; i++) {
    const m = order[i % order.length];
    slots.push({ maker: m, phase: "core", q: m.make(r) });
  }
  return slots;
}

export const PASS_MARK = 0.8;
