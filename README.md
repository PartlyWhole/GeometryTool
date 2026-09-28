# Geometry Tool

A static React/TypeScript geometry application in three parts:

- **Board** — an SVG whiteboard with drawing, angle/segment selection, snapping, numerical constraints, undo and local persistence.
- **Concepts** — every idea in the module explained a step at a time, with the figure building up as you go and the highlight moving to whatever the step is about.
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

## Practice

Switch sections with the Board / Practice / Cards control at the top right.

- **Naming** — click the points that name a segment or angle, or pick its name from options whose distractors move the vertex letter.
- **Definitions** — definitions to terms, terms to definitions, and worked or diagrammatic examples in both directions, generated from a bank of 43 concepts.
- **Diagram ↔ equation** — read a marked figure and build the equation it gives you, drag a figure until it matches a description, or select every statement the figure actually supports. Equivalent rearrangements are accepted, so `AC − AB = BC` passes where `AB + BC = AC` is expected.
- **Solve** — work out the measure or length a question asks for, on a keypad, as one answer or as a question in parts where Part A feeds Part B. Questions that pair a small x with a different answer say so when you enter x instead.
- **Proof** — three ways in: justify a single line of a finished proof, judge which lines of one carry the right reason, or build a proof from nothing. Every line is checked against the reason cited for it and the earlier lines it rests on; a true statement with the wrong reason is rejected, and the theorem being proved may not be cited in its own proof. Any correct route is accepted.

### Module 3

Figures follow the reference's: no point letters, lines named by a single letter (m, n, t), and the eight angles numbered clockwise from the upper left at each crossing. Matching arrowheads mark two lines parallel, and — as with tick marks — only a marked pair may be used.

- **Angle pairs** — name the pair (corresponding, alternate or consecutive, interior or exterior — or none, or a Module 2 vertical pair or linear pair); click the angle that forms a given pair with another; and say whether two angles must be congruent, supplementary, or neither. Figures are tilted, turned and sometimes renumbered, so no answer can come from memory of one drawing. Lines drawn parallel with no arrowheads are a recurring trap.
- **Definitions** — the five pair names, transversal, parallel lines, the Corresponding Angles Postulate, the four theorems and the flow proof, asked in all four directions from their own bank.
- **Diagram ↔ equation** — write what a figure gives you ("m∠3 + m∠6 = 180"), name a pair with the new transversal-pair statement forms, or select what must be true — where "∠1 ≅ ∠5" holds only when the lines are marked parallel, and "∠3 and ∠5 are alternate interior angles" holds either way.
- **Solve** — measures and x on parallel lines, with the traps named: the supplement for a congruent pair, x for the measure, setting a supplementary pair equal. One-step questions are also generated, each over a figure drawn at its own numbers.
- **Proof** — the four theorems proved from the postulate, a pair with no name, and a solve-for-x; the reference's 3B as a **flow proof** with a blank reason under each box; plus the one-step and check-the-reasons drills built from those proofs. The five rules read the angles' positions off the figure and insist the parallel line be cited: "Corresponding angles are congruent only when the two lines are parallel."

Every exercise and both card decks let you move about inside the set: back and forward with the arrows or the ← and → keys, and straight to any item by clicking its dot, which is filled green or red once that item has been answered. Work is kept per item, so going back finds a question as you left it — your answer, the verdict you were given, the figure you had dragged, the proof lines you had already written — and an item already answered cannot be scored twice.

Statements are never typed. They are assembled by clicking: pick the form of the statement, then fill its slots from the figure itself — two points name a segment, three name an angle, an arc names the angle it marks — or from a palette of the figure's objects, operators and digits. Answers are judged modulo naming, so ∠1 and ∠AXC are the same angle.

## Verification

`npm run check` runs **153 tests**, TypeScript and the production build. The suite replays every authored proof and 120 generated ones through the same strict validator a student faces, so an unsolvable problem fails the build. Module 3's classifier is checked against the reference's table for all 28 pairs, and again over randomly turned and renumbered figures; every Module 3 claim and accepted answer is checked against what the marks license, and every printed measure against the drawing. See [docs/EVIDENCE.md](docs/EVIDENCE.md) for browser checks and limitations.
