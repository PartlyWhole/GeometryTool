// The practice page: four exercise modes over one shared engine.
import React, { useState } from "react";
import { NameExercise } from "./NameExercise";
import { ConceptExercise } from "./ConceptExercise";
import { TranslateExercise } from "./TranslateExercise";
import { ProofExercise } from "./ProofExercise";
import { Tabs } from "./ui";

export type Mode = "name" | "concepts" | "translate" | "proof";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "name", label: "Naming", hint: "Identify the segment or angle a set of letters names" },
  { id: "concepts", label: "Definitions", hint: "Match definitions, properties and postulates to examples" },
  { id: "translate", label: "Diagram ↔ equation", hint: "Turn a figure into an equation, and back" },
  { id: "proof", label: "Proof", hint: "Build a two-column proof, every line checked" },
];

export function Practice(props: { mode?: Mode; onMode?: (m: Mode) => void }) {
  const [local, setLocal] = useState<Mode>("name");
  const mode = props.mode ?? local;
  const setMode = props.onMode ?? setLocal;
  return (
    <div className="page practice">
      <header className="page-head">
        <div>
          <h1>Practice</h1>
          <p className="muted">{MODES.find((m) => m.id === mode)?.hint}</p>
        </div>
        <Tabs label="Exercise" value={mode} onChange={setMode} options={MODES} />
      </header>
      {mode === "name" && <NameExercise />}
      {mode === "concepts" && <ConceptExercise />}
      {mode === "translate" && <TranslateExercise />}
      {mode === "proof" && <ProofExercise />}
    </div>
  );
}
