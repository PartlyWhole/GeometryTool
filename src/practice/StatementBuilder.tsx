// Toolbar-driven construction of a symbolic statement.
//
// Nothing is typed. A student picks the shape of the statement, then fills its
// slots from a palette or by clicking the figure. The result is a Statement,
// so the same validators handle it whether it came from here or from content.
import React, { useMemo } from "react";
import type { Board } from "../model";
import {
  type AngId,
  type AngleClass,
  type ObjId,
  type SegId,
  type Statement,
  objKey,
} from "./terms";
import { type Tok, accepts, parse, push, tokensText } from "./tokens";
import { objText, statementText } from "./notation";
import { figureObjects } from "./inventory";

export type FormId =
  | "eq" | "cong" | "supp" | "comp" | "vertical" | "linearPair"
  | "adjacent" | "perp" | "parallel" | "midpoint" | "bisects"
  | "between" | "collinear" | "interior" | "angleClass";

type SlotSpec =
  | { kind: "expr"; label: string }
  | { kind: "obj"; label: string; accept: ("seg" | "ang" | "ray" | "line")[] }
  | { kind: "pt"; label: string }
  | { kind: "class"; label: string };

export const FORMS: {
  id: FormId;
  label: string;
  group: "equation" | "congruence" | "angle pair" | "position";
  slots: SlotSpec[];
  preview: string;
}[] = [
  { id: "eq", label: "=", group: "equation", preview: "_ = _",
    slots: [{ kind: "expr", label: "left side" }, { kind: "expr", label: "right side" }] },
  { id: "cong", label: "≅", group: "congruence", preview: "_ ≅ _",
    slots: [
      { kind: "obj", label: "first", accept: ["seg", "ang"] },
      { kind: "obj", label: "second", accept: ["seg", "ang"] },
    ] },
  { id: "supp", label: "supplementary", group: "angle pair", preview: "_ and _ are supplementary",
    slots: [
      { kind: "obj", label: "first angle", accept: ["ang"] },
      { kind: "obj", label: "second angle", accept: ["ang"] },
    ] },
  { id: "comp", label: "complementary", group: "angle pair", preview: "_ and _ are complementary",
    slots: [
      { kind: "obj", label: "first angle", accept: ["ang"] },
      { kind: "obj", label: "second angle", accept: ["ang"] },
    ] },
  { id: "vertical", label: "vertical angles", group: "angle pair", preview: "_ and _ are vertical angles",
    slots: [
      { kind: "obj", label: "first angle", accept: ["ang"] },
      { kind: "obj", label: "second angle", accept: ["ang"] },
    ] },
  { id: "linearPair", label: "linear pair", group: "angle pair", preview: "_ and _ form a linear pair",
    slots: [
      { kind: "obj", label: "first angle", accept: ["ang"] },
      { kind: "obj", label: "second angle", accept: ["ang"] },
    ] },
  { id: "adjacent", label: "adjacent", group: "angle pair", preview: "_ and _ are adjacent",
    slots: [
      { kind: "obj", label: "first angle", accept: ["ang"] },
      { kind: "obj", label: "second angle", accept: ["ang"] },
    ] },
  { id: "angleClass", label: "acute / right / obtuse", group: "angle pair", preview: "_ is a _ angle",
    slots: [
      { kind: "obj", label: "angle", accept: ["ang"] },
      { kind: "class", label: "kind" },
    ] },
  { id: "midpoint", label: "midpoint", group: "position", preview: "_ is the midpoint of _",
    slots: [
      { kind: "pt", label: "point" },
      { kind: "obj", label: "segment", accept: ["seg"] },
    ] },
  { id: "bisects", label: "bisects", group: "position", preview: "_ bisects _",
    slots: [
      { kind: "obj", label: "bisector", accept: ["ray", "seg", "line"] },
      { kind: "obj", label: "what it bisects", accept: ["ang", "seg"] },
    ] },
  { id: "between", label: "between", group: "position", preview: "_ is between _ and _",
    slots: [
      { kind: "pt", label: "middle point" },
      { kind: "pt", label: "one end" },
      { kind: "pt", label: "other end" },
    ] },
  { id: "collinear", label: "collinear", group: "position", preview: "_, _, _ are collinear",
    slots: [
      { kind: "pt", label: "first" },
      { kind: "pt", label: "second" },
      { kind: "pt", label: "third" },
    ] },
  { id: "interior", label: "in the interior of", group: "position", preview: "_ is in the interior of _",
    slots: [
      { kind: "pt", label: "point" },
      { kind: "obj", label: "angle", accept: ["ang"] },
    ] },
  { id: "perp", label: "⊥", group: "position", preview: "_ ⊥ _",
    slots: [
      { kind: "obj", label: "first", accept: ["seg", "line", "ray"] },
      { kind: "obj", label: "second", accept: ["seg", "line", "ray"] },
    ] },
  { id: "parallel", label: "∥", group: "position", preview: "_ ∥ _",
    slots: [
      { kind: "obj", label: "first", accept: ["seg", "line", "ray"] },
      { kind: "obj", label: "second", accept: ["seg", "line", "ray"] },
    ] },
];

