import { describe, it, expect } from "vitest";
import {
  blank,
  addPoint,
  addEdge,
  topology,
  sectors,
  angleDegrees,
  segmentLength,
  uid,
  type AngleRef,
  point,
} from "../src/model";
import { solve, boardError } from "../src/solver";
describe("whiteboard geometry (agent-authored)", () => {
  it("finds four X sectors without splitting authored segments", () => {
    const b = blank();
    const ps = [
      [0, 0],
      [100, 100],
      [0, 100],
      [100, 0],
    ].map(([x, y]) => addPoint(b, { x, y }));
    addEdge(b, ps[0].id, ps[1].id);
    addEdge(b, ps[2].id, ps[3].id);
    const js = topology(b);
    expect(js.length).toBe(1);
    expect(sectors(js[0]).length).toBe(4);
    expect(sectors(js[0]).map((a) => angleDegrees(b, a))).toEqual([
      90, 90, 90, 90,
    ]);
    expect(b.edges.length).toBe(2);
  });
  it("distinguishes T-junction from near miss and overlapping supports", () => {
    const b = blank();
    const [a, c, d, e] = [
      [0, 0],
      [100, 0],
      [50, 0],
      [50, 100],
    ].map(([x, y]) => addPoint(b, { x, y }));
    addEdge(b, a.id, c.id);
    addEdge(b, d.id, e.id);
    expect(topology(b).find((j) => j.id === d.id)?.directions.length).toBe(3);
    d.y = 1;
    expect(topology(b).length).toBe(0);
    d.y = 0;
    addEdge(b, a.id, c.id);
    expect(topology(b).find((j) => j.id === d.id)?.directions.length).toBe(3);
  });
  it("preserves congruence while a vertex is dragged", () => {
    const b = blank();
    const ps = [
      [0, 0],
      [100, 0],
      [0, 100],
      [40, 100],
    ].map(([x, y]) => addPoint(b, { x, y }));
    const a = addEdge(b, ps[0].id, ps[1].id),
      c = addEdge(b, ps[2].id, ps[3].id);
    b.constraints.push({
      id: uid(),
      kind: "equalLength",
      segments: [{ edge: a.id }, { edge: c.id }],
    });
    const r = solve(b, { [ps[1].id]: { x: 140, y: 0 } });
    expect(r.ok).toBe(true);
    expect(segmentLength(r.board, { edge: a.id })).toBeCloseTo(
      segmentLength(r.board, { edge: c.id }),
      3,
    );
  });
  it("keeps a midpoint on its host after moving an endpoint", () => {
    const b = blank();
    const a = addPoint(b, { x: 0, y: 0 }),
      c = addPoint(b, { x: 100, y: 0 }),
      e = addEdge(b, a.id, c.id),
      m = addPoint(b, { x: 50, y: 0 }, { edge: e.id, t: 0.5, midpoint: true });
    a.pinned = true;
    const r = solve(b, { [c.id]: { x: 200, y: 80 } });
    expect(r.ok).toBe(true);
    const p = point(r.board, m.id)!,
      z = point(r.board, c.id)!;
    expect(p.x).toBeCloseTo(z.x / 2, 3);
    expect(p.y).toBeCloseTo(z.y / 2, 3);
  });
  it("sets and maintains a custom angle", () => {
    const b = blank();
    const v = addPoint(b, { x: 0, y: 0 }),
      a = addPoint(b, { x: 100, y: 0 }),
      c = addPoint(b, { x: 60, y: 80 });
    v.pinned = true;
    a.pinned = true;
    const e = addEdge(b, v.id, a.id),
      f = addEdge(b, v.id, c.id);
    const angle: AngleRef = {
      id: uid(),
      vertex: { point: v.id },
      start: { edge: e.id, end: a.id },
      end: { edge: f.id, end: c.id },
      sweep: 1,
    };
    b.constraints.push({
      id: uid(),
      kind: "angle",
      angle,
      value: 37.5,
      input: "37.5",
    });
    const r = solve(b);
    expect(r.ok).toBe(true);
    expect(angleDegrees(r.board, angle)).toBeCloseTo(37.5, 3);
    expect(boardError(r.board)).toBeLessThan(0.001);
  });
  it("rejects conflicting fixed lengths without changing the source", () => {
    const b = blank();
    const ps = [
      [0, 0],
      [100, 0],
      [0, 100],
      [50, 100],
    ].map(([x, y]) => addPoint(b, { x, y }));
    const a = addEdge(b, ps[0].id, ps[1].id),
      c = addEdge(b, ps[2].id, ps[3].id);
    b.constraints.push(
      { id: uid(), kind: "length", segment: { edge: a.id }, value: 100 },
      { id: uid(), kind: "length", segment: { edge: c.id }, value: 50 },
      {
        id: uid(),
        kind: "equalLength",
        segments: [{ edge: a.id }, { edge: c.id }],
      },
    );
    const before = JSON.stringify(b),
      r = solve(b);
    expect(r.ok).toBe(false);
    expect(JSON.stringify(b)).toBe(before);
  });
});

