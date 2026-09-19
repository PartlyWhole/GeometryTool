// Exercise 5: questions whose answer is a number.
//
// Entry is a keypad rather than a text field, for the same reason statements
// are built from a palette: the app never asks a student to type.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { NUMERIC_ITEMS, type NumericItem, generatedNumeric } from "./content/numeric";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Hints, Scoreboard, Verdict } from "./ui";
import { NumberEntry, numberOf } from "./NumberEntry";

const close = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

export function NumericExercise() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(
    () => [...NUMERIC_ITEMS, ...generatedNumeric(seed, 8)],
    [seed],
  );
  const [i, setI] = useState(0);
  const [entry, setEntry] = useState("");
  const [result, setResult] = useState<null | "right" | "wrong" | "trap">(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [tally, setTally] = useState<Tally>(() => loadTally("numeric"));

  const item: NumericItem | undefined = items[i];
  if (!item) return <p className="muted">No questions.</p>;

  const value = numberOf(entry);
  const tol = item.tolerance ?? 1e-6;

  const check = () => {
    if (value === undefined) return;
    if (close(value, item.answer, tol)) {
      setResult("right");
      const t = record(tally, hintsShown === 0);
      setTally(t);
      saveTally("numeric", t);
      return;
    }
    // Entering x when the question asked for a measure is a specific mistake,
    // and the reference says it is the one questions are built to provoke.
    const trapped = item.trap && close(value, item.trap.value, 1e-6);
    setResult(trapped ? "trap" : "wrong");
    const t = record(tally, false);
    setTally(t);
    saveTally("numeric", t);
  };

  const next = () => {
    setEntry("");
    setResult(null);
    setHintsShown(0);
    if (i + 1 < items.length) setI(i + 1);
    else {
      setSeed(Math.floor(Math.random() * 1e9));
      setI(0);
    }
  };

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>Find the value</h2>
          <p className="prompt">
            Read the figure and the wording, then give the number the question
            actually asks for.
          </p>
        </div>
        <Scoreboard tally={tally} />
      </header>

      <p className="prompt strong">{item.prompt}</p>

      <div className={"exercise-body" + (item.figure ? "" : " no-figure")}>
        {item.figure && (
          <div>
            <Figure board={item.figure} height={300} ariaLabel={item.prompt} />
            {item.given && (
              <ul className="given-list">
                {item.given.map((g, n) => (
                  <li key={n}>{g}</li>
                ))}
              </ul>
            )}
            <div className="tagrow">
              {item.tags?.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        )}

        <div className="exercise-side">
          <NumberEntry
            value={entry}
            onChange={setEntry}
            unit={item.unit}
            disabled={result !== null}
          />

          <div className="row">
            <button
              className="primary"
              disabled={value === undefined || result === "right"}
              onClick={check}
            >
              Check
            </button>
            <button onClick={() => setEntry("")} disabled={!entry || result !== null}>
              Clear
            </button>
            <button onClick={next}>Skip</button>
          </div>

          {result === null && (
            <Hints
              hints={item.hints}
              shown={hintsShown}
              onMore={() => setHintsShown((n) => n + 1)}
            />
          )}

          {result !== null && (
            <>
              <Verdict
                ok={result === "right"}
                // Traps used to be only "you stopped at x"; they now name
                // several different slips, so the title states the one thing
                // true of all of them and the note says which.
                title={result === "trap" ? "A wrong answer worth naming" : undefined}
              >
                {result === "trap" ? item.trap!.note + " " + item.why : item.why}
              </Verdict>
              <div className="row">
                <button className="primary" onClick={next}>Next</button>
                {result !== "right" && (
                  <button
                    onClick={() => {
                      setEntry("");
                      setResult(null);
                    }}
                  >
                    Try again
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
