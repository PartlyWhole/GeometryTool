// Questions in parts, where one figure and one piece of work serve both.
//
// The paper does this twice, and the shape matters: Part A often produces
// something Part B needs, so a student who treats the parts as unrelated does
// the work twice or gets the second one wrong. It is also where the
// reference's warning lives most naturally — Part A asks for x, Part B asks
// for what the question was actually about.
import type { Board } from "../../model";
import type { Statement } from "../terms";
import { ang, seg } from "../terms";
import { crossingAt, linearPairAt, markedPair, midpoint } from "./library";
import { rng } from "./generators";

export type PartBody =
  | {
      kind: "numeric";
      answer: number;
      unit?: string;
      tolerance?: number;
      trap?: { value: number; note: string };
    }
  | { kind: "claims"; claims: { statement: Statement; holds: boolean }[] };

export type Part = {
  label: string;
  prompt: string;
  why: string;
  hints?: string[];
  body: PartBody;
};

export type MultiPartItem = {
  id: string;
  title: string;
  stem: string;
  figure?: Board;
  given?: string[];
  parts: Part[];
  tags?: string[];
};

const int = (r: () => number, lo: number, hi: number) =>
  lo + Math.floor(r() * (hi - lo + 1));
const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];

export const MULTIPART_ITEMS: MultiPartItem[] = [
  {
    id: "fa12",
    title: "Reading a marked diagram",
    stem: "Line EF crosses AB and DC as shown, and AB = DC.",
    figure: markedPair(),
    given: ["AB = 27.25 m", "DF = 16.4 m"],
    parts: [
      {
        label: "Part A",
        prompt: "Which statements about the diagram are true? Select all of them.",
        why: "The double ticks give AD ≅ BC and the single ticks give EB ≅ DF. EF carries no ticks at all, so nothing relates it to anything, however the drawing looks.",
        hints: ["Work from the ticks, not from how long the segments look."],
        body: {
          kind: "claims",
          claims: [
            { statement: { k: "cong", l: seg("A", "D"), r: seg("B", "C") }, holds: true },
            { statement: { k: "cong", l: seg("A", "E"), r: seg("E", "F") }, holds: false },
            { statement: { k: "cong", l: seg("B", "C"), r: seg("E", "F") }, holds: false },
            { statement: { k: "cong", l: seg("E", "B"), r: seg("D", "F") }, holds: true },
            { statement: { k: "cong", l: seg("E", "B"), r: seg("E", "F") }, holds: false },
          ],
        },
      },
      {
        label: "Part B",
        prompt: "What is the length of AE, in metres?",
        why: "Part A gave you EB ≅ DF, so EB = 16.4. E lies on AB, so Segment Addition runs backwards: 27.25 − 16.4 = 10.85.",
        hints: [
          "Part A already told you which segment is congruent to DF.",
          "E is between A and B, so AE + EB = AB.",
        ],
        body: { kind: "numeric", answer: 10.85, unit: "m" },
      },
    ],
    tags: ["Form A, Q12", "Fig. 18"],
  },
  {
    id: "fa13",
    title: "A straight angle in disguise",
    stem: "Lines CD and EF intersect at point X, such that m∠CXE = ⅝ m∠FXE.",
    figure: crossingAt(112.5),
    parts: [
      {
        label: "Part A",
        prompt: "What is m∠EXD in degrees?",
        why: "E and F are opposite ends of one line through X, so ∠FXE is a straight angle — 180°. That makes m∠CXE = ⅝(180) = 112.5°. ∠EXD forms a linear pair with ∠CXE along line CD, so 180 − 112.5 = 67.5.",
        hints: [
          "E and F are ends of one line. What kind of angle is ∠FXE?",
          "Once you have m∠CXE, ∠EXD is its linear pair.",
        ],
        body: { kind: "numeric", answer: 67.5, unit: "°" },
      },
      {
        label: "Part B",
        prompt: "What is m∠DXF in degrees?",
        why: "You already have m∠CXE = 112.5°. ∠DXF sits opposite it across the crossing, so it is vertical to ∠CXE and copies it exactly.",
        hints: ["∠DXF sits opposite ∠CXE across X."],
        body: { kind: "numeric", answer: 112.5, unit: "°" },
      },
    ],
    tags: ["Form A, Q13", "Fig. 12", "Fig. 14"],
  },
  {
    id: "midpoint-two-parts",
    title: "Midpoint, then the length",
    stem: "M is the midpoint of AB, with AB = 42 cm and AM = (4x + 3) cm.",
    figure: midpoint(),
    parts: [
      {
        label: "Part A",
        prompt: "What is the value of x?",
        why: "A midpoint makes both halves equal, so each is 42 ÷ 2 = 21. Then 4x + 3 = 21, giving 4x = 18 and x = 4.5.",
        hints: ["Each half of AB is half of 42."],
        body: { kind: "numeric", answer: 4.5 },
      },
      {
        label: "Part B",
        prompt: "What is the length of MB, in centimetres?",
        why: "MB is the other half, so it is 21 — the same as AM. You did not need x again; the halves were equal from the start.",
        hints: [
          "M is the midpoint, so what do you know about the two halves?",
        ],
        body: {
          kind: "numeric",
          answer: 21,
          unit: "cm",
          trap: {
            value: 4.5,
            note: "That is x from Part A, not a length.",
          },
        },
      },
    ],
    tags: ["§6", "§10"],
  },
];

