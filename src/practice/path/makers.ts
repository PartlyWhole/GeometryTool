// Makers for Units 3–7: the angle theorems, their converses, the lines there
// is exactly one of, and the perpendicular bisector.
//
// Each maker asks only about what its lesson and the ones before it have
// taught. The pair kinds a maker may use are passed in, so the same maker
// grows across a unit: 4.1 asks about corresponding and alternate interior
// pairs, 4.5 about all five.
import type { Board } from "../../model";
import type { Highlight } from "../Figure";
import { PAIR_NAME, statementText } from "../notation";
import { reasonById } from "../reasons";
import type { ProofProblem, SolutionStep } from "../proof";
import { type PairKind, type Statement, add, ang, line, meas, num } from "../terms";
import { fig } from "../content/figures";
import {
  constructParallel,
  constructPerpBisector,
  constructPerpThroughPoint,
  equidistantPoint,
  parallelPostulate,
  reflection,
  transversal,
} from "../content/library3";
import { consequence, consequenceText, explainConsequence, partnerOf, relationOf } from "../content/pairs3";
import { AUTHORED_TESTS, CONVERSE, FORWARD, type MixedItem, enough, findX, reorder, whichTest } from "../content/tests3";
import { AUTHORED_BISECTOR, BISECTOR_CASES, enough as bisectorEnough, lengths } from "../content/bisector3";
import { FLOWS3, NUMERIC_ITEMS3, PROOFS3, type FlowItem } from "../content/items3";
import type { NumericItem } from "../content/numeric";
import { stepItems } from "../content/stepReason";
import { type Maker, type Question, pick, shuffle } from "./questions";

const hl = (...ns: string[]): Highlight[] => ns.map((n) => ({ obj: ang(n), role: "given" }));
const seed = (r: () => number) => Math.floor(r() * 1e9);

/** Two options or more, answer included, dealt in a random order. */
function choice(r: () => number, answer: string, others: string[], q: Omit<Extract<Question, { kind: "choice" }>, "kind" | "choices" | "correct">): Question {
  const choices = shuffle(r, [answer, ...others]);
  return { kind: "choice", ...q, choices, correct: choices.indexOf(answer) };
}

/** The concept that makes a pair congruent or supplementary on parallel lines. */
export const THEOREM: Record<PairKind, string> = {
  corresponding: "corresponding-angles-postulate",
  altInterior: "alt-interior-theorem",
  altExterior: "alt-exterior-theorem",
  consInterior: "cons-interior-theorem",
  consExterior: "cons-exterior-theorem",
};

/** The concept that proves lines parallel from a pair. */
export const CONVERSE_CONCEPT: Record<PairKind, string> = {
  corresponding: "converse-cap",
  altInterior: "converse-ait",
  altExterior: "converse-aet",
  consInterior: "converse-cit",
  consExterior: "converse-cet",
};

/** The rule, by its reason id, that each pair's theorem is cited as. */
const RULE_ID: Record<PairKind, string> = {
  corresponding: "corresponding-angles-postulate",
  altInterior: "alt-interior-angles-theorem",
  altExterior: "alt-exterior-angles-theorem",
  consInterior: "cons-interior-angles-theorem",
  consExterior: "cons-exterior-angles-theorem",
};

const congruentKind = (k: PairKind) => k === "corresponding" || k === "altInterior" || k === "altExterior";

const NAME_SETS: [string, string, string][] = [
  ["m", "n", "t"],
  ["j", "k", "t"],
  ["a", "b", "c"],
  ["p", "q", "r"],
];
const OPENINGS = [52, 58, 64, 70, 76, 104, 110, 116, 122, 128];

/**
 * Marked parallels, level and turned as a whole, so that a printed measure
 * can be made true: at each crossing the upper-right and lower-left angles
 * measure the opening φ and the other two 180° − φ, whatever numeral sits
 * there.
 */
function markedFigure(r: () => number, o: { standard?: boolean; renumber?: boolean; marked?: boolean } = {}) {
  const names = o.standard ? NAME_SETS[0] : pick(r, NAME_SETS);
  const phi = pick(r, OPENINGS);
  const turn = o.standard ? 0 : pick(r, [0, 0, 10, -14, 22]);
  const numbers = o.renumber && r() < 0.4 ? shuffle(r, ["1", "2", "3", "4", "5", "6", "7", "8"]) : ["1", "2", "3", "4", "5", "6", "7", "8"];
  const measureAt = (n: string) => (numbers.indexOf(n) % 2 === 1 ? phi : 180 - phi);
  const build = (measures?: Record<string, number>) =>
    transversal({ names, cross: phi, turn, numbers, marked: o.marked ?? true, measures, title: names[0] + " ∥ " + names[1] });
  return { names, phi, numbers, measureAt, build };
}

/** Every pair of the given kinds on a figure, in both orders. */
function pairsOf(b: Board, kinds: PairKind[]): [string, string][] {
  const ns = b.angles.map((a) => a.label!).filter(Boolean);
  const out: [string, string][] = [];
  for (const x of ns) for (const y of ns) if (x !== y && kinds.includes(relationOf(b, x, y) as PairKind)) out.push([x, y]);
  return out;
}

// ---------------------------------------------------------------------------
// Units 3–4 · the postulate and the theorems it gives
// ---------------------------------------------------------------------------

/**
 * "What must be true of ∠x and ∠y?" for pairs of the kinds taught so far.
 * Sometimes the lines are drawn parallel with no mark, and then nothing
 * follows — the postulate needs the parallel lines as its input.
 */
