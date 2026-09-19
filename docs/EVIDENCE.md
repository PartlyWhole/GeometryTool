# Implementation evidence

Verified September 18, 2026. Checks are agent-authored and do not constitute independent mathematical or classroom acceptance.

## Automated checks

`npm run check`: 18 tests passed; TypeScript and production build passed.

Fixtures cover X and T junctions, near misses, coincident supports, ray/line continuation, constrained vertex movement, midpoint preservation, arbitrary and reflex measures, fixed-length conflicts, merging congruence classes, connected-region sums and rejection of gaps/duplicates, promoted intersections, malformed references and unknown relationships, dependency deletion, copying constrained geometry, and narrow marquee crossings.

## Browser workflows exercised

In the rendered application using browser interactions:

1. Blank board and compact controls.
2. Click-click and drag segment drawing; shared endpoint creation.
3. Select an angle formed by connected segments, preview/apply 90°, then drag a vertex with the relationship preserved.
4. Select two segments with + Select and make them congruent while preserving an existing right angle.
5. Reproduced reference-length drift during congruence. Added temporary reference anchors. Retested a 3-unit reference: it remained 3 units after Apply.
6. Add a midpoint, drag a host endpoint, and observe the midpoint and congruence relationships remain attached.
7. Enter 0°: repairable error with the previous drawing preserved. Enter 37.5°: valid preview and Apply. Undo restores 90°.
8. Reproduced an arc-position drag that was not committed on release. Fixed the release transaction. Retested and verified the exact rendered label position persisted after reload.
9. In the production build, draw crossing segments, select a derived sector, make it right, promote the crossing to a point, and move a support endpoint. The intersection follows the supports and the right angle persists.
10. Inspect the 390 × 844 responsive layout and use Fit.
11. Serve the compiled app beneath `/geometry-whiteboard/dist/`, draw an angle, and obtain a successful 90° preview from its worker. Both assets and worker function with relative subdirectory paths.

## Coverage boundaries

- These checks exercise core user workflows, but do not certify all W01-W30 scenarios.
- Touch gesture code has not been validated with actual simultaneous touch input on a physical device.
- No 200-segment/100-constraint performance percentile is claimed.
- Undo/cancellation epoch handling is implemented; exhaustive race scheduling and crash recovery testing remain.
- Browser validation was in the Codex in-app browser. Safari, Firefox, screen-reader, pen, and physical tablet testing remain.
- Numeric measures and relationship observations are approximate. No theorem certificates are produced.
- The current file format is version 1; unknown versions are rejected while preserving the current board. Migration from Geometry Studio is not provided.

## Text note editing fix

Reproduced the reported path: activate Text, create a note, then double-click its text. Two additional placeholders appeared. Text-tool pointer events bubbled into note creation, and pointer capture also retargeted Select-mode double-clicks to the canvas.

Replaced immediate placeholder insertion with a focused inline editor. Existing text intercepts Text-tool pointer events; Select-mode double-clicks resolve the note even when pointer capture retargets the event. Save commits a single change; cancel leaves the document unchanged. Legacy placeholder notes open with an empty editor.

Rendered production checks passed for immediate typing, Enter-to-save, Text-mode double-click without duplication, Select-mode double-click, canceling edits, canceling an empty new note, and editing legacy placeholders. TypeScript/build and all 18 existing geometry tests passed. These are agent-authored checks.

## Click-to-rename point labels

Point letters now open a focused inline name editor on click. Enter saves and Escape cancels. Empty and duplicate names cannot be saved. The operation changes the point's label while preserving its ID, coordinates, and geometric references. Dragging a letter retains the existing label-position behavior.

Browser checks passed for renaming A to X, canceling a duplicate B, Undo restoring A, clicking a letter in Text mode without creating a note, and dragging the letter without opening an editor. All 18 geometry tests and the production build passed. These checks are agent-authored.

## Angle editing from connected segment selection

