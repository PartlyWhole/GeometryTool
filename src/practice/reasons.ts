// The catalogue of definitions, postulates, theorems and properties from
// Module 2, each with a validator that decides whether it licenses a given
// conclusion from the premises cited for it.
//
// Validation is strict in the sense the user asked for: a statement that is
// true but carries the wrong reason is rejected, and the message says which
// reason the shape of the step actually matches. It is not strict in the sense
// of demanding one canonical proof — any correctly justified route is accepted.
import type { Board } from "../model";
import {
  type AngId,
  type ObjId,
  type SegId,
  type Statement,
  type Term,
  collectLen,
  collectMeas,
  diff,
  distinctObjs,
  hasDistributable,
  isFlip,
  isZero,
  objKey,
  inSpan,
  polyEqual,
  polyPlus,
  polyScale,
  sameObj,
  sameStatement,
  scalarMultiple,
  splitLabels,
  toPoly,
} from "./terms";
import { holds, isBetween, isInterior, marked } from "./oracle";
import { statementText } from "./notation";

export type ReasonKind =
  | "given"
  | "definition"
  | "postulate"
  | "theorem"
  | "property"
  | "algebra";

export type Ctx = { board?: Board; givens: Statement[] };
export type Check = { ok: true; note?: string } | { ok: false; why: string };

const OK: Check = { ok: true };
const no = (why: string): Check => ({ ok: false, why });