import { validateBoard, clone, angleKey, intersection } from "../src/model";
import {
  combineAngles,
  markingGroups,
  touchesRect,
} from "../src/relationships";
import {
  fixedAngles,
  equalSegments,
  duplicate,
  removeSelection,
} from "../src/actions";
function crossingFixture() {
  const b = blank();
  const ps = [
    [-100, 0],
    [100, 0],
    [0, -100],
    [0, 100],
  ].map(([x, y]) => addPoint(b, { x, y }));
  const es = [addEdge(b, ps[0].id, ps[1].id), addEdge(b, ps[2].id, ps[3].id)];
  return { b, ps, es };
}
describe("topology and recovery regressions (agent-authored)", () => {
  it("exposes both half-lines at a line defining point", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      c = addPoint(b, { x: 100, y: 0 });
    addEdge(b, a.id, c.id, "line");
    expect(topology(b).find((j) => j.id === a.id)?.directions.length).toBe(2);
    expect(sectors(topology(b)[0]).map((a) => angleDegrees(b, a))).toEqual([
      180, 180,
    ]);
  });
  it("exposes the forward continuation at a ray second point", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      c = addPoint(b, { x: 100, y: 0 });
    addEdge(b, a.id, c.id, "ray");
    expect(topology(b).length).toBe(1);
    expect(topology(b)[0].id).toBe(c.id);
  });
  it("combines adjacent sectors and a complete turn, rejecting gaps and duplicates", () => {
    const { b } = crossingFixture(),
      as = sectors(topology(b)[0]);
    expect(angleDegrees(b, combineAngles(b, as.slice(0, 2)))).toBeCloseTo(180);
    expect(angleDegrees(b, combineAngles(b, as))).toBe(360);
    expect(() => combineAngles(b, [as[0], as[2]])).toThrow("gap");
    expect(() => combineAngles(b, [as[0], as[0]])).toThrow("overlap");
  });
  it("merges shared congruence groups transitively", () => {
    const { b, es } = crossingFixture(),
      e = addEdge(b, es[0].a, es[1].a);
    b.constraints = [
      {
        id: uid(),
        kind: "equalLength",
        segments: [{ edge: es[0].id }, { edge: es[1].id }],
      },
      {
        id: uid(),
        kind: "equalLength",
        segments: [{ edge: es[1].id }, { edge: e.id }],
      },
    ];
    expect(new Set(markingGroups(b, "segments").values()).size).toBe(1);
  });
  it("maintains a promoted crossing on both moving supports", () => {
    const { b, ps, es } = crossingFixture(),
      p = addPoint(b, { x: 0, y: 0 });
    p.crossing = [es[0].id, es[1].id];
    const r = solve(b, { [ps[3].id]: { x: 60, y: 100 } });
    expect(r.ok).toBe(true);
    const x = intersection(r.board, p.crossing)!;
    expect(point(r.board, p.id)!.x).toBeCloseTo(x.x, 3);
    expect(point(r.board, p.id)!.y).toBeCloseTo(x.y, 3);
  });
  it("rejects a file with a dangling angle before modifying the original", () => {
    const { b } = crossingFixture();
    const original = clone(b);
    b.angles = [
      {
        ...sectors(topology(b)[0])[0],
        start: { edge: "missing", end: b.points[0].id },
      },
    ];
    expect(() => validateBoard(b)).toThrow("boundary");
    expect(original.angles).toEqual([]);
  });
  it("rejects unknown relationship types", () => {
    const b = blank();
    (b.constraints as unknown[]).push({ id: "x", kind: "execute" });
    expect(() => validateBoard(b)).toThrow("Unknown");
  });
  it("preserves the pinned reference when equalizing a coupled figure", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      c = addPoint(b, { x: 100, y: 0 }),
      d = addPoint(b, { x: 0, y: 100 }),
      f = addPoint(b, { x: 70, y: 180 });
    a.pinned = c.pinned = true;
    const e = addEdge(b, a.id, c.id),
      g = addEdge(b, d.id, f.id);
    equalSegments(b, [{ edge: e.id }, { edge: g.id }]);
    const r = solve(b);
    expect(r.ok).toBe(true);
    expect(segmentLength(r.board, { edge: e.id })).toBe(100);
    expect(segmentLength(r.board, { edge: g.id })).toBeCloseTo(100, 3);
  });
  it("retains reflex measure without modulo reduction", () => {
    const { b } = crossingFixture(),
      a = sectors(topology(b)[0])[0];
    fixedAngles(b, [a], 220, "220");
    const r = solve(b);
    expect(r.ok).toBe(true);
    expect(angleDegrees(r.board, a)).toBeCloseTo(220, 3);
  });
  it("copies angle constraints with fresh point references after source deletion", () => {
    const { b, es } = crossingFixture(),
      a = sectors(topology(b)[0])[0];
    fixedAngles(b, [a], 90, "90");
    const target = blank();
    duplicate(
      target,
      {
        points: [],
        segments: es.map((e) => ({ edge: e.id })),
        angles: [],
        notes: [],
      },
      b,
    );
    expect(target.constraints.length).toBe(1);
    expect(validateBoard(target).points.length).toBe(4);
    expect(solve(target).ok).toBe(true);
  });
  it("removes intersection angle dependencies when a supporting segment is deleted", () => {
    const { b, es } = crossingFixture(),
      a = sectors(topology(b)[0])[0];
    fixedAngles(b, [a], 90, "90");
    removeSelection(b, {
      points: [],
      segments: [{ edge: es[0].id }],
      angles: [],
      notes: [],
    });
    expect(b.constraints).toEqual([]);
    expect(b.angles).toEqual([]);
  });
  it("detects even a narrow marquee crossing", () => {
    expect(
      touchesRect(
        { x: 0, y: 0 },
        { x: 1000, y: 0 },
        { x1: 15.1, x2: 15.2, y1: -1, y2: 1 },
      ),
    ).toBe(true);
    expect(
      touchesRect(
        { x: 0, y: 0 },
        { x: 1000, y: 0 },
        { x1: 15.1, x2: 15.2, y1: 1, y2: 2 },
      ),
    ).toBe(false);
  });
});

