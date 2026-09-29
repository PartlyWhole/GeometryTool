// Module 3, Lesson 3.3: the perpendicular bisector and equal distances.
//
// Generated: is what is marked enough to put B on the perpendicular bisector
// of AC, and length equations from the theorem or its converse — every
// figure drawn to agree with its marks. Authored: why the constructions work,
// and the reference's models (water molecule, circle, folding).
import type { Trap } from "./numeric";
import type { MixedItem } from "./tests3";
import { reorder } from "./tests3";
import {
  bisectorTriangle,
  constructPerpBisector,
  constructPerpThroughPoint,
  perpBisectorTheorem,
} from "./library3";
import { rng } from "./generators";

const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];
const shuffle = <T,>(r: () => number, xs: T[]) => {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const YES_CONVERSE = "Yes — B is equidistant from A and C (Converse of the Perpendicular Bisector Theorem)";
const YES_DEF = "Yes — BD is marked as the perpendicular bisector of AC";
const NO = "No — what is marked does not put B on it";

export type Case = {
  marks: { equal?: boolean; halves?: boolean; right?: boolean; apex?: number; foot?: number };
  answer: string;
  why: string;
};

/** Five ways a figure can be marked, and what each licenses. */
const CASES: Case[] = [
  {
    marks: { equal: true },
    answer: YES_CONVERSE,
    why: "The ticks make BA = BC. A point equidistant from the endpoints lies on the perpendicular bisector: the converse of the theorem.",
  },
  {
    marks: { halves: true, right: true },
    answer: YES_DEF,
    why: "The ticks make D the midpoint of AC and the square makes BD ⊥ AC, so BD is the perpendicular bisector — and B is on it.",
  },
  {
    marks: { halves: true, apex: 70 },
    answer: NO,
    why: "D is the midpoint, so BD bisects AC — but nothing marks it perpendicular, and a bisector at a slant does not keep B equidistant from A and C.",
  },
  {
    marks: { right: true, foot: 0.36 },
    answer: NO,
    why: "BD ⊥ AC, but nothing marks D as the midpoint. A perpendicular that misses the midpoint is not the perpendicular bisector.",
  },
  {
    marks: { apex: -40 },
    answer: NO,
    why: "Nothing is marked at all. However the drawing looks, no fact about B's distances or BD's angle has been given.",
  },
];

/** `cases` limits which markings are shown: the theorem's, the converse's, or both. */
export function enough(r: () => number, id: string, cases: Case[] = CASES): MixedItem {
  const c = pick(r, cases);
  const choices = shuffle(r, [YES_CONVERSE, YES_DEF, NO]);
  return {
    id,
    kind: "choice",
    heading: "Enough to put B on it?",
    prompt: "Is there enough information to conclude that B lies on the perpendicular bisector of AC?",
    figure: bisectorTriangle(c.marks),
    choices,
    correct: choices.indexOf(c.answer),
    why: c.why,
  };
}

const lin = (a: number, b: number, v = "x") =>
  (a === 1 ? "" : String(a)) + v + (b === 0 ? "" : b > 0 ? " + " + b : " − " + -b);

/**
 * Length equations. Either the converse (BA = BC marked, BD ⊥ AC: so D is
 * the midpoint) or the theorem (BD marked as the ⊥ bisector: so BA = BC).
 */
export function lengths(r: () => number, id: string, o: { converse?: boolean } = {}): MixedItem {
  const roll = r() < 0.5;
  const converse = o.converse ?? roll;
  const v = pick(r, ["x", "a", "s", "w", "d"]);
  let a = 0, b = 0, c = 0, d = 0, x0 = 0, L = 0;
  for (let t = 0; t < 200; t++) {
    a = 2 + Math.floor(r() * 9);
    c = r() < 0.4 ? 0 : 1 + Math.floor(r() * 9);
    if (a === c) continue;
    x0 = 2 + Math.floor(r() * 12);
    L = 8 + Math.floor(r() * 50);
    b = L - a * x0;
    d = L - c * x0;
    if (Math.abs(b) <= 40 && Math.abs(d) <= 40) break;
  }
  const left = lin(a, b, v);
  const right = c === 0 ? String(L) : lin(c, d, v);
  const askLength = r() < 0.4;
  const [p, q] = converse ? ["AD", "DC"] : ["AB", "BC"];
  const traps: Trap[] = askLength
    ? [{ value: x0, note: x0 + " is " + v + ". The question asks for " + p + ": substitute back." }]
    : [{ value: L, note: L + " is the length " + p + ". The question asks for " + v + "." }];
  if (converse) {
    const side = 10 + Math.floor(r() * 30);
    return {
      id,
      kind: "number",
      heading: "Find the length",
      prompt: askLength ? "Find " + p + "." : "Find " + v + ".",
      figure: bisectorTriangle({ equal: true, right: true }),
      given: ["BD ⊥ AC", "AB = BC = " + side, p + " = " + left, q + " = " + right],
      answer: askLength ? L : x0,
      trap: traps,
      hints: ["B is equidistant from A and C. What does that make BD, and so D?"],
      why:
        "AB = BC, so B is on the perpendicular bisector of AC (the converse), and BD — the perpendicular from B — is that bisector. So D is the midpoint: " +
        left + " = " + right + ", giving " + v + " = " + x0 + (askLength ? ", and " + p + " = " + L + "." : "."),
    };
  }
  return {
    id,
    kind: "number",
    heading: "Find the length",
    prompt: askLength ? "Find " + p + "." : "Find " + v + ".",
    figure: bisectorTriangle({ halves: true, right: true }),
    given: [p + " = " + left, q + " = " + right],
    answer: askLength ? L : x0,
    trap: traps,
    hints: ["BD is marked as the perpendicular bisector of AC. What does the theorem say about B?"],
    why:
      "BD is the perpendicular bisector of AC, so every point on it — B included — is equidistant from A and C: " +
      left + " = " + right + ", giving " + v + " = " + x0 + (askLength ? ", and " + p + " = " + L + "." : "."),
  };
}

const AUTHORED: MixedItem[] = [
  {
    id: "m3b-construct-why",
    kind: "choice",
    heading: "The construction",
    prompt: "Why do the two points where the arcs cross lie on the perpendicular bisector of XY?",
    figure: constructPerpBisector(3)(),
    choices: [
      "Each is one radius from X and one radius from Y, so it is equidistant from them",
      "Each is the midpoint of XY",
      "The arcs meet at right angles",
      "The Parallel Postulate puts them there",
    ],
    correct: 0,
    why: "Both arcs have the same radius, so each crossing is equally far from X and Y. The converse of the Perpendicular Bisector Theorem puts it on the bisector — and two such points fix the line.",
  },
  {
    id: "m3b-radius",
    kind: "choice",
    heading: "The construction",
    prompt: "Why must the compass be set to more than half of XY?",
    figure: constructPerpBisector(2)(),
    choices: [
      "Otherwise the two arcs never meet",
      "Otherwise the bisector would not be perpendicular",
      "Otherwise the arcs cross at the midpoint only",
      "It does not matter what radius is used",
    ],
    correct: 0,
    why: "Two circles of radius r centred X and Y meet only when 2r is more than XY. Anything less and there is no crossing to draw the line through.",
  },
  {
    id: "m3b-through-point",
    kind: "choice",
    heading: "The construction",
    prompt: "In the perpendicular through P, why is P itself on the perpendicular bisector of AB?",
    figure: constructPerpThroughPoint(3)(),
    choices: [
      "The first arc makes PA = PB",
      "P is the midpoint of AB",
      "PQ is perpendicular to m",
      "A and B are the same distance from Q",
    ],
    correct: 0,
    why: "A and B were both marked by one arc centred at P, so PA = PB: P is equidistant from A and B, and so on their perpendicular bisector. Q is too, which makes PQ that bisector.",
  },
  {
    id: "m3b-fold",
    kind: "choice",
    heading: "Folding",
    prompt: "Fold a paper segment so its two endpoints land on each other. What is the crease?",
    choices: ["Its perpendicular bisector", "A bisector at some other angle", "A line parallel to it", "Its midpoint"],
    correct: 0,
    why: "The fold carries each endpoint onto the other, so every point of the crease is equidistant from them: the crease is the perpendicular bisector.",
  },
  {
    id: "m3b-water",
    kind: "choice",
    heading: "A molecule",
    prompt: "In a water molecule each hydrogen atom is the same distance from the oxygen atom. Is the oxygen on the perpendicular bisector of the segment joining the two hydrogens?",
    choices: [
      "Yes — O is equidistant from the two H atoms",
      "No — the H atoms would have to be equidistant from O",
      "Only if the molecule is flat and the angle is 90°",
      "There is not enough information",
    ],
    correct: 0,
    why: "“Each H is the same distance from O” is OH₁ = OH₂ — which says O is equidistant from H₁ and H₂. By the converse, O is on their perpendicular bisector.",
  },
  {
    id: "m3b-circle",
    kind: "choice",
    heading: "A circle",
    prompt: "Why does the perpendicular bisector of any chord of a circle pass through the centre?",
    choices: [
      "The centre is equidistant from the chord's two endpoints",
      "The chord is always a diameter",
      "The bisector is parallel to the diameter",
      "Every line through a circle passes through its centre",
    ],
    correct: 0,
    why: "Both endpoints of a chord are on the circle, one radius from the centre. So the centre is equidistant from them, and the converse puts it on the chord's perpendicular bisector.",
  },
  {
    id: "m3b-theorem-type",
    kind: "choice",
    heading: "The theorem",
    prompt: "C is on the perpendicular bisector of AB. What kind of triangle is △ACB?",
    figure: perpBisectorTheorem(),
    choices: ["Isosceles, with CA = CB", "Equilateral", "Right, with the right angle at C", "Scalene"],
    correct: 0,
    why: "The theorem makes CA = CB, so the triangle has two equal sides. Nothing forces AB to match them, or the angle at C to be 90°.",
  },
];

export function bisectorItems(seed: number, count = 12): MixedItem[] {
  const r = rng(seed);
  const generated: MixedItem[] = [];
  for (let i = 0; generated.length < count - 4; i++)
    generated.push((i % 2 ? lengths : enough)(r, "m3b-" + seed + "-" + i));
  const authored = shuffle(r, AUTHORED).slice(0, 4).map((it) => reorder(r, it));
  const out: MixedItem[] = [];
  for (let i = 0; out.length < count; i++) {
    if (generated[i]) out.push(generated[i]);
    if (i % 2 === 1 && authored.length) out.push(authored.shift()!);
  }
  return out.slice(0, count);
}

export const AUTHORED_BISECTOR = AUTHORED;
export const BISECTOR_CASES = CASES;
