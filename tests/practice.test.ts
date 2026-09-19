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
  objKey,
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
    // A coefficient of 1 is never written, and a measure keeps its gap.
    expect(statementText({ k: "eq", l: add(mul(num(1), vr("x")), num(9)), r: num(63) }))
      .toBe("x + 9 = 63");
    expect(statementText({ k: "eq", l: mul(num(2), mAng("AVD")), r: mAng("AVC") }))
      .toBe("2 m∠AVD = m∠AVC");
    expect(statementText({ k: "eq", l: mul(num(-1), vr("x")), r: num(4) })).toBe("−x = 4");
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
    // The straight angle stays nameable here: the statement builder needs it,
    // and the module teaches "a straight angle in disguise" directly. It is
    // only the naming drill that must not draw one as a target.
    expect(inv.angles.map((a) => a.name)).toContain("ABC");
    expect(measureOf(collinear(), ang("ABC"))).toBeCloseTo(180, 4);
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

  it("never asks a student to name a straight or zero angle", async () => {
    const { nameItems } = await import("../src/practice/content/generators");
    const { measureOf } = await import("../src/practice/oracle");
    for (let seed = 1; seed <= 80; seed++)
      for (const it of nameItems(seed, 12)) {
        if (it.target.k !== "ang") continue;
        const deg = measureOf(it.figure, it.target);
        expect(deg, it.id).toBeDefined();
        // A straight angle on a bare line gives nothing to look at and no
        // choice to make; a zero angle is not a figure at all.
        expect(deg!, it.id).toBeGreaterThan(1);
        expect(deg!, it.id).toBeLessThan(179);
      }
  });

  it("rejects the straight angles hiding in a crossing", async () => {
    const { crossing } = await import("../src/practice/content/library");
    const b = crossing();
    // A and B are opposite ends of one line through X, so ∠AXB is straight.
    expect(measureOf(b, ang("AXB"))).toBeCloseTo(180, 4);
    expect(measureOf(b, ang("DXC"))).toBeCloseTo(180, 4);
  });

  it("teaches that a labelled angle and a three-point name are the same angle", async () => {
    const { nameItems } = await import("../src/practice/content/generators");
    const { threePointName, measureOf: mm } = await import("../src/practice/oracle");
    const { splitLabels } = await import("../src/practice/terms");
    let seen = 0;
    for (let seed = 1; seed <= 60; seed++)
      for (const it of nameItems(seed, 12)) {
        if (!it.id.includes(":equiv:")) continue;
        seen++;
        const labelled = it.figure.angles.filter((a) => a.label);
        expect(labelled.length, it.id).toBeGreaterThan(1);
        if (it.mode === "click") {
          // The expected points must genuinely name the marked angle.
          expect(it.expectPoints, it.id).toHaveLength(3);
          const name = it.expectPoints!.join("");
          const match = labelled.find(
            (a) => threePointName(it.figure, a) === name,
          );
          expect(match, it.id).toBeDefined();
          expect(it.prompt, it.id).toContain("∠" + match!.label);
          expect(mm(it.figure, { k: "ang", name })!, it.id).toBeLessThan(179);
        } else {
          expect(it.choices, it.id).toContain(it.answer);
          const label = it.answer!.replace("∠", "");
          const match = labelled.find((a) => a.label === label);
          expect(match, it.id).toBeDefined();
          expect(
            threePointName(it.figure, match!),
            it.id,
          ).toBe((it.target as { name: string }).name);
          expect(splitLabels((it.target as { name: string }).name)).toHaveLength(3);
        }
      }
    expect(seen).toBeGreaterThan(20);
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
        // No two options may be two names for one object, or both can be
        // eliminated on sight without doing any geometry.
        const keys = it.choices!.map((c) =>
          c.startsWith("∠")
            ? objKey({ k: "ang", name: c.slice(1) })
            : objKey({ k: "seg", a: c[0], b: c[1] }),
        );
        expect(new Set(keys).size, it.id + " :: " + it.choices!.join(" | ")).toBe(
          keys.length,
        );
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

  it("detects a stem that restates the term", async () => {
    const { givesItAway } = await import("../src/practice/content/conceptQuiz");
    // Cases that must be caught.
    for (const [text, term] of [
      ["55° and 35° are complementary.", "Complementary angles"],
      ["115° and 65° are supplementary.", "Supplementary angles"],
      ["If two angles form a linear pair, they are supplementary.", "Linear Pair Theorem"],
      ["Vertical angles are congruent.", "Vertical Angles Theorem"],
      ["All right angles are congruent.", "Right Angle Congruence Theorem"],
      ["Points that lie on one line are collinear.", "Collinear"],
      ["Point B is between A and C.", "Betweenness"],
      // Notation says the word out loud.
      ["PQ ⊥ AB.", "Perpendicular"],
      ["AB ∥ CD.", "Parallel"],
    ] as [string, string][])
      expect(givesItAway(text, term), term).toBe(true);
    // Cases that must not be, or good questions would be suppressed.
    for (const [text, term] of [
      ["If B is between A and C, then AB + BC = AC.", "Segment Addition Postulate"],
      ["An angle measuring exactly 180°.", "Straight angle"],
      ["A point that divides a segment into two congruent halves.", "Midpoint"],
      ["All the angles at a shared vertex, taken once around, total 360°.", "Angles around a point"],
      ["Two angles that sit opposite each other at a crossing.", "Vertical angles"],
      ["A bisector that also meets the segment at 90°.", "Perpendicular bisector"],
    ] as [string, string][])
      expect(givesItAway(text, term), term).toBe(false);
  });

  it("never hands the answer over in the question stem", async () => {
    const { conceptQuestions, givesItAway } = await import(
      "../src/practice/content/conceptQuiz"
    );
    const { CONCEPTS } = await import("../src/practice/content/concepts");
    for (let seed = 1; seed <= 60; seed++)
      for (const q of conceptQuestions(seed, 14)) {
        // Only the directions whose answer is the term itself can leak.
        if (q.kind !== "def-to-term" && q.kind !== "example-to-term") continue;
        const c = CONCEPTS.find((x) => x.id === q.conceptId)!;
        const stemOnly = q.prompt.replace(/^Which [^?]*\?\s*/, "");
        expect(
          givesItAway(stemOnly || q.prompt, c.term),
          q.id + " :: " + q.prompt,
        ).toBe(false);
      }
  });

  it("gives every concept an explanation distinct from its definition", async () => {
    const { CONCEPTS } = await import("../src/practice/content/concepts");
    for (const c of CONCEPTS) {
      const explanation = c.because ?? c.watch;
      expect(explanation, c.id).toBeTruthy();
      expect(explanation!.trim(), c.id).not.toBe(c.definition.trim());
    }
  });

  it("explains rather than repeating the answer back", async () => {
    const { conceptQuestions } = await import("../src/practice/content/conceptQuiz");
    for (let seed = 1; seed <= 20; seed++)
      for (const q of conceptQuestions(seed, 14)) {
        if (q.kind !== "term-to-def") continue;
        const answer = q.choices[q.correct].text.trim();
        expect(q.why.trim(), q.id).not.toBe(answer);
      }
  });

  it("writes named theorems with their capitals intact", async () => {
    const { conceptQuestions } = await import("../src/practice/content/conceptQuiz");
    for (let seed = 1; seed <= 40; seed++)
      for (const q of conceptQuestions(seed, 14))
        expect(q.prompt, q.id).not.toMatch(/[a-z]\w* (Angles|Pair|Addition) /);
  });

  it("never offers a distractor that the figure also shows", async () => {
    const { conceptQuestions, FIGURE_SHOWS } = await import(
      "../src/practice/content/conceptQuiz"
    );
    const { CONCEPTS } = await import("../src/practice/content/concepts");
    const byTerm = new Map(CONCEPTS.map((c) => [c.term, c.id]));
    for (let seed = 1; seed <= 80; seed++)
      for (const q of conceptQuestions(seed, 14)) {
        if (!q.figure || q.kind !== "example-to-term") continue;
        const shown = FIGURE_SHOWS[q.figure] ?? [];
        for (const choice of q.choices) {
          const id = byTerm.get(choice.text);
          if (!id || id === q.conceptId) continue;
          // The perpendicular figure also contains supplementary angles, so
          // "Supplementary angles" must not be offered against it.
          expect(shown.includes(id), q.id + " offered " + choice.text).toBe(false);
        }
      }
  });

  it("gives every concept a topic", async () => {
    const { CONCEPTS, TOPIC } = await import("../src/practice/content/concepts");
    for (const c of CONCEPTS) expect(TOPIC[c.id], c.id).toBeTruthy();
  });

  it("draws distractors from the same subject", async () => {
    const { conceptQuestions } = await import("../src/practice/content/conceptQuiz");
    const { CONCEPTS, topicOf } = await import("../src/practice/content/concepts");
    const byTerm = new Map(CONCEPTS.map((c) => [c.term, c]));
    let checked = 0;
    for (let seed = 1; seed <= 60; seed++)
      for (const q of conceptQuestions(seed, 14)) {
        // Only the directions whose options are terms can be judged this way.
        if (q.kind !== "def-to-term" && q.kind !== "example-to-term") continue;
        const me = CONCEPTS.find((c) => c.id === q.conceptId)!;
        const topic = topicOf(me);
        const others = q.choices
          .map((x) => byTerm.get(x.text))
          .filter((c): c is NonNullable<typeof c> => !!c && c.id !== me.id);
        if (!others.length) continue;
        checked++;
        const sameTopic = others.filter((o) => topicOf(o) === topic).length;
        // At least one plausible neighbour; the pool is small for some topics.
        expect(sameTopic, q.id + " :: " + others.map((o) => o.term).join(", "))
          .toBeGreaterThan(0);
      }
    expect(checked).toBeGreaterThan(100);
  });

  it("covers every concept", async () => {
    const { conceptQuestions } = await import("../src/practice/content/conceptQuiz");
    const { CONCEPTS } = await import("../src/practice/content/concepts");
    const seen = new Set<string>();
    for (let seed = 1; seed <= 200; seed++)
      for (const q of conceptQuestions(seed, 14)) seen.add(q.conceptId);
    const missing = CONCEPTS.filter((c) => !seen.has(c.id)).map((c) => c.id);
    expect(missing).toEqual([]);
  });

  it("gives singular terms an article in a sentence", async () => {
    const { CONCEPTS, termPhrase } = await import("../src/practice/content/concepts");
    const byId = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
    expect(termPhrase(byId["acute"])).toBe("an acute angle");
    expect(termPhrase(byId["straight"])).toBe("a straight angle");
    expect(termPhrase(byId["midpoint"])).toBe("a midpoint");
    // Plurals, adjectives and named rules take no indefinite article.
    expect(termPhrase(byId["complementary"])).toBe("complementary angles");
    expect(termPhrase(byId["collinear"])).toBe("collinear");
    expect(termPhrase(byId["reflexive"])).toBe("the Reflexive Property");
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

describe("the statement builder keeps what you pick", () => {
  it("fills a slot and advances in one update", async () => {
    const { newDraft, buildStatement, FORMS } = await import(
      "../src/practice/StatementBuilder"
    );
    const { ang } = await import("../src/practice/terms");
    // Reproduces the reported bug by simulating what the component does: the
    // pick handler must produce a draft carrying BOTH the value and the new
    // focus, not two drafts derived from the same stale one.
    let d = newDraft("vertical");
    const fill = (v: { kind: "obj"; obj: ReturnType<typeof ang> }) => {
      const slots = d.slots.map((s, j) => (j === d.focus ? v : s));
      const next = slots.findIndex(
        (s, i) => i > d.focus && (s.kind === "obj" ? !s.obj : true),
      );
      d = { ...d, slots, focus: next >= 0 ? next : d.focus };
    };
    fill({ kind: "obj", obj: ang("1") });
    // The first slot must already hold the choice, before the second is made.
    expect(d.slots[0]).toEqual({ kind: "obj", obj: ang("1") });
    expect(d.focus).toBe(1);
    fill({ kind: "obj", obj: ang("3") });
    const built = buildStatement(d);
    expect(built.ok).toBe(true);
    if (built.ok)
      expect(built.statement).toEqual({ k: "vertical", a: ang("1"), b: ang("3") });
    expect(FORMS.find((f) => f.id === "vertical")).toBeDefined();
  });
});

describe("generated figures match the numbers they state", () => {
  /** "m∠1 = 5x − 3" evaluated at the x the problem proves. */
  const statedMeasure = (prompt: string, which: 1 | 2) => {
    const m = new RegExp("m∠" + which + " = (−?\\d*)x\\s*(?:([+−])\\s*(\\d+))?").exec(prompt);
    const x = Number(/Prove that x = ([\d.]+)/.exec(prompt)?.[1]);
    if (!m || !Number.isFinite(x)) return undefined;
    const coef = m[1] === "" ? 1 : m[1] === "−" ? -1 : Number(m[1].replace("−", "-"));
    const constant = m[3] ? Number(m[3]) * (m[2] === "−" ? -1 : 1) : 0;
    return coef * x + constant;
  };

  it("draws each angle at the measure the problem states", async () => {
    const { anglePairProblem } = await import("../src/practice/content/generators");
    const { measureOf } = await import("../src/practice/oracle");
    let checked = 0;
    for (const kind of ["supp", "comp"] as const)
      for (let seed = 1; seed <= 25; seed++) {
        const p = anglePairProblem(seed, kind);
        expect(p.figure, p.id).toBeDefined();
        const drawn1 = measureOf(p.figure!, ang("1"))!;
        const drawn2 = measureOf(p.figure!, ang("2"))!;
        expect(drawn1 + drawn2, p.id).toBeCloseTo(kind === "supp" ? 180 : 90, 3);
        const want1 = statedMeasure(p.prompt, 1);
        const want2 = statedMeasure(p.prompt, 2);
        expect(want1, p.id + " :: " + p.prompt).toBeDefined();
        // The drawing is to scale: what it measures is what the text says.
        expect(drawn1, p.id + " :: " + p.prompt).toBeCloseTo(want1!, 2);
        expect(drawn2, p.id + " :: " + p.prompt).toBeCloseTo(want2!, 2);
        checked++;
      }
    expect(checked).toBe(50);
  });

  it("places B in the ratio the segment problem states", async () => {
    const { segmentSumProblem } = await import("../src/practice/content/generators");
    const { lengthOf, isBetween } = await import("../src/practice/oracle");
    const { seg } = await import("../src/practice/terms");
    for (let seed = 1; seed <= 25; seed++) {
      const p = segmentSumProblem(seed);
      expect(p.figure, p.id).toBeDefined();
      const ab = lengthOf(p.figure!, seg("A", "B"))!;
      const bc = lengthOf(p.figure!, seg("B", "C"))!;
      const ac = lengthOf(p.figure!, seg("A", "C"))!;
      expect(isBetween(p.figure!, "B", "A", "C"), p.id).toBe(true);
      expect(ab + bc, p.id).toBeCloseTo(ac, 4);
      // The whole is stated; the drawn parts must share it in the same ratio.
      const whole = Number(/AC = ([\d.]+)/.exec(p.prompt)![1]);
      const part1 = Number(/Prove that x = ([\d.]+)/.exec(p.prompt)![1]);
      expect(whole, p.id).toBeGreaterThan(0);
      expect(part1, p.id).toBeGreaterThan(0);
      expect(ab / ac, p.id).toBeGreaterThan(0.02);
      expect(ab / ac, p.id).toBeLessThan(0.98);
    }
  });

  it("gives every authored proof a figure, unless it is pure algebra", async () => {
    const { PROOFS } = await import("../src/practice/content/proofs");
    const abstract = ["algebra-justify"];
    for (const p of PROOFS)
      if (!abstract.includes(p.id)) expect(p.figure, p.id).toBeDefined();
  });
});

describe("every read item is answerable from its own figure", () => {
  it("accepts at least one answer that the figure actually supports", async () => {
    const { READ_ITEMS } = await import("../src/practice/content/translate");
    const { holds, marked } = await import("../src/practice/oracle");
    const { statementText } = await import("../src/practice/notation");
    for (const item of READ_ITEMS) {
      const supported = item.accept.filter(
        (a) => holds(item.figure, a) || marked(item.figure, a),
      );
      expect(
        supported.length,
        item.id + " :: none of " +
          item.accept.map(statementText).join(" / ") + " holds in its figure",
      ).toBeGreaterThan(0);
    }
    expect(READ_ITEMS.length).toBeGreaterThanOrEqual(13);
  });

  it("builds every construct item's starting figure", async () => {
    const { CONSTRUCT_ITEMS } = await import("../src/practice/content/translate");
    for (const item of CONSTRUCT_ITEMS) {
      expect(item.start.points.length, item.id).toBeGreaterThan(1);
      // Every movable point must exist on the figure it belongs to.
      for (const label of item.movable)
        expect(
          item.start.points.some((p) => p.label === label),
          item.id + " cannot move " + label,
        ).toBe(true);
    }
  });
});

describe("building a statement by clicking the figure", () => {
  it("builds the three-angle equation entirely by clicking", async () => {
    const { newDraft, insertObject, buildStatement, wants } = await import(
      "../src/practice/StatementBuilder"
    );
    const { statementText } = await import("../src/practice/notation");
    const { push } = await import("../src/practice/tokens");
    let d = newDraft("eq");
    expect(wants(d)).toBe("expression");
    // Click an arc, then +, then the next arc, and so on.
    const plus = () => {
      const cur = d.slots[d.focus];
      if (cur.kind !== "expr") return;
      d = {
        ...d,
        slots: d.slots.map((s, j) =>
          j === d.focus ? { kind: "expr", toks: push(cur.toks, { t: "op", op: "+" }) } : s,
        ),
      };
    };
    d = insertObject(d, ang("PVR"));
    plus();
    d = insertObject(d, ang("RVS"));
    plus();
    d = insertObject(d, ang("SVQ"));
    d = { ...d, focus: 1 };
    const right = d.slots[1];
    if (right.kind === "expr")
      d = {
        ...d,
        slots: [d.slots[0], { kind: "expr", toks: [{ t: "num", v: "180" }] }],
      };
    const built = buildStatement(d);
    expect(built.ok).toBe(true);
    if (built.ok)
      expect(statementText(built.statement)).toBe(
        "m∠PVR + m∠RVS + m∠SVQ = 180",
      );
  });

  it("treats two objects clicked in a row as a product, visibly", async () => {
    const { newDraft, insertObject } = await import("../src/practice/StatementBuilder");
    const { tokensText } = await import("../src/practice/tokens");
    let d = newDraft("eq");
    d = insertObject(d, ang("PVR"));
    d = insertObject(d, ang("RVS"));
    const slot = d.slots[0];
    // Forgetting the operator is legible in the slot rather than silent.
    expect(slot.kind === "expr" && tokensText(slot.toks)).toBe("m∠PVR m∠RVS");
  });

  it("fills an object slot from the figure and moves on", async () => {
    const { newDraft, insertObject, buildStatement } = await import(
      "../src/practice/StatementBuilder"
    );
    let d = newDraft("vertical");
    d = insertObject(d, ang("1"));
    expect(d.slots[0]).toEqual({ kind: "obj", obj: ang("1") });
    expect(d.focus).toBe(1);
    d = insertObject(d, ang("3"));
    const built = buildStatement(d);
    expect(built.ok).toBe(true);
    if (built.ok)
      expect(built.statement).toEqual({ k: "vertical", a: ang("1"), b: ang("3") });
  });

  it("refuses an object the focused slot cannot take", async () => {
    const { newDraft, insertObject } = await import("../src/practice/StatementBuilder");
    const { seg } = await import("../src/practice/terms");
    // A segment cannot go where the form wants an angle.
    const d = newDraft("supp");
    expect(insertObject(d, seg("A", "B"))).toEqual(d);
  });

  it("reports what the focused slot is waiting for", async () => {
    const { newDraft, wants } = await import("../src/practice/StatementBuilder");
    expect(wants(newDraft("supp"))).toBe("angle");
    expect(wants(newDraft("midpoint"))).toBe("point");
    expect(wants(newDraft("eq"))).toBe("expression");
  });
});

describe("a student is judged on the geometry, not the naming", () => {
  it("accepts the three-point name where the item expects the label", async () => {
    const { READ_ITEMS } = await import("../src/practice/content/translate");
    const { matchesAccepted } = await import("../src/practice/terms");
    const { angleNamer } = await import("../src/practice/oracle");
    const item = READ_ITEMS.find((i) => i.id === "vertical-equal")!;
    const canon = angleNamer(item.figure);
    // The item is written with the figure's labels; ∠1 is also ∠AXD.
    expect(matchesAccepted(item.accept[0], item.accept, canon)).toBe(true);
    expect(
      matchesAccepted(
        { k: "cong", l: ang("AXD"), r: ang("CXB") },
        item.accept,
        canon,
      ),
      "clicking the arms should count the same as clicking the arc",
    ).toBe(true);
    // A genuinely different pair still fails.
    expect(
      matchesAccepted(
        { k: "cong", l: ang("AXD"), r: ang("AXC") },
        item.accept,
        canon,
      ),
    ).toBe(false);
  });

  it("accepts a proof line written with either name", async () => {
    const { PROOFS } = await import("../src/practice/content/proofs");
    const { validateLine } = await import("../src/practice/proof");
    const p = PROOFS.find((x) => x.id === "vertical-angles")!;
    // The figure labels these ∠1 and ∠2; name them by their points instead.
    const byPoints = validateLine(p, [], {
      statement: { k: "linearPair", a: ang("AXD"), b: ang("AXC") },
      reasonId: "def-linear-pair",
      cites: [],
    });
    const byLabel = validateLine(p, [], {
      statement: { k: "linearPair", a: ang("1"), b: ang("2") },
      reasonId: "def-linear-pair",
      cites: [],
    });
    expect(byLabel.ok).toBe(true);
    expect(byPoints.ok, byPoints.ok ? "" : (byPoints as { why: string }).why).toBe(true);
  });
});

describe("logic statements read as English in every form", () => {
  it("never strands a pronoun when the halves are swapped", async () => {
    const { CONDITIONALS, formText, biconditionalText, sentenceOf } = await import(
      "../src/practice/content/logic"
    );
    const forms = ["conditional", "converse", "inverse", "contrapositive"] as const;
    for (const c of CONDITIONALS) {
      const texts = [
        ...forms.map((f) => formText(c, f)),
        biconditionalText(c),
        sentenceOf(c, "p"),
        sentenceOf(c, "q"),
      ];
      for (const t of texts) {
        // "If it is a rectangle, then a figure is a square." — a clause whose
        // subject is a pronoun cannot lead once the halves are swapped.
        expect(t, c.id + " :: " + t).not.toMatch(/^If (it|they|its) /);
        // Nor may an indefinite subject appear in the consequent.
        expect(t, c.id + " :: " + t).not.toMatch(/, then an? /);
        expect(t, c.id + " :: " + t).toMatch(/[.]$/);
      }
    }
  });

  it("keeps the syllogism chains grammatical too", async () => {
    const { CHAINS, chainText } = await import("../src/practice/content/logic");
    for (const c of CHAINS)
      for (const [a, b] of [["p", "q"], ["q", "r"], ["p", "r"], ["r", "p"], ["q", "p"]] as const) {
        const t = chainText(c, a, b);
        expect(t, c.id + " :: " + t).not.toMatch(/^If (it|they) (is|are|has|have|does|do|creates|measures|bisects|form) /);
        expect(t, c.id + " :: " + t).not.toMatch(/, then an? /);
      }
  });

  it("explains the option the student actually chose", async () => {
    const { logicCards } = await import("../src/practice/content/logicCards");
    let checked = 0;
    for (let seed = 1; seed <= 40; seed++)
      for (const card of logicCards(seed, 16)) {
        if (card.tag !== "Negation") continue;
        checked++;
        // Every wrong option carries its own reason, and the shared line no
        // longer recites all of them.
        for (let i = 0; i < card.choices.length; i++)
          if (i !== card.correct)
            expect(card.whyPerChoice?.[i], card.id + " option " + i).toBeTruthy();
        expect(card.why.length, card.id).toBeLessThan(90);
      }
    expect(checked).toBeGreaterThan(10);
  });

  it("offers a distinct, complete sentence for every detachment option", async () => {
    const { logicCards } = await import("../src/practice/content/logicCards");
    for (let seed = 1; seed <= 40; seed++)
      for (const card of logicCards(seed, 16)) {
        if (card.tag !== "Law of Detachment") continue;
        expect(new Set(card.choices).size, card.id).toBe(card.choices.length);
        for (const ch of card.choices)
          expect(ch, card.id + " :: " + ch).not.toMatch(/^(It|They) /);
      }
  });
});

describe("every drag task is actually reachable", () => {
  it("finds a position of the movable point that satisfies it", async () => {
    const { CONSTRUCT_ITEMS } = await import("../src/practice/content/translate");
    const { HAND, holds } = await import("../src/practice/oracle");
    const { clone } = await import("../src/model");
    type Board = import("../src/model").Board;
    const { statementText } = await import("../src/practice/notation");

    /** Move a point the way the exercise does: along its support when it was
     *  declared to lie on one, freely otherwise. */
    const place = (board: Board, label: string, x: number, y: number) => {
      const p = board.points.find((q) => q.label === label)!;
      if (p.on) {
        const e = board.edges.find((x2) => x2.id === p.on!.edge)!;
        const a = board.points.find((q) => q.id === e.a)!;
        const c = board.points.find((q) => q.id === e.b)!;
        const dx = c.x - a.x, dy = c.y - a.y;
        const t = ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy);
        p.on.t = t;
        p.x = a.x + dx * t;
        p.y = a.y + dy * t;
      } else {
        p.x = x;
        p.y = y;
      }
    };

    const failures: string[] = [];
    for (const item of CONSTRUCT_ITEMS) {
      if (item.movable.length !== 1) continue;
      const label = item.movable[0];
      const origin = item.start.points.find((p) => p.label === label)!;
      const ok = (b: Board) =>
        item.require.every((s) => holds(b, s, HAND)) &&
        !(item.forbid ?? []).some((s) => holds(b, s, HAND));

      let found = false;
      if (origin.on) {
        for (let i = 0; !found && i <= 2000; i++) {
          const b = clone(item.start);
          const p = b.points.find((q) => q.label === label)!;
          const e = b.edges.find((x2) => x2.id === p.on!.edge)!;
          const a = b.points.find((q) => q.id === e.a)!;
          const c = b.points.find((q) => q.id === e.b)!;
          const t = 0.01 + (i / 2000) * 0.98;
          place(b, label, a.x + (c.x - a.x) * t, a.y + (c.y - a.y) * t);
          if (ok(b)) found = true;
        }
      } else {
        // The point swings about some vertex of the figure; try each in turn.
        const centres = item.start.points.filter((p) => p.label !== label);
        for (const centre of centres) {
          for (let deg = 0; !found && deg < 360; deg += 0.5)
            for (const rad of [80, 140, 200]) {
              const b = clone(item.start);
              place(
                b, label,
                centre.x + rad * Math.cos((-deg * Math.PI) / 180),
                centre.y + rad * Math.sin((-deg * Math.PI) / 180),
              );
              if (ok(b)) { found = true; break; }
            }
          if (found) break;
        }
      }
      if (!found)
        failures.push(
          item.id + " — no position of " + label + " satisfies " +
            item.require.map(statementText).join(" and "),
        );
    }
    expect(failures).toEqual([]);
  });
});

describe("numeric questions", () => {
  it("states an answer that its own figure supports", async () => {
    const { NUMERIC_ITEMS } = await import("../src/practice/content/numeric");
    const { measureOf } = await import("../src/practice/oracle");
    // Angle questions drawn to scale must measure what they claim.
    const checks: [string, string, number][] = [
      ["fa7-linear-pair", "DBC", 93],
      ["fa13a-straight", "EXD", 67.5],
      ["fa13b-vertical", "DXF", 112.5],
      ["fa11-three-lines", "PVR", 60],
    ];
    for (const [id, name, want] of checks) {
      const item = NUMERIC_ITEMS.find((x) => x.id === id)!;
      expect(item.figure, id).toBeDefined();
      expect(measureOf(item.figure!, ang(name)), id + " ∠" + name).toBeCloseTo(want, 3);
      expect(item.answer, id).toBeCloseTo(want, 6);
    }
  });

  it("gives every generated numeric question a correct, reachable answer", async () => {
    const { generatedNumeric } = await import("../src/practice/content/numeric");
    const { measureOf } = await import("../src/practice/oracle");
    for (let seed = 1; seed <= 60; seed++)
      for (const item of generatedNumeric(seed, 8)) {
        expect(Number.isFinite(item.answer), item.id).toBe(true);
        expect(item.answer, item.id).toBeGreaterThan(0);
        expect(item.why.length, item.id).toBeGreaterThan(20);
        // A trap must differ from the answer, or it would reject a correct one.
        if (item.trap)
          expect(
            Math.abs(item.trap.value - item.answer),
            item.id + " trap equals the answer",
          ).toBeGreaterThan(1e-6);
        // Where the item draws an angle, the drawing must agree with it.
        const m = item.id.startsWith("num-lp-")
          ? measureOf(item.figure!, ang("DBC"))
          : item.id.startsWith("num-comp-")
            ? measureOf(item.figure!, ang("CVB"))
            : undefined;
        if (m !== undefined) expect(m, item.id).toBeCloseTo(item.answer, 3);
      }
  });

  it("asks for the measure, not for x, where the reference warns it will", async () => {
    const { NUMERIC_ITEMS } = await import("../src/practice/content/numeric");
    const q10 = NUMERIC_ITEMS.find((x) => x.id === "fa10-substitute-back")!;
    expect(q10.answer).toBe(73);
    expect(q10.trap?.value).toBe(5);
  });
});

describe("select-all claims are judged by what the figure marks", () => {
  it("matches every authored claim against the oracle", async () => {
    const { CLAIM_ITEMS } = await import("../src/practice/content/claims");
    const { marked } = await import("../src/practice/oracle");
    const { statementText } = await import("../src/practice/notation");
    for (const item of CLAIM_ITEMS) {
      for (const c of item.claims)
        expect(
          marked(item.figure, c.statement),
          item.id + " :: " + statementText(c.statement),
        ).toBe(c.holds);
      // A select-all needs something to select and something to leave.
      expect(item.claims.some((c) => c.holds), item.id).toBe(true);
      expect(item.claims.some((c) => !c.holds), item.id).toBe(true);
    }
  });

  it("keeps the Fig. 18 answer the paper's answer", async () => {
    const { CLAIM_ITEMS } = await import("../src/practice/content/claims");
    const { statementText } = await import("../src/practice/notation");
    const item = CLAIM_ITEMS.find((i) => i.id === "fa12-marks")!;
    const trueOnes = item.claims.filter((c) => c.holds).map((c) => statementText(c.statement));
    expect(trueOnes.sort()).toEqual(["AD ≅ BC", "EB ≅ DF"]);
  });
});

describe("reason-checking items", () => {
  it("only marks a reason wrong when the validator really rejects it", async () => {
    const { reasonCheckItems } = await import("../src/practice/content/reasonCheck");
    const { validateLine } = await import("../src/practice/proof");
    const { PROOFS } = await import("../src/practice/content/proofs");
    let checkedWrong = 0, checkedRight = 0;
    for (let seed = 1; seed <= 25; seed++)
      for (const item of reasonCheckItems(seed, 8)) {
        const p = PROOFS.find((x) => "rc-" + x.id === item.id)!;
        const lines: { id: string; statement: unknown; reasonId: string; cites: string[] }[] = [];
        p.solution!.forEach((s, i) => {
          const cites = s.cites.map((n) => lines[n - 1]?.id ?? "missing");
          const row = item.rows[i];
          const check = validateLine(p, lines as never, {
            statement: row.statement,
            reasonId: row.reasonId,
            cites,
          });
          // A row marked correct must validate; one marked wrong must not.
          expect(check.ok, item.id + " row " + (i + 1) + " " + row.reasonId).toBe(row.correct);
          if (row.correct) checkedRight++; else checkedWrong++;
          lines.push({ id: "S" + (i + 1), statement: s.statement, reasonId: s.reasonId, cites });
        });
        // Every question must have something to accept and something to reject.
        expect(item.rows.some((x) => x.correct), item.id).toBe(true);
        expect(item.rows.some((x) => !x.correct), item.id).toBe(true);
      }
    expect(checkedWrong).toBeGreaterThan(20);
    expect(checkedRight).toBeGreaterThan(20);
  });

  it("gives every spoiled row the validator's own explanation", async () => {
    const { reasonCheckItems } = await import("../src/practice/content/reasonCheck");
    for (let seed = 1; seed <= 15; seed++)
      for (const item of reasonCheckItems(seed, 8))
        for (const row of item.rows)
          if (!row.correct)
            expect(row.note?.length ?? 0, item.id).toBeGreaterThan(10);
  });
});

describe("fraction-clearing questions are exact", () => {
  it("states a decimal that really does give the answer back", async () => {
    const { generatedNumeric } = await import("../src/practice/content/numeric");
    let seen = 0;
    for (let seed = 1; seed <= 200; seed++)
      for (const item of generatedNumeric(seed, 8)) {
        if (!item.id.startsWith("num-frac-")) continue;
        seen++;
        // Recover the fraction and the decimal from the wording a student reads.
        const m = /QR = (?:(\d+)\/(\d+)|([½⅓¼⅕⅙⅛]))x inches and ST = ([\d.]+) inches/.exec(item.prompt);
        expect(m, item.prompt).toBeTruthy();
        const glyph: Record<string, [number, number]> = {
          "½": [1, 2], "⅓": [1, 3], "¼": [1, 4], "⅕": [1, 5], "⅙": [1, 6], "⅛": [1, 8],
        };
        const [num, den] = m![3] ? glyph[m![3]] : [Number(m![1]), Number(m![2])];
        const stated = Number(m![4]);
        // Working it out the way the question asks must land on the answer.
        expect(stated * (den / num), item.prompt).toBeCloseTo(item.answer, 9);
      }
    expect(seen).toBeGreaterThan(20);
  });
});

describe("multi-part questions", () => {
  it("states parts whose answers its own figure and stem support", async () => {
    const { MULTIPART_ITEMS } = await import("../src/practice/content/multipart");
    const { marked, measureOf } = await import("../src/practice/oracle");
    const { statementText } = await import("../src/practice/notation");
    for (const item of MULTIPART_ITEMS) {
      expect(item.parts.length, item.id).toBeGreaterThan(1);
      for (const part of item.parts) {
        if (part.body.kind === "claims") {
          // Judged by what the figure marks, as everywhere else.
          for (const c of part.body.claims)
            expect(
              marked(item.figure!, c.statement),
              item.id + " :: " + statementText(c.statement),
            ).toBe(c.holds);
          expect(part.body.claims.some((c) => c.holds), item.id).toBe(true);
          expect(part.body.claims.some((c) => !c.holds), item.id).toBe(true);
        } else {
          expect(Number.isFinite(part.body.answer), item.id).toBe(true);
          if (part.body.trap)
            expect(
              Math.abs(part.body.trap.value - part.body.answer),
              item.id + " trap equals the answer",
            ).toBeGreaterThan(1e-6);
        }
        expect(part.why.length, item.id).toBeGreaterThan(20);
      }
    }
    // The Q13 figure must measure what both its parts claim.
    const q13 = MULTIPART_ITEMS.find((x) => x.id === "fa13")!;
    expect(measureOf(q13.figure!, ang("EXD"))).toBeCloseTo(67.5, 3);
    expect(measureOf(q13.figure!, ang("DXF"))).toBeCloseTo(112.5, 3);
  });

  it("makes Part B genuinely different from Part A", async () => {
    const { generatedMultiPart } = await import("../src/practice/content/multipart");
    for (let seed = 1; seed <= 60; seed++)
      for (const item of generatedMultiPart(seed, 4)) {
        const [a, b] = item.parts;
        expect(a.body.kind === "numeric" && b.body.kind === "numeric").toBe(true);
        if (a.body.kind === "numeric" && b.body.kind === "numeric") {
          // If the two parts shared an answer, Part B would teach nothing.
          expect(
            Math.abs(a.body.answer - b.body.answer),
            item.id + " both parts answer the same number",
          ).toBeGreaterThan(1e-6);
          // Part B must warn about carrying x across.
          expect(b.body.trap?.value, item.id).toBeCloseTo(a.body.answer, 9);
        }
      }
  });
});
