// §10, "Turning a diagram into an equation", in both directions.
import type { Board } from "../../model";
import { type Statement, add, ang, len, meas, mul, num, seg } from "../terms";
import type { FormId } from "../StatementBuilder";
import {
  bisector,
  collinear,
  complementary,
  crossing,
  fan,
  linearPair,
  midpoint,
  threeOnLine,
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
    ],
    why: "A midpoint or bisector: each part equals the other, and each is half the whole.",
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
    prompt:
      "∠AVC is a right angle. Drag D until m∠AVD is 30°, leaving ∠DVC at 60°.",
    start: complementary(),
    require: [
      { k: "eq", l: m("AVD"), r: num(30) },
      { k: "interior", p: "D", ang: ang("AVC") },
    ],
    why: "Complementary measures total 90°.",
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
