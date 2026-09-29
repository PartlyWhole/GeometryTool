// What the student has done on the path, kept in this browser.
//
// Lessons done, units passed, XP and a day streak, and for each concept a
// strength and the day it is next due for review. Everything is wrapped so a
// private window or blocked storage simply starts afresh.
import type { Unit } from "./path";

const KEY = "geometry-path-m3-v1";

export type Progress = {
  /** How many times each lesson has been completed. */
  done: Record<string, number>;
  /** Units whose checkpoint was passed, or which were tested out of. */
  passed: Record<string, boolean>;
  xp: number;
  streak: { days: number; last: string };
  /** Per concept: strength 0–5, and the day it next wants review. */
  skill: Record<string, { s: number; due: string }>;
};

const empty = (): Progress => ({ done: {}, passed: {}, xp: 0, streak: { days: 0, last: "" }, skill: {} });

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Nowhere to keep it; the path still works for this visit.
  }
}

export const today = (d = new Date()) =>
  d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

const addDays = (day: string, n: number) => {
  const d = new Date(day + "T12:00:00");
  d.setDate(d.getDate() + n);
  return today(d);
};

/** Review gaps by strength: a missed idea is due again today, a strong one in two weeks. */
const GAP = [0, 1, 3, 7, 14, 14];

export function recordAnswer(p: Progress, concepts: string[], correct: boolean): Progress {
  const skill = { ...p.skill };
  for (const c of concepts) {
    const cur = skill[c] ?? { s: 0, due: today() };
    const s = Math.max(0, Math.min(5, cur.s + (correct ? 1 : -1)));
    skill[c] = { s, due: addDays(today(), GAP[s]) };
  }
  return { ...p, skill };
}

/** Today counts toward the streak: one more day if yesterday did too. */
function onStreak(p: Progress): Progress["streak"] {
  const t = today();
  const days = p.streak.last === t ? p.streak.days : p.streak.last === addDays(t, -1) ? p.streak.days + 1 : 1;
  return { days, last: t };
}

export function finishLesson(p: Progress, lessonId: string, xp: number): Progress {
  return {
    ...p,
    done: { ...p.done, [lessonId]: (p.done[lessonId] ?? 0) + 1 },
    xp: p.xp + xp,
    streak: onStreak(p),
  };
}

/** One answer in endless practice, kept at once: its concepts, a point for a right one, and the day. */
export function practiceAnswer(p: Progress, concepts: string[], correct: boolean): Progress {
  const next = recordAnswer(p, concepts, correct);
  return { ...next, xp: p.xp + (correct ? 1 : 0), streak: onStreak(p) };
}

/** Is this learned concept due for review today — or never practised at all? */
export const isDue = (p: Progress, concept: string) => !p.skill[concept] || p.skill[concept].due <= today();

const CHOSEN_KEY = "geometry-path-m3-endless";

/** The concepts last chosen for endless practice, if any. */
export function loadChosen(): string[] {
  try {
    const raw = localStorage.getItem(CHOSEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveChosen(ids: string[]) {
  try {
    localStorage.setItem(CHOSEN_KEY, JSON.stringify(ids));
  } catch {
    // The choice simply is not remembered.
  }
}

export function passUnits(p: Progress, units: Unit[]): Progress {
  const passed = { ...p.passed };
  const done = { ...p.done };
  for (const u of units) {
    passed[u.id] = true;
    // Testing out skips the lessons it covers, but not the optional proofs.
    for (const l of u.lessons) if (!l.optional) done[l.id] = Math.max(done[l.id] ?? 0, 1);
  }
  return { ...p, passed, done };
}

// --- What is open -------------------------------------------------------------

export function unitComplete(p: Progress, u: Unit) {
  return u.checkpoint ? !!p.passed[u.id] : u.lessons.every((l) => l.optional || p.done[l.id]);
}

export function unitOpen(p: Progress, units: Unit[], u: Unit) {
  const i = units.indexOf(u);
  return u.ready && (i === 0 || unitComplete(p, units[i - 1]));
}

/** Open once the lesson before is done — passing over optional "Prove it" lessons. */
export function lessonOpen(p: Progress, units: Unit[], u: Unit, index: number) {
  const before = u.lessons.slice(0, index).filter((l) => !l.optional);
  return unitOpen(p, units, u) && (before.length === 0 || !!p.done[before[before.length - 1].id]);
}

export function checkpointOpen(p: Progress, units: Unit[], u: Unit) {
  return unitOpen(p, units, u) && u.lessons.every((l) => l.optional || p.done[l.id]);
}

/** The streak as it stands today: broken if the last lesson was before yesterday. */
export function currentStreak(p: Progress) {
  const t = today();
  return p.streak.last === t || p.streak.last === addDays(t, -1) ? p.streak.days : 0;
}
