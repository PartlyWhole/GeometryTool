// Parameterised problem generators, so practice does not run out.
//
// Every generated proof carries the worked solution that produced it, and the
// test suite replays those solutions through the same strict validator the
// student faces — a generator that emits an unsolvable problem fails the build.
import type { Board } from "../../model";
import type { ProofProblem, SolutionStep } from "../proof";
import {
  type AngId,
  type ObjId,
  type SegId,
  type Statement,
  add,
  ang,
  len,
  meas,
  mul,
  num,
  objKey,
  seg,
  splitLabels,
  vr,
} from "../terms";
import { figureObjects } from "../inventory";
import { measureOf, threePointName } from "../oracle";
import { LIBRARY } from "./library";
import { fig, polar } from "./figures";

/**
 * Small deterministic generator, so a seed reproduces a whole session.
 *
 * The seed is avalanched first. Raw xorshift from nearby seeds yields
 * correlated opening values, which biased the concept shuffle enough that one
 * concept never reached the front of the list across three hundred
 * consecutive seeds.
 */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  s = Math.imul(s ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  s ^= s >>> 13;
  s = Math.imul(s, 0xc2b2ae35) >>> 0;
  s ^= s >>> 16;
  if (s === 0) s = 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

const pick = <T>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length)];
const int = (r: () => number, lo: number, hi: number) =>
  lo + Math.floor(r() * (hi - lo + 1));

// ---------------------------------------------------------------------------
// Exercise 1: name the segment or angle
// ---------------------------------------------------------------------------

export type NameItem = {
  id: string;
  figure: Board;
  /** Click the points that name this object. */
  mode: "click" | "choose";
  target: SegId | AngId;
  prompt: string;
  /** For "choose": the options, one of which is the target's name. */
  choices?: string[];
  answer?: string;
  why: string;
  /**
   * Points that count as a correct click, when they cannot be read off the
   * target's own name — as when the target is a labelled angle like ∠2 and
   * the answer is the three-point name of the same angle.
   */
  expectPoints?: string[];
  /** Show the target on the figure. */
  highlight?: boolean;
};

const FIGURE_NAMES = Object.keys(LIBRARY);

export function nameItems(seed: number, count = 10): NameItem[] {
  const r = rng(seed);
  const out: NameItem[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 40) {
    // Roughly a third of items exercise the equivalence between naming an
    // angle by three points and naming it by its own label.
    if (r() < 0.3) {
      const item = equivalenceItem(r);
      if (item && !out.some((o) => o.id === item.id)) {
        out.push(item);
        continue;
      }
    }
    const figName = pick(r, FIGURE_NAMES);
    const board = LIBRARY[figName]();
    const inv = figureObjects(board);
    // Only three-point angle names can be found by clicking points, and a
    // straight angle is a poor naming target: nothing is drawn to look at, and
    // picking its three collinear points is not a choice. Straight angles are
    // still nameable everywhere else — the concept deck teaches them directly.
    const angles = inv.angles.filter((a) => {
      if (splitLabels(a.name).length !== 3) return false;
      const deg = measureOf(board, a);
      return deg !== undefined && deg > 1 && deg < 179;
    });
    const wantAngle = angles.length > 0 && r() < 0.6;
    const target: SegId | AngId = wantAngle ? pick(r, angles) : pick(r, inv.segments);
    if (!target) continue;
    const mode: NameItem["mode"] = r() < 0.65 ? "click" : "choose";
    const id = figName + ":" + (target.k === "ang" ? target.name : target.a + target.b) + ":" + mode;
    if (out.some((o) => o.id === id)) continue;

    if (mode === "click") {
      out.push({
        id,
        figure: board,
        mode,
        target,
        prompt:
          target.k === "ang"
            ? `Click the three points that name ∠${target.name}, in order.`
            : `Click the two points that name segment ${target.a}${target.b}.`,
        why:
          target.k === "ang"
            ? "The middle letter is always the vertex; the outer letters sit on the two arms."
            : "A segment is named by its two endpoints, in either order.",
      });
    } else {
      const answer =
        target.k === "ang" ? "∠" + target.name : target.a + target.b;
      const choices = distractors(r, target, inv, answer);
      if (choices.length < 3) continue;
      out.push({
        id,
        figure: board,
        mode,
        target,
        prompt:
          target.k === "ang"
            ? "Which name belongs to the highlighted angle?"
            : "Which name belongs to the highlighted segment?",
        choices,
        answer,
        why:
          target.k === "ang"
            ? "The middle letter names the vertex, so reordering the letters can name a different angle entirely."
            : "Either order names the same segment, but the letters must be its endpoints.",
      });
    }
  }
  return out;
}

