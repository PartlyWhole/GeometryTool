// Figures from the Module 2 reference, built once and shared by the exercises.
import type { Board } from "../../model";
import { fig, polar } from "./figures";

/** Fig. 14: two lines crossing at X, the four angles numbered. */
export const crossing = (): Board =>
  fig("Crossing lines")
    .at("A", -140, -34).at("B", 140, 34)
    .at("C", -120, 78).at("D", 120, -78)
    .seg("A", "B").seg("C", "D")
    .cross("X", ["A", "B"], ["C", "D"])
    .num("1", "AXD")
    .num("2", "AXC")
    .num("3", "CXB")
    .num("4", "BXD")
    .build();

/** Fig. 1 and Fig. 5: four rays from V with a shared middle angle. */
export const fan = (): Board => {
  const f = fig("Shared middle angle");
  f.at("V", 0, 60);
  for (const [label, deg] of [["W", 152], ["X", 112], ["Y", 68], ["Z", 28]] as [string, number][]) {
    const p = polar(0, 60, deg, 150);
    f.at(label, p.x, p.y);
  }
  ["W", "X", "Y", "Z"].forEach((l) => f.seg("V", l));
  f.arc("WVX", "YVZ");
  return f.build();
};

/** Three collinear points, B between A and C. */
export const collinear = (): Board =>
  fig("Collinear points")
    .at("A", -150, 0).at("C", 150, 0)
    .seg("A", "C")
    .on("B", "A", "C", 0.42)
    .build();

/** Fig. 3, second row: B outside AC, the counterexample arrangement. */
export const notBetween = (): Board =>
  fig("B outside AC")
    .at("A", -150, 0).at("B", 170, 0)
    .seg("A", "B")
    .on("C", "A", "B", 0.55)
    .build();

/** Fig. 9: M the midpoint of AB, halves ticked. */
export const midpoint = (): Board =>
  fig("Midpoint")
    .at("A", -150, 0).at("B", 150, 0)
    .seg("A", "B")
    .on("M", "A", "B", 0.5)
    .tick(["A", "M"], ["M", "B"])
    .build();

/** Fig. 13 right: ray VD bisecting ∠AVC, halves arced. */
export const bisector = (): Board => {
  const f = fig("Angle bisector");
  f.at("V", 0, 70);
  for (const [l, d] of [["A", 128], ["D", 90], ["C", 52]] as [string, number][]) {
    const p = polar(0, 70, d, 150);
    f.at(l, p.x, p.y);
  }
  ["A", "D", "C"].forEach((l) => f.seg("V", l));
  f.arc("AVD", "DVC");
  return f.build();
};

/** Fig. 15 left: a linear pair on line AC with ray BD standing on it. */
export const linearPair = (): Board => {
  const f = fig("Linear pair");
  f.at("A", -160, 0).at("C", 160, 0);
  f.seg("A", "C");
  f.on("B", "A", "C", 0.5);
  const d = polar(0, 0, 65, 150);
  f.at("D", d.x, d.y);
  f.seg("B", "D");
  return f.build();
};

/** Fig. 15 right: a right angle split into two complementary parts. */
export const complementary = (): Board => {
  const f = fig("Complementary angles");
  f.at("V", 0, 80);
  for (const [l, d] of [["A", 90], ["D", 55], ["C", 0]] as [string, number][]) {
    const p = polar(0, 80, d, 150);
    f.at(l, p.x, p.y);
  }
  ["A", "D", "C"].forEach((l) => f.seg("V", l));
  f.right("AVC");
  return f.build();
};

/** Fig. 16: three consecutive angles sharing one straight line. */
export const threeOnLine = (): Board => {
  const f = fig("Angles on a line");
  f.at("P", -170, 0).at("Q", 170, 0);
  f.seg("P", "Q");
  f.on("V", "P", "Q", 0.5);
  for (const [l, d] of [["R", 120], ["S", 60]] as [string, number][]) {
    const p = polar(0, 0, d, 150);
    f.at(l, p.x, p.y);
  }
  ["R", "S"].forEach((l) => f.seg("V", l));
  return f.build();
};