/** Solve for x, then answer what the question was actually about. */
export function substitutionPair(seed: number): MultiPartItem {
  const r = rng(seed);
  const total = pick(r, [180, 90]);
  const x0 = int(r, 2, 9);
  const a = int(r, 3, 12);
  let b = 0,
    v1 = 0;
  for (let t = 0; t < 80; t++) {
    b = int(r, -15, 15);
    v1 = a * x0 + b;
    if (v1 > 8 && v1 < total - 8) break;
  }
  const c = int(r, 2, 11);
  const d = total - v1 - c * x0;
  const v2 = total - v1;
  const word = total === 180 ? "supplementary" : "complementary";
  const show = (k: number, n: number) =>
    `${k}x${n === 0 ? "" : n > 0 ? ` + ${n}` : ` − ${Math.abs(n)}`}`;
  return {
    id: "mp-sub-" + seed,
    title: `Solve, then answer the question`,
    stem: `∠1 and ∠2 are ${word}, with m∠1 = (${show(a, b)})° and m∠2 = (${show(c, d)})°.`,
    figure: total === 180 ? linearPairAt(v1) : undefined,
    parts: [
      {
        label: "Part A",
        prompt: "What is the value of x?",
        why: `${word[0].toUpperCase() + word.slice(1)} means the two measures total ${total}: (${show(a, b)}) + (${show(c, d)}) = ${total}, so x = ${x0}.`,
        hints: [`${word[0].toUpperCase() + word.slice(1)} means the measures total ${total}.`],
        body: { kind: "numeric", answer: x0 },
      },
      {
        label: "Part B",
        prompt: "What is m∠2 in degrees?",
        why: `Substitute x back into the expression the question named: m∠2 = ${c}(${x0}) ${d >= 0 ? "+ " + d : "− " + Math.abs(d)} = ${v2}.`,
        hints: ["Put x back into the expression for ∠2, not the one for ∠1."],
        body: {
          kind: "numeric",
          answer: v2,
          unit: "°",
          trap: {
            value: x0,
            note: "That is x from Part A. Part B asks for a measure.",
          },
        },
      },
    ],
    tags: ["generated", "§10"],
  };
}

export function generatedMultiPart(seed: number, count = 4): MultiPartItem[] {
  const r = rng(seed);
  return Array.from({ length: count }, () => substitutionPair(int(r, 1, 1 << 28)));
}
