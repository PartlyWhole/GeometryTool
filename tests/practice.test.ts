import { describe, expect, it } from "vitest";
import { fig, polar } from "../src/practice/content/figures";
import {
  holds,
  isBetween,
  isInterior,
  isLinearPair,
  isVertical,
  marked,
  measureOf,
  resolveAngle,
  resolveSeg,
} from "../src/practice/oracle";
import { reasonById } from "../src/practice/reasons";
import { validateLine, reachedGoal, type ProofLine, type ProofProblem } from "../src/practice/proof";
import { statementText } from "../src/practice/notation";
import {
  type Statement,
  add,
  ang,
  div,
  inSpan,
  len,
  meas,
  mul,
  num,
  ray,
  seg,
  toPoly,
  vr,
} from "../src/practice/terms";

// Fig. 1 of the reference: four rays from V, equal outer angles, shared middle.
function fanFigure() {
  const f = fig("Fan");
  f.at("V", 0, 0);
  for (const [label, deg] of [
    ["W", 150],
    ["X", 110],
    ["Y", 70],
    ["Z", 30],
  ] as [string, number][]) {
    const p = polar(0, 0, deg, 120);
    f.at(label, p.x, p.y);
  }
  ["W", "X", "Y", "Z"].forEach((l) => f.ray("V", l));
  return f.build();
}

// Two lines crossing at X, as in Fig. 14.
function crossingFigure() {
  const f = fig("Crossing");
  f.at("A", -120, -40).at("B", 120, 40).at("C", -110, 60).at("D", 110, -60);
  f.seg("A", "B").seg("C", "D");
  f.cross("X", ["A", "B"], ["C", "D"]);
  return f.build();
}

describe("figure building and resolution", () => {
  it("resolves a three-point angle to a board angle", () => {
    const b = fanFigure();
    expect(resolveAngle(b, ang("WVX"))).toBeDefined();
    expect(measureOf(b, ang("WVX"))).toBeCloseTo(40, 4);
    expect(measureOf(b, ang("WVY"))).toBeCloseTo(80, 4);
  });

  it("names an angle in either order", () => {
    const b = fanFigure();
    expect(measureOf(b, ang("XVW"))).toBeCloseTo(40, 4);
  });

  it("finds the interior ray of an angle", () => {
    const b = fanFigure();
    expect(isInterior(b, "X", ang("WVY"))).toBe(true);
    expect(isInterior(b, "Z", ang("WVY"))).toBe(false);
  });

  it("reads vertical and linear pairs off a crossing", () => {
    const b = crossingFigure();
    expect(isVertical(b, ang("AXC"), ang("BXD"))).toBe(true);
    expect(isVertical(b, ang("AXC"), ang("AXD"))).toBe(false);
    expect(isLinearPair(b, ang("AXC"), ang("CXB"))).toBe(true);
    expect(isLinearPair(b, ang("AXC"), ang("BXD"))).toBe(false);
  });

  it("reads betweenness off collinear points", () => {
    const b = fig().at("A", 0, 0).at("C", 200, 0).seg("A", "C").on("B", "A", "C", 0.4).build();
    expect(isBetween(b, "B", "A", "C")).toBe(true);
    expect(isBetween(b, "A", "B", "C")).toBe(false);
    expect(resolveSeg(b, seg("A", "B"))).toBeDefined();
  });

  it("treats tick marks as marked congruence but plain equality as not marked", () => {
    const b = fig()
      .at("A", 0, 0).at("B", 100, 0).at("C", 0, 60).at("D", 100, 60)
      .seg("A", "B").seg("C", "D")
      .tick(["A", "B"], ["C", "D"])
      .build();
    const cong: Statement = { k: "cong", l: seg("A", "B"), r: seg("C", "D") };
    expect(marked(b, cong)).toBe(true);
    const b2 = fig()
      .at("A", 0, 0).at("B", 100, 0).at("C", 0, 60).at("D", 100, 60)
      .seg("A", "B").seg("C", "D")
      .build();
    // Equal on the page, but nothing marks it — the reference forbids reading it.
    expect(holds(b2, cong)).toBe(true);
    expect(marked(b2, cong)).toBe(false);
  });
});

