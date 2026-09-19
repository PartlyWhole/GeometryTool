// Symbolic statements for the practice modes.
//
// References are by point label ("AB", "ABC"), the way the Module 2 reference
// writes them, rather than by board UUID. Exercises are authored around named
// figures, so labels are the natural identity here; `oracle.ts` resolves a
// label reference against a Board when geometry actually has to be checked.

export type SegId = { k: "seg"; a: string; b: string };
export type AngId = { k: "ang"; name: string };
export type PtId = { k: "pt"; p: string };
export type RayId = { k: "ray"; from: string; through: string };
export type LineId = { k: "line"; a: string; b: string };
export type ObjId = SegId | AngId | PtId | RayId | LineId;

export const seg = (a: string, b: string): SegId => ({ k: "seg", a, b });
export const ang = (name: string): AngId => ({ k: "ang", name });
export const pt = (p: string): PtId => ({ k: "pt", p });
export const ray = (from: string, through: string): RayId => ({
  k: "ray",
  from,
  through,
});
export const line = (a: string, b: string): LineId => ({ k: "line", a, b });

// A segment or line may be named in either order; a ray may not, because its
// first letter is the endpoint (reference Fig. 6).
export function objKey(o: ObjId): string {
  switch (o.k) {
    case "seg":
      return "seg:" + [o.a, o.b].sort().join("");
    case "line":
      return "line:" + [o.a, o.b].sort().join("");
    case "ray":
      return "ray:" + o.from + o.through;
    case "pt":
      return "pt:" + o.p;
    case "ang":
      return "ang:" + angCanonical(o.name);
  }
}

// "ABC" and "CBA" name the same angle; "1" and "ABC" are both legal names.
export function angCanonical(name: string): string {
  const parts = splitLabels(name);
  if (parts.length !== 3) return name;
  const [a, v, c] = parts;
  return a <= c ? a + v + c : c + v + a;
}

// Labels are letters optionally followed by digits ("A", "B2", "X").
export function splitLabels(name: string): string[] {
  return name.match(/[A-Za-z][0-9]*/g) ?? [];
}

export const sameObj = (a: ObjId, b: ObjId) => objKey(a) === objKey(b);

export type Term =
  | { k: "num"; v: number }
  | { k: "var"; name: string }
  | { k: "len"; seg: SegId }
  | { k: "meas"; ang: AngId }
  | { k: "add"; ts: Term[] }
  | { k: "mul"; ts: Term[] }
  | { k: "neg"; t: Term }
  | { k: "div"; n: Term; d: Term };

export const num = (v: number): Term => ({ k: "num", v });
export const vr = (name: string): Term => ({ k: "var", name });
export const len = (a: string, b: string): Term => ({ k: "len", seg: seg(a, b) });
export const meas = (name: string): Term => ({ k: "meas", ang: ang(name) });
export const add = (...ts: Term[]): Term => ({ k: "add", ts });
export const mul = (...ts: Term[]): Term => ({ k: "mul", ts });
export const neg = (t: Term): Term => ({ k: "neg", t });
export const div = (n: Term, d: Term): Term => ({ k: "div", n, d });

export type AngleClass = "acute" | "right" | "obtuse" | "straight";

export type Statement =
  | { k: "eq"; l: Term; r: Term }
  | { k: "cong"; l: ObjId; r: ObjId }
  | { k: "supp"; a: AngId; b: AngId }
  | { k: "comp"; a: AngId; b: AngId }
  | { k: "vertical"; a: AngId; b: AngId }
  | { k: "linearPair"; a: AngId; b: AngId }
  | { k: "adjacent"; a: AngId; b: AngId }
  | { k: "perp"; a: ObjId; b: ObjId }
  | { k: "parallel"; a: ObjId; b: ObjId }
  | { k: "midpoint"; p: string; seg: SegId }
  | { k: "bisects"; by: ObjId; of: ObjId }
  | { k: "between"; p: string; a: string; c: string }
  | { k: "collinear"; pts: string[] }
  | { k: "interior"; p: string; ang: AngId }
  | { k: "angleClass"; ang: AngId; cls: AngleClass };

