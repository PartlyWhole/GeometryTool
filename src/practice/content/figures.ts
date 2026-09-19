// A small builder for the figures exercises are authored around.
//
// Boards here are ordinary whiteboard Boards, so the same renderer, oracle and
// solver apply. The builder exists only to keep content files readable.
import {
  type AngleRef,
  type Board,
  type Constraint,
  type Edge,
  type Point,
  type SegmentRef,
  blank,
  uid,
} from "../../model";
import { resolveAngle, resolveSeg } from "../oracle";
import { type AngId, type SegId } from "../terms";

export class Fig {
  private b: Board;
  private deferred: ((b: Board) => void)[] = [];

  constructor(title = "Figure") {
    this.b = blank();
    this.b.title = title;
  }

  /** Place a labelled point. Coordinates are drawing units, y downward. */
  at(label: string, x: number, y: number, opts: Partial<Point> = {}) {
    this.b.points.push({ id: uid(), label, x, y, ...opts });
    return this;
  }

  private id(label: string) {
    const p = this.b.points.find((q) => q.label === label);
    if (!p) throw Error("Figure has no point " + label);
    return p.id;
  }

  private edgeBetween(a: string, c: string) {
    const A = this.id(a),
      C = this.id(c);
    const e = this.b.edges.find(
      (x) => (x.a === A && x.b === C) || (x.a === C && x.b === A),
    );
    if (!e) throw Error("Figure has no edge " + a + c);
    return e;
  }

  seg(a: string, c: string, kind: Edge["kind"] = "segment") {
    this.b.edges.push({ id: uid(), a: this.id(a), b: this.id(c), kind });
    return this;
  }

  line(a: string, c: string) {
    return this.seg(a, c, "line");
  }

  ray(a: string, c: string) {
    return this.seg(a, c, "ray");
  }

  /** A point lying on an existing edge, so topology treats it as incident. */
  on(label: string, edgeA: string, edgeB: string, t: number) {
    const e = this.edgeBetween(edgeA, edgeB);
    const p = this.b.points.find((q) => q.id === e.a)!,
      q = this.b.points.find((x) => x.id === e.b)!;
    this.b.points.push({
      id: uid(),
      label,
      x: p.x + (q.x - p.x) * t,
      y: p.y + (q.y - p.y) * t,
      on: { edge: e.id, t },
    });
    return this;
  }

  /** The crossing point of two existing edges, named. */
  cross(label: string, e1: [string, string], e2: [string, string]) {
    const a = this.edgeBetween(...e1),
      b = this.edgeBetween(...e2);
    const pos = intersect(this.b, a, b);
    this.b.points.push({
      id: uid(),
      label,
      x: pos.x,
      y: pos.y,
      crossing: [a.id, b.id],
    });
    return this;
  }

  /**
   * Give a three-point angle a short name, e.g. ∠1. `radius` widens its arc,
   * which a vertex carrying several angles needs so their labels do not
   * collide.
   */
  num(name: string, threePoints: string, radius?: number) {
    this.deferred.push((b) => {
      const r = resolveAngle(b, { k: "ang", name: threePoints });
      if (!r) throw Error("Cannot resolve angle " + threePoints);
      b.angles.push({ ...r, id: uid(), label: name, ...(radius ? { radius } : {}) });
    });
    return this;
  }

  /** Matching tick marks: a congruence the figure asserts. */
  tick(...segs: [string, string][]) {
    this.deferred.push((b) => {
      const refs = segs
        .map(([a, c]) => resolveSeg(b, { k: "seg", a, b: c } as SegId))
        .filter(Boolean) as SegmentRef[];
      if (refs.length < 2) throw Error("tick needs two resolvable segments");
      b.constraints.push({ id: uid(), kind: "equalLength", segments: refs });
    });
    return this;
  }

  /**
   * Matching arcs: an angle congruence the figure asserts. A name may carry a
   * drawing radius as "ABC@30", so two congruent angles can be arced at
   * visibly different sizes — the number of arcs is what matches, not the
   * size, and a figure that draws them identically cannot make that point.
   */
  arc(...angles: string[]) {
    this.deferred.push((b) => {
      const refs = angles
        .map((spec) => {
          const [name, r] = spec.split("@");
          const ref = resolveAngle(b, { k: "ang", name } as AngId);
          return ref && r ? { ...ref, radius: Number(r) } : ref;
        })
        .filter(Boolean) as AngleRef[];
      if (refs.length < 2) throw Error("arc needs two resolvable angles");
      b.constraints.push({ id: uid(), kind: "equalAngle", angles: refs });
    });
    return this;
  }

  /** A right-angle square: a declared 90° fact. */
  right(angle: string) {
    this.deferred.push((b) => {
      const r = resolveAngle(b, { k: "ang", name: angle } as AngId);
      if (!r) throw Error("Cannot resolve angle " + angle);
      b.constraints.push({
        id: uid(),
        kind: "angle",
        angle: r,
        value: 90,
        input: "90",
      });
    });
    return this;
  }

  /** A stated measure, drawn as a label rather than treated as a mark. */
  measure(angle: string, degrees: number) {
    this.deferred.push((b) => {
      const r = resolveAngle(b, { k: "ang", name: angle } as AngId);
      if (!r) throw Error("Cannot resolve angle " + angle);
      b.constraints.push({
        id: uid(),
        kind: "angle",
        angle: r,
        value: degrees,
        input: String(degrees),
      });
    });
    return this;
  }

  constraint(c: Constraint) {
    this.b.constraints.push(c);
    return this;
  }

  build(): Board {
    for (const f of this.deferred) f(this.b);
    this.deferred = [];
    return this.b;
  }
}

export const fig = (title?: string) => new Fig(title);

function intersect(b: Board, e1: Edge, e2: Edge) {
  const p = (id: string) => b.points.find((x) => x.id === id)!;
  const a = p(e1.a),
    c = p(e1.b),
    d = p(e2.a),
    f = p(e2.b);
  const r = { x: c.x - a.x, y: c.y - a.y },
    s = { x: f.x - d.x, y: f.y - d.y };
  const den = r.x * s.y - r.y * s.x;
  if (Math.abs(den) < 1e-9) throw Error("Edges are parallel");
  const t = ((d.x - a.x) * s.y - (d.y - a.y) * s.x) / den;
  return { x: a.x + r.x * t, y: a.y + r.y * t };
}

/** Degrees to radians on the drawing's y-down convention. */
export const polar = (cx: number, cy: number, deg: number, r: number) => ({
  x: cx + r * Math.cos((-deg * Math.PI) / 180),
  y: cy + r * Math.sin((-deg * Math.PI) / 180),
});
