// Module 3 walkthroughs. The figures come from library3, whose lines are
// drawn through construction points A1–B1 (top line), A2–B2 (bottom line)
// and T2–T1 (the transversal), with the angles numbered as the reference
// numbers them.
import type { Role } from "../Figure";
import type { Walkthrough } from "./walkthroughs";
import { add, ang, len, line, meas, mul, num, pt, seg, vr, type ObjId, type Statement } from "../terms";

const given = (o: ObjId) => ({ obj: o, role: "given" as Role });
const prove = (o: ObjId) => ({ obj: o, role: "prove" as Role });
const shared = (o: ObjId) => ({ obj: o, role: "shared" as Role });

const top = (n: string) => line("A1", "B1", n);
const bottom = (n: string) => line("A2", "B2", n);
const across = (n: string) => line("T2", "T1", n);
const a = (n: number) => ang(String(n));
const cong = (x: number, y: number): Statement => ({ k: "cong", l: a(x), r: a(y) });
const both = (role: typeof given, ...ns: number[]) => ns.map((n) => role(a(n)));

export const WALKTHROUGHS3: Walkthrough[] = [
  {
    conceptId: "transversal",
    steps: [
      { text: "Two lines, j and k.", figure: "transversalJK", marks: [given(top("j")), given(bottom("k"))] },
      { text: "A third line, t, crosses j at one point and k at another. That makes t a transversal of j and k.", marks: [prove(across("t"))] },
      { text: "Two crossings, four angles at each — eight in all, numbered clockwise from the upper left at each crossing.", marks: [prove(across("t"))] },
      { text: "At either crossing on its own, nothing is new: you already know all four angles from one. What is new is the question of how an angle at one crossing relates to an angle at the other." },
    ],
  },
  {
    conceptId: "interior-exterior",
    steps: [
      { text: "The first question: does the angle open between the two lines, or outside them?", figure: "transversalJK", marks: [given(top("j")), given(bottom("k"))] },
      { text: "∠3, ∠4, ∠5 and ∠6 open into the strip between j and k. They are the interior angles.", marks: both(shared, 3, 4, 5, 6) },
      { text: "∠1, ∠2, ∠7 and ∠8 open outside it — above j or below k. They are the exterior angles.", marks: both(given, 1, 2, 7, 8) },
      { text: "Interior means between the two lines, not inside some shape. Four and four: every angle is one or the other." },
    ],
  },
  {
    conceptId: "alternate-consecutive",
    steps: [
      { text: "The second question: which side of the transversal is the angle on?", figure: "transversalJK", marks: [prove(across("t"))] },
      { text: "∠1, ∠4, ∠5 and ∠8 are left of t.", marks: both(given, 1, 4, 5, 8) },
      { text: "∠2, ∠3, ∠6 and ∠7 are right of it.", marks: both(shared, 2, 3, 6, 7) },
      { text: "Two angles on the same side are consecutive; on opposite sides, alternate. Put the two questions together and four of the five names fall out — interior or exterior, alternate or consecutive. The fifth is the pair in the same corner." },
    ],
  },
  {
    conceptId: "corresponding-angles",
    steps: [
      { text: "∠1 sits above j and left of t.", figure: "transversalJK", marks: [given(a(1))] },
      { text: "∠5 sits in the same corner at the other crossing: above k, left of t.", marks: both(given, 1, 5), assert: [{ statement: { k: "corresponding", a: a(1), b: a(5) }, holds: true }] },
      { text: "Same side of the transversal, and the same side of each line: that is what corresponding means. Slide the top crossing down t and ∠1 lands on ∠5.", marks: [...both(given, 1, 5), shared(across("t"))] },
      { text: "There are four such pairs. ∠3 and ∠7 are another: each below its line, right of t.", marks: both(given, 3, 7), assert: [{ statement: { k: "corresponding", a: a(3), b: a(7) }, holds: true }] },
      { text: "j and k are not parallel, and the pairs are still corresponding. The name is about position, not size — ∠1 and ∠5 here are not even the same size.", marks: both(given, 1, 5), assert: [{ statement: cong(1, 5), holds: false }] },
    ],
  },
  {
    conceptId: "alternate-interior",
    steps: [
      { text: "Take ∠3 and ∠5, one at each crossing.", figure: "transversalJK", marks: both(given, 3, 5), assert: [{ statement: { k: "altInterior", a: a(3), b: a(5) }, holds: true }] },
      { text: "Interior: both open into the strip between j and k.", marks: [...both(given, 3, 5), shared(top("j")), shared(bottom("k"))] },
      { text: "Alternate: one on each side of t.", marks: [...both(given, 3, 5), prove(across("t"))] },
      { text: "The other pair is ∠4 and ∠6.", marks: both(given, 4, 6), assert: [{ statement: { k: "altInterior", a: a(4), b: a(6) }, holds: true }] },
      { text: "∠3 and ∠4 are also between the lines, one each side of t — but they share a vertex and a side. They are a linear pair, which is why the definition says nonadjacent.", marks: both(prove, 3, 4), assert: [{ statement: { k: "linearPair", a: a(3), b: a(4) }, holds: true }, { statement: { k: "altInterior", a: a(3), b: a(4) }, holds: false }] },
    ],
  },
  {
    conceptId: "consecutive-interior",
    steps: [
      { text: "∠4 and ∠5: both between j and k, both left of t.", figure: "transversalJK", marks: both(given, 4, 5), assert: [{ statement: { k: "consInterior", a: a(4), b: a(5) }, holds: true }] },
      { text: "Consecutive means the same side of the transversal.", marks: [...both(given, 4, 5), prove(across("t"))] },
      { text: "∠3 and ∠6 are the other pair, on the right of t.", marks: both(given, 3, 6), assert: [{ statement: { k: "consInterior", a: a(3), b: a(6) }, holds: true }] },
      { text: "On parallel lines the pair looks nothing alike — one acute, one obtuse. That is the first sign of the theorem to come: they total 180°.", figure: "parallelMN", marks: both(given, 3, 6), assert: [{ statement: { k: "supp", a: a(3), b: a(6) }, holds: true }] },
    ],
  },
  {
    conceptId: "alternate-exterior",
    steps: [
      { text: "Take ∠1 and ∠7, one at each crossing.", figure: "transversalJK", marks: both(given, 1, 7), assert: [{ statement: { k: "altExterior", a: a(1), b: a(7) }, holds: true }] },
      { text: "Exterior: above the top line and below the bottom one, never in the strip between.", marks: [...both(given, 1, 7), shared(top("j")), shared(bottom("k"))] },
      { text: "Alternate: on opposite sides of t.", marks: [...both(given, 1, 7), prove(across("t"))] },
      { text: "The other pair is ∠2 and ∠8.", marks: both(given, 2, 8), assert: [{ statement: { k: "altExterior", a: a(2), b: a(8) }, holds: true }] },
    ],
  },
  {
    conceptId: "consecutive-exterior",
    steps: [
      { text: "∠1 and ∠8: both outside the lines, both left of t.", figure: "transversalJK", marks: both(given, 1, 8), assert: [{ statement: { k: "consExterior", a: a(1), b: a(8) }, holds: true }] },
      { text: "The other pair is ∠2 and ∠7, both right of t.", marks: both(given, 2, 7), assert: [{ statement: { k: "consExterior", a: a(2), b: a(7) }, holds: true }] },
      { text: "Against the consecutive interior pair on the same side, ∠4 and ∠5, the only difference is where the angles open: outside the lines, or between them.", marks: [...both(given, 1, 8), ...both(shared, 4, 5)] },
    ],
  },
  {
    conceptId: "parallel-lines",
    steps: [
      { text: "Two lines in one plane that never meet are parallel, written m ∥ n.", figure: "parallelMN", marks: [given(top("m")), given(bottom("n"))], show: { k: "parallel", a: top("m"), b: bottom("n") } },
      { text: "The matching arrowheads are the mark. They do for lines what tick marks do for segments: they are what lets you use the fact.", marks: [given(top("m")), given(bottom("n"))] },
      { text: "These two are drawn parallel and carry no arrowheads. Nothing may be concluded from the look of them.", figure: "parallelUnmarked", marks: [given(top("m")), given(bottom("n"))], assert: [{ statement: { k: "parallel", a: top("m"), b: bottom("n") }, holds: true }] },
      { text: "And these look parallel and are not: they are 4° apart, and would meet far off the page. That is why only the mark counts.", figure: "nearlyParallel", marks: [given(top("m")), given(bottom("n"))], assert: [{ statement: { k: "parallel", a: top("m"), b: bottom("n") }, holds: false }] },
    ],
  },
  {
    conceptId: "corresponding-angles-postulate",
    steps: [
      { text: "m ∥ n, marked, and t crosses both.", figure: "parallelMN", marks: [given(top("m")), given(bottom("n")), shared(across("t"))] },
      { text: "∠1 and ∠5 are corresponding angles.", marks: both(given, 1, 5) },
      { text: "Because m ∥ n, they are congruent.", marks: both(prove, 1, 5), show: cong(1, 5), assert: [{ statement: cong(1, 5), holds: true }] },
      { text: "So is every corresponding pair: ∠2 ≅ ∠6, ∠3 ≅ ∠7 and ∠4 ≅ ∠8.", marks: both(prove, 2, 6), show: cong(2, 6) },
      { text: "It is a postulate: accepted, not proved. The four theorems that follow are each proved from it." },
      { text: "Why accept this one? Any of the five rules could have been the starting point — each follows from any other with one vertical pair or one linear pair. The corresponding pair is chosen because it can be seen: the two crossings are copies of each other, slid along t." },
      { text: "Take away m ∥ n and it says nothing. On these lines ∠1 and ∠5 still correspond, and they are not congruent.", figure: "transversalJK", marks: both(given, 1, 5), assert: [{ statement: cong(1, 5), holds: false }] },
    ],
  },
  {
    conceptId: "alt-interior-theorem",
    steps: [
      { text: "m ∥ n. The claim: the alternate interior angles ∠3 and ∠5 are congruent.", figure: "parallelMN", marks: both(prove, 3, 5) },
      { text: "∠3 and ∠7 correspond, so ∠3 ≅ ∠7 by the Corresponding Angles Postulate.", marks: both(given, 3, 7), show: cong(3, 7) },
      { text: "∠7 and ∠5 are vertical angles, so ∠7 ≅ ∠5.", marks: both(given, 7, 5), show: cong(7, 5), assert: [{ statement: { k: "vertical", a: a(7), b: a(5) }, holds: true }] },
      { text: "Chain the two through ∠7: ∠3 ≅ ∠5, by the Transitive Property.", marks: both(prove, 3, 5), show: cong(3, 5), assert: [{ statement: cong(3, 5), holds: true }] },
      { text: "The same three steps give the other pair, ∠4 ≅ ∠6.", marks: both(prove, 4, 6), show: cong(4, 6) },
      { text: "Where did the proof use m ∥ n? Only in its first step. The vertical-angle step and the chain hold for any two lines — so take the arrowheads away and ∠3 and ∠5 are free to differ, as they do here.", figure: "transversalJK", marks: both(given, 3, 5), assert: [{ statement: cong(3, 5), holds: false }] },
    ],
  },
  {
    conceptId: "cons-interior-theorem",
    steps: [
      { text: "m ∥ n. The claim: the consecutive interior angles ∠4 and ∠5 are supplementary.", figure: "parallelMN", marks: both(prove, 4, 5) },
      { text: "∠5 and ∠1 correspond, so m∠5 = m∠1.", marks: both(given, 5, 1), show: { k: "eq", l: meas("5"), r: meas("1") } },
      { text: "∠1 and ∠4 form a linear pair, so m∠1 + m∠4 = 180.", marks: both(given, 1, 4), show: { k: "eq", l: add(meas("1"), meas("4")), r: num(180) }, assert: [{ statement: { k: "linearPair", a: a(1), b: a(4) }, holds: true }] },
      { text: "Substitute m∠5 for m∠1: m∠5 + m∠4 = 180. They are supplementary.", marks: both(prove, 4, 5), show: { k: "eq", l: add(meas("5"), meas("4")), r: num(180) }, assert: [{ statement: { k: "supp", a: a(4), b: a(5) }, holds: true }] },
      { text: "Supplementary, not congruent: one of the pair is acute and the other obtuse — with one exception." },
      { text: "The exception: when t meets the lines at right angles, both angles are 90°. The pair is then congruent and supplementary at once, and so is every other pair in the figure.", figure: "perpendicularTransversal", marks: both(given, 4, 5), assert: [{ statement: cong(4, 5), holds: true }, { statement: { k: "supp", a: a(4), b: a(5) }, holds: true }] },
    ],
  },
  {
    conceptId: "alt-exterior-theorem",
    steps: [
      { text: "m ∥ n. The claim: the alternate exterior angles ∠1 and ∠7 are congruent.", figure: "parallelMN", marks: both(prove, 1, 7) },
      { text: "∠1 and ∠5 correspond, so ∠1 ≅ ∠5.", marks: both(given, 1, 5), show: cong(1, 5) },
      { text: "∠5 and ∠7 are vertical angles, so ∠5 ≅ ∠7.", marks: both(given, 5, 7), show: cong(5, 7), assert: [{ statement: { k: "vertical", a: a(5), b: a(7) }, holds: true }] },
      { text: "So ∠1 ≅ ∠7 — the same shape of argument as the alternate interior pair.", marks: both(prove, 1, 7), show: cong(1, 7), assert: [{ statement: cong(1, 7), holds: true }] },
    ],
  },
  {
    conceptId: "cons-exterior-theorem",
    steps: [
      { text: "m ∥ n. The claim: the consecutive exterior angles ∠2 and ∠7 are supplementary.", figure: "parallelMN", marks: both(prove, 2, 7) },
      { text: "∠2 and ∠6 correspond, so m∠2 = m∠6.", marks: both(given, 2, 6), show: { k: "eq", l: meas("2"), r: meas("6") } },
      { text: "∠6 and ∠7 form a linear pair, so m∠6 + m∠7 = 180.", marks: both(given, 6, 7), show: { k: "eq", l: add(meas("6"), meas("7")), r: num(180) }, assert: [{ statement: { k: "linearPair", a: a(6), b: a(7) }, holds: true }] },
      { text: "Substitute: m∠2 + m∠7 = 180. They are supplementary.", marks: both(prove, 2, 7), show: { k: "eq", l: add(meas("2"), meas("7")), r: num(180) }, assert: [{ statement: { k: "supp", a: a(2), b: a(7) }, holds: true }] },
      { text: "That is the last of the four theorems — every one the postulate plus a single step you already had. What they say together is simpler than any of them." },
    ],
  },
  {
    conceptId: "flow-proof",
    steps: [
      { text: "The reference proves the Alternate Interior Angles Theorem as a flow proof. Given a ∥ b; prove ∠1 ≅ ∠3.", figure: "flowProof", marks: [given(top("a")), given(bottom("b")), ...both(prove, 1, 3)] },
      { text: "First box: a ∥ b. Nothing points into it, so its reason is Given.", marks: [given(top("a")), given(bottom("b"))], show: { k: "parallel", a: top("a"), b: bottom("b") } },
      { text: "An arrow to ∠1 ≅ ∠2. They are corresponding angles and a ∥ b, so the reason is the Corresponding Angles Postulate.", marks: both(given, 1, 2), show: cong(1, 2), assert: [{ statement: { k: "corresponding", a: a(1), b: a(2) }, holds: true }] },
      { text: "An arrow to ∠2 ≅ ∠3. They are vertical angles: the Vertical Angles Theorem.", marks: both(given, 2, 3), show: cong(2, 3), assert: [{ statement: { k: "vertical", a: a(2), b: a(3) }, holds: true }] },
      { text: "The last box, ∠1 ≅ ∠3, follows from the two boxes before it: the Transitive Property, through the ∠2 they share.", marks: both(prove, 1, 3), show: cong(1, 3), assert: [{ statement: cong(1, 3), holds: true }] },
      { text: "Every arrow reads as “therefore”. Read the chain aloud and it is the two-column proof, one line per box." },
    ],
  },
  // --- Stage 1 ------------------------------------------------------------------
  {
    conceptId: "angles-at-a-crossing",
    steps: [
      { text: "One crossing, four angles. You already know everything about them; here it is as a single tool.", figure: "crossingOneMeasure", marks: [given(a(1))] },
      { text: "∠1 and ∠3 are vertical angles, so ∠3 measures 64° too.", marks: both(given, 1, 3), assert: [{ statement: { k: "vertical", a: a(1), b: a(3) }, holds: true }, { statement: cong(1, 3), holds: true }] },
      { text: "∠1 and ∠2 form a linear pair, so ∠2 = 180° − 64° = 116°, and ∠4, vertical to ∠2, is 116° as well.", marks: [...both(given, 1, 3), ...both(shared, 2, 4)], assert: [{ statement: { k: "supp", a: a(1), b: a(2) }, holds: true }] },
      { text: "Two values, x and 180° − x, and never more. Hold on to that: once two lines are parallel, the same two values reach across to a second crossing." },
    ],
  },
  {
    conceptId: "perpendicular-lines",
    steps: [
      { text: "Two lines, and a square at one of their angles.", figure: "perpendicularLines", marks: [given(a(1))] },
      { text: "The square says ∠1 is a right angle: 90°. The lines are perpendicular, written t ⊥ m.", marks: [given(top("m")), given(across("t"))] },
      { text: "One square is enough. ∠3 is vertical to ∠1, so it is 90°; ∠2 and ∠4 are 180° − 90° = 90°. All four are right.", marks: [...both(given, 1, 3), ...both(shared, 2, 4)], assert: [{ statement: cong(1, 2), holds: true }] },
      { text: "It is the four-angles fact with x = 90°: the only case in which x and 180° − x are the same number." },
    ],
  },
  {
    conceptId: "pythagorean",
    steps: [
      { text: "A right triangle: the square at D marks the right angle.", figure: "rightTriangle", marks: [given(ang("ADC"))] },
      { text: "AD and DC are the legs — the sides that make the right angle. Here they are 4 and 3.", marks: [given(seg("A", "D")), shared(seg("D", "C"))] },
      { text: "AC, opposite the right angle, is the hypotenuse. The theorem says AC² = AD² + DC² = 16 + 9 = 25.", marks: [prove(seg("A", "C"))], show: { k: "eq", l: mul(len("A", "C"), len("A", "C")), r: add(mul(len("A", "D"), len("A", "D")), mul(len("D", "C"), len("D", "C"))) } },
      { text: "Lengths are never negative, so AC = 5. That last step — from equal squares to equal lengths — is the one the Perpendicular Bisector Theorem will need." },
    ],
  },
  {
    conceptId: "reflection",
    steps: [
      { text: "A segment AB, and a line CD through its midpoint at right angles to it.", figure: "reflection", marks: [given(seg("A", "B"))] },
      { text: "Fold the page along CD and A lands exactly on B.", marks: [shared(seg("C", "D"))] },
      { text: "E is on the fold, so the fold carries EA onto EB: they are the same length.", marks: [given(seg("A", "E")), given(seg("B", "E"))], assert: [{ statement: { k: "cong", l: seg("A", "E"), r: seg("B", "E") }, holds: true }] },
      { text: "The same for F, for G, for every point of CD. That is the picture behind the last stage of the module: the fold line is exactly the set of points equally far from A and B.", marks: [given(seg("A", "F")), given(seg("B", "F")), shared(seg("A", "G")), shared(seg("B", "G"))], assert: [{ statement: { k: "cong", l: seg("A", "G"), r: seg("B", "G") }, holds: true }] },
    ],
  },

  // --- Stage 4 ------------------------------------------------------------------
  {
    conceptId: "two-value-rule",
    steps: [
      { text: "Put the five rules together on one figure.", figure: "twoMeasures", marks: [given(a(1))] },
      { text: "∠1 measures 116°. Its vertical partner ∠3, its corresponding angle ∠5, and ∠7 — alternate exterior to ∠1 — all measure 116°.", marks: both(given, 1, 3, 5, 7), assert: [{ statement: cong(1, 7), holds: true }] },
      { text: "Every other angle is 180° − 116° = 64°.", marks: [...both(given, 1, 3, 5, 7), ...both(shared, 2, 4, 6, 8)], assert: [{ statement: { k: "supp", a: a(1), b: a(6) }, holds: true }] },
      { text: "So with parallel lines, every angle is x or 180° − x. The work is never the arithmetic; it is deciding, from where the two angles sit, whether they are in the same family." },
    ],
  },
  {
    conceptId: "angle-equations",
    steps: [
      { text: "m ∥ n, m∠3 = (4x + 12)° and m∠5 = (6x − 20)°. Find m∠5.", figure: "parallelMN", marks: both(given, 3, 5) },
      { text: "First the geometry. ∠3 and ∠5 are between the lines, on opposite sides of t: alternate interior, so they are equal.", marks: both(prove, 3, 5) },
      { text: "Then the algebra: set the two expressions equal.", show: { k: "eq", l: add(mul(num(4), vr("x")), num(12)), r: add(mul(num(6), vr("x")), num(-20)) } },
      { text: "32 = 2x, so x = 16.", show: { k: "eq", l: vr("x"), r: num(16) } },
      { text: "And x was not the question. Substitute back: m∠5 = 6(16) − 20 = 76°. A pair that were consecutive would have meant adding the expressions to 180 instead.", show: { k: "eq", l: meas("5"), r: num(76) } },
    ],
  },

  // --- Stage 5 ------------------------------------------------------------------
  {
    conceptId: "converse",
    steps: [
      { text: "Every rule so far has the same shape: if the lines are parallel, then the angles do something." },
      { text: "Swap the two halves and you have its converse: if the angles do something, then the lines are parallel." },
      { text: "Swapping can turn a true statement false. “If two angles are vertical, they are congruent” is true. Its converse says congruent angles must be vertical — and these two are congruent, and nowhere near each other.", figure: "congruentAnglesPair", marks: [given(ang("AVB")), given(ang("CWD"))] },
      { text: "So a converse has to be earned. For parallel lines, one converse is assumed — the converse of the postulate — and the other four are proved from it, exactly as Lesson 3.1 did going forwards." },
    ],
  },
  {
    conceptId: "converse-cap",
    steps: [
      { text: "Two lines and a transversal — and no arrowheads. Nothing says these lines are parallel.", figure: "givenCorresponding", marks: [given(top("m")), given(bottom("n"))] },
      { text: "But the arcs mark ∠1 ≅ ∠5, and ∠1 and ∠5 are corresponding angles.", marks: both(given, 1, 5), assert: [{ statement: { k: "corresponding", a: a(1), b: a(5) }, holds: true }] },
      { text: "The converse of the postulate turns that into m ∥ n. The angles are the given; the parallel lines are the conclusion.", marks: [prove(top("m")), prove(bottom("n"))], show: { k: "parallel", a: top("m"), b: bottom("n") }, assert: [{ statement: { k: "parallel", a: top("m"), b: bottom("n") }, holds: true }] },
      { text: "Like the forward postulate, it is accepted without proof. It is the root of every test in this lesson." },
    ],
  },
  {
    conceptId: "converse-ait",
    steps: [
      { text: "The arcs mark ∠3 ≅ ∠5, an alternate interior pair. The claim: m ∥ n.", figure: "givenAltInterior", marks: both(given, 3, 5) },
      { text: "∠5 and ∠7 are vertical angles, so ∠5 ≅ ∠7.", marks: both(shared, 5, 7), show: cong(5, 7) },
      { text: "Chain them through ∠5: ∠3 ≅ ∠7. And ∠3 and ∠7 are corresponding angles.", marks: both(prove, 3, 7), show: cong(3, 7), assert: [{ statement: { k: "corresponding", a: a(3), b: a(7) }, holds: true }] },
      { text: "Now the converse of the postulate applies: m ∥ n. The same shape as the forward proof, with every arrow reversed.", marks: [prove(top("m")), prove(bottom("n"))], show: { k: "parallel", a: top("m"), b: bottom("n") } },
    ],
  },
  {
    conceptId: "converse-aet",
    steps: [
      { text: "The arcs mark ∠1 ≅ ∠7, an alternate exterior pair.", figure: "givenAltExterior", marks: both(given, 1, 7) },
      { text: "∠7 and ∠5 are vertical, so ∠7 ≅ ∠5 — and chaining, ∠1 ≅ ∠5.", marks: both(prove, 1, 5), show: cong(1, 5) },
      { text: "∠1 and ∠5 correspond, so the converse of the postulate gives m ∥ n.", marks: [prove(top("m")), prove(bottom("n"))], show: { k: "parallel", a: top("m"), b: bottom("n") } },
    ],
  },
  {
    conceptId: "converse-cit",
    steps: [
      { text: "m∠4 = 64° and m∠5 = 116°: a consecutive interior pair, totalling 180°.", figure: "givenConsInterior", marks: both(given, 4, 5), assert: [{ statement: { k: "supp", a: a(4), b: a(5) }, holds: true }] },
      { text: "∠1 and ∠4 form a linear pair, so they total 180° as well.", marks: both(shared, 1, 4) },
      { text: "∠1 and ∠5 are both supplementary to ∠4, so by the Congruent Supplements Theorem, ∠1 ≅ ∠5.", marks: both(prove, 1, 5), show: cong(1, 5), assert: [{ statement: cong(1, 5), holds: true }] },
      { text: "They correspond, so m ∥ n. Supplementary is what the test needs; two equal consecutive angles would prove nothing — unless both were 90°.", marks: [prove(top("m")), prove(bottom("n"))], show: { k: "parallel", a: top("m"), b: bottom("n") } },
    ],
  },
  {
    conceptId: "converse-cet",
    steps: [
      { text: "m∠1 = 116° and m∠8 = 64°: a consecutive exterior pair, totalling 180°.", figure: "givenConsExterior", marks: both(given, 1, 8) },
      { text: "∠8 and ∠5 form a linear pair, so ∠1 and ∠5 are both supplementary to ∠8.", marks: both(shared, 5, 8) },
      { text: "Congruent supplements: ∠1 ≅ ∠5, corresponding angles — so m ∥ n.", marks: both(prove, 1, 5), show: { k: "parallel", a: top("m"), b: bottom("n") } },
    ],
  },
  {
    conceptId: "parallel-equations",
    steps: [
      { text: "What value of x makes p ∥ q, when the alternate interior angles measure (4x + 2)° and (7x − 43)°?" },
      { text: "Pick the test first. Alternate interior angles prove lines parallel when they are congruent — so the angles must be equal.", show: { k: "eq", l: add(mul(num(4), vr("x")), num(2)), r: add(mul(num(7), vr("x")), num(-43)) } },
      { text: "45 = 3x, so x = 15. At that value both angles are 62°, and the test applies.", show: { k: "eq", l: vr("x"), r: num(15) } },
      { text: "For a consecutive pair the test needs 180° instead: 63° and (9x + 36)° must total 180, so 9x = 81 and x = 9. Setting a consecutive pair equal would give an x that makes nothing parallel." },
    ],
  },
  {
    conceptId: "transitive-parallel",
    steps: [
      { text: "Three lines, a, b and c, all crossed by t. The marks say a ∥ b and b ∥ c.", figure: "threeLines", marks: [given(line("A1", "B1", "a")), given(line("A2", "B2", "b")), given(line("A3", "B3", "c"))] },
      { text: "a ∥ b, so the corresponding angles ∠1 and ∠2 are congruent.", marks: both(given, 1, 2), show: cong(1, 2) },
      { text: "b ∥ c, so ∠2 ≅ ∠3 as well.", marks: both(given, 2, 3), show: cong(2, 3) },
      { text: "Chain them: ∠1 ≅ ∠3 — corresponding angles on a and c — so a ∥ c. The forward postulate twice, then the converse once.", marks: both(prove, 1, 3), show: { k: "parallel", a: line("A1", "B1", "a"), b: line("A3", "B3", "c") }, assert: [{ statement: cong(1, 3), holds: true }] },
    ],
  },
  {
    conceptId: "perp-to-same-line",
    steps: [
      { text: "Two lines, m and n, each marked perpendicular to p.", figure: "twoPerpendiculars", marks: both(given, 1, 5) },
      { text: "∠1 and ∠5 are both right angles, and all right angles are congruent.", marks: both(prove, 1, 5), show: cong(1, 5) },
      { text: "They sit in the same corner of their crossings: corresponding angles. So the converse of the postulate gives m ∥ n.", marks: [prove(top("m")), prove(bottom("n"))], show: { k: "parallel", a: top("m"), b: bottom("n") }, assert: [{ statement: { k: "corresponding", a: a(1), b: a(5) }, holds: true }] },
    ],
  },

  // --- Stage 6 ------------------------------------------------------------------
  {
    conceptId: "parallel-postulate",
    steps: [
      { text: "A line l, and a point P not on it.", figure: "parallelPostulate", marks: [given(line("L1", "L2", "l")), given(pt("P"))] },
      { text: "Through P there are infinitely many lines. Tilt one even slightly and it meets l somewhere — both slanted lines here do.", marks: [shared(line("P", "R1")), shared(line("P", "S1"))] },
      { text: "Exactly one line through P never meets l. The postulate says it exists and that there is only one.", marks: [prove(line("Q1", "Q2"))] },
      { text: "The converses told you when a line is parallel; this tells you that “the parallel through P” names a single line. The construction that follows builds it." },
    ],
  },
  {
    conceptId: "construct-parallel",
    steps: [
      { text: "A line through X and Y, and a point P off it. The task: the line through P parallel to XY.", figure: "constructParallel1", marks: [given(pt("P"))] },
      { text: "Draw a ray from X through P. It makes an angle with XY at X — the angle to copy.", figure: "constructParallel2", marks: [shared(ang("YXP"))] },
      { text: "With the compass at X, draw an arc across both sides of that angle; with the same setting, draw the matching arc at P.", figure: "constructParallel3" },
      { text: "Copy the opening, mark Z, and draw PZ. ∠ZPW is a copy of ∠YXP.", figure: "constructParallel4", marks: [given(ang("YXP")), given(ang("ZPW"))], assert: [{ statement: { k: "cong", l: ang("YXP"), r: ang("ZPW") }, holds: true }] },
      { text: "The two angles are corresponding, and congruent by construction, so the Converse of the Corresponding Angles Postulate says PZ ∥ XY. The Parallel Postulate says it is the only such line — so this is it.", marks: [prove(line("P", "Z")), prove(line("X", "Y"))] },
    ],
  },
  {
    conceptId: "perpendicular-postulate",
    steps: [
      { text: "A line l, and a point P not on it.", figure: "perpendicularPostulate", marks: [given(line("L1", "L2", "l")), given(pt("P"))] },
      { text: "Exactly one line through P meets l at a right angle.", marks: [prove(ang("PFL2"))] },
      { text: "Any other line through P — the slanted one — meets l at some other angle.", marks: [shared(line("P", "R"))] },
      { text: "Its real use is in proofs: it is the licence to draw a perpendicular the figure did not come with. The converse of the Perpendicular Bisector Theorem is proved that way." },
    ],
  },
  {
    conceptId: "perp-transversal-theorem",
    steps: [
      { text: "m ∥ n, and t is marked perpendicular to m at ∠1.", figure: "perpTransversal", marks: [given(a(1))] },
      { text: "∠1 and ∠5 are corresponding angles, and m ∥ n, so ∠5 ≅ ∠1.", marks: both(given, 1, 5), show: cong(1, 5) },
      { text: "So ∠5 is 90° too, and t ⊥ n.", marks: [prove(a(5)), prove(bottom("n"))], show: { k: "perp", a: across("t"), b: bottom("n") }, assert: [{ statement: { k: "perp", a: across("t"), b: bottom("n") }, holds: true }] },
      { text: "It needs nothing but the Corresponding Angles Postulate — so it could have come straight after the postulate. The reference keeps it here, with the other perpendiculars." },
    ],
  },

  // --- Stage 7 ------------------------------------------------------------------
  {
    conceptId: "equidistant",
    steps: [
      { text: "A segment AB, and a point P marked the same distance from both ends.", figure: "equidistantPoint", marks: [given(seg("P", "A")), given(seg("P", "B"))], assert: [{ statement: { k: "cong", l: seg("P", "A"), r: seg("P", "B") }, holds: true }] },
      { text: "The midpoint of AB is one such point. P is another, well above it. There are infinitely many." },
      { text: "The question for this stage: where are all of them? The reflection picture already suggested the answer — on the line that folds A onto B." },
    ],
  },
  {
    conceptId: "perp-bisector-theorem",
    steps: [
      { text: "CD is the perpendicular bisector of AB: the ticks mark AD = DB, and the square marks the right angle.", figure: "perpBisectorTheorem", marks: [given(seg("A", "D")), given(seg("D", "B")), given(ang("ADC"))] },
      { text: "Take any point C on it. Two right triangles appear, △ADC and △BDC, sharing the leg CD.", marks: [shared(seg("C", "D"))] },
      { text: "The Pythagorean Theorem in each: AC² = AD² + CD² and BC² = BD² + CD². AD = BD, so the right-hand sides are equal.", show: { k: "eq", l: mul(len("A", "C"), len("A", "C")), r: mul(len("B", "C"), len("B", "C")) } },
      { text: "So AC² = BC², and since lengths are not negative, AC = BC.", marks: [prove(seg("A", "C")), prove(seg("B", "C"))], assert: [{ statement: { k: "cong", l: seg("A", "C"), r: seg("B", "C") }, holds: true }] },
      { text: "Where did the proof use the right angle? In the Pythagorean Theorem. And the midpoint? In AD = BD. Drop either, and the two triangles no longer match." },
    ],
  },
  {
    conceptId: "converse-perp-bisector",
    steps: [
      { text: "Now the other direction. The ticks mark CA = CB. Must C be on the perpendicular bisector of AB?", figure: "perpBisectorConverse1", marks: [given(seg("C", "A")), given(seg("C", "B"))] },
      { text: "Draw the one perpendicular from C to AB, meeting it at D. The Perpendicular Postulate says it exists, which is what allows adding it.", figure: "perpBisectorConverse2", marks: [shared(seg("C", "D")), given(ang("ADC"))] },
      { text: "Two right triangles again, sharing CD, with hypotenuses CA = CB. Pythagorean Theorem: AD² = CA² − CD² = CB² − CD² = BD².", marks: [given(seg("A", "D")), given(seg("D", "B"))] },
      { text: "So AD = BD: D is the midpoint, CD is the perpendicular bisector, and C is on it.", marks: [prove(seg("A", "D")), prove(seg("D", "B"))], assert: [{ statement: { k: "cong", l: seg("A", "D"), r: seg("D", "B") }, holds: true }] },
      { text: "Together with the theorem: a point is on the perpendicular bisector exactly when it is equidistant from the endpoints. That “exactly when” is what makes the constructions work." },
    ],
  },
  {
    conceptId: "construct-perp-bisector",
    steps: [
      { text: "A segment XY. Set the compass to more than half its length and draw an arc from X.", figure: "constructPerpBisector1", marks: [given(seg("X", "Y"))] },
      { text: "Without changing the setting, draw the same arc from Y. The two arcs cross twice.", figure: "constructPerpBisector2" },
      { text: "Call the crossings A and B and draw line AB.", figure: "constructPerpBisector3", marks: [prove(line("A", "B"))] },
      { text: "Why it works: A is one radius from X and one radius from Y, so it is equidistant from them — by the converse it is on the perpendicular bisector. So is B. Two points fix a line, so AB is the perpendicular bisector, and where it crosses XY is the midpoint." },
    ],
  },
  {
    conceptId: "construct-perp-through-point",
    steps: [
      { text: "A line m and a point P off it. With the compass at P, draw an arc that cuts m at A and B.", figure: "constructPerpThroughPoint1", marks: [given(pt("P"))] },
      { text: "From A and from B, with one setting, draw arcs that cross below m.", figure: "constructPerpThroughPoint2" },
      { text: "Call that crossing Q and draw PQ.", figure: "constructPerpThroughPoint3", marks: [prove(line("P", "Q"))] },
      { text: "P is equidistant from A and B — the first arc made it so — and Q is too. Both lie on the perpendicular bisector of AB, so PQ is that bisector, and PQ ⊥ m." },
    ],
  },
  {
    conceptId: "length-equations",
    steps: [
      { text: "BD ⊥ AC, and the ticks mark AB = BC. AD = x − 8 and DC = 16. Find x.", figure: "bisectorIsosceles", marks: [given(seg("B", "A")), given(seg("B", "C"))] },
      { text: "First the geometry. B is equidistant from A and C, so by the converse it is on the perpendicular bisector of AC — and BD, perpendicular to AC through B, is that bisector. So D is the midpoint.", marks: [given(seg("A", "D")), given(seg("D", "C"))] },
      { text: "Then the algebra: AD = DC.", show: { k: "eq", l: add(vr("x"), num(-8)), r: num(16) } },
      { text: "x = 24. And had the question asked for AD, the answer would be 16, not 24.", show: { k: "eq", l: vr("x"), r: num(24) } },
    ],
  },

];