/** Figures that label their angles, so both naming systems are visible. */
const LABELLED_FIGURES = ["crossing", "numberedCorner"];

/**
 * ∠2 and ∠AXC can be the same angle. These items make a student move between
 * the two notations in both directions.
 */
function equivalenceItem(r: () => number): NameItem | undefined {
  const figName = pick(r, LABELLED_FIGURES);
  const board = LIBRARY[figName]();
  const labelled = board.angles.filter((a) => a.label);
  if (labelled.length < 2) return;
  const chosen = pick(r, labelled);
  const name = threePointName(board, chosen);
  if (!name || !chosen.label) return;
  const deg = measureOf(board, { k: "ang", name } as AngId);
  if (deg === undefined || deg <= 1 || deg >= 179) return;

  const toPoints = r() < 0.55;
  if (toPoints) {
    return {
      id: figName + ":equiv:" + chosen.label + ":points",
      figure: board,
      mode: "click",
      target: { k: "ang", name } as AngId,
      expectPoints: splitLabels(name),
      highlight: true,
      prompt:
        "∠" + chosen.label +
        " is marked on the figure. Click the three points that name the same angle.",
      why:
        "∠" + chosen.label + " and ∠" + name +
        " are two names for one angle. A label is a shorthand; the three-point name says where the angle is, with the vertex in the middle.",
    };
  }

  // The other direction: given the three-point name, say which label it is.
  const options = labelled
    .map((a) => "∠" + a.label)
    .filter((x, i, xs) => xs.indexOf(x) === i);
  if (options.length < 2) return;
  return {
    id: figName + ":equiv:" + chosen.label + ":label",
    figure: board,
    mode: "choose",
    target: { k: "ang", name } as AngId,
    highlight: false,
    prompt: "Which marked angle is ∠" + name + "?",
    choices: shuffleNames(r, options),
    answer: "∠" + chosen.label,
    why:
      "∠" + name + " has vertex " + splitLabels(name)[1] +
      " with arms through " + splitLabels(name)[0] + " and " +
      splitLabels(name)[2] + ", which is the region marked ∠" + chosen.label +
      ". The two names refer to the same angle and may be used interchangeably.",
  };
}

