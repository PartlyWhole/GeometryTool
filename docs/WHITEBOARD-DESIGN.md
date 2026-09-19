# Geometry Whiteboard
## A new interaction design for Module 2

**Status:** Proposed design for review. This document authorizes no implementation and does not imply that its proposed defaults have already been approved.

**Direction:** Start with an empty board and a compact toolbar. Drawing and manipulating geometry are the primary experience. Equations, explanations, and proofs grow out of objects on the board.

**Relationship to earlier work:** This replaces the previous exercise-first interface as the proposed product foundation. Preserve the existing application and reuse sound mathematical components behind a new editor. The previous implementation is not the interaction baseline to refine incrementally.

## 1. Decisions and assumptions

| Source | Statement |
| --- | --- |
| User decision | Start over with a blank screen and toolbar. |
| User decision | Draw segments and angles; put points on segments; select angles formed by segments and intersections. |
| User decision | Support vertex dragging, snapping, zoom, marquee selection, and Shift to extend selection. |
| User decision | Apply congruence to selected segments; make selected angles right angles or set a chosen degree measure. |
| User decision | Make the experience graphical, visual, fluid, and whiteboard-like, while covering Module 2 concepts. |
| Agent proposal | “Make congruent” and “Set angle” change the geometry and maintain a persistent relationship during later dragging. They do more than add marks. |
| Agent proposal | Use live, constrained geometry by default. Offer schematic teaching diagrams as an explicitly different document mode later. |
| Assumption | Retain static GitHub Pages hosting, local saving, and portable files from the earlier brief. No backend is needed for the board. |
| Evidence | Existing code has exact arithmetic, algebra/logic checking, proof rules, construction primitives, spatial predicates, and persistence patterns. It lacks the topology-aware direct-manipulation editor and persistent constraint solver required here. |

The behavior below is a cohesive proposal. Detailed defaults such as snapping distances, toolbar order, and solver motion policy should be tested with the user before being treated as final product decisions.

## 2. The screen

The initial screen is an empty, warm-white board. No sample figure, exercise picker, sidebar, question card, modal, or mandatory tutorial appears.

A small top toolbar contains **Select · Segment · Angle · Point · More**. More contains Ray, Line, Circle, Compass arc, Text, and optional freehand annotation. Undo and Redo stay visible. A document menu sits at the upper left. Zoom percentage, zoom buttons, and Fit drawing sit at the lower right. The first-session hint, “Draw a segment or press S,” disappears after the first action and can be dismissed.

The grid is off by default and can be shown as a faint dot grid. Geometry stays crisp rather than acquiring decorative wobble. Point labels are created automatically but unobtrusively, and can be hidden or renamed. Labels can extend beyond Z. Geometric IDs do not depend on letters.

Selecting something opens a compact contextual toolbar near the selection, kept inside the viewport. It never covers the pointer, selected angle, or an active text field. A relationship inspector opens only when requested. A collapsed bottom drawer can later show equations and reasoning; it never consumes space on a new board.

![Initial whiteboard layout](assets/blank-board.svg)

*Proposed blank state. The figure illustrates layout, not an implemented interface.*

### Contextual tools

| Selection | Primary actions |
| --- | --- |
| One point | Rename, coordinates, attach/detach, pin, delete |
| Two points | Connect, midpoint, distance |
| One segment | Length, midpoint, bisect, extend to ray/line, pin, delete |
| Multiple segments | Make congruent, equal spacing where applicable, inspect lengths |
| Two line-like objects | Parallel, perpendicular, intersection; availability depends on configuration |
| One angle | Right angle, measure field, bisect, label, smaller/larger region |
| Multiple angles | Make congruent, set all measures; exactly two also offer complementary/supplementary |
| A contiguous fan of sectors | Combine angle, sum, bisect combined angle |
| A mixed selection | Move, duplicate, delete; “Choose segments” or “Choose angles” narrows it explicitly |

Actions that do not apply are omitted from the primary toolbar. A disabled action in the expanded menu explains the missing prerequisite. Selecting three segments does not expose a nonsensical angle-measure field.

## 3. Drawing and navigation

### Segments

Choose Segment, then either click the first endpoint and click the second, or drag from start to finish. Both gestures create the same object. The preview shows a line, endpoint, and current length. Snapping highlights what will be connected before release.

Starting on a vertex reuses that vertex. Ending on an existing vertex creates a shared endpoint, not a duplicate point at the same coordinates. Ending on a segment creates an attached endpoint and a T-junction. Crossing another segment creates a discoverable geometric intersection without splitting either authored segment.

