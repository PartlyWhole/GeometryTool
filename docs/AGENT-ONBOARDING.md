# Geometry Whiteboard: agent onboarding

Snapshot: September 19, 2026 (America/Los_Angeles). This describes the implemented application: the simplified whiteboard, plus the Practice and Cards sections added on top of it.

## Start here

Project: `/Users/alan/Documents/Codex/2026-09-18/i-want-you-to-plan-out/outputs/geometry-whiteboard`.

This is an independent React/TypeScript SVG whiteboard. The earlier `outputs/geometry-studio` is a different application and should not be changed when working on this one. Read the user's current instructions and applicable AGENTS.md before editing. The workspace has not been a Git checkout in this session; do not assume a clean Git baseline or invent a commit history.

Read this guide, then `src/main.tsx`, `src/Canvas.tsx`, and the model/functions relevant to the task. `docs/EVIDENCE.md` is a chronological verification log. `docs/WHITEBOARD-DESIGN.md` and `docs/PLAN.md` are historical design material: features described there may have been removed or never implemented. Current source and latest user instructions take precedence.

## Run, build, and deliver

Use the project directory:

```sh
npm ci
npm run dev
npm run check
npm run preview
```

- Dev: `http://127.0.0.1:4190/`.
- Vite production preview: `http://127.0.0.1:4191/`.
- The user's existing session has used `http://127.0.0.1:4192/geometry-whiteboard/dist/`, served from the parent `outputs` directory. This serves built files, so editing source alone does not update it.
- To recreate that static server if needed, run `python3 -m http.server 4192 --bind 127.0.0.1` from `outputs`. First check whether it is already running.
- `npm run check` runs Vitest, TypeScript, and Vite build. Latest code verification: 40 passing tests plus successful build. Tests are agent-authored, not independent mathematical certification.
- `dist/` is deployable to GitHub Pages. `vite.config.ts` uses relative asset paths by default, with optional `PAGES_BASE_PATH`, and emits an ES module worker. Serve over HTTP; file URLs are unsupported. There is no backend, account, runtime CDN, or external API requirement. No remote deployment has been performed.
- Adjacent deliverables are `outputs/geometry-whiteboard-source.zip` and `outputs/geometry-whiteboard-static.zip`. Source archive excludes `node_modules`, `dist`, and `.git`; static archive contains the contents of `dist` at its root. Refresh them when delivering changes.

Dependencies are locked in `package-lock.json`: React 19, TypeScript 7, Vite 8, Vitest 5. Use the lockfile rather than upgrading as part of unrelated work.

## Current product contract

The user wants a sparse, fluid, visual geometry board. Do not restore removed controls merely because their engine code remains.

| Area | Current behavior |
| --- | --- |
| Main toolbar | Select, Segment, Angle, Point, Hand, Undo, Redo |
| Drawing | Segment: two clicks or drag. Angle: vertex, first arm, second arm; optional degree input while drawing. Point: free or snapped to existing geometry. |
| Snapping | Enabled by default, no toggle button. Alt/Option temporarily bypasses snapping. |
| Selection | Normal click chooses an object; Shift-click adds/toggles. Rectangle selection supports Contains/Touches and object-type filters. |
| Segment controls | Length field, Midpoint, Whole support when a subsegment is selected, Make congruent for multiple segments, constraints access, delete |
| Angle controls | Degree field, Make congruent for multiple angles, constraints access, delete. Enter submits the degree field to preview. |
| Two connected segments | Expose their angle for editing through the degree field |
| Constraints | Collapsed initially. Explicit top-right expand/collapse button or selection's constraints button. Selection must not automatically open it. An already open panel updates with selection. |
| Camera | Hand or Space-drag pans; wheel/pinch zoom; zoom buttons and Fit |
| Document menu | Name, new blank board, editable JSON import/export, SVG snapshot export, local save status |
| Remaining bottom controls | Selection filter and Contains/Touches in Select mode; Chain in Segment mode; zoom controls |
| Sections | A Board / Practice / Cards control sits in the board's top-right group and at the top of the other two pages. The board is otherwise untouched. |

