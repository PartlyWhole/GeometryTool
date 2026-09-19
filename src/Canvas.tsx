import {
  segmentPieceAt,
  segmentPieces,
  markingGroups,
  angleDisplayRadii,
  touchesRect,
} from "./relationships";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  type Board,
  type Selection,
  type XY,
  type AngleRef,
  type Edge,
  type SegmentRef,
  type Point,
  point,
  edge,
  vertex,
  direction,
  angleRadians,
  angleDegrees,
  angleName,
  angleKey as rawAngleKey,
  segmentKey,
  segmentName,
  topology,
  angleAt,
  sectors,
  projection,
  distance,
  clone,
  uid,
  addPoint,
  addEdge,
  endpoints,
  mod,
  TAU,
} from "./model";
import {
  rememberAngle,
  selectionPointIds,
  scalar,
  fixedAngles,
} from "./actions";
type Hit = { key: string; label: string; selection: Selection };
export type Camera = { x: number; y: number; zoom: number };
export type Tool =
  | "select"
  | "segment"
  | "angle"
  | "point"
  | "ray"
  | "line"
  | "circle"
  | "hand"
  | "text";
export type Snap = {
  position: XY;
  point?: string;
  crossing?: [string, string];
  on?: Point["on"];
  text?: string;
};
type Props = {
  board: Board;
  angleHint?: AngleRef;
  selection: Selection;
  setSelection: (s: Selection) => void;
  commit: (b: Board, s?: Selection) => void;
  drag: (b: Board, targets: Record<string, XY>, final: boolean) => void;
  tool: Tool;
  camera: Camera;
  setCamera: (c: Camera) => void;
  grid: boolean;
  additive: boolean;
  chain: boolean;
  snapping: boolean;
  filter: "all" | "angles" | "segments" | "points";
  touches: boolean;
  cancelToken: number;
  notice: (s: string) => void;
  busy: boolean;
  cancel: () => void;
  onAngleHover?: (a?: AngleRef) => void;
};
function anglePath(b: Board, a: AngleRef, r: number, sector = false) {
  const v = vertex(b, a.vertex),
    s = direction(b, a, a.start),
    delta = angleRadians(b, a);
  if (!v || s === undefined || !Number.isFinite(delta)) return "";
  const x = v.x + r * Math.cos(s),
    y = v.y + r * Math.sin(s),
    end = s + a.sweep * delta;
  const ex = v.x + r * Math.cos(end),
    ey = v.y + r * Math.sin(end);
  if (a.full)
    return `M ${v.x - r} ${v.y} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
  return `${sector ? `M ${v.x} ${v.y} L` : "M"} ${x} ${y} A ${r} ${r} 0 ${delta > Math.PI ? 1 : 0} ${a.sweep === 1 ? 1 : 0} ${ex} ${ey}${sector ? " Z" : ""}`;
}
export function Canvas(props: Props) {
  const { board: b, selection: sel, camera: cam } = props,
    svg = useRef<SVGSVGElement>(null),
    [pointer, setPointer] = useState<XY>({ x: 0, y: 0 }),
    [hover, setHover] = useState<AngleRef>(),
    [previewHit, setPreviewHit] = useState<Hit>(),
    [picker, setPicker] = useState<{ x: number; y: number; hits: Hit[]; append: boolean }>(),
    [snap, setSnap] = useState<Snap>(),
    [draft, setDraft] = useState<Snap[]>([]),
    [angleInput, setAngleInput] = useState(""),
    [box, setBox] = useState<{ a: XY; b: XY }>(),
    [space, setSpace] = useState(false),
    [noteEditor, setNoteEditor] = useState<{
      id?: string;
      pointId?: string;
      position: XY;
      text: string;
    }>();
  const angleKey = (a: AngleRef) => rawAngleKey(a, b);
  const pendingPick = useRef<{ start: XY; screen: XY; hits: Hit[]; append: boolean } | undefined>(undefined);
  const noteInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (noteEditor) {
      noteInput.current?.focus();
      noteInput.current?.select();
    }
  }, [noteEditor?.id, noteEditor?.pointId, !!noteEditor]);
  const editNote = (position: XY, text = "", id?: string) => {
    gesture.current = undefined;
    setSnap(undefined);
    setNoteEditor({
      id,
      position,
      text: text === "Double-click to edit" ? "" : text,
    });
  };
  const editPoint = (id: string) => {
    const p = point(b, id);
    if (!p) return;
    setSnap(undefined);
    setNoteEditor({
      pointId: id,
      position: {
        x: p.x + (p.labelOffset?.x || 0) + 11 / cam.zoom,
        y: p.y + (p.labelOffset?.y || 0) + 20 / cam.zoom,
      },
      text: p.label,
    });
  };
  const duplicateName =
    !!noteEditor?.pointId &&
    b.points.some(
      (p) => p.id !== noteEditor.pointId && p.label === noteEditor.text.trim(),
    );
  const saveNote = () => {
    if (!noteEditor) return;
    const text = noteEditor.text.trim();
    if (noteEditor.pointId) {
      if (!text || duplicateName) return;
      const next = clone(b),
        p = point(next, noteEditor.pointId);
      if (!p) return;
      p.label = text;
      props.commit(next, {
        points: [p.id],
        segments: [],
        angles: [],
        notes: [],
      });
      setNoteEditor(undefined);
      svg.current?.focus();
      return;
    }
    if (text) {
      const next = clone(b),
        id = noteEditor.id || uid();
      if (noteEditor.id) {
        const note = next.notes.find((n) => n.id === id);
        if (note) note.text = text;
      } else next.notes.push({ id, position: noteEditor.position, text });
      props.commit(next, { points: [], segments: [], angles: [], notes: [id] });
    }
    setNoteEditor(undefined);
    svg.current?.focus();
  };
  const gesture = useRef<
    | {
        kind:
          | "point"
          | "translate"
          | "box"
          | "pan"
          | "draw"
          | "label"
          | "arc"
          | "note";
        start: XY;
        screen: XY;
        board: Board;
        point?: string;
        ids?: string[];
        selection: Selection;
        camera: Camera;
        angle?: AngleRef;
        moved: boolean;
        note?: string;
      }
    | undefined
  >(undefined);
  const js = useMemo(() => topology(b), [b]);
  useEffect(() => {
    setDraft([]);
    setNoteEditor(undefined);
    setBox(undefined);
    gesture.current = undefined;
    setHover(undefined);
    setPicker(undefined);
    pendingPick.current = undefined;
    setPreviewHit(undefined);
  }, [props.tool, props.cancelToken]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).matches(
          "input,textarea,[contenteditable=true]",
        )
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        setSpace(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpace(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  const world = (e: { clientX: number; clientY: number }): XY => {
    const r = svg.current!.getBoundingClientRect();
    return {
      x: (e.clientX - r.left - cam.x) / cam.zoom,
      y: (e.clientY - r.top - cam.y) / cam.zoom,
    };
  };
  const getSnap = (p: XY, disabled = false, ignore: string[] = []): Snap => {
    if (disabled || !props.snapping) return { position: p };
    const radius = 10 / cam.zoom;
    const closest = b.points
      .filter((x) => !ignore.includes(x.id))
      .map((x) => ({ x, d: distance(p, x) }))
      .sort((a, c) => a.d - c.d)[0];
    if (closest && closest.d < radius)
      return {
        position: closest.x,
        point: closest.x.id,
        text: "Point " + closest.x.label,
      };
    const j = js.find(
      (j) => !("point" in j.ref) && distance(p, j.position) < radius,
    );
    if (j) {
      const e = j.directions[0]?.ref.edge;
      if (e) {
        const es = endpoints(b, { edge: e })!;
        const pos = projection(j.position, ...es);
        return {
          position: j.position,
          crossing: "intersection" in j.ref ? j.ref.intersection : undefined,
          text: "Intersection",
        };
      }
    }
    for (const e of b.edges.filter(
      (e) =>
        e.kind === "segment" && !ignore.includes(e.a) && !ignore.includes(e.b),
    )) {
      const a = point(b, e.a)!,
        c = point(b, e.b)!;
      const mid = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 };
      if (distance(p, mid) < radius)
        return {
          position: mid,
          on: { edge: e.id, t: 0.5, midpoint: true },
          text: "Midpoint of " + a.label + c.label,
        };
    }
    const near = b.edges
      .filter(
        (e) =>
          e.kind !== "circle" && !ignore.includes(e.a) && !ignore.includes(e.b),
      )
      .map((e) => ({
        e,
        ...projection(p, point(b, e.a)!, point(b, e.b)!, e.kind),
      }))
      .sort((a, c) => a.distance - c.distance)[0];
    if (near && near.distance < radius)
      return {
        position: near.p,
        on: { edge: near.e.id, t: near.t },
        text: "On " + segmentName(b, { edge: near.e.id }),
      };
    if (props.grid) {
      const q = { x: Math.round(p.x / 20) * 20, y: Math.round(p.y / 20) * 20 };
      if (distance(p, q) < radius) return { position: q, text: "Grid" };
    }
    return { position: p };
  };
  const resolve = (board: Board, s: Snap) => {
    if (s.point && point(board, s.point)) return point(board, s.point)!;
    const p = addPoint(board, s.position, s.on);
    if (s.crossing) p.crossing = s.crossing;
    return p;
  };
  const finishDraw = (first: Snap, last: Snap) => {
    if (distance(first.position, last.position) * cam.zoom < 3) {
      props.notice("Choose a second, distinct endpoint.");
      return;
    }
    const next = clone(b),
      a = resolve(next, first),
      c = resolve(next, last);
    const e = addEdge(
      next,
      a.id,
      c.id,
      props.tool === "circle"
        ? "circle"
        : props.tool === "ray"
          ? "ray"
          : props.tool === "line"
            ? "line"
            : "segment",
    );
    props.commit(next, {
      points: [],
      segments: [{ edge: e.id }],
      angles: [],
      notes: [],
    });
    setDraft(
      props.chain && props.tool === "segment"
        ? [{ position: c, point: c.id, text: "Point " + c.label }]
        : [],
    );
    setSnap(undefined);
  };
  const pointHit = (p: XY) =>
    b.points
      .filter((x) => distance(p, x) * cam.zoom < 10)
      .sort((a, c) => distance(p, a) - distance(p, c))[0];
  const segmentHits = (p: XY) =>
    b.edges
      .filter((e) => !e.hidden)
      .map((e) => {
        const a = point(b, e.a)!,
          c = point(b, e.b)!;
        return {
          e,
          d:
            e.kind === "circle"
              ? Math.abs(distance(a, p) - distance(a, c))
              : projection(p, a, c, e.kind).distance,
        };
      })
      .filter((x) => x.d * cam.zoom < 7)
      .sort((a, c) => a.d - c.d);
  const candidates = (p: XY): Hit[] => {
    const hits: Hit[] = [];
    const empty = (): Selection => ({ points: [], segments: [], angles: [], notes: [] });
    if (!["angles", "segments"].includes(props.filter)) {
      const ps = b.points.filter(x => distance(p, x) * cam.zoom < 10)
        .sort((a, c) => distance(p, a) - distance(p, c));
      for (const q of ps.filter(x => distance(p, x) * cam.zoom <= distance(p, ps[0]) * cam.zoom + 3))
        hits.push({ key: q.id, label: "Point " + q.label, selection: { ...empty(), points: [q.id] } });
      if (hits.length) return hits;
    }
    if (!["angles", "points"].includes(props.filter)) {
      const ss = segmentHits(p);
      for (const {e} of ss.filter(x => x.d * cam.zoom <= ss[0].d * cam.zoom + 3)) {
        const piece = segmentPieceAt(b, e.id, p);
        hits.push({ key: segmentKey(piece), label: "Segment " + segmentName(b, piece), selection: { ...empty(), segments: [piece] } });
      }
      if (hits.length) return hits;
    }
    if (!["points", "segments"].includes(props.filter)) {
      const regions = js.flatMap(j => { const a = angleAt(b, [j], p, cam.zoom); return a ? [a] : []; });
      const saved = b.angles.filter(a => {
        const v = vertex(b, a.vertex), start = direction(b, a, a.start);
        if (!v || start === undefined) return false;
        const r = distance(p, v) * cam.zoom;
        return r >= 15 && r <= Math.max(88, a.radius || 44) && mod(a.sweep * (Math.atan2(p.y-v.y,p.x-v.x)-start)) < angleRadians(b,a);
      });
      for (const a of [...regions, ...saved].sort((a,c) => angleRadians(b,a)-angleRadians(b,c))) {
        const key = angleKey(a);
        if (!hits.some(h => h.key === key)) hits.push({ key, label: "∠" + angleName(b,a) + " · " + angleDegrees(b,a).toFixed(1) + "°", selection: { ...empty(), angles: [a] } });
      }
    }
    return hits;
  };
  const chooseHit = (hit: Hit, append: boolean) => {
    const next = append ? clone(sel) : { points: [], segments: [], angles: [], notes: [] } as Selection;
    for (const id of hit.selection.points) next.points = next.points.includes(id) ? next.points.filter(x => x !== id) : [...next.points,id];
    for (const ref of hit.selection.segments) next.segments = next.segments.some(x => segmentKey(x) === segmentKey(ref)) ? next.segments.filter(x => segmentKey(x) !== segmentKey(ref)) : [...next.segments,ref];
    for (const ref of hit.selection.angles) next.angles = next.angles.some(x => angleKey(x) === angleKey(ref)) ? next.angles.filter(x => angleKey(x) !== angleKey(ref)) : [...next.angles,ref];
    props.setSelection(next);
    setPicker(undefined);
    setPreviewHit(undefined);
    svg.current?.focus();
  };
  const pick = (p: XY, append: boolean, cycle = false): Selection => {
    const next = append
      ? clone(sel)
      : { points: [], segments: [], angles: [], notes: [] };
    const ph = pointHit(p),
      sh = segmentHits(p);
    const ang =
      props.filter === "points" || props.filter === "segments"
        ? undefined
        : angleAt(b, js, p, cam.zoom);
    const toggle = (arr: string[], id: string) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
    if (ph && props.filter !== "angles" && props.filter !== "segments") {
      next.points = toggle(next.points, ph.id);
      return next;
    }
    if (sh.length && props.filter !== "angles" && props.filter !== "points") {
      let hit = sh[0].e;
      if (cycle) {
        const current = sh.findIndex((x) =>
          sel.segments.some((s) => s.edge === x.e.id),
        );
        hit = sh[(current + 1) % sh.length].e;
        props.notice(
          `Selected ${segmentName(b, { edge: hit.id })} · ${sh.length} overlapping objects`,
        );
      }
      const s = segmentPieceAt(b, hit.id, p);
      const ix = next.segments.findIndex(
        (x) => segmentKey(x) === segmentKey(s),
      );
      if (ix >= 0) next.segments.splice(ix, 1);
      else next.segments.push(s);
      return next;
    }
    if (ang) {
      const match = b.angles.find((a) => angleKey(a) === angleKey(ang)) || ang;
      const ix = next.angles.findIndex((a) => angleKey(a) === angleKey(match));
      if (ix >= 0) next.angles.splice(ix, 1);
      else next.angles.push(match);
      return next;
    }
    return next;
  };
  const touches = useRef(new Map<number, XY>()),
    pinch = useRef<{ distance: number; camera: Camera; world: XY } | undefined>(
      undefined,
    );
  const down = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") {
      touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.current.size === 2) {
        const [a, b] = [...touches.current.values()],
          mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        props.cancel();
        gesture.current = undefined;
        setDraft([]);
        pinch.current = {
          distance: Math.max(1, distance(a, b)),
          camera: cam,
          world: {
            x: (mid.x - cam.x) / cam.zoom,
            y: (mid.y - cam.y) / cam.zoom,
          },
        };
        svg.current?.setPointerCapture(e.pointerId);
        return;
      }
    }
    if (e.button !== 0 && e.button !== 1) return;
    const p = world(e);
    svg.current?.setPointerCapture(e.pointerId);
    const screen = { x: e.clientX, y: e.clientY };
    if (props.tool === "hand" || space || e.button === 1) {
      gesture.current = {
        kind: "pan",
        start: p,
        screen,
        board: b,
        camera: cam,
        selection: sel,
        moved: false,
      };
      return;
    }
    if (props.busy) return;
    const target = e.target as SVGElement,
      role = target.getAttribute("data-role"),
      id = target.getAttribute("data-id");
    if (role === "label" && id) {
      gesture.current = {
        kind: "label",
        point: id,
        start: p,
        screen,
        board: clone(b),
        camera: cam,
        selection: sel,
        moved: false,
      };
      return;
    }

    if (props.tool === "point") {
      const s = getSnap(p, e.altKey),
        n = clone(b),
        v = resolve(n, s);
      props.commit(n, { points: [v.id], segments: [], angles: [], notes: [] });
      return;
    }
    if (props.tool === "text") {
      e.preventDefault();
      if (!noteEditor) editNote(p);
      return;
    }
    if (props.tool === "angle") {
      const s = getSnap(p, e.altKey),
        next = [...draft, s];
      if (next.length < 3) {
        setDraft(next);
        return;
      }
      const n = clone(b),
        v = resolve(n, next[0]),
        a = resolve(n, next[1]),
        c = resolve(n, next[2]);
      if (new Set([v.id, a.id, c.id]).size < 3) {
        props.notice("Choose a vertex and two distinct arm endpoints.");
        return;
      }
      const first = addEdge(n, v.id, a.id),
        last = addEdge(n, v.id, c.id);
      let angle: AngleRef = {
        id: uid(),
        vertex: { point: v.id },
        start: { edge: first.id, end: a.id },
        end: { edge: last.id, end: c.id },
        sweep: 1,
      };
      if (angleRadians(n, angle) > Math.PI) angle.sweep = -1;
      n.angles.push(angle);
      if (angleInput) {
        try {
          fixedAngles(n, [angle], scalar(angleInput), angleInput);
        } catch (error) {
          props.notice((error as Error).message);
          return;
        }
      }
      props.commit(n, { points: [], segments: [], angles: [angle], notes: [] });
      setDraft([]);
      setAngleInput("");
      return;
    }
    if (["segment", "line", "ray", "circle"].includes(props.tool)) {
      let s = getSnap(p, e.altKey);
      if (draft.length) {
        if (e.shiftKey) {
          const v = draft[0].position,
            r = distance(p, v),
            a =
              (Math.round(Math.atan2(p.y - v.y, p.x - v.x) / (Math.PI / 12)) *
                Math.PI) /
              12;
          s = getSnap(
            { x: v.x + r * Math.cos(a), y: v.y + r * Math.sin(a) },
            e.altKey,
          );
        }
        finishDraw(draft[0], s);
        gesture.current = undefined;
        return;
      }
      setDraft([s]);
      gesture.current = {
        kind: "draw",
        start: s.position,
        screen,
        board: b,
        camera: cam,
        selection: sel,
        moved: false,
      };
      return;
    }
    const ph = pointHit(p),
      sh = segmentHits(p),
      selected = pick(p, e.shiftKey || props.additive, e.altKey);
    if (ph && props.filter !== "angles" && props.filter !== "segments") {
      if (!sel.points.includes(ph.id) || e.shiftKey || props.additive)
        props.setSelection(selected);
      if (ph.pinned) {
        props.notice("This point is pinned. Unpin it to move it.");
        return;
      }
      gesture.current = {
        kind: "point",
        point: ph.id,
        start: p,
        screen,
        board: clone(b),
        camera: cam,
        selection: sel,
        moved: false,
      };
      return;
    }
    if (sh.length && props.filter !== "angles" && props.filter !== "points") {
      const hitRef = segmentPieceAt(b, sh[0].e.id, p);
      const already = sel.segments.some(
        (s) => segmentKey(s) === segmentKey(hitRef),
      );
      if (!already || e.shiftKey || props.additive || e.altKey)
        props.setSelection(selected);
      gesture.current = {
        kind: "translate",
        ids: selectionPointIds(b, already && !e.shiftKey ? sel : selected),
        start: p,
        screen,
        board: clone(b),
        camera: cam,
        selection: sel,
        moved: false,
      };
      return;
    }
    if (selected.angles.length) {
      props.setSelection(selected);
      return;
    }
    gesture.current = {
      kind: "box",
      start: p,
      screen,
      board: b,
      camera: cam,
      selection:
        e.shiftKey || props.additive
          ? sel
          : { points: [], segments: [], angles: [], notes: [] },
      moved: false,
    };
    if (!e.shiftKey && !props.additive)
      props.setSelection({ points: [], segments: [], angles: [], notes: [] });
  };
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = world(e);
    if (e.pointerType === "touch" && touches.current.has(e.pointerId)) {
      touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch.current && touches.current.size === 2) {
        const [a, b] = [...touches.current.values()],
          mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
          z = Math.max(
            0.1,
            Math.min(
              6,
              (pinch.current.camera.zoom * distance(a, b)) /
                pinch.current.distance,
            ),
          );
        props.setCamera({
          zoom: z,
          x: mid.x - pinch.current.world.x * z,
          y: mid.y - pinch.current.world.y * z,
        });
        return;
      }
    }
    setPointer(p);
    if (pendingPick.current) {
      const pending = pendingPick.current;
      if (Math.hypot(e.clientX-pending.screen.x,e.clientY-pending.screen.y) <= 3) return;
      const selected = pending.hits.filter(h => h.selection.points.some(id => sel.points.includes(id)) || h.selection.segments.some(r => sel.segments.some(x => segmentKey(x) === segmentKey(r))));
      pendingPick.current = undefined;
      if (selected.length !== 1 || pending.append) return;
      const pointId = selected[0].selection.points[0];
      if (pointId && point(b,pointId)?.pinned) return;
      gesture.current = {kind:pointId ? "point" : "translate",point:pointId,ids:selectionPointIds(b,sel),start:pending.start,screen:pending.screen,board:clone(b),selection:sel,camera:cam,moved:true};
      setPreviewHit(undefined);
    }
    const g = gesture.current;
    if (g) {
      if (Math.hypot(e.clientX - g.screen.x, e.clientY - g.screen.y) > 3)
        g.moved = true;
      if (g.kind === "pan") {
        props.setCamera({
          ...g.camera,
          x: g.camera.x + e.clientX - g.screen.x,
          y: g.camera.y + e.clientY - g.screen.y,
        });
        return;
      }
      if (g.kind === "box") {
        setBox({ a: g.start, b: p });
        return;
      }
      if (g.kind === "point" || g.kind === "translate") {
        if (!g.moved) return;
        const n = clone(g.board),
          targets: Record<string, XY> = {};
        if (g.kind === "point") {
          const original = point(n, g.point!)!;
          if (original.crossing) {
            props.notice(
              "This point follows the intersection. Move its supporting segments.",
            );
            return;
          }
          if (original.on) {
            const host = edge(n, original.on.edge)!;
            const q = projection(p, point(n, host.a)!, point(n, host.b)!);
            if (original.on.midpoint) {
              props.notice(
                "This point is a midpoint. Release its attachment to slide it.",
              );
              return;
            }
            original.on.t = q.t;
            targets[original.id] = q.p;
            setSnap({
              position: q.p,
              text: "On " + segmentName(n, { edge: host.id }),
            });
          } else {
            const s = getSnap(p, e.altKey, [original.id]);
            targets[original.id] = s.position;
            setSnap(s);
          }
        } else
          for (const id of g.ids || []) {
            const v = point(n, id)!;
            targets[id] = {
              x: v.x + p.x - g.start.x,
              y: v.y + p.y - g.start.y,
            };
          }
        props.drag(n, targets, false);
        return;
      }
      if (g.kind === "note" && g.note) {
        const n = clone(g.board),
          note = n.notes.find((n) => n.id === g.note)!;
        note.position = {
          x: note.position.x + p.x - g.start.x,
          y: note.position.y + p.y - g.start.y,
        };
        props.drag(n, {}, false);
        return;
      }
      if (g.kind === "arc" && g.angle) {
        const n = clone(g.board),
          a = rememberAngle(n, g.angle),
          v = vertex(n, a.vertex);
        if (v) {
          a.radius = Math.max(25, Math.min(130, distance(p, v) * cam.zoom));
          props.drag(n, {}, false);
        }
        return;
      }
      if (g.kind === "label" && g.point) {
        const n = clone(g.board),
          v = point(n, g.point)!;
        v.labelOffset = {
          x: (v.labelOffset?.x || 0) + p.x - g.start.x,
          y: (v.labelOffset?.y || 0) + p.y - g.start.y,
        };
        props.drag(n, {}, false);
        return;
      }
    }
    let q = p;
    if (e.shiftKey && draft.length && props.tool !== "angle") {
      const v = draft[0].position,
        r = distance(v, p),
        a =
          (Math.round(Math.atan2(p.y - v.y, p.x - v.x) / (Math.PI / 12)) *
            Math.PI) /
          12;
      q = { x: v.x + r * Math.cos(a), y: v.y + r * Math.sin(a) };
    }
    if (props.tool === "select" && !picker) setPreviewHit(candidates(p)[0]);
    setSnap(getSnap(q, e.altKey));
    setHover(
      props.tool === "select" &&
        props.filter !== "points" &&
        props.filter !== "segments" &&
        !pointHit(p) &&
        !segmentHits(p).length
        ? angleAt(b, js, p, cam.zoom)
        : undefined,
    );
  };
  const up = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "touch") {
      touches.current.delete(e.pointerId);
      if (pinch.current) {
        if (!touches.current.size) pinch.current = undefined;
        return;
      }
    }
    if (pendingPick.current) {
      const pending = pendingPick.current;
      pendingPick.current = undefined;
      setPicker({x:Math.min(pending.screen.x+12,window.innerWidth-250),y:Math.min(pending.screen.y+12,window.innerHeight-250),hits:pending.hits,append:pending.append});
      return;
    }
    const g = gesture.current;
    gesture.current = undefined;
    if (!g) return;
    const p = world(e);
    if (g.kind === "draw" && g.moved && draft.length)
      finishDraw(draft[0], snap || getSnap(p, e.altKey));
    if (
      g.kind === "point" ||
      g.kind === "translate" ||
      g.kind === "label" ||
      g.kind === "arc" ||
      g.kind === "note"
    ) {
      if (g.moved) props.drag(b, {}, true);
      else if (g.kind === "label" && g.point) editPoint(g.point);
      setSnap(undefined);
    }
    if (g.kind === "box") {
      const rect = {
        x1: Math.min(g.start.x, p.x),
        x2: Math.max(g.start.x, p.x),
        y1: Math.min(g.start.y, p.y),
        y2: Math.max(g.start.y, p.y),
      };
      const inside = (v: XY) =>
        v.x >= rect.x1 && v.x <= rect.x2 && v.y >= rect.y1 && v.y <= rect.y2;
      const next = clone(g.selection);
      if (g.moved) {
        if (props.filter !== "angles" && props.filter !== "segments")
          for (const v of b.points)
            if (inside(v) && !next.points.includes(v.id))
              next.points.push(v.id);
        if (props.filter !== "angles" && props.filter !== "points")
          for (const ed of b.edges) {
            for (const part of segmentPieces(b, ed.id)) {
              const [a, c] = endpoints(b, part)!;
              if (
                (props.touches
                  ? touchesRect(a, c, rect, part.a ? "segment" : ed.kind)
                  : inside(a) && inside(c)) &&
                !next.segments.some((s) => segmentKey(s) === segmentKey(part))
              )
                next.segments.push(part);
            }
          }
        if (props.filter === "angles")
          for (const j of js)
            for (const a of sectors(j))
              if (inside(j.position)) next.angles.push(a);
        props.setSelection(next);
      }
      setBox(undefined);
    }
  };
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    const rect = svg.current!.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    if (e.ctrlKey || (Math.abs(e.deltaY) >= 40 && e.deltaX === 0)) {
      const z = Math.max(
        0.1,
        Math.min(6, cam.zoom * Math.exp(-e.deltaY * 0.003)),
      );
      props.setCamera({
        zoom: z,
        x: x - ((x - cam.x) * z) / cam.zoom,
        y: y - ((y - cam.y) * z) / cam.zoom,
      });
    } else
      props.setCamera({ ...cam, x: cam.x - e.deltaX, y: cam.y - e.deltaY });
  };
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  });
  const renderAngles = [
    ...new Map(b.angles.map((a) => [angleKey(a), a])).values(),
  ];
  if (
    props.angleHint &&
    !renderAngles.some((a) => angleKey(a) === angleKey(props.angleHint!))
  )
    renderAngles.push(props.angleHint);
  for (const a of sel.angles)
    if (!renderAngles.some((x) => angleKey(x) === angleKey(a)))
      renderAngles.push(a);
  if (hover && !renderAngles.some((x) => angleKey(x) === angleKey(hover)))
    renderAngles.push(hover);
  const groups = markingGroups(b, "segments"),
    angleGroups = markingGroups(b, "angles");
  const displayRadii = angleDisplayRadii(b, renderAngles);
  const z = cam.zoom;
  const endpointPreview = snap?.position || pointer;
  return (
    <div className={"board-surface tool-" + props.tool}>
      <svg
        ref={svg}
        className="board"
        aria-label="Geometry drawing canvas"
        role="application"
        tabIndex={0}
        onPointerDownCapture={(e) => {
          if (props.tool !== "select" || space || e.button !== 0 || props.busy) return;
          if ((e.target as Element).closest('[role="button"], [aria-label="Drag angle arc"]')) return;
          const hits = candidates(world(e));
          setPicker(undefined);
          if (hits.length > 1) {
            for (const hit of [...hits]) {
              const ref = hit.selection.segments[0];
              if (ref && (ref.a || ref.b) && !hits.some(h => h.key === segmentKey({edge:ref.edge}))) {
                hits.push({key:segmentKey({edge:ref.edge}),label:"Whole segment " + segmentName(b,{edge:ref.edge}),selection:{points:[],angles:[],notes:[],segments:[{edge:ref.edge}]}});
              }
            }
            e.stopPropagation();
            e.preventDefault();
            gesture.current = undefined;
            pendingPick.current = {start:world(e),screen:{x:e.clientX,y:e.clientY},hits,append:e.shiftKey || props.additive};
            svg.current?.setPointerCapture(e.pointerId);
            setPreviewHit(hits[0]);
          }
        }}
        onPointerLeave={() => { if (!picker) { setPreviewHit(undefined); setHover(undefined); } }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => {
          pendingPick.current = undefined;
          gesture.current = undefined;
          setDraft([]);
          setBox(undefined);
          props.cancel();
        }}

        onDoubleClick={(e) => {
          if (props.busy || !["select", "text"].includes(props.tool)) return;
          // Pointer capture can retarget the double-click from a note to the SVG.
          const nodes = [
            ...svg.current!.querySelectorAll<SVGTextElement>("[data-note-id]"),
          ].reverse();
          const hit = nodes.find((node) => {
            const r = node.getBoundingClientRect();
            return (
              e.clientX >= r.left &&
              e.clientX <= r.right &&
              e.clientY >= r.top &&
              e.clientY <= r.bottom
            );
          });
          const note = b.notes.find((n) => n.id === hit?.dataset.noteId);
          if (note) {
            e.preventDefault();
            editNote(note.position, note.text, note.id);
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <defs>
          <pattern
            id="grid"
            width={20 * z}
            height={20 * z}
            x={cam.x % (20 * z)}
            y={cam.y % (20 * z)}
            patternUnits="userSpaceOnUse"
          >
            <circle r=".85" fill="#b8bbb8" />
          </pattern>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M2 2 L8 5 L2 8"
              fill="none"
              stroke="context-stroke"
              strokeWidth="1.5"
            />
          </marker>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={props.grid ? "url(#grid)" : "#fcfcf9"}
        />
        <g transform={`translate(${cam.x} ${cam.y}) scale(${z})`}>
          {b.edges
            .filter((e) => !e.hidden)
            .map((e) => {
              const a = point(b, e.a)!,
                c = point(b, e.b)!;
              if (!a || !c) return null;
              const selected = sel.segments.some(
                  (s) => s.edge === e.id && !s.a && !s.b,
                ),
                l = distance(a, c) || 1,
                dx = (c.x - a.x) / l,
                dy = (c.y - a.y) / l,
                ext = 3000 / z;
              return (
                <g key={e.id} className={selected ? "selected-stroke" : ""}>
                  {e.kind === "circle" ? (
                    <circle
                      cx={a.x}
                      cy={a.y}
                      r={l}
                      fill="none"
                      stroke={selected ? "#6b5adc" : "#303a39"}
                      strokeWidth={(selected ? 3 : 2) / z}
                    />
                  ) : (
                    <line
                      x1={a.x - (e.kind === "line" ? ext * dx : 0)}
                      y1={a.y - (e.kind === "line" ? ext * dy : 0)}
                      x2={
                        c.x + (["line", "ray"].includes(e.kind) ? ext * dx : 0)
                      }
                      y2={
                        c.y + (["line", "ray"].includes(e.kind) ? ext * dy : 0)
                      }
                      stroke={selected ? "#6b5adc" : "#303a39"}
                      strokeWidth={(selected ? 3 : 2) / z}
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}
          {sel.segments
            .filter((s) => s.a || s.b)
            .map((s) => {
              const ps = endpoints(b, s);
              return ps ? (
                <line
                  key={segmentKey(s)}
                  x1={ps[0].x}
                  y1={ps[0].y}
                  x2={ps[1].x}
                  y2={ps[1].y}
                  stroke="#6b5adc"
                  strokeWidth={5 / z}
                />
              ) : null;
            })}
          {[...groups].map(([key, n]) => {
            const c = b.constraints.find(
              (c) =>
                c.kind === "equalLength" &&
                c.segments.some((s) => segmentKey(s) === key),
            ) as Extract<Constraint, { kind: "equalLength" }> | undefined;
            const s = c?.segments.find((s) => segmentKey(s) === key),
              ps = s && endpoints(b, s);
            if (!ps) return null;
            const [a, cpt] = ps,
              l = distance(a, cpt) || 1,
              ux = (cpt.x - a.x) / l,
              uy = (cpt.y - a.y) / l;
            return (
              <g key={key}>
                {Array.from({ length: Math.min(n, 5) }, (_, i) => {
                  const d = ((i - (Math.min(n, 5) - 1) / 2) * 5) / z,
                    x = (a.x + cpt.x) / 2 + ux * d,
                    y = (a.y + cpt.y) / 2 + uy * d;
                  return (
                    <line
                      key={i}
                      x1={x - (uy * 7) / z}
                      y1={y + (ux * 7) / z}
                      x2={x + (uy * 7) / z}
                      y2={y - (ux * 7) / z}
                      stroke="#94712b"
                      strokeWidth={2 / z}
                    />
                  );
                })}
              </g>
            );
          })}
          {renderAngles.map((a) => {
            const v = vertex(b, a.vertex),
              start = direction(b, a, a.start),
              delta = angleRadians(b, a);
            if (!v || start === undefined || !Number.isFinite(delta))
              return null;
            const selected = sel.angles.some(
                (x) => angleKey(x) === angleKey(a),
              ),
              r = displayRadii.get(angleKey(a))! / z,
              m = start + (a.sweep * delta) / 2,
              fix = b.constraints.find(
                (c) => c.kind === "angle" && angleKey(c.angle) === angleKey(a),
              ) as Extract<Constraint, { kind: "angle" }> | undefined;
            const right = fix?.value === 90;
            const arcClass = angleGroups.get(angleKey(a));
            return (
              <g
                key={a.id}
                onPointerDown={(e) => {
                  if (props.tool !== "select") return;
                  e.stopPropagation();
                  const region = angleAt(b, js, world(e), cam.zoom) || a;
                  chooseHit({ key: angleKey(region), label: angleName(b,region), selection: {points: [], segments: [], notes: [], angles: [region]} }, e.shiftKey || props.additive);
                }}
              >
                <path
                  d={anglePath(b, a, r, true)}
                  fill={
                    selected
                      ? "#e4dfff"
                      : hover && angleKey(hover) === angleKey(a)
                        ? "#efedf8"
                        : "transparent"
                  }
                  stroke="none"
                />
                {right ? (
                  <path
                    d={`M${v.x + (20 / z) * Math.cos(start)} ${v.y + (20 / z) * Math.sin(start)} l${(20 / z) * Math.cos(start + a.sweep * delta)} ${(20 / z) * Math.sin(start + a.sweep * delta)} l${(-20 / z) * Math.cos(start)} ${(-20 / z) * Math.sin(start)}`}
                    fill="none"
                    stroke="#6b5adc"
                    strokeWidth={2 / z}
                  />
                ) : (
                  <path
                    d={anglePath(b, a, r)}
                    fill="none"
                    stroke={selected ? "#6b5adc" : "#9d8d56"}
                    strokeWidth={(selected ? 2.5 : 1.5) / z}
                  />
                )}
                {selected && (
                  <circle
                    aria-label="Drag angle arc"
                    cx={v.x + r * Math.cos(m)}
                    cy={v.y + r * Math.sin(m)}
                    r={4 / z}
                    fill="#6b5adc"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      svg.current?.setPointerCapture(e.pointerId);
                      gesture.current = {
                        kind: "arc",
                        angle: a,
                        start: world(e),
                        screen: { x: e.clientX, y: e.clientY },
                        board: clone(b),
                        selection: sel,
                        camera: cam,
                        moved: false,
                      };
                    }}
                  />
                )}
                {arcClass &&
                  Array.from({ length: arcClass }, (_, i) => (
                    <path
                      key={"class" + i}
                      d={anglePath(b, a, r + ((i + 1) * 5) / z)}
                      fill="none"
                      stroke="#94712b"
                      strokeWidth={1.5 / z}
                    />
                  ))}
                <text
                  x={v.x + (r + 20 / z) * Math.cos(m)}
                  y={v.y + (r + 20 / z) * Math.sin(m)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12 / z}
                  fill={selected ? "#5946c0" : "#746341"}
                >
                  {a.expression ||
                    `${fix ? "" : "≈ "}${fix?.input || angleDegrees(b, a).toFixed(1).replace(/\.0$/, "")}°`}
                </text>
              </g>
            );
          })}
          {b.points.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={(sel.points.includes(p.id) ? 7 : 4) / z}
                fill={sel.points.includes(p.id) ? "#6b5adc" : "#fcfcf9"}
                stroke={p.pinned ? "#b17b38" : "#52645c"}
                strokeWidth={1.6 / z}
              />
              {p.pinned && (
                <rect
                  x={p.x - 9 / z}
                  y={p.y - 9 / z}
                  width={18 / z}
                  height={18 / z}
                  rx={3 / z}
                  fill="none"
                  stroke="#b17b38"
                  strokeWidth={1 / z}
                />
              )}
              <text
                data-role="label"
                data-id={p.id}
                x={p.x + (p.labelOffset?.x || 0) + 11 / z}
                y={p.y + (p.labelOffset?.y || 0) + 20 / z}
                fontSize={15 / z}
                className="point-label"
                role="button"
                tabIndex={0}
                aria-label={"Rename point " + p.label}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    editPoint(p.id);
                  }
                }}
              >
                {p.label}
              </text>
            </g>
          ))}
          {b.notes.map((n) => (
            <text
              key={n.id}
              data-note-id={n.id}
              x={n.position.x}
              y={n.position.y}
              fontSize={16 / z}
              fill={sel.notes.includes(n.id) ? "#6b5adc" : "#303a39"}
              onPointerDown={(e) => {
                if (props.busy) return;
                if (props.tool === "text") {
                  e.preventDefault();
                  e.stopPropagation();
                  editNote(n.position, n.text, n.id);
                  return;
                }
                if (props.tool !== "select") return;
                e.stopPropagation();
                svg.current?.setPointerCapture(e.pointerId);
                props.setSelection({
                  points: [],
                  segments: [],
                  angles: [],
                  notes:
                    e.shiftKey || props.additive
                      ? [...sel.notes.filter((id) => id !== n.id), n.id]
                      : [n.id],
                });
                gesture.current = {
                  kind: "note",
                  note: n.id,
                  start: world(e),
                  screen: { x: e.clientX, y: e.clientY },
                  board: clone(b),
                  selection: sel,
                  camera: cam,
                  moved: false,
                };
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (
                  !props.busy &&
                  (props.tool === "select" || props.tool === "text")
                )
                  editNote(n.position, n.text, n.id);
              }}
            >
              {n.text}
            </text>
          ))}
          {draft.length > 0 && (
            <g pointerEvents="none">
              {props.tool === "circle" ? (
                <circle
                  cx={draft[0].position.x}
                  cy={draft[0].position.y}
                  r={distance(draft[0].position, endpointPreview)}
                  fill="none"
                  stroke="#6b5adc"
                  strokeDasharray={`${5 / z} ${4 / z}`}
                  strokeWidth={2 / z}
                />
              ) : (
                <>
                  <line
                    x1={draft[0].position.x}
                    y1={draft[0].position.y}
                    x2={endpointPreview.x}
                    y2={endpointPreview.y}
                    stroke="#6b5adc"
                    strokeDasharray={`${5 / z} ${4 / z}`}
                    strokeWidth={2 / z}
                  />
                  {draft[1] && (
                    <line
                      x1={draft[0].position.x}
                      y1={draft[0].position.y}
                      x2={draft[1].position.x}
                      y2={draft[1].position.y}
                      stroke="#6b5adc"
                      strokeWidth={2 / z}
                    />
                  )}
                </>
              )}
            </g>
          )}
          {snap && snap.text && (
            <g pointerEvents="none">
              <circle
                cx={snap.position.x}
                cy={snap.position.y}
                r={9 / z}
                fill="none"
                stroke="#6b5adc"
                strokeWidth={1.5 / z}
              />
              <text
                x={snap.position.x + 15 / z}
                y={snap.position.y - 14 / z}
                fontSize={12 / z}
                fill="#6b5adc"
              >
                {snap.text}
              </text>
            </g>
          )}
          {box && (
            <rect
              x={Math.min(box.a.x, box.b.x)}
              y={Math.min(box.a.y, box.b.y)}
              width={Math.abs(box.a.x - box.b.x)}
              height={Math.abs(box.a.y - box.b.y)}
              fill="#6b5adc12"
              stroke="#6b5adc"
              strokeWidth={1 / z}
            />
          )}
        </g>
        {previewHit && <g pointerEvents="none" transform={`translate(${cam.x} ${cam.y}) scale(${z})`}>
          {previewHit.selection.points.map(id => { const p = point(b,id)!; return <circle key={id} cx={p.x} cy={p.y} r={11/z} fill="none" stroke="#8b79ec" strokeWidth={3/z}/>; })}
          {previewHit.selection.segments.map(ref => { const es = endpoints(b,ref); return es && <line key={segmentKey(ref)} x1={es[0].x} y1={es[0].y} x2={es[1].x} y2={es[1].y} stroke="#8b79ec" strokeOpacity=".65" strokeWidth={6/z}/>; })}
          {previewHit.selection.angles.map(a => <path key={angleKey(a)} d={anglePath(b,a,(displayRadii.get(angleKey(a)) || a.radius || 44)/z,true)} fill="#b8aaff" fillOpacity=".35" stroke="none"/>)}
        </g>}
      </svg>
      {previewHit && !picker && props.tool === "select" && <div className="hit-preview">{previewHit.label}</div>}
      {picker && <div className="overlap-picker" role="dialog" aria-label="Choose geometry" style={{left:picker.x,top:picker.y}} onKeyDown={e => { if (e.key === "Escape") { e.stopPropagation(); setPicker(undefined); setPreviewHit(undefined); svg.current?.focus(); } }}>
        <header>Choose geometry<button aria-label="Close geometry picker" onClick={() => {setPicker(undefined);setPreviewHit(undefined);}}>×</button></header>
        {picker.hits.map((hit,i) => <button autoFocus={i===0} key={hit.key} onMouseEnter={() => setPreviewHit(hit)} onFocus={() => setPreviewHit(hit)} onClick={() => chooseHit(hit,picker.append)}>{hit.label}</button>)}
        <small>{picker.append ? "Add or remove from selection" : "Choose one object"}</small>
      </div>}
      {noteEditor && (
        <form
          className="note-editor"
          aria-label={
            noteEditor.pointId
              ? "Rename point"
              : noteEditor.id
                ? "Edit note"
                : "Add note"
          }
          style={{
            left: Math.max(
              12,
              Math.min(
                window.innerWidth - 320,
                noteEditor.position.x * cam.zoom + cam.x,
              ),
            ),
            top: Math.max(
              145,
              Math.min(
                window.innerHeight - 120,
                noteEditor.position.y * cam.zoom + cam.y - 30,
              ),
            ),
          }}
          onSubmit={(e) => {
            e.preventDefault();
            saveNote();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              e.preventDefault();
              setNoteEditor(undefined);
              svg.current?.focus();
            }
          }}
        >
          <input
            ref={noteInput}
            aria-label={noteEditor.pointId ? "Point name" : "Note text"}
            placeholder={noteEditor.pointId ? "Point name" : "Type your note"}
            value={noteEditor.text}
            maxLength={noteEditor.pointId ? 30 : 10000}
            onChange={(e) =>
              setNoteEditor({ ...noteEditor, text: e.target.value })
            }
          />
          {duplicateName && (
            <p role="alert">That point name is already in use.</p>
          )}
          <div>
            <button
              type="submit"
              className="primary"
              disabled={!noteEditor.text.trim() || duplicateName}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setNoteEditor(undefined);
                svg.current?.focus();
              }}
            >
              Cancel
            </button>
            <small>Enter to save · Esc to cancel</small>
          </div>
        </form>
      )}
      {props.tool === "angle" && draft.length > 0 && (
        <div className="drawing-hud">
          <span>
            {draft.length === 1
              ? "Choose the first arm"
              : "Choose the second arm"}
          </span>
          {draft.length === 2 && (
            <label>
              Angle{" "}
              <input
                aria-label="Angle while drawing"
                value={angleInput}
                onChange={(e) => setAngleInput(e.target.value)}
                placeholder="Free"
              />
              °
            </label>
          )}
          <small>Esc to cancel</small>
        </div>
      )}
    </div>
  );
}
import type { Constraint } from "./model";
