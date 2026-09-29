// The Module 3 path: units, lessons and what each lesson asks.
//
// docs/PATH-PLAN.md sets out the design. One new idea per lesson, taught
// just before it is practised; guided questions (few options, the angles
// highlighted) before core ones (all options, varied figures), each kind of
// exercise asked once; a couple of review questions from earlier lessons.
// Drilling is left to review and endless practice, which draw on the core
// makers. Units whose lessons have no recipe yet are shown but locked.
import { CHAPTERS } from "../content/story";
import { CONCEPTS3 } from "../content/concepts3";
import { conceptQuestions } from "../content/conceptQuiz";
import { pairItems } from "../content/pairs3";
import {
  type Maker,
  countAngles,
  crossingCore,
  crossingGuided,
  crossingRelate,
  findPartner,
  fromConceptQuestion,
  fromPairItem,
  markedParallel,
  namePair,
  rightAngles,
  tapInterior,
  tapSameSide,
  tapTransversal,
} from "./questions";
import {
  FLOW_REASONS_EARLY,
  angleAlgebra,
  authoredBisector,
  authoredFlow,
  authoredNumber,
  authoredTest,
  bisectorEnoughFor,
  bisectorLengths,
  buildProof,
  converseTrue,
  direction,
  enoughFor,
  findAngle,
  flowFor,
  howManyParallel,
  isEquidistant,
  onBisector,
  oneStep,
  nextStep,
  orderSteps,
  findRight,
  parallelX,
  pythagorean,
  reflectionLength,
  relate,
  sameLine,
  tapFamily,
  tapRight,
  whichConverse,
  whichRule,
  whichTestFor,
} from "./makers";
import { BISECTOR_CASES } from "../content/bisector3";
import type { PairKind } from "../terms";

export type Lesson = {
  id: string;
  title: string;
  /** The concepts this lesson introduces, shown as walkthroughs first. */
  learn: string[];
  /** Few options and highlighted angles: the first questions of a lesson. */
  guided?: Maker[];
  /** Full-difficulty questions: the body of the lesson, and its review pool. */
  core?: Maker[];
  /**
   * A "Prove it" lesson: whole proofs, too heavy to gate the path on. It
   * never locks the next lesson, and its proofs are not drawn for review.
   */
  optional?: boolean;
  /** How many review questions from earlier lessons, when not 2. */
  review?: number;
};

export type Unit = {
  id: string;
  n: number;
  title: string;
  question: string;
  lessons: Lesson[];
  /** A unit without recipes yet is laid out on the path, and locked. */
  ready: boolean;
  /** Unit 3 is one lesson, and has no checkpoint of its own. */
  checkpoint: boolean;
  /** Earlier units without a checkpoint of their own, which this one's covers. */
  covers?: string[];
};

const ALL_PAIRS = ["corresponding", "altInterior", "consInterior", "altExterior", "consExterior"] as const;

/** A full naming, partner or relate question from the Angle pairs generator. */
const anyPair = (mode: "name" | "find" | "relate"): Maker => ({
  id: "any-pair-" + mode,
  family: mode === "name" ? "name-pair" : mode === "find" ? "find-partner" : "relate",
  concepts:
    mode === "relate"
      ? ["two-value-rule"]
      : ["corresponding-angles", "alternate-interior", "consecutive-interior", "alternate-exterior", "consecutive-exterior"],
  make: (r) => fromPairItem(pairItems(Math.floor(r() * 1e9), 3)[mode === "name" ? 0 : mode === "find" ? 1 : 2]),
});

const C = "corresponding", AI = "altInterior", AE = "altExterior", CI = "consInterior", CE = "consExterior";
const ALL: PairKind[] = [C, AI, AE, CI, CE];

/** A definition question drawn from one unit's concepts only. */
const definitions = (id: string, ids: string[]): Maker => ({
  id,
  family: "definitions",
  concepts: ids,
  make: (r) => {
    const qs = conceptQuestions(Math.floor(r() * 1e9), 6, CONCEPTS3.filter((c) => ids.includes(c.id)));
    return fromConceptQuestion(qs[0]);
  },
});

const chapterOf = (id: string) => CHAPTERS.find((c) => c.id === id)!;