import { angleBetweenSegments } from "../src/relationships";
describe("selected connected segments (agent-authored)", () => {
  const fixture = () => {
    const b = blank(),
      v = addPoint(b, { x: 0, y: 0 }),
      p = addPoint(b, { x: 100, y: 0 }),
      q = addPoint(b, { x: 0, y: 100 }),
      a = addEdge(b, p.id, v.id),
      c = addEdge(b, v.id, q.id);
    return { b, v, p, q, refs: [{ edge: a.id }, { edge: c.id }] };
  };
  it("finds the ordinary angle regardless of endpoint and selection order", () => {
    const { b, refs } = fixture();
    const a = angleBetweenSegments(b, refs)!;
    expect(angleDegrees(b, a)).toBeCloseTo(90);
    expect(angleKey(a)).toBe(
      angleKey(angleBetweenSegments(b, [...refs].reverse())!),
    );
  });
  it("sets a persistent custom angle and reuses its existing reference", () => {
    const { b, refs } = fixture(),
      a = angleBetweenSegments(b, refs)!;
    fixedAngles(b, [a], 37.5, "37.5");
    const r = solve(b);
    expect(r.ok).toBe(true);
    expect(angleDegrees(r.board, a)).toBeCloseTo(37.5, 3);
    const again = angleBetweenSegments(r.board, refs)!;
    fixedAngles(r.board, [again], 60, "60");
    expect(r.board.constraints.filter((c) => c.kind === "angle").length).toBe(
      1,
    );
  });
  it("does not invent a shared vertex for disconnected segments", () => {
    const { b, refs } = fixture();
    const p = addPoint(b, { x: 200, y: 200 }),
      q = addPoint(b, { x: 300, y: 200 }),
      e = addEdge(b, p.id, q.id);
    expect(angleBetweenSegments(b, [refs[0], { edge: e.id }])).toBeUndefined();
  });
  it("allows straight connected segments but not duplicate or overlapping arms", () => {
    const { b, q, refs } = fixture();
    q.x = -100;
    q.y = 0;
    expect(angleDegrees(b, angleBetweenSegments(b, refs)!)).toBeCloseTo(180);
    q.x = 50;
    expect(angleBetweenSegments(b, refs)).toBeUndefined();
    expect(angleBetweenSegments(b, [refs[0], refs[0]])).toBeUndefined();
  });
});