export function relate(id: string, kinds: PairKind[], o: { standard?: boolean; options?: 2 | 3; unmarked?: number } = {}): Maker {
  return {
    id,
    concepts: kinds.map((k) => THEOREM[k]),
    make(r) {
      const unmarked = r() < (o.unmarked ?? 0.2);
      const f = markedFigure(r, { standard: o.standard, renumber: !o.standard, marked: !unmarked });
      const b = f.build();
      const [x, y] = pick(r, pairsOf(b, kinds));
      const c = consequence(b, x, y);
      const all = ["congruent", "supplementary", "unknown"] as const;
      const others = all.filter((k) => k !== c).slice(0, (o.options ?? 3) - 1);
      // Two options means congruent or supplementary; on an unmarked figure
      // the answer is "neither", so it is always offered there.
      const offered = o.options === 2 && c !== "unknown" ? [c === "congruent" ? "supplementary" : "congruent"] : others;
      return choice(r, consequenceText(c, x, y), offered.map((k) => consequenceText(k as typeof c, x, y)), {
        prompt: "What must be true of ∠" + x + " and ∠" + y + "?",
        figure: b,
        highlights: hl(x, y),
        why: explainConsequence(b, x, y),
      });
    },
  };
}

/** "m ∥ n and m∠g = 116°. Find m∠y." across the transversal, for the kinds taught. */
export function findAngle(id: string, kinds: PairKind[] | "any", o: { standard?: boolean } = {}): Maker {
  return {
    id,
    concepts: kinds === "any" ? ["two-value-rule"] : kinds.map((k) => THEOREM[k]),
    make(r) {
      const f = markedFigure(r, { standard: o.standard, renumber: !o.standard });
      const plain = f.build();
      // "any" asks every pair across the transversal, the unnamed ones too.
      const ns = f.numbers;
      const pairs =
        kinds === "any"
          ? ns.flatMap((x) => ns.filter((y) => (ns.indexOf(x) < 4) !== (ns.indexOf(y) < 4)).map((y) => [x, y] as [string, string]))
          : pairsOf(plain, kinds);
      const [g, y] = pick(r, pairs);
      const mg = f.measureAt(g);
      const b = f.build({ [g]: mg });
      const c = consequence(b, g, y);
      const answer = c === "congruent" ? mg : 180 - mg;
      const [p, q] = f.names;
      return {
        kind: "number",
        prompt: p + " ∥ " + q + " and m∠" + g + " = " + mg + "°. Find m∠" + y + ".",
        figure: b,
        highlights: hl(y),
        answer,
        unit: "°",
        trap: {
          value: 180 - answer,
          note:
            c === "congruent"
              ? 180 - answer + "° is the supplement, but ∠" + g + " and ∠" + y + " are congruent here."
              : 180 - answer + "° would make them congruent, but ∠" + g + " and ∠" + y + " total 180°.",
        },
        why: explainConsequence(b, g, y) + " So m∠" + y + " = " + answer + "°.",
      };
    },
  };
}

/**
 * "m ∥ n, so ∠3 ≅ ∠5. Which rule says so?" — the book's On Your Own 8–11.
 * The wrong options are the other rules taught so far, and a crossing rule.
 */
export function whichRule(id: string, kinds: PairKind[]): Maker {
  return {
    id,
    concepts: kinds.map((k) => THEOREM[k]),
    make(r) {
      const f = markedFigure(r, { renumber: true });
      const b = f.build();
      const [x, y] = pick(r, pairsOf(b, kinds));
      const kind = relationOf(b, x, y) as PairKind;
      const [p, q] = f.names;
      const fact = congruentKind(kind) ? "∠" + x + " ≅ ∠" + y : "m∠" + x + " + m∠" + y + " = 180";
      const others = shuffle(r, kinds.filter((k) => k !== kind)).slice(0, 2).map((k) => FORWARD[k]);
      const crossing = congruentKind(kind) ? reasonById("vertical-angles-theorem")!.name : reasonById("linear-pair-theorem")!.name;
      const opts = [...new Set([...others, crossing])].slice(0, 3);
      const q2 = choice(r, FORWARD[kind], opts, {
        prompt: p + " ∥ " + q + ", so " + fact + ". Which postulate or theorem justifies that?",
        figure: b,
        highlights: hl(x, y),
        why: "∠" + x + " and ∠" + y + " are " + PAIR_NAME[kind] + " and " + p + " ∥ " + q + ": the " + FORWARD[kind] + ".",
      });
      if (q2.kind === "choice")
        q2.whyPerChoice = {
          [q2.choices.indexOf(crossing)]:
            "That rule is about two angles at one crossing. ∠" + x + " and ∠" + y + " are at different crossings, joined only by the parallel lines.",
        };
      return q2;
    },
  };
}

/** Tap every angle congruent to ∠k, or every one supplementary to it (4.6). */
export function tapFamily(id: string, want: "congruent" | "supplementary", o: { standard?: boolean } = {}): Maker {
  return {
    id,
    concepts: ["two-value-rule"],
    make(r) {
      const f = markedFigure(r, { standard: o.standard, renumber: !o.standard });
      const b = f.build();
      const k = pick(r, f.numbers);
      const answer = f.numbers.filter((n) => n !== k && consequence(b, k, n) === want);
      return {
        kind: "tapAngle",
        prompt: "Tap every angle " + want + " to ∠" + k + ".",
        figure: b,
        highlights: hl(k),
        answer,
        multi: true,
        why:
          "With " + f.names[0] + " ∥ " + f.names[1] + " the eight angles take two values. ∠" + k + "'s family is " +
          f.numbers.filter((n) => consequence(b, k, n) === "congruent" || n === k).map((n) => "∠" + n).join(", ") +
          "; the other four are its supplements. " + (want === "congruent" ? "So: " : "So the supplements: ") +
          answer.map((n) => "∠" + n).join(", ") + ".",
      };
    },
  };
}

const lin = (a: number, b: number) => (a === 1 ? "" : String(a)) + "x" + (b === 0 ? "" : b > 0 ? " + " + b : " − " + -b);

