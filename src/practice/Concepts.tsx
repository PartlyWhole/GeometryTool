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
import { CONCEPTS3 } from "./content/concepts3";
import { LIBRARY } from "./content/library";
import { WALKTHROUGHS } from "./content/walkthroughs";
import { BuildStamp, type Module } from "./ui";

type Section = { label: string; match: (c: Concept) => boolean };

const SECTIONS3: Section[] = [
  { label: "Transversals", match: (c) => c.section === "Transversals" },
  { label: "Parallel lines", match: (c) => c.section === "Parallel lines" },
  { label: "Proof", match: (c) => c.section === "Proof" },
];

const SECTIONS: Section[] = [
  { label: "Points and lines", match: (c) => c.section === "§5" },
  { label: "Segments", match: (c) => c.section === "§6" },
  { label: "Angles", match: (c) => c.section === "§8" },
  { label: "Properties of equality", match: (c) => c.section === "§4" },
  { label: "The five theorems", match: (c) => c.section === "§9" },
  { label: "Reasoning and proof", match: (c) => c.section === "§2" || c.section === "§3" },
];

export function Concepts(props: { module?: Module }) {
  const bank = props.module === 3 ? CONCEPTS3 : CONCEPTS;
  const sections = props.module === 3 ? SECTIONS3 : SECTIONS;
  const [id, setId] = useState(bank[0].id);
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const concept = bank.find((c) => c.id === id)!;
  const walk = WALKTHROUGHS.find((w) => w.conceptId === id);

  const choose = (next: string) => {
    setId(next);
    setStep(0);
  };

  // A step keeps the figure of the step before it unless it names its own,
  // and keeps that step's highlights too: a sentence that makes no new claim
  // about the figure should leave the eye where it was, not blank the figure
  // out. Changing the figure clears them, since they described the old one.
  const { board, marks } = useMemo(() => {
    if (!walk) return { board: undefined, marks: [] as Highlight[] };
    let figure: string | undefined;
    let held: Highlight[] = [];
    for (let i = 0; i <= step && i < walk.steps.length; i++) {
      const s = walk.steps[i];
      if (s.figure && s.figure !== figure) {
        figure = s.figure;
        held = [];
      }
      if (s.marks?.length) held = s.marks as Highlight[];
    }
    return { board: figure ? LIBRARY[figure]() : undefined, marks: held };
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
            {props.module === 3
              ? "Two lines cut by a transversal: the names for the angle pairs, and what parallel lines make of them."
              : "Every idea in the module, laid out a step at a time."}{" "}
            Work through a concept here, then drill it in Practice.
          </p>
        </div>
      </header>

      <div className="concepts-body">
        <nav className="concept-list" aria-label="Concepts">
          {sections.map((section) => {
            const members = bank.filter(section.match);
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
              {/* A step with neither a figure nor a line of algebra shows
                  nothing here rather than an empty box. */}
              {(board || walk.steps[step].show) && (
                <div className="concept-stage">
                  {board && (
                    <Figure
                      board={board}
                      highlights={marks}
                      height={330}
                      ariaLabel={walk.steps[step].text}
                    />
                  )}
                  {walk.steps[step].show && (
                    <p className="concept-show">
                      {statementText(walk.steps[step].show!)}
                    </p>
                  )}
                </div>
              )}

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
