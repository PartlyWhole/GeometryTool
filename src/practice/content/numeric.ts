// Questions whose answer is a number.
//
// Seven of the thirteen questions on the Form A paper want a measure or a
// length, not an equation or a proof. The reference is blunt about the trap:
// "Solving for x is rarely the answer... Questions deliberately pair a small x
// with a large answer." So an item may declare the value of x separately, and
// a student who enters it is told precisely what went wrong.
import type { Board } from "../../model";
import {
  crossingAt,
  linearPairAt,
  markedPair,
  rightSplitAt,
  threeConcurrent,
} from "./library";
import { rng } from "./generators";

export type Trap = { value: number; note: string };

export type NumericItem = {
  id: string;
  prompt: string;
  figure?: Board;
  /** Shown under the figure when the geometry needs saying in words. */
  given?: string[];
  answer: number;
  /** "°", "ft", "m", or none. */
  unit?: string;
  /** Absolute tolerance; answers are exact decimals unless stated. */
  tolerance?: number;
  why: string;
  /**
   * Wrong answers worth naming: a number a student predictably produces, with
   * the correction it earns instead of a bare "no". Several items have more
   * than one — stopping at x and substituting into the wrong expression are
   * different slips and deserve different answers.
   */
  trap?: Trap | Trap[];
  hints?: string[];
  tags?: string[];
};

const int = (r: () => number, lo: number, hi: number) =>
  lo + Math.floor(r() * (hi - lo + 1));
const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];

// ---------------------------------------------------------------------------
// The Form A questions that ask for a number
// ---------------------------------------------------------------------------

