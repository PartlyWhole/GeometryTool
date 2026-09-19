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

- `npm run check`: 131 tests, TypeScript, and the production build pass
  (40 pre-existing whiteboard tests, 91 new).
- Every generated multiple-choice card is asserted to carry four distinct
  options with a valid answer index and a real explanation.
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
- The Board/Practice/Cards nav sits inside the board's top-right group, whose
  `.top-right button { width: 36px }` also reached it. Above 900px, where the
  nav shows its labels, the text overflowed and overlapped. Found only after
  testing at desktop width; the earlier pass ran at 536px, where the labels are
  hidden by design. The nav now sizes to its content.
- Two practice rules leaked onto the board: `button.primary` outranked the
  board's `.primary` on specificity, and `.muted` styled a previously unstyled
  paragraph in the constraints panel. Both are scoped to `.app-page`.
- The naming exercise could draw a straight angle as its target — on the
  collinear figure, "name ∠ABC" showed nothing to look at and offered no real
  choice. Straight angles remain in the inventory, since the statement builder
  needs them and the module teaches them directly; only the naming drill
  excludes them.

### Second review pass

Found by the user exercising the deployed build, and fixed:

- `∠AXB` on the crossing figure is a straight angle, because A and B are
  opposite ends of one line through X. The first straight-angle fix filtered
  by measure and did cover it, but the case is now pinned by name in a test.
- Highlights matched whole edges only, so "the highlighted segment" showed
  nothing whenever the answer was a piece of a longer support, such as BC
  inside A—B—C. Highlighted segments are now drawn as their own overlay
  between their real endpoints.
- An angle highlighted as ∠AXD but drawn as ∠4 got no colour, because the
  lookup compared names. Angle highlights now match on resolved geometry, so
  either notation reaches the same arc.
- The naming exercise carried A/B/C/D option badges, which collide with
  answers that are themselves point letters ("A. AC"). Removed for that mode.
- The concept quiz asked "Which term does this define? *If two angles form a
  linear pair, they are supplementary.*" — a spot-the-phrase task, not a
  question about the theorem. Definition questions are now suppressed when the
  text restates the term, and such concepts are reached through their examples.
- That guard did not fire at first: its stemmer reduced "angles" to "angl"
  rather than "angle", because the alternation `(ness|ity|s|es)$` matched `es`
  before `s`. The stop word never matched, so "angl" stayed in the required
  set and no text could satisfy it. Replaced with a plural strip plus a
  six-letter root, which also makes congruent/congruence and
  supplement/supplementary agree. The predicate is exported and tested
  directly on both the cases it must catch and the ones it must not.
- Quiz feedback repeated the definition the student had just chosen. Every
  concept now carries a `because` explaining why it holds or what it is for,
  and a test asserts the explanation differs from the definition.
- "Which statement defines vertical Angles Theorem?" — the sentence-casing
  helper lowercased only the first word of a proper name. Named theorems,
  postulates and properties now keep their capitals, and theorems are asked
  with "What does the X say?" rather than "defines".
- The Congruent Supplements and Congruent Complements options ran to a full
  line each. Concepts may now carry a `brief` used for options, keeping the
  reference's full wording for flashcards and explanations.
- One example gave its answer away in prose the checker cannot see — "conclude
  3x = 30, by adding 12 to both sides" for the Addition Property. Clause cut.

New exercise, at the user's request: naming items that move between the two
ways of naming an angle — clicking the three points that name a marked ∠2,
and picking which marked angle a three-point name refers to.

### Third review pass

- The concept quiz asked "Which term does this figure illustrate?" over the
  perpendicular figure and offered "Supplementary angles" as a distractor. The
  figure contains a linear pair of two right angles, which *are*
  supplementary, so the question had two correct answers. A figure now
  declares every concept it genuinely shows, and none of those may be offered
  against it.
- The same figure's caption read "PQ ⊥ AB", stating the answer in notation the
  word-based leak check could not see. Notation is now spelled out before the
  check, so ⊥, ∥ and ≅ count as their words.
- Two concepts, then two more, silently produced no questions at all once the
  leak guard was added — the guard suppressed both definition directions and
  their only examples leaked too. Distractors are now drawn from a wider
  candidate list, the affected concepts gained non-leaky examples, and a test
  asserts every concept in the bank can still be asked about.
