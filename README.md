# Geometry Tool

A static React/TypeScript geometry application in three parts:

- **Board** — an SVG whiteboard with drawing, angle/segment selection, snapping, numerical constraints, undo and local persistence.
- **Concepts** — every idea explained a step at a time, with the figure building up as you go and the highlight moving to whatever the step is about. The concepts are told as a story in eight chapters, each built from the ones before: every concept opens with why it comes next, links what it builds on, and hands off to the next. See [docs/NARRATIVE.md](docs/NARRATIVE.md).
- **Practice** — five exercise modes: naming figures, definitions and properties, translating between diagrams and equations, solving for a measure, and proof.
- **Cards** — flashcards for conditional-statement logic and for the definitions, postulates, properties and theorems of the module.

Concepts, Practice and Cards cover two modules, chosen with the **Module 2 / Module 3** switch beside the section tabs (Module 3 is the default; the choice is remembered). Module 2 is *Reasoning, Proof and Measure*; Module 3 is parallel lines cut by a transversal. Both follow the same colour notation: blue is given, red is what is being proved, ochre is the shared part.

**For agent onboarding, read [docs/AGENT-ONBOARDING.md](docs/AGENT-ONBOARDING.md).** It documents the current UI, architecture, data model, recent fixes, legacy capabilities, and verification workflow. Earlier design documents are historical and do not define current UI scope.

## Run

```sh
npm ci
npm run dev
npm run check
npm run preview
```

Dev runs on port 4190; production preview on 4191. `npm run build` writes static files to `dist/`, including a browser worker. Relative asset paths support GitHub Pages repository subdirectories. Serve over HTTP, not a file URL. No backend or runtime external service is required.

The existing user's page on port 4192 serves `outputs/geometry-whiteboard/dist/`. Rebuild before refreshing it. Local storage is origin-specific, and refreshing resets the camera and in-memory history.

## Current controls

- Select (V), Segment (S), Angle (A), Point (P), Hand (H).
- Snapping is on by default; Alt/Option temporarily bypasses it.
- Shift-click adds/toggles selection. Ambiguous clicks offer a named geometry picker with highlights.
- Segment length and angle degrees are editable with Enter. Constraint operations preview before Apply.
- Multiple segments or angles use **Make congruent**.
- Constraints opens only through its explicit button, never automatically on selection.
- Point letters can be renamed; labels and angle arc handles can be repositioned.
- Space-drag pans, wheel zooms, and Fit frames the drawing.
- Document menu supports editable JSON and SVG export, JSON import, and new boards.

The deliberately simplified board UI has no Ray, Line, Circle, Text, Bisect, Right angle, Set, Other side, + Select, Snap-toggle, grid-toggle, or equations buttons. Legacy model support remains for existing documents.

## The path

Only Module 3 is on show, and its home page is a Duolingo-style path. It has seven units, one per stage of the story. Each lesson teaches its new ideas with the concept walkthroughs, then asks nine questions: two guided, five core, and two reviewing earlier lessons. A missed question comes back once before the lesson ends. Each unit closes with a 12-question checkpoint that needs 80% to pass, and a unit's banner offers "Test out to here". Progress, XP and the streak are kept in the browser. All seven units are playable. The later units add flow proofs to fill in, construction steps to put in order, and "is the converse true?". Three optional "Prove it" lessons use the full proof builder. The plan and its status are in [docs/PATH-PLAN.md](docs/PATH-PLAN.md). The Concepts, Practice and Cards pages remain under the Library menu.

## Practice

Switch sections with the Board / Practice / Cards control at the top right.

- **Naming** — click the points that name a segment or angle, or pick its name from options whose distractors move the vertex letter.
- **Definitions** — definitions to terms, terms to definitions, and worked or diagrammatic examples in both directions, generated from a bank of 43 concepts.
- **Diagram ↔ equation** — read a marked figure and build the equation it gives you, drag a figure until it matches a description, or select every statement the figure actually supports. Equivalent rearrangements are accepted, so `AC − AB = BC` passes where `AB + BC = AC` is expected.
- **Solve** — work out the measure or length a question asks for, on a keypad, as one answer or as a question in parts where Part A feeds Part B. Questions that pair a small x with a different answer say so when you enter x instead.
- **Proof** — three ways in: justify a single line of a finished proof, judge which lines of one carry the right reason, or build a proof from nothing. Every line is checked against the reason cited for it and the earlier lines it rests on; a true statement with the wrong reason is rejected, and the theorem being proved may not be cited in its own proof. Any correct route is accepted.

### Module 3

All three lessons (pp. 78–102): parallel lines crossed by a transversal, proving lines parallel, and perpendicular lines. They are told in the seven stages of the module breakdown (see [docs/NARRATIVE.md](docs/NARRATIVE.md)). Figures follow the reference's: no point letters on the transversal figures, lines named by a single letter (m, n, t), and the eight angles numbered clockwise from the upper left at each crossing. Matching arrowheads mark two lines parallel, and — as with tick marks — only a marked pair may be used. Constructions are drawn with dashed compass arcs.

- **Angle pairs** — name the pair; click the angle that forms a given pair with another; and say whether two angles must be congruent, supplementary, or neither. Figures are tilted, turned and sometimes renumbered, so no answer can come from memory of one drawing.
- **Parallel tests** — which converse proves the lines parallel (with the forward theorem offered as the trap); whether two measured angles are enough, over figures drawn parallel exactly when the measures say so; what value of x makes the lines parallel; and the Parallel and Perpendicular Postulates and the construction.
- **Perpendicular bisector** — whether what is marked puts B on the perpendicular bisector of AC; length equations from the theorem or its converse; and why the two compass constructions work.
- **Definitions**, **Diagram ↔ equation** and **Solve** — the module's 39 concepts in all four directions, reading what a figure gives you (including m ∥ n from marked angles), and measures and x on parallel lines.
- **Proof** — the theorems and the converses proved from the two postulates; the reference's flow proof and its fill-in reason tables, including the Pythagorean proofs of the Perpendicular Bisector Theorem and its converse; and the one-step and check-the-reasons drills built from those proofs.

Every exercise and both card decks let you move about inside the set: back and forward with the arrows or the ← and → keys, and straight to any item by clicking its dot, which is filled green or red once that item has been answered. Work is kept per item, so going back finds a question as you left it — your answer, the verdict you were given, the figure you had dragged, the proof lines you had already written — and an item already answered cannot be scored twice.

Statements are never typed. They are assembled by clicking: pick the form of the statement, then fill its slots from the figure itself — two points name a segment, three name an angle, an arc names the angle it marks — or from a palette of the figure's objects, operators and digits. Answers are judged modulo naming, so ∠1 and ∠AXC are the same angle.

## Verification

`npm run check` runs **170 tests**, TypeScript and the production build. The suite replays every authored proof and 120 generated ones through the same strict validator a student faces, so an unsolvable problem fails the build. Module 3's classifier is checked against the reference's table for all 28 pairs, and again over randomly turned and renumbered figures; every Module 3 claim and accepted answer is checked against what the marks license, and every printed measure against the drawing. See [docs/EVIDENCE.md](docs/EVIDENCE.md) for browser checks and limitations.