/** Fig. 18: two parallel supports with two independent tick classes. */
export const markedPair = (): Board =>
  fig("Marked segments")
    .at("A", -150, -60).at("B", 150, -60)
    .at("D", -150, 70).at("C", 150, 70)
    .seg("A", "B").seg("D", "C").seg("A", "D").seg("B", "C")
    .on("E", "A", "B", 0.55)
    .on("F", "D", "C", 0.45)
    .seg("E", "F")
    .tick(["E", "B"], ["D", "F"])
    .tick(["A", "D"], ["B", "C"])
    .build();

/** Fig. 13: a straight angle in disguise — line EF through X, rays to C and D. */
export const straightInDisguise = (): Board => {
  const f = fig("Straight angle at a crossing");
  f.at("E", -170, 0).at("F", 170, 0);
  f.seg("E", "F");
  f.on("X", "E", "F", 0.5);
  const c = polar(0, 0, 128, 155),
    d = polar(0, 0, -52, 155);
  f.at("C", c.x, c.y).at("D", d.x, d.y);
  f.seg("C", "D");
  return f.build();
};

/** A right angle marked at the meeting of two segments. */
export const perpendicular = (): Board => {
  const f = fig("Perpendicular segments");
  f.at("A", -160, 0).at("B", 160, 0);
  f.seg("A", "B");
  f.on("P", "A", "B", 0.5);
  f.at("Q", 0, -150);
  f.seg("P", "Q");
  f.right("APQ");
  return f.build();
};

/** Three rays from one vertex, with the parts and the whole all labelled. */
export const numberedCorner = (): Board => {
  const f = fig("Labelled angles");
  f.at("V", 0, 80);
  for (const [l, d] of [["A", 150], ["B", 96], ["C", 26]] as [string, number][]) {
    const p = polar(0, 80, d, 155);
    f.at(l, p.x, p.y);
  }
  ["A", "B", "C"].forEach((l) => f.seg("V", l));
  f.num("1", "AVB");
  f.num("2", "BVC");
  f.num("3", "AVC");
  return f.build();
};

/**
 * Three lines through one point, with three consecutive angles sharing the
 * straight line below them. Two measures are stated on the figure and the
 * third is what the question asks for.
 */
export const threeConcurrent = (): Board => {
  const f = fig("Three lines through a point");
  f.at("V", 0, 0);
  f.at("P", -155, 0).at("Q", 155, 0);
  for (const [l, d] of [
    ["R", 120], ["T", 300], ["S", 33], ["U", 213],
  ] as [string, number][]) {
    const p = polar(0, 0, d, 150);
    f.at(l, p.x, p.y);
  }
  ["P", "Q", "R", "T", "S", "U"].forEach((l) => f.seg("V", l));
  // Wide, stepped arcs so three labels round one vertex stay legible.
  f.num("X", "PVR", 52).num("Z", "RVS", 78).num("Y", "SVQ", 52);
  f.measure("RVS", 87).measure("SVQ", 33);
  return f.build();
};

/** Two right angles in different places, the Right Angle Congruence figure. */
export const twoRightAngles = (): Board => {
  const f = fig("Two right angles");
  f.at("A", -230, 40).at("B", -70, 40).at("C", -230, -90);
  f.seg("A", "B").seg("A", "C");
  f.at("D", 80, 40).at("E", 240, 40).at("F", 240, -90);
  f.seg("D", "E").seg("E", "F");
  f.right("BAC").right("DEF");
  f.num("1", "BAC").num("2", "DEF");
  return f.build();
};

/**
 * A linear pair supplying two supplementary angles, plus a third angle marked
 * congruent to the first — the shape of the "solve, then substitute back"
 * question.
 */
export const suppAndCongruent = (): Board => {
  const f = fig("Supplementary, with a congruent partner");
  f.at("P", -230, 30).at("Q", 60, 30);
  f.seg("P", "Q");
  f.on("V", "P", "Q", 0.5);
  const d = polar(-85, 30, 107, 150);
  f.at("R", d.x, d.y);
  f.seg("V", "R");
  // A separate angle, marked congruent to the first.
  f.at("W", 150, 30).at("Y", 300, 30);
  f.seg("W", "Y");
  const e = polar(150, 30, 73, 150);
  f.at("Z", e.x, e.y);
  f.seg("W", "Z");
  f.num("1", "PVR").num("2", "RVQ").num("3", "ZWY");
  f.arc("PVR", "ZWY");
  return f.build();
};