// ---------------------------------------------------------------------------
// Polynomial normal form
//
// Every term flattens to a map from a monomial key to a coefficient. This makes
// commutativity, associativity and like-term collection automatic, so
// "AB + BC" and "BC + AB" compare equal without any rewriting rules.
// ---------------------------------------------------------------------------

export type Poly = Map<string, number>;
export const EPS = 1e-9;

const CONST = "";

function atom(t: Term): string {
  switch (t.k) {
    case "var":
      return "v|" + t.name;
    case "len":
      return "l|" + objKey(t.seg);
    case "meas":
      return "m|" + objKey(t.ang);
    default:
      // A quotient by a non-constant is opaque; treat the whole thing as one
      // symbol so it can still cancel against an identical copy of itself.
      return "o|" + JSON.stringify(t);
  }
}

function monomial(keys: string[]): string {
  return keys.slice().sort().join("*");
}

function polyAdd(a: Poly, b: Poly, scale = 1): Poly {
  const out = new Map(a);
  for (const [k, v] of b) out.set(k, (out.get(k) ?? 0) + v * scale);
  return trim(out);
}

function polyMul(a: Poly, b: Poly): Poly {
  const out: Poly = new Map();
  for (const [ka, va] of a)
    for (const [kb, vb] of b) {
      const key = monomial(
        [...(ka ? ka.split("*") : []), ...(kb ? kb.split("*") : [])],
      );
      out.set(key, (out.get(key) ?? 0) + va * vb);
    }
  return trim(out);
}

export function polyScale(a: Poly, s: number): Poly {
  const out: Poly = new Map();
  for (const [k, v] of a) out.set(k, v * s);
  return trim(out);
}

function trim(p: Poly): Poly {
  for (const [k, v] of [...p]) if (Math.abs(v) < EPS) p.delete(k);
  return p;
}

const constPoly = (v: number): Poly =>
  Math.abs(v) < EPS ? new Map() : new Map([[CONST, v]]);

export function toPoly(t: Term): Poly {
  switch (t.k) {
    case "num":
      return constPoly(t.v);
    case "var":
    case "len":
    case "meas":
      return new Map([[atom(t), 1]]);
    case "add":
      return t.ts.reduce<Poly>((acc, x) => polyAdd(acc, toPoly(x)), new Map());
    case "mul":
      return t.ts.reduce<Poly>(
        (acc, x) => polyMul(acc, toPoly(x)),
        constPoly(1),
      );
    case "neg":
      return polyScale(toPoly(t.t), -1);
    case "div": {
      const d = toPoly(t.d);
      const only = [...d];
      if (only.length === 1 && only[0][0] === CONST)
        return polyScale(toPoly(t.n), 1 / only[0][1]);
      return new Map([[atom(t), 1]]);
    }
  }
}

/** a + scale·b */
export const polyPlus = (a: Poly, b: Poly, scale = 1): Poly =>
  polyAdd(a, b, scale);

export const polyEqual = (a: Poly, b: Poly) => {
  const d = polyAdd(a, b, -1);
  return d.size === 0;
};

export const isZero = (p: Poly) => trim(new Map(p)).size === 0;

/** The polynomial `left - right`, the canonical content of an equation. */
export const diff = (s: { l: Term; r: Term }) =>
  polyAdd(toPoly(s.l), toPoly(s.r), -1);

/**
 * If `a` is a nonzero scalar multiple of `b`, return that scalar.
 * Used to recognise the multiplication and division properties of equality.
 */
export function scalarMultiple(a: Poly, b: Poly): number | undefined {
  if (isZero(b)) return undefined;
  const key = [...b.keys()][0];
  const av = a.get(key);
  if (av === undefined || Math.abs(av) < EPS) return undefined;
  const s = av / b.get(key)!;
  return polyEqual(a, polyScale(b, s)) ? s : undefined;
}

/**
 * Solve `target = Σ cᵢ·basisᵢ` over the space of monomials, by Gaussian
 * elimination. Returns the coefficients, or undefined when the target is not
 * in the span.
 *
 * This is the exact test for whether a conclusion follows from earlier
 * equations by combining them: if every basis polynomial is zero, so is any
 * linear combination of them.
 */
