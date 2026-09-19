// Resolving label references against a Board, and deciding what a figure says.
//
// The reference is strict about this (§3, "Given and Prove"): a diagram
// contributes only what is *marked*. Tick marks, right-angle squares and
// points drawn on a line are usable; "it looks about equal" is not. So this
// module separates two questions:
//
//   holds(...)  — is the statement true of the current coordinates? (measured)
//   marked(...) — is it given by a tick mark, arc, or declared constraint?
//
// Positional facts (collinear, between, interior, adjacent, vertical, linear
// pair) are legitimately readable from a drawing and count as marked.
import {
  type AngleRef,
  type Board,
  type Constraint,
  type DirectionRef,
  type SegmentRef,
  TAU,
  angleDegrees,
  angleKey,
  direction,
  distance,
  mod,
  projection,
  segmentKey,
  segmentLength,
  topology,
  vertex,
} from "../model";
import {
  type AngId,
  type ObjId,
  type SegId,
  type Statement,
  type Term,
  angCanonical,
  objKey,
  splitLabels,
} from "./terms";

/** Drawing units per mathematical unit, matching the whiteboard's display. */
export const UNIT = 50;
const POS = 1e-6;

/**
 * How close counts as equal. Authored content and proof checking use EXACT;
 * a student dragging a point by hand cannot hit 90.000°, so the construction
 * exercise uses HAND.
 */
export type Tol = { deg: number; len: number };
export const EXACT: Tol = { deg: 1e-3, len: 1e-4 };
export const HAND: Tol = { deg: 1, len: 0.12 };

export const byLabel = (b: Board, label: string) =>
  b.points.find((p) => p.label === label);

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

export function resolveSeg(b: Board, s: SegId): SegmentRef | undefined {
  const a = byLabel(b, s.a),
    c = byLabel(b, s.b);
  if (!a || !c) return;
  const direct = b.edges.find(
    (e) =>
      e.kind !== "circle" &&
      ((e.a === a.id && e.b === c.id) || (e.a === c.id && e.b === a.id)),
  );
  if (direct) return { edge: direct.id };
  // Both points may instead sit on one longer support.
  for (const e of b.edges) {
    if (e.kind === "circle") continue;
    const p = b.points.find((x) => x.id === e.a),
      q = b.points.find((x) => x.id === e.b);
    if (!p || !q) continue;
    const on = (v: { id: string; x: number; y: number }) =>
      v.id === e.a ||
      v.id === e.b ||
      projection(v, p, q, e.kind).distance < 1e-4;
    if (on(a) && on(c)) return { edge: e.id, a: a.id, b: c.id };
  }
  return;
}

/**
 * Resolve "ABC" to the non-reflex angle at B between rays BA and BC, or a
 * numbered angle such as "1" to a board angle carrying that label.
 */
export function resolveAngle(b: Board, a: AngId): AngleRef | undefined {
  const named = b.angles.find(
    (x) => x.label && angCanonical(x.label) === angCanonical(a.name),
  );
  if (named) return named;
  const parts = splitLabels(a.name);
  if (parts.length !== 3) return;
  const [pa, pv, pc] = parts.map((l) => byLabel(b, l));
  if (!pa || !pv || !pc) return;
  const js = topology(b);
  const j = js.find((x) => distance(x.position, pv) < 1e-6);
  if (!j) return;
  const toward = (target: { x: number; y: number }) => {
    const want = Math.atan2(target.y - j.position.y, target.x - j.position.x);
    let best: { d: number; ref: (typeof j.directions)[number]["ref"] } | undefined;
    for (const d of j.directions) {
      const gap = Math.abs(mod(d.angle - want + Math.PI) - Math.PI);
      if (gap < 1e-4 && (!best || gap < best.d)) best = { d: gap, ref: d.ref };
    }
    return best?.ref;
  };
  const start = toward(pa),
    end = toward(pc);
  if (!start || !end) return;
  const probe: AngleRef = {
    id: "resolved:" + angCanonical(a.name),
    vertex: j.ref,
    start,
    end,
    sweep: 1,
  };
  const s = direction(b, probe, start)!,
    e = direction(b, probe, end)!;
  // ∠ABC means the non-reflex region.
  return mod(e - s) <= Math.PI + 1e-9
    ? probe
    : { ...probe, start: end, end: start };
}