- `undefined-terms` produced nothing for a subtler reason: `rng` is an
  xorshift seeded directly, and consecutive small seeds gave correlated
  opening values, which biased the shuffle enough that one concept never
  reached the front of the list across three hundred seeds. The seed is now
  avalanched before use. The application passes large random seeds, so this
  was invisible in normal use and only showed under a systematic sweep.
- Added a build id, shown at the foot of the Practice and Cards pages and set
  from the commit SHA in CI. Several defects in this session were reported
  against a cached bundle that already contained the fix; the stamp makes that
  answerable instead of guesswork.

### Fourth review pass

- Distractors were chosen by concept *kind*, so "Congruent segments" could be
  offered against "Right angle", "Linear pair" and "Complementary angles" —
  three angle terms against a segment term, answerable without knowing any
  geometry. Concepts now carry a topic (space, segment, angle, algebra,
  logic) and distractors are drawn from the same topic first. The segment
  questions now read Betweenness / Midpoint / Segment bisector /
  Perpendicular bisector, which is the blur the reference warns about in
  Fig. 9.
- A figure may now stand as an "illustrate this" stem only for the one
  concept it is really a picture of. The perpendicular figure equally shows a
  midpoint, a linear pair and supplementary angles, so asking which term it
  illustrates had several right answers even after excluding co-true
  distractors.

### Fifth review pass

- Picking an object in the statement builder left the slot empty and moved the
  focus on anyway. The pick handler called `onChange` twice — once to set the
  value, once to advance the focus — and both were derived from the same
  prop, so the second overwrote the first. Filling and advancing is now one
  update, and a test walks the same sequence and asserts the first slot holds
  its value before the second is chosen.
- Figures now draw any measure they declare, which test-style figures state on
  the drawing. Angle labels sit outside the arc, since a vertex carrying three
  narrow angles put them on top of each other.
- Diagrams added from the Form A paper: three lines through one point with two
  measures stated (Q11), and the transversal figure with its two independent
  tick classes (Q12, Fig. 18).
- Proofs that described their geometry in words now show it. Two right angles,
  the supplementary-plus-congruent question, and the Congruent Supplements
  Theorem all have figures. The last was rewritten to its general form —
  supplements of *congruent* angles rather than of the same angle — because
  the single-angle version can only be drawn as a crossing, where the two
  angles are vertical and the conclusion follows by the wrong theorem.
- Generated problems are drawn to scale: a test parses the measure each
  problem states and asserts the figure's own angle matches it, so the drawing
  cannot drift from the numbers.

### Sixth review pass

- Statements can now be built by clicking the figure. Two points name a
  segment, three name an angle with the vertex in the middle, and clicking a
  drawn arc names the angle it marks. The chip palette remains, for figures
  with no arcs and for problems with no figure. Reading a diagram is the skill
  under test, so hunting for "m∠PVR" in a list was the wrong default.
- That immediately exposed a naming problem: clicking an arc names the angle
  by its label (∠X), while the palette offers its three-point name (∠PVR).
  Both are the same angle, and only one was accepted. Comparison is now done
  modulo naming — every angle is resolved through the figure before statements
  are matched — in the read exercise, in every proof step, and in the
  goal check. A student who clicks the arms is judged the same as one who
  clicks the arc, and a genuinely different pair still fails.
- The same fix removes a latent unfairness in the proof builder, where a given
  written as ∠1 would have rejected a line the student built as ∠AXC.

### Seventh review pass — full content audit

Every figure rendered and looked at, and all 589 distinct generated items
read as prose: 135 concept questions, 146 logic cards, 308 naming items, 19
translation items, 11 authored proofs and the 43-entry concept bank. Found:

Correctness
- The transitive proof said "prove AB ≅ CD" while its goal was AB ≅ AC, on a
  three-point figure where that is impossible. Rebuilt on four collinear
  points with three ticked pieces.
- A figure of three angles totalling 180° was offered as illustrating
  "Angles around a point", which is 360°. That concept now has a figure of
  four rays closing the full turn.
- "Only the segment has a length, because only the segment has two ends" was
  offered as the *definition* of segment, ray and line. It is a remark about
  them; replaced with a definition.

Questions that could be answered without the geometry
- "Which postulate says this?" offered two options that were not postulates,
  halving the field by category alone. The kind is named only when three
  same-kind distractors exist to go with it.
- Two naming distractors could be one angle spelled two ways (∠CAV and ∠VAC),
  so both could be struck out on sight. Options are deduplicated by canonical
  key, and only one vertex-misplacement is offered.

