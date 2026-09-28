// Module 3's core skill: look at two angles and say what they are, and then
// what follows. Items are generated over varied figures — tilted, turned,
// sometimes renumbered — so that "∠3 and ∠5 are alternate interior" cannot be
// answered from memory of the reference's numbering instead of from the
// figure in front of the student.
import type { Board } from "../../model";
import type { Highlight } from "../Figure";
import { isLinearPair, isVertical, marked } from "../oracle";
import { PAIR_NAME } from "../notation";
import {
  type AngId,
  type PairKind,
  type Statement,
  add,
  ang,
  isFlip,
  meas,
  num,
  sameStatement,
} from "../terms";
import { markedParallel, placement, positionWords } from "../transversal";
import { transversal } from "./library3";
import { rng } from "./generators";

export type Relation = PairKind | "vertical" | "linearPair" | "none";

export const RELATION_LABEL: Record<Relation, string> = {
  corresponding: "Corresponding angles",
  altInterior: "Alternate interior angles",
  consInterior: "Consecutive interior angles",
  altExterior: "Alternate exterior angles",
  consExterior: "Consecutive exterior angles",
  vertical: "Vertical angles",
  linearPair: "A linear pair",
  none: "None of these names",
};

const a = (n: string) => ang(n);

/** What two numbered angles are to each other, if anything. */
export function relationOf(b: Board, x: string, y: string): Relation | undefined {
  if (isVertical(b, a(x), a(y))) return "vertical";
  if (isLinearPair(b, a(x), a(y))) return "linearPair";
  return placement(b, a(x), a(y))?.kind;
}

export type Consequence = "congruent" | "supplementary" | "unknown";

/**
 * What must be true of two angles, given only what the figure marks. A
 * vertical pair and a linear pair need nothing else; every other pair needs
 * the two lines marked parallel, and then each pair is exactly one of the
 * two — which is the reference's opening sentence about these figures.
 */
export function consequence(b: Board, x: string, y: string): Consequence {
  const r = relationOf(b, x, y);
  if (r === "vertical") return "congruent";
  if (r === "linearPair") return "supplementary";
  const p = placement(b, a(x), a(y));
  if (!p || !markedParallel(b, p.lines[0], p.lines[1])) return "unknown";
  return p.kind === "corresponding" || p.kind === "altInterior" || p.kind === "altExterior"
    ? "congruent"
    : "supplementary";
}

/** The two angles a statement relates, and which relation it claims. */
function claimOf(s: Statement): { x: AngId; y: AngId; says: "congruent" | "supplementary" } | undefined {
  if (s.k === "cong" && s.l.k === "ang" && s.r.k === "ang") return { x: s.l, y: s.r, says: "congruent" };
  if (s.k === "supp") return { x: s.a, y: s.b, says: "supplementary" };
  if (s.k !== "eq") return;
  const angs: AngId[] = [];
  const walk = (t: typeof s.l) => {
    if (t.k === "meas") angs.push(t.ang);
    else if (t.k === "add" || t.k === "mul") t.ts.forEach(walk);
  };
  walk(s.l), walk(s.r);
  if (angs.length !== 2) return;
  const [x, y] = angs;
  const eq: Statement = { k: "eq", l: meas(x.name), r: meas(y.name) };
  const sum: Statement = { k: "eq", l: add(meas(x.name), meas(y.name)), r: num(180) };
  if (sameStatement(s, eq) || isFlip(s, eq)) return { x, y, says: "congruent" };
  if (sameStatement(s, sum) || isFlip(s, sum)) return { x, y, says: "supplementary" };
  return;
}

/**
 * Must this statement be true, from the figure's marks and the module's
 * rules? Wider than `marked`, which knows nothing of the theorems: on a
 * figure marking m ∥ n, "∠1 ≅ ∠5" is not marked, but it must be true.
 */
export function follows(b: Board, s: Statement): boolean {
  if (marked(b, s)) return true;
  const c = claimOf(s);
  if (!c) return false;
  return consequence(b, c.x.name, c.y.name) === c.says;
}

// ---------------------------------------------------------------------------
// Figures
// ---------------------------------------------------------------------------

const NAME_SETS: [string, string, string][] = [
  ["m", "n", "t"],
  ["j", "k", "t"],
  ["a", "b", "c"],
  ["p", "q", "r"],
];

