// Exercise 4: building a two-column proof, every line checked.
import React, { useMemo, useState } from "react";
import { Figure, type Highlight } from "./Figure";
import {
  StatementBuilder,
  type Draft,
  buildStatement,
  insertObject,
  newDraft,
  wants,
} from "./StatementBuilder";
import { PickableFigure } from "./PickableFigure";
import { statementText } from "./notation";
import { KIND_LABEL, type ReasonKind, reasonById, reasonsFor } from "./reasons";
import {
  type ProofLine,
  type ProofProblem,
  reachedGoal,
  unusedLines,
  validateLine,
} from "./proof";
import { PROOFS } from "./content/proofs";
import { generatedProofs } from "./content/generators";
import { statementObjects } from "./terms";
import { dots, useDeck } from "./deck";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Hints, ItemNav, Scoreboard, Tabs, Verdict } from "./ui";
import { ReasonCheckMode } from "./SelectAllExercise";
import { StepExercise } from "./StepExercise";
import { FlowExercise } from "./FlowExercise";
import { PROOFS3 } from "./content/items3";

const KIND_ORDER: ReasonKind[] = [
  "given",
  "definition",
  "postulate",
  "theorem",
  "property",
  "algebra",
];

export function ProofExercise(props: { module?: 2 | 3 }) {
  const m3 = props.module === 3;
  const [tab, setTab] = useState<"step" | "reasons" | "flow" | "build">("step");
  return (
    <>
      <div className="proof-tabs">
        <Tabs
          label="Proof task"
          value={tab}
          onChange={setTab}
          options={[
            { id: "step", label: "One step", hint: "A single line: what justifies it?" },
            { id: "reasons", label: "Check the reasons", hint: "A finished proof, with some reasons wrong" },
            ...(m3
              ? [{ id: "flow" as const, label: "Flow proof", hint: "Boxes and arrows: fill in each reason" }]
              : []),
            { id: "build", label: "Build a proof", hint: "Write every line and justify it" },
          ]}
        />
      </div>
      {tab === "step" &&
        (m3 ? <StepExercise proofs={PROOFS3} tallyKey="steps-m3" /> : <StepExercise />)}
      {tab === "reasons" &&
        (m3 ? <ReasonCheckMode proofs={PROOFS3} tallyKey="reasoncheck-m3" /> : <ReasonCheckMode />)}
      {tab === "flow" && m3 && <FlowExercise />}
      {tab === "build" && <ProofBuilder module={m3 ? 3 : 2} />}
    </>
  );
}

/**
 * A proof in progress. Held outside the board so that leaving a proof and
 * coming back to it finds the lines you had already written: half a proof is
 * too much work to throw away for looking at the next one.
 */
type Work = {
  lines: ProofLine[];
  draft: Draft;
  reasonId: string;
  cites: string[];
  error: string | null;
  note: string | null;
  hintsShown: number;
  revealed: boolean;
  scored: boolean;
};
const blankWork = (): Work => ({
  lines: [],
  draft: newDraft("eq"),
  reasonId: "given",
  cites: [],
  error: null,
  note: null,
  hintsShown: 0,
  revealed: false,
  scored: false,
});