/**
 * The three-point name of an angle: arm, vertex, arm. This is what makes a
 * labelled angle such as ∠2 and a named one such as ∠AXC interchangeable.
 */
export function threePointName(b: Board, ref: AngleRef): string | undefined {
  const v = vertex(b, ref.vertex);
  if (!v) return;
  const vl = b.points.find((p) => distance(p, v) < 1e-4)?.label;
  const arm = (d: DirectionRef) =>
    b.points.find((p) => p.id === d.end)?.label;
  const a = arm(ref.start),
    c = arm(ref.end);
  return vl && a && c && a !== vl && c !== vl && a !== c
    ? a + vl + c
    : undefined;
}

export function resolveObj(b: Board, o: ObjId) {
  if (o.k === "seg") return resolveSeg(b, o);
  if (o.k === "ang") return resolveAngle(b, o);
  return undefined;
}

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

export function lengthOf(b: Board, s: SegId): number | undefined {
  const r = resolveSeg(b, s);
  if (!r) return;
  const v = segmentLength(b, r);
  return Number.isFinite(v) ? v / UNIT : undefined;
}

export function measureOf(b: Board, a: AngId): number | undefined {
  const r = resolveAngle(b, a);
  if (!r) return;
  const v = angleDegrees(b, r);
  return Number.isFinite(v) ? v : undefined;
}

/** Numeric value of a term, or undefined when it contains a free variable. */
export function evaluate(b: Board, t: Term): number | undefined {
  switch (t.k) {
    case "num":
      return t.v;
    case "var":
      return undefined;
    case "len":
      return lengthOf(b, t.seg);
    case "meas":
      return measureOf(b, t.ang);
    case "add": {
      let s = 0;
      for (const x of t.ts) {
        const v = evaluate(b, x);
        if (v === undefined) return;
        s += v;
      }
      return s;
    }
    case "mul": {
      let s = 1;
      for (const x of t.ts) {
        const v = evaluate(b, x);
        if (v === undefined) return;
        s *= v;
      }
      return s;
    }
    case "neg": {
      const v = evaluate(b, t.t);
      return v === undefined ? undefined : -v;
    }
    case "div": {
      const n = evaluate(b, t.n),
        d = evaluate(b, t.d);
      return n === undefined || d === undefined || Math.abs(d) < 1e-12
        ? undefined
        : n / d;
    }
  }
}

// ---------------------------------------------------------------------------
// Positional predicates
// ---------------------------------------------------------------------------

export function isCollinear(b: Board, labels: string[]): boolean {
  const ps = labels.map((l) => byLabel(b, l));
  if (ps.some((p) => !p) || ps.length < 3) return ps.length < 3;
  const [p0, p1] = [ps[0]!, ps[ps.length - 1]!];
  if (distance(p0, p1) < POS) return false;
  return ps.every((p) => projection(p!, p0, p1, "line").distance < 1e-4);
}

export function isBetween(b: Board, p: string, a: string, c: string): boolean {
  const P = byLabel(b, p),
    A = byLabel(b, a),
    C = byLabel(b, c);
  if (!P || !A || !C) return false;
  const pr = projection(P, A, C, "segment");
  return pr.distance < 1e-4 && pr.t > 1e-6 && pr.t < 1 - 1e-6;
}

export function isMidpoint(b: Board, p: string, s: SegId, tol: Tol = EXACT): boolean {
  if (!isBetween(b, p, s.a, s.b)) return false;
  const P = byLabel(b, p)!,
    A = byLabel(b, s.a)!,
    B = byLabel(b, s.b)!;
  return Math.abs(distance(A, P) - distance(P, B)) < tol.len * UNIT;
}

function armAngles(b: Board, r: AngleRef) {
  const s = direction(b, r, r.start),
    e = direction(b, r, r.end);
  return s === undefined || e === undefined ? undefined : { s, e };
}

