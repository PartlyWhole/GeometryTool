// The two shapes of "work out the answer": one number, or a question in parts.
import React, { useState } from "react";
import { NumericExercise } from "./NumericExercise";
import { MultiPartExercise } from "./MultiPartExercise";
import { Tabs } from "./ui";

export function SolveExercise() {
  const [tab, setTab] = useState<"single" | "parts">("single");
  return (
    <>
      <div className="proof-tabs">
        <Tabs
          label="Question shape"
          value={tab}
          onChange={setTab}
          options={[
            { id: "single", label: "One answer", hint: "A single measure or length" },
            { id: "parts", label: "Two parts", hint: "Part A feeds Part B" },
          ]}
        />
      </div>
      {tab === "single" ? <NumericExercise /> : <MultiPartExercise />}
    </>
  );
}
