// Module 3 figures: two lines cut by a transversal.
//
// The reference draws these with no point letters at all. Lines carry
// single-letter names and the eight angles carry numerals, clockwise from the
// upper left at each crossing:
//
//          1 | 2            5 | 6
//        ----+----  on m,  ----+----  on n
//          4 | 3            8 | 7
//
// so ∠1 and ∠5 correspond, ∠3 and ∠5 are alternate interior, and so on. The
// points below are construction points the renderer needs and never shows.
import type { Board } from "../../model";
import { fig, polar } from "./figures";

export type TransversalOpts = {
  /** The two lines' names, top one first, and the transversal's. */
  names?: [string, string, string];
  /** Direction of each line, degrees counter-clockwise from rightward. */
  tilt?: [number, number];
  /** Direction of the transversal, degrees. 90 is upright. */
  cross?: number;
  /** How far apart the two lines are, measured along the vertical. */
  gap?: number;
  /** Draw the arrowhead marks saying the two lines are parallel. */
  marked?: boolean;
  /**
   * The numeral for each of the eight positions, in the order
   * [upper-left, upper-right, lower-right, lower-left] at the top crossing
   * and then the same at the bottom. Defaults to 1–8, the reference's order.
   */
  numbers?: (string | null)[];
  /** Turn the whole figure, degrees counter-clockwise. */
  turn?: number;
  /** How far the construction points reach, which sets the frame. */
  reach?: number;
  /** Measures to print, keyed by numeral: { "1": 70 }. Must match the drawing. */
  measures?: Record<string, number>;
  /** Groups of numerals the figure marks congruent with matching arcs. */
  arcs?: string[][];
  title?: string;
};

const DEFAULT_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

/** The figure every Module 3 exercise is built on. */
export function transversal(o: TransversalOpts = {}): Board {
  const [top, bottom, tName] = o.names ?? ["m", "n", "t"];
  const [t1, t2] = o.tilt ?? [0, 0];
  const cross = o.cross ?? 62;
  const gap = o.gap ?? 120;
  const turn = o.turn ?? 0;
  // The construction points only set the frame; every line is drawn out to
  // its edge. Kept close in, so the crossings fill the figure.
  const R = o.reach ?? 175;
  const RT = 128;

  // Everything is laid out upright, then turned as a whole.
  const rot = (p: { x: number; y: number }) => {
    const r = (-turn * Math.PI) / 180;
    return {
      x: p.x * Math.cos(r) - p.y * Math.sin(r),
      y: p.x * Math.sin(r) + p.y * Math.cos(r),
    };
  };
  const c1 = { x: 0, y: -gap / 2 },
    c2 = { x: 0, y: gap / 2 };
  const pts: Record<string, { x: number; y: number }> = {
    A1: polar(c1.x, c1.y, t1 + 180, R),
    B1: polar(c1.x, c1.y, t1, R),
    A2: polar(c2.x, c2.y, t2 + 180, R),
    B2: polar(c2.x, c2.y, t2, R),
    T1: polar(0, 0, cross, RT),
    T2: polar(0, 0, cross + 180, RT),
  };

  const f = fig(o.title ?? "Two lines cut by a transversal");
  for (const [k, p] of Object.entries(pts)) {
    const q = rot(p);
    f.quiet(k, q.x, q.y);
  }
  f.line("A1", "B1").line("A2", "B2").line("T2", "T1");
  f.name("A1", "B1", top).name("A2", "B2", bottom).name("T2", "T1", tName);
  f.cross("X", ["A1", "B1"], ["T2", "T1"], { quiet: true });
  f.cross("Y", ["A2", "B2"], ["T2", "T1"], { quiet: true });

  const nums = o.numbers ?? DEFAULT_NUMBERS;
  // Upper-left, upper-right, lower-right, lower-left at each crossing, where
  // "upper" is the transversal's T1 end and "left" is each line's A end.
  const spots = [
    "T1XA1", "T1XB1", "B1XT2", "T2XA1",
    "T1YA2", "T1YB2", "B2YT2", "T2YA2",
  ];
  spots.forEach((three, i) => {
    const n = nums[i];
    if (n) f.num(n, three);
  });
  for (const [n, deg] of Object.entries(o.measures ?? {})) f.measure(n, deg);
  for (const group of o.arcs ?? []) f.arc(...group);
  if (o.marked) f.parallel(["A1", "B1"], ["A2", "B2"]);
  return f.build();
}

