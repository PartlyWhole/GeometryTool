export type XY = { x: number; y: number };
export type Point = XY & {
  id: string;
  label: string;
  pinned?: boolean;
  labelOffset?: XY;
  crossing?: [string, string];
  on?: { edge: string; t: number; midpoint?: boolean };
};
export type Edge = {
  id: string;
  a: string;
  b: string;
  kind: "segment" | "ray" | "line" | "circle";
  hidden?: boolean;
};
export type SegmentRef = { edge: string; a?: string; b?: string };
export type JunctionRef =
  { point: string } | { intersection: [string, string] };
export type DirectionRef = { edge: string; end: string; sign?: 1 | -1 };
export type AngleRef = {
  id: string;
  vertex: JunctionRef;
  start: DirectionRef;
  end: DirectionRef;
  sweep: 1 | -1;
  full?: boolean;
  radius?: number;
  label?: string;
  expression?: string;
};
export type Constraint =
  | { id: string; kind: "equalLength"; segments: SegmentRef[] }
  | { id: string; kind: "length"; segment: SegmentRef; value: number }
  | { id: string; kind: "angle"; angle: AngleRef; value: number; input: string }
  | { id: string; kind: "equalAngle"; angles: AngleRef[] }
  | { id: string; kind: "sumAngle"; angles: AngleRef[]; value: number }
  | { id: string; kind: "parallel" | "perpendicular"; edges: [string, string] }
  | { id: string; kind: "bisect"; angle: AngleRef; point: string };
export type Note = { id: string; position: XY; text: string };
export type Board = {
  version: 1;
  id: string;
  title: string;
  points: Point[];
  edges: Edge[];
  angles: AngleRef[];
  constraints: Constraint[];
  notes: Note[];
  equations: string[];
};
export type Selection = {
  points: string[];
  segments: SegmentRef[];
  angles: AngleRef[];
  notes: string[];
};
export const emptySelection = (): Selection => ({
  points: [],
  segments: [],
  angles: [],
  notes: [],
});
export const uid = () => crypto.randomUUID();
export const blank = (): Board => ({
  version: 1,
  id: uid(),
  title: "Untitled board",
  points: [],
  edges: [],
  angles: [],
  constraints: [],
  notes: [],
  equations: [],
});
export const clone = <T>(x: T): T => structuredClone(x);
export const TAU = 2 * Math.PI;
export const mod = (n: number, m = TAU) => ((n % m) + m) % m;
export const distance = (a: XY, b: XY) => Math.hypot(a.x - b.x, a.y - b.y);
export const point = (b: Board, id: string) =>
  b.points.find((p) => p.id === id);
