// A read-only figure renderer for the practice modes.
//
// Deliberately separate from Canvas.tsx: exercises need marks, role colours and
// pickable objects, but none of the editing, snapping or solver machinery, and
// the whiteboard's own contract should not be disturbed to get them.
import React, { useEffect, useMemo, useState } from "react";
import {
  type AngleRef,
  type Board,
  type SegmentRef,
  angleRadians,
  angleKey,
  direction,
  distance,
  endpoints,
  mod,
  segmentKey,
  vertex,
} from "../model";
import { angleDisplayRadii, markingGroups } from "../relationships";
import { type AngId, type ObjId, type SegId, objKey } from "./terms";
import { resolveAngle, resolveSeg } from "./oracle";

/** The reference's colour notation: given, prove, shared, construction. */
export type Role = "given" | "prove" | "shared" | "construction" | "pick";

export type Highlight = { obj: ObjId; role: Role };

type Props = {
  board: Board;
  highlights?: Highlight[];
  /** Points the student has chosen, drawn in order. */
  chosen?: string[];
  onPickPoint?: (label: string) => void;
  /** Drag a point to new coordinates. Enables direct manipulation. */
  onMovePoint?: (label: string, x: number, y: number) => void;
  /** Points the student may drag; all of them when omitted. */
  movable?: string[];
  onPickSegment?: (s: SegId) => void;
  onPickAngle?: (a: AngId) => void;
  /** Hide point letters, for "what is this called?" prompts. */
  hideLabels?: boolean;
  height?: number;
  className?: string;
  ariaLabel?: string;
};

const PAD = 46;