export const NUMERIC_ITEMS: NumericItem[] = [
  {
    id: "fa4-fraction",
    prompt: "QR ≅ ST. If QR = ⅔x inches and ST = 0.4 inches, what is x?",
    answer: 0.6,
    why: "Congruent means equal in length, so ⅔x = 0.4. Multiply by the reciprocal: x = 0.4 × 3/2 = 0.6. Decimals are ordinary coefficients and need no special handling.",
    hints: [
      "Congruent segments have equal length, so set the two expressions equal.",
      "To undo a multiplication by ⅔, multiply by 3/2.",
    ],
    tags: ["Form A, Q4", "§6", "§10"],
  },
  {
    id: "fa5-midpoint",
    prompt:
      "G lies on DE, with DE = 22 m and GE = 6x − 4 m. For what value of x is DG ≅ GE?",
    answer: 2.5,
    trap: {
      value: 11,
      note: "That is GE, the length of each half — the number the expression is set equal to, not the x the question asks for.",
    },
    why: "DG ≅ GE with G on DE makes G the midpoint, so each half is 22 ÷ 2 = 11. Then 6x − 4 = 11, so 6x = 15 and x = 2.5.",
    hints: [
      "G is on DE and the two pieces are congruent — where on DE does that put G?",
      "Each half is half of 22. Set the expression equal to that.",
    ],
    tags: ["Form A, Q5", "§6"],
  },
  {
    id: "fa7-linear-pair",
    prompt: "∠ABD and ∠DBC are a linear pair and m∠ABD = 87°. What is m∠DBC?",
    figure: linearPairAt(87),
    answer: 93,
    unit: "°",
    trap: {
      value: 3,
      note: "That is 90 − 87. A linear pair is supplementary, not complementary — the two angles make a straight line, not a right angle.",
    },
    why: "A linear pair is supplementary, so the two measures total 180°. 180 − 87 = 93.",
    hints: ["A linear pair is supplementary."],
    tags: ["Form A, Q7", "§9"],
  },
  {
    id: "fa9-building",
    prompt:
      "The top of a three-storey building is 80.5 feet from the ground. The bottom of the building's second storey is 25.75 feet from the ground. What is the distance, in feet, from the bottom of the second storey to the top of the building?",
    answer: 54.75,
    unit: "ft",
    trap: {
      value: 106.25,
      note: "That is the two heights added. Both are measured from the same ground, so the gap between them is a difference, not a total.",
    },
    why: "Both heights are measured from the ground, so the gap between them is a subtraction: 80.5 − 25.75 = 54.75. The Segment Addition Postulate run backwards. The number of storeys is decoration.",
    hints: [
      "Both measurements start from the same place, the ground.",
      "The whole is one part plus the other, so one part is the whole minus the other.",
    ],
    tags: ["Form A, Q9", "§6"],
  },
  {
    id: "fa10-substitute-back",
    prompt:
      "∠A and ∠B are supplementary and ∠A ≅ ∠C. If m∠A = (16x − 7)° and m∠B = (21x + 2)°, what is m∠C in degrees?",
    answer: 73,
    unit: "°",
    trap: [
      {
        value: 5,
        note: "That is x, not the measure asked for. Substitute it back: m∠A = 16(5) − 7 = 73, and ∠C matches ∠A.",
      },
      {
        value: 107,
        note: "That is m∠B. You substituted back, but into the wrong expression — ∠C matches ∠A, not its supplement.",
      },
    ],
    why: "(16x − 7) + (21x + 2) = 180 gives 37x − 5 = 180, so x = 5. That is not the answer. Substitute back: m∠A = 16(5) − 7 = 73, and since ∠A ≅ ∠C, m∠C = 73.",
    hints: [
      "Supplementary means the two measures total 180.",
      "Solve for x — then read the question again before answering.",
    ],
    tags: ["Form A, Q10", "§10"],
  },
  {
    id: "fa11-three-lines",
    prompt:
      "Three lines intersect at V. If m∠Y = 33° and m∠Z = 87°, what is m∠X in degrees?",
    figure: threeConcurrent(),
    answer: 60,
    unit: "°",
    trap: {
      value: 240,
      note: "That is 360 − 87 − 33, from taking the three labelled angles as a full turn about V. They all sit on one side of the line through P and Q, so they share a straight angle instead.",
    },
    why: "The three marked angles sit consecutively above one straight line, so they share its 180°: 180 − 33 − 87 = 60. Working round the full 360° would also work and take twice as long.",
    hints: [
      "Which of the labelled points lie on one straight line through V?",
      "Always look for the straight line first.",
    ],
    tags: ["Form A, Q11", "§8"],
  },
  {
    id: "fa12-marked",
    prompt:
      "E lies on AB. If AB = 27.25 m and DF = 16.4 m, what is AE in metres?",
    figure: markedPair(),
    given: ["AB = 27.25 m", "DF = 16.4 m"],
    answer: 10.85,
    unit: "m",
    trap: [
      {
        value: 16.4,
        note: "That is DF, transferred correctly across the ticks — but the question asks for AE, and there is still a subtraction to do.",
      },
      {
        value: 43.65,
        note: "That is AB + DF. E lies on AB, so the part is taken out of the whole, not added to it.",
      },
    ],    why: "EB = DF = 16.4 because the single ticks match. E lies on AB, so Segment Addition runs backwards: 27.25 − 16.4 = 10.85. The drawing is not to scale; only the marks count.",
    hints: [
      "The matching single ticks tell you EB.",
      "E is between A and B, so AE + EB = AB.",
    ],
    tags: ["Form A, Q12", "Fig. 18"],
  },
  {
    id: "fa13a-straight",
    prompt:
      "Lines CD and EF intersect at X, and m∠CXE = ⅝ m∠FXE. What is m∠EXD in degrees?",
    figure: crossingAt(112.5),
    answer: 67.5,
    unit: "°",
    trap: {
      value: 112.5,
      note: "That is m∠CXE, the step before the one asked for. ∠EXD is the rest of the straight line CD, not the angle you have just found.",
    },
    why: "E and F are opposite ends of one line through X, so ∠FXE is a straight angle — 180°. That makes m∠CXE = ⅝(180) = 112.5°. ∠EXD forms a linear pair with ∠CXE along line CD, so 180 − 112.5 = 67.5.",
    hints: [
      "What kind of angle is ∠FXE, given that E and F are ends of one line?",
      "Once you have m∠CXE, ∠EXD is its linear pair.",
    ],
    tags: ["Form A, Q13", "Fig. 12"],
  },
  {
    id: "fa13b-vertical",
    prompt:
      "Lines CD and EF intersect at X, and m∠CXE = ⅝ m∠FXE. What is m∠DXF in degrees?",
    figure: crossingAt(112.5),
    answer: 112.5,
    unit: "°",
    trap: {
      value: 67.5,
      note: "That is ∠CXE's linear pair, so a subtraction has crept in. Vertical angles copy a measure rather than completing 180° with it.",
    },
    why: "∠FXE is a straight angle, so m∠CXE = ⅝(180) = 112.5°. ∠DXF is vertical to ∠CXE, so it copies it exactly.",
    hints: [
      "What kind of angle is ∠FXE, given that E and F are ends of one line?",
      "∠DXF sits opposite ∠CXE across the crossing.",
    ],
    tags: ["Form A, Q13", "Fig. 14"],
  },
];

