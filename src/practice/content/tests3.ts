// Module 3, Lessons 3.2 and the start of 3.3: angle facts that prove lines
// parallel, and the lines there is exactly one of.
//
// Three generated kinds of question — which test applies, whether what is
// marked is enough, and what value of x makes the lines parallel — over
// figures drawn to match their numbers, plus authored questions for the
// Parallel and Perpendicular Postulates and the construction.
import type { Board } from "../../model";
import type { Highlight } from "../Figure";
import { PAIR_NAME } from "../notation";
import { ang, type PairKind } from "../terms";
import { placement, resolveLine } from "../transversal";
import type { Trap } from "./numeric";
import {
  constructParallel,
  drawnAt,
  parallelPostulate,
  perpTransversal,
  perpendicularPostulate,
  threeLines,
  transversal,
  twoPerpendiculars,
} from "./library3";
import { provedParallel, relationOf } from "./pairs3";
import { rng } from "./generators";

/** A question with options, or one answered with a number. */
export type MixedItem =
  | {
      id: string;
      kind: "choice";
      heading: string;
      prompt: string;
      context?: string[];
      figure?: Board;
      highlights?: Highlight[];
      choices: string[];
      correct: number;
      why: string;
      whyPerChoice?: Record<number, string>;
    }
  | {
      id: string;
      kind: "number";
      heading: string;
      prompt: string;
      context?: string[];
      figure?: Board;
      given?: string[];
      highlights?: Highlight[];
      answer: number;
      unit?: string;
      trap?: Trap | Trap[];
      hints?: string[];
      why: string;
    };

export const CONVERSE: Record<PairKind, string> = {
  corresponding: "Converse of the Corresponding Angles Postulate",
  altInterior: "Converse of the Alternate Interior Angles Theorem",
  altExterior: "Converse of the Alternate Exterior Angles Theorem",
  consInterior: "Converse of the Consecutive Interior Angles Theorem",
  consExterior: "Converse of the Consecutive Exterior Angles Theorem",
};

export const FORWARD: Record<PairKind, string> = {
  corresponding: "Corresponding Angles Postulate",
  altInterior: "Alternate Interior Angles Theorem",
  altExterior: "Alternate Exterior Angles Theorem",
  consInterior: "Consecutive Interior Angles Theorem",
  consExterior: "Consecutive Exterior Angles Theorem",
};

const KINDS: PairKind[] = ["corresponding", "altInterior", "altExterior", "consInterior", "consExterior"];
const congruentKind = (k: PairKind) => k === "corresponding" || k === "altInterior" || k === "altExterior";