After committing, the tool remains available. A visible “Chain” toggle determines whether the next segment starts at the previous endpoint. Chain is off initially. Escape cancels the current preview; a second Escape returns to Select. No unfinished gesture creates an undo entry.

Shift while drawing restricts direction to 15° increments, including horizontal and vertical. This drawing-specific shortcut does not extend selection. The toolbar shows the active modifier meaning. Alt/Option temporarily disables snapping. On touch, both functions have visible toggles.

### Angles as a drawing tool

The Angle tool uses **vertex → first arm → second arm**. Its tiny guide changes at each click, and an arc previews the chosen region. It creates two segments sharing the vertex plus a reference to the angle region. Existing vertices and segments can be reused.

Before the last click, the user can type a degree measure in the floating input. Tab switches the active arm length when needed. The click establishes the arm's length while the entered angle determines direction. If no degree measure was typed, the result is initially free geometry, not a fixed-angle constraint.

The default is the smaller angle. A visible “Other side” control previews the complementary sweep around the vertex. Straight, reflex, and full-turn cases follow the explicit region policy in section 7.

### Navigation

- Wheel zooms around the pointer. A preference can switch ordinary wheel behavior to pan for users who expect it.
- Trackpad two-finger movement pans; pinch zooms around the gesture center.
- Space+drag or middle-button drag pans without changing tools. A Hand tool is available without a keyboard.
- Zoom controls show the percentage. Fit drawing and Fit selection are separate actions. Reset view never changes geometry.
- Drag near an edge can auto-pan with a short delay and capped speed. Auto-pan stops immediately on release or Escape.
- A small offscreen-selection indicator can bring a selected item back into view.

Hit targets and snap distances are measured in screen pixels, not world units. Zooming must not make points impossible to pick or make snapping capture half the board.

## 4. Points, attachment, and intersections

### Adding a point

Point on empty space creates a free point. Point on a segment previews the closest position, then attaches the new point to that segment. Hovering the midpoint offers a distinct midpoint snap and label. Accepting it creates the midpoint relationship, not merely a point that happens to sit at 50%.

A general attached point stores a parameter `t` on its host segment, between 0 and 1. Moving the segment carries the point with it. Dragging the point slides it along the host. Resizing the host preserves `t` unless a length or ratio constraint requires another position. The inspector can replace this with an explicit ratio such as AM:MB = 2:3.

An attached point stays on the finite segment, not its infinite extension. At an endpoint it previews “Merge with A”; release merges only if the snap is accepted. Detach is an explicit command, not an accidental result of dragging a few pixels off the line.

### Whole segments and parts

Putting M on AB does not delete AB. The model can refer to AB, AM, and MB simultaneously. AB remains the authored segment; AM and MB are addressable subsegments with endpoint IDs and support provenance.

Clicking the stroke normally selects the authored segment. Hover or selection exposes a small scope control: **Whole AB / Part AM / Part MB**, showing only parts under the pointer or in the selected neighborhood. “Select between points” is also available. Alt/Option-click cycles overlapping selectable objects in Select mode, with a visible candidate list; it does not silently change the selected mathematical object.

Selecting a part highlights only that part and names its endpoints in the contextual toolbar. This distinction is essential for segment addition and for making subsegments congruent.

### Crossings and junctions

Unreferenced intersections are lightweight derived topology. Hovering reveals their point affordance and surrounding angle sectors. Clicking an intersection, labeling it, or constraining one of its angles promotes it to a persistent referenced junction.

A referenced junction records its defining supports and valid segment domains. During later edits, its relationships remain active. Its identity is not a rounded coordinate string.

| Configuration | Behavior |
| --- | --- |
| Shared endpoint, two distinct directions | One junction, two directions, selectable smaller and larger angle regions |
| Endpoint on segment interior | T-junction with three outgoing directions; two nonstraight elementary sectors and a 180° sector, plus both semicircle choices for the opposite boundaries |
| Interior X crossing | Four directions, four elementary sectors, two opposite-boundary pairs with two selectable semicircles each, and composite/reflex choices |
| Three concurrent lines | Six directions; six elementary sectors; larger consecutive unions remain selectable |
| Near miss | No junction or angle until a snap is accepted; proximity alone is not incidence |
| Parallel separated segments | No intersection, even if infinite extensions would meet offscreen in a nonparallel case |
| Collinear overlap | One directional support at each junction, no duplicate zero-width sectors; selectable authored segments and parts remain distinct |
| Coincident duplicate strokes | Selectable through the candidate list; not silently deleted or treated as extra directions |
| Endpoint joins several supports | Explicit shared point with a dependency set, not several hidden coincident vertices |

