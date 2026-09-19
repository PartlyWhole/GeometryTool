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
};

export type Walkthrough = { conceptId: string; steps: WalkStep[] };

const given = (o: ObjId) => ({ obj: o, role: "given" as Role });
const prove = (o: ObjId) => ({ obj: o, role: "prove" as Role });
const shared = (o: ObjId) => ({ obj: o, role: "shared" as Role });

export const WALKTHROUGHS: Walkthrough[] = [
  // ---------------------------------------------------------------- §5
  {
    conceptId: "undefined-terms",
    steps: [
      { text: "Geometry has to start somewhere. Three words are taken as understood and never defined: point, line and plane." },
      { text: "A point has position and no size. It marks a place and nothing else." },
      { text: "A line has length and no width, and runs forever in both directions." },
      { text: "A plane is a flat surface extending forever in every direction." },
      { text: "They are left undefined on purpose. Any definition would have to use words that themselves need defining, so the chain has to stop." },
    ],
  },
  {
    conceptId: "segment-vs-ray",
    steps: [
      { text: "Three objects, three notations. Look at where each one stops.", figure: "segmentRayLine" },
      { text: "AB is a segment. It has two endpoints, so it has a length.", marks: [given(seg("A", "B"))] },
      { text: "Ray CD starts at C and passes through D, carrying on forever that way. Only one end is fixed.", marks: [given(seg("C", "D"))] },
      { text: "Line EF runs forever in both directions. Neither end stops.", marks: [given(seg("E", "F"))] },
      { text: "Only the segment has a length. And a ray may not be renamed backwards: ray CD and ray DC point opposite ways." },
    ],
  },
  {
    conceptId: "collinear",
    steps: [
      { text: "Points are collinear when one line passes through all of them.", figure: "collinear" },
      { text: "A and C lie on this line. Any two points are collinear — a line can always be drawn through them.", marks: [given(pt("A")), given(pt("C"))] },
      { text: "B lies on it too, so all three are collinear. Three is the first interesting case.", marks: [given(pt("A")), given(pt("B")), given(pt("C"))] },
      { text: "That is why “X, Y and Z are collinear” is only sometimes true: three points may or may not line up." },
    ],
  },
  {
    conceptId: "coplanar",
    steps: [
      { text: "Points are coplanar when one flat surface contains all of them." },
      { text: "Any three points are coplanar. However they are placed, some plane passes through all three." },
      { text: "Four is the first number that can fail — the fourth point may sit off the plane the first three fix." },
      { text: "Two distinct planes that meet at all meet in a line, never in a single point. That one feels wrong at first and is worth remembering." },
    ],
  },
  {
    conceptId: "between",
    steps: [
      { text: "B is between A and C only if all three are collinear and B lies on AC.", figure: "collinear" },
      { text: "Here B sits on the segment from A to C, with A and C on either side of it.", marks: [shared(pt("B")), given(pt("A")), given(pt("C"))] },
      { text: "Collinearity alone is not enough. These three are still collinear, but C now lies outside AB.", figure: "notBetween", marks: [given(pt("A")), given(pt("B")), shared(pt("C"))] },
      { text: "Betweenness is the hidden condition on the Segment Addition Postulate. Forgetting it is the source of most counterexample questions." },
    ],
  },

  // ---------------------------------------------------------------- §6
  {
    conceptId: "segment-addition",
    steps: [
      { text: "B lies between A and C. That is the condition everything else rests on.", figure: "collinear", marks: [shared(pt("B"))] },
      { text: "AB is one part.", marks: [given(seg("A", "B"))] },
      { text: "BC is the other part.", marks: [given(seg("B", "C"))] },
      { text: "AC is the whole, and the parts make it.", marks: [prove(seg("A", "C"))], show: { k: "eq", l: { k: "add", ts: [{ k: "len", seg: seg("A", "B") }, { k: "len", seg: seg("B", "C") }] }, r: { k: "len", seg: seg("A", "C") } } },
      { text: "Read backwards it is a subtraction, which is how most questions disguise it: know the whole and one part, and the other part follows." },
    ],
  },
  {
    conceptId: "congruent-segments",
    steps: [
      { text: "Congruence is shown with tick marks, and the marks are the only evidence you have.", figure: "markedPair" },
      { text: "AD and BC both carry two ticks, so AD ≅ BC.", marks: [given(seg("A", "D")), given(seg("B", "C"))] },
      { text: "EB and DF both carry one tick, so EB ≅ DF. One tick matches one tick; two match two.", marks: [given(seg("E", "B")), given(seg("D", "F"))] },
      { text: "Different numbers of ticks say nothing about each other, and EF carries none at all — so nothing in this figure relates it to anything, however the drawing looks.", marks: [prove(seg("E", "F"))] },
      { text: "Congruent segments have equal length: AB ≅ CD means AB = CD. That equality is the door into algebra." },
    ],
  },
  {
    conceptId: "midpoint",
    steps: [
      { text: "A midpoint is a point that divides a segment into two congruent halves.", figure: "midpoint" },
      { text: "M lies on AB — that part matters. A point equally far from A and B but off the segment is not a midpoint.", marks: [shared(pt("M"))] },
      { text: "The matching ticks say the two halves are congruent.", marks: [given(seg("A", "M")), given(seg("M", "B"))] },
      { text: "So each half is exactly half the whole, which is usually what a question actually wants.", marks: [prove(seg("A", "B"))] },
      { text: "A midpoint is a point. A bisector is a line, ray or segment. Tests blur the two deliberately." },
    ],
  },
  {
    conceptId: "segment-bisector",
    steps: [
      { text: "A segment bisector is any line, ray or segment passing through the midpoint of a segment.", figure: "perpendicular" },
      { text: "P is the midpoint of AB.", marks: [shared(pt("P"))] },
      { text: "PQ passes through it, so PQ bisects AB. It need not be perpendicular to do that.", marks: [given(seg("P", "Q"))] },
      { text: "Every bisector gives you the same algebraic fact: the two halves are equal.", marks: [prove(seg("A", "P")), prove(seg("P", "B"))] },
    ],
  },
  {
    conceptId: "perpendicular-bisector",
    steps: [
      { text: "A perpendicular bisector does two jobs at once.", figure: "perpendicular" },
      { text: "It passes through the midpoint, so it halves the segment.", marks: [shared(pt("P"))] },
      { text: "And it meets the segment at 90°, marked by the square.", marks: [given(ang("APQ"))] },
      { text: "Every perpendicular bisector is a bisector, but not every bisector is perpendicular. The arrow only points one way." },
    ],
  },
  {
    conceptId: "perpendicular",
    steps: [
      { text: "Two lines, rays or segments are perpendicular when they meet at right angles.", figure: "perpendicular" },
      { text: "PQ meets AB at P, and the small square marks the angle there as 90°.", marks: [given(ang("APQ"))] },
      { text: "That square is not decoration. It is a given fact worth 90°, usable without proof." },
      { text: "The other angle at P is 90° too — but the figure only marks one, and only what is marked may be used.", marks: [prove(ang("QPB"))] },
    ],
  },

  // ---------------------------------------------------------------- §8
  {
    conceptId: "acute",
    steps: [
      { text: "Angles are classified by measure. Four names cover every case.", figure: "angleClasses" },
      { text: "An acute angle measures more than 0° and less than 90°.", marks: [given(ang("APB"))] },
      { text: "Strictly less than 90°. An angle of exactly 90° is right, not acute." },
    ],
  },
  {
    conceptId: "right",
    steps: [
      { text: "A right angle measures exactly 90°.", figure: "angleClasses", marks: [given(ang("CQD"))] },
      { text: "It is drawn with a small square rather than an arc, and that square is a given fact worth 90°." },
      { text: "Two lines that meet at a right angle are perpendicular, and all right angles are congruent to each other." },
    ],
  },
  {
    conceptId: "obtuse",
    steps: [
      { text: "An obtuse angle measures more than 90° and less than 180°.", figure: "angleClasses", marks: [given(ang("ERF"))] },
      { text: "Strictly less than 180°. A straight angle exceeds 90° without being obtuse, which is the usual trap." },
      { text: "A triangle can hold at most one of them: two angles above 90° already exceed the 180° a triangle has to spend." },
    ],
  },
  {
    conceptId: "straight",
    steps: [
      { text: "A straight angle measures exactly 180°.", figure: "angleClasses", marks: [given(ang("GSH"))] },
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
      { text: "Ray VB lies in the interior of ∠AVC. That is the condition, and it is easy to skip.", marks: [shared(pt("B"))] },
      { text: "∠1 is one part.", marks: [given(ang("1"))] },
      { text: "∠2 is the other part.", marks: [given(ang("2"))] },
      { text: "∠3 is the whole, and the parts make it.", marks: [prove(ang("3"))], show: { k: "eq", l: { k: "add", ts: [{ k: "meas", ang: ang("1") }, { k: "meas", ang: ang("2") }] }, r: { k: "meas", ang: ang("3") } } },
    ],
  },
  {
    conceptId: "angle-bisector",
    steps: [
      { text: "An angle bisector is a ray that splits an angle into two congruent angles.", figure: "bisector" },
      { text: "Ray VD lies inside ∠AVC.", marks: [shared(pt("D"))] },
      { text: "The matching arcs say the two parts are congruent.", marks: [given(ang("AVD")), given(ang("DVC"))] },
      { text: "It is the special case of an interior ray where the parts come out equal — so each half is exactly half the whole, and you can write that as an equation straight away.", marks: [prove(ang("AVC"))] },
    ],
  },
  {
    conceptId: "adjacent",
    steps: [
      { text: "Adjacent angles share a vertex and a side, and do not overlap.", figure: "crossing" },
      { text: "∠1 and ∠2 both have vertex X and share the ray between them.", marks: [given(ang("1")), given(ang("2"))] },
      { text: "Their interiors are separate: neither contains any part of the other." },
      { text: "∠1 and ∠3 are not adjacent. They share the vertex but no side — they face each other instead.", marks: [prove(ang("1")), prove(ang("3"))] },
      { text: "Adjacent is about touching. Vertical is about facing." },
    ],
  },
  {
    conceptId: "linear-pair",
    steps: [
      { text: "Ray BD stands on line AC.", figure: "linearPair", marks: [shared(pt("D"))] },
      { text: "∠ABD and ∠DBC are adjacent: same vertex, shared side BD.", marks: [given(ang("ABD")), given(ang("DBC"))] },
      { text: "Their outer sides, BA and BC, together form a straight line. That is what makes them a linear pair rather than merely adjacent.", marks: [shared(pt("A")), shared(pt("C"))] },
      { text: "So the two must total 180°. Seeing two angles sit on a line is what licenses writing “= 180”.", show: { k: "eq", l: { k: "add", ts: [{ k: "meas", ang: ang("ABD") }, { k: "meas", ang: ang("DBC") }] }, r: { k: "num", v: 180 } } },
    ],
  },
  {
    conceptId: "vertical-angles",
    steps: [
      { text: "Two lines crossing at X make four angles.", figure: "crossing" },
      { text: "∠1 and ∠3 sit opposite each other. They share the vertex and nothing else.", marks: [given(ang("1")), given(ang("3"))] },
      { text: "What makes them vertical is the rays: each side of ∠1 is the opposite ray of a side of ∠3." },
      { text: "∠2 and ∠4 are the other vertical pair.", marks: [given(ang("2")), given(ang("4"))] },
      { text: "Vertical angles are always congruent. The proof is three lines long and is worth knowing — see the Vertical Angles Theorem." },
    ],
  },
  {
    conceptId: "supplementary",
    steps: [
      { text: "Two angles are supplementary when their measures total 180°.", figure: "linearPair" },
      { text: "A linear pair is always supplementary, because the outer sides form a line.", marks: [given(ang("ABD")), given(ang("DBC"))] },
      { text: "But supplementary angles need not touch at all. Two angles in different diagrams, on different pages, are supplementary if their measures add to 180°.", figure: "twoSupplementPairs", marks: [given(ang("1")), prove(ang("4"))] },
      { text: "That is why “if ∠F and ∠G are supplementary then m∠F = 90°” is only sometimes true: it holds when both are right angles and fails for 100° and 80°." },
    ],
  },
  {
    conceptId: "complementary",
    steps: [
      { text: "Two angles are complementary when their measures total 90°.", figure: "complementary" },
      { text: "The square marks ∠AVC as a right angle — 90° in total.", marks: [shared(ang("AVC"))] },
      { text: "Ray VD splits it, so the two parts are complementary.", marks: [given(ang("AVD")), given(ang("DVC"))] },
      { text: "As with supplements, neither angle has to be drawn near the other. Only the two measures matter.", show: { k: "eq", l: { k: "add", ts: [{ k: "meas", ang: ang("AVD") }, { k: "meas", ang: ang("DVC") }] }, r: { k: "num", v: 90 } } },
    ],
  },
  {
    conceptId: "angles-around-point",
    steps: [
      { text: "All the angles at a shared vertex, taken once around, total 360°.", figure: "aroundPoint" },
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
      { text: "∠XVY belongs to both of the larger angles. Writing m∠XVY = m∠XVY is what lets you add it to both sides of something else.", show: { k: "eq", l: meas("XVY"), r: meas("XVY") } },
      { text: "That step is reflexive, never transitive — a confusion test writers plant on purpose." },
    ],
  },
  {
    conceptId: "symmetric",
    steps: [
      { text: "The symmetric property lets you turn an equation round.", show: { k: "eq", l: vr("a"), r: vr("b") } },
      { text: "From a = b you may write b = a.", show: { k: "eq", l: vr("b"), r: vr("a") } },
      { text: "Use it when the piece you want is on the wrong side. It changes nothing except which side things sit on." },
    ],
  },
  {
    conceptId: "transitive",
    steps: [
      { text: "The transitive property passes equality along a chain.", show: { k: "eq", l: len("A", "B"), r: len("B", "C") } },
      { text: "A second equation shares a term with the first.", show: { k: "eq", l: len("B", "C"), r: len("C", "D") } },
      { text: "BC is the hinge: it is the right side of one and the left side of the other.", show: { k: "eq", l: len("A", "B"), r: len("C", "D") } },
      { text: "Transitive needs that shared middle term. Substitution does not, which is the difference between them." },
    ],
  },
  {
    conceptId: "addition-property",
    steps: [
      { text: "Adding the same amount to both sides of an equation keeps them equal.", show: { k: "eq", l: add(mul(num(3), vr("x")), num(-12)), r: num(18) } },
      { text: "Add 12 to each side.", show: { k: "eq", l: mul(num(3), vr("x")), r: num(30) } },
      { text: "In a geometry proof the same move is how a shared angle joins two equal quantities: add m∠XVY to both sides and they stay equal." },
    ],
  },
  {
    conceptId: "subtraction-property",
    steps: [
      { text: "Subtracting the same amount from both sides keeps them equal.", show: { k: "eq", l: add(meas("1"), meas("2")), r: add(meas("2"), meas("3")) } },
      { text: "Take m∠2 from each side and it cancels.", show: { k: "eq", l: meas("1"), r: meas("3") } },
      { text: "This is the last move of the Vertical Angles proof, and of every argument that shares a middle quantity and then removes it." },
    ],
  },
  {
    conceptId: "multiplication-property",
    steps: [
      { text: "Multiplying both sides by the same number keeps them equal.", show: { k: "eq", l: div(vr("x"), num(2)), r: num(5) } },
      { text: "Multiply each side by 2.", show: { k: "eq", l: vr("x"), r: num(10) } },
      { text: "Use it to clear a fraction: to undo a multiplication by ⅔, multiply by 3/2." },
    ],
  },
  {
    conceptId: "division-property",
    steps: [
      { text: "Dividing both sides by the same nonzero number keeps them equal.", show: { k: "eq", l: mul(num(3), vr("x")), r: num(30) } },
      { text: "Divide each side by 3.", show: { k: "eq", l: vr("x"), r: num(10) } },
      { text: "It is the last step of most solve-for-x proofs — and finding x is usually the halfway point, not the answer." },
    ],
  },
  {
    conceptId: "substitution",
    steps: [
      { text: "Substitution replaces a quantity with something equal to it.", show: { k: "eq", l: len("A", "B"), r: num(5) } },
      { text: "Here is a second statement containing AB.", show: { k: "eq", l: add(len("A", "B"), len("B", "C")), r: num(12) } },
      { text: "Put 5 where AB stood.", show: { k: "eq", l: add(num(5), len("B", "C")), r: num(12) } },
      { text: "No shared hinge is needed, which is what separates it from the transitive property. The two overlap and either is usually accepted." },
    ],
  },
  {
    conceptId: "distributive",
    steps: [
      { text: "The distributive property clears parentheses.", show: { k: "eq", l: mul(num(3), add(vr("x"), num(-4))), r: num(18) } },
      { text: "Multiply the 3 into each term inside.", show: { k: "eq", l: add(mul(num(3), vr("x")), num(-12)), r: num(18) } },
      { text: "Neither side has changed in value — only in form. That is why it needs a name of its own in a proof." },
    ],
  },

  // ---------------------------------------------------------------- §9
  {
    conceptId: "linear-pair-theorem",
    steps: [
      { text: "The theorem: if two angles form a linear pair, they are supplementary.", figure: "linearPair" },
      { text: "Start from the picture fact. ∠ABD and ∠DBC are adjacent with their outer sides on line AC.", marks: [given(ang("ABD")), given(ang("DBC"))] },
      { text: "The theorem turns that into a number fact.", show: { k: "eq", l: add(meas("ABD"), meas("DBC")), r: num(180) } },
      { text: "It is the bridge you cross whenever a proof moves from “these two sit on a line” to “= 180”." },
    ],
  },
  {
    conceptId: "vertical-angles-theorem",
    steps: [
      { text: "The theorem: vertical angles are congruent. The proof is three real lines, and it is the shape of every argument in this module.", figure: "crossing" },
      { text: "∠1 and ∠2 form a linear pair, so they total 180°.", marks: [given(ang("1")), shared(ang("2"))], show: { k: "eq", l: add(meas("1"), meas("2")), r: num(180) } },
      { text: "∠2 and ∠3 form a linear pair too, so they also total 180°.", marks: [shared(ang("2")), given(ang("3"))], show: { k: "eq", l: add(meas("2"), meas("3")), r: num(180) } },
      { text: "Two quantities equal to the same thing are equal to each other.", show: { k: "eq", l: add(meas("1"), meas("2")), r: add(meas("2"), meas("3")) } },
      { text: "Subtract the shared m∠2 and what remains must be equal.", marks: [prove(ang("1")), prove(ang("3"))], show: { k: "eq", l: meas("1"), r: meas("3") } },
      { text: "No measuring, no special case: it holds for any two crossing lines." },
    ],
  },
  {
    conceptId: "congruent-supplements",
    steps: [
      { text: "The theorem: angles supplementary to the same angle — or to congruent angles — are congruent.", figure: "twoSupplementPairs" },
      { text: "∠1 and ∠3 sit on a line, so they total 180°.", marks: [given(ang("1")), shared(ang("3"))] },
      { text: "∠2 and ∠4 sit on a line too, so they also total 180°.", marks: [given(ang("2")), shared(ang("4"))] },
      { text: "The arcs mark ∠3 ≅ ∠4, so the parts being subtracted are equal.", marks: [shared(ang("3")), shared(ang("4"))] },
      { text: "What is left must be equal: ∠1 ≅ ∠2. Note that these two never touch — being supplements of congruent angles is enough.", marks: [prove(ang("1")), prove(ang("2"))] },
      { text: "It is the vertical-angle argument stated in general. Once you have the theorem you can skip straight to the conclusion." },
    ],
  },
  {
    conceptId: "congruent-complements",
    steps: [
      { text: "The theorem: angles complementary to the same angle — or to congruent angles — are congruent.", figure: "congruentComplements" },
      { text: "One square marks ∠AVC as a right angle, so ∠1 and ∠2 total 90°.", marks: [given(ang("1")), shared(ang("2"))], show: { k: "eq", l: add(meas("1"), meas("2")), r: num(90) } },
      { text: "The other square marks ∠BVD, so ∠2 and ∠3 total 90° as well.", marks: [shared(ang("2")), given(ang("3"))], show: { k: "eq", l: add(meas("2"), meas("3")), r: num(90) } },
      { text: "Both sums equal 90, so they equal each other.", show: { k: "eq", l: add(meas("1"), meas("2")), r: add(meas("2"), meas("3")) } },
      { text: "Subtract the shared m∠2 and ∠1 ≅ ∠3.", marks: [prove(ang("1")), prove(ang("3"))], show: { k: "eq", l: meas("1"), r: meas("3") } },
      { text: "Identical reasoning to congruent supplements, at 90° instead of 180°. Unlike that case, these two are not vertical angles — the conclusion needs this theorem." },
    ],
  },
  {
    conceptId: "right-angle-congruence",
    steps: [
      { text: "The theorem: all right angles are congruent.", figure: "twoRightAngles" },
      { text: "The square marks ∠1 as 90°.", marks: [given(ang("1"))] },
      { text: "The other square marks ∠2 as 90°, in a different place entirely.", marks: [given(ang("2"))] },
      { text: "Two quantities each equal to 90 are equal to each other, so ∠1 ≅ ∠2.", marks: [prove(ang("1")), prove(ang("2"))] },
      { text: "Trivial once stated — but it is the named reason you cite when a proof needs two right-angle marks to be equal." },
    ],
  },

  // ---------------------------------------------------------------- §2, §3
  {
    conceptId: "inductive",
    steps: [
      { text: "Inductive reasoning notices a pattern in examples and predicts what comes next." },
      { text: "2, 4, 6, 8 suggests 10 — and it usually is 10." },
      { text: "But nothing in the first four terms forces it. What you get is a conjecture: plausible, not guaranteed." },
      { text: "It is how geometry gets its ideas, and never how geometry finishes an argument. A single counterexample ends a conjecture." },
    ],
  },
  {
    conceptId: "deductive",
    steps: [
      { text: "Deductive reasoning derives a conclusion from accepted facts by logic alone." },
      { text: "If the facts you start from are true and the logic is valid, the conclusion is certain — not likely, certain." },
      { text: "This is what a proof is made of. Every line of a two-column proof is a deductive step." },
      { text: "Two named patterns get tested directly: the Law of Detachment and the Law of Syllogism." },
    ],
  },
  {
    conceptId: "detachment",
    steps: [
      { text: "The Law of Detachment fires a single rule." },
      { text: "You have a conditional: if two angles form a linear pair, then they are supplementary." },
      { text: "And you have a case that satisfies its hypothesis: ∠ABD and ∠DBC form a linear pair.", figure: "linearPair", marks: [given(ang("ABD")), given(ang("DBC"))] },
      { text: "The conclusion detaches: they are supplementary." },
      { text: "It fails if the case does not actually satisfy the hypothesis — which is why checking the hypothesis is the whole job." },
    ],
  },
  {
    conceptId: "syllogism",
    steps: [
      { text: "The Law of Syllogism chains two rules together." },
      { text: "If two angles are vertical, then they are congruent." },
      { text: "If two angles are congruent, then they have equal measure." },
      { text: "The shared middle term links them: if two angles are vertical, then they have equal measure." },
      { text: "The same move as the transitive property, one level up. Both fail if the middle terms do not match exactly." },
    ],
  },
  {
    conceptId: "proof",
    steps: [
      { text: "A proof is a chain of statements, each justified by a definition, postulate, theorem or property, leading from the given to the conclusion." },
      { text: "Two rules govern every format. First: every statement carries a reason." },
      { text: "Second: the thing you are proving may never appear as a reason. That is circular, and it is the error most “find the mistake” questions plant." },
      { text: "The given is what you may assume. A diagram contributes too, but only what is marked — tick marks, right-angle squares and points drawn on a line. “It looks about equal” is not evidence." },
      { text: "Two-column, paragraph and flowchart are three ways of writing the same argument. Nothing may be skipped in any of them." },
    ],
  },
];
