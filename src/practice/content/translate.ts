// §10, "Turning a diagram into an equation", in both directions.
import type { Board } from "../../model";
import { type Statement, add, ang, div, len, meas, mul, num, seg } from "../terms";
import type { FormId } from "../StatementBuilder";
import {
  bisector,
  collinear,
  congruentComplements,
  complementary,
  crossing,
  fan,
  linearPair,
  markedPair,
  midpoint,
  threeConcurrent,
  threeOnLine,
  twoSupplementPairs,
} from "./library";

const m = meas;

/** Read a figure and write the equation it gives you. */
export type ReadItem = {
  id: string;
  prompt: string;
  figure: Board;
  /** Any of these is a correct answer; equivalent rearrangements also pass. */
  accept: Statement[];
  why: string;
  allowForms?: FormId[];
  tags?: string[];
};

export const READ_ITEMS: ReadItem[] = [
  {
    id: "between-sum",
    prompt: "B lies on AC. Write the equation the figure gives you.",
    figure: collinear(),
    accept: [{ k: "eq", l: add(len("A", "B"), len("B", "C")), r: len("A", "C") }],
    why: "A point between two others: the parts sum to the whole.",
    allowForms: ["eq"],
    tags: ["§10", "§6"],
  },
  {
    id: "midpoint-halves",
    prompt: "The tick marks say M is the midpoint of AB. Write the equation.",
    figure: midpoint(),
    accept: [
      { k: "eq", l: len("A", "M"), r: len("M", "B") },
      { k: "cong", l: seg("A", "M"), r: seg("M", "B") },
      { k: "eq", l: len("A", "M"), r: div(len("A", "B"), num(2)) },
      { k: "eq", l: len("M", "B"), r: div(len("A", "B"), num(2)) },
    ],
    why: "A midpoint or bisector: each part equals the other, and each is half the whole. Either form counts.",
    tags: ["§10", "Fig. 9"],
  },
  {
    id: "linear-pair-180",
    prompt: "Ray BD stands on line AC. Write the equation this gives you.",
    figure: linearPair(),
    accept: [{ k: "eq", l: add(m("ABD"), m("DBC")), r: num(180) }],
    why: "A linear pair, or angles filling one side of a line: the expressions sum to 180.",
    allowForms: ["eq"],
    tags: ["§10", "Fig. 15"],
  },
  {
    id: "complementary-90",
    prompt: "The square marks ∠AVC as a right angle. Write the equation for its two parts.",
    figure: complementary(),
    accept: [{ k: "eq", l: add(m("AVD"), m("DVC")), r: num(90) }],
    why: "Splitting a right angle: the expressions sum to 90.",
    allowForms: ["eq"],
    tags: ["§10", "Fig. 15"],
  },
  {
    id: "three-on-line",
    prompt: "Three angles sit consecutively above line PQ. Write the equation.",
    figure: threeOnLine(),
    accept: [
      { k: "eq", l: add(m("PVR"), m("RVS"), m("SVQ")), r: num(180) },
    ],
    why: "Angles filling one side of a line sum to 180. Looking for the straight line first halves the arithmetic.",
    allowForms: ["eq"],
    tags: ["§10", "Fig. 16"],
  },
  {
    id: "vertical-equal",
    prompt: "Two lines cross at X. Write what the figure says about ∠1 and ∠3.",
    figure: crossing(),
    accept: [
      { k: "cong", l: ang("1"), r: ang("3") },
      { k: "eq", l: m("1"), r: m("3") },
      { k: "vertical", a: ang("1"), b: ang("3") },
    ],
    why: "Vertical angles are congruent, so their measures are equal.",
    tags: ["§10", "Fig. 14"],
  },
  {
    id: "arcs-equal",
    prompt: "Matching arcs mark two of these angles. Write the equation they give you.",
    figure: fan(),
    accept: [
      { k: "eq", l: m("WVX"), r: m("YVZ") },
      { k: "cong", l: ang("WVX"), r: ang("YVZ") },
    ],
    why: "Two angles marked congruent: set the two expressions equal.",
    tags: ["§10", "Fig. 1"],
  },
  {
    id: "bisector-equal",
    prompt: "Ray VD bisects ∠AVC. Write the equation for the two halves.",
    figure: bisector(),
    accept: [
      { k: "eq", l: m("AVD"), r: m("DVC") },
      { k: "cong", l: ang("AVD"), r: ang("DVC") },
    ],
    why: "A bisector makes the parts equal — each half is exactly half the whole.",
    tags: ["§10", "Fig. 13"],
  },
  {
    id: "whole-from-parts",
    prompt: "Write the Angle Addition equation relating ∠WVX, ∠XVY and ∠WVY.",
    figure: fan(),
    accept: [{ k: "eq", l: add(m("WVX"), m("XVY")), r: m("WVY") }],
    why: "X is in the interior of ∠WVY, so the parts make the whole.",
    allowForms: ["eq"],
    tags: ["§8"],
  },
  {
    id: "three-concurrent",
    prompt:
      "Three lines pass through V, so ∠RVS has a twin on the far side. Write what the figure says about ∠RVS and ∠UVT.",
    figure: threeConcurrent(),
    accept: [
      { k: "vertical", a: ang("RVS"), b: ang("UVT") },
      { k: "cong", l: ang("RVS"), r: ang("UVT") },
      { k: "eq", l: m("RVS"), r: m("UVT") },
    ],
    why: "Ray VU is opposite ray VR and ray VT is opposite ray VS, so the two angles are vertical and therefore congruent — 87° each.",
    tags: ["§8", "Fig. 16"],
  },
  {
    id: "marked-only",
    prompt:
      "Only the marks count. Write one congruence this figure actually asserts.",
    figure: markedPair(),
    accept: [
      { k: "cong", l: seg("A", "D"), r: seg("B", "C") },
      { k: "cong", l: seg("E", "B"), r: seg("D", "F") },
      { k: "eq", l: len("A", "D"), r: len("B", "C") },
      { k: "eq", l: len("E", "B"), r: len("D", "F") },
    ],
    why: "One tick matches one tick and two match two. EF carries no ticks at all, so nothing in the figure relates it to anything, however the drawing looks.",
    allowForms: ["cong", "eq"],
    tags: ["§6", "Fig. 18"],
  },
  {
    id: "supplements-of-congruent",
    prompt:
      "The arcs mark ∠3 ≅ ∠4, and each sits on a straight line. Write what the figure says about ∠1 and ∠3.",
    figure: twoSupplementPairs(),
    accept: [
      { k: "supp", a: ang("1"), b: ang("3") },
      { k: "eq", l: add(m("1"), m("3")), r: num(180) },
      { k: "linearPair", a: ang("1"), b: ang("3") },
    ],
    why: "∠1 and ∠3 are adjacent with their outer sides on one line, so they are a linear pair and therefore supplementary.",
    tags: ["§9"],
  },
  {
    id: "cc-step1",
    prompt:
      "The square marks ∠AVC as a right angle. Write the equation it gives you for ∠1 and ∠2.",
    figure: congruentComplements(),
    accept: [{ k: "eq", l: add(m("1"), m("2")), r: num(90) }],
    why: "∠1 and ∠2 together make the right angle ∠AVC, so their measures total 90°. This is the first line of the Congruent Complements proof.",
    allowForms: ["eq"],
    tags: ["§9", "step 1"],
  },
  {
    id: "cc-step2",
    prompt:
      "The other square marks ∠BVD. Write the equation it gives you for ∠2 and ∠3.",
    figure: congruentComplements(),
    accept: [{ k: "eq", l: add(m("2"), m("3")), r: num(90) }],
    why: "∠2 and ∠3 together make the right angle ∠BVD, so their measures total 90°. Now two different sums both equal 90.",
    allowForms: ["eq"],
    tags: ["§9", "step 2"],
  },
  {
    id: "cc-step5",
    prompt:
      "Both sums equal 90, and subtracting the shared ∠2 leaves m∠1 = m∠3. Write the conclusion about ∠1 and ∠3 as a congruence.",
    figure: congruentComplements(),
    accept: [
      { k: "cong", l: ang("1"), r: ang("3") },
      { k: "eq", l: m("1"), r: m("3") },
    ],
    why: "Equal measures become a congruence by the definition of congruent angles — the last line of the proof, and the statement of the Congruent Complements Theorem.",
    tags: ["§9", "step 5"],
  },
  {
    id: "double-part",
    prompt:
      "Suppose m∠AVC is twice m∠AVD. Write that as an equation.",
    figure: bisector(),
    accept: [{ k: "eq", l: m("AVC"), r: mul(num(2), m("AVD")) }],
    why: "“Twice” multiplies; the named quantity goes on the other side.",
    allowForms: ["eq"],
    tags: ["§10"],
  },
];

