// Module 3: two lines cut by a transversal.
import { describe, expect, it } from "vitest";
import { transversal, transversalJK, parallelMN, LIBRARY3 } from "../src/practice/content/library3";
import { placement } from "../src/practice/transversal";
import { holds, isLinearPair, isVertical, marked, measureOf, threePointName } from "../src/practice/oracle";
import { ang, line, type Statement } from "../src/practice/terms";
import { statementText } from "../src/practice/notation";

const a = (n: number | string) => ang(String(n));

/** The reference's table, plus the Module 2 pairs at one crossing. */
const TABLE: Record<string, string> = {
  "1-5": "corresponding", "2-6": "corresponding", "3-7": "corresponding", "4-8": "corresponding",
  "3-5": "altInterior", "4-6": "altInterior",
  "3-6": "consInterior", "4-5": "consInterior",
  "1-7": "altExterior", "2-8": "altExterior",
  "1-8": "consExterior", "2-7": "consExterior",
  "1-6": "none", "2-5": "none", "3-8": "none", "4-7": "none",
  "1-3": "vertical", "2-4": "vertical", "5-7": "vertical", "6-8": "vertical",
  "1-2": "linearPair", "2-3": "linearPair", "3-4": "linearPair", "1-4": "linearPair",
  "5-6": "linearPair", "6-7": "linearPair", "7-8": "linearPair", "5-8": "linearPair",
};

const relation = (b: ReturnType<typeof transversal>, x: string, y: string) =>
  isVertical(b, a(x), a(y)) ? "vertical"
  : isLinearPair(b, a(x), a(y)) ? "linearPair"
  : placement(b, a(x), a(y))?.kind ?? "?";

describe("the transversal classifier", () => {
  it("names all 28 pairs as the reference's table does", () => {
    for (const make of [transversalJK, parallelMN]) {
      const b = make();
      for (const [k, want] of Object.entries(TABLE)) {
        const [x, y] = k.split("-");
        expect(relation(b, x, y), make.name + " " + k).toBe(want);
        expect(relation(b, y, x), make.name + " " + y + "-" + x).toBe(want);
      }
    }
  });

  // The names are about position. Turning the figure, tilting the lines apart
  // and renumbering the angles must not change what any two positions are.
  it("depends on position only, however the figure is turned or numbered", () => {
    let seed = 7;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let trial = 0; trial < 40; trial++) {
      const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];
      for (let i = 7; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      const base = Math.round(r() * 30 - 15);
      const b = transversal({
        tilt: [base + Math.round(r() * 16 - 8), base],
        cross: 40 + Math.round(r() * 100),
        turn: Math.round(r() * 360),
        numbers,
      });
      for (const [k, want] of Object.entries(TABLE)) {
        const [x, y] = k.split("-").map((n) => numbers[Number(n) - 1]);
        expect(relation(b, x, y), "trial " + trial + " " + k).toBe(want);
      }
    }
  });

  it("treats a pair's name as a fact the figure shows, marked or not", () => {
    const b = transversalJK();
    expect(marked(b, { k: "altInterior", a: a(3), b: a(5) })).toBe(true);
    expect(marked(b, { k: "altInterior", a: a(3), b: a(6) })).toBe(false);
    expect(holds(b, { k: "consExterior", a: a(2), b: a(7) })).toBe(true);
  });

  it("reads a parallel mark for the two lines it is on, not for any lines", () => {
    const b = parallelMN();
    const m = line("A1", "B1", "m"), n = line("A2", "B2", "n"), t = line("T2", "T1", "t");
    expect(marked(b, { k: "parallel", a: m, b: n })).toBe(true);
    expect(marked(b, { k: "parallel", a: m, b: t })).toBe(false);
    expect(marked(LIBRARY3.parallelUnmarked(), { k: "parallel", a: m, b: n })).toBe(false);
  });
});