export type Reason = {
  id: string;
  name: string;
  kind: ReasonKind;
  /** Student-facing statement of the rule. */
  short: string;
  /** How many earlier lines this reason normally cites. */
  cites: [number, number];
  check(conclusion: Statement, premises: Statement[], ctx: Ctx): Check;
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const isEq = (s: Statement): s is Extract<Statement, { k: "eq" }> =>
  s.k === "eq";

const known = (s: Statement, ctx: Ctx, premises: Statement[]) =>
  premises.some((p) => sameStatement(p, s)) ||
  ctx.givens.some((g) => sameStatement(g, s)) ||
  (!!ctx.board && marked(ctx.board, s));

/** Both directions of a definition: premise ⇒ conclusion, or the reverse. */
function biconditional(
  a: Statement,
  b: Statement,
  conclusion: Statement,
  premises: Statement[],
  ctx: Ctx,
): Check {
  if (sameStatement(conclusion, b) && known(a, ctx, premises)) return OK;
  if (sameStatement(conclusion, a) && known(b, ctx, premises)) return OK;
  return no(
    "State " + statementText(a) + " first, then this definition gives " +
      statementText(b) + " (or the other way round).",
  );
}

const measEq = (a: AngId, b: AngId): Statement => ({
  k: "eq",
  l: { k: "meas", ang: a },
  r: { k: "meas", ang: b },
});
const lenEq = (a: SegId, b: SegId): Statement => ({
  k: "eq",
  l: { k: "len", seg: a },
  r: { k: "len", seg: b },
});
const sum = (...ts: Term[]): Term => ({ k: "add", ts });
const n = (v: number): Term => ({ k: "num", v });
const m = (a: AngId): Term => ({ k: "meas", ang: a });

/** Accept either the congruence form or the equal-measure form. */
function congOrMeasure(
  conclusion: Statement,
  a: AngId,
  b: AngId,
): "cong" | "eq" | undefined {
  if (
    conclusion.k === "cong" &&
    conclusion.l.k === "ang" &&
    conclusion.r.k === "ang" &&
    ((sameObj(conclusion.l, a) && sameObj(conclusion.r, b)) ||
      (sameObj(conclusion.l, b) && sameObj(conclusion.r, a)))
  )
    return "cong";
  if (
    isEq(conclusion) &&
    (sameStatement(conclusion, measEq(a, b)) ||
      sameStatement(conclusion, measEq(b, a)))
  )
    return "eq";
  return undefined;
}

/** The two angles a conclusion is about, when it is a pair statement. */
function anglePair(s: Statement): [AngId, AngId] | undefined {
  if (
    s.k === "supp" || s.k === "comp" || s.k === "vertical" ||
    s.k === "linearPair" || s.k === "adjacent"
  )
    return [s.a, s.b];
  if (s.k === "cong" && s.l.k === "ang" && s.r.k === "ang")
    return [s.l, s.r];
  return undefined;
}

const ALL: Reason[] = [];
const R = (r: Reason) => (ALL.push(r), r);

// ---------------------------------------------------------------------------
// Given
// ---------------------------------------------------------------------------

R({
  id: "given",
  name: "Given",
  kind: "given",
  short: "Stated in the problem, or marked on the figure.",
  cites: [0, 0],
  check(c, _p, ctx) {
    if (ctx.givens.some((g) => sameStatement(g, c))) return OK;
    if (ctx.givens.some((g) => isFlip(g, c)))
      return no(
        "The given is written the other way round. Cite it as given first, then use the Symmetric Property.",
      );
    if (ctx.board && marked(ctx.board, c))
      return { ok: true, note: "Read from the figure's markings." };
    return no(
      "That is not one of the givens, and the figure does not mark it. Only tick marks, right-angle squares and points drawn on a line may be read off a diagram.",
    );
  },
});

// ---------------------------------------------------------------------------
// Definitions
// ---------------------------------------------------------------------------

R({
  id: "def-cong-seg",
  name: "Definition of congruent segments",
  kind: "definition",
  short: "AB ≅ CD means AB = CD.",
  cites: [1, 1],
  check(c, p, ctx) {
    const pair =
      c.k === "cong" && c.l.k === "seg" && c.r.k === "seg"
        ? ([c.l, c.r] as [SegId, SegId])
        : isEq(c) && c.l.k === "len" && c.r.k === "len"
          ? ([c.l.seg, c.r.seg] as [SegId, SegId])
          : undefined;
    if (!pair)
      return no(
        "This definition turns AB ≅ CD into AB = CD, or back again. The step must be one of those two forms.",
      );
    return biconditional(
      { k: "cong", l: pair[0], r: pair[1] },
      lenEq(pair[0], pair[1]),
      c,
      p,
      ctx,
    );
  },
});

R({
  id: "def-cong-ang",
  name: "Definition of congruent angles",
  kind: "definition",
  short: "∠A ≅ ∠B means m∠A = m∠B.",
  cites: [1, 1],
  check(c, p, ctx) {
    const pair =
      c.k === "cong" && c.l.k === "ang" && c.r.k === "ang"
        ? ([c.l, c.r] as [AngId, AngId])
        : isEq(c) && c.l.k === "meas" && c.r.k === "meas"
          ? ([c.l.ang, c.r.ang] as [AngId, AngId])
          : undefined;
    if (!pair)
      return no(
        "This definition turns ∠A ≅ ∠B into m∠A = m∠B, or back again. The step must be one of those two forms.",
      );
    return biconditional(
      { k: "cong", l: pair[0], r: pair[1] },
      measEq(pair[0], pair[1]),
      c,
      p,
      ctx,
    );
  },
});

R({
  id: "def-midpoint",
  name: "Definition of midpoint",
  kind: "definition",
  short: "A midpoint divides a segment into two congruent halves.",
  cites: [1, 1],
  check(c, p, ctx) {
    const src = [...p, ...ctx.givens].find((s) => s.k === "midpoint") as
      | Extract<Statement, { k: "midpoint" }>
      | undefined;
    if (c.k === "midpoint") {
      const halves: Statement = {
        k: "cong",
        l: { k: "seg", a: c.seg.a, b: c.p },
        r: { k: "seg", a: c.p, b: c.seg.b },
      };
      if (
        known(halves, ctx, p) &&
        (!ctx.board || isBetween(ctx.board, c.p, c.seg.a, c.seg.b))
      )
        return OK;
      return no(
        "To conclude a midpoint you need the two halves congruent and the point on the segment.",
      );
    }
    if (!src)
      return no("Cite the line that states the midpoint.");
    const a = { k: "seg", a: src.seg.a, b: src.p } as SegId,
      b = { k: "seg", a: src.p, b: src.seg.b } as SegId;
    const wantCong: Statement = { k: "cong", l: a, r: b };
    if (sameStatement(c, wantCong) || isFlip(c, wantCong)) return OK;
    if (isEq(c) && (sameStatement(c, lenEq(a, b)) || isFlip(c, lenEq(a, b))))
      return OK;
    // Each half is half the whole.
    const half: Statement = {
      k: "eq",
      l: { k: "len", seg: a },
      r: { k: "div", n: { k: "len", seg: src.seg }, d: n(2) },
    };
    if (sameStatement(c, half)) return OK;
    return no(
      "The midpoint " + src.p + " gives " + statementText(wantCong) +
        " (or the equal-length form).",
    );
  },
});

R({
  id: "def-seg-bisector",
  name: "Definition of segment bisector",
  kind: "definition",
  short: "A bisector passes through the midpoint, so the halves are congruent.",
  cites: [1, 1],
  check(c, p, ctx) {
    const src = [...p, ...ctx.givens].find(
      (s) => s.k === "bisects" && s.of.k === "seg",
    ) as Extract<Statement, { k: "bisects" }> | undefined;
    if (!src) return no("Cite the line stating that something bisects the segment.");
    const target = src.of as SegId;
    const through =
      src.by.k === "ray" ? src.by.through : src.by.k === "pt" ? src.by.p : undefined;
    const mid =
      through ??
      (ctx.board?.points.find(
        (q) =>
          q.label !== target.a &&
          q.label !== target.b &&
          isBetween(ctx.board!, q.label, target.a, target.b),
      )?.label);
    if (!mid) return no("The figure does not show where the bisector meets the segment.");
    const a = { k: "seg", a: target.a, b: mid } as SegId,
      b = { k: "seg", a: mid, b: target.b } as SegId;
    const want: Statement = { k: "cong", l: a, r: b };
    if (sameStatement(c, want) || isFlip(c, want)) return OK;
    if (sameStatement(c, lenEq(a, b)) || isFlip(c, lenEq(a, b))) return OK;
    if (c.k === "midpoint" && c.p === mid && objKey(c.seg) === objKey(target))
      return OK;
    return no("A segment bisector gives " + statementText(want) + ".");
  },
});

R({
  id: "def-ang-bisector",
  name: "Definition of angle bisector",
  kind: "definition",
  short: "A ray that splits an angle into two congruent angles.",
  cites: [1, 1],
  check(c, p, ctx) {
    const src = [...p, ...ctx.givens].find(
      (s) => s.k === "bisects" && s.of.k === "ang",
    ) as Extract<Statement, { k: "bisects" }> | undefined;
    if (!src) return no("Cite the line stating that a ray bisects the angle.");
    const whole = src.of as AngId;
    const parts = splitLabels(whole.name);
    const through =
      src.by.k === "ray" ? src.by.through : src.by.k === "seg" ? src.by.b : undefined;
    if (parts.length !== 3 || !through)
      return no("The bisected angle must be named by three points.");
    const [x, v, y] = parts;
    const a = { k: "ang", name: x + v + through } as AngId,
      b = { k: "ang", name: through + v + y } as AngId;
    const form = congOrMeasure(c, a, b);
    if (form) return OK;
    // Each part is half the whole.
    const half: Statement = {
      k: "eq",
      l: m(a),
      r: { k: "div", n: m(whole), d: n(2) },
    };
    if (sameStatement(c, half)) return OK;
    return no(
      "The bisector gives ∠" + a.name + " ≅ ∠" + b.name +
        " (or the equal-measure form).",
    );
  },
});

R({
  id: "def-supplementary",
  name: "Definition of supplementary angles",
  kind: "definition",
  short: "Two angles are supplementary when their measures total 180°.",
  cites: [1, 1],
  check(c, p, ctx) {
    const pair =
      c.k === "supp"
        ? [c.a, c.b]
        : isEq(c)
          ? (() => {
              const angs = distinctObjs(collectMeas(c));
              return angs.length === 2 ? angs : undefined;
            })()
          : undefined;
    if (!pair) return no("This definition relates a supplementary pair to a sum of 180°.");
    const [a, b] = pair as [AngId, AngId];
    return biconditional(
      { k: "supp", a, b },
      { k: "eq", l: sum(m(a), m(b)), r: n(180) },
      c,
      p,
      ctx,
    );
  },
});

R({
  id: "def-complementary",
  name: "Definition of complementary angles",
  kind: "definition",
  short: "Two angles are complementary when their measures total 90°.",
  cites: [1, 1],
  check(c, p, ctx) {
    const pair =
      c.k === "comp"
        ? [c.a, c.b]
        : isEq(c)
          ? (() => {
              const angs = distinctObjs(collectMeas(c));
              return angs.length === 2 ? angs : undefined;
            })()
          : undefined;
    if (!pair) return no("This definition relates a complementary pair to a sum of 90°.");
    const [a, b] = pair as [AngId, AngId];
    return biconditional(
      { k: "comp", a, b },
      { k: "eq", l: sum(m(a), m(b)), r: n(90) },
      c,
      p,
      ctx,
    );
  },
});

R({
  id: "def-right-angle",
  name: "Definition of a right angle",
  kind: "definition",
  short: "A right angle measures exactly 90°.",
  cites: [1, 1],
  check(c, p, ctx) {
    const a =
      c.k === "angleClass" && c.cls === "right"
        ? c.ang
        : isEq(c) && c.l.k === "meas" && c.r.k === "num" && c.r.v === 90
          ? c.l.ang
          : undefined;
    if (!a) return no("This definition relates “∠A is a right angle” to m∠A = 90.");
    return biconditional(
      { k: "angleClass", ang: a, cls: "right" },
      { k: "eq", l: m(a), r: n(90) },
      c,
      p,
      ctx,
    );
  },
});

R({
  id: "def-straight-angle",
  name: "Definition of a straight angle",
  kind: "definition",
  short: "A straight angle measures exactly 180°.",
  cites: [1, 1],
  check(c, p, ctx) {
    const a =
      c.k === "angleClass" && c.cls === "straight"
        ? c.ang
        : isEq(c) && c.l.k === "meas" && c.r.k === "num" && c.r.v === 180
          ? c.l.ang
          : undefined;
    if (!a) return no("This definition relates “∠A is a straight angle” to m∠A = 180.");
    return biconditional(
      { k: "angleClass", ang: a, cls: "straight" },
      { k: "eq", l: m(a), r: n(180) },
      c,
      p,
      ctx,
    );
  },
});

R({
  id: "def-linear-pair",
  name: "Definition of a linear pair",
  kind: "definition",
  short: "Adjacent angles whose outer sides form a straight line.",
  cites: [0, 1],
  check(c, _p, ctx) {
    if (c.k !== "linearPair")
      return no("Use this to state that two angles form a linear pair.");
    if (ctx.board && marked(ctx.board, c)) return OK;
    if (ctx.givens.some((g) => sameStatement(g, c))) return OK;
    return no("The figure does not show those two angles as a linear pair.");
  },
});

R({
  id: "def-vertical",
  name: "Definition of vertical angles",
  kind: "definition",
  short: "Two angles whose sides form two pairs of opposite rays.",
  cites: [0, 1],
  check(c, _p, ctx) {
    if (c.k !== "vertical")
      return no("Use this to state that two angles are vertical angles.");
    if (ctx.board && marked(ctx.board, c)) return OK;
    if (ctx.givens.some((g) => sameStatement(g, c))) return OK;
    return no("Those two angles are not opposite each other at a crossing.");
  },
});

R({
  id: "def-adjacent",
  name: "Definition of adjacent angles",
  kind: "definition",
  short: "Angles that share a vertex and a side and do not overlap.",
  cites: [0, 1],
  check(c, _p, ctx) {
    if (c.k !== "adjacent")
      return no("Use this to state that two angles are adjacent.");
    if (ctx.board && marked(ctx.board, c)) return OK;
    if (ctx.givens.some((g) => sameStatement(g, c))) return OK;
    return no("Those two angles do not share a vertex and a side.");
  },
});

R({
  id: "def-between",
  name: "Definition of betweenness",
  kind: "definition",
  short: "B is between A and C when all three are collinear and B lies on AC.",
  cites: [0, 1],
  check(c, _p, ctx) {
    if (c.k !== "between" && c.k !== "collinear")
      return no("Use this for a betweenness or collinearity statement.");
    if (ctx.board && marked(ctx.board, c)) return OK;
    if (ctx.givens.some((g) => sameStatement(g, c))) return OK;
    return no("The figure does not place those points that way.");
  },
});

R({
  id: "def-perpendicular",
  name: "Definition of perpendicular lines",
  kind: "definition",
  short: "Perpendicular lines meet at right angles.",
  cites: [1, 1],
  check(c, p, ctx) {
    if (c.k === "angleClass" && c.cls === "right") {
      if ([...p, ...ctx.givens].some((s) => s.k === "perp")) return OK;
      return no("Cite the line stating the perpendicularity.");
    }
    if (c.k === "perp") {
      if ([...p, ...ctx.givens].some((s) => s.k === "angleClass" && s.cls === "right"))
        return OK;
      return no("Cite a right angle at the intersection.");
    }
    return no("This definition moves between ⊥ and a 90° angle.");
  },
});

// ---------------------------------------------------------------------------
// Postulates
// ---------------------------------------------------------------------------

R({
  id: "segment-addition",
  name: "Segment Addition Postulate",
  kind: "postulate",
  short: "If B is between A and C, then AB + BC = AC.",
  cites: [0, 1],
  check(c, p, ctx) {
    if (!isEq(c)) return no("This postulate produces an equation about lengths.");
    const segs = distinctObjs(collectLen(c));
    if (segs.length !== 3)
      return no(
        "The step should name exactly three segments: two parts and the whole.",
      );
    for (const wholeIdx of [0, 1, 2]) {
      const whole = segs[wholeIdx];
      const parts = segs.filter((_, i) => i !== wholeIdx);
      const shape = polyPlus(
        polyPlus(toPoly({ k: "len", seg: parts[0] }), toPoly({ k: "len", seg: parts[1] })),
        toPoly({ k: "len", seg: whole }),
        -1,
      );
      const d = diff(c);
      if (!polyEqual(d, shape) && !polyEqual(d, polyScale(shape, -1))) continue;
      // Identify the shared middle point.
      const ends = [parts[0].a, parts[0].b].filter((x) =>
        [parts[1].a, parts[1].b].includes(x),
      );
      if (ends.length !== 1) continue;
      const mid = ends[0];
      const outer = [parts[0], parts[1]].flatMap((s) =>
        [s.a, s.b].filter((x) => x !== mid),
      );
      if (
        !(
          (outer[0] === whole.a && outer[1] === whole.b) ||
          (outer[0] === whole.b && outer[1] === whole.a)
        )
      )
        continue;
      const bet: Statement = { k: "between", p: mid, a: whole.a, c: whole.b };
      if (
        ctx.givens.some((g) => sameStatement(g, bet)) ||
        p.some((s) => sameStatement(s, bet)) ||
        (ctx.board && isBetween(ctx.board, mid, whole.a, whole.b))
      )
        return OK;
      return no(
        mid + " must be between " + whole.a + " and " + whole.b +
          ". Betweenness is the hidden condition on this postulate.",
      );
    }
    return no(
      "The parts must add to the whole: two segments sharing an endpoint, summing to the segment across both.",
    );
  },
});

R({
  id: "angle-addition",
  name: "Angle Addition Postulate",
  kind: "postulate",
  short: "If P is in the interior of ∠ABC, then m∠ABP + m∠PBC = m∠ABC.",
  cites: [0, 1],
  check(c, p, ctx) {
    if (!isEq(c)) return no("This postulate produces an equation about measures.");
    const angs = distinctObjs(collectMeas(c));
    if (angs.length !== 3)
      return no("The step should name exactly three angles: two parts and the whole.");
    for (const wholeIdx of [0, 1, 2]) {
      const whole = angs[wholeIdx];
      const parts = angs.filter((_, i) => i !== wholeIdx);
      const shape = polyPlus(
        polyPlus(toPoly(m(parts[0])), toPoly(m(parts[1]))),
        toPoly(m(whole)),
        -1,
      );
      const d = diff(c);
      if (!polyEqual(d, shape) && !polyEqual(d, polyScale(shape, -1))) continue;
      const W = splitLabels(whole.name),
        A = splitLabels(parts[0].name),
        B = splitLabels(parts[1].name);
      if (W.length === 3 && A.length === 3 && B.length === 3) {
        const v = W[1];
        if (A[1] !== v || B[1] !== v) continue;
        const shared = [A[0], A[2]].filter((x) => [B[0], B[2]].includes(x));
        if (shared.length !== 1) continue;
        const ray = shared[0];
        const outer = [
          [A[0], A[2]].find((x) => x !== ray)!,
          [B[0], B[2]].find((x) => x !== ray)!,
        ];
        if (
          !(
            (outer[0] === W[0] && outer[1] === W[2]) ||
            (outer[0] === W[2] && outer[1] === W[0])
          )
        )
          continue;
        const inter: Statement = { k: "interior", p: ray, ang: whole };
        if (
          ctx.givens.some((g) => sameStatement(g, inter)) ||
          p.some((s) => sameStatement(s, inter)) ||
          (ctx.board && isInterior(ctx.board, ray, whole))
        )
          return OK;
        return no(
          "Ray " + v + ray + " must lie in the interior of ∠" + whole.name + ".",
        );
      }
      // Numbered angles cannot be checked by name; fall back to the figure.
      if (ctx.board) {
        const ok = holds(ctx.board, c);
        if (ok) return OK;
        return no("Those three angles do not add up in this figure.");
      }
      return no("Name the angles by three points so the shared ray is visible.");
    }
    return no(
      "The parts must add to the whole: two angles sharing a ray, summing to the angle across both.",
    );
  },
});

R({
  id: "angles-around-point",
  name: "Angles around a point",
  kind: "postulate",
  short: "Angles taken once around a point total 360°.",
  cites: [0, 1],
  check(c, _p, ctx) {
    if (!isEq(c)) return no("This produces an equation summing to 360.");
    const d = diff(c);
    const angs = distinctObjs(collectMeas(c));
    if (angs.length < 2) return no("Name the angles that go once around the point.");
    const want = polyPlus(
      angs.reduce(
        (acc, a) => polyPlus(acc, toPoly(m(a))),
        new Map<string, number>(),
      ),
      toPoly(n(360)),
      -1,
    );
    if (polyEqual(d, want) || polyEqual(d, polyScale(want, -1))) return OK;
    return no("The named angles must sum to exactly 360.");
  },
});

// ---------------------------------------------------------------------------
// Theorems
// ---------------------------------------------------------------------------

R({
  id: "linear-pair-theorem",
  name: "Linear Pair Theorem",
  kind: "theorem",
  short: "If two angles form a linear pair, they are supplementary.",
  cites: [1, 1],
  check(c, p, ctx) {
    const pair = anglePair(c) ??
      (isEq(c) ? (distinctObjs(collectMeas(c)) as AngId[]) : undefined);
    if (!pair || pair.length !== 2)
      return no("Name the two angles of the linear pair.");
    const [a, b] = pair;
    const lp: Statement = { k: "linearPair", a, b };
    if (!known(lp, ctx, p))
      return no("First establish that ∠" + a.name + " and ∠" + b.name + " form a linear pair.");
    if (c.k === "supp") return OK;
    const eq180: Statement = { k: "eq", l: sum(m(a), m(b)), r: n(180) };
    if (sameStatement(c, eq180) || isFlip(c, eq180)) return OK;
    return no(
      "The theorem concludes that they are supplementary, or that m∠" + a.name +
        " + m∠" + b.name + " = 180.",
    );
  },
});

R({
  id: "vertical-angles-theorem",
  name: "Vertical Angles Theorem",
  kind: "theorem",
  short: "Vertical angles are congruent.",
  cites: [1, 1],
  check(c, p, ctx) {
    const pair = anglePair(c) ??
      (isEq(c) ? (distinctObjs(collectMeas(c)) as AngId[]) : undefined);
    if (!pair || pair.length !== 2)
      return no("Name the two vertical angles.");
    const [a, b] = pair;
    const v: Statement = { k: "vertical", a, b };
    if (!known(v, ctx, p))
      return no("First establish that ∠" + a.name + " and ∠" + b.name + " are vertical angles.");
    if (congOrMeasure(c, a, b)) return OK;
    return no("The theorem concludes ∠" + a.name + " ≅ ∠" + b.name + ".");
  },
});

function sharedSupplement(
  premises: Statement[],
  ctx: Ctx,
  kind: "supp" | "comp",
  a: AngId,
  b: AngId,
): Check {
  const pool = [...premises, ...ctx.givens].filter((s) => s.k === kind) as
    Extract<Statement, { k: "supp" | "comp" }>[];
  const partners = (x: AngId) =>
    pool
      .filter((s) => sameObj(s.a, x) || sameObj(s.b, x))
      .map((s) => (sameObj(s.a, x) ? s.b : s.a));
  const pa = partners(a),
    pb = partners(b);
  if (!pa.length || !pb.length)
    return no(
      "Each angle needs a line stating it is " +
        (kind === "supp" ? "supplementary" : "complementary") + " to something.",
    );
  for (const x of pa)
    for (const y of pb) {
      if (sameObj(x, y)) return OK;
      const congruent: Statement = { k: "cong", l: x, r: y };
      if (
        [...premises, ...ctx.givens].some(
          (s) => sameStatement(s, congruent) || isFlip(s, congruent),
        )
      )
        return OK;
    }
  return no(
    "The two angles must be " +
      (kind === "supp" ? "supplements" : "complements") +
      " of the same angle, or of congruent angles.",
  );
}

R({
  id: "congruent-supplements",
  name: "Congruent Supplements Theorem",
  kind: "theorem",
  short:
    "Angles supplementary to the same angle, or to congruent angles, are congruent.",
  cites: [2, 3],
  check(c, p, ctx) {
    const pair = anglePair(c);
    if (!pair) return no("The conclusion is a congruence between two angles.");
    if (c.k !== "cong" && !congOrMeasure(c, pair[0], pair[1]))
      return no("The conclusion is a congruence between two angles.");
    return sharedSupplement(p, ctx, "supp", pair[0], pair[1]);
  },
});

R({
  id: "congruent-complements",
  name: "Congruent Complements Theorem",
  kind: "theorem",
  short:
    "Angles complementary to the same angle, or to congruent angles, are congruent.",
  cites: [2, 3],
  check(c, p, ctx) {
    const pair = anglePair(c);
    if (!pair) return no("The conclusion is a congruence between two angles.");
    if (c.k !== "cong" && !congOrMeasure(c, pair[0], pair[1]))
      return no("The conclusion is a congruence between two angles.");
    return sharedSupplement(p, ctx, "comp", pair[0], pair[1]);
  },
});

R({
  id: "right-angle-congruence",
  name: "Right Angle Congruence Theorem",
  kind: "theorem",
  short: "All right angles are congruent.",
  cites: [2, 2],
  check(c, p, ctx) {
    const pair = anglePair(c);
    if (!pair || !congOrMeasure(c, pair[0], pair[1]))
      return no("The conclusion is a congruence between two right angles.");
    const isRight = (x: AngId) =>
      [...p, ...ctx.givens].some(
        (s) => s.k === "angleClass" && s.cls === "right" && sameObj(s.ang, x),
      ) ||
      [...p, ...ctx.givens].some(
        (s) =>
          isEq(s) && s.l.k === "meas" && sameObj(s.l.ang, x) &&
          s.r.k === "num" && s.r.v === 90,
      );
    if (isRight(pair[0]) && isRight(pair[1])) return OK;
    return no("Both angles must first be established as right angles.");
  },
});

// ---------------------------------------------------------------------------
// Properties of equality
// ---------------------------------------------------------------------------

R({
  id: "reflexive",
  name: "Reflexive Property",
  kind: "property",
  short: "a = a. A shared part equals itself.",
  cites: [0, 0],
  check(c) {
    if (isEq(c)) {
      if (isZero(diff(c))) return OK;
      return no("Both sides of a reflexive step must be the same quantity.");
    }
    if (c.k === "cong" && sameObj(c.l, c.r)) return OK;
    return no("The reflexive property states that a quantity equals itself.");
  },
});

R({
  id: "symmetric",
  name: "Symmetric Property",
  kind: "property",
  short: "If a = b then b = a.",
  cites: [1, 1],
  check(c, p) {
    if (p.length !== 1) return no("Cite the one line being reversed.");
    if (isFlip(p[0], c)) return OK;
    if (sameStatement(p[0], c))
      return no("That line is unchanged. The symmetric property swaps the two sides.");
    return no("The conclusion must be the cited line with its sides exchanged.");
  },
});

R({
  id: "transitive",
  name: "Transitive Property",
  kind: "property",
  short: "If a = b and b = c, then a = c.",
  cites: [2, 2],
  check(c, p) {
    if (p.length !== 2) return no("The transitive property chains exactly two lines.");
    if (c.k === "cong") {
      const [x, y] = p;
      if (x.k !== "cong" || y.k !== "cong")
        return no("Both cited lines must be congruences.");
      const ends = [x.l, x.r],
        other = [y.l, y.r];
      const hinge = ends.find((e) => other.some((o) => sameObj(e, o)));
      if (!hinge) return no("The two lines must share a middle term.");
      const a = ends.find((e) => !sameObj(e, hinge))!,
        b = other.find((o) => !sameObj(o, hinge))!;
      const want: Statement = { k: "cong", l: a, r: b };
      if (sameStatement(c, want)) return OK;
      return no("Chaining through " + objText(hinge) + " gives " + statementText(want) + ".");
    }
    if (!isEq(c)) return no("The conclusion must be an equality or congruence.");
    const [x, y] = p;
    if (!isEq(x) || !isEq(y)) return no("Both cited lines must be equations.");
    const sidesX = [toPoly(x.l), toPoly(x.r)],
      sidesY = [toPoly(y.l), toPoly(y.r)];
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++) {
        if (!polyEqual(sidesX[i], sidesY[j])) continue;
        const a = sidesX[1 - i],
          b = sidesY[1 - j];
        const cl = toPoly(c.l),
          cr = toPoly(c.r);
        if (
          (polyEqual(cl, a) && polyEqual(cr, b)) ||
          (polyEqual(cl, b) && polyEqual(cr, a))
        )
          return OK;
      }
    return no(
      "The two lines must share a middle term, and the conclusion must be the two outer terms.",
    );
  },
});

