// "Select all the true statements" over a marked figure.
//
// The reference is strict that only the marks count: in Fig. 18 nothing
// relates EF to anything, "no matter how the drawing looks". So a claim is
// judged by `marked` — what the figure asserts — and the tests check every
// claim's stated truth against the oracle rather than trusting the authoring.
import type { Board } from "../../model";
import type { Statement } from "../terms";
import { ang, seg } from "../terms";
import { crossing, markedPair, midpoint, perpendicular } from "./library";

export type ClaimItem = {
  id: string;
  prompt: string;
  figure: Board;
  claims: { statement: Statement; holds: boolean }[];
  why: string;
  tags?: string[];
};

export const CLAIM_ITEMS: ClaimItem[] = [
  {
    id: "fa12-marks",
    prompt: "Which statements does this figure actually assert? Select all of them.",
    figure: markedPair(),
    claims: [
      { statement: { k: "cong", l: seg("A", "D"), r: seg("B", "C") }, holds: true },
      { statement: { k: "cong", l: seg("A", "E"), r: seg("E", "F") }, holds: false },
      { statement: { k: "cong", l: seg("B", "C"), r: seg("E", "F") }, holds: false },
      { statement: { k: "cong", l: seg("E", "B"), r: seg("D", "F") }, holds: true },
      { statement: { k: "cong", l: seg("E", "B"), r: seg("E", "F") }, holds: false },
    ],
    why: "The double ticks give AD ≅ BC and the single ticks give EB ≅ DF. EF carries no ticks at all, so nothing on the figure relates it to anything, however the drawing looks.",
    tags: ["Form A, Q12", "Fig. 18"],
  },
  {
    id: "crossing-truths",
    prompt: "Two lines cross at X. Which statements does the figure assert? Select all of them.",
    figure: crossing(),
    claims: [
      { statement: { k: "vertical", a: ang("1"), b: ang("3") }, holds: true },
      { statement: { k: "linearPair", a: ang("1"), b: ang("2") }, holds: true },
      { statement: { k: "adjacent", a: ang("1"), b: ang("3") }, holds: false },
      { statement: { k: "vertical", a: ang("1"), b: ang("2") }, holds: false },
      { statement: { k: "linearPair", a: ang("2"), b: ang("3") }, holds: true },
    ],
    why: "Vertical angles sit opposite and share only the vertex; adjacent angles share a side. ∠1 and ∠3 face each other, so they are vertical and not adjacent. Any neighbouring pair on a line is a linear pair.",
    tags: ["Fig. 14", "§8"],
  },
  {
    id: "midpoint-truths",
    prompt: "The ticks mark the two halves. Which statements does the figure assert? Select all of them.",
    figure: midpoint(),
    claims: [
      { statement: { k: "cong", l: seg("A", "M"), r: seg("M", "B") }, holds: true },
      { statement: { k: "midpoint", p: "M", seg: seg("A", "B") }, holds: true },
      { statement: { k: "between", p: "M", a: "A", c: "B" }, holds: true },
      { statement: { k: "cong", l: seg("A", "M"), r: seg("A", "B") }, holds: false },
    ],
    why: "Matching ticks on the two halves, with M drawn on AB, is exactly what makes M the midpoint. A half is never congruent to the whole.",
    tags: ["Fig. 9", "§6"],
  },
  {
    id: "perpendicular-truths",
    prompt:
      "The square marks one angle. Which statements does the figure assert? Select all of them.",
    figure: perpendicular(),
    claims: [
      { statement: { k: "angleClass", ang: ang("APQ"), cls: "right" }, holds: true },
      { statement: { k: "linearPair", a: ang("APQ"), b: ang("QPB") }, holds: true },
      { statement: { k: "cong", l: seg("A", "P"), r: seg("P", "B") }, holds: false },
      { statement: { k: "between", p: "P", a: "A", c: "B" }, holds: true },
    ],
    why: "AP and PB look equal, and they are — but nothing on the figure says so, and a drawing is not evidence. The square is a given fact worth 90°; P drawn on AB is a given fact too.",
    tags: ["§3", "§6"],
  },
];