Feedback
- Sixteen questions opened their explanation with the definition already
  printed in the stem. Feedback never falls back to the definition now.
- The Segment Addition Postulate's `because` and `watch` said the same thing,
  so its feedback repeated itself.
- Negation cards explained all three wrong options at once. Each option now
  carries its own reason and only the chosen one is shown.
- A figure caption restated its theorem instead of describing the figure.

Language
- Law of Syllogism chains stranded pronouns exactly as the conditionals had —
  "If it is a rectangle, then it has four right angles" — because `CHAINS`
  was a separate type the earlier fix did not reach.
- Terms lacked articles: "an example of acute angle".
- A coefficient of 1 printed as "1x" in the Given panel while the prompt said
  "x".

Figures
- Arcs were drawn round every named angle, so four numbered angles at a
  crossing read as a circle. An arc now means a congruence class, a right
  angle, a stated measure or a highlight; a numbered angle gets its numeral.
- Rays overshot the points naming them; angle figures stop at the point.
- Right-angle numerals sat 60 units from an 18-unit square.
- Numerals for two parts and their whole collided at a shared vertex.

Also: an item promised in its explanation an answer it refused; two read items
were near-duplicates; one drag task answered its own second half; one figure
named angles ∠A, ∠B, ∠C at vertices V and W.

### Eighth pass — clearing what the audit set aside

The audit listed several things as minor and moved on. They are now done.

- Two drag tasks existed for angles and none for segments, and the `forbid`
  mechanism was used once. Added "make ∠1 and ∠2 supplementary without their
  being a linear pair", which is the distinction the reference stresses and
  which the figure makes visible — the two never touch, so the forbidden
  condition can never be met. Added "drag B until AB is twice BC".
- A test now searches for a position of each movable point that satisfies its
  task, so an unreachable drag task fails the build. This is the construct-mode
  counterpart of replaying every proof. It found nothing wrong with the
  content, but the first version of the search failed two items by centring
  on the wrong point, which is worth knowing when reading it.
- Every always/sometimes/never card ended with the same three-clause reminder.
  Each wrong verdict now gets its own line saying what that verdict would have
  required, and the shared tail is gone.
- The midpoint concept had only a figure, so it could never be asked "which of
  these is an example of a midpoint?".
- Tick counts on the Fig. 18 figure were the reverse of the reference: AD ≅ BC
  now carries two ticks and EB ≅ DF one.

Checked and left alone, with reasons: the `straightInDisguise` figure is tight
in the gallery's three-column grid but renders well at exercise size; "the
original conditional" is never the right answer on a classify card, but the
student can see Statement 2 differs from Statement 1, so it does not narrow
the real choice; the `Proof` concept does have an example, and its absence
from the audit dump was truncation.

### Ninth pass — the answer formats the paper uses

An audit against the Form A paper found the app covered the concepts but
missed three whole answer formats and one problem type. All four are built.

- **Numeric answers.** Nothing in the app had ever asked for a number, while
  seven of the paper's thirteen questions do. A new Solve mode takes an answer
  on a keypad — no typing, for the same reason statements are built from a
  palette. All seven Form A numeric questions are present, plus generators for
  linear pairs, complements, crossings, whole-minus-part and solve-then-
  substitute. An item may declare the value of x separately: a student who
  enters x is told exactly that, which is the trap the reference says these
  questions are built to provoke.
- **Fractions and decimals.** Generated algebra used integer coefficients only,
  while §10 has a subsection on clearing fractions and Q4 is exactly that.
  A generator now emits them, and a test recovers the fraction and the decimal
  from the wording a student reads and checks that working it out lands on the
  stated answer. That test immediately caught two bugs: the decimal had been
  rounded, so computing from it missed the answer, and the glyph table was
  indexed off by one, so ½ printed as ⅓.
- **Select all that apply.** Every multiple choice had been single-answer. Two
  formats now exist: which statements a marked figure actually supports
  (Q12 Part A, reproduced exactly — the answer is AD ≅ BC and EB ≅ DF), and
  which lines of a finished proof carry the right reason (Q6).
- **Checking reasons** reuses the worked solutions the proofs already carry, so
  no proof is authored twice. A reason is only offered as wrong when the
  validator confirms it genuinely fails — transitive and substitution overlap,
  and the reference says either is usually accepted, so a label that would have
  been allowed must never be marked wrong. The explanation shown for a spoiled
  row is the validator's own message.

### Tenth pass — questions in parts