function objText(o: ObjId) {
  return o.k === "ang" ? "∠" + o.name : o.k === "seg" ? o.a + o.b : objKey(o);
}

function operationProperty(sign: 1 | -1): Reason["check"] {
  const word = sign === 1 ? "added" : "subtracted";
  return (c, p) => {
    const eqs = p.filter(isEq);
    if (!isEq(c) || !eqs.length)
      return no("Cite the equation being changed, and conclude an equation.");
    // A reflexive line is often cited alongside the base equation, as in the
    // reference's Fig. 5; try each cited equation as the base.
    let wrongDirection = false;
    for (const base of eqs) {
      const dl = polyPlus(toPoly(c.l), toPoly(base.l), -1),
        dr = polyPlus(toPoly(c.r), toPoly(base.r), -1);
      if (!polyEqual(dl, dr) || isZero(dl)) continue;
      const coeffs = [...dl.values()];
      const allPos = coeffs.every((v) => v > 0),
        allNeg = coeffs.every((v) => v < 0);
      if (sign === 1 && allNeg) {
        wrongDirection = true;
        continue;
      }
      if (sign === -1 && allPos) {
        wrongDirection = true;
        continue;
      }
      return OK;
    }
    if (wrongDirection)
      return no(
        sign === 1
          ? "That step subtracts from both sides — use the Subtraction Property of Equality."
          : "That step adds to both sides — use the Addition Property of Equality.",
      );
    return no(
      "The same quantity must be " + word + " on both sides of one cited equation.",
    );
  };
}