export function inSpan(target: Poly, basis: Poly[]): number[] | undefined {
  const keys = [...new Set([target, ...basis].flatMap((p) => [...p.keys()]))];
  if (!keys.length) return basis.map(() => 0);
  // Rows are monomials, columns are basis polynomials, augmented with target.
  const rows = keys.map((k) => [
    ...basis.map((b) => b.get(k) ?? 0),
    target.get(k) ?? 0,
  ]);
  const ncol = basis.length;
  const pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < ncol && r < rows.length; c++) {
    let best = -1,
      mag = EPS;
    for (let i = r; i < rows.length; i++)
      if (Math.abs(rows[i][c]) > mag) (mag = Math.abs(rows[i][c])), (best = i);
    if (best < 0) continue;
    [rows[r], rows[best]] = [rows[best], rows[r]];
    const pv = rows[r][c];
    for (let j = c; j <= ncol; j++) rows[r][j] /= pv;
    for (let i = 0; i < rows.length; i++) {
      if (i === r || Math.abs(rows[i][c]) < EPS) continue;
      const f = rows[i][c];
      for (let j = c; j <= ncol; j++) rows[i][j] -= f * rows[r][j];
    }
    pivots.push(c);
    r++;
  }
  // An all-zero row with a nonzero target entry means no solution.
  for (const row of rows)
    if (row.slice(0, ncol).every((v) => Math.abs(v) < EPS) &&
        Math.abs(row[ncol]) > 1e-7)
      return undefined;
  const out = new Array(ncol).fill(0);
  pivots.forEach((c, i) => (out[c] = rows[i][ncol]));
  return out;
}

// ---------------------------------------------------------------------------
// Statement identity
// ---------------------------------------------------------------------------

/**
 * Structural key for a statement. Equations keep their orientation, so that the
 * symmetric property stays a real step rather than a no-op, but each side is
 * normalised so "x + 3" and "3 + x" are the same side.
 */
export function statementKey(s: Statement): string {
  const P = (p: Poly) =>
    [...p]
      .sort((x, y) => (x[0] < y[0] ? -1 : 1))
      .map(([k, v]) => k + "#" + round(v))
      .join(",");
  switch (s.k) {
    case "eq":
      return "eq:" + P(toPoly(s.l)) + "=" + P(toPoly(s.r));
    case "cong":
      return "cong:" + [objKey(s.l), objKey(s.r)].sort().join("~");
    case "supp":
    case "comp":
    case "vertical":
    case "linearPair":
    case "adjacent":
      return s.k + ":" + [objKey(s.a), objKey(s.b)].sort().join("~");
    case "perp":
    case "parallel":
      return s.k + ":" + [objKey(s.a), objKey(s.b)].sort().join("~");
    case "midpoint":
      return "midpoint:" + s.p + "@" + objKey(s.seg);
    case "bisects":
      return "bisects:" + objKey(s.by) + "@" + objKey(s.of);
    case "between":
      return "between:" + s.p + "@" + [s.a, s.c].sort().join("");
    case "collinear":
      return "collinear:" + s.pts.slice().sort().join("");
    case "interior":
      return "interior:" + s.p + "@" + objKey(s.ang);
    case "angleClass":
      return "class:" + objKey(s.ang) + ":" + s.cls;
  }
}

const round = (v: number) => (Math.abs(v) < EPS ? 0 : Number(v.toFixed(9)));

export const sameStatement = (a: Statement, b: Statement) =>
  statementKey(a) === statementKey(b);

/** Equations that differ only by which side is written first. */
export function isFlip(a: Statement, b: Statement): boolean {
  if (a.k === "eq" && b.k === "eq")
    return (
      polyEqual(toPoly(a.l), toPoly(b.r)) && polyEqual(toPoly(a.r), toPoly(b.l))
    );
  if (a.k === "cong" && b.k === "cong")
    return sameObj(a.l, b.r) && sameObj(a.r, b.l);
  return false;
}

/**
 * Does a student's statement say the same thing as one of the accepted
 * answers? Equations count as equal when one is a nonzero multiple of the
 * other, so "AB + BC = AC", "AC = AB + BC" and "AB = AC - BC" all pass.
 */