export const edge = (b: Board, id: string) => b.edges.find((e) => e.id === id);
export const label = (b: Board, id: string) => point(b, id)?.label || "?";
export function nextLabel(b: Board) {
  for (let n = 0; ; n++) {
    const s =
      n < 26
        ? String.fromCharCode(65 + n)
        : String.fromCharCode(65 + (n % 26)) + Math.floor(n / 26);
    if (!b.points.some((p) => p.label === s)) return s;
  }
}
export function addPoint(b: Board, p: XY, on?: Point["on"]) {
  const v: Point = {
    id: uid(),
    label: nextLabel(b),
    ...p,
    ...(on ? { on } : {}),
  };
  b.points.push(v);
  return v;
}
export function addEdge(
  b: Board,
  a: string,
  c: string,
  kind: Edge["kind"] = "segment",
) {
  if (a === c) throw Error("Choose two different points.");
  const e: Edge = { id: uid(), a, b: c, kind };
  b.edges.push(e);
  return e;
}
export function endpoints(b: Board, s: SegmentRef): [Point, Point] | undefined {
  const e = edge(b, s.edge);
  if (!e) return;
  const a = point(b, s.a || e.a),
    c = point(b, s.b || e.b);
  return a && c ? [a, c] : undefined;
}
export function segmentKey(s: SegmentRef) {
  return s.edge + ":" + [s.a || "", s.b || ""].sort().join(":");
}
export function segmentName(b: Board, s: SegmentRef) {
  const ends = endpoints(b, s);
  return ends ? ends.map((p) => p.label).join("") : "Unavailable segment";
}
export const segmentLength = (b: Board, s: SegmentRef) => {
  const ps = endpoints(b, s);
  return ps ? distance(...ps) : NaN;
};
export function projection(
  p: XY,
  a: XY,
  b: XY,
  kind: Edge["kind"] = "segment",
) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    d = dx * dx + dy * dy;
  if (d < 1e-16) return { p: a, t: 0, distance: distance(p, a) };
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / d;
  if (kind === "segment") t = Math.max(0, Math.min(1, t));
  if (kind === "ray") t = Math.max(0, t);
  const q = { x: a.x + t * dx, y: a.y + t * dy };
  return { p: q, t, distance: distance(p, q) };
}
export function intersection(
  b: Board,
  ids: [string, string],
  domain = true,
): XY | undefined {
  const e = edge(b, ids[0]),
    f = edge(b, ids[1]);
  if (!e || !f || e.kind === "circle" || f.kind === "circle") return;
  const a = point(b, e.a)!,
    c = point(b, e.b)!,
    d = point(b, f.a)!,
    g = point(b, f.b)!;
  if (!a || !c || !d || !g) return;
  const ux = c.x - a.x,
    uy = c.y - a.y,
    vx = g.x - d.x,
    vy = g.y - d.y,
    det = ux * vy - uy * vx;
  if (
    Math.abs(det) <
    1e-10 * Math.max(1, Math.hypot(ux, uy) * Math.hypot(vx, vy))
  )
    return;
  const t = ((d.x - a.x) * vy - (d.y - a.y) * vx) / det,
    u = ((d.x - a.x) * uy - (d.y - a.y) * ux) / det;
  const inside = (t: number, k: Edge["kind"]) =>
    k === "line" || (k === "ray" ? t >= -1e-8 : t >= -1e-8 && t <= 1 + 1e-8);
  if (domain && (!inside(t, e.kind) || !inside(u, f.kind))) return;
  return { x: a.x + t * ux, y: a.y + t * uy };
}
export function vertex(b: Board, v: JunctionRef) {
  return "point" in v ? point(b, v.point) : intersection(b, v.intersection);
}
export function direction(b: Board, a: AngleRef, d: DirectionRef) {
  if (d.sign) {
    const e = edge(b, d.edge),
      u = e && point(b, e.a),
      v = e && point(b, e.b);
    if (!u || !v || distance(u, v) < 1e-7 || !vertex(b, a.vertex)) return;
    return Math.atan2((v.y - u.y) * d.sign, (v.x - u.x) * d.sign);
  }
  const v = vertex(b, a.vertex),
    p = point(b, d.end);
  if (!v || !p || distance(v, p) < 1e-7 || !edge(b, d.edge)) return;
  return Math.atan2(p.y - v.y, p.x - v.x);
}
export function angleRadians(b: Board, a: AngleRef) {
  const start = direction(b, a, a.start),
    end = direction(b, a, a.end);
  if (start === undefined || end === undefined) return NaN;
  return a.full ? TAU : mod((end - start) * a.sweep);
}
export const angleDegrees = (b: Board, a: AngleRef) =>
  (angleRadians(b, a) * 180) / Math.PI;