// --- The reference's own figures -------------------------------------------

/** Build Understanding: lines j and k, not parallel, cut by t. */
export const transversalJK = () =>
  transversal({
    names: ["j", "k", "t"],
    tilt: [14, -6],
    cross: 118,
    title: "Lines j and k cut by transversal t",
  });

/** The theorem table's figure: m ∥ n, marked, cut by t. */
export const parallelMN = () =>
  transversal({ marked: true, tilt: [8, 8], cross: 64, title: "m ∥ n cut by t" });

/** The same lines, drawn parallel, with no mark saying so. */
export const parallelUnmarked = () =>
  transversal({ tilt: [8, 8], cross: 64, title: "m and n, unmarked" });

/** Lines that look parallel and are not: 4° apart. */
export const nearlyParallel = () =>
  transversal({ tilt: [10, 6], cross: 64, title: "m and n, not quite parallel" });

/**
 * The flow proof's figure: a ∥ b, upright, cut by the horizontal c.
 *
 * ∠1 opens above c and right of a, toward b; ∠2 sits in the same spot at b;
 * ∠3 is opposite ∠2 across b. So ∠1 and ∠2 correspond, ∠2 and ∠3 are
 * vertical, and ∠1 and ∠3 are the alternate interior pair being proved.
 */
export const flowProof = () =>
  transversal({
    names: ["a", "b", "c"],
    tilt: [0, 0],
    cross: 110,
    turn: 70,
    gap: 150,
    reach: 100,
    marked: true,
    // Laid out with a and b level, then turned 70° so that a and b lean like
    // the reference's and c comes out level. Numerals are placed by position
    // in the untilted frame: ∠1 below a right of c (interior), ∠2 below b
    // right of c (its corresponding angle), ∠3 above b left of c.
    numbers: [null, null, "1", null, "3", null, "2", null],
    title: "a ∥ b cut by c",
  });

/** A marked pair of parallels with one measure printed, for Solve items. */
export const parallelWithMeasure = (numeral: string, deg: number) => {
  // ∠2 (upper right) equals the transversal's direction when the lines run
  // level, so the drawing is set to make the printed measure true.
  const at = Number(numeral);
  const upperRight = [2, 4, 6, 8].includes(at) ? deg : 180 - deg;
  return transversal({
    marked: true,
    tilt: [0, 0],
    cross: upperRight,
    measures: { [numeral]: deg },
    title: "m ∥ n with a measure",
  });
};

// --- One pair at a time -----------------------------------------------------
//
// Each shows only the two angles its name is about, and on lines that are
// not parallel: the names are about position, and a picture of them on
// parallel lines would quietly suggest the pair must be congruent.

const onePair = (a: number, b: number, title: string) => () => {
  const numbers: (string | null)[] = Array(8).fill(null);
  numbers[a - 1] = String(a);
  numbers[b - 1] = String(b);
  return transversal({ names: ["j", "k", "t"], tilt: [12, -5], cross: 112, numbers, title });
};

export const pairCorresponding = onePair(1, 5, "Corresponding angles");
export const pairAltInterior = onePair(3, 5, "Alternate interior angles");
export const pairConsInterior = onePair(4, 5, "Consecutive interior angles");
export const pairAltExterior = onePair(1, 7, "Alternate exterior angles");
export const pairConsExterior = onePair(2, 7, "Consecutive exterior angles");

// --- One theorem at a time ---------------------------------------------------
//
// The lines are marked parallel, which is what licenses the conclusion, and
// the conclusion is drawn: matching arcs for a congruence, two measures that
// total 180° for a supplement. Level lines, so the printed measures are true.

const onlyThese = (...ns: number[]) =>
  Array.from({ length: 8 }, (_, i) => (ns.includes(i + 1) ? String(i + 1) : null));

