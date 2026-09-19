# Geometry Tool

A static React/TypeScript geometry application in three parts:

- **Board** — an SVG whiteboard with drawing, angle/segment selection, snapping, numerical constraints, undo and local persistence.
- **Practice** — four exercise modes: naming figures, definitions and properties, translating between diagrams and equations, and a strictly checked two-column proof builder.
- **Cards** — flashcards for conditional-statement logic and for the definitions, postulates, properties and theorems of the module.

Practice and Cards are built on the curriculum in *Geometry Module 2 — Reasoning, Proof and Measure*, and follow its colour notation: blue is given, red is what is being proved, ochre is the shared part.

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
- **Diagram ↔ equation** — read a marked figure and build the equation it gives you, or drag a figure until it matches a description. Equivalent rearrangements are accepted, so `AC − AB = BC` passes where `AB + BC = AC` is expected.
- **Proof** — build a two-column proof. Every line is checked against the reason cited for it and the earlier lines it rests on; a true statement with the wrong reason is rejected, and the theorem being proved may not be cited in its own proof. Any correct route is accepted.

Statements are never typed. They are assembled from a toolbar: pick the form of the statement, then fill its slots from a palette of the figure's own objects, operators and digits.

## Verification

`npm run check` runs **75 tests**, TypeScript and the production build. The suite replays every authored proof and 120 generated ones through the same strict validator a student faces, so an unsolvable problem fails the build. See [docs/EVIDENCE.md](docs/EVIDENCE.md) for browser checks and limitations.
