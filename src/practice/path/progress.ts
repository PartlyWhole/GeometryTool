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

/** Review gaps by strength: a weak idea comes back tomorrow, a strong one in two weeks. */
const GAP = [1, 1, 3, 7, 14, 14];

export function recordAnswer(p: Progress, concepts: string[], correct: boolean): Progress {
  const skill = { ...p.skill };
  for (const c of concepts) {
    const cur = skill[c] ?? { s: 0, due: today() };
    const s = Math.max(0, Math.min(5, cur.s + (correct ? 1 : -1)));
    skill[c] = { s, due: addDays(today(), GAP[s]) };
  }
  return { ...p, skill };
}

export function finishLesson(p: Progress, lessonId: string, xp: number): Progress {
  const t = today();
  const yesterday = addDays(t, -1);
  const days = p.streak.last === t ? p.streak.days : p.streak.last === yesterday ? p.streak.days + 1 : 1;
  return {
    ...p,
    done: { ...p.done, [lessonId]: (p.done[lessonId] ?? 0) + 1 },
    xp: p.xp + xp,
    streak: { days, last: t },
  };
}

export function passUnits(p: Progress, units: Unit[]): Progress {
  const passed = { ...p.passed };
  const done = { ...p.done };
  for (const u of units) {
    passed[u.id] = true;
    for (const l of u.lessons) done[l.id] = Math.max(done[l.id] ?? 0, 1);
  }
  return { ...p, passed, done };
}

// --- What is open -------------------------------------------------------------

export function unitComplete(p: Progress, u: Unit) {
  return u.checkpoint ? !!p.passed[u.id] : u.lessons.every((l) => p.done[l.id]);
}

export function unitOpen(p: Progress, units: Unit[], u: Unit) {
  const i = units.indexOf(u);
  return u.ready && (i === 0 || unitComplete(p, units[i - 1]));
}

export function lessonOpen(p: Progress, units: Unit[], u: Unit, index: number) {
  return unitOpen(p, units, u) && (index === 0 || !!p.done[u.lessons[index - 1].id]);
}

export function checkpointOpen(p: Progress, units: Unit[], u: Unit) {
  return unitOpen(p, units, u) && u.lessons.every((l) => p.done[l.id]);
}

/** The streak as it stands today: broken if the last lesson was before yesterday. */
export function currentStreak(p: Progress) {
  const t = today();
  return p.streak.last === t || p.streak.last === addDays(t, -1) ? p.streak.days : 0;
}