Unreferenced crossings may appear and disappear freely. If a referenced crossing loses its valid domain through an explicit detach, delete, or unsupported edit, its angle annotations become **unavailable**, rather than jumping to another nearby crossing. The inspector identifies the missing support and offers repair or removal.

Dragging a dependent intersection does not detach it. The direct drag is allowed only when the defining supports have a supported inverse-motion solution. Otherwise show “Move an endpoint to move this intersection” and highlight its movable handles. The system must not guess a large rearrangement of the figure.

## 5. Selection that feels predictable

The selection tool resolves a click by intent and proximity:

1. A visible vertex handle wins close to that vertex.
2. A segment stroke wins close to the stroke.
3. A visible angle arc or angle label selects its angle.
4. Hovering open space near a junction reveals an angle wedge; clicking the wedge selects it.
5. Ambiguous candidates expose a small picker, with a keyboard cycling shortcut.

A newly revealed wedge does not steal an already-started point drag. When the user holds a drawing tool, the same geometry supplies snap targets rather than changing selection.

### Multiple selection

Click replaces selection. Shift+click toggles one item without clearing others. Drag on empty space creates a rectangular marquee. Default marquee selection contains objects fully; a visible **Contains / Touches** control switches to intersection selection. Shift+marquee adds to the existing set.

The default marquee selects authored strokes and explicit points, not every invisible angle at every crossing. Explicitly marked angle arcs can be selected by their visible region/label. The Angle selection filter enables sector-based marquee selection when wanted. This avoids selecting dozens of hidden angles merely by boxing two crossing lines.

Selected segments use a strong stroke and endpoint handles. Selected angles use a lightly filled sector, a thick arc, and clear boundary highlights. A selection count reads “3 segments” or “2 angles”; mixed types are reported honestly. Congruence marks stay distinguishable from selection highlights.

Dragging a selected segment body translates its movable configuration. Shared vertices move once. Connected external objects deform as required by their shared vertices and active constraints. The preview highlights that affected neighborhood. If a constraint prevents the intended motion, the segment does not silently detach.

There is no generic resize box that can distort constrained geometry. Rotate and Scale are explicit transformations with a pivot and a preview; they may be disabled by fixed coordinates or measures. Duplicate copies the selected mathematical subgraph and its internal relationships. External constraints are excluded unless explicitly included, with a summary before commit.

## 6. Make selected segments congruent

Select two or more segments or parts, then click **Make congruent**. Matching tick marks appear and the geometry adjusts to satisfy a persistent equal-length constraint.

For sequential selection, the first selected segment is the default reference. For a marquee, the preview asks for a reference using one click on a highlighted segment. The toolbar clearly reads “Match AB” and lets the user change it before committing. A selection order is not inferred from arbitrary database iteration.

The reference retains its current length for this transaction. Each other segment preserves an anchored endpoint where possible and adjusts its free endpoint along its present direction. If both endpoints are free, the default preserves the segment's center. Shared endpoints, pins, and existing constraints take precedence over those preferences.

If the graph requires a coupled adjustment, preview every affected object. If the request cannot be satisfied while honoring existing hard constraints, explain the conflict and leave the board unchanged. Do not relax an existing length or a pin without an explicit choice.

After applying congruence, resizing a member normally causes the other members to follow. The reference was an editing preference, not an implicit permanent fixed-length constraint. A numeric Length value is a separate constraint.

Independent groups get distinct tick counts. Groups sharing a segment merge transitively. Removing a relation recomputes the equivalence classes; manually deleting one visual tick does not leave a hidden equality constraint. A relational badge identifies exactly which rule will be removed.

## 7. Angles are regions, not pairs of line IDs

At each junction, outgoing half-directions are ordered around a full turn. The same geometric half-direction represented by several overlapping segments appears once in that order, while retaining all its supports.

An elementary sector lies between consecutive directions. A larger angle is a contiguous union of sectors. Nonadjacent pieces are not automatically one angle. A full turn is a closed partition around a vertex.

An angle reference contains its vertex, start direction, end direction, sweep/orientation, and support provenance. It does not mean “whichever small angle happens to exist between these two segments now.” Labels such as ABC are presentation aliases; the region is explicit.

### Picking a region

Hover near a junction fills the nearest elementary sector. Click to select it. Its two boundaries brighten. A small local control offers **Larger angle**, **Other side**, and **Choose boundaries** when applicable.

To select a composite angle, choose its two boundaries and the sweep, or select consecutive sectors and choose Combine. The preview fills the entire result, including interior rays. A three-line crossing must allow both a 30° sector and a 110° angle spanning several sectors without hiding or deleting any line.

