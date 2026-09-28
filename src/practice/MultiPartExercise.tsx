// Questions in parts. One figure and one piece of work serve both, and a
// finished part stays visible with its answer, because Part B usually needs
// what Part A established.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { NumberEntry, numberOf } from "./NumberEntry";
import { statementText } from "./notation";
import {
  MULTIPART_ITEMS,
  type MultiPartItem,
  type Part,
  generatedMultiPart,
} from "./content/multipart";
import type { Trap } from "./content/numeric";

/** One trap or several, read the same way. */
const traps = (t: Trap | Trap[] | undefined): Trap[] => (t ? (Array.isArray(t) ? t : [t]) : []);
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Hints, ItemNav, Scoreboard, Verdict } from "./ui";

type Outcome = "right" | "wrong" | "trap";

/** A whole question in parts, as far as the student has taken it. */
type Work = {
  at: number;
  entry: string;
  picked: Set<number>;
  outcome: Outcome | null;
  trapHit: Trap | null;
  hintsShown: number;
  answers: string[];
  cleanRun: boolean;
};
const blankWork = (): Work => ({
  at: 0,
  entry: "",
  picked: new Set<number>(),
  outcome: null,
  trapHit: null,
  hintsShown: 0,
  answers: [],
  cleanRun: true,
});

export function MultiPartExercise(props: {
  source?: (seed: number) => MultiPartItem[];
  tallyKey?: string;
}) {
  const tallyKey = props.tallyKey ?? "multipart";
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(
    () =>
      props.source
        ? props.source(seed)
        : [...MULTIPART_ITEMS, ...generatedMultiPart(seed, 4)],
    [seed, props.source],
  );
  const deck = useDeck<Work>(items.length, blankWork, {
    key: String(seed),
    onEnd: () => setSeed(Math.floor(Math.random() * 1e9)),
  });
  const [tally, setTally] = useState<Tally>(() => loadTally(tallyKey));
  const item = items[deck.i];

  if (!item) return <p className="muted">No questions.</p>;

  return (
    <>
      <MultiPartBoard
        item={item}
        work={deck.state}
        setWork={deck.setState}
        tally={tally}
        onScore={(ok) => {
          const t = record(tally, ok);
          setTally(t);
          saveTally(tallyKey, t);
        }}
        onNext={deck.forward}
        nav={
          <ItemNav
            i={deck.i}
            count={deck.count}
            onGo={deck.go}
            onBack={deck.back}
            onForward={deck.forward}
            endLabel="New set"
            marks={dots(deck, (w, n) =>
              w.at < items[n].parts.length ? null : w.cleanRun,
            )}
          />
        }
      />
    </>
  );
}

