// One question at a time, for the path's lessons.
//
// A lesson plays questions of several kinds in one run, so they share one
// shape here. Each comes from a Maker — a small generator tagged with the
// concepts it exercises — so a missed question can be replaced by a fresh
// one of the same kind, and review can draw from earlier lessons by concept.
import type { Board } from "../../model";
import type { Highlight } from "../Figure";
import { vertex } from "../../model";
import { resolveAngle } from "../oracle";
import { ang, type PairKind } from "../terms";
import { placement } from "../transversal";
import type { Trap } from "../content/numeric";
import type { MixedItem } from "../content/tests3";
import {
  type PairItem,
  RELATION_LABEL,
  type Relation,
  consequence,
  consequenceText,
  explainConsequence,
  explainRelation,
  partnerOf,
  relationOf,
  variant,
} from "../content/pairs3";
import { nearlyParallel, oneCrossing, parallelMN, parallelUnmarked, transversal, transversalJK } from "../content/library3";
import { LIBRARY } from "../content/library";
import type { ConceptQuestion } from "../content/conceptQuiz";

export type Question =
  | {
      kind: "choice";
      prompt: string;
      context?: string[];
      figure?: Board;
      highlights?: Highlight[];
      choices: string[];
      correct: number;
      why: string;
      whyPerChoice?: Record<number, string>;
    }
  | {
      kind: "number";
      prompt: string;
      figure?: Board;
      given?: string[];
      highlights?: Highlight[];
      answer: number;
      unit?: string;
      trap?: Trap | Trap[];
      hints?: string[];
      why: string;
    }
  | {
      /** Tap one angle, or every angle that fits, on the figure. */
      kind: "tapAngle";
      prompt: string;
      figure: Board;
      highlights?: Highlight[];
      answer: string[];
      multi: boolean;
      why: string;
      /** Said about a wrong single pick, when there is something to say. */
      explain?: (picked: string) => string;
    }
  | {
      /** Tap a named line on the figure. */
      kind: "tapLine";
      prompt: string;
      figure: Board;
      highlights?: Highlight[];
      answer: string;
      why: string;
    };

export type Maker = {
  id: string;
  /** The concepts a question from this maker exercises. */
  concepts: string[];
  make: (r: () => number) => Question;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];
