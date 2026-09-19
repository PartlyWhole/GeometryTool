// Exercise 2: testing understanding of properties, postulates and definitions.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { conceptQuestions } from "./content/conceptQuiz";
import { LIBRARY } from "./content/library";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Scoreboard, Verdict } from "./ui";

export function ConceptExercise() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => conceptQuestions(seed, 14), [seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [tally, setTally] = useState<Tally>(() => loadTally("concepts"));

  const q = items[i];
  if (!q) return <p className="muted">No questions generated.</p>;

  const answer = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    const t = record(tally, n === q.correct);
    setTally(t);
    saveTally("concepts", t);
  };

  const next = () => {
    setPicked(null);
    if (i + 1 < items.length) setI(i + 1);
    else {
      setSeed(Math.floor(Math.random() * 1e9));
      setI(0);
    }
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
                <button className="primary" onClick={next}>Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