// Resolve both declared crossings and coincident named points after an attachment is released.
export function namedAngleVertex(b: Board, ref: JunctionRef) {
  if ("point" in ref) return point(b, ref.point);
  const ids = [...ref.intersection].sort().join("|");
  const declared = b.points.find(p => p.crossing && [...p.crossing].sort().join("|") === ids);
  if (declared) return declared;
  const v = vertex(b, ref);
  return v ? b.points.filter(p => distance(p, v) <= 1e-4)
    .sort((a,c) => distance(a,v)-distance(c,v) || a.id.localeCompare(c.id))[0] : undefined;
}
export function angleKey(a: AngleRef, b?: Board) {
  if (!b) return JSON.stringify([a.vertex, a.start, a.end, a.sweep, !!a.full]);
  const v = vertex(b, a.vertex);
  const p = namedAngleVertex(b, a.vertex);
  const vertexKey = p
    ? ["point", p.id]
    : ["intersection", ...("intersection" in a.vertex ? a.vertex.intersection : []).slice().sort()];
  const arm = (d: DirectionRef) => {
    const e = edge(b, d.edge),
      end = point(b, d.end);
    if (!e || !v || !end) return [d.edge, d.end, d.sign];
    const x = point(b, e.a)!,
      y = point(b, e.b)!;
    const sign =
      d.sign ||
      ((end.x - v.x) * (y.x - x.x) + (end.y - v.y) * (y.y - x.y) >= 0 ? 1 : -1);
    // Endpoint order and which point names a ray do not change its identity.
    return [
      e.a < e.b ? e.a : e.b,
      e.a < e.b ? e.b : e.a,
      sign * (e.a < e.b ? 1 : -1),
    ];
  };
  if (a.full) return JSON.stringify([vertexKey, "full"]);
  const start = arm(a.sweep === 1 ? a.start : a.end),
    end = arm(a.sweep === 1 ? a.end : a.start);
  return JSON.stringify([vertexKey, start, end]);
}
export function angleName(b: Board, a: AngleRef) {
  const named = namedAngleVertex(b, a.vertex);
  const v = named?.label || "(intersection)";
  return `${label(b, a.start.end)}${v}${label(b, a.end.end)}${a.full ? " (full turn)" : a.sweep === -1 ? " (other side)" : ""}`;
}
export type Junction = {
  id: string;
  ref: JunctionRef;
  position: XY;
  directions: { angle: number; ref: DirectionRef }[];
};
export function topology(b: Board): Junction[] {
  const js: Junction[] = b.points.map((p) => ({
    id: p.id,
    ref:
      p.crossing && intersection(b, p.crossing)
        ? { intersection: p.crossing }
        : { point: p.id },
    position: p.crossing ? intersection(b, p.crossing) || p : p,
    directions: [],
  }));
  const lines = b.edges.filter((e) => e.kind !== "circle" && !e.hidden);
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const ids: [string, string] = [lines[i].id, lines[j].id].sort() as [
        string,
        string,
      ];
      const x = intersection(b, ids);
      if (x && !js.some((v) => distance(v.position, x) < 1e-7))
        js.push({
          id: ids.join("/"),
          ref: { intersection: ids },
          position: x,
          directions: [],
        });
    }
  for (const j of js) {
    for (const e of lines) {
      const a = point(b, e.a)!,
        c = point(b, e.b)!;
      const owner = point(b, j.id);
      const declared =
        owner &&
        (owner.id === e.a ||
          owner.id === e.b ||
          owner.on?.edge === e.id ||
          owner.crossing?.includes(e.id));
      if (
        !a ||
        !c ||
        (!declared && projection(j.position, a, c, e.kind).distance > 1e-6)
      )
        continue;
      const t = projection(j.position, a, c, "line").t;
      for (const sign of [1, -1] as const) {
        if (e.kind === "segment" && (sign === 1 ? t >= 1 - 1e-8 : t <= 1e-8))
          continue;
        if (e.kind === "ray" && sign === -1 && t <= 1e-8) continue;
        const angle = Math.atan2((c.y - a.y) * sign, (c.x - a.x) * sign);
        const end =
          sign === 1
            ? distance(c, j.position) > 1e-7
              ? c.id
              : a.id
            : distance(a, j.position) > 1e-7
              ? a.id
              : c.id;
        if (
          !j.directions.some(
            (d) => Math.abs(mod(angle - d.angle + Math.PI) - Math.PI) < 1e-8,
          )
        )
          j.directions.push({ angle, ref: { edge: e.id, end, sign } });
      }
    }
    j.directions.sort((a, c) => a.angle - c.angle);
  }
  return js.filter((j) => j.directions.length >= 2);
}
export function sectors(j: Junction): AngleRef[] {
  return j.directions.map((d, i) => ({
    id:
      "sector:" +
      j.id +
      ":" +
      d.ref.edge +
      ":" +
      d.ref.sign +
      ":" +
      j.directions[(i + 1) % j.directions.length].ref.edge +
      ":" +
      j.directions[(i + 1) % j.directions.length].ref.sign,
    vertex: j.ref,
    start: d.ref,
    end: j.directions[(i + 1) % j.directions.length].ref,
    sweep: 1,
  }));
}
export function angleAt(
  b: Board,
  js: Junction[],
  p: XY,
  zoom: number,
): AngleRef | undefined {
  let best: { d: number; a: AngleRef } | undefined;
  for (const j of js) {
    const r = distance(p, j.position) * zoom;
    if (r < 15 || r > 88) continue;
    const t = Math.atan2(p.y - j.position.y, p.x - j.position.x);
    for (const a of sectors(j)) {
      const start = direction(b, a, a.start)!;
      const sweep = angleRadians(b, a);
      if (mod(t - start) < sweep - 1e-5 && (!best || r < best.d))
        best = { d: r, a };
    }
  }
  return best?.a;
}
export function allAngleRefs(b: Board) {
  return [
    ...b.angles,
    ...b.constraints.flatMap((c) =>
      "angle" in c ? [c.angle] : "angles" in c ? c.angles : [],
    ),
  ];
}
export function validateBoard(raw: unknown): Board {
  if (!raw || typeof raw !== "object")
    throw Error("This is not a geometry board.");
  const b = raw as Board;
  if (
    b.version !== 1 ||
    typeof b.id !== "string" ||
    typeof b.title !== "string" ||
    !Array.isArray(b.points) ||
    !Array.isArray(b.edges) ||
    !Array.isArray(b.constraints) ||
    !Array.isArray(b.angles) ||
    !Array.isArray(b.notes) ||
    !Array.isArray(b.equations)
  )
    throw Error("Unsupported or incomplete board file.");
  if (
    b.points.length > 500 ||
    b.edges.length > 500 ||
    b.constraints.length > 200 ||
    b.angles.length > 500 ||
    b.notes.length > 200
  )
    throw Error("This board exceeds the supported size.");
  const ids = new Set<string>();
  for (const p of b.points) {
    if (
      typeof p.id !== "string" ||
      ids.has(p.id) ||
      typeof p.label !== "string" ||
      p.label.length > 30 ||
      !Number.isFinite(p.x) ||
      !Number.isFinite(p.y) ||
      Math.abs(p.x) > 1e7 ||
      Math.abs(p.y) > 1e7
    )
      throw Error("Invalid point.");
    ids.add(p.id);
  }
  const eids = new Set<string>();
  for (const e of b.edges) {
    if (
      eids.has(e.id) ||
      !ids.has(e.a) ||
      !ids.has(e.b) ||
      e.a === e.b ||
      !["segment", "line", "ray", "circle"].includes(e.kind)
    )
      throw Error("Invalid edge reference.");
    eids.add(e.id);
  }
  for (const p of b.points)
    if (
      p.on &&
      (!eids.has(p.on.edge) ||
        !Number.isFinite(p.on.t) ||
        edge(b, p.on.edge)?.kind === "circle" ||
        (edge(b, p.on.edge)?.kind !== "line" && p.on.t < 0) ||
        (edge(b, p.on.edge)?.kind === "segment" && p.on.t > 1))
    )
      throw Error("Invalid point attachment.");
  const validAngle = (a: AngleRef) => {
    if (
      !a ||
      typeof a.id !== "string" ||
      !a.vertex ||
      !a.start ||
      !a.end ||
      ![1, -1].includes(a.sweep)
    )
      throw Error("Invalid angle.");
    if (
      "point" in a.vertex
        ? !ids.has(a.vertex.point)
        : !Array.isArray(a.vertex.intersection) ||
          a.vertex.intersection.length !== 2 ||
          a.vertex.intersection.some((id) => !eids.has(id))
    )
      throw Error("Invalid angle vertex.");
    for (const d of [a.start, a.end])
      if (
        !eids.has(d.edge) ||
        !ids.has(d.end) ||
        (d.sign !== undefined && d.sign !== 1 && d.sign !== -1)
      )
        throw Error("Invalid angle boundary.");
    if (
      a.radius !== undefined &&
      (!Number.isFinite(a.radius) || a.radius < 10 || a.radius > 300)
    )
      throw Error("Invalid angle radius.");
    if (
      a.expression !== undefined &&
      (typeof a.expression !== "string" || a.expression.length > 2000)
    )
      throw Error("Invalid expression.");
  };
  const validSegment = (s: SegmentRef) => {
    if (
      !s ||
      !eids.has(s.edge) ||
      (s.a && !ids.has(s.a)) ||
      (s.b && !ids.has(s.b))
    )
      throw Error("Invalid segment.");
  };
  b.angles.forEach(validAngle);
  const cids = new Set<string>();
  for (const c of b.constraints) {
    if (!c || typeof c.id !== "string" || cids.has(c.id))
      throw Error("Invalid relationship.");
    cids.add(c.id);
    switch (c.kind) {
      case "length":
        validSegment(c.segment);
        if (!(c.value > 0 && Number.isFinite(c.value)))
          throw Error("Invalid length.");
        break;
      case "equalLength":
        if (
          !Array.isArray(c.segments) ||
          c.segments.length < 2 ||
          c.segments.length > 500
        )
          throw Error("Invalid congruence group.");
        c.segments.forEach(validSegment);
        break;
      case "angle":
        validAngle(c.angle);
        if (!(c.value > 0 && c.value <= 360) || typeof c.input !== "string")
          throw Error("Invalid angle measure.");
        break;
      case "equalAngle":
      case "sumAngle":
        if (
          !Array.isArray(c.angles) ||
          c.angles.length < 2 ||
          c.angles.length > 500
        )
          throw Error("Invalid angle relationship.");
        c.angles.forEach(validAngle);
        if (c.kind === "sumAngle" && !(c.value > 0 && Number.isFinite(c.value)))
          throw Error("Invalid angle sum.");
        break;
      case "parallel":
      case "perpendicular":
        if (
          !Array.isArray(c.edges) ||
          c.edges.length !== 2 ||
          c.edges.some((id) => !eids.has(id))
        )
          throw Error("Invalid support relationship.");
        break;
      case "bisect":
        validAngle(c.angle);
        if (!ids.has(c.point)) throw Error("Invalid bisector.");
        break;
      default:
        throw Error("Unknown relationship type.");
    }
  }
  for (const p of b.points)
    if (
      p.crossing &&
      (!Array.isArray(p.crossing) ||
        p.crossing.length !== 2 ||
        p.crossing.some((id) => !eids.has(id)))
    )
      throw Error("Invalid intersection attachment.");
  for (const n of b.notes)
    if (
      typeof n.text !== "string" ||
      n.text.length > 10000 ||
      !Number.isFinite(n.position.x) ||
      !Number.isFinite(n.position.y)
    )
      throw Error("Invalid text.");
  for (const e of b.equations)
    if (typeof e !== "string" || e.length > 2000)
      throw Error("Invalid equation.");
  return clone(b);
}