/**
 * "m ∥ n. m∠3 = (4x + 12)° and m∠5 = (6x − 20)°. Find x." — for the kinds
 * taught, on a figure drawn at the answer. Sometimes the question asks for
 * the angle instead, and x is the trap.
 */
export function angleAlgebra(id: string, kinds: PairKind[]): Maker {
  return {
    id,
    concepts: ["angle-equations", ...kinds.map((k) => THEOREM[k])],
    make(r) {
      const f = markedFigure(r, { renumber: false });
      const plain = f.build();
      const [x, y] = pick(r, pairsOf(plain, kinds));
      const kind = relationOf(plain, x, y) as PairKind;
      const mx = f.measureAt(x), my = f.measureAt(y);
      let a = 0, b = 0, c = 0, d = 0, x0 = 0;
      for (let t = 0; t < 300; t++) {
        a = 2 + Math.floor(r() * 6);
        c = 1 + Math.floor(r() * 6);
        if (a === c) continue;
        x0 = 5 + Math.floor(r() * 20);
        b = mx - a * x0;
        d = my - c * x0;
        if (Math.abs(b) <= 60 && Math.abs(d) <= 60) break;
      }
      const askAngle = r() < 0.35;
      const [p, q] = f.names;
      const setUp = congruentKind(kind) ? lin(a, b) + " = " + lin(c, d) : "(" + lin(a, b) + ") + (" + lin(c, d) + ") = 180";
      const wrong = congruentKind(kind) ? (180 - b - d) / (a + c) : (d - b) / (a - c);
      const traps = [
        ...(Number.isFinite(wrong) && wrong !== x0 && !askAngle
          ? [{ value: wrong, note: congruentKind(kind) ? "That adds them to 180. " + PAIR_NAME[kind] + " on parallel lines are congruent: set them equal." : "That sets them equal. " + PAIR_NAME[kind] + " on parallel lines total 180°." }]
          : []),
        askAngle
          ? { value: x0, note: x0 + " is x. Substitute it back: m∠" + x + " = " + mx + "°." }
          : { value: mx, note: mx + "° is m∠" + x + ". The question asks for x." },
      ];
      return {
        kind: "number",
        prompt: p + " ∥ " + q + ". " + (askAngle ? "Find m∠" + x + "." : "Find x."),
        figure: plain,
        highlights: hl(x, y),
        given: ["m∠" + x + " = (" + lin(a, b) + ")°", "m∠" + y + " = (" + lin(c, d) + ")°"],
        answer: askAngle ? mx : x0,
        unit: askAngle ? "°" : undefined,
        trap: traps,
        hints: ["Are ∠" + x + " and ∠" + y + " congruent, or supplementary?"],
        why:
          "∠" + x + " and ∠" + y + " are " + PAIR_NAME[kind] + ", so " + (congruentKind(kind) ? "they are congruent: " : "they are supplementary: ") +
          setUp + ", which gives x = " + x0 + (askAngle ? ", and m∠" + x + " = " + a + "(" + x0 + ")" + (b ? (b > 0 ? " + " : " − ") + Math.abs(b) : "") + " = " + mx + "°." : "."),
      };
    },
  };
}

/** One of the book's authored Solve items, by id. */
export function authoredNumber(id: string, concepts: string[], ids: string[]): Maker {
  return {
    id,
    concepts,
    make(r) {
      const want = pick(r, ids);
      const it = NUMERIC_ITEMS3.find((n) => n.id === want)!;
      return fromNumeric(it);
    },
  };
}

export const fromNumeric = (it: NumericItem): Question => ({
  kind: "number",
  prompt: it.prompt,
  figure: it.figure,
  given: it.given,
  answer: it.answer,
  unit: it.unit,
  trap: it.trap,
  hints: it.hints,
  why: it.why,
});

// ---------------------------------------------------------------------------
// Flow proofs, one-step proofs and whole proofs
// ---------------------------------------------------------------------------

const cong = (x: string, y: string): Statement => ({ k: "cong", l: ang(x), r: ang(y) });
const eqm = (x: string, y: string): Statement => ({ k: "eq", l: meas(x), r: meas(y) });
const sum180 = (x: string, y: string): Statement => ({ k: "eq", l: add(meas(x), meas(y)), r: num(180) });
const supp = (x: string, y: string): Statement => ({ k: "supp", a: ang(x), b: ang(y) });

/**
 * A flow proof of one of the four theorems for a pair on the reference's
 * figure, through the Corresponding Angles Postulate, with the matching
 * two-column proof for the tests to replay.
 */
