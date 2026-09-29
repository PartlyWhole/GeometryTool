// One question on the path: choose, tap or type, then check, then continue.
import React, { useState } from "react";
import { Figure, type Highlight } from "../Figure";
import { NumberEntry, numberOf } from "../NumberEntry";
import type { Trap } from "../content/numeric";
import type { Question } from "./questions";

const traps = (t: Trap | Trap[] | undefined): Trap[] => (t ? (Array.isArray(t) ? t : [t]) : []);
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

export function QuestionView(props: {
  q: Question;
  onAnswered: (correct: boolean) => void;
  onContinue: () => void;
}) {
  const { q } = props;
  const [choice, setChoice] = useState<number | null>(null);
  const [entry, setEntry] = useState("");
  const [taps, setTaps] = useState<string[]>([]);
  const [line, setLine] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<null | { ok: boolean; text: string }>(null);
  const done = verdict !== null;

  const ready =
    q.kind === "choice" ? choice !== null
    : q.kind === "number" ? numberOf(entry) !== undefined
    : q.kind === "tapAngle" ? taps.length > 0
    : line !== null;

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
    } else {
      ok = line === q.answer;
    }
    setVerdict({ ok, text: ok ? q.why : [extra, q.why].filter(Boolean).join(" ") });
    props.onAnswered(ok);
  };

  // What the figure picks out: the question's own highlights, then the
  // student's taps, then — once checked — the answer.
  const highlights: Highlight[] = [...(q.highlights ?? [])];
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

      {q.figure && (
        <div className="pq-figure">
          <Figure
            board={q.figure}
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
        {q.kind === "number" && (
          <NumberEntry value={entry} onChange={setEntry} unit={q.unit} disabled={done} />
        )}
        {q.kind === "tapAngle" && (
          <p className="muted">
            {taps.length
              ? "Chosen: " + taps.map((t) => "∠" + t).join(", ") + (q.multi && !done ? " — tap again to take one back." : "")
              : q.multi
                ? "Tap inside each angle you want. Tap again to take one back."
                : "Tap inside an angle on the figure."}
          </p>
        )}
        {q.kind === "tapLine" && (
          <p className="muted">{line ? "Chosen: line " + line : "Tap a line on the figure."}</p>
        )}
      </div>

      <div className={"pq-bar" + (done ? (verdict!.ok ? " ok" : " bad") : "")}>
        {done && (
          <div className="pq-verdict" role="status" aria-live="polite">
            <strong>{verdict!.ok ? "Correct" : "Not quite"}</strong>
            <span>{verdict!.text}</span>
          </div>
        )}
        {done ? (
          <button className="primary" onClick={props.onContinue} autoFocus>
            Continue
          </button>
        ) : (
          <button className="primary" disabled={!ready} onClick={check}>
            Check
          </button>
        )}
      </div>
    </div>
  );
}