describe("polynomial normalisation", () => {
  it("collects like terms and ignores order", () => {
    expect(toPoly(add(len("A", "B"), len("B", "C")))).toEqual(
      toPoly(add(len("C", "B"), len("B", "A"))),
    );
  });

  it("solves a linear combination", () => {
    const c = inSpan(toPoly(add(vr("x"), num(-3))), [
      toPoly(add(vr("x"), vr("y"), num(-5))),
      toPoly(add(vr("y"), num(-2))),
    ]);
    expect(c).toBeTruthy();
    expect(c![0]).toBeCloseTo(1, 9);
    expect(c![1]).toBeCloseTo(-1, 9);
  });

  it("rejects a target outside the span", () => {
    expect(inSpan(toPoly(vr("z")), [toPoly(vr("x")), toPoly(vr("y"))])).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Helpers for driving a proof
// ---------------------------------------------------------------------------

type Draft = { statement: Statement; reasonId: string; cites: number[] };

function runProof(problem: ProofProblem, drafts: Draft[]) {
  const lines: ProofLine[] = [];
  const results = drafts.map((d, i) => {
    const check = validateLine(problem, lines, {
      statement: d.statement,
      reasonId: d.reasonId,
      cites: d.cites.map((n) => lines[n - 1]?.id ?? "missing"),
    });
    if (check.ok)
      lines.push({
        id: "L" + (i + 1),
        statement: d.statement,
        reasonId: d.reasonId,
        cites: d.cites.map((n) => lines[n - 1]?.id ?? "missing"),
      });
    return check;
  });
  return { lines, results };
}

const mAng = (n: string) => meas(n);

describe("the reference's Fig. 5 proof, step by step", () => {
  const figure = fanFigure();
  const problem: ProofProblem = {
    id: "fig1",
    title: "Adding a shared angle",
    prompt: "Given ∠WVX ≅ ∠YVZ, prove m∠WVY = m∠XVZ.",
    figure,
    givens: [{ k: "cong", l: ang("WVX"), r: ang("YVZ") }],
    goal: { k: "eq", l: mAng("WVY"), r: mAng("XVZ") },
  };

  const drafts: Draft[] = [
    { statement: { k: "cong", l: ang("WVX"), r: ang("YVZ") }, reasonId: "given", cites: [] },
    { statement: { k: "eq", l: mAng("WVX"), r: mAng("YVZ") }, reasonId: "def-cong-ang", cites: [1] },
    { statement: { k: "eq", l: mAng("XVY"), r: mAng("XVY") }, reasonId: "reflexive", cites: [] },
    {
      statement: {
        k: "eq",
        l: add(mAng("WVX"), mAng("XVY")),
        r: add(mAng("YVZ"), mAng("XVY")),
      },
      reasonId: "addition-property",
      cites: [2, 3],
    },
    {
      statement: { k: "eq", l: add(mAng("WVX"), mAng("XVY")), r: mAng("WVY") },
      reasonId: "angle-addition",
      cites: [],
    },
    {
      statement: { k: "eq", l: add(mAng("YVZ"), mAng("XVY")), r: mAng("XVZ") },
      reasonId: "angle-addition",
      cites: [],
    },
    {
      statement: { k: "eq", l: mAng("WVY"), r: mAng("XVZ") },
      reasonId: "substitution",
      cites: [4, 5, 6],
    },
  ];

  it("accepts every step", () => {
    const { results, lines } = runProof(problem, drafts);
    results.forEach((r, i) => {
      if (!r.ok) throw Error("step " + (i + 1) + " rejected: " + r.why);
    });
    expect(lines).toHaveLength(7);
    expect(reachedGoal(problem, lines)).toBe(true);
  });

  it("rejects the three mislabellings the reference warns about", () => {
    // Step 3 is reflexive, not transitive.
    const { lines } = runProof(problem, drafts.slice(0, 2));
    expect(
      validateLine(problem, lines, {
        statement: { k: "eq", l: mAng("XVY"), r: mAng("XVY") },
        reasonId: "transitive",
        cites: [],
      }).ok,
    ).toBe(false);

    // Step 4 is the addition property, not reflexive.
    const three = runProof(problem, drafts.slice(0, 3));
    expect(
      validateLine(problem, three.lines, {
        statement: {
          k: "eq",
          l: add(mAng("WVX"), mAng("XVY")),
          r: add(mAng("YVZ"), mAng("XVY")),
        },
        reasonId: "reflexive",
        cites: [],
      }).ok,
    ).toBe(false);

    // Step 6 is substitution, not symmetric.
    const six = runProof(problem, drafts.slice(0, 6));
    expect(
      validateLine(problem, six.lines, {
        statement: { k: "eq", l: mAng("WVY"), r: mAng("XVZ") },
        reasonId: "symmetric",
        cites: [six.lines[5].id],
      }).ok,
    ).toBe(false);
  });

  it("refuses a statement that does not follow", () => {
    const { lines } = runProof(problem, drafts.slice(0, 3));
    const bad = validateLine(problem, lines, {
      statement: { k: "eq", l: mAng("WVY"), r: mAng("XVZ") },
      reasonId: "substitution",
      cites: [lines[1].id, lines[2].id],
    });
    expect(bad.ok).toBe(false);
  });
});

describe("the Vertical Angles Theorem proof from §9", () => {
  const figure = crossingFigure();
  const problem: ProofProblem = {
    id: "vat",
    title: "Vertical Angles Theorem",
    prompt: "Prove that ∠AXC ≅ ∠BXD.",
    figure,
    givens: [],
    goal: { k: "cong", l: ang("AXC"), r: ang("BXD") },
    forbid: ["vertical-angles-theorem"],
  };

  it("accepts the supplement-subtraction route", () => {
    const drafts: Draft[] = [
      { statement: { k: "linearPair", a: ang("AXC"), b: ang("CXB") }, reasonId: "def-linear-pair", cites: [] },
      { statement: { k: "linearPair", a: ang("CXB"), b: ang("BXD") }, reasonId: "def-linear-pair", cites: [] },
      { statement: { k: "eq", l: add(mAng("AXC"), mAng("CXB")), r: num(180) }, reasonId: "linear-pair-theorem", cites: [1] },
      { statement: { k: "eq", l: add(mAng("CXB"), mAng("BXD")), r: num(180) }, reasonId: "linear-pair-theorem", cites: [2] },
      {
        statement: { k: "eq", l: add(mAng("AXC"), mAng("CXB")), r: add(mAng("CXB"), mAng("BXD")) },
        reasonId: "substitution",
        cites: [3, 4],
      },
      { statement: { k: "eq", l: mAng("AXC"), r: mAng("BXD") }, reasonId: "subtraction-property", cites: [5] },
      { statement: { k: "cong", l: ang("AXC"), r: ang("BXD") }, reasonId: "def-cong-ang", cites: [6] },
    ];
    const { results, lines } = runProof(problem, drafts);
    results.forEach((r, i) => {
      if (!r.ok) throw Error("step " + (i + 1) + " rejected: " + r.why);
    });
    expect(reachedGoal(problem, lines)).toBe(true);
  });

  it("refuses to cite the theorem being proved", () => {
    const check = validateLine(problem, [], {
      statement: { k: "cong", l: ang("AXC"), r: ang("BXD") },
      reasonId: "vertical-angles-theorem",
      cites: [],
    });
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.why).toMatch(/circular/i);
  });
});

describe("algebraic justification, reference §3", () => {
  const problem: ProofProblem = {
    id: "alg",
    title: "Solve and justify",
    prompt: "Given 3(x − 4) = 18, prove x = 10.",
    givens: [{ k: "eq", l: mul(num(3), add(vr("x"), num(-4))), r: num(18) }],
    goal: { k: "eq", l: vr("x"), r: num(10) },
  };

  it("accepts distributive, addition, division", () => {
    const drafts: Draft[] = [
      { statement: { k: "eq", l: mul(num(3), add(vr("x"), num(-4))), r: num(18) }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: add(mul(num(3), vr("x")), num(-12)), r: num(18) }, reasonId: "distributive", cites: [1] },
      { statement: { k: "eq", l: mul(num(3), vr("x")), r: num(30) }, reasonId: "addition-property", cites: [2] },
      { statement: { k: "eq", l: vr("x"), r: num(10) }, reasonId: "division-property", cites: [3] },
    ];
    const { results, lines } = runProof(problem, drafts);
    results.forEach((r, i) => {
      if (!r.ok) throw Error("step " + (i + 1) + " rejected: " + r.why);
    });
    expect(reachedGoal(problem, lines)).toBe(true);
  });

  it("names the right property when the direction is wrong", () => {
    const lines: ProofLine[] = [
      { id: "L1", statement: { k: "eq", l: add(mul(num(3), vr("x")), num(-12)), r: num(18) }, reasonId: "given", cites: [] },
    ];
    const check = validateLine(problem, lines, {
      statement: { k: "eq", l: mul(num(3), vr("x")), r: num(30) },
      reasonId: "subtraction-property",
      cites: ["L1"],
    });
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.why).toMatch(/Addition Property/);
  });

  it("rejects division cited for a multiplication", () => {
    const lines: ProofLine[] = [
      { id: "L1", statement: { k: "eq", l: div(vr("x"), num(2)), r: num(5) }, reasonId: "given", cites: [] },
    ];
    const check = validateLine(problem, lines, {
      statement: { k: "eq", l: vr("x"), r: num(10) },
      reasonId: "division-property",
      cites: ["L1"],
    });
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.why).toMatch(/Multiplication Property/);
  });
});

