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
    .tick(["A", "D"], ["B", "C"])
    .tick(["E", "B"], ["D", "F"])
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
  const d = polar(-85, 30, 62, 150);
  f.at("R", d.x, d.y);
  f.seg("V", "R");
  // A separate angle, marked congruent to the first.
  f.at("W", 150, 30).at("Y", 300, 30);
  f.seg("W", "Y");
  const e = polar(150, 30, 62, 150);
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

  f.at("D", 40, 40).at("E", 290, 40);
  f.seg("D", "E");
  f.on("W", "D", "E", 0.5);
  const g = polar(165, 40, 65, 140);
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
};
