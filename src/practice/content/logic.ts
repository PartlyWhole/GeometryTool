// §1 and §2: conditional statements, logical equivalence, negation,
// counterexamples, and always/sometimes/never.
//
// A conditional is authored once as four phrases; the converse, inverse and
// contrapositive are then generated, which is what makes the "classify by
// form, not by truth" drill worth doing.

export type FormKind =
  | "conditional"
  | "converse"
  | "inverse"
  | "contrapositive";

export const FORM_LABEL: Record<FormKind, string> = {
  conditional: "the original conditional",
  converse: "the converse",
  inverse: "the inverse",
  contrapositive: "the contrapositive",
};

export const FORM_SYMBOLS: Record<FormKind, string> = {
  conditional: "p → q",
  converse: "q → p",
  inverse: "~p → ~q",
  contrapositive: "~q → ~p",
};

export type Conditional = {
  id: string;
  /**
   * When present, `p` and `q` are predicates about this subject rather than
   * whole clauses. Swapping whole clauses to build a converse strands the
   * pronoun — "If it is a rectangle, then a figure is a square" — so anything
   * whose two halves share a subject is written this way instead.
   */
  subject?: string;
  /** "they" for a plural subject. */
  pronoun?: "it" | "they";
  p: string;
  notP: string;
  q: string;
  notQ: string;
  /** True when the converse also holds, so the pair is really biconditional. */
  converseTrue: boolean;
  topic?: string;
};

