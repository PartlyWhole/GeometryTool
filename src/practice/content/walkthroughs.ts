// A stepped explanation of every concept.
//
// Not all of them are geometric: the properties of equality and the logic of
// conditionals are better shown as a ladder of statements than as a picture,
// so a step may carry a figure, a statement, or both. Concepts whose figure
// stays the same across steps rely on the highlight moving instead, which is
// what makes a walkthrough different from a caption.
import type { Role } from "../Figure";
import type { ObjId, Statement } from "../terms";
import { add, ang, div, len, meas, mul, num, pt, seg, vr } from "../terms";

export type WalkStep = {
  /** The sentence for this step. */
  text: string;
  /** A key into LIBRARY. Carried forward from the previous step if omitted. */
  figure?: string;
  /** What to pick out on that figure. */
  marks?: { obj: ObjId; role: Role }[];
  /** A line of algebra or a claim, shown as this step's focus. */
  show?: Statement;
  /**
   * Positional claims this step makes about its figure, checked against the
   * oracle by the test suite. A caption saying "C lies outside AB" over a
   * figure where C sits squarely inside it is the error this catches.
   */
  assert?: { statement: Statement; holds: boolean }[];
};

export type Walkthrough = { conceptId: string; steps: WalkStep[] };

const given = (o: ObjId) => ({ obj: o, role: "given" as Role });
const prove = (o: ObjId) => ({ obj: o, role: "prove" as Role });
const shared = (o: ObjId) => ({ obj: o, role: "shared" as Role });