export function derivation(kind: Exclude<PairKind, "corresponding">, x: string, y: string, reasons: string[]): { item: FlowItem; problem: ProofProblem } {
  const b = transversal({ marked: true, tilt: [8, 8], cross: 64, title: "m ∥ n cut by t" });
  const mn: Statement = { k: "parallel", a: line("A1", "B1", "m"), b: line("A2", "B2", "n") };
  const c = partnerOf(b, x, "corresponding")!;
  const S = (statement: Statement, reasonId: string, cites: number[] = []): SolutionStep => ({ statement, reasonId, cites });
  const congruent = congruentKind(kind);
  const boxes = congruent
    ? [
        { statement: mn, reasonId: "given" },
        { statement: cong(x, c), reasonId: "corresponding-angles-postulate" },
        { statement: cong(c, y), reasonId: "vertical-angles-theorem" },
        { statement: cong(x, y), reasonId: "transitive" },
      ]
    : [
        { statement: mn, reasonId: "given" },
        { statement: cong(x, c), reasonId: "corresponding-angles-postulate" },
        { statement: eqm(x, c), reasonId: "def-cong-ang" },
        { statement: sum180(c, y), reasonId: "linear-pair-theorem" },
        { statement: sum180(x, y), reasonId: "substitution" },
      ];
  const solution = congruent
    ? [
        S(mn, "given"),
        S(cong(x, c), "corresponding-angles-postulate", [1]),
        S({ k: "vertical", a: ang(c), b: ang(y) }, "def-vertical"),
        S(cong(c, y), "vertical-angles-theorem", [3]),
        S(cong(x, y), "transitive", [2, 4]),
      ]
    : [
        S(mn, "given"),
        S(cong(x, c), "corresponding-angles-postulate", [1]),
        S(eqm(x, c), "def-cong-ang", [2]),
        S({ k: "linearPair", a: ang(c), b: ang(y) }, "def-linear-pair"),
        S(sum180(c, y), "linear-pair-theorem", [4]),
        S(sum180(x, y), "substitution", [3, 5]),
      ];
  const goal = congruent ? cong(x, y) : sum180(x, y);
  const title = "Prove the " + FORWARD[kind];
  return {
    item: { id: "gen-flow-" + kind + "-" + x + y, title, figure: b, givens: [mn], goal, proves: RULE_ID[kind], boxes, reasons },
    problem: { id: "gen-flow-" + kind + "-" + x + y, title, prompt: title, figure: b, givens: [mn], goal, forbid: [RULE_ID[kind]], solution, module: 3 },
  };
}

/** Reasons a flow blank offers, before and after the consecutive theorems. */
export const FLOW_REASONS_EARLY = ["given", "corresponding-angles-postulate", "alt-interior-angles-theorem", "vertical-angles-theorem", "linear-pair-theorem", "transitive", "def-cong-ang"];
const FLOW_REASONS_LATER = [...FLOW_REASONS_EARLY, "alt-exterior-angles-theorem", "substitution"];

/** A generated flow proof, for one of the given kinds. */
export function flowFor(id: string, kinds: Exclude<PairKind, "corresponding">[], reasons = FLOW_REASONS_LATER): Maker {
  return {
    id,
    concepts: ["flow-proof", ...kinds.map((k) => THEOREM[k])],
    make(r) {
      const b = transversal({ marked: true, tilt: [8, 8], cross: 64 });
      const kind = pick(r, kinds);
      const [x, y] = pick(r, pairsOf(b, [kind]));
      const { item } = derivation(kind, x, y, reasons);
      return fromFlow(item);
    },
  };
}

/** One of the authored flows, by id, with its offered reasons trimmed to those taught. */
export function authoredFlow(id: string, concepts: string[], ids: string[], reasons?: string[]): Maker {
  return {
    id,
    concepts,
    make(r) {
      const want = pick(r, ids);
      const item = FLOWS3.find((f) => f.id === want)!;
      return fromFlow(reasons ? { ...item, reasons } : item);
    },
  };
}

export const fromFlow = (item: FlowItem): Question => ({
  kind: "flow",
  prompt: item.title,
  item,
  why:
    item.layout === "table"
      ? "Read down the table: each line follows from lines above it, for the reason beside it."
      : "Read the boxes in order with “therefore” between them, and that is the proof.",
});

/** "Which reason justifies this line?" — one step of the named proofs. */
export function oneStep(id: string, concepts: string[], proofIds: string[]): Maker {
  return {
    id,
    concepts,
    make(r) {
      const proofs = PROOFS3.filter((p) => proofIds.includes(p.id));
      const [it] = stepItems(seed(r), 1, proofs);
      const choices = it.options;
      return {
        kind: "choice",
        prompt: "Which reason justifies line " + (it.above.length + 1) + "?",
        figure: it.figure,
        choices,
        correct: choices.indexOf(it.answer),
        why: it.why,
        whyPerChoice: Object.fromEntries(choices.map((c, n) => [n, it.whyByOption[c]]).filter(([, w]) => w)),
        proof: {
          givens: it.givens.map(statementText),
          goal: statementText(it.goal),
          rows: it.above.map((row) => ({ n: row.n, text: statementText(row.statement), reason: reasonById(row.reasonId)?.name ?? row.reasonId, cited: it.cites.includes(row.n) })),
          asking: { n: it.above.length + 1, text: statementText(it.statement) },
          help: it.cites.length ? "This line rests on the highlighted line" + (it.cites.length > 1 ? "s." : ".") : "This line rests on the figure and the givens, not on an earlier line.",
        },
      };
    },
  };
}