The paper asks two questions in parts, where the figure and the work are
shared and Part A usually produces something Part B needs. Both are built,
along with a generator for the shape the reference warns about most: Part A
asks for x, Part B asks for the measure the question was about, and entering
x there is named as such.

A finished part stays on screen with its answer, because hiding it would make
Part B harder than the paper intends. Tests assert that the two parts of a
generated question never share an answer — Part B would teach nothing — and
that Part B's trap value is exactly Part A's answer.

### A stem that contradicted itself

"Which of these does this define? *Accepted without definition. Everything
else in geometry is defined using them.*" — asking which term a statement
defines, about the three terms that are defined by nothing. The same class of
error as offering a remark in place of a definition, caught earlier for
segment/ray/line and missed here. Undefined terms are now asked with
"describe" rather than "define", and a test asserts the word "define" never
appears in a question about them.

### Content review, and asking a theorem one step at a time

A fresh-context reviewer was given only the two source documents and a dump
of everything the app teaches and asks — no access to this project's
reasoning or its tests — and asked adversarially for mathematical errors,
invalid proof steps, wrong answers and divergences from the reference. It is
not independent in the strict sense: same model, so shared blind spots are
likely. It recomputed every numeric answer and every always/sometimes/never
verdict and found all of them correct. Sixteen defects were reported; three
were artifacts of the dump's format rather than the app, and are recorded
here so they are not "fixed" later by mistake.

Real, and fixed:
- The Congruent Supplements proof cited Substitution for a step that also
  performed a subtraction. The reference splits this, and this app's own
  Vertical Angles proof splits it; the two now agree.
- "A linear pair on a line" proved the Linear Pair Theorem by citing the
  Linear Pair Theorem, in an app that teaches "the thing you are proving may
  never appear as a reason". It is now a genuine use of the theorem: given a
  linear pair and one measure, find the other.
- Two proofs justified a premise read off the diagram with a definition.
  A definition says what a phrase means; it cannot establish that two angles
  form a linear pair. The reference calls that line "Given (from the
  diagram)", and so does the app now.
- The concept bank and the reason catalogue gave different definitions of
  vertical angles, and the bank's was too weak to exclude non-vertical pairs
  where three lines meet. Both now say "two pairs of opposite rays".
- The midpoint converse was graded false while the structurally identical
  bisector converse was graded true. The definition is reversible, as the
  reference says twice; the converse only failed because it omitted "M lies
  on AB". That clause is restored, and the subtlety it carried has become a
  counterexample item of its own.
- Two negation distractors were as defensible as the keyed answer:
  "measures 90° or more" is equivalent to "is not acute" over this module's
  range, and "form a triangle" is equivalent to "are not collinear". Both
  replaced, and one rationale that asserted a falsehood removed.
- A select-all explanation said "AP and PB look equal, and they are" in an
  item whose whole point is that the figure cannot tell you.
- "Multiplying both sides by the same nonzero number" — multiplication by
  zero preserves equality; only division needs the caveat.
- Two smaller wording fixes: an explanation that implied a line has a length,
  and one that named a single distractor where two shared the flaw.

Reported but not defects: the false "biconditionals" appear only inside the
question "Can these be combined into…?", where the answer is no; the bisector
proof does reach its goal, because statements compare by value and
m∠AVD + m∠AVD is 2 m∠AVD; and the 87° in one explanation is declared by that
figure.

Asking a theorem one step at a time. The Congruent Complements Theorem had
only prose examples, so a question about it was near-unanswerable without a
picture. It now has the figure its proof is drawn on — two right angles
sharing the ∠2 between them — and the proof is available as separate
questions: write the equation each right angle gives you, then write the
conclusion as a congruence. A new "One step" mode generalises this to every
proof in the app: one line, the lines it rests on shown above it, and four
reasons to choose between. Every distractor is one the validator genuinely
rejects for that step, checked over 30 seeds.

### A Concepts page

Practice tests what a student knows and Cards drill it; neither explains
anything. A fourth page now does, covering all 43 concepts in 179 steps.

A step carries a sentence and may carry a figure, a highlight, a line of
algebra, or all three. A step without its own figure keeps the one before it,
so the common case is the figure standing still while the highlight moves —
which is what makes it a walkthrough rather than a caption. The Vertical
Angles Theorem, for instance, runs: both linear pairs picked out in turn, the
two sums shown, then the subtraction, with the algebra line changing
underneath each time.

