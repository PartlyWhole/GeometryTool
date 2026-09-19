// Form A Q6: a finished proof with reasons attached, some of them wrong.
//
// Built from the worked solutions the proofs already carry, so no proof is
// authored twice. A reason is only swapped when the validator confirms the
// swap actually fails — transitive and substitution overlap, and the
// reference says either is usually accepted, so a "wrong" label that would
// have been allowed must never be offered as wrong.
import type { Board } from "../../model";
import type { Statement } from "../terms";
import { type ProofLine, type ProofProblem, validateLine } from "../proof";
import { reasonById } from "../reasons";
import { PROOFS } from "./proofs";
import { rng } from "./generators";

export type ReasonRow = {
  statement: Statement;
  reasonId: string;
  correct: boolean;
  /** Why the offered reason is wrong, taken from the validator itself. */
  note?: string;
};

export type ReasonCheckItem = {
  id: string;
  title: string;
  prompt: string;
  figure?: Board;
  givens: Statement[];
  goal: Statement;
  rows: ReasonRow[];
  why: string;
  tags?: string[];
};

/** The confusions the reference says test writers plant. */
const CONFUSIONS: Record<string, string[]> = {
  reflexive: ["transitive", "symmetric"],
  symmetric: ["reflexive", "substitution"],
  transitive: ["reflexive", "symmetric"],
  substitution: ["symmetric", "reflexive"],
  "addition-property": ["reflexive", "subtraction-property"],
  "subtraction-property": ["addition-property", "reflexive"],
  "multiplication-property": ["division-property", "addition-property"],
  "division-property": ["multiplication-property", "subtraction-property"],
  distributive: ["substitution", "simplify"],
  simplify: ["distributive", "substitution"],
  "def-cong-ang": ["def-cong-seg", "vertical-angles-theorem"],
  "def-cong-seg": ["def-cong-ang", "def-midpoint"],
  "def-midpoint": ["def-seg-bisector", "def-cong-seg"],
  "def-ang-bisector": ["def-seg-bisector", "def-cong-ang"],
  "def-supplementary": ["def-complementary", "linear-pair-theorem"],
  "def-complementary": ["def-supplementary", "def-right-angle"],
  "def-right-angle": ["right-angle-congruence", "def-perpendicular"],
  "def-linear-pair": ["linear-pair-theorem", "def-adjacent"],
  "linear-pair-theorem": ["def-linear-pair", "def-supplementary"],
  "vertical-angles-theorem": ["def-vertical", "def-cong-ang"],
  "angle-addition": ["segment-addition", "def-adjacent"],
  "segment-addition": ["angle-addition", "def-between"],
};

/**
 * Proofs this sub-tab leaves alone. `supplementary-solve` makes a checklist
 * twelve rows long for two plants that are drilled better and shorter
 * elsewhere — supplementary-for-complementary by `rc-congruent-supplements`,
 * Multiplication-for-Division by `rc-algebra-justify` — so the reading it
 * asks for is not repaid.
 */
const SKIP = ["supplementary-solve"];

/**
 * Attach reasons to a finished proof, spoiling some of them. Returns
 * undefined when the proof is too short to make a worthwhile question.
 */
function fromProof(p: ProofProblem, r: () => number): ReasonCheckItem | undefined {
  const steps = p.solution;
  if (!steps || steps.length < 4) return;

  const lines: ProofLine[] = [];
  const rows: ReasonRow[] = [];

  // Pick the rows that will carry an error before walking the proof. A Given
  // line is never picked: the only swap open to it is Reflexive, which nobody
  // who has read the line ticks, so spoiling one spends an error on a row
  // that teaches nothing. And filling a quota top-down as the proof was
  // walked exhausted it in the opening rows, so the sharpest plants — which
  // live in the middle of a proof — fired about one run in ten.
  const live = steps.flatMap((s, i) => (s.reasonId === "given" ? [] : [i]));
  const wanted = Math.max(2, Math.round(live.length * 0.55));
  const chosen = new Set(shuffle(r, live).slice(0, wanted));

  steps.forEach((s, i) => {
    const cites = s.cites.map((n) => lines[n - 1]?.id ?? "missing");
    const candidates = chosen.has(i) ? CONFUSIONS[s.reasonId] ?? [] : [];
    let offered = s.reasonId;
    let note: string | undefined;

    // Spoil only where the swap genuinely fails.
    for (const wrong of candidates) {
      if (p.forbid?.includes(wrong)) continue;
      const check = validateLine(p, lines, {
        statement: s.statement,
        reasonId: wrong,
        cites,
      });
      if (!check.ok) {
        offered = wrong;
        note = check.why;
        break;
      }
    }
    rows.push({ statement: s.statement, reasonId: offered, correct: offered === s.reasonId, note });
    // The proof itself always advances with its true reason.
    lines.push({ id: "S" + (i + 1), statement: s.statement, reasonId: s.reasonId, cites });
  });

  if (!rows.some((x) => !x.correct) || !rows.some((x) => x.correct)) return;

  return {
    id: "rc-" + p.id,
    title: p.title,
    prompt:
      "Each line of this proof has been given a reason. Select every line whose reason is correct.",
    figure: p.figure,
    givens: p.givens,
    goal: p.goal,
    rows,
    why:
      "Check each offered reason against the statement it claims to justify. A statement can be perfectly true and still carry the wrong reason — that is the error these questions are built from.",
    tags: p.tags,
  };
}

export function reasonCheckItems(seed: number, count = 6): ReasonCheckItem[] {
  const r = rng(seed);
  const out: ReasonCheckItem[] = [];
  // Shuffle before taking `count`. Walking the pool in order and stopping at
  // the quota made the last proofs all but unreachable: with ten eligible and
  // eight asked for, the tenth turned up in one session in four hundred.
  const pool = shuffle(
    r,
    PROOFS.filter((p) => !SKIP.includes(p.id) && (p.solution?.length ?? 0) >= 4),
  );
  for (let i = 0; i < pool.length && out.length < count; i++) {
    const item = fromProof(pool[i], r);
    if (item) out.push(item);
  }
  return out;
}

const shuffle = <T,>(r: () => number, xs: T[]) => {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const reasonName = (id: string) => reasonById(id)?.name ?? id;
