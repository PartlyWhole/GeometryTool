// Exercise 2: testing understanding of properties, postulates and definitions.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { conceptQuestions } from "./content/conceptQuiz";
import type { Concept } from "./content/concepts";
import { LIBRARY } from "./content/library";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { ItemNav, Scoreboard, Verdict } from "./ui";

export function ConceptExercise(props: { bank?: Concept[]; tallyKey?: string }) {
  const tallyKey = props.tallyKey ?? "concepts";
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => conceptQuestions(seed, 14, props.bank), [seed, props.bank]);
  const deck = useDeck<number | null>(items.length, () => null, {
    key: String(seed),
    onEnd: () => setSeed(Math.floor(Math.random() * 1e9)),
  });
  const picked = deck.state;
  const [tally, setTally] = useState<Tally>(() => loadTally(tallyKey));

  const q = items[deck.i];
  if (!q) return <p className="muted">No questions generated.</p>;

  const answer = (n: number) => {
    if (picked !== null) return;
    deck.setState(n);
    const t = record(tally, n === q.correct);
    setTally(t);
    saveTally(tallyKey, t);
  };

  const make = q.figure ? LIBRARY[q.figure] : undefined;

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>Definitions and properties</h2>
          <p className="prompt">{q.prompt}</p>
        </div>
        <Scoreboard tally={tally} />
      </header>

      <ItemNav
        i={deck.i}
        count={deck.count}
        onGo={deck.go}
        onBack={deck.back}
        onForward={deck.forward}
        endLabel="New set"
        marks={dots(deck, (p, n) => (p === null ? null : p === items[n].correct))}
      />

      <div className={"exercise-body" + (make ? "" : " no-figure")}>
        {make && (
          <div>
            <Figure board={make()} height={300} ariaLabel={q.caption ?? q.prompt} />
            {q.caption && <p className="figure-caption">{q.caption}</p>}
          </div>
        )}
        <div className="exercise-side">
          <div className="choices tall">
            {q.choices.map((c, n) => (
              <button
                key={n}
                className={
                  "choice" +
                  (picked === n ? " picked" : "") +
                  (picked !== null && n === q.correct ? " right" : "") +
                  (picked === n && n !== q.correct ? " wrong" : "")
                }
                disabled={picked !== null}
                onClick={() => answer(n)}
              >
                <span className="choice-letter">{"ABCD"[n]}</span>
                <span>{c.text}</span>
              </button>
            ))}
          </div>

          {picked !== null && (
            <>
              <Verdict ok={picked === q.correct}>{q.why}</Verdict>
              <div className="row">
                <button className="primary" onClick={deck.forward}>Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
