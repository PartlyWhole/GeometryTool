import { useState, useEffect } from "react";
import {
  type Board,
  type Selection,
  type Constraint,
  clone,
  point,
  edge,
  segmentName,
  angleName,
  angleKey,
  segmentKey,
  emptySelection,
} from "./model";
import { constraintPoints } from "./solver";
import { relatedPointIds, editConstraintValue } from "./constraintEditing";
import { scalar, rememberAngle } from "./actions";
type Props = {
  disabled?: boolean;
  board: Board;
  selection: Selection;
  commit: (b: Board) => void;
  select: (s: Selection) => void;
  command: (title: string, fn: (b: Board) => void) => void;
};
function ValueEditor({
  label,
  value,
  unit,
  save,
}: {
  label: string;
  value: string;
  unit: string;
  save: (s: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <form
      className="constraint-value"
      onSubmit={(e) => {
        e.preventDefault();
        save(draft);
      }}
    >
      <label>
        {label}
        <span>
          <input
            aria-label={label}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          {unit}
        </span>
      </label>
      <button type="submit">Update</button>
    </form>
  );
}
const title = (c: Constraint) =>
  ({
    length: "Fixed length",
    angle: "Fixed angle",
    sumAngle: "Angle sum",
    equalLength: "Congruent segments",
    equalAngle: "Congruent angles",
    parallel: "Parallel",
    perpendicular: "Perpendicular",
    bisect: "Angle bisector",
  })[c.kind];
export function ConstraintsPanel({
  board: b,
  disabled,
  selection: s,
  commit,
  select,
  command,
}: Props) {
  const [all, setAll] = useState(false),
    hasSelection = !!(s.points.length + s.segments.length + s.angles.length),
    ids = relatedPointIds(b, s);
  const constraints = b.constraints.filter(
    (c) =>
      all || !hasSelection || constraintPoints(b, c).some((id) => ids.has(id)),
  );
  const points = b.points.filter(
    (p) =>
      (p.pinned || p.on || p.crossing) &&
      (all || !hasSelection || ids.has(p.id)),
  );
  const release = (id: string) => {
    const n = clone(b);
    n.constraints = n.constraints.filter((c) => c.id !== id);
    commit(n);
  };
  const names = (c: Constraint) =>
    "segments" in c
      ? c.segments.map((r) => segmentName(b, r))
      : "segment" in c
        ? [segmentName(b, c.segment)]
        : "angles" in c
          ? c.angles.map((a) => "∠" + angleName(b, a))
          : "angle" in c
            ? [
                "∠" + angleName(b, c.angle),
                ...(c.kind === "bisect"
                  ? [point(b, c.point)?.label || "?"]
                  : []),
              ]
            : c.edges.map((edge) => segmentName(b, { edge }));
  return (
    <section className="constraints-panel" aria-label="Constraints">
      <fieldset disabled={disabled}>
        <h3>
          Active constraints{" "}
          <span>
            {constraints.length +
              points.reduce(
                (n, p) =>
                  n + Number(!!p.pinned) + Number(!!(p.on || p.crossing)),
                0,
              )}
          </span>
        </h3>
        <label className="constraint-scope">
          <input
            type="checkbox"
            checked={all}
            onChange={(e) => setAll(e.target.checked)}
          />
          Show all on board
        </label>
        <p className="muted">
          {hasSelection && !all
            ? "Includes relationships connected through shared points."
            : "All relationships in this drawing."}{" "}
          Value changes preview before applying.
        </p>
        {!constraints.length && !points.length && (
          <p>No constraints on this selection.</p>
        )}
        {constraints.map((c) => (
          <article className="constraint-card" key={c.id}>
            <header>
              <strong>{title(c)}</strong>
              <button
                aria-label={"Remove " + title(c) + " " + names(c).join(", ")}
                onClick={() => release(c.id)}
              >
                Remove
              </button>
            </header>
            <p>{names(c).join(" · ")}</p>
            {["length", "angle", "sumAngle"].includes(c.kind) && (
              <ValueEditor
                label={title(c) + " value"}
                value={
                  c.kind === "length"
                    ? String(c.value / 50)
                    : c.kind === "angle"
                      ? c.input
                      : c.kind === "sumAngle"
                        ? String(c.value)
                        : ""
                }
                unit={c.kind === "length" ? "units" : "°"}
                save={(text) =>
                  command("Update " + title(c), (n) =>
                    editConstraintValue(n, c.id, text),
                  )
                }
              />
            )}
            {(c.kind === "parallel" || c.kind === "perpendicular") && (
              <label>
                Relationship
                <select
                  aria-label={"Relationship for " + names(c).join(", ")}
                  value={c.kind}
                  onChange={(e) => {
                    const kind = e.target.value as "parallel" | "perpendicular";
                    command("Make supports " + kind, (n) => {
                      const row = n.constraints.find((x) => x.id === c.id)!;
                      if (
                        row.kind === "parallel" ||
                        row.kind === "perpendicular"
                      )
                        row.kind = kind;
                    });
                  }}
                >
                  <option value="parallel">Parallel</option>
                  <option value="perpendicular">Perpendicular</option>
                </select>
              </label>
            )}
            {(c.kind === "equalLength" ||
              c.kind === "equalAngle" ||
              c.kind === "sumAngle") && (
              <>
                <div className="constraint-members">
                  {names(c).map((name, i) => (
                    <button
                      key={i}
                      title="Remove this member from the relationship"
                      aria-label={"Remove member " + name}
                      onClick={() => {
                        const n = clone(b),
                          row = n.constraints.find((x) => x.id === c.id)!;
                        if ("segments" in row) row.segments.splice(i, 1);
                        else if ("angles" in row) row.angles.splice(i, 1);
                        if (
                          ("segments" in row
                            ? row.segments.length
                            : "angles" in row
                              ? row.angles.length
                              : 0) < 2
                        )
                          n.constraints = n.constraints.filter(
                            (x) => x.id !== c.id,
                          );
                        commit(n);
                      }}
                    >
                      {name} ×
                    </button>
                  ))}
                </div>
                <button
                  disabled={
                    c.kind === "equalLength"
                      ? !s.segments.length
                      : !s.angles.length
                  }
                  onClick={() =>
                    command("Add selection to " + title(c), (n) => {
                      const row = n.constraints.find((x) => x.id === c.id)!;
                      if (row.kind === "equalLength") {
                        for (const r of s.segments)
                          if (
                            !row.segments.some(
                              (x) => segmentKey(x) === segmentKey(r),
                            )
                          )
                            row.segments.push(clone(r));
                      } else if (
                        row.kind === "equalAngle" ||
                        row.kind === "sumAngle"
                      ) {
                        for (const a of s.angles)
                          if (
                            !row.angles.some(
                              (x) => angleKey(x, n) === angleKey(a, n),
                            )
                          )
                            row.angles.push(rememberAngle(n, a));
                      }
                    })
                  }
                >
                  Add selected{" "}
                  {c.kind === "equalLength" ? "segments" : "angles"}
                </button>
              </>
            )}
            <button
              onClick={() => {
                const next = emptySelection();
                if ("segments" in c) next.segments = clone(c.segments);
                if ("segment" in c) next.segments = [clone(c.segment)];
                if ("angles" in c) next.angles = clone(c.angles);
                if ("angle" in c) next.angles = [clone(c.angle)];
                if ("edges" in c)
                  next.segments = c.edges.map((edge) => ({ edge }));
                select(next);
              }}
            >
              Select involved geometry
            </button>
          </article>
        ))}
        {points.map((p) => (
          <article className="constraint-card" key={p.id}>
            <strong>Point {p.label}</strong>
            {p.pinned && (
              <div className="constraint-pin">
                Pinned position
                <button
                  onClick={() => {
                    const n = clone(b);
                    point(n, p.id)!.pinned = false;
                    commit(n);
                  }}
                >
                  Unpin {p.label}
                </button>
              </div>
            )}
            {(p.on || p.crossing) && (
              <>
                <p>
                  {p.crossing
                    ? "Intersection of " +
                      p.crossing
                        .map((edge) => segmentName(b, { edge }))
                        .join(" and ")
                    : (p.on?.midpoint ? "Midpoint of " : "Point on ") +
                      segmentName(b, { edge: p.on!.edge })}
                </p>
                {p.on && (
                  <ValueEditor
                    label={"Position of " + p.label}
                    value={String(p.on.t * 100)}
                    unit="%"
                    save={(text) =>
                      command("Move attached point " + p.label, (n) => {
                        const value = scalar(text) / 100,
                          host = edge(n, p.on!.edge)!;
                        if (
                          (host.kind !== "line" && value < 0) ||
                          (host.kind === "segment" && value > 1)
                        )
                          throw Error("Keep the point within its support.");
                        const q = point(n, p.id)!;
                        q.on = { edge: p.on!.edge, t: value };
                      })
                    }
                  />
                )}
                <button
                  onClick={() => {
                    const n = clone(b),
                      q = point(n, p.id)!;
                    delete q.on;
                    delete q.crossing;
                    commit(n);
                  }}
                >
                  Detach {p.label}
                </button>
              </>
            )}
          </article>
        ))}
      </fieldset>
    </section>
  );
}
