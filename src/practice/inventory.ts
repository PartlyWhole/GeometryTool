// What a figure offers a student to point at: every segment, angle, ray and
// line that can legitimately be named on it.
import {
  type Board,
  angleRadians,
  distance,
  mod,
  projection,
  topology,
} from "../model";
import { type AngId, type LineId, type ObjId, type RayId, type SegId, objKey } from "./terms";
import { resolveAngle } from "./oracle";

export type Inventory = {
  points: string[];
  segments: SegId[];
  angles: AngId[];
  rays: RayId[];
  lines: LineId[];
};

const EMPTY: Inventory = { points: [], segments: [], angles: [], rays: [], lines: [] };

export function figureObjects(board?: Board, extra: ObjId[] = []): Inventory {
  if (!board) return withExtra(EMPTY, extra);
  const points = board.points.map((p) => p.label).sort();
  const segments: SegId[] = [];
  const seenSeg = new Set<string>();

  for (const e of board.edges) {
    if (e.kind === "circle" || e.hidden) continue;
    const a = board.points.find((p) => p.id === e.a),
      b = board.points.find((p) => p.id === e.b);
    if (!a || !b) continue;
    // Every labelled point lying on this support, in order along it.
    const on = board.points
      .filter(
        (p) =>
          p.id === a.id || p.id === b.id ||
          p.on?.edge === e.id || p.crossing?.includes(e.id) ||
          projection(p, a, b, e.kind).distance < 1e-4,
      )
      .map((p) => ({ p, t: projection(p, a, b, "line").t }))
      .sort((x, y) => x.t - y.t);
    for (let i = 0; i < on.length; i++)
      for (let j = i + 1; j < on.length; j++) {
        const s: SegId = { k: "seg", a: on[i].p.label, b: on[j].p.label };
        const k = objKey(s);
        if (!seenSeg.has(k)) (seenSeg.add(k), segments.push(s));
      }
  }

  const angles: AngId[] = [];
  const seenAng = new Set<string>();
  const pushAng = (a: AngId) => {
    const k = objKey(a);
    if (!seenAng.has(k)) (seenAng.add(k), angles.push(a));
  };
  for (const a of board.angles) if (a.label) pushAng({ k: "ang", name: a.label });

  const rays: RayId[] = [];
  const seenRay = new Set<string>();
  const lines: LineId[] = [];
  const seenLine = new Set<string>();

  for (const j of topology(board)) {
    const here = board.points.find((p) => distance(p, j.position) < 1e-6);
    if (!here) continue;
    const armLabel = (end: string) =>
      board.points.find((p) => p.id === end)?.label;
    const arms = j.directions
      .map((d) => armLabel(d.ref.end))
      .filter((x): x is string => !!x && x !== here.label);
    for (const arm of arms) {
      const r: RayId = { k: "ray", from: here.label, through: arm };
      if (!seenRay.has(objKey(r))) (seenRay.add(objKey(r)), rays.push(r));
    }
    for (let i = 0; i < arms.length; i++)
      for (let k = i + 1; k < arms.length; k++) {
        const name = arms[i] + here.label + arms[k];
        const ref = resolveAngle(board, { k: "ang", name });
        if (!ref) continue;
        const deg = (angleRadians(board, ref) * 180) / Math.PI;
        if (deg < 1e-6 || deg > 180 + 1e-6) continue;
        pushAng({ k: "ang", name });
      }
  }

  for (const e of board.edges) {
    if (e.kind !== "line") continue;
    const a = board.points.find((p) => p.id === e.a),
      b = board.points.find((p) => p.id === e.b);
    if (!a || !b) continue;
    const l: LineId = { k: "line", a: a.label, b: b.label };
    if (!seenLine.has(objKey(l))) (seenLine.add(objKey(l)), lines.push(l));
  }

  const sortByName = <T extends ObjId>(xs: T[]) =>
    xs.sort((p, q) => objKey(p).localeCompare(objKey(q)));

  return withExtra(
    {
      points,
      segments: sortByName(segments),
      angles: sortByName(angles),
      rays: sortByName(rays),
      lines: sortByName(lines),
    },
    extra,
  );
}

function withExtra(inv: Inventory, extra: ObjId[]): Inventory {
  const out: Inventory = {
    points: [...inv.points],
    segments: [...inv.segments],
    angles: [...inv.angles],
    rays: [...inv.rays],
    lines: [...inv.lines],
  };
  for (const o of extra) {
    const has = (xs: ObjId[]) => xs.some((x) => objKey(x) === objKey(o));
    if (o.k === "seg" && !has(out.segments)) out.segments.push(o);
    if (o.k === "ang" && !has(out.angles)) out.angles.push(o);
    if (o.k === "ray" && !has(out.rays)) out.rays.push(o);
    if (o.k === "line" && !has(out.lines)) out.lines.push(o);
    if (o.k === "pt" && !out.points.includes(o.p)) out.points.push(o.p);
  }
  return out;
}

/** Unused, but kept for symmetry with the model's helpers. */
export const wrap = mod;
