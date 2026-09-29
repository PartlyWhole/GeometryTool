// The path: Module 3's units as a winding column of lessons, each unlocked
// by the one before, with a checkpoint closing each unit.
import React, { useState } from "react";
import { type Lesson, type Unit, UNITS } from "./path";
import {
  type Progress,
  checkpointOpen,
  currentStreak,
  finishLesson,
  lessonOpen,
  loadProgress,
  passUnits,
  recordAnswer,
  saveProgress,
  isDue,
  loadChosen,
  practiceAnswer,
  saveChosen,
  unitComplete,
  unitOpen,
} from "./progress";
import { type Slot, PASS_MARK, buildCheckpoint, buildLesson, learnedConcepts, rng } from "./session";
import { LessonPlayer, type Outcome } from "./LessonPlayer";
import { EndlessPlayer, EndlessSetup } from "./Endless";

type Running =
  | { kind: "lesson"; unit: Unit; lesson: Lesson; slots: Slot[] }
  | { kind: "checkpoint"; units: Unit[]; slots: Slot[]; title: string; passes: Unit[] }
  | { kind: "setup" }
  | { kind: "endless"; chosen: string[] };

/** The lessons before this one, across every unit, for review to draw on. */
function earlierThan(lesson: Lesson): Lesson[] {
  const all = UNITS.flatMap((u) => u.lessons);
  return all.slice(0, all.indexOf(lesson));
}

/** Zigzag the circles, as Duolingo's path does. */
const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46];

