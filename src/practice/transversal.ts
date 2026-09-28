// Module 3: where two angles sit when one line crosses two others.
//
// Every name the reference gives such a pair is a statement about position
// and nothing else — which side of the transversal each angle is on, and
// whether it opens between the two lines or outside them. That makes the
// names true of any two lines, parallel or not, and it is why the pair's name
// alone never makes two angles congruent. Only the parallel mark does that.
import { type AngleRef, type Board, direction, distance, projection, vertex } from "../model";
import type { AngId, LineId, PairKind } from "./terms";
import { byLabel, resolveAngle } from "./oracle";

export type Placement = {
  /** The line crossing both others. */
  transversal: string;
  /** The two lines it crosses, as edge ids, in the order of the angles. */
  lines: [string, string];
  /** What the pair is called, or "none" when no name fits. */
  kind: PairKind | "none";
  /** On the same side of the transversal? */
  sameSide: boolean;
  /** Does each angle open between the two lines? */
  interior: [boolean, boolean];
};

/** One angle at a crossing: which of its arms runs along which edge. */
type Arms = {
  at: { x: number; y: number };
  ref: AngleRef;
  edges: [string, string];
  dirs: [number, number];
};

function arms(b: Board, a: AngId): Arms | undefined {
  const ref = resolveAngle(b, a);
  if (!ref) return;
  const at = vertex(b, ref.vertex);
  const s = direction(b, ref, ref.start),
    e = direction(b, ref, ref.end);
  if (!at || s === undefined || e === undefined) return;
  if (ref.start.edge === ref.end.edge) return;
  return { at, ref, edges: [ref.start.edge, ref.end.edge], dirs: [s, e] };
}

const unit = (t: number) => ({ x: Math.cos(t), y: Math.sin(t) });
const dot = (u: { x: number; y: number }, v: { x: number; y: number }) =>
  u.x * v.x + u.y * v.y;
const cross = (u: { x: number; y: number }, v: { x: number; y: number }) =>
  u.x * v.y - u.y * v.x;

/**
 * Classify two angles at different crossings of a common transversal.
 * Returns undefined when they are not in that arrangement at all — at one
 * crossing (vertical angles, a linear pair) or with no line in common.
 */
export function placement(b: Board, a: AngId, c: AngId): Placement | undefined {
  const A = arms(b, a),
    C = arms(b, c);
  if (!A || !C || distance(A.at, C.at) < 1e-6) return;
  const shared = A.edges.filter((e) => C.edges.includes(e));
  if (shared.length !== 1) return;
  const t = shared[0];
  const ia = A.edges.indexOf(t),
    ic = C.edges.indexOf(t);
  const la = A.edges[1 - ia],
    lc = C.edges[1 - ic];
  if (la === lc) return;

  // Interior: the arm along the transversal points toward the other crossing,
  // so the angle opens into the region between the two lines.
  const toC = { x: C.at.x - A.at.x, y: C.at.y - A.at.y };
  const toA = { x: -toC.x, y: -toC.y };
  const inA = dot(unit(A.dirs[ia]), toC) > 0;
  const inC = dot(unit(C.dirs[ic]), toA) > 0;

  // Side: which side of the transversal the other arm points to.
  const sideA = Math.sign(cross(toC, unit(A.dirs[1 - ia])));
  const sideC = Math.sign(cross(toC, unit(C.dirs[1 - ic])));
  if (!sideA || !sideC) return;
  const same = sideA === sideC;

  const kind: Placement["kind"] =
    inA !== inC
      ? same
        ? "corresponding"
        : "none"
      : inA
        ? same
          ? "consInterior"
          : "altInterior"
        : same
          ? "consExterior"
          : "altExterior";
  return { transversal: t, lines: [la, lc], kind, sameSide: same, interior: [inA, inC] };
}

/**
 * The two facts that decide a pair's name, in words: "on opposite sides of t,
 * and both between the lines". Feedback leads with these rather than with
 * the name, because the name is only shorthand for them.
 */
export function positionWords(b: Board, p: Placement): string {
  const t = b.edges.find((e) => e.id === p.transversal)?.label ?? "the transversal";
  const side = p.sameSide ? "on the same side of " + t : "on opposite sides of " + t;
  const [x, y] = p.interior;
  const inside =
    x && y
      ? "both between the lines"
      : !x && !y
        ? "both outside the lines"
        : "one between the lines and one outside";
  return side + ", " + inside;
}

/** The edge a line reference names: by its letter, or by two of its points. */
export function resolveLine(b: Board, l: LineId): string | undefined {
  if (l.name) {
    const e = b.edges.find((x) => x.label === l.name);
    if (e) return e.id;
  }
  const p = byLabel(b, l.a),
    q = byLabel(b, l.b);
  if (!p || !q) return;
  for (const e of b.edges) {
    if (e.kind === "circle") continue;
    const u = b.points.find((x) => x.id === e.a),
      v = b.points.find((x) => x.id === e.b);
    if (!u || !v) continue;
    const on = (x: { x: number; y: number }) =>
      projection(x, u, v, "line").distance < 1e-4;
    if (on(p) && on(q)) return e.id;
  }
  return;
}

/** A figure's named line, as a reference a statement can carry. */
export function lineNamed(b: Board, letter: string): LineId {
  const e = b.edges.find((x) => x.label === letter);
  if (!e) throw Error("Figure has no line " + letter);
  const a = b.points.find((p) => p.id === e.a)!,
    c = b.points.find((p) => p.id === e.b)!;
  return { k: "line", a: a.label, b: c.label, name: letter };
}

/** Are the two edges declared parallel by the figure's arrow marks? */
export function markedParallel(b: Board, e1: string, e2: string): boolean {
  const classes = parallelClasses(b);
  return classes.some((c) => c.includes(e1) && c.includes(e2));
}

/**
 * Parallel marks grouped transitively: m ∥ n and n ∥ p put all three in one
 * class, and each class is drawn with its own number of arrowheads.
 */
export function parallelClasses(b: Board): string[][] {
  const out: string[][] = [];
  for (const c of b.constraints) {
    if (c.kind !== "parallel") continue;
    const hit = out.filter((g) => g.includes(c.edges[0]) || g.includes(c.edges[1]));
    const merged = [...new Set([...hit.flat(), ...c.edges])];
    for (const h of hit) out.splice(out.indexOf(h), 1);
    out.push(merged);
  }
  return out;
}