/**
 * Two separate linear pairs whose second angles are marked congruent. This is
 * the general form of the Congruent Supplements Theorem: ∠1 and ∠2 are not
 * vertical, so the conclusion cannot be reached by that shortcut.
 */
export const twoSupplementPairs = (): Board => {
  const f = fig("Supplements of congruent angles");
  f.at("A", -290, 40).at("B", -40, 40);
  f.seg("A", "B");
  f.on("V", "A", "B", 0.5);
  const c = polar(-165, 40, 65, 140);
  f.at("C", c.x, c.y);
  f.seg("V", "C");

  // The right-hand pair is rotated rather than translated. Drawn as a copy of
  // the left, ∠1 ≅ ∠2 is visible as a slide and the argument never has to be
  // made; tilted, the congruence has to come from the reasoning.
  const tilt = 28, half = 125;
  const dx = half * Math.cos((tilt * Math.PI) / 180);
  const dy = half * Math.sin((tilt * Math.PI) / 180);
  f.at("D", 165 - dx, 40 + dy).at("E", 165 + dx, 40 - dy);
  f.seg("D", "E");
  f.on("W", "D", "E", 0.5);
  const g = polar(165, 40, tilt + 65, 140);
  f.at("G", g.x, g.y);
  f.seg("W", "G");

  f.num("1", "AVC").num("3", "CVB").num("2", "DWG").num("4", "GWE");
  f.arc("CVB", "GWE");
  return f.build();
};

/** Four collinear points with three equal, ticked pieces. */
export const fourInARow = (): Board =>
  fig("Four points in a row")
    .at("A", -195, 0)
    .at("D", 195, 0)
    .seg("A", "D")
    .on("B", "A", "D", 1 / 3)
    .on("C", "A", "D", 2 / 3)
    .tick(["A", "B"], ["B", "C"], ["C", "D"])
    .build();

/** Four rays closing the full turn at V, with no straight line among them. */
export const aroundPoint = (): Board => {
  const f = fig("Angles around a point");
  f.at("V", 0, 0);
  for (const [l, d] of [
    ["A", 20], ["B", 100], ["C", 170], ["D", 260],
  ] as [string, number][]) {
    const p = polar(0, 0, d, 150);
    f.at(l, p.x, p.y);
  }
  ["A", "B", "C", "D"].forEach((l) => f.seg("V", l));
  // Wider lane so the four numerals clear the vertex letter.
  f.num("1", "AVB", 56).num("2", "BVC", 56).num("3", "CVD", 56).num("4", "DVA", 56);
  return f.build();
};

/** A linear pair drawn to the measure it states. */
export const linearPairAt = (first: number): Board => {
  const f = fig("Linear pair");
  f.at("A", -180, 0).at("C", 180, 0);
  f.seg("A", "C");
  f.on("B", "A", "C", 0.5);
  const d = polar(0, 0, 180 - first, 155);
  f.at("D", d.x, d.y);
  f.seg("B", "D");
  return f.build();
};

/** Two lines crossing at X, with ∠CXE drawn at the measure it states. */
export const crossingAt = (cxe: number): Board => {
  const f = fig("Two lines crossing");
  f.at("E", -185, 0).at("F", 185, 0);
  f.seg("E", "F");
  f.on("X", "E", "F", 0.5);
  const c = polar(0, 0, 180 - cxe, 165);
  const d = polar(0, 0, 360 - cxe, 165);
  f.at("C", c.x, c.y).at("D", d.x, d.y);
  f.seg("C", "D");
  return f.build();
};

/** Two parts of a right angle, drawn to the measure the first one states. */
export const rightSplitAt = (first: number): Board => {
  const f = fig("Two parts of a right angle");
  f.at("V", 0, 0);
  const a = polar(0, 0, 90, 175),
    b = polar(0, 0, 0, 175),
    c = polar(0, 0, 90 - first, 175);
  f.at("A", a.x, a.y).at("B", b.x, b.y).at("C", c.x, c.y);
  f.seg("V", "A").seg("V", "B").seg("V", "C");
  f.right("AVB");
  return f.build();
};

/**
 * The Congruent Complements figure: ∠1 and ∠3 are each complementary to the
 * ∠2 between them, and so congruent. Unlike the supplements case, this does
 * not collapse into a pair of vertical angles, which is why the theorem gets
 * a picture of its own.
 */
