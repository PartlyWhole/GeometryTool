// One question on the path: choose, tap, type or order, then check, then
// continue. Flow proofs and whole proofs have screens of their own below.
import React, { useState } from "react";
import { Figure, type Highlight } from "../Figure";
import { NumberEntry, numberOf } from "../NumberEntry";
import { statementText } from "../notation";
import { reasonById } from "../reasons";
import { statementObjects } from "../terms";
import { FLOW_REASONS, type FlowItem } from "../content/items3";
import type { Trap } from "../content/numeric";
import { flowNote, isRight, lineText, reasonName } from "../FlowExercise";
import { ProofBoard, type Work, blankWork } from "../ProofExercise";
import type { ProofProblem } from "../proof";
import type { ProofContext, Question } from "./questions";
import { shuffle } from "./questions";

const traps = (t: Trap | Trap[] | undefined): Trap[] => (t ? (Array.isArray(t) ? t : [t]) : []);
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

type Props = { q: Question; onAnswered: (correct: boolean) => void; onContinue: () => void };

export function QuestionView(props: Props) {
  if (props.q.kind === "flow") return <FlowQuestion {...props} item={props.q.item} />;
  if (props.q.kind === "proof") return <ProofQuestion {...props} problem={props.q.problem} />;
  return <SimpleQuestion {...props} />;
}

/** The bar along the bottom: the verdict once checked, and Check or Continue. */
function Bar(props: { verdict: null | { ok: boolean; text: string }; ready?: boolean; onCheck?: () => void; onContinue: () => void; extra?: React.ReactNode }) {
  const { verdict } = props;
  return (
    <div className={"pq-bar" + (verdict ? (verdict.ok ? " ok" : " bad") : "")}>
      {verdict && (
        <div className="pq-verdict" role="status" aria-live="polite">
          <strong>{verdict.ok ? "Correct" : "Not quite"}</strong>
          <span>{verdict.text}</span>
        </div>
      )}
      {!verdict && props.extra}
      {verdict ? (
        <button className="primary" onClick={props.onContinue} autoFocus>
          Continue
        </button>
      ) : props.onCheck ? (
        <button className="primary" disabled={!props.ready} onClick={props.onCheck}>
          Check
        </button>
      ) : null}
    </div>
  );
}

/** A line of a proof and the lines above it, for "which reason?". */
function ProofRows(props: { proof: ProofContext }) {
  const { proof } = props;
  return (
    <div className="pq-proof">
      <section className="givens">
        <h3>Given</h3>
        {proof.givens.length ? (
          <ul>
            {proof.givens.map((g, n) => (
              <li key={n} className="role-given">{g}</li>
            ))}
          </ul>
        ) : (
          <p className="muted small">Read what you need from the figure.</p>
        )}
        <h3>Prove</h3>
        <p className="role-prove goal">{proof.goal}</p>
      </section>
      <table className="two-column compact">
        <tbody>
          {proof.rows.map((row) => (
            <tr key={row.n} className={row.cited ? "cited" : ""}>
              <td className="num">{row.n}</td>
              <td>{row.text}</td>
              <td className="reason">{row.reason}</td>
            </tr>
          ))}
          <tr className="asking">
            <td className="num">{proof.asking.n}</td>
            <td>{proof.asking.text}</td>
            <td className="reason"><em>which reason?</em></td>
          </tr>
        </tbody>
      </table>
      <p className="cite-help">{proof.help}</p>
    </div>
  );
}

