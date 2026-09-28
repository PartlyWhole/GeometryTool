// Exercise 5: questions whose answer is a number.
//
// Entry is a keypad rather than a text field, for the same reason statements
// are built from a palette: the app never asks a student to type.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { NUMERIC_ITEMS, type NumericItem, type Trap, generatedNumeric } from "./content/numeric";

/** One trap or several, read the same way. */
const traps = (t: Trap | Trap[] | undefined): Trap[] => (t ? (Array.isArray(t) ? t : [t]) : []);
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Hints, ItemNav, Scoreboard, Verdict } from "./ui";
import { NumberEntry, numberOf } from "./NumberEntry";

const close = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

/** What a student has done to one numeric question. */
type Work = {
  entry: string;
  result: null | "right" | "wrong" | "trap";
  trapHit: Trap | null;
  hintsShown: number;
};
const blankWork = (): Work => ({
  entry: "",
  result: null,
  trapHit: null,
  hintsShown: 0,
});

export function NumericExercise(props: {
  source?: (seed: number) => NumericItem[];
  tallyKey?: string;
}) {
  const tallyKey = props.tallyKey ?? "numeric";
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(
    () =>
      props.source
        ? props.source(seed)
        : [...NUMERIC_ITEMS, ...generatedNumeric(seed, 8)],
    [seed, props.source],
  );
  const deck = useDeck<Work>(items.length, blankWork, {
    key: String(seed),
    onEnd: () => setSeed(Math.floor(Math.random() * 1e9)),
  });
  const { entry, result, trapHit, hintsShown } = deck.state;
  const set = (patch: Partial<Work>) =>
    deck.setState((w) => ({ ...w, ...patch }));
  const [tally, setTally] = useState<Tally>(() => loadTally(tallyKey));

  const item: NumericItem | undefined = items[deck.i];
  if (!item) return <p className="muted">No questions.</p>;

  const value = numberOf(entry);
  const tol = item.tolerance ?? 1e-6;

  const check = () => {
    if (value === undefined) return;
    if (close(value, item.answer, tol)) {
      set({ result: "right" });
      const t = record(tally, hintsShown === 0);
      setTally(t);
      saveTally(tallyKey, t);
      return;
    }
    // Entering x when the question asked for a measure is a specific mistake,
    // and the reference says it is the one questions are built to provoke.
    const hit = traps(item.trap).find((t) => close(value, t.value, 1e-6));
    set({ trapHit: hit ?? null, result: hit ? "trap" : "wrong" });
    const t = record(tally, false);
    setTally(t);
    saveTally(tallyKey, t);
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

      <ItemNav
        i={deck.i}
        count={deck.count}
        onGo={deck.go}
        onBack={deck.back}
        onForward={deck.forward}
        endLabel="New set"
        marks={dots(deck, (w) => (w.result === null ? null : w.result === "right"))}
      />

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
            onChange={(v) => set({ entry: v })}
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
            <button onClick={() => set({ entry: "" })} disabled={!entry || result !== null}>
              Clear
            </button>
          </div>

          {result === null && (
            <Hints
              hints={item.hints}
              shown={hintsShown}
              onMore={() => deck.setState((w) => ({ ...w, hintsShown: w.hintsShown + 1 }))}
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
                {result === "trap" ? trapHit!.note + " " + item.why : item.why}
              </Verdict>
              <div className="row">
                <button className="primary" onClick={deck.forward}>Next</button>
                {result !== "right" && (
                  <button
                    onClick={() => set({ entry: "", result: null })}
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
