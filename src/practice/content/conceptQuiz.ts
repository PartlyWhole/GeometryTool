// Exercise 2: definitions → examples and examples → definitions.
//
// Questions are generated from the concept bank rather than authored one by
// one, so adding a concept adds questions in all four directions at once.
import {
  CONCEPTS,
  type Concept,
  type Example,
  termPhrase,
  topicOf,
} from "./concepts";
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

/**
 * Distractors a student could plausibly weigh: same subject and same kind
 * first, then same subject, then same kind, then anything. Offering three
 * angle terms against a segment term makes the answer obvious without
 * knowing any geometry.
 */
function siblings(r: () => number, c: Concept, n: number): Concept[] {
  const rest = CONCEPTS.filter((x) => x.id !== c.id);
  const topic = topicOf(c);
  const tiers = [
    rest.filter((x) => topicOf(x) === topic && x.kind === c.kind),
    rest.filter((x) => topicOf(x) === topic && x.kind !== c.kind),
    rest.filter((x) => topicOf(x) !== topic && x.kind === c.kind),
    rest.filter((x) => topicOf(x) !== topic && x.kind !== c.kind),
  ];
  return tiers.flatMap((t) => shuffle(r, t)).slice(0, n);
}

/**
 * What each figure genuinely shows. A figure illustrates many things at once:
 * the perpendicular figure also contains a linear pair of two right angles,
 * which are therefore supplementary. Offering one of those as a distractor
 * makes the question have two right answers, so they are excluded.
 */
export const FIGURE_SHOWS: Record<string, string[]> = {
  perpendicular: [
    "perpendicular", "right", "supplementary", "linear-pair", "adjacent",
    "between", "collinear", "midpoint", "perpendicular-bisector",
    "segment-bisector", "congruent-segments", "segment-addition",
    "angle-addition", "linear-pair-theorem", "straight",
  ],
  crossing: [
    "vertical-angles", "linear-pair", "adjacent", "supplementary", "collinear",
    "straight", "vertical-angles-theorem", "linear-pair-theorem", "acute",
    "obtuse", "angle-addition",
  ],
  fan: ["congruent-angles", "angle-addition", "adjacent", "acute"],
  collinear: ["collinear", "between", "segment-addition", "straight"],
  notBetween: ["collinear", "straight", "segment-addition"],
  midpoint: [
    "midpoint", "congruent-segments", "collinear", "between",
    "segment-addition", "segment-bisector", "straight",
  ],
  bisector: [
    "angle-bisector", "congruent-angles", "angle-addition", "adjacent", "acute",
  ],
  linearPair: [
    "linear-pair", "supplementary", "adjacent", "linear-pair-theorem",
    "collinear", "straight", "angle-addition", "acute", "obtuse",
  ],
  complementary: [
    "complementary", "right", "adjacent", "angle-addition", "acute",
    "perpendicular", "angle-bisector",
  ],
  threeOnLine: [
    "supplementary", "adjacent", "angles-around-point", "straight",
    "collinear", "angle-addition", "acute",
  ],
  markedPair: [
    "congruent-segments", "between", "collinear", "segment-addition",
  ],
  straightInDisguise: [
    "straight", "vertical-angles", "linear-pair", "supplementary", "adjacent",
    "collinear", "vertical-angles-theorem", "linear-pair-theorem", "acute",
    "obtuse", "angle-addition",
  ],
  numberedCorner: ["adjacent", "angle-addition", "acute"],
  aroundPoint: ["angles-around-point", "adjacent", "acute", "obtuse", "angle-addition"],
};

/**
 * The one concept each figure is really a picture of. "Which term does this
 * figure illustrate?" only has a single answer when the figure has a dominant
 * subject, so a figure may stand as a stem for this concept and no other. The
 * perpendicular figure, for instance, equally shows a midpoint and a linear
 * pair, and would otherwise be asked as though it showed only one of them.
 */
const FIGURE_PRIMARY: Record<string, string> = {
  perpendicular: "perpendicular",
  crossing: "vertical-angles",
  fan: "congruent-angles",
  collinear: "collinear",
  midpoint: "midpoint",
  bisector: "angle-bisector",
  linearPair: "linear-pair",
  complementary: "complementary",
  aroundPoint: "angles-around-point",
  markedPair: "congruent-segments",
  straightInDisguise: "straight",
};

/** Distractor examples, taken from as far down the candidate list as needed. */
function otherExamples(pool: Concept[], n: number): Example[] {
  const out: Example[] = [];
  for (const o of pool) {
    const e = o.examples.find((x) => x.text);
    if (e) out.push(e);
    if (out.length === n) break;
  }
  return out;
}

