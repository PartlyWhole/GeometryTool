// The concepts Module 3 tests: two lines cut by a transversal, and what
// parallel lines make of the angles.
//
// Wording follows the reference's two tables, except that a definition here
// never opens with its own term: "Corresponding angles lie on…" makes
// "which term is this?" a matter of spotting the word. Angle numerals refer to its
// figure, numbered clockwise from the upper left at each crossing — 1 to 4
// at the top line, 5 to 8 at the bottom — which every Module 3 figure keeps.
import type { Concept } from "./concepts";

const pairs = { topic: "pairs" as const, module: 3 as const };
const parallel = { topic: "parallel" as const, module: 3 as const };

export const CONCEPTS3: (Concept & { module: 3 })[] = [
  // --- Build Understanding: the names -------------------------------------
  {
    id: "transversal",
    term: "Transversal",
    kind: "definition",
    definition: "A line that intersects two or more coplanar lines at different points.",
    brief: "A line crossing two or more coplanar lines at different points",
    because:
      "Every angle-pair name in this module is measured from it: which side of it an angle is on, and whether the angle opens between the two lines or outside them.",
    section: "Transversals",
    article: "a",
    examples: [
      { figure: "transversalJK", caption: "Line t crosses j at one point and k at another, so t is the transversal of j and k." },
      { text: "“Line t crosses line j at one point and line k at a second, different point.”" },
    ],
    watch:
      "A line through the point where the other two already meet crosses them both at one point, not two — it is not a transversal.",
    ...pairs,
  },
  {
    id: "corresponding-angles",
    term: "Corresponding angles",
    kind: "definition",
    definition: "Angles that lie on the same side of the transversal and on the same sides of the intersecting lines.",
    brief: "Same side of the transversal, and the same side of each line",
    because:
      "They sit in the same corner at each crossing: slide one crossing along t onto the other and the two angles coincide.",
    section: "Transversals",
    examples: [
      { figure: "pairCorresponding", caption: "∠1 and ∠5: each above its line, each left of t." },
      { text: "∠2 sits above line j and right of t; ∠6 sits above line k and right of t." },
    ],
    watch:
      "The name is about position only. On lines that are not parallel, corresponding angles are still corresponding — they are just not congruent.",
    ...pairs,
  },
  {
    id: "alternate-interior",
    term: "Alternate interior angles",
    kind: "definition",
    definition: "Nonadjacent angles that lie on opposite sides of the transversal, between the intersected lines.",
    brief: "Opposite sides of the transversal, between the two lines",
    because:
      "“Alternate” is opposite sides of the transversal; “interior” is between the two lines. The pair has to be both.",
    section: "Transversals",
    examples: [
      { figure: "pairAltInterior", caption: "∠3 and ∠5: both between the lines, on opposite sides of t." },
      { text: "∠3 sits below j and right of t; ∠5 sits above k and left of t — both between the lines." },
    ],
    watch:
      "They must be nonadjacent. Two angles between the lines at the same crossing, one each side of t, form a linear pair instead.",
    ...pairs,
  },
  {
    id: "consecutive-interior",
    term: "Consecutive interior angles",
    kind: "definition",
    definition: "Angles that lie on the same side of the transversal, between the intersected lines.",
    brief: "Same side of the transversal, between the two lines",
    because:
      "“Consecutive” is the same side of the transversal; “interior” is between the two lines.",
    section: "Transversals",
    examples: [
      { figure: "pairConsInterior", caption: "∠4 and ∠5: both between the lines, both left of t." },
      { text: "∠4 sits below j and ∠5 above k, both left of t and both between the lines." },
    ],
    watch: "Some books call them same-side interior angles. The meaning is the same.",
    ...pairs,
  },
  {
    id: "alternate-exterior",
    term: "Alternate exterior angles",
    kind: "definition",
    definition: "Angles that lie on opposite sides of the transversal, outside the intersected lines.",
    brief: "Opposite sides of the transversal, outside the two lines",
    because: "Opposite sides of the transversal, and both outside the region between the lines.",
    section: "Transversals",
    examples: [
      { figure: "pairAltExterior", caption: "∠1 and ∠7: both outside the lines, on opposite sides of t." },
      { text: "∠2 sits above j and right of t; ∠8 sits below k and left of t — both outside the lines." },
    ],
    watch:
      "Outside means above the top line or below the bottom one — never in the strip between them.",
    ...pairs,
  },
  {
    id: "consecutive-exterior",
    term: "Consecutive exterior angles",
    kind: "definition",
    definition: "Angles that lie on the same side of the transversal, outside the intersected lines.",
    brief: "Same side of the transversal, outside the two lines",
    because: "The same side of the transversal, and both outside the region between the lines.",
    section: "Transversals",
    examples: [
      { figure: "pairConsExterior", caption: "∠2 and ∠7: both outside the lines, both right of t." },
      { text: "∠1 sits above j and ∠8 below k, both left of t and both outside the lines." },
    ],
    watch: "Some books call them same-side exterior angles. The meaning is the same.",
    ...pairs,
  },
  {
    id: "parallel-lines",
    term: "Parallel lines",
    kind: "definition",
    definition: "Coplanar lines that do not intersect. A figure marks them with matching arrowheads.",
    brief: "Coplanar lines that never meet",
    because:
      "Written m ∥ n. It is the condition every rule in this module starts from: without it, the angle pairs have names and nothing more.",
    section: "Parallel lines",
    examples: [
      { figure: "parallelMN", caption: "The matching arrowheads on m and n say m ∥ n." },
      { text: "Two rails stay 1.4 m apart along their whole length, so they never meet." },
    ],
    watch:
      "Lines that look parallel are not parallel until the figure marks them or the problem says so — the same rule as tick marks and arcs.",
    ...parallel,
  },

  // --- The postulate and the four theorems --------------------------------
  {
    id: "corresponding-angles-postulate",
    term: "Corresponding Angles Postulate",
    kind: "postulate",
    definition: "If two parallel lines are cut by a transversal, then the resulting corresponding angles are congruent.",
    brief: "Parallel lines make corresponding angles congruent",
    because:
      "It is the one relationship accepted without proof. Each of the four theorems is proved from it, with a vertical pair or a linear pair to finish the job.",
    section: "Parallel lines",
    examples: [
      { figure: "thmCorresponding", caption: "m ∥ n, so the corresponding angles ∠1 and ∠5 are congruent." },
      { text: "m ∥ n, and ∠2 and ∠6 both sit above their line and right of t, so ∠2 ≅ ∠6." },
    ],
    watch: "Without m ∥ n it says nothing: corresponding angles on lines that meet are not congruent.",
    ...parallel,
  },
  {
    id: "alt-interior-theorem",
    term: "Alternate Interior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of alternate interior angles are congruent.",
    brief: "Parallel lines make alternate interior angles congruent",
    because:
      "∠3 ≅ ∠7 because they correspond, and ∠7 ≅ ∠5 because they are vertical — so ∠3 ≅ ∠5.",
    section: "Parallel lines",
    examples: [
      { figure: "thmAltInterior", caption: "m ∥ n, so ∠3 and ∠5 — between the lines, opposite sides of t — are congruent." },
      { text: "m ∥ n, and ∠4 and ∠6 sit between the lines on opposite sides of t, so ∠4 ≅ ∠6." },
    ],
    watch: "“Interior” means between the two lines, not inside some shape.",
    ...parallel,
  },
  {
    id: "cons-interior-theorem",
    term: "Consecutive Interior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of consecutive interior angles are supplementary.",
    brief: "Parallel lines make consecutive interior angles supplementary",
    because:
      "∠5 ≅ ∠1 because they correspond, and ∠1 and ∠4 form a linear pair — so ∠4 and ∠5 total 180°.",
    section: "Parallel lines",
    examples: [
      { figure: "thmConsInterior", caption: "m ∥ n, so ∠4 and ∠5 — between the lines, same side of t — total 180°." },
      { text: "m ∥ n, and ∠3 and ∠6 sit between the lines on the same side of t, so m∠3 + m∠6 = 180." },
    ],
    watch:
      "Supplementary, not congruent: one of the pair is acute and the other obtuse, unless t is perpendicular to the lines and both are right angles.",
    ...parallel,
  },
  {
    id: "alt-exterior-theorem",
    term: "Alternate Exterior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of alternate exterior angles are congruent.",
    brief: "Parallel lines make alternate exterior angles congruent",
    because:
      "∠1 ≅ ∠5 because they correspond, and ∠5 ≅ ∠7 because they are vertical — so ∠1 ≅ ∠7.",
    section: "Parallel lines",
    examples: [
      { figure: "thmAltExterior", caption: "m ∥ n, so ∠1 and ∠7 — outside the lines, opposite sides of t — are congruent." },
      { text: "m ∥ n, and ∠1 and ∠7 sit outside the lines on opposite sides of t, so ∠1 ≅ ∠7." },
    ],
    watch: "Congruent, like the alternate interior pair — it is the consecutive pairs that are supplementary.",
    ...parallel,
  },
  {
    id: "cons-exterior-theorem",
    term: "Consecutive Exterior Angles Theorem",
    kind: "theorem",
    definition: "If two parallel lines are cut by a transversal, then the pairs of consecutive exterior angles are supplementary.",
    brief: "Parallel lines make consecutive exterior angles supplementary",
    because:
      "∠2 ≅ ∠6 because they correspond, and ∠6 and ∠7 form a linear pair — so ∠2 and ∠7 total 180°.",
    section: "Parallel lines",
    examples: [
      { figure: "thmConsExterior", caption: "m ∥ n, so ∠2 and ∠7 — outside the lines, same side of t — total 180°." },
      { text: "m ∥ n, and ∠2 and ∠7 sit outside the lines on the same side of t, so m∠2 + m∠7 = 180." },
    ],
    watch: "Supplementary, like the consecutive interior pair — the alternate pairs are the congruent ones.",
    ...parallel,
  },

  // --- Proof -----------------------------------------------------------------
  {
    id: "flow-proof",
    term: "Flow proof",
    kind: "reasoning",
    definition: "An argument drawn as boxes joined by arrows, showing its structure, with the justification for each step written below its box.",
    brief: "Boxes joined by arrows, with a reason under each box",
    because:
      "It is the same argument as a two-column proof, drawn so the eye can follow what rests on what: an arrow says the box it points to follows from the box it leaves.",
    section: "Proof",
    article: "a",
    examples: [
      { text: "a ∥ b → ∠1 ≅ ∠2 → ∠2 ≅ ∠3 → ∠1 ≅ ∠3, each box with its reason written underneath." },
    ],
    watch: "The arrows carry the logic. A box with no arrow into it must be a given or something the figure shows.",
    topic: "parallel",
    module: 3,
  },
];
