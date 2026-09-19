// The concepts Module 2 tests, with the reference's wording.
//
// Each entry carries a definition and at least one worked example, which is
// enough for both directions of the concept exercise (definition → example and
// example → definition) and for the flashcard deck. Distractors are drawn from
// sibling concepts at run time rather than authored per question.
export type ConceptKind =
  | "undefined term"
  | "definition"
  | "postulate"
  | "property"
  | "theorem"
  | "reasoning";

export type Example = {
  /** A worded instance. */
  text?: string;
  /** A figure from the library, with a sentence saying what to look at. */
  figure?: string;
  caption?: string;
};

export type Concept = {
  id: string;
  term: string;
  kind: ConceptKind;
  /** One-sentence definition, as the reference states it. */
  definition: string;
  /**
   * A shorter form used as a multiple-choice option, where the full wording
   * would turn the question into a reading test.
   */
  brief?: string;
  /**
   * Why it is true, or what it is for. Quiz feedback uses this: repeating the
   * definition back at a student who has just chosen it teaches nothing.
   */
  because?: string;
  /** Where it comes from in the reference, for the "why" line. */
  section: string;
  examples: Example[];
  /** Cases that look like the concept but are not it. */
  nonExamples?: Example[];
  /** A trap the reference warns about. */
  watch?: string;
};