import { segmentPieces, segmentPieceAt } from "../src/relationships";
describe("direct subsegment selection (agent-authored)", () => {
  it("selects the interval on either side of an attached point", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      z = addPoint(b, { x: 100, y: 0 }),
      e = addEdge(b, a.id, z.id),
      m = addPoint(b, { x: 40, y: 0 }, { edge: e.id, t: 0.4 });
    expect(segmentPieces(b, e.id)).toEqual([
      { edge: e.id, a: a.id, b: m.id },
      { edge: e.id, a: m.id, b: z.id },
    ]);
    expect(segmentPieceAt(b, e.id, { x: 20, y: 3 }).b).toBe(m.id);
    expect(segmentPieceAt(b, e.id, { x: 75, y: -2 }).a).toBe(m.id);
  });
  it("ignores near misses and duplicate positions, retaining an unbroken whole", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      z = addPoint(b, { x: 100, y: 0 }),
      e = addEdge(b, a.id, z.id);
    addPoint(b, { x: 40, y: 1 });
    addPoint(b, { x: 0, y: 0 });
    expect(segmentPieces(b, e.id)).toEqual([{ edge: e.id }]);
  });
  it("finds finite pieces on a line beyond its defining endpoints", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      z = addPoint(b, { x: 100, y: 0 }),
      e = addEdge(b, a.id, z.id, "line"),
      m = addPoint(b, { x: 150, y: 0 }, { edge: e.id, t: 1.5 });
    expect(segmentPieceAt(b, e.id, { x: 125, y: 0 })).toEqual({
      edge: e.id,
      a: z.id,
      b: m.id,
    });
    expect(segmentPieceAt(b, e.id, { x: 200, y: 0 })).toEqual({ edge: e.id });
  });
});

describe("intersection selection with solver residuals (agent-authored)", () => {
  it("splits both declared crossing supports despite small coordinate drift", () => {
    const { b, es } = crossingFixture(),
      m = addPoint(b, { x: 0, y: 0.00004 });
    m.crossing = [es[0].id, es[1].id];
    for (const e of es) expect(segmentPieces(b, e.id).length).toBe(2);
    expect(segmentPieceAt(b, es[0].id, { x: -50, y: 3 }).b).toBe(m.id);
    expect(segmentPieceAt(b, es[0].id, { x: 50, y: -3 }).a).toBe(m.id);
    expect(segmentPieceAt(b, es[1].id, { x: 3, y: -50 }).b).toBe(m.id);
    expect(segmentPieceAt(b, es[1].id, { x: -3, y: 50 }).a).toBe(m.id);
  });
  it("keeps an attached point selectable without treating a free near miss as attached", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      z = addPoint(b, { x: 100, y: 0 }),
      e = addEdge(b, a.id, z.id),
      m = addPoint(b, { x: 40, y: 0.00004 }, { edge: e.id, t: 0.4 });
    expect(segmentPieceAt(b, e.id, { x: 60, y: 2 }).a).toBe(m.id);
    delete m.on;
    expect(segmentPieces(b, e.id)).toEqual([{ edge: e.id }]);
  });
});