R({
  id: "addition-property",
  name: "Addition Property of Equality",
  kind: "property",
  short: "If a = b then a + c = b + c.",
  cites: [1, 2],
  check: operationProperty(1),
});

R({
  id: "subtraction-property",
  name: "Subtraction Property of Equality",
  kind: "property",
  short: "If a = b then a − c = b − c.",
  cites: [1, 2],
  check: operationProperty(-1),
});

function scalingProperty(wantDivision: boolean): Reason["check"] {
  return (c, p) => {
    if (!isEq(c) || p.length !== 1 || !isEq(p[0]))
      return no("Cite the one equation being scaled, and conclude an equation.");
    const kl = scalarMultiple(toPoly(c.l), toPoly(p[0].l)),
      kr = scalarMultiple(toPoly(c.r), toPoly(p[0].r));
    const k = kl ?? kr;
    if (k === undefined || (kl !== undefined && kr !== undefined && Math.abs(kl - kr) > 1e-9))
      return no("Both sides must be multiplied or divided by the same nonzero number.");
    if (Math.abs(k - 1) < 1e-9) return no("Nothing was scaled.");
    const isDivision = Math.abs(k) < 1;
    if (wantDivision && !isDivision)
      return no("That step multiplies both sides — use the Multiplication Property of Equality.");
    if (!wantDivision && isDivision)
      return no("That step divides both sides — use the Division Property of Equality.");
    return OK;
  };
}