/** Build the whole of one of the named proofs. */
export function buildProof(id: string, concepts: string[], proofIds: string[]): Maker {
  return {
    id,
    concepts,
    make(r) {
      const want = pick(r, proofIds);
      const problem = PROOFS3.find((p) => p.id === want)!;
      return {
        kind: "proof",
        prompt: problem.title,
        problem,
        why: "Every line checked against its reason. Other routes than the worked one are accepted.",
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Unit 5 · the converses
// ---------------------------------------------------------------------------

type Conditional = { p: string; q: string; notP: string; notQ: string; converseTrue: boolean; why: string };

/** Conditionals whose converses are, and are not, true — the book's SR 31 and Turn and Talk. */
const CONDITIONALS: Conditional[] = [
  { p: "two angles are vertical angles", q: "they are congruent", notP: "two angles are not vertical angles", notQ: "they are not congruent", converseTrue: false, why: "Two right angles in different corners of a figure are congruent and not vertical. One counterexample is enough." },
  { p: "two angles form a linear pair", q: "they are supplementary", notP: "two angles do not form a linear pair", notQ: "they are not supplementary", converseTrue: false, why: "A 100° angle in one place and an 80° angle somewhere else are supplementary, and share no side at all." },
  { p: "M is the midpoint of AB", q: "M is equidistant from A and B", notP: "M is not the midpoint of AB", notQ: "M is not equidistant from A and B", converseTrue: false, why: "Every point on the perpendicular bisector of AB is equidistant from A and B, and only one of them is the midpoint." },
  { p: "x = 3", q: "x² = 9", notP: "x ≠ 3", notQ: "x² ≠ 9", converseTrue: false, why: "x = −3 also gives x² = 9." },
  { p: "an animal is a dog", q: "it has four legs", notP: "an animal is not a dog", notQ: "it does not have four legs", converseTrue: false, why: "A cat has four legs." },
  { p: "an angle is a right angle", q: "it measures 90°", notP: "an angle is not a right angle", notQ: "it does not measure 90°", converseTrue: true, why: "That is the definition read backwards, and a definition works both ways." },
  { p: "two lines are perpendicular", q: "they meet to form right angles", notP: "two lines are not perpendicular", notQ: "they do not meet to form right angles", converseTrue: true, why: "Lines that meet at right angles are, by definition, perpendicular: a definition works both ways." },
  { p: "two parallel lines are cut by a transversal", q: "corresponding angles are congruent", notP: "two lines cut by a transversal are not parallel", notQ: "corresponding angles are not congruent", converseTrue: true, why: "Congruent corresponding angles do make the lines parallel — but nothing proves it. The converse has to be assumed, as a second postulate." },
  { p: "a number is even", q: "it is divisible by 2", notP: "a number is not even", notQ: "it is not divisible by 2", converseTrue: true, why: "A number divisible by 2 is even: that is what even means." },
  { p: "a figure is a square", q: "it has four sides", notP: "a figure is not a square", notQ: "it does not have four sides", converseTrue: false, why: "A rectangle that is not a square has four sides." },
];

/** "Is the converse true?" with a counterexample in the explanation (5.1). */
export const converseTrue: Maker = {
  id: "converse-true",
  concepts: ["converse"],
  make(r) {
    const c = pick(r, CONDITIONALS);
    const TRUE = "True";
    const FALSE = "False — there is a counterexample";
    return choice(r, c.converseTrue ? TRUE : FALSE, [c.converseTrue ? FALSE : TRUE], {
      prompt: "“If " + c.p + ", then " + c.q + ".” Is its converse true?",
      context: ["The converse: if " + c.q + ", then " + c.p + "."],
      why: c.why,
    });
  },
};

/** "Which is the converse?" — swapping the parts, not negating them. */
export const whichConverse: Maker = {
  id: "which-converse",
  concepts: ["converse"],
  make(r) {
    const c = pick(r, CONDITIONALS);
    const sentence = (a: string, b: string) => "If " + a + ", then " + b + ".";
    const converse = sentence(c.q, c.p);
    const inverse = sentence(c.notP, c.notQ);
    const contrapositive = sentence(c.notQ, c.notP);
    const original = sentence(c.p, c.q);
    const q = choice(r, converse, [inverse, contrapositive, original], {
      prompt: "Which is the converse of “" + original + "”?",
      why: "The converse swaps the hypothesis and the conclusion: “" + converse + "”",
    });
    if (q.kind === "choice")
      q.whyPerChoice = {
        [q.choices.indexOf(original)]: "That is the statement itself, unchanged.",
        [q.choices.indexOf(inverse)]: "That negates both parts without swapping them.",
        [q.choices.indexOf(contrapositive)]: "That swaps the parts and negates them both. The converse only swaps.",
      };
    return q;
  },
};

const fromMixed = (r: () => number, it: MixedItem): Question => {
  const { id: _id, heading: _h, ...rest } = reorder(r, it) as MixedItem & { heading: string };
  return rest as Question;
};

/** Which test proves the lines parallel, for the kinds taught; the forward theorem is the trap. */
export function whichTestFor(id: string, kinds: PairKind[], among = kinds): Maker {
  return {
    id,
    concepts: kinds.map((k) => CONVERSE_CONCEPT[k]),
    make: (r) => fromMixed(r, whichTest(r, id, kinds, among)),
  };
}

/** Is what is marked enough to prove m ∥ n? */
export function enoughFor(id: string, kinds: PairKind[], among?: PairKind[]): Maker {
  return {
    id,
    concepts: kinds.map((k) => CONVERSE_CONCEPT[k]),
    make: (r) => fromMixed(r, enough(r, id, kinds, among)),
  };
}

/** What value of x makes m ∥ n? */
export const parallelX: Maker = {
  id: "parallel-x",
  concepts: ["parallel-equations"],
  make: (r) => fromMixed(r, findX(r, "parallel-x")),
};

/**
 * Forwards or backwards (5.5): is the parallel given, or wanted? The same
 * pair of angles, the rule chosen by which way the argument runs.
 */
export const direction: Maker = {
  id: "direction",
  concepts: ["converse-cap", "converse-ait", "converse-aet", "converse-cit", "converse-cet"],
  make(r) {
    const f = markedFigure(r, { standard: true, marked: false });
    const b = f.build();
    const kind = pick(r, ["corresponding", "altInterior", "altExterior", "consInterior", "consExterior"] as PairKind[]);
    const [x, y] = pick(r, pairsOf(b, [kind]));
    const fact = congruentKind(kind) ? "∠" + x + " ≅ ∠" + y : "∠" + x + " and ∠" + y + " are supplementary";
    const forwards = r() < 0.5;
    const prompt = forwards ? "Given m ∥ n, prove " + fact + ". Which rule do you cite?" : "Given " + fact + ", prove m ∥ n. Which rule do you cite?";
    const right = forwards ? FORWARD[kind] : CONVERSE[kind];
    const trap = forwards ? CONVERSE[kind] : FORWARD[kind];
    const other = shuffle(r, (["corresponding", "altInterior", "altExterior", "consInterior", "consExterior"] as PairKind[]).filter((k) => k !== kind))[0];
    const q = choice(r, right, [trap, forwards ? FORWARD[other] : CONVERSE[other]], {
      prompt,
      figure: b,
      highlights: hl(x, y),
      why: forwards
        ? "The parallel lines are what you know, and the angles what you want: the forward " + (kind === "corresponding" ? "postulate" : "theorem") + ", the " + FORWARD[kind] + "."
        : "The angles are what you know, and the parallel lines what you want: the converse, the " + CONVERSE[kind] + ".",
    });
    if (q.kind === "choice")
      q.whyPerChoice = {
        [q.choices.indexOf(trap)]: forwards
          ? "A converse concludes that lines are parallel. Here the parallel lines are given."
          : "That rule starts from m ∥ n — which is what you are trying to prove.",
      };
    return q;
  },
};

/** One of the authored Parallel tests items, by id. */
export function authoredTest(id: string, concepts: string[], ids: string[]): Maker {
  return {
    id,
    concepts,
    make: (r) => {
      const want = pick(r, ids);
      return fromMixed(r, AUTHORED_TESTS.find((t) => t.id === want)!);
    },
  };
}

/** Two lines parallel to a third, or two perpendicular to one — the book's figures, or in words with fresh letters. */
export const sameLine: Maker = {
  id: "same-line",
  concepts: ["transitive-parallel", "perp-to-same-line"],
  make(r) {
    const perp = r() < 0.5;
    if (r() < 0.4) return fromMixed(r, AUTHORED_TESTS.find((t) => t.id === (perp ? "m3t-two-perps" : "m3t-transitive"))!);
    const [a, b, c] = shuffle(r, ["a", "b", "c", "p", "q", "r", "s", "u", "v"]).slice(0, 3);
    return perp
      ? choice(r, a + " ∥ " + c, [a + " ⊥ " + c, a + " and " + c + " meet on " + b, "Nothing can be said"], {
          prompt: a + " ⊥ " + b + " and " + c + " ⊥ " + b + ", all in one plane. What must be true of " + a + " and " + c + "?",
          why: "The two right angles are corresponding angles, and congruent, so by the converse of the postulate " + a + " ∥ " + c + ". Two lines perpendicular to the same line are parallel.",
        })
      : choice(r, a + " ∥ " + c, [a + " ⊥ " + c, a + " and " + c + " meet", "Nothing can be said"], {
          prompt: a + " ∥ " + b + " and " + b + " ∥ " + c + ". What must be true of " + a + " and " + c + "?",
          why: "The Transitive Property of Parallel Lines: two lines parallel to the same line are parallel to each other.",
        });
  },
};

// ---------------------------------------------------------------------------
// Unit 6 · exactly one line
// ---------------------------------------------------------------------------

/** How many lines through P? — the Parallel Postulate and its neighbours. */
export const howManyParallel: Maker = {
  id: "how-many-parallel",
  concepts: ["parallel-postulate"],
  make(r) {
    const k = pick(r, ["parallel", "parallel", "meet", "on"] as const);
    const OPTS = ["Exactly one", "None", "Two", "Infinitely many"];
    const spec = {
      parallel: { prompt: "P is not on line l. How many lines through P are parallel to l?", answer: "Exactly one", why: "The Parallel Postulate: through a point not on a line there is exactly one parallel. Every other line through P meets l somewhere." },
      meet: { prompt: "P is not on line l. How many lines through P meet l?", answer: "Infinitely many", why: "Every line through P but one meets l — the one exception is the parallel the Parallel Postulate promises." },
      on: { prompt: "P is on line l. How many lines through P, other than l itself, are parallel to l?", answer: "None", why: "Every line through P already meets l — at P. The postulate is about a point not on the line." },
    }[k];
    return choice(r, spec.answer, OPTS.filter((o) => o !== spec.answer), { prompt: spec.prompt, figure: k === "on" ? undefined : parallelPostulate(), why: spec.why });
  },
};

type Construction = "parallel" | "bisector" | "through";

/** Put the steps of a construction in order. */
export function orderSteps(id: string, concepts: string[], which: Construction): Maker {
  const spec = CONSTRUCTIONS[which];
  return {
    id,
    concepts,
    make: () => ({ kind: "order", prompt: spec.prompt, figure: spec.figure(), steps: spec.steps, why: spec.why }),
  };
}

/** Partway through a construction: which step comes next? */
export function nextStep(id: string, concepts: string[], which: Construction): Maker {
  const spec = CONSTRUCTIONS[which];
  return {
    id,
    concepts,
    make(r) {
      const k = 1 + Math.floor(r() * (spec.steps.length - 1));
      const answer = spec.steps[k];
      // Wrong options: a step that comes later, and the tempting mistakes.
      const later = spec.steps.slice(k + 1);
      const others = shuffle(r, [...shuffle(r, later).slice(0, 1), ...shuffle(r, spec.wrong)]).slice(0, 2);
      return choice(r, answer, others, {
        prompt: spec.name + ": which step comes next?",
        context: spec.steps.slice(0, k).map((st, i) => i + 1 + ". " + st),
        // The starting figure: the finished construction would give it away.
        figure: spec.start(),
        why: "Step " + (k + 1) + ": " + answer + " " + spec.why,
      });
    },
  };
}

const CONSTRUCTIONS: Record<Construction, { name: string; prompt: string; figure: () => Board; start: () => Board; steps: string[]; wrong: string[]; why: string }> = {
  parallel: {
    name: "The parallel to XY through P",
    prompt: "Put the steps for constructing the line through P parallel to XY in order.",
    figure: constructParallel(4),
    start: constructParallel(1),
    wrong: [
      "Draw a line through P that looks parallel to XY.",
      "Measure the distance from P down to XY with a ruler.",
      "Change the compass setting before drawing the arc at P.",
    ],
    steps: [
      "Draw a ray from X through P.",
      "With the compass at X, draw an arc across both sides of ∠YXP.",
      "Keeping the setting, draw a matching arc centred at P.",
      "Copy the opening of ∠YXP onto the arc at P, and mark Z.",
      "Draw line PZ.",
    ],
    why: "The ray makes the angle at X; the arcs copy it to P; and the copy, ∠ZPW, corresponds to ∠YXP. Congruent corresponding angles make PZ ∥ XY.",
  },
  bisector: {
    name: "The perpendicular bisector of XY",
    prompt: "Put the steps for constructing the perpendicular bisector of XY in order.",
    figure: constructPerpBisector(3),
    // Quiet points above and below frame the bare segment as the finished figure is framed.
    start: () => fig("Segment XY").at("X", -100, 0).at("Y", 100, 0).seg("X", "Y").quiet("F1", 0, -110).quiet("F2", 0, 110).build(),
    wrong: [
      "Set the compass to less than half of XY.",
      "Change the compass setting before drawing the arc from Y.",
      "Measure XY with a ruler and mark its midpoint.",
    ],
    steps: [
      "Set the compass to more than half of XY.",
      "Draw an arc centred at X, above and below XY.",
      "Without changing the setting, draw an arc centred at Y that crosses the first twice.",
      "Label the two crossings A and B.",
      "Draw line AB.",
    ],
    why: "Each crossing is one radius from X and one from Y, so equidistant from both; by the converse, both lie on the perpendicular bisector, and two points fix the line.",
  },
  through: {
    name: "The perpendicular to m through P",
    prompt: "Put the steps for constructing the perpendicular to m through P in order.",
    figure: constructPerpThroughPoint(3),
    start: () => fig("Line m and point P").quiet("M1", -230, 0).quiet("M2", 230, 0).line("M1", "M2").name("M1", "M2", "m").at("P", 0, -110).build(),
    wrong: [
      "Draw a line through P that looks perpendicular to m.",
      "Change the compass setting before drawing the arc from B.",
      "Measure the midpoint of AB with a ruler and join it to P.",
    ],
    steps: [
      "With the compass at P, draw an arc that cuts m at A and B.",
      "From A, draw an arc on the far side of m.",
      "With the same setting, draw an arc from B that crosses it at Q.",
      "Draw line PQ.",
    ],
    why: "The first arc makes PA = PB, and the next two make QA = QB. P and Q are both equidistant from A and B, so PQ is the perpendicular bisector of AB — and so PQ ⊥ m.",
  },
};

/** m ∥ n and t ⊥ m: the angle at the other line, found (6.3). */
export const findRight: Maker = {
  id: "find-right",
  concepts: ["perp-transversal-theorem"],
  make(r) {
    const names = pick(r, NAME_SETS);
    const k = pick(r, ["1", "2", "3", "4"]);
    const y = pick(r, ["5", "6", "7", "8"]);
    const b = transversal({ names, marked: true, cross: 90, turn: pick(r, [0, 12, -18]), measures: { [k]: 90 } });
    return {
      kind: "number",
      prompt: names[0] + " ∥ " + names[1] + " and " + names[2] + " ⊥ " + names[0] + ". Find m∠" + y + ".",
      figure: b,
      highlights: hl(y),
      answer: 90,
      unit: "°",
      why: names[2] + " ⊥ " + names[0] + " and " + names[0] + " ∥ " + names[1] + ", so " + names[2] + " ⊥ " + names[1] + " by the Perpendicular Transversal Theorem: all four angles at the lower crossing are right.",
    };
  },
};

/** m ∥ n and t ⊥ m: tap every right angle (6.3). */
export const tapRight: Maker = {
  id: "tap-right",
  concepts: ["perp-transversal-theorem"],
  make(r) {
    const names = pick(r, NAME_SETS);
    const k = pick(r, ["1", "2", "3", "4"]);
    const b = transversal({ names, marked: true, cross: 90, turn: pick(r, [0, 12, -18]), measures: { [k]: 90 }, title: names[0] + " ∥ " + names[1] + " and " + names[2] + " ⊥ " + names[0] });
    return {
      kind: "tapAngle",
      prompt: names[0] + " ∥ " + names[1] + ", and the square marks " + names[2] + " ⊥ " + names[0] + ". Tap every angle that must be right.",
      figure: b,
      answer: ["1", "2", "3", "4", "5", "6", "7", "8"],
      multi: true,
      why: "All eight. The four at the top crossing are right because one is. And ∠" + k + " corresponds to ∠" + (Number(k) + 4) + ", so " + names[2] + " ⊥ " + names[1] + " too — the Perpendicular Transversal Theorem.",
    };
  },
};

// ---------------------------------------------------------------------------
// Unit 7 · the perpendicular bisector
// ---------------------------------------------------------------------------

const TRIPLES: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]];

/** A right triangle ADC drawn to its legs, the right angle at D. */
function rightTriangleAt(a: number, b: number): Board {
  const s = 200 / Math.max(a, b);
  return fig("Right triangle ADC")
    .at("A", -a * s / 2, (b * s) / 2).at("D", (a * s) / 2, (b * s) / 2).at("C", (a * s) / 2, -(b * s) / 2)
    .seg("A", "D").seg("D", "C").seg("A", "C")
    .right("ADC")
    .build();
}

/** Right-triangle lengths from the Pythagorean Theorem (7.1). */
export const pythagorean: Maker = {
  id: "pythagorean",
  concepts: ["pythagorean"],
  make(r) {
    const [a, b, c] = pick(r, TRIPLES);
    const [legA, legB] = r() < 0.5 ? [a, b] : [b, a];
    const hyp = r() < 0.55;
    return hyp
      ? {
          kind: "number",
          prompt: "The right angle is at D. Find AC.",
          figure: rightTriangleAt(legA, legB),
          given: ["AD = " + legA, "DC = " + legB],
          answer: c,
          trap: { value: legA + legB, note: "Lengths do not add across a corner. It is the squares that add: AC² = AD² + DC²." },
          why: "AC² = " + legA + "² + " + legB + "² = " + legA * legA + " + " + legB * legB + " = " + c * c + ", so AC = " + c + ".",
        }
      : {
          kind: "number",
          prompt: "The right angle is at D. Find DC.",
          figure: rightTriangleAt(legA, legB),
          given: ["AD = " + legA, "AC = " + c],
          answer: legB,
          trap: { value: Math.round(Math.sqrt(c * c + legA * legA) * 100) / 100, note: "That adds the squares. AC is the hypotenuse, so DC² = AC² − AD²." },
          why: "AC is the hypotenuse, so DC² = " + c + "² − " + legA + "² = " + c * c + " − " + legA * legA + " = " + legB * legB + ", and DC = " + legB + ".",
        };
  },
};

/** Reflection keeps distances: a point on the mirror line is as far from A as from its image (7.1). */
export const reflectionLength: Maker = {
  id: "reflection-length",
  concepts: ["reflection"],
  make(r) {
    const p = pick(r, ["E", "F", "G"]);
    const d = 5 + Math.floor(r() * 30);
    return {
      kind: "number",
      prompt: "Folding along CD carries A onto B. " + p + " is on the fold. " + p + "A = " + d + ". Find " + p + "B.",
      figure: reflection(),
      answer: d,
      why: "The fold carries " + p + "A onto " + p + "B, and a reflection keeps lengths: " + p + "B = " + d + ".",
    };
  },
};

/** A point and a segment: is the point equally far from both ends? (7.2) */
export const isEquidistant: Maker = {
  id: "is-equidistant",
  concepts: ["equidistant"],
  make(r) {
    const k = pick(r, ["ticks", "lengths", "unequal", "unmarked", "midpoint"] as const);
    const YES = "Yes", NO = "No", CANT = "Can't tell from what is given";
    const tri = (marks: boolean) => {
      const f = fig("P and segment AB");
      f.at("A", -150, 60).at("B", 150, 60).seg("A", "B");
      f.at("P", k === "unequal" ? 40 : 0, -110).seg("P", "A").seg("P", "B");
      if (marks) f.tick(["P", "A"], ["P", "B"]);
      return f.build();
    };
    const m = 6 + Math.floor(r() * 20);
    const spec = {
      ticks: { figure: equidistantPoint(), given: [] as string[], answer: YES, why: "The matching ticks mark PA = PB: P is equidistant from A and B." },
      lengths: { figure: tri(false), given: ["PA = " + m, "PB = " + m], answer: YES, why: "PA and PB are both " + m + ": equidistant means exactly that." },
      unequal: { figure: tri(false), given: ["PA = " + m, "PB = " + (m + 3)], answer: NO, why: "PA = " + m + " and PB = " + (m + 3) + ". Equidistant needs the two distances equal." },
      unmarked: { figure: tri(false), given: [], answer: CANT, why: "The drawing looks balanced, but nothing marks PA = PB, and no lengths are given. A figure proves nothing it does not mark." },
      midpoint: { figure: equidistantPoint(), given: ["M is the midpoint of AB"], answer: YES, why: "A midpoint splits AB into two equal halves, so M is equidistant from A and B — and so is P, by its ticks. The question was about P, and the ticks settle it." },
    }[k];
    return choice(r, spec.answer, [YES, NO, CANT].filter((o) => o !== spec.answer), {
      prompt: "Is P equidistant from A and B?",
      context: spec.given.length ? spec.given : undefined,
      figure: spec.figure,
      why: spec.why,
    });
  },
};

/** Length equations from the theorem, the converse, or either (7.3, 7.4, 7.6). */
export function bisectorLengths(id: string, o: { converse?: boolean } = {}): Maker {
  return {
    id,
    concepts: o.converse === undefined ? ["length-equations"] : [o.converse ? "converse-perp-bisector" : "perp-bisector-theorem"],
    make: (r) => fromMixed(r, lengths(r, id, o)),
  };
}

/** "C is on the ⊥ bisector of AB and CA = 9. Find CB." — the theorem, direct. */
export const onBisector: Maker = {
  id: "on-bisector",
  concepts: ["perp-bisector-theorem"],
  make(r) {
    const d = 5 + Math.floor(r() * 25);
    const f = fig("CD ⊥ bisector of AB");
    f.at("A", -150, 60).at("B", 150, 60).seg("A", "B");
    f.at("C", 0, -130).quiet("K", 0, 130).line("C", "K");
    f.cross("D", ["A", "B"], ["C", "K"]);
    f.seg("A", "C").seg("B", "C");
    const b = f.tick(["A", "D"], ["D", "B"]).right("ADC").build();
    return {
      kind: "number",
      prompt: "CD is the perpendicular bisector of AB, and CA = " + d + ". Find CB.",
      figure: b,
      answer: d,
      why: "C is on the perpendicular bisector of AB, so it is equidistant from A and B: CB = CA = " + d + ".",
    };
  },
};

/** Is what is marked enough to put B on the ⊥ bisector? — the book's five cases. */
export function bisectorEnoughFor(id: string, concepts: string[], cases = BISECTOR_CASES): Maker {
  return { id, concepts, make: (r) => fromMixed(r, bisectorEnough(r, id, cases)) };
}

/** One of the authored bisector items, by id. */
export function authoredBisector(id: string, concepts: string[], ids: string[]): Maker {
  return { id, concepts, make: (r) => {
    const want = pick(r, ids);
    return fromMixed(r, AUTHORED_BISECTOR.find((t) => t.id === want)!);
  } };
}
