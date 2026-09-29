// Module 3 items for the shared exercise screens: Figure → equation, "What is
// true?", Solve, two-part questions, proofs and flow proofs.
//
// Every figure that carries a measure is drawn at that measure. The lines
// are level, so the transversal's direction φ fixes all eight angles:
// ∠2, ∠4, ∠6 and ∠8 measure φ, and ∠1, ∠3, ∠5 and ∠7 measure 180° − φ.
import type { Board } from "../../model";
import type { ProofProblem } from "../proof";
import {
  type PairKind,
  type Statement,
  add,
  ang,
  line,
  meas,
  mul,
  num,
  vr,
} from "../terms";
import { PAIR_NAME } from "../notation";
import type { ClaimItem } from "./claims";
import type { MultiPartItem } from "./multipart";
import type { NumericItem } from "./numeric";
import type { ReadItem } from "./translate";
import {
  flowProof,
  givenAltExterior,
  givenAltInterior,
  givenConsInterior,
  parallelMN,
  parallelUnmarked,
  perpBisectorConverse,
  perpBisectorTheorem,
  perpTransversal,
  threeLines,
  transversal,
  transversalJK,
  twoPerpendiculars,
} from "./library3";
import { consequence, explainConsequence, relationOf } from "./pairs3";
import { rng } from "./generators";

const m = (n: number) => meas(String(n));
const a = (n: number) => ang(String(n));
const cong = (x: number, y: number): Statement => ({ k: "cong", l: a(x), r: a(y) });
const eqm = (x: number, y: number): Statement => ({ k: "eq", l: m(x), r: m(y) });
const sum180 = (x: number, y: number): Statement => ({ k: "eq", l: add(m(x), m(y)), r: num(180) });
const supp = (x: number, y: number): Statement => ({ k: "supp", a: a(x), b: a(y) });
const pair = (k: PairKind, x: number, y: number): Statement => ({ k, a: a(x), b: a(y) });
const vert = (x: number, y: number): Statement => ({ k: "vertical", a: a(x), b: a(y) });
const lp = (x: number, y: number): Statement => ({ k: "linearPair", a: a(x), b: a(y) });

const M = line("A1", "B1", "m");
const N = line("A2", "B2", "n");
const mn: Statement = { k: "parallel", a: M, b: N };
const ab: Statement = {
  k: "parallel",
  a: line("A1", "B1", "a"),
  b: line("A2", "B2", "b"),
};

/** Marked parallels drawn so that ∠2 = φ, with optional printed measures. */
const parallelAt = (phi: number, measures?: Record<string, number>, marked = true) =>
  transversal({ marked, cross: phi, measures, title: "m ∥ n, φ = " + phi });

const PAIR_FORMS = ["corresponding", "altInterior", "consInterior", "altExterior", "consExterior", "vertical", "linearPair"] as const;

// ---------------------------------------------------------------------------
// Figure → equation
// ---------------------------------------------------------------------------

