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
  /**
   * One explanation per offered reason, keyed by the name on the button: the
   * rule itself for the answer, and the validator's own refusal for each
   * wrong one. Showing the reason the student actually picked is the whole
   * point of asking the validator in the first place.
   */
  whyByOption: Record<string, string>;
  tags?: string[];
};

const CONFUSIONS: Record<string, string[]> = {
  reflexive: ["transitive", "symmetric", "substitution"],
  symmetric: ["reflexive", "substitution", "transitive"],
  transitive: ["substitution", "symmetric", "reflexive"],
  substitution: ["transitive", "symmetric", "simplify"],
  "addition-property": ["subtraction-property", "simplify", "substitution"],
  "subtraction-property": ["addition-property", "substitution", "division-property"],
  "multiplication-property": ["division-property", "addition-property", "distributive"],
  "division-property": ["multiplication-property", "subtraction-property", "simplify"],
  distributive: ["substitution", "simplify", "multiplication-property"],
  simplify: ["distributive", "substitution", "addition-property"],
  given: ["reflexive", "def-between", "substitution"],
  "def-cong-ang": ["def-cong-seg", "symmetric", "def-supplementary"],
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

/**
 * Steps this family leaves out. `supplementary-solve:9` asks the same
 * Division-for-Multiplication question as `algebra-justify:4` on different
 * numbers, and adds only eight lines of context a student can read the
 * answer's pattern off instead of reading the line.
 */
const SKIP = ["supplementary-solve:9"];

/** Could this reason rest on that many earlier lines? */
const arityFits = (id: string, n: number) => {
  const [lo, hi] = reasonById(id)!.cites;
  return n >= lo && n <= hi;
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
      const id = p.id + ":" + (i + 1);
      const cites = s.cites.map((n) => lines[n - 1]?.id ?? "missing");
      // A "Given" line teaches nothing here; the interesting steps are the
      // ones that draw a conclusion from earlier lines.
      const worthAsking =
        s.reasonId !== "given" && !SKIP.includes(id) && out.length < count * 4;
      if (worthAsking) {
        const wrong: { name: string; why: string; fits: boolean }[] = [];
        for (const candidate of CONFUSIONS[s.reasonId] ?? []) {
          if (p.forbid?.includes(candidate)) continue;
          const check = validateLine(p, lines, {
            statement: s.statement,
            reasonId: candidate,
            cites,
          });
          // Only offer a reason the validator genuinely rejects here.
          if (!check.ok)
            wrong.push({
              name: reasonById(candidate)!.name,
              why: check.why,
              fits: arityFits(candidate, s.cites.length),
            });
        }
        // The screen says how many earlier lines the step rests on. Unless
        // one of the wrong reasons could rest on that many too, the count
        // alone settles the question and the statement never has to be read.
        const offer = [
          ...wrong.filter((w) => w.fits),
          ...wrong.filter((w) => !w.fits),
        ].slice(0, 3);
        if (offer.length >= 3 && offer.some((w) => w.fits)) {
          const answer = reasonById(s.reasonId)!.name;
          const why = reasonById(s.reasonId)!.short;
          out.push({
            id,
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
            options: shuffle(r, [answer, ...offer.map((w) => w.name)]),
            why,
            whyByOption: Object.fromEntries([
              [answer, why],
              ...offer.map((w) => [w.name, w.why]),
            ]),
            tags: p.tags,
          });
        }
      }
      lines.push({ id: "S" + (i + 1), statement: s.statement, reasonId: s.reasonId, cites });
    });
  }

  // Seven of the steps ask the same question — which definition licenses a
  // congruence — and Substitution answers five more, so an unfiltered draw
  // repeats itself. Take one item per reason first, and only then fall back
  // to a second helping of any reason.
  const drawn = shuffle(r, out);
  const used = new Set<string>();
  const first = drawn.filter((x) => used.size !== used.add(x.answer).size);
  return [...first, ...drawn.filter((x) => !first.includes(x))].slice(0, count);
}
