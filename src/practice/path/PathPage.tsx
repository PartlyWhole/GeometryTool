// The path: Module 3's units as a winding column of lessons, each unlocked
// by the one before, with a checkpoint closing each unit.
import React, { useState } from "react";
import { useHold } from "./hold";
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
  pathKeys,
  relock,
  unlockThrough,
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
  const [skipAsk, setSkipAsk] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [askAll, setAskAll] = useState(false);
  const bind = useHold();
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
        onUnlock={(lessonId) => update(unlockThrough(p, UNITS, lessonId))}
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
  const lockedCount = UNITS.filter((u) => u.ready).reduce(
    (n, u) => n + u.lessons.filter((_, i) => !lessonOpen(p, UNITS, u, i)).length + (u.checkpoint && !checkpointOpen(p, UNITS, u) ? 1 : 0),
    0,
  );

  /**
   * A place on the path: a tap opens it when it is open. On a locked one, a
   * tap says it is locked, and pressing and holding (or right-clicking)
   * offers to skip ahead to it.
   */
  const hold = (key: string, open: boolean, start: () => void) =>
    bind({
      locked: !open,
      title: "Locked. Press and hold to skip ahead.",
      onTap: () => (open ? start() : setTip(key)),
      onHold: () => {
        setTip(null);
        setSkipAsk(key);
      },
    });

  const skipPrompt = (key: string, name: string) =>
    skipAsk === key ? (
      <div className="path-skip" role="dialog" aria-label={"Skip ahead to " + name}>
        <p>
          Skip ahead to {name}? It opens this and everything before it. What you skip stays unfinished, and you can go back to it any time.
        </p>
        <div className="row">
          <button
            className="primary"
            onClick={() => {
              update(unlockThrough(p, UNITS, key));
              setSkipAsk(null);
            }}
          >
            Skip ahead
          </button>
          <button onClick={() => setSkipAsk(null)}>Cancel</button>
        </div>
      </div>
    ) : tip === key ? (
      <span className="path-tip" role="status">Locked — finish the lesson before it first.</span>
    ) : null;
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

      <div className="path-practice">
        <div>
          <strong>Endless practice</strong>
          <span className="muted">
            {!learned.size
              ? "Practise anything you have learned — once there is something"
              : due
                ? due + " idea" + (due > 1 ? "s" : "") + " due for review"
                : "Nothing due — practise anything you have learned"}
          </span>
        </div>
        <button className={learned.size ? "primary" : ""} onClick={() => setRunning({ kind: "setup" })}>
          ∞ Practise
        </button>
      </div>

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
                      aria-disabled={!avail}
                      {...hold(l.id, avail, () => startLesson(u, l))}
                      aria-label={l.id + " " + l.title + (done ? ", done" : avail ? "" : ", locked")}
                    >
                      <span aria-hidden="true">{done ? "✓" : avail ? (l.optional ? "✎" : "★") : "🔒"}</span>
                    </button>
                    <span className="path-node-label">
                      <b>{l.id}</b> {l.title}
                      {l.optional && <em className="path-optional">Optional</em>}
                      {here && <em className="path-start">Start</em>}
                    </span>
                    {skipPrompt(l.id, l.id + " " + l.title)}
                  </li>
                );
              })}
              {u.checkpoint && (() => {
                const key = "cp-" + u.id;
                const open = checkpointOpen(p, UNITS, u);
                return (
                  <li style={{ transform: `translateX(${OFFSETS[k++ % OFFSETS.length]}px)` }}>
                    <button
                      className={"path-node checkpoint" + (p.passed[u.id] ? " done" : open ? " open" + (u === current ? " here" : "") : " locked")}
                      aria-disabled={!open}
                      {...hold(key, open, () => {
                        // A checkpoint covers any earlier unit without one of its own.
                        const covered = [...UNITS.filter((x) => u.covers?.includes(x.id)), u];
                        startCheckpoint(covered, "Unit " + u.n + " checkpoint", covered);
                      })}
                      aria-label={"Unit " + u.n + " checkpoint" + (open ? "" : ", locked")}
                    >
                      <span aria-hidden="true">🏆</span>
                    </button>
                    <span className="path-node-label">
                      <b>Checkpoint</b> {Math.round(PASS_MARK * 100)}% to pass
                    </span>
                    {skipPrompt(key, "the Unit " + u.n + " checkpoint")}
                  </li>
                );
              })()}
            </ol>
          </section>
        );
      })}

      {/* Out of the way on purpose: the path is meant to be walked in order. */}
      <footer className="path-foot">
        {lockedCount > 0 &&
          (askAll ? (
            <span>
              Open all {lockedCount} locked lessons and checkpoints?{" "}
              <button
                className="link"
                onClick={() => {
                  const keys = pathKeys(UNITS);
                  update(unlockThrough(p, UNITS, keys[keys.length - 1]));
                  setAskAll(false);
                }}
              >
                Unlock all
              </button>{" "}
              <button className="link" onClick={() => setAskAll(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <button className="link" onClick={() => setAskAll(true)}>
              Unlock every lesson
            </button>
          ))}
        {Object.keys(p.unlocked ?? {}).length > 0 && (
          <button className="link" onClick={() => update(relock(p))}>
            Lock skipped lessons again
          </button>
        )}
      </footer>
    </div>
  );
}
