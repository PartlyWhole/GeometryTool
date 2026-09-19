// A figure you build statements from by clicking it.
//
// Reading a diagram is the skill being taught, so naming an angle by touching
// its arm, its vertex and its other arm beats hunting for "m∠PVR" in a list.
// The palette stays, for figures with no drawn arc and for problems with no
// figure at all.
import React, { useMemo, useState } from "react";
import type { Board } from "../model";
import { Figure, type Highlight } from "./Figure";
import { figureObjects } from "./inventory";
import { type AngId, type ObjId, type SegId, objKey, splitLabels } from "./terms";
import { objText } from "./notation";

type Props = {
  board: Board;
  highlights?: Highlight[];
  height?: number;
  ariaLabel?: string;
  /** What the focused slot is waiting for, so the hint can say so. */
  wants?: "expression" | "angle" | "segment" | "point" | "other";
  onInsert: (obj: ObjId) => void;
};

export function PickableFigure(props: Props) {
  const [pending, setPending] = useState<string[]>([]);
  const inv = useMemo(() => figureObjects(props.board), [props.board]);

  const toggle = (label: string) =>
    setPending((p) =>
      p.includes(label)
        ? p.filter((x) => x !== label)
        : p.length >= 3
          ? p
          : [...p, label],
    );

  // Two points name a segment; three name an angle, vertex in the middle.
  const asSegment: SegId | undefined =
    pending.length === 2
      ? inv.segments.find(
          (s) => objKey(s) === objKey({ k: "seg", a: pending[0], b: pending[1] }),
        )
      : undefined;
  const asAngle: AngId | undefined =
    pending.length === 3
      ? inv.angles.find(
          (a) =>
            splitLabels(a.name).length === 3 &&
            objKey(a) === objKey({ k: "ang", name: pending.join("") }),
        )
      : undefined;
  const asPoint: ObjId | undefined =
    props.wants === "point" && pending.length === 1
      ? { k: "pt", p: pending[0] }
      : undefined;

  const offer = asPoint ?? asAngle ?? asSegment;

  const insert = (o: ObjId) => {
    props.onInsert(o);
    setPending([]);
  };

  return (
    <div className="pickable">
      <Figure
        board={props.board}
        highlights={props.highlights}
        height={props.height}
        ariaLabel={props.ariaLabel}
        chosen={pending}
        onPickPoint={toggle}
        onPickAngle={(a) => insert(a)}
      />
      <div className="pick-bar">
        {pending.length > 0 ? (
          <>
            <span className="pick-chips">
              {pending.map((p, i) => (
                <span key={i} className="chip static">{p}</span>
              ))}
            </span>
            {offer ? (
              <button className="chip active" onClick={() => insert(offer)}>
                Insert {offer.k === "ang" ? "m∠" + offer.name : objText(offer)}
              </button>
            ) : (
              <span className="muted small">
                {pending.length === 1
                  ? "One more point for a segment, two for an angle."
                  : pending.length === 2
                    ? "Those two do not name a segment here — add a third for an angle."
                    : "Those three do not name an angle here. The vertex goes in the middle."}
              </span>
            )}
            <button className="chip warn" onClick={() => setPending([])}>
              clear
            </button>
          </>
        ) : (
          <span className="muted small">
            {hint(props.wants)}
          </span>
        )}
      </div>
    </div>
  );
}

function hint(wants: Props["wants"]) {
  switch (wants) {
    case "angle":
      return "Click an arc, or click an arm point, the vertex, then the other arm point.";
    case "segment":
      return "Click the two endpoints of the segment.";
    case "point":
      return "Click a point on the figure.";
    default:
      return "Click the figure to name a part: two points for a segment, three for an angle, or an arc for the angle it marks.";
  }
}
