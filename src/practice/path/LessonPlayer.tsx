// A lesson or checkpoint, start to finish: the new ideas, then the questions,
// then how it went. Any answered question can be gone back to and read
// again; its answer stays as it was checked.
import React, { useMemo, useState } from "react";
import { Figure, type Highlight } from "../Figure";
import { statementText } from "../notation";
import { CONCEPTS3 } from "../content/concepts3";
import { LIBRARY } from "../content/library";
import { WALKTHROUGHS, walkState } from "../content/walkthroughs";
import type { Slot } from "./session";
import { PASS_MARK } from "./session";
import { QuestionView } from "./QuestionView";

/** One concept's walkthrough, a step at a time, ending on "Continue". */
function Learn(props: { conceptId: string; onDone: () => void; last: boolean }) {
  const concept = CONCEPTS3.find((c) => c.id === props.conceptId)!;
  const walk = WALKTHROUGHS.find((w) => w.conceptId === props.conceptId)!;
  const [step, setStep] = useState(0);
  const { figure, marks } = walkState(walk, step);
  const board = useMemo(() => (figure ? LIBRARY[figure]() : undefined), [figure]);
  const s = walk.steps[step];
  const atEnd = step === walk.steps.length - 1;
  return (
    <div className="pq learn">
      <span className="pq-tag">New idea</span>
      <h2 className="pq-prompt">{concept.term}</h2>
      <p className="concept-def">{concept.definition}</p>
      {board && <Figure board={board} height={280} highlights={marks as Highlight[]} ariaLabel={s.text} />}
      {s.show && <p className="concept-show">{statementText(s.show)}</p>}
      <p className="learn-step">{s.text}</p>
      <div className="learn-dots" aria-hidden="true">
        {walk.steps.map((_, n) => (
          <span key={n} className={n === step ? "on" : n < step ? "past" : ""} />
        ))}
      </div>
      <div className="pq-bar">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</button>
        <button className="primary" onClick={() => (atEnd ? props.onDone() : setStep(step + 1))}>
          {atEnd ? (props.last ? "Start practising" : "Next idea") : "Continue"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A run of questions that can be walked back through
// ---------------------------------------------------------------------------

/**
 * Where the student is in a run: the question on screen, the furthest one
 * reached, and how each answered one went.
 */
export function useStack() {
  const [view, setView] = useState(0);
  const [reached, setReached] = useState(0);
  const [results, setResults] = useState<(boolean | undefined)[]>([]);
  return {
    view,
    reached,
    results,
    go: (i: number) => setView(Math.max(0, Math.min(i, reached))),
    answer: (i: number, ok: boolean) =>
      setResults((r) => {
        const next = r.slice();
        next[i] = ok;
        return next;
      }),
    advance: (i: number) => {
      setView(i + 1);
      setReached((x) => Math.max(x, i + 1));
    },
  };
}
export type Stack = ReturnType<typeof useStack>;

/** Back and forward through the questions already reached. */
export function StackNav(props: { stack: Stack; last: number }) {
  const { stack } = props;
  return (
    <span className="lesson-nav">
      <button onClick={() => stack.go(stack.view - 1)} disabled={stack.view === 0} aria-label="Previous question" title="Previous question">
        ‹
      </button>
      <button
        onClick={() => stack.go(stack.view + 1)}
        disabled={stack.view >= Math.min(stack.reached, props.last)}
        aria-label="Next question"
        title="Next question"
      >
        ›
      </button>
    </span>
  );
}

/**
 * Every question reached stays mounted, hidden unless on screen, so going
 * back finds it exactly as it was answered.
 */
export function StackView(props: { slots: Slot[]; stack: Stack; onAnswered?: (i: number, ok: boolean) => void }) {
  const { slots, stack } = props;
  const shown = slots.slice(0, Math.min(stack.reached + 1, slots.length));
  return (
    <>
      {shown.map((s, i) => (
        <div key={i} hidden={i !== stack.view}>
          {i < stack.reached && stack.results[i] !== undefined && <span className="pq-tag past">Question {i + 1} · answered</span>}
          {s.phase === "review" && <span className="pq-tag review">Review</span>}
          <QuestionView
            q={s.q}
            onAnswered={(ok) => {
              stack.answer(i, ok);
              props.onAnswered?.(i, ok);
            }}
            onContinue={() => stack.advance(i)}
          />
        </div>
      ))}
    </>
  );
}

/** Each answered question of a run, marked, and a way back into it. */
export function RunReview(props: { slots: Slot[]; stack: Stack; onPick?: () => void }) {
  return (
    <ol className="run-review" aria-label="Your answers">
      {props.slots.map((s, i) =>
        props.stack.results[i] === undefined ? null : (
          <li key={i}>
            <button
              onClick={() => {
                props.stack.go(i);
                props.onPick?.();
              }}
            >
              <span className={props.stack.results[i] ? "mark ok" : "mark bad"} aria-label={props.stack.results[i] ? "right" : "wrong"}>
                {props.stack.results[i] ? "✓" : "✗"}
              </span>
              <span className="run-review-prompt">{s.q.prompt}</span>
            </button>
          </li>
        ),
      )}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// A lesson or a checkpoint
// ---------------------------------------------------------------------------

export type Outcome = { correct: number; total: number; answers: { concepts: string[]; correct: boolean }[] };

export function LessonPlayer(props: {
  title: string;
  learn: string[];
  slots: Slot[];
  checkpoint?: boolean;
  onExit: (o: Outcome | null) => void;
}) {
  const [learnAt, setLearnAt] = useState(0);
  const stack = useStack();
  const { slots } = props;
  const learning = learnAt < props.learn.length;
  const finished = !learning && stack.view >= slots.length;

  const correct = stack.results.filter(Boolean).length;
  const outcome: Outcome = {
    correct,
    total: slots.length,
    answers: slots.flatMap((s, i) => (stack.results[i] === undefined ? [] : [{ concepts: s.maker.concepts, correct: !!stack.results[i] }])),
  };
  const passed = !props.checkpoint || correct / slots.length >= PASS_MARK;
  const answered = stack.results.filter((x) => x !== undefined).length;
  const progress = learning ? 0 : answered / slots.length;
  const onScreen = !learning && !finished ? slots[stack.view] : undefined;

  return (
    <div className={"page lesson" + (onScreen?.q.kind === "proof" ? " wide" : "")}>
      <div className="lesson-top">
        <button className="lesson-close" onClick={() => props.onExit(null)} aria-label="Leave the lesson">×</button>
        {!learning && <StackNav stack={stack} last={slots.length} />}
        <div className="lesson-progress" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: progress * 100 + "%" }} />
        </div>
        <span className="lesson-title">{props.title}</span>
      </div>

      {learning ? (
        <Learn
          key={props.learn[learnAt]}
          conceptId={props.learn[learnAt]}
          last={learnAt === props.learn.length - 1}
          onDone={() => setLearnAt(learnAt + 1)}
        />
      ) : (
        <>
          <StackView slots={slots} stack={stack} />
          {finished && (
            <div className="pq lesson-done">
              <span className="pq-tag">{props.checkpoint ? "Checkpoint" : "Lesson complete"}</span>
              <h2 className="pq-prompt">{props.checkpoint ? (passed ? "Passed" : "Not yet") : "Well done"}</h2>
              <p className="lesson-score">
                {correct} of {slots.length} right
                {props.checkpoint && ` — ${Math.round(PASS_MARK * 100)}% passes`}
              </p>
              {props.checkpoint && !passed && (
                <p className="muted">Go back over the lessons in this unit, then try the checkpoint again.</p>
              )}
              {!props.checkpoint && correct < slots.length && (
                <p className="muted">What you missed comes back in review, and in endless practice.</p>
              )}
              <RunReview slots={slots} stack={stack} />
              <div className="pq-bar">
                <button className="primary" onClick={() => props.onExit(outcome)}>Continue</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
