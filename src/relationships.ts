import {
  type Board,
  type AngleRef,
  type Selection,
  angleRadians,
  angleDegrees,
  direction,
  vertex,
  distance,
  mod,
  TAU,
  uid,
  angleKey,
  segmentKey,
  endpoints,
  projection,
  intersection,
} from "./model";

// Matching classes are connected components, so shared members merge transitively.
export function markingGroups(board: Board, kind: "segments" | "angles") {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    const p = parent.get(x)!;
    if (p === x) return x;
    const r = find(p);
    parent.set(x, r);
    return r;
  };
  for (const c of board.constraints) {
    const keys =
      kind === "segments" && c.kind === "equalLength"
        ? c.segments.map(segmentKey)
        : kind === "angles" && c.kind === "equalAngle"
          ? c.angles.map((a) => angleKey(a, board))
          : [];
    for (const key of keys) parent.set(find(key), find(keys[0]));
  }
  const classes = new Map<string, number>(),
    result = new Map<string, number>();
  for (const key of parent.keys()) {
    const root = find(key);
    if (!classes.has(root)) classes.set(root, classes.size + 1);
    result.set(key, classes.get(root)!);
  }
  return result;
}
const close = (a: number, b: number) =>
  Math.abs(mod(a - b + Math.PI) - Math.PI) < 1e-6;
export function combineAngles(board: Board, angles: AngleRef[]): AngleRef {
  if (angles.length < 2)
    throw Error("Select two or more consecutive angle regions.");
  const v = vertex(board, angles[0].vertex);
  if (
    !v ||
    angles.some(
      (a) =>
        !vertex(board, a.vertex) ||
        distance(v, vertex(board, a.vertex)!) > 1e-6,
    )
  )
    throw Error("Combined angles must share a vertex.");
  const regions = angles.map((a) => ({
    a,
    start: direction(board, a, a.sweep === 1 ? a.start : a.end)!,
    end: direction(board, a, a.sweep === 1 ? a.end : a.start)!,
    size: angleRadians(board, a),
  }));
  const total = regions.reduce((s, r) => s + r.size, 0);
  if (
    regions.some((r) => !Number.isFinite(r.size) || r.size < 1e-8) ||
    total > TAU + 1e-6
  )
    throw Error("The selected regions overlap or repeat.");
  for (let i = 0; i < regions.length; i++)
    for (let j = i + 1; j < regions.length; j++) {
      const a = regions[i],
        b = regions[j],
        d = mod(b.start - a.start);
      if (d < a.size - 1e-6 || mod(a.start - b.start) < b.size - 1e-6)
        throw Error("The selected regions overlap or repeat.");
    }
  const first =
    regions.find(
      (r) => !regions.some((q) => q !== r && close(q.end, r.start)),
    ) || regions[0];
  let last = first;
  const used = new Set([first]);
  while (used.size < regions.length) {
    const next = regions.find((r) => !used.has(r) && close(last.end, r.start));
    if (!next) throw Error("There is a gap between the selected regions.");
    used.add(next);
    last = next;
  }
  const start = first.a.sweep === 1 ? first.a.start : first.a.end,
    end = last.a.sweep === 1 ? last.a.end : last.a.start;
  return {
    id: uid(),
    vertex: angles[0].vertex,
    start,
    end: Math.abs(total - TAU) < 1e-6 ? start : end,
    sweep: 1,
    full: Math.abs(total - TAU) < 1e-6,
  };
}
export function selectionFacts(board: Board, s: Selection): string[] {
  const facts: string[] = [];
  if (s.angles.length === 1) {
    const d = angleDegrees(board, s.angles[0]);
    facts.push(
      d < 90 - 1e-4
        ? "Acute angle"
        : Math.abs(d - 90) < 1e-4
          ? "Right angle"
          : d < 180 - 1e-4
            ? "Obtuse angle"
            : Math.abs(d - 180) < 1e-4
              ? "Straight angle"
              : d < 360 - 1e-4
                ? "Reflex angle"
                : "Full turn",
    );
  }
  if (s.angles.length === 2) {
    const [a, b] = s.angles,
      av = vertex(board, a.vertex),
      bv = vertex(board, b.vertex),
      ad = angleRadians(board, a),
      bd = angleRadians(board, b);
    if (Math.abs(ad + bd - Math.PI / 2) < 1e-5)
      facts.push("Complementary measures");
    if (Math.abs(ad + bd - Math.PI) < 1e-5)
      facts.push("Supplementary measures");
    if (Math.abs(ad - bd) < 1e-5) facts.push("Equal measures");
    if (av && bv && distance(av, bv) < 1e-6) {
      const as = direction(board, a, a.start)!,
        ae = direction(board, a, a.end)!,
        bs = direction(board, b, b.start)!,
        be = direction(board, b, b.end)!;
      if (
        ad < Math.PI &&
        bd < Math.PI &&
        ((close(as + Math.PI, bs) && close(ae + Math.PI, be)) ||
          (close(as + Math.PI, be) && close(ae + Math.PI, bs)))
      )
        facts.push("Vertical angles");
      try {
        const c = combineAngles(board, [a, b]);
        if (!c.full) {
          facts.push("Adjacent regions");
          if (Math.abs(ad + bd - Math.PI) < 1e-5) facts.push("Linear pair");
        }
      } catch {
        /* A disconnected pair may still be supplementary. */
      }
    }
  }
  if (s.points.length === 3) {
    const p = s.points.map((id) => board.points.find((p) => p.id === id)!);
    if (
      p.every(Boolean) &&
      projection(p[1], p[0], p[2], "line").distance < 1e-6
    ) {
      facts.push("Collinear points");
      if (projection(p[1], p[0], p[2]).distance < 1e-6)
        facts.push(`${p[1].label} is between ${p[0].label} and ${p[2].label}`);
    }
  }
  return facts;
}
// Slab clipping avoids missing a short crossing with sampled marquee tests.
export function touchesRect(
  a: { x: number; y: number },
  b: { x: number; y: number },
  r: { x1: number; x2: number; y1: number; y2: number },
  kind = "segment",
) {
  let lo = kind === "line" ? -Infinity : 0,
    hi = kind === "segment" ? 1 : Infinity;
  for (const [p, d, min, max] of [
    [a.x, b.x - a.x, r.x1, r.x2],
    [a.y, b.y - a.y, r.y1, r.y2],
  ]) {
    if (Math.abs(d) < 1e-12) {
      if (p < min || p > max) return false;
      continue;
    }
    const t1 = (min - p) / d,
      t2 = (max - p) / d;
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
    if (lo > hi) return false;
  }
  return true;
}

