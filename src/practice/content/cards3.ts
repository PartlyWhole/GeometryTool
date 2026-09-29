// Module 3 flashcards: multiple choice, most of them with a figure.
//
// Half are generated, over the same varied figures as the Angle pairs
// exercise, so a card can't be answered from memory of one drawing. The rest
// are authored: the Turn and Talk question, the flow proof's reasons, and the
// words that the five names are built from.
import type { LogicCard } from "./logicCards";
import { flowProof, parallelMN, parallelWithMeasure, transversal } from "./library3";

/** No arrowheads, and ∠1 drawn — and labelled — at the 116° the card states. */
const unmarked116 = () =>
  transversal({ cross: 64, measures: { "1": 116 }, title: "Unmarked, m∠1 = 116°" });
import {
  RELATION_LABEL,
  consequence,
  consequenceText,
  explainConsequence,
  explainRelation,
  relationOf,
  variant,
  type Consequence,
  type Relation,
} from "./pairs3";
import { ang } from "../terms";
import { type MixedItem, testItems } from "./tests3";
import { bisectorItems } from "./bisector3";
import { rng } from "./generators";

const hl = (...ns: string[]) => ns.map((n) => ({ obj: ang(n), role: "given" as const }));

const AUTHORED: LogicCard[] = [
  {
    id: "m3c-postulate",
    tag: "Turn and Talk",
    prompt:
      "The reference accepts the Corresponding Angles Postulate without proof and proves the other four rules from it. Why is the corresponding pair the natural one to accept?",
    choices: [
      "Slide one crossing along the transversal onto the other and each angle lands on its corresponding angle — the fact can be seen, with no other step.",
      "It is the only one of the five that cannot be proved from the others.",
      "Corresponding angles are congruent whether or not the lines are parallel.",
      "It is the only rule of the five that mentions a transversal.",
    ],
    correct: 0,
    why: "Any of the five could serve as the postulate: each follows from any other with one vertical pair or one linear pair. The corresponding pair is the one that needs nothing extra — the two crossings are copies of each other, slid along t.",
    whyPerChoice: {
      1: "Each of the five can be proved from any other one. The last flow proof in Practice proves ∠2 ≅ ∠6 from the Alternate Exterior Angles Theorem.",
      2: "Only when the lines are parallel. On lines that meet, corresponding angles have different measures.",
      3: "All five are about two lines cut by a transversal.",
    },
  },
  {
    id: "m3c-either",
    tag: "Parallel lines",
    context: ["m ∥ n, and t crosses both — not at right angles."],
    prompt: "Every one of the eight angles is ___ ∠1.",
    choices: [
      "either congruent to or supplementary to",
      "either congruent to or complementary to",
      "either vertical to or adjacent to",
      "congruent to",
    ],
    correct: 0,
    why: "The reference opens with this: when parallel lines are cut by a transversal, every angle formed is congruent or supplementary to a given one. Four of them measure m∠1; the other four measure 180° − m∠1.",
    figure: parallelMN(),
  },
  {
    id: "m3c-not-congruent",
    tag: "Parallel lines",
    context: ["m ∥ n, and t is not perpendicular to them."],
    prompt: "Which pair is NOT congruent?",
    choices: [
      "Consecutive interior angles",
      "Alternate interior angles",
      "Corresponding angles",
      "Alternate exterior angles",
    ],
    correct: 0,
    why: "The consecutive pairs — interior and exterior — are supplementary. The alternate pairs and the corresponding pair are congruent.",
    figure: parallelMN(),
  },
  {
    id: "m3c-unmarked-5",
    tag: "Only the marks count",
    context: ["The lines carry no arrowheads. m∠1 = 116°."],
    prompt: "What is m∠5?",
    choices: ["It cannot be determined", "116°", "64°", "180°"],
    correct: 0,
    why: "∠1 and ∠5 are corresponding angles, but only parallel lines make them congruent — and nothing says these are parallel, however they look.",
    whyPerChoice: {
      1: "That is what m ∥ n would give. The figure does not mark the lines parallel.",
      2: "64° is the supplement, which no rule here gives either.",
    },
    figure: unmarked116(),
  },
  {
    id: "m3c-unmarked-3",
    tag: "Only the marks count",
    context: ["The lines carry no arrowheads. m∠1 = 116°."],
    prompt: "What is m∠3?",
    choices: ["116°", "It cannot be determined", "64°", "180°"],
    correct: 0,
    why: "∠1 and ∠3 are vertical angles, and vertical angles are congruent whether or not any lines are parallel.",
    whyPerChoice: {
      1: "∠1 and ∠3 are at the same crossing, opposite each other. That needs no parallel lines.",
    },
    figure: unmarked116(),
  },
  {
    id: "m3c-flow-2",
    tag: "Flow proof",
    context: ["a ∥ b  →  ∠1 ≅ ∠2  →  ∠2 ≅ ∠3  →  ∠1 ≅ ∠3"],
    prompt: "What reason goes under the box ∠1 ≅ ∠2?",
    choices: [
      "Corresponding Angles Postulate",
      "Alternate Interior Angles Theorem",
      "Vertical Angles Theorem",
      "Transitive Property",
    ],
    correct: 0,
    why: "∠1 and ∠2 are in the same position at the two crossings of c — corresponding angles — and a ∥ b.",
    figure: flowProof(),
  },
  {
    id: "m3c-flow-3",
    tag: "Flow proof",
    context: ["a ∥ b  →  ∠1 ≅ ∠2  →  ∠2 ≅ ∠3  →  ∠1 ≅ ∠3"],
    prompt: "What reason goes under the box ∠2 ≅ ∠3?",
    choices: [
      "Vertical Angles Theorem",
      "Corresponding Angles Postulate",
      "Alternate Interior Angles Theorem",
      "Transitive Property",
    ],
    correct: 0,
    why: "∠2 and ∠3 sit opposite each other at the crossing of b and c: vertical angles.",
    figure: flowProof(),
  },
  {
    id: "m3c-flow-last",
    tag: "Flow proof",
    context: ["a ∥ b  →  ∠1 ≅ ∠2  →  ∠2 ≅ ∠3  →  ∠1 ≅ ∠3"],
    prompt: "What reason goes under the last box, ∠1 ≅ ∠3?",
    choices: [
      "Transitive Property",
      "Alternate Interior Angles Theorem",
      "Vertical Angles Theorem",
      "Given",
    ],
    correct: 0,
    why: "The two boxes before it share ∠2, and the Transitive Property chains them: ∠1 ≅ ∠2 and ∠2 ≅ ∠3, so ∠1 ≅ ∠3.",
    whyPerChoice: {
      1: "That is the theorem this proof establishes. Citing it would be circular.",
    },
    figure: flowProof(),
  },
  {
    id: "m3c-alternate",
    tag: "The words",
    prompt: "In “alternate interior angles”, what does “alternate” mean?",
    choices: [
      "On opposite sides of the transversal",
      "On the same side of the transversal",
      "Between the two lines",
      "At the same crossing",
    ],
    correct: 0,
    why: "Alternate: opposite sides of the transversal. Consecutive: the same side. Interior and exterior answer the other question — between the lines, or outside.",
  },
  {
    id: "m3c-interior",
    tag: "The words",
    prompt: "In “consecutive interior angles”, what does “interior” mean?",
    choices: [
      "Between the two lines the transversal crosses",
      "Inside the angle's own arms",
      "Smaller than 90°",
      "On the same side of the transversal",
    ],
    correct: 0,
    why: "Interior is the strip between the two lines; exterior is above the top line and below the bottom one.",
  },
  {
    id: "m3c-same-side",
    tag: "The words",
    prompt: "Consecutive interior angles are also called…",
    choices: [
      "same-side interior angles",
      "alternate interior angles",
      "corresponding angles",
      "vertical angles",
    ],
    correct: 0,
    why: "Consecutive means the same side of the transversal, so some books say same-side interior angles instead.",
  },
  {
    id: "m3c-measure",
    tag: "Parallel lines",
    context: ["m ∥ n and m∠3 = 76°."],
    prompt: "What is m∠6?",
    choices: ["104°", "76°", "14°", "It cannot be determined"],
    correct: 0,
    why: "∠3 and ∠6 are consecutive interior angles — between the lines, same side of t — so they total 180°: 180 − 76 = 104°.",
    whyPerChoice: {
      1: "That would make them congruent. Consecutive interior angles are supplementary.",
      2: "14° is 90 − 76: that is the complement, and nothing here is a right angle.",
      3: "The arrowheads mark m ∥ n, so it can be.",
    },
    figure: parallelWithMeasure("3", 76),
  },
];

