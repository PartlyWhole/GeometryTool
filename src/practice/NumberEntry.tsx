// A typed answer that is a number. Shared by the solve modes and the path.
// A plain field: the phone brings up its number keyboard, a laptop types
// straight in, and Enter checks.
import React from "react";

export function NumberEntry(props: {
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  disabled?: boolean;
  label?: string;
  /** Enter in the field: check the answer, when it can be checked. */
  onEnter?: () => void;
  autoFocus?: boolean;
}) {
  return (
    <label className="answer-line">
      <span className="answer-label">{props.label ?? "Your answer"}</span>
      <span className="answer-field">
        <input
          className="answer-input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder="Type a number"
          value={props.value}
          disabled={props.disabled}
          autoFocus={props.autoFocus}
          // Only what a number can be written with: digits, one point, a
          // leading minus. Anything else is dropped as it is typed.
          onChange={(e) => {
            const v = e.target.value.replace(/−/g, "-").replace(/[^0-9.\-]/g, "");
            if (/^-?\d*\.?\d*$/.test(v) && v.length <= 10) props.onChange(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.onEnter && numberOf(props.value) !== undefined) {
              e.preventDefault();
              props.onEnter();
            }
          }}
        />
        {props.unit && <span className="answer-unit">{props.unit}</span>}
      </span>
    </label>
  );
}

export const numberOf = (entry: string): number | undefined => {
  const v = entry.replace(/−/g, "-");
  if (v === "" || v === "." || v === "-" || v === "-.") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};