Selecting two distinct finite segments sharing an endpoint now exposes the ordinary angle, highlights its arc, and enables existing measure/right-angle controls. The geometry command reuses saved angle references and preserves the segment selection. Disconnected, duplicate, and coincident-direction segment pairs do not invent an angle.

Browser verification: draw connected AB and BC, multi-select them, inspect the 120.5° field, set 60°, Apply, and observe both selected segments with a 60° arc. Dragging a vertex preserves the relationship; Undo restores the previous geometry. Four added regression cases cover endpoint/selection order, persistent custom measures and constraint reuse, disconnected pairs, and straight/overlapping cases. All 22 tests and the production build passed. Checks are agent-authored.

## Direct selection between points on a support

The canvas now resolves a segment click to the bounded interval between consecutive named points on that support. Each part retains its parent support ID plus endpoint references. Selection membership compares the complete reference, so clicking another part switches selection and additive selection keeps both. Rectangle selection uses the same parts. A Whole button restores the original support selection.

Browser checks passed: draw DE, add midpoint F, click DF, click FE (only FE highlighted), append DF (two selected segments), enclose DF with a rectangle, and choose Whole DE (length returns from 4 to 8 units). Three new tests cover interval hit testing, near misses/duplicate coordinates, and finite parts on an infinite line. All 25 tests and the production build passed. Checks are agent-authored.

## Crossing splits both supports

Reproduced on the user's open drawing: AE was selectable, while clicking CE selected the whole CD. Subsegment discovery and hit testing used a positional tolerance smaller than the solver's accepted residual, ignoring the declared intersection on one support.

Discovery now honors declared attachment/intersection references and uses support parameters for interval hit testing. Free near-miss points still do not create splits. Verified on the same drawing after rebuilding: CE, ED, AE, and EB all select independently and show their respective lengths. Two regression cases cover numerical residuals on crossing/attached points and rejection of unbound near misses. All 27 tests and the production build passed. Checks are agent-authored.

## Direct selection of angle regions

Promoted crossings now form one named junction using declared incidence, including solver residuals. Clicking an existing broad angle's filled region resolves the smaller elementary region beneath it. Additive angle clicks toggle membership. Adjacent sections of a single support can identify their straight angle; editing does not bend the rigid support.

Browser checks on the user's crossing selected AED, DEB, BEC, and CEA separately, then selected two together. On a separate test board, a new arm split a displayed 90° angle: clicking each side selected DAB and CAD at 45°, rather than the original 90° region. Three added regressions cover promoted-junction uniqueness, subdivision, and same-support straight angles. All 30 tests and the build passed. Checks are agent-authored.

## Selection constraint inspector

Selecting a segment or angle opens an editable constraint panel. Related geometry is collected through shared endpoints, attachments, and relationship dependencies. Show all on board includes disconnected figures. Cards expose existing fixed values, angle sums, group members, parallel/perpendicular settings, pins, and attachments. Numeric changes preview through the solver; relationship removals retain geometry and are undoable. Controls are disabled during a pending preview.

Browser checks: selection automatically opens the panel; adding a fixed length produces its card; updating 4 to 6 previews and applies; -1 is rejected without changing the current length; removal clears the card and Undo restores it. Added tests cover related-component scope, stable-ID length edits, invalid values, and arithmetic degree edits. All 33 tests and the production build passed. Checks are agent-authored.


## One visual per geometric angle

Reproduced duplicate approximate and fixed 45° labels on the open drawing. Angle identity previously compared raw references, so signed directions, reversed naming/sweep, and named versus derived crossing references could represent the same region separately. Board-aware matching now normalizes those references, deduplicates rendered angles, and reuses fixed constraints during edits. Equal measures at different regions remain distinct. Existing saved geometry is retained.

Browser verification on an isolated production board: draw two connected segments, select their 45° region, set and apply 45°, deselect and reselect. One arc and one exact 45° label remain, with one fixed-angle constraint. The original tab's drawing changed during verification, so the final interaction check used an isolated board. Four agent-authored regression cases cover direction aliases, reversed naming, promoted intersections, constraint reuse, and distinct equal-measure regions. All 37 tests, TypeScript, and production build passed.


