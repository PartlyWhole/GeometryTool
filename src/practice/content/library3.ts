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
};