R({
  id: "multiplication-property",
  name: "Multiplication Property of Equality",
  kind: "property",
  short: "If a = b then ac = bc.",
  cites: [1, 1],
  check: scalingProperty(false),
});

R({
  id: "division-property",
  name: "Division Property of Equality",
  kind: "property",
  short: "If a = b then a/c = b/c, for c ≠ 0.",
  cites: [1, 1],
  check: scalingProperty(true),
});

R({
  id: "substitution",
  name: "Substitution Property",
  kind: "property",
  short: "If a = b, then a may replace b anywhere it appears.",
  cites: [2, 4],
  check(c, p) {
    if (!isEq(c)) return no("Substitution produces an equation.");
    const eqs = p.filter(isEq);
    if (eqs.length < 2)
      return no(
        "Substitution combines at least two earlier lines: one supplying an equal quantity, and one to put it into.",
      );
    const coeffs = inSpan(diff(c), eqs.map(diff));
    if (!coeffs)
      return no(
        "This does not follow from the cited lines. Check that the quantity you replaced really is equal to what you put in its place.",
      );
    const used = coeffs.filter((v) => Math.abs(v) > 1e-7).length;
    if (used < 2)
      return no(
        "Only one of the cited lines was actually used. A step that rewrites a single line is the addition, subtraction, multiplication or division property, or Simplify.",
      );
    return OK;
  },
});