export const WALKTHROUGHS: Walkthrough[] = [
  // ---------------------------------------------------------------- §5
  {
    conceptId: "point-and-line",
    steps: [
      { text: "A point marks a position on the page. It has no size of its own — only a place.", figure: "justAPoint", marks: [given(pt("P"))] },
      { text: "Mark a second position and there is exactly one straight path through the two. That path is a line.", figure: "aLine", marks: [given(pt("A")), given(pt("B"))] },
      { text: "Naming the two points names the line, so this one is line AB.", marks: [given(seg("A", "B"))] },
      { text: "Everything after this — segments, angles, all of it — is built out of these two." },
    ],
  },
  {
    conceptId: "collinear",
    steps: [
      { text: "One line, and the points that happen to sit on it.", figure: "collinear" },
      { text: "A and C lie on this line. Any two points are collinear — a line can always be drawn through them.", marks: [given(pt("A")), given(pt("C"))] },
      { text: "B lies on it too, so all three are collinear. Three is the first interesting case.", marks: [given(pt("A")), given(pt("B")), given(pt("C"))], assert: [{ statement: { k: "collinear", pts: ["A", "B", "C"] }, holds: true }] },
      { text: "That is why “X, Y and Z are collinear” is only sometimes true: three points may or may not line up." },
    ],
  },

  // ---------------------------------------------------------------- §6
  {
    conceptId: "segment-addition",
    steps: [
      { text: "B lies between A and C. That is the condition everything else rests on.", figure: "collinear", marks: [shared(pt("B"))], assert: [{ statement: { k: "between", p: "B", a: "A", c: "C" }, holds: true }] },
      { text: "AB is one part.", marks: [given(seg("A", "B"))] },
      { text: "BC is the other part.", marks: [given(seg("B", "C"))] },
      { text: "AC is the whole, and the parts make it.", marks: [prove(seg("A", "C"))], show: { k: "eq", l: { k: "add", ts: [{ k: "len", seg: seg("A", "B") }, { k: "len", seg: seg("B", "C") }] }, r: { k: "len", seg: seg("A", "C") } } },
      { text: "Move B outside the segment and the postulate no longer applies: all three are still collinear, but the order is A, C, B, and AB + BC = AC fails.", figure: "notBetween", marks: [shared(pt("B"))], assert: [
          { statement: { k: "collinear", pts: ["A", "B", "C"] }, holds: true },
          { statement: { k: "between", p: "B", a: "A", c: "C" }, holds: false },
        ] },
      { text: "Read backwards it is a subtraction, which is how most questions disguise it: know the whole and one part, and the other part follows." },
    ],
  },
  {
    conceptId: "congruent-segments",
    steps: [
      { text: "Congruence is shown with tick marks, and the marks are the only evidence you have.", figure: "markedPair" },
      { text: "AD and BC both carry two ticks, so AD ≅ BC.", marks: [given(seg("A", "D")), given(seg("B", "C"))], assert: [{ statement: { k: "cong", l: seg("A", "D"), r: seg("B", "C") }, holds: true }] },
      { text: "EB and DF both carry one tick, so EB ≅ DF. One tick matches one tick; two match two.", marks: [given(seg("E", "B")), given(seg("D", "F"))], assert: [{ statement: { k: "cong", l: seg("E", "B"), r: seg("D", "F") }, holds: true }] },
      { text: "Different numbers of ticks say nothing about each other, and EF carries none at all — so nothing in this figure relates it to anything, however the drawing looks.", marks: [prove(seg("E", "F"))] },
      { text: "Congruent segments have equal length: AB ≅ CD means AB = CD. That equality is the door into algebra." },
    ],
  },
  {
    conceptId: "midpoint",
    steps: [
      { text: "One point on a segment is special. Here is what makes it so.", figure: "midpoint" },
      { text: "M lies on AB — that part matters. A point equally far from A and B but off the segment is not a midpoint.", marks: [shared(pt("M"))], assert: [{ statement: { k: "between", p: "M", a: "A", c: "B" }, holds: true }] },
      { text: "The matching ticks say the two halves are congruent.", marks: [given(seg("A", "M")), given(seg("M", "B"))], assert: [{ statement: { k: "midpoint", p: "M", seg: seg("A", "B") }, holds: true }] },
      { text: "So each half is exactly half the whole, which is usually what a question actually wants.", marks: [prove(seg("A", "B"))] },
      { text: "A midpoint is a point. A bisector is a line, ray or segment. Tests blur the two deliberately." },
    ],
  },
  {
    conceptId: "segment-bisector",
    steps: [
      { text: "A midpoint is a point. A bisector is a thing that goes through one — and it can cross at any angle it likes.", figure: "obliqueBisector" },
      { text: "M is the midpoint of AB: the ticks mark the two halves equal.", marks: [shared(pt("M"))], assert: [{ statement: { k: "midpoint", p: "M", seg: seg("A", "B") }, holds: true }] },
      { text: "Line QR passes through M, so it bisects AB — and it crosses at no particular angle. A bisector does not have to be perpendicular.", marks: [given(seg("M", "Q")), given(seg("M", "R"))], assert: [{ statement: { k: "angleClass", ang: ang("AMQ"), cls: "right" }, holds: false }] },
      { text: "Whatever the angle, every bisector gives the same algebraic fact: the two halves are equal.", marks: [prove(seg("A", "M")), prove(seg("M", "B"))] },
      { text: "Tilt it to 90° and you have a perpendicular bisector — a special case. Every perpendicular bisector is a bisector, but not the reverse.", figure: "perpendicular", marks: [given(ang("APQ"))] },
    ],
  },
  {
    conceptId: "perpendicular-bisector",
    steps: [
      { text: "A perpendicular bisector does two jobs at once.", figure: "perpendicular" },
      { text: "It passes through the midpoint, so it halves the segment.", marks: [shared(pt("P"))], assert: [{ statement: { k: "midpoint", p: "P", seg: seg("A", "B") }, holds: true }] },
      { text: "And it meets the segment at 90°, marked by the square.", marks: [given(ang("APQ"))], assert: [{ statement: { k: "angleClass", ang: ang("APQ"), cls: "right" }, holds: true }] },
      { text: "Every perpendicular bisector is a bisector, but not every bisector is perpendicular. The arrow only points one way." },
    ],
  },
  {
    conceptId: "perpendicular",
    steps: [
      { text: "What the small square on a figure actually tells you.", figure: "perpendicular" },
      { text: "PQ meets AB at P, and the small square marks the angle there as 90°.", marks: [given(ang("APQ"))] },
      { text: "That square is not decoration. It is a given fact worth 90°, usable without proof." },
      { text: "The other angle at P is 90° too — but the figure only marks one, and only what is marked may be used.", marks: [prove(ang("QPB"))], assert: [{ statement: { k: "angleClass", ang: ang("QPB"), cls: "right" }, holds: true }] },
    ],
  },

  // ---------------------------------------------------------------- §8
  {
    conceptId: "acute",
    steps: [
      { text: "Angles are classified by measure. These four names cover every angle this module uses.", figure: "angleClasses" },
      { text: "An acute angle measures more than 0° and less than 90°.", marks: [given(ang("APB"))] },
      { text: "Strictly less than 90°. An angle of exactly 90° is right, not acute." },
    ],
  },
  {
    conceptId: "right",
    steps: [
      { text: "Of the four classes, this is the one a figure marks rather than measures.", figure: "angleClasses", marks: [given(ang("CQD"))] },
      { text: "It is drawn with a small square rather than an arc, and that square is a given fact worth 90°." },
      { text: "Two lines that meet at a right angle are perpendicular, and all right angles are congruent to each other." },
    ],
  },
  {
    conceptId: "obtuse",
    steps: [
      { text: "Wider than a right angle — but there is a ceiling, and it is where most of the mistakes happen.", figure: "angleClasses", marks: [given(ang("ERF"))] },
      { text: "Strictly less than 180°. A straight angle exceeds 90° without being obtuse, which is the usual trap." },
      { text: "A triangle can hold at most one of them: two angles above 90° already exceed the 180° a triangle has to spend." },
    ],
  },
  {
    conceptId: "straight",
    steps: [
      { text: "The one that does not look like an angle at all.", figure: "angleClasses", marks: [given(ang("GSH"))] },
      { text: "Its two sides are opposite rays, so it looks like a line — but it is a genuine angle, not a non-angle." },
      { text: "That is the whole trick behind questions like “m∠CXE is ⅝ of m∠FXE”, where the angle named on the right quietly turns out to be straight." },
    ],
  },
  {
    conceptId: "congruent-angles",
    steps: [
      { text: "Congruent angles are shown with matching arcs.", figure: "fan" },
      { text: "∠WVX and ∠YVZ each carry one arc, so they are congruent.", marks: [given(ang("WVX")), given(ang("YVZ"))] },
      { text: "The size of the arc means nothing; the number of arcs is what matches." },
      { text: "Congruent angles have equal measure: ∠A ≅ ∠B means m∠A = m∠B. Use that to turn geometry into algebra, and back again at the end.", show: { k: "eq", l: { k: "meas", ang: ang("WVX") }, r: { k: "meas", ang: ang("YVZ") } } },
    ],
  },
  {
    conceptId: "angle-addition",
    steps: [
      { text: "Three rays from one vertex, with the middle one inside the outer angle.", figure: "numberedCorner" },
      { text: "Ray VB lies in the interior of ∠AVC. That is the condition, and it is easy to skip.", marks: [shared(pt("B"))], assert: [{ statement: { k: "interior", p: "B", ang: ang("AVC") }, holds: true }] },
      { text: "∠1 is one part.", marks: [given(ang("1"))] },
      { text: "∠2 is the other part.", marks: [given(ang("2"))] },
      { text: "∠3 is the whole, and the parts make it.", marks: [prove(ang("3"))], show: { k: "eq", l: { k: "add", ts: [{ k: "meas", ang: ang("1") }, { k: "meas", ang: ang("2") }] }, r: { k: "meas", ang: ang("3") } } },
    ],
  },
  {
    conceptId: "angle-bisector",
    steps: [
      { text: "An interior ray cuts an angle in two. This is the case where the two pieces come out equal.", figure: "bisector" },
      { text: "Ray VD lies inside ∠AVC.", marks: [shared(pt("D"))], assert: [{ statement: { k: "interior", p: "D", ang: ang("AVC") }, holds: true }] },
      { text: "The matching arcs say the two parts are congruent.", marks: [given(ang("AVD")), given(ang("DVC"))] },
      { text: "It is the special case of an interior ray where the parts come out equal — so each half is exactly half the whole, and you can write that as an equation straight away.", marks: [prove(ang("AVC"))] },
    ],
  },
  {
    conceptId: "adjacent",
    steps: [
      { text: "Two angles at one crossing can be related in more than one way. This is the one about touching.", figure: "crossing" },
      { text: "∠1 and ∠2 both have vertex X and share the ray between them.", marks: [given(ang("1")), given(ang("2"))] },
      { text: "Their interiors are separate: neither contains any part of the other." },
      { text: "∠1 and ∠3 are not adjacent. They share the vertex but no side — they face each other instead.", marks: [prove(ang("1")), prove(ang("3"))], assert: [{ statement: { k: "adjacent", a: ang("1"), b: ang("3") }, holds: false }, { statement: { k: "vertical", a: ang("1"), b: ang("3") }, holds: true }] },
      { text: "Adjacent is about touching. Vertical is about facing." },
    ],
  },
  {
    conceptId: "linear-pair",
    steps: [
      { text: "Ray BD stands on line AC.", figure: "linearPair", marks: [shared(pt("D"))] },
      { text: "∠ABD and ∠DBC are adjacent: same vertex, shared side BD.", marks: [given(ang("ABD")), given(ang("DBC"))], assert: [{ statement: { k: "linearPair", a: ang("ABD"), b: ang("DBC") }, holds: true }] },
      { text: "Their outer sides, BA and BC, together form a straight line. That is what makes them a linear pair rather than merely adjacent.", marks: [shared(seg("A", "B")), shared(seg("B", "C"))] },
      { text: "So the two must total 180°. Seeing two angles sit on a line is what licenses writing “= 180”.", show: { k: "eq", l: { k: "add", ts: [{ k: "meas", ang: ang("ABD") }, { k: "meas", ang: ang("DBC") }] }, r: { k: "num", v: 180 } } },
    ],
  },
  {
    conceptId: "vertical-angles",
    steps: [
      { text: "Two lines crossing at X make four angles.", figure: "crossing" },
      { text: "∠1 and ∠3 sit opposite each other. They share the vertex and nothing else.", marks: [given(ang("1")), given(ang("3"))] },
      { text: "What makes them vertical is the rays: each side of ∠1 is the opposite ray of a side of ∠3." },
      { text: "∠2 and ∠4 are the other vertical pair.", marks: [given(ang("2")), given(ang("4"))], assert: [{ statement: { k: "vertical", a: ang("2"), b: ang("4") }, holds: true }] },
      { text: "Vertical angles are always congruent. The proof is three lines long and is worth knowing — see the Vertical Angles Theorem." },
    ],
  },
  {
    conceptId: "supplementary",
    steps: [
      { text: "A relationship between two measures — and, as it turns out, nothing at all about where the angles sit.", figure: "linearPair" },
      { text: "A linear pair is always supplementary, because the outer sides form a line.", marks: [given(ang("ABD")), given(ang("DBC"))] },
      { text: "But supplementary angles need not touch at all. Two angles in different diagrams, on different pages, are supplementary if their measures add to 180°.", figure: "twoSupplementPairs", marks: [given(ang("1")), prove(ang("4"))], assert: [{ statement: { k: "supp", a: ang("1"), b: ang("4") }, holds: true }, { statement: { k: "linearPair", a: ang("1"), b: ang("4") }, holds: false }] },
      { text: "That is why “if ∠F and ∠G are supplementary then m∠F = 90°” is only sometimes true: it holds when both are right angles and fails for 100° and 80°." },
    ],
  },
  {
    conceptId: "complementary",
    steps: [
      { text: "The same idea as supplementary, at 90° instead of 180°.", figure: "complementary" },
      { text: "The square marks ∠AVC as a right angle — 90° in total.", marks: [shared(ang("AVC"))] },
      { text: "Ray VD splits it, so the two parts are complementary.", marks: [given(ang("AVD")), given(ang("DVC"))], assert: [{ statement: { k: "comp", a: ang("AVD"), b: ang("DVC") }, holds: true }] },
      { text: "Here the two sit side by side, but as with supplements neither angle has to be drawn near the other. Only the two measures matter.", show: { k: "eq", l: { k: "add", ts: [{ k: "meas", ang: ang("AVD") }, { k: "meas", ang: ang("DVC") }] }, r: { k: "num", v: 90 } } },
    ],
  },
  {
    conceptId: "angles-around-point",
    steps: [
      { text: "Go once round a vertex and you end up facing the way you started. That is what closes the turn.", figure: "aroundPoint" },
      { text: "∠1, ∠2, ∠3 and ∠4 close the full turn between them.", marks: [given(ang("1")), given(ang("2")), given(ang("3")), given(ang("4"))] },
      { text: "The angles on one side of a straight line total 180° instead — half the turn.", figure: "threeConcurrent", marks: [given(ang("X")), given(ang("Z")), given(ang("Y"))] },
      { text: "Always look for the straight line first. Working round the full 360° gets the same answer and takes twice as long." },
    ],
  },

  // ---------------------------------------------------------------- §4
  {
    conceptId: "reflexive",
    steps: [
      { text: "The reflexive property says a quantity equals itself.", show: { k: "eq", l: vr("a"), r: vr("a") } },
      { text: "It looks like it says nothing, and it is doing real work: it is almost always how a shared part enters a proof.", figure: "fan", marks: [shared(ang("XVY"))] },
      { text: "∠XVY belongs to both of the larger angles — to ∠WVY on one side and to ∠XVZ on the other. Writing m∠XVY = m∠XVY is what lets you add it to both sides of something else.", marks: [given(ang("WVY")), prove(ang("XVZ")), shared(ang("XVY"))], show: { k: "eq", l: meas("XVY"), r: meas("XVY") } },
      { text: "That step is reflexive, never transitive — a confusion test writers plant on purpose." },
    ],
  },
  {
    conceptId: "symmetric",
    steps: [
      { text: "The symmetric property lets you turn an equation round.", show: { k: "eq", l: vr("a"), r: vr("b") } },
      { text: "From a = b you may write b = a.", show: { k: "eq", l: vr("b"), r: vr("a") } },
      { text: "On a figure it is the same move. The ticks here give AD ≅ BC.", figure: "markedPair", marks: [given(seg("A", "D")), given(seg("B", "C"))], assert: [{ statement: { k: "cong", l: seg("A", "D"), r: seg("B", "C") }, holds: true }] },
      { text: "So BC ≅ AD says exactly the same thing. You reach for it when the next line of a proof needs BC on the left.", show: { k: "cong", l: seg("B", "C"), r: seg("A", "D") } },
      { text: "Use it when the piece you want is on the wrong side. It changes nothing except which side things sit on." },
    ],
  },
  {
    conceptId: "transitive",
    steps: [
      { text: "The transitive property passes equality along a chain.", show: { k: "eq", l: len("A", "B"), r: len("B", "C") } },
      { text: "A second equation shares a term with the first.", show: { k: "eq", l: len("B", "C"), r: len("C", "D") } },
      { text: "BC is the hinge: it is the right side of one and the left side of the other.", show: { k: "eq", l: len("A", "B"), r: len("C", "D") } },
      { text: "Here is the same chain on a figure. The ticks give AB ≅ BC and BC ≅ CD.", figure: "fourInARow", marks: [given(seg("A", "B")), shared(seg("B", "C")), given(seg("C", "D"))], assert: [{ statement: { k: "cong", l: seg("A", "B"), r: seg("B", "C") }, holds: true }] },
      { text: "BC is the shared middle, so AB ≅ CD follows — and nobody had to measure AB or CD.", marks: [prove(seg("A", "B")), prove(seg("C", "D"))], assert: [{ statement: { k: "cong", l: seg("A", "B"), r: seg("C", "D") }, holds: true }] },
      { text: "Transitive needs that shared middle term. Substitution does not, which is the difference between them." },
    ],
  },
  {
    conceptId: "addition-property",
    steps: [
      { text: "Adding the same amount to both sides of an equation keeps them equal.", show: { k: "eq", l: add(mul(num(3), vr("x")), num(-12)), r: num(18) } },
      { text: "Add 12 to each side.", show: { k: "eq", l: mul(num(3), vr("x")), r: num(30) } },
      { text: "The geometric version starts from two angles the arcs mark as equal.", figure: "fan", marks: [given(ang("WVX")), given(ang("YVZ"))], assert: [{ statement: { k: "cong", l: ang("WVX"), r: ang("YVZ") }, holds: true }] },
      { text: "∠XVY sits between them, inside both of the larger angles. That is the amount to add to each side.", marks: [shared(ang("XVY"))] },
      { text: "Add it, and the two larger angles come out equal — which is the whole of the proof.", marks: [prove(ang("WVY")), prove(ang("XVZ"))], show: { k: "eq", l: meas("WVY"), r: meas("XVZ") }, assert: [{ statement: { k: "cong", l: ang("WVY"), r: ang("XVZ") }, holds: true }] },
    ],
  },
  {
    conceptId: "subtraction-property",
    steps: [
      { text: "Subtracting the same amount from both sides keeps them equal.", show: { k: "eq", l: add(meas("1"), meas("2")), r: add(meas("2"), meas("3")) } },
      { text: "Take m∠2 from each side and it cancels.", show: { k: "eq", l: meas("1"), r: meas("3") } },
      { text: "Those numbers come off a figure. ∠1 and ∠2 sit on a line, and so do ∠2 and ∠3, so both pairs total 180°.", figure: "crossing", marks: [given(ang("1")), shared(ang("2")), given(ang("3"))] },
      { text: "∠2 is the amount both sides carry. Subtract it and what is left is ∠1 ≅ ∠3.", marks: [prove(ang("1")), prove(ang("3"))], assert: [{ statement: { k: "cong", l: ang("1"), r: ang("3") }, holds: true }] },
      { text: "This is the last move of the Vertical Angles proof, and of every argument that shares a middle quantity and then removes it." },
    ],
  },
  {
    conceptId: "multiplication-property",
    steps: [
      { text: "Multiplying both sides by the same number keeps them equal.", show: { k: "eq", l: div(vr("x"), num(2)), r: num(5) } },
      { text: "Multiply each side by 2.", show: { k: "eq", l: vr("x"), r: num(10) } },
      { text: "On a figure: M is the midpoint of AB, so AM is half of AB.", figure: "midpoint", marks: [shared(pt("M")), given(seg("A", "M"))], assert: [{ statement: { k: "midpoint", p: "M", seg: seg("A", "B") }, holds: true }] },
      { text: "Multiply both sides by 2 and you have the form a proof actually uses: twice the half is the whole.", marks: [prove(seg("A", "B"))], show: { k: "eq", l: mul(num(2), len("A", "M")), r: len("A", "B") } },
      { text: "Use it to clear a fraction: to undo a multiplication by ⅔, multiply by 3/2." },
    ],
  },
  {
    conceptId: "division-property",
    steps: [
      { text: "Dividing both sides by the same nonzero number keeps them equal.", show: { k: "eq", l: mul(num(3), vr("x")), r: num(30) } },
      { text: "Divide each side by 3.", show: { k: "eq", l: vr("x"), r: num(10) } },
      { text: "On a figure: VD bisects ∠AVC, so the whole angle is twice either half.", figure: "bisector", marks: [given(ang("AVD")), given(ang("DVC"))], assert: [{ statement: { k: "cong", l: ang("AVD"), r: ang("DVC") }, holds: true }] },
      { text: "Divide both sides by 2 to get a half on its own — which is the line most bisector proofs need.", marks: [prove(ang("AVD"))], show: { k: "eq", l: meas("AVD"), r: div(meas("AVC"), num(2)) } },
      { text: "It is the last step of most solve-for-x proofs — and finding x is usually the halfway point, not the answer." },
    ],
  },
  {
    conceptId: "substitution",
    steps: [
      { text: "Substitution replaces a quantity with something equal to it.", show: { k: "eq", l: len("A", "B"), r: num(5) } },
      { text: "Here is a second statement containing AB.", show: { k: "eq", l: add(len("A", "B"), len("B", "C")), r: num(12) } },
      { text: "Put 5 where AB stood.", show: { k: "eq", l: add(num(5), len("B", "C")), r: num(12) } },
      { text: "Read that on a figure. Suppose this one comes with AB = 5 and AB + BC = 12.", figure: "collinear", marks: [given(seg("A", "B")), shared(seg("B", "C"))] },
      { text: "Nothing hinges the two statements together — the 5 simply stands in for AB, and BC = 7 falls out.", marks: [prove(seg("B", "C"))], show: { k: "eq", l: len("B", "C"), r: num(7) } },
      { text: "No shared hinge is needed, which is what separates it from the transitive property. The two overlap and either is usually accepted." },
    ],
  },
  {
    conceptId: "distributive",
    steps: [
      { text: "The distributive property clears parentheses.", show: { k: "eq", l: mul(num(3), add(vr("x"), num(-4))), r: num(18) } },
      { text: "Multiply the 3 into each term inside.", show: { k: "eq", l: add(mul(num(3), vr("x")), num(-12)), r: num(18) } },
      { text: "The picture behind it: AD is cut into three congruent parts.", figure: "fourInARow", marks: [given(seg("A", "B")), given(seg("B", "C")), given(seg("C", "D"))], assert: [{ statement: { k: "cong", l: seg("A", "B"), r: seg("B", "C") }, holds: true }] },
      { text: "If each part measures x − 4, then the whole is 3(x − 4) — and counting the same three parts term by term gives 3x − 12. One length, written two ways.", marks: [prove(seg("A", "D"))], show: { k: "eq", l: mul(num(3), add(vr("x"), num(-4))), r: add(mul(num(3), vr("x")), num(-12)) } },
      { text: "Neither side has changed in value — only in form. That is why it needs a name of its own in a proof." },
    ],
  },

  // ---------------------------------------------------------------- §9
  {
    conceptId: "linear-pair-theorem",
    steps: [
      { text: "This is the bridge from something you can see to something you can write down.", figure: "linearPair" },
      { text: "Start from the picture fact. ∠ABD and ∠DBC are adjacent with their outer sides on line AC.", marks: [given(ang("ABD")), given(ang("DBC"))] },
      { text: "The theorem turns that into a number fact.", show: { k: "eq", l: add(meas("ABD"), meas("DBC")), r: num(180) } },
      { text: "It is the bridge you cross whenever a proof moves from “these two sit on a line” to “= 180”." },
    ],
  },
  {
    conceptId: "vertical-angles-theorem",
    steps: [
      { text: "Why must the opposite angles at a crossing be equal? The proof is short, and its shape is the shape of every argument in this module.", figure: "crossing" },
      { text: "∠1 and ∠2 form a linear pair, so they total 180°.", marks: [given(ang("1")), shared(ang("2"))], show: { k: "eq", l: add(meas("1"), meas("2")), r: num(180) }, assert: [{ statement: { k: "linearPair", a: ang("1"), b: ang("2") }, holds: true }] },
      { text: "∠2 and ∠3 form a linear pair too, so they also total 180°.", marks: [shared(ang("2")), given(ang("3"))], show: { k: "eq", l: add(meas("2"), meas("3")), r: num(180) } },
      { text: "Two quantities equal to the same thing are equal to each other.", show: { k: "eq", l: add(meas("1"), meas("2")), r: add(meas("2"), meas("3")) } },
      { text: "Subtract the shared m∠2 and what remains must be equal.", marks: [prove(ang("1")), prove(ang("3"))], show: { k: "eq", l: meas("1"), r: meas("3") }, assert: [{ statement: { k: "cong", l: ang("1"), r: ang("3") }, holds: true }] },
      { text: "No measuring, no special case: it holds for any two crossing lines." },
    ],
  },
  {
    conceptId: "congruent-supplements",
    steps: [
      { text: "Two angles in different places, with nothing in common except what each one is supplementary to.", figure: "twoSupplementPairs" },
      { text: "∠1 and ∠3 sit on a line, so they total 180°.", marks: [given(ang("1")), shared(ang("3"))], show: { k: "eq", l: add(meas("1"), meas("3")), r: num(180) } },
      { text: "∠2 and ∠4 sit on a line too, so they also total 180°.", marks: [given(ang("2")), shared(ang("4"))], show: { k: "eq", l: add(meas("2"), meas("4")), r: num(180) } },
      { text: "The arcs mark ∠3 ≅ ∠4, so the parts being subtracted are equal.", marks: [shared(ang("3")), shared(ang("4"))], assert: [{ statement: { k: "cong", l: ang("3"), r: ang("4") }, holds: true }, { statement: { k: "supp", a: ang("1"), b: ang("3") }, holds: true }] },
      { text: "What is left must be equal: ∠1 ≅ ∠2. Note that these two never touch — being supplements of congruent angles is enough.", marks: [prove(ang("1")), prove(ang("2"))], assert: [{ statement: { k: "cong", l: ang("1"), r: ang("2") }, holds: true }, { statement: { k: "adjacent", a: ang("1"), b: ang("2") }, holds: false }] },
      { text: "It is the vertical-angle argument stated in general. Once you have the theorem you can skip straight to the conclusion." },
    ],
  },
  {
    conceptId: "congruent-complements",
    steps: [
      { text: "The same argument as congruent supplements, run at 90°. Here the two angles sit either side of the one they share.", figure: "congruentComplements" },
      { text: "One square marks ∠AVC as a right angle, so ∠1 and ∠2 total 90°.", marks: [given(ang("1")), shared(ang("2"))], show: { k: "eq", l: add(meas("1"), meas("2")), r: num(90) }, assert: [{ statement: { k: "comp", a: ang("1"), b: ang("2") }, holds: true }] },
      { text: "The other square marks ∠BVD, so ∠2 and ∠3 total 90° as well.", marks: [shared(ang("2")), given(ang("3"))], show: { k: "eq", l: add(meas("2"), meas("3")), r: num(90) } },
      { text: "Both sums equal 90, so they equal each other.", show: { k: "eq", l: add(meas("1"), meas("2")), r: add(meas("2"), meas("3")) } },
      { text: "Subtract the shared m∠2 and ∠1 ≅ ∠3.", marks: [prove(ang("1")), prove(ang("3"))], show: { k: "eq", l: meas("1"), r: meas("3") }, assert: [{ statement: { k: "cong", l: ang("1"), r: ang("3") }, holds: true }, { statement: { k: "vertical", a: ang("1"), b: ang("3") }, holds: false }] },
      { text: "Identical reasoning to congruent supplements, at 90° instead of 180°. Unlike that case, these two are not vertical angles — the conclusion needs this theorem." },
    ],
  },
  {
    conceptId: "right-angle-congruence",
    steps: [
      { text: "Two right angles in different places, with nothing else in common. Must they be equal?", figure: "twoRightAngles" },
      { text: "The square marks ∠1 as 90°.", marks: [given(ang("1"))] },
      { text: "The other square marks ∠2 as 90°, in a different place entirely.", marks: [given(ang("2"))] },
      { text: "Two quantities each equal to 90 are equal to each other, so ∠1 ≅ ∠2.", marks: [prove(ang("1")), prove(ang("2"))], assert: [{ statement: { k: "angleClass", ang: ang("1"), cls: "right" }, holds: true }, { statement: { k: "angleClass", ang: ang("2"), cls: "right" }, holds: true }, { statement: { k: "cong", l: ang("1"), r: ang("2") }, holds: true }] },
      { text: "Trivial once stated — but it is the named reason you cite when a proof needs two right-angle marks to be equal." },
    ],
  },

  // ---------------------------------------------------------------- §2, §3
  {
    conceptId: "inductive",
    steps: [
      { text: "How geometry gets its ideas — and why it can never finish with them." },
      { text: "Measure a linear pair. This one is 130° and 50°, which total 180°.", figure: "linearPairCaseA", marks: [given(ang("ABD")), given(ang("DBC"))], assert: [{ statement: { k: "eq", l: add(meas("ABD"), meas("DBC")), r: num(180) }, holds: true }] },
      { text: "Another, drawn differently: 90° and 90°. Still 180°.", figure: "linearPairCaseB", marks: [given(ang("ABD")), given(ang("DBC"))], assert: [{ statement: { k: "eq", l: add(meas("ABD"), meas("DBC")), r: num(180) }, holds: true }] },
      { text: "A third, at a sharper angle: 35° and 145°. Still 180°.", figure: "linearPairCaseC", marks: [given(ang("ABD")), given(ang("DBC"))], assert: [{ statement: { k: "eq", l: add(meas("ABD"), meas("DBC")), r: num(180) }, holds: true }] },
      { text: "Three cases agree, so you conjecture that every linear pair totals 180°. That is inductive reasoning, and the conjecture happens to be true." },
      { text: "But the three cases are not why it is true. 2, 4, 6, 8 suggests 10 just as strongly, and nothing in those four terms forces it." },
      { text: "Inductive reasoning is how geometry gets its ideas, and never how it finishes an argument. A single counterexample ends a conjecture." },
    ],
  },
  {
    conceptId: "deductive",
    steps: [
      { text: "The other kind of reasoning: no guessing, and no room left for doubt." },
      { text: "Take this crossing. ∠1 and ∠3 are vertical angles — they sit opposite each other at X.", figure: "crossing", marks: [given(ang("1")), given(ang("3"))] },
      { text: "The Vertical Angles Theorem says vertical angles are congruent. Apply it and ∠1 ≅ ∠3 — without measuring either one.", marks: [prove(ang("1")), prove(ang("3"))], show: { k: "cong", l: ang("1"), r: ang("3") }, assert: [{ statement: { k: "cong", l: ang("1"), r: ang("3") }, holds: true }] },
      { text: "And not only here. The conclusion holds for every crossing ever drawn, which is what measuring three examples could never give you." },
      { text: "This is what a proof is made of. Every line of a two-column proof is a deductive step." },
    ],
  },
  {
    conceptId: "syllogism",
    steps: [
      { text: "The Law of Syllogism chains two rules together." },
      { text: "Rule one: if two angles are vertical, then they are congruent.", figure: "crossing", marks: [given(ang("1")), given(ang("3"))] },
      { text: "Rule two: if two angles are congruent, then they have equal measure." },
      { text: "The conclusion of the first is the hypothesis of the second — “congruent” is the shared middle term. Chain them: if two angles are vertical, then they have equal measure.", marks: [prove(ang("1")), prove(ang("3"))], show: { k: "eq", l: meas("1"), r: meas("3") }, assert: [{ statement: { k: "eq", l: meas("1"), r: meas("3") }, holds: true }] },
      { text: "Applied here: ∠1 and ∠3 are vertical, so m∠1 = m∠3, in one move instead of two." },
      { text: "The same move as the transitive property, one level up. Both fail if the middle terms do not match exactly." },
    ],
  },
  {
    conceptId: "proof",
    steps: [
      { text: "The best way to see what a proof is, is to build one. Here is the figure.", figure: "fan" },
      { text: "First read the given, and nothing else. The arcs mark ∠WVX ≅ ∠YVZ. That is everything you have been handed.", marks: [given(ang("WVX")), given(ang("YVZ"))], assert: [{ statement: { k: "cong", l: ang("WVX"), r: ang("YVZ") }, holds: true }] },
      { text: "Now read the goal: prove m∠WVY = m∠XVZ. These are the two larger angles. Fix them in mind as the destination — and never use the goal as a reason for anything.", marks: [prove(ang("WVY")), prove(ang("XVZ"))] },
      { text: "Before writing anything, look for how the given and the goal touch. ∠XVY lies inside both of the larger angles, and it is the only thing they share. That is the bridge.", marks: [shared(ang("XVY"))] },
      { text: "Line 1 is the given itself, written down and labelled Given. Every proof starts by copying out what it was handed.", marks: [given(ang("WVX")), given(ang("YVZ"))], show: { k: "cong", l: ang("WVX"), r: ang("YVZ") } },
      { text: "Line 2 turns the congruence into numbers — Definition of congruent angles. Congruence cannot be added; measures can, and the rest of the proof is arithmetic.", show: { k: "eq", l: meas("WVX"), r: meas("YVZ") } },
      { text: "Line 3 writes the shared piece as equal to itself — Reflexive Property. It looks like it says nothing. It is what licenses adding the same quantity to both sides.", marks: [shared(ang("XVY"))], show: { k: "eq", l: meas("XVY"), r: meas("XVY") } },
      { text: "Line 4 adds it to each side — Addition Property of Equality. The two sums are still equal because equal things were added to equal things.", show: { k: "eq", l: add(meas("WVX"), meas("XVY")), r: add(meas("YVZ"), meas("XVY")) } },
      { text: "Line 5 names each sum for what the figure says it is — Angle Addition Postulate. The left sum is m∠WVY; the right sum is m∠XVZ.", marks: [prove(ang("WVY")), prove(ang("XVZ"))], show: { k: "eq", l: add(meas("WVX"), meas("XVY")), r: meas("WVY") } },
      { text: "Line 6 puts those names into line 4 — Substitution. That is m∠WVY = m∠XVZ, which is the goal, so the proof stops.", show: { k: "eq", l: meas("WVY"), r: meas("XVZ") }, assert: [{ statement: { k: "cong", l: ang("WVY"), r: ang("XVZ") }, holds: true }] },
      { text: "Look back at the shape: turn the given into measures, find the piece both sides share, add it to both, rename the sums. Every line carried a reason, and the thing being proved never appeared as one." },
    ],
  },
];