function ProofBuilder(props: { module: 2 | 3 }) {
  const [genSeed, setGenSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const problems = useMemo(
    () =>
      props.module === 3 ? PROOFS3 : [...PROOFS, ...generatedProofs(genSeed, 4)],
    [genSeed, props.module],
  );
  const deck = useDeck<Work>(problems.length, blankWork, {
    key: String(genSeed),
  });
  const problem = problems[deck.i];
  return (
    <ProofBoard
      problem={problem}
      problems={problems}
      module={props.module}
      index={deck.i}
      work={deck.state}
      setWork={deck.setState}
      onPick={deck.go}
      nav={
        <ItemNav
          i={deck.i}
          count={deck.count}
          onGo={deck.go}
          onBack={deck.back}
          onForward={deck.forward}
          noun="Proof"
          marks={dots(deck, (w, n) =>
            w.lines.length === 0
              ? null
              : reachedGoal(problems[n], w.lines)
                ? true
                : null,
          )}
        />
      }
      onMore={
        props.module === 3
          ? undefined
          : () => {
              setGenSeed(Math.floor(Math.random() * 1e9));
            }
      }
    />
  );
}

function ProofBoard(props: {
  problem: ProofProblem;
  problems: ProofProblem[];
  module: 2 | 3;
  index: number;
  work: Work;
  setWork: (next: Work | ((prev: Work) => Work)) => void;
  onPick: (i: number) => void;
  onMore?: () => void;
  nav: React.ReactNode;
}) {
  const { problem } = props;
  const { lines, draft, reasonId, cites, error, note, hintsShown, revealed, scored } =
    props.work;
  const set = (patch: Partial<Work>) =>
    props.setWork((w) => ({ ...w, ...patch }));
  const [tally, setTally] = useState<Tally>(() => loadTally("proof"));

  const built = buildStatement(draft);
  const done = reachedGoal(problem, lines);
  const loose = done ? unusedLines(problem, lines) : [];

  const reset = () =>
    set({ draft: newDraft(draft.form), cites: [], error: null });

  const addStep = () => {
    if (!built.ok) {
      set({ error: built.why });
      return;
    }
    const check = validateLine(problem, lines, {
      statement: built.statement,
      reasonId,
      cites,
    });
    if (!check.ok) {
      set({ error: check.why, note: null });
      return;
    }
    const next = [
      ...lines,
      { id: "L" + (lines.length + 1) + ":" + Date.now(), statement: built.statement, reasonId, cites },
    ];
    set({
      lines: next,
      note: check.note ?? null,
      draft: newDraft(draft.form),
      cites: [],
      error: null,
      scored: scored || reachedGoal(problem, next),
    });
    if (!scored && reachedGoal(problem, next)) {
      const t = record(tally, hintsShown === 0 && !revealed);
      setTally(t);
      saveTally("proof", t);
    }
  };

  const draftStatement = built.ok ? built.statement : undefined;
  const draftKey = draftStatement ? statementText(draftStatement) : "";
  const highlights: Highlight[] = useMemo(() => {
    const out: Highlight[] = [];
    const add = (s: Parameters<typeof statementObjects>[0], role: Highlight["role"]) => {
      for (const o of statementObjects(s)) out.push({ obj: o, role });
    };
    for (const g of problem.givens) add(g, "given");
    add(problem.goal, "prove");
    // The line being composed wins, so it is visible against given and prove.
    if (draftStatement) add(draftStatement, "shared");
    return out.reverse();
  }, [problem, draftKey]);

  const toggleCite = (id: string) =>
    props.setWork((w) => ({
      ...w,
      cites: w.cites.includes(id)
        ? w.cites.filter((x) => x !== id)
        : [...w.cites, id],
    }));

  const reason = reasonById(reasonId);
  // Forbidden reasons stay in the list. Deleting them taught nothing: the
  // student simply did not find what they were reaching for. Offered and then
  // refused, the validator gets to say why citing the thing you are proving is
  // circular, which is the lesson those problems exist for.
  const allowed = reasonsFor(props.module);

  return (
    <div className="exercise proof">
      <header className="exercise-head">
        <div>
          <h2>{problem.title}</h2>
          <p className="prompt">{problem.prompt}</p>
          <div className="tagrow">
            {problem.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
        <div className="head-right">
          {props.nav}
          <Scoreboard tally={tally} />
          <label className="picker">
            <span className="sr-only">Choose a proof</span>
            <select
              value={props.index}
              onChange={(e) => props.onPick(Number(e.target.value))}
            >
              {props.problems.map((p, i) => (
                <option key={p.id} value={i}>
                  {i + 1}. {p.title}
                </option>
              ))}
            </select>
          </label>
          {props.onMore && (
            <button onClick={props.onMore} title="Generate fresh solve-for-x proofs">
              New generated set
            </button>
          )}
        </div>
      </header>

      <div className="proof-body">
        <aside className="proof-left">
          {problem.figure &&
            (done ? (
              <Figure
                board={problem.figure}
                highlights={highlights}
                height={290}
                ariaLabel={"Figure for " + problem.title}
              />
            ) : (
              <PickableFigure
                board={problem.figure}
                highlights={highlights}
                height={290}
                ariaLabel={"Figure for " + problem.title}
                wants={wants(draft)}
                onInsert={(obj) => {
                  set({ draft: insertObject(draft, obj), error: null });
                }}
              />
            ))}
          <section className="givens">
            <h3>Given</h3>
            {problem.givens.length ? (
              <ul>
                {problem.givens.map((g, i) => (
                  <li key={i} className="role-given">{statementText(g)}</li>
                ))}
              </ul>
            ) : (
              <p className="muted small">
                Nothing is stated in words — read what you need from the figure.
              </p>
            )}
            <h3>Prove</h3>
            <p className="role-prove goal">{statementText(problem.goal)}</p>
          </section>
          <Hints
            hints={problem.hints}
            shown={hintsShown}
            onMore={() =>
              props.setWork((w) => ({ ...w, hintsShown: w.hintsShown + 1 }))
            }
          />
          <div className="legend">
            <span><i className="sw given" /> given</span>
            <span><i className="sw prove" /> prove</span>
            <span><i className="sw shared" /> the line you are writing</span>
          </div>
        </aside>

        <section className="proof-right">
          <table className="two-column">
            <thead>
              <tr><th className="num">#</th><th>Statements</th><th>Reasons</th></tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr
                  key={l.id}
                  className={cites.includes(l.id) ? "cited" : ""}
                >
                  <td className="num">
                    <button
                      className="citebtn"
                      aria-pressed={cites.includes(l.id)}
                      title="Cite this line"
                      onClick={() => toggleCite(l.id)}
                    >
                      {i + 1}
                    </button>
                  </td>
                  <td>{statementText(l.statement)}</td>
                  <td className="reason">
                    {reasonById(l.reasonId)?.name ?? l.reasonId}
                    {l.cites.length > 0 && (
                      <span className="cited-from">
                        {" "}({l.cites.map((c) => lines.findIndex((x) => x.id === c) + 1).join(", ")})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!lines.length && (
                <tr>
                  <td colSpan={3} className="muted empty-row">
                    Start by writing down a given, or something the figure shows.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {done ? (
            <div className="done">
              <Verdict ok title="Proved">
                You reached {statementText(problem.goal)} in {lines.length} steps.
                {loose.length > 0 &&
                  " " + loose.length + " line" + (loose.length === 1 ? "" : "s") +
                  " no later step used — a correct proof can still carry dead weight."}
              </Verdict>
              <div className="row">
                <button
                  className="primary"
                  onClick={() => props.onPick(Math.min(props.index + 1, props.problems.length - 1))}
                >
                  Next proof
                </button>
                <button
                  onClick={() =>
                    set({
                      lines: [],
                      scored: false,
                      draft: newDraft(draft.form),
                      cites: [],
                      error: null,
                      note: null,
                    })
                  }
                >
                  Prove it again
                </button>
              </div>
            </div>
          ) : (
            <div className="composer">
              <div className="composer-head">
                <h3>Next step</h3>
                <div className="composer-preview">
                  {built.ok ? statementText(built.statement) : <em>build a statement</em>}
                </div>
              </div>

              <StatementBuilder
                board={problem.figure}
                extraObjects={problem.objects}
                value={draft}
                onChange={(d) => set({ draft: d, error: null })}
                variables={["x", "y"]}
                module={props.module}
              />

              <div className="composer-reason">
                <label>
                  <span>Reason</span>
                  <select
                    value={reasonId}
                    onChange={(e) => set({ reasonId: e.target.value, error: null })}
                  >
                    {KIND_ORDER.map((k) => {
                      const rs = allowed.filter((r) => r.kind === k);
                      if (!rs.length) return null;
                      return (
                        <optgroup key={k} label={KIND_LABEL[k]}>
                          {rs.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </label>
                {reason && <p className="reason-help">{reason.short}</p>}
                <p className="cite-help">
                  {reason && reason.cites[1] === 0
                    ? "This reason cites no earlier lines."
                    : cites.length
                      ? "Citing line" + (cites.length > 1 ? "s " : " ") +
                        cites.map((c) => lines.findIndex((x) => x.id === c) + 1).join(", ")
                      : "Click a line number on the left of the table to cite it."}
                </p>
              </div>

              {error && (
                <p className="composer-error" role="alert">{error}</p>
              )}
              {note && !error && <p className="composer-note">{note}</p>}

              <div className="row">
                <button className="primary" onClick={addStep}>Add step</button>
                <button onClick={reset}>Clear step</button>
                <button
                  onClick={() =>
                    props.setWork((w) => ({ ...w, lines: w.lines.slice(0, -1) }))
                  }
                  disabled={!lines.length}
                >
                  Undo last line
                </button>
                <button
                  onClick={() =>
                    set({
                      lines: [],
                      draft: newDraft(draft.form),
                      cites: [],
                      error: null,
                      note: null,
                    })
                  }
                  disabled={!lines.length}
                >
                  Start over
                </button>
                {problem.solution && (
                  <button
                    className="link"
                    onClick={() =>
                      set({ revealed: true, hintsShown: problem.hints?.length ?? 0 })
                    }
                  >
                    Show a worked proof
                  </button>
                )}
              </div>

              {revealed && problem.solution && (
                <section className="worked">
                  <h4>One correct proof</h4>
                  <ol>
                    {problem.solution.map((s, i) => (
                      <li key={i}>
                        <span className="w-stmt">{statementText(s.statement)}</span>
                        <span className="w-reason">
                          {reasonById(s.reasonId)?.name}
                          {s.cites.length ? " (" + s.cites.join(", ") + ")" : ""}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="muted small">
                    Other routes are accepted — this is one, not the one.
                  </p>
                </section>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
