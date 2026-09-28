// The practice page: the exercise modes over one shared engine, for the
// module chosen at the top of the page.
import React, { useState } from "react";
import { NameExercise } from "./NameExercise";
import { ConceptExercise } from "./ConceptExercise";
import { TranslateExercise } from "./TranslateExercise";
import { ProofExercise } from "./ProofExercise";
import { SolveExercise } from "./SolveExercise";
import { AnglePairExercise } from "./AnglePairExercise";
import { CONCEPTS3 } from "./content/concepts3";
import { type Module, Tabs } from "./ui";

export type Mode = "name" | "pairs" | "concepts" | "translate" | "solve" | "proof";

const MODES2: { id: Mode; label: string; hint: string }[] = [
  { id: "name", label: "Naming", hint: "Identify the segment or angle a set of letters names" },
  { id: "concepts", label: "Definitions", hint: "Match definitions, properties and postulates to examples" },
  { id: "translate", label: "Diagram ↔ equation", hint: "Turn a figure into an equation, and back" },
  { id: "solve", label: "Solve", hint: "Work out the measure or length the question asks for" },
  { id: "proof", label: "Proof", hint: "Build a two-column proof, every line checked" },
];

const MODES3: { id: Mode; label: string; hint: string }[] = [
  { id: "pairs", label: "Angle pairs", hint: "Name the pair, find the partner, and say what follows" },
  { id: "concepts", label: "Definitions", hint: "The five pair names, parallel lines, the postulate and the four theorems" },
  { id: "translate", label: "Diagram ↔ equation", hint: "Read what a figure of parallel lines gives you" },
  { id: "solve", label: "Solve", hint: "Find the measure or x, on parallel lines" },
  { id: "proof", label: "Proof", hint: "Prove the theorems from the Corresponding Angles Postulate" },
];

export function Practice(props: { mode?: Mode; onMode?: (m: Mode) => void; module?: Module }) {
  const m3 = props.module === 3;
  const modes = m3 ? MODES3 : MODES2;
  const [local, setLocal] = useState<Mode>(modes[0].id);
  const mode = props.mode ?? local;
  const setMode = props.onMode ?? setLocal;
  return (
    <div className="page practice">
      <header className="page-head">
        <div>
          <h1>Practice{m3 ? " · Module 3" : ""}</h1>
          <p className="muted">{modes.find((m) => m.id === mode)?.hint}</p>
        </div>
        <Tabs label="Exercise" value={mode} onChange={setMode} options={modes} />
      </header>
      {mode === "name" && !m3 && <NameExercise />}
      {mode === "pairs" && m3 && <AnglePairExercise />}
      {mode === "concepts" &&
        (m3 ? <ConceptExercise bank={CONCEPTS3} tallyKey="concepts-m3" /> : <ConceptExercise />)}
      {mode === "translate" && <TranslateExercise module={props.module} />}
      {mode === "solve" && <SolveExercise module={props.module} />}
      {mode === "proof" && <ProofExercise module={props.module} />}
    </div>
  );
}