export const CONCEPTS: Concept[] = [
  // --- Undefined terms and basic objects ------------------------------------
  {
    id: "undefined-terms",
    term: "Point, line and plane",
    kind: "undefined term",
    definition:
      "Accepted without definition. Everything else in geometry is defined using them.",
    section: "§5",
    examples: [
      { text: "A point has position and no size." },
      { text: "A line has length and no width, and runs forever in both directions." },
      { text: "A plane is a flat surface extending forever in all directions." },
    ],
    watch:
      "They are undefined on purpose — any definition would use words that themselves need defining.",
  },
  {
    id: "segment-vs-ray",
    term: "Segment, ray and line",
    kind: "definition",
    definition:
      "A line runs forever in both directions, a ray has one endpoint, and a segment has two — so only the segment has a length.",
    section: "§5",
    examples: [
      { text: "AB and BA name the same segment." },
      { text: "Ray AB starts at A and passes through B." },
    ],
    nonExamples: [
      { text: "Ray AB and ray BA are the same ray." },
    ],
    watch:
      "A line or segment may be named in either order; a ray may not — its first letter is the endpoint.",
  },
  {
    id: "collinear",
    term: "Collinear",
    kind: "definition",
    definition: "Points that lie on one line are collinear.",
    section: "§5",
    examples: [
      { figure: "collinear", caption: "A, B and C all lie on one line." },
      { text: "Any two points always lie on one line; three is the first interesting case." },
    ],
    watch: "Three points is the first interesting case, which is why “X, Y, Z are collinear” is only sometimes true.",
  },
  {
    id: "coplanar",
    term: "Coplanar",
    kind: "definition",
    definition: "Points that lie in one plane are coplanar.",
    because:
      "Any three points are coplanar; four is the first number that can fail.",
    section: "§5",
    examples: [
      { text: "Three points, wherever they sit, always lie in one flat surface." },
      { text: "The four corners of a tabletop." },
    ],
  },
  {
    id: "between",
    term: "Betweenness",
    kind: "definition",
    definition:
      "Point B is between A and C only if all three are collinear and B lies on AC.",
    section: "§5",
    examples: [
      { figure: "collinear", caption: "B lies on AC, with A and C on either side of it." },
      { text: "AB = 3 and BC = 1, and the whole of AC measures 4." },
    ],
    nonExamples: [
      { figure: "notBetween", caption: "All three are collinear, but C is not between A and B in the way AB + BC = AC needs." },
    ],
    watch:
      "Collinearity alone is not enough. Betweenness is the hidden condition on the Segment Addition Postulate.",
  },

  // --- Segments -------------------------------------------------------------
  {
    id: "segment-addition",
    term: "Segment Addition Postulate",
    kind: "postulate",
    definition: "If B is between A and C, then AB + BC = AC.",
    because:
      "The parts make the whole. Its usual disguise is a real-world measurement where you know the whole and one part, so the postulate runs backwards as a subtraction.",
    section: "§6",
    examples: [
      { figure: "collinear", caption: "The parts make the whole: AB + BC = AC." },
      { text: "Read backwards it is a subtraction: if AC = 80.5 and AB = 25.75, then BC = 54.75." },
    ],

  },
  {
    id: "congruent-segments",
    term: "Congruent segments",
    kind: "definition",
    definition: "Congruent segments have equal length: AB ≅ CD means AB = CD.",
    section: "§6",
    examples: [
      { figure: "markedPair", caption: "Matching tick marks say AD ≅ BC." },
      { text: "AD measures 5 cm and BC measures 5 cm, so both carry one tick." },
    ],
    watch:
      "One tick matches one tick; different numbers of ticks say nothing about each other.",
  },
  {
    id: "midpoint",
    term: "Midpoint",
    kind: "definition",
    definition: "A point that divides a segment into two congruent halves.",
    section: "§6",
    examples: [
      { figure: "midpoint", caption: "M divides AB into two equal halves." },
    ],
    watch: "A midpoint is a point; a bisector is a line, ray or segment.",
  },
  {
    id: "segment-bisector",
    term: "Segment bisector",
    kind: "definition",
    definition: "Any line, ray or segment through the midpoint of a segment.",
    section: "§6",
    examples: [
      { text: "A ray drawn through the midpoint of AB bisects it." },
    ],
    watch: "Every perpendicular bisector is a bisector, but not the reverse.",
  },
  {
    id: "perpendicular-bisector",
    term: "Perpendicular bisector",
    kind: "definition",
    definition: "A bisector that also meets the segment at 90°.",
    because:
      "It does two jobs at once — halves the segment and meets it at 90° — so it gives you both facts in a proof.",
    section: "§6",
    examples: [
      { figure: "perpendicular", caption: "PQ meets AB at its midpoint and at a right angle." },
    ],
  },

  // --- Angles ---------------------------------------------------------------
  {
    id: "acute",
    term: "Acute angle",
    kind: "definition",
    definition: "An angle measuring more than 0° and less than 90°.",
    because:
      "Strictly between 0° and 90°: a 90° angle is right, not acute.",
    section: "§8",
    examples: [{ text: "m∠A = 35°" }],
  },
  {
    id: "right",
    term: "Right angle",
    kind: "definition",
    definition: "An angle measuring exactly 90°.",
    section: "§8",
    examples: [
      { figure: "complementary", caption: "The small square marks ∠AVC as 90°." },
    ],
    watch: "The small square is not decoration — it is a given fact worth 90°.",
  },
  {
    id: "obtuse",
    term: "Obtuse angle",
    kind: "definition",
    definition: "An angle measuring more than 90° and less than 180°.",
    because:
      "Strictly between 90° and 180°: a straight angle exceeds 90° without being obtuse.",
    section: "§8",
    examples: [{ text: "m∠B = 115°" }],
  },
  {
    id: "straight",
    term: "Straight angle",
    kind: "definition",
    definition: "An angle measuring exactly 180°.",
    section: "§8",
    examples: [
      { figure: "straightInDisguise", caption: "E and F are opposite ends of a line through X, so ∠FXE is 180°." },
    ],
    watch: "A straight angle is a genuine 180° angle, not a non-angle.",
  },
  {
    id: "congruent-angles",
    term: "Congruent angles",
    kind: "definition",
    definition: "Congruent angles have equal measure: ∠A ≅ ∠B means m∠A = m∠B.",
    section: "§8",
    examples: [
      { figure: "fan", caption: "Matching arcs say ∠WVX ≅ ∠YVZ." },
      { text: "m∠A = 40° and m∠B = 40°, so both are drawn with one arc." },
    ],
    watch: "Size of the arc means nothing; the number of arcs is what matches.",
  },
  {
    id: "angle-addition",
    term: "Angle Addition Postulate",
    kind: "postulate",
    definition:
      "If P is in the interior of ∠ABC, then m∠ABP + m∠PBC = m∠ABC.",
    because:
      "The parts make the whole — provided the middle ray really does lie inside the angle.",
    section: "§8",
    examples: [
      { figure: "fan", caption: "m∠WVX + m∠XVY = m∠WVY, because X is interior to ∠WVY." },
    ],
  },
  {
    id: "angle-bisector",
    term: "Angle bisector",
    kind: "definition",
    definition: "A ray that splits an angle into two congruent angles.",
    because:
      "It is the special case of an interior ray where the two parts come out equal, so each half is exactly half the whole.",
    section: "§8",
    examples: [
      { figure: "bisector", caption: "Ray VD splits ∠AVC into two equal parts." },
    ],
  },
  {
    id: "adjacent",
    term: "Adjacent angles",
    kind: "definition",
    definition: "Angles that share a vertex and a side and do not overlap.",
    section: "§8",
    examples: [
      { figure: "crossing", caption: "∠1 and ∠2 sit side by side at X." },
    ],
    watch: "Adjacent is about touching; vertical is about facing.",
  },
  {
    id: "linear-pair",
    term: "Linear pair",
    kind: "definition",
    definition:
      "Two adjacent angles whose outer sides form a straight line.",
    because:
      "It is a picture fact: adjacent, with the outer sides forming a line. That is what licenses writing “= 180”.",
    section: "§8",
    examples: [
      { figure: "linearPair", caption: "∠ABD and ∠DBC sit on line AC." },
    ],
  },
  {
    id: "vertical-angles",
    term: "Vertical angles",
    kind: "definition",
    definition:
      "Two angles that sit opposite each other at a crossing, sharing only the vertex.",
    section: "§8",
    examples: [
      { figure: "crossing", caption: "∠1 and ∠3 face each other across X." },
    ],
    watch: "Vertical angles share only the vertex — they never touch along a side.",
  },
  {
    id: "supplementary",
    term: "Supplementary angles",
    kind: "definition",
    definition: "Two angles whose measures total 180°.",
    section: "§8",
    examples: [
      { text: "115° and 65° are supplementary." },
      { figure: "linearPair", caption: "A linear pair is always supplementary." },
    ],
    watch:
      "Neither requires the angles to touch. A linear pair is always supplementary, but supplementary angles need not be a linear pair.",
  },
  {
    id: "complementary",
    term: "Complementary angles",
    kind: "definition",
    definition: "Two angles whose measures total 90°.",
    because:
      "Neither angle has to be drawn near the other; only the two measures matter.",
    section: "§8",
    examples: [
      { text: "55° and 35° are complementary." },
      { figure: "complementary", caption: "The two parts of the right angle add to 90°." },
    ],
  },
  {
    id: "perpendicular",
    term: "Perpendicular",
    kind: "definition",
    definition: "Two lines, rays or segments that meet at right angles.",
    because:
      "The right angle it creates is a given fact worth 90°, usable without proof.",
    section: "§6",
    examples: [
      { figure: "perpendicular", caption: "PQ meets AB at P, where the small square is marked." },
    ],
  },
  {
    id: "angles-around-point",
    term: "Angles around a point",
    kind: "postulate",
    definition: "All the angles at a shared vertex, taken once around, total 360°.",
    section: "§8",
    examples: [
      { text: "Four angles at one vertex measuring 90°, 100°, 80° and 90° go once around." },
      { figure: "aroundPoint", caption: "The four angles at V close the full turn." },
    ],
    watch: "Always look for the straight line first — it halves the arithmetic.",
  },

  // --- Properties -----------------------------------------------------------
  {
    id: "reflexive",
    term: "Reflexive Property",
    kind: "property",
    definition: "a = a.",
    section: "§4",
    examples: [
      { text: "m∠XVY = m∠XVY, claiming that a shared angle equals itself." },
    ],
    watch: "Almost always how a common part enters a proof.",
  },
  {
    id: "symmetric",
    term: "Symmetric Property",
    kind: "property",
    definition: "If a = b then b = a.",
    because:
      "Use it to flip an equation around so the piece you want ends up on the left.",
    section: "§4",
    examples: [{ text: "From AB = CD conclude CD = AB." }],
  },
  {
    id: "transitive",
    term: "Transitive Property",
    kind: "property",
    definition: "If a = b and b = c, then a = c.",
    section: "§4",
    examples: [
      { text: "AB = BC and BC = CD gives AB = CD — the BC is the hinge." },
    ],
    watch: "Transitive needs a shared middle term; substitution does not.",
  },
  {
    id: "addition-property",
    term: "Addition Property of Equality",
    kind: "property",
    definition: "If a = b then a + c = b + c.",
    because:
      "Adding the same amount to both sides keeps them equal — the move that lets a shared part enter a proof.",
    section: "§4",
    examples: [
      { text: "From 3x − 12 = 18 conclude 3x = 30." },
    ],
  },
  {
    id: "subtraction-property",
    term: "Subtraction Property of Equality",
    kind: "property",
    definition: "If a = b then a − c = b − c.",
    because:
      "Subtracting the same amount from both sides keeps them equal. It is how a shared angle is cancelled out.",
    section: "§4",
    examples: [
      { text: "From m∠1 + m∠2 = m∠2 + m∠3 conclude m∠1 = m∠3." },
    ],
  },
  {
    id: "multiplication-property",
    term: "Multiplication Property of Equality",
    kind: "property",
    definition: "If a = b then ac = bc.",
    because:
      "Multiplying both sides by the same nonzero number keeps them equal; use it to clear a fraction.",
    section: "§4",
    examples: [{ text: "From x/2 = 5 conclude x = 10." }],
  },
  {
    id: "division-property",
    term: "Division Property of Equality",
    kind: "property",
    definition: "If a = b then a/c = b/c, for c ≠ 0.",
    because:
      "Dividing both sides by the same nonzero number keeps them equal; it is the last step of most solve-for-x proofs.",
    section: "§4",
    examples: [{ text: "From 3x = 30 conclude x = 10." }],
  },
  {
    id: "substitution",
    term: "Substitution Property",
    kind: "property",
    definition: "If a = b, then a may replace b anywhere it appears.",
    section: "§4",
    examples: [
      { text: "From AB = 5 and AB + BC = 12 conclude 5 + BC = 12." },
    ],
    watch: "Substitution just replaces equals with equals — no shared hinge required.",
  },
  {
    id: "distributive",
    term: "Distributive Property",
    kind: "property",
    definition: "a(b + c) = ab + ac.",
    because:
      "It clears parentheses inside a proof step without changing either side's value.",
    section: "§4",
    examples: [{ text: "From 3(x − 4) = 18 conclude 3x − 12 = 18." }],
  },

  // --- Theorems -------------------------------------------------------------
  {
    id: "linear-pair-theorem",
    term: "Linear Pair Theorem",
    kind: "theorem",
    definition: "If two angles form a linear pair, they are supplementary.",
    because:
      "It is the bridge from a picture fact to a number fact. Seeing two angles sit on a line is what licenses writing “= 180”.",
    section: "§9",
    examples: [
      { figure: "linearPair", caption: "Ray BD stands on line AC, so ∠ABD and ∠DBC sit on that line." },
      { text: "∠ABD and ∠DBC sit on line AC, so their measures total 180°." },
    ],
  },
  {
    id: "vertical-angles-theorem",
    term: "Vertical Angles Theorem",
    kind: "theorem",
    definition: "Vertical angles are congruent.",
    because:
      "Both angles are supplements of the same third angle, so subtracting it leaves them equal. It holds for any two crossing lines, with no measuring.",
    section: "§9",
    examples: [
      { figure: "crossing", caption: "∠1 ≅ ∠3 and ∠2 ≅ ∠4, for any two crossing lines." },
      { text: "Two lines cross; the angle facing ∠1 across the crossing has the same measure." },
    ],
  },
  {
    id: "congruent-supplements",
    term: "Congruent Supplements Theorem",
    kind: "theorem",
    definition:
      "If two angles are supplementary to the same angle — or to congruent angles — then they are congruent.",
    brief: "Two angles supplementary to the same angle are congruent.",
    because:
      "It is the vertical-angle argument stated in general: share a supplement, and what is left after subtracting it must be equal.",
    section: "§9",
    examples: [
      { text: "∠1 and ∠3 are both supplements of ∠2, so the two must have equal measure." },
    ],
  },
  {
    id: "congruent-complements",
    term: "Congruent Complements Theorem",
    kind: "theorem",
    definition:
      "If two angles are complementary to the same angle — or to congruent angles — then they are congruent.",
    brief: "Two angles complementary to the same angle are congruent.",
    because: "Identical reasoning to congruent supplements, at 90° instead of 180°.",
    section: "§9",
    examples: [
      { text: "∠1 and ∠2 are each complements of ∠3, so the two must have equal measure." },
    ],
  },
  {
    id: "right-angle-congruence",
    term: "Right Angle Congruence Theorem",
    kind: "theorem",
    definition: "All right angles are congruent.",
    because:
      "Every one of them measures 90°, so any two are equal. It is the named reason a proof cites when two square marks must be equal to each other.",
    section: "§9",
    examples: [
      { text: "A figure marks two square corners; each measures 90°, so the two are equal." },
    ],
  },

  // --- Reasoning ------------------------------------------------------------
  {
    id: "inductive",
    term: "Inductive reasoning",
    kind: "reasoning",
    definition: "Noticing a pattern in examples and predicting what comes next.",
    section: "§2",
    examples: [{ text: "2, 4, 6, 8 suggests 10." }],
    watch:
      "It produces a conjecture, not a guarantee. A single counterexample ends it.",
  },
  {
    id: "deductive",
    term: "Deductive reasoning",
    kind: "reasoning",
    definition: "Deriving a conclusion from accepted facts by logic alone.",
    because:
      "If the facts you start from are true and the logic is valid, the conclusion is certain. This is what a proof is made of.",
    section: "§2",
    examples: [{ text: "Every step of a two-column proof." }],
  },
  {
    id: "detachment",
    term: "Law of Detachment",
    kind: "reasoning",
    definition: "If “p → q” is true and p is true, then q is true.",
    because:
      "A rule, plus a case that fires it, detaches the conclusion. It fails if the case does not actually satisfy the hypothesis.",
    section: "§2",
    examples: [
      { text: "“If it rains, the match is cancelled.” It rained. So the match was cancelled." },
    ],
  },
  {
    id: "syllogism",
    term: "Law of Syllogism",
    kind: "reasoning",
    definition: "If p → q and q → r, then p → r.",
    section: "§2",
    examples: [
      { text: "“If it rains, the pitch floods.” “If the pitch floods, the match is cancelled.” So if it rains, the match is cancelled." },
    ],
    watch: "The same move as the transitive property, one level up. Both fail if the middle terms don't match exactly.",
  },
  {
    id: "proof",
    term: "Proof",
    kind: "definition",
    definition:
      "A chain of statements, each justified by a definition, postulate, theorem or property, leading from the given to the conclusion.",
    section: "§3",
    examples: [
      { text: "Two-column, paragraph and flowchart are three ways to write the same argument." },
    ],
    watch:
      "The thing you are proving may never appear as a reason — that is circular.",
  },
];

