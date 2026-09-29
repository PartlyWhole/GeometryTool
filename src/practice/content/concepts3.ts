// The concepts Module 3 tests: Lessons 3.1–3.3, parallel and perpendicular
// lines, in the order of the seven-stage progression the module breakdown
// derives from its dependencies (content/story.ts tells them in that order).
//
// Wording follows the reference, except that a definition never opens with
// its own term: "Corresponding angles lie on…" makes "which term is this?" a
// matter of spotting the word. Named theorems keep the reference's wording,
// and are asked through their examples instead.
//
// Angle numerals refer to the reference's figure, numbered clockwise from the
// upper left at each crossing — 1 to 4 at the top line, 5 to 8 at the bottom.
import type { Concept } from "./concepts";

type M3 = Concept & { module: 3 };

const at = (topic: Concept["topic"], section: string) => ({ topic, section, module: 3 as const });
const FOUNDATIONS = "Foundations";
const READ = "Read the figure";
const FIRST = "The first assumption";
const DERIVE = "Derive the angle theorems";
const REVERSE = "Reverse it";
const ONE = "Exactly one line";
const DISTANCE = "The perpendicular bisector";

export const CONCEPTS3: M3[] = [
  // --- Stage 1 · Foundations ----------------------------------------------
  {
    id: "angles-at-a-crossing",
    term: "Four angles at a crossing",
    kind: "theorem",
    definition: "Where two lines meet, opposite angles are congruent and neighbouring angles total 180°, so one measure fixes the rest.",
    brief: "Opposite angles equal, neighbours total 180°",
    because:
      "It is two theorems you already have, working together: the Vertical Angles Theorem gives the opposite angle, and the Linear Pair Theorem gives the two beside it.",
    examples: [
      { figure: "crossingOneMeasure", caption: "∠1 = 64°, so ∠3 = 64° and ∠2 = ∠4 = 116°." },
      { text: "m∠1 = 64°, so m∠3 = 64° and m∠2 = m∠4 = 180° − 64° = 116°." },
    ],
    watch: "Two values, x and 180° − x, and never more. Parallel lines will stretch the same two values across a second crossing.",
    ...at("pairs", FOUNDATIONS),
  },
  {
    id: "parallel-lines",
    term: "Parallel lines",
    kind: "definition",
    definition: "Coplanar lines that do not intersect. A figure marks them with matching arrowheads.",
    brief: "Coplanar lines that never meet",
    because:
      "Written m ∥ n. It is the condition every rule in this module starts from — or, from Lesson 3.2 on, finishes at.",
    examples: [
      { figure: "parallelMN", caption: "The matching arrowheads on m and n say m ∥ n." },
      { text: "Two rails stay 1.4 m apart along their whole length, so they never meet." },
    ],
    watch:
      "Lines that look parallel are not parallel until the figure marks them or the problem says so — the same rule as tick marks and arcs.",
    ...at("parallel", FOUNDATIONS),
  },
  {
    id: "perpendicular-lines",
    term: "Perpendicular lines",
    kind: "definition",
    definition: "Lines that intersect to form right angles. A square marks one of them, and that one makes all four right.",
    brief: "Lines meeting at 90°",
    because:
      "Written t ⊥ m. One right angle is enough: its vertical partner is 90° too, and its neighbours are 180° − 90° = 90°.",
    examples: [
      { figure: "perpendicularLines", caption: "One square at ∠1, and all four angles are right." },
      { text: "t ⊥ m and m∠1 = 90°, so m∠2 = m∠3 = m∠4 = 90° as well." },
    ],
    watch: "The square is the mark. Two lines that merely look square to each other prove nothing.",
    ...at("perpendicular", FOUNDATIONS),
  },
  {
    id: "pythagorean",
    term: "Pythagorean Theorem",
    kind: "theorem",
    definition: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the legs: c² = a² + b².",
    brief: "Hypotenuse squared equals the sum of the legs squared",
    because:
      "It is the only tool in the module that turns a right angle into a fact about lengths, which is exactly what Lesson 3.3 needs.",
    examples: [
      { figure: "rightTriangle", caption: "AD = 4 and DC = 3, so AC² = 4² + 3² = 25 and AC = 5." },
      { text: "Legs of 6 and 8: the hypotenuse is √(36 + 64) = √100 = 10." },
    ],
    watch:
      "Lengths are never negative, so from AC² = BC² you may conclude AC = BC. That one step closes the proof of the Perpendicular Bisector Theorem.",
    ...at("perpendicular", DISTANCE),
  },
  {
    id: "reflection",
    term: "Reflection",
    kind: "definition",
    definition: "A fold along a line, mapping each point to its mirror image; every point on the fold is equally far from a point and its image.",
    brief: "A fold: points on the fold are equally far from a point and its image",
    because:
      "It is the picture behind Lesson 3.3: fold A onto B and the crease is the perpendicular bisector of AB.",
    examples: [
      { figure: "reflection", caption: "Fold along CD and A lands on B, so EA = EB, FA = FB and GA = GB." },
      { text: "Fold the paper so A lands on B: any point P on the crease has PA = PB." },
    ],
    watch: "The fold must carry A exactly onto B. A crease that misses B guarantees nothing about distances.",
    ...at("perpendicular", DISTANCE),
  },

  // --- Stage 2 · Read the figure ---------------------------------------------
  {
    id: "transversal",
    term: "Transversal",
    kind: "definition",
    definition: "A line that intersects two or more coplanar lines at different points.",
    brief: "A line crossing two or more coplanar lines at different points",
    because:
      "Every angle-pair name in this module is measured from it: which side of it an angle is on, and whether the angle opens between the two lines or outside them.",
    examples: [
      { figure: "transversalJK", caption: "Line t crosses j at one point and k at another, so t is the transversal of j and k." },
      { text: "“Line t crosses line j at one point and line k at a second, different point.”" },
    ],
    watch:
      "A line through the point where the other two already meet crosses them both at one point, not two — it is not a transversal.",
    article: "a",
    ...at("pairs", READ),
  },
  {
    id: "interior-exterior",
    term: "Interior and exterior angles",
    kind: "definition",
    definition: "The first question that places an angle cut by a transversal: does it open between the two lines, or outside them?",
    brief: "Between the two lines, or outside them",
    because: "Interior angles open into the strip between the lines; exterior angles open above the top line or below the bottom one.",
    examples: [
      { figure: "transversalJK", caption: "∠3, ∠4, ∠5 and ∠6 open between j and k; ∠1, ∠2, ∠7 and ∠8 open outside them." },
      { text: "∠3, ∠4, ∠5 and ∠6 sit between the lines; ∠1, ∠2, ∠7 and ∠8 sit outside them." },
    ],
    watch: "“Interior” means between the two lines, not inside some shape.",
    ...at("pairs", READ),
  },
  {
    id: "alternate-consecutive",
    term: "Alternate and consecutive angles",
    kind: "definition",
    definition: "The second question that places an angle: is it on the same side of the transversal as the other, or on the opposite side?",
    brief: "Same side of the transversal, or opposite sides",
    because: "Consecutive angles are on the same side of the transversal; alternate angles are on opposite sides.",
    examples: [
      { figure: "transversalJK", caption: "∠1, ∠4, ∠5 and ∠8 are left of t; ∠2, ∠3, ∠6 and ∠7 are right of it." },
      { text: "∠4 and ∠5 are both left of t; ∠3 and ∠5 are on opposite sides of it." },
    ],
    watch: "Some books say same-side for consecutive. The two answers to the two questions give four of the five names.",
    ...at("pairs", READ),
  },
  {
    id: "corresponding-angles",
    term: "Corresponding angles",
    kind: "definition",
    definition: "Angles that lie on the same side of the transversal and on the same sides of the intersecting lines.",
    brief: "Same side of the transversal, and the same side of each line",
    because:
      "They sit in the same corner at each crossing: slide one crossing along t onto the other and the two angles coincide.",
    examples: [
      { figure: "pairCorresponding", caption: "∠1 and ∠5: each above its line, each left of t." },
      { text: "∠2 sits above line j and right of t; ∠6 sits above line k and right of t." },
    ],
    watch:
      "The name is about position only. On lines that are not parallel, corresponding angles are still corresponding — they are just not congruent.",
    ...at("pairs", READ),
  },
  {
    id: "alternate-interior",
    term: "Alternate interior angles",
    kind: "definition",
    definition: "Nonadjacent angles that lie on opposite sides of the transversal, between the intersected lines.",
    brief: "Opposite sides of the transversal, between the two lines",
    because:
      "“Alternate” is opposite sides of the transversal; “interior” is between the two lines. The pair has to be both.",
    examples: [
      { figure: "pairAltInterior", caption: "∠3 and ∠5: both between the lines, on opposite sides of t." },
      { text: "∠3 sits below j and right of t; ∠5 sits above k and left of t — both between the lines." },
    ],
    watch:
      "They must be nonadjacent. Two angles between the lines at the same crossing, one each side of t, form a linear pair instead.",
    ...at("pairs", READ),
  },
  {
    id: "consecutive-interior",
    term: "Consecutive interior angles",
    kind: "definition",
    definition: "Angles that lie on the same side of the transversal, between the intersected lines.",
    brief: "Same side of the transversal, between the two lines",
    because: "“Consecutive” is the same side of the transversal; “interior” is between the two lines.",
    examples: [
      { figure: "pairConsInterior", caption: "∠4 and ∠5: both between the lines, both left of t." },
      { text: "∠4 sits below j and ∠5 above k, both left of t and both between the lines." },
    ],
    watch: "Some books call them same-side interior angles. The meaning is the same.",
    ...at("pairs", READ),
  },
  {
    id: "alternate-exterior",
    term: "Alternate exterior angles",
    kind: "definition",
    definition: "Angles that lie on opposite sides of the transversal, outside the intersected lines.",
    brief: "Opposite sides of the transversal, outside the two lines",
    because: "Opposite sides of the transversal, and both outside the region between the lines.",
    examples: [
      { figure: "pairAltExterior", caption: "∠1 and ∠7: both outside the lines, on opposite sides of t." },
      { text: "∠2 sits above j and right of t; ∠8 sits below k and left of t — both outside the lines." },
    ],
    watch: "Outside means above the top line or below the bottom one — never in the strip between them.",
    ...at("pairs", READ),
  },
  {
    id: "consecutive-exterior",
    term: "Consecutive exterior angles",
    kind: "definition",
    definition: "Angles that lie on the same side of the transversal, outside the intersected lines.",
    brief: "Same side of the transversal, outside the two lines",
    because: "The same side of the transversal, and both outside the region between the lines.",
    examples: [
      { figure: "pairConsExterior", caption: "∠2 and ∠7: both outside the lines, both right of t." },
      { text: "∠1 sits above j and ∠8 below k, both left of t and both outside the lines." },
    ],
    watch: "Some books call them same-side exterior angles. The meaning is the same.",
    ...at("pairs", READ),
  },

  // --- Stage 3 · The first assumption ----------------------------------------
  {
    id: "corresponding-angles-postulate",
    term: "Corresponding Angles Postulate",
    kind: "postulate",
    definition: "If two parallel lines are cut by a transversal, then the resulting corresponding angles are congruent.",
    brief: "Parallel lines make corresponding angles congruent",
    because:
      "It is the one relationship accepted without proof. Each of the four theorems is proved from it, with a vertical pair or a linear pair to finish the job.",
    examples: [
      { figure: "thmCorresponding", caption: "m ∥ n, so the corresponding angles ∠1 and ∠5 are congruent." },
      { text: "m ∥ n, and ∠2 and ∠6 both sit above their line and right of t, so ∠2 ≅ ∠6." },
    ],
    watch: "Without m ∥ n it says nothing: corresponding angles on lines that meet are not congruent.",
    ...at("parallel", FIRST),
  },

  // --- Stage 4 · Derive and use the angle theorems -----------------------------
  {
    id: "alt-interior-theorem",
    term: "Alternate Interior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of alternate interior angles are congruent.",
    brief: "Parallel lines make alternate interior angles congruent",
    because: "∠3 ≅ ∠7 because they correspond, and ∠7 ≅ ∠5 because they are vertical — so ∠3 ≅ ∠5.",
    examples: [
      { figure: "thmAltInterior", caption: "m ∥ n, so ∠3 and ∠5 — between the lines, opposite sides of t — are congruent." },
      { text: "m ∥ n, and ∠4 and ∠6 sit between the lines on opposite sides of t, so ∠4 ≅ ∠6." },
    ],
    watch: "“Interior” means between the two lines, not inside some shape.",
    ...at("parallel", DERIVE),
  },
  {
    id: "flow-proof",
    term: "Flow proof",
    kind: "reasoning",
    definition: "An argument drawn as boxes joined by arrows, showing its structure, with the justification for each step written below its box.",
    brief: "Boxes joined by arrows, with a reason under each box",
    because:
      "It is the same argument as a two-column proof, drawn so the eye can follow what rests on what: an arrow says the box it points to follows from the box it leaves.",
    examples: [
      { text: "a ∥ b → ∠1 ≅ ∠2 → ∠2 ≅ ∠3 → ∠1 ≅ ∠3, each box with its reason written underneath." },
    ],
    watch: "The arrows carry the logic. A box with no arrow into it must be a given or something the figure shows.",
    article: "a",
    ...at("parallel", DERIVE),
  },
  {
    id: "alt-exterior-theorem",
    term: "Alternate Exterior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of alternate exterior angles are congruent.",
    brief: "Parallel lines make alternate exterior angles congruent",
    because: "∠1 ≅ ∠5 because they correspond, and ∠5 ≅ ∠7 because they are vertical — so ∠1 ≅ ∠7.",
    examples: [
      { figure: "thmAltExterior", caption: "m ∥ n, so ∠1 and ∠7 — outside the lines, opposite sides of t — are congruent." },
      { text: "m ∥ n, and ∠1 and ∠7 sit outside the lines on opposite sides of t, so ∠1 ≅ ∠7." },
    ],
    watch: "Congruent, like the alternate interior pair — it is the consecutive pairs that are supplementary.",
    ...at("parallel", DERIVE),
  },
  {
    id: "cons-interior-theorem",
    term: "Consecutive Interior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of consecutive interior angles are supplementary.",
    brief: "Parallel lines make consecutive interior angles supplementary",
    because: "∠5 ≅ ∠1 because they correspond, and ∠1 and ∠4 form a linear pair — so ∠4 and ∠5 total 180°.",
    examples: [
      { figure: "thmConsInterior", caption: "m ∥ n, so ∠4 and ∠5 — between the lines, same side of t — total 180°." },
      { text: "m ∥ n, and ∠3 and ∠6 sit between the lines on the same side of t, so m∠3 + m∠6 = 180." },
    ],
    watch:
      "Supplementary, not congruent: one of the pair is acute and the other obtuse, unless t is perpendicular to the lines and both are right angles.",
    ...at("parallel", DERIVE),
  },
  {
    id: "cons-exterior-theorem",
    term: "Consecutive Exterior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of consecutive exterior angles are supplementary.",
    brief: "Parallel lines make consecutive exterior angles supplementary",
    because: "∠2 ≅ ∠6 because they correspond, and ∠6 and ∠7 form a linear pair — so ∠2 and ∠7 total 180°.",
    examples: [
      { figure: "thmConsExterior", caption: "m ∥ n, so ∠2 and ∠7 — outside the lines, same side of t — total 180°." },
      { text: "m ∥ n, and ∠2 and ∠7 sit outside the lines on the same side of t, so m∠2 + m∠7 = 180." },
    ],
    watch: "Supplementary, like the consecutive interior pair — the alternate pairs are the congruent ones.",
    ...at("parallel", DERIVE),
  },
  {
    id: "two-value-rule",
    term: "The two-value rule",
    kind: "theorem",
    definition: "When parallel lines are cut by a transversal, every one of the eight angles measures either x or 180° − x, where x is any one of them.",
    brief: "Every angle is x or 180° − x",
    because:
      "The four rules carry an angle across the two lines, and the four-angles fact fills in each crossing. The reference never names it, but it is the idea most of its exercises use.",
    examples: [
      { figure: "twoMeasures", caption: "∠1, ∠3, ∠5 and ∠7 measure 116°; ∠2, ∠4, ∠6 and ∠8 measure 64°." },
      { text: "m ∥ n and m∠1 = 116°: ∠3, ∠5 and ∠7 are 116° too, and the other four are 64°." },
    ],
    watch: "Which family an angle is in is a question of position, never of how it looks. Read the pair, then decide equal or 180°.",
    ...at("parallel", DERIVE),
  },
  {
    id: "angle-equations",
    term: "Solving for an unknown angle",
    kind: "reasoning",
    definition: "Name the pair, decide whether its angles are equal or total 180°, then write that equation, solve it and substitute back.",
    brief: "Classify, then equal or 180°, then solve",
    because: "Every “find x” on parallel lines is the two-value rule plus one linear equation. The geometry is in the first step; the rest is algebra.",
    examples: [
      { text: "m ∥ n, m∠3 = (4x + 12)° and m∠5 = (6x − 20)°: alternate interior, so 4x + 12 = 6x − 20 and x = 16." },
      { text: "m ∥ n, m∠2 = (3x + 10)° and m∠7 = (5x + 10)°: consecutive exterior, so 8x + 20 = 180 and x = 20." },
    ],
    watch: "x is rarely the answer. When the question asks for the angle, substitute back: 4(16) + 12 = 76°.",
    ...at("parallel", DERIVE),
  },

  // --- Stage 5 · Reverse it: tests for parallel lines ---------------------------
  {
    id: "converse",
    term: "Converse",
    kind: "reasoning",
    definition: "The statement made by exchanging a conditional's hypothesis and conclusion: “If p, then q” becomes “If q, then p.”",
    brief: "Swap the hypothesis and the conclusion",
    because:
      "Lesson 3.1 went from parallel lines to angles. Every test in Lesson 3.2 goes the other way — and a reversed statement has to be earned, because reversing can make a true statement false.",
    examples: [
      { text: "“If x + 4 = 6, then x = 2,” turned round, is “If x = 2, then x + 4 = 6.” Both happen to be true." },
      { text: "“If two angles are vertical, they are congruent” is true. Turned round — “If two angles are congruent, they are vertical” — it is false." },
    ],
    watch: "A converse is not automatically true. That is why one converse must be assumed and the others proved.",
    ...at("tests", REVERSE),
  },
  {
    id: "converse-cap",
    term: "Converse of the Corresponding Angles Postulate",
    kind: "postulate",
    definition: "If two lines are cut by a transversal so that corresponding angles are congruent, then the lines are parallel.",
    brief: "Congruent corresponding angles make the lines parallel",
    because:
      "Like the forward postulate, it is accepted without proof. Every other test for parallel lines is proved from it.",
    examples: [
      { figure: "givenCorresponding", caption: "The arcs mark ∠1 ≅ ∠5, so m ∥ n — even though no arrowheads were drawn." },
      { text: "∠2 ≅ ∠6, and they sit in the same corner at each crossing, so m ∥ n." },
    ],
    watch: "The arrow now points the other way: the angles are the given, and m ∥ n is what you conclude.",
    ...at("tests", REVERSE),
  },
  {
    id: "converse-ait",
    term: "Converse of the Alternate Interior Angles Theorem",
    kind: "theorem",
    definition: "If two lines are cut by a transversal so that alternate interior angles are congruent, then the lines are parallel.",
    brief: "Congruent alternate interior angles make the lines parallel",
    because: "∠3 ≅ ∠5 is given and ∠5 ≅ ∠7 as vertical angles, so ∠3 ≅ ∠7 — corresponding angles — and the lines are parallel.",
    examples: [
      { figure: "givenAltInterior", caption: "The arcs mark ∠3 ≅ ∠5 — alternate interior — so m ∥ n." },
      { text: "∠4 ≅ ∠6, both between the lines on opposite sides of t, so m ∥ n." },
    ],
    watch: "Cite the converse, not the theorem: the Alternate Interior Angles Theorem starts from m ∥ n, which here is what you are proving.",
    ...at("tests", REVERSE),
  },
  {
    id: "converse-aet",
    term: "Converse of the Alternate Exterior Angles Theorem",
    kind: "theorem",
    definition: "If two lines are cut by a transversal so that alternate exterior angles are congruent, then the lines are parallel.",
    brief: "Congruent alternate exterior angles make the lines parallel",
    because: "∠1 ≅ ∠7 is given and ∠7 ≅ ∠5 as vertical angles, so ∠1 ≅ ∠5 — corresponding — and the lines are parallel.",
    examples: [
      { figure: "givenAltExterior", caption: "The arcs mark ∠1 ≅ ∠7 — alternate exterior — so m ∥ n." },
      { text: "∠2 ≅ ∠8, both outside the lines on opposite sides of t, so m ∥ n." },
    ],
    watch: "Congruent, as the forward theorem was. The consecutive tests are the ones that need 180°.",
    ...at("tests", REVERSE),
  },
  {
    id: "converse-cit",
    term: "Converse of the Consecutive Interior Angles Theorem",
    kind: "theorem",
    definition: "If two lines are cut by a transversal so that consecutive interior angles are supplementary, then the lines are parallel.",
    brief: "Supplementary consecutive interior angles make the lines parallel",
    because:
      "∠4 and ∠5 total 180°, and ∠4 and ∠1 form a linear pair, so ∠1 and ∠5 are supplements of the same angle — congruent, and corresponding.",
    examples: [
      { figure: "givenConsInterior", caption: "m∠4 = 64° and m∠5 = 116° total 180° — consecutive interior — so m ∥ n." },
      { text: "m∠3 = 47° and m∠6 = 133°, both between the lines on the same side of t: 47 + 133 = 180, so m ∥ n." },
    ],
    watch: "Supplementary, not congruent. Two consecutive interior angles that are equal prove nothing — unless both are 90°.",
    ...at("tests", REVERSE),
  },
  {
    id: "converse-cet",
    term: "Converse of the Consecutive Exterior Angles Theorem",
    kind: "theorem",
    definition: "If two lines are cut by a transversal so that consecutive exterior angles are supplementary, then the lines are parallel.",
    brief: "Supplementary consecutive exterior angles make the lines parallel",
    because: "∠1 and ∠8 total 180°, and ∠8 and ∠5 form a linear pair, so ∠1 and ∠5 are supplements of ∠8 — congruent, and corresponding.",
    examples: [
      { figure: "givenConsExterior", caption: "m∠1 = 116° and m∠8 = 64° total 180° — consecutive exterior — so m ∥ n." },
      { text: "m∠2 = 70° and m∠7 = 110°, both outside the lines on the same side of t: 70 + 110 = 180, so m ∥ n." },
    ],
    watch: "The rarest of the five in practice — but it is the same argument as the consecutive interior test, outside the lines.",
    ...at("tests", REVERSE),
  },
  {
    id: "parallel-equations",
    term: "Finding x that makes lines parallel",
    kind: "reasoning",
    definition: "Choose the pair a test is about, set its angles equal or totalling 180° as that test requires, and solve for the variable.",
    brief: "Set up the test's condition, then solve",
    because: "It is the Lesson 3.1 equation run backwards: there, the lines were parallel and the angles followed; here, the angles are chosen so that the lines must be.",
    examples: [
      { text: "Alternate interior angles (4x + 2)° and (7x − 43)°: set them equal, 3x = 45, so x = 15 makes p ∥ q." },
      { text: "Consecutive interior angles 63° and (9x + 36)°: set their sum to 180, 9x = 81, so x = 9 makes p ∥ q." },
    ],
    watch: "Setting a consecutive pair equal, or an alternate pair to 180°, gives a value of x that makes nothing parallel.",
    ...at("tests", REVERSE),
  },
  {
    id: "transitive-parallel",
    term: "Transitive Property of Parallel Lines",
    kind: "theorem",
    definition: "If two lines are parallel to the same line, then they are parallel to each other.",
    brief: "Parallel to the same line means parallel to each other",
    because: "A transversal meets all three: a ∥ b makes ∠1 ≅ ∠2, b ∥ c makes ∠2 ≅ ∠3, so ∠1 ≅ ∠3 and the converse of the postulate gives a ∥ c.",
    examples: [
      { figure: "threeLines", caption: "a ∥ b and b ∥ c, so a ∥ c." },
      { text: "Each swimming lane is parallel to the next, so the first lane is parallel to the last: a ∥ b, b ∥ c, and so a ∥ c." },
    ],
    watch: "It needs the shared middle line, just as the Transitive Property of equality needs the shared middle term.",
    ...at("tests", REVERSE),
  },
  {
    id: "perp-to-same-line",
    term: "Two lines perpendicular to a third",
    kind: "theorem",
    definition: "If two lines are both perpendicular to the same line, then they are parallel to each other.",
    brief: "Two perpendiculars to one line are parallel",
    because: "Both right angles sit in the same corner of their crossing — corresponding angles, and congruent because all right angles are — so the converse of the postulate applies.",
    examples: [
      { figure: "twoPerpendiculars", caption: "m ⊥ p and n ⊥ p: the right angles ∠1 and ∠5 correspond, so m ∥ n." },
      { text: "Every valve piston meets the lead pipe at 90°, so the pistons are parallel to one another." },
    ],
    watch: "In a plane only. Two lines perpendicular to one line in space can miss each other entirely.",
    ...at("tests", REVERSE),
  },

  // --- Stage 6 · Exactly one line --------------------------------------------------
  {
    id: "parallel-postulate",
    term: "Parallel Postulate",
    kind: "postulate",
    definition: "For point P not on line l, there is exactly one line parallel to l through P.",
    brief: "Exactly one parallel through a point off the line",
    because:
      "The converse of the postulate says a line with the right corresponding angle is parallel; this one says it is the only one. Together they make “the parallel through P” a single, definite line.",
    examples: [
      { figure: "parallelPostulate", caption: "One line through P never meets l; every other line through P does." },
      { text: "Through P, 3 cm above line l, exactly 1 line never meets l." },
    ],
    watch: "P must be off the line. Through a point on l, the only line “parallel” to l is l itself.",
    ...at("tests", ONE),
  },
  {
    id: "construct-parallel",
    term: "Constructing a parallel through a point",
    kind: "reasoning",
    definition: "Draw a line from a point on the line through P, copy the angle it makes with the line at P, and extend the copy's side: that side is the line through P that never meets the first.",
    brief: "Copy the angle at P; its side is the parallel",
    because:
      "The copied angle and the original are corresponding angles made congruent on purpose, so the Converse of the Corresponding Angles Postulate says the lines are parallel — and the Parallel Postulate says this is the only such line.",
    examples: [
      { figure: "constructParallel4", caption: "∠ZPW is a copy of ∠YXP; they correspond, so PZ ∥ XY." },
      { text: "Copy the 58° angle at X up at P; the copy's side through P is the parallel to XY." },
    ],
    watch: "P must not lie on XY, or there is no angle to copy and no second line to draw.",
    ...at("tests", ONE),
  },
  {
    id: "perpendicular-postulate",
    term: "Perpendicular Postulate",
    kind: "postulate",
    definition: "If there is a line and a point not on the line, then there is exactly one line through the point perpendicular to the given line.",
    brief: "Exactly one perpendicular through a point off the line",
    because:
      "It is what lets a proof draw a perpendicular that the figure did not have — the proof of the converse of the Perpendicular Bisector Theorem does exactly that.",
    examples: [
      { figure: "perpendicularPostulate", caption: "One line through P meets l at 90°; the slanted one does not." },
      { text: "From P, 5 m above the floor, exactly 1 plumb line drops at 90° to the floor." },
    ],
    watch: "Drawing an extra line in a proof is allowed only when a postulate says the line exists — this one, or the Parallel Postulate.",
    ...at("perpendicular", ONE),
  },
  {
    id: "perp-transversal-theorem",
    term: "Perpendicular Transversal Theorem",
    kind: "theorem",
    definition: "If a line is perpendicular to one of two parallel lines, then it is perpendicular to the other as well.",
    brief: "Perpendicular to one parallel means perpendicular to both",
    because:
      "The right angle at the first line corresponds to the angle at the second, so the Corresponding Angles Postulate makes that one 90° too.",
    examples: [
      { figure: "perpTransversal", caption: "m ∥ n and t ⊥ m at ∠1, so ∠5 is right too and t ⊥ n." },
      { text: "j ∥ k and t ⊥ k: then t ⊥ j, since the 90° angle at k corresponds to an angle at j." },
    ],
    watch: "It needs only the Corresponding Angles Postulate, so it could have come straight after Lesson 3.1 — the reference places it here, with the perpendiculars.",
    ...at("perpendicular", ONE),
  },

  // --- Stage 7 · Distance: the perpendicular bisector -------------------------------
  {
    id: "equidistant",
    term: "Equidistant",
    kind: "definition",
    definition: "Equally far from two points: P is this from A and B when PA = PB.",
    brief: "The same distance from both points",
    because: "Lesson 3.3's whole question is which points are equally far from both ends of a segment — and the answer is a line.",
    examples: [
      { figure: "equidistantPoint", caption: "The ticks mark PA = PB, so P is equidistant from A and B." },
      { text: "A lamp 13 m from one end of a path and 13 m from the other is equidistant from the two ends." },
    ],
    watch: "Equally far from A and B is not the same as being the midpoint: the midpoint is one such point, and there are infinitely many others.",
    ...at("perpendicular", DISTANCE),
  },
  {
    id: "perp-bisector-theorem",
    term: "Perpendicular Bisector Theorem",
    kind: "theorem",
    definition: "In a plane, if a point is on the perpendicular bisector of a segment, then it is equidistant from the endpoints of the segment.",
    brief: "On the perpendicular bisector means equidistant from the endpoints",
    because:
      "CD meets AB at its midpoint at 90°, so △ADC and △BDC are right triangles with AD = BD and a shared leg CD. The Pythagorean Theorem gives AC² = BC², so AC = BC.",
    examples: [
      { figure: "perpBisectorTheorem", caption: "CD is the ⊥ bisector of AB, so AC = BC." },
      { text: "LM crosses NP at its midpoint at 90°, so LN = LP: if LN = 12w + 7 and LP = 15w − 5, then w = 4 and LN = 55." },
    ],
    watch: "Both facts are needed — the midpoint and the right angle. A bisector that is not perpendicular, or a perpendicular that misses the midpoint, guarantees nothing.",
    ...at("perpendicular", DISTANCE),
  },
  {
    id: "converse-perp-bisector",
    term: "Converse of the Perpendicular Bisector Theorem",
    kind: "theorem",
    definition: "If a point is equidistant from the endpoints of a segment, then it is on the perpendicular bisector of the segment.",
    brief: "Equidistant from the endpoints means on the perpendicular bisector",
    because:
      "Draw the one perpendicular from C to AB (the Perpendicular Postulate allows it). Two right triangles share CD, and CA = CB, so the Pythagorean Theorem forces AD = BD: D is the midpoint.",
    examples: [
      { figure: "perpBisectorConverse2", caption: "CA = CB, so the perpendicular CD lands on the midpoint D of AB." },
      { text: "AB = CB = 13 and AD = DC = 10, so B and D are both equidistant from A and C, and BD ⊥ AC." },
    ],
    watch: "It is the converse, and it had to be proved separately — the theorem alone would not do.",
    ...at("perpendicular", DISTANCE),
  },
  {
    id: "construct-perp-bisector",
    term: "Constructing a perpendicular bisector",
    kind: "reasoning",
    definition: "Draw arcs of one radius, more than half the segment, from both endpoints; the line through the two points where they cross is the one you want.",
    brief: "Equal arcs from both ends; join their crossings",
    because:
      "Each crossing is one radius from X and one radius from Y — equidistant — so by the converse it lies on the perpendicular bisector. Two points fix a line.",
    examples: [
      { figure: "constructPerpBisector3", caption: "A and B are each 140 from X and from Y, so line AB is the ⊥ bisector of XY." },
      { text: "Fold the paper so X lands on Y: the crease is the perpendicular bisector of XY." },
    ],
    watch: "The radius must be more than half of XY, or the arcs never meet.",
    ...at("perpendicular", DISTANCE),
  },
  {
    id: "construct-perp-through-point",
    term: "Constructing a perpendicular through a point",
    kind: "reasoning",
    definition: "From P, draw an arc cutting the line at A and B; from A and B, draw equal arcs crossing on the far side; the line from P through that crossing is the one you want.",
    brief: "Arc from P to make A and B; equal arcs from A and B; join",
    because:
      "P is equidistant from A and B, and so is the new crossing — both lie on the perpendicular bisector of AB, which is the perpendicular through P.",
    examples: [
      { figure: "constructPerpThroughPoint3", caption: "PA = PB and QA = QB, so PQ is the ⊥ bisector of AB — and so PQ ⊥ m." },
      { text: "The first arc makes PA = PB = 150; the next two make QA = QB = 150; line PQ ⊥ m." },
    ],
    watch: "It is the perpendicular bisector construction in disguise: the first arc manufactures the segment AB to bisect.",
    ...at("perpendicular", DISTANCE),
  },
  {
    id: "length-equations",
    term: "Solving for an unknown length",
    kind: "reasoning",
    definition: "Turn equal distances or equal halves into an equation, solve it, and substitute back for the length the question asks for.",
    brief: "Equal distances or halves become an equation",
    because: "The theorem gives equal lengths; the equation is only the bookkeeping. Deciding which lengths are equal is the geometry.",
    examples: [
      { text: "BD ⊥ AC and AB = BC = 21, so D is the midpoint: AD = x − 8 = 16 gives x = 24." },
      { text: "PS = RS and t ⊥ n at S, so PQ = RQ: 8x + 31 = 12x − 5 gives x = 9, and PQ = 103 ft." },
    ],
    watch: "Check which theorem applies before writing anything. Equal sides give the midpoint only when the segment to the base is perpendicular to it.",
    ...at("perpendicular", DISTANCE),
  },
];