// ---------------------------------------------------------------------------
// Generated numeric questions
// ---------------------------------------------------------------------------

/** Given one angle of a linear pair, find the other. */
function linearPairFind(seed: number): NumericItem {
  const r = rng(seed);
  const first = int(r, 15, 165);
  return {
    id: "num-lp-" + seed,
    prompt: `∠ABD and ∠DBC are a linear pair and m∠ABD = ${first}°. What is m∠DBC?`,
    figure: linearPairAt(first),
    answer: 180 - first,
    unit: "°",
    why: `A linear pair is supplementary, so the two measures total 180°. 180 − ${first} = ${180 - first}.`,
    hints: ["A linear pair is supplementary."],
    tags: ["generated", "§9"],
  };
}

/** Given one part of a right angle, find the other. */
function complementFind(seed: number): NumericItem {
  const r = rng(seed);
  const first = int(r, 10, 80);
  return {
    id: "num-comp-" + seed,
    prompt: `∠AVC and ∠CVB make up the right angle ∠AVB, and m∠AVC = ${first}°. What is m∠CVB?`,
    figure: rightSplitAt(first),
    answer: 90 - first,
    unit: "°",
    why: `The two parts of a right angle are complementary, so they total 90°. 90 − ${first} = ${90 - first}.`,
    hints: ["Splitting a right angle: the parts total 90°."],
    tags: ["generated", "§8"],
  };
}

/** Given one angle at a crossing, find a vertical or an adjacent one. */
function crossingFind(seed: number): NumericItem {
  const r = rng(seed);
  const cxe = int(r, 25, 155);
  const wantVertical = r() < 0.5;
  return {
    id: "num-cross-" + seed,
    prompt: `Lines CD and EF intersect at X, and m∠CXE = ${cxe}°. What is ${wantVertical ? "m∠DXF" : "m∠EXD"}?`,
    figure: crossingAt(cxe),
    answer: wantVertical ? cxe : 180 - cxe,
    unit: "°",
    why: wantVertical
      ? `∠DXF is vertical to ∠CXE, so it copies it exactly: ${cxe}°.`
      : `∠EXD forms a linear pair with ∠CXE along line CD, so 180 − ${cxe} = ${180 - cxe}.`,
    hints: [
      wantVertical
        ? "Opposite across the crossing means vertical."
        : "Side by side on one line means a linear pair.",
    ],
    tags: ["generated", "§8"],
  };
}