const shuffleIn = <T,>(r: () => number, xs: T[]) => {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** A name card over a fresh figure. */
function nameCard(r: () => number, id: string): LogicCard | undefined {
  const v = variant(r, { renumber: r() < 0.5 });
  const b = v.board;
  const ns = b.angles.map((x) => x.label!);
  const x = ns[Math.floor(r() * 8)],
    y = ns[Math.floor(r() * 8)];
  if (x === y) return;
  const rel = relationOf(b, x, y);
  if (!rel || rel === "vertical" || rel === "linearPair") return;
  const others: Relation[] = (
    ["corresponding", "altInterior", "consInterior", "altExterior", "consExterior", "none"] as Relation[]
  ).filter((k) => k !== rel);
  const choices = shuffleIn(r, [rel, ...shuffleIn(r, others).slice(0, 3)]);
  return {
    id,
    tag: "Name the pair",
    prompt: "What are ∠" + x + " and ∠" + y + " called?",
    choices: choices.map((c) => RELATION_LABEL[c]),
    correct: choices.indexOf(rel),
    why: explainRelation(b, x, y),
    figure: b,
    highlights: hl(x, y),
  };
}

/** A congruent-or-supplementary card, sometimes on lines with no mark. */
function relateCard(r: () => number, id: string): LogicCard | undefined {
  const v = r() < 0.7 ? variant(r, { parallel: true, marked: true }) : variant(r, { parallel: true, marked: false });
  const b = v.board;
  const ns = b.angles.map((x) => x.label!);
  const x = ns[Math.floor(r() * 8)],
    y = ns[Math.floor(r() * 8)];
  if (x === y) return;
  const rel = relationOf(b, x, y);
  if (rel === "vertical" || rel === "linearPair") return;
  const opts: Consequence[] = ["congruent", "supplementary", "unknown"];
  return {
    id,
    tag: v.marked ? "What follows" : "Only the marks count",
    prompt: "What must be true of ∠" + x + " and ∠" + y + "?",
    choices: opts.map((c) => consequenceText(c, x, y)),
    correct: opts.indexOf(consequence(b, x, y)),
    why: explainConsequence(b, x, y),
    figure: b,
    highlights: hl(x, y),
  };
}


/**
 * Authored cards are written with the answer first; shuffle the options so
 * it is not always A, carrying each option's own feedback with it.
 */
function reorder(r: () => number, c: LogicCard): LogicCard {
  const order = shuffleIn(r, c.choices.map((_, i) => i));
  const whyPerChoice = c.whyPerChoice
    ? Object.fromEntries(
        Object.entries(c.whyPerChoice).map(([k, v]) => [order.indexOf(Number(k)), v]),
      )
    : undefined;
  return {
    ...c,
    choices: order.map((i) => c.choices[i]),
    correct: order.indexOf(c.correct),
    whyPerChoice,
  };
}

/** A multiple-choice practice item, dealt as a card. */
const asCard = (it: MixedItem): LogicCard | undefined =>
  it.kind !== "choice"
    ? undefined
    : {
        id: it.id,
        tag: it.heading,
        context: it.context,
        prompt: it.prompt,
        choices: it.choices,
        correct: it.correct,
        why: it.why,
        whyPerChoice: it.whyPerChoice,
        figure: it.figure,
        highlights: it.highlights,
      };

/**
 * The deck follows the whole module: angle-pair cards from Lesson 3.1, and
 * from the stage exercises, the parallel tests of 3.2 and the perpendicular
 * bisector of 3.3.
 */
export function cards3(seed: number, count = 16): LogicCard[] {
  const r = rng(seed);
  const made: LogicCard[] = [];
  for (let i = 0; made.length < 6 && i < 80; i++) {
    const c = (i % 2 ? relateCard : nameCard)(r, "m3c-gen-" + seed + "-" + i);
    if (c) made.push(c);
  }
  const later = [...testItems(seed, 12), ...bisectorItems(seed, 12)]
    .map(asCard)
    .filter((c): c is LogicCard => !!c);
  made.push(...shuffleIn(r, later).slice(0, 5));
  const authored = shuffleIn(r, AUTHORED)
    .slice(0, count - made.length)
    .map((c) => reorder(r, c));
  return shuffleIn(r, [...authored, ...made]);
}
