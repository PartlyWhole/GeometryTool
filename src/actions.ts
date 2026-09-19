import {
  type Board,
  type Selection,
  type Constraint,
  type AngleRef,
  type SegmentRef,
  clone,
  point,
  edge,
  vertex,
  direction,
  angleRadians,
  endpoints,
  segmentLength,
  uid,
  addPoint,
  addEdge,
  distance,
  angleKey,
  segmentKey,
} from "./model";
export function rememberAngle(b: Board, a: AngleRef) {
  const found = b.angles.find((x) => angleKey(x, b) === angleKey(a, b));
  if (found) return found;
  const next = { ...clone(a), id: uid() };
  b.angles.push(next);
  return next;
}
export function rotateArm(b: Board, a: AngleRef, target: number) {
  const v = vertex(b, a.vertex),
    start = direction(b, a, a.start),
    e = edge(b, a.end.edge);
  if (!v || start === undefined || !e) return;
  const delta = ((target * Math.PI) / 180 - angleRadians(b, a)) * a.sweep;
  const ids = [e.a, e.b];
  for (const id of ids) {
    if ("point" in a.vertex && id === a.vertex.point) continue;
    const p = point(b, id);
    if (!p || p.pinned) continue;
    const dx = p.x - v.x,
      dy = p.y - v.y;
    p.x = v.x + dx * Math.cos(delta) - dy * Math.sin(delta);
    p.y = v.y + dx * Math.sin(delta) + dy * Math.cos(delta);
  }
}
export function fixedAngles(
  b: Board,
  angles: AngleRef[],
  value: number,
  input: string,
) {
  if (!(value > 0 && value <= 360))
    throw Error("Enter a measure greater than 0° and at most 360°.");
  for (const a of angles) {
    if (value === 360 && !a.full)
      throw Error("Choose Full turn at a vertex for 360°.");
    const saved = rememberAngle(b, a);
    b.constraints = b.constraints.filter(
      (c) => !(c.kind === "angle" && angleKey(c.angle, b) === angleKey(a, b)),
    );
    rotateArm(b, a, value);
    b.constraints.push({
      id: uid(),
      kind: "angle",
      angle: saved,
      value,
      input,
    });
  }
}
export function equalSegments(b: Board, segments: SegmentRef[]) {
  if (segments.length < 2) throw Error("Select at least two segments.");
  const target = segmentLength(b, segments[0]);
  for (const s of segments.slice(1)) {
    const es = endpoints(b, s);
    if (!es) continue;
    const [a, c] = es;
    const l = distance(a, c);
    if (!l) continue;
    const dx = (c.x - a.x) / l,
      dy = (c.y - a.y) / l;
    if (a.pinned && !c.pinned) {
      c.x = a.x + dx * target;
      c.y = a.y + dy * target;
    } else if (c.pinned && !a.pinned) {
      a.x = c.x - dx * target;
      a.y = c.y - dy * target;
    } else if (!a.pinned && !c.pinned) {
      const mx = (a.x + c.x) / 2,
        my = (a.y + c.y) / 2;
      a.x = mx - (dx * target) / 2;
      a.y = my - (dy * target) / 2;
      c.x = mx + (dx * target) / 2;
      c.y = my + (dy * target) / 2;
    }
  }
  b.constraints.push({
    id: uid(),
    kind: "equalLength",
    segments: clone(segments),
  });
}
export function equalAngles(b: Board, angles: AngleRef[]) {
  const target = (angleRadians(b, angles[0]) * 180) / Math.PI;
  angles.slice(1).forEach((a) => rotateArm(b, a, target));
  b.constraints.push({
    id: uid(),
    kind: "equalAngle",
    angles: angles.map((a) => rememberAngle(b, a)),
  });
}
export function midpoint(b: Board, s: SegmentRef, ratio = 0.5) {
  const es = endpoints(b, s);
  if (!es) throw Error("Segment no longer exists.");
  const [a, c] = es;
  const host = edge(b, s.edge)!;
  const hp = point(b, host.a)!,
    hz = point(b, host.b)!;
  const x = a.x + (c.x - a.x) * ratio,
    y = a.y + (c.y - a.y) * ratio;
  const total = (hz.x - hp.x) ** 2 + (hz.y - hp.y) ** 2;
  const t = ((x - hp.x) * (hz.x - hp.x) + (y - hp.y) * (hz.y - hp.y)) / total;
  return addPoint(
    b,
    { x, y },
    { edge: s.edge, t, midpoint: ratio === 0.5 && !s.a && !s.b },
  );
}
export function bisectAngle(b: Board, a: AngleRef) {
  const v = vertex(b, a.vertex),
    start = direction(b, a, a.start);
  if (!v || start === undefined) throw Error("This angle is unavailable.");
  let origin = "point" in a.vertex ? point(b, a.vertex.point) : undefined;
  if (!origin) {
    origin = addPoint(b, v);
    if ("intersection" in a.vertex) origin.crossing = a.vertex.intersection;
  }
  const t = start + (a.sweep * angleRadians(b, a)) / 2,
    p = addPoint(b, { x: v.x + 120 * Math.cos(t), y: v.y + 120 * Math.sin(t) });
  addEdge(b, origin.id, p.id, "ray");
  b.constraints.push({
    id: uid(),
    kind: "bisect",
    angle: rememberAngle(b, a),
    point: p.id,
  });
}
export function selectionPointIds(b: Board, s: Selection) {
  const ids = new Set(s.points);
  s.segments.forEach((x) => endpoints(b, x)?.forEach((p) => ids.add(p.id)));
  s.angles.forEach((a) => {
    ids.add(a.start.end);
    ids.add(a.end.end);
    if ("point" in a.vertex) ids.add(a.vertex.point);
  });
  return [...ids];
}
export function removeSelection(b: Board, s: Selection) {
  const doomed = new Set(s.segments.map((x) => x.edge));
  b.edges.forEach((e) => {
    if (s.points.includes(e.a) || s.points.includes(e.b)) doomed.add(e.id);
  });
  b.edges = b.edges.filter((e) => !doomed.has(e.id));
  b.points = b.points.filter((p) => !s.points.includes(p.id));
  for (const p of b.points) if (p.on && doomed.has(p.on.edge)) delete p.on;
  for (const p of b.points)
    if (p.crossing?.some((id) => doomed.has(id))) delete p.crossing;
  const goodAngle = (a: AngleRef) =>
    !doomed.has(a.start.edge) &&
    !doomed.has(a.end.edge) &&
    (!("intersection" in a.vertex) ||
      !a.vertex.intersection.some((id) => doomed.has(id))) &&
    (!("point" in a.vertex) || !s.points.includes(a.vertex.point)) &&
    !s.angles.some((x) => angleKey(x, b) === angleKey(a, b));
  b.angles = b.angles.filter(goodAngle);
  const goodSeg = (x: SegmentRef) =>
    !doomed.has(x.edge) &&
    !s.points.includes(x.a || "") &&
    !s.points.includes(x.b || "");
  b.constraints = b.constraints.filter(
    (c) =>
      ("segments" in c ? c.segments.every(goodSeg) : true) &&
      ("segment" in c ? goodSeg(c.segment) : true) &&
      ("angles" in c ? c.angles.every(goodAngle) : true) &&
      ("angle" in c ? goodAngle(c.angle) : true) &&
      ("edges" in c ? !c.edges.some((id) => doomed.has(id)) : true) &&
      (c.kind !== "bisect" || !s.points.includes(c.point)),
  );
  b.notes = b.notes.filter((n) => !s.notes.includes(n.id));
}
export function scalar(text: string) {
  const input = text.trim();
  if (!/^[0-9.\s+\-*/()]+$/.test(input))
    throw Error(
      "Use a number or a simple arithmetic expression, such as 45/2.",
    );
  const tokens = input.match(/\d*\.?\d+|[()+\-*/]/g) || [];
  let i = 0;
  const atom = (): number => {
    const t = tokens[i++];
    if (t === "-") return -atom();
    if (t === "+") return atom();
    if (t === "(") {
      const n = sum();
      if (tokens[i++] !== ")") throw Error("Close the parentheses.");
      return n;
    }
    const n = Number(t);
    if (!Number.isFinite(n)) throw Error("Complete the value.");
    return n;
  };
  const product = () => {
    let n = atom();
    while (tokens[i] === "*" || tokens[i] === "/") {
      const op = tokens[i++],
        v = atom();
      n = op === "*" ? n * v : n / v;
    }
    return n;
  };
  const sum = () => {
    let n = product();
    while (tokens[i] === "+" || tokens[i] === "-") {
      const op = tokens[i++],
        v = product();
      n = op === "+" ? n + v : n - v;
    }
    return n;
  };
  const n = sum();
  if (i !== tokens.length || !Number.isFinite(n))
    throw Error("Enter a finite number.");
  return n;
}
export function constraintTitle(b: Board, c: Constraint) {
  switch (c.kind) {
    case "equalLength":
      return `Equal lengths · ${c.segments.length} segments`;
    case "length":
      return `Fixed length ${c.value.toFixed(2).replace(/\.00$/, "")}`;
    case "angle":
      return `Angle ${c.input}°`;
    case "equalAngle":
      return `Equal measures · ${c.angles.length} angles`;
    case "sumAngle":
      return `Angle sum ${c.value}°`;
    case "parallel":
      return "Parallel supports";
    case "perpendicular":
      return "Perpendicular supports";
    case "bisect":
      return "Angle bisector";
  }
}
export function duplicate(b: Board, s: Selection, source: Board = clone(b)) {
  const ids = new Set(selectionPointIds(source, s)),
    selectedEdges = source.edges.filter((e) => ids.has(e.a) && ids.has(e.b));
  const map = new Map<string, string>();
  for (const id of ids) {
    const p = point(source, id);
    if (p) {
      const q = addPoint(b, { x: p.x + 30, y: p.y + 30 });
      q.labelOffset = p.labelOffset;
      map.set(id, q.id);
    }
  }
  for (const e of selectedEdges) {
    const q = addEdge(b, map.get(e.a)!, map.get(e.b)!, e.kind);
    map.set(e.id, q.id);
  }
  const remap = <T>(v: T): T => {
    if (typeof v === "string") return (map.get(v) || v) as T;
    if (Array.isArray(v)) return v.map(remap) as T;
    if (v && typeof v === "object")
      return Object.fromEntries(
        Object.entries(v).map(([k, x]) => [k, remap(x)]),
      ) as T;
    return v;
  };
  for (const p of source.points) {
    const id = map.get(p.id);
    if (!id) continue;
    const q = point(b, id)!;
    if (p.on && map.has(p.on.edge)) q.on = remap(p.on);
    if (p.crossing && p.crossing.every((id) => map.has(id)))
      q.crossing = remap(p.crossing);
  }
  const completeAngle = (a: AngleRef) =>
    map.has(a.start.edge) &&
    map.has(a.end.edge) &&
    map.has(a.start.end) &&
    map.has(a.end.end) &&
    ("point" in a.vertex
      ? map.has(a.vertex.point)
      : a.vertex.intersection.every((id) => map.has(id)));
  const completeSegment = (s: SegmentRef) =>
    map.has(s.edge) && (!s.a || map.has(s.a)) && (!s.b || map.has(s.b));
  for (const a of source.angles)
    if (completeAngle(a)) {
      map.set(a.id, uid());
      b.angles.push(remap(a));
    }
  for (const c of source.constraints) {
    const complete =
      ("angle" in c ? completeAngle(c.angle) : true) &&
      ("angles" in c ? c.angles.every(completeAngle) : true) &&
      ("segment" in c ? completeSegment(c.segment) : true) &&
      ("segments" in c ? c.segments.every(completeSegment) : true) &&
      ("edges" in c ? c.edges.every((id) => map.has(id)) : true) &&
      (c.kind !== "bisect" || map.has(c.point));
    if (complete) {
      const copy = remap(c);
      copy.id = uid();
      b.constraints.push(copy);
    }
  }
  const notes: string[] = [];
  for (const n of source.notes)
    if (s.notes.includes(n.id)) {
      const copy = {
        ...clone(n),
        id: uid(),
        position: { x: n.position.x + 30, y: n.position.y + 30 },
      };
      b.notes.push(copy);
      notes.push(copy.id);
    }
  return {
    points: selectedEdges.length
      ? []
      : [...ids].map((id) => map.get(id)!).filter(Boolean),
    segments: selectedEdges.map((e) => ({ edge: map.get(e.id)! })),
    angles: [],
    notes,
  };
}