export const thmCorresponding = () =>
  transversal({ marked: true, cross: 64, numbers: onlyThese(1, 5), arcs: [["1", "5"]], title: "Corresponding Angles Postulate" });
export const thmAltInterior = () =>
  transversal({ marked: true, cross: 64, numbers: onlyThese(3, 5), arcs: [["3", "5"]], title: "Alternate Interior Angles Theorem" });
export const thmConsInterior = () =>
  transversal({ marked: true, cross: 64, numbers: onlyThese(4, 5), measures: { "4": 64, "5": 116 }, title: "Consecutive Interior Angles Theorem" });
export const thmAltExterior = () =>
  transversal({ marked: true, cross: 64, numbers: onlyThese(1, 7), arcs: [["1", "7"]], title: "Alternate Exterior Angles Theorem" });
export const thmConsExterior = () =>
  transversal({ marked: true, cross: 64, numbers: onlyThese(2, 7), measures: { "2": 64, "7": 116 }, title: "Consecutive Exterior Angles Theorem" });

/**
 * Every angle either equals ∠1 or makes 180° with it, when m ∥ n. Only two
 * measures are printed: all eight, each with its arc, close into two circles
 * and read as nothing. The walkthrough colours the two families instead.
 */
export const twoMeasures = () =>
  transversal({
    marked: true,
    cross: 64,
    measures: { "1": 116, "2": 64 },
    title: "Two measures between them",
  });

/**
 * The degenerate case: t perpendicular to m and n. Every angle is right, so
 * every pair is congruent and supplementary at once.
 */
export const perpendicularTransversal = () =>
  transversal({
    marked: true,
    cross: 90,
    numbers: onlyThese(4, 5),
    measures: { "4": 90, "5": 90 },
    title: "t perpendicular to m and n",
  });

// --- Stage 1: what Module 2 hands over ------------------------------------

/**
 * One crossing on its own: two lines, four angles, numbered like the top
 * crossing of the two-line figure. `measures` prints any of them.
 */
export function oneCrossing(o: { cross?: number; measures?: Record<string, number>; names?: [string, string] } = {}): Board {
  const cross = o.cross ?? 116;
  const [line, t] = o.names ?? ["m", "t"];
  const f = fig("One crossing");
  const A = polar(0, 0, 180, 170), B = polar(0, 0, 0, 170);
  const T1 = polar(0, 0, cross, 130), T2 = polar(0, 0, cross + 180, 130);
  f.quiet("A1", A.x, A.y).quiet("B1", B.x, B.y).quiet("T1", T1.x, T1.y).quiet("T2", T2.x, T2.y);
  f.line("A1", "B1").line("T2", "T1").name("A1", "B1", line).name("T2", "T1", t);
  f.cross("X", ["A1", "B1"], ["T2", "T1"], { quiet: true });
  ["T1XA1", "T1XB1", "B1XT2", "T2XA1"].forEach((three, i) => f.num(String(i + 1), three));
  for (const [n, d] of Object.entries(o.measures ?? {})) f.measure(n, d);
  return f.build();
}

/** Know one angle at a crossing and you know all four. */
export const crossingOneMeasure = () => oneCrossing({ cross: 116, measures: { "1": 64 } });

/** Two lines meeting at a right angle: one square, and all four are right. */
export const perpendicularLines = () => oneCrossing({ cross: 90, measures: { "1": 90 }, names: ["m", "t"] });

/** A right triangle, legs 4 and 3 and hypotenuse 5 (drawn at 30 units each). */
export const rightTriangle = (): Board =>
  fig("Right triangle ADC")
    .at("A", -120, 45).at("D", 0, 45).at("C", 0, -45)
    .seg("A", "D").seg("D", "C").seg("A", "C")
    .right("ADC")
    .build();

/**
 * Reflection in a line: fold along CD and A lands on B, so every point of
 * the fold — E, F, G — is as far from A as from B.
 */
