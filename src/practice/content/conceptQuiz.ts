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
const usable = (c: Concept) => c.examples.some((e) => e.text || e.figure);

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
    why: c.definition + (c.watch ? " " + c.watch : ""),
    watch: c.watch,
  };

  if (kind === "def-to-term") {
    const choices = shuffle(r, [
      { text: c.term },
      ...others.map((o) => ({ text: o.term })),
    ]);
    return {
      ...base,
      prompt: "Which term does this define? “" + c.definition + "”",
      choices,
      correct: choices.findIndex((x) => x.text === c.term),
    };
  }

  if (kind === "term-to-def") {
    const choices = shuffle(r, [
      { text: c.definition },
      ...others.map((o) => ({ text: o.definition })),
    ]);
    return {
      ...base,
      prompt: "Which statement defines " + lower(c.term) + "?",
      choices,
      correct: choices.findIndex((x) => x.text === c.definition),
    };
  }

  if (kind === "example-to-term") {
    const ex = c.examples[Math.floor(r() * c.examples.length)];
    if (!ex.text && !ex.figure) return;
    const choices = shuffle(r, [
      { text: c.term },
      ...others.map((o) => ({ text: o.term })),
    ]);
    return {
      ...base,
      prompt: ex.figure
        ? "Which term does this figure illustrate?"
        : "Which term does this illustrate? “" + exampleText(ex) + "”",
      figure: ex.figure,
      caption: ex.figure ? ex.caption : undefined,
      choices,
      correct: choices.findIndex((x) => x.text === c.term),
    };
  }

  // term-to-example
  const mine = c.examples.filter((e) => e.text);
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
    prompt: "Which of these is an example of " + lower(c.term) + "?",
    choices,
    correct: choices.findIndex((x) => x.text === ex.text),
  };
}

const lower = (term: string) =>
  /^[A-Z][a-z]/.test(term) && !/^[A-Z]\w*\s(Property|Postulate|Theorem)/.test(term)
    ? term.charAt(0).toLowerCase() + term.slice(1)
    : term;
