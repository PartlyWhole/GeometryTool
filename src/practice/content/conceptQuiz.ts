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
 * What sort of thing a concept is about. A student who cannot tell a ray from
 * a pair of angles still answers "which of these does this define?" correctly
 * when the other three options are the wrong sort of thing, so this is what
 * distractors are matched on first: a definition of a ray set against three
 * angle-size classes is a question about grammar, not about geometry.
 */
export type Subject =
  | "angle" // one angle, classified by how big it is
  | "angle-pair" // two or more angles taken together
  | "line" // a line, ray or segment, named by how it meets another
  | "segment" // points, and the segments they determine
  | "equality" // a property of equality
  | "argument"; // a form of reasoning

/** The three the rule below cannot read off the wording. */
const SUBJECT: Record<string, Subject> = {
  // "Two lines, rays or segments that meet at right angles" is about the
  // lines, not about the angles the phrase happens to name.
  perpendicular: "line",
  // Adjacent parts and the whole they make: several angles, not one.
  "angle-addition": "angle-pair",
  proof: "argument",
};

export function subjectOf(c: Concept): Subject {
  const tagged = SUBJECT[c.id];
  if (tagged) return tagged;
  if (c.kind === "property") return "equality";
  if (c.kind === "reasoning") return "argument";
  const text = c.term + " " + c.definition;
  if (/bisect/i.test(text)) return "line";
  if (/\bangles\b/i.test(text)) return "angle-pair";
  if (/\bangle\b/i.test(text)) return "angle";
  return "segment";
}

/**
 * Distractors a student could plausibly weigh. Three of the four directions
 * offer terms or definitions, where the first question a student asks is
 * which options are even the right sort of thing, so those lead with the
 * subject: same subject and same kind first, then same subject, then the
 * topic, then anything. The fourth offers siblings' own example sentences,
 * whose sharpest near-misses come from the same topic — the midpoint set
 * against the segment bisector — so there the subject is the backstop.
 */
function siblings(
  r: () => number,
  c: Concept,
  n: number,
  lead: "subject" | "topic" = "subject",
): Concept[] {
  const rest = CONCEPTS.filter((x) => x.id !== c.id);
  const subject = subjectOf(c);
  const topic = topicOf(c);
  const sameSubject = (x: Concept) => subjectOf(x) === subject;
  const sameTopic = (x: Concept) => topicOf(x) === topic;
  const tiers =
    lead === "subject"
      ? [
          rest.filter((x) => sameSubject(x) && x.kind === c.kind),
          rest.filter((x) => sameSubject(x) && x.kind !== c.kind),
          rest.filter((x) => !sameSubject(x) && sameTopic(x)),
          rest.filter((x) => !sameSubject(x) && !sameTopic(x)),
        ]
      : [
          rest.filter((x) => sameTopic(x) && sameSubject(x)),
          rest.filter((x) => sameTopic(x) && !sameSubject(x)),
          rest.filter((x) => !sameTopic(x) && sameSubject(x)),
          rest.filter((x) => !sameTopic(x) && !sameSubject(x)),
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
    "collinear", "midpoint", "perpendicular-bisector",
    "segment-bisector", "congruent-segments", "segment-addition",
    "angle-addition", "linear-pair-theorem", "straight",
  ],
  crossing: [
    "vertical-angles", "linear-pair", "adjacent", "supplementary", "collinear",
    "straight", "vertical-angles-theorem", "linear-pair-theorem", "acute",
    "obtuse", "angle-addition",
  ],
  fan: ["congruent-angles", "angle-addition", "adjacent", "acute"],
  collinear: ["collinear", "segment-addition", "straight"],
  notBetween: ["collinear", "straight", "segment-addition"],
  midpoint: [
    "midpoint", "congruent-segments", "collinear",
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
    "congruent-segments", "collinear", "segment-addition",
  ],
  straightInDisguise: [
    "straight", "vertical-angles", "linear-pair", "supplementary", "adjacent",
    "collinear", "vertical-angles-theorem", "linear-pair-theorem", "acute",
    "obtuse", "angle-addition",
  ],
  numberedCorner: ["adjacent", "angle-addition", "acute"],
  aroundPoint: ["angles-around-point", "adjacent", "acute", "obtuse", "angle-addition"],
  congruentComplements: [
    "congruent-complements", "complementary", "adjacent", "right",
    "congruent-angles", "angle-addition", "acute", "perpendicular",
  ],
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
  congruentComplements: "congruent-complements",
};