function MultiPartBoard(props: {
  item: MultiPartItem;
  work: Work;
  setWork: (next: Work | ((prev: Work) => Work)) => void;
  tally: Tally;
  onScore: (ok: boolean) => void;
  onNext: () => void;
  nav: React.ReactNode;
}) {
  const { item } = props;
  const { at, entry, picked, outcome, trapHit, hintsShown, answers, cleanRun } =
    props.work;
  const set = (patch: Partial<Work>) =>
    props.setWork((w) => ({ ...w, ...patch }));

  const part: Part | undefined = item.parts[at];
  const finished = at >= item.parts.length;

  const advance = (shown: string) => {
    const nextAt = at + 1;
    props.setWork((w) => ({
      ...w,
      answers: [...w.answers, shown],
      entry: "",
      picked: new Set<number>(),
      outcome: null,
      hintsShown: 0,
      at: nextAt,
    }));
    if (nextAt >= item.parts.length) props.onScore(cleanRun);
  };

  const check = () => {
    if (!part) return;
    if (part.body.kind === "numeric") {
      const v = numberOf(entry);
      if (v === undefined) return;
      const tol = part.body.tolerance ?? 1e-6;
      if (Math.abs(v - part.body.answer) <= tol) {
        set({ outcome: "right" });
        return;
      }
      const hit = traps(part.body.trap).find((t) => Math.abs(v - t.value) <= 1e-6);
      set({
        trapHit: hit ?? null,
        outcome: hit ? "trap" : "wrong",
        cleanRun: false,
      });
    } else {
      const ok = part.body.claims.every((c, n) => c.holds === picked.has(n));
      set({ outcome: ok ? "right" : "wrong", cleanRun: cleanRun && ok });
    }
  };

  const ready =
    part?.body.kind === "numeric"
      ? numberOf(entry) !== undefined
      : picked.size > 0;

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>{item.title}</h2>
          <p className="prompt">Two parts, one figure. The first usually feeds the second.</p>
        </div>
        <Scoreboard tally={props.tally} />
      </header>

      {props.nav}

      <p className="prompt strong">{item.stem}</p>

      <div className={"exercise-body" + (item.figure ? "" : " no-figure")}>
        {item.figure && (
          <div>
            <Figure board={item.figure} height={300} ariaLabel={item.stem} />
            {item.given && (
              <ul className="given-list">
                {item.given.map((g, n) => <li key={n}>{g}</li>)}
              </ul>
            )}
            <div className="tagrow">
              {item.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        )}

        <div className="exercise-side">
          {/* Parts already done stay on screen: Part B usually needs them. */}
          {item.parts.slice(0, at).map((p, n) => (
            <div key={n} className="part done">
              <span className="part-label">{p.label}</span>
              <span className="part-answer">{answers[n]}</span>
            </div>
          ))}

          {part && (
            <div className="part current">
              <span className="part-label">{part.label}</span>
              <p className="part-prompt">{part.prompt}</p>

              {part.body.kind === "numeric" ? (
                <NumberEntry
                  value={entry}
                  onChange={(v) => set({ entry: v })}
                  unit={part.body.unit}
                  disabled={outcome === "right"}
                />
              ) : (
                <div className="selectall">
                  {part.body.claims.map((c, n) => (
                    <button
                      key={n}
                      role="checkbox"
                      aria-checked={picked.has(n)}
                      disabled={outcome === "right"}
                      className={
                        "claim" + (picked.has(n) ? " picked" : "") +
                        (outcome !== null
                          ? c.holds === picked.has(n) ? " settled" : " missed"
                          : "")
                      }
                      onClick={() =>
                        props.setWork((w) => {
                          const q = new Set(w.picked);
                          q.has(n) ? q.delete(n) : q.add(n);
                          return { ...w, picked: q };
                        })
                      }
                    >
                      <span className="claim-box" aria-hidden="true">
                        {outcome !== null ? (c.holds ? "✓" : "✕") : picked.has(n) ? "✓" : ""}
                      </span>
                      <span className="claim-body">{statementText(c.statement)}</span>
                    </button>
                  ))}
                </div>
              )}

              {outcome === null && (
                <Hints
                  hints={part.hints}
                  shown={hintsShown}
                  onMore={() =>
                    props.setWork((w) => ({
                      ...w,
                      hintsShown: w.hintsShown + 1,
                      cleanRun: false,
                    }))
                  }
                />
              )}

              {outcome !== null && (
                <Verdict
                  ok={outcome === "right"}
                  title={outcome === "trap" ? "A wrong answer worth naming" : undefined}
                >
                  {outcome === "trap" && trapHit
                    ? trapHit.note + " " + part.why
                    : part.why}
                </Verdict>
              )}

              <div className="row">
                {outcome === "right" ? (
                  <button
                    className="primary"
                    onClick={() =>
                      advance(
                        part.body.kind === "numeric"
                          ? entry + (part.body.unit ? " " + part.body.unit : "")
                          : [...picked].sort().map((n) =>
                              part.body.kind === "claims"
                                ? statementText(part.body.claims[n].statement)
                                : "",
                            ).join(", "),
                      )
                    }
                  >
                    {at + 1 < item.parts.length ? "Go to " + item.parts[at + 1].label : "Finish"}
                  </button>
                ) : (
                  <>
                    <button className="primary" disabled={!ready} onClick={check}>
                      Check
                    </button>
                    {outcome !== null && (
                      <button
                        onClick={() =>
                          set({ outcome: null, entry: "", picked: new Set<number>() })
                        }
                      >
                        Try again
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {finished && (
            <>
              <Verdict ok title="Both parts done">
                {cleanRun
                  ? "Straight through, with no hints and nothing to correct."
                  : "Finished. Look back at how Part A fed Part B."}
              </Verdict>
              <div className="row">
                <button className="primary" onClick={props.onNext}>Next question</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