export const CONDITIONALS: Conditional[] = [
  {
    id: "rectangle",
    subject: "a quadrilateral",
    p: "has four right angles",
    notP: "does not have four right angles",
    q: "is a rectangle",
    notQ: "is not a rectangle",
    converseTrue: true,
    topic: "The reference's worked example — a true converse does not make a statement the converse.",
  },
  {
    id: "square",
    subject: "a figure",
    p: "is a square",
    notP: "is not a square",
    q: "is a rectangle",
    notQ: "is not a rectangle",
    converseTrue: false,
  },
  {
    id: "midpoint",
    p: "M is the midpoint of AB",
    notP: "M is not the midpoint of AB",
    q: "AM ≅ MB",
    notQ: "AM is not congruent to MB",
    converseTrue: false,
    topic: "The converse fails: AM ≅ MB does not place M on AB.",
  },
  {
    id: "linear-pair",
    subject: "two angles",
    pronoun: "they",
    p: "form a linear pair",
    notP: "do not form a linear pair",
    q: "are supplementary",
    notQ: "are not supplementary",
    converseTrue: false,
    topic: "Supplementary angles need not touch, so the converse fails.",
  },
  {
    id: "vertical",
    subject: "two angles",
    pronoun: "they",
    p: "are vertical angles",
    notP: "are not vertical angles",
    q: "are congruent",
    notQ: "are not congruent",
    converseTrue: false,
  },
  {
    id: "right-angle",
    subject: "an angle",
    p: "measures 90°",
    notP: "does not measure 90°",
    q: "is a right angle",
    notQ: "is not a right angle",
    converseTrue: true,
    topic: "A definition, so it works in both directions — this one really is biconditional.",
  },
  {
    id: "collinear",
    p: "B is between A and C",
    notP: "B is not between A and C",
    q: "A, B and C are collinear",
    notQ: "A, B and C are not collinear",
    converseTrue: false,
    topic: "Collinearity does not force betweenness — the reference's Fig. 3.",
  },
  {
    id: "congruent-segments",
    subject: "two segments",
    pronoun: "they",
    p: "are congruent",
    notP: "are not congruent",
    q: "have equal length",
    notQ: "do not have equal length",
    converseTrue: true,
  },
  {
    id: "obtuse",
    subject: "an angle",
    p: "is obtuse",
    notP: "is not obtuse",
    q: "measures more than 90°",
    notQ: "does not measure more than 90°",
    converseTrue: false,
    topic: "A straight angle exceeds 90° without being obtuse.",
  },
  {
    id: "bisector",
    subject: "a ray",
    p: "bisects an angle",
    notP: "does not bisect an angle",
    q: "creates two congruent angles",
    notQ: "does not create two congruent angles",
    converseTrue: true,
  },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "a quadrilateral" → "the quadrilateral", for a clause standing alone. */
export function definite(c: Conditional): string {
  if (!c.subject) return "";
  return c.subject.replace(/^(a|an) /, "the ").replace(/^(?!the )/, "the ");
}

/** A complete clause for one half, with the subject named. */
export const clauseOf = (c: Conditional, part: "p" | "notP" | "q" | "notQ") =>
  c.subject ? `${c.subject} ${c[part]}` : c[part];

/** The same half as a standalone sentence, e.g. for the Law of Detachment. */
export const sentenceOf = (c: Conditional, part: "p" | "notP" | "q" | "notQ") =>
  cap(c.subject ? `${definite(c)} ${c[part]}` : c[part]) + ".";

function ifThen(c: Conditional, first: "p" | "notP" | "q" | "notQ", second: "p" | "notP" | "q" | "notQ") {
  if (!c.subject) return `If ${c[first]}, then ${c[second]}.`;
  return `If ${c.subject} ${c[first]}, then ${c.pronoun ?? "it"} ${c[second]}.`;
}

export function formText(c: Conditional, kind: FormKind): string {
  switch (kind) {
    case "conditional":
      return ifThen(c, "p", "q");
    case "converse":
      return ifThen(c, "q", "p");
    case "inverse":
      return ifThen(c, "notP", "notQ");
    case "contrapositive":
      return ifThen(c, "notQ", "notP");
  }
}

export const biconditionalText = (c: Conditional) =>
  c.subject
    ? `${cap(c.subject)} ${c.p} if and only if ${c.pronoun ?? "it"} ${c.q}.`
    : `${cap(c.p)} if and only if ${c.q}.`;

/** The contrapositive pairs with the original; the converse with the inverse. */
export const equivalentForm: Record<FormKind, FormKind> = {
  conditional: "contrapositive",
  contrapositive: "conditional",
  converse: "inverse",
  inverse: "converse",
};

// ---------------------------------------------------------------------------

export type NegationItem = {
  id: string;
  statement: string;
  correct: string;
  wrong: { text: string; why: string }[];
};

export const NEGATIONS: NegationItem[] = [
  {
    id: "acute",
    statement: "∠A is acute",
    correct: "∠A is not acute",
    wrong: [
      { text: "∠A is obtuse", why: "That leaves out right and straight angles." },
      { text: "∠A is a right angle", why: "One particular non-acute case, not the negation." },
      { text: "∠A measures 90° or more", why: "True of every non-acute angle, but it states a measure the original never mentioned." },
    ],
  },
  {
    id: "and",
    statement: "∠A is acute and small",
    correct: "∠A is not acute, or it is not small",
    wrong: [
      { text: "∠A is not acute and not small", why: "Negating “and” gives “or”, not “and”." },
      { text: "∠A is obtuse or large", why: "Opposites are not negations." },
      { text: "∠A is acute or small", why: "That weakens the original rather than denying it." },
    ],
  },
  {
    id: "or",
    statement: "The angle is acute or right",
    correct: "The angle is not acute and not right",
    wrong: [
      { text: "The angle is not acute or not right", why: "Negating “or” gives “and”." },
      { text: "The angle is obtuse", why: "One way to fail both, but a straight angle fails them too." },
      { text: "The angle is acute and right", why: "No angle is both; this denies nothing." },
    ],
  },
  {
    id: "congruent",
    statement: "AB ≅ CD",
    correct: "AB is not congruent to CD",
    wrong: [
      { text: "AB < CD", why: "One of several ways to fail congruence, not the negation." },
      { text: "AB > CD", why: "The other one-sided case, equally incomplete." },
      { text: "AB and CD are not parallel", why: "Congruence is about length, not direction." },
    ],
  },
  {
    id: "collinear",
    statement: "Points X, Y and Z are collinear",
    correct: "Points X, Y and Z are not collinear",
    wrong: [
      { text: "Points X, Y and Z form a triangle", why: "True in most failing cases, but not all — two points could coincide." },
      { text: "Points X, Y and Z are coplanar", why: "Any three points are coplanar, so this denies nothing." },
      { text: "No line passes through X, Y and Z in that order", why: "Betweenness is a different claim from collinearity." },
    ],
  },
];

// ---------------------------------------------------------------------------

export type Verdict = "always" | "sometimes" | "never";

export type AlwaysItem = {
  id: string;
  statement: string;
  verdict: Verdict;
  why: string;
};

export const ALWAYS_SOMETIMES_NEVER: AlwaysItem[] = [
  {
    id: "two-obtuse",
    statement: "A triangle has two obtuse angles.",
    verdict: "never",
    why: "Two angles above 90° already exceed the 180° a triangle has to spend.",
  },
  {
    id: "collinear-xyz",
    statement: "Points X, Y and Z are collinear.",
    verdict: "sometimes",
    why: "Three points may or may not line up. You can produce both an example and a counterexample.",
  },
  {
    id: "line-longer",
    statement: "Line MN is longer than segment MN.",
    verdict: "always",
    why: "A line runs forever; a segment stops.",
  },
  {
    id: "supp-90",
    statement: "If ∠F and ∠G are supplementary, then m∠F = 90°.",
    verdict: "sometimes",
    why: "It holds when both are right angles and fails for 100° and 80°.",
  },
  {
    id: "vertical-congruent",
    statement: "Vertical angles are congruent.",
    verdict: "always",
    why: "It follows from the Vertical Angles Theorem, for any two crossing lines.",
  },
  {
    id: "linear-supp",
    statement: "Supplementary angles form a linear pair.",
    verdict: "sometimes",
    why: "A linear pair is always supplementary, but two angles on different pages can be supplementary without touching.",
  },
  {
    id: "adjacent-vertical",
    statement: "Two angles are both adjacent and vertical.",
    verdict: "never",
    why: "Adjacent angles share a side; vertical angles share only the vertex.",
  },
  {
    id: "midpoint-two",
    statement: "A segment has exactly one midpoint.",
    verdict: "always",
    why: "Only one point divides it into two congruent halves.",
  },
  {
    id: "bisector-perp",
    statement: "A segment bisector is perpendicular to the segment.",
    verdict: "sometimes",
    why: "Every perpendicular bisector is a bisector, but a bisector may cross at any angle.",
  },
  {
    id: "two-points-collinear",
    statement: "Two points are collinear.",
    verdict: "always",
    why: "A line can always be drawn through any two points.",
  },
  {
    id: "four-coplanar",
    statement: "Four points are coplanar.",
    verdict: "sometimes",
    why: "Any three points are coplanar; four is the first number that can fail.",
  },
  {
    id: "planes-point",
    statement: "Two distinct planes intersect in a single point.",
    verdict: "never",
    why: "Two distinct planes that meet at all meet in a line.",
  },
];

// ---------------------------------------------------------------------------

export type CounterexampleItem = {
  id: string;
  claim: string;
  options: string[];
  correct: number;
  why: string;
};

export const COUNTEREXAMPLES: CounterexampleItem[] = [
  {
    id: "segment-addition",
    claim: "If A, B and C are collinear, then AB + BC = AC.",
    options: [
      "AB = 3, BC = 1, AC = 4",
      "AB = 2, BC = 2, AC = 4",
      "AB > AC",
      "A, B and C are not collinear",
    ],
    correct: 2,
    why:
      "Honour the hypothesis — the points stay collinear — and break the conclusion. If B really were between, AB would be part of AC and could never exceed it. Option D abandons the hypothesis instead of testing it.",
  },
  {
    id: "supplementary-right",
    claim: "If two angles are supplementary, then each measures 90°.",
    options: [
      "Two angles measuring 90° and 90°",
      "Two angles measuring 100° and 80°",
      "Two angles measuring 45° and 45°",
      "Two angles measuring 120° and 70°",
    ],
    correct: 1,
    why:
      "A counterexample must satisfy the hypothesis and fail the conclusion. 100° and 80° are supplementary, and neither is 90°. The last pair is not supplementary at all, so it tests nothing.",
  },
  {
    id: "congruent-vertical",
    claim: "If two angles are congruent, then they are vertical angles.",
    options: [
      "Two 50° angles in different figures",
      "Two vertical angles at a crossing",
      "A 50° angle and a 130° angle",
      "Two adjacent angles on a line",
    ],
    correct: 0,
    why:
      "Congruent but unrelated angles satisfy the hypothesis and fail the conclusion. Option B confirms the claim rather than attacking it.",
  },
  {
    id: "bisector-midpoint",
    claim: "If a line passes through the midpoint of a segment, it is perpendicular to it.",
    options: [
      "A line through the midpoint at 90°",
      "A line through the midpoint at 40°",
      "A line that misses the segment",
      "A line through an endpoint",
    ],
    correct: 1,
    why:
      "It passes through the midpoint, honouring the hypothesis, but meets at 40° rather than 90°.",
  },
];

// ---------------------------------------------------------------------------

export type Chain = {
  id: string;
  /** As for Conditional: when present, p/q/r are predicates about this. */
  subject?: string;
  pronoun?: "it" | "they";
  p: string;
  q: string;
  r: string;
};

/** Three-link chains for the Law of Syllogism. */
export const CHAINS: Chain[] = [
  {
    id: "rain",
    p: "it rains",
    q: "the pitch floods",
    r: "the match is cancelled",
  },
  {
    id: "vertical",
    subject: "two angles",
    pronoun: "they",
    p: "are vertical angles",
    q: "are congruent",
    r: "have equal measure",
  },
  {
    id: "midpoint",
    p: "M is the midpoint of AB",
    q: "AM ≅ MB",
    r: "AM = MB",
  },
  {
    id: "linear",
    subject: "two angles",
    pronoun: "they",
    p: "form a linear pair",
    q: "are supplementary",
    r: "have measures totalling 180°",
  },
  {
    id: "square",
    subject: "a figure",
    p: "is a square",
    q: "is a rectangle",
    r: "has four right angles",
  },
];

/** "If <chain p>, then <chain q>." with the subject kept where it belongs. */
export function chainText(c: Chain, first: "p" | "q" | "r", second: "p" | "q" | "r") {
  if (!c.subject) return `If ${c[first]}, then ${c[second]}.`;
  return `If ${c.subject} ${c[first]}, then ${c.pronoun ?? "it"} ${c[second]}.`;
}