const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];
const shuffle = <T,>(r: () => number, xs: T[]) => {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export type Variant = { board: Board; parallel: boolean; marked: boolean; renumbered: boolean };

/**
 * A random figure. `parallel` draws the lines parallel; `marked` also puts
 * the arrowheads on. Never a right-angle crossing: there every pair is both
 * congruent and supplementary, and the question "which?" has two answers.
 */
export function variant(
  r: () => number,
  o: { parallel?: boolean; marked?: boolean; renumber?: boolean } = {},
): Variant {
  const names = pick(r, NAME_SETS);
  const parallel = o.parallel ?? r() < 0.5;
  const marked = parallel && (o.marked ?? true);
  const base = Math.round((r() * 2 - 1) * 12);
  const tilt: [number, number] = parallel ? [base, base] : [base + 7, base - 7];
  const cross = pick(r, [58, 64, 70, 110, 116, 122]);
  const turn = pick(r, [0, 0, 0, 10, -14, 22, 90]);
  const renumbered = o.renumber ?? r() < 0.4;
  const numbers = renumbered
    ? shuffle(r, ["1", "2", "3", "4", "5", "6", "7", "8"])
    : undefined;
  const board = transversal({ names, tilt, cross, turn, marked, numbers });
  return { board, parallel, marked, renumbered };
}

const numerals = (b: Board) =>
  b.angles.map((x) => x.label!).filter(Boolean).sort();

const lineName = (b: Board, i: 0 | 1 | 2) => {
  const labels = b.edges.map((e) => e.label).filter(Boolean) as string[];
  return labels[i];
};

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export type PairItem =
  | {
      id: string;
      mode: "name";
      figure: Board;
      prompt: string;
      pair: [string, string];
      choices: Relation[];
      answer: Relation;
      why: string;
      highlights: Highlight[];
    }
  | {
      id: string;
      mode: "find";
      figure: Board;
      prompt: string;
      from: string;
      want: PairKind;
      answer: string;
      why: string;
      highlights: Highlight[];
    }
  | {
      id: string;
      mode: "relate";
      figure: Board;
      prompt: string;
      pair: [string, string];
      choices: Consequence[];
      answer: Consequence;
      why: string;
      highlights: Highlight[];
    };

/** The near misses for each answer: flip the side, flip inside for outside. */
const NEAR: Record<Relation, Relation[]> = {
  corresponding: ["consInterior", "consExterior", "altInterior", "altExterior"],
  altInterior: ["consInterior", "altExterior", "corresponding"],
  consInterior: ["altInterior", "consExterior", "corresponding"],
  altExterior: ["consExterior", "altInterior", "corresponding"],
  consExterior: ["altExterior", "consInterior", "corresponding"],
  vertical: ["linearPair", "corresponding", "altInterior"],
  linearPair: ["vertical", "consInterior", "altInterior"],
  none: ["corresponding", "altInterior", "consExterior", "altExterior", "consInterior"],
};

/** Why two angles have the name they have, or have none. */
export function explainRelation(b: Board, x: string, y: string): string {
  const rel = relationOf(b, x, y);
  const both = "∠" + x + " and ∠" + y;
  if (rel === "vertical")
    return both + " are at the same crossing, opposite each other: vertical angles.";
  if (rel === "linearPair")
    return both + " are side by side at one crossing, sharing a side, with their outer sides on one line: a linear pair.";
  const p = placement(b, a(x), a(y));
  if (!p) return both + " are not at two crossings of one line.";
  const words = positionWords(b, p);
  if (p.kind === "none")
    return both + " are " + words + " — not one of the named pairs.";
  return both + " are " + words + ": " + PAIR_NAME[p.kind] + ".";
}

/** The partner of an angle in a named pair, at the other crossing. */
export function partnerOf(b: Board, x: string, want: PairKind): string | undefined {
  return numerals(b).find((y) => y !== x && placement(b, a(x), a(y))?.kind === want);
}

function nameItem(r: () => number, id: string): PairItem {
  const v = variant(r);
  const b = v.board;
  const ns = numerals(b);
  // Mostly the five named pairs; sometimes a pair with no name, sometimes
  // two angles at one crossing, so "none of these" and the Module 2 names
  // stay live answers.
  const roll = r();
  const want: (rel: Relation | undefined) => boolean =
    roll < 0.7
      ? (rel) => !!rel && rel !== "none" && rel !== "vertical" && rel !== "linearPair"
      : roll < 0.85
        ? (rel) => rel === "none"
        : (rel) => rel === "vertical" || rel === "linearPair";
  const pairs: [string, string][] = [];
  for (const x of ns) for (const y of ns) if (x < y && want(relationOf(b, x, y))) pairs.push([x, y]);
  const [x, y] = pick(r, pairs);
  const [p, q] = r() < 0.5 ? [x, y] : [y, x];
  const answer = relationOf(b, p, q)!;
  const near = shuffle(r, NEAR[answer]).slice(0, 3);
  // "None of these names" is sometimes a wrong answer too, or its presence
  // alone would announce that it is right.
  if (answer !== "none" && r() < 0.3) near[2] = "none";
  const choices = shuffle(r, [answer, ...near]);
  return {
    id,
    mode: "name",
    figure: b,
    prompt: "What are ∠" + p + " and ∠" + q + " called?",
    pair: [p, q],
    choices,
    answer,
    why: explainRelation(b, p, q),
    highlights: [
      { obj: a(p), role: "given" },
      { obj: a(q), role: "given" },
    ],
  };
}

function findItem(r: () => number, id: string): PairItem {
  const v = variant(r);
  const b = v.board;
  const from = pick(r, numerals(b));
  // An exterior angle has no interior partner and the other way round, so
  // only the names this angle actually takes part in are asked.
  const kinds = (["corresponding", "altInterior", "consInterior", "altExterior", "consExterior"] as PairKind[])
    .filter((k) => partnerOf(b, from, k));
  const want = pick(r, kinds);
  const answer = partnerOf(b, from, want)!;
  return {
    id,
    mode: "find",
    figure: b,
    prompt: "Click the angle that forms " + PAIR_NAME[want] + " with ∠" + from + ".",
    from,
    want,
    answer,
    why: explainRelation(b, from, answer),
    highlights: [{ obj: a(from), role: "given" }],
  };
}

const CONSEQUENCE_TEXT = (x: string, y: string): Record<Consequence, string> => ({
  congruent: "∠" + x + " ≅ ∠" + y,
  supplementary: "m∠" + x + " + m∠" + y + " = 180",
  unknown: "Neither can be concluded",
});

export const consequenceText = (c: Consequence, x: string, y: string) =>
  CONSEQUENCE_TEXT(x, y)[c];

/** Why the pair must be congruent or supplementary — or why nothing follows. */
export function explainConsequence(b: Board, x: string, y: string): string {
  const rel = relationOf(b, x, y);
  const out = consequence(b, x, y);
  const both = "∠" + x + " and ∠" + y;
  const [l1, l2] = [lineName(b, 0), lineName(b, 1)];
  if (rel === "vertical")
    return both + " are vertical angles, and vertical angles are congruent whether or not any lines are parallel.";
  if (rel === "linearPair")
    return both + " form a linear pair, so they are supplementary — no parallel lines needed.";
  const named = rel && rel !== "none" ? PAIR_NAME[rel] : undefined;
  if (out === "unknown")
    return (
      both + " are " + (named ?? "at two different crossings") + ", but nothing says " + l1 + " ∥ " + l2 +
      ". The lines carry no arrowheads, however they look — so nothing follows about the two measures."
    );
  if (rel === "none") {
    // Go through the angle at y's crossing that corresponds to x.
    const via = partnerOf(b, x, "corresponding");
    return (
      both + " are not a named pair. Go through ∠" + via + ": ∠" + x + " ≅ ∠" + via +
      " as corresponding angles, and ∠" + via + " and ∠" + y + " form a linear pair — so m∠" + x +
      " + m∠" + y + " = 180."
    );
  }
  return (
    both + " are " + named + " and " + l1 + " ∥ " + l2 + ", so they are " +
    (out === "congruent" ? "congruent." : "supplementary.")
  );
}

function relateItem(r: () => number, id: string): PairItem {
  // Mostly marked parallels; sometimes lines drawn parallel with no mark,
  // sometimes lines that are not parallel at all.
  const roll = r();
  const v =
    roll < 0.65
      ? variant(r, { parallel: true, marked: true })
      : roll < 0.85
        ? variant(r, { parallel: true, marked: false })
        : variant(r, { parallel: false });
  const b = v.board;
  const ns = numerals(b);
  const pairs: [string, string][] = [];
  for (const x of ns) for (const y of ns) if (x < y) pairs.push([x, y]);
  // Lean on pairs across the transversal, where the parallel mark decides
  // everything. Two angles at one crossing are Module 2's vertical angles and
  // linear pairs; they stay in, at a quarter of their natural share, because
  // on an unmarked figure they are the only pairs that still say something.
  const tempting = pairs.filter(([x, y]) => {
    const rel = relationOf(b, x, y);
    return (rel !== "vertical" && rel !== "linearPair") || r() < 0.25;
  });
  const [x, y] = pick(r, tempting);
  const answer = consequence(b, x, y);
  return {
    id,
    mode: "relate",
    figure: b,
    prompt: "What must be true of ∠" + x + " and ∠" + y + "?",
    pair: [x, y],
    choices: ["congruent", "supplementary", "unknown"],
    answer,
    why: explainConsequence(b, x, y),
    highlights: [
      { obj: a(x), role: "given" },
      { obj: a(y), role: "given" },
    ],
  };
}

/** A mixed set, in an order that alternates the three kinds of question. */
export function pairItems(seed: number, count = 12): PairItem[] {
  const r = rng(seed);
  const make = [nameItem, findItem, relateItem];
  const out: PairItem[] = [];
  for (let i = 0; i < count; i++) out.push(make[i % 3](r, seed + ":" + i));
  return out;
}
