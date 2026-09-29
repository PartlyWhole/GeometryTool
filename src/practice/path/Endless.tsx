// Endless practice: choose the ideas, then questions keep coming until you
// stop. The weakest and most overdue of the chosen ideas come up most, a miss
// comes back a few questions later, and every answer counts toward review.
import React, { useMemo, useRef, useState } from "react";
import { CONCEPTS3 } from "../content/concepts3";
import type { Unit } from "./path";
import { type Progress, isDue } from "./progress";
import { type Slot, freshQuestion, learnedConcepts, nextPractice, practiceMakers, rng } from "./session";
import { RunReview, StackNav, StackView, useStack } from "./LessonPlayer";

const term = (id: string) => CONCEPTS3.find((c) => c.id === id)?.term ?? id;

/** The strength of an idea, 0–5, as five small bars. */
function Strength(props: { s: number }) {
  return (
    <span className="strength" aria-label={"strength " + props.s + " of 5"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= props.s ? "on" : ""} />
      ))}
    </span>
  );
}

/** Choose the ideas to practise: any learned ones, by unit, or the ones due. */
export function EndlessSetup(props: {
  units: Unit[];
  progress: Progress;
  initial: string[];
  onStart: (chosen: string[]) => void;
  onBack: () => void;
}) {
  const { units, progress: p } = props;
  const learned = useMemo(() => learnedConcepts(units, p), [units, p]);
  const due = [...learned].filter((c) => isDue(p, c));
  const [chosen, setChosen] = useState<Set<string>>(() => {
    const kept = props.initial.filter((c) => learned.has(c));
    return new Set(kept.length ? kept : due.length ? due : [...learned]);
  });
  const makers = useMemo(() => practiceMakers(units, chosen, learned), [units, chosen, learned]);
  const toggle = (id: string) =>
    setChosen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="page path endless-setup">
      <header className="path-head">
        <div>
          <h1>Endless practice</h1>
          <p className="muted">
            Choose what to practise. Questions keep coming until you stop; the weakest and most overdue ideas come up most.
          </p>
        </div>
        <button onClick={props.onBack}>Back to the path</button>
      </header>

      <div className="endless-presets">
        <button onClick={() => setChosen(new Set(due))} disabled={!due.length}>
          Due for review ({due.length})
        </button>
        <button onClick={() => setChosen(new Set(learned))} disabled={!learned.size}>
          Everything learned ({learned.size})
        </button>
        <button onClick={() => setChosen(new Set())} disabled={!chosen.size}>
          Clear
        </button>
      </div>

      {units.map((u) => {
        const ideas = u.lessons.flatMap((l) => l.learn);
        if (!ideas.length) return null;
        const open = ideas.filter((c) => learned.has(c));
        const all = open.length > 0 && open.every((c) => chosen.has(c));
        return (
          <section key={u.id} className="endless-unit">
            <div className="endless-unit-head">
              <h2>
                <span className="path-unit-n">Unit {u.n}</span> {u.title}
              </h2>
              {open.length > 0 && (
                <button
                  className="link"
                  onClick={() =>
                    setChosen((s) => {
                      const next = new Set(s);
                      for (const c of open) all ? next.delete(c) : next.add(c);
                      return next;
                    })
                  }
                >
                  {all ? "None" : "All"}
                </button>
              )}
            </div>
            <div className="endless-chips">
              {ideas.map((c) =>
                learned.has(c) ? (
                  <button key={c} className={"endless-chip" + (chosen.has(c) ? " on" : "")} aria-pressed={chosen.has(c)} onClick={() => toggle(c)}>
                    <span>{term(c)}</span>
                    <Strength s={p.skill[c]?.s ?? 0} />
                    {isDue(p, c) && <em className="endless-due">due</em>}
                  </button>
                ) : (
                  <span key={c} className="endless-chip locked" title="Not learned yet — its lesson is further along the path">
                    🔒 {term(c)}
                  </span>
                ),
              )}
            </div>
          </section>
        );
      })}

      <div className="endless-start">
        <span className="muted">
          {!learned.size
            ? "Finish a lesson first: practice draws only on what you have learned."
            : chosen.size
              ? chosen.size + " idea" + (chosen.size > 1 ? "s" : "") + " chosen · " + makers.length + " kinds of exercise"
              : "Choose at least one idea."}
        </span>
        <button className="primary" disabled={!makers.length} onClick={() => props.onStart([...chosen])}>
          Start
        </button>
      </div>
    </div>
  );
}

