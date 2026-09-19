// Rendering statements in the notation the reference uses.
import {
  type AngId,
  type ObjId,
  type Statement,
  type Term,
  splitLabels,
} from "./terms";

export const angLabel = (a: AngId) =>
  splitLabels(a.name).length >= 2 ? a.name : a.name;

export function objText(o: ObjId): string {
  switch (o.k) {
    case "seg":
      return o.a + o.b;
    case "line":
      return "line " + o.a + o.b;
    case "ray":
      return "ray " + o.from + o.through;
    case "pt":
      return o.p;
    case "ang":
      return "∠" + o.name;
  }
}

const NUM = (v: number) =>
  Number.isInteger(v) ? String(v) : String(Number(v.toFixed(6)));

/** Precedence: 0 sum, 1 product, 2 atom. */
function termText(t: Term, ctx = 0): string {
  const wrap = (s: string, own: number) => (own < ctx ? "(" + s + ")" : s);
  switch (t.k) {
    case "num":
      return NUM(t.v);
    case "var":
      return t.name;
    case "len":
      return t.seg.a + t.seg.b;
    case "meas":
      return "m∠" + t.ang.name;
    case "neg":
      return wrap("−" + termText(t.t, 2), 1);
    case "div":
      return wrap(termText(t.n, 2) + "/" + termText(t.d, 2), 1);
    case "mul": {
      // A coefficient of 1 is not written, and −1 is written as a bare minus.
      const lead = t.ts[0];
      if (t.ts.length === 2 && lead.k === "num" && t.ts[1].k !== "num") {
        const rest = t.ts[1];
        if (Math.abs(lead.v - 1) < 1e-12) return termText(rest, ctx);
        if (Math.abs(lead.v + 1) < 1e-12) return wrap("−" + termText(rest, 2), 1);
        // "3x", but "2 m∠ABC" — a measure needs the gap to stay readable.
        const gap = rest.k === "meas" || rest.k === "len" ? " " : "";
        return wrap(NUM(lead.v) + gap + termText(rest, 2), 1);
      }
      return wrap(t.ts.map((x) => termText(x, 2)).join(" · "), 1);
    }
    case "add": {
      let s = "";
      t.ts.forEach((x, i) => {
        const isNeg =
          x.k === "neg" || (x.k === "num" && x.v < 0) ||
          (x.k === "mul" && x.ts[0]?.k === "num" && x.ts[0].v < 0);
        const body =
          x.k === "neg"
            ? termText(x.t, 1)
            : x.k === "num" && x.v < 0
              ? NUM(-x.v)
              : x.k === "mul" && x.ts[0]?.k === "num" && x.ts[0].v < 0
                ? termText(
                    { ...x, ts: [{ k: "num", v: -x.ts[0].v }, ...x.ts.slice(1)] },
                    1,
                  )
                : termText(x, 1);
        s += i === 0 ? (isNeg ? "−" + body : body) : (isNeg ? " − " : " + ") + body;
      });
      return wrap(s, 0);
    }
  }
}

export const text = (t: Term) => termText(t, 0);

export function statementText(s: Statement): string {
  switch (s.k) {
    case "eq":
      return text(s.l) + " = " + text(s.r);
    case "cong":
      return objText(s.l) + " ≅ " + objText(s.r);
    case "supp":
      return "∠" + s.a.name + " and ∠" + s.b.name + " are supplementary";
    case "comp":
      return "∠" + s.a.name + " and ∠" + s.b.name + " are complementary";
    case "vertical":
      return "∠" + s.a.name + " and ∠" + s.b.name + " are vertical angles";
    case "linearPair":
      return "∠" + s.a.name + " and ∠" + s.b.name + " form a linear pair";
    case "adjacent":
      return "∠" + s.a.name + " and ∠" + s.b.name + " are adjacent angles";
    case "perp":
      return objText(s.a) + " ⊥ " + objText(s.b);
    case "parallel":
      return objText(s.a) + " ∥ " + objText(s.b);
    case "midpoint":
      return s.p + " is the midpoint of " + s.seg.a + s.seg.b;
    case "bisects":
      return objText(s.by) + " bisects " + objText(s.of);
    case "between":
      return s.p + " is between " + s.a + " and " + s.c;
    case "collinear":
      return s.pts.join(", ") + " are collinear";
    case "interior":
      return s.p + " is in the interior of ∠" + s.ang.name;
    case "angleClass":
      return "∠" + s.ang.name + " is " +
        (s.cls === "obtuse" || s.cls === "acute" ? "an " : "a ") + s.cls +
        " angle";
  }
}
