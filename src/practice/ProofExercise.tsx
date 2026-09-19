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
import { KIND_LABEL, REASONS, type ReasonKind, reasonById } from "./reasons";
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
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Hints, Scoreboard, Tabs, Verdict } from "./ui";
import { ReasonCheckMode } from "./SelectAllExercise";
import { StepExercise } from "./StepExercise";

const KIND_ORDER: ReasonKind[] = [
  "given",
  "definition",
  "postulate",
  "theorem",
  "property",
  "algebra",
];

export function ProofExercise() {
  const [tab, setTab] = useState<"step" | "reasons" | "build">("step");
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
            { id: "build", label: "Build a proof", hint: "Write every line and justify it" },
          ]}
        />
      </div>
      {tab === "step" && <StepExercise />}
      {tab === "reasons" && <ReasonCheckMode />}
      {tab === "build" && <ProofBuilder />}
    </>
  );
}

function ProofBuilder() {
  const [genSeed, setGenSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const problems = useMemo(
    () => [...PROOFS, ...generatedProofs(genSeed, 4)],
    [genSeed],
  );
  const [pi, setPi] = useState(0);
  const problem = problems[Math.min(pi, problems.length - 1)];
  return (
    <ProofBoard
      key={problem.id}
      problem={problem}
      problems={problems}
      index={Math.min(pi, problems.length - 1)}
      onPick={setPi}
      onMore={() => {
        setGenSeed(Math.floor(Math.random() * 1e9));
        setPi(PROOFS.length);
      }}
    />
  );
}

function ProofBoard(props: {
  problem: ProofProblem;
  problems: ProofProblem[];
  index: number;
  onPick: (i: number) => void;
  onMore: () => void;
}) {
  const { problem } = props;
  const [lines, setLines] = useState<ProofLine[]>([]);
  const [draft, setDraft] = useState<Draft>(() => newDraft("eq"));
  const [reasonId, setReasonId] = useState("given");
  const [cites, setCites] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState<Tally>(() => loadTally("proof"));
  const [scored, setScored] = useState(false);

  const built = buildStatement(draft);
  const done = reachedGoal(problem, lines);
  const loose = done ? unusedLines(problem, lines) : [];

  const reset = () => {
    setDraft(newDraft(draft.form));
    setCites([]);
    setError(null);
  };

  const addStep = () => {
    if (!built.ok) {
      setError(built.why);
      return;
    }
    const check = validateLine(problem, lines, {
      statement: built.statement,
      reasonId,
      cites,
    });
    if (!check.ok) {
      setError(check.why);
      setNote(null);
      return;
    }
    const next = [
      ...lines,
      { id: "L" + (lines.length + 1) + ":" + Date.now(), statement: built.statement, reasonId, cites },
    ];
    setLines(next);
    setNote(check.note ?? null);
    reset();
    if (!scored && reachedGoal(problem, next)) {
      setScored(true);
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
    setCites((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const reason = reasonById(reasonId);
  const allowed = REASONS.filter((r) => !problem.forbid?.includes(r.id));

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
          <button onClick={props.onMore} title="Generate fresh solve-for-x proofs">
            New generated set
          </button>
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
                  setDraft(insertObject(draft, obj));
                  setError(null);
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
            onMore={() => setHintsShown((n) => n + 1)}
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
                <button onClick={() => { setLines([]); setScored(false); reset(); }}>
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
                onChange={(d) => { setDraft(d); setError(null); }}
                variables={["x", "y"]}
              />

              <div className="composer-reason">
                <label>
                  <span>Reason</span>
                  <select
                    value={reasonId}
                    onChange={(e) => { setReasonId(e.target.value); setError(null); }}
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
                  onClick={() => setLines((l) => l.slice(0, -1))}
                  disabled={!lines.length}
                >
                  Undo last line
                </button>
                <button
                  onClick={() => { setLines([]); reset(); }}
                  disabled={!lines.length}
                >
                  Start over
                </button>
                {problem.solution && (
                  <button
                    className="link"
                    onClick={() => { setRevealed(true); setHintsShown(problem.hints?.length ?? 0); }}
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
