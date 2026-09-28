// Module 3: a flow proof with the reasons left blank, as in the reference's
// 3B. The student chooses the justification written under each box.
import React, { useState } from "react";
import { Figure, type Highlight } from "./Figure";
import { statementText } from "./notation";
import { reasonById } from "./reasons";
import { statementObjects, type Statement } from "./terms";
import { FLOWS3, FLOW_REASONS, type FlowItem } from "./content/items3";
import { explainRelation } from "./content/pairs3";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { ItemNav, Scoreboard, Verdict } from "./ui";

type Work = { chosen: string[]; checked: boolean; scored: boolean };
const blank = (): Work => ({ chosen: [], checked: false, scored: false });

const angPair = (s: Statement): [string, string] | undefined =>
  s.k === "cong" && s.l.k === "ang" && s.r.k === "ang" ? [s.l.name, s.r.name] : undefined;

/** Why the reason chosen for box `i` is wrong, in terms of that box. */
function flowNote(item: FlowItem, i: number, chosen: string): string {
  const box = item.boxes[i];
  const right = box.reasonId;
  if (chosen === right) return reasonById(right)?.short ?? "";
  if (i === 0) return "Nothing points into the first box: it is what you are told, so its reason is Given.";
  if (chosen === "given") return "Only the first box is given. This one follows from the arrow into it.";
  const pair = angPair(box.statement);
  const last = i === item.boxes.length - 1;
  const circular = "That is the rule this proof sets out to establish, so citing it would be circular.";
  if (chosen === item.proves)
    return pair && !last
      ? explainRelation(item.figure, pair[0], pair[1]) + " And " + circular.charAt(0).toLowerCase() + circular.slice(1)
      : circular;
  if (last && pair) {
    const [x, z] = pair;
    return "This box, ∠" + x + " ≅ ∠" + z + ", is not about one pair of angles on the figure: it joins the two boxes before it, which share an angle.";
  }
  if (chosen === "transitive")
    return "The Transitive Property joins two congruences that share an angle. This box follows from one fact about a single pair of angles.";
  if (chosen === "def-cong-ang")
    return "That turns a congruence into equal measures. It cannot make two angles congruent in the first place.";
  if (chosen === "linear-pair-theorem")
    return "A linear pair gives a sum of 180°, and this box is a congruence.";
  if (pair) return explainRelation(item.figure, pair[0], pair[1]) + " Which rule is about that pair?";
  return "Look at what the box says and what points into it.";
}

export function FlowExercise() {
  const deck = useDeck<Work>(FLOWS3.length, blank);
  const [tally, setTally] = useState<Tally>(() => loadTally("flow-m3"));
  const item = FLOWS3[deck.i];
  const { chosen, checked } = deck.state;
  const ready = item.boxes.every((_, i) => !!chosen[i]);
  const allRight = item.boxes.every((b, i) => chosen[i] === b.reasonId);

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
    ...statementObjects(item.goal).map((o) => ({ obj: o, role: "prove" as const })),
  ];

  return (
    <div className="exercise">
      <header className="exercise-head">
        <div>
          <h2>{item.title}</h2>
          <p className="prompt">
            A flow proof: each arrow says the box it points to follows from the
            one it leaves. Choose the reason written under each box.
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
          !w.checked ? null : FLOWS3[n].boxes.every((b, k) => w.chosen[k] === b.reasonId),
        )}
      />

      <div className="exercise-body">
        <div>
          <Figure board={item.figure} height={280} highlights={highlights} ariaLabel={item.title} />
          <section className="givens">
            <h3>Given</h3>
            <ul>
              {item.givens.map((g, n) => (
                <li key={n} className="role-given">{statementText(g)}</li>
              ))}
            </ul>
            <h3>Prove</h3>
            <p className="role-prove goal">{statementText(item.goal)}</p>
          </section>
        </div>

        <div className="exercise-side">
          <ol className="flow" aria-label="Flow proof">
            {item.boxes.map((box, i) => {
              const state = !checked ? "" : chosen[i] === box.reasonId ? " right" : " wrong";
              return (
                <li key={i} className={"flow-step" + state}>
                  {i > 0 && <span className="flow-arrow" aria-hidden="true">↓</span>}
                  <div className="flow-box">{statementText(box.statement)}</div>
                  <label className="flow-reason">
                    <span className="sr-only">Reason for {statementText(box.statement)}</span>
                    <select
                      value={chosen[i] ?? ""}
                      onChange={(e) => choose(i, e.target.value)}
                    >
                      <option value="" disabled>? Choose the reason</option>
                      {FLOW_REASONS.map((id) => (
                        <option key={id} value={id}>{reasonById(id)?.name ?? id}</option>
                      ))}
                    </select>
                  </label>
                  {checked && chosen[i] !== box.reasonId && (
                    <p className="flow-note">{flowNote(item, i, chosen[i])}</p>
                  )}
                </li>
              );
            })}
          </ol>

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
                ? "Read the boxes top to bottom with “therefore” between them, and that is the proof."
                : "Change the reasons marked in red and check again."}
            </Verdict>
          )}
        </div>
      </div>
    </div>
  );
}