Removed intentionally: More menu, Ray, Line, Circle, Text creation tools and their R/L/C/T shortcuts; Geometry inspector sections, coordinate creation, object lists, observations; Bisect, Right angle, Set, Other side buttons; grid (#), + Select, Snap, and ƒx buttons. Use **Make congruent**, never **Equal**, for both segment and angle selection actions.

The G keyboard shortcut still toggles the grid even though its button was removed. Some legacy capabilities remain in code and persisted data; removal of a button was not a schema migration.

## Interaction details and selection pitfalls

`Canvas.tsx` owns drawing, snapping, hit testing, gestures, label editing, and the overlap picker.

- Point hit radius is 10 screen pixels; segment hit radius is 7. Convert tolerances by camera zoom rather than using fixed world distances.
- Hover previews highlight and name the primary candidate. Nearly equal candidates within 3 screen pixels of the best hit open a named picker on click release. Points currently take precedence over segments, which take precedence over angles, subject to the selection filter. This is not an exhaustive cross-type picker.
- Picker mouse hover and keyboard focus preview each choice. Choosing respects the Shift state captured at pointer-down. Escape or close dismisses it.
- Nested angle choices are ordered by angular size and deduplicated using board-aware angle identity. Ambiguous subsegment choices can also offer the whole support.
- Pending picker gestures distinguish clicks from movement above 3 pixels. If exactly one candidate is already selected, it can be dragged out of an overlap. Multiple selected candidates under the pointer are not resolved into a unique drag target by that path.
- New points along a support expose consecutive bounded segment pieces without destructively replacing the original edge. Use the full `SegmentRef`, not just edge ID, for selection membership.
- Click a point letter to rename it; Enter saves and Escape cancels. Reject empty/duplicate names. Dragging the letter changes its offset. The selected angle's small handle changes annotation radius, not angle measure.
- Pointer capture and child SVG handlers matter. Previously, captured double-clicks created extra text, angle handlers bypassed selection rules, and derived intersections produced duplicate choices. Test actual pointer sequences, not just helper functions.

## File map

| File | Responsibility |
| --- | --- |
| `src/model.ts` | Serializable types, geometry math, names and IDs, support projection/intersection, topology, angle identity, validation |
| `src/relationships.ts` | Segment pieces, congruence groups, angle combination/observations, marquee geometry, angle arc layout |
| `src/actions.ts` | Constraint/construction commands, saved angle reuse, arithmetic input parsing, duplicate/remap, dependency-aware deletion |
| `src/solver.ts` | Constraint residuals and bounded numerical projection, attachment/pin handling, solve results |
| `src/solver.worker.ts` | Browser worker request/reply boundary |
| `src/main.tsx` | App state, history, worker coordination, previews, persistence, keyboard shortcuts, toolbars, import/export |
| `src/Canvas.tsx` | SVG rendering, transient drawing state, camera gestures, hit candidates, picker, direct manipulation |
| `src/constraintEditing.ts` | Connected constraint scope and value editing by stable constraint ID |
| `src/ConstraintsPanel.tsx` | Constraint cards, editing/removal, group members, pins and attachments |
| `src/style.css` | App layout, SVG/toolbar styling, picker and responsive rules |
| `tests/geometry.test.ts` | 40 geometry/command regression tests for the whiteboard |
| `tests/practice.test.ts` | 35 tests for the symbolic core, oracle, reason catalogue and content |

### The practice layer, `src/practice/`

Nothing here imports from `main.tsx` or `Canvas.tsx`; the dependency runs one
way, so the whiteboard's contract is unaffected by changes to practice.

| File | Responsibility |
| --- | --- |
| `terms.ts` | Statement/Term model, polynomial normal form, linear-span solving, statement identity |
| `notation.ts` | Rendering statements as the reference writes them |
| `oracle.ts` | Resolving label references against a Board; measured vs marked facts; tolerances |
| `reasons.ts` | The catalogue of definitions, postulates, theorems and properties, each with a validator |
| `proof.ts` | Proof lines, strict step validation, circularity guard, solution replay |
| `inventory.ts` | Every segment, angle, ray and line a figure lets you name |
| `tokens.ts` | Toolbar-built expression tokens and their parser |
| `Figure.tsx` | Read-only figure renderer: marks, role colours, picking, dragging |
| `StatementBuilder.tsx` | Toolbar construction of a statement; no typing anywhere |
| `NameExercise` / `ConceptExercise` / `TranslateExercise` / `ProofExercise` | The four practice modes |
| `Flashcards.tsx` | Logic deck and definitions deck |
| `content/` | Figures, concepts, logic, proofs, translations and generators |

## How the proof checker works

Statements reference points by **label** (`AB`, `∠ABC`), not by board UUID, because
exercises are authored around named figures and that is how the curriculum writes
them. `oracle.ts` resolves a label to a real `SegmentRef`/`AngleRef` when geometry
has to be checked.

Every term normalises to a polynomial over atoms (`x`, length `AB`, measure `∠ABC`).
This makes commutativity, associativity and like-term collection automatic, so
`AB + BC` and `BC + AB` compare equal with no rewriting. Two consequences to know:

- Substitution is checked by solving `diff(conclusion) = Σ cᵢ·diff(premiseᵢ)` by
  Gaussian elimination, requiring at least two premises to carry a nonzero
  coefficient. This is sound, and it accepts multi-line combinations such as the
  three-line substitution in the reference's Fig. 5.
- Distribution is invisible to the normal form, so the distributive property is
  checked structurally instead, and substitution rejects a step that used no
  second equality.

The duplicate-line guard compares **written form**, not value, because
`3(x − 4) = 18` and `3x − 12 = 18` have the same value and are different lines.

`oracle.ts` separates `holds` (true of the current coordinates) from `marked`
(asserted by tick marks, arcs, right-angle squares or point placement). The
reference is strict that only marked facts may be read off a diagram, so the
`Given` reason accepts a positional fact or a tick mark but never "it looks
about equal". Tolerances are `EXACT` for authored content and proof checking,
and `HAND` for the drag-a-figure exercise, where nobody can land on 90.000°.

## Auditing content

`gallery.html` renders every figure in the library on one page, at
`http://127.0.0.1:4190/gallery.html` under `npm run dev`. It is a development
page only: Vite builds `index.html` alone, so it never reaches `dist/`. Look at
it after adding or changing a figure — several defects in this project were
visible at a glance there and invisible in the tests, including four arcs at a
crossing that together read as a circle, and rays drawn past the point that
labels them.

To read the generated questions as prose rather than as code, write a throwaway
test that walks the generators and dumps prompts, options and explanations to a
file. Wording problems — a stem that restates its answer, a missing article, a
converse with a stranded pronoun — are far easier to see in a flat list than in
the source.

## Adding content

- A figure: add a builder to `content/library.ts`. `Fig` throws on an
  unresolvable reference, and a test builds every library figure.
- A proof: add it to `content/proofs.ts` **with a `solution`**. The suite replays
  every solution through the real validator, so an unsolvable problem fails the
  build rather than reaching a student.
- A generator: emit the worked solution alongside the problem and add it to the
  replay test, as `anglePairProblem` and `segmentSumProblem` do.
- A concept: one entry in `content/concepts.ts` yields questions in all four
  directions and a flashcard; distractors are drawn from sibling concepts of the
  same kind at run time.

## Data model and identity

`Board` is version 1: `id`, `title`, arrays of `points`, `edges`, `angles`, `constraints`, `notes`, and informal `equations` strings. IDs are UUIDs. Names are presentation, not identity. Use `clone` (`structuredClone`) before mutations intended for a transaction.

- `Point`: coordinates, label, optional pin/label offset, optional `on:{edge,t,midpoint?}`, optional `crossing:[edgeId,edgeId]`.
- `Edge`: endpoint IDs and kind `segment | ray | line | circle`, optionally hidden. Legacy types remain loadable/renderable despite creation controls being removed.
- `SegmentRef`: `{edge,a?,b?}`. Optional endpoint IDs identify a bounded piece of a support.
- `AngleRef`: ID, vertex reference, start/end directions, sweep ±1, optional full turn, radius, label/expression. Vertex is `{point}` or `{intersection:[edgeId,edgeId]}`. Directions include edge ID, end point ID, and optional sign.
- Constraints: `equalLength`, `length`, `angle`, `equalAngle`, `sumAngle`, `parallel`, `perpendicular`, `bisect`. UI calls equality groups congruence groups. Pinning and incidence also live on points, outside the constraint array.
- Selection has separate point IDs, segment refs, angle refs, and note IDs.

Drawing coordinates are SVG-style, positive y downward. Displayed segment lengths use 50 drawing units per mathematical unit. Angles display degrees; internal calculations use radians. `AngleRef.radius` is used as a screen-space annotation preference.

Always use `angleKey(ref, board)` for geometric comparison. Its legacy no-board form serializes raw references and does not resolve aliases. The board-aware form normalizes ray sign/edge endpoint orientation and reversed naming/sweep. `namedAngleVertex` resolves declared crossing points, then coincident named points within 1e-4 drawing units. That fallback handles a point whose intersection attachment was removed. If moved away, it becomes distinct again. Naming uses the same resolver; unnamed intersections say `(intersection)` instead of a dot.

Identity is not based on angle measure. Two 45° regions must remain distinct. Current arm identity still depends on support endpoint IDs; arbitrary collinear edges with different endpoint IDs are not globally canonicalized.

`topology` builds junctions and directional sectors. Explicit incidence must be honored even when solver residuals place a point a little off a support. Overly tight geometric checks previously prevented one half of a crossing from being selectable.

## Rendering constraints versus measurements

Approximate measured angle labels use `≈`. Fixed-angle constraints use their declared input/value. Measurements and imposed constraints are not proof certificates.

`markingGroups` derives congruence markings from current constraints on every render. Removing a constraint removes its markings. Saved angle annotations may remain and that alone is not a stale constraint.

`angleDisplayRadii` places overlapping angles at a shared vertex in separate radial lanes, smaller first. A containing angle is at least 32 screen pixels farther out, plus room for active congruence strokes. Disjoint regions can share a radius. Custom radii are minimum preferences. This fixed nested ordinary arcs looking like double-arc congruence marks. Never solve that visual issue by inventing or deleting constraints.

## Transactions, solver, and persistence

Authoritative committed state is `board`/`actual.current`; `live` is transient drag output; `preview` is a proposed command result. Rendering prefers preview, then live, then committed board.

`command` clones the committed board, runs an action, optionally pins anchors temporarily, and sends it to the worker. A successful ordinary command opens Apply/Cancel; immediate commands commit directly. Failure shows a message and retains the last valid board. Epoch tracking ignores obsolete worker results. Requests use IDs and a 1.5-second UI timeout; default command solve budget is 400. Drag requests are queued/coalesced, with stale results rejected and final drag state committed through its history path.

`commit` records board and selection snapshots, caps history at 100, clears redo, updates revision, and clears transient state. Undo/redo cancel pending work. Preserve these boundaries when adding tools; do not mutate the live board from a picker or inspector input.

Local storage key: `geometry-whiteboard-v1`. Committed boards autosave after 180 ms. History, camera, current tool, and panel state are not persisted. Reload therefore resets those states. Invalid stored data is protected for export instead of overwritten. JSON import uses `validateBoard`; unknown versions are rejected. There is no migration from Geometry Studio.

Storage is origin-scoped: `localhost:4192`, `127.0.0.1:4192`, dev4190, and preview4191 are different boards. Multiple tabs on one origin can overwrite the same saved board; there is no collaborative or cross-tab merge. Test in an isolated origin or disposable board, and preserve the user's active drawing. Do not reload while the user is editing or before a pending save is complete.

## Remaining capabilities and limitations

Legacy notes, rays/lines/circles, bisector commands, combined/full/reflex angle helpers, observations, and informal equation UI code still exist. Their presence does not mean there is a current creation entry point. Existing constraints of legacy kinds can still be inspected or removed.

The typed statement model, proof checker, concept bank, logic deck and problem
generators now exist under `src/practice/`. Still not implemented: paragraph and
flowchart proof formats, coordinate-plane exercises (distance, midpoint formula,
partitioning in a ratio), compass-and-straightedge constructions, spatial
geometry, and any teacher-authoring interface. Proof checking is sound for the
rules in the catalogue but is not a general theorem prover: it validates the step
you claim, it does not search for a proof.

The solver is floating-point and bounded. Exact robust predicates, symbolic solving, certified compass traces, and a full broken-dependency repair UI are not implemented. Some topology failures reject edits; deleting supports removes dependents, recoverable through Undo.

Known verification gaps: physical touch, complete keyboard/screen-reader usability, cross-browser behavior, large crowded-board performance, and independent mathematical review. Browser checks in EVIDENCE are manual agent checks, not a committed automated browser suite. Large React files and some unreachable legacy code remain; avoid a broad cleanup during a targeted fix.

One observed UI edge case: cancelling an angle preview can leave the degree field showing the attempted value while the geometry reverts. This was seen during testing and has not been fixed. Also, help copy and historical design docs may mention workflows no longer exposed; verify before repeating them as current functionality.

## Verification checklist for the next agent

1. Reproduce a reported bug through the rendered UI before changing code. Capture the selected object names and active constraints, not only screenshots.
2. Inspect the implicated model/reference path. Add a focused regression for mathematical or identity changes; avoid tautological tests for simple wording changes.
3. Run `npm run check`, then repeat the user path on the production build. Source edits do not update the port4192 page until built and reloaded.
4. For selection changes, check single selection, Shift toggle, nearby segments, nested angles, picker focus, selected-object drag, zoom, and point-label editing.
5. For constraint changes, check preview/apply/cancel, failure preservation, removal, Undo, and live drag enforcement. Inspect strokes before assuming a visual arc represents a constraint.
6. Keep Constraints collapsed unless explicitly opened. Do not reintroduce removed controls or alter the user's persisted geometry as test setup.
7. Record concrete evidence and limitations in EVIDENCE, update this guide if the product contract changes, and refresh source/static archives.