export const reflection = (): Board => {
  const f = fig("Reflection across CD");
  f.at("A", -150, 70).at("B", 150, 70).seg("A", "B");
  f.at("C", 0, -150).quiet("K", 0, 110).line("C", "K");
  f.cross("D", ["A", "B"], ["C", "K"]);
  f.on("E", "C", "K", 0.12).on("F", "C", "K", 0.36).on("G", "C", "K", 0.6);
  for (const p of ["E", "F", "G"]) f.dashed("A", p).dashed("B", p);
  return f.tick(["A", "D"], ["D", "B"]).right("ADC").build();
};

// --- Stage 5: angle facts that prove lines parallel ---------------------------

/**
 * Lines drawn parallel but not marked so, with the angle fact that proves
 * them parallel marked instead: matching arcs, or two measures totalling 180°.
 */
export const givenPair = (kind: "corresponding" | "altInterior" | "altExterior" | "consInterior" | "consExterior") => () =>
  transversal({
    cross: 64,
    ...(kind === "corresponding" ? { arcs: [["1", "5"]] }
      : kind === "altInterior" ? { arcs: [["3", "5"]] }
      : kind === "altExterior" ? { arcs: [["1", "7"]] }
      : kind === "consInterior" ? { measures: { "4": 64, "5": 116 } }
      : { measures: { "1": 116, "8": 64 } }),
    title: "An angle fact about " + kind,
  });

export const givenCorresponding = givenPair("corresponding");
export const givenAltInterior = givenPair("altInterior");
export const givenAltExterior = givenPair("altExterior");
export const givenConsInterior = givenPair("consInterior");
export const givenConsExterior = givenPair("consExterior");

/**
 * Two lines cut by one transversal, drawn so the named angles have the
 * given measures. Level lines when the measures say they are parallel;
 * tilted apart when they do not. Nothing is marked parallel either way.
 */
export function drawnAt(targets: Record<string, number>): Board {
  // Each crossing's opening d = φ − tilt fixes its four angles: the upper
  // right and lower left measure d, the other two 180° − d.
  const opening = (n: string, deg: number) => ([2, 4, 6, 8].includes(Number(n)) ? deg : 180 - deg);
  const top = Object.entries(targets).find(([n]) => Number(n) <= 4);
  const bot = Object.entries(targets).find(([n]) => Number(n) > 4);
  const d1 = top ? opening(...top) : bot ? opening(...bot) : 64;
  const d2 = bot ? opening(...bot) : d1;
  // The transversal splits the difference, so m and n stay near level — as
  // the reference draws them — and are exactly level when parallel.
  const phi = (d1 + d2) / 2;
  return transversal({
    tilt: [phi - d1, phi - d2],
    cross: phi,
    measures: targets,
    title: "Measured angles",
  });
}

/** Three lines crossed by one transversal: a ∥ b and b ∥ c, so is a ∥ c? */
export const threeLines = (): Board => {
  const f = fig("Three lines cut by t");
  const ys = [-80, 0, 80];
  const names = ["a", "b", "c"];
  ys.forEach((y, i) => f.quiet("A" + (i + 1), -210, y).quiet("B" + (i + 1), 210, y));
  const T1 = polar(0, 0, 66, 190), T2 = polar(0, 0, 246, 190);
  f.quiet("T1", T1.x, T1.y).quiet("T2", T2.x, T2.y).line("T2", "T1").name("T2", "T1", "t");
  ys.forEach((_, i) => {
    const k = String(i + 1);
    f.line("A" + k, "B" + k).name("A" + k, "B" + k, names[i]);
    f.cross("X" + k, ["A" + k, "B" + k], ["T2", "T1"], { quiet: true });
    f.num(k, "T1X" + k + "A" + k);
  });
  f.parallel(["A1", "B1"], ["A2", "B2"]).parallel(["A2", "B2"], ["A3", "B3"]);
  return f.build();
};

/** Two lines, each perpendicular to p. */
export const twoPerpendiculars = () =>
  transversal({ names: ["m", "n", "p"], cross: 90, numbers: onlyThese(1, 5), measures: { "1": 90, "5": 90 }, title: "m ⊥ p and n ⊥ p" });

