// Module 3: a proof with the reasons left blank, as in the reference — a flow
// proof of boxes and arrows (3.1 Task 3), or a two-column table with some
// rows already filled (3.2 Task 3, 3.3 Tasks 1 and 2). The student chooses
// the justification for each blank.
import React, { useState } from "react";
import { Figure, type Highlight } from "./Figure";
import { statementText } from "./notation";
import { reasonById } from "./reasons";
import { statementObjects, type Statement } from "./terms";
import { FLOWS3, FLOW_REASONS, TABLE_REASON_NAMES, type FlowBox, type FlowItem } from "./content/items3";
import { explainRelation } from "./content/pairs3";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { ItemNav, Scoreboard, Verdict } from "./ui";

type Work = { chosen: string[]; checked: boolean; scored: boolean };
const blank = (): Work => ({ chosen: [], checked: false, scored: false });

const reasonName = (id: string) => reasonById(id)?.name ?? TABLE_REASON_NAMES[id] ?? id;
const lineText = (b: FlowBox) => b.text ?? (b.statement ? statementText(b.statement) : "");
const isRight = (b: FlowBox, chosen: string | undefined) =>
  !!chosen && (chosen === b.reasonId || !!b.accept?.includes(chosen));

const angPair = (s?: Statement): [string, string] | undefined =>
  s && s.k === "cong" && s.l.k === "ang" && s.r.k === "ang" ? [s.l.name, s.r.name] : undefined;

/** Why the reason chosen for row `i` is wrong, in terms of that row. */
function flowNote(item: FlowItem, i: number, chosen: string): string {
  const box = item.boxes[i];
  if (isRight(box, chosen)) return reasonById(box.reasonId)?.short ?? "";
  if (box.note) return box.note;
  if (i === 0) return "Nothing comes before the first line: it is what you are told, so its reason is Given.";
  if (chosen === "given") return "Only the first line is given. This one follows from the lines before it.";
  const pair = angPair(box.statement);
  const last = i === item.boxes.length - 1;
  const circular = "That is the rule this proof sets out to establish, so citing it would be circular.";
  if (chosen === item.proves)
    return pair && !last
      ? explainRelation(item.figure, pair[0], pair[1]) + " And " + circular.charAt(0).toLowerCase() + circular.slice(1)
      : circular;
  if (last && pair)
    return "This line is not about one pair of angles on the figure: it joins the two lines before it, which share an angle.";
  if (chosen === "transitive")
    return "The Transitive Property joins two statements that share a middle term. This line follows from one fact about a single pair.";
  if (chosen === "def-cong-ang")
    return "That turns a congruence into equal measures. It cannot make two angles congruent in the first place.";
  if (chosen === "linear-pair-theorem") return "A linear pair gives a sum of 180°, and this line is a congruence.";
  if (pair) return explainRelation(item.figure, pair[0], pair[1]) + " Which rule is about that pair?";
  return "Look at what this line says and which lines above it it rests on.";
}

