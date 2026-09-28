// Exercise 3: diagram → equation, and description → diagram.
import React, { useMemo, useState } from "react";
import { type Board, clone } from "../model";
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
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { ItemNav, Scoreboard, Tabs, Verdict } from "./ui";
import { CLAIM_ITEMS3, READ_ITEMS3 } from "./content/items3";

type Dir = "read" | "construct" | "claims";

export function TranslateExercise(props: { module?: 2 | 3 }) {
  const m3 = props.module === 3;
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
            // Module 3 has no dragging task: its figures are fixed pairs of
            // lines, and what matters is reading them, not arranging them.
            ...(m3 ? [] : [{ id: "construct" as const, label: "Description → figure" }]),
            { id: "claims", label: "What is true?" },
          ]}
        />
      </header>
      {dir === "read" &&
        (m3 ? <ReadMode items={READ_ITEMS3} module={3} tallyKey="translate-read-m3" /> : <ReadMode />)}
      {dir === "construct" && !m3 && <ConstructMode />}
      {dir === "claims" &&
        (m3 ? <ClaimMode items={CLAIM_ITEMS3} tallyKey="claims-m3" /> : <ClaimMode />)}
    </div>
  );
}

/** A half-written statement and the verdict on it, for one figure. */
type ReadWork = { draft: Draft; result: boolean | null };

function ReadMode(props: { items?: ReadItem[]; module?: 2 | 3; tallyKey?: string }) {
  const items = props.items ?? READ_ITEMS;
  const tallyKey = props.tallyKey ?? "translate-read";
  // A draft starts in the first form the item allows, so an item that wants
  // a pair name does not open on an equation it will never accept.
  const deck = useDeck<ReadWork>(items.length, (n) => ({
    draft: newDraft(items[n].allowForms?.[0] ?? "eq"),
    result: null,
  }));
  const item: ReadItem = items[deck.i];
  const { draft, result } = deck.state;
  const setDraft = (d: Draft) => deck.setState((w) => ({ ...w, draft: d }));
  const setResult = (r: boolean | null) =>
    deck.setState((w) => ({ ...w, result: r }));
  const [tally, setTally] = useState<Tally>(() => loadTally(tallyKey));

  const built = buildStatement(draft);
  const preview = built.ok ? statementText(built.statement) : undefined;

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
    saveTally(tallyKey, t);
  };

  return (
    <>
      <ItemNav
        i={deck.i}
        count={deck.count}
        onGo={deck.go}
        onBack={deck.back}
        onForward={deck.forward}
        noun="Figure"
        marks={dots(deck, (w) => w.result)}
      />
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
            module={props.module}
          />
          {!built.ok && draft.slots.some((s) => s.kind !== "expr" || s.toks.length) && (
            <p className="muted small">{built.why}</p>
          )}
          <div className="row">
            <button className="primary" disabled={!built.ok || result === true} onClick={check}>
              Check
            </button>
            <button onClick={() => setDraft(newDraft(draft.form))}>Reset</button>
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
                  <button className="primary" onClick={deck.forward}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

/** The figure as the student has dragged it, and the verdict on it. */
type BuildWork = { board: Board; result: boolean | null };

function ConstructMode() {
  // The dragged figure is kept per task, so coming back to one shows the
  // arrangement you left rather than the untouched start.
  const deck = useDeck<BuildWork>(CONSTRUCT_ITEMS.length, (n) => ({
    board: clone(CONSTRUCT_ITEMS[n].start),
    result: null,
  }));
  const item: ConstructItem = CONSTRUCT_ITEMS[deck.i];
  const { board, result } = deck.state;
  const setResult = (r: boolean | null) =>
    deck.setState((w) => ({ ...w, result: r }));
  const [tally, setTally] = useState<Tally>(() => loadTally("translate-build"));

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
    deck.setState((w) => {
      const b = w.board;
      const n = clone(b);
      const p = n.points.find((q) => q.label === label);
      if (!p) return w;
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
          return { board: n, result: null };
        }
      }
      p.x = x;
      p.y = y;
      return { board: n, result: null };
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
      <ItemNav
        i={deck.i}
        count={deck.count}
        onGo={deck.go}
        onBack={deck.back}
        onForward={deck.forward}
        noun="Task"
        marks={dots(deck, (w) => w.result)}
      />
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
                {n === 0 && item.goalText ? item.goalText : statementText(s)}
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
              onClick={() =>
                deck.setState({ board: clone(item.start), result: null })
              }
            >
              Reset figure
            </button>
          </div>
          {result !== null && (
            <>
              <Verdict ok={result}>
                {result
                  ? item.why
                  : violated.length
                    ? "That still satisfies “" + statementText(violated[0]) + "”, which the task rules out."
                    : "Not there yet: " + statementText(failures[0]) + "."}
              </Verdict>
              {result && (
                <div className="row">
                  <button className="primary" onClick={deck.forward}>Next task</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
