// The story: every concept told once, and never before what it stands on.
import { describe, expect, it } from "vitest";
import { CHAPTERS, ECHOES, NEEDS, placeOf, storyOrder } from "../src/practice/content/story";
import { CONCEPTS } from "../src/practice/content/concepts";
import { CONCEPTS3 } from "../src/practice/content/concepts3";

const ALL = [...CONCEPTS, ...CONCEPTS3];

describe("the story", () => {
  it("tells every concept exactly once, in its own module", () => {
    const told = storyOrder();
    expect(new Set(told).size).toBe(told.length);
    expect([...told].sort()).toEqual(ALL.map((c) => c.id).sort());
    for (const ch of CHAPTERS)
      for (const s of ch.stops) {
        const c = ALL.find((x) => x.id === s.conceptId)!;
        expect(c.module === 3 ? 3 : 2, s.conceptId).toBe(ch.module);
      }
  });

  // The ladder: a rung may rest only on rungs already climbed. This also
  // makes the graph acyclic.
  it("never tells a concept before the concepts it needs", () => {
    const order = storyOrder();
    const at = (id: string) => order.indexOf(id);
    const late: string[] = [];
    for (const c of ALL) {
      expect(NEEDS[c.id], c.id + " has no NEEDS entry").toBeDefined();
      for (const n of NEEDS[c.id]) {
        expect(at(n), c.id + " needs unknown " + n).toBeGreaterThanOrEqual(0);
        if (at(n) >= at(c.id)) late.push(c.id + " needs " + n + ", told later");
      }
      for (const e of ECHOES[c.id] ?? []) {
        expect(at(e), c.id + " echoes unknown " + e).toBeGreaterThanOrEqual(0);
        if (at(e) >= at(c.id)) late.push(c.id + " echoes " + e + ", told later");
      }
    }
    expect(late).toEqual([]);
  });

  it("gives every chapter a question and a close, and every stop a bridge", () => {
    for (const ch of CHAPTERS) {
      expect(ch.question.trim().endsWith("?"), ch.id).toBe(true);
      expect(ch.close.length, ch.id).toBeGreaterThan(60);
      for (const s of ch.stops) expect(s.bridge.length, s.conceptId).toBeGreaterThan(12);
    }
  });

  it("hands each concept on to the next, and stops at the end of a module", () => {
    expect(placeOf("segment-bisector")!.next!.stop.conceptId).toBe("right");
    expect(placeOf("right-angle-congruence")!.next).toBeUndefined();
    expect(placeOf("cons-exterior-theorem")!.next).toBeUndefined();
    expect(placeOf("transversal")!.chapter.id).toBe("transversals");
  });
});