At crowded vertices, arcs occupy adjustable display lanes. Dragging an arc outward changes label placement and hit area, not its angle measure. Zoom and a local enlarged picker remain available. Straight angles expose a semicircle with two possible sides. A zero-angle degenerate pair is not treated as an ordinary selectable sector. A full turn is explicitly selected from the vertex menu, not confused with zero.

### Identity during motion

A selected angle keeps its boundary identities and sweep branch through normal deformation. It does not silently switch to a smaller angle after passing through 180°. If its domain policy permits reflex angles, it becomes reflex with a visible label. If a task or constraint requires an ordinary angle, motion stops at the domain boundary and explains why.

When the circular order changes, derived sectors are rebuilt. Referenced angle boundaries survive where geometrically meaningful. Coalescing directions can make an angle temporarily undefined or degenerate; old annotations remain recoverable. Reversing a segment's endpoint ordering must not reverse an unrelated angle's region.

![Junction and overlap cases](assets/junction-cases.svg)

*Angle selection follows outgoing directions and regions. Overlapping strokes do not create extra zero-width sectors.*

## 8. Right angles and custom measures

![Selected angle and contextual editing](assets/selected-angle.svg)

*Proposed contextual toolbar. A selected 120° region can be made right, edited numerically, or bisected.*

### Make right

Select an ordinary angle and click **Right angle** or press the displayed shortcut. Show a preview with a square marker and “90°.” Commit applies a persistent constraint.

For a free two-arm angle, keep the vertex and first boundary fixed for the edit and rotate the other boundary, preserving arm length where possible. A small anchor indicator allows “Keep this side” or “Move both.” These are solver preferences rather than undeclared pins.

For an angle at an X crossing, perpendicularity belongs to the supporting directions. The preview rotates the appropriate support geometry while keeping collinear portions straight. It does not bend one half of a continuous segment just to satisfy one sector. All four right-angle consequences can be shown on hover, without cluttering the board with four permanent squares.

For two or more selected angles, Right angle means **make every selected angle 90°**, not make their sum 90°. If three distinct sectors around one unconstrained junction are selected, feasibility depends on the rest of the fan. If all three sectors form the complete turn, the action is impossible and is rejected without movement.

### Degree editor

Click the angle's measure label or use the contextual measure field. The field opens with the existing measure selected, a large readable value, and a fixed degree suffix.

- Typing previews the result. Enter commits; Escape restores the complete previous state.
- Arrow keys adjust by 1°; Shift+Arrow uses 10°; an explicit fine-step setting is available. Presets include 30°, 45°, 60°, 90°, 120°, and 180°.
- A scrub handle supports coarse adjustment, but typing is always available. A slider is optional secondary input, never the only way to enter a precise value.
- Accept decimals and simple exact expressions such as `45/2`. Preserve the entered value and its unit. Do not imply that a rounded measured value is exact.
- Ordinary angles use 0° < θ ≤ 180°. Reflex angles use 180° < θ < 360°. Full turn is a separate 360° object. Typing outside the chosen domain offers a region change; it does not silently wrap modulo 360.
- A multi-selection shows “Mixed” when measures differ and says “Set each of 3 angles.” Preview applies the typed value to each.
- A fixed measure has a small relationship badge. “Release measure” removes the constraint and keeps the current shape.

When selected angles already have a congruence relation, changing one adjusts the group. If another member has a conflicting fixed measure, present that conflict. Redundant compatible constraints are recognized without inventing extra degrees of freedom or failing merely because the system is algebraically redundant.

Arbitrary degree values require a numerical layout solver. An exact degree constraint can be stored even when its Cartesian realization uses approximations. Numerical agreement is not a proof certificate; section 12 defines the separation.

## 9. Direct manipulation and constraints

The board should feel responsive while preserving meaning. Use these priorities:

1. Hard incidence, explicit measures, equality relationships, pins, and construction dependencies.
2. The user's current drag or typed edit target.
3. Preserve nearby positions, lengths, orientation, and previous solution branch as soft preferences.

No soft preference may override a hard constraint. “Pin position,” “Fix length,” and “Keep this side for this edit” are distinct controls with distinct icons and behavior.

Solve only the affected connected component. Unrelated figures stay still. Where several solutions satisfy the edit, preserve the previous branch and minimize weighted motion. Show affected geometry as a faint ghost before committing a toolbar operation. During dragging, use a lightweight continuous preview.

An unsuccessful drag stays at the last valid configuration and shows the blocking relationship near the pointer. A failed typed command leaves the input editable and does not change the document. A numerical timeout says “Could not resolve this move,” not “These conditions are impossible.” Claim a contradiction only when there is an appropriate analytic explanation or validated conflict.

