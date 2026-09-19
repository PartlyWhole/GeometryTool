// Exercise 2: definitions → examples and examples → definitions.
//
// Questions are generated from the concept bank rather than authored one by
// one, so adding a concept adds questions in all four directions at once.
import { CONCEPTS, type Concept, type Example } from "./concepts";
import { rng } from "./generators";

export type Choice = { text: string; figure?: string; caption?: string };

export type ConceptQuestion = {
  id: string;
  conceptId: string;
  kind: "def-to-term" | "term-to-def" | "example-to-term" | "term-to-example";
  prompt: string;
  /** Diagram shown with the question stem, when the stem is an example. */
  figure?: string;
  caption?: string;
  choices: Choice[];
  correct: number;
  why: string;
  watch?: string;
};

const shuffle = <T>(r: () => number, xs: T[]) => {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Prefer distractors of the same kind — they are the ones actually confused. */
function siblings(r: () => number, c: Concept, n: number): Concept[] {
  const same = CONCEPTS.filter((x) => x.id !== c.id && x.kind === c.kind);
  const rest = CONCEPTS.filter((x) => x.id !== c.id && x.kind !== c.kind);
  return [...shuffle(r, same), ...shuffle(r, rest)].slice(0, n);
}

const exampleText = (e: Example) => e.text ?? e.caption ?? "";

/** Some examples are already quoted speech; do not quote them twice. */
const quoted = (t: string) => (/^[“"']/.test(t.trim()) ? t : "“" + t + "”");
const usable = (c: Concept) => c.examples.some((e) => e.text || e.figure);

/** The statement shown as an option; the full wording can be a reading test. */
const optionText = (c: Concept) => c.brief ?? c.definition;

/** Feedback that repeats the chosen answer teaches nothing. */
const explain = (c: Concept) =>
  [c.because ?? c.definition, c.watch].filter(Boolean).join(" ");

/**
 * A crude root, enough to see that two words are the same idea: drop a
 * trailing plural "s", then keep the first six letters. That makes
 * congruent/congruence and supplement/supplementary agree, while keeping
 * line/linear and vertex/vertical apart.
 */
const root = (w: string) => {
  const bare = w.toLowerCase().replace(/[^a-z]/g, "").replace(/s$/, "");
  return bare.slice(0, 6);
};

/** Words too common across the module to carry any signal. */
const STOP = new Set(
  ["of", "the", "a", "an", "and", "or", "to", "in", "on", "property",
   "theorem", "postulate", "law", "reasoning", "angle", "angles"].map(root),
);

/**
 * Does this text hand the answer over by restating the term? "Which term does
 * this define? 'If two angles form a linear pair, they are supplementary.'" is
 * not a question about the Linear Pair Theorem, it is a spot-the-phrase task.
 *
 * "angle(s)" is a stop word here: nearly every term and definition in the
 * module contains it, so counting it would suppress good questions.
 */
export function givesItAway(text: string, term: string): boolean {
  const wanted = term
    .split(/[\s,]+/)
    .map(root)
    .filter((w) => w.length > 2 && !STOP.has(w));
  if (!wanted.length) return false;
  const words = new Set(text.split(/[\s,.;:—–()"'“”]+/).map(root));
  return wanted.every((w) => words.has(w));
}

/** Terms that are proper names keep their capitals mid-sentence. */
const inSentence = (term: string) =>
  /(Theorem|Postulate|Property)$/.test(term) || /^Law of /.test(term)
    ? term
    : term.charAt(0).toLowerCase() + term.slice(1);

const KIND_NOUN: Record<Concept["kind"], string> = {
  "undefined term": "term",
  definition: "term",
  postulate: "postulate",
  property: "property",
  theorem: "theorem",
  reasoning: "term",
};

export function conceptQuestions(seed: number, count = 12): ConceptQuestion[] {
  const r = rng(seed);
  const pool = shuffle(r, CONCEPTS.filter(usable));
  const out: ConceptQuestion[] = [];
  let i = 0;
  while (out.length < count && i < pool.length * 4) {
    const c = pool[i % pool.length];
    i++;
    const kinds: ConceptQuestion["kind"][] = [
      "def-to-term",
      "term-to-def",
      "example-to-term",
      "term-to-example",
    ];
    const kind = kinds[Math.floor(r() * kinds.length)];
    const q = build(r, c, kind);
    if (q && !out.some((o) => o.id === q.id)) out.push(q);
  }
  return out;
}

function build(
  r: () => number,
  c: Concept,
  kind: ConceptQuestion["kind"],
): ConceptQuestion | undefined {
  const others = siblings(r, c, 3);
  if (others.length < 3) return;
  const base = {
    conceptId: c.id,
    kind,
    id: c.id + ":" + kind,
    why: explain(c),
    watch: c.watch,
  };
  const noun = KIND_NOUN[c.kind];

  // Both definition directions are unusable when the definition restates the
  // term. Such concepts are still reachable through their examples.
  if (
    (kind === "def-to-term" || kind === "term-to-def") &&
    givesItAway(c.definition, c.term)
  )
    return;

  if (kind === "def-to-term") {
    const choices = shuffle(r, [
      { text: c.term },
      ...others.map((o) => ({ text: o.term })),
    ]);
    return {
      ...base,
      prompt:
        (noun === "term" ? "Which term does this define? " : "Which " + noun + " says this? ") +
        quoted(c.definition),
      choices,
      correct: choices.findIndex((x) => x.text === c.term),
    };
  }

  if (kind === "term-to-def") {
    const choices = shuffle(r, [
      { text: optionText(c) },
      ...others.map((o) => ({ text: optionText(o) })),
    ]);
    return {
      ...base,
      prompt:
        c.kind === "theorem" || c.kind === "postulate"
          ? "What does the " + c.term + " say?"
          : "Which statement defines " + inSentence(c.term) + "?",
      choices,
      correct: choices.findIndex((x) => x.text === optionText(c)),
    };
  }

  if (kind === "example-to-term") {
    const pool = c.examples.filter(
      (e) => (e.text || e.figure) && !givesItAway(exampleText(e), c.term),
    );
    if (!pool.length) return;
    const ex = pool[Math.floor(r() * pool.length)];
    const choices = shuffle(r, [
      { text: c.term },
      ...others.map((o) => ({ text: o.term })),
    ]);
    return {
      ...base,
      prompt: ex.figure
        ? "Which " + noun + " does this figure illustrate?"
        : "Which " + noun + " does this illustrate? " + quoted(exampleText(ex)),
      figure: ex.figure,
      caption: ex.figure ? ex.caption : undefined,
      choices,
      correct: choices.findIndex((x) => x.text === c.term),
    };
  }

  // term-to-example
  const mine = c.examples.filter(
    (e) => e.text && !givesItAway(e.text, c.term),
  );
  if (!mine.length) return;
  const ex = mine[Math.floor(r() * mine.length)];
  const wrong = others
    .map((o) => o.examples.find((e) => e.text))
    .filter((e): e is Example => !!e?.text);
  if (wrong.length < 3) return;
  const choices = shuffle(r, [
    { text: ex.text! },
    ...wrong.slice(0, 3).map((e) => ({ text: e.text! })),
  ]);
  return {
    ...base,
    prompt: "Which of these is an example of " + inSentence(c.term) + "?",
    choices,
    correct: choices.findIndex((x) => x.text === ex.text),
  };
}