export function isInterior(b: Board, p: string, a: AngId): boolean {
  const r = resolveAngle(b, a),
    P = byLabel(b, p);
  if (!r || !P) return false;
  const v = vertex(b, r.vertex),
    arms = armAngles(b, r);
  if (!v || !arms || distance(v, P) < POS) return false;
  const t = Math.atan2(P.y - v.y, P.x - v.x);
  const sweep = mod(arms.e - arms.s);
  const rel = mod(t - arms.s);
  return rel > 1e-6 && rel < sweep - 1e-6;
}

export function isVertical(b: Board, a: AngId, c: AngId): boolean {
  const ra = resolveAngle(b, a),
    rc = resolveAngle(b, c);
  if (!ra || !rc || angleKey(ra, b) === angleKey(rc, b)) return false;
  const va = vertex(b, ra.vertex),
    vc = vertex(b, rc.vertex),
    aa = armAngles(b, ra),
    ac = armAngles(b, rc);
  if (!va || !vc || !aa || !ac || distance(va, vc) > POS) return false;
  const opp = (x: number, y: number) =>
    Math.abs(mod(x + Math.PI - y + Math.PI) - Math.PI) < 1e-6;
  return (
    (opp(aa.s, ac.s) && opp(aa.e, ac.e)) || (opp(aa.s, ac.e) && opp(aa.e, ac.s))
  );
}

export function isAdjacent(b: Board, a: AngId, c: AngId): boolean {
  const ra = resolveAngle(b, a),
    rc = resolveAngle(b, c);
  if (!ra || !rc || angleKey(ra, b) === angleKey(rc, b)) return false;
  const va = vertex(b, ra.vertex),
    vc = vertex(b, rc.vertex),
    aa = armAngles(b, ra),
    ac = armAngles(b, rc);
  if (!va || !vc || !aa || !ac || distance(va, vc) > POS) return false;
  const same = (x: number, y: number) =>
    Math.abs(mod(x - y + Math.PI) - Math.PI) < 1e-6;
  // Share an arm, and the interiors do not overlap.
  const shares =
    same(aa.e, ac.s) || same(aa.s, ac.e) || same(aa.s, ac.s) || same(aa.e, ac.e);
  if (!shares) return false;
  const sweepA = mod(aa.e - aa.s),
    sweepC = mod(ac.e - ac.s);
  const mid = (st: number, sw: number) => mod(st + sw / 2);
  const inside = (t: number, st: number, sw: number) => mod(t - st) < sw - 1e-6;
  return (
    !inside(mid(ac.s, sweepC), aa.s, sweepA) &&
    !inside(mid(aa.s, sweepA), ac.s, sweepC)
  );
}

export function isLinearPair(b: Board, a: AngId, c: AngId): boolean {
  if (!isAdjacent(b, a, c)) return false;
  const ma = measureOf(b, a),
    mc = measureOf(b, c);
  if (ma === undefined || mc === undefined) return false;
  if (Math.abs(ma + mc - 180) > 1e-4) return false;
  // The outer sides must form a straight line, which for adjacent angles
  // summing to 180 is exactly the non-shared arms being opposite rays.
  const ra = resolveAngle(b, a)!,
    rc = resolveAngle(b, c)!,
    aa = armAngles(b, ra)!,
    ac = armAngles(b, rc)!;
  const same = (x: number, y: number) =>
    Math.abs(mod(x - y + Math.PI) - Math.PI) < 1e-6;
  const outerA = same(aa.e, ac.s) || same(aa.e, ac.e) ? aa.s : aa.e;
  const outerC = same(ac.s, aa.s) || same(ac.s, aa.e) ? ac.e : ac.s;
  return Math.abs(mod(outerA + Math.PI - outerC + Math.PI) - Math.PI) < 1e-5;
}

