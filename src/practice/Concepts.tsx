// The Concepts page: each concept explained in steps, with the figure
// building up as you go — and the concepts themselves told in the order of
// content/story.ts, each opening on why it comes next and closing on what it
// hands to the one after.
//
// Practice tests what you know and Cards drill it; this is where the idea is
// laid out in the first place. A step may change the figure, move the
// highlight on the figure already there, or put up a line of algebra.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Figure, type Highlight } from "./Figure";
import { statementText } from "./notation";
import { CONCEPTS, type Concept } from "./content/concepts";
import { CONCEPTS3 } from "./content/concepts3";
import { LIBRARY } from "./content/library";
import { WALKTHROUGHS, walkState } from "./content/walkthroughs";
import { CHAPTERS, ECHOES, NEEDS, placeOf, type Chapter } from "./content/story";
import { BuildStamp, SHOWN_MODULES, type Module } from "./ui";

/** Chapters are numbered across the modules on show, so Module 3 alone runs 1–7. */
const SHOWN_CHAPTERS = CHAPTERS.filter((c) => SHOWN_MODULES.includes(c.module));
const chapterNumber = (c: Chapter) => SHOWN_CHAPTERS.indexOf(c) + 1;

/** Every concept in both modules: a Module 3 concept can build on Module 2's. */
const ALL: Concept[] = [...CONCEPTS, ...CONCEPTS3];
const conceptOf = (id: string) => ALL.find((c) => c.id === id)!;
const moduleOf = (id: string): Module => (conceptOf(id).module === 3 ? 3 : 2);