const exampleText = (e: Example) => e.text ?? e.caption ?? "";

/** Some examples are already quoted speech; do not quote them twice. */
const quoted = (t: string) => (/^[“"']/.test(t.trim()) ? t : "“" + t + "”");
const usable = (c: Concept) => c.examples.some((e) => e.text || e.figure);

/** The statement shown as an option; the full wording can be a reading test. */
const optionText = (c: Concept) => c.brief ?? c.definition;

/**
 * Feedback that repeats the question teaches nothing. The definition is
 * never used here: in a definition-to-term question it IS the stem, and in
 * a term-to-definition question it is the answer. Every concept carries a
 * `because` or a `watch` for this purpose, which a test enforces.
 */
const explain = (c: Concept) => [c.because, c.watch].filter(Boolean).join(" ");

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

/** Notation says the word out loud: "PQ ⊥ AB" names perpendicularity. */
const SYMBOL_WORDS: [RegExp, string][] = [
  [/⊥/g, " perpendicular "],
  [/∥/g, " parallel "],
  [/≅/g, " congruent "],
  [/∠/g, " angle "],
  [/°/g, " degrees "],
];

const spellOut = (t: string) =>
  SYMBOL_WORDS.reduce((acc, [re, word]) => acc.replace(re, word), t);

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
  const words = new Set(spellOut(text).split(/[\s,.;:—–()"'“”]+/).map(root));
  return wanted.every((w) => words.has(w));
}

/**
 * Terms that are proper names keep their capitals mid-sentence. The word can
 * sit anywhere in the name: "Multiplication Property of Equality" ends with
 * "Equality", not with "Property".
 */
const isNamedRule = (term: string) =>
  /\b(Theorem|Postulate|Property|Law)\b/.test(term);

const inSentence = (term: string) =>
  isNamedRule(term) ? term : term.charAt(0).toLowerCase() + term.slice(1);

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
  const candidates = siblings(r, c, 12);
  const others = candidates.slice(0, 3);
  if (others.length < 3) return;
  // "Which postulate says this?" hands over half the answer when two of the
  // four options are not postulates. Offer the kind-specific wording only
  // when three same-kind distractors exist to go with it.
  const sameKind = candidates.filter((o) => o.kind === c.kind);
  // Only worth restricting when the stem will actually name the kind;
  // otherwise topic similarity is the better guide.
  const kindMatched = KIND_NOUN[c.kind] !== "term" && sameKind.length >= 3;
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
    const pool = kindMatched ? sameKind.slice(0, 3) : others;
    const choices = shuffle(r, [
      { text: c.term },
      ...pool.map((o) => ({ text: o.term })),
    ]);
    return {
      ...base,
      prompt:
        (noun === "term" || !kindMatched
          ? "Which of these does this define? "
          : "Which " + noun + " says this? ") + quoted(c.definition),
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
      // A named rule is stated, not defined: "What does the Law of Syllogism
      // say?" rather than "Which statement defines Law of Syllogism?".
      prompt: isNamedRule(c.term)
        ? "What does the " + c.term + " say?"
        : "Which statement defines " + termPhrase(c) + "?",
      choices,
      correct: choices.findIndex((x) => x.text === optionText(c)),
    };
  }

  if (kind === "example-to-term") {
    const pool = c.examples.filter(
      (e) =>
        (e.text || (e.figure && FIGURE_PRIMARY[e.figure] === c.id)) &&
        !givesItAway(exampleText(e), c.term),
    );
    if (!pool.length) return;
    const ex = pool[Math.floor(r() * pool.length)];
    // A figure shows several things at once, so a distractor that is also
    // true of it would give the question two right answers.
    const alsoShown = ex.figure ? (FIGURE_SHOWS[ex.figure] ?? []) : [];
    const safe = candidates.filter(
      (o) => o.id !== c.id && !alsoShown.includes(o.id),
    );
    if (safe.length < 3) return;
    const choices = shuffle(r, [
      { text: c.term },
      ...safe.slice(0, 3).map((o) => ({ text: o.term })),
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
  const wrong = otherExamples(candidates, 3);
  if (wrong.length < 3) return;
  const choices = shuffle(r, [
    { text: ex.text! },
    ...wrong.slice(0, 3).map((e) => ({ text: e.text! })),
  ]);
  return {
    ...base,
    // A named rule takes the definite article: "an example of the Vertical
    // Angles Theorem", not "an example of Vertical Angles Theorem".
    prompt: "Which of these is an example of " + termPhrase(c) + "?",
    choices,
    correct: choices.findIndex((x) => x.text === ex.text),
  };
}