/** Build or adjust a figure until it matches a description. */
export type ConstructItem = {
  id: string;
  prompt: string;
  /** The figure the student starts from and drags. */
  start: Board;
  /** Every one of these must hold when they are done. */
  require: Statement[];
  /** None of these may hold — for "supplementary but not a linear pair". */
  forbid?: Statement[];
  /** Which points the task invites the student to move. */
  movable: string[];
  why: string;
  tags?: string[];
};

export const CONSTRUCT_ITEMS: ConstructItem[] = [
  {
    id: "make-midpoint",
    movable: ["B"],
    prompt: "Drag B until it is the midpoint of AC.",
    start: collinear(),
    require: [{ k: "midpoint", p: "B", seg: seg("A", "C") }],
    why: "A midpoint divides the segment into two congruent halves. Dragging is checked to within a small tolerance; on paper the two halves are exactly equal.",
    tags: ["§6"],
  },
  {
    id: "make-bisector",
    movable: ["D"],
    prompt: "Drag D until ray VD bisects ∠AVC.",
    start: bisector(),
    require: [
      { k: "eq", l: m("AVD"), r: m("DVC") },
      { k: "interior", p: "D", ang: ang("AVC") },
    ],
    why: "A bisector splits the angle into two congruent angles, and must lie inside it.",
    tags: ["§8"],
  },
  {
    id: "make-right",
    movable: ["D"],
    prompt: "Drag D until ∠ABD is a right angle.",
    start: linearPair(),
    require: [{ k: "angleClass", ang: ang("ABD"), cls: "right" }],
    why: "A right angle measures exactly 90°.",
    tags: ["§8"],
  },
  {
    id: "make-complementary",
    movable: ["D"],
    prompt: "∠AVC is a right angle. Drag D until m∠AVD measures 30°.",
    start: complementary(),
    require: [
      { k: "eq", l: m("AVD"), r: num(30) },
      { k: "interior", p: "D", ang: ang("AVC") },
    ],
    why: "The two parts of a right angle are complementary, so once ∠AVD is 30° the other must be 60°.",
    tags: ["§8"],
  },
  {
    id: "make-double",
    movable: ["D"],
    prompt: "Drag D until m∠AVD is twice m∠DVC.",
    start: bisector(),
    require: [
      { k: "eq", l: m("AVD"), r: mul(num(2), m("DVC")) },
      { k: "interior", p: "D", ang: ang("AVC") },
    ],
    why: "Translate “twice” into a coefficient, then read the figure back to check.",
    tags: ["§10"],
  },
  {
    id: "supp-not-linear",
    movable: ["G"],
    prompt:
      "∠1 sits on line AB and ∠2 on line DE. Drag G until ∠1 and ∠2 are supplementary — while staying a pair that is not a linear pair.",
    start: twoSupplementPairs(),
    require: [{ k: "supp", a: ang("1"), b: ang("2") }],
    forbid: [{ k: "linearPair", a: ang("1"), b: ang("2") }],
    why:
      "A linear pair is always supplementary, but supplementary angles need not be a linear pair. These two never touch, so no amount of dragging could make them one — which is exactly the point.",
    tags: ["§8"],
  },
  {
    id: "double-part-segment",
    movable: ["B"],
    prompt: "Drag B until AB is twice BC.",
    start: collinear(),
    require: [
      { k: "eq", l: len("A", "B"), r: mul(num(2), len("B", "C")) },
      { k: "between", p: "B", a: "A", c: "C" },
    ],
    why:
      "The parts still make the whole: with AB twice BC, B sits two thirds of the way along AC.",
    tags: ["§6", "§10"],
  },
  {
    id: "not-between",
    movable: ["C"],
    prompt:
      "Drag C so that A, B and C stay collinear but B is no longer between A and C.",
    start: collinear(),
    require: [{ k: "collinear", pts: ["A", "B", "C"] }],
    forbid: [{ k: "between", p: "B", a: "A", c: "C" }],
    why:
      "Honour the hypothesis — the points stay collinear — and break the conclusion. This is the reference's Fig. 3 counterexample.",
    tags: ["§1", "Fig. 3"],
  },
];