const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];
const shuffle = <T,>(r: () => number, xs: T[]) => {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const hl = (...ns: string[]): Highlight[] => ns.map((n) => ({ obj: ang(n), role: "given" }));

/** The reference's figure, lines drawn parallel but not marked. */
const plain = () => transversal({ cross: 64, title: "m and n cut by t" });

/** Every pair of the named kinds on the reference's numbering. */
function pairsOf(kind: PairKind): [string, string][] {
  const b = plain();
  const out: [string, string][] = [];
  for (let x = 1; x <= 8; x++)
    for (let y = x + 1; y <= 8; y++)
      if (placement(b, ang(String(x)), ang(String(y)))?.kind === kind) out.push([String(x), String(y)]);
  return out;
}

/**
 * "∠3 ≅ ∠5. Which rule proves m ∥ n?" — and sometimes the fact is the wrong
 * kind. `kinds` limits the pairs asked about, and `among` the tests offered
 * as wrong answers, so a lesson asks only about what it has taught.
 */
export function whichTest(r: () => number, id: string, kinds: PairKind[] = KINDS, among: PairKind[] = KINDS): MixedItem {
  const kind = pick(r, kinds);
  const [x, y] = pick(r, pairsOf(kind));
  // One time in four, state the fact the test does not accept.
  const wrongFact = r() < 0.25;
  const saysCongruent = congruentKind(kind) !== wrongFact;
  const fact = saysCongruent ? "∠" + x + " ≅ ∠" + y : "∠" + x + " and ∠" + y + " are supplementary";
  const NONE = "None of these: that fact does not prove m ∥ n";
  const others = shuffle(r, among.filter((k) => k !== kind)).slice(0, 2).map((k) => CONVERSE[k]);
  // With fewer tests to offer, "none of these" stays in as a live option.
  const withNone = wrongFact || others.length < 2;
  const choices = shuffle(r, [CONVERSE[kind], FORWARD[kind], ...others.slice(0, wrongFact ? 1 : 2), ...(withNone ? [NONE] : [])]);
  const correct = choices.indexOf(wrongFact ? NONE : CONVERSE[kind]);
  const name = PAIR_NAME[kind];
  const whyPerChoice: Record<number, string> = {
    [choices.indexOf(FORWARD[kind])]:
      "That theorem starts from m ∥ n and concludes something about the angles. Here m ∥ n is what you want to prove, so you need its converse.",
  };
  return {
    id,
    kind: "choice",
    heading: "Which test?",
    prompt: fact + ". Which postulate or theorem proves m ∥ n?",
    figure: plain(),
    highlights: hl(x, y),
    choices,
    correct,
    whyPerChoice,
    why: wrongFact
      ? "∠" + x + " and ∠" + y + " are " + name + ". The test for them needs the angles " +
        (congruentKind(kind) ? "congruent" : "supplementary") + ", and the fact given says " +
        (saysCongruent ? "congruent" : "supplementary") + " — so it proves nothing about the lines."
      : "∠" + x + " and ∠" + y + " are " + name + ", and they are " +
        (congruentKind(kind) ? "congruent" : "supplementary") + " — exactly what the " + CONVERSE[kind] + " needs.",
  };
}

/**
 * "Is there enough information?" Two printed measures, drawn truthfully:
 * the lines come out parallel exactly when the measures say they must be.
 */
export function enough(r: () => number, id: string, kinds: PairKind[] = KINDS, among?: PairKind[]): MixedItem {
  const roll = r();
  let x: string, y: string, mx: number, my: number, board: Board;
  if (roll < 0.2) {
    // Two angles at one crossing: always consistent, never informative.
    [x, y] = pick(r, [["1", "3"], ["2", "4"], ["1", "2"], ["3", "4"]]) as [string, string];
    const d = pick(r, [64, 70, 77, 93, 108]);
    mx = [2, 4].includes(Number(x)) ? d : 180 - d;
    my = [2, 4].includes(Number(y)) ? d : 180 - d;
    // n is tilted 9° off m: the measures at one crossing are consistent with
    // lines that are not parallel, and the drawing shows that.
    board = transversal({ tilt: [0, 9], cross: d, measures: { [x]: mx, [y]: my }, title: "One crossing measured" });
  } else {
    const kind = pick(r, kinds);
    [x, y] = pick(r, pairsOf(kind));
    const works = r() < 0.55;
    mx = pick(r, [47, 58, 63, 72, 77, 108, 117, 122, 130]);
    const target = congruentKind(kind) ? mx : 180 - mx;
    my = works ? target : target + pick(r, [-9, -6, -3, 3, 6, 9]);
    board = drawnAt({ [x]: mx, [y]: my });
  }
  const e = board.edges.filter((ed) => ed.label === "m" || ed.label === "n").map((ed) => ed.id);
  const yes = provedParallel(board, e[0], e[1]);
  const rel = relationOf(board, x, y);
  const kind = rel && rel !== "none" && rel !== "vertical" && rel !== "linearPair" ? (rel as PairKind) : undefined;
  const NO = "No — these two angles do not prove it";
  const right = yes && kind ? "Yes — by the " + CONVERSE[kind] : NO;
  let choices: string[];
  if (among) {
    // A lesson that has taught few tests offers those, and the forward rule —
    // the one that assumes what is to be proved — as the trap.
    const tests = among.filter((k) => k !== kind).map((k) => "Yes — by the " + CONVERSE[k]);
    const forward = "Yes — by the " + FORWARD[kind ?? pick(r, among)];
    choices = shuffle(r, [...new Set([right, NO, forward, ...shuffle(r, tests).slice(0, 1)])]);
  } else {
    const tests = shuffle(r, KINDS.filter((k) => k !== kind)).slice(0, kind && yes ? 2 : 3).map((k) => "Yes — by the " + CONVERSE[k]);
    choices = shuffle(r, [...new Set([right, ...tests, NO])]).slice(0, 4);
    if (!choices.includes(right)) choices[3] = right;
  }
  const both = "∠" + x + " and ∠" + y;
  const why =
    rel === "vertical" || rel === "linearPair"
      ? both + " are at the same crossing. Angles there fit together whatever the other line does, so they say nothing about whether m ∥ n."
      : !kind
        ? both + " are not one of the named pairs."
        : yes
          ? both + " are " + PAIR_NAME[kind] + ", and " + mx + "° and " + my + "° are " +
            (congruentKind(kind) ? "equal" : "supplementary") + ", so the " + CONVERSE[kind] + " applies."
          : both + " are " + PAIR_NAME[kind] + ", and the test needs them " +
            (congruentKind(kind) ? "equal" : "to total 180°") + ". " + mx + "° and " + my + "° are not" +
            (congruentKind(kind) ? " equal" : ": they total " + (mx + my) + "°") + " — so m and n are not parallel.";
  return {
    id,
    kind: "choice",
    heading: "Enough to prove m ∥ n?",
    prompt: "Is there enough information to prove m ∥ n?",
    figure: board,
    highlights: hl(x, y),
    choices,
    correct: choices.indexOf(right),
    why,
  };
}

const show = (a: number, b: number) =>
  (a === 1 ? "" : String(a)) + "x" + (b === 0 ? "" : b > 0 ? " + " + b : " − " + -b);

/** "What value of x makes m ∥ n?" — the figure drawn at that value. */
export function findX(r: () => number, id: string, kinds: PairKind[] = KINDS): MixedItem {
  const kind = pick(r, kinds);
  const [x, y] = pick(r, pairsOf(kind));
  let a = 0, c = 0, b = 0, d = 0, x0 = 0, mx = 0;
  for (let t = 0; t < 200; t++) {
    a = 2 + Math.floor(r() * 7);
    c = 2 + Math.floor(r() * 7);
    if (a === c) continue;
    x0 = 5 + Math.floor(r() * 20);
    mx = 40 + Math.floor(r() * 100);
    const my = congruentKind(kind) ? mx : 180 - mx;
    b = mx - a * x0;
    d = my - c * x0;
    if (Math.abs(b) <= 60 && Math.abs(d) <= 60 && my > 20 && my < 160) break;
  }
  const my = congruentKind(kind) ? mx : 180 - mx;
  const board = drawnAt({ [x]: mx, [y]: my });
  // Strip the printed measures: the expressions are the given.
  board.constraints = board.constraints.filter((k) => k.kind !== "angle");
  const traps: Trap[] = [];
  if (congruentKind(kind)) {
    const wrong = (180 - b - d) / (a + c);
    if (Number.isInteger(wrong) && wrong > 0)
      traps.push({ value: wrong, note: "That sets the two to total 180°. " + PAIR_NAME[kind] + " prove lines parallel when they are congruent, so set them equal." });
  } else {
    const wrong = (d - b) / (a - c);
    if (Number.isInteger(wrong) && wrong > 0 && wrong !== x0)
      traps.push({ value: wrong, note: "That sets the two equal. " + PAIR_NAME[kind] + " prove lines parallel when they are supplementary, so set their sum to 180." });
  }
  traps.push({ value: mx, note: mx + "° is the measure of ∠" + x + " at that value. The question asks for x." });
  return {
    id,
    kind: "number",
    heading: "Make the lines parallel",
    prompt: "What value of x makes m ∥ n?",
    figure: board,
    highlights: hl(x, y),
    given: ["m∠" + x + " = (" + show(a, b) + ")°", "m∠" + y + " = (" + show(c, d) + ")°"],
    answer: x0,
    trap: traps,
    hints: [
      "Which pair are ∠" + x + " and ∠" + y + "? Does its test need them equal, or totalling 180°?",
    ],
    why:
      "∠" + x + " and ∠" + y + " are " + PAIR_NAME[kind] + ", so the lines are parallel when the angles are " +
      (congruentKind(kind) ? "equal: " + show(a, b) + " = " + show(c, d) : "supplementary: (" + show(a, b) + ") + (" + show(c, d) + ") = 180") +
      ", which gives x = " + x0 + ".",
  };
}

// ---------------------------------------------------------------------------
// Authored: uniqueness, the construction, and the consequences
// ---------------------------------------------------------------------------

const AUTHORED: MixedItem[] = [
  {
    id: "m3t-how-many-parallel",
    kind: "choice",
    heading: "Exactly one line",
    prompt: "P is not on line l. How many lines through P are parallel to l?",
    figure: parallelPostulate(),
    choices: ["Exactly one", "None", "Two", "Infinitely many"],
    correct: 0,
    why: "The Parallel Postulate: through a point not on a line there is exactly one parallel. Every other line through P meets l somewhere.",
  },
  {
    id: "m3t-how-many-perp",
    kind: "choice",
    heading: "Exactly one line",
    prompt: "P is not on line l. How many lines through P are perpendicular to l?",
    figure: perpendicularPostulate(),
    choices: ["Exactly one", "None", "Two", "Infinitely many"],
    correct: 0,
    why: "The Perpendicular Postulate: exactly one line through P meets l at a right angle.",
  },
  {
    id: "m3t-construct-why",
    kind: "choice",
    heading: "The construction",
    prompt: "∠ZPW was drawn as a copy of ∠YXP. Why is PZ ∥ XY?",
    figure: constructParallel(4)(),
    choices: [
      "Converse of the Corresponding Angles Postulate",
      "Corresponding Angles Postulate",
      "Parallel Postulate",
      "Alternate Interior Angles Theorem",
    ],
    correct: 0,
    why: "The copy and the original are corresponding angles, congruent by construction. Congruent corresponding angles make the lines parallel: that is the converse of the postulate.",
    whyPerChoice: {
      1: "The postulate starts from parallel lines. Here the parallel lines are what the construction has to prove.",
      2: "The Parallel Postulate says there is only one parallel through P. It does not say that PZ is it — the angles do that.",
    },
  },
  {
    id: "m3t-construct-postulate",
    kind: "choice",
    heading: "The construction",
    prompt: "What does the Parallel Postulate add to the construction?",
    figure: constructParallel(4)(),
    choices: [
      "It says PZ is the only line through P parallel to XY",
      "It proves that PZ is parallel to XY",
      "It says the corresponding angles are congruent",
      "It lets you copy the angle with a compass",
    ],
    correct: 0,
    why: "The converse of the postulate proves PZ ∥ XY; the Parallel Postulate says no other line through P is. Together: the construction draws the parallel, not merely a parallel.",
  },
  {
    id: "m3t-construct-off",
    kind: "choice",
    heading: "The construction",
    prompt: "Why must P not lie on line XY?",
    figure: constructParallel(1)(),
    choices: [
      "Then there would be no angle at X to copy, and no second line to draw",
      "The compass cannot reach a point on the line",
      "The Parallel Postulate only works for points above a line",
      "It makes the copied angle obtuse",
    ],
    correct: 0,
    why: "With P on XY, the ray XP lies along XY: there is no angle to copy, and the only line through P that never meets XY would be XY itself.",
  },
  {
    id: "m3t-perp-transversal",
    kind: "choice",
    heading: "One line perpendicular to both",
    prompt: "m ∥ n and t ⊥ m. Is t ⊥ n?",
    figure: perpTransversal(),
    choices: [
      "Yes — by the Perpendicular Transversal Theorem",
      "Only if t crosses n at its midpoint",
      "No — t ⊥ m says nothing about n",
      "Yes — by the Converse of the Corresponding Angles Postulate",
    ],
    correct: 0,
    why: "The right angle at m corresponds to the angle at n, and m ∥ n, so that angle is 90° too.",
    whyPerChoice: {
      3: "That converse concludes lines are parallel. Here the parallel lines are given, and it is the right angle that is carried across.",
    },
  },
  {
    id: "m3t-two-perps",
    kind: "choice",
    heading: "Two perpendiculars",
    prompt: "m ⊥ p and n ⊥ p. What must be true of m and n?",
    figure: twoPerpendiculars(),
    choices: ["m ∥ n", "m ⊥ n", "m and n meet on p", "Nothing can be said"],
    correct: 0,
    why: "The two right angles are corresponding angles, and congruent, so by the converse of the postulate m ∥ n.",
  },
  {
    id: "m3t-transitive",
    kind: "choice",
    heading: "Parallel to the same line",
    prompt: "a ∥ b and b ∥ c. What about a and c?",
    figure: threeLines(),
    choices: ["a ∥ c", "a ⊥ c", "a and c meet", "Nothing can be said"],
    correct: 0,
    why: "The Transitive Property of Parallel Lines: two lines parallel to the same line are parallel to each other.",
  },
];

/** A mixed set: generated tests, sufficiency and find-x, with authored items. */
export function testItems(seed: number, count = 12): MixedItem[] {
  const r = rng(seed);
  const makers = [whichTest, enough, findX, enough, whichTest, findX];
  const generated: MixedItem[] = [];
  for (let i = 0; generated.length < count - 4; i++) generated.push(makers[i % makers.length](r, "m3t-" + seed + "-" + i));
  const authored = shuffle(r, AUTHORED).slice(0, 4).map((it) => reorder(r, it));
  // Interleave, so the uniqueness questions are not all at the end.
  const out: MixedItem[] = [];
  for (let i = 0; out.length < count; i++) {
    if (generated[i]) out.push(generated[i]);
    if (i % 2 === 1 && authored.length) out.push(authored.shift()!);
  }
  return out.slice(0, count);
}

/** Authored options are written answer-first; deal them in a random order. */
export function reorder(r: () => number, it: MixedItem): MixedItem {
  if (it.kind !== "choice") return it;
  const order = shuffle(r, it.choices.map((_, i) => i));
  return {
    ...it,
    choices: order.map((i) => it.choices[i]),
    correct: order.indexOf(it.correct),
    whyPerChoice: it.whyPerChoice
      ? Object.fromEntries(Object.entries(it.whyPerChoice).map(([k, v]) => [order.indexOf(Number(k)), v]))
      : undefined,
  };
}

export const AUTHORED_TESTS = AUTHORED;
export const edgesMN = (b: Board) =>
  ["m", "n"].map((n) => resolveLine(b, { k: "line", a: "", b: "", name: n })!);