describe("the addition postulates guard their hidden condition", () => {
  const collinear = fig()
    .at("A", 0, 0).at("C", 200, 0).seg("A", "C").on("B", "A", "C", 0.4)
    .build();

  it("accepts parts summing to the whole when B is between", () => {
    const p: ProofProblem = {
      id: "sap", title: "", prompt: "", figure: collinear, givens: [],
      goal: { k: "eq", l: add(len("A", "B"), len("B", "C")), r: len("A", "C") },
    };
    const check = validateLine(p, [], {
      statement: p.goal,
      reasonId: "segment-addition",
      cites: [],
    });
    expect(check.ok).toBe(true);
  });

  it("accepts the postulate run backwards as a subtraction", () => {
    const p: ProofProblem = {
      id: "sap2", title: "", prompt: "", figure: collinear, givens: [],
      goal: { k: "eq", l: add(len("A", "C"), { k: "neg", t: len("A", "B") }), r: len("B", "C") },
    };
    const check = validateLine(p, [], { statement: p.goal, reasonId: "segment-addition", cites: [] });
    expect(check.ok).toBe(true);
  });

  it("rejects it when the middle point is not between the others", () => {
    // A, C, B in that order: B is outside AC, the reference's Fig. 3 counterexample.
    const bad = fig().at("A", 0, 0).at("B", 300, 0).seg("A", "B").on("C", "A", "B", 0.6).build();
    const p: ProofProblem = {
      id: "sap3", title: "", prompt: "", figure: bad, givens: [],
      goal: { k: "eq", l: add(len("A", "B"), len("B", "C")), r: len("A", "C") },
    };
    const check = validateLine(p, [], { statement: p.goal, reasonId: "segment-addition", cites: [] });
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.why).toMatch(/between/i);
  });

  it("rejects an angle sum whose middle ray is outside", () => {
    const b = fanFigure();
    const p: ProofProblem = {
      id: "aap", title: "", prompt: "", figure: b, givens: [],
      goal: { k: "eq", l: add(mAng("WVX"), mAng("XVY")), r: mAng("WVY") },
    };
    expect(validateLine(p, [], { statement: p.goal, reasonId: "angle-addition", cites: [] }).ok).toBe(true);
    const bad: ProofProblem = {
      ...p,
      goal: { k: "eq", l: add(mAng("WVY"), mAng("YVZ")), r: mAng("WVX") },
    };
    expect(validateLine(bad, [], { statement: bad.goal, reasonId: "angle-addition", cites: [] }).ok).toBe(false);
  });
});