/**
 * Is this sentence an instance, or a remark about the concept? An instance
 * points at something — a measure, a named point, a quoted claim — while
 * "three is the first interesting case" is a note to the reader. A remark
 * standing among three self-contained statements is the only option of its
 * grammatical type, which decides the question without any geometry.
 */
const isInstance = (t: string) =>
  /[∠°≅⊥=]|\d|\b[A-Z]{2}\b/.test(t) || /^\s*[“"']/.test(t.trim());

/**
 * Distractor examples, taken from as far down the candidate list as needed.
 * `prefer` puts a class of option first without insisting on it.
 */
function otherExamples(
  pool: Concept[],
  n: number,
  prefer?: (t: string) => boolean,
): Example[] {
  const found = pool
    .map((o) => o.examples.find((x) => x.text && isInstance(x.text)))
    .filter((e): e is Example => !!e);
  const ordered = prefer
    ? [...found.filter((e) => prefer(e.text!)), ...found.filter((e) => !prefer(e.text!))]
    : found;
  return ordered.slice(0, n);
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
const standingNote = (c: Concept) =>
  [c.because, c.watch].filter(Boolean).join(" ");

/**
 * A `because` and a `watch` are written for the concept, not for a question,
 * so they answer what was asked only by luck: a tip about finding the
 * straight line first to save arithmetic turns up as the explanation for a
 * figure question that asks no arithmetic, and one concept asked two ways
 * gets the same paragraph twice. Where the standing note does not fit the
 * question the kind poses, the line below replaces it. The Naming exercise's
 * `label` and `points` forms build their explanation per item; this is the
 * same move, one table wide.
 */
const REBUTTAL: Record<
  string,
  Partial<Record<ConceptQuestion["kind"], string>>
> = {
  "angles-around-point": {
    "example-to-term":
      "The angles go once around the vertex and close the full turn, so they total 360°. Adding adjacent parts is the other move available at a shared vertex, and it stops at the whole angle those parts make, not at a full turn.",
  },
  "segment-addition": {
    // The standing note's subtraction disguise belongs to the example
    // question; what a quoted definition raises is its hypothesis.
    "def-to-term":
      "Collinearity alone is not enough: B has to lie on AC, between A and C. That hypothesis is where every counterexample to this postulate is built.",
  },
  collinear: {
    "term-to-example":
      "Collinear is about where points sit, not how many of them there are: points are collinear exactly when one line passes through them all.",
  },
  "segment-bisector": {
    "term-to-example":
      "A midpoint is a point; a bisector is the line, ray or segment through it. Halving the segment is what the two have in common, so what the question turns on is which of them does the cutting.",
  },
  "addition-property": {
    "term-to-example":
      "Adding the same amount to both sides keeps them equal. An addition sign is not enough to make it this property: replacing a length by its value inside a sum adds nothing to either side, it swaps one name for another, and that is substitution.",
  },
};

const explain = (c: Concept, kind: ConceptQuestion["kind"]) =>
  REBUTTAL[c.id]?.[kind] ?? standingNote(c);

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
const termRoots = (term: string) =>
  term
    .split(/[\s,]+/)
    .map(root)
    .filter((w) => w.length > 2 && !STOP.has(w));

const rootsOf = (text: string) =>
  new Set(spellOut(text).split(/[\s,.;:—–()"'“”]+/).map(root));

export function givesItAway(text: string, term: string): boolean {
  const wanted = termRoots(term);
  if (!wanted.length) return false;
  const words = rootsOf(text);
  return wanted.every((w) => words.has(w));
}

/**
 * Does this sentence use the term's own vocabulary? Saying the whole term is
 * a giveaway wherever it appears; saying one word of it matters only by
 * comparison. "A ray drawn through the midpoint of AB bisects it" is the only
 * option in its set containing "bisects", so it can be matched on the word
 * with the concept unknown — where "55° and 35° are complementary" sits
 * beside a sibling that says "complementary" too, and nothing is given away.
 */
function carriesTerm(text: string, term: string): boolean {
  const words = rootsOf(text);
  return termRoots(term).some((w) => words.has(w));
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
  definition: "term",
  postulate: "postulate",
  property: "property",
  theorem: "theorem",
  reasoning: "term",
};

/**
 * May the stem name the kind? "Which postulate says this?" hands over half
 * the answer when two of the four options are not postulates, so the wording
 * waits until three same-kind distractors are there to go with it — and
 * "term" is no help to anyone, so those questions never use it.
 *
 * Whether the options are matched by TYPE is a separate question, answered
 * for every direction alike by `siblings`. One flag used to do both jobs, and
 * because definitions have no kind noun of their own, the concepts that most
 * needed type-matched options were the ones getting none.
 */
const namesKind = (c: Concept, pool: Concept[]) =>
  KIND_NOUN[c.kind] !== "term" &&
  pool.filter((o) => o.kind === c.kind).length >= 3;

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
  const candidates = siblings(
    r,
    c,
    12,
    kind === "term-to-example" ? "topic" : "subject",
  );
  const others = candidates.slice(0, 3);
  if (others.length < 3) return;
  const base = {
    conceptId: c.id,
    kind,
    id: c.id + ":" + kind,
    why: explain(c, kind),
    watch: c.watch,
  };
  const noun = KIND_NOUN[c.kind];
  const verb = "define";

  // Both definition directions are unusable when the definition restates the
  // term. Such concepts are still reachable through their examples.
  if (
    (kind === "def-to-term" || kind === "term-to-def") &&
    givesItAway(c.definition, c.term)
  )
    return;

  if (kind === "def-to-term") {
    const named = namesKind(c, candidates);
    const pool = named
      ? candidates.filter((o) => o.kind === c.kind).slice(0, 3)
      : others;
    const choices = shuffle(r, [
      { text: c.term },
      ...pool.map((o) => ({ text: o.term })),
    ]);
    return {
      ...base,
      prompt:
        (named
          ? "Which " + noun + " says this? "
          : `Which of these does this ${verb}? `) + quoted(c.definition),
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
        : `Which statement ${verb}s ` + termPhrase(c) + "?",
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
    // Whatever the figure ruled out has gone; the stem may name the kind only
    // if what is left can still fill the options with it.
    const named = namesKind(c, safe);
    const options = named ? safe.filter((o) => o.kind === c.kind) : safe;
    const asks = named ? "Which " + noun : "Which of these";
    const choices = shuffle(r, [
      { text: c.term },
      ...options.slice(0, 3).map((o) => ({ text: o.term })),
    ]);
    return {
      ...base,
      prompt: ex.figure
        ? asks + " does this figure illustrate?"
        : asks + " does this illustrate? " + quoted(exampleText(ex)),
      figure: ex.figure,
      caption: ex.figure ? ex.caption : undefined,
      choices,
      correct: choices.findIndex((x) => x.text === c.term),
    };
  }

  // term-to-example
  const mine = c.examples.filter(
    (e) => e.text && isInstance(e.text) && !givesItAway(e.text, c.term),
  );
  if (!mine.length) return;
  const ex = mine[Math.floor(r() * mine.length)];
  const wrong = otherExamples(candidates, 3, (t) => carriesTerm(t, c.term));
  if (wrong.length < 3) return;
  // An option that is the only one saying the word can be picked out by the
  // word. A sibling saying it too settles that; nothing else does, so the
  // question waits for an answer worded without it.
  if (
    carriesTerm(ex.text!, c.term) &&
    !wrong.some((e) => carriesTerm(e.text!, c.term))
  )
    return;
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

