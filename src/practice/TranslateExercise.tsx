// Exercise 3: diagram → equation, and description → diagram.
import React, { useMemo, useState } from "react";
import { clone } from "../model";
import { Figure } from "./Figure";
import {
  StatementBuilder,
  type Draft,
  buildStatement,
  insertObject,
  newDraft,
  wants,
} from "./StatementBuilder";
import { PickableFigure } from "./PickableFigure";
import { ClaimMode } from "./SelectAllExercise";
import { CONSTRUCT_ITEMS, READ_ITEMS, type ConstructItem, type ReadItem } from "./content/translate";
import { statementText } from "./notation";
import { HAND, angleNamer, holds, measureOf, lengthOf } from "./oracle";
import { type ObjId, matchesAccepted, objKey, statementObjects } from "./terms";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Scoreboard, Tabs, Verdict } from "./ui";

type Dir = "read" | "construct" | "claims";

export function TranslateExercise() {
  const [dir, setDir] = useState<Dir>("read");
  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>Diagrams and equations</h2>
          <p className="prompt">
            {dir === "read"
              ? "Read what the figure asserts, and write it as a statement."
              : dir === "construct"
                ? "Adjust the figure until it matches the description."
                : "Only the marks count. Decide which statements the figure really supports."}
          </p>
        </div>
        <Tabs
          label="Direction"
          value={dir}
          onChange={setDir}
          options={[
            { id: "read", label: "Figure → equation" },
            { id: "construct", label: "Description → figure" },
            { id: "claims", label: "What is true?" },
          ]}
        />
      </header>
      {dir === "read" && <ReadMode />}
      {dir === "construct" && <ConstructMode />}
      {dir === "claims" && <ClaimMode />}
    </div>
  );
}