describe("definitions and theorems", () => {
  it("turns a midpoint into congruent halves and back", () => {
    const b = fig().at("A", 0, 0).at("B", 200, 0).seg("A", "B").on("M", "A", "B", 0.5).build();
    const p: ProofProblem = {
      id: "mid", title: "", prompt: "", figure: b,
      givens: [{ k: "midpoint", p: "M", seg: seg("A", "B") }],
      goal: { k: "cong", l: seg("A", "M"), r: seg("M", "B") },
    };
    const lines: ProofLine[] = [
      { id: "L1", statement: p.givens[0], reasonId: "given", cites: [] },
    ];
    expect(validateLine(p, lines, { statement: p.goal, reasonId: "def-midpoint", cites: ["L1"] }).ok).toBe(true);
  });

  it("applies the angle bisector definition", () => {
    const f = fig();
    f.at("V", 0, 0);
    for (const [l, d] of [["A", 120], ["D", 80], ["C", 40]] as [string, number][]) {
      const q = polar(0, 0, d, 120);
      f.at(l, q.x, q.y);
    }
    ["A", "D", "C"].forEach((l) => f.ray("V", l));
    const b = f.build();
    const p: ProofProblem = {
      id: "bis", title: "", prompt: "", figure: b,
      givens: [{ k: "bisects", by: ray("V", "D"), of: ang("AVC") }],
      goal: { k: "cong", l: ang("AVD"), r: ang("DVC") },
    };
    const lines: ProofLine[] = [
      { id: "L1", statement: p.givens[0], reasonId: "given", cites: [] },
    ];
    expect(validateLine(p, lines, { statement: p.goal, reasonId: "def-ang-bisector", cites: ["L1"] }).ok).toBe(true);
  });

  it("applies the congruent supplements theorem", () => {
    const p: ProofProblem = {
      id: "cs", title: "", prompt: "",
      givens: [
        { k: "supp", a: ang("1"), b: ang("3") },
        { k: "supp", a: ang("2"), b: ang("3") },
      ],
      goal: { k: "cong", l: ang("1"), r: ang("2") },
    };
    const lines: ProofLine[] = [
      { id: "L1", statement: p.givens[0], reasonId: "given", cites: [] },
      { id: "L2", statement: p.givens[1], reasonId: "given", cites: [] },
    ];
    expect(
      validateLine(p, lines, { statement: p.goal, reasonId: "congruent-supplements", cites: ["L1", "L2"] }).ok,
    ).toBe(true);
  });

  it("applies right angle congruence only when both are right", () => {
    const p: ProofProblem = {
      id: "rac", title: "", prompt: "",
      givens: [{ k: "angleClass", ang: ang("1"), cls: "right" }],
      goal: { k: "cong", l: ang("1"), r: ang("2") },
    };
    const one: ProofLine[] = [{ id: "L1", statement: p.givens[0], reasonId: "given", cites: [] }];
    expect(validateLine(p, one, { statement: p.goal, reasonId: "right-angle-congruence", cites: ["L1", "L1"] }).ok).toBe(false);
  });
});