export const shuffle = <T,>(r: () => number, xs: T[]) => {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const hl = (...ns: string[]): Highlight[] => ns.map((n) => ({ obj: ang(n), role: "given" }));
const numerals = (b: Board) => b.angles.map((x) => x.label!).filter(Boolean);

/** Two options or more, answer included, dealt in a random order. */
function choice(r: () => number, answer: string, others: string[], q: Omit<Extract<Question, { kind: "choice" }>, "kind" | "choices" | "correct">): Question {
  const choices = shuffle(r, [answer, ...others]);
  return { kind: "choice", ...q, choices, correct: choices.indexOf(answer) };
}

/** Which crossing an angle is at: its vertex, rounded to a key. */
function crossingOf(b: Board, n: string) {
  const v = vertex(b, resolveAngle(b, ang(n))!.vertex)!;
  return Math.round(v.x) + "," + Math.round(v.y);
}

/** Does this angle open between the two lines? */
export function isInteriorAngle(b: Board, n: string): boolean {
  const other = numerals(b).find((y) => crossingOf(b, y) !== crossingOf(b, n))!;
  return placement(b, ang(n), ang(other))!.interior[0];
}

/** Are two angles — at the same crossing or not — on the same side of t? */
export function sameSideOfT(b: Board, x: string, y: string): boolean {
  if (crossingOf(b, x) !== crossingOf(b, y)) return placement(b, ang(x), ang(y))!.sameSide;
  const z = numerals(b).find((w) => crossingOf(b, w) !== crossingOf(b, x))!;
  return placement(b, ang(x), ang(z))!.sameSide === placement(b, ang(y), ang(z))!.sameSide;
}

const lineNames = (b: Board) => b.edges.map((e) => e.label).filter(Boolean) as string[];

// ---------------------------------------------------------------------------
// Unit 1 · Foundations
// ---------------------------------------------------------------------------

const PHIS = [58, 64, 70, 110, 116, 122];

/** "∠1 = 64°. What is m∠3?" with the answer among four numbers. */
export const crossingGuided: Maker = {
  id: "crossing-guided",
  concepts: ["angles-at-a-crossing"],
  make(r) {
    const phi = pick(r, PHIS);
    const g = pick(r, ["1", "2", "3", "4"]);
    const y = pick(r, ["1", "2", "3", "4"].filter((n) => n !== g));
    const mOf = (n: string) => (["2", "4"].includes(n) ? phi : 180 - phi);
    const board = oneCrossing({ cross: phi, measures: { [g]: mOf(g) } });
    const ans = mOf(y);
    const vertical = relationOf(board, g, y) === "vertical";
    return choice(r, ans + "°", [...new Set([180 - ans + "°", Math.abs(90 - ans) + "°", "180°"])].filter((c) => c !== ans + "°").slice(0, 3), {
      prompt: "m∠" + g + " = " + mOf(g) + "°. What is m∠" + y + "?",
      figure: board,
      highlights: hl(g, y),
      why: vertical
        ? "∠" + g + " and ∠" + y + " sit opposite each other: vertical angles, so they are equal."
        : "∠" + g + " and ∠" + y + " sit side by side on one line: a linear pair, so they total 180°. 180 − " + mOf(g) + " = " + ans + ".",
    });
  },
};

/** The same, answered on the keypad. */
export const crossingCore: Maker = {
  id: "crossing-core",
  concepts: ["angles-at-a-crossing"],
  make(r) {
    const phi = pick(r, PHIS);
    const g = pick(r, ["1", "2", "3", "4"]);
    const y = pick(r, ["1", "2", "3", "4"].filter((n) => n !== g));
    const mOf = (n: string) => (["2", "4"].includes(n) ? phi : 180 - phi);
    const board = oneCrossing({ cross: phi, measures: { [g]: mOf(g) } });
    const ans = mOf(y);
    const vertical = relationOf(board, g, y) === "vertical";
    return {
      kind: "number",
      prompt: "Find m∠" + y + ".",
      figure: board,
      answer: ans,
      unit: "°",
      trap: { value: 180 - ans, note: 180 - ans + "° would make ∠" + y + (vertical ? " the neighbour of ∠" + g + ", but they are opposite each other." : " equal to ∠" + g + ", but they sit side by side.") },
      why: vertical
        ? "Vertical angles are equal: m∠" + y + " = " + ans + "°."
        : "A linear pair totals 180°: m∠" + y + " = 180 − " + mOf(g) + " = " + ans + "°.",
    };
  },
};

/** Congruent or supplementary, at one crossing: two options, no parallel lines needed. */
export const crossingRelate: Maker = {
  id: "crossing-relate",
  concepts: ["angles-at-a-crossing"],
  make(r) {
    const board = oneCrossing({ cross: pick(r, PHIS) });
    const [x, y] = pick(r, [["1", "3"], ["2", "4"], ["1", "2"], ["2", "3"], ["3", "4"], ["1", "4"]]);
    const c = consequence(board, x, y);
    return choice(r, consequenceText(c, x, y), [consequenceText(c === "congruent" ? "supplementary" : "congruent", x, y)], {
      prompt: "What must be true of ∠" + x + " and ∠" + y + "?",
      figure: board,
      highlights: hl(x, y),
      why: explainConsequence(board, x, y),
    });
  },
};

/** Does the figure say the lines are parallel? Only the arrowheads count. */
export const markedParallel: Maker = {
  id: "marked-parallel",
  concepts: ["parallel-lines"],
  make(r) {
    const k = pick(r, ["marked", "unmarked", "nearly", "apart"] as const);
    const board = k === "marked" ? parallelMN() : k === "unmarked" ? parallelUnmarked() : k === "nearly" ? nearlyParallel() : transversalJK();
    const [p, q] = lineNames(board);
    const YES = "Yes — the arrowheads mark " + p + " ∥ " + q;
    const NO = "No — nothing marks " + p + " and " + q + " parallel";
    return choice(r, k === "marked" ? YES : NO, [k === "marked" ? NO : YES], {
      prompt: "Does the figure say that " + p + " ∥ " + q + "?",
      figure: board,
      why:
        k === "marked"
          ? "Matching arrowheads on both lines are the mark for parallel."
          : k === "unmarked"
            ? "These are drawn parallel, but a drawing is not a mark. With no arrowheads, nothing may be concluded from how they look."
            : k === "nearly"
              ? "They look parallel and are not — 4° apart. That is exactly why only the mark counts."
              : "No arrowheads, and plainly not parallel either.",
    });
  },
};

/** One square at a crossing makes every angle there right. */
export const rightAngles: Maker = {
  id: "right-angles",
  concepts: ["perpendicular-lines"],
  make(r) {
    const k = pick(r, ["1", "2", "3", "4"]);
    const board = oneCrossing({ cross: 90, measures: { [k]: 90 } });
    return {
      kind: "tapAngle",
      prompt: "The square marks ∠" + k + " as a right angle. Tap every angle that must be right.",
      figure: board,
      answer: ["1", "2", "3", "4"],
      multi: true,
      why: "All four. The vertical partner of a right angle is right, and its two neighbours are 180° − 90° = 90°.",
    };
  },
};

// ---------------------------------------------------------------------------
// Unit 2 · Read the figure
// ---------------------------------------------------------------------------

export const tapTransversal: Maker = {
  id: "tap-transversal",
  concepts: ["transversal"],
  make(r) {
    const v = variant(r, { renumber: false });
    const [, , t] = lineNames(v.board);
    return {
      kind: "tapLine",
      prompt: "Tap the transversal.",
      figure: v.board,
      answer: t,
      why: "Line " + t + " crosses both of the other lines, at two different points. That is what makes it the transversal.",
    };
  },
};

export const countAngles: Maker = {
  id: "count-angles",
  concepts: ["transversal"],
  make(r) {
    return choice(r, "8 — four at each crossing", ["4 — one at each corner", "6", "12"], {
      prompt: "How many angles do two lines and a transversal make between them?",
      figure: transversalJK(),
      why: "Two crossings, four angles at each: eight, numbered 1–4 at the top crossing and 5–8 at the bottom, clockwise from the upper left.",
    });
  },
};

export const tapInterior: Maker = {
  id: "tap-interior",
  concepts: ["interior-exterior"],
  make(r) {
    const v = variant(r);
    const inside = r() < 0.5;
    const ns = numerals(v.board);
    const answer = ns.filter((n) => isInteriorAngle(v.board, n) === inside);
    const [p, q] = lineNames(v.board);
    return {
      kind: "tapAngle",
      prompt: "Tap every " + (inside ? "interior" : "exterior") + " angle.",
      figure: v.board,
      answer,
      multi: true,
      why:
        (inside ? "Interior angles open into the strip between " : "Exterior angles open outside ") + p + " and " + q +
        (inside ? "" : " — beyond one line or the other") + ": " + answer.map((n) => "∠" + n).join(", ") + ".",
    };
  },
};

export const tapSameSide: Maker = {
  id: "tap-same-side",
  concepts: ["alternate-consecutive"],
  make(r) {
    const v = variant(r);
    const ns = numerals(v.board);
    const k = pick(r, ns);
    const answer = ns.filter((n) => n !== k && sameSideOfT(v.board, n, k));
    const t = lineNames(v.board)[2];
    return {
      kind: "tapAngle",
      prompt: "Tap every angle on the same side of " + t + " as ∠" + k + ".",
      figure: v.board,
      highlights: hl(k),
      answer,
      multi: true,
      why: "Three others share ∠" + k + "'s side of " + t + ": " + answer.map((n) => "∠" + n).join(", ") + ". Angles on the same side are consecutive; on opposite sides, alternate.",
    };
  },
};

/** Name the pair, from a few options, among only the kinds taught so far. */
export function namePair(id: string, kinds: Relation[], options: Relation[], count: number, o: { standard?: boolean } = {}): Maker {
  return {
    id,
    concepts: kinds.map(conceptOfRelation).filter(Boolean) as string[],
    make(r) {
      const b = o.standard ? transversal({ cross: 64, tilt: [8, -4] }) : variant(r).board;
      const ns = numerals(b);
      const pairs: [string, string][] = [];
      for (const x of ns) for (const y of ns) if (x < y && kinds.includes(relationOf(b, x, y)!)) pairs.push([x, y]);
      const [x, y] = shuffle(r, pick(r, pairs));
      const answer = relationOf(b, x, y)!;
      const others = shuffle(r, options.filter((k) => k !== answer)).slice(0, count - 1);
      return choice(r, RELATION_LABEL[answer], others.map((k) => RELATION_LABEL[k]), {
        prompt: "What are ∠" + x + " and ∠" + y + " called?",
        figure: b,
        highlights: hl(x, y),
        why: explainRelation(b, x, y),
      });
    },
  };
}

/** Tap the partner of an angle, for the kinds taught so far. */
export function findPartner(id: string, kinds: PairKind[], o: { standard?: boolean } = {}): Maker {
  return {
    id,
    concepts: kinds.map(conceptOfRelation).filter(Boolean) as string[],
    make(r) {
      const b = o.standard ? transversal({ cross: 64, tilt: [8, -4] }) : variant(r).board;
      const ns = numerals(b);
      const options: [string, PairKind][] = [];
      for (const x of ns) for (const k of kinds) if (partnerOf(b, x, k)) options.push([x, k]);
      const [from, want] = pick(r, options);
      const answer = partnerOf(b, from, want)!;
      return {
        kind: "tapAngle",
        prompt: "Tap the angle that forms " + RELATION_LABEL[want].toLowerCase() + " with ∠" + from + ".",
        figure: b,
        highlights: hl(from),
        answer: [answer],
        multi: false,
        why: explainRelation(b, from, answer),
        explain: (picked) => explainRelation(b, from, picked) + " The partner is ∠" + answer + ".",
      };
    },
  };
}

const RELATION_CONCEPT: Partial<Record<Relation, string>> = {
  corresponding: "corresponding-angles",
  altInterior: "alternate-interior",
  consInterior: "consecutive-interior",
  altExterior: "alternate-exterior",
  consExterior: "consecutive-exterior",
  vertical: "angles-at-a-crossing",
  linearPair: "angles-at-a-crossing",
};
const conceptOfRelation = (k: Relation) => RELATION_CONCEPT[k];

// ---------------------------------------------------------------------------
// Adapters from the existing exercise generators
// ---------------------------------------------------------------------------

export function fromPairItem(it: PairItem): Question {
  if (it.mode === "name")
    return {
      kind: "choice",
      prompt: it.prompt,
      figure: it.figure,
      highlights: it.highlights,
      choices: it.choices.map((c) => RELATION_LABEL[c]),
      correct: it.choices.indexOf(it.answer),
      why: it.why,
    };
  if (it.mode === "find")
    return {
      kind: "tapAngle",
      // The path is tapped as often as clicked, and says so everywhere else.
      prompt: it.prompt.replace(/^Click /, "Tap "),
      figure: it.figure,
      highlights: it.highlights,
      answer: [it.answer],
      multi: false,
      why: it.why,
      explain: (picked) => explainRelation(it.figure, it.from, picked) + " The partner is ∠" + it.answer + ".",
    };
  return {
    kind: "choice",
    prompt: it.prompt,
    figure: it.figure,
    highlights: it.highlights,
    choices: it.choices.map((c) => consequenceText(c, ...it.pair)),
    correct: it.choices.indexOf(it.answer),
    why: it.why,
  };
}

export const fromMixed = (it: MixedItem): Question => ({ ...it } as Question);

export function fromConceptQuestion(q: ConceptQuestion): Question {
  return {
    kind: "choice",
    prompt: q.prompt,
    figure: q.figure ? LIBRARY[q.figure]() : undefined,
    choices: q.choices.map((c) => c.text),
    correct: q.correct,
    why: q.why,
  };
}

