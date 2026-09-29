// The path: every concept taught once, nothing asked before it is taught,
// and every question a lesson can produce well formed.
import { describe, expect, it } from "vitest";
import { UNITS } from "../src/practice/path/path";
import { rng, buildLesson, buildCheckpoint } from "../src/practice/path/session";
import { CONCEPTS3 } from "../src/practice/content/concepts3";
import { storyOrder } from "../src/practice/content/story";
import type { Question } from "../src/practice/path/questions";

const lessons = UNITS.flatMap((u) => u.lessons);

function wellFormed(q: Question, where: string) {
  expect(q.prompt.length, where).toBeGreaterThan(5);
  expect(q.why.length, where).toBeGreaterThan(10);
  if (q.kind === "choice") {
    expect(new Set(q.choices).size, where + " distinct options").toBe(q.choices.length);
    expect(q.choices.length, where).toBeGreaterThanOrEqual(2);
    expect(q.correct, where).toBeGreaterThanOrEqual(0);
    expect(q.correct, where).toBeLessThan(q.choices.length);
  }
  if (q.kind === "tapAngle") {
    const labels = q.figure.angles.map((a) => a.label);
    expect(q.answer.length, where).toBeGreaterThan(0);
    for (const a of q.answer) expect(labels, where + " answer on figure").toContain(a);
    if (!q.multi) expect(q.answer.length, where).toBe(1);
  }
  if (q.kind === "tapLine") expect(q.figure.edges.some((e) => e.label === q.answer), where).toBe(true);
  if (q.kind === "number") expect(Number.isFinite(q.answer), where).toBe(true);
}

describe("the path", () => {
  it("teaches every Module 3 concept exactly once", () => {
    const taught = lessons.flatMap((l) => l.learn);
    expect(new Set(taught).size).toBe(taught.length);
    expect([...taught].sort()).toEqual(CONCEPTS3.map((c) => c.id).sort());
  });

  it("teaches the concepts in the story's order", () => {
    const order = storyOrder(3);
    const taught = lessons.flatMap((l) => l.learn);
    const at = taught.map((c) => order.indexOf(c));
    expect(at).toEqual([...at].sort((a, b) => a - b));
  });

  it("never asks about a concept before its lesson has taught it", () => {
    const late: string[] = [];
    const known = new Set<string>();
    for (const l of lessons) {
      for (const c of l.learn) known.add(c);
      for (const m of [...(l.guided ?? []), ...(l.core ?? [])])
        for (const c of m.concepts) if (!known.has(c)) late.push(l.id + " " + m.id + " asks about " + c);
    }
    expect(late).toEqual([]);
  });

  it("gives every playable lesson questions, and every question a proper shape", () => {
    for (const u of UNITS.filter((x) => x.ready))
      for (const l of u.lessons) {
        expect((l.core ?? []).length, l.id + " has core questions").toBeGreaterThan(0);
        for (let s = 1; s <= 25; s++) {
          const r = rng(s * 7919 + l.id.length);
          for (const m of [...(l.guided ?? []), ...(l.core ?? [])]) wellFormed(m.make(r), l.id + " " + m.id + " seed " + s);
        }
      }
  });

  it("builds a nine-question lesson and a twelve-question checkpoint", () => {
    const empty = { done: {}, passed: {}, xp: 0, streak: { days: 0, last: "" }, skill: {} };
    const u2 = UNITS[1];
    const l = u2.lessons[3];
    const slots = buildLesson(l, lessons.slice(0, lessons.indexOf(l)), empty, rng(5));
    expect(slots.length).toBe(9);
    expect(slots.slice(0, 2).every((s) => s.phase === "guided")).toBe(true);
    expect(slots.filter((s) => s.phase === "review").length).toBe(2);
    expect(buildCheckpoint([u2], rng(9)).length).toBe(12);
  });
});
