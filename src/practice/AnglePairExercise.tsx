// Module 3, exercise 1: what are these two angles, and what follows?
import React, { useMemo, useState } from "react";
import { Figure, type Highlight } from "./Figure";
import {
  type Consequence,
  type PairItem,
  type Relation,
  RELATION_LABEL,
  consequenceText,
  explainRelation,
  pairItems,
} from "./content/pairs3";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { ItemNav, Scoreboard, Verdict } from "./ui";

/** What a student has done to one item: the option or angle they chose. */
type Work = { picked: string | null };
const blank = (): Work => ({ picked: null });

const HEADINGS: Record<PairItem["mode"], string> = {
  name: "Name the pair",
  find: "Find the partner",
  relate: "Congruent, supplementary, or neither?",
};

export function AnglePairExercise() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => pairItems(seed, 12), [seed]);
  const deck = useDeck<Work>(items.length, blank, {
    key: String(seed),
    onEnd: () => setSeed(Math.floor(Math.random() * 1e9)),
  });
  const [tally, setTally] = useState<Tally>(() => loadTally("pairs3"));
  const item = items[deck.i];
  const { picked } = deck.state;

  const answer = (choice: string) => {
    if (picked !== null) return;
    deck.setState({ picked: choice });
    const t = record(tally, choice === String(item.answer));
    setTally(t);
    saveTally("pairs3", t);
  };

  const done = picked !== null;
  const ok = done && picked === String(item.answer);

  // Before an answer, the angles the question names. After, the answer too,
  // and the student's own pick when it was wrong, so the two can be compared.
  const highlights: Highlight[] = [...item.highlights];
  if (item.mode === "find" && done) {
    highlights.push({ obj: { k: "ang", name: item.answer }, role: "prove" });
    if (!ok) highlights.push({ obj: { k: "ang", name: picked! }, role: "shared" });
  }

  const verdict = () => {
    if (item.mode === "find") {
      if (ok) return item.why;
      const theirs = explainRelation(item.figure, item.from, picked!);
      return theirs + " The partner is ∠" + item.answer + " (in red). " + item.why;
    }
    return item.why;
  };

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>{HEADINGS[item.mode]}</h2>
          <p className="prompt">
            Two things decide every name: which side of the transversal each
            angle is on, and whether it opens between the lines or outside them.
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
        marks={dots(deck, (w, n) =>
          w.picked === null ? null : w.picked === String(items[n].answer),
        )}
      />

      <p className="prompt strong">{item.prompt}</p>

      <div className="exercise-body">
        <Figure
          board={item.figure}
          height={330}
          highlights={highlights}
          onPickAngle={
            item.mode === "find" && !done
              ? (x) => x.name !== item.from && answer(x.name)
              : undefined
          }
          ariaLabel={item.prompt}
        />

        <div className="exercise-side">
          {item.mode === "find" ? (
            <p className="muted">
              {done
                ? "You chose ∠" + picked + "."
                : "Click inside an angle on the figure to choose it."}
            </p>
          ) : (
            <div className="choices tall">
              {(item.choices as (Relation | Consequence)[]).map((c) => {
                const text =
                  item.mode === "name"
                    ? RELATION_LABEL[c as Relation]
                    : consequenceText(c as Consequence, ...item.pair);
                return (
                  <button
                    key={c}
                    className={
                      "choice" +
                      (picked === c ? " picked" : "") +
                      (done && c === item.answer ? " right" : "") +
                      (done && picked === c && c !== item.answer ? " wrong" : "")
                    }
                    disabled={done}
                    onClick={() => answer(c)}
                  >
                    <span>{text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {done && <Verdict ok={ok}>{verdict()}</Verdict>}
          {done && (
            <div className="row">
              <button className="primary" onClick={deck.forward}>Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