export function matchesAccepted(
  student: Statement,
  accepted: Statement[],
): boolean {
  for (const a of accepted) {
    if (sameStatement(student, a) || isFlip(student, a)) return true;
    if (student.k === "eq" && a.k === "eq") {
      const k = scalarMultiple(diff(student), diff(a));
      if (k !== undefined && Math.abs(k) > 1e-9) return true;
    }
  }
  return false;
}

/** Every object mentioned by a statement, for highlighting it on a figure. */
export function statementObjects(s: Statement): ObjId[] {
  const out: ObjId[] = [];
  const walk = (t: Term) => {
    switch (t.k) {
      case "len":
        out.push(t.seg);
        break;
      case "meas":
        out.push(t.ang);
        break;
      case "add":
      case "mul":
        t.ts.forEach(walk);
        break;
      case "neg":
        walk(t.t);
        break;
      case "div":
        walk(t.n), walk(t.d);
        break;
    }
  };
  switch (s.k) {
    case "eq":
      walk(s.l), walk(s.r);
      break;
    case "cong":
      out.push(s.l, s.r);
      break;
    case "perp":
    case "parallel":
      out.push(s.a, s.b);
      break;
    case "supp":
    case "comp":
    case "vertical":
    case "linearPair":
    case "adjacent":
      out.push(s.a, s.b);
      break;
    case "midpoint":
      out.push(pt(s.p), s.seg);
      break;
    case "bisects":
      out.push(s.by, s.of);
      break;
    case "between":
      out.push(pt(s.p), pt(s.a), pt(s.c));
      break;
    case "collinear":
      s.pts.forEach((p) => out.push(pt(p)));
      break;
    case "interior":
      out.push(pt(s.p), s.ang);
      break;
    case "angleClass":
      out.push(s.ang);
      break;
  }
  return out.filter(Boolean) as ObjId[];
}

/** Every segment named by a statement's terms, in order of appearance. */
export function collectLen(s: Statement): SegId[] {
  const out: SegId[] = [];
  const walk = (t: Term) => {
    if (t.k === "len") out.push(t.seg);
    else if (t.k === "add" || t.k === "mul") t.ts.forEach(walk);
    else if (t.k === "neg") walk(t.t);
    else if (t.k === "div") walk(t.n), walk(t.d);
  };
  if (s.k === "eq") walk(s.l), walk(s.r);
  return out;
}

/** Every angle named by a statement's terms, in order of appearance. */
export function collectMeas(s: Statement): AngId[] {
  const out: AngId[] = [];
  const walk = (t: Term) => {
    if (t.k === "meas") out.push(t.ang);
    else if (t.k === "add" || t.k === "mul") t.ts.forEach(walk);
    else if (t.k === "neg") walk(t.t);
    else if (t.k === "div") walk(t.n), walk(t.d);
  };
  if (s.k === "eq") walk(s.l), walk(s.r);
  return out;
}

/** Distinct entries of a list of references, by canonical key. */
export function distinctObjs<T extends ObjId>(xs: T[]): T[] {
  const seen = new Set<string>();
  return xs.filter((x) => {
    const k = objKey(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Does this term contain a product with a sum inside, i.e. a(b + c)? */
export function hasDistributable(t: Term): boolean {
  switch (t.k) {
    case "mul":
      return t.ts.some((x) => x.k === "add") || t.ts.some(hasDistributable);
    case "add":
      return t.ts.some(hasDistributable);
    case "neg":
      return hasDistributable(t.t);
    case "div":
      return hasDistributable(t.n) || hasDistributable(t.d);
    default:
      return false;
  }
}

/** Free variable names appearing in a statement, e.g. the x of "solve for x". */
export function variables(s: Statement): string[] {
  const out = new Set<string>();
  const walk = (t: Term) => {
    if (t.k === "var") out.add(t.name);
    else if (t.k === "add" || t.k === "mul") t.ts.forEach(walk);
    else if (t.k === "neg") walk(t.t);
    else if (t.k === "div") walk(t.n), walk(t.d);
  };
  if (s.k === "eq") walk(s.l), walk(s.r);
  return [...out];
}
