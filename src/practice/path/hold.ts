// Press and hold: the slightly hidden way to open what is locked, on the
// path and in the practice chooser. A tap does the ordinary thing; holding
// for a moment, or a right-click, does the other.
import type React from "react";
import { useRef } from "react";

const HOLD_MS = 550;

export function useHold() {
  const timer = useRef<number | undefined>(undefined);
  // A hold ends in a click as the finger lifts; that click is not a tap.
  const held = useRef(false);
  return (o: { locked: boolean; title?: string; onTap: () => void; onHold: () => void }) => ({
    title: o.locked ? o.title : undefined,
    onClick: () => {
      if (held.current) {
        held.current = false;
        return;
      }
      o.onTap();
    },
    onPointerDown: () => {
      if (!o.locked) return;
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        held.current = true;
        o.onHold();
      }, HOLD_MS);
    },
    onPointerUp: () => clearTimeout(timer.current),
    onPointerLeave: () => clearTimeout(timer.current),
    onContextMenu: (e: React.MouseEvent) => {
      if (!o.locked) return;
      e.preventDefault();
      clearTimeout(timer.current);
      o.onHold();
    },
  });
}