Every gesture is one undo step. Undo restores geometry, relations, point identities, region bindings, labels, and selection. Camera motion stays outside mathematical undo; Fit and Reset view provide navigation recovery. Escape during a preview rolls back the whole transaction. Background solver replies carry document revision and gesture IDs and cannot commit stale positions.

### Typical conflict messages

- “AB is fixed at 5 and CD is fixed at 7. Release one length to make them congruent.”
- “This angle is fixed at 60°. Replace that measure with 90°?” This is an inline action in the preview, not a modal for every ordinary edit.
- “These four sectors already make a full turn. Their requested measures total 300°.”
- “The two endpoints are pinned. Unpin one to change the length.”

Show only implicated constraints. Never label the whole drawing invalid because an unrelated edit failed. Do not silently remove constraints to make the solver converge.

## 10. Snapping, handles, and quality of life

Suggested initial snap radii are 8 screen pixels for a pointer and 14 for touch, with a larger release radius for hysteresis. These are tuning proposals, not established usability results.

Snap priority is vertex/intersection, explicit midpoint, segment attachment, then direction guides and optional grid. A label states the chosen meaning: “Point B,” “Intersection,” “Midpoint,” or “On AB.” Candidates are visually distinct and deterministic. Pressing Tab cycles closely competing candidates before release.

A snap accepted at creation produces its stated binding. A transient alignment guide is only a guide unless the UI explicitly previews a persistent relation. An incidental near-right drawing does not silently gain a 90° constraint.

Other required conveniences:

- Move labels and angle arcs independently, with Reset label position.
- Hide construction guides without deleting dependencies.
- Rename points without rewriting IDs or breaking equations.
- Delete a stroke while retaining unrelated endpoints; show dependent annotations before deleting a referenced support.
- Select through overlap with a candidate list and cycle key.
- Duplicate with a ghost preview and a sensible offset.
- Undo restores merged vertices and constraints as one transaction.
- Autosave with quiet status; recover the latest valid local draft after refresh.
- Export/import an editable document, plus SVG/PNG for sharing. Exports label approximate measurements honestly.
- Copy/paste a connected diagram with fresh IDs and internal references remapped.
- Touch offers visible additive-selection and snap toggles. Keyboard users can list nearby objects, choose angle boundaries, nudge points, and edit measures without precision pointing.

## 11. Module 2 on a whiteboard

The board stays visually simple because these capabilities appear from relevant selections or optional drawers, not as 40 permanent toolbar buttons.

| Concept | Graphical action or representation | Mathematical distinction |
| --- | --- | --- |
| Segment addition | Place M on AB; select AM and MB; choose Sum | Whole AB remains an independent reference; betweenness is required |
| Collinear and between | Attach a point to a support; inspect ordered points | Collinear does not mean a particular point lies between the others |
| Midpoint and ratio | Select segment → Midpoint or Divide in ratio | Equal lengths alone do not establish midpoint without incidence |
| Segment bisector | Draw a segment/ray/line through the midpoint | It need not be perpendicular |
| Perpendicular bisector | Select segment → Perpendicular bisector | Combines midpoint and perpendicularity |
| Congruent segments | Multi-select → Make congruent | Object congruence corresponds to equal lengths |
| Acute/right/obtuse/straight | Live angle label and explicit region; Set measure | Classification follows measure and domain, not arc size |
| Angle addition | Select consecutive sectors → Sum/Combine | Overlap, gaps, and inconsistent sweeps are diagnosed |
| Angle bisector | Select angle → Bisect | Creates an interior ray and equal subangles |
| Adjacent angles | Select pair → Inspect relationship | Shared vertex and side plus disjoint interiors |
| Linear pair | Inspect adjacent pair with opposite outer directions | Supplementary alone does not establish a linear pair |
| Vertical angles | Select opposite sectors at a crossing | Opposite-ray incidence establishes the relation, not equal measure alone |
| Supplementary/complementary | Select two angles → Sum to 180° / Sum to 90° | Disconnected angles are allowed; anchoring policy previews what moves |
| Congruent angles | Multi-select → Make congruent | Independent arc classes; actual equal-measure constraint |
| Around a point | Select complete fan → Sum | Each sector occurs once; total 360°, with no gap or overlap |
| Coordinates, distance, midpoint | Optional coordinate layer and coordinate inspector | Exact inputs versus rounded displayed distances remain distinct |
| Addition/subtraction/multiplication/division of equality; distribution | Select linked measure chips in the equation drawer | A transformation needs its operation, domain conditions, and both sides |
| Substitution | Select a quantity occurrence → Replace using equality | Preserve the other occurrences and diagram references |
| Reflexive/symmetric/transitive | Select linked statements → Reason | These are reasoning steps, not drawing tools |
| Linear pair, vertical angle, congruent supplements, congruent complements, right-angle congruence theorems | Select given relationships and target → Explain | An observed or constrained picture is not a proof of the theorem |
| Conditional/converse/inverse/contrapositive | Optional statement cards with highlighted diagram references | Logical shape and empirical truth are different questions |
| Equivalence, biconditional, negation | Manipulate clauses in a reasoning drawer | No attempt to encode all logic as geometric dragging |
| Counterexample, always/sometimes/never | Duplicate to isolated witness boards; mark hypothesis and conclusion | A counterexample must satisfy the hypothesis; examples do not prove “always” |
| Induction and deduction | Compare saved examples; create a conjecture, then a reason chain | Pattern discovery is labeled as a conjecture |
| Compass constructions | Circle/arc with center and retained radius; choose intersections | An exact construction trace differs from a freehand constraint result |
| Points, lines, rays and planes | More tools; optional separate spatial view | Infinite extent is not a measurable length; projected crossings are not spatial intersections |