export const UNITS: Unit[] = [
  {
    id: "u1",
    n: 1,
    title: "Foundations",
    question: chapterOf("m3-foundations").question,
    ready: true,
    checkpoint: true,
    lessons: [
      {
        id: "1.1",
        title: "One crossing",
        learn: ["angles-at-a-crossing"],
        guided: [crossingGuided, crossingRelate],
        core: [crossingCore, crossingRelate],
      },
      {
        id: "1.2",
        title: "Marks you can trust",
        learn: ["parallel-lines", "perpendicular-lines"],
        guided: [markedParallel],
        core: [markedParallel, rightAngles],
      },
    ],
  },
  {
    id: "u2",
    n: 2,
    title: "Read the figure",
    question: chapterOf("m3-read").question,
    ready: true,
    checkpoint: true,
    lessons: [
      { id: "2.1", title: "The transversal", learn: ["transversal"], guided: [countAngles], core: [tapTransversal] },
      { id: "2.2", title: "Between or outside?", learn: ["interior-exterior"], guided: [tapInterior], core: [tapInterior] },
      { id: "2.3", title: "Which side?", learn: ["alternate-consecutive"], guided: [tapSameSide], core: [tapSameSide] },
      {
        id: "2.4",
        title: "Same corner",
        learn: ["corresponding-angles"],
        guided: [namePair("name-corr-2", ["corresponding"], ["corresponding", "altInterior"], 2, { standard: true })],
        core: [findPartner("find-corr", ["corresponding"])],
      },
      {
        id: "2.5",
        title: "Inside pairs",
        learn: ["alternate-interior", "consecutive-interior"],
        guided: [namePair("name-inside-3", ["altInterior", "consInterior"], ["altInterior", "consInterior", "corresponding"], 3, { standard: true })],
        core: [
          findPartner("find-inside", ["altInterior", "consInterior"]),
          namePair("name-inside", ["altInterior", "consInterior"], ["altInterior", "consInterior", "corresponding", "altExterior"], 4),
        ],
      },
      {
        id: "2.6",
        title: "Outside pairs",
        learn: ["alternate-exterior", "consecutive-exterior"],
        guided: [namePair("name-outside-3", ["altExterior", "consExterior"], ["altExterior", "consExterior", "corresponding"], 3, { standard: true })],
        core: [
          findPartner("find-outside", ["altExterior", "consExterior"]),
          namePair("name-all", [...ALL_PAIRS], [...ALL_PAIRS], 4),
        ],
      },
      {
        id: "2.7",
        title: "Any pair",
        learn: [],
        guided: [namePair("name-all-standard", [...ALL_PAIRS], [...ALL_PAIRS], 4, { standard: true })],
        core: [
          anyPair("name"),
          anyPair("find"),
          definitions("defs-u2", ["transversal", "interior-exterior", "alternate-consecutive", "corresponding-angles", "alternate-interior", "consecutive-interior", "alternate-exterior", "consecutive-exterior"]),
        ],
      },
    ],
  },
  {
    id: "u3",
    n: 3,
    title: "The first assumption",
    question: chapterOf("m3-first").question,
    ready: true,
    checkpoint: false,
    lessons: [
      {
        id: "3.1",
        title: "One assumption",
        learn: ["corresponding-angles-postulate"],
        guided: [relate("cap-guided", [C], { standard: true, options: 2, unmarked: 0 })],
        core: [relate("cap-relate", [C], { unmarked: 0.35 }), findAngle("cap-find", [C])],
      },
    ],
  },
  {
    id: "u4",
    n: 4,
    title: "Derive the angle theorems",
    question: chapterOf("m3-derive").question,
    ready: true,
    checkpoint: true,
    // Unit 3 has no checkpoint of its own; this one covers it.
    covers: ["u3"],
    lessons: [
      {
        id: "4.1",
        title: "Across and down",
        learn: ["alt-interior-theorem"],
        guided: [relate("ait-guided", [AI], { standard: true, options: 2, unmarked: 0 })],
        core: [relate("ait-relate", [C, AI]), whichRule("ait-rule", [C, AI]), findAngle("ait-find", [C, AI])],
      },
      {
        id: "4.2",
        title: "Boxes and arrows",
        learn: ["flow-proof"],
        guided: [authoredFlow("flow-book", ["flow-proof", "alt-interior-theorem"], ["m3-flow-book"], FLOW_REASONS_EARLY)],
        core: [
          flowFor("flow-ait", [AI], FLOW_REASONS_EARLY),
          authoredFlow("flow-ait-46", ["flow-proof", "alt-interior-theorem"], ["m3-flow-ait-46"], FLOW_REASONS_EARLY),
          oneStep("step-ait", ["flow-proof", "alt-interior-theorem"], ["m3-proof-ait"]),
        ],
      },
      {
        id: "4.3",
        title: "Outside, the same way",
        learn: ["alt-exterior-theorem"],
        guided: [relate("aet-guided", [AE], { standard: true, options: 2, unmarked: 0 })],
        core: [relate("aet-relate", [C, AI, AE]), whichRule("aet-rule", [C, AI, AE]), findAngle("aet-find", [C, AI, AE]), flowFor("flow-aet", [AE])],
      },
      {
        id: "4.4",
        title: "A linear pair instead",
        learn: ["cons-interior-theorem"],
        guided: [relate("cit-guided", [CI], { standard: true, options: 2, unmarked: 0 })],
        core: [relate("cit-relate", [C, AI, AE, CI]), whichRule("cit-rule", [C, AI, AE, CI]), findAngle("cit-find", [C, AI, AE, CI])],
      },
      {
        id: "4.5",
        title: "And outside",
        learn: ["cons-exterior-theorem"],
        guided: [relate("cet-guided", [CE], { standard: true, options: 2, unmarked: 0 })],
        core: [relate("cet-relate", ALL), whichRule("cet-rule", ALL), findAngle("cet-find", ALL), flowFor("flow-cons", [CI, CE])],
      },
      {
        id: "4.6",
        title: "Two values",
        learn: ["two-value-rule"],
        guided: [tapFamily("family-standard", "congruent", { standard: true })],
        core: [tapFamily("family-congruent", "congruent"), tapFamily("family-supplementary", "supplementary"), findAngle("find-any", "any"), anyPair("relate")],
      },
      {
        id: "4.7",
        title: "Find x",
        learn: ["angle-equations"],
        guided: [authoredNumber("alg-book", ["angle-equations"], ["m3-num-alg-x", "m3-num-alg-m", "m3-num-alg-supp", "m3-num-two-step"])],
        core: [angleAlgebra("alg", ALL), authoredNumber("alg-book-core", ["angle-equations"], ["m3-num-alg-x", "m3-num-alg-m", "m3-num-alg-supp", "m3-num-two-step", "m3-num-none"])],
      },
      {
        id: "4.8",
        title: "Prove it",
        learn: [],
        optional: true,
        review: 0,
        guided: [oneStep("step-forward", ["flow-proof"], ["m3-proof-ait", "m3-proof-aet", "m3-proof-cit", "m3-proof-cet", "m3-proof-none"])],
        core: [buildProof("prove-forward", ["flow-proof", "angle-equations"], ["m3-proof-aet", "m3-proof-cit", "m3-proof-cet", "m3-proof-none", "m3-proof-solve"])],
      },
    ],
  },
  {
    id: "u5",
    n: 5,
    title: "Reverse it",
    question: chapterOf("m3-reverse").question,
    ready: true,
    checkpoint: true,
    lessons: [
      { id: "5.1", title: "Turn it round", learn: ["converse"], guided: [whichConverse], core: [converseTrue, whichConverse] },
      {
        id: "5.2",
        title: "The second assumption",
        learn: ["converse-cap"],
        guided: [whichTestFor("test-cap-guided", [C])],
        core: [whichTestFor("test-cap", [C]), enoughFor("enough-cap", [C], [C])],
      },
      {
        id: "5.3",
        title: "Alternate tests",
        learn: ["converse-ait", "converse-aet"],
        guided: [whichTestFor("test-alt-guided", [AI, AE], [C, AI, AE])],
        core: [
          whichTestFor("test-alt", [C, AI, AE]),
          enoughFor("enough-alt", [C, AI, AE], [C, AI, AE]),
          authoredFlow("flow-tiles", ["converse-ait", "converse-cap"], ["m3-flow-tiles"]),
        ],
      },
      {
        id: "5.4",
        title: "Consecutive tests",
        learn: ["converse-cit", "converse-cet"],
        guided: [enoughFor("enough-cons-guided", [CI, CE], ALL)],
        core: [whichTestFor("test-all", ALL), enoughFor("enough-all", ALL)],
      },
      {
        id: "5.5",
        title: "Forwards or backwards?",
        learn: [],
        guided: [direction],
        core: [direction, whichRule("rule-all", ALL), whichTestFor("test-all-again", ALL)],
      },
      { id: "5.6", title: "Make them parallel", learn: ["parallel-equations"], guided: [parallelX], core: [parallelX, enoughFor("enough-mixed", ALL)] },
      {
        id: "5.7",
        title: "Parallel to the same line",
        learn: ["transitive-parallel", "perp-to-same-line"],
        guided: [sameLine],
        core: [sameLine, definitions("defs-u5", ["converse", "converse-cap", "converse-ait", "converse-aet", "converse-cit", "converse-cet", "transitive-parallel", "perp-to-same-line"])],
      },
      {
        id: "5.8",
        title: "Prove it",
        learn: [],
        optional: true,
        review: 0,
        guided: [oneStep("step-converse", ["converse-cap"], ["m3-proof-conv-ait", "m3-proof-conv-aet", "m3-proof-conv-cit", "m3-proof-transitive", "m3-proof-two-perps"])],
        core: [buildProof("prove-converse", ["converse-cap", "transitive-parallel", "perp-to-same-line"], ["m3-proof-conv-ait", "m3-proof-conv-aet", "m3-proof-conv-cit", "m3-proof-transitive", "m3-proof-two-perps"])],
      },
    ],
  },
  {
    id: "u6",
    n: 6,
    title: "Exactly one line",
    question: chapterOf("m3-one").question,
    ready: true,
    checkpoint: true,
    lessons: [
      { id: "6.1", title: "Only one", learn: ["parallel-postulate"], guided: [howManyParallel], core: [howManyParallel, sameLine] },
      {
        id: "6.2",
        title: "Copy the angle",
        learn: ["construct-parallel"],
        guided: [nextStep("next-parallel", ["construct-parallel"], "parallel")],
        core: [
          orderSteps("order-parallel", ["construct-parallel"], "parallel"),
          nextStep("next-parallel-core", ["construct-parallel"], "parallel"),
          authoredTest("construct-why", ["construct-parallel"], ["m3t-construct-why", "m3t-construct-postulate", "m3t-construct-off"]),
        ],
      },
      {
        id: "6.3",
        title: "Square to both",
        learn: ["perpendicular-postulate", "perp-transversal-theorem"],
        guided: [authoredTest("how-many-perp", ["perpendicular-postulate"], ["m3t-how-many-perp"]), authoredTest("perp-transversal-guided", ["perp-transversal-theorem"], ["m3t-perp-transversal"])],
        core: [tapRight, authoredTest("perp-transversal", ["perp-transversal-theorem"], ["m3t-perp-transversal"]), findRight],
      },
      {
        id: "6.4",
        title: "Prove it",
        learn: [],
        optional: true,
        review: 0,
        guided: [oneStep("step-ptt", ["perp-transversal-theorem"], ["m3-proof-perp-transversal"])],
        core: [buildProof("prove-ptt", ["perp-transversal-theorem"], ["m3-proof-perp-transversal"])],
      },
    ],
  },
  {
    id: "u7",
    n: 7,
    title: "The perpendicular bisector",
    question: chapterOf("m3-distance").question,
    ready: true,
    checkpoint: true,
    lessons: [
      {
        id: "7.1",
        title: "Tools for distance",
        learn: ["pythagorean", "reflection"],
        guided: [pythagorean],
        core: [pythagorean, reflectionLength, authoredBisector("fold", ["reflection"], ["m3b-fold"])],
      },
      { id: "7.2", title: "Equally far", learn: ["equidistant"], guided: [isEquidistant], core: [isEquidistant, pythagorean] },
      {
        id: "7.3",
        title: "On it, so equidistant",
        learn: ["perp-bisector-theorem"],
        guided: [onBisector],
        core: [
          onBisector,
          bisectorLengths("lengths-theorem", { converse: false }),
          authoredFlow("flow-pbt", ["perp-bisector-theorem", "pythagorean"], ["m3-flow-perp-bisector"]),
          authoredBisector("theorem-type", ["perp-bisector-theorem"], ["m3b-theorem-type"]),
        ],
      },
      {
        id: "7.4",
        title: "Equidistant, so on it",
        learn: ["converse-perp-bisector"],
        guided: [bisectorEnoughFor("bisector-enough-guided", ["converse-perp-bisector"], [BISECTOR_CASES[0], BISECTOR_CASES[4]])],
        core: [
          bisectorEnoughFor("bisector-enough", ["converse-perp-bisector"]),
          bisectorLengths("lengths-converse", { converse: true }),
          authoredFlow("flow-pbt-converse", ["converse-perp-bisector", "pythagorean", "perpendicular-postulate"], ["m3-flow-perp-bisector-converse"]),
          authoredBisector("bisector-models", ["converse-perp-bisector"], ["m3b-water", "m3b-circle"]),
        ],
      },
      {
        id: "7.5",
        title: "Two constructions",
        learn: ["construct-perp-bisector", "construct-perp-through-point"],
        guided: [nextStep("next-bisector", ["construct-perp-bisector"], "bisector"), nextStep("next-through", ["construct-perp-through-point"], "through")],
        core: [
          orderSteps("order-bisector", ["construct-perp-bisector"], "bisector"),
          orderSteps("order-through", ["construct-perp-through-point"], "through"),
          authoredBisector("construct-why", ["construct-perp-bisector", "construct-perp-through-point"], ["m3b-construct-why", "m3b-radius", "m3b-through-point"]),
        ],
      },
      {
        id: "7.6",
        title: "Length equations",
        learn: ["length-equations"],
        guided: [bisectorLengths("lengths-guided")],
        core: [bisectorLengths("lengths"), onBisector],
      },
    ],
  },
];

export const allLessons = () => UNITS.flatMap((u) => u.lessons.map((l) => ({ unit: u, lesson: l })));
export const unitOf = (lessonId: string) => UNITS.find((u) => u.lessons.some((l) => l.id === lessonId))!;