## Constraints-only sidebar

Removed the Geometry sidebar's coordinate creation, object lists, geometry observations, and extra action sections. The sidebar now contains only the constraint editor, with appropriately named open/close controls. Canvas selection tools remain available. Updated help text and removed unused sidebar state/imports.

Agent-authored browser check on the production build confirmed that opening Constraints shows the existing fixed angle with editable value, removal, scope, and selection controls, and no Geometry sections. All 37 tests and the TypeScript/production build passed.


## Direct Hand tool

Replaced More with Hand in the main toolbar. Ray, line, circle, and text creation tools and their keyboard shortcuts are no longer exposed. Existing board objects remain supported. Agent-authored browser verification confirmed the five-tool toolbar, direct Hand activation, and that R/L/C/T do not switch away from Hand. All 37 tests and the production build passed.


## Overlap selection and hover previews

Added a screen-space candidate picker for nearly equally close points and segments, and overlapping/nested angle regions. Hover and keyboard focus highlight the candidate on the canvas; ordinary hover names the primary target. The picker preserves additive selection, offers whole supports when ambiguous subsegments are listed, orders smaller angle regions first, and deduplicates equivalent angle references. Point and segment hit tolerances remain constant in screen pixels. Clicking opens the picker on release; dragging an already selected unambiguous candidate out of an overlap retains direct manipulation.

Agent-authored production browser checks: two segments three pixels apart produced named choices; choosing DE selected only DE; additive choice of FG selected both; a selected DE dragged away without a picker; subdividing a saved 45° angle offered both the 22.2° region and the original 45° angle, and selecting the original showed its correct controls. All 37 existing tests passed; TypeScript and production build passed. No new automated UI tests were added.


## Nested arcs resembling removed congruence marks

Reproduced on the user's drawing at F. DOM inspection confirmed that 35.3°, 20°, and 97.5° each had only one ordinary arc and no congruence strokes. The encompassing 97.5° arc was only 10 screen pixels away from the smaller arcs, resembling a double-arc marking.

Added deterministic screen-space arc layout: overlapping angles at the same vertex get separate radii, with containing angles outside their children and at least 32 pixels of separation plus room for active congruence strokes. Disjoint regions can share a radius. Existing custom radii act as minimum placement preferences; the board and constraints are unchanged. Browser verification on the same drawing confirmed separated 35.3° and 20° arcs with the 97.5° arc outside them. Two agent-authored regressions cover nested/disjoint layout, order independence, and removal of congruence marks. All 39 tests and the production build passed.


## Named angle after releasing intersection attachment

Reproduced two picker entries for ACE and A·E at 77.1° on the user's drawing. Naming and identity only recognized an intersection through an explicit crossing attachment. A shared resolver now also recognizes a named point coincident with the intersection within numerical tolerance, and both angle naming and identity use it. Unnamed intersections display an explicit (intersection) label instead of a dot.

Verified on the same drawing after rebuilding: clicking the region directly selects ACE at 77.1°, with one arc and no duplicate picker. An agent-authored regression covers removed attachments, numerical residuals, and moving the detached point away so it becomes distinct. All 40 tests and the production build passed.


## Manual constraints sidebar and simplified angle actions

Removed the Bisect action from angle selection controls. Selecting geometry no longer opens the constraints sidebar. The top-right button explicitly expands/collapses it and exposes its state for accessibility. Agent-authored production browser checks confirmed segment and angle selection leave it closed, manual expand/collapse works, and angle controls contain no Bisect action. All 40 tests and the production build passed.


## Minimal angle controls

Removed Set, Other side, and Right angle buttons. The degree field retains Enter-to-preview and now explains that shortcut in its tooltip. Agent-authored production browser verification confirmed the reduced toolbar and that typing 60 then Enter previews the angle change. All 40 tests and the production build passed.