A quick “Make perpendicular bisector” command is a convenience construction. A compass-only task can require the student to create the circles and intersections explicitly. The resulting figure may look identical while the construction certificate differs.

The equation drawer accepts quantities by clicking the board and displays linked chips, such as `[AM] + [MB] = [AB]`. Hovering a chip highlights its exact object or region. A proof drawer can later reuse the same references without turning the whole screen back into the old exercise form.

## 12. Engine topology and mathematical authority

### Separate layers

1. **Authored objects:** free/attached/dependent points; segments, rays, lines, circles/arcs; optional spatial objects.
2. **Topology:** supports, incidences, finite domains, overlaps, intersections, directional classes, ordered fans and angle partitions.
3. **Persistent references:** whole/part segments and region-aware angles that survive ordinary edits.
4. **Constraints:** equality, measure, incidence, ratios, perpendicularity, parallelism, pins and construction dependencies, with provenance.
5. **Realization:** a numerical coordinate solution, residuals, branch continuity and unresolved objects.
6. **Presentation:** camera, label placement, arc lanes, selections, hit targets and visual styling.
7. **Reasoning:** typed expressions, declared givens, proposed/derived facts and proof certificates.

No layer should infer proof facts from pixels. The renderer does not own topology. The numerical solver does not decide proof validity.

### Suggested records

```ts
type AngleRef = {
  id: AngleId;
  vertex: JunctionRef;
  start: DirectionRef;
  end: DirectionRef;
  sweep: 'ccw' | 'cw';
  domain: 'ordinary' | 'reflex' | 'full-turn';
  supportRefs: EntityId[];
};

type AttachedPoint = {
  id: PointId;
  host: SegmentRef;
  position: { kind: 'parameter'; t: Scalar }
          | { kind: 'midpoint' }
          | { kind: 'ratio'; first: Scalar; second: Scalar };
};

type ConstraintRecord = {
  id: ConstraintId;
  relation: TypedRelation;
  source: 'user-action' | 'given' | 'construction';
  enabled: boolean;
};

type RealizationStatus =
  | 'valid' | 'preview' | 'degenerate'
  | 'unresolved' | 'conflicting';
```

These are conceptual schemas, not a commitment to the previous string-based relation format. IDs refer to mathematical entities; letters, numeric formatting, and arc positions remain presentation.

### Topology updates

Use a spatial index to limit intersection and hit testing to relevant objects. During a gesture, compute local candidates; on commit, reconcile the affected topology graph. Broad-phase proximity uses screen/world tolerances, but incidence is promoted through explicit snap/binding or robust intersection predicates. Do not globally merge nearby vertices.

Coordinate-derived intersections require robust orientation and domain predicates. Exact rational/construction data should use the existing exact paths. Arbitrary floating realizations require robust numerical predicates with explicit uncertainty handling. Screen-space snapping tolerances cannot be reused as mathematical equality tests.

Concurrency and overlap need canonical support/direction classes. Never key persistent junctions solely by a segment pair: three concurrent supports describe one junction. Preserve provenance so a split or merge can be reconciled and undone. A branch transition can invalidate a reference, but cannot silently retarget it to a different figure.

### Solving strategy

