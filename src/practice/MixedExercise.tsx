// Module 3's stage exercises: a set of questions, some answered by choosing
// and some on the keypad, over one figure each. Used for the parallel tests
// (Lesson 3.2) and the perpendicular bisector (Lesson 3.3).
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { NumberEntry, numberOf } from "./NumberEntry";
import type { MixedItem } from "./content/tests3";
import type { Trap } from "./content/numeric";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Hints, ItemNav, Scoreboard, Verdict } from "./ui";

type Work = {
  picked: number | null;
  entry: string;
  result: null | "right" | "wrong" | "trap";
  trapHit: Trap | null;
  hintsShown: number;
};
const blank = (): Work => ({ picked: null, entry: "", result: null, trapHit: null, hintsShown: 0 });

const traps = (t: Trap | Trap[] | undefined): Trap[] => (t ? (Array.isArray(t) ? t : [t]) : []);

export function MixedExercise(props: {
  title: string;
  intro: string;
  source: (seed: number) => MixedItem[];
  tallyKey: string;
}) {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => props.source(seed), [seed, props.source]);
  const deck = useDeck<Work>(items.length, blank, {
    key: String(seed),
    onEnd: () => setSeed(Math.floor(Math.random() * 1e9)),
  });
  const [tally, setTally] = useState<Tally>(() => loadTally(props.tallyKey));
  const item = items[deck.i];
  const w = deck.state;
  const set = (patch: Partial<Work>) => deck.setState((x) => ({ ...x, ...patch }));
  const score = (ok: boolean) => {
    const t = record(tally, ok);
    setTally(t);
    saveTally(props.tallyKey, t);
  };

  const choose = (n: number) => {
    if (item.kind !== "choice" || w.result !== null) return;
    const ok = n === item.correct;
    set({ picked: n, result: ok ? "right" : "wrong" });
    score(ok);
  };

  const check = () => {
    if (item.kind !== "number") return;
    const v = numberOf(w.entry);
    if (v === undefined) return;
    if (Math.abs(v - item.answer) < 1e-6) {
      set({ result: "right" });
      score(w.hintsShown === 0);
      return;
    }
    const hit = traps(item.trap).find((t) => Math.abs(v - t.value) < 1e-6) ?? null;
    set({ result: hit ? "trap" : "wrong", trapHit: hit });
    score(false);
  };

  const done = w.result !== null;

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>{item.heading}</h2>
          <p className="prompt">{props.intro}</p>
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
        marks={dots(deck, (x) => (x.result === null ? null : x.result === "right"))}
      />

      {item.context && (
        <div className="card-context">
          {item.context.map((line, n) => (
            <p key={n}>{line}</p>
          ))}
        </div>
      )}
      <p className="prompt strong">{item.prompt}</p>

      <div className={"exercise-body" + (item.figure ? "" : " no-figure")}>
        {item.figure && (
          <div>
            <Figure board={item.figure} height={310} highlights={item.highlights} ariaLabel={item.prompt} />
            {item.kind === "number" && item.given && (
              <ul className="given-list">
                {item.given.map((g, n) => (
                  <li key={n}>{g}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="exercise-side">
          {item.kind === "choice" ? (
            <div className="choices tall">
              {item.choices.map((c, n) => (
                <button
                  key={n}
                  className={
                    "choice" +
                    (w.picked === n ? " picked" : "") +
                    (done && n === item.correct ? " right" : "") +
                    (done && w.picked === n && n !== item.correct ? " wrong" : "")
                  }
                  disabled={done}
                  onClick={() => choose(n)}
                >
                  <span className="choice-letter">{"ABCD"[n]}</span>
                  <span>{c}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <NumberEntry
                value={w.entry}
                onChange={(v) => set({ entry: v })}
                unit={item.unit}
                disabled={w.result === "right"}
              />
              <div className="row">
                <button
                  className="primary"
                  disabled={numberOf(w.entry) === undefined || w.result === "right"}
                  onClick={check}
                >
                  Check
                </button>
                <button onClick={() => set({ entry: "" })} disabled={!w.entry || done}>
                  Clear
                </button>
              </div>
              {!done && (
                <Hints
                  hints={item.hints}
                  shown={w.hintsShown}
                  onMore={() => deck.setState((x) => ({ ...x, hintsShown: x.hintsShown + 1 }))}
                />
              )}
            </>
          )}

          {done && (
            <Verdict
              ok={w.result === "right"}
              title={w.result === "trap" ? "A wrong answer worth naming" : undefined}
            >
              {[
                w.result === "trap" ? w.trapHit?.note : undefined,
                item.kind === "choice" && w.picked !== null && w.picked !== item.correct
                  ? item.whyPerChoice?.[w.picked]
                  : undefined,
                item.why,
              ]
                .filter(Boolean)
                .join(" ")}
            </Verdict>
          )}
          {done && (
            <div className="row">
              <button className="primary" onClick={deck.forward}>Next</button>
              {item.kind === "number" && w.result !== "right" && (
                <button onClick={() => set({ entry: "", result: null, trapHit: null })}>Try again</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