## Reduced canvas controls

Removed grid, Snap, + Select, and equations buttons. Snapping stays enabled by default, with the existing temporary Alt/Option override; additive selection remains available through Shift. Empty bottom tool containers are hidden. Agent-authored browser verification confirmed the removed buttons are absent. All 40 tests and the production build passed.

## September 19, 2026 — Practice and Cards sections

Added four exercise modes and a flashcards page on top of the existing
whiteboard, built against *Geometry Module 2 — Reasoning, Proof and Measure*.

### Automated

- `npm run check`: 75 tests, TypeScript, and the production build pass
  (40 pre-existing whiteboard tests, 35 new).
- Every one of the 11 authored proofs is replayed through the strict validator
  and must reach its goal; 120 generated proofs (40 seeds × 3 templates) are
  replayed the same way. An unsolvable problem fails the build.
- The reference's own worked proofs are encoded as tests: Fig. 5 (adding a
  shared angle) and the §9 Vertical Angles Theorem proof, step by step.
- The three mislabellings the reference warns about are asserted to be
  rejected: step 3 is reflexive not transitive, step 4 is the addition property
  not reflexive, step 6 is substitution not symmetric.
- The Segment Addition Postulate is asserted to fail when the middle point is
  not between the others — the Fig. 3 counterexample arrangement.

### Browser checks (manual, agent-driven, Chromium in-app pane)

- Built the complete Fig. 5 proof through the UI toolbar: seven steps, all
  accepted, goal reached, citations rendered.
- Confirmed rejections surface in the UI for a mislabelled reflexive step,
  substitution with nothing cited, and a bad parts/whole arrangement.
- Diagram → equation accepted `AC − AB = BC` for an item expecting
  `AB + BC = AC`, the postulate "run backwards" the reference describes.
- Description → figure: dragged B to the midpoint of AC; live readout showed
  AB 3.00 / BC 3.00 and the check passed under hand tolerance.
- Both flashcard decks: logic cards answered with explanation, definition cards
  flipped, filtered by kind, and shown with embedded figures.
- Board regression: same seven toolbar buttons, constraints still collapsed on
  load, page nav added to the existing top-right group only.

### Defects found and fixed during this work

- Point and segment hit targets were covered by their own decorative shapes, so
  a click on the centre of a point did nothing. Pointer events are now confined
  to the `-hit` layers.
- Rays and lines were drawn to `view.w + view.h`, roughly twice the viewBox, so
  they bled into the letterbox gutters. They are now clipped to a viewBox grown
  to the rendered aspect ratio.
- A point's letter could be placed along the continuation of a ray through it.
  Label placement now treats a ray or line as occupying both directions.
- An angle in congruence class 1 was drawn with a base arc *plus* one mark,
  reading as a double arc. It now draws exactly as many arcs as its class.
- The duplicate-line guard compared polynomial value, which made a distributive
  step look like a repeat of the line above it. It now compares written form.
- Construct tasks made every point draggable regardless of the prompt, and used
  exact tolerances that no hand could hit. Each task now names its movable
  points and is checked under a hand tolerance.
- Citation-count messages read "needs at least 2 to be cited". They now name
  the unit, and a line whose two sides are the same quantity is told
  specifically that its reason is the Reflexive Property.

### Limitations

- Proof checking validates the step you claim under the rules in the
  catalogue. It is not a theorem prover and does not search for a proof.
- Transitive and substitution overlap, and the reference says either is usually
  accepted; both are accepted where their shapes fit.
- "Simplify" is offered as an algebra step. Some courses require the property
  to be named instead; remove it from the catalogue if that is the house rule.
- Not implemented: paragraph and flowchart proof formats, coordinate-plane
  exercises, compass-and-straightedge constructions, teacher authoring.
- Touch-drag, screen readers, cross-browser behaviour and independent
  mathematical review remain unverified.
