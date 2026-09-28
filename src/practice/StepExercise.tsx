// One line of a proof, with the lines it rests on above it: what justifies it?
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { statementText } from "./notation";
import { reasonById } from "./reasons";
import type { ProofProblem } from "./proof";
import { type StepItem, stepItems } from "./content/stepReason";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { ItemNav, Scoreboard, Verdict } from "./ui";

/** "2, 5 and 6" rather than "2 and 5 and 6". */
const listOf = (ns: number[]) =>
  ns.length < 2
    ? String(ns[0] ?? "")
    : ns.slice(0, -1).join(", ") + " and " + ns[ns.length - 1];

export function StepExercise(props: { proofs?: ProofProblem[]; tallyKey?: string }) {
  const tallyKey = props.tallyKey ?? "steps";
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => stepItems(seed, 12, props.proofs), [seed, props.proofs]);
  const deck = useDeck<string | null>(items.length, () => null, {
    key: String(seed),
    onEnd: () => setSeed(Math.floor(Math.random() * 1e9)),
  });
  const picked = deck.state;
  const [tally, setTally] = useState<Tally>(() => loadTally(tallyKey));

  const item: StepItem | undefined = items[deck.i];
  if (!item) return <p className="muted">No steps.</p>;

  const answer = (choice: string) => {
    if (picked !== null) return;
    deck.setState(choice);
    const t = record(tally, choice === item.answer);
    setTally(t);
    saveTally(tallyKey, t);
  };

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>{item.title}</h2>
          <p className="prompt">
            One line of a proof. What justifies it?
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
        noun="Step"
        endLabel="New set"
        marks={dots(deck, (p, n) => (p === null ? null : p === items[n].answer))}
      />

      <div className={"exercise-body" + (item.figure ? "" : " no-figure")}>
        {item.figure && (
          <div>
            <Figure board={item.figure} height={280} ariaLabel={item.title} />
            <div className="tagrow">
              {item.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        )}
        <div className="exercise-side">
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

          {/* Unconditional: the row being asked about lives in this table, so
              hiding it when nothing precedes would hide the statement too. */}
          <table className="two-column compact">
            <tbody>
              {item.above.map((row) => (
                <tr key={row.n} className={item.cites.includes(row.n) ? "cited" : ""}>
                  <td className="num">{row.n}</td>
                  <td>{statementText(row.statement)}</td>
                  <td className="reason">{reasonById(row.reasonId)?.name}</td>
                </tr>
              ))}
              <tr className="asking">
                <td className="num">{item.above.length + 1}</td>
                <td>{statementText(item.statement)}</td>
                <td className="reason"><em>which reason?</em></td>
              </tr>
            </tbody>
          </table>

          <p className="cite-help">
            {item.cites.length
              ? "This line rests on line" + (item.cites.length > 1 ? "s " : " ") +
                listOf(item.cites) + ", highlighted above."
              : "This line rests on the figure and the givens, not on an earlier line."}
          </p>

          <div className="choices tall">
            {item.options.map((o) => (
              <button
                key={o}
                className={
                  "choice" +
                  (picked === o ? " picked" : "") +
                  (picked !== null && o === item.answer ? " right" : "") +
                  (picked === o && o !== item.answer ? " wrong" : "")
                }
                disabled={picked !== null}
                onClick={() => answer(o)}
              >
                <span>{o}</span>
              </button>
            ))}
          </div>

          {picked !== null && (
            <>
              {/* The validator's own refusal of the option actually chosen,
                  rather than a gloss of the right answer. */}
              <Verdict ok={picked === item.answer}>
                {item.whyByOption?.[picked] ?? item.why}
              </Verdict>
              <div className="row">
                <button className="primary" onClick={deck.forward}>Next step</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