/**
 * What a concept is about. Distractors are drawn from the same topic first:
 * offering "Right angle" against "Congruent segments" tests nothing, because
 * no one weighing the two is thinking about geometry.
 */
export type Topic = "space" | "segment" | "angle" | "algebra" | "logic";

export const TOPIC: Record<string, Topic> = {
  "undefined-terms": "space",
  "segment-vs-ray": "space",
  collinear: "space",
  coplanar: "space",
  between: "segment",
  "segment-addition": "segment",
  "congruent-segments": "segment",
  midpoint: "segment",
  "segment-bisector": "segment",
  "perpendicular-bisector": "segment",
  acute: "angle",
  right: "angle",
  obtuse: "angle",
  straight: "angle",
  "congruent-angles": "angle",
  "angle-addition": "angle",
  "angle-bisector": "angle",
  adjacent: "angle",
  "linear-pair": "angle",
  "vertical-angles": "angle",
  supplementary: "angle",
  complementary: "angle",
  perpendicular: "angle",
  "angles-around-point": "angle",
  reflexive: "algebra",
  symmetric: "algebra",
  transitive: "algebra",
  "addition-property": "algebra",
  "subtraction-property": "algebra",
  "multiplication-property": "algebra",
  "division-property": "algebra",
  substitution: "algebra",
  distributive: "algebra",
  "linear-pair-theorem": "angle",
  "vertical-angles-theorem": "angle",
  "congruent-supplements": "angle",
  "congruent-complements": "angle",
  "right-angle-congruence": "angle",
  inductive: "logic",
  deductive: "logic",
  detachment: "logic",
  syllogism: "logic",
  proof: "logic",
};

export const topicOf = (c: Concept): Topic => TOPIC[c.id] ?? "space";

/**
 * The article a term takes mid-sentence. Plurals, adjectives and abstract
 * nouns take none; named rules take "the"; countable singulars take a/an.
 * Without this the quiz asked for "an example of acute angle".
 */
const INDEFINITE: Record<string, "a" | "an"> = {
  acute: "an",
  right: "a",
  obtuse: "an",
  straight: "a",
  midpoint: "a",
  "segment-bisector": "a",
  "perpendicular-bisector": "a",
  "angle-bisector": "an",
  "linear-pair": "a",
  proof: "a",
};

export function termPhrase(c: Concept): string {
  const named = /\b(Theorem|Postulate|Property|Law)\b/.test(c.term);
  if (named) return "the " + c.term;
  const lower = c.term.charAt(0).toLowerCase() + c.term.slice(1);
  const article = INDEFINITE[c.id];
  return article ? article + " " + lower : lower;
}

export const conceptById = (id: string) => CONCEPTS.find((c) => c.id === id);
export const conceptsOfKind = (k: ConceptKind) =>
  CONCEPTS.filter((c) => c.kind === k);