Use direct analytic constructions for simple isolated operations: moving a free point, a point at parameter t, a midpoint, a single fixed angle, an equal-length endpoint, or a rigid translation. Use an incremental constrained solver for coupled systems, initialized from the last valid realization. Branch guards and regularization preserve orientation where the mathematics permits it.

The numerical solver runs in a worker, with bounded work and revisioned responses. The pointer preview can run separately on the main thread. A final worker result is validated before committing. A solver adapter makes it possible to evaluate candidate solvers against this document's fixtures before selecting a dependency.

The existing exact construction kernel cannot be treated as a general nonlinear drag solver. Conversely, a least-squares solver's small residual is not exact incidence evidence for a proof.

### Three kinds of fact

- **Declared:** the user deliberately applied a right-angle or congruence constraint. This can serve as a given in a later authored exercise if explicitly chosen.
- **Measured:** the current realization is approximately 89.999°. Display with a suitable approximation convention; do not mark it proven right.
- **Derived:** an authorized exact rule or construction certificate established a relationship from premises.

A square marker appears for a declared or certified right angle, not because a rendered angle rounds to 90°. In ordinary whiteboard exploration, the user may declare constraints freely. In a proof exercise, such a declaration is a proposed construction or assumption, not a free proof step.

## 13. Reuse and replacement

| Existing component | Recommendation |
| --- | --- |
| Rational arithmetic and exact construction field | Reuse behind bounded adapters, with regression verification |
| Algebra/logic parsing and rule checking | Reuse for optional linked reasoning; change references from letter strings to IDs at the boundary |
| Spatial predicates | Reuse in the later spatial view; do not infer spatial topology from its SVG projection |
| Exercise templates | Preserve for a later task layer that opens a board with givens; they do not drive the new home screen |
| Persistence, worker revisions and history patterns | Reuse patterns, introduce a new versioned board schema and migration boundary |
| Existing relation marking renderer | Reuse visual ideas only; rebuild against canonical congruence classes and persistent angle regions |
| Current point-selection tray and form editors | Replace as the primary interaction; retain only as accessibility or inspector fallbacks where useful |
| Current diagram model and hit testing | Replace with the topology/reference/constraint layers above |
| Current UI shell | Replace with the blank board, toolbar, contextual tools, and optional drawers |

Keep the new board in a separate application entry point until its core interactions pass. Import old diagrams as copies. Preserve the original file and show an import report: supported objects, unresolved references, and relations imported as declarations. Do not silently convert all old proposed statements into active constraints.

## 14. Acceptance scenarios

These are agent-proposed acceptance fixtures derived from the user's requested behaviors and Module 2. The user owns product acceptance; mathematical checks should also receive independent review. Implementation should retain recordings and reproducible files for failures.

| ID | Scenario | Required observable outcome |
| --- | --- | --- |
| W01 | Open a new document | Only blank board and compact controls; no exercise UI |
| W02 | Draw by click-click and by drag | Equivalent segment objects; Escape leaves no partial object |
| W03 | End a segment on an existing vertex | One shared vertex; dragging it moves both connected segments |
| W04 | Put M on AB, resize AB, drag M | M remains attached, preserves its ratio on resize, slides along AB |
| W05 | Accept midpoint snap | M remains the midpoint after either endpoint moves |
| W06 | Select whole AB then part AM | Correct extent and label highlight; congruence uses the chosen reference |
| W07 | Marquee plus Shift-click | Predictable set membership; no unintended hidden angles |
| W08 | Make three unequal segments congruent | Preview names reference; commit equalizes lengths and adds one tick class |
| W09 | Two independent congruence groups | Distinct marks; sharing a member merges the groups transitively |
| W10 | Drag a congruent segment endpoint | Connected equality constraints remain satisfied; unrelated figures stay still |
| W11 | Draw an X crossing | Four selectable sectors; correct vertical and linear-pair relationships |
| W12 | Draw a T-junction and a near miss | T has proper regions; near miss has none until connected |
| W13 | Draw three concurrent lines | Six elementary sectors; composite, straight, and full-turn selections available |
| W14 | Overlap collinear strokes | No duplicate zero-width angles; whole/part object identities retained |
| W15 | Select an X sector and make it right | Supporting geometry stays straight; perpendicularity is maintained on drag |
| W16 | Set one angle to 37.5° | Clear preview, exact stored degree target, persistent relation, one undo step |
| W17 | Type 220° into ordinary-angle editor | Explicit reflex-region choice; no silent modulo conversion |
| W18 | Move a region through 180° | Retains sweep identity or stops at declared domain boundary |
| W19 | Select two disconnected angles and set complementary | Measures total 90° without forcing adjacency |
| W20 | Request impossible fixed measures | No document mutation; implicated constraints identified, input repairable |
| W21 | Constraint solver times out | Unresolved feedback and preserved last valid geometry; no false contradiction |
| W22 | Delete a referenced support and Undo | Dependents explained; Undo restores identities, regions and constraints |
| W23 | Move or detach a referenced crossing | No angle jumps to another intersection; invalid references remain repairable |
| W24 | Zoom to 25% and 400% | Stable screen-sized handles and snap ranges; pointer-centered zoom |
| W25 | Drag a label or angle arc | Only presentation moves; mathematical measure unchanged |
| W26 | Refresh and import/export | Board and references survive; old unsupported data is reported |
| W27 | Right-looking free angle | No automatic right-angle given or exact proof fact appears |
| W28 | Full turn with selected sectors | Gaps and duplicated sectors rejected; one complete traversal totals 360° |
| W29 | Keyboard and touch paths | Drawing, selection, measure editing, undo and pan work without hidden modifier requirements |
| W30 | A worker replies after Undo/new drag | Stale reply is ignored and cannot move the current board |

