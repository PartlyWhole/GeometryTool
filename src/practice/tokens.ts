// Token stream for toolbar-built expressions.
//
// Students never type an expression; they append tokens from a palette or by
// clicking the figure. Parsing exists so the token list becomes a real Term
// that the reason validators can check.
import {
  type AngId,
  type SegId,
  type Term,
  add,
  div,
  len,
  meas,
  mul,
  neg,
  num,
  vr,
} from "./terms";

export type Tok =
  | { t: "num"; v: string }
  | { t: "var"; name: string }
  | { t: "len"; seg: SegId }
  | { t: "meas"; ang: AngId }
  | { t: "op"; op: "+" | "−" | "×" | "÷" }
  | { t: "lp" }
  | { t: "rp" };

export const tokText = (k: Tok): string => {
  switch (k.t) {
    case "num":
      return k.v;
    case "var":
      return k.name;
    case "len":
      return k.seg.a + k.seg.b;
    case "meas":
      return "m∠" + k.ang.name;
    case "op":
      return k.op;
    case "lp":
      return "(";
    case "rp":
      return ")";
  }
};

export const tokensText = (ks: Tok[]) =>
  ks
    .map((k, i) => {
      const prev = ks[i - 1];
      const tight =
        i === 0 ||
        prev?.t === "lp" ||
        k.t === "rp" ||
        (prev?.t === "num" && (k.t === "var" || k.t === "lp"));
      return (tight ? "" : k.t === "op" || prev?.t === "op" ? " " : " ") + tokText(k);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();

export type ParseResult =
  | { ok: true; term: Term }
  | { ok: false; why: string };

/**
 * Recursive descent over the token list. Juxtaposition means multiplication,
 * so "3 x" and "2 ( x + 1 )" read the way they are written.
 */
export function parse(toks: Tok[]): ParseResult {
  if (!toks.length) return { ok: false, why: "This part is empty." };
  let i = 0;

  const peek = () => toks[i];
  const atValueStart = () => {
    const k = peek();
    return (
      !!k &&
      (k.t === "num" || k.t === "var" || k.t === "len" || k.t === "meas" || k.t === "lp")
    );
  };

  function primary(): Term | string {
    const k = peek();
    if (!k) return "The expression ends too early.";
    if (k.t === "num") {
      i++;
      const v = Number(k.v);
      if (!Number.isFinite(v)) return "“" + k.v + "” is not a number.";
      return num(v);
    }
    if (k.t === "var") return i++, vr(k.name);
    if (k.t === "len") return i++, len(k.seg.a, k.seg.b);
    if (k.t === "meas") return i++, meas(k.ang.name);
    if (k.t === "lp") {
      i++;
      const inner = sum();
      if (typeof inner === "string") return inner;
      if (peek()?.t !== "rp") return "A bracket is not closed.";
      i++;
      return inner;
    }
    if (k.t === "op" && k.op === "−") {
      i++;
      const inner = primary();
      return typeof inner === "string" ? inner : neg(inner);
    }
    return "“" + tokText(k) + "” cannot start a value here.";
  }

  function product(): Term | string {
    let left = primary();
    if (typeof left === "string") return left;
    for (;;) {
      const k = peek();
      if (k?.t === "op" && (k.op === "×" || k.op === "÷")) {
        i++;
        const right = primary();
        if (typeof right === "string") return right;
        left = k.op === "×" ? mul(left, right) : div(left, right);
        continue;
      }
      // Implicit multiplication: 3x, 2(x + 1), 3 m∠ABC.
      if (atValueStart()) {
        const right = primary();
        if (typeof right === "string") return right;
        left = mul(left, right);
        continue;
      }
      return left;
    }
  }

  function sum(): Term | string {
    let left = product();
    if (typeof left === "string") return left;
    const parts: Term[] = [left];
    for (;;) {
      const k = peek();
      if (k?.t !== "op" || (k.op !== "+" && k.op !== "−")) break;
      i++;
      const right = product();
      if (typeof right === "string") return right;
      parts.push(k.op === "+" ? right : neg(right));
    }
    return parts.length === 1 ? parts[0] : add(...parts);
  }

  const out = sum();
  if (typeof out === "string") return { ok: false, why: out };
  if (i < toks.length)
    return { ok: false, why: "“" + tokText(toks[i]) + "” is unexpected here." };
  return { ok: true, term: out };
}

/** Whether appending this token keeps the expression buildable. */
export function accepts(toks: Tok[], next: Tok): boolean {
  const last = toks[toks.length - 1];
  const open = toks.filter((k) => k.t === "lp").length -
    toks.filter((k) => k.t === "rp").length;
  const valueLike =
    last &&
    (last.t === "num" || last.t === "var" || last.t === "len" ||
      last.t === "meas" || last.t === "rp");
  if (next.t === "op") {
    if (next.op === "−" && !valueLike) return true; // unary minus
    return !!valueLike;
  }
  if (next.t === "rp") return open > 0 && !!valueLike;
  if (next.t === "num" && last?.t === "num") return true; // digits accumulate
  return true;
}

/** Digits typed in sequence extend the current number rather than stacking. */
export function push(toks: Tok[], next: Tok): Tok[] {
  const last = toks[toks.length - 1];
  if (next.t === "num" && last?.t === "num")
    return [...toks.slice(0, -1), { t: "num", v: last.v + next.v }];
  return [...toks, next];
}