describe("notation", () => {
  it("writes statements the way the reference does", () => {
    expect(statementText({ k: "eq", l: add(mAng("ABD"), mAng("DBC")), r: mAng("ABC") }))
      .toBe("m∠ABD + m∠DBC = m∠ABC");
    expect(statementText({ k: "cong", l: seg("A", "B"), r: seg("C", "D") })).toBe("AB ≅ CD");
    expect(statementText({ k: "eq", l: mul(num(3), vr("x")), r: num(30) })).toBe("3x = 30");
    expect(statementText({ k: "eq", l: add(mul(num(16), vr("x")), num(-7)), r: num(73) }))
      .toBe("16x − 7 = 73");
    expect(statementText({ k: "midpoint", p: "M", seg: seg("A", "B") }))
      .toBe("M is the midpoint of AB");
    expect(statementText({ k: "eq", l: div(len("A", "B"), num(2)), r: num(11) })).toBe("AB/2 = 11");
  });
});

describe("reason catalogue", () => {
  it("covers every concept the module names", () => {
    const wanted = [
      "segment-addition", "angle-addition", "substitution",
      "addition-property", "subtraction-property", "multiplication-property",
      "division-property", "distributive", "reflexive", "symmetric",
      "transitive", "def-cong-ang", "def-cong-seg", "def-vertical",
      "def-linear-pair", "def-adjacent", "def-supplementary",
      "def-complementary", "def-between", "def-ang-bisector",
      "def-seg-bisector", "def-midpoint", "def-right-angle",
      "def-straight-angle", "linear-pair-theorem", "vertical-angles-theorem",
      "congruent-supplements", "congruent-complements", "right-angle-congruence",
    ];
    for (const id of wanted) expect(reasonById(id), id).toBeDefined();
  });
});

describe("the figure library", () => {
  it("builds every figure without error", async () => {
    const { LIBRARY } = await import("../src/practice/content/library");
    for (const [name, make] of Object.entries(LIBRARY)) {
      expect(() => make(), name).not.toThrow();
      const b = make();
      expect(b.points.length, name).toBeGreaterThan(1);
    }
  });

  it("gives the crossing four numbered angles that pair up", async () => {
    const { crossing } = await import("../src/practice/content/library");
    const b = crossing();
    expect(b.angles.map((a) => a.label).sort()).toEqual(["1", "2", "3", "4"]);
    expect(isVertical(b, ang("1"), ang("3"))).toBe(true);
    expect(isVertical(b, ang("2"), ang("4"))).toBe(true);
    expect(isLinearPair(b, ang("1"), ang("2"))).toBe(true);
  });

  it("enumerates nameable objects on a figure", async () => {
    const { figureObjects } = await import("../src/practice/inventory");
    const { collinear } = await import("../src/practice/content/library");
    const inv = figureObjects(collinear());
    expect(inv.points.sort()).toEqual(["A", "B", "C"]);
    expect(inv.segments.map((s) => s.a + s.b).sort()).toEqual(["AB", "AC", "BC"]);
  });
});