describe("Module 3 figures", () => {
  it("draws every printed measure at that measure, and every marked pair parallel", async () => {
    const { NUMERIC_ITEMS3, generatedNumeric3, MULTIPART_ITEMS3 } = await import("../src/practice/content/items3");
    const { cards3 } = await import("../src/practice/content/cards3");
    const boards: [string, ReturnType<typeof transversal>][] = [
      ...Object.entries(LIBRARY3).map(([k, f]) => [k, f()] as [string, ReturnType<typeof transversal>]),
      ...NUMERIC_ITEMS3.filter((x) => x.figure).map((x) => [x.id, x.figure!] as [string, ReturnType<typeof transversal>]),
      ...[1, 2, 3].flatMap((s) => generatedNumeric3(s, 6)).map((x) => [x.id, x.figure!] as [string, ReturnType<typeof transversal>]),
      ...MULTIPART_ITEMS3.filter((x) => x.figure).map((x) => [x.id, x.figure!] as [string, ReturnType<typeof transversal>]),
      ...[1, 2, 3].flatMap((s) => cards3(s)).filter((c) => c.figure).map((c) => [c.id, c.figure!] as [string, ReturnType<typeof transversal>]),
    ];
    const bad: string[] = [];
    for (const [name, b] of boards) {
      for (const c of b.constraints) {
        if (c.kind === "angle") {
          const n = threePointName(b, c.angle);
          const d = n ? measureOf(b, { k: "ang", name: n }) : undefined;
          if (d === undefined || Math.abs(d - c.value) > 0.01)
            bad.push(name + ": prints " + c.value + "° over an angle drawn at " + d);
        }
        if (c.kind === "parallel") {
          const [e1, e2] = c.edges.map((id) => b.edges.find((e) => e.id === id)!);
          const pt = (id: string) => b.points.find((p) => p.id === id)!;
          const dir = (e: typeof e1) => Math.atan2(pt(e.b).y - pt(e.a).y, pt(e.b).x - pt(e.a).x);
          const gap = Math.abs(Math.sin(dir(e1) - dir(e2)));
          if (gap > 1e-6) bad.push(name + ": arrowheads on lines that are not parallel");
        }
        if (c.kind === "equalAngle") {
          const ds = c.angles.map((x) => measureOf(b, { k: "ang", name: threePointName(b, x)! }));
          if (Math.max(...(ds as number[])) - Math.min(...(ds as number[])) > 0.01)
            bad.push(name + ": arcs mark angles congruent that are drawn " + ds.join(" vs "));
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("answers every 'find m∠k' question with the angle the figure draws", async () => {
    const { NUMERIC_ITEMS3, generatedNumeric3 } = await import("../src/practice/content/items3");
    let checked = 0;
    for (const item of [...NUMERIC_ITEMS3, ...[1, 2, 3, 4].flatMap((s) => generatedNumeric3(s, 6))]) {
      const find = item.prompt.match(/Find m∠(\d)/);
      if (!find || !item.figure) continue;
      checked++;
      expect(measureOf(item.figure, a(find[1]))!, item.id).toBeCloseTo(item.answer, 6);
    }
    expect(checked).toBeGreaterThan(20);
  });
});

describe("the parallel-line rules", () => {
  it("replays every Module 3 proof through the strict validator", async () => {
    const { PROOFS3 } = await import("../src/practice/content/items3");
    const { replaySolution } = await import("../src/practice/proof");
    for (const p of PROOFS3) expect(replaySolution(p), p.id).toBeUndefined();
    expect(PROOFS3.every((p) => p.module === 3)).toBe(true);
  });

  it("refuses the right way when the step is wrong", async () => {
    const { validateLine } = await import("../src/practice/proof");
    const { PROOFS3 } = await import("../src/practice/content/items3");
    const p = PROOFS3.find((x) => x.id === "m3-proof-aet")!;
    const given = { id: "L1", statement: p.givens[0], reasonId: "given", cites: [] };
    const vert = { id: "L2", statement: { k: "vertical", a: a(5), b: a(7) } as Statement, reasonId: "def-vertical", cites: [] };
    const try_ = (statement: Statement, reasonId: string, cites: string[]) =>
      validateLine(p, [given, vert], { statement, reasonId, cites });
    const cong = (x: number, y: number): Statement => ({ k: "cong", l: a(x), r: a(y) });

    // Right rule, right citation.
    expect(try_(cong(1, 5), "corresponding-angles-postulate", ["L1"]).ok).toBe(true);
    // The wrong pair name is caught, and the right rule is named.
    const wrong = try_(cong(3, 5), "corresponding-angles-postulate", ["L1"]);
    expect(wrong.ok).toBe(false);
    expect(!wrong.ok && wrong.why).toMatch(/alternate interior.*Alternate Interior Angles Theorem/);
    // Without the parallel line cited, the rule says what it needs.
    const noPar = try_(cong(1, 5), "corresponding-angles-postulate", ["L2"]);
    expect(!noPar.ok && noPar.why).toMatch(/only when the two lines are parallel/);
    // A consecutive pair is supplementary; concluding a congruence fails.
    const asCong = try_(cong(3, 6), "cons-interior-angles-theorem", ["L1"]);
    expect(asCong.ok).toBe(false);
    // And the theorem being proved is refused as circular.
    const circ = try_(cong(1, 7), "alt-exterior-angles-theorem", ["L1"]);
    expect(!circ.ok && circ.why).toMatch(/circular/);
  });

  it("quotes angles by their numerals, never by the hidden construction points", async () => {
    const { validateLine } = await import("../src/practice/proof");
    const { PROOFS3 } = await import("../src/practice/content/items3");
    // The consecutive interior proof forbids only its own theorem, so the
    // alternate exterior rule reaches the position check.
    const p = PROOFS3.find((x) => x.id === "m3-proof-cit")!;
    const given = { id: "L1", statement: p.givens[0], reasonId: "given", cites: [] };
    const res = validateLine(p, [given], {
      statement: { k: "cong", l: a(3), r: a(5) },
      reasonId: "alt-exterior-angles-theorem",
      cites: ["L1"],
    });
    expect(!res.ok && res.why).toMatch(/∠3 and ∠5/);
    expect(!res.ok && res.why).not.toMatch(/[AB][12]|T[12]/);
  });

  it("never offers a Module 3 rule in a Module 2 proof", async () => {
    const { reasonsFor } = await import("../src/practice/reasons");
    const { stepItems } = await import("../src/practice/content/stepReason");
    const { reasonCheckItems, reasonName } = await import("../src/practice/content/reasonCheck");
    const m3 = new Set(reasonsFor(3).filter((r) => r.module).map((r) => r.name));
    expect(m3.size).toBe(13);
    expect(reasonsFor(2).some((r) => r.module)).toBe(false);
    for (let s = 1; s <= 40; s++) {
      for (const it of stepItems(s, 12)) for (const o of it.options) expect(m3.has(o), it.id + " " + o).toBe(false);
      for (const it of reasonCheckItems(s, 8))
        for (const row of it.rows) expect(m3.has(reasonName(row.reasonId)), it.id).toBe(false);
    }
  });

  it("builds Module 3 drills from Module 3 proofs", async () => {
    const { PROOFS3 } = await import("../src/practice/content/items3");
    const { stepItems } = await import("../src/practice/content/stepReason");
    const { reasonCheckItems } = await import("../src/practice/content/reasonCheck");
    const answers = new Set<string>();
    for (let s = 1; s <= 30; s++) for (const it of stepItems(s, 12, PROOFS3)) answers.add(it.answer);
    expect(answers.has("Corresponding Angles Postulate")).toBe(true);
    expect(answers.has("Alternate Interior Angles Theorem")).toBe(true);
    expect(reasonCheckItems(3, 8, PROOFS3).length).toBeGreaterThan(3);
  });
});

describe("Module 3 items", () => {
  it("keys every claim and every accepted answer to what the marks license", async () => {
    const { CLAIM_ITEMS3, READ_ITEMS3, MULTIPART_ITEMS3 } = await import("../src/practice/content/items3");
    const { follows } = await import("../src/practice/content/pairs3");
    const bad: string[] = [];
    for (const c of CLAIM_ITEMS3)
      for (const cl of c.claims)
        if (follows(c.figure, cl.statement) !== cl.holds)
          bad.push(c.id + ": " + statementText(cl.statement) + " keyed " + cl.holds);
    for (const r of READ_ITEMS3)
      for (const s of r.accept) if (!follows(r.figure, s)) bad.push(r.id + " accepts " + statementText(s));
    for (const mp of MULTIPART_ITEMS3)
      for (const part of mp.parts)
        if (part.body.kind === "claims")
          for (const cl of part.body.claims)
            if (follows(mp.figure!, cl.statement) !== cl.holds)
              bad.push(mp.id + ": " + statementText(cl.statement) + " keyed " + cl.holds);
    expect(bad).toEqual([]);
  });

  it("generates angle-pair items whose answers the figure bears out", async () => {
    const { pairItems, relationOf, consequence } = await import("../src/practice/content/pairs3");
    const kinds = new Set<string>();
    for (let s = 1; s <= 120; s++)
      for (const it of pairItems(s, 12)) {
        kinds.add(it.mode + ":" + (it.mode === "find" ? it.want : it.answer));
        if (it.mode === "name") {
          expect(relationOf(it.figure, ...it.pair), it.id).toBe(it.answer);
          expect(it.choices).toContain(it.answer);
          expect(new Set(it.choices).size, it.id).toBe(4);
        } else if (it.mode === "find") {
          expect(placement(it.figure, a(it.from), a(it.answer))?.kind, it.id).toBe(it.want);
          const others = it.figure.angles
            .map((x) => x.label!)
            .filter((y) => y !== it.answer && y !== it.from && placement(it.figure, a(it.from), a(y))?.kind === it.want);
          expect(others, it.id + " has one partner").toEqual([]);
        } else {
          expect(consequence(it.figure, ...it.pair), it.id).toBe(it.answer);
        }
      }
    // Every kind of answer turns up, including "no name" and "nothing follows".
    for (const k of ["name:none", "name:vertical", "relate:unknown", "relate:congruent", "relate:supplementary", "find:altInterior", "find:consExterior"])
      expect(kinds.has(k), k).toBe(true);
  });

  it("keys every flow-proof box to a rule the figure bears out", async () => {
    const { FLOWS3 } = await import("../src/practice/content/items3");
    const RULE_FOR: Record<string, string> = {
      "corresponding-angles-postulate": "corresponding",
      "alt-interior-angles-theorem": "altInterior",
      "alt-exterior-angles-theorem": "altExterior",
    };
    for (const f of FLOWS3) {
      expect(f.boxes[0].reasonId, f.id).toBe("given");
      expect(f.boxes.some((b) => b.reasonId === f.proves), f.id + " cites what it proves").toBe(false);
      for (const box of f.boxes) {
        const s = box.statement;
        // Rows written as text — the Pythagorean steps — are keyed by hand.
        if (!s || s.k !== "cong" || s.l.k !== "ang" || s.r.k !== "ang") continue;
        if (RULE_FOR[box.reasonId])
          expect(placement(f.figure, s.l, s.r)?.kind, f.id + " " + statementText(s)).toBe(RULE_FOR[box.reasonId]);
        if (box.reasonId === "vertical-angles-theorem")
          expect(isVertical(f.figure, s.l, s.r), f.id + " " + statementText(s)).toBe(true);
      }
    }
  });

  it("deals cards with the answer in every position and the feedback on the right option", async () => {
    const { cards3 } = await import("../src/practice/content/cards3");
    const positions = new Set<number>();
    for (let s = 1; s <= 30; s++)
      for (const c of cards3(s)) {
        expect(c.correct, c.id).toBeGreaterThanOrEqual(0);
        expect(new Set(c.choices).size, c.id).toBe(c.choices.length);
        positions.add(c.correct);
        // The flow card's circularity note belongs to the theorem being proved.
        if (c.id === "m3c-flow-last") {
          const circ = Object.entries(c.whyPerChoice ?? {}).find(([, v]) => /circular/.test(v));
          expect(c.choices[Number(circ![0])]).toBe("Alternate Interior Angles Theorem");
        }
      }
    expect(positions.size).toBe(4);
  });
});

describe("Module 3 concepts", () => {
  it("asks about every concept, in four distinct options, without giving the term away", async () => {
    const { conceptQuestions, givesItAway, FIGURE_SHOWS } = await import("../src/practice/content/conceptQuiz");
    const { CONCEPTS3 } = await import("../src/practice/content/concepts3");
    const seen = new Set<string>();
    const byTerm = new Map(CONCEPTS3.map((c) => [c.term, c.id]));
    for (let s = 1; s <= 120; s++)
      for (const q of conceptQuestions(s, 14, CONCEPTS3)) {
        seen.add(q.conceptId);
        expect(new Set(q.choices.map((c) => c.text)).size, q.id).toBe(4);
        // Distractors come from Module 3 alone.
        if (q.kind === "def-to-term" || q.kind === "example-to-term") {
          for (const c of q.choices) expect(byTerm.has(c.text), q.id + " offered " + c.text).toBe(true);
          const c = CONCEPTS3.find((x) => x.id === q.conceptId)!;
          const stem = q.prompt.replace(/^Which [^?]*\?\s*/, "");
          expect(givesItAway(stem || q.prompt, c.term), q.id + " :: " + q.prompt).toBe(false);
        }
        if (q.figure && q.kind === "example-to-term")
          for (const c of q.choices) {
            const id = byTerm.get(c.text);
            if (id && id !== q.conceptId)
              expect((FIGURE_SHOWS[q.figure] ?? []).includes(id), q.id + " offered " + c.text).toBe(false);
          }
      }
    expect(CONCEPTS3.filter((c) => !seen.has(c.id)).map((c) => c.id)).toEqual([]);
  });

  it("gives every concept an explanation and a walkthrough", async () => {
    const { CONCEPTS3 } = await import("../src/practice/content/concepts3");
    const { WALKTHROUGHS3 } = await import("../src/practice/content/walkthroughs3");
    for (const c of CONCEPTS3) {
      expect(c.because ?? c.watch, c.id).toBeTruthy();
      expect(WALKTHROUGHS3.some((w) => w.conceptId === c.id), c.id).toBe(true);
    }
  });
});

describe("Module 3, Lessons 3.2 and 3.3", () => {
  const drawnTruthfully = (b: ReturnType<typeof transversal>, name: string, bad: string[]) => {
    for (const c of b.constraints) {
      if (c.kind === "angle") {
        const n = threePointName(b, c.angle);
        const d = n ? measureOf(b, { k: "ang", name: n }) : undefined;
        if (d === undefined || Math.abs(d - c.value) > 0.01) bad.push(name + ": prints " + c.value + "° over " + d);
      }
      if (c.kind === "equalLength") {
        const ls = c.segments.map((sg: any) => {
          const e = b.edges.find((x) => x.id === sg.edge)!;
          const p = b.points.find((q) => q.id === (sg.a ?? e.a))!, q = b.points.find((x) => x.id === (sg.b ?? e.b))!;
          return Math.hypot(p.x - q.x, p.y - q.y);
        });
        if (Math.max(...ls) - Math.min(...ls) > 0.5) bad.push(name + ": ticks on unequal lengths " + ls.map(Math.round).join(" vs "));
      }
    }
  };

  it("draws every generated figure as its marks and measures say", async () => {
    const { testItems } = await import("../src/practice/content/tests3");
    const { bisectorItems } = await import("../src/practice/content/bisector3");
    const bad: string[] = [];
    for (let s = 1; s <= 40; s++)
      for (const it of [...testItems(s), ...bisectorItems(s)]) if (it.figure) drawnTruthfully(it.figure, it.id, bad);
    expect(bad).toEqual([]);
  });

  it("answers 'enough to prove m ∥ n?' as the drawing bears out", async () => {
    const { testItems } = await import("../src/practice/content/tests3");
    const { provedParallel } = await import("../src/practice/content/pairs3");
    const m = line("A1", "B1", "m"), n = line("A2", "B2", "n");
    let yes = 0, no = 0;
    for (let s = 1; s <= 60; s++)
      for (const it of testItems(s)) {
        if (it.kind !== "choice" || it.heading !== "Enough to prove m ∥ n?") continue;
        const e = it.figure!.edges.filter((x) => x.label === "m" || x.label === "n").map((x) => x.id);
        const proved = provedParallel(it.figure!, e[0], e[1]);
        const drawnParallel = holds(it.figure!, { k: "parallel", a: m, b: n });
        // The lines are drawn parallel exactly when the measures prove it.
        expect(drawnParallel, it.id + " " + it.why).toBe(proved);
        const answer = it.choices[it.correct];
        expect(answer.startsWith("Yes"), it.id + " " + it.why).toBe(proved);
        proved ? yes++ : no++;
      }
    expect(yes).toBeGreaterThan(10);
    expect(no).toBeGreaterThan(10);
  });

  it("makes the lines parallel at every 'find x' answer", async () => {
    const { testItems } = await import("../src/practice/content/tests3");
    const parse = (g: string) => {
      const mm = g.match(/m∠(\d) = \((\d*)x(?: ([+−]) (\d+))?\)°/)!;
      const a = mm[2] ? Number(mm[2]) : 1;
      const b = mm[4] ? (mm[3] === "−" ? -Number(mm[4]) : Number(mm[4])) : 0;
      return { n: mm[1], at: (x: number) => a * x + b };
    };
    let checked = 0;
    for (let s = 1; s <= 60; s++)
      for (const it of testItems(s)) {
        if (it.kind !== "number") continue;
        const [p, q] = it.given!.map(parse);
        const mp = p.at(it.answer), mq = q.at(it.answer);
        // The figure is drawn at the answer.
        expect(measureOf(it.figure!, a(p.n))!, it.id).toBeCloseTo(mp, 6);
        expect(measureOf(it.figure!, a(q.n))!, it.id).toBeCloseTo(mq, 6);
        const kind = placement(it.figure!, a(p.n), a(q.n))!.kind;
        const same = kind === "corresponding" || kind === "altInterior" || kind === "altExterior";
        expect(same ? mp === mq : mp + mq === 180, it.id).toBe(true);
        checked++;
      }
    expect(checked).toBeGreaterThan(20);
  });

  it("offers distinct options with the right one among them", async () => {
    const { testItems } = await import("../src/practice/content/tests3");
    const { bisectorItems } = await import("../src/practice/content/bisector3");
    for (let s = 1; s <= 30; s++)
      for (const it of [...testItems(s), ...bisectorItems(s)]) {
        if (it.kind !== "choice") continue;
        expect(new Set(it.choices).size, it.id).toBe(it.choices.length);
        expect(it.correct, it.id).toBeGreaterThanOrEqual(0);
        expect(it.correct, it.id).toBeLessThan(it.choices.length);
      }
  });

  it("names the forward theorem as the trap in 'which test?' items", async () => {
    const { testItems, FORWARD, CONVERSE } = await import("../src/practice/content/tests3");
    let seen = 0;
    for (let s = 1; s <= 30; s++)
      for (const it of testItems(s)) {
        if (it.kind !== "choice" || it.heading !== "Which test?") continue;
        const forward = it.choices.find((c) => Object.values(FORWARD).includes(c))!;
        expect(forward, it.id).toBeTruthy();
        expect(it.whyPerChoice?.[it.choices.indexOf(forward)], it.id).toMatch(/converse/);
        expect(Object.values(CONVERSE).includes(it.choices[it.correct]) || /None/.test(it.choices[it.correct]), it.id).toBe(true);
        seen++;
      }
    expect(seen).toBeGreaterThan(10);
  });
});