### Performance and usability proposals

Use a documented reference laptop and tablet. Test a board with 200 segments, 100 referenced junctions and 100 constraints, plus a separate crowded-junction fixture. Target hover/selection feedback within 50 ms at the 95th percentile, local drag presentation at 60 fps on the reference laptop, and typical affected-component constraint updates within 50 ms. These are proposed budgets to measure, not current performance claims. Gracefully show pending status for harder solves and bound each attempt.

Run short user sessions around six actions: draw a triangle, attach a point, select an intersection angle, make segments congruent, set 73°, and undo a failed edit. Record mis-selections, accidental detachment, unexpected motion, and whether the user can recover without instructions. Passing mathematical tests alone does not establish fluid interaction.

## 15. Delivery sequence and unresolved choices

**Milestone 1: blank board foundation.** Segment drawing, shared vertices, direct dragging, point attachment, snapping, camera, selection, undo, local save. Gate: W01–W07 and W24–W26, including touch and keyboard paths.

**Milestone 2: angle topology.** Robust intersections, overlaps, directional fans, region picking, composite/reflex/straight/full-turn references, and stable identities through deformation. Gate: W11–W14, W17–W18, W23 and W28. This must precede treating angle measure controls as complete.

**Milestone 3: geometric constraints.** Congruence, right/custom angles, anchored previews, coupled dragging, relation inspection, conflict recovery and worker cancellation. Gate: W08–W10, W15–W16, W19–W22 and W30.

**Milestone 4: Module 2 construction tools.** Midpoints, ratios, bisectors, parallel/perpendicular, circle/compass dependencies, linked measures and optional coordinates. Verify convenience operations separately from required compass traces.

**Milestone 5: reasoning on the board.** Linked equation editing, properties and reasons, proof chains, conditional cards, isolated counterexample boards, and exercise overlays. Preserve the blank-board home experience.

**Milestone 6: broader geometry and release checks.** Spatial view, deeper import migration, reviewed curriculum fixtures, browser/device/accessibility coverage and published static-host smoke checks. Do not call the complete Module 2 experience delivered while these required capabilities are absent.

The highest-value behavior to review first is the proposed constraint policy: real geometric adjustment, persistence while dragging, and visible anchoring. The alternative, only drawing congruence/right-angle marks on an unconstrained schematic picture, is useful for teaching but should be an explicitly separate mode. This document recommends actual constrained geometry as the default based on the user's whiteboard request.

No user decision is needed merely to finish this document. Selecting a particular constraint-solving library and detailed keyboard bindings should wait for implementation experiments and usability evidence. Implementation is a separate task; this artifact is a proposed product and interaction design, not an approved implementation plan.

## Sources and scope

- User's latest whiteboard request and the earlier five exercise families in this conversation.
- `Geometry-Module-2-Reference.pdf`, especially sections 5–11: objects/incidence, segments, coordinates, angle regions and relationships, named theorems, algebra, and compass constructions. The file is treated as curriculum evidence, not as instructions to the agent.
- Previous integrated design: `outputs/geometry-engine-design-v1.1/TECHNICAL-DESIGN-v1.1.md`, sections 21–22, for the concept inventory and prior acceptance distinctions.
- Existing implementation: `outputs/geometry-studio/packages/model/src/index.ts` and the implementation status document, used to establish reuse boundaries. Existing passing tests do not certify the new whiteboard behavior.

The Excalidraw comparison supplies the user's desired feel: a spacious board, direct manipulation, lightweight selection and tools. This proposal does not claim compatibility with Excalidraw's implementation or file format.