Fourteen concepts carry no figure. The properties of equality and the logic
of conditionals are better shown as a ladder of statements, and the page says
so rather than inventing a picture.

Two figures were added for it: a segment, a ray and a line side by side, where
the ray and line running off the frame is the point; and the four angle
classes with their measures.

A test walks every step of every walkthrough and resolves each highlighted
object against whichever figure is in effect at that step, so a highlight can
never name something the figure does not contain.

### A caption that contradicted its own figure

The Betweenness walkthrough said "these three are still collinear, but C now
lies outside AB" over a figure in which C sits squarely between A and B. The
figure is right — its own title is "B outside AC", and the order along it is
A, C, B — so it is *B* that is no longer between the other two. The same
mistake was in the concept bank's caption for that figure. Both are corrected
and the highlight now falls on B, the point the sentence is about.

Two earlier defects were of this class — a stem asking what an undefined term
defines, and a remark offered in place of a definition — so it now has a
guard. A walkthrough step may declare the positional facts it asserts, and a
test checks each one against whichever figure is in effect at that step. 34
claims are checked this way, covering betweenness, collinearity, midpoints,
interior rays, adjacency, vertical pairs, linear pairs, and the supplementary
and complementary relationships each theorem rests on. A sentence can still
be wrong in ways prose alone can be wrong, but it can no longer contradict
the geometry it is printed beside.

### Reading the concepts as a student would

All 43 walkthroughs, 179 steps, were dumped to prose and read in order rather
than inspected as code. Eleven problems surfaced, and the largest was
structural: 21 openers restated the definition the Concepts page already
prints directly above them, seven of them word for word. Half the
walkthroughs were spending their first step saying something the reader had
just read. Every one now orients, sets up the figure, or poses the question
the concept answers. The detection was mechanical — word overlap between
step one and the definition — and it now sits at 75% for one concept whose
overlap is incidental and below 55% for the rest.

The same measurement found the "Watch out" box repeating the walkthrough's
own last step on most concepts. It no longer renders on the Concepts page;
it stays on the flashcards, where nothing else carries it.

Four problems were about figures contradicting or failing their text: ray
and line highlights coloured only the drawn portion, so the concept whose
whole point is where a thing stops was drawn as if it stopped early; the
segment-bisector walkthrough said a bisector "need not be perpendicular"
over the perpendicular figure and nothing else; a step told the reader to
move points on a static figure; and two steps named objects they did not
highlight. The rest were smaller: a claim that four angle classes "cover
every case", which reflex angles do not; a denial that position matters
printed over a figure where position plainly did; and two steps missing the
equations their counterparts in the parallel theorem carry.

One defect was typographic rather than editorial and had been present from
the start. Inter has no glyph for ∠ or ≅, and the system fallback draws them
at roughly half the cap height — measured at 5.68px against 11.27px at body
size — so "∠ABD" reads as "₂ABD". 419 occurrences of ∠ and 53 of ≅ were
affected. A unicode-range face maps those code points to a font that draws
them full size; the measurement is now 9.91px.

### Narrowing the scope

Four topics were cut on request, taking the concept count from 43 to 39. In
each case the concept, its walkthrough, its flashcards and its share of the
generated questions go together, because all of them are derived from the
one concept record.

**Betweenness** is covered by collinearity plus the Segment Addition
Postulate, so it is no longer a concept of its own. What it taught was not
dropped: the postulate now carries the hypothesis as a warning, and the
counterexample figure — three collinear points in the order A, C, B, where
AB + BC = AC fails — became a step in the postulate's own walkthrough, which
is what it was always really about.

**Planes** are out of scope; the module works with points, lines and angles.
The coplanar concept is gone, as are the two always/sometimes/never items
about planes and a negation distractor that turned on any three points being
coplanar. Replacements were written in the remaining domain so the verdict
spread stays even. The undefined terms are now given as point and line.

**Segment versus ray versus line** is gone as an explicit concept, along
with its figure. Rays and lines still appear as machinery — an angle
bisector is a ray, a linear pair stands on a line — but the module does not
drill the three notations against each other.

**The Law of Detachment** is gone as a concept, with its walkthrough and its
generated flashcard. The Law of Syllogism remains.

A sweep checks what these removals could have broken: every walkthrough
names a live concept, every concept has a topic row and a walkthrough, and
every entry in the figure tables names a concept and a figure that still
exist. It reports consistent.

### Giving every concept something to look at

