// The two "select all that apply" formats.
//
// Distinct from single-answer multiple choice: you must judge every option on
// its own rather than find the best one, which is why the paper uses it for
// reading a marked figure and for checking a proof's reasons.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { statementText } from "./notation";
import { CLAIM_ITEMS, type ClaimItem } from "./content/claims";
import type { ProofProblem } from "./proof";
import { reasonCheckItems, reasonName } from "./content/reasonCheck";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { ItemNav, Scoreboard, Verdict } from "./ui";

type Row = { label: string; correct: boolean; note?: string };

function Checklist(props: {
  rows: Row[];
  picked: Set<number>;
  done: boolean;
  onToggle: (i: number) => void;
  numbered?: boolean;
}) {
  return (
    <div className="selectall">
      {props.rows.map((row, i) => {
        const chosen = props.picked.has(i);
        const state = !props.done
          ? ""
          : row.correct === chosen
            ? " settled"
            : " missed";
        return (
          <button
            key={i}
            role="checkbox"
            aria-checked={chosen}
            disabled={props.done}
            className={"claim" + (chosen ? " picked" : "") + state}
            onClick={() => props.onToggle(i)}
          >
            <span className="claim-box" aria-hidden="true">
              {props.done ? (row.correct ? "✓" : "✕") : chosen ? "✓" : ""}
            </span>
            {props.numbered && <span className="claim-n">{i + 1}.</span>}
            <span className="claim-body">
              <span>{row.label}</span>
              {props.done && !row.correct && row.note && (
                <span className="claim-note">{row.note}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const sameSet = (picked: Set<number>, rows: Row[]) =>
  rows.every((r, i) => r.correct === picked.has(i));

/** What a student has done to one select-all item. */
type Work = { picked: Set<number>; done: boolean };
const blankWork = (): Work => ({ picked: new Set<number>(), done: false });

/** Q12A: which statements does the figure assert? */
export function ClaimMode(props: { items?: ClaimItem[]; tallyKey?: string }) {
  const items = props.items ?? CLAIM_ITEMS;
  const tallyKey = props.tallyKey ?? "claims";
  const deck = useDeck<Work>(items.length, blankWork);
  const item = items[deck.i];
  const { picked, done } = deck.state;
  const [tally, setTally] = useState<Tally>(() => loadTally(tallyKey));

  const rows: Row[] = item.claims.map((c) => ({
    label: statementText(c.statement),
    correct: c.holds,
  }));

  const setPicked = (f: (p: Set<number>) => Set<number>) =>
    deck.setState((w) => ({ ...w, picked: f(w.picked) }));

  const check = () => {
    const ok = sameSet(picked, rows);
    deck.setState((w) => ({ ...w, done: true }));
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
        marks={dots(deck, (w, n) =>
          !w.done
            ? null
            : sameSet(
                w.picked,
                items[n].claims.map((c) => ({
                  label: "",
                  correct: c.holds,
                })),
              ),
        )}
      />
      <p className="prompt strong">{item.prompt}</p>
      <div className="exercise-body">
        <div>
          <Figure board={item.figure} height={310} ariaLabel={item.prompt} />
          <div className="tagrow">
            {item.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            <Scoreboard tally={tally} />
          </div>
        </div>
        <div className="exercise-side">
          <Checklist
            rows={rows}
            picked={picked}
            done={done}
            onToggle={(n) =>
              setPicked((p) => {
                const q = new Set(p);
                q.has(n) ? q.delete(n) : q.add(n);
                return q;
              })
            }
          />
          <div className="row">
            {!done ? (
              <button className="primary" onClick={check}>Check</button>
            ) : (
              <button className="primary" onClick={deck.forward}>Next</button>
            )}
            {!done && (
              <button onClick={() => setPicked(() => new Set())} disabled={!picked.size}>
                Clear
              </button>
            )}
          </div>
          {done && <Verdict ok={sameSet(picked, rows)}>{item.why}</Verdict>}
        </div>
      </div>
    </>
  );
}

/** Q6: which lines of this proof carry the right reason? */
export function ReasonCheckMode(props: { proofs?: ProofProblem[]; tallyKey?: string }) {
  const tallyKey = props.tallyKey ?? "reasoncheck";
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => reasonCheckItems(seed, 8, props.proofs), [seed, props.proofs]);
  const deck = useDeck<Work>(items.length, blankWork, {
    key: String(seed),
    onEnd: () => setSeed(Math.floor(Math.random() * 1e9)),
  });
  const { picked, done } = deck.state;
  const [tally, setTally] = useState<Tally>(() => loadTally(tallyKey));

  const item = items[deck.i];
  if (!item) return <p className="muted">No items.</p>;

  const rows: Row[] = item.rows.map((row) => ({
    label: statementText(row.statement) + "   —   " + reasonName(row.reasonId),
    correct: row.correct,
    note: row.note,
  }));

  const setPicked = (f: (p: Set<number>) => Set<number>) =>
    deck.setState((w) => ({ ...w, picked: f(w.picked) }));

  const check = () => {
    const ok = sameSet(picked, rows);
    deck.setState((w) => ({ ...w, done: true }));
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
        noun="Proof"
        endLabel="New set"
        marks={dots(deck, (w, n) =>
          !w.done
            ? null
            : sameSet(
                w.picked,
                items[n].rows.map((r) => ({ label: "", correct: r.correct })),
              ),
        )}
      />
      <p className="prompt strong">{item.prompt}</p>
      <div className="exercise-body">
        <div>
          {item.figure && (
            <Figure board={item.figure} height={250} ariaLabel={item.title} />
          )}
          <section className="givens">
            <h3>Given</h3>
            {item.givens.length ? (
              <ul>
                {item.givens.map((g, n) => (
                  <li key={n} className="role-given">{statementText(g)}</li>
                ))}
              </ul>
            ) : (
              <p className="muted small">Read what you need from the figure.</p>
            )}
            <h3>Prove</h3>
            <p className="role-prove goal">{statementText(item.goal)}</p>
          </section>
          <div className="tagrow">
            {item.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            <Scoreboard tally={tally} />
          </div>
        </div>
        <div className="exercise-side">
          <Checklist
            rows={rows}
            picked={picked}
            done={done}
            numbered
            onToggle={(n) =>
              setPicked((p) => {
                const q = new Set(p);
                q.has(n) ? q.delete(n) : q.add(n);
                return q;
              })
            }
          />
          <div className="row">
            {!done ? (
              <button className="primary" onClick={check}>Check</button>
            ) : (
              <button className="primary" onClick={deck.forward}>Next</button>
            )}
            {!done && (
              <button onClick={() => setPicked(() => new Set())} disabled={!picked.size}>
                Clear
              </button>
            )}
          </div>
          {done && <Verdict ok={sameSet(picked, rows)}>{item.why}</Verdict>}
        </div>
      </div>
    </>
  );
}