function ReadMode() {
  const [i, setI] = useState(0);
  const item: ReadItem = READ_ITEMS[i % READ_ITEMS.length];
  const [draft, setDraft] = useState<Draft>(() => newDraft("eq"));
  const [result, setResult] = useState<null | boolean>(null);
  const [tally, setTally] = useState<Tally>(() => loadTally("translate-read"));

  const built = buildStatement(draft);
  const preview = built.ok ? statementText(built.statement) : undefined;

  const next = () => {
    setI(i + 1);
    setDraft(newDraft("eq"));
    setResult(null);
  };

  const check = () => {
    if (!built.ok) return;
    // Judge modulo naming: ∠1 clicked on the arc and ∠AXC built from its
    // three points are the same angle.
    const ok = matchesAccepted(
      built.statement,
      item.accept,
      angleNamer(item.figure),
    );
    setResult(ok);
    const t = record(tally, ok);
    setTally(t);
    saveTally("translate-read", t);
  };

  return (
    <>
      <p className="prompt strong">{item.prompt}</p>
      <div className="exercise-body">
        <div>
          <PickableFigure
            board={item.figure}
            height={320}
            ariaLabel={item.prompt}
            wants={wants(draft)}
            onInsert={(obj) => setDraft(insertObject(draft, obj))}
          />
          <div className="tagrow">
            {item.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            <Scoreboard tally={tally} />
          </div>
        </div>
        <div className="exercise-side">
          <div className="answer-line">
            <span className="answer-label">Your statement</span>
            <code className={preview ? "answer" : "answer empty"}>
              {preview ?? "Build a statement below."}
            </code>
          </div>
          <StatementBuilder
            board={item.figure}
            value={draft}
            onChange={setDraft}
            allowForms={item.allowForms}
          />
          {!built.ok && draft.slots.some((s) => s.kind !== "expr" || s.toks.length) && (
            <p className="muted small">{built.why}</p>
          )}
          <div className="row">
            <button className="primary" disabled={!built.ok || result === true} onClick={check}>
              Check
            </button>
            <button onClick={() => setDraft(newDraft(draft.form))}>Reset</button>
            <button onClick={next}>Skip</button>
          </div>
          {result !== null && (
            <>
              <Verdict ok={result}>
                {result
                  ? item.why
                  : item.why + " Accepted forms include " +
                    item.accept.map(statementText).join(", ") + "."}
              </Verdict>
              {result && (
                <div className="row">
                  <button className="primary" onClick={next}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ConstructMode() {
  const [i, setI] = useState(0);
  const item: ConstructItem = CONSTRUCT_ITEMS[i % CONSTRUCT_ITEMS.length];
  const [board, setBoard] = useState(() => clone(item.start));
  const [result, setResult] = useState<null | boolean>(null);
  const [tally, setTally] = useState<Tally>(() => loadTally("translate-build"));

  // Reset the working board whenever the item changes.
  const itemId = item.id;
  const lastId = React.useRef(itemId);
  if (lastId.current !== itemId) {
    lastId.current = itemId;
    setBoard(clone(item.start));
    setResult(null);
  }

  // Only the points the task names may move, so the prompt and the figure agree.
  const movable = item.movable;

  // A live readout: dragging to a target measure is guesswork without it.
  const readout = useMemo(() => {
    const seen = new Set<string>();
    const out: { label: string; value: string }[] = [];
    const objs: ObjId[] = [];
    for (const s of [...item.require, ...(item.forbid ?? [])]) {
      objs.push(...(statementObjects(s) as ObjId[]));
      // A midpoint is about its two halves, so show those rather than the whole.
      if (s.k === "midpoint")
        objs.push(
          { k: "seg", a: s.seg.a, b: s.p },
          { k: "seg", a: s.p, b: s.seg.b },
        );
    }
    {
      for (const o of objs) {
        const k = objKey(o);
        if (seen.has(k)) continue;
        seen.add(k);
        if (o.k === "ang") {
          const v = measureOf(board, o);
          if (v !== undefined)
            out.push({ label: "m∠" + o.name, value: v.toFixed(1) + "°" });
        } else if (o.k === "seg") {
          const v = lengthOf(board, o);
          if (v !== undefined)
            out.push({ label: o.a + o.b, value: v.toFixed(2) });
        }
      }
    }
    return out;
  }, [board, item]);

  const move = (label: string, x: number, y: number) =>
    setBoard((b) => {
      const n = clone(b);
      const p = n.points.find((q) => q.label === label);
      if (!p) return b;
      // A point declared to lie on a support stays on it.
      if (p.on) {
        const e = n.edges.find((x2) => x2.id === p.on!.edge);
        const a = e && n.points.find((q) => q.id === e.a);
        const c = e && n.points.find((q) => q.id === e.b);
        if (a && c) {
          const dx = c.x - a.x,
            dy = c.y - a.y;
          const t = ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy);
          p.on.t = t;
          p.x = a.x + dx * t;
          p.y = a.y + dy * t;
          setResult(null);
          return n;
        }
      }
      p.x = x;
      p.y = y;
      setResult(null);
      return n;
    });

  // Hand tolerance: a student dragging a point cannot land on 90.000°.
  const met = (s: (typeof item.require)[number]) => holds(board, s, HAND);
  const failures = item.require.filter((s) => !met(s));
  const violated = (item.forbid ?? []).filter((s) => met(s));

  const check = () => {
    const ok = !failures.length && !violated.length;
    setResult(ok);
    const t = record(tally, ok);
    setTally(t);
    saveTally("translate-build", t);
  };

  return (
    <>
      <p className="prompt strong">{item.prompt}</p>
      <div className="exercise-body">
        <div>
          <Figure
            board={board}
            height={340}
            onMovePoint={move}
            movable={movable}
            ariaLabel={item.prompt}
          />
          <div className="tagrow">
            {item.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            <Scoreboard tally={tally} />
          </div>
        </div>
        <div className="exercise-side">
          <p className="muted">
            Drag {item.movable.join(" and ")}. The checklist updates live.
          </p>
          {readout.length > 0 && (
            <div className="readout">
              {readout.map((r) => (
                <span key={r.label}>
                  <b>{r.label}</b> {r.value}
                </span>
              ))}
            </div>
          )}
          <ul className="checklist">
            {item.require.map((s, n) => (
              <li key={n} className={met(s) ? "met" : ""}>
                <span className="tick">{met(s) ? "✓" : "○"}</span>
                {statementText(s)}
              </li>
            ))}
            {(item.forbid ?? []).map((s, n) => (
              <li key={"f" + n} className={met(s) ? "" : "met"}>
                <span className="tick">{met(s) ? "○" : "✓"}</span>
                not: {statementText(s)}
              </li>
            ))}
          </ul>
          <div className="row">
            <button className="primary" onClick={check}>Check</button>
            <button
              onClick={() => {
                setBoard(clone(item.start));
                setResult(null);
              }}
            >
              Reset figure
            </button>
            <button
              onClick={() => {
                setI(i + 1);
              }}
            >
              Next task
            </button>
          </div>
          {result !== null && (
            <Verdict ok={result}>
              {result
                ? item.why
                : violated.length
                  ? "That still satisfies “" + statementText(violated[0]) + "”, which the task rules out."
                  : "Not there yet: " + statementText(failures[0]) + "."}
            </Verdict>
          )}
        </div>
      </div>
    </>
  );
}