// A shared endpoint gives a unique ordinary angle, including across reversed edge order.
export function angleBetweenSegments(
  board: Board,
  selected: import("./model").SegmentRef[],
): AngleRef | undefined {
  if (selected.length !== 2) return;
  const edges = selected.map((s) => board.edges.find((e) => e.id === s.edge));
  if (
    edges.some(
      (e, i) =>
        !e ||
        e.kind === "circle" ||
        (e.kind !== "segment" && (!selected[i].a || !selected[i].b)),
    )
  )
    return;
  const pair = selected.map((s) => endpoints(board, s));
  if (!pair[0] || !pair[1]) return;
  const common = pair[0].filter((p) => pair[1]!.some((q) => q.id === p.id));
  if (common.length !== 1) return;
  const v = common[0],
    outer = pair.map((ps) => ps!.find((p) => p.id !== v.id)!);
  if (outer.some((p) => distance(p, v) < 1e-7)) return;
  const refs = outer.map((p, i) => {
    const e = edges[i]!,
      a = board.points.find((p) => p.id === e.a)!,
      b = board.points.find((p) => p.id === e.b)!;
    return {
      edge: e.id,
      end: p.id,
      sign: ((p.x - v.x) * (b.x - a.x) + (p.y - v.y) * (b.y - a.y) > 0
        ? 1
        : -1) as 1 | -1,
    };
  });
  let a: AngleRef = {
    id:
      "pair:" +
      v.id +
      ":" +
      selected
        .map((s) => s.edge)
        .sort()
        .join(":"),
    vertex: { point: v.id },
    start: refs[0],
    end: refs[1],
    sweep: 1,
  };
  const d = angleRadians(board, a);
  if (d < 1e-7 || TAU - d < 1e-7) return;
  if (
    d > Math.PI + 1e-8 ||
    (Math.abs(d - Math.PI) < 1e-8 && a.start.edge > a.end.edge)
  )
    a = { ...a, start: a.end, end: a.start };
  const existing = [
    ...board.angles,
    ...board.constraints.flatMap((c) =>
      "angle" in c ? [c.angle] : "angles" in c ? c.angles : [],
    ),
  ];
  return (
    existing.find(
      (x) =>
        "point" in x.vertex &&
        x.vertex.point === v.id &&
        [x.start.edge, x.end.edge].sort().join(":") ===
          selected
            .map((s) => s.edge)
            .sort()
            .join(":") &&
        Math.abs(angleRadians(board, x) - angleRadians(board, a)) < 1e-7,
    ) || a
  );
}

