// Where you are in a set of items, and what you have already done to each.
//
// Every exercise used to move one way only, and only after an answer: no way
// back to a question you wanted a second look at, and no way past one you
// were stuck on. Holding each item's work here is what makes going back worth
// doing — a revisited item comes up as you left it, with your answer and its
// verdict, rather than as a blank slate that would score a second time.
import { useRef, useState } from "react";

export type Deck<S> = {
  /** Zero-based position in the set. */
  i: number;
  count: number;
  /** This item's work, as it was left. */
  state: S;
  setState: (next: S | ((prev: S) => S)) => void;
  go: (n: number) => void;
  back: () => void;
  /** One forward; past the last item, whatever `onEnd` says, else wrap. */
  forward: () => void;
  /** Has this item been touched? Used to draw the progress dots. */
  touched: (n: number) => boolean;
  /** The work on every item so far, for marking up the dots. */
  all: Record<number, S>;
};

export function useDeck<S>(
  count: number,
  blank: (i: number) => S,
  opts?: { key?: string; onEnd?: () => void },
): Deck<S> {
  const [i, setI] = useState(0);
  const [work, setWork] = useState<Record<number, S>>({});

  // A new pool — a fresh seed, a changed filter — is a new set of answers.
  const key = opts?.key ?? "";
  const seen = useRef(key);
  if (seen.current !== key) {
    seen.current = key;
    setI(0);
    if (Object.keys(work).length) setWork({});
  }

  const at = count > 0 ? Math.min(i, count - 1) : 0;
  const state = at in work ? work[at] : blank(at);

  const setState = (next: S | ((prev: S) => S)) =>
    setWork((w) => {
      const cur = at in w ? w[at] : blank(at);
      const v = typeof next === "function" ? (next as (p: S) => S)(cur) : next;
      return { ...w, [at]: v };
    });

  const go = (n: number) => setI(Math.max(0, Math.min(count - 1, n)));

  const forward = () => {
    if (at + 1 < count) setI(at + 1);
    else if (opts?.onEnd) opts.onEnd();
    else setI(0);
  };

  return {
    i: at,
    count,
    state,
    setState,
    go,
    back: () => setI(Math.max(0, at - 1)),
    forward,
    touched: (n) => n in work,
    all: work,
  };
}

/** How a dot in the progress strip should read. */
export type DotState = "open" | "right" | "wrong";

/** The usual mapping: untouched, answered correctly, answered wrongly. */
export function dots<S>(
  deck: Deck<S>,
  verdict: (s: S, n: number) => boolean | null,
): DotState[] {
  return Array.from({ length: deck.count }, (_, n) => {
    if (!deck.touched(n)) return "open";
    const v = verdict(deck.all[n], n);
    return v === null ? "open" : v ? "right" : "wrong";
  });
}