Thirteen concepts had no figure anywhere in their walkthrough — the eight
properties of equality, the four reasoning concepts, and point and line.
They now all do, and the properties carry both forms: the algebra they are
usually stated in, and the same move made on a figure.

Symmetric turns AD ≅ BC into BC ≅ AD on a ticked pair. Transitive walks a
chain of three congruent parts, with the middle one marked as the hinge.
Addition adds the shared angle to two marked-equal angles; subtraction takes
the shared angle away at a crossing. Multiplication doubles a half of a
bisected segment, division halves a bisected angle, substitution puts a
number where a length stood, and distributive counts one segment's three
equal parts two ways. In every case the figure is one the module already
uses, so the property is seen in the place it will actually be needed.

The reasoning concepts got concrete cases rather than descriptions.
Inductive reasoning now measures three linear pairs — 130° and 50°, 90° and
90°, 35° and 145° — reaches the conjecture that they always total 180°, and
then says why three cases are not the reason it is true. Deductive reasoning
applies the Vertical Angles Theorem to a crossing without measuring
anything. The Law of Syllogism chains "vertical implies congruent" with
"congruent implies equal measure" over the same crossing.

Point and line are now shown rather than stated: one figure with a single
point, one with the line through two points. The concept no longer talks
about being undefined, which also means there is nothing to ask about it
that is not a reading test — it is exempt from the flashcard coverage check,
and the check asserts the exemption still names a real concept.

The proof concept walks an actual proof, the reference's Fig. 5: given
∠WVX ≅ ∠YVZ, prove m∠WVY = m∠XVZ. It reads the given first, then the goal,
then looks for what the two share before writing anything — the shared angle
is highlighted as the bridge — and only then works through the six lines,
each with its reason. Every claim it makes about that figure is checked
against the oracle, as all walkthrough assertions are.

A step with neither a figure nor a line of algebra used to render a box
saying so. It now renders nothing. The concept list is sticky and scrolls
inside itself, so choosing the next concept no longer scrolls away from the
one being read; below 820px it stacks above the content and stops sticking.

### A highlight that overshot what it named

Highlighting a whole ray or line used to follow it out to the frame. That
was added so the segment/ray/line concept could show a ray carrying on past
its drawn portion — and when that concept was cut, the behaviour was left
behind with one user it did not suit. Marking AB on the line through A and B
coloured the whole line, well past both points.

A highlight now spans exactly the two points it names. The line is still
drawn as a line, extending past A and B in the ordinary figure colour; only
the part the step refers to is coloured.

### Showing a sum that does not work

The Segment Addition counterexample used to be one step that coloured point
B and asserted in words that AB + BC = AC fails. Nothing on the figure said
why.

It is now four steps that put the two parts up as separate lengths. AB runs
the whole way from A past C to B; BC starts at C and doubles back over
ground AB has already covered; AC is plainly the shortest of the three. Laid
out as three parallel bars the overshoot is visible rather than asserted,
and the last step makes the point that the postulate is not broken at all —
with C the one in the middle it gives AC + CB = AB.

Highlights can now be drawn in lanes, offset at right angles to the edge.
Without that the second highlight painted over the first and the two parts
read as meeting end to end, which is the opposite of what the step is about.

The arithmetic is checked rather than trusted: the failing equation is
asserted against the oracle with holds: false, and the one that does hold is
asserted true, so the counterexample cannot quietly stop being one.

### Limitations

- Proof checking validates the step you claim under the rules in the
  catalogue. It is not a theorem prover and does not search for a proof.
- Transitive and substitution overlap, and the reference says either is usually
  accepted; both are accepted where their shapes fit.
- "Simplify" is offered as an algebra step. Some courses require the property
  to be named instead; remove it from the catalogue if that is the house rule.
- Not implemented: paragraph and flowchart proof formats, coordinate-plane
  exercises, compass-and-straightedge constructions, teacher authoring.
- Touch-drag, screen readers and cross-browser behaviour remain unverified.
- The content review was run by the same model that wrote the content. It is
  fresh-context and adversarially prompted, which removes anchoring, but it
  is not a second opinion in the sense a teacher would be. The wording of the
  43 definitions against the course's own phrasing still wants a human read.
- Which concepts a figure shows, which concept it is primarily a picture of,
  and which topic a concept belongs to are all authored tables rather than
  derived. Adding a figure or a concept means adding its rows, or a question
  may end up with two right answers or implausible distractors. Tests assert
  the topic table is complete and that no co-true distractor is offered.