export function Concepts(props: { module?: Module; onModule?: (m: Module) => void }) {
  const module: Module = props.module === 3 ? 3 : 2;
  const chapters = CHAPTERS.filter((c) => c.module === module);
  const [id, setId] = useState(chapters[0].stops[0].conceptId);
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  // Following a "builds on" link from Module 3 back into Module 2 is a
  // detour, so the page remembers where to come back to.
  const [detourFrom, setDetourFrom] = useState<string | null>(null);

  // "Continue" walks down the list; keep the concept being read in view there.
  const listRef = useRef<HTMLElement>(null);
  useEffect(() => {
    listRef.current
      ?.querySelector(".concept-link.active")
      ?.scrollIntoView?.({ block: "nearest" });
  }, [id]);

  const concept = conceptOf(id);
  const place = placeOf(id)!;
  const walk = WALKTHROUGHS.find((w) => w.conceptId === id);

  const choose = (next: string, detour = false) => {
    setDetourFrom(detour ? (detourFrom ?? id) : null);
    setId(next);
    setStep(0);
  };

  // A step keeps the figure of the step before it unless it names its own,
  // and keeps that step's highlights too: a sentence that makes no new claim
  // about the figure should leave the eye where it was, not blank the figure
  // out. Changing the figure clears them, since they described the old one.
  const { board, marks } = useMemo(() => {
    if (!walk) return { board: undefined, marks: [] as Highlight[] };
    const { figure, marks: held } = walkState(walk, step);
    return { board: figure ? LIBRARY[figure]() : undefined, marks: held as Highlight[] };
  }, [walk, step]);

  const last = (walk?.steps.length ?? 1) - 1;
  const atEnd = step >= last;
  const opensChapter = place.index === 0;
  const closesChapter = place.index === place.chapter.stops.length - 1;
  const away = moduleOf(id) !== module;

  const advance = () => {
    if (atEnd) setSeen((s) => new Set(s).add(id));
    else setStep(step + 1);
  };

  const links = (all: string[], label: string) => {
    // A link into a module that is not on show would lead somewhere the
    // student cannot otherwise reach.
    const ids = all.filter((n) => SHOWN_MODULES.includes(moduleOf(n)));
    return ids.length > 0 && (
      <div className="concept-links">
        <span className="concept-links-label">{label}</span>
        {ids.map((n) => (
          <button
            key={n}
            className="chip"
            onClick={() => choose(n, moduleOf(n) !== module)}
            title={placeOf(n)?.stop.bridge}
          >
            {conceptOf(n).term}
            {moduleOf(n) !== moduleOf(id) && (
              <span className="concept-links-module">Module {moduleOf(n)}</span>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="page concepts">
      <header className="page-head">
        <div>
          <h1>Concepts</h1>
          <p className="muted">
            {module === 3
              ? "Parallel and perpendicular lines, one idea at a time, each built from the ones before it. Work through a concept here, then drill it in Practice."
              : "One idea at a time, each built from the ones before it. Work through a concept here, then drill it in Practice."}
          </p>
        </div>
      </header>

      <div className="concepts-body">
        <nav className="concept-list" aria-label="Chapters and concepts" ref={listRef}>
          {chapters.map((ch) => (
            <div key={ch.id} className="concept-group">
              <h2>
                <span className="concept-chapter-n">Chapter {chapterNumber(ch)}</span>
                {ch.title}
              </h2>
              {ch.stops.map((s) => {
                const c = conceptOf(s.conceptId);
                return (
                  <button
                    key={c.id}
                    className={"concept-link" + (c.id === id ? " active" : "")}
                    aria-current={c.id === id ? "true" : undefined}
                    onClick={() => choose(c.id)}
                  >
                    <span>{c.term}</span>
                    {seen.has(c.id) && <span className="concept-done" aria-label="read">✓</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <article className="concept-main">
          {detourFrom && (
            <button className="link concept-detour" onClick={() => choose(detourFrom)}>
              ← Back to {conceptOf(detourFrom).term}
            </button>
          )}

          {/* A chapter opens on the question it exists to answer. */}
          {opensChapter && (
            <div className="concept-chapter">
              <span className="concept-chapter-n">
                {away ? "Module " + moduleOf(id) + " · " : ""}Chapter {chapterNumber(place.chapter)}
              </span>
              <h2>{place.chapter.title}</h2>
              <p>{place.chapter.question}</p>
            </div>
          )}

          <div className="concept-head">
            <span className="card-kind">
              {concept.kind} · {away && "Module " + moduleOf(id) + ", "}
              {!opensChapter && "Chapter " + chapterNumber(place.chapter) + ", "}
              {place.chapter.title}
            </span>
            <h2>{concept.term}</h2>
            <p className="concept-def">{concept.definition}</p>
          </div>

          {/* Why this idea, and why now: said from what came before. */}
          <p className="concept-bridge">{place.stop.bridge}</p>
          {links(NEEDS[id] ?? [], "Builds on")}
          {links(ECHOES[id] ?? [], "The same idea as")}

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

          {/* The hand-off. At the end of a concept the story says what comes
              next and why; at the end of a chapter it first says what the
              chapter has earned and what it still cannot do. */}
          {atEnd && !away && (
            <section className="concept-next" aria-label="What comes next">
              {closesChapter && (
                <p className="concept-close">
                  <strong>End of chapter {chapterNumber(place.chapter)}.</strong>{" "}
                  {place.chapter.close}
                </p>
              )}
              {place.next ? (
                <>
                  <span className="concept-chapter-n">
                    Next
                    {place.next.chapter !== place.chapter &&
                      " · Chapter " + chapterNumber(place.next.chapter) + ": " + place.next.chapter.title}
                  </span>
                  <h3>{conceptOf(place.next.stop.conceptId).term}</h3>
                  <p>
                    {place.next.chapter !== place.chapter
                      ? place.next.chapter.question
                      : place.next.stop.bridge}
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      setSeen((s) => new Set(s).add(id));
                      choose(place.next!.stop.conceptId);
                    }}
                  >
                    Continue
                  </button>
                </>
              ) : module === 2 && props.onModule ? (
                <>
                  <span className="concept-chapter-n">Next · Module 3</span>
                  <h3>One line across two</h3>
                  <p>{CHAPTERS.find((c) => c.module === 3)!.question}</p>
                  <button className="primary" onClick={() => props.onModule!(3)}>
                    Continue to Module 3
                  </button>
                </>
              ) : (
                <p className="muted">That is the end of the story so far.</p>
              )}
            </section>
          )}
        </article>
      </div>
      <BuildStamp />
    </div>
  );
}
