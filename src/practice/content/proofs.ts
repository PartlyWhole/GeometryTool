// Proof problems: the module's named theorems, and the Form A questions
// rewritten as proofs.
import type { ProofProblem } from "../proof";
import { add, ang, div, len, meas, mul, num, ray, seg, vr } from "../terms";
import { bisector, collinear, crossing, fan, linearPair, midpoint } from "./library";

const m = meas;

export const PROOFS: ProofProblem[] = [
  {
    id: "shared-angle",
    title: "Adding a shared angle",
    prompt:
      "Two angles are handed to you as congruent. A third angle sits between them, belonging to both. Prove the two larger angles are equal.",
    figure: fan(),
    givens: [{ k: "cong", l: ang("WVX"), r: ang("YVZ") }],
    goal: { k: "eq", l: m("WVY"), r: m("XVZ") },
    hints: [
      "Turn the congruence into an equation about measures.",
      "The shared angle ∠XVY enters through the Reflexive Property.",
      "Add the shared angle to both sides, then rename each sum with the Angle Addition Postulate.",
    ],
    tags: ["Fig. 1", "§3"],
    solution: [
      { statement: { k: "cong", l: ang("WVX"), r: ang("YVZ") }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: m("WVX"), r: m("YVZ") }, reasonId: "def-cong-ang", cites: [1] },
      { statement: { k: "eq", l: m("XVY"), r: m("XVY") }, reasonId: "reflexive", cites: [] },
      { statement: { k: "eq", l: add(m("WVX"), m("XVY")), r: add(m("YVZ"), m("XVY")) }, reasonId: "addition-property", cites: [2, 3] },
      { statement: { k: "eq", l: add(m("WVX"), m("XVY")), r: m("WVY") }, reasonId: "angle-addition", cites: [] },
      { statement: { k: "eq", l: add(m("YVZ"), m("XVY")), r: m("XVZ") }, reasonId: "angle-addition", cites: [] },
      { statement: { k: "eq", l: m("WVY"), r: m("XVZ") }, reasonId: "substitution", cites: [4, 5, 6] },
    ],
  },
  {
    id: "vertical-angles",
    title: "Vertical Angles Theorem",
    prompt:
      "Two lines cross at X. Prove that ∠1 and ∠3 are congruent, without citing the theorem itself.",
    figure: crossing(),
    givens: [],
    goal: { k: "cong", l: ang("1"), r: ang("3") },
    forbid: ["vertical-angles-theorem"],
    hints: [
      "Both ∠1 and ∠3 sit on a line with ∠2.",
      "A linear pair is supplementary, so each pair totals 180°.",
      "Two quantities equal to the same thing are equal — then subtract the shared angle.",
    ],
    tags: ["Fig. 17", "§9"],
    solution: [
      { statement: { k: "linearPair", a: ang("1"), b: ang("2") }, reasonId: "def-linear-pair", cites: [] },
      { statement: { k: "linearPair", a: ang("2"), b: ang("3") }, reasonId: "def-linear-pair", cites: [] },
      { statement: { k: "eq", l: add(m("1"), m("2")), r: num(180) }, reasonId: "linear-pair-theorem", cites: [1] },
      { statement: { k: "eq", l: add(m("2"), m("3")), r: num(180) }, reasonId: "linear-pair-theorem", cites: [2] },
      { statement: { k: "eq", l: add(m("1"), m("2")), r: add(m("2"), m("3")) }, reasonId: "substitution", cites: [3, 4] },
      { statement: { k: "eq", l: m("1"), r: m("3") }, reasonId: "subtraction-property", cites: [5] },
      { statement: { k: "cong", l: ang("1"), r: ang("3") }, reasonId: "def-cong-ang", cites: [6] },
    ],
  },
  {
    id: "congruent-supplements",
    title: "Congruent Supplements Theorem",
    prompt:
      "∠1 and ∠2 are both supplementary to ∠3. Prove ∠1 ≅ ∠2, without citing the theorem itself.",
    givens: [
      { k: "supp", a: ang("1"), b: ang("3") },
      { k: "supp", a: ang("2"), b: ang("3") },
    ],
    goal: { k: "cong", l: ang("1"), r: ang("2") },
    forbid: ["congruent-supplements"],
    objects: [ang("1"), ang("2"), ang("3")],
    hints: [
      "Write each supplementary statement as a sum equal to 180.",
      "Both sums equal 180, so they equal each other.",
      "Subtract the shared m∠3, then turn the equality back into a congruence.",
    ],
    tags: ["§9"],
    solution: [
      { statement: { k: "supp", a: ang("1"), b: ang("3") }, reasonId: "given", cites: [] },
      { statement: { k: "supp", a: ang("2"), b: ang("3") }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: add(m("1"), m("3")), r: num(180) }, reasonId: "def-supplementary", cites: [1] },
      { statement: { k: "eq", l: add(m("2"), m("3")), r: num(180) }, reasonId: "def-supplementary", cites: [2] },
      { statement: { k: "eq", l: add(m("1"), m("3")), r: add(m("2"), m("3")) }, reasonId: "substitution", cites: [3, 4] },
      { statement: { k: "eq", l: m("1"), r: m("2") }, reasonId: "subtraction-property", cites: [5] },
      { statement: { k: "cong", l: ang("1"), r: ang("2") }, reasonId: "def-cong-ang", cites: [6] },
    ],
  },
  {
    id: "right-angles",
    title: "Right Angle Congruence Theorem",
    prompt: "∠1 and ∠2 are right angles. Prove ∠1 ≅ ∠2.",
    givens: [
      { k: "angleClass", ang: ang("1"), cls: "right" },
      { k: "angleClass", ang: ang("2"), cls: "right" },
    ],
    goal: { k: "cong", l: ang("1"), r: ang("2") },
    forbid: ["right-angle-congruence"],
    objects: [ang("1"), ang("2")],
    hints: [
      "The definition of a right angle turns each into a measure of 90.",
      "Two quantities each equal to 90 are equal to each other.",
      "Finish by turning the equal measures back into a congruence.",
    ],
    tags: ["§9"],
    solution: [
      { statement: { k: "angleClass", ang: ang("1"), cls: "right" }, reasonId: "given", cites: [] },
      { statement: { k: "angleClass", ang: ang("2"), cls: "right" }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: m("1"), r: num(90) }, reasonId: "def-right-angle", cites: [1] },
      { statement: { k: "eq", l: m("2"), r: num(90) }, reasonId: "def-right-angle", cites: [2] },
      { statement: { k: "eq", l: m("1"), r: m("2") }, reasonId: "transitive", cites: [3, 4] },
      { statement: { k: "cong", l: ang("1"), r: ang("2") }, reasonId: "def-cong-ang", cites: [5] },
    ],
  },
  {
    id: "linear-pair-supp",
    title: "A linear pair on a line",
    prompt:
      "Ray BD stands on line AC. Prove that m∠ABD + m∠DBC = 180.",
    figure: linearPair(),
    givens: [],
    goal: { k: "eq", l: add(m("ABD"), m("DBC")), r: num(180) },
    hints: [
      "First say what the figure shows about ∠ABD and ∠DBC.",
      "The Linear Pair Theorem turns that picture fact into a number fact.",
    ],
    tags: ["Fig. 15", "§9"],
    solution: [
      { statement: { k: "linearPair", a: ang("ABD"), b: ang("DBC") }, reasonId: "def-linear-pair", cites: [] },
      { statement: { k: "eq", l: add(m("ABD"), m("DBC")), r: num(180) }, reasonId: "linear-pair-theorem", cites: [1] },
    ],
  },
  {
    id: "bisector-halves",
    title: "A bisector makes the parts equal",
    prompt: "Ray VD bisects ∠AVC. Prove that m∠AVD + m∠AVD = m∠AVC.",
    figure: bisector(),
    givens: [{ k: "bisects", by: ray("V", "D"), of: ang("AVC") }],
    goal: { k: "eq", l: add(m("AVD"), m("AVD")), r: m("AVC") },
    hints: [
      "The definition of an angle bisector gives two congruent parts.",
      "Turn that congruence into equal measures.",
      "The Angle Addition Postulate says the parts make the whole; then substitute.",
    ],
    tags: ["Fig. 13", "§8"],
    solution: [
      { statement: { k: "bisects", by: ray("V", "D"), of: ang("AVC") }, reasonId: "given", cites: [] },
      { statement: { k: "cong", l: ang("AVD"), r: ang("DVC") }, reasonId: "def-ang-bisector", cites: [1] },
      { statement: { k: "eq", l: m("AVD"), r: m("DVC") }, reasonId: "def-cong-ang", cites: [2] },
      { statement: { k: "eq", l: add(m("AVD"), m("DVC")), r: m("AVC") }, reasonId: "angle-addition", cites: [] },
      { statement: { k: "eq", l: add(m("AVD"), m("AVD")), r: m("AVC") }, reasonId: "substitution", cites: [3, 4] },
    ],
  },
  {
    id: "algebra-justify",
    title: "Justifying an algebra solution",
    prompt:
      "Given 3(x − 4) = 18, prove that x = 10. Every line of algebra carries a name.",
    givens: [{ k: "eq", l: mul(num(3), add(vr("x"), num(-4))), r: num(18) }],
    goal: { k: "eq", l: vr("x"), r: num(10) },
    hints: [
      "Clear the parentheses first.",
      "Then undo the −12, and finally undo the ×3.",
    ],
    tags: ["§3"],
    solution: [
      { statement: { k: "eq", l: mul(num(3), add(vr("x"), num(-4))), r: num(18) }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: add(mul(num(3), vr("x")), num(-12)), r: num(18) }, reasonId: "distributive", cites: [1] },
      { statement: { k: "eq", l: mul(num(3), vr("x")), r: num(30) }, reasonId: "addition-property", cites: [2] },
      { statement: { k: "eq", l: vr("x"), r: num(10) }, reasonId: "division-property", cites: [3] },
    ],
  },
  {
    id: "midpoint-solve",
    title: "Midpoint, then solve",
    prompt:
      "M is the midpoint of AB, AB = 22 and AM = 6x − 4. Prove that x = 2.5.",
    figure: midpoint(),
    givens: [
      { k: "midpoint", p: "M", seg: seg("A", "B") },
      { k: "eq", l: len("A", "B"), r: num(22) },
      { k: "eq", l: len("A", "M"), r: add(mul(num(6), vr("x")), num(-4)) },
    ],
    goal: { k: "eq", l: vr("x"), r: num(2.5) },
    hints: [
      "A midpoint makes the two halves congruent, so their lengths are equal.",
      "The Segment Addition Postulate says the halves make the whole.",
      "Combine those to find AM, then solve the equation for x.",
    ],
    tags: ["Form A, Q5", "§6"],
    solution: [
      { statement: { k: "midpoint", p: "M", seg: seg("A", "B") }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: len("A", "B"), r: num(22) }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: len("A", "M"), r: add(mul(num(6), vr("x")), num(-4)) }, reasonId: "given", cites: [] },
      { statement: { k: "cong", l: seg("A", "M"), r: seg("M", "B") }, reasonId: "def-midpoint", cites: [1] },
      { statement: { k: "eq", l: len("A", "M"), r: len("M", "B") }, reasonId: "def-cong-seg", cites: [4] },
      { statement: { k: "eq", l: add(len("A", "M"), len("M", "B")), r: len("A", "B") }, reasonId: "segment-addition", cites: [] },
      { statement: { k: "eq", l: add(len("A", "M"), len("A", "M")), r: num(22) }, reasonId: "substitution", cites: [2, 5, 6] },
      { statement: { k: "eq", l: len("A", "M"), r: num(11) }, reasonId: "division-property", cites: [7] },
      { statement: { k: "eq", l: add(mul(num(6), vr("x")), num(-4)), r: num(11) }, reasonId: "substitution", cites: [3, 8] },
      { statement: { k: "eq", l: mul(num(6), vr("x")), r: num(15) }, reasonId: "addition-property", cites: [9] },
      { statement: { k: "eq", l: vr("x"), r: num(2.5) }, reasonId: "division-property", cites: [10] },
    ],
  },
  {
    id: "supplementary-solve",
    title: "Supplementary, then substitute back",
    prompt:
      "∠A and ∠B are supplementary, m∠A = 16x − 7, m∠B = 21x + 2, and ∠A ≅ ∠C. Prove that m∠C = 73.",
    givens: [
      { k: "supp", a: ang("A"), b: ang("B") },
      { k: "eq", l: m("A"), r: add(mul(num(16), vr("x")), num(-7)) },
      { k: "eq", l: m("B"), r: add(mul(num(21), vr("x")), num(2)) },
      { k: "cong", l: ang("A"), r: ang("C") },
    ],
    goal: { k: "eq", l: m("C"), r: num(73) },
    objects: [ang("A"), ang("B"), ang("C")],
    hints: [
      "Supplementary means the two measures total 180.",
      "Substitute both expressions, solve for x — but x is not the answer.",
      "Put x back to get m∠A, then carry it across the congruence to ∠C.",
    ],
    tags: ["Form A, Q10", "§10"],
    solution: [
      { statement: { k: "supp", a: ang("A"), b: ang("B") }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: m("A"), r: add(mul(num(16), vr("x")), num(-7)) }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: m("B"), r: add(mul(num(21), vr("x")), num(2)) }, reasonId: "given", cites: [] },
      { statement: { k: "cong", l: ang("A"), r: ang("C") }, reasonId: "given", cites: [] },
      { statement: { k: "eq", l: add(m("A"), m("B")), r: num(180) }, reasonId: "def-supplementary", cites: [1] },
      { statement: { k: "eq", l: add(add(mul(num(16), vr("x")), num(-7)), add(mul(num(21), vr("x")), num(2))), r: num(180) }, reasonId: "substitution", cites: [2, 3, 5] },
      { statement: { k: "eq", l: add(mul(num(37), vr("x")), num(-5)), r: num(180) }, reasonId: "simplify", cites: [6] },
      { statement: { k: "eq", l: mul(num(37), vr("x")), r: num(185) }, reasonId: "addition-property", cites: [7] },
      { statement: { k: "eq", l: vr("x"), r: num(5) }, reasonId: "division-property", cites: [8] },
      { statement: { k: "eq", l: m("A"), r: num(73) }, reasonId: "substitution", cites: [2, 9] },
      { statement: { k: "eq", l: m("A"), r: m("C") }, reasonId: "def-cong-ang", cites: [4] },
      { statement: { k: "eq", l: m("C"), r: num(73) }, reasonId: "substitution", cites: [10, 11] },
    ],
  },
  {
    id: "segment-transitive",
    title: "Passing equality along a chain",
    prompt: "Given AB ≅ BC and BC ≅ CD, prove AB ≅ CD.",
    figure: collinear(),
    givens: [
      { k: "cong", l: seg("A", "B"), r: seg("B", "C") },
      { k: "cong", l: seg("B", "C"), r: seg("A", "C") },
    ],
    goal: { k: "cong", l: seg("A", "B"), r: seg("A", "C") },
    objects: [seg("A", "B"), seg("B", "C"), seg("A", "C")],
    hints: ["Two congruences share a middle term. That is the hinge."],
    tags: ["Form A, Q3", "§4"],
    solution: [
      { statement: { k: "cong", l: seg("A", "B"), r: seg("B", "C") }, reasonId: "given", cites: [] },
      { statement: { k: "cong", l: seg("B", "C"), r: seg("A", "C") }, reasonId: "given", cites: [] },
      { statement: { k: "cong", l: seg("A", "B"), r: seg("A", "C") }, reasonId: "transitive", cites: [1, 2] },
    ],
  },
  {
    id: "halves-of-whole",
    title: "Each half is half the whole",
    prompt:
      "M is the midpoint of AB. Prove that AM = AB / 2.",
    figure: midpoint(),
    givens: [{ k: "midpoint", p: "M", seg: seg("A", "B") }],
    goal: { k: "eq", l: len("A", "M"), r: div(len("A", "B"), num(2)) },
    hints: [
      "Start from the congruent halves and the Segment Addition Postulate.",
      "Substituting gives AM + AM = AB; then divide.",
    ],
    tags: ["§6"],
    solution: [
      { statement: { k: "midpoint", p: "M", seg: seg("A", "B") }, reasonId: "given", cites: [] },
      { statement: { k: "cong", l: seg("A", "M"), r: seg("M", "B") }, reasonId: "def-midpoint", cites: [1] },
      { statement: { k: "eq", l: len("A", "M"), r: len("M", "B") }, reasonId: "def-cong-seg", cites: [2] },
      { statement: { k: "eq", l: add(len("A", "M"), len("M", "B")), r: len("A", "B") }, reasonId: "segment-addition", cites: [] },
      { statement: { k: "eq", l: add(len("A", "M"), len("A", "M")), r: len("A", "B") }, reasonId: "substitution", cites: [3, 4] },
      { statement: { k: "eq", l: len("A", "M"), r: div(len("A", "B"), num(2)) }, reasonId: "division-property", cites: [5] },
    ],
  },
];

export const proofById = (id: string) => PROOFS.find((p) => p.id === id);
