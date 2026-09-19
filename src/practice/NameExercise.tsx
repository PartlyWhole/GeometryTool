// Exercise 1: identify the segment or angle a combination of letters names.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { type NameItem, nameItems } from "./content/generators";
import { objKey, splitLabels } from "./terms";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Scoreboard, Verdict } from "./ui";

export function NameExercise() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => nameItems(seed, 12), [seed]);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<null | boolean>(null);
  const [tally, setTally] = useState<Tally>(() => loadTally("name"));

  const item = items[i];
  if (!item) return <p className="muted">No items generated.</p>;

  const expected = item.target.k === "ang"
    ? splitLabels(item.target.name)
    : [item.target.a, item.target.b];

  const reset = () => {
    setChosen([]);
    setPicked(null);
    setResult(null);
  };

  const next = () => {
    reset();
    if (i + 1 < items.length) setI(i + 1);
    else {
      setSeed(Math.floor(Math.random() * 1e9));
      setI(0);
    }
  };

  const score = (ok: boolean) => {
    setResult(ok);
    const t = record(tally, ok);
    setTally(t);
    saveTally("name", t);
  };

  const check = () => {
    if (item.mode === "choose") {
      score(picked === item.answer);
      return;
    }
    if (item.target.k === "ang") {
      const ok =
        chosen.length === 3 &&
        chosen[1] === expected[1] &&
        chosen[0] !== chosen[2] &&
        [chosen[0], chosen[2]].sort().join("") ===
          [expected[0], expected[2]].sort().join("");
      score(ok);
    } else {
      const ok =
        chosen.length === 2 &&
        chosen.slice().sort().join("") === expected.slice().sort().join("");
      score(ok);
    }
  };

  const wrongVertex =
    result === false &&
    item.mode === "click" &&
    item.target.k === "ang" &&
    chosen.length === 3 &&
    chosen[1] !== expected[1] &&
    chosen.slice().sort().join("") === expected.slice().sort().join("");

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>Name the figure</h2>
          <p className="prompt">{item.prompt}</p>
        </div>
        <Scoreboard tally={tally} />
      </header>

      <div className="exercise-body">
        <Figure
          board={item.figure}
          height={330}
          chosen={item.mode === "click" ? chosen : undefined}
          highlights={
            item.mode === "choose" ? [{ obj: item.target, role: "prove" }] : undefined
          }
          onPickPoint={
            item.mode === "click" && result === null
              ? (label) =>
                  setChosen((c) =>
                    c.includes(label)
                      ? c.filter((x) => x !== label)
                      : c.length >= expected.length
                        ? c
                        : [...c, label],
                  )
              : undefined
          }
          ariaLabel={item.prompt}
        />

        <div className="exercise-side">
          {item.mode === "click" ? (
            <>
              <p className="muted">
                {item.target.k === "ang"
                  ? "Click an arm point, then the vertex, then the other arm point."
                  : "Click the two endpoints."}
              </p>
              <div className="chosen-row">
                {chosen.length ? (
                  chosen.map((c, n) => (
                    <span key={n} className="chip static">{c}</span>
                  ))
                ) : (
                  <span className="muted">Nothing selected yet.</span>
                )}
              </div>
              {result === null && (
                <div className="row">
                  <button
                    className="primary"
                    disabled={chosen.length !== expected.length}
                    onClick={check}
                  >
                    Check
                  </button>
                  <button onClick={() => setChosen([])} disabled={!chosen.length}>
                    Clear
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="choices tall">
              {item.choices!.map((c, n) => (
                <button
                  key={c}
                  className={
                    "choice" +
                    (picked === c ? " picked" : "") +
                    (result !== null && c === item.answer ? " right" : "") +
                    (result === false && picked === c ? " wrong" : "")
                  }
                  disabled={result !== null}
                  onClick={() => {
                    setPicked(c);
                    const t = record(tally, c === item.answer);
                    setTally(t);
                    saveTally("name", t);
                    setResult(c === item.answer);
                  }}
                >
                  <span className="choice-letter">{"ABCD"[n]}</span>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          )}

          {result !== null && (
            <Verdict ok={result}>
              {wrongVertex
                ? "Those are the right three points, but the vertex must be the middle letter."
                : result
                  ? item.why
                  : item.target.k === "ang"
                    ? `∠${item.target.name} has vertex ${expected[1]}, with arms through ${expected[0]} and ${expected[2]}.`
                    : `Segment ${expected[0]}${expected[1]} runs between those two endpoints.`}
            </Verdict>
          )}

          {result !== null && (
            <div className="row">
              <button className="primary" onClick={next}>Next</button>
              {!result && (
                <button onClick={reset}>Try again</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const nameKey = objKey;