export function PathPage() {
  const [p, setP] = useState<Progress>(loadProgress);
  const [running, setRunning] = useState<Running | null>(null);
  const seed = () => rng(Math.floor(Math.random() * 1e9));

  const update = (next: Progress) => {
    setP(next);
    saveProgress(next);
  };

  const startLesson = (unit: Unit, lesson: Lesson) =>
    setRunning({ kind: "lesson", unit, lesson, slots: buildLesson(lesson, earlierThan(lesson), p, seed()) });

  const startCheckpoint = (units: Unit[], title: string, passes: Unit[]) =>
    setRunning({ kind: "checkpoint", units, slots: buildCheckpoint(units, seed()), title, passes });

  const exit = (o: Outcome | null) => {
    const r = running!;
    setRunning(null);
    if (r.kind !== "lesson" && r.kind !== "checkpoint") return;
    if (!o) return;
    let next = p;
    for (const a of o.answers) next = recordAnswer(next, a.concepts, a.correct);
    if (r.kind === "lesson") next = finishLesson(next, r.lesson.id, 10 + 2 * o.correct);
    else if (o.correct / o.total >= PASS_MARK) {
      next = passUnits(next, r.passes);
      next = finishLesson(next, "checkpoint-" + r.passes.map((u) => u.id).join("-"), 20 + 2 * o.correct);
    }
    update(next);
  };

  if (running?.kind === "setup")
    return (
      <EndlessSetup
        units={UNITS}
        progress={p}
        initial={loadChosen()}
        onBack={() => setRunning(null)}
        onStart={(chosen) => {
          saveChosen(chosen);
          setRunning({ kind: "endless", chosen });
        }}
      />
    );

  if (running?.kind === "endless")
    return (
      <EndlessPlayer
        units={UNITS}
        progress={p}
        chosen={running.chosen}
        // Kept as each answer comes in: stopping part-way loses nothing.
        onAnswer={(concepts, ok) =>
          setP((cur) => {
            const next = practiceAnswer(cur, concepts, ok);
            saveProgress(next);
            return next;
          })
        }
        onExit={() => setRunning(null)}
      />
    );

  if (running)
    return (
      <LessonPlayer
        title={running.kind === "lesson" ? running.lesson.id + " · " + running.lesson.title : running.title}
        learn={running.kind === "lesson" && !p.done[running.lesson.id] ? running.lesson.learn : []}
        slots={running.slots}
        checkpoint={running.kind === "checkpoint"}
        onExit={exit}
      />
    );

  // The first unit not yet complete is where the student is.
  const current = UNITS.find((u) => !unitComplete(p, u));
  const learned = learnedConcepts(UNITS, p);
  const due = [...learned].filter((c) => isDue(p, c)).length;
  let k = 0;

  return (
    <div className="page path">
      <header className="path-head">
        <div>
          <h1>Parallel and perpendicular lines</h1>
          <p className="muted">One idea at a time. Each lesson opens the next.</p>
        </div>
        <div className="path-stats" aria-label="Progress">
          <span title="Days in a row">🔥 {currentStreak(p)}</span>
          <span title="Experience">⭐ {p.xp} XP</span>
        </div>
      </header>

      {learned.size > 0 && (
        <div className="path-practice">
          <div>
            <strong>Endless practice</strong>
            <span className="muted">
              {due ? due + " idea" + (due > 1 ? "s" : "") + " due for review" : "Nothing due — practise anything you have learned"}
            </span>
          </div>
          <button className="primary" onClick={() => setRunning({ kind: "setup" })}>
            ∞ Practise
          </button>
        </div>
      )}

      {UNITS.map((u, ui) => {
        const open = unitOpen(p, UNITS, u);
        const complete = unitComplete(p, u);
        const before = UNITS.slice(0, ui);
        // Testing out skips every earlier unit, when all of them can be played.
        const canTestOut = !open && u.ready && before.every((b) => b.ready) && before.some((b) => !unitComplete(p, b));
        return (
          <section key={u.id} className={"path-unit" + (open ? "" : " locked") + (complete ? " complete" : "")}>
            <div className="path-banner">
              <span className="path-unit-n">Unit {u.n}</span>
              <h2>{u.title}</h2>
              <p>{u.question}</p>
              {!u.ready && <span className="path-soon">Coming next</span>}
              {canTestOut && (
                <button
                  className="path-testout"
                  onClick={() => startCheckpoint(before, "Test out to Unit " + u.n, before)}
                >
                  Test out to here
                </button>
              )}
            </div>

            <ol className="path-nodes">
              {u.lessons.map((l, li) => {
                const done = !!p.done[l.id];
                const avail = lessonOpen(p, UNITS, u, li);
                const here = avail && !done && !l.optional && u === current;
                const off = OFFSETS[k++ % OFFSETS.length];
                return (
                  <li key={l.id} style={{ transform: `translateX(${off}px)` }}>
                    <button
                      className={"path-node" + (done ? " done" : avail ? " open" : " locked") + (here ? " here" : "") + (l.optional ? " optional" : "")}
                      disabled={!avail}
                      onClick={() => startLesson(u, l)}
                      aria-label={l.id + " " + l.title + (done ? ", done" : avail ? "" : ", locked")}
                    >
                      <span aria-hidden="true">{done ? "✓" : avail ? (l.optional ? "✎" : "★") : "🔒"}</span>
                    </button>
                    <span className="path-node-label">
                      <b>{l.id}</b> {l.title}
                      {l.optional && <em className="path-optional">Optional</em>}
                      {here && <em className="path-start">Start</em>}
                    </span>
                  </li>
                );
              })}
              {u.checkpoint && (
                <li style={{ transform: `translateX(${OFFSETS[k++ % OFFSETS.length]}px)` }}>
                  <button
                    className={"path-node checkpoint" + (p.passed[u.id] ? " done" : checkpointOpen(p, UNITS, u) ? " open here" : " locked")}
                    disabled={!checkpointOpen(p, UNITS, u)}
                    onClick={() => {
                      // A checkpoint covers any earlier unit without one of its own.
                      const covered = [...UNITS.filter((x) => u.covers?.includes(x.id)), u];
                      startCheckpoint(covered, "Unit " + u.n + " checkpoint", covered);
                    }}
                    aria-label={"Unit " + u.n + " checkpoint"}
                  >
                    <span aria-hidden="true">🏆</span>
                  </button>
                  <span className="path-node-label">
                    <b>Checkpoint</b> {Math.round(PASS_MARK * 100)}% to pass
                  </span>
                </li>
              )}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
