// The Concepts page: each concept explained in steps, with the figure
// building up as you go.
//
// Practice tests what you know and Cards drill it; this is where the idea is
// laid out in the first place. A step may change the figure, move the
// highlight on the figure already there, or put up a line of algebra.
import React, { useMemo, useState } from "react";
import { Figure, type Highlight } from "./Figure";
import { statementText } from "./notation";
import { CONCEPTS, type Concept } from "./content/concepts";
import { LIBRARY } from "./content/library";
import { WALKTHROUGHS } from "./content/walkthroughs";
import { BuildStamp } from "./ui";

const SECTIONS: { label: string; match: (c: Concept) => boolean }[] = [
  { label: "Points and lines", match: (c) => c.section === "§5" },
  { label: "Segments", match: (c) => c.section === "§6" },
  { label: "Angles", match: (c) => c.section === "§8" },
  { label: "Properties of equality", match: (c) => c.section === "§4" },
  { label: "The five theorems", match: (c) => c.section === "§9" },
  { label: "Reasoning and proof", match: (c) => c.section === "§2" || c.section === "§3" },
];

export function Concepts() {
  const [id, setId] = useState(CONCEPTS[0].id);
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const concept = CONCEPTS.find((c) => c.id === id)!;
  const walk = WALKTHROUGHS.find((w) => w.conceptId === id);

  const choose = (next: string) => {
    setId(next);
    setStep(0);
  };

  // A step keeps the figure of the step before it unless it names its own.
  const { board, marks } = useMemo(() => {
    if (!walk) return { board: undefined, marks: [] as Highlight[] };
    let figure: string | undefined;
    for (let i = 0; i <= step && i < walk.steps.length; i++)
      if (walk.steps[i].figure) figure = walk.steps[i].figure;
    const current = walk.steps[step];
    return {
      board: figure ? LIBRARY[figure]() : undefined,
      marks: (current?.marks ?? []) as Highlight[],
    };
  }, [walk, step]);

  const last = (walk?.steps.length ?? 1) - 1;
  const atEnd = step >= last;

  const advance = () => {
    if (atEnd) setSeen((s) => new Set(s).add(id));
    else setStep(step + 1);
  };

  return (
    <div className="page concepts">
      <header className="page-head">
        <div>
          <h1>Concepts</h1>
          <p className="muted">
            Every idea in the module, laid out a step at a time. Work through a
            concept here, then drill it in Practice.
          </p>
        </div>
      </header>

      <div className="concepts-body">
        <nav className="concept-list" aria-label="Concepts">
          {SECTIONS.map((section) => {
            const members = CONCEPTS.filter(section.match);
            if (!members.length) return null;
            return (
              <div key={section.label} className="concept-group">
                <h2>{section.label}</h2>
                {members.map((c) => (
                  <button
                    key={c.id}
                    className={"concept-link" + (c.id === id ? " active" : "")}
                    aria-current={c.id === id ? "true" : undefined}
                    onClick={() => choose(c.id)}
                  >
                    <span>{c.term}</span>
                    {seen.has(c.id) && <span className="concept-done" aria-label="read">✓</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        <article className="concept-main">
          <div className="concept-head">
            <span className="card-kind">{concept.kind} · {concept.section}</span>
            <h2>{concept.term}</h2>
            <p className="concept-def">{concept.definition}</p>
          </div>

          {walk && (
            <>
              <div className="concept-stage">
                {board ? (
                  <Figure
                    board={board}
                    highlights={marks}
                    height={330}
                    ariaLabel={walk.steps[step].text}
                  />
                ) : (
                  <div className="concept-nofigure">
                    <span className="muted small">
                      This one is better shown in symbols than in a picture.
                    </span>
                  </div>
                )}
                {walk.steps[step].show && (
                  <p className="concept-show">
                    {statementText(walk.steps[step].show!)}
                  </p>
                )}
              </div>

              <div className="concept-steps">
                {walk.steps.map((s, n) => (
                  <p
                    key={n}
                    className={
                      "concept-step" +
                      (n === step ? " current" : n < step ? " past" : " ahead")
                    }
                    onClick={() => setStep(n)}
                  >
                    <span className="concept-n">{n + 1}</span>
                    {s.text}
                  </p>
                ))}
              </div>

              <div className="row">
                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  Back
                </button>
                <button className="primary" onClick={advance} disabled={atEnd && seen.has(id)}>
                  {atEnd ? (seen.has(id) ? "Read" : "Mark as read") : "Next step"}
                </button>
                <span className="muted small">
                  Step {step + 1} of {walk.steps.length}
                </span>
              </div>
            </>
          )}

        </article>
      </div>
      <BuildStamp />
    </div>
  );
}