R({
  id: "distributive",
  name: "Distributive Property",
  kind: "property",
  short: "a(b + c) = ab + ac.",
  cites: [1, 1],
  check(c, p) {
    if (!isEq(c) || p.length !== 1 || !isEq(p[0]))
      return no("Cite the one equation whose parentheses are being cleared.");
    if (!polyEqual(toPoly(c.l), toPoly(p[0].l)) || !polyEqual(toPoly(c.r), toPoly(p[0].r)))
      return no("Distributing must not change either side's value.");
    if (sameStatement(c, p[0]) && !formDiffers(c, p[0]))
      return no("Nothing changed.");
    const before = hasDistributable(p[0].l) || hasDistributable(p[0].r),
      after = hasDistributable(c.l) || hasDistributable(c.r);
    if (before && !after) return OK;
    if (!before && after) return { ok: true, note: "Factoring, the reverse direction." };
    return no(
      "This step does not clear or introduce parentheses. If you combined like terms, use Simplify.",
    );
  },
});

function formDiffers(a: Statement, b: Statement) {
  return statementText(a) !== statementText(b);
}

R({
  id: "simplify",
  name: "Simplify",
  kind: "algebra",
  short: "Combine like terms or carry out arithmetic.",
  cites: [1, 1],
  check(c, p) {
    if (!isEq(c) || p.length !== 1 || !isEq(p[0]))
      return no("Cite the one equation being simplified.");
    if (!polyEqual(toPoly(c.l), toPoly(p[0].l)) || !polyEqual(toPoly(c.r), toPoly(p[0].r)))
      return no("Simplifying must not change either side's value.");
    if (!formDiffers(c, p[0])) return no("Nothing changed.");
    return OK;
  },
});

export const REASONS = ALL;
export const reasonById = (id: string) => ALL.find((r) => r.id === id);
export const reasonsByKind = (k: ReasonKind) => ALL.filter((r) => r.kind === k);

export const KIND_LABEL: Record<ReasonKind, string> = {
  given: "Given",
  definition: "Definitions",
  postulate: "Postulates",
  theorem: "Theorems",
  property: "Properties of equality",
  algebra: "Algebra",
};
