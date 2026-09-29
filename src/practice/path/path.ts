// The Module 3 path: units, lessons and what each lesson asks.
//
// docs/PATH-PLAN.md sets out the design. One new idea per lesson, taught
// just before it is practised; guided questions (few options, the angles
// highlighted) before core ones (all options, varied figures); a few review
// questions from earlier lessons; misses come back before the lesson ends.
// Units whose lessons have no recipe yet are shown on the path but locked.
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

export type Lesson = {
  id: string;
  title: string;
  /** The concepts this lesson introduces, shown as walkthroughs first. */
  learn: string[];
  /** Few options and highlighted angles: the first questions of a lesson. */
  guided?: Maker[];
  /** Full-difficulty questions: the body of the lesson, and its review pool. */
  core?: Maker[];
};

export type Unit = {
  id: string;
  n: number;
  title: string;
  question: string;
  lessons: Lesson[];
  /** Units 1–2 are playable; the rest are laid out, and locked. */
  ready: boolean;
  /** Unit 3 is one lesson, and has no checkpoint of its own. */
  checkpoint: boolean;
};

const ALL_PAIRS = ["corresponding", "altInterior", "consInterior", "altExterior", "consExterior"] as const;

/** A full naming or partner question from the Angle pairs generator. */
const anyPair = (mode: "name" | "find"): Maker => ({
  id: "any-pair-" + mode,
  concepts: ["corresponding-angles", "alternate-interior", "consecutive-interior", "alternate-exterior", "consecutive-exterior"],
  make: (r) => fromPairItem(pairItems(Math.floor(r() * 1e9), 3)[mode === "name" ? 0 : 1]),
});

/** A definition question drawn from one unit's concepts only. */
const definitions = (id: string, ids: string[]): Maker => ({
  id,
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
    ready: false,
    checkpoint: false,
    lessons: [{ id: "3.1", title: "One assumption", learn: ["corresponding-angles-postulate"] }],
  },
  {
    id: "u4",
    n: 4,
    title: "Derive the angle theorems",
    question: chapterOf("m3-derive").question,
    ready: false,
    checkpoint: true,
    lessons: [
      { id: "4.1", title: "Across and down", learn: ["alt-interior-theorem"] },
      { id: "4.2", title: "Boxes and arrows", learn: ["flow-proof"] },
      { id: "4.3", title: "Outside, the same way", learn: ["alt-exterior-theorem"] },
      { id: "4.4", title: "A linear pair instead", learn: ["cons-interior-theorem"] },
      { id: "4.5", title: "And outside", learn: ["cons-exterior-theorem"] },
      { id: "4.6", title: "Two values", learn: ["two-value-rule"] },
      { id: "4.7", title: "Find x", learn: ["angle-equations"] },
      { id: "4.8", title: "Prove it", learn: [] },
    ],
  },
  {
    id: "u5",
    n: 5,
    title: "Reverse it",
    question: chapterOf("m3-reverse").question,
    ready: false,
    checkpoint: true,
    lessons: [
      { id: "5.1", title: "Turn it round", learn: ["converse"] },
      { id: "5.2", title: "The second assumption", learn: ["converse-cap"] },
      { id: "5.3", title: "Alternate tests", learn: ["converse-ait", "converse-aet"] },
      { id: "5.4", title: "Consecutive tests", learn: ["converse-cit", "converse-cet"] },
      { id: "5.5", title: "Forwards or backwards?", learn: [] },
      { id: "5.6", title: "Make them parallel", learn: ["parallel-equations"] },
      { id: "5.7", title: "Parallel to the same line", learn: ["transitive-parallel", "perp-to-same-line"] },
    ],
  },
  {
    id: "u6",
    n: 6,
    title: "Exactly one line",
    question: chapterOf("m3-one").question,
    ready: false,
    checkpoint: true,
    lessons: [
      { id: "6.1", title: "Only one", learn: ["parallel-postulate"] },
      { id: "6.2", title: "Copy the angle", learn: ["construct-parallel"] },
      { id: "6.3", title: "Square to both", learn: ["perpendicular-postulate", "perp-transversal-theorem"] },
    ],
  },
  {
    id: "u7",
    n: 7,
    title: "The perpendicular bisector",
    question: chapterOf("m3-distance").question,
    ready: false,
    checkpoint: true,
    lessons: [
      { id: "7.1", title: "Tools for distance", learn: ["pythagorean", "reflection"] },
      { id: "7.2", title: "Equally far", learn: ["equidistant"] },
      { id: "7.3", title: "On it, so equidistant", learn: ["perp-bisector-theorem"] },
      { id: "7.4", title: "Equidistant, so on it", learn: ["converse-perp-bisector"] },
      { id: "7.5", title: "Two constructions", learn: ["construct-perp-bisector", "construct-perp-through-point"] },
      { id: "7.6", title: "Length equations", learn: ["length-equations"] },
    ],
  },
];

export const allLessons = () => UNITS.flatMap((u) => u.lessons.map((l) => ({ unit: u, lesson: l })));
export const unitOf = (lessonId: string) => UNITS.find((u) => u.lessons.some((l) => l.id === lessonId))!;