// --- Stage 6: exactly one line --------------------------------------------------

/** Through P, off line l: one parallel, and every other line meets l. */
export const parallelPostulate = (): Board => {
  const f = fig("One parallel through P");
  f.quiet("L1", -220, 70).quiet("L2", 220, 70).line("L1", "L2").name("L1", "L2", "l");
  f.quiet("Q1", -220, -60).quiet("Q2", 220, -60).line("Q1", "Q2");
  f.on("P", "Q1", "Q2", 0.5);
  f.quiet("R1", 130, 200).line("P", "R1");
  f.quiet("S1", -170, 110).line("P", "S1");
  f.parallel(["L1", "L2"], ["Q1", "Q2"]);
  return f.build();
};

/** Constructing the parallel to XY through P, one step at a time. */
export const constructParallel = (step: 1 | 2 | 3 | 4) => (): Board => {
  const f = fig("Construct a parallel through P");
  f.at("X", -120, 70).at("Y", 150, 70).line("X", "Y");
  const P = polar(-120, 70, 58, 160);
  if (step >= 2) {
    // P is declared on the ray, so the angle at P can be named through it.
    const W = polar(-120, 70, 58, 250);
    f.quiet("W", W.x, W.y).ray("X", "W").on("P", "X", "W", 160 / 250);
  } else f.at("P", P.x, P.y);
  if (step >= 3) f.compass("X", 60, -8, 70).compass("P", 60, -8, 70);
  if (step >= 4) {
    f.at("Z", P.x + 150, P.y).line("P", "Z");
    f.arc("YXP", "ZPW");
  }
  return f.build();
};

/** Through P, off line l: one perpendicular. */
export const perpendicularPostulate = (): Board => {
  const f = fig("One perpendicular through P");
  f.quiet("L1", -220, 70).quiet("L2", 220, 70).line("L1", "L2").name("L1", "L2", "l");
  f.at("P", 0, -100).quiet("K", 0, 150).line("P", "K");
  f.cross("F", ["L1", "L2"], ["P", "K"]);
  f.quiet("R", 150, 150).line("P", "R");
  return f.right("PFL2").build();
};

/** m ∥ n, and t ⊥ m: is t ⊥ n? */
export const perpTransversal = () =>
  transversal({ marked: true, cross: 90, numbers: onlyThese(1, 5), measures: { "1": 90 }, title: "m ∥ n and t ⊥ m" });

// --- Stage 7: the perpendicular bisector --------------------------------------

/** CD is the perpendicular bisector of AB; C is a point on it. */
export const perpBisectorTheorem = (): Board => {
  const f = fig("CD ⊥ bisector of AB");
  f.at("A", -150, 60).at("B", 150, 60).seg("A", "B");
  f.at("C", 0, -130).quiet("K", 0, 130).line("C", "K");
  f.cross("D", ["A", "B"], ["C", "K"]);
  f.dashed("A", "C").dashed("B", "C");
  return f.tick(["A", "D"], ["D", "B"]).right("ADC").build();
};

/** C is equidistant from A and B, with the perpendicular CD added to prove it. */
export const perpBisectorConverse = (step: 1 | 2) => (): Board => {
  const f = fig("CA = CB");
  f.at("A", -150, 60).at("B", 150, 60).seg("A", "B");
  f.at("C", 0, -130).seg("C", "A").seg("C", "B");
  f.tick(["C", "A"], ["C", "B"]);
  if (step === 2) {
    f.on("D", "A", "B", 0.5).dashed("C", "D");
    f.right("ADC");
  }
  return f.build();
};

/** A point equidistant from A and B — marked so — without the bisector drawn. */
export const equidistantPoint = (): Board => {
  const f = fig("PA = PB");
  f.at("A", -150, 60).at("B", 150, 60).seg("A", "B");
  f.at("P", 0, -110).seg("P", "A").seg("P", "B");
  return f.tick(["P", "A"], ["P", "B"]).build();
};