export function segmentPieces(
  board: Board,
  edgeId: string,
): import("./model").SegmentRef[] {
  const e = board.edges.find((e) => e.id === edgeId);
  if (!e || e.kind === "circle") return [{ edge: edgeId }];
  const [a, b] = endpoints(board, { edge: edgeId })!;
  const cuts = board.points
    .map((p) => {
      // Declared incidence survives the solver's small positional residuals.
      const crossing = p.crossing?.includes(edgeId)
        ? intersection(board, p.crossing)
        : undefined;
      const projected = projection(crossing || p, a, b, "line");
      const attached = p.on?.edge === edgeId;
      const t = attached ? p.on!.t : projected.t;
      const inDomain =
        e.kind === "line" ||
        (t >= -1e-8 && (e.kind === "ray" || t <= 1 + 1e-8));
      return {
        p,
        t,
        incident:
          inDomain && (attached || !!crossing || projected.distance < 1e-6),
      };
    })
    .filter((x) => x.incident)
    .sort((x, y) => x.t - y.t);
  const unique = cuts.filter(
    (x, i) => i === 0 || Math.abs(x.t - cuts[i - 1].t) > 1e-8,
  );
  if (unique.length <= 2 && e.kind === "segment") return [{ edge: edgeId }];
  return unique
    .slice(1)
    .map((x, i) => ({ edge: edgeId, a: unique[i].p.id, b: x.p.id }));
}
export function segmentPieceAt(
  board: Board,
  edgeId: string,
  p: { x: number; y: number },
): import("./model").SegmentRef {
  const e = board.edges.find((e) => e.id === edgeId);
  if (!e || e.kind === "circle") return { edge: edgeId };
  const ends = endpoints(board, { edge: edgeId })!;
  const t = projection(p, ...ends, e.kind).t;
  return (
    segmentPieces(board, edgeId).find((s) => {
      if (!s.a && !s.b) return true;
      const ps = endpoints(board, s)!;
      const ts = ps.map((v) =>
        v.on?.edge === edgeId
          ? v.on.t
          : projection(
              v.crossing?.includes(edgeId)
                ? intersection(board, v.crossing) || v
                : v,
              ...ends,
              "line",
            ).t,
      );
      return t >= Math.min(...ts) - 1e-8 && t <= Math.max(...ts) + 1e-8;
    }) || { edge: edgeId }
  );
}

// Radius is a screen-space layout choice, independent of angle constraints.
export function angleDisplayRadii(board: Board, angles: AngleRef[]) {
  const result = new Map<string, number>();
  const marks = markingGroups(board, "angles");
  const placed: { angle: AngleRef; radius: number }[] = [];
  const overlaps = (a: AngleRef, b: AngleRef) => {
    const av = vertex(board, a.vertex), bv = vertex(board, b.vertex);
    if (!av || !bv || distance(av, bv) > 1e-4) return false;
    const start = (x: AngleRef) => mod(direction(board, x, x.sweep === 1 ? x.start : x.end)!);
    const as = start(a), bs = start(b), al = angleRadians(board, a), bl = angleRadians(board, b);
    return [-TAU, 0, TAU].some(offset =>
      Math.min(as + al, bs + offset + bl) - Math.max(as, bs + offset) > 1e-6);
  };
  for (const angle of [...angles].sort((a,b) => angleRadians(board,a)-angleRadians(board,b) || angleKey(a,board).localeCompare(angleKey(b,board)))) {
    const key = angleKey(angle,board);
    if (result.has(key)) continue;
    let radius = angle.radius || 44;
    for (const inner of placed) {
      if (overlaps(angle,inner.angle)) radius = Math.max(radius, inner.radius + 32 + 5 * (marks.get(angleKey(inner.angle,board)) || 0));
    }
    result.set(key,radius);
    placed.push({angle,radius});
  }
  return result;
}