export function Figure(props: Props) {
  const b = props.board;
  const svgRef = React.useRef<SVGSVGElement>(null);
  // The viewBox is grown to the rendered aspect ratio, so rays clipped to it
  // reach the card's edges instead of overshooting into the letterbox gutter.
  const [aspect, setAspect] = useState(1.7);
  const dragging = React.useRef<string | null>(null);

  const canMove = (label: string) =>
    !!props.onMovePoint && (!props.movable || props.movable.includes(label));

  const toWorld = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    return ctm ? pt.matrixTransform(ctm.inverse()) : undefined;
  };
  useEffect(() => {
    const el = svgRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      if (r.width > 8 && r.height > 8) setAspect(r.width / r.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const view = useMemo(() => bounds(b, aspect), [b, aspect]);
  const marksSeg = useMemo(() => markingGroups(b, "segments"), [b]);
  const marksAng = useMemo(() => markingGroups(b, "angles"), [b]);

  const roleOf = (o: ObjId): Role | undefined =>
    props.highlights?.find((h) => objKey(h.obj) === objKey(o))?.role;

  // Angles worth drawing: those the figure names, those carrying a constraint,
  // and those a highlight refers to.
  const drawn = useMemo(() => {
    const out: { ref: AngleRef; id: AngId }[] = [];
    const seen = new Set<string>();
    const push = (ref: AngleRef | undefined, id: AngId) => {
      if (!ref) return;
      const k = angleKey(ref, b);
      if (seen.has(k)) return;
      seen.add(k);
      out.push({ ref, id });
    };
    for (const a of b.angles) if (a.label) push(a, { k: "ang", name: a.label });
    for (const c of b.constraints) {
      if (c.kind === "angle") push(c.angle, namedFor(b, c.angle));
      if (c.kind === "equalAngle")
        for (const a of c.angles) push(a, namedFor(b, a));
    }
    for (const h of props.highlights ?? [])
      if (h.obj.k === "ang") push(resolveAngle(b, h.obj), h.obj);
    return out;
  }, [b, props.highlights]);

  const radii = useMemo(
    () => angleDisplayRadii(b, drawn.map((d) => d.ref)),
    [b, drawn],
  );

  const scale = 1;
  const pointAt = (label: string) => b.points.find((p) => p.label === label);

  return (
    <svg
      ref={svgRef}
      onPointerMove={(e) => {
        const label = dragging.current;
        if (!label) return;
        const w = toWorld(e);
        if (w) props.onMovePoint?.(label, w.x, w.y);
      }}
      onPointerUp={(e) => {
        if (dragging.current) {
          (e.target as Element).releasePointerCapture?.(e.pointerId);
          dragging.current = null;
        }
      }}
      className={"figure " + (props.className ?? "")}
      viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
      style={props.height ? { height: props.height } : undefined}
      role="img"
      aria-label={props.ariaLabel ?? "Geometry figure"}
    >
      {/* Edges */}
      {b.edges.map((e) => {
        if (e.hidden || e.kind === "circle") return null;
        const a = b.points.find((p) => p.id === e.a),
          c = b.points.find((p) => p.id === e.b);
        if (!a || !c) return null;
        const [p, q] = extend(a, c, e.kind, view);
        const ref: SegmentRef = { edge: e.id };
        const role = roleFor(b, props.highlights, ref);
        return (
          <g key={e.id}>
            <line
              className="fig-edge-hit"
              x1={p.x} y1={p.y} x2={q.x} y2={q.y}
              onClick={
                props.onPickSegment
                  ? () => {
                      const ends = endpoints(b, ref);
                      if (ends)
                        props.onPickSegment!({
                          k: "seg",
                          a: ends[0].label,
                          b: ends[1].label,
                        });
                    }
                  : undefined
              }
              style={{ cursor: props.onPickSegment ? "pointer" : undefined }}
            />
            <line
              className={"fig-edge" + (role ? " role-" + role : "")}
              x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            />
          </g>
        );
      })}

      {/* Tick marks for congruent segments */}
      {b.constraints.flatMap((c) =>
        c.kind !== "equalLength"
          ? []
          : c.segments.map((s, i) => {
              const n = marksSeg.get(segmentKey(s)) ?? 1;
              return <Ticks key={c.id + i} board={b} seg={s} count={n} />;
            }),
      )}

      {/* Angle arcs */}
      {drawn.map(({ ref, id }) => {
        const v = vertex(b, ref.vertex);
        if (!v) return null;
        const r = radii.get(angleKey(ref, b)) ?? 44;
        const s = direction(b, ref, ref.start),
          e = direction(b, ref, ref.end);
        if (s === undefined || e === undefined) return null;
        const sweep = angleRadians(b, ref);
        const right = Math.abs((sweep * 180) / Math.PI - 90) < 1e-6 &&
          b.constraints.some(
            (c) => c.kind === "angle" && c.value === 90 &&
              angleKey(c.angle, b) === angleKey(ref, b),
          );
        const role = roleOf(id);
        const count = marksAng.get(angleKey(ref, b)) ?? 0;
        return (
          <g key={ref.id + id.name} className={role ? "role-" + role : ""}>
            {right ? (
              <RightMark v={v} s={s} e={e} />
            ) : (
              // The number of arcs is what matches: an angle in congruence
              // class n carries exactly n arcs, and an unmarked one carries a
              // single plain arc.
              Array.from({ length: Math.max(count, 1) }, (_, i) => (
                <path
                  key={i}
                  className={
                    "fig-arc" + (count ? " mark" : "") +
                    (role ? " role-" + role : "")
                  }
                  d={arcPath(v, s, sweep, (r + i * 7) * scale)}
                />
              ))
            )}
            {props.onPickAngle && (
              <path
                className="fig-arc-hit"
                d={wedgePath(v, s, sweep, (r + 14) * scale)}
                onClick={() => props.onPickAngle!(id)}
                style={{ cursor: "pointer" }}
              />
            )}
          </g>
        );
      })}

      {/* Points */}
      {b.points.map((p) => {
        const role = roleOf({ k: "pt", p: p.label });
        const idx = props.chosen?.indexOf(p.label) ?? -1;
        const off = p.labelOffset ?? labelOffset(b, p.label);
        return (
          <g key={p.id}>
            {(props.onPickPoint || canMove(p.label)) && (
              <circle
                cx={p.x} cy={p.y} r={16}
                className="fig-point-hit"
                onClick={props.onPickPoint ? () => props.onPickPoint!(p.label) : undefined}
                onPointerDown={
                  canMove(p.label)
                    ? (e) => {
                        e.preventDefault();
                        dragging.current = p.label;
                        (e.target as Element).setPointerCapture?.(e.pointerId);
                      }
                    : undefined
                }
                style={{
                  cursor: canMove(p.label)
                    ? "grab"
                    : props.onPickPoint
                      ? "pointer"
                      : undefined,
                  touchAction: canMove(p.label) ? "none" : undefined,
                }}
              >
                <title>{canMove(p.label) ? "Drag " + p.label : p.label}</title>
              </circle>
            )}
            <circle
              cx={p.x} cy={p.y} r={idx >= 0 ? 7 : 4.5}
              className={
                "fig-point" + (idx >= 0 ? " chosen" : "") +
                (canMove(p.label) ? " movable" : "") +
                (role ? " role-" + role : "")
              }
            />
            {idx >= 0 && (
              <text className="fig-order" x={p.x} y={p.y + 3.4}>
                {idx + 1}
              </text>
            )}
            {!props.hideLabels && (
              <text
                className={"fig-label" + (role ? " role-" + role : "")}
                x={p.x + off.x}
                y={p.y + off.y}
              >
                {p.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Angle names for numbered angles */}
      {drawn.map(({ ref, id }) => {
        if (id.name.length > 2) return null;
        const v = vertex(b, ref.vertex);
        const s = direction(b, ref, ref.start);
        if (!v || s === undefined) return null;
        const r = (radii.get(angleKey(ref, b)) ?? 44) * 0.62;
        const mid = s + angleRadians(b, ref) / 2;
        return (
          <text
            key={"n" + ref.id}
            className="fig-anglename"
            x={v.x + r * Math.cos(mid)}
            y={v.y + r * Math.sin(mid) + 4}
          >
            {id.name}
          </text>
        );
      })}
    </svg>
  );
}

function namedFor(b: Board, ref: AngleRef): AngId {
  const stored = b.angles.find(
    (a) => a.label && angleKey(a, b) === angleKey(ref, b),
  );
  if (stored?.label) return { k: "ang", name: stored.label };
  // Fall back to the three-point name from the board.
  const v = vertex(b, ref.vertex);
  const arm = (d: Parameters<typeof direction>[2]) =>
    b.points.find((p) => p.id === d.end)?.label ?? "?";
  const vl = v
    ? b.points.find((p) => distance(p, v) < 1e-6)?.label ?? "?"
    : "?";
  return { k: "ang", name: arm(ref.start) + vl + arm(ref.end) };
}

function roleFor(
  b: Board,
  highlights: Highlight[] | undefined,
  ref: SegmentRef,
): Role | undefined {
  for (const h of highlights ?? []) {
    if (h.obj.k !== "seg") continue;
    const r = resolveSeg(b, h.obj);
    if (r && segmentKey(r) === segmentKey(ref)) return h.role;
  }
  return undefined;
}

function Ticks(props: { board: Board; seg: SegmentRef; count: number }) {
  const ends = endpoints(props.board, props.seg);
  if (!ends) return null;
  const [a, b] = ends;
  const mx = (a.x + b.x) / 2,
    my = (a.y + b.y) / 2;
  const d = distance(a, b);
  if (!d) return null;
  const ux = (b.x - a.x) / d,
    uy = (b.y - a.y) / d;
  const nx = -uy,
    ny = ux;
  const gap = 5;
  return (
    <g className="fig-ticks">
      {Array.from({ length: props.count }, (_, i) => {
        const o = (i - (props.count - 1) / 2) * gap;
        const cx = mx + ux * o,
          cy = my + uy * o;
        return (
          <line
            key={i}
            x1={cx - nx * 6} y1={cy - ny * 6}
            x2={cx + nx * 6} y2={cy + ny * 6}
          />
        );
      })}
    </g>
  );
}

function RightMark(props: { v: { x: number; y: number }; s: number; e: number }) {
  const { v, s } = props;
  const r = 18;
  const p1 = { x: v.x + r * Math.cos(s), y: v.y + r * Math.sin(s) };
  const p3 = { x: v.x + r * Math.cos(props.e), y: v.y + r * Math.sin(props.e) };
  const p2 = { x: p1.x + p3.x - v.x, y: p1.y + p3.y - v.y };
  return (
    <polyline
      className="fig-right"
      points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
    />
  );
}

function arcPath(v: { x: number; y: number }, start: number, sweep: number, r: number) {
  const a = { x: v.x + r * Math.cos(start), y: v.y + r * Math.sin(start) };
  const b = {
    x: v.x + r * Math.cos(start + sweep),
    y: v.y + r * Math.sin(start + sweep),
  };
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${b.x} ${b.y}`;
}

function wedgePath(v: { x: number; y: number }, start: number, sweep: number, r: number) {
  const a = { x: v.x + r * Math.cos(start), y: v.y + r * Math.sin(start) };
  const b = {
    x: v.x + r * Math.cos(start + sweep),
    y: v.y + r * Math.sin(start + sweep),
  };
  return `M ${v.x} ${v.y} L ${a.x} ${a.y} A ${r} ${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${b.x} ${b.y} Z`;
}

/** Push a label away from the edges meeting at its point. */
function labelOffset(b: Board, labelName: string) {
  const p = b.points.find((q) => q.label === labelName);
  if (!p) return { x: 10, y: -8 };
  const dirs: number[] = [];
  for (const e of b.edges) {
    if (e.kind === "circle") continue;
    const other =
      e.a === p.id
        ? b.points.find((q) => q.id === e.b)
        : e.b === p.id
          ? b.points.find((q) => q.id === e.a)
          : undefined;
    if (other) {
      const t = Math.atan2(other.y - p.y, other.x - p.x);
      dirs.push(t);
      // A ray or line carries on past this point, so the far side is
      // occupied too and the letter must not be placed there.
      if (e.kind === "line" || (e.kind === "ray" && e.a !== p.id))
        dirs.push(t + Math.PI);
    } else if (p.on || p.crossing) {
      const u = b.points.find((q) => q.id === e.a),
        w = b.points.find((q) => q.id === e.b);
      if (u && w && distance(p, u) > 1e-6 && distance(p, w) > 1e-6) {
        const t = Math.atan2(w.y - u.y, w.x - u.x);
        if (onSegmentish(p, u, w)) dirs.push(t, t + Math.PI);
      }
    }
  }
  if (!dirs.length) return { x: 11, y: -9 };
  // Choose the direction furthest from every edge.
  let best = 0,
    bestGap = -1;
  for (let i = 0; i < 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    const gap = Math.min(
      ...dirs.map((d) => Math.abs(mod(t - d + Math.PI) - Math.PI)),
    );
    if (gap > bestGap) (bestGap = gap), (best = t);
  }
  return { x: 17 * Math.cos(best), y: 17 * Math.sin(best) + 5 };
}

const onSegmentish = (
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
) => {
  const d = distance(a, b);
  if (!d) return false;
  const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (d * d);
  const proj = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  return distance(p, proj) < 1e-4 && t > -0.01 && t < 1.01;
};

function extend(
  a: { x: number; y: number },
  b: { x: number; y: number },
  kind: string,
  view: View,
) {
  if (kind === "segment") return [a, b];
  const d = distance(a, b) || 1;
  const ux = (b.x - a.x) / d,
    uy = (b.y - a.y) / d;
  // A ray starts at its endpoint and runs to the frame; a line runs both ways.
  const fwd = exitDistance(a, ux, uy, view);
  const end = { x: a.x + ux * fwd, y: a.y + uy * fwd };
  if (kind !== "line") return [a, end];
  const back = exitDistance(a, -ux, -uy, view);
  return [{ x: a.x - ux * back, y: a.y - uy * back }, end];
}

export type View = { x: number; y: number; w: number; h: number };

function bounds(b: Board, aspect = 1.7): View {
  let x0 = -100, x1 = 100, y0 = -100, y1 = 100;
  if (b.points.length) {
    const xs = b.points.map((p) => p.x),
      ys = b.points.map((p) => p.y);
    x0 = Math.min(...xs);
    x1 = Math.max(...xs);
    y0 = Math.min(...ys);
    y1 = Math.max(...ys);
  }
  // Padding leaves room for point letters, which sit outside the geometry.
  let x = x0 - PAD,
    y = y0 - PAD,
    w = Math.max(x1 - x0, 60) + PAD * 2,
    h = Math.max(y1 - y0, 60) + PAD * 2;
  // Grow the short side so the drawing is centred without the rays running
  // past the frame.
  const a = w / h;
  if (a < aspect) {
    const nw = h * aspect;
    x -= (nw - w) / 2;
    w = nw;
  } else if (a > aspect) {
    const nh = w / aspect;
    y -= (nh - h) / 2;
    h = nh;
  }
  return { x, y, w, h };
}

/** How far a ray from `a` in direction `u` travels before leaving the frame. */
function exitDistance(
  a: { x: number; y: number },
  ux: number,
  uy: number,
  v: View,
) {
  let t = Infinity;
  const hit = (num: number, den: number) => {
    if (Math.abs(den) < 1e-9) return;
    const s = num / den;
    if (s > 1e-6) t = Math.min(t, s);
  };
  hit(v.x - a.x, ux);
  hit(v.x + v.w - a.x, ux);
  hit(v.y - a.y, uy);
  hit(v.y + v.h - a.y, uy);
  return Number.isFinite(t) ? t : 0;
}
