// A keypad for answers that are numbers. Shared by the single-answer and
// multi-part solve modes; nothing in the app asks a student to type.
import React from "react";

export function NumberEntry(props: {
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  disabled?: boolean;
  label?: string;
}) {
  const press = (ch: string) => {
    if (props.disabled) return;
    if (ch === "." && props.value.includes(".")) return;
    if (props.value.length > 9) return;
    props.onChange(props.value + ch);
  };
  return (
    <>
      <div className="answer-line">
        <span className="answer-label">{props.label ?? "Your answer"}</span>
        <code className={props.value ? "answer" : "answer empty"}>
          {props.value || "Use the keypad"}
          {props.value && props.unit ? " " + props.unit : ""}
        </code>
      </div>
      <div className="keypad">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."].map((k) => (
          <button
            key={k}
            className="chip num"
            disabled={props.disabled}
            onClick={() => press(k)}
          >
            {k}
          </button>
        ))}
        <button
          className="chip warn"
          aria-label="Delete last digit"
          disabled={!props.value || props.disabled}
          onClick={() => props.onChange(props.value.slice(0, -1))}
        >
          ⌫
        </button>
      </div>
    </>
  );
}

export const numberOf = (entry: string) =>
  entry === "" || entry === "." ? undefined : Number(entry);
