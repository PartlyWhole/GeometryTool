import {
  type Board,
  type Constraint,
  type XY,
  clone,
  point,
  edge,
  vertex,
  angleRadians,
  segmentLength,
  endpoints,
  mod,
  distance,
  TAU,
  intersection,
  direction,
} from "./model";
export type SolveResult = {
  ok: boolean;
  board: Board;
  error: number;
  message: string;
  iterations: number;
};
export function constraintPoints(b: Board, c: Constraint): string[] {
  const ids = new Set<string>();
  const addEdge = (id: string) => {
    const e = edge(b, id);
    if (e) {
      ids.add(e.a);
      ids.add(e.b);
    }
  };
  const angle = (a: import("./model").AngleRef) => {
    if ("point" in a.vertex) ids.add(a.vertex.point);
    else a.vertex.intersection.forEach(addEdge);
    addEdge(a.start.edge);
    addEdge(a.end.edge);
    ids.add(a.start.end);
    ids.add(a.end.end);
  };
  if ("segments" in c)
    c.segments.forEach((s) => {
      addEdge(s.edge);
      if (s.a) ids.add(s.a);
      if (s.b) ids.add(s.b);
    });
  if ("segment" in c) {
    addEdge(c.segment.edge);
    if (c.segment.a) ids.add(c.segment.a);
    if (c.segment.b) ids.add(c.segment.b);
  }
  if ("angle" in c) angle(c.angle);
  if ("angles" in c) c.angles.forEach(angle);
  if ("edges" in c) c.edges.forEach(addEdge);
  if (c.kind === "bisect") ids.add(c.point);
  return [...ids];
}
const wrap = (v: number) => mod(v + Math.PI) - Math.PI;
export function residuals(b: Board, c: Constraint): number[] {
  switch (c.kind) {
    case "equalLength": {
      const l = segmentLength(b, c.segments[0]);
      return c.segments.slice(1).map((s) => segmentLength(b, s) - l);
    }
    case "length":
      return [segmentLength(b, c.segment) - c.value];
    case "angle": {
      const a = angleRadians(b, c.angle);
      return [100 * wrap(a - (c.value * Math.PI) / 180)];
    }
    case "equalAngle": {
      const a = angleRadians(b, c.angles[0]);
      return c.angles.slice(1).map((x) => 100 * wrap(angleRadians(b, x) - a));
    }
    case "sumAngle":
      return [
        100 *
          (c.angles.reduce((s, a) => s + angleRadians(b, a), 0) -
            (c.value * Math.PI) / 180),
      ];
    case "parallel":
    case "perpendicular": {
      const es = c.edges.map((id) => edge(b, id));
      if (es.some((e) => !e)) return [NaN];
      const vectors = es.map((e) => {
        const a = point(b, e!.a)!,
          z = point(b, e!.b)!;
        const l = distance(a, z);
        return [(z.x - a.x) / l, (z.y - a.y) / l];
      });
      const [u, v] = vectors;
      return [
        100 *
          (c.kind === "parallel"
            ? u[0] * v[1] - u[1] * v[0]
            : u[0] * v[0] + u[1] * v[1]),
      ];
    }
    case "bisect": {
      const v = vertex(b, c.angle.vertex),
        p = point(b, c.point);
      if (!v || !p) return [NaN];
      const q = point(b, c.angle.start.end);
      if (!q) return [NaN];
      const start = direction(b, c.angle, c.angle.start);
      if (start === undefined) return [NaN];
      return [
        100 *
          wrap(
            Math.atan2(p.y - v.y, p.x - v.x) -
              start -
              (c.angle.sweep * angleRadians(b, c.angle)) / 2,
          ),
      ];
    }
  }
}
export function boardError(b: Board) {
  let max = 0;
  for (const c of b.constraints)
    for (const r of residuals(b, c)) {
      if (!Number.isFinite(r)) return Infinity;
      max = Math.max(max, Math.abs(r));
    }
  for (const p of b.points)
    if (p.on) {
      const e = edge(b, p.on.edge),
        a = e && point(b, e.a),
        z = e && point(b, e.b);
      if (!a || !z) return Infinity;
      const t = p.on.midpoint?.valueOf() ? 0.5 : p.on.t;
      max = Math.max(
        max,
        Math.abs(p.x - a.x - (z.x - a.x) * t),
        Math.abs(p.y - a.y - (z.y - a.y) * t),
      );
    }
  for (const p of b.points)
    if (p.crossing) {
      const v = intersection(b, p.crossing);
      if (!v) return Infinity;
      max = Math.max(max, distance(p, v));
    }
  return max;
}
function analyticConflict(b: Board) {
  for (const c of b.constraints) {
    if (
      c.kind === "angle" &&
      (!Number.isFinite(c.value) || c.value <= 0 || c.value > 360)
    )
      return "Use an angle greater than 0° and at most 360°.";
    if (c.kind === "length" && (!Number.isFinite(c.value) || c.value <= 0))
      return "A segment needs a positive length.";
    if (c.kind === "equalLength") {
      const fixed = c.segments
        .map((s) =>
          b.constraints.find(
            (x) =>
              x.kind === "length" &&
              JSON.stringify(x.segment) === JSON.stringify(s),
          ),
        )
        .filter(Boolean) as Extract<Constraint, { kind: "length" }>[];
      if (fixed.some((x) => Math.abs(x.value - fixed[0].value) > 1e-8))
        return "These segments have different fixed lengths. Release one length before making them congruent.";
    }
  }
  return "";
}
export function solve(
  input: Board,
  targets: Record<string, XY> = {},
  budget = 400,
): SolveResult {
  const b = clone(input),
    message = analyticConflict(b);
  if (message)
    return { ok: false, board: input, error: Infinity, message, iterations: 0 };
  const weights = new Map(
    b.points.map((p) => [p.id, p.pinned ? 0 : targets[p.id] ? 0.015 : 1]),
  );
  for (const [id, v] of Object.entries(targets)) {
    const p = point(b, id);
    if (p && !p.pinned) {
      p.x = v.x;
      p.y = v.y;
    }
  }
  const groups = b.constraints.map((c) => ({
    ids: constraintPoints(b, c),
    evaluate: () => residuals(b, c),
  }));
  for (const p of b.points)
    if (p.on) {
      const e = edge(b, p.on.edge);
      if (e) {
        const a = point(b, e.a)!,
          z = point(b, e.b)!;
        groups.unshift({
          ids: [p.id, e.a, e.b],
          evaluate: () => {
            const t = p.on!.midpoint ? 0.5 : p.on!.t;
            return [p.x - a.x - (z.x - a.x) * t, p.y - a.y - (z.y - a.y) * t];
          },
        });
      }
    }
  for (const p of b.points)
    if (p.crossing) {
      const ids = p.crossing.flatMap((id) => {
        const e = edge(b, id);
        return e ? [e.a, e.b] : [];
      });
      groups.unshift({
        ids: [...new Set([p.id, ...ids])],
        evaluate: () => {
          const v = intersection(b, p.crossing!);
          return v ? [p.x - v.x, p.y - v.y] : [NaN];
        },
      });
    }
  const deadline = performance.now() + budget;
  let error = Infinity,
    iterations = 0;
  for (; iterations < 220; iterations++) {
    if (performance.now() > deadline) break;
    for (const g of groups) {
      const values = g.evaluate();
      for (let k = 0; k < values.length; k++) {
        const r = g.evaluate()[k];
        if (!Number.isFinite(r)) continue;
        if (Math.abs(r) < 1e-6) continue;
        const grads: {
          p: import("./model").Point;
          axis: "x" | "y";
          grad: number;
          w: number;
        }[] = [];
        let norm = 0;
        for (const id of g.ids) {
          const p = point(b, id),
            w = weights.get(id) || 0;
          if (!p || !w) continue;
          for (const axis of ["x", "y"] as const) {
            const old = p[axis],
              h = 1e-4;
            p[axis] = old + h;
            const f = g.evaluate()[k];
            p[axis] = old;
            const grad = (f - r) / h;
            if (Number.isFinite(grad)) {
              grads.push({ p, axis, grad, w });
              norm += grad * grad * w;
            }
          }
        }
        if (norm < 1e-16) continue;
        const factor = Math.max(-300, Math.min(300, r)) / (norm + 1e-12);
        for (const v of grads) v.p[v.axis] -= factor * v.grad * v.w;
      }
    }
    error = boardError(b);
    if (error < 1e-4) break;
  }
  const degenerate = b.edges.some((e) => {
    const a = point(b, e.a),
      z = point(b, e.b);
    return !a || !z || distance(a, z) < 1e-4;
  });
  const ok =
    error < 1e-3 &&
    !degenerate &&
    b.points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  return {
    ok,
    board: ok ? b : input,
    error,
    message: ok
      ? ""
      : degenerate
        ? "This move would collapse a segment."
        : "Could not resolve this edit while keeping the existing relationships. Release a relationship in the inspector or try a smaller move.",
    iterations,
  };
}