function SimpleQuestion(props: Props) {
  const { q } = props;
  const [choice, setChoice] = useState<number | null>(null);
  const [entry, setEntry] = useState("");
  const [taps, setTaps] = useState<string[]>([]);
  const [line, setLine] = useState<string | null>(null);
  // For ordering: the steps as dealt, and the order the student has built.
  const [bank] = useState<string[]>(() => (q.kind === "order" ? dealt(q.steps) : []));
  const [built, setBuilt] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<null | { ok: boolean; text: string }>(null);
  const done = verdict !== null;

  const ready =
    q.kind === "choice" ? choice !== null
    : q.kind === "number" ? numberOf(entry) !== undefined
    : q.kind === "tapAngle" ? taps.length > 0
    : q.kind === "tapLine" ? line !== null
    : q.kind === "order" ? built.length === q.steps.length
    : false;

  const check = () => {
    let ok = false;
    let extra: string | undefined;
    if (q.kind === "choice") {
      ok = choice === q.correct;
      if (!ok && choice !== null) extra = q.whyPerChoice?.[choice];
    } else if (q.kind === "number") {
      const v = numberOf(entry)!;
      ok = Math.abs(v - q.answer) < 1e-6;
      if (!ok) extra = traps(q.trap).find((t) => Math.abs(t.value - v) < 1e-6)?.note;
    } else if (q.kind === "tapAngle") {
      ok = sameSet(taps, q.answer);
      if (!ok && !q.multi && q.explain) extra = q.explain(taps[0]);
    } else if (q.kind === "tapLine") {
      ok = line === q.answer;
    } else if (q.kind === "order") {
      ok = built.every((s, i) => s === q.steps[i]);
      if (!ok) extra = "The order: " + q.steps.map((s, i) => i + 1 + ". " + s).join(" ");
    }
    setVerdict({ ok, text: ok ? q.why : [extra, q.why].filter(Boolean).join(" ") });
    props.onAnswered(ok);
  };

  // What the figure picks out: the question's own highlights, then the
  // student's taps, then — once checked — the answer.
  const highlights: Highlight[] = [...("highlights" in q ? q.highlights ?? [] : [])];
  if (q.kind === "tapAngle") {
    for (const t of taps) highlights.push({ obj: { k: "ang", name: t }, role: done && !q.answer.includes(t) ? "shared" : "prove" });
    if (done && !verdict!.ok)
      for (const a of q.answer) if (!taps.includes(a)) highlights.push({ obj: { k: "ang", name: a }, role: "given" });
  }
  if (q.kind === "tapLine") {
    const lineHighlight = (name: string, role: Highlight["role"]) => {
      const e = q.figure.edges.find((x) => x.label === name)!;
      const pa = q.figure.points.find((p) => p.id === e.a)!, pb = q.figure.points.find((p) => p.id === e.b)!;
      highlights.push({ obj: { k: "line", a: pa.label, b: pb.label, name }, role });
    };
    if (line) lineHighlight(line, done && line !== q.answer ? "shared" : "prove");
    if (done && line !== q.answer) lineHighlight(q.answer, "given");
  }

  const tapAngle = (name: string) => {
    if (done || q.kind !== "tapAngle") return;
    if (!q.figure.angles.some((a) => a.label === name)) return;
    setTaps((t) => (q.multi ? (t.includes(name) ? t.filter((x) => x !== name) : [...t, name]) : [name]));
  };

  const figure = "figure" in q ? q.figure : undefined;

  return (
    <div className="pq">
      {"context" in q && q.context && (
        <div className="card-context">
          {q.context.map((c, n) => (
            <p key={n}>{c}</p>
          ))}
        </div>
      )}
      <h2 className="pq-prompt">{q.prompt}</h2>

      {figure && (
        <div className="pq-figure">
          <Figure
            board={figure}
            height={290}
            highlights={highlights}
            onPickAngle={q.kind === "tapAngle" && !done ? (a) => tapAngle(a.name) : undefined}
            onPickLine={q.kind === "tapLine" && !done ? (n) => setLine(n) : undefined}
            ariaLabel={q.prompt}
          />
          {q.kind === "number" && q.given && (
            <ul className="given-list">
              {q.given.map((g, n) => (
                <li key={n}>{g}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!figure && q.kind === "number" && q.given && (
        <ul className="given-list">
          {q.given.map((g, n) => (
            <li key={n}>{g}</li>
          ))}
        </ul>
      )}

      {q.kind === "choice" && q.proof && <ProofRows proof={q.proof} />}

      <div className="pq-answer">
        {q.kind === "choice" && (
          <div className="choices tall">
            {q.choices.map((c, n) => (
              <button
                key={n}
                className={
                  "choice" +
                  (choice === n ? " picked" : "") +
                  (done && n === q.correct ? " right" : "") +
                  (done && choice === n && n !== q.correct ? " wrong" : "")
                }
                disabled={done}
                onClick={() => setChoice(n)}
              >
                <span>{c}</span>
              </button>
            ))}
          </div>
        )}
        {q.kind === "number" && <NumberEntry value={entry} onChange={setEntry} unit={q.unit} disabled={done} onEnter={check} />}
        {q.kind === "tapAngle" && (
          <p className="muted">
            {taps.length
              ? "Chosen: " + taps.map((t) => "∠" + t).join(", ") + (q.multi && !done ? " — tap again to take one back." : "")
              : q.multi
                ? "Tap inside each angle you want. Tap again to take one back."
                : "Tap inside an angle on the figure."}
          </p>
        )}
        {q.kind === "tapLine" && <p className="muted">{line ? "Chosen: line " + line : "Tap a line on the figure."}</p>}
        {q.kind === "order" && (
          <div className="order">
            <ol className="order-built" aria-label="Your order">
              {built.map((s, i) => (
                <li key={s} className={done ? (s === q.steps[i] ? "right" : "wrong") : ""}>
                  <button disabled={done} onClick={() => setBuilt((b) => b.filter((x) => x !== s))} title="Take this step back">
                    <span className="order-n">{i + 1}</span> {s}
                  </button>
                </li>
              ))}
              {!built.length && <li className="order-empty muted">Tap the steps below in the order you would do them.</li>}
            </ol>
            <div className="order-bank" aria-label="Steps to place">
              {bank.map((s) => (
                <button key={s} className="order-step" disabled={done || built.includes(s)} onClick={() => setBuilt((b) => [...b, s])}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Bar verdict={verdict} ready={ready} onCheck={check} onContinue={props.onContinue} />
    </div>
  );
}

/** Deal steps in an order that is never already the right one. */
function dealt(steps: string[]) {
  const r = Math.random;
  for (let t = 0; t < 10; t++) {
    const out = shuffle(r, steps);
    if (out.some((s, i) => s !== steps[i])) return out;
  }
  return steps.slice().reverse();
}

/** A flow proof or reason table: choose the reason for each blank. */
function FlowQuestion(props: Props & { item: FlowItem }) {
  const { item } = props;
  const [chosen, setChosen] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<null | { ok: boolean; text: string }>(null);
  const done = verdict !== null;
  const open = item.boxes.map((b, i) => (b.shown ? -1 : i)).filter((i) => i >= 0);
  const ready = open.every((i) => !!chosen[i]);
  const options = item.reasons ?? FLOW_REASONS;

  const check = () => {
    const ok = open.every((i) => isRight(item.boxes[i], chosen[i]));
    const wrong = open.filter((i) => !isRight(item.boxes[i], chosen[i])).length;
    setVerdict({
      ok,
      text: ok ? props.q.why : wrong + " reason" + (wrong > 1 ? "s are" : " is") + " wrong — the note under each says why, and the right reason is shown.",
    });
    props.onAnswered(ok);
  };

  const highlights: Highlight[] = [
    ...item.givens.flatMap((g) => statementObjects(g).map((o) => ({ obj: o, role: "given" as const }))),
    ...(item.goal ? statementObjects(item.goal).map((o) => ({ obj: o, role: "prove" as const })) : []),
  ];

  const reasonCell = (i: number) => {
    const box = item.boxes[i];
    if (box.shown) return <span className="flow-reason-fixed">{reasonName(box.reasonId)}</span>;
    return (
      <label className="flow-reason">
        <span className="sr-only">Reason for {lineText(box)}</span>
        <select
          value={chosen[i] ?? ""}
          disabled={done}
          onChange={(e) =>
            setChosen((c) => {
              const next = c.slice();
              next[i] = e.target.value;
              return next;
            })
          }
        >
          <option value="" disabled>? Choose the reason</option>
          {options.map((id) => (
            <option key={id} value={id}>{reasonName(id)}</option>
          ))}
        </select>
      </label>
    );
  };
  const state = (i: number) => (item.boxes[i].shown || !done ? "" : isRight(item.boxes[i], chosen[i]) ? " right" : " wrong");
  const note = (i: number) =>
    done && !item.boxes[i].shown && !isRight(item.boxes[i], chosen[i])
      ? flowNote(item, i, chosen[i]) + " The reason: " + reasonName(item.boxes[i].reasonId) + "."
      : null;

  return (
    <div className="pq">
      <h2 className="pq-prompt">{item.title}</h2>
      <p className="muted">
        {item.layout === "table"
          ? "Some reasons are filled in. Choose the reason for each line marked ?."
          : "Each arrow says the box it points to follows from the one before. Choose the reason under each box."}
      </p>
      <div className="pq-figure">
        <Figure board={item.figure} height={250} highlights={highlights} ariaLabel={item.title} />
      </div>
      <section className="givens">
        <h3>Given</h3>
        <ul>
          {(item.givenText ?? item.givens.map(statementText)).map((g, n) => (
            <li key={n} className="role-given">{g}</li>
          ))}
        </ul>
        <h3>Prove</h3>
        <p className="role-prove goal">{item.goalText ?? (item.goal ? statementText(item.goal) : "")}</p>
      </section>
      {item.layout === "table" ? (
        <table className="two-column fill">
          <thead>
            <tr><th className="num">#</th><th>Statements</th><th>Reasons</th></tr>
          </thead>
          <tbody>
            {item.boxes.map((box, i) => (
              <React.Fragment key={i}>
                <tr className={"fill-row" + state(i)}>
                  <td className="num">{i + 1}</td>
                  <td>{lineText(box)}</td>
                  <td className="reason">{reasonCell(i)}</td>
                </tr>
                {note(i) && (
                  <tr className="fill-note">
                    <td />
                    <td colSpan={2}>{note(i)}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <ol className="flow" aria-label="Flow proof">
          {item.boxes.map((box, i) => (
            <li key={i} className={"flow-step" + state(i)}>
              {i > 0 && <span className="flow-arrow" aria-hidden="true">↓</span>}
              <div className="flow-box">{lineText(box)}</div>
              {reasonCell(i)}
              {note(i) && <p className="flow-note">{note(i)}</p>}
            </li>
          ))}
        </ol>
      )}
      <Bar verdict={verdict} ready={ready} onCheck={check} onContinue={props.onContinue} />
    </div>
  );
}

/** A whole proof, built line by line with the Practice page's checker. */
function ProofQuestion(props: Props & { problem: ProofProblem }) {
  const [work, setWork] = useState<Work>(blankWork);
  const [verdict, setVerdict] = useState<null | { ok: boolean; text: string }>(null);
  const solved = (clean: boolean) => {
    if (verdict) return;
    setVerdict({
      ok: clean,
      text: clean ? props.q.why : "Proved — with help, so it counts as one to come back to.",
    });
    props.onAnswered(clean);
  };
  const skip = () => {
    const worked = props.problem.solution
      ?.map((s, i) => i + 1 + ". " + statementText(s.statement) + " — " + (reasonById(s.reasonId)?.name ?? s.reasonId))
      .join("  ");
    setVerdict({ ok: false, text: worked ? "One correct proof: " + worked : "Come back to this one." });
    props.onAnswered(false);
  };
  return (
    <div className="pq pq-wide">
      <ProofBoard
        problem={props.problem}
        problems={[props.problem]}
        module={3}
        index={0}
        work={work}
        setWork={setWork}
        onPick={() => {}}
        nav={null}
        inline={{ onSolved: solved }}
      />
      <Bar
        verdict={verdict}
        onContinue={props.onContinue}
        extra={
          <button className="link" onClick={skip}>
            Skip this proof
          </button>
        }
      />
    </div>
  );
}
