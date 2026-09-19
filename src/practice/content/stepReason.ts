// One step of a proof, on its own: what justifies this line?
//
// Building a whole proof asks for everything at once. This asks the question
// the reference says the test is really built from — "check each offered
// reason against the statement it claims to justify" — one line at a time,
// with the lines it rests on shown above it.
import type { Board } from "../../model";
import type { Statement } from "../terms";
import { type ProofLine, type ProofProblem, validateLine } from "../proof";
import { reasonById } from "../reasons";
import { PROOFS } from "./proofs";
import { rng } from "./generators";

export type StepItem = {
  id: string;
  title: string;
  figure?: Board;
  givens: Statement[];
  /** The lines already established, shown for context. */
  above: { n: number; statement: Statement; reasonId: string }[];
  /** Which of those this step rests on. */
  cites: number[];
  statement: Statement;
  answer: string;
  options: string[];
  why: string;
  tags?: string[];
};

const CONFUSIONS: Record<string, string[]> = {
  reflexive: ["transitive", "symmetric", "substitution"],
  symmetric: ["reflexive", "substitution", "transitive"],
  transitive: ["substitution", "symmetric", "reflexive"],
  substitution: ["transitive", "symmetric", "simplify"],
  "addition-property": ["subtraction-property", "reflexive", "substitution"],
  "subtraction-property": ["addition-property", "substitution", "division-property"],
  "multiplication-property": ["division-property", "addition-property", "distributive"],
  "division-property": ["multiplication-property", "subtraction-property", "simplify"],
  distributive: ["substitution", "simplify", "multiplication-property"],
  simplify: ["distributive", "substitution", "addition-property"],
  given: ["reflexive", "def-between", "substitution"],
  "def-cong-ang": ["def-cong-seg", "vertical-angles-theorem", "right-angle-congruence"],
  "def-cong-seg": ["def-cong-ang", "def-midpoint", "segment-addition"],
  "def-midpoint": ["def-seg-bisector", "def-cong-seg", "segment-addition"],
  "def-ang-bisector": ["def-seg-bisector", "def-cong-ang", "angle-addition"],
  "def-supplementary": ["def-complementary", "linear-pair-theorem", "def-linear-pair"],
  "def-complementary": ["def-supplementary", "def-right-angle", "angle-addition"],
  "def-right-angle": ["right-angle-congruence", "def-perpendicular", "def-complementary"],
  "def-linear-pair": ["linear-pair-theorem", "def-adjacent", "def-supplementary"],
  "linear-pair-theorem": ["def-linear-pair", "def-supplementary", "vertical-angles-theorem"],
  "vertical-angles-theorem": ["def-vertical", "def-cong-ang", "congruent-supplements"],
  "angle-addition": ["segment-addition", "def-adjacent", "angles-around-point"],
  "segment-addition": ["angle-addition", "def-between", "def-midpoint"],
  "congruent-supplements": ["congruent-complements", "vertical-angles-theorem"],
  "right-angle-congruence": ["def-right-angle", "def-cong-ang"],
};

const shuffle = <T,>(r: () => number, xs: T[]) => {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Every step of every proof, as its own question. */
export function stepItems(seed: number, count = 10): StepItem[] {
  const r = rng(seed);
  const out: StepItem[] = [];

  for (const p of shuffle(r, PROOFS)) {
    const steps = p.solution;
    if (!steps) continue;
    const lines: ProofLine[] = [];

    steps.forEach((s, i) => {
      const cites = s.cites.map((n) => lines[n - 1]?.id ?? "missing");
      // A "Given" line teaches nothing here; the interesting steps are the
      // ones that draw a conclusion from earlier lines.
      const worthAsking = s.reasonId !== "given" && out.length < count * 4;
      if (worthAsking) {
        const wrong: string[] = [];
        for (const candidate of CONFUSIONS[s.reasonId] ?? []) {
          if (wrong.length >= 3) break;
          if (p.forbid?.includes(candidate)) continue;
          const check = validateLine(p, lines, {
            statement: s.statement,
            reasonId: candidate,
            cites,
          });
          // Only offer a reason the validator genuinely rejects here.
          if (!check.ok) wrong.push(reasonById(candidate)!.name);
        }
        if (wrong.length >= 3) {
          const answer = reasonById(s.reasonId)!.name;
          out.push({
            id: p.id + ":" + (i + 1),
            title: p.title,
            figure: p.figure,
            givens: p.givens,
            above: steps.slice(0, i).map((x, n) => ({
              n: n + 1,
              statement: x.statement,
              reasonId: x.reasonId,
            })),
            cites: s.cites,
            statement: s.statement,
            answer,
            options: shuffle(r, [answer, ...wrong.slice(0, 3)]),
            why: reasonById(s.reasonId)!.short,
            tags: p.tags,
          });
        }
      }
      lines.push({ id: "S" + (i + 1), statement: s.statement, reasonId: s.reasonId, cites });
    });
  }
  return shuffle(r, out).slice(0, count);
}