describe("every authored proof is solvable", () => {
  it("replays each model solution through the strict validator", async () => {
    const { PROOFS } = await import("../src/practice/content/proofs");
    const { replaySolution } = await import("../src/practice/proof");
    const failures: string[] = [];
    for (const p of PROOFS) {
      const bad = replaySolution(p);
      if (bad) failures.push(`${p.id}: step ${bad.step} — ${bad.why}`);
    }
    expect(failures).toEqual([]);
    expect(PROOFS.length).toBeGreaterThanOrEqual(11);
  });
});

describe("generators never emit an unsolvable problem", () => {
  it("replays 120 generated proofs", async () => {
    const { anglePairProblem, segmentSumProblem } = await import(
      "../src/practice/content/generators"
    );
    const { replaySolution } = await import("../src/practice/proof");
    const failures: string[] = [];
    for (let s = 1; s <= 40; s++) {
      for (const p of [
        anglePairProblem(s, "supp"),
        anglePairProblem(s, "comp"),
        segmentSumProblem(s),
      ]) {
        const bad = replaySolution(p);
        if (bad) failures.push(`${p.id}: step ${bad.step} — ${bad.why}`);
      }
    }
    expect(failures.slice(0, 5)).toEqual([]);
  });

  it("generates naming items whose targets exist on their figures", async () => {
    const { nameItems } = await import("../src/practice/content/generators");
    const { figureObjects } = await import("../src/practice/inventory");
    const { objKey } = await import("../src/practice/terms");
    const items = nameItems(7, 25);
    expect(items.length).toBeGreaterThan(15);
    for (const it of items) {
      const inv = figureObjects(it.figure);
      const pool = it.target.k === "ang" ? inv.angles : inv.segments;
      expect(pool.some((o) => objKey(o) === objKey(it.target)), it.id).toBe(true);
      if (it.mode === "choose") {
        expect(it.choices, it.id).toContain(it.answer);
        expect(new Set(it.choices).size, it.id).toBe(it.choices!.length);
      }
    }
  });
});

describe("rejection messages teach rather than just refuse", () => {
  it("names the reflexive property when both sides are the same quantity", async () => {
    const { fan } = await import("../src/practice/content/library");
    const p = {
      id: "t", title: "", prompt: "", figure: fan(), givens: [],
      goal: { k: "eq", l: mAng("WVY"), r: mAng("XVZ") },
    } as ProofProblem;
    const check = validateLine(p, [], {
      statement: { k: "eq", l: mAng("XVY"), r: mAng("XVY") },
      reasonId: "transitive",
      cites: [],
    });
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.why).toMatch(/Reflexive Property/);
  });

  it("asks for citations in readable English", async () => {
    const p = {
      id: "t2", title: "", prompt: "", givens: [],
      goal: { k: "eq", l: vr("x"), r: num(1) },
    } as ProofProblem;
    const check = validateLine(p, [], {
      statement: { k: "eq", l: vr("x"), r: num(1) },
      reasonId: "substitution",
      cites: [],
    });
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.why).toMatch(/at least 2 earlier lines/);
  });
});

describe("flashcard content is well formed", () => {
  it("offers four distinct options on every multiple-choice logic card", async () => {
    const { logicCards } = await import("../src/practice/content/logicCards");
    for (let seed = 1; seed <= 25; seed++)
      for (const c of logicCards(seed, 12)) {
        // Always/sometimes/never has exactly three verdicts by nature.
        const expected = c.tag === "Always, sometimes, never" ? 3 : 4;
        expect(c.choices.length, c.id).toBe(expected);
        expect(new Set(c.choices).size, c.id).toBe(c.choices.length);
        expect(c.correct, c.id).toBeGreaterThanOrEqual(0);
        expect(c.correct, c.id).toBeLessThan(c.choices.length);
        expect(c.why.length, c.id).toBeGreaterThan(20);
      }
  });

  it("offers four distinct options on every concept question", async () => {
    const { conceptQuestions } = await import("../src/practice/content/conceptQuiz");
    for (let seed = 1; seed <= 20; seed++)
      for (const q of conceptQuestions(seed, 14)) {
        expect(q.choices.length, q.id).toBe(4);
        expect(new Set(q.choices.map((c) => c.text)).size, q.id).toBe(4);
        expect(q.correct, q.id).toBeGreaterThanOrEqual(0);
      }
  });
});
