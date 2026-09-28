// The two shapes of "work out the answer": one number, or a question in parts.
import React, { useState } from "react";
import { NumericExercise } from "./NumericExercise";
import { MultiPartExercise } from "./MultiPartExercise";
import { Tabs } from "./ui";
import { multipart3, numeric3 } from "./content/items3";

export function SolveExercise(props: { module?: 2 | 3 }) {
  const m3 = props.module === 3;
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
      {tab === "single" ? (
        m3 ? <NumericExercise source={numeric3} tallyKey="numeric-m3" /> : <NumericExercise />
      ) : m3 ? (
        <MultiPartExercise source={multipart3} tallyKey="multipart-m3" />
      ) : (
        <MultiPartExercise />
      )}
    </>
  );
}
