// Two-column proof state and step checking.
import type { Board } from "../model";
import {
  type ObjId,
  type Statement,
  diff,
  isFlip,
  isZero,
  mapAngles,
  sameStatement,
  statementKey,
} from "./terms";
import { angleNamer } from "./oracle";
import { type Check, type Ctx, reasonById } from "./reasons";
import { statementText } from "./notation";

export type ProofLine = {
  id: string;
  statement: Statement;
  reasonId: string;
  /** Ids of earlier lines this step rests on. */
  cites: string[];
};

export type ProofProblem = {
  id: string;
  title: string;
  /** Prose statement of what is given and what is to be proved. */
  prompt: string;
  figure?: Board;
  givens: Statement[];
  goal: Statement;
  /**
   * Reasons a student may not cite here — always including the theorem being
   * proved, since "the thing you are proving may never appear as a reason".
   */
  forbid?: string[];
  /** Ordered nudges, revealed one at a time. */
  hints?: string[];
  tags?: string[];
  /**
   * Objects the statement builder should offer when there is no figure, or
   * when the figure does not contain them.
   */
  objects?: ObjId[];
  /** A worked solution, cited by 1-based line number. */
  solution?: SolutionStep[];
};

export type SolutionStep = {
  statement: Statement;
  reasonId: string;
  /** 1-based line numbers of earlier steps. */
  cites: number[];
};

/**
 * Replay a worked solution through the validator. Returns the first failure,
 * or undefined when every step checks out and the goal is reached.
 */
export function replaySolution(
  problem: ProofProblem,
): { step: number; why: string } | undefined {
  const steps = problem.solution;
  if (!steps?.length) return { step: 0, why: "No worked solution is recorded." };
  const lines: ProofLine[] = [];
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const cites = s.cites.map((nth) => lines[nth - 1]?.id ?? "missing");
    const check = validateLine(problem, lines, {
      statement: s.statement,
      reasonId: s.reasonId,
      cites,
    });
    if (!check.ok) return { step: i + 1, why: check.why };
    lines.push({ id: "S" + (i + 1), statement: s.statement, reasonId: s.reasonId, cites });
  }
  if (!reachedGoal(problem, lines))
    return { step: steps.length, why: "The solution never reaches the goal." };
  return undefined;
}

export const lineNumber = (lines: ProofLine[], id: string) =>
  lines.findIndex((l) => l.id === id) + 1;

/** Check one line against the lines already accepted above it. */
export function validateLine(
  problem: ProofProblem,
  above: ProofLine[],
  line: Omit<ProofLine, "id">,
): Check {
  const reason = reasonById(line.reasonId);
  if (!reason) return { ok: false, why: "Choose a reason for this statement." };
  if (problem.forbid?.includes(reason.id))
    return {
      ok: false,
      why:
        "You may not cite " + reason.name +
        " here — that is what this proof is establishing. Using it would be circular.",
    };

  // Everything the validators compare is put into one naming first, so a
  // student who clicks ∠AXC on the figure is not marked wrong against a given
  // written as ∠1.
  const name = angleNamer(problem.figure);
  const canon = (s: Statement) => mapAngles(s, name);

  const byId = new Map(above.map((l) => [l.id, l]));
  const premises: Statement[] = [];
  for (const id of line.cites) {
    const l = byId.get(id);
    if (!l)
      return {
        ok: false,
        why: "A cited line must appear earlier in the proof.",
      };
    premises.push(canon(l.statement));
  }

  // A line whose two sides are literally the same quantity is reflexive,
  // whatever else it might look like. The reference singles this out as the
  // step test writers most often mislabel.
  if (
    line.statement.k === "eq" &&
    isZero(diff(line.statement)) &&
    reason.id !== "reflexive"
  )
    return {
      ok: false,
      why:
        "Both sides of that line are the same quantity, so the reason is the Reflexive Property, not " +
        reason.name + ".",
    };

  const [min, max] = reason.cites;
  const lineWord = (n: number) => n + " earlier line" + (n === 1 ? "" : "s");
  if (line.cites.length < min)
    return {
      ok: false,
      why:
        reason.name + " needs " +
        (min === max ? lineWord(min) : "at least " + lineWord(min)) +
        " to be cited.",
    };
  if (line.cites.length > max)
    return {
      ok: false,
      why:
        reason.name + " uses at most " + lineWord(max) +
        ". Cite only the ones it rests on.",
    };

  // Compared as written, not as evaluated: "3(x - 4) = 18" and "3x - 12 = 18"
  // have the same value but are different lines, which is the whole point of
  // a distributive step.
  const written = statementText(line.statement);
  const dup = above.findIndex((l) => statementText(l.statement) === written);
  if (dup >= 0)
    return { ok: false, why: "That statement is already on line " + (dup + 1) + "." };

  const ctx: Ctx = {
    board: problem.figure,
    givens: problem.givens.map(canon),
  };
  return reason.check(canon(line.statement), premises, ctx);
}

export function reachedGoal(problem: ProofProblem, lines: ProofLine[]) {
  const name = angleNamer(problem.figure);
  const goal = mapAngles(problem.goal, name);
  return lines.some((l) => {
    const s = mapAngles(l.statement, name);
    return sameStatement(s, goal) || isFlip(s, goal);
  });
}

/** Lines that no later line depends on, and that are not the goal. */
export function unusedLines(problem: ProofProblem, lines: ProofLine[]) {
  const used = new Set(lines.flatMap((l) => l.cites));
  return lines.filter(
    (l) =>
      !used.has(l.id) &&
      !sameStatement(l.statement, problem.goal) &&
      !isFlip(l.statement, problem.goal),
  );
}

/**
 * Statements a student could legitimately write next, used for the hint
 * button. Tries every reason against every small set of available premises
 * and keeps the conclusions that validate.
 */
export function suggestNext(
  problem: ProofProblem,
  lines: ProofLine[],
): { statement: Statement; reasonId: string } | undefined {
  const have = new Set(lines.map((l) => statementKey(l.statement)));
  // The givens, stated but not yet written down, are always the first move.
  for (const g of problem.givens)
    if (!have.has(statementKey(g))) return { statement: g, reasonId: "given" };
  return undefined;
}

export const describe = (s: Statement) => statementText(s);

export type ProofState = {
  lines: ProofLine[];
  /** Index of the line being edited, or null when adding a new one. */
  editing: number | null;
};

export const emptyProof = (): ProofState => ({ lines: [], editing: null });

export function figureOf(p: ProofProblem): Board | undefined {
  return p.figure;
}