export const congruentComplements = (): Board => {
  const f = fig("Complements of the same angle");
  f.at("V", 0, 0);
  for (const [l, d] of [
    ["A", 0], ["B", 60], ["C", 90], ["D", 150],
  ] as [string, number][]) {
    const p = polar(0, 0, d, 165);
    f.at(l, p.x, p.y);
  }
  ["A", "B", "C", "D"].forEach((l) => f.seg("V", l));
  f.num("1", "AVB", 62).num("2", "BVC", 62).num("3", "CVD", 62);
  f.right("AVC").right("BVD");
  return f.build();
};

/** The four classes of angle, side by side with their measures. */
export const angleClasses = (): Board => {
  const f = fig("Classifying by measure");
  const spots: [string, string, string, number, number][] = [
    ["P", "A", "B", -390, 40],
    ["Q", "C", "D", -130, 90],
    ["R", "E", "F", 130, 130],
    ["S", "G", "H", 390, 180],
  ];
  for (const [v, a, b, x, deg] of spots) {
    f.at(v, x, 60);
    const p1 = polar(x, 60, 0, 115),
      p2 = polar(x, 60, deg, 115);
    f.at(a, p1.x, p1.y).at(b, p2.x, p2.y);
    f.seg(v, a).seg(v, b);
  }
  f.right("CQD");
  f.measure("APB", 40).measure("ERF", 130).measure("GSH", 180);
  return f.build();
};

/**
 * A bisector that is NOT perpendicular. The reference's Fig. 9 turns on this:
 * every perpendicular bisector is a bisector, but not the reverse — and a
 * figure showing only the perpendicular case teaches the opposite.
 */
export const obliqueBisector = (): Board => {
  const f = fig("A bisector that is not perpendicular");
  f.at("A", -180, 0).at("B", 180, 0);
  f.seg("A", "B");
  f.on("M", "A", "B", 0.5);
  const q = polar(0, 0, 52, 165),
    r = polar(0, 0, 232, 165);
  f.at("Q", q.x, q.y).at("R", r.x, r.y);
  f.seg("M", "Q").seg("M", "R");
  f.tick(["A", "M"], ["M", "B"]);
  return f.build();
};

/** A single point. The concept is shown rather than described. */
export const justAPoint = (): Board =>
  fig("A point")
    .at("P", 0, 0)
    .build();

/** The line through two points. */
export const aLine = (): Board =>
  fig("A line")
    .at("A", -110, 0).at("B", 110, 0)
    .line("A", "B")
    .build();

/**
 * A linear pair with both measures written on it. Three of these are the
 * concrete cases the inductive-reasoning walkthrough generalises from, so the
 * numbers have to be visible rather than merely true of the drawing.
 */
const measuredPair = (first: number): Board => {
  const f = fig(`Linear pair, ${first}° and ${180 - first}°`);
  f.at("A", -170, 0).at("C", 170, 0);
  f.seg("A", "C");
  f.on("B", "A", "C", 0.5);
  const d = polar(0, 0, 180 - first, 150);
  f.at("D", d.x, d.y);
  f.seg("B", "D");
  f.measure("ABD", first);
  f.measure("DBC", 180 - first);
  return f.build();
};
export const linearPairCaseA = (): Board => measuredPair(130);
export const linearPairCaseB = (): Board => measuredPair(90);
export const linearPairCaseC = (): Board => measuredPair(35);

/**
 * The perpendicular figure with the halves ticked as well. A perpendicular
 * bisector asserts two things, and a figure that marks only the right angle
 * leaves the student to read the halving off the drawing — which is the habit
 * the module exists to break.
 */
export const perpBisector = (): Board => {
  const f = fig("Perpendicular bisector");
  f.at("A", -160, 0).at("B", 160, 0);
  f.seg("A", "B");
  f.on("P", "A", "B", 0.5);
  f.at("Q", 0, -150);
  f.seg("P", "Q");
  f.right("APQ");
  f.tick(["A", "P"], ["P", "B"]);
  return f.build();
};

/** Three points that do not line up — the other half of "sometimes". */
export const notCollinear = (): Board =>
  fig("Three points, not collinear")
    .at("A", -150, 0).at("B", -20, -92).at("C", 150, 0)
    .build();

