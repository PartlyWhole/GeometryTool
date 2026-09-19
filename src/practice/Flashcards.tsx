// The flashcards page: a logic deck of multiple-choice cards, and a
// definitions deck of flip cards that can carry a diagram.
import React, { useMemo, useState } from "react";
import { Figure } from "./Figure";
import { CONCEPTS, type Concept } from "./content/concepts";
import { LIBRARY } from "./content/library";
import { type LogicCard, logicCards } from "./content/logicCards";
import { type Tally, loadTally, record, saveTally } from "./progress";
import { Scoreboard, Tabs, Verdict } from "./ui";

type Deck = "logic" | "definitions";

export function Flashcards() {
  const [deck, setDeck] = useState<Deck>("logic");
  return (
    <div className="page flashcards">
      <header className="page-head">
        <div>
          <h1>Flashcards</h1>
          <p className="muted">
            {deck === "logic"
              ? "Conditional statements, equivalence, negation and the two laws of deduction."
              : "Properties, postulates and definitions — with the figure that makes each obvious."}
          </p>
        </div>
        <Tabs
          label="Deck"
          value={deck}
          onChange={setDeck}
          options={[
            { id: "logic", label: "Logic and statements" },
            { id: "definitions", label: "Definitions and postulates" },
          ]}
        />
      </header>
      {deck === "logic" ? <LogicDeck /> : <DefinitionDeck />}
    </div>
  );
}

function LogicDeck() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const cards = useMemo(() => logicCards(seed, 16), [seed]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [tally, setTally] = useState<Tally>(() => loadTally("logic"));

  const card: LogicCard | undefined = cards[i];
  if (!card) return <p className="muted">No cards.</p>;

  const answer = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    const t = record(tally, n === card.correct);
    setTally(t);
    saveTally("logic", t);
  };

  const next = () => {
    setPicked(null);
    if (i + 1 < cards.length) setI(i + 1);
    else {
      setSeed(Math.floor(Math.random() * 1e9));
      setI(0);
    }
  };

  return (
    <div className="deck">
      <div className="deck-bar">
        <span className="tag">{card.tag}</span>
        <span className="muted small">Card {i + 1} of {cards.length}</span>
        <Scoreboard tally={tally} />
      </div>

      <article className="card">
        {card.context && (
          <div className="card-context">
            {card.context.map((line, n) => (
              <p key={n}>{line}</p>
            ))}
          </div>
        )}
        <h2 className="card-prompt">{card.prompt}</h2>
        <div className="choices tall">
          {card.choices.map((c, n) => (
            <button
              key={n}
              className={
                "choice" +
                (picked === n ? " picked" : "") +
                (picked !== null && n === card.correct ? " right" : "") +
                (picked === n && n !== card.correct ? " wrong" : "")
              }
              disabled={picked !== null}
              onClick={() => answer(n)}
            >
              <span className="choice-letter">{"ABCD"[n]}</span>
              <span>{c}</span>
            </button>
          ))}
        </div>
        {picked !== null && (
          <>
            <Verdict ok={picked === card.correct}>{card.why}</Verdict>
            <div className="row">
              <button className="primary" onClick={next}>Next card</button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}

const KINDS = [
  { id: "all", label: "Everything" },
  { id: "definition", label: "Definitions" },
  { id: "postulate", label: "Postulates" },
  { id: "property", label: "Properties" },
  { id: "theorem", label: "Theorems" },
  { id: "reasoning", label: "Reasoning" },
] as const;

function DefinitionDeck() {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const [side, setSide] = useState<"term" | "definition">("term");
  const pool = useMemo(
    () => CONCEPTS.filter((c) => kind === "all" || c.kind === kind),
    [kind],
  );
  const [order, setOrder] = useState<number[]>(() => pool.map((_, i) => i));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [again, setAgain] = useState<string[]>([]);

  // Rebuild the running order whenever the filter changes.
  const poolKey = kind + ":" + pool.length;
  const lastKey = React.useRef(poolKey);
  if (lastKey.current !== poolKey) {
    lastKey.current = poolKey;
    setOrder(pool.map((_, n) => n));
    setI(0);
    setFlipped(false);
    setAgain([]);
  }

  const c: Concept | undefined = pool[order[i] ?? 0];
  if (!c) return <p className="muted">No cards in this filter.</p>;

  const make = c.examples.find((e) => e.figure)?.figure;
  const caption = c.examples.find((e) => e.figure)?.caption;

  const advance = (knew: boolean) => {
    if (!knew) setAgain((a) => (a.includes(c.id) ? a : [...a, c.id]));
    setFlipped(false);
    if (i + 1 < order.length) setI(i + 1);
    else {
      // Second pass over the ones marked "again".
      const repeat = pool
        .map((x, n) => (again.includes(x.id) || (!knew && x.id === c.id) ? n : -1))
        .filter((n) => n >= 0);
      if (repeat.length) {
        setOrder(repeat);
        setAgain([]);
        setI(0);
      } else {
        setOrder(shuffled(pool.length));
        setI(0);
      }
    }
  };

  return (
    <div className="deck">
      <div className="deck-bar wrap">
        <div className="filterrow">
          {KINDS.map((k) => (
            <button
              key={k.id}
              className={kind === k.id ? "chip active" : "chip"}
              onClick={() => setKind(k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="filterrow">
          <span className="muted small">Front:</span>
          {(["term", "definition"] as const).map((s) => (
            <button
              key={s}
              className={side === s ? "chip active" : "chip"}
              onClick={() => { setSide(s); setFlipped(false); }}
            >
              {s === "term" ? "Term" : "Definition"}
            </button>
          ))}
          <span className="muted small">
            {i + 1} of {order.length}
            {again.length > 0 && ` · ${again.length} to revisit`}
          </span>
        </div>
      </div>

      <article
        className={"card flip" + (flipped ? " flipped" : "")}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        aria-label={flipped ? "Back of card. Press to flip." : "Front of card. Press to flip."}
      >
        <span className="card-kind">{c.kind} · {c.section}</span>
        {!flipped ? (
          <h2 className="card-front">
            {side === "term" ? c.term : c.definition}
          </h2>
        ) : (
          <div className="card-back">
            <h2>{side === "term" ? c.definition : c.term}</h2>
            {make && (
              <>
                <Figure board={LIBRARY[make]()} height={220} ariaLabel={caption ?? c.term} />
                {caption && <p className="figure-caption">{caption}</p>}
              </>
            )}
            {c.examples.filter((e) => e.text).length > 0 && (
              <ul className="card-examples">
                {c.examples.filter((e) => e.text).map((e, n) => (
                  <li key={n}>{e.text}</li>
                ))}
              </ul>
            )}
            {c.watch && <p className="card-watch">Watch out: {c.watch}</p>}
          </div>
        )}
        <span className="card-flip-hint">
          {flipped ? "Click to flip back" : "Click to reveal"}
        </span>
      </article>

      <div className="row centered">
        {flipped ? (
          <>
            <button onClick={() => advance(false)}>Show again</button>
            <button className="primary" onClick={() => advance(true)}>Got it</button>
          </>
        ) : (
          <button className="primary" onClick={() => setFlipped(true)}>Reveal</button>
        )}
      </div>
    </div>
  );
}

function shuffled(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