function shuffleNames(r: () => number, xs: string[]) {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractors(
  r: () => number,
  target: SegId | AngId,
  inv: ReturnType<typeof figureObjects>,
  answer: string,
): string[] {
  // Deduplicate by canonical key, not by spelling. ∠VAC and ∠CAV are one
  // angle written two ways; offering both lets a student rule out each
  // without doing any geometry, because neither could be a unique answer.
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (o: ObjId, text: string) => {
    const k = objKey(o);
    if (seen.has(k) || out.length >= 4) return;
    seen.add(k);
    out.push(text);
  };
  add(target, answer);

  if (target.k === "ang") {
    const [a, v, c] = splitLabels(target.name);
    // One vertex misplacement: the misconception actually worth testing.
    const moved = v + a + c;
    add({ k: "ang", name: moved }, "∠" + moved);
    // The rest are other angles the figure really contains.
    for (const other of inv.angles)
      if (splitLabels(other.name).length === 3) add(other, "∠" + other.name);
  } else {
    for (const other of inv.segments) add(other, other.a + other.b);
  }

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Exercise 4: generated solve-for-x proofs
// ---------------------------------------------------------------------------

const m = meas;

type PairKind = "supp" | "comp";

/**
 * A figure drawn to the values the problem actually uses, so a student can
 * read the shape off the page and sanity-check the answer at the end.
 */
function anglePairFigure(kind: PairKind, v1: number): Board {
  const f = fig(kind === "supp" ? "A linear pair" : "Two parts of a right angle");
  f.at("V", 0, 0);
  if (kind === "supp") {
    f.at("A", -185, 0).at("B", 185, 0);
    f.seg("V", "A").seg("V", "B");
    const c = polar(0, 0, 180 - v1, 165);
    f.at("C", c.x, c.y);
    f.seg("V", "C");
  } else {
    const a = polar(0, 0, 90, 175),
      b = polar(0, 0, 0, 175),
      c = polar(0, 0, 90 - v1, 175);
    f.at("A", a.x, a.y).at("B", b.x, b.y).at("C", c.x, c.y);
    f.seg("V", "A").seg("V", "B").seg("V", "C");
    f.right("AVB");
  }
  f.num("1", "AVC").num("2", "CVB");
  return f.build();
}

/** A, B, C collinear with B placed in the ratio the problem states. */
function segmentSumFigure(part1: number, part2: number): Board {
  const t = part1 / (part1 + part2);
  return fig("Parts and the whole")
    .at("A", -180, 0)
    .at("C", 180, 0)
    .seg("A", "C")
    .on("B", "A", "C", t)
    .build();
}

/** ∠1 and ∠2 are supplementary (or complementary); solve for x. */
export function anglePairProblem(seed: number, kind: PairKind = "supp"): ProofProblem {
  const r = rng(seed);
  const total = kind === "supp" ? 180 : 90;
  const x0 = int(r, 2, 12);
  const a = int(r, 2, 9);
  // Keep both measures sensible.
  let v1 = 0, b = 0;
  for (let t = 0; t < 60; t++) {
    b = int(r, -20, 20);
    v1 = a * x0 + b;
    if (v1 > 10 && v1 < total - 10) break;
  }
  const c = int(r, 2, 9);
  const v2 = total - v1;
  const d = v2 - c * x0;

  const e1 = add(mul(num(a), vr("x")), num(b));
  const e2 = add(mul(num(c), vr("x")), num(d));
  const sumCoef = a + c;
  const sumConst = b + d;

  const A = ang("1"), B = ang("2");
  const givens: Statement[] = [
    { k: kind, a: A, b: B },
    { k: "eq", l: m("1"), r: e1 },
    { k: "eq", l: m("2"), r: e2 },
  ];

  const solution: SolutionStep[] = [
    { statement: givens[0], reasonId: "given", cites: [] },
    { statement: givens[1], reasonId: "given", cites: [] },
    { statement: givens[2], reasonId: "given", cites: [] },
    {
      statement: { k: "eq", l: add(m("1"), m("2")), r: num(total) },
      reasonId: kind === "supp" ? "def-supplementary" : "def-complementary",
      cites: [1],
    },
    {
      statement: { k: "eq", l: add(e1, e2), r: num(total) },
      reasonId: "substitution",
      cites: [2, 3, 4],
    },
    {
      statement: {
        k: "eq",
        l: add(mul(num(sumCoef), vr("x")), num(sumConst)),
        r: num(total),
      },
      reasonId: "simplify",
      cites: [5],
    },
  ];
  let line = 6;
  if (sumConst !== 0) {
    solution.push({
      statement: { k: "eq", l: mul(num(sumCoef), vr("x")), r: num(total - sumConst) },
      reasonId: sumConst > 0 ? "subtraction-property" : "addition-property",
      cites: [line],
    });
    line++;
  }
  solution.push({
    statement: { k: "eq", l: vr("x"), r: num(x0) },
    reasonId: "division-property",
    cites: [line],
  });

  const word = kind === "supp" ? "supplementary" : "complementary";
  return {
    id: `gen-${kind}-${seed}`,
    title: `Solve using ${word} angles`,
    prompt:
      kind === "supp"
        ? `∠1 and ∠2 form a linear pair, so they are supplementary. m∠1 = ${show(a, b)} and m∠2 = ${show(c, d)}. Prove that x = ${x0}.`
        : `∠1 and ∠2 make up the right angle ∠AVB, so they are complementary. m∠1 = ${show(a, b)} and m∠2 = ${show(c, d)}. Prove that x = ${x0}.`,
    figure: anglePairFigure(kind, v1),
    givens,
    goal: { k: "eq", l: vr("x"), r: num(x0) },
    objects: [A, B] as ObjId[],
    hints: [
      `${word[0].toUpperCase() + word.slice(1)} means the two measures total ${total}.`,
      "Substitute both expressions into that sum.",
      "Combine like terms, then undo the constant and the coefficient in turn.",
    ],
    tags: ["generated", "§10"],
    solution,
  };
}

/** B is between A and C; solve for x from the parts and the whole. */
export function segmentSumProblem(seed: number): ProofProblem {
  const r = rng(seed);
  const x0 = int(r, 2, 12);
  const a = int(r, 1, 6);
  const b = int(r, -8, 10);
  const c = int(r, 1, 6);
  const d = int(r, -8, 10);
  const part1 = a * x0 + b,
    part2 = c * x0 + d;
  if (part1 <= 0 || part2 <= 0) return segmentSumProblem(seed + 1);
  const whole = part1 + part2;

  const e1 = add(mul(num(a), vr("x")), num(b));
  const e2 = add(mul(num(c), vr("x")), num(d));
  const sumCoef = a + c,
    sumConst = b + d;

  const givens: Statement[] = [
    { k: "between", p: "B", a: "A", c: "C" },
    { k: "eq", l: len("A", "B"), r: e1 },
    { k: "eq", l: len("B", "C"), r: e2 },
    { k: "eq", l: len("A", "C"), r: num(whole) },
  ];

  const solution: SolutionStep[] = [
    { statement: givens[0], reasonId: "given", cites: [] },
    { statement: givens[1], reasonId: "given", cites: [] },
    { statement: givens[2], reasonId: "given", cites: [] },
    { statement: givens[3], reasonId: "given", cites: [] },
    {
      statement: {
        k: "eq",
        l: add(len("A", "B"), len("B", "C")),
        r: len("A", "C"),
      },
      reasonId: "segment-addition",
      cites: [1],
    },
    {
      statement: { k: "eq", l: add(e1, e2), r: num(whole) },
      reasonId: "substitution",
      cites: [2, 3, 4, 5],
    },
    {
      statement: {
        k: "eq",
        l: add(mul(num(sumCoef), vr("x")), num(sumConst)),
        r: num(whole),
      },
      reasonId: "simplify",
      cites: [6],
    },
  ];
  let line = 7;
  if (sumConst !== 0) {
    solution.push({
      statement: { k: "eq", l: mul(num(sumCoef), vr("x")), r: num(whole - sumConst) },
      reasonId: sumConst > 0 ? "subtraction-property" : "addition-property",
      cites: [line],
    });
    line++;
  }
  solution.push({
    statement: { k: "eq", l: vr("x"), r: num(x0) },
    reasonId: "division-property",
    cites: [line],
  });

  return {
    id: "gen-seg-" + seed,
    title: "Solve using the Segment Addition Postulate",
    prompt: `B is between A and C, with AB = ${show(a, b)}, BC = ${show(c, d)} and AC = ${whole}. Prove that x = ${x0}.`,
    figure: segmentSumFigure(part1, part2),
    givens,
    goal: { k: "eq", l: vr("x"), r: num(x0) },
    objects: [seg("A", "B"), seg("B", "C"), seg("A", "C")],
    hints: [
      "The parts make the whole.",
      "Substitute the expressions for the two parts and the whole.",
      "Combine like terms, then solve.",
    ],
    tags: ["generated", "§6"],
    solution,
  };
}

function show(coef: number, constant: number) {
  const left = coef === 1 ? "x" : coef === -1 ? "−x" : coef + "x";
  if (constant === 0) return left;
  return left + (constant > 0 ? " + " + constant : " − " + Math.abs(constant));
}

/** A mixed batch of generated proofs. */
export function generatedProofs(seed: number, count = 6): ProofProblem[] {
  const r = rng(seed);
  const out: ProofProblem[] = [];
  for (let i = 0; i < count; i++) {
    const s = int(r, 1, 1 << 28);
    const which = r();
    out.push(
      which < 0.4
        ? anglePairProblem(s, "supp")
        : which < 0.7
          ? anglePairProblem(s, "comp")
          : segmentSumProblem(s),
    );
  }
  return out;
}
