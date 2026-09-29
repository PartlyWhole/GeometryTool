// Small shared pieces of the practice interface.
import React from "react";
import type { DotState } from "./deck";
import { type Tally, percent } from "./progress";

export function Scoreboard(props: { tally: Tally }) {
  const t = props.tally;
  return (
    <div className="scoreboard" aria-live="polite">
      <span className="score-main">
        {t.correct}<span className="score-sep">/</span>{t.attempted}
      </span>
      {t.attempted > 0 && <span className="score-pct">{percent(t)}%</span>}
      {t.streak >= 3 && <span className="score-streak">{t.streak} in a row</span>}
    </div>
  );
}

export function Verdict(props: {
  ok: boolean | null;
  children: React.ReactNode;
  title?: string;
}) {
  if (props.ok === null) return null;
  return (
    <div
      className={"verdict " + (props.ok ? "right" : "wrong")}
      role="status"
      aria-live="polite"
    >
      <strong>{props.title ?? (props.ok ? "Correct" : "Not yet")}</strong>
      <span>{props.children}</span>
    </div>
  );
}

export function Tabs<T extends string>(props: {
  value: T;
  options: { id: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="tabs" role="tablist" aria-label={props.label}>
      {props.options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={props.value === o.id}
          title={o.hint}
          className={props.value === o.id ? "tab active" : "tab"}
          onClick={() => props.onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Hints(props: { hints?: string[]; shown: number; onMore: () => void }) {
  const hints = props.hints ?? [];
  if (!hints.length) return null;
  return (
    <div className="hints">
      {hints.slice(0, props.shown).map((h, i) => (
        <p key={i} className="hint">
          <span className="hint-n">{i + 1}</span>
          {h}
        </p>
      ))}
      {props.shown < hints.length && (
        <button className="link" onClick={props.onMore}>
          {props.shown === 0 ? "Give me a hint" : "Another hint"}
        </button>
      )}
    </div>
  );
}

/**
 * Moving about inside a set of items: back, forward, and a strip of dots for
 * jumping straight to one — which is how you find the question you got wrong
 * three ago. The arrows carry no words, so they never compete with the
 * primary "Next" an exercise offers once you have answered.
 */
export function ItemNav(props: {
  i: number;
  count: number;
  onGo: (n: number) => void;
  onBack: () => void;
  onForward: () => void;
  /** What one item is called here: "Question", "Card", "Task", "Proof". */
  noun?: string;
  /** Shown on the forward button at the last item, e.g. "New set". */
  endLabel?: string;
  /** One entry per item: how each dot should read. Omit for no strip. */
  marks?: DotState[];
  children?: React.ReactNode;
}) {
  const noun = props.noun ?? "Question";
  const atEnd = props.i >= props.count - 1;

  // Arrow keys, so a student reviewing a set is not hunting for a button.
  // Kept in a ref: rebinding the listener on every keystroke-free render is
  // pointless churn.
  const live = React.useRef(props);
  live.current = props;
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      // Arrows belong to the control the student is actually in.
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (t?.isContentEditable) return;
      if (e.key === "ArrowLeft") {
        if (live.current.i === 0) return;
        e.preventDefault();
        live.current.onBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        live.current.onForward();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="itemnav">
      <button
        className="itemnav-btn"
        onClick={props.onBack}
        disabled={props.i === 0}
        title={"Previous " + noun.toLowerCase() + " (←)"}
        aria-label={"Previous " + noun.toLowerCase()}
      >
        ‹
      </button>
      <span className="itemnav-at" aria-live="polite">
        {noun} <b>{props.i + 1}</b> of {props.count}
      </span>
      <button
        className={"itemnav-btn" + (atEnd && props.endLabel ? " wide" : "")}
        onClick={props.onForward}
        title={
          atEnd
            ? (props.endLabel ?? "Back to the first " + noun.toLowerCase()) + " (→)"
            : "Next " + noun.toLowerCase() + " (→)"
        }
        aria-label={atEnd ? (props.endLabel ?? "Start again") : "Next " + noun.toLowerCase()}
      >
        {atEnd && props.endLabel ? props.endLabel : "›"}
      </button>
      {props.marks && props.marks.length > 1 && (
        <div className="itemdots">
          {props.marks.map((m, n) => (
            <button
              key={n}
              className={"itemdot " + m + (n === props.i ? " at" : "")}
              onClick={() => props.onGo(n)}
              aria-current={n === props.i ? "true" : undefined}
              aria-label={
                noun +
                " " +
                (n + 1) +
                (m === "open" ? "" : m === "right" ? ", correct" : ", wrong")
              }
              title={
                noun +
                " " +
                (n + 1) +
                (m === "open" ? "" : m === "right" ? " — correct" : " — wrong")
              }
            />
          ))}
        </div>
      )}
      {props.children}
    </div>
  );
}

declare const __BUILD_ID__: string;

/** Shown small at the foot of a page, to identify a cached build. */
export function BuildStamp() {
  const id = typeof __BUILD_ID__ === "string" ? __BUILD_ID__ : "dev";
  return <p className="buildstamp">Build {id}</p>;
}

export type Page = "board" | "path" | "concepts" | "practice" | "cards";

/** Which module's material the Concepts, Practice and Cards pages show. */
export type Module = 2 | 3;

/**
 * What the app shows. Module 2 and the whiteboard are still built, tested and
 * one edit away; while Module 3 is the focus they are simply not offered.
 * With one module shown there is no module switch, and chapters are
 * numbered from 1 within it.
 */
export const SHOWN_MODULES: Module[] = [3];
export const SHOW_BOARD = false;

/**
 * The path is the way through; the three study pages are kept as a Library
 * for looking something up or practising freely.
 */
export const SHOW_PATH = true;

export function ModuleSwitch(props: { value: Module; onChange: (m: Module) => void }) {
  const items: { id: Module; label: string; hint: string }[] = [
    { id: 2, label: "Module 2", hint: "Points, segments, angles, reasoning and proof" },
    { id: 3, label: "Module 3", hint: "Parallel lines cut by a transversal" },
  ];
  return (
    <div className="moduleswitch" role="radiogroup" aria-label="Module">
      {items.map((it) => (
        <button
          key={it.id}
          role="radio"
          aria-checked={props.value === it.id}
          className={props.value === it.id ? "active" : ""}
          title={it.hint}
          onClick={() => props.onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function PageNav(props: {
  value: Page;
  onChange: (p: Page) => void;
  compact?: boolean;
}) {
  const library: { id: Page; label: string; icon: string }[] = [
    { id: "concepts", label: "Concepts", icon: "◈" },
    { id: "practice", label: "Practice", icon: "◎" },
    { id: "cards", label: "Cards", icon: "▤" },
  ];
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  // A click anywhere else, or Escape, closes the menu.
  React.useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  const items: { id: Page; label: string; icon: string }[] = [
    { id: "board" as Page, label: "Board", icon: "◇" },
    ...(SHOW_PATH ? [{ id: "path" as Page, label: "Path", icon: "◉" }] : library),
  ].filter((it) => SHOW_BOARD || it.id !== "board");
  const inLibrary = library.find((l) => l.id === props.value);
  return (
    <nav
      className={"pagenav" + (props.compact ? " compact" : "")}
      aria-label="Section"
    >
      {items.map((it) => (
        <button
          key={it.id}
          className={props.value === it.id ? "active" : ""}
          aria-current={props.value === it.id ? "page" : undefined}
          onClick={() => props.onChange(it.id)}
          title={it.label}
        >
          <span aria-hidden="true">{it.icon}</span>
          <span className="pagenav-label">{it.label}</span>
        </button>
      ))}
      {SHOW_PATH && (
        <div className="pagenav-library" ref={menuRef}>
          <button
            className={inLibrary ? "active" : ""}
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true">▤</span>
            <span className="pagenav-label">{inLibrary ? "Library · " + inLibrary.label : "Library"} ▾</span>
          </button>
          {open && (
            <div className="pagenav-menu" role="menu">
              {library.map((it) => (
                <button
                  key={it.id}
                  role="menuitem"
                  className={props.value === it.id ? "active" : ""}
                  onClick={() => {
                    setOpen(false);
                    props.onChange(it.id);
                  }}
                >
                  <span aria-hidden="true">{it.icon}</span> {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