export const READ_ITEMS3: ReadItem[] = [
  {
    id: "m3-read-cap",
    prompt: "m ∥ n. Write what the Corresponding Angles Postulate gives you about ∠1.",
    figure: parallelMN(),
    accept: [cong(1, 5), eqm(1, 5)],
    why: "∠1 corresponds to ∠5 — each above its line, left of t — and m ∥ n, so ∠1 ≅ ∠5.",
    allowForms: ["cong", "eq"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-read-ait",
    prompt: "m ∥ n. Write the relationship the figure gives you between ∠4 and ∠6.",
    figure: parallelMN(),
    accept: [cong(4, 6), eqm(4, 6)],
    why: "∠4 and ∠6 are alternate interior angles: between the lines, on opposite sides of t. With m ∥ n they are congruent.",
    allowForms: ["cong", "eq", "supp"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-read-cit",
    prompt: "m ∥ n. Write the equation the figure gives you for ∠3 and ∠6.",
    figure: parallelMN(),
    accept: [sum180(3, 6), supp(3, 6)],
    why: "∠3 and ∠6 are consecutive interior angles: between the lines, on the same side of t. With m ∥ n they are supplementary, not congruent.",
    allowForms: ["eq", "supp", "cong"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-read-cet",
    prompt: "m ∥ n. Write the equation the figure gives you for ∠1 and ∠8.",
    figure: parallelMN(),
    accept: [sum180(1, 8), supp(1, 8)],
    why: "∠1 and ∠8 are consecutive exterior angles — outside the lines, same side of t — so with m ∥ n they total 180°.",
    allowForms: ["eq", "supp", "cong"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-read-aet",
    prompt: "m ∥ n. Write the relationship the figure gives you between ∠2 and ∠8.",
    figure: parallelMN(),
    accept: [cong(2, 8), eqm(2, 8)],
    why: "∠2 and ∠8 are alternate exterior angles: outside the lines, opposite sides of t. With m ∥ n they are congruent.",
    allowForms: ["cong", "eq", "supp"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-read-none",
    prompt: "m ∥ n. Write the equation relating ∠1 and ∠6.",
    figure: parallelMN(),
    accept: [sum180(1, 6), supp(1, 6)],
    why: "No single name covers ∠1 and ∠6. Go through ∠5: ∠1 ≅ ∠5 as corresponding angles, and ∠5 with ∠6 is a linear pair — so m∠1 + m∠6 = 180.",
    allowForms: ["eq", "supp", "cong"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-read-name-35",
    prompt: "Say what kind of pair ∠3 and ∠5 are.",
    figure: transversalJK(),
    accept: [pair("altInterior", 3, 5)],
    why: "Both open between j and k, and they sit on opposite sides of t: alternate interior angles. That is true whether or not j and k are parallel.",
    allowForms: [...PAIR_FORMS],
    tags: ["Transversals"],
  },
  {
    id: "m3-read-name-27",
    prompt: "Say what kind of pair ∠2 and ∠7 are.",
    figure: transversalJK(),
    accept: [pair("consExterior", 2, 7)],
    why: "Both are outside j and k, and both are right of t: consecutive exterior angles.",
    allowForms: [...PAIR_FORMS],
    tags: ["Transversals"],
  },
  {
    id: "m3-read-unmarked",
    prompt: "No arrowheads here. Write the one relationship the figure still guarantees between ∠5 and ∠7.",
    figure: parallelUnmarked(),
    accept: [cong(5, 7), eqm(5, 7), vert(5, 7)],
    why: "∠5 and ∠7 are vertical angles, which are congruent whatever the lines do. Getting from ∠5 to anything at the top crossing — ∠1, say — would need m ∥ n, and nothing says so.",
    allowForms: ["cong", "eq", "supp", "vertical"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-read-conv-arcs",
    prompt: "No arrowheads — but the arcs mark ∠3 ≅ ∠5. Write what follows about m and n.",
    figure: givenAltInterior(),
    accept: [mn],
    why: "∠3 and ∠5 are alternate interior angles, and congruent, so the Converse of the Alternate Interior Angles Theorem makes m ∥ n.",
    allowForms: ["parallel", "cong", "eq"],
    tags: ["Reverse it"],
  },
  {
    id: "m3-read-conv-measures",
    prompt: "m∠4 = 64° and m∠5 = 116°. Write what follows about m and n.",
    figure: givenConsInterior(),
    accept: [mn],
    why: "∠4 and ∠5 are consecutive interior angles and 64 + 116 = 180, so by the Converse of the Consecutive Interior Angles Theorem, m ∥ n.",
    allowForms: ["parallel", "cong", "eq"],
    tags: ["Reverse it"],
  },
  {
    id: "m3-read-flow",
    prompt: "a ∥ b. Write what the figure gives you about ∠1 and ∠2.",
    figure: flowProof(),
    accept: [cong(1, 2), eqm(1, 2)],
    why: "∠1 and ∠2 are corresponding angles — each above c, right of its line — and a ∥ b, so they are congruent. It is the first step of the reference's flow proof.",
    allowForms: ["cong", "eq", "supp"],
    tags: ["Proof"],
  },
];

// ---------------------------------------------------------------------------
// What is true?
// ---------------------------------------------------------------------------

export const CLAIM_ITEMS3: ClaimItem[] = [
  {
    id: "m3-claims-converse",
    prompt: "There are no arrowheads, but the arcs mark ∠3 ≅ ∠5. Which statements must be true? Select all of them.",
    figure: givenAltInterior(),
    claims: [
      { statement: mn, holds: true },
      { statement: cong(3, 7), holds: true },
      { statement: sum180(4, 5), holds: true },
      { statement: cong(3, 6), holds: false },
      { statement: { k: "perp", a: M, b: line("T2", "T1", "t") }, holds: false },
    ],
    why: "∠3 ≅ ∠5 is an alternate interior pair, so its converse makes m ∥ n — and once the lines are parallel, all of Lesson 3.1 applies: ∠3 ≅ ∠7 as corresponding angles, ∠4 and ∠5 supplementary. ∠3 and ∠6 are consecutive, so they total 180° rather than matching, and nothing marks a right angle.",
    tags: ["Reverse it"],
  },
  {
    id: "m3-claims-marked",
    prompt: "m ∥ n is marked. Which statements must be true? Select all of them.",
    figure: parallelMN(),
    claims: [
      { statement: cong(1, 5), holds: true },
      { statement: cong(3, 6), holds: false },
      { statement: sum180(4, 5), holds: true },
      { statement: cong(2, 8), holds: true },
      { statement: cong(1, 2), holds: false },
    ],
    why: "∠1 and ∠5 correspond and ∠2 and ∠8 are alternate exterior, so both pairs are congruent. ∠4 and ∠5 are consecutive interior: they total 180°. ∠3 and ∠6 are consecutive interior too — supplementary, not congruent — and ∠1 and ∠2 are a linear pair.",
    tags: ["Parallel lines"],
  },
  {
    id: "m3-claims-unmarked",
    prompt: "The same lines, with no arrowheads. Which statements must be true? Select all of them.",
    figure: parallelUnmarked(),
    claims: [
      { statement: cong(1, 5), holds: false },
      { statement: cong(1, 3), holds: true },
      { statement: sum180(1, 2), holds: true },
      { statement: pair("altInterior", 3, 5), holds: true },
      { statement: mn, holds: false },
    ],
    why: "Without the mark, only what holds for any two lines survives. Vertical angles are congruent, a linear pair totals 180°, and ∠3 and ∠5 are still alternate interior angles — that is only a name for where they sit. ∠1 ≅ ∠5 needs m ∥ n, and nothing on the figure says so.",
    tags: ["Parallel lines"],
  },
  {
    id: "m3-claims-names",
    prompt: "Which statements are true of this figure? Select all of them.",
    figure: transversalJK(),
    claims: [
      { statement: pair("corresponding", 2, 6), holds: true },
      { statement: pair("altInterior", 3, 6), holds: false },
      { statement: pair("altExterior", 1, 7), holds: true },
      { statement: pair("consInterior", 4, 5), holds: true },
      { statement: cong(2, 6), holds: false },
    ],
    why: "The names are about position, so they hold here even though j and k are not parallel. ∠3 and ∠6 are on the same side of t, which makes them consecutive, not alternate. And because j and k are not parallel, the corresponding angles ∠2 and ∠6 are not congruent.",
    tags: ["Transversals"],
  },
  {
    id: "m3-claims-flow",
    prompt: "a ∥ b is marked. Which statements must be true? Select all of them.",
    figure: flowProof(),
    claims: [
      { statement: pair("altInterior", 1, 3), holds: true },
      { statement: cong(1, 2), holds: true },
      { statement: { k: "vertical", a: a(2), b: a(3) }, holds: true },
      { statement: { k: "vertical", a: a(1), b: a(2) }, holds: false },
      { statement: cong(1, 3), holds: true },
    ],
    why: "∠1 and ∠3 are the alternate interior pair the reference's flow proof is about. ∠1 and ∠2 correspond, so they are congruent; ∠2 and ∠3 are vertical. ∠1 and ∠2 are at different crossings, so they cannot be vertical angles.",
    tags: ["Proof"],
  },
];

// ---------------------------------------------------------------------------
// Solve
// ---------------------------------------------------------------------------

export const NUMERIC_ITEMS3: NumericItem[] = [
  {
    id: "m3-num-ae",
    prompt: "m ∥ n and m∠1 = 116°. Find m∠7.",
    figure: parallelAt(64, { "1": 116 }),
    answer: 116,
    unit: "°",
    why: "∠1 and ∠7 are alternate exterior angles — outside the lines, opposite sides of t — and m ∥ n, so they are congruent: m∠7 = 116°.",
    trap: { value: 64, note: "64° is the supplement of 116°. ∠1 and ∠7 are alternate exterior angles, which are congruent, not supplementary." },
    hints: [
      "Where are ∠1 and ∠7: which side of t, and between the lines or outside them?",
      "Opposite sides of t, both outside: alternate exterior angles. What does m ∥ n make of them?",
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-num-ci",
    prompt: "m ∥ n and m∠4 = 58°. Find m∠5.",
    figure: parallelAt(58, { "4": 58 }),
    answer: 122,
    unit: "°",
    why: "∠4 and ∠5 are consecutive interior angles, and m ∥ n, so they are supplementary: m∠5 = 180 − 58 = 122°.",
    trap: { value: 58, note: "58° would make them congruent. ∠4 and ∠5 are consecutive interior angles — same side of t — and those are supplementary." },
    hints: [
      "∠4 and ∠5 are both between the lines. Are they on the same side of t or opposite sides?",
      "Same side, both inside: consecutive interior angles, which total 180°.",
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-num-none",
    prompt: "m ∥ n and m∠6 = 71°. Find m∠1.",
    figure: parallelAt(71, { "6": 71 }),
    answer: 109,
    unit: "°",
    why: "No one rule joins ∠1 and ∠6, so go through ∠5: ∠5 and ∠6 form a linear pair, so m∠5 = 109°, and ∠1 corresponds to ∠5, so m∠1 = 109°.",
    trap: { value: 71, note: "∠1 and ∠6 are not a named pair, and they are not congruent: one is acute and the other obtuse. Go through ∠5." },
    hints: [
      "No single rule links ∠1 and ∠6. Find an angle linked to both.",
      "∠5 corresponds to ∠1, and sits next to ∠6.",
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-num-alg-x",
    prompt: "m ∥ n. Find x.",
    figure: parallelAt(104),
    given: ["m∠3 = (4x + 12)°", "m∠5 = (6x − 20)°"],
    answer: 16,
    why: "∠3 and ∠5 are alternate interior angles and m ∥ n, so they are congruent: 4x + 12 = 6x − 20, so 32 = 2x and x = 16.",
    trap: [
      { value: 76, note: "76° is the measure of ∠3 and ∠5. The question asks for x." },
      { value: 18.8, note: "That adds the two to 180, treating them as supplementary. ∠3 and ∠5 are alternate interior angles: set the expressions equal." },
    ],
    hints: [
      "First decide: are ∠3 and ∠5 congruent, or supplementary?",
      "Alternate interior angles on parallel lines are congruent, so the two expressions are equal.",
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-num-alg-m",
    prompt: "m ∥ n. Find m∠4.",
    figure: parallelAt(80),
    given: ["m∠4 = (2x + 30)°", "m∠6 = (x + 55)°"],
    answer: 80,
    unit: "°",
    why: "∠4 and ∠6 are alternate interior angles, so 2x + 30 = x + 55 and x = 25. Then m∠4 = 2(25) + 30 = 80°.",
    trap: { value: 25, note: "25 is x. The question asks for m∠4: substitute it back, 2(25) + 30 = 80." },
    hints: [
      "Which pair are ∠4 and ∠6, and what does that make the two expressions?",
      "Solve for x, then put it back into the expression for m∠4.",
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-num-alg-supp",
    prompt: "m ∥ n. Find x.",
    figure: parallelAt(70),
    given: ["m∠2 = (3x + 10)°", "m∠7 = (5x + 10)°"],
    answer: 20,
    why: "∠2 and ∠7 are consecutive exterior angles, so they total 180°: 8x + 20 = 180, so x = 20. (Then m∠2 = 70° and m∠7 = 110°.)",
    trap: [
      { value: 0, note: "Setting 3x + 10 = 5x + 10 treats the two as congruent. ∠2 and ∠7 are consecutive exterior angles, which are supplementary." },
      { value: 70, note: "70° is m∠2. The question asks for x." },
    ],
    hints: [
      "∠2 and ∠7 are both outside the lines, on the same side of t. Congruent or supplementary?",
      "Supplementary: add the expressions and set the sum to 180.",
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-num-unmarked",
    prompt: "The lines carry no arrowheads. m∠5 = 64°. Find m∠7.",
    figure: transversal({ cross: 116, measures: { "5": 64 }, title: "Unmarked, with a measure" }),
    answer: 64,
    unit: "°",
    why: "∠5 and ∠7 are vertical angles, so they are congruent with or without parallel lines. What the missing arrowheads rule out is getting from ∠5 to any angle at the top crossing.",
    trap: { value: 116, note: "116° is the supplement. ∠5 and ∠7 sit opposite each other at one crossing: vertical angles, which are congruent." },
    hints: ["∠5 and ∠7 are at the same crossing. Which Module 2 pair are they?"],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-num-two-step",
    prompt: "m ∥ n. Find m∠6.",
    figure: parallelAt(120),
    given: ["m∠2 = 3x°", "m∠3 = (x + 20)°"],
    answer: 120,
    unit: "°",
    why: "∠2 and ∠3 form a linear pair, so 3x + x + 20 = 180 and x = 40, making m∠2 = 120°. ∠6 corresponds to ∠2, so m∠6 = 120°.",
    trap: [
      { value: 40, note: "40 is x. m∠2 = 3(40) = 120°, and ∠6 corresponds to ∠2." },
      { value: 60, note: "60° is m∠3. ∠6 corresponds to ∠2, not ∠3." },
    ],
    hints: [
      "∠2 and ∠3 are at the same crossing, side by side. What do they total?",
      "Find m∠2, then carry it down t to its corresponding angle.",
    ],
    tags: ["Parallel lines"],
  },
];

/**
 * Fresh one-step questions: a printed measure and another angle to find, on
 * a figure drawn to match. Only pairs the marks settle are asked.
 */
export function generatedNumeric3(seed: number, count = 6): NumericItem[] {
  const r = rng(seed);
  const out: NumericItem[] = [];
  const phis = [52, 58, 64, 70, 76, 104, 110, 116, 122, 128];
  for (let tries = 0; out.length < count && tries < 200; tries++) {
    const phi = phis[Math.floor(r() * phis.length)];
    const g = 1 + Math.floor(r() * 8);
    const y = 1 + Math.floor(r() * 8);
    if (g === y) continue;
    const mg = [2, 4, 6, 8].includes(g) ? phi : 180 - phi;
    const board = parallelAt(phi, { [String(g)]: mg });
    const c = consequence(board, String(g), String(y));
    if (c === "unknown") continue;
    // Two angles at one crossing are Module 2 work; keep most questions
    // across the transversal, where the parallel lines do something.
    const across = (g <= 4) !== (y <= 4);
    if (!across && r() < 0.8) continue;
    const answer = c === "congruent" ? mg : 180 - mg;
    const rel = relationOf(board, String(g), String(y));
    const named =
      rel && rel !== "none" && rel !== "vertical" && rel !== "linearPair"
        ? PAIR_NAME[rel]
        : rel === "vertical"
          ? "vertical angles"
          : rel === "linearPair"
            ? "a linear pair"
            : "not a named pair";
    out.push({
      id: "m3-gen-" + seed + "-" + g + "-" + y,
      prompt: "m ∥ n and m∠" + g + " = " + mg + "°. Find m∠" + y + ".",
      figure: board,
      answer,
      unit: "°",
      why: explainConsequence(board, String(g), String(y)) + " So m∠" + y + " = " + answer + "°.",
      trap: {
        value: 180 - answer,
        note:
          c === "congruent"
            ? 180 - answer + "° is the supplement. ∠" + g + " and ∠" + y + " are " + named + ", which are congruent here."
            : 180 - answer + "° would make them congruent. ∠" + g + " and ∠" + y + " are " + named + ", and they total 180°.",
      },
      hints: [
        "Where does ∠" + y + " sit compared with ∠" + g + "? Same side of the transversal? Between the lines or outside?",
      ],
      tags: ["Generated"],
    });
  }
  return out;
}

export const numeric3 = (seed: number) => [...NUMERIC_ITEMS3, ...generatedNumeric3(seed, 6)];

// ---------------------------------------------------------------------------
// Two parts
// ---------------------------------------------------------------------------

export const MULTIPART_ITEMS3: MultiPartItem[] = [
  {
    id: "m3-mp-ai",
    title: "Name it, then use it",
    stem: "m ∥ n. m∠3 = (5x − 8)° and m∠5 = (3x + 20)°.",
    figure: parallelAt(118),
    parts: [
      {
        label: "Part A",
        prompt: "Which statements about ∠3 and ∠5 are true? Select all of them.",
        why: "∠3 and ∠5 are between the lines on opposite sides of t: alternate interior angles, so with m ∥ n they are congruent — not supplementary.",
        body: {
          kind: "claims",
          claims: [
            { statement: pair("altInterior", 3, 5), holds: true },
            { statement: pair("consInterior", 3, 5), holds: false },
            { statement: cong(3, 5), holds: true },
            { statement: sum180(3, 5), holds: false },
          ],
        },
      },
      {
        label: "Part B",
        prompt: "Find m∠5.",
        why: "Part A made them congruent, so 5x − 8 = 3x + 20, 2x = 28 and x = 14. Then m∠5 = 3(14) + 20 = 62°.",
        hints: ["Part A says the two expressions are equal. Solve, then substitute."],
        body: {
          kind: "numeric",
          answer: 62,
          unit: "°",
          trap: { value: 14, note: "14 is x. m∠5 = 3(14) + 20 = 62°." },
        },
      },
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-mp-ci",
    title: "Congruent or supplementary?",
    stem: "m ∥ n. m∠4 = (2x + 14)° and m∠5 = (4x − 14)°.",
    figure: parallelAt(74),
    parts: [
      {
        label: "Part A",
        prompt: "Which statements about ∠4 and ∠5 are true? Select all of them.",
        why: "∠4 and ∠5 are between the lines on the same side of t: consecutive interior angles. With m ∥ n they total 180°; they are not congruent.",
        body: {
          kind: "claims",
          claims: [
            { statement: pair("consInterior", 4, 5), holds: true },
            { statement: cong(4, 5), holds: false },
            { statement: sum180(4, 5), holds: true },
            { statement: pair("altInterior", 4, 5), holds: false },
          ],
        },
      },
      {
        label: "Part B",
        prompt: "Find m∠4.",
        why: "Supplementary, so (2x + 14) + (4x − 14) = 180: 6x = 180 and x = 30. Then m∠4 = 2(30) + 14 = 74°.",
        hints: ["Add the two expressions and set the sum to 180."],
        body: {
          kind: "numeric",
          answer: 74,
          unit: "°",
          trap: [
            { value: 30, note: "30 is x. m∠4 = 2(30) + 14 = 74°." },
            { value: 106, note: "106° is m∠5. The question asks for m∠4." },
            { value: 42, note: "That sets the expressions equal, as if the angles were congruent. Consecutive interior angles are supplementary." },
          ],
        },
      },
    ],
    tags: ["Parallel lines"],
  },
  {
    id: "m3-mp-chain",
    title: "Down the transversal and across",
    stem: "m ∥ n and m∠1 = 124°.",
    figure: parallelAt(56, { "1": 124 }),
    parts: [
      {
        label: "Part A",
        prompt: "Find m∠5.",
        why: "∠1 and ∠5 are corresponding angles and m ∥ n, so m∠5 = 124°.",
        body: {
          kind: "numeric",
          answer: 124,
          unit: "°",
          trap: { value: 56, note: "56° is the supplement. ∠1 and ∠5 correspond, and corresponding angles on parallel lines are congruent." },
        },
      },
      {
        label: "Part B",
        prompt: "Find m∠6.",
        why: "∠5 and ∠6 form a linear pair, so m∠6 = 180 − 124 = 56°. Part A did the work of carrying ∠1 down to the bottom crossing.",
        body: {
          kind: "numeric",
          answer: 56,
          unit: "°",
          trap: { value: 124, note: "124° is m∠5. ∠5 and ∠6 sit side by side on n: a linear pair, which totals 180°." },
        },
      },
    ],
    tags: ["Parallel lines"],
  },
];

export const multipart3 = (_seed: number) => MULTIPART_ITEMS3;

// ---------------------------------------------------------------------------
// Proofs
// ---------------------------------------------------------------------------

const S = (statement: Statement, reasonId: string, cites: number[] = []) => ({ statement, reasonId, cites });

const PROOFS3_RAW: ProofProblem[] = [
  {
    id: "m3-proof-ait",
    title: "Alternate Interior Angles Theorem",
    prompt: "a ∥ b. Prove ∠1 ≅ ∠3 — the reference's flow proof, written in two columns — without citing the theorem itself.",
    figure: flowProof(),
    givens: [ab],
    goal: cong(1, 3),
    forbid: ["alt-interior-angles-theorem"],
    hints: [
      "Start with what is given: a ∥ b.",
      "∠1 and ∠2 are corresponding angles, and the lines are parallel.",
      "∠2 and ∠3 sit opposite each other at one crossing.",
      "Two congruences that share ∠2 chain into one.",
    ],
    tags: ["Proof"],
    solution: [
      S(ab, "given"),
      S(cong(1, 2), "corresponding-angles-postulate", [1]),
      S(vert(2, 3), "def-vertical"),
      S(cong(2, 3), "vertical-angles-theorem", [3]),
      S(cong(1, 3), "transitive", [2, 4]),
    ],
  },
  {
    id: "m3-proof-aet",
    title: "Alternate Exterior Angles Theorem",
    prompt: "m ∥ n. Prove ∠1 ≅ ∠7 without citing the theorem itself.",
    figure: parallelMN(),
    givens: [mn],
    goal: cong(1, 7),
    forbid: ["alt-exterior-angles-theorem"],
    hints: [
      "Carry ∠1 down t to the bottom crossing first.",
      "∠5 corresponds to ∠1. How is ∠5 related to ∠7?",
      "Chain the two congruences through ∠5.",
    ],
    tags: ["Parallel lines"],
    solution: [
      S(mn, "given"),
      S(cong(1, 5), "corresponding-angles-postulate", [1]),
      S(vert(5, 7), "def-vertical"),
      S(cong(5, 7), "vertical-angles-theorem", [3]),
      S(cong(1, 7), "transitive", [2, 4]),
    ],
  },
  {
    id: "m3-proof-cit",
    title: "Consecutive Interior Angles Theorem",
    prompt: "m ∥ n. Prove that ∠4 and ∠5 are supplementary without citing the theorem itself.",
    figure: parallelMN(),
    givens: [mn],
    goal: supp(4, 5),
    forbid: ["cons-interior-angles-theorem"],
    hints: [
      "∠5 corresponds to an angle at the top crossing. Which one?",
      "∠1 and ∠4 sit side by side on m.",
      "Turn the congruence into equal measures, then substitute into the linear pair's 180°.",
    ],
    tags: ["Parallel lines"],
    solution: [
      S(mn, "given"),
      S(cong(1, 5), "corresponding-angles-postulate", [1]),
      S(eqm(1, 5), "def-cong-ang", [2]),
      S(lp(1, 4), "def-linear-pair"),
      S(sum180(1, 4), "linear-pair-theorem", [4]),
      S(sum180(5, 4), "substitution", [3, 5]),
      S(supp(4, 5), "def-supplementary", [6]),
    ],
  },
  {
    id: "m3-proof-cet",
    title: "Consecutive Exterior Angles Theorem",
    prompt: "m ∥ n. Prove that ∠2 and ∠7 are supplementary without citing the theorem itself.",
    figure: parallelMN(),
    givens: [mn],
    goal: supp(2, 7),
    forbid: ["cons-exterior-angles-theorem"],
    hints: [
      "Carry ∠2 down t: which angle corresponds to it?",
      "∠6 and ∠7 sit side by side on n.",
      "Substitute m∠2 for m∠6 in the linear pair's 180°.",
    ],
    tags: ["Parallel lines"],
    solution: [
      S(mn, "given"),
      S(cong(2, 6), "corresponding-angles-postulate", [1]),
      S(eqm(2, 6), "def-cong-ang", [2]),
      S(lp(6, 7), "def-linear-pair"),
      S(sum180(6, 7), "linear-pair-theorem", [4]),
      S(sum180(2, 7), "substitution", [3, 5]),
      S(supp(2, 7), "def-supplementary", [6]),
    ],
  },
  {
    id: "m3-proof-none",
    title: "A pair with no name",
    prompt: "m ∥ n. ∠1 and ∠6 are not any of the five named pairs. Prove they are supplementary anyway.",
    figure: parallelMN(),
    givens: [mn],
    goal: supp(1, 6),
    hints: [
      "No rule links ∠1 and ∠6 directly. Find an angle linked to both.",
      "∠5 corresponds to ∠1 and sits beside ∠6.",
    ],
    tags: ["Parallel lines"],
    solution: [
      S(mn, "given"),
      S(cong(1, 5), "corresponding-angles-postulate", [1]),
      S(eqm(1, 5), "def-cong-ang", [2]),
      S(lp(5, 6), "def-linear-pair"),
      S(sum180(5, 6), "linear-pair-theorem", [4]),
      S(sum180(1, 6), "substitution", [3, 5]),
      S(supp(1, 6), "def-supplementary", [6]),
    ],
  },
  {
    id: "m3-proof-solve",
    title: "Solve for x with parallel lines",
    prompt: "m ∥ n, m∠3 = (4x + 12)° and m∠5 = (6x − 20)°. Prove that x = 16.",
    figure: parallelAt(104),
    givens: [
      mn,
      { k: "eq", l: m(3), r: add(mul(num(4), vr("x")), num(12)) },
      { k: "eq", l: m(5), r: add(mul(num(6), vr("x")), num(-20)) },
    ],
    goal: { k: "eq", l: vr("x"), r: num(16) },
    hints: [
      "Write the three givens first.",
      "∠3 and ∠5 are alternate interior angles — this time the theorem may be cited.",
      "Equal measures let you set the two expressions equal. Then it is algebra.",
    ],
    tags: ["Parallel lines"],
    solution: [
      S(mn, "given"),
      S({ k: "eq", l: m(3), r: add(mul(num(4), vr("x")), num(12)) }, "given"),
      S({ k: "eq", l: m(5), r: add(mul(num(6), vr("x")), num(-20)) }, "given"),
      S(cong(3, 5), "alt-interior-angles-theorem", [1]),
      S(eqm(3, 5), "def-cong-ang", [4]),
      S(
        { k: "eq", l: add(mul(num(4), vr("x")), num(12)), r: add(mul(num(6), vr("x")), num(-20)) },
        "substitution",
        [2, 3, 5],
      ),
      S({ k: "eq", l: add(mul(num(-2), vr("x")), num(12)), r: num(-20) }, "subtraction-property", [6]),
      S({ k: "eq", l: mul(num(-2), vr("x")), r: num(-32) }, "subtraction-property", [7]),
      S({ k: "eq", l: vr("x"), r: num(16) }, "division-property", [8]),
    ],
  },
];

// --- Lesson 3.2 and 3.3: proving lines parallel, and perpendicular --------------

const A = line("A1", "B1", "a"), B = line("A2", "B2", "b"), C = line("A3", "B3", "c");
const P = line("T2", "T1", "p"), T = line("T2", "T1", "t");
const right = (x: number): Statement => ({ k: "angleClass", ang: a(x), cls: "right" });

PROOFS3_RAW.push(
  {
    id: "m3-proof-conv-ait",
    title: "Converse of the Alternate Interior Angles Theorem",
    prompt: "The arcs mark ∠3 ≅ ∠5. Prove m ∥ n without citing the converse itself.",
    figure: givenAltInterior(),
    givens: [cong(3, 5)],
    goal: mn,
    forbid: ["converse-alt-interior"],
    hints: [
      "Only one test is available so far: the converse of the postulate, which needs a corresponding pair.",
      "∠5 has a vertical partner. Is that partner corresponding to ∠3?",
      "Chain the two congruences, then cite the converse of the postulate.",
    ],
    tags: ["Reverse it"],
    solution: [
      S(cong(3, 5), "given"),
      S(vert(5, 7), "def-vertical"),
      S(cong(5, 7), "vertical-angles-theorem", [2]),
      S(cong(3, 7), "transitive", [1, 3]),
      S(mn, "converse-corresponding", [4]),
    ],
  },
  {
    id: "m3-proof-conv-aet",
    title: "Converse of the Alternate Exterior Angles Theorem",
    prompt: "The arcs mark ∠1 ≅ ∠7. Prove m ∥ n without citing the converse itself.",
    figure: givenAltExterior(),
    givens: [cong(1, 7)],
    goal: mn,
    forbid: ["converse-alt-exterior"],
    hints: [
      "Turn the alternate exterior pair into a corresponding pair with one vertical-angle step.",
      "∠7 and ∠5 are vertical, and ∠5 corresponds to ∠1.",
    ],
    tags: ["Reverse it"],
    solution: [
      S(cong(1, 7), "given"),
      S(vert(7, 5), "def-vertical"),
      S(cong(7, 5), "vertical-angles-theorem", [2]),
      S(cong(1, 5), "transitive", [1, 3]),
      S(mn, "converse-corresponding", [4]),
    ],
  },
  {
    id: "m3-proof-conv-cit",
    title: "Converse of the Consecutive Interior Angles Theorem",
    prompt: "∠4 and ∠5 are supplementary. Prove m ∥ n without citing the converse itself.",
    figure: givenConsInterior(),
    givens: [supp(4, 5)],
    goal: mn,
    forbid: ["converse-cons-interior"],
    hints: [
      "∠4 and ∠1 sit side by side on m.",
      "Then ∠1 and ∠5 are both supplementary to ∠4. Which Module 2 theorem makes them congruent?",
      "∠1 and ∠5 correspond — cite the converse of the postulate.",
    ],
    tags: ["Reverse it"],
    solution: [
      S(supp(4, 5), "given"),
      S(lp(1, 4), "def-linear-pair"),
      S(supp(1, 4), "linear-pair-theorem", [2]),
      S(cong(1, 5), "congruent-supplements", [1, 3]),
      S(mn, "converse-corresponding", [4]),
    ],
  },
  {
    id: "m3-proof-transitive",
    title: "Transitive Property of Parallel Lines",
    prompt: "a ∥ b and b ∥ c. Prove a ∥ c without citing the property itself.",
    figure: threeLines(),
    givens: [
      { k: "parallel", a: A, b: B },
      { k: "parallel", a: B, b: C },
    ],
    goal: { k: "parallel", a: A, b: C },
    forbid: ["transitive-parallel"],
    hints: [
      "t crosses all three lines. ∠1, ∠2 and ∠3 are in the same corner at each crossing.",
      "Use the postulate twice, forwards — then its converse once.",
    ],
    tags: ["Reverse it"],
    solution: [
      S({ k: "parallel", a: A, b: B }, "given"),
      S({ k: "parallel", a: B, b: C }, "given"),
      S(cong(1, 2), "corresponding-angles-postulate", [1]),
      S(cong(2, 3), "corresponding-angles-postulate", [2]),
      S(cong(1, 3), "transitive", [3, 4]),
      S({ k: "parallel", a: A, b: C }, "converse-corresponding", [5]),
    ],
  },
  {
    id: "m3-proof-two-perps",
    title: "Two lines perpendicular to a third",
    prompt: "m ⊥ p and n ⊥ p. Prove m ∥ n.",
    figure: twoPerpendiculars(),
    givens: [
      { k: "perp", a: M, b: P },
      { k: "perp", a: N, b: P },
    ],
    goal: mn,
    forbid: ["perp-to-same-line"],
    hints: [
      "Perpendicular lines meet at a right angle: ∠1 and ∠5 are right.",
      "All right angles are congruent — and ∠1 and ∠5 correspond.",
    ],
    tags: ["Reverse it"],
    solution: [
      S({ k: "perp", a: M, b: P }, "given"),
      S({ k: "perp", a: N, b: P }, "given"),
      S(right(1), "def-perpendicular", [1]),
      S(right(5), "def-perpendicular", [2]),
      S(cong(1, 5), "right-angle-congruence", [3, 4]),
      S(mn, "converse-corresponding", [5]),
    ],
  },
  {
    id: "m3-proof-perp-transversal",
    title: "Perpendicular Transversal Theorem",
    prompt: "m ∥ n and t ⊥ m. Prove t ⊥ n without citing the theorem itself.",
    figure: perpTransversal(),
    givens: [mn, { k: "perp", a: T, b: M }],
    goal: { k: "perp", a: T, b: N },
    forbid: ["perp-transversal"],
    hints: [
      "t ⊥ m makes ∠1 a right angle.",
      "∠1 and ∠5 correspond, and m ∥ n.",
      "Show m∠5 = 90, then turn that back into t ⊥ n.",
    ],
    tags: ["Exactly one line"],
    solution: [
      S(mn, "given"),
      S({ k: "perp", a: T, b: M }, "given"),
      S(right(1), "def-perpendicular", [2]),
      S(cong(1, 5), "corresponding-angles-postulate", [1]),
      S(eqm(1, 5), "def-cong-ang", [4]),
      S({ k: "eq", l: m(1), r: num(90) }, "def-right-angle", [3]),
      S({ k: "eq", l: m(5), r: num(90) }, "substitution", [5, 6]),
      S(right(5), "def-right-angle", [7]),
      S({ k: "perp", a: T, b: N }, "def-perpendicular", [8]),
    ],
  },
);

export const PROOFS3: ProofProblem[] = PROOFS3_RAW.map((p) => ({ ...p, module: 3 }));

// ---------------------------------------------------------------------------
// Flow proofs
// ---------------------------------------------------------------------------

/**
 * A flow proof as the reference draws it: a chain of boxes, each with the
 * reason for it written underneath. The student supplies the reasons.
 */
export type FlowBox = {
  /** The line itself, as a statement or — where the notation has none — as text. */
  statement?: Statement;
  text?: string;
  reasonId: string;
  /** Other reasons that also justify the line. */
  accept?: string[];
  /** Shown already filled in, as the reference's tables fill some rows. */
  shown?: boolean;
  /** What to say when this row is answered wrongly. */
  note?: string;
};

export type FlowItem = {
  id: string;
  title: string;
  figure: Board;
  givens: Statement[];
  goal?: Statement;
  /** For proofs whose given or goal the statement notation cannot write. */
  givenText?: string[];
  goalText?: string;
  /** The rule this proof establishes, which may not justify its own box. */
  proves?: string;
  boxes: FlowBox[];
  /** A chain of boxes and arrows, or a two-column table with blanks. */
  layout?: "flow" | "table";
  /** The reasons offered for a blank; FLOW_REASONS when not given. */
  reasons?: string[];
  tags?: string[];
};

/**
 * Reasons that appear only in the reference's fill-in tables, where the
 * proof has a Pythagorean step the statement notation does not write.
 */
export const TABLE_REASON_NAMES: Record<string, string> = {
  "def-perp-bisector": "Definition of perpendicular bisector",
  "def-right-triangle": "Definition of right triangle",
  pythagorean: "Pythagorean Theorem",
  "square-root": "If x² = y² and x, y ≥ 0, then x = y",
  "perpendicular-postulate": "Perpendicular Postulate",
};

const BISECTOR_REASONS = [
  "given",
  "reflexive",
  "symmetric",
  "transitive",
  "substitution",
  "subtraction-property",
  "pythagorean",
  "def-perp-bisector",
  "def-right-triangle",
  "square-root",
  "perpendicular-postulate",
];

export const FLOW_REASONS = [
  "given",
  "corresponding-angles-postulate",
  "alt-interior-angles-theorem",
  "alt-exterior-angles-theorem",
  "vertical-angles-theorem",
  "linear-pair-theorem",
  "transitive",
  "def-cong-ang",
];

export const FLOWS3: FlowItem[] = [
  {
    id: "m3-flow-book",
    title: "Prove the Alternate Interior Angles Theorem",
    figure: flowProof(),
    givens: [ab],
    goal: cong(1, 3),
    proves: "alt-interior-angles-theorem",
    boxes: [
      { statement: ab, reasonId: "given" },
      { statement: cong(1, 2), reasonId: "corresponding-angles-postulate" },
      { statement: cong(2, 3), reasonId: "vertical-angles-theorem" },
      { statement: cong(1, 3), reasonId: "transitive" },
    ],
    tags: ["The reference's 3B"],
  },
  {
    id: "m3-flow-aet",
    title: "Prove the Alternate Exterior Angles Theorem",
    figure: parallelMN(),
    givens: [mn],
    goal: cong(1, 7),
    proves: "alt-exterior-angles-theorem",
    boxes: [
      { statement: mn, reasonId: "given" },
      { statement: cong(1, 5), reasonId: "corresponding-angles-postulate" },
      { statement: cong(5, 7), reasonId: "vertical-angles-theorem" },
      { statement: cong(1, 7), reasonId: "transitive" },
    ],
  },
  {
    id: "m3-flow-ait-46",
    title: "The other alternate interior pair",
    figure: parallelMN(),
    givens: [mn],
    goal: cong(4, 6),
    proves: "alt-interior-angles-theorem",
    boxes: [
      { statement: mn, reasonId: "given" },
      { statement: cong(4, 8), reasonId: "corresponding-angles-postulate" },
      { statement: cong(8, 6), reasonId: "vertical-angles-theorem" },
      { statement: cong(4, 6), reasonId: "transitive" },
    ],
  },
  {
    id: "m3-flow-from-aet",
    title: "Corresponding angles, from a different starting rule",
    figure: parallelMN(),
    givens: [mn],
    goal: cong(2, 6),
    proves: "corresponding-angles-postulate",
    boxes: [
      { statement: mn, reasonId: "given" },
      { statement: cong(2, 8), reasonId: "alt-exterior-angles-theorem" },
      { statement: cong(8, 6), reasonId: "vertical-angles-theorem" },
      { statement: cong(2, 6), reasonId: "transitive" },
    ],
    tags: ["Turn and Talk"],
  },
  {
    id: "m3-flow-tiles",
    title: "Prove the lines parallel",
    figure: givenAltInterior(),
    givens: [cong(3, 5)],
    goal: mn,
    proves: "converse-alt-interior",
    layout: "table",
    reasons: ["given", "vertical-angles-theorem", "transitive", "converse-corresponding", "corresponding-angles-postulate", "alt-interior-angles-theorem", "converse-alt-interior"],
    boxes: [
      { statement: cong(3, 5), reasonId: "given", shown: true },
      { statement: cong(5, 7), reasonId: "vertical-angles-theorem" },
      { statement: cong(3, 7), reasonId: "transitive" },
      {
        statement: mn,
        reasonId: "converse-corresponding",
        note: "∠3 and ∠7 are corresponding angles, and congruent — so the test to cite is the converse of the postulate. The forward postulate would need m ∥ n already.",
      },
    ],
    tags: ["The reference's 3.2 Task 3"],
  },
  {
    id: "m3-flow-perp-bisector",
    title: "Prove the Perpendicular Bisector Theorem",
    figure: perpBisectorTheorem(),
    givens: [],
    givenText: ["CD is the perpendicular bisector of AB"],
    goalText: "AC = BC",
    layout: "table",
    reasons: BISECTOR_REASONS,
    boxes: [
      { text: "CD is the perpendicular bisector of AB", reasonId: "given", shown: true },
      { text: "AD = BD", reasonId: "def-perp-bisector", shown: true },
      { text: "m∠ADC = m∠BDC = 90°", reasonId: "def-perp-bisector", shown: true },
      { text: "CD = CD", reasonId: "reflexive", note: "A length equals itself: that is the Reflexive Property. It is how the shared leg CD enters the proof." },
      { text: "△ADC and △BDC are right triangles", reasonId: "def-right-triangle", shown: true },
      { text: "AC² = AD² + CD² and BC² = BD² + CD²", reasonId: "pythagorean", note: "Each is a right triangle's hypotenuse squared, equal to the sum of the legs squared: the Pythagorean Theorem." },
      { text: "BC² = AD² + CD²", reasonId: "substitution", shown: true },
      { text: "AC² = BC²", reasonId: "transitive", accept: ["substitution"], note: "AC² and BC² are each equal to AD² + CD², so they are equal to each other." },
      { text: "AC = BC", reasonId: "square-root", shown: true },
    ],
    tags: ["The reference's 3.3 Task 1"],
  },
  {
    id: "m3-flow-perp-bisector-converse",
    title: "Prove the converse",
    figure: perpBisectorConverse(2)(),
    givens: [],
    givenText: ["CA = CB"],
    goalText: "C is on the perpendicular bisector of AB",
    layout: "table",
    reasons: BISECTOR_REASONS,
    boxes: [
      { text: "CA = CB", reasonId: "given", shown: true },
      { text: "Draw CD ⊥ AB, meeting AB at D", reasonId: "perpendicular-postulate", note: "A proof may add a line only when a postulate says it exists. The Perpendicular Postulate guarantees this one." },
      { text: "△ACD and △BCD are right triangles", reasonId: "def-right-triangle", shown: true },
      { text: "CA² = AD² + CD² and CB² = BD² + CD²", reasonId: "pythagorean" },
      { text: "AD² + CD² = BD² + CD²", reasonId: "substitution", note: "CA = CB, so the two squares CA² and CB² are equal: put one right-hand side in for the other." },
      { text: "AD² = BD²", reasonId: "subtraction-property", note: "CD² is on both sides; subtract it." },
      { text: "AD = BD", reasonId: "square-root", shown: true },
      { text: "CD is the perpendicular bisector of AB, so C is on it", reasonId: "def-perp-bisector", note: "CD is perpendicular to AB and meets it at its midpoint: that is what a perpendicular bisector is." },
    ],
    tags: ["The reference's 3.3 Task 2"],
  },
];