/** The perpendicular bisector of XY by compass, step by step. */
export const constructPerpBisector = (step: 1 | 2 | 3) => (): Board => {
  const f = fig("Construct the ⊥ bisector of XY");
  f.at("X", -100, 0).at("Y", 100, 0).seg("X", "Y");
  // Radius 140 > ½·XY = 100; the arcs meet at (0, ±98).
  f.compass("X", 140, -62, 62);
  if (step >= 2) f.compass("Y", 140, 118, 242);
  if (step >= 3) {
    f.at("A", 0, -98).at("B", 0, 98).line("A", "B");
    f.cross("M", ["X", "Y"], ["A", "B"]);
  }
  return f.build();
};

/** The perpendicular to m through P by compass, step by step. */
export const constructPerpThroughPoint = (step: 1 | 2 | 3) => (): Board => {
  const f = fig("Construct the ⊥ to m through P");
  f.quiet("M1", -230, 0).quiet("M2", 230, 0).line("M1", "M2").name("M1", "M2", "m");
  f.at("P", 0, -110);
  // Radius 150 from P meets m at x = ±102.
  f.compass("P", 150, 205, 335);
  f.at("A", -102, 0).at("B", 102, 0);
  if (step >= 2) f.compass("A", 150, 280, 330).compass("B", 150, 210, 260);
  if (step >= 3) f.at("Q", 0, 110).line("P", "Q");
  return f.build();
};

/**
 * The triangle every length question uses: base AC, apex B, and the segment
 * BD down to the base. Which facts are marked decides what follows, and the
 * drawing agrees with whatever is marked.
 */
export function bisectorTriangle(o: {
  equal?: boolean; // AB ≅ BC ticked
  halves?: boolean; // AD ≅ DC ticked
  right?: boolean; // square at D
  apex?: number; // x of B; 0 puts B on the perpendicular bisector
  foot?: number; // where D sits along AC, 0.5 is the midpoint
}): Board {
  const f = fig("Triangle ABC");
  f.at("A", -150, 70).at("C", 150, 70).seg("A", "C");
  const t = o.foot ?? 0.5;
  f.on("D", "A", "C", t);
  const dx = -150 + 300 * t;
  const bx = o.right ? dx : o.apex ?? dx;
  f.at("B", bx, -120).seg("B", "A").seg("B", "C").seg("B", "D");
  if (o.equal) f.tick(["B", "A"], ["B", "C"]);
  if (o.halves) f.tick(["A", "D"], ["D", "C"]);
  if (o.right) f.right("ADB");
  return f.build();
}

export const LIBRARY3: Record<string, () => Board> = {
  transversalJK,
  parallelMN,
  parallelUnmarked,
  nearlyParallel,
  flowProof,
  pairCorresponding,
  pairAltInterior,
  pairConsInterior,
  pairAltExterior,
  pairConsExterior,
  thmCorresponding,
  thmAltInterior,
  thmConsInterior,
  thmAltExterior,
  thmConsExterior,
  twoMeasures,
  perpendicularTransversal,
  crossingOneMeasure,
  perpendicularLines,
  rightTriangle,
  reflection,
  givenCorresponding,
  givenAltInterior,
  givenAltExterior,
  givenConsInterior,
  givenConsExterior,
  threeLines,
  twoPerpendiculars,
  parallelPostulate,
  constructParallel1: constructParallel(1),
  constructParallel2: constructParallel(2),
  constructParallel3: constructParallel(3),
  constructParallel4: constructParallel(4),
  perpendicularPostulate,
  perpTransversal,
  perpBisectorTheorem,
  perpBisectorConverse1: perpBisectorConverse(1),
  perpBisectorConverse2: perpBisectorConverse(2),
  equidistantPoint,
  constructPerpBisector1: constructPerpBisector(1),
  constructPerpBisector2: constructPerpBisector(2),
  constructPerpBisector3: constructPerpBisector(3),
  constructPerpThroughPoint1: constructPerpThroughPoint(1),
  constructPerpThroughPoint2: constructPerpThroughPoint(2),
  constructPerpThroughPoint3: constructPerpThroughPoint(3),
  bisectorIsosceles: () => bisectorTriangle({ equal: true, right: true }),
};