describe("elementary angle selection (agent-authored)", () => {
  it("has one four-sector junction for a promoted crossing with numerical drift", () => {
    const { b, es } = crossingFixture(),
      p = addPoint(b, { x: 0, y: 0.00004 });
    p.crossing = [es[0].id, es[1].id];
    const js = topology(b);
    expect(js.length).toBe(1);
    expect(sectors(js[0]).map((a) => angleDegrees(b, a))).toEqual([
      90, 90, 90, 90,
    ]);
  });
  it("splits an existing angle into smaller regions when an arm is added", () => {
    const b = blank(),
      v = addPoint(b, { x: 0, y: 0 }),
      a = addPoint(b, { x: 100, y: 0 }),
      c = addPoint(b, { x: 0, y: 100 }),
      m = addPoint(b, { x: 100, y: 100 });
    addEdge(b, v.id, a.id);
    addEdge(b, v.id, c.id);
    const large = sectors(topology(b)[0]).find(
      (a) => angleDegrees(b, a) < 180,
    )!;
    b.angles.push(large);
    addEdge(b, v.id, m.id);
    expect(
      sectors(topology(b)[0])
        .map((a) => angleDegrees(b, a))
        .sort((a, b) => a - b),
    ).toEqual([45, 45, 270]);
  });
  it("recognizes a straight angle between adjacent pieces of the same support", () => {
    const b = blank(),
      a = addPoint(b, { x: 0, y: 0 }),
      z = addPoint(b, { x: 100, y: 0 }),
      e = addEdge(b, a.id, z.id),
      m = addPoint(b, { x: 40, y: 0 }, { edge: e.id, t: 0.4 });
    expect(
      angleDegrees(b, angleBetweenSegments(b, segmentPieces(b, e.id))!),
    ).toBeCloseTo(180);
  });
});

import { relatedPointIds, editConstraintValue } from "../src/constraintEditing";
describe("constraint inspection and editing (agent-authored)", () => {
  it("includes coupled geometry and attachments but excludes isolated figures", () => {
    const b = blank(),
      ps = [
        [0, 0],
        [100, 0],
        [0, 100],
        [50, 100],
        [500, 500],
        [600, 500],
      ].map(([x, y]) => addPoint(b, { x, y })),
      e = addEdge(b, ps[0].id, ps[1].id),
      f = addEdge(b, ps[2].id, ps[3].id);
    addEdge(b, ps[4].id, ps[5].id);
    const m = addPoint(b, { x: 50, y: 0 }, { edge: e.id, t: 0.5 });
    b.constraints.push({
      id: uid(),
      kind: "equalLength",
      segments: [{ edge: e.id }, { edge: f.id }],
    });
    const ids = relatedPointIds(b, {
      points: [],
      segments: [{ edge: e.id }],
      angles: [],
      notes: [],
    });
    expect(ids.has(ps[3].id)).toBe(true);
    expect(ids.has(m.id)).toBe(true);
    expect(ids.has(ps[4].id)).toBe(false);
  });
  it("updates an existing length without duplicating its constraint", () => {
    const { b, es } = crossingFixture(),
      id = uid();
    b.constraints.push({
      id,
      kind: "length",
      segment: { edge: es[0].id },
      value: 200,
    });
    editConstraintValue(b, id, "6");
    expect(b.constraints).toHaveLength(1);
    expect(solve(b).ok).toBe(true);
    expect((b.constraints[0] as { value: number }).value).toBe(300);
    expect(() => editConstraintValue(b, id, "-1")).toThrow("positive");
    expect((b.constraints[0] as { value: number }).value).toBe(300);
  });
  it("edits a declared angle using its original relationship ID", () => {
    const { b } = crossingFixture(),
      a = sectors(topology(b)[0])[0];
    fixedAngles(b, [a], 90, "90");
    const id = b.constraints[0].id;
    editConstraintValue(b, id, "45/2");
    const r = solve(b);
    expect(r.ok).toBe(true);
    expect(angleDegrees(r.board, a)).toBeCloseTo(22.5, 3);
    expect(r.board.constraints[0].id).toBe(id);
  });
});

