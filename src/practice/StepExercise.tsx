// One line of a proof, with the lines it rests on above it: what justifies it?
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { statementText } from "./notation";
import { reasonById } from "./reasons";
import { type StepItem, stepItems } from "./content/stepReason";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Scoreboard, Verdict } from "./ui";

/** "2, 5 and 6" rather than "2 and 5 and 6". */
const listOf = (ns: number[]) =>
  ns.length < 2
    ? String(ns[0] ?? "")
    : ns.slice(0, -1).join(", ") + " and " + ns[ns.length - 1];

export function StepExercise() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const items = useMemo(() => stepItems(seed, 12), [seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [tally, setTally] = useState<Tally>(() => loadTally("steps"));

  const item: StepItem | undefined = items[i];
  if (!item) return <p className="muted">No steps.</p>;

  const answer = (choice: string) => {
    if (picked !== null) return;
    setPicked(choice);
    const t = record(tally, choice === item.answer);
    setTally(t);
    saveTally("steps", t);
  };
  const next = () => {
    setPicked(null);
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
          <h2>{item.title}</h2>
          <p className="prompt">
            One line of a proof. What justifies it?
          </p>
        </div>
        <Scoreboard tally={tally} />
      </header>

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
          {item.givens.length > 0 && (
            <section className="givens">
              <h3>Given</h3>
              <ul>
                {item.givens.map((g, n) => (
                  <li key={n} className="role-given">{statementText(g)}</li>
                ))}
              </ul>
            </section>
          )}

          {item.above.length > 0 && (
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
          )}

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
              <Verdict ok={picked === item.answer}>{item.why}</Verdict>
              <div className="row">
                <button className="primary" onClick={next}>Next step</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