export function isBisector(b: Board, by: ObjId, of: ObjId): boolean {
  if (of.k === "ang" && (by.k === "ray" || by.k === "seg" || by.k === "line")) {
    const through = by.k === "ray" ? by.through : by.k === "seg" ? by.b : by.b;
    const parts = splitLabels(of.name);
    if (parts.length !== 3) return false;
    const [x, v, y] = parts;
    if (!isInterior(b, through, of)) return false;
    const m1 = measureOf(b, { k: "ang", name: x + v + through }),
      m2 = measureOf(b, { k: "ang", name: through + v + y });
    return m1 !== undefined && m2 !== undefined && Math.abs(m1 - m2) < 1e-4;
  }
  if (of.k === "seg") {
    // A bisector of a segment passes through its midpoint.
    const mid = b.points.find(
      (p) =>
        isMidpoint(b, p.label, of) &&
        (by.k === "pt"
          ? by.p === p.label
          : by.k === "ray"
            ? by.from === p.label || by.through === p.label
            : by.k === "seg" || by.k === "line"
              ? by.a === p.label || by.b === p.label
              : false),
    );
    return !!mid;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Marked facts: what the figure actually asserts
// ---------------------------------------------------------------------------

const congruentPairs = (b: Board) => {
  const segs: string[][] = [],
    angs: string[][] = [];
  for (const c of b.constraints as Constraint[]) {
    if (c.kind === "equalLength") segs.push(c.segments.map(segmentKey));
    if (c.kind === "equalAngle") angs.push(c.angles.map((a) => angleKey(a, b)));
  }
  return { segs, angs };
};

function inSameGroup(groups: string[][], a: string, c: string) {
  return groups.some((g) => g.includes(a) && g.includes(c));
}

/** Is the statement asserted by the figure's marks and declared constraints? */
export function marked(b: Board, s: Statement): boolean {
  switch (s.k) {
    case "collinear":
      return isCollinear(b, s.pts);
    case "between":
      return isBetween(b, s.p, s.a, s.c);
    case "interior":
      return isInterior(b, s.p, s.ang);
    case "adjacent":
      return isAdjacent(b, s.a, s.b);
    case "vertical":
      return isVertical(b, s.a, s.b);
    case "linearPair":
      return isLinearPair(b, s.a, s.b);
    case "cong": {
      const g = congruentPairs(b);
      if (s.l.k === "seg" && s.r.k === "seg") {
        const ra = resolveSeg(b, s.l),
          rb = resolveSeg(b, s.r);
        return (
          !!ra && !!rb && inSameGroup(g.segs, segmentKey(ra), segmentKey(rb))
        );
      }
      if (s.l.k === "ang" && s.r.k === "ang") {
        const ra = resolveAngle(b, s.l),
          rb = resolveAngle(b, s.r);
        return (
          !!ra && !!rb && inSameGroup(g.angs, angleKey(ra, b), angleKey(rb, b))
        );
      }
      return false;
    }
    case "angleClass":
      if (s.cls !== "right") return false;
      return b.constraints.some(
        (c) =>
          c.kind === "angle" &&
          Math.abs(c.value - 90) < 1e-6 &&
          angleKey(c.angle, b) === angleKey(resolveAngle(b, s.ang)!, b),
      );
    case "midpoint": {
      // A midpoint is marked when the two halves carry matching ticks.
      const g = congruentPairs(b);
      const l = resolveSeg(b, { k: "seg", a: s.seg.a, b: s.p }),
        r = resolveSeg(b, { k: "seg", a: s.p, b: s.seg.b });
      return (
        !!l && !!r && inSameGroup(g.segs, segmentKey(l), segmentKey(r)) &&
        isBetween(b, s.p, s.seg.a, s.seg.b)
      );
    }
    case "perp":
      return b.constraints.some((c) => c.kind === "perpendicular");
    case "parallel":
      return b.constraints.some((c) => c.kind === "parallel");
    default:
      return false;
  }
}

/** Does an equation mention an angle measure? Decides which tolerance applies. */
const aboutAngles = (s: Statement) =>
  s.k === "eq" && /"k":"meas"/.test(JSON.stringify(s));

/** Is the statement true of the figure's current coordinates? */
export function holds(b: Board, s: Statement, tol: Tol = EXACT): boolean {
  switch (s.k) {
    case "eq": {
      const l = evaluate(b, s.l),
        r = evaluate(b, s.r);
      const eps = aboutAngles(s) ? tol.deg : tol.len;
      return l !== undefined && r !== undefined && Math.abs(l - r) < eps;
    }
    case "cong": {
      if (s.l.k === "seg" && s.r.k === "seg") {
        const a = lengthOf(b, s.l),
          c = lengthOf(b, s.r);
        return a !== undefined && c !== undefined && Math.abs(a - c) < tol.len;
      }
      if (s.l.k === "ang" && s.r.k === "ang") {
        const a = measureOf(b, s.l),
          c = measureOf(b, s.r);
        return a !== undefined && c !== undefined && Math.abs(a - c) < tol.deg;
      }
      return false;
    }
    case "supp":
    case "comp": {
      const a = measureOf(b, s.a),
        c = measureOf(b, s.b);
      const want = s.k === "supp" ? 180 : 90;
      return a !== undefined && c !== undefined && Math.abs(a + c - want) < tol.deg;
    }
    case "vertical":
      return isVertical(b, s.a, s.b);
    case "linearPair":
      return isLinearPair(b, s.a, s.b);
    case "adjacent":
      return isAdjacent(b, s.a, s.b);
    case "midpoint":
      return isMidpoint(b, s.p, s.seg, tol);
    case "between":
      return isBetween(b, s.p, s.a, s.c);
    case "collinear":
      return isCollinear(b, s.pts);
    case "interior":
      return isInterior(b, s.p, s.ang);
    case "bisects":
      return isBisector(b, s.by, s.of);
    case "angleClass": {
      const m = measureOf(b, s.ang);
      if (m === undefined) return false;
      if (s.cls === "right") return Math.abs(m - 90) < tol.deg;
      if (s.cls === "straight") return Math.abs(m - 180) < tol.deg;
      if (s.cls === "acute") return m > tol.deg && m < 90 - tol.deg;
      return m > 90 + tol.deg && m < 180 - tol.deg;
    }
    case "perp": {
      const a = resolveObj(b, s.a),
        c = resolveObj(b, s.b);
      return !!a && !!c && perpendicularByCoords(b, s);
    }
    case "parallel":
      return parallelByCoords(b, s);
  }
}

function edgeDirection(b: Board, o: ObjId) {
  const pick =
    o.k === "seg"
      ? [o.a, o.b]
      : o.k === "line"
        ? [o.a, o.b]
        : o.k === "ray"
          ? [o.from, o.through]
          : undefined;
  if (!pick) return;
  const p = byLabel(b, pick[0]),
    q = byLabel(b, pick[1]);
  if (!p || !q || distance(p, q) < POS) return;
  return Math.atan2(q.y - p.y, q.x - p.x);
}

function perpendicularByCoords(b: Board, s: { a: ObjId; b: ObjId }) {
  const x = edgeDirection(b, s.a),
    y = edgeDirection(b, s.b);
  if (x === undefined || y === undefined) return false;
  return Math.abs(mod(Math.abs(x - y), Math.PI) - Math.PI / 2) < 1e-4;
}

function parallelByCoords(b: Board, s: { a: ObjId; b: ObjId }) {
  const x = edgeDirection(b, s.a),
    y = edgeDirection(b, s.b);
  if (x === undefined || y === undefined) return false;
  return mod(Math.abs(x - y), Math.PI) < 1e-4 ||
    Math.abs(mod(Math.abs(x - y), Math.PI) - Math.PI) < 1e-4;
}

/** Objects named by a statement that the figure cannot resolve. */
export function unresolved(b: Board, objs: ObjId[]): ObjId[] {
  return objs.filter((o) => {
    if (o.k === "pt") return !byLabel(b, o.p);
    if (o.k === "seg") return !resolveSeg(b, o);
    if (o.k === "ang") return !resolveAngle(b, o);
    return false;
  });
}

export const keyOf = objKey;
export const fullTurn = TAU;