export function FlowExercise() {
  const deck = useDeck<Work>(FLOWS3.length, blank);
  const [tally, setTally] = useState<Tally>(() => loadTally("flow-m3"));
  const item = FLOWS3[deck.i];
  const { chosen, checked } = deck.state;
  const open = item.boxes.map((b, i) => (b.shown ? -1 : i)).filter((i) => i >= 0);
  const ready = open.every((i) => !!chosen[i]);
  const allRight = open.every((i) => isRight(item.boxes[i], chosen[i]));
  const options = item.reasons ?? FLOW_REASONS;

  const choose = (i: number, id: string) =>
    deck.setState((w) => {
      const next = w.chosen.slice();
      next[i] = id;
      return { ...w, chosen: next, checked: false };
    });

  const check = () => {
    deck.setState((w) => ({ ...w, checked: true, scored: true }));
    if (!deck.state.scored) {
      const t = record(tally, allRight);
      setTally(t);
      saveTally("flow-m3", t);
    }
  };

  const highlights: Highlight[] = [
    ...item.givens.flatMap((g) => statementObjects(g).map((o) => ({ obj: o, role: "given" as const }))),
    ...(item.goal ? statementObjects(item.goal).map((o) => ({ obj: o, role: "prove" as const })) : []),
  ];

  const reasonCell = (box: FlowBox, i: number) =>
    box.shown ? (
      <span className="flow-reason-fixed">{reasonName(box.reasonId)}</span>
    ) : (
      <label className="flow-reason">
        <span className="sr-only">Reason for {lineText(box)}</span>
        <select value={chosen[i] ?? ""} onChange={(e) => choose(i, e.target.value)}>
          <option value="" disabled>? Choose the reason</option>
          {options.map((id) => (
            <option key={id} value={id}>{reasonName(id)}</option>
          ))}
        </select>
      </label>
    );

  const state = (box: FlowBox, i: number) =>
    box.shown || !checked ? "" : isRight(box, chosen[i]) ? " right" : " wrong";

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>{item.title}</h2>
          <p className="prompt">
            {item.layout === "table"
              ? "Some reasons are filled in. Choose the reason for each line marked ?."
              : "A flow proof: each arrow says the box it points to follows from the one it leaves. Choose the reason written under each box."}
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
        noun="Proof"
        marks={dots(deck, (w, n) =>
          !w.checked
            ? null
            : FLOWS3[n].boxes.every((b, k) => b.shown || isRight(b, w.chosen[k])),
        )}
      />

      <div className="exercise-body">
        <div>
          <Figure board={item.figure} height={280} highlights={highlights} ariaLabel={item.title} />
          <section className="givens">
            <h3>Given</h3>
            <ul>
              {(item.givenText ?? item.givens.map(statementText)).map((g, n) => (
                <li key={n} className="role-given">{g}</li>
              ))}
            </ul>
            <h3>Prove</h3>
            <p className="role-prove goal">{item.goalText ?? (item.goal ? statementText(item.goal) : "")}</p>
          </section>
        </div>

        <div className="exercise-side">
          {item.layout === "table" ? (
            <table className="two-column fill">
              <thead>
                <tr><th className="num">#</th><th>Statements</th><th>Reasons</th></tr>
              </thead>
              <tbody>
                {item.boxes.map((box, i) => (
                  <React.Fragment key={i}>
                    <tr className={"fill-row" + state(box, i)}>
                      <td className="num">{i + 1}</td>
                      <td>{lineText(box)}</td>
                      <td className="reason">{reasonCell(box, i)}</td>
                    </tr>
                    {checked && !box.shown && !isRight(box, chosen[i]) && (
                      <tr className="fill-note">
                        <td />
                        <td colSpan={2}>{flowNote(item, i, chosen[i])}</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <ol className="flow" aria-label="Flow proof">
              {item.boxes.map((box, i) => (
                <li key={i} className={"flow-step" + state(box, i)}>
                  {i > 0 && <span className="flow-arrow" aria-hidden="true">↓</span>}
                  <div className="flow-box">{lineText(box)}</div>
                  {reasonCell(box, i)}
                  {checked && !box.shown && !isRight(box, chosen[i]) && (
                    <p className="flow-note">{flowNote(item, i, chosen[i])}</p>
                  )}
                </li>
              ))}
            </ol>
          )}

          <div className="row">
            <button className="primary" disabled={!ready || checked} onClick={check}>
              Check
            </button>
            {checked && (
              <button className={allRight ? "primary" : ""} onClick={deck.forward}>
                Next
              </button>
            )}
          </div>
          {checked && (
            <Verdict ok={allRight} title={allRight ? "Every reason is right" : "Not yet"}>
              {allRight
                ? "Read the lines in order with “therefore” between them, and that is the proof."
                : "Change the reasons marked in red and check again."}
            </Verdict>
          )}
        </div>
      </div>
    </div>
  );
}