describe("canonical geometric angle identity (agent-authored)", () => {
  it("matches reversed naming/sweep and implicit versus explicit ray direction", () => {
    const { b } = crossingFixture(),
      a = sectors(topology(b)[0])[0],
      reversed = {
        ...a,
        id: uid(),
        start: a.end,
        end: a.start,
        sweep: -1 as const,
      },
      implicit = {
        ...a,
        start: { edge: a.start.edge, end: a.start.end },
        end: { edge: a.end.edge, end: a.end.end },
      };
    expect(angleKey(a, b)).toBe(angleKey(reversed, b));
    expect(angleKey(a, b)).toBe(angleKey(implicit, b));
    expect(angleKey(a, b)).not.toBe(angleKey({ ...a, sweep: -1 }, b));
  });
  it("matches the named crossing with its original derived vertex", () => {
    const { b, es } = crossingFixture(),
      a = sectors(topology(b)[0])[0],
      p = addPoint(b, { x: 0, y: 0.00004 });
    p.crossing = [...es.map((e) => e.id)].reverse() as [string, string];
    expect(angleKey(a, b)).toBe(angleKey({ ...a, vertex: { point: p.id } }, b));
  });
  it("reuses the same saved angle and replaces its measure instead of adding another", () => {
    const { b } = crossingFixture(),
      a = sectors(topology(b)[0])[0];
    fixedAngles(b, [a], 45, "45");
    const reverse = { ...a, start: a.end, end: a.start, sweep: -1 as const };
    fixedAngles(b, [reverse], 60, "60");
    expect(b.angles).toHaveLength(1);
    expect(b.constraints.filter((c) => c.kind === "angle")).toHaveLength(1);
  });
  it("keeps separate equal-measure angles at the same crossing distinct", () => {
    const { b } = crossingFixture(),
      as = sectors(topology(b)[0]);
    expect(new Set(as.map((a) => angleKey(a, b))).size).toBe(4);
  });
});


import { angleDisplayRadii } from "../src/relationships";

describe("nested angle display (agent-authored)", () => {
  it("separates a containing angle without marking its children congruent", () => {
    const {b} = crossingFixture();
    const [first,second] = sectors(topology(b)[0]);
    const outer = combineAngles(b,[first,second]);
    outer.radius = 44;
    const radii = angleDisplayRadii(b,[outer,first,second]);
    expect(radii.get(angleKey(outer,b))).toBeGreaterThanOrEqual(radii.get(angleKey(first,b))! + 32);
    expect(radii.get(angleKey(first,b))).toBe(radii.get(angleKey(second,b)));
    expect(markingGroups(b,"angles").size).toBe(0);
    expect(angleDisplayRadii(b,[second,first,outer])).toEqual(radii);
  });
  it("removes congruence marks when the relationship is removed", () => {
    const {b} = crossingFixture();
    const [a,c] = sectors(topology(b)[0]);
    b.angles.push(a,c);
    b.constraints.push({id:uid(),kind:"equalAngle",angles:[a,c]});
    expect(markingGroups(b,"angles").size).toBe(2);
    b.constraints=[];
    expect(markingGroups(b,"angles").size).toBe(0);
    expect(angleDisplayRadii(b,b.angles).size).toBe(2);
  });
});


import { angleName } from "../src/model";
describe("released intersection identity (agent-authored)", () => {
  it("names and deduplicates a crossing after its point attachment is removed", () => {
    const {b,es} = crossingFixture();
    const a = sectors(topology(b)[0])[0];
    const p = addPoint(b,{x:0,y:0.00004});
    p.label="C";
    p.crossing=[es[0].id,es[1].id];
    const named = {...a,vertex:{point:p.id}};
    delete p.crossing;
    expect(angleKey(a,b)).toBe(angleKey(named,b));
    expect(angleName(b,a)).toBe(angleName(b,named));
    expect(angleName(b,a)).toContain("C");
    p.x=1;
    expect(angleKey(a,b)).not.toBe(angleKey(named,b));
    expect(angleName(b,a)).toContain("(intersection)");
  });
});