/** Questions on the chosen ideas, one after another, until the student stops. */
export function EndlessPlayer(props: {
  units: Unit[];
  progress: Progress;
  chosen: string[];
  onAnswer: (concepts: string[], correct: boolean) => void;
  onExit: () => void;
}) {
  const r = useRef(rng(Math.floor(Math.random() * 1e9))).current;
  const asked = useRef(new Set<string>()).current;
  const chosen = useMemo(() => new Set(props.chosen), [props.chosen]);
  const learned = useMemo(() => learnedConcepts(props.units, props.progress), [props.units]);
  const makers = useMemo(() => practiceMakers(props.units, chosen, learned), [props.units, chosen, learned]);
  // Progress changes as answers come in; the next pick reads the latest.
  const progress = useRef(props.progress);
  progress.current = props.progress;

  const first = () => {
    const m = nextPractice(makers, chosen, progress.current, [], r);
    return [{ maker: m, phase: "practice" as const, q: freshQuestion(m, r, asked) }];
  };
  const [slots, setSlots] = useState<Slot[]>(first);
  const results = useRef<(boolean | undefined)[]>([]);
  const stack = useStack();
  const [summary, setSummary] = useState(false);

  const answered = (i: number, ok: boolean) => {
    results.current[i] = ok;
    props.onAnswer(slots[i].maker.concepts, ok);
    // The answer to the newest question decides what comes next.
    if (i === slots.length - 1) {
      const history = slots.map((s, n) => ({ maker: s.maker, ok: results.current[n] }));
      const m = nextPractice(makers, chosen, progress.current, history, r);
      setSlots((s) => [...s, { maker: m, phase: "practice", q: freshQuestion(m, r, asked) }]);
    }
  };

  const done = stack.results.filter((x) => x !== undefined).length;
  const right = stack.results.filter(Boolean).length;
  const practised = [...new Set(slots.flatMap((s, i) => (stack.results[i] === undefined ? [] : s.maker.concepts)))].filter((c) => chosen.has(c));

  if (summary)
    return (
      <div className="page lesson">
        <div className="pq lesson-done">
          <span className="pq-tag">Endless practice</span>
          <h2 className="pq-prompt">{done ? right + " of " + done + " right" : "Nothing answered"}</h2>
          {practised.length > 0 && (
            <ul className="endless-summary">
              {practised.map((c) => (
                <li key={c}>
                  <span>{term(c)}</span>
                  <Strength s={props.progress.skill[c]?.s ?? 0} />
                </li>
              ))}
            </ul>
          )}
          <RunReview slots={slots} stack={stack} onPick={() => setSummary(false)} />
          <div className="pq-bar">
            <button onClick={() => setSummary(false)}>Keep going</button>
            <button className="primary" onClick={props.onExit}>Back to the path</button>
          </div>
        </div>
      </div>
    );

  const onScreen = slots[stack.view];
  return (
    <div className={"page lesson" + (onScreen?.q.kind === "proof" ? " wide" : "")}>
      <div className="lesson-top">
        <button className="lesson-close" onClick={() => setSummary(true)} aria-label="Stop practising">×</button>
        <StackNav stack={stack} last={slots.length - 1} />
        <span className="endless-tally">
          {done ? right + " of " + done + " right" : "Endless practice"}
        </span>
        <button className="endless-stop" onClick={() => setSummary(true)}>Finish</button>
      </div>
      <StackView slots={slots} stack={stack} onAnswered={answered} />
    </div>
  );
}