/** The reference's own trap: solve for x, then answer what was asked. */
function substituteBack(seed: number): NumericItem {
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
  const word = total === 180 ? "supplementary" : "complementary";
  const show = (k: number, n: number) =>
    `${k}x${n === 0 ? "" : n > 0 ? ` + ${n}` : ` − ${Math.abs(n)}`}`;
  return {
    id: "num-sub-" + seed,
    prompt: `∠1 and ∠2 are ${word}, with m∠1 = (${show(a, b)})° and m∠2 = (${show(c, d)})°. What is m∠1 in degrees?`,
    figure: total === 180 ? linearPairAt(v1) : rightSplitAt(v1),
    answer: v1,
    unit: "°",
    trap: {
      value: x0,
      note: `That is x, not the measure asked for. Substitute it back: m∠1 = ${a}(${x0}) ${b >= 0 ? "+ " + b : "− " + Math.abs(b)} = ${v1}.`,
    },
    why: `${word[0].toUpperCase() + word.slice(1)} means the two measures total ${total}, so (${show(a, b)}) + (${show(c, d)}) = ${total}, giving x = ${x0}. That is not the answer: m∠1 = ${a}(${x0}) ${b >= 0 ? "+ " + b : "− " + Math.abs(b)} = ${v1}.`,
    hints: [
      `${word[0].toUpperCase() + word.slice(1)} means the two measures total ${total}.`,
      "Solve for x — then read the question again before answering.",
    ],
    tags: ["generated", "§10"],
  };
}

/** Clearing a fraction against a decimal, as Form A Q4 does. */
function fractionClear(seed: number): NumericItem {
  const r = rng(seed);
  const [num, den] = pick(r, [
    [2, 3],
    [3, 4],
    [1, 2],
    [3, 5],
    [5, 8],
  ]);
  // x must be a multiple of the denominator/10, or the stated decimal would
  // be a rounded one and a student computing from it would be marked wrong.
  const x = Math.round(den * int(r, 1, 5)) / 10;
  const other = Math.round(num * (x * 10) / den) / 10;
  // Indexed by denominator, so index 0 and 1 are unused.
  const frac = ["", "", "½", "⅓", "¼", "⅕", "⅙", "", "⅛"];
  const label =
    num === 1 ? frac[den] ?? `1/${den}` : `${num}/${den}`;
  return {
    id: "num-frac-" + seed,
    prompt: `QR ≅ ST. If QR = ${label}x inches and ST = ${other} inches, what is x?`,
    answer: x,
    tolerance: 1e-6,
    why: `Congruent means equal in length, so ${label}x = ${other}. Multiply by the reciprocal: x = ${other} × ${den}/${num} = ${Math.round(x * 1000) / 1000}.`,
    hints: [
      "Congruent segments have equal length, so set the two expressions equal.",
      `To undo a multiplication by ${label}, multiply by ${den}/${num}.`,
    ],
    tags: ["generated", "§10"],
  };
}

/** Whole minus a part, in context. */
function segmentPartFind(seed: number): NumericItem {
  const r = rng(seed);
  const whole = int(r, 120, 400) / 4;
  const part = Math.round((whole * (0.2 + r() * 0.5)) * 100) / 100;
  const rest = Math.round((whole - part) * 100) / 100;
  return {
    id: "num-seg-" + seed,
    prompt: `B is between A and C. If AC = ${whole} m and AB = ${part} m, what is BC in metres?`,
    answer: rest,
    unit: "m",
    why: `The parts make the whole, so BC = AC − AB = ${whole} − ${part} = ${rest}.`,
    hints: ["The Segment Addition Postulate, run backwards as a subtraction."],
    tags: ["generated", "§6"],
  };
}

export function generatedNumeric(seed: number, count = 8): NumericItem[] {
  const r = rng(seed);
  const makers = [
    linearPairFind,
    complementFind,
    crossingFind,
    substituteBack,
    substituteBack,
    fractionClear,
    segmentPartFind,
  ];
  const out: NumericItem[] = [];
  for (let i = 0; i < count; i++)
    out.push(pick(r, makers)(int(r, 1, 1 << 28)));
  return out;
}
