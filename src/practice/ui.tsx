// Small shared pieces of the practice interface.
import React from "react";
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

export type Page = "board" | "practice" | "cards";

export function PageNav(props: {
  value: Page;
  onChange: (p: Page) => void;
  compact?: boolean;
}) {
  const items: { id: Page; label: string; icon: string }[] = [
    { id: "board", label: "Board", icon: "◇" },
    { id: "practice", label: "Practice", icon: "◎" },
    { id: "cards", label: "Cards", icon: "▤" },
  ];
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
    </nav>
  );
}