/**
 * Two congruent angles, differently oriented and arced at different sizes.
 * A figure that draws both arcs the same cannot make the point that the
 * number of arcs is what matches and the size means nothing.
 */
export const congruentAnglesPair = (): Board => {
  const f = fig("Congruent angles, different arcs");
  f.at("V", -150, 40);
  const a = polar(-150, 40, 145, 150), b = polar(-150, 40, 90, 150);
  f.at("A", a.x, a.y).at("B", b.x, b.y);
  f.seg("V", "A").seg("V", "B");
  f.at("W", 150, 40);
  const c = polar(150, 40, 20, 150), d = polar(150, 40, 75, 150);
  f.at("C", c.x, c.y).at("D", d.x, d.y);
  f.seg("W", "C").seg("W", "D");
  f.arc("AVB@30", "CWD@68");
  return f.build();
};

/** Two angles totalling 90°, drawn nowhere near each other. */
export const complementsApart = (): Board => {
  const f = fig("Complementary, and far apart");
  f.at("V", -170, 60);
  const a = polar(-170, 60, 90, 150), b = polar(-170, 60, 55, 150);
  f.at("A", a.x, a.y).at("B", b.x, b.y);
  f.seg("V", "A").seg("V", "B");
  f.measure("AVB", 35);
  f.at("W", 110, 60);
  const c = polar(110, 60, 145, 150), d = polar(110, 60, 90, 150);
  f.at("C", c.x, c.y).at("D", d.x, d.y);
  f.seg("W", "C").seg("W", "D");
  f.measure("CWD", 55);
  return f.build();
};

/** A segment cut into two unequal parts, for distributing over a sum. */
export const twoUnequalParts = (): Board =>
  fig("One segment, two unequal parts")
    .at("A", -195, 0).at("C", 195, 0)
    .seg("A", "C")
    .on("B", "A", "C", 0.35)
    .build();

/**
 * Two supplementary pairs at separate vertices, with nothing marked congruent
 * and the second baseline tilted so the halves do not read as one diagram
 * copied. ∠1 and ∠4 are supplementary to each other across the gap, which is
 * the claim the Supplementary concept needs: the total is all that matters,
 * and the angles need not touch or even share a drawing.
 */
export const twoSupplementsPlain = (): Board => {
  const f = fig("Two supplementary pairs");
  f.at("A", -290, 40).at("B", -40, 40);
  f.seg("A", "B");
  f.on("V", "A", "B", 0.5);
  const c = polar(-165, 40, 115, 150);
  f.at("C", c.x, c.y);
  f.seg("V", "C");
  // A baseline through W, tilted 20° off horizontal.
  const tilt = 20, r = 125;
  const dx = r * Math.cos((tilt * Math.PI) / 180), dy = r * Math.sin((tilt * Math.PI) / 180);
  f.at("D", 165 - dx, 40 + dy).at("E", 165 + dx, 40 - dy);
  f.seg("D", "E");
  f.on("W", "D", "E", 0.5);
  const g = polar(165, 40, tilt + 115, 150);
  f.at("G", g.x, g.y);
  f.seg("W", "G");
  f.num("1", "AVC").num("2", "DWG").num("3", "CVB").num("4", "GWE");
  return f.build();
};


export const LIBRARY: Record<string, () => Board> = {
  crossing,
  fan,
  collinear,
  notBetween,
  midpoint,
  bisector,
  linearPair,
  complementary,
  threeOnLine,
  markedPair,
  straightInDisguise,
  perpendicular,
  numberedCorner,
  threeConcurrent,
  twoRightAngles,
  suppAndCongruent,
  twoSupplementPairs,
  fourInARow,
  aroundPoint,
  congruentComplements,
  angleClasses,
  obliqueBisector,
  perpBisector,
  notCollinear,
  congruentAnglesPair,
  complementsApart,
  twoUnequalParts,
  twoSupplementsPlain,
  justAPoint,
  aLine,
  linearPairCaseA,
  linearPairCaseB,
  linearPairCaseC,
};

/** Figures built to order, so a drawing always matches the numbers given. */
export const TO_SCALE = { linearPairAt, crossingAt, rightSplitAt };
