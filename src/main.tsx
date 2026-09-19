import { ConstraintsPanel } from "./ConstraintsPanel";
import {
  angleBetweenSegments,
} from "./relationships";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, type Tool, type Camera } from "./Canvas";
import {
  type Board,
  type Selection,
  blank,
  clone,
  emptySelection,
  point,
  endpoints,
  angleDegrees,
  angleKey,
  segmentKey,
  segmentLength,
  segmentName,
  angleName,
  uid,
  validateBoard,
} from "./model";
import {
  fixedAngles,
  equalSegments,
  equalAngles,
  midpoint,
  removeSelection,
  duplicate,
  scalar,
} from "./actions";
import { type SolveResult } from "./solver";
import { Practice } from "./practice/Practice";
import { Flashcards } from "./practice/Flashcards";
import { BuildStamp, PageNav, type Page } from "./practice/ui";
import "./style.css";
import "./practice/practice.css";
const KEY = "geometry-whiteboard-v1";
let recovery = "";
function initial() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? validateBoard(JSON.parse(raw)) : blank();
  } catch {
    recovery = localStorage.getItem(KEY) || "";
    return blank();
  }
}
function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    select: <path d="m5 3 13 9-7 1-3 7z" />,
    segment: (
      <>
        <path d="m5 18 14-12" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="19" cy="6" r="2" />
      </>
    ),
    angle: (
      <>
        <path d="M3 19h17L13 5" />
        <path d="M14 19a6 6 0 0 1 3-5" />
      </>
    ),
    point: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
      </>
    ),
    hand: (
      <path d="M7 12V6q0-3 2-1v6-7q2-3 3 0v7-6q2-2 3 0v6-4q2-2 3 1v8q-1 6-7 5L5 15q-3-4 0-4z" />
    ),
    circle: <circle cx="12" cy="12" r="8" />,
    line: <path d="m3 20 18-16M3 15v5h5m8-16h5v5" />,
    ray: (
      <>
        <path d="m4 20 16-16m-5 0h5v5" />
        <circle cx="4" cy="20" r="2" />
      </>
    ),
    undo: <path d="m8 5-5 5 5 5M3 10h10q7 0 7 8" />,
    redo: <path d="m16 5 5 5-5 5m5-5H11q-7 0-7 8" />,
    grid: (
      <>
        <path d="M8 3v18M16 3v18M3 8h18M3 16h18" />
      </>
    ),
    text: <path d="M4 5h16M12 5v16M8 21h8" />,
  };
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || <path d="M5 12h14m-7-7v14" />}
    </svg>
  );
}
function App() {
  const [board, setBoard] = useState<Board>(initial),
    [live, setLive] = useState<Board | null>(null),
    [selection, setSelection] = useState<Selection>(emptySelection),
    [tool, setTool] = useState<Tool>("select"),
    [page, setPage] = useState<Page>("board"),
    [cam, setCam] = useState<Camera>({ x: 0, y: 0, zoom: 1 }),
    [grid, setGrid] = useState(false),
    [chain, setChain] = useState(false),
    [snapping] = useState(true),
    [additive] = useState(false),
    [filter, setFilter] = useState<"all" | "angles" | "segments" | "points">(
      "all",
    ),
    [touches, setTouches] = useState(false),
    [notice, setNotice] = useState(
      recovery
        ? "An older or unreadable saved file is protected. Export it from the document menu."
        : "",
    ),
    [saveState, setSaveState] = useState("Saved locally"),
    [menu, setMenu] = useState(false),
    [inspector, setInspector] = useState(false),
    [help, setHelp] = useState(false),
    [reasoning, setReasoning] = useState(false),
    [angleInput, setAngleInput] = useState(""),
    [lengthInput, setLengthInput] = useState(""),
    [busy, setBusy] = useState(false),
    [preview, setPreview] = useState<{
      board: Board;
      title: string;
      selection?: Selection;
    } | null>(null),
    [cancelToken, setCancelToken] = useState(0),
    [revision, setRevision] = useState(0),
    [equation, setEquation] = useState(""),
    [equationStatus, setEquationStatus] = useState("");
  const actual = useRef(board),
    history = useRef<{ board: Board; selection: Selection }[]>([]),
    future = useRef<{ board: Board; selection: Selection }[]>([]),
    worker = useRef<Worker | undefined>(undefined),
    jobs = useRef(new Map<number, (r: SolveResult) => void>()),
    seq = useRef(0),
    epoch = useRef(0),
    importRef = useRef<HTMLInputElement>(null),
    dragQueue = useRef<
      | { board: Board; targets: Record<string, { x: number; y: number }> }
      | undefined
    >(undefined),
    dragRunning = useRef(false),
    dragDone = useRef(false),
    dragLatest = useRef<Board | undefined>(undefined),
    dragStarted = useRef(false),
    copyRef = useRef<{ board: Board; selection: Selection } | undefined>(
      undefined,
    );
  const zoomAtCenter = (zoom: number) =>
    setCam({
      zoom,
      x: innerWidth / 2 - ((innerWidth / 2 - cam.x) * zoom) / cam.zoom,
      y: innerHeight / 2 - ((innerHeight / 2 - cam.y) * zoom) / cam.zoom,
    });
  const shown = preview?.board || live || board;
  const connectedAngle = useMemo(
    () =>
      selection.angles.length
        ? undefined
        : angleBetweenSegments(board, selection.segments),
    [board, selection],
  );
  const editableAngles = selection.angles.length
    ? selection.angles
    : connectedAngle
      ? [connectedAngle]
      : [];
  useEffect(() => {
    const w = new Worker(new URL("./solver.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.current = w;
    w.onmessage = (e) => {
      jobs.current.get(e.data.id)?.(e.data);
      jobs.current.delete(e.data.id);
    };
    return () => w.terminate();
  }, []);
  const requestSolve = (
    b: Board,
    targets: Record<string, { x: number; y: number }> = {},
    budget = 400,
  ) =>
    new Promise<SolveResult>((resolve) => {
      const id = ++seq.current;
      const timer = setTimeout(() => {
        jobs.current.delete(id);
        resolve({
          ok: false,
          board: b,
          message:
            "The solver reached its time limit. Your last valid drawing is preserved.",
          error: Infinity,
          iterations: 0,
        });
      }, 1500);
      jobs.current.set(id, (r) => {
        clearTimeout(timer);
        resolve(r);
      });
      worker.current?.postMessage({ id, board: b, targets, budget });
    });
  const commit = (next: Board, s?: Selection) => {
    if (dragRunning.current) {
      epoch.current++;
      dragQueue.current = undefined;
      dragStarted.current = false;
      dragDone.current = false;
    }
    if (JSON.stringify(next) !== JSON.stringify(actual.current)) {
      history.current.push({
        board: clone(actual.current),
        selection: clone(selection),
      });
      history.current = history.current.slice(-100);
      future.current = [];
      actual.current = clone(next);
      setBoard(actual.current);
      setRevision((v) => v + 1);
    }
    setLive(null);
    if (s) setSelection(s);
  };
  useEffect(() => {
    if (recovery) {
      setSaveState("Protected saved file");
      return;
    }
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(board));
        setSaveState("Saved locally");
      } catch {
        setSaveState("Not saved");
        setNotice(
          "Local storage is full or unavailable. Export your drawing to keep it.",
        );
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [board]);
  const command = async (
    title: string,
    fn: (b: Board) => Selection | void,
    immediate = false,
    anchors: string[] = [],
  ) => {
    if (busy) return;
    setNotice("");
    setBusy(true);
    const currentEpoch = ++epoch.current;
    const n = clone(actual.current);
    try {
      const pins = new Map(anchors.map((id) => [id, point(n, id)?.pinned]));
      for (const id of anchors) {
        const p = point(n, id);
        if (p) p.pinned = true;
      }
      const s = fn(n);
      const r = await requestSolve(n);
      for (const [id, pinned] of pins) {
        const p = point(r.board, id);
        if (p) p.pinned = pinned;
      }
      if (currentEpoch !== epoch.current) return;
      if (r.ok) {
        if (immediate) commit(r.board, s || undefined);
        else setPreview({ board: r.board, title, selection: s || undefined });
      } else setNotice(r.message);
    } catch (error) {
      setNotice((error as Error).message);
    } finally {
      if (currentEpoch === epoch.current) setBusy(false);
    }
  };
  const flushDrag = async () => {
    const job = dragQueue.current;
    if (!job || dragRunning.current) return;
    dragQueue.current = undefined;
    dragRunning.current = true;
    const version = epoch.current;
    const r = await requestSolve(job.board, job.targets, 100);
    dragRunning.current = false;
    if (version !== epoch.current) {
      if (dragQueue.current) void flushDrag();
      return;
    }
    if (r.ok) {
      dragLatest.current = r.board;
      setLive(r.board);
    } else setNotice(r.message);
    if (dragQueue.current) void flushDrag();
    else if (dragDone.current) {
      if (dragLatest.current) commit(dragLatest.current);
      else setLive(null);
      dragStarted.current = false;
      dragDone.current = false;
    }
  };
  const drag = (
    b: Board,
    targets: Record<string, { x: number; y: number }>,
    final: boolean,
  ) => {
    if (final) {
      dragDone.current = true;
      if (!dragRunning.current && !dragQueue.current) {
        if (dragLatest.current) commit(dragLatest.current);
        dragStarted.current = false;
        dragDone.current = false;
      }
      return;
    }
    if (!dragStarted.current) {
      dragStarted.current = true;
      dragLatest.current = undefined;
      setNotice("");
    }
    dragQueue.current = { board: b, targets };
    void flushDrag();
  };
  const cancel = () => {
    epoch.current++;
    dragQueue.current = undefined;
    dragDone.current = false;
    dragStarted.current = false;
    setLive(null);
    setPreview(null);
    setBusy(false);
    setCancelToken((n) => n + 1);
  };
  const undo = () => {
    cancel();
    const last = history.current.pop();
    if (last) {
      future.current.push({
        board: clone(actual.current),
        selection: clone(selection),
      });
      actual.current = last.board;
      setBoard(last.board);
      setSelection(last.selection);
      setRevision((n) => n + 1);
    }
  };
  const redo = () => {
    cancel();
    const next = future.current.pop();
    if (next) {
      history.current.push({
        board: clone(actual.current),
        selection: clone(selection),
      });
      actual.current = next.board;
      setBoard(next.board);
      setSelection(next.selection);
      setRevision((n) => n + 1);
    }
  };
  const remove = () => {
    const n = clone(board);
    const count = n.constraints.length;
    removeSelection(n, selection);
    if (count !== n.constraints.length) {
      setPreview({
        board: n,
        title: `Delete selection and ${count - n.constraints.length} dependent relationship${count - n.constraints.length === 1 ? "" : "s"}`,
        selection: emptySelection(),
      });
    } else commit(n, emptySelection());
  };
  const fit = (onlySelected = false) => {
    const ps = onlySelected
      ? ([
          ...selection.points.map((id) => point(shown, id)),
          ...selection.segments.flatMap((s) => endpoints(shown, s) || []),
        ].filter(Boolean) as import("./model").Point[])
      : shown.points;
    if (!ps.length) {
      setCam({ x: 0, y: 0, zoom: 1 });
      return;
    }
    const minX = Math.min(...ps.map((p) => p.x)),
      maxX = Math.max(...ps.map((p) => p.x)),
      minY = Math.min(...ps.map((p) => p.y)),
      maxY = Math.max(...ps.map((p) => p.y));
    const width = window.innerWidth - (inspector ? 310 : 0),
      height = window.innerHeight,
      z = Math.max(
        0.15,
        Math.min(
          2,
          (width - 180) / Math.max(100, maxX - minX),
          (height - 220) / Math.max(100, maxY - minY),
        ),
      );
    setCam({
      zoom: z,
      x: width / 2 - ((minX + maxX) / 2) * z,
      y: height / 2 + 20 - ((minY + maxY) / 2) * z,
    });
  };
  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      // Drawing shortcuts belong to the board, not to Practice or Cards.
      if (page !== "board") return;
      const editing = (e.target as HTMLElement).matches(
        "input,textarea,[contenteditable=true]",
      );
      if (e.key === "Escape") {
        cancel();
        setHelp(false);
        setMenu(false);
        if (!editing) setTool("select");
        return;
      }
      if (editing) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setSelection({
          points: [],
          segments: board.edges.map((e) => ({ edge: e.id })),
          angles: [],
          notes: [],
        });
        return;
      }
      if (mod && e.key.toLowerCase() === "c") {
        copyRef.current = { board: clone(board), selection: clone(selection) };
        setNotice("Selection copied within this board.");
        return;
      }
      if (mod && e.key.toLowerCase() === "v" && copyRef.current) {
        e.preventDefault();
        const n = clone(board);
        const s = duplicate(
          n,
          copyRef.current.selection,
          copyRef.current.board,
        );
        commit(n, s);
        return;
      }
      if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        const n = clone(board);
        commit(n, duplicate(n, selection));
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        remove();
        return;
      }
      if (e.key === "Enter" && preview) {
        commit(preview.board, preview.selection);
        setPreview(null);
        return;
      }
      const tools: Record<string, Tool> = {
        v: "select",
        s: "segment",
        a: "angle",
        p: "point",
        h: "hand",
      };
      if (!mod && tools[e.key.toLowerCase()]) {
        setTool(tools[e.key.toLowerCase()]);
        return;
      }
      if (e.key === "0") {
        fit();
        return;
      }
      if (e.key === "g") setGrid(!grid);
      if (e.key.startsWith("Arrow") && selection.points.length) {
        e.preventDefault();
        const amount = e.shiftKey ? 10 : 1;
        const n = clone(board),
          targets: Record<string, { x: number; y: number }> = {};
        for (const id of selection.points) {
          const p = point(n, id)!;
          targets[id] = {
            x:
              p.x +
              (e.key === "ArrowRight"
                ? amount
                : e.key === "ArrowLeft"
                  ? -amount
                  : 0),
            y:
              p.y +
              (e.key === "ArrowDown"
                ? amount
                : e.key === "ArrowUp"
                  ? -amount
                  : 0),
          };
        }
        void requestSolve(n, targets).then((r) =>
          r.ok ? commit(r.board) : setNotice(r.message),
        );
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  });
  const selectionSignature =
    selection.angles.map((a) => angleKey(a, board)).join("|") +
    selection.segments.map(segmentKey).join("|");
  useEffect(() => {
    const angles = editableAngles.map((a) => angleDegrees(board, a));
    setAngleInput(
      angles.length && angles.every((x) => Math.abs(x - angles[0]) < 0.01)
        ? angles[0].toFixed(1).replace(/\.0$/, "")
        : "",
    );
    const ls = selection.segments.map((s) => segmentLength(board, s) / 50);
    setLengthInput(
      ls.length === 1 ? ls[0].toFixed(2).replace(/\.00$/, "") : "",
    );
  }, [selectionSignature, revision]);
  const download = (name: string, data: string, type = "application/json") => {
    const url = URL.createObjectURL(new Blob([data], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  const exportSvg = () => {
    const svg = document
      .querySelector("svg.board")!
      .cloneNode(true) as SVGElement;
    svg.removeAttribute("tabindex");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", String(window.innerWidth));
    svg.setAttribute("height", String(window.innerHeight));
    download(
      "geometry.svg",
      new XMLSerializer().serializeToString(svg),
      "image/svg+xml",
    );
  };
  const importFile = async (file: File) => {
    try {
      if (file.size > 5_000_000) throw Error("Choose a board under 5 MB.");
      const value = JSON.parse(await file.text());
      const imported = validateBoard(value);
      const r = await requestSolve(imported);
      if (!r.ok)
        throw Error(
          "The imported constraints could not be resolved. The current drawing is unchanged.",
        );
      recovery = "";
      commit(r.board, emptySelection());
      setMenu(false);
      setNotice("Board imported. Undo returns to your previous drawing.");
    } catch (error) {
      setNotice((error as Error).message);
    }
  };
  const setAngles = (right = false) =>
    void command(
      right
        ? "Make selected angles right"
        : `Set angle measure to ${angleInput}°${Number(angleInput) > 180 ? " · reflex region" : ""}`,
      (n) =>
        fixedAngles(
          n,
          editableAngles,
          right ? 90 : scalar(angleInput),
          right ? "90" : angleInput,
        ),
    );
  const selectedCount =
    selection.points.length +
    selection.segments.length +
    selection.angles.length +
    selection.notes.length;
  const single =
    selection.segments.length === 1 ? selection.segments[0] : undefined;
  const attachMidpoint = () =>
    void command(
      "Create midpoint",
      (n) => {
        const p = midpoint(n, single!);
        return { points: [p.id], segments: [], angles: [], notes: [] };
      },
      true,
    );
  const contextTitle = selection.notes.length
    ? `${selection.notes.length} ${selection.notes.length === 1 ? "note" : "notes"}`
    : selection.angles.length
      ? selection.angles.length === 1
        ? "∠ " + angleName(shown, selection.angles[0])
        : `${selection.angles.length} angles`
      : selection.segments.length
        ? selection.segments.length === 1
          ? segmentName(shown, selection.segments[0])
          : `${selection.segments.length} segments`
        : selection.points.length === 1
          ? point(shown, selection.points[0])?.label
          : `${selection.points.length} points`;
  const insertMeasure = () => {
    const text = selection.angles.length
      ? selection.angles.map((a) => "m∠" + angleName(board, a)).join(" + ")
      : selection.segments.map((s) => segmentName(board, s)).join(" + ");
    setEquation((v) => v + text);
  };
  if (page !== "board")
    return (
      <div className="app-page">
        <div className="app-page-nav">
          <PageNav value={page} onChange={setPage} />
        </div>
        {page === "practice" ? <Practice /> : <Flashcards />}
        <BuildStamp />
      </div>
    );
  return (
    <main>
      <Canvas
        board={shown}
        angleHint={connectedAngle}
        selection={selection}
        setSelection={setSelection}
        commit={commit}
        drag={drag}
        tool={tool}
        camera={cam}
        setCamera={setCam}
        cancel={cancel}
        grid={grid}
        additive={additive}
        chain={chain}
        snapping={snapping}
        filter={filter}
        touches={touches}
        cancelToken={cancelToken}
        notice={setNotice}
        busy={busy || !!preview}
      />
      <div className="document-control">
        <button
          className="doc-button"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
        >
          <span className="brand-symbol">◇</span>
          <span>{board.title}</span>
          <span className="chevron">⌄</span>
        </button>
        {menu && (
          <section className="popover document-menu">
            <label>
              Board name
              <input
                value={board.title}
                onChange={(e) => {
                  const n = clone(board);
                  n.title = e.target.value;
                  commit(n);
                }}
              />
            </label>
            <button
              onClick={() => {
                commit(blank(), emptySelection());
                setCam({ x: 0, y: 0, zoom: 1 });
                setMenu(false);
              }}
            >
              New blank board
            </button>
            <button
              onClick={() =>
                download("geometry-board.json", JSON.stringify(board, null, 2))
              }
            >
              Export editable board
            </button>
            <button onClick={() => importRef.current?.click()}>
              Import board
            </button>
            <button onClick={exportSvg}>Export SVG image</button>
            {recovery && (
              <button
                onClick={() => download("protected-board.json", recovery)}
              >
                Download protected saved file
              </button>
            )}
            <small>{saveState} · No account needed</small>
          </section>
        )}
      </div>
      <input
        hidden
        ref={importRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          if (e.target.files?.[0]) void importFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <nav className="toolbar" aria-label="Drawing tools">
        {(["select", "segment", "angle", "point", "hand"] as Tool[]).map((t, i) => (
          <button
            key={t}
            className={tool === t ? "active" : ""}
            aria-label={`${t[0].toUpperCase() + t.slice(1)} tool`}
            aria-pressed={tool === t}
            title={`${t} · ${["V", "S", "A", "P", "H"][i]}`}
            onClick={() => {
              cancel();
              setTool(t);
            }}
          >
            <Icon name={t} />
            <span>{t[0].toUpperCase() + t.slice(1)}</span>
          </button>
        ))}
        <i />
        <button
          aria-label="Undo"
          title="Undo · Ctrl/⌘ Z"
          disabled={!history.current.length}
          onClick={undo}
        >
          <Icon name="undo" />
        </button>
        <button
          aria-label="Redo"
          title="Redo · Ctrl/⌘ Shift Z"
          disabled={!future.current.length}
          onClick={redo}
        >
          <Icon name="redo" />
        </button>
      </nav>
      <div className="top-right">
        <PageNav value={page} onChange={setPage} compact />
        <button
          title="Constraints"
          aria-label={inspector ? "Collapse constraints" : "Expand constraints"}
          aria-expanded={inspector}
          aria-controls="constraints-sidebar"
          className={inspector ? "active" : ""}
          onClick={() => setInspector(!inspector)}
        >
          ☷
        </button>
        <button
          title="Shortcuts and help"
          aria-label="Help"
          onClick={() => setHelp(!help)}
        >
          ?
        </button>
      </div>
      {selectedCount > 0 && tool === "select" && !preview && (
        <section className="context-bar" aria-label="Selection tools">
          <strong>{contextTitle}</strong>
          {selection.segments.length > 1 && (
            <button
              onClick={() =>
                void command(
                  "Make segments congruent · match " +
                    segmentName(board, selection.segments[0]),
                  (n) => equalSegments(n, selection.segments),
                  false,
                  endpoints(board, selection.segments[0])?.map((p) => p.id) ||
                    [],
                )
              }
            >
              ≅ Make congruent
            </button>
          )}
          {single && (
            <>
              {(single.a || single.b) && (
                <button
                  onClick={() =>
                    setSelection({
                      ...emptySelection(),
                      segments: [{ edge: single.edge }],
                    })
                  }
                >
                  Whole {segmentName(board, { edge: single.edge })}
                </button>
              )}
              <label>
                Length{" "}
                <input
                  aria-label="Segment length"
                  value={lengthInput}
                  onChange={(e) => setLengthInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      void command("Set segment length", (n) => {
                        n.constraints = n.constraints.filter(
                          (c) =>
                            !(
                              c.kind === "length" &&
                              segmentKey(c.segment) === segmentKey(single)
                            ),
                        );
                        n.constraints.push({
                          id: uid(),
                          kind: "length",
                          segment: single,
                          value: scalar(lengthInput) * 50,
                        });
                      });
                  }}
                />
              </label>
              <button onClick={attachMidpoint}>Midpoint</button>
            </>
          )}
          {editableAngles.length > 0 && (
            <>
              {connectedAngle && (
                <span
                  style={{ whiteSpace: "nowrap" }}
                  title="Angle between the selected segments"
                >
                  ∠ {angleName(board, connectedAngle)}
                </span>
              )}
              <label>
                <input
                  aria-label="Angle measure"
                  title="Enter a degree measure, then press Enter"
                  value={angleInput}
                  placeholder="Mixed"
                  onChange={(e) => setAngleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setAngles();
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                      setAngleInput(
                        String(
                          (Number(angleInput) || 0) +
                            (e.key === "ArrowUp" ? 1 : -1) *
                              (e.shiftKey ? 10 : 1),
                        ),
                      );
                    }
                  }}
                />
                °
              </label>
              {editableAngles.length > 1 && (
                <button
                  onClick={() =>
                    void command("Make angles congruent", (n) =>
                      equalAngles(n, editableAngles),
                    )
                  }
                >
                  ≅ Make congruent
                </button>
              )}
            </>
          )}
          {selection.points.length === 1 && (
            <button
              onClick={() => {
                const n = clone(board),
                  p = point(n, selection.points[0])!;
                p.pinned = !p.pinned;
                commit(n);
              }}
            >
              {point(board, selection.points[0])?.pinned ? "Unpin" : "Pin"}
            </button>
          )}
          <button
            aria-label="View constraints"
            onClick={() => setInspector(!inspector)}
          >
            •••
          </button>
          <button
            className="icon-only"
            aria-label="Delete selection"
            title="Delete selection"
            onClick={remove}
          >
            ×
          </button>
        </section>
      )}
      {preview && (
        <section className="preview-bar" role="status">
          <span>
            <b>{preview.title}</b>
            <small>Preview · existing relationships are preserved</small>
          </span>
          <button
            className="primary"
            onClick={() => {
              commit(preview.board, preview.selection);
              setPreview(null);
            }}
          >
            Apply
          </button>
          <button onClick={cancel}>Cancel</button>
        </section>
      )}
      {busy && (
        <div className="busy" role="status">
          Resolving geometry…
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button aria-label="Dismiss message" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      {(tool === "select" || tool === "segment") && <div className="bottom-left">
        {tool === "segment" && (
          <button
            className={chain ? "active" : ""}
            onClick={() => setChain(!chain)}
          >
            Chain
          </button>
        )}
        {tool === "select" && (
          <>
            <select
              aria-label="Selection filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">All objects</option>
              <option value="segments">Segments</option>
              <option value="angles">Angles</option>
              <option value="points">Points</option>
            </select>
            <button
              onClick={() => setTouches(!touches)}
              title="Marquee selection behavior"
            >
              {touches ? "Touches" : "Contains"}
            </button>
          </>
        )}
      </div>}
      <div className="zoom-controls">
        <button
          aria-label="Zoom out"
          onClick={() => zoomAtCenter(Math.max(0.1, cam.zoom / 1.2))}
        >
          −
        </button>
        <button
          title="Reset view"
          onClick={() => setCam({ x: 0, y: 0, zoom: 1 })}
        >
          {Math.round(cam.zoom * 100)}%
        </button>
        <button
          aria-label="Zoom in"
          onClick={() => zoomAtCenter(Math.min(6, cam.zoom * 1.2))}
        >
          +
        </button>
        <button onClick={() => fit()} title="Fit drawing · 0">
          Fit
        </button>
      </div>
      {!board.points.length && !notice && (
        <div className="empty-hint">
          Draw a segment or press <kbd>S</kbd>
          <span>Space + drag to pan · scroll to zoom</span>
        </div>
      )}
      {inspector && (
        <aside id="constraints-sidebar" className="inspector">
          <header>
            <h2>Constraints</h2>
            <button
              aria-label="Close constraints"
              onClick={() => setInspector(false)}
            >
              ×
            </button>
          </header>
          <ConstraintsPanel
            board={board}
            selection={selection}
            disabled={busy || !!preview}
            commit={commit}
            select={setSelection}
            command={(title, fn) => {
              void command(title, fn);
            }}
          />
        </aside>
      )}
      {reasoning && (
        <section className="reasoning-panel">
          <header>
            <h2>Linked quantities</h2>
            <button
              aria-label="Close equations"
              onClick={() => setReasoning(false)}
            >
              ×
            </button>
          </header>
          <p>Select segments or angles, then insert their measures.</p>
          <div className="equation-row">
            <input
              aria-label="Equation"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="AB + BC = AC"
            />
            <button
              onClick={insertMeasure}
              disabled={!selection.segments.length && !selection.angles.length}
            >
              Insert selection
            </button>
            <button
              onClick={() => {
                if (!equation.trim()) return;
                const n = clone(board);
                n.equations.push(equation);
                commit(n);
                setEquation("");
                setEquationStatus(
                  "Added as a statement. Drawing measurements do not prove it.",
                );
              }}
            >
              Add statement
            </button>
          </div>
          {board.equations.map((e, i) => (
            <div className="equation-chip" key={i}>
              {e}
              <button
                aria-label={"Remove statement " + (i + 1)}
                onClick={() => {
                  const n = clone(board);
                  n.equations.splice(i, 1);
                  commit(n);
                }}
              >
                ×
              </button>
            </div>
          ))}
          <small>
            {equationStatus ||
              "Statements remain distinct from geometric constraints."}
          </small>
        </section>
      )}
      {help && (
        <div className="dialog-shade" onClick={() => setHelp(false)}>
          <section
            className="help-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Whiteboard guide"
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <h2>A little help</h2>
              <button onClick={() => setHelp(false)} aria-label="Close help">
                ×
              </button>
            </header>
            <p>
              Draw with <kbd>S</kbd>, then click two endpoints or drag. Choose{" "}
              <kbd>A</kbd> to draw a vertex and two arms. Return to <kbd>V</kbd>{" "}
              to select and move.
            </p>
            <p>
              Hover near a crossing to reveal its angles. Select an angle to
              make it right or set a degree measure. Shift-click adds to a
              selection; drag empty space to select an area.
            </p>
            <p>
              Snap creates shared vertices and attached points. Hold Alt/Option
              to draw without snapping. Space-drag pans. Scroll or pinch zooms.
            </p>
            <p>
              Geometry actions preview their result. Apply or press Enter to
              commit; Escape cancels. Undo restores the whole edit.
            </p>
            <p>
              Select an angle or segment to view its constraints. Use the constraints
              panel to edit values or remove relationships.
            </p>
            <small>
              Live numerical geometry. Measured values are approximate; declared
              constraints are not proof certificates.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}
// Release the mounted tree before a development module replacement.
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
