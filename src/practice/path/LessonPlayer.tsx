// A lesson or checkpoint, start to finish: the new ideas, then the questions,
// then how it went.
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

export type Outcome = { correct: number; total: number; answers: { concepts: string[]; correct: boolean }[] };

export function LessonPlayer(props: {
  title: string;
  learn: string[];
  slots: Slot[];
  checkpoint?: boolean;
  /** A fresh question from the same maker, for a miss to come back as. */
  retry: (s: Slot) => Slot;
  onExit: (o: Outcome | null) => void;
}) {
  const [learnAt, setLearnAt] = useState(0);
  const [queue, setQueue] = useState<Slot[]>(props.slots);
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Outcome["answers"]>([]);
  const [firstTry, setFirstTry] = useState({ correct: 0, total: props.slots.length });
  const [retried, setRetried] = useState<Set<number>>(new Set());
  const learning = learnAt < props.learn.length;
  const finished = !learning && at >= queue.length;

  const answered = (ok: boolean) => {
    const slot = queue[at];
    setAnswers((a) => [...a, { concepts: slot.maker.concepts, correct: ok }]);
    if (slot.phase !== "retry") setFirstTry((f) => ({ ...f, correct: f.correct + (ok ? 1 : 0) }));
    // A miss comes back before the lesson ends — once per question, and not
    // in a checkpoint, where the score is the point.
    if (!ok && !props.checkpoint && slot.phase !== "retry" && !retried.has(at)) {
      setRetried((s) => new Set(s).add(at));
      setQueue((q) => [...q, props.retry(slot)]);
    }
  };

  const outcome: Outcome = { correct: firstTry.correct, total: firstTry.total, answers };
  const passed = !props.checkpoint || firstTry.correct / firstTry.total >= PASS_MARK;
  const progress = learning ? 0 : Math.min(1, at / queue.length);

  return (
    <div className="page lesson">
      <div className="lesson-top">
        <button className="lesson-close" onClick={() => props.onExit(null)} aria-label="Leave the lesson">×</button>
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
      ) : finished ? (
        <div className="pq lesson-done">
          <span className="pq-tag">{props.checkpoint ? "Checkpoint" : "Lesson complete"}</span>
          <h2 className="pq-prompt">
            {props.checkpoint ? (passed ? "Passed" : "Not yet") : "Well done"}
          </h2>
          <p className="lesson-score">
            {firstTry.correct} of {firstTry.total} right first time
            {props.checkpoint && ` — ${Math.round(PASS_MARK * 100)}% passes`}
          </p>
          {props.checkpoint && !passed && (
            <p className="muted">Go back over the lessons in this unit, then try the checkpoint again.</p>
          )}
          <div className="pq-bar">
            <button className="primary" onClick={() => props.onExit(outcome)}>Continue</button>
          </div>
        </div>
      ) : (
        <>
          {queue[at].phase === "review" && <span className="pq-tag review">Review</span>}
          {queue[at].phase === "retry" && <span className="pq-tag retry">One more try</span>}
          <QuestionView key={at} q={queue[at].q} onAnswered={answered} onContinue={() => setAt(at + 1)} />
        </>
      )}
    </div>
  );
}