export type SlotValue =
  | { kind: "expr"; toks: Tok[] }
  | { kind: "obj"; obj?: ObjId }
  | { kind: "pt"; label?: string }
  | { kind: "class"; cls?: AngleClass };

export type Draft = { form: FormId; slots: SlotValue[]; focus: number };

export const formSpec = (id: FormId) => FORMS.find((f) => f.id === id)!;

export function newDraft(form: FormId): Draft {
  const spec = formSpec(form);
  return {
    form,
    focus: 0,
    slots: spec.slots.map((s) =>
      s.kind === "expr"
        ? { kind: "expr", toks: [] }
        : s.kind === "obj"
          ? { kind: "obj" }
          : s.kind === "pt"
            ? { kind: "pt" }
            : { kind: "class" },
    ),
  };
}

export type BuildResult =
  | { ok: true; statement: Statement }
  | { ok: false; why: string };

export function buildStatement(d: Draft): BuildResult {
  const spec = formSpec(d.form);
  const need = (i: number) => spec.slots[i].label;
  const expr = (i: number) => {
    const s = d.slots[i];
    if (s.kind !== "expr") return { ok: false as const, why: "Expected an expression." };
    const r = parse(s.toks);
    return r.ok
      ? { ok: true as const, term: r.term }
      : { ok: false as const, why: "The " + need(i) + ": " + r.why };
  };
  const obj = (i: number) => {
    const s = d.slots[i];
    return s.kind === "obj" && s.obj ? s.obj : undefined;
  };
  const pt = (i: number) => {
    const s = d.slots[i];
    return s.kind === "pt" ? s.label : undefined;
  };
  const missing = (i: number) => ({
    ok: false as const,
    why: "Choose the " + need(i) + ".",
  });
  const asAng = (o: ObjId | undefined): AngId | undefined =>
    o?.k === "ang" ? o : undefined;

  switch (d.form) {
    case "eq": {
      const l = expr(0);
      if (!l.ok) return l;
      const r = expr(1);
      if (!r.ok) return r;
      return { ok: true, statement: { k: "eq", l: l.term, r: r.term } };
    }
    case "cong": {
      const a = obj(0), b = obj(1);
      if (!a) return missing(0);
      if (!b) return missing(1);
      if (a.k !== b.k)
        return { ok: false, why: "A segment can only be congruent to a segment, and an angle to an angle." };
      if (objKey(a) === objKey(b))
        return { ok: false, why: "Those are the same object. Use the Reflexive Property if that is what you mean." };
      return { ok: true, statement: { k: "cong", l: a, r: b } };
    }
    case "supp": case "comp": case "vertical":
    case "linearPair": case "adjacent": {
      const a = asAng(obj(0)), b = asAng(obj(1));
      if (!a) return missing(0);
      if (!b) return missing(1);
      if (objKey(a) === objKey(b))
        return { ok: false, why: "Choose two different angles." };
      return { ok: true, statement: { k: d.form, a, b } };
    }
    case "perp": case "parallel": {
      const a = obj(0), b = obj(1);
      if (!a) return missing(0);
      if (!b) return missing(1);
      return { ok: true, statement: { k: d.form, a, b } };
    }
    case "angleClass": {
      const a = asAng(obj(0));
      const s = d.slots[1];
      if (!a) return missing(0);
      if (s.kind !== "class" || !s.cls) return missing(1);
      return { ok: true, statement: { k: "angleClass", ang: a, cls: s.cls } };
    }
    case "midpoint": {
      const p = pt(0), s = obj(1);
      if (!p) return missing(0);
      if (!s || s.k !== "seg") return missing(1);
      return { ok: true, statement: { k: "midpoint", p, seg: s as SegId } };
    }
    case "bisects": {
      const by = obj(0), of = obj(1);
      if (!by) return missing(0);
      if (!of) return missing(1);
      return { ok: true, statement: { k: "bisects", by, of } };
    }
    case "between": {
      const p = pt(0), a = pt(1), c = pt(2);
      if (!p) return missing(0);
      if (!a) return missing(1);
      if (!c) return missing(2);
      if (new Set([p, a, c]).size < 3)
        return { ok: false, why: "Choose three different points." };
      return { ok: true, statement: { k: "between", p, a, c } };
    }
    case "collinear": {
      const ps = [pt(0), pt(1), pt(2)];
      const idx = ps.findIndex((x) => !x);
      if (idx >= 0) return missing(idx);
      if (new Set(ps).size < 3)
        return { ok: false, why: "Choose three different points." };
      return { ok: true, statement: { k: "collinear", pts: ps as string[] } };
    }
    case "interior": {
      const p = pt(0), a = asAng(obj(1));
      if (!p) return missing(0);
      if (!a) return missing(1);
      return { ok: true, statement: { k: "interior", p, ang: a } };
    }
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Props = {
  board?: Board;
  /** Extra objects selectable even when they are not in the figure. */
  extraObjects?: ObjId[];
  value: Draft;
  onChange: (d: Draft) => void;
  allowForms?: FormId[];
  /** Variables offered in the expression palette. */
  variables?: string[];
  compact?: boolean;
};

export function StatementBuilder(props: Props) {
  const d = props.value;
  const spec = formSpec(d.form);
  const inv = useMemo(
    () => figureObjects(props.board, props.extraObjects),
    [props.board, props.extraObjects],
  );
  const forms = props.allowForms
    ? FORMS.filter((f) => props.allowForms!.includes(f.id))
    : FORMS;
  const groups = [...new Set(forms.map((f) => f.group))];

  const setSlot = (i: number, v: SlotValue) =>
    props.onChange({ ...d, slots: d.slots.map((s, j) => (j === i ? v : s)) });
  const focus = (i: number) => props.onChange({ ...d, focus: i });

  const active = spec.slots[d.focus];
  const activeValue = d.slots[d.focus];

  return (
    <div className="builder">
      <div className="builder-forms" role="group" aria-label="Statement form">
        {groups.map((g) => (
          <div className="builder-formgroup" key={g}>
            <span className="builder-grouplabel">{g}</span>
            {forms
              .filter((f) => f.group === g)
              .map((f) => (
                <button
                  key={f.id}
                  className={d.form === f.id ? "chip active" : "chip"}
                  aria-pressed={d.form === f.id}
                  title={f.preview}
                  onClick={() => props.onChange(newDraft(f.id))}
                >
                  {f.label}
                </button>
              ))}
          </div>
        ))}
      </div>

      <div className="builder-slots">
        {spec.slots.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="builder-joiner">{joiner(d.form, i)}</span>}
            <button
              className={
                "slot" + (d.focus === i ? " focused" : "") +
                (filled(d.slots[i]) ? " filled" : "")
              }
              onClick={() => focus(i)}
              aria-label={s.label}
            >
              {slotText(d.slots[i]) || <em>{s.label}</em>}
            </button>
          </React.Fragment>
        ))}
        {d.form === "angleClass" && <span className="builder-joiner">angle</span>}
      </div>

      <div className="builder-palette">
        {active.kind === "expr" && activeValue.kind === "expr" && (
          <ExpressionPalette
            toks={activeValue.toks}
            inv={inv}
            variables={props.variables ?? ["x"]}
            onChange={(toks) => setSlot(d.focus, { kind: "expr", toks })}
          />
        )}
        {active.kind === "obj" && (
          <ObjectPalette
            accept={active.accept}
            inv={inv}
            selected={activeValue.kind === "obj" ? activeValue.obj : undefined}
            onPick={(obj) => {
              setSlot(d.focus, { kind: "obj", obj });
              advance();
            }}
          />
        )}
        {active.kind === "pt" && (
          <div className="palette-row">
            {inv.points.map((p) => (
              <button
                key={p}
                className={
                  "chip" +
                  (activeValue.kind === "pt" && activeValue.label === p ? " active" : "")
                }
                onClick={() => {
                  setSlot(d.focus, { kind: "pt", label: p });
                  advance();
                }}
              >
                {p}
              </button>
            ))}
            {!inv.points.length && <span className="muted">This problem has no figure points.</span>}
          </div>
        )}
        {active.kind === "class" && (
          <div className="palette-row">
            {(["acute", "right", "obtuse", "straight"] as AngleClass[]).map((c) => (
              <button
                key={c}
                className={
                  "chip" +
                  (activeValue.kind === "class" && activeValue.cls === c ? " active" : "")
                }
                onClick={() => setSlot(d.focus, { kind: "class", cls: c })}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  function advance() {
    const next = d.slots.findIndex((s, i) => i > d.focus && !filled(s));
    if (next >= 0) focus(next);
  }
}

function joiner(form: FormId, i: number) {
  switch (form) {
    case "eq": return "=";
    case "cong": return "≅";
    case "perp": return "⊥";
    case "parallel": return "∥";
    case "supp": case "comp": case "vertical":
    case "linearPair": case "adjacent": return "and";
    case "midpoint": return "is the midpoint of";
    case "bisects": return "bisects";
    case "between": return i === 1 ? "is between" : "and";
    case "collinear": return i === 2 ? "and" : ",";
    case "interior": return "is in the interior of";
    case "angleClass": return "is a";
  }
}

const filled = (s: SlotValue) =>
  s.kind === "expr" ? s.toks.length > 0
  : s.kind === "obj" ? !!s.obj
  : s.kind === "pt" ? !!s.label
  : !!s.cls;

function slotText(s: SlotValue): string {
  if (s.kind === "expr") return tokensText(s.toks);
  if (s.kind === "obj") return s.obj ? objText(s.obj) : "";
  if (s.kind === "pt") return s.label ?? "";
  return s.cls ?? "";
}

function ExpressionPalette(props: {
  toks: Tok[];
  inv: ReturnType<typeof figureObjects>;
  variables: string[];
  onChange: (t: Tok[]) => void;
}) {
  const add = (k: Tok) => {
    if (!accepts(props.toks, k)) return;
    props.onChange(push(props.toks, k));
  };
  return (
    <div className="palette">
      <div className="palette-row">
        {"0123456789".split("").map((d) => (
          <button key={d} className="chip num" onClick={() => add({ t: "num", v: d })}>
            {d}
          </button>
        ))}
        <button className="chip num" onClick={() => add({ t: "num", v: "." })}>.</button>
        {props.variables.map((v) => (
          <button key={v} className="chip var" onClick={() => add({ t: "var", name: v })}>
            {v}
          </button>
        ))}
      </div>
      <div className="palette-row">
        {(["+", "−", "×", "÷"] as const).map((op) => (
          <button key={op} className="chip op" onClick={() => add({ t: "op", op })}>
            {op}
          </button>
        ))}
        <button className="chip op" onClick={() => add({ t: "lp" })}>(</button>
        <button className="chip op" onClick={() => add({ t: "rp" })}>)</button>
        <button
          className="chip warn"
          onClick={() => props.onChange(props.toks.slice(0, -1))}
          disabled={!props.toks.length}
          aria-label="Delete last token"
        >
          ⌫
        </button>
        <button
          className="chip warn"
          onClick={() => props.onChange([])}
          disabled={!props.toks.length}
        >
          clear
        </button>
      </div>
      <div className="palette-row wrap">
        {props.inv.angles.map((a) => (
          <button
            key={"m" + a.name}
            className="chip obj"
            onClick={() => add({ t: "meas", ang: a })}
          >
            m∠{a.name}
          </button>
        ))}
        {props.inv.segments.map((s) => (
          <button
            key={"l" + s.a + s.b}
            className="chip obj"
            onClick={() => add({ t: "len", seg: s })}
          >
            {s.a}{s.b}
          </button>
        ))}
      </div>
    </div>
  );
}

function ObjectPalette(props: {
  accept: ("seg" | "ang" | "ray" | "line")[];
  inv: ReturnType<typeof figureObjects>;
  selected?: ObjId;
  onPick: (o: ObjId) => void;
}) {
  const items: ObjId[] = [
    ...(props.accept.includes("ang") ? props.inv.angles : []),
    ...(props.accept.includes("seg") ? props.inv.segments : []),
    ...(props.accept.includes("ray") ? props.inv.rays : []),
    ...(props.accept.includes("line") ? props.inv.lines : []),
  ];
  if (!items.length)
    return <span className="muted">Nothing of that kind in this figure.</span>;
  return (
    <div className="palette-row wrap">
      {items.map((o) => (
        <button
          key={objKey(o)}
          className={
            "chip obj" +
            (props.selected && objKey(props.selected) === objKey(o) ? " active" : "")
          }
          onClick={() => props.onPick(o)}
        >
          {objText(o)}
        </button>
      ))}
    </div>
  );
}

export const preview = (d: Draft) => {
  const r = buildStatement(d);
  return r.ok ? statementText(r.statement) : undefined;
};
