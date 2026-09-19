# Item quality audit

Every item in the app, judged against the rubric in
[ITEM-QUALITY-RUBRIC.md](ITEM-QUALITY-RUBRIC.md): seven criteria, four
verdicts, and a separate BUG flag for correctness defects. The descriptions in
[ITEM-REVIEW.md](ITEM-REVIEW.md) are the evidence base; this document is the
judgement.

A verdict is a decision, not a score. **Keep** means it works. **Tweak** names
one cheap specific change. **Rework** means the idea is worth teaching but the
item as built does not test it. **Cut** means it does not earn its slot.

## Verdicts

| Section | Keep | Tweak | Rework | Cut |
| --- | --- | --- | --- | --- |
| Concepts (39) | 8 | 27 | 4 | 0 |
| Practice — naming and definitions | 27 | 16 | 2 | 0 |
| Practice — diagram ↔ equation | 13 | 14 | 1 | 0 |
| Practice — solve | 2 | 8 | 2 | 0 |
| Practice — proof | 14 | 13 | 1 | 2 |
| Cards | 22 | 22 | 0 | 1 |
| **Total** | **86** | **100** | **10** | **3** |

That is 199 verdicts over 146 items, because the two generated exercise types
and the seven card types are judged as families as well as instance by
instance: a family can be well built while a particular instance is weak, and
the reverse.

## Bugs found, and what happened to them

Seven correctness defects were confirmed and fixed. Six more were reported and
rejected on inspection.

**Confirmed and fixed**

- A figure marked a 118° angle congruent to a 62° one. `suppAndCongruent` drew
  both rays at the same polar angle, so its arcs asserted a congruence the
  drawing denied — and the proof using it solves to m∠1 = 73°, which the
  picture also contradicted. A test now checks every ticked and arced pair in
  the library against the geometry it is drawn with.
- The perpendicular-bisector concept taught that a perpendicular bisector does
  two jobs while its figure marked only one. The fix for this had been written
  earlier and silently failed to apply; the step's assertion checks the
  *measured* midpoint, and the point sits at the centre, so nothing caught it.
- Congruent Complements carried a figure caption and a text example that
  contradicted each other on the same card. Congruent Supplements had the same
  slip. Both now state the general case in letters.
- A congruent-segments example said two segments "both carry one tick" where
  the figure gives them two.
- `bisector-midpoint` had two valid answers: "a line through an endpoint"
  admits the segment's own line, which passes through the midpoint and is not
  perpendicular.
- `supp-90` was the only conditional-phrased item in a set of flat statements,
  which made "never" as defensible as the keyed "sometimes".
- Two always/sometimes/never items shared an id.

**Reported and rejected**

Six Figure-to-equation items were called incorrect for rejecting valid
alternative answers — sides swapped, operands reordered, an angle named from
the other arm. The comparator already normalises all three; every alternative
passes. The claim came from reading the accept lists rather than the code, and
a test now records the behaviour.

## Machinery defects

Two findings were about how items are served rather than how they are written.

The reason-check pool was walked in fixed order and truncated at the quota, so
the last entries were almost unreachable — the strongest item in that sub-tab
appeared in one session out of four hundred. The pool is now shuffled first,
and a test requires every item to appear in at least 30% of sessions.

Three card types offer an option the generator can never key correct:
syllogism's "Nothing follows", equivalence's "None of these", and classify's
"the original conditional". In each case the dead option names the family's own
failure mode, so the deck describes what would make it right while guaranteeing
it never is. This is a content decision rather than a defect and is left open.

---

# Concepts

## Points, lines and segments

### Point and line [point-and-line] — **Keep**
An on-ramp, and it does that job: two undefined terms handed over in four beats, with one genuine visual move (points blue at step 2, the path between them blue at step 3) that shows the definition rather than only stating it. Step 4 repeats step 3's stage exactly, so the closer lands as a text swap, but a closing sentence that names what the rest of the module is built from is a reasonable thing for a final step to do. Nothing here misleads and nothing is asserted that the figure does not carry.
Criteria at issue: none — 3 n/a, 6 satisfied (steps stage the idea).

### Collinear [collinear] — **Tweak**
Steps 1–3 are well sequenced, and putting B at x = −24 rather than the midpoint is a quiet, deliberate choice that blocks "collinear means evenly spaced". The problem is step 4: it tells the student that "X, Y and Z are collinear" is only *sometimes* true while showing three points that plainly do line up, and no non-collinear figure exists anywhere in the concept — so the half of the contrast that carries the lesson is left to imagination, over a stage identical to step 3's. Add a second figure (e.g. A(−150,0), B(−24,40), C(150,0), no edge drawn) and swap to it at step 4 so the *sometimes* has a visible counter-case.
Criteria at issue: 4, 6 (3 n/a)

### Segment Addition Postulate [segment-addition] — **Tweak**
The best-built item in the batch. The two-movement structure earns its ten steps, and steps 7–8 are genuinely excellent: laying AB (320), CB (144) and AC (176) as parallel bars makes the overlap *visible* instead of argued, which is what turns the betweenness hypothesis from decoration into the thing the postulate rests on. Step 9's repair — the postulate isn't broken, it's about AC + CB = AB here — is exactly right, and the arithmetic checks out throughout. One gap: step 10 is the step about reading the equation backwards as a subtraction, and it is the only step in the back half with the equation box *removed*; put `AB − AC = CB` in the box at step 10. Secondary: ochre is used for the between-point (steps 1, 5) and then for the doubling-back part (7, 8), against the app's own key reserving it for the shared piece.
Criteria at issue: 6 (3 n/a)

### Congruent segments [congruent-segments] — **Tweak**
The figure is the sharpest trap in the batch and fully earns its place: EF measures ≈133 against AD and BC at 130, so it looks like a third equal vertical, and the red highlight at step 4 interrupts precisely the misreading the drawing invites. Steps 2–3 read the two tick pairs cleanly and step 5 converts to algebra. The defect is a flat internal contradiction about tick counts (below); fix the second EXAMPLE to read "so both carry two ticks". Minor second point: step 1 shows the busiest figure in the batch unhighlighted, so the four small ticks get an unguided first look — highlighting all four marks at step 1 would cost nothing.
Criteria at issue: 1, 4 (3 n/a)
BUG: Walkthrough step 2 states "AD and BC both carry two ticks", while the concept's own second EXAMPLE states "AD measures 5 cm and BC measures 5 cm, so both carry one tick" — about the same segments in the same figure. It is a defect and not a nitpick because tick *count* is the load-bearing datum of this concept: a student who takes the EXAMPLE at face value has AD/BC on one tick and EB/DF on one tick, and the concept's own rule ("one tick matches one tick") then licenses the false conclusion AD ≅ EB.

### Midpoint [midpoint] — **Tweak**
Step 2 supplies the condition students routinely drop — M must lie *on* AB, not merely be equidistant — and stating it before reading the ticks is the right order. The parts-blue-then-whole-red move at steps 3 → 4 rhymes deliberately with Segment Addition, which is good cross-concept consistency. But step 4 says "each half is exactly half the whole" and then highlights only the whole, so the sentence points at the halves while the colour points away from them, and there is no equation box anywhere in the concept even though `AM = MB = ½AB` is exactly the algebra step 4 promises a question will want. At step 4, keep AM and MB blue alongside AB red and add `AM = MB = ½AB` to the equation box.
Criteria at issue: 4, 6 (3 n/a)

### Segment bisector [segment-bisector] — **Tweak**
Steps 1–4 do the real work well. The 52°/128° crossing is far enough off square that no student will misread it, which is the whole point of the concept, and demoting AB from blue to ochre at step 3 — the segment being bisected becomes the shared thing — is consistent with the module's colour key. Step 5 is where it slips: it hands the perpendicular case to the `perpendicular` figure, which carries no tick marks at all, so after four steps insisting the ticks are what make M a midpoint, the payoff figure silently withdraws them. Point step 5 at a new `perpBisector` figure that carries both the square and ticks on AP ≅ PB (see below). Also fix step 3's "Line QR", which names one object where the figure draws and lights two separate segments MQ and MR.
Criteria at issue: 4 (3 n/a)

### Perpendicular bisector [perpendicular-bisector] — **Rework**
The idea is worth teaching and step 4's one-way implication is correctly stated. But the concept's entire content is "two jobs at once", and the figure marks exactly one of them: step 2 asserts "it passes through the midpoint, so it halves the segment" over a figure whose only declared mark is the square at ∠APQ, with no ticks on AP or PB. P sits at the numerical centre, so it *looks* like a midpoint — and inviting the student to read it off the drawing is the precise habit this module exists to break, as the sibling Perpendicular concept says in so many words one item later. The fix is not a highlight change: `perpendicular` is shared with Perpendicular, where its sparse marking is load-bearing for that concept's step 4, so a separate `perpBisector` figure is needed carrying both the square and ticks marking AP ≅ PB. While rebuilding it, move the BECAUSE ("it gives you both facts in a proof") into step 4 — it is the most useful sentence in the concept and currently never appears during the walkthrough.
Criteria at issue: 2, 4, 5 (3 n/a)

### Perpendicular [perpendicular] — **Tweak**
The strongest use of colour in the batch. Red is the module's "to be proved" colour, and step 4 spends it on ∠QPB, an angle that visibly measures 90° — so the student meets "obviously true from the picture" and "available as a given" as different categories at exactly the moment their eye has already conflated them. The weakness is that step 4 states the fact and then forbids using it in one compressed sentence, with no route offered; a student is left either thinking ∠QPB is somehow not really 90°, or that the concept's own title and definition ("segments that meet at right angles") already settle it. Extend step 4 to name the route — that ∠APB is a straight angle, so ∠QPB = 180° − 90° must be *derived*, not read. Minor: steps 2 and 3 are visually identical, so the step carrying the concept's key claim arrives with no change on the stage.
Criteria at issue: 5 (3 n/a)

## Batch summary

**Keep 1 · Tweak 6 · Rework 1 · Cut 0 · BUG 1**

One pattern runs through nearly every item here, and it is a figure problem, not a prose problem: the walkthroughs are well written and correctly sequenced, but the stage repeatedly stops moving at exactly the step that carries the hardest claim. Collinear asserts that three points *may not* line up over a picture of three that do; Midpoint talks about the halves while colouring the whole; Perpendicular bisector asserts a midpoint that nothing marks; Segment bisector's payoff figure drops the ticks it spent four steps establishing; Perpendicular and Point and line both repeat a stage across the step that matters most. The underlying cause looks structural — a small shared figure library (`collinear` and `perpendicular` each serve three concepts) with no per-concept variants, so any concept needing an extra mark or a counter-case has nowhere to get one and falls back to asserting it in prose. The fixes are correspondingly cheap and mostly identical in shape: add the mark, add the counter-figure, or add the equation the step is already talking about. Segment Addition is the counter-example that proves the point — it is the one concept that authored its own second figure and its own multi-lane layout, and it is by some distance the best item in the batch.

## Angles

### Acute angle [acute] — **Tweak**
The four-angle strip is the right call: the student reads small–square–wide–flat across the row before any prose, and blue on ∠APB names the leftmost cleanly. But step 3 is the only step that does work — it fixes the boundary at exactly 90° — and it is delivered with the picture unchanged from step 2, pointing at the 40° angle while talking about a 90° one. That is a real defect here, not a missed flourish, because the referent of the claim is a *different* angle that is already on screen: add ochre (or a second colour) on ∠CQD's square at step 3 so "exactly 90° is right, not acute" has something to look at. Steps 2 and 3 also restate the definition and BECAUSE lines verbatim, so the concept is thinner than its three steps suggest.
Criteria at issue: 4, 6

### Right angle [right] — **Keep**
The only concept in the batch that tells the student *how the fact reaches them* rather than what the number is — "the one a figure marks rather than measures" is the module's central claim in miniature, and the flashcard's "the square is not decoration" backs it. Holding blue on ∠CQD across all three steps is fine here, unlike in `acute`: every step is about that same angle, and the square step 2 discusses is drawn inside the highlight already. One observation: step 3's "all right angles are congruent" has no second right angle on screen to be congruent to, so it floats — worth a pointer to the `perpendicular` figure if a cheap edit is ever wanted, but not a defect.
Criteria at issue: none blocking (4 noted)

### Obtuse angle [obtuse] — **Tweak**
Step 1's "there is a ceiling, and it is where most of the mistakes happen" is the most honest framing in the batch, and the trap it names — a straight angle exceeds 90° without being obtuse — is drawn immediately to the right of the highlighted 130° angle. The app never uses it: give ∠GSH a second colour at step 2 while ∠ERF stays blue, so "this counts, that does not" becomes a picture instead of a sentence. Step 3's triangle-sum claim should also go: it is true but imports a fact from outside the module's scope (segments, angles, proof), and there is no triangle anywhere on screen for a student to look for.
Criteria at issue: 4, 6, 7

### Straight angle [straight] — **Tweak**
The payoff is genuine — the stray-looking line has sat in the row since the first concept and is now claimed as a member of the set — and step 1's "the one that does not look like an angle at all" earns it. The structural problem is that blue spanning ∠GSH renders as a coloured line, so the one figure that most needs to say "this is an angle" says "this is a segment"; the printed 180° is all that rescues it. Concrete fix: switch to the existing `straightInDisguise` figure at step 3 (line EF through X with rays to C and D) — it exists in the library, it grounds step 3's otherwise abstract "⅝ of another" trap in a crossing where the straight angle is genuinely hidden, and it mirrors the figure-switch that `supplementary` uses to good effect.
Criteria at issue: 4, 6

### Congruent angles [congruent-angles] — **Rework**
The step sequence is well built — arcs signal congruence, count not size, then the algebraic payoff with `m∠WVX = m∠YVZ` appearing in its own box — and step 4's new equation box is a legible change even with the highlight held. The figure is wrong for the job. `fan` was built for angle addition (its own on-screen title is "Shared middle angle", and `angle-addition`'s example uses it that way), it is perfectly symmetric so the student reads the outer pair as equal by eye before the arcs register, and both arcs match in every respect so step 3's watch-out about arc size has no referent on screen at all. Worse, the unmarked 44° middle wedge sits between two angles the app is busy calling equal and is never mentioned, inviting "all three are the same". What it would take: a purpose-built figure with two congruent angles drawn at different orientations and *visibly different arc radii*, and no unmarked near-equal third angle in the frame.
Criteria at issue: 2, 4, 7

### Angle Addition Postulate [angle-addition] — **Keep**
The best colour work in the batch: blue on the outer angle with ochre on ray VB, which is genuinely the side both parts share, then blue onto each part in turn, then red on the whole as the conclusion with `m∠1 + m∠2 = m∠3` below. The palette does real semantic work and the eye follows part, part, whole in the order the equation is written. Step 2 also does the thing most treatments skip — it stops to say the interior condition is the condition, and that it is easy to skip. One observation: 54° and 70° look near enough to equal that a student may drift toward assuming VB bisects, and nothing says otherwise.
Criteria at issue: none blocking (4 noted)

### Angle bisector [angle-bisector] — **Tweak**
The framing — bisection as the special case of an interior ray, not a separate idea — is right, and the highlight sequence is the most articulate here: whole in blue with the ray in ochre, then blue onto the two halves, then the whole in red as what you can now conclude about. The defect is step 4, which promises "you can write that as an equation straight away" and then shows no equation, while the sibling walkthroughs for angle addition, linear pair and complementary all display one. Add the equation box (`m∠AVD = m∠DVC`, or `2·m∠AVD = m∠AVC` to make "exactly half the whole" explicit). The perfectly symmetric drawing does let appearance do the arcs' work, but a bisector genuinely produces a symmetric picture, so that is inherent rather than a fault.
Criteria at issue: 4, 6

### Adjacent angles [adjacent] — **Tweak**
Pinning adjacency to touching and closing on "Adjacent is about touching. Vertical is about facing" is a clean contrast, and using ∠1/∠3 as an explicit non-example is better than most treatments manage. The red on ∠1 and ∠3 at steps 4–5 is a genuine misuse: the README states red is what is being proved, and here it flags the counterexample, so a student who has internalised the palette reads "this is the target" at exactly the moment the text says "this is not it". Recolour those two steps ochre or a neutral grey. Steps 2/3 and 4/5 are also highlight-identical, but both frozen pairs restate one claim about one pair of angles, so that is a missed flourish rather than a defect.
Criteria at issue: 4, 6

### Linear pair [linear-pair] — **Tweak**
The tightest four steps in the batch, and the colour thinking is deliberate: moving ochre onto BA and BC makes the student see the straight line as *two pieces that join* rather than as one pre-existing line, which is precisely what separates a linear pair from merely adjacent. The defect is that step 3 drops the angle highlights entirely, and step 4 then delivers `m∠ABD + m∠DBC = 180` with the angles still uncoloured — so the "180" is presented against a picture showing only the line, which is the exact confusion the concept exists to prevent. Keep ∠ABD and ∠DBC blue through steps 3 and 4 while BA and BC go ochre.
Criteria at issue: 4, 6

### Vertical angles [vertical-angles] — **Tweak**
The second visit to `crossing` pays off — the numerals are already familiar, so attention goes to the pairing — and watching blue jump from the 133° pair to the 47° pair while the figure holds still is the clearest single moment in the batch. Step 1's ochre on point X alone is exactly right. The defect is step 3, which carries the definitional heart ("each side of ∠1 is the opposite ray of a side of ∠3") with no visual change from step 2, so the one idea that distinguishes vertical angles from "the ones that look opposite" is delivered as words and most students will keep the visual rule. Fix: at step 3 put ochre on the ray pairs XA/XB and XC/XD so the opposite-ray structure is shown. Step 5's unsupported congruence claim is acceptable — it explicitly defers to the Vertical Angles Theorem rather than asking the student to read it off the picture.
Criteria at issue: 4, 6

### Supplementary angles [supplementary] — **Tweak**
The figure switch at step 3 is the strongest design decision in the batch: after anchoring in the familiar linear pair, the diagram changes to two separate crossings and blue and red land on angles in *different figures*, so the physical gap between them carries the claim that supplementary says nothing about where the angles sit. Step 4's always/sometimes/never treatment is correct and well chosen. Two cheap fixes: `twoSupplementPairs` is a borrowed figure whose arcs mark ∠CVB ≅ ∠GWE, a congruence the walkthrough never mentions and which invites the student to think it is part of the point — drop the arcs; and change red on ∠4 to blue, since nothing is being proved and red here reads as "the other one".
Criteria at issue: 4

### Complementary angles [complementary] — **Tweak**
The uneven 35°/55° split is a deliberate good choice — a symmetric figure would have taught "complementary means 45° each" — and the colour logic is coherent, with ochre marking ∠AVC as the containing whole and then as the shared ray VD while blue picks out the parts. The defect is that step 4's text insists the angles need not be near each other while the only thing on screen is two angles jammed together inside a right angle, with no figure change. Given that `supplementary` solves exactly this problem two concepts earlier by switching diagrams, this reads as an oversight: swap to a two-diagram figure at step 4 showing a separate 35° and a separate 55° angle, or reuse the supplementary pattern directly.
Criteria at issue: 4, 6

### Angles around a point [angles-around-point] — **Keep**
The figure switch at step 3 is the pedagogical move and it works: `threeConcurrent` prints 87° and 33° and nothing else, so the student can actually compute the third angle from the half-turn — the only place in this batch where a figure supports an inference rather than illustrating one. Step 4's "look for the straight line first" is sound advice earned by step 3, even though the full-360° comparison is never drawn (and on that six-ray figure could not be, since the other measures are not given). Two observations rather than defects: four simultaneous blue highlights on `aroundPoint` are visually busy, and the concept carries two ideas (360° round a point, 180° on a line) under one name.
Criteria at issue: none blocking (4, 6 noted)

---

## Batch summary

**Keep 3 · Tweak 9 · Rework 1 · Cut 0 · BUGs 0**

Every figure in this batch is arithmetically sound — I recomputed each one's angles from its coordinates and all declared measures, sums and congruences check out, including the 40/44/40 fan, the 133/47 crossing, the 80/70/90/120 full turn and the 60/87/33 half-turn — so nothing here is a correctness bug. The shared figures are a success and should not be read as duplication: `angleClasses` builds a comparison strip that no single-angle diagram could give, and each of the four classes owns a different boundary; `crossing` is used for two genuinely complementary claims, adjacency (∠1 and ∠3 as a non-example) and verticality (the same pair as the example), which reinforce rather than repeat. The batch's one systematic weakness is narrower than the descriptive review suggests. A frozen highlight is only a defect when the frozen step's referent is *a different object already visible on screen* — acute's 90° boundary, obtuse's straight-angle trap, vertical's opposite rays — and in those three cases a one-line colour change would convert a sentence into a picture. Where every step concerns the same angle (right, straight, adjacent's two pairs), holding the highlight is a missed flourish and nothing more. The real recurring fault is different: walkthroughs that assert a detachment or a caveat the picture actively argues against. Complementary says "need not be near each other" over a figure of two angles wedged into one corner; congruent-angles says "arc size means nothing" over two identical arcs; supplementary carries an unmentioned congruence mark from a borrowed figure. `supplementary` and `angles-around-point` both show the cure — switch the figure when the claim outgrows it — and the fixes for the others are mostly to copy that move.

## Properties of equality

### Reflexive Property [reflexive] — **Tweak**
The four-step arc is well judged: it names the objection a student actually has ("it looks like it says nothing"), then shows the shared wedge doing real work, then plants the reflexive-vs-transitive trap. The defect is the step-3 colouring: ∠WVY blue and ∠XVZ red makes the two halves of one future conclusion look asymmetric, when neither is given and neither is being proved here — and the Addition Property paints both of them red on the identical figure, so a student who does both reads a contradiction. Change: at steps 3–4 give ∠WVY and ∠XVZ the same colour and put them in separate lanes, so the ochre wedge sitting inside both is legible as one piece in two wholes rather than three highlights on one strip.
Criteria at issue: 2, 4, 7
(3 n/a — no options; 6 n/a — walkthrough has no hints.)

### Symmetric Property [symmetric] — **Tweak**
The algebra half is exactly right for the idea — `a = b`, then `b = a`, two steps, nothing extra — and step 4's "you reach for it when the next line needs BC on the left" is the honest reason anyone ever cites this property. The problem is that the figure half never shows the flip: AD and BC are both blue and unchanged across steps 3, 4 and 5, so the only thing that moves is the equation box, and step 3 has no box at all. `BC ≅ AD` therefore appears at step 4 as a flip of something the student was never shown. Change: put `AD ≅ BC` in step 3's box so steps 3→4 enact the reversal; the EB ≅ DF ticks are surplus noise and would be better dropped or left unmarked.
Criteria at issue: 2, 4
(3 n/a; 6 n/a.)

### Transitive Property [transitive] — **Keep**
The strongest hinge in the batch. The algebra half already speaks in AB/BC/CD, so step 4 needs no translation; the three parts are disjoint and side by side, so the hinge-in-the-middle, evidence-either-side reading lands at a glance with no lane needed; and the blue→red flip at step 5 genuinely performs the inference while the ochre hinge holds still. Two minor observations, neither worth a change on its own: the single ticked chain AB ≅ BC ≅ CD lets a student read AB ≅ CD straight off the marks, which softens step 5's "nobody had to measure AB or CD"; and `AB = CD` is left in step 3's box, so the conclusion step carries no equation.
Criteria at issue: 2, 4
(3 n/a; 6 n/a.)

### Addition Property of Equality [addition-property] — **Tweak**
The staging is the best use of the fan in the batch: one thing per step, so it reads as a sentence — these two are equal, this is the bit to add, now these two are equal — and ochre for the genuinely shared middle wedge matches the stated convention exactly. The defect is that step 5 unlights the blue arc-marked angles at the very moment it concludes from them, leaving two red angles and a reason the student has to hold in memory. Change: keep ∠WVX and ∠YVZ lit at step 5 and give ∠WVY and ∠XVZ separate lanes so they read as two overlapping wholes. (The absence of printed degrees is correct, not a flaw — the arcs mark what may be used, which is the module's whole point.)
Criteria at issue: 2, 4
(3 n/a; 6 n/a.)

### Subtraction Property of Equality [subtraction-property] — **Keep**
The figure is the best-chosen in the batch: the ochre wedge sits physically between the two blue ones, so "the amount both sides carry" is seen rather than inferred, and the two sides of the equation are the two straight lines themselves. Starting the algebra half already in ∠1/∠2/∠3 notation and then reversing the hinge — "those numbers come off a figure" — is a deliberate and effective inversion, not an accident. Two observations: no step points at the two straight angles ∠CXD and ∠AXB, which is where a lane would have paid off most, and ∠4 is printed but never mentioned.
Criteria at issue: 2, 4
(3 n/a; 6 n/a.)

### Multiplication Property of Equality [multiplication-property] — **Tweak**
The lane device works here: half-against-whole is a length comparison, so offsetting the whole AB below the segment turns it into a bar model a student recognises, and both halves of the item multiply by 2, so the analogy rhymes. The worst thing is step 4: it drops the lane *and* the blue AM at the exact step whose box reads `2 AM = AB`, so the doubling is asserted in algebra while the figure shows one red segment with nothing to double. Change: at step 4 keep AM blue, light MB as well, and keep the ochre AB lane, so "twice the half is the whole" is one glance; separately, stop spending ochre on the point M and on the whole AB, neither of which is a shared piece.
Criteria at issue: 2, 4
(3 n/a; 6 n/a.)

### Division Property of Equality [division-property] — **Tweak**
The figure is clean and symmetric, the arcs genuinely mark the two halves congruent so "twice either half" is readable rather than asserted, and step 5's "finding x is usually the halfway point, not the answer" is good exam advice. The defect is the hinge: the algebra half divides by 3 and the figure half divides by 2, with no step text bridging them, so the student has to supply the abstraction the paired design was meant to hand over. Change: make the algebra divide by 2 (e.g. `2x = 76` → `x = 38`, which also matches the figure's measures), or add a clause at step 3 saying the divisor is whatever both sides carry. Also worth fixing: the ochre whole ∠AVC sits on top of the blue halves with no lane, and step 4 unlights it while the box still names it.
Criteria at issue: 2, 4
(3 n/a; 6 n/a.)

### Substitution Property [substitution] — **Tweak**
The three algebra steps are the clearest statement of substitution in the batch, and the figure is quietly honest: B is drawn at 126 of 300 against a true 125, so a student who eyeballs "the right part is a bit longer" is already near 7 and the red step confirms their estimate instead of ambushing it. The error is the ochre on BC: ochre is declared to mean the shared piece, and this is the one concept whose thesis is that nothing is shared — and the figure looks enough like Transitive's four-in-a-row that a student will read BC as a hinge again. Change: make BC blue at step 4 and red at step 5, reserving ochre; while there, sharpen step 5's "nothing hinges the two statements together", since AB does appear in both — the real point is that it is not a whole side of the second equation.
Criteria at issue: 2, 4, 7
(3 n/a; 6 n/a.)

### Distributive Property [distributive] — **Rework**
The lane reads well — three blue parts above, one continuous ochre whole beneath — and step 5's "neither side has changed in value, only in form; that is why it needs a name of its own" is the best justification line in the batch. But the figure is a picture of a different identity: `a(b + c) = ab + ac` distributes over a sum of two terms, while AD is cut into three *identical* parts, which illustrates 3k = k + k + k, repeated addition. Neither 3x nor −12 corresponds to anything the student is looking at, and step 4's "counting the same three parts term by term" half-concedes it. To fix it the figure must change, not the highlights: a segment cut into two unequal parts b and c, with the lane showing a copies of the whole against a copies of each part, so ab and ac are objects on screen; the x − 4 labelling should also go, since a subtraction cannot honestly be a drawn length.
Criteria at issue: 2, 4
(3 n/a; 6 n/a.)

## Batch summary

Keep 2 (Transitive, Subtraction), Tweak 6 (Reflexive, Symmetric, Addition, Multiplication, Division, Substitution), Rework 1 (Distributive), Cut 0, and no correctness bugs — every figure's coordinates, marks and measures check out against the text, and the divisor mismatch in Division is a pedagogical flaw, not a mathematical one. The cross-cutting pattern is that the highlight vocabulary is treated as decoration rather than as a language: the evidence goes dark at precisely the step that concludes from it (Addition, Multiplication, Division), ochre — declared to mean "the shared piece" — is spent on a point, on whole segments, and on the one quantity in the batch that is explicitly not shared (Substitution), blue and red are used asymmetrically on two objects of equal status (Reflexive), and the lane device that solves the whole-against-parts pile-up is granted to Multiplication and Distributive but withheld from Reflexive, Addition, Division and Subtraction, which need it more. These are configuration fixes, not rewrites, and fixing the fade-the-evidence rule once globally would lift four items at a stroke; Distributive is the only item whose geometry itself has to be replaced.

## The five theorems, reasoning and proof

### Linear Pair Theorem [linear-pair-theorem] — **Tweak**
Four steps doing one job well: the figure declares no degrees, so the 180 cannot be read off the page, and the 115/65 asymmetry quietly kills the idea that the halves must be equal. The problem is the colour: ochre is the module's reserved mark for the shared quantity that gets subtracted away, and this — the student's first encounter with it — puts ochre on line AC, which is not a quantity at all. Recolour AC neutral (or give it a third hue) so ochre still means "shared piece" when the vertical-angles proof depends on it, and carry the equation m∠ABD + m∠DBC = 180 through step 4, which currently summarises the bridge with the "= 180" end of it off screen.
Criteria at issue: 2, 4 (3 n/a, 6 n/a)

### Vertical Angles Theorem [vertical-angles-theorem] — **Tweak**
The best-tracked argument in the batch: ochre holds on ∠2 from step 2 through step 6, visibly present while it is used and still there after it has been subtracted, and blue hops ∠1 → ∠3 as each linear pair is cited, so the colour alone narrates the proof. Two fixes, both cheap. At step 4 the equation is m∠1 + m∠2 = m∠2 + m∠3 but ∠1 has been dark since step 2, so the pivotal transitive line asks the student to read three angles off a figure showing two — light ∠1 again. And steps 2 and 3 assert the 180° totals without naming the Linear Pair Theorem taught one screen earlier; in a module whose whole discipline is citing a reason for every line, name it.
Criteria at issue: 2, 4 (3 n/a, 6 n/a)

### Congruent Supplements Theorem [congruent-supplements] — **Tweak**
Step 1 states the real difficulty honestly, the arcs are genuinely drawn rather than asserted, and step 5's aside ("these two never touch") is the sentence the theorem exists for. The important fault is that the algebra stops exactly where this theorem stops being the vertical-angles proof: steps 2 and 3 get equations, then steps 4, 5 and 6 get none — and step 4→5 is precisely the substitution (m∠3 = m∠4, therefore m∠1 + m∠3 = m∠2 + m∠3) that the vertical-angles proof never needed, because there the shared angle was literally the same angle. Add those two lines to the equation lane. Second, the right-hand configuration is an exact translate of the left (every point shifted by +330 in x), so ∠1 ≅ ∠2 is visible as a slide before any reasoning happens; rotating the right pair would cost nothing and would force the student through the argument.
Criteria at issue: 1, 2, 4 (3 n/a, 6 n/a)
BUG: the EXAMPLE line "∠1 and ∠3 are both supplements of ∠2, so the two must have equal measure" is false against this card's own figure, where ∠1 = 115° and ∠3 = 65° are supplements of each other and the congruent pair is ∠1 ≅ ∠2. Relabel it to match the walkthrough (∠1 and ∠2 are supplements of the congruent ∠3 and ∠4).

### Congruent Complements Theorem [congruent-complements] — **Keep**
The only theorem walkthrough whose equation lane is complete end to end, and it mirrors the vertical-angles step structure line for line so the student feels the parallel; ochre holds on the shared ∠2 throughout, exactly as before. Step 6 earns its keep by pre-empting the near-certain misreading — ∠1 and ∠3 are both 60° and look opposite, and the step says outright that they are not vertical angles, so the conclusion needs this theorem. The honest cost is crowding: four rays, two right-angle squares and three numerals all meet at V, and neither square sits on a numbered angle, so the student must work outward to see which numerals each square contains. That is the right work, and I would leave it.
Criteria at issue: 1, 4 (3 n/a, 6 n/a)
BUG: the two EXAMPLE lines on this card contradict each other. The first ("∠1 and ∠3 are each complementary to the ∠2 between them") matches the figure; the second ("∠1 and ∠2 are each complements of ∠3, so the two must have equal measure") does not — in the figure ∠1 = 60° and ∠2 = 30° are not equal, and ∠1 is not complementary to ∠3. Delete or relabel the second. It is the same reused generic sentence that is wrong on the congruent-supplements card.

### Right Angle Congruence Theorem [right-angle-congruence] — **Tweak**
The figure is right for the claim — two corners with nothing connecting them, each square drawn rather than asserted — and step 5 is the only step doing real work, correctly defending a trivial theorem as the reason you must be able to name. What is missing is the algebra: this is the purest instance of the transitive move in the whole module (m∠1 = 90, m∠2 = 90, so m∠1 = m∠2), the app has an equation lane it uses freely elsewhere, and not one of the five steps uses it. Add those three lines, and light both ∠1 and ∠2 blue at step 3 rather than dropping ∠1 — as built, the two givens are never lit together, so the one beat where the student should be comparing them is the one beat that is missing.
Criteria at issue: 2, 4 (3 n/a, 6 n/a)

### Inductive reasoning [inductive] — **Rework**
The three cases are well chosen — right tilt, vertical, left tilt, degrees printed on the figures (legitimately, since these are measurements) — and the invariant is easy enough to spot that the conjecture genuinely forms in the student's head. But the walkthrough cannot teach the thing it defines. Its definition and WATCH OUT promise that induction yields a conjecture, not a guarantee, and that a single counterexample ends it; the evidence offered is three cases of a conjecture step 5 then concedes is true, no counterexample is ever shown, and step 6's 2, 4, 6, 8 → 10 is underdetermined rather than false, a distinction a student will not feel. A student can leave believing that measuring three cases is how you establish a fact. It would take a second strand where a measured pattern breaks — three figures where two angles look congruent and a fourth where they are not, which also serves the module's central claim — and unfreezing steps 5, 6 and 7, which currently show case C with an identical highlight three times while the text does all the arguing.
Criteria at issue: 2, 4, 7 (3 n/a, 6 n/a)

### Deductive reasoning [deductive] — **Keep**
Reusing the crossing figure and the same ∠1/∠3 pair from the Vertical Angles walkthrough is the best decision in the item: no new configuration to decode, so all the student's attention goes to the logical move. That move is carried by hue alone — the same two wedges go blue (evidence) then red (conclusion), nothing is added to the figure — which is an exact picture of what deduction does, and it cites the Vertical Angles Theorem by name, unlike its neighbours. Step 4's "every crossing ever drawn, which is what measuring three examples could never give you" does the comparison the inductive item only promised. The residual risk, that a fast reader registers "still highlighted" and misses the change of meaning, is inherent to the convention rather than to this item.
Criteria at issue: none (3 n/a, 6 n/a)

### Law of Syllogism [syllogism] — **Tweak**
Steps 4 and 6 state the mechanism correctly and the warning about middle terms matching exactly is the right one. The fault is that the one concept in the module whose entire content is a shared middle term is the one concept that never uses ochre, the colour reserved for the shared piece and used to great effect on ∠2 in vertical angles and ∠XVY in Proof — so steps 2 and 3, the two rules being chained, are visually identical (same figure, same two angles, same blue) and are distinguished by text alone, while the chain's middle link ∠1 ≅ ∠3 is never written in the equation box at all. One change fixes both: put ∠1 ≅ ∠3 in the equation lane at step 3 and colour the congruence ochre, so the student sees the conclusion of rule one become the hypothesis of rule two. Without it the takeaway is step 5's shortcut, which the deductive-reasoning item already delivered with the same figure and the same angles.
Criteria at issue: 2, 4, 7 (3 n/a, 6 n/a)

### Proof [proof] — **Tweak**
The ordering is the most valuable teaching in the module: read the given alone, read the goal and be told never to use it as a reason, then hunt for what they share as its own numbered step in its own colour, and only then write line 1. Every line carries a named reason, nothing is borrowed uncited, the overlap of ∠WVY and ∠XVZ is exactly what the offset lanes exist to show, and the glosses on Reflexive ("it is what licenses adding the same quantity to both sides") and on Definition of congruent angles ("congruence cannot be added; measures can") answer questions students do not know to ask. The one change worth making is to the equation lane: a concept defined as "a chain of statements" shows one link at a time, so at step 10 Substitution combines lines 4 and 5 while neither is on screen, and at step 9 the text names both sums while the box writes only m∠WVX + m∠XVY = m∠WVY. Accumulate the written lines instead of replacing them, and write the right-hand angle-addition line too.
Criteria at issue: 2, 4 (3 n/a, 6 n/a)

## Batch summary

Keep 2, Tweak 6, Rework 1, Cut 0; 2 BUGs, both the same defect. The cross-cutting pattern is that the equation lane and the highlight lane disagree with each other precisely at the hard step. Whenever a walkthrough reaches its purely algebraic move, the highlight contracts to the shared piece and the rest of the figure goes dark, so the equation names more angles than the picture shows lit (vertical angles step 4, Proof step 8), and conversely the equation lane goes empty or half-written exactly where the argument stops being routine (congruent supplements steps 4–6, right-angle congruence throughout, Proof step 9, and the missing middle link in syllogism). Both failures point the same way: the batch is strongest where colour and algebra advance together — congruent complements, vertical angles steps 2–3, the given/goal/bridge opening of Proof — and weakest where one lane carries a step alone. Two smaller threads run alongside: a theorem is sometimes leaned on without being cited (vertical angles uses the Linear Pair Theorem unnamed, one screen after teaching it), while Proof and deductive reasoning name everything they use; and a reused generic EXAMPLE sentence has the angle roles reversed on both congruence cards, which is the source of both BUGs.

---

# Practice

# Practice ▸ Naming and Definitions

Two correctness questions raised by the descriptive review were checked against source before judging, and both come out clean:

- **Ordered click keys are not enforced.** `src/practice/NameExercise.tsx:57-68` checks `chosen[1] === expected[1]` and compares the two outer letters as a sorted pair. The stored key `C, X, A` for `crossing:equiv:2:points` therefore also accepts `A, X, C`, and `B, V, C` also accepts `C, V, B`. The checker does not contradict the explanation it then shows. No bug.
- **"Choose" items do highlight.** The dump prints the raw `highlight` field, which the `choose` branch of `nameItems` never sets. The render expression at `src/practice/NameExercise.tsx:95-99` parses as `(item.highlight ?? (item.mode === "choose")) ? [...] : undefined`, so `choose` highlights (undefined falls through), `label` does not (explicit `false` stops `??`), `points` does (explicit `true`), and plain `click` does not. All four are the intended behaviour. No bug — though the expression is one paren away from inverting three forms at once and is worth parenthesising on sight.

---

## Form "choose" — **Tweak**
The only form that starts from the picture with no name supplied anywhere, and the only one carrying vertex-shifting and arm-swapping distractors, so it is the load-bearing member of the four and nothing else covers its work. Its weakness is in distractor selection rather than construction: `distractors()` is not constrained to keep the answer from being the only option of its geometric type, which is what spoils `obliqueBisector:MR`. The named change is to require at least one distractor collinear with the answer for segment targets and at least one sharing the answer's vertex for angle targets, so orientation alone never decides. Secondary observation: the explanation is a fixed string per target type, so the segment version's "either order" clause fires on items that offer no reversed name.
Criteria at issue: 2, 3, 5

### linearPair:ABD:choose — **Keep**
The three distractors are three separable errors — vertex moved to A, right vertex with the wrong arm, and the whole straight angle offered for one of its parts — and the fixed explanation about the middle letter is an exact answer to the ∠BAD trap. Best-constructed choose item in the sample.

### linearPairCaseB:ABD:choose — **Tweak**
Same answer, same four options reordered, same explanation, on a figure that differs only in its degree measures; the naming problem is identical, so as a pair these two spend two slots on one lesson (criterion 7). Treat `linearPair` and `linearPairCaseB` as one figure for scheduling purposes so both cannot surface in the choose form within a run.

### fourInARow:AD:choose — **Keep**
Every distractor is a genuine sub-segment and AC is a real one-point-short near-miss, so the discriminator is purely which endpoints the highlight spans. The "either order" half of the fixed explanation is idle here, but the "letters must be its endpoints" half is exactly the point.

### angleClasses:BPA:choose — **Keep**
On a twelve-point strip the student must first locate which of four sub-figures is lit, then reject ∠PBA, which puts the vertex on an arm endpoint where no angle exists. Two distractors being real angles elsewhere in the same drawing is the right choice for a figure this busy.

### obliqueBisector:MR:choose — **Tweak**
MR is the only option not lying along the horizontal AB, so it is found by orientation without reading a single letter (criterion 2). Swap the distractor AB for MQ: both halves of the slanted line are then offered and the letters have to decide.

## Form "label" — **Keep**
The explanation is instantiated per item — it names the actual letters, the actual vertex and the actual numeral — which is the strongest explanation pattern in the Naming bank and the one the other forms should copy. Distractors are simply the remaining numerals, which needs no craft and wastes none. It overlaps "points" in conceptual content, but as the easier recognition direction of the same idea it reads as a difficulty ladder rather than duplication.
Criteria at issue: 3, 5, 7

### numberedCorner:equiv:1:label — **Keep**
∠3 = ∠AVC shares arm VA with the answer and contains it, so a student tracking one letter instead of two lands on it. Only three options exist because the figure carries three labels, making this a 1-in-3 guess against 1-in-4 elsewhere — acceptable, but worth knowing when the form's difficulty is quoted.

### crossing:equiv:1–4:label — **Keep** (all four)
The figure's real virtue is that the two wide wedges are equal and the two narrow ones are equal, so size never separates ∠1 from ∠3 or ∠2 from ∠4 and the student is forced onto the letters. The four are structurally identical by design; see the scheduling note in the batch summary, because `equivalenceItem` draws from only two figures.

## Form "click" — **Tweak**
The three-letter name is printed in the prompt, so the item reduces to locating labelled points and clicking three of them in an order already given; what remains is the ordering habit and the figure-reading, which is real work on crowded or mirrored figures and close to free on sparse ones. Restrict name-given click items to figures that make the search cost something — six or more labelled points, or a congruent mirrored twin — and route sparse figures to `choose` or `points` instead. A genuine strength not visible in the dump: `NameExercise.tsx:71-78` detects the right-three-points-wrong-vertex case and replies to that specific error rather than repeating the generic note.
Criteria at issue: 2, 5, 7

### threeOnLine:SVQ:click — **Keep**
All three visible wedges are 60°, so the geometry offers nothing at all and only the labels can decide — a deliberate-looking property for a form meant to test reading letters off a figure.

### angleClasses:DQC:click — **Keep**
Twelve labelled points and four candidate vertices make the find-the-point work substantial, which is precisely the condition under which this form earns its slot.

### complementary:VD:click — **Tweak**
The two-point variant on a four-point figure where VD is already drawn as its own edge and named in the prompt: the student clicks the two labelled ends of a highlighted-adjacent line, which tests almost nothing (criterion 2). Drop two-point click items on figures with fewer than six labelled points, or target a segment that is not drawn as a single edge.

### twoRightAngles:CAB:click — **Keep**
The two right angles are congruent and mirrored, so the shape gives no hint about which vertex is A and which is E; reading the letters is the only route.

### twoSupplementPairs:CVB:click — **Keep**
Two translated copies of one linear pair with arcs marking ∠CVB ≅ ∠GWE. A student who has the shape but not the letters clicks G, W, E, which is exactly the error the form should catch.

## Form "points" — **Keep**
The inverse of "label" and the form doing the central conceptual work of the exercise type: the instantiated explanation ("a label is a shorthand; the three-point name says where the angle is") is the sentence the whole Naming bank exists to deliver. The answer key is order-tolerant in the checker, so the form does not punish ∠AXC for ∠CXA. Criterion 7 caveat only: it draws from the same two labelled figures as "label", and the five sampled instances exhaust `numberedCorner` entirely.
Criteria at issue: 1 (checked, passes), 5, 7

### crossing:equiv:1:points — **Keep**
∠1 is the wide top wedge; with the equal-pairs geometry, the student must read A and D rather than judge size.

### crossing:equiv:2:points — **Keep**
Stored key is C, X, A; the checker compares the outer letters as a set, so A, X, C also scores correct and the item does not contradict its own explanation.

### numberedCorner:equiv:1:points — **Keep**
∠1 = ∠AVB is the smaller of two overlapping regions at V, so the arm labels have to be read rather than guessed from the fan.

### numberedCorner:equiv:2:points — **Keep**
Stored key B, V, C, accepted in either arm order. ∠2 shares arm VC with ∠3, which is the useful discrimination.

### numberedCorner:equiv:3:points — **Keep**
∠3 = ∠AVC is the outer angle containing the other two, so the student has to notice that the marked region spans both sub-angles and name the extreme arms.

## Kind "example-to-term" — **Tweak**
Construction is sound and better protected than it looks: the `FIGURE_SHOWS` guard in `conceptQuiz.ts` removes any distractor that is also true of the figure, so figure-bearing items cannot acquire a second defensible answer. The failure is in feedback, and it is structural — `why` is assembled per concept as `because + watch` (`conceptQuiz.ts:161`), never per question, so a concept with no `because` shows a bare watch note that may have nothing to do with what was asked. Give this kind a rebuttal line aimed at the live distractor, on the model the Naming "label" form already uses.
Criteria at issue: 3, 5

### angles-around-point:example-to-term — **Tweak**
Only the Angle Addition Postulate is a live distractor; Acute angle and Angle bisector are dead on arrival, and the explanation is a solving tip about finding the straight line first for arithmetic this item never asks. Replace the explanation with one sentence separating "goes once around, so 360°" from "adds adjacent parts of a single angle", and swap the two dead options for Linear pair and Supplementary angles.

### straight:example-to-term — **Keep**
The figure earns its place exactly as criterion 4 describes: the oblique crossing line makes a straight angle look like a pair of angles, and because CD is slanted rather than square, Perpendicular is a live trap for a glance while remaining genuinely false. The explanation hits the deeper "not a non-angle" misconception and leaves the perpendicular trap unaddressed, which is a missed opportunity rather than a defect.

### vertical-angles-theorem:example-to-term — **Keep**
Shares its full option set with congruent-supplements under a different answer, so neither can be passed by recognising the shape of the list, and the explanation supplies the actual subtraction argument instead of restating the answer.

### congruent-supplements:example-to-term — **Keep**
The other half of the batch's best pair, with the same strengths. The only exposure is scheduling: adjacent placement turns the second into an elimination exercise.

### distributive:example-to-term — **Keep**
One live distractor and the right one, since the student did multiply. The explanation's "without changing either side's value" implicitly separates distributing over parentheses from multiplying both sides, though saying so outright would have closed it.

## Kind "term-to-example" — **Tweak**
Drawing options from sibling concepts' own example texts produces the sharpest near-misses in the batch (the complements/supplements twins, the midpoint offered as a bisector), which is why three of five sampled instances work well. The pool is not filtered for whether a sentence is actually an *instance*, so concept remarks and card annotations enter as options — the cause of the `collinear` failure and of the style tell in `segment-addition`. Filter the example pool to self-contained instance statements, and additionally exclude any correct option containing a root of the term being asked about, which `givesItAway` currently only applies to definitions.
Criteria at issue: 2, 3, 5

### congruent-complements:term-to-example — **Keep**
The correct option sits beside a near-identical sentence with "supplements" swapped in, and the explanation names that trap directly as identical reasoning at 90° instead of 180°. This is the model the rest of the kind should follow.

### segment-bisector:term-to-example — **Tweak**
The option set is excellent — "AB = 22, and the point on AB that makes both halves 11" is the sharpest midpoint-for-bisector near-miss available — but the correct option is the only one containing the word "bisects", so it can be matched on vocabulary without knowing the concept (criterion 2). Reword it to avoid the term ("a ray through the point that divides AB into two equal halves"), and repoint the explanation, which currently discusses perpendicular bisectors that appear in no option, at the midpoint-versus-bisector distinction the item actually offers.

### addition-property:term-to-example — **Tweak**
"From AB = 5 and AB + BC = 12 conclude 5 + BC = 12" is a first-rate trap, showing an addition sign while performing a substitution. The explanation is correct and general but never disarms it; add one clause naming the substitution disguise.

### collinear:term-to-example — **Rework**
Two options are bare angle measures and a third is about proof formats, so the correct option is the only one mentioning points or lines at all and wins without the word being known (criterion 2); it is also a remark about the concept rather than an instance of it, and the explanation repeats that remark verbatim (criterion 5). To make it work: supply a real instance ("D lies on AB between A and B, so A, D and B are collinear") and draw all three distractors from the point-and-segment pool rather than from angle measures.

### segment-addition:term-to-example — **Tweak**
The keyed option begins "Read backwards it is a subtraction:", a card annotation rather than a standalone statement, which makes the answer the only option of its grammatical type among three self-contained ones. Rewrite it to stand alone ("AC = 80.5 and AB = 25.75, so BC = 54.75"). The explanation is the most substantial in the batch and needs nothing.

## Kind "def-to-term" — **Rework**
Four of five sampled instances are solvable by asking only what *sort of thing* the quoted definition describes, and the cause is locatable: `kindMatched` at `conceptQuiz.ts:264` is gated on `KIND_NOUN[c.kind] !== "term"`, so type-matching is applied to postulates, properties and theorems but switched off for `definition` and `reasoning` concepts, which then draw topic-similar siblings of any shape. A definition of a ray meets three angle-size classifications; a definition of a pair of angles meets a single angle and a ray. As built, the kind does not test the concept it names, which is why this is Rework rather than Tweak even though each individual repair is a distractor swap. What it takes: tag each concept with a subject type (single angle / pair of angles / ray / line-or-segment relation / segment) and filter the `def-to-term` pool by it. That one change also closes the leak noted in the review, where the skip rule sees only the definition text and not the option set.
Criteria at issue: 2, 3, 5

### segment-addition:def-to-term — **Keep**
The exception that demonstrates the fix: three of four options are segment concepts, so no elimination by shape is available, and the explanation's insistence on betweenness lands because betweenness is what the quoted definition contains. (Its `why` is byte-identical to the term-to-example item's, a consequence of the per-concept explanation — harmless here, a repeat if the two land in one sitting.)

### linear-pair:def-to-term — **Tweak**
The quoted definition plainly concerns two angles; Acute angle is one angle and Angle bisector is a ray, so both fall without geometry and the item collapses to a coin flip against Perpendicular. Swap those two for Supplementary angles and Vertical angles.

### angle-bisector:def-to-term — **Tweak**
A definition of a ray offered against Acute angle, Supplementary angles and Obtuse angle, none of which is a ray. Draw the distractors from the bisector family instead — Segment bisector and Perpendicular bisector — so the student has to distinguish what is being cut.

### perpendicular:def-to-term — **Tweak**
Linear pair is the one semi-live neighbour; Congruent angles and Angle bisector cannot be two-line relations. Swap them for Vertical angles and Right angle, both of which live at the same crossing and are genuinely confusable with it.

### vertical-angles:def-to-term — **Tweak**
Obtuse, Acute and Straight angle are all single-angle size classes set against a definition of a pair, so type alone decides. The repair and the explanation align unusually well here: put Adjacent angles and Linear pair among the options and the closing sentence — "adjacent is about touching; vertical is about facing" — stops being a good remark about an absent confusion and becomes a targeted rebuttal.

## Kind "term-to-def" — **Keep**
The most consistently well-formed kind, and for a structural reason rather than luck: because every option is a definition statement, the pool is type-matched for free and the shortcut that undoes `def-to-term` is unavailable. Four of five sampled instances force the student to read and compare statements; the one weak instance is weak by the same mechanism as `def-to-term`, which is worth watching if the option pool ever widens.
Criteria at issue: 2, 3

### acute:term-to-def — **Keep**
Three angle-measure ranges plus one linear-pair definition means the student reads inequalities rather than spotting a category, and the explanation goes straight at the boundary those ranges create: 90° is right, not acute.

### division-property:term-to-def — **Keep**
The cleanest item in the batch — subtraction, multiplication, division with the c ≠ 0 rider and reflexivity, all four genuine properties of equality. The explanation is sound; flagging the nonzero condition would have used the item fully.

### inductive:term-to-def — **Keep**
The deductive-reasoning option is the exact confusion for inductive, and the explanation answers it precisely: a conjecture, not a guarantee, ended by one counterexample.

### syllogism:term-to-def — **Keep**
Mirrors inductive across a shared option set the way the two theorem items mirror each other, with a targeted explanation placing it one level up from the transitive property. Same scheduling caveat as every mirrored pair.

### obtuse:term-to-def — **Tweak**
Against "total 180°", "total 90°" and a bisector definition, the correct range is the only option describing one angle's size, so it wins without being read (criterion 2); and the explanation's sharp point — a straight angle exceeds 90° without being obtuse — has no option to test it. Both are fixed by one swap: replace "two angles whose measures total 90°" with "an angle measuring exactly 180°".

## Batch summary

**Families (8):** Keep 3, Tweak 4, Rework 1, Cut 0.
**Instances (40 items across 37 entries):** Keep 27, Tweak 12, Rework 1, Cut 0.
**BUGs: none.** Both correctness candidates raised by the review were checked in source and pass — the click checker is order-tolerant on the outer letters, and the `choose` form does highlight its target despite what the dump's raw field shows.

Across both exercise types the same structural fault repeats in two guises: **teaching material is attached at the wrong granularity**. In Naming, the two forms whose explanation is instantiated per item — `label` and `points` — are the strongest in the bank, while the two carrying a fixed string per target type leak an idle clause whenever the item does not raise that particular confusion. In Definitions the same fault is more severe because `why` is built once per *concept* as `because + watch`, so it cannot name the distractor the student chose, it repeats verbatim when one concept appears in two kinds, and it degenerates to a bare watch note for concepts with no `because` — which is how a computation tip ends up explaining `angles-around-point` and a restatement ends up explaining `collinear`. The distractor pools fail in a parallel way: they are selected by topic similarity, and the one type-matching mechanism that exists is switched off for exactly the concepts that most need it, which single-handedly accounts for the `def-to-term` verdict. Criterion 7 is the other live concern, and it is scheduling rather than content: `equivalenceItem` draws from only two labelled figures across seven labelled angles, so roughly three or four of every twelve Naming items come from `crossing` or `numberedCorner`, and the mirrored Definitions pairs that share option sets are an asset when separated and a giveaway when adjacent. A per-figure cooldown, a rule against repeating a form on a figure before the other forms have been used, and a rule keeping shared-option-pool items apart would resolve nearly all of it without a single new drawing or concept.

# Practice ▸ Diagram ↔ equation

## Sub-tab: Figure → equation

### between-sum — **Tweak**
The off-centre B (126 vs 174) is a real defence against the imported `AB = BC` reflex, and the unlabelled figure forces part-whole reasoning rather than arithmetic. The problem is the acceptance list: only `AB + BC = AC` is accepted, so a student who builds `AC = AB + BC` (the toolbar has explicit left and right slots, and "the whole is the parts" is naturally spoken whole-first) or the commuted `BC + AB = AC` is told a correct statement is wrong. Add the side-swapped and commuted forms, or normalise both before comparing.
Criteria at issue: 1, 2, 4
BUG: `AC = AB + BC` and `BC + AB = AC` are correct answers to the prompt and are rejected.

### midpoint-halves — **Tweak**
The four accepted forms correctly recognise that "midpoint" licenses both the equal-halves and the half-the-whole reading, and rejecting `AM + MB = AB` is defensible — the prompt asks what the *ticks* give, and that is Segment Addition, not the midpoint. But the generosity is one-sided: `MB = AM`, `AB/2 = AM` and `AB = 2 AM` are the same four statements with the sides exchanged or the coefficient moved, and none is accepted. Mirror every accepted form.
Criteria at issue: 1, 2
BUG: `MB = AM`, `AB/2 = AM`, `AB = 2 AM` are correct and rejected.

### linear-pair-180 — **Tweak**
A clean linear-pair item, and the printed 115/65 is a well-chosen bait for the arithmetic reflex. Two defects, one of them correctness: the figure prints the angle as **∠DBA**, while the only accepted answer spells it `m∠ABD`, so a student copying the label off the drawing builds a correct equation and is refused; the commuted `m∠DBC + m∠ABD = 180` fails too. Normalise vertex-order and operand-order; and have the feedback say explicitly why `115 + 65 = 180` is not the answer rather than leaving the student to guess.
Criteria at issue: 1, 2, 5
BUG: `m∠DBA + m∠DBC = 180` (the figure's own spelling) and the commuted order are correct and rejected.

### complementary-90 — **Keep**
The strongest prompt design in the sub-tab: D is never named, so the student must locate the interior ray and read its label off the drawing before they can build anything, and the click-to-name affordance earns its place here. The square carries the 90 honestly and the printed 35/55 baits the numeral reflex. One thing to watch as the symmetric-acceptance fix goes in elsewhere: `m∠DVC + m∠AVD = 90` should be accepted too, though the figure's left-to-right order makes that miss unlikely.
Criteria at issue: 2, 4

### three-on-line — **Tweak**
The three visibly identical 60° wedges with no congruence arcs make this a quiet marks-versus-appearance item hiding inside an addition item — that is its best feature, and nothing tells the student about it. The "why" instead offers a strategy note ("look for the straight line first") that answers a question this item did not ask. Rewrite the "why" to name that the three equal-looking angles are *not* asserted congruent, so the rejected `m∠PVR = m∠RVS = m∠SVQ` gets the explanation it deserves.
Criteria at issue: 4, 5

### vertical-equal — **Keep**
Congruence and measure-equality are both accepted, which is right, and the salient wrong move (`m∠1 + m∠2 = 180` — true, but about the wrong pair) is a genuine misread of "opposite across the vertex" as "adjacent and big". The third accepted form, the prose "∠1 and ∠3 are vertical angles", is probably not buildable in this toolbar; that is harmless surplus, not a defect.
Criteria at issue: 2

### arcs-equal — **Keep**
The best-calibrated figure in the sub-tab. Making the middle angle 44° against two 40° outer angles means the congruent pair genuinely cannot be picked by eye at this scale, so the arcs are load-bearing rather than confirmatory — exactly the module's thesis, enforced by construction. Both equation and congruence forms are accepted.
Criteria at issue: 2, 4

### bisector-equal — **Keep**
A straightforward word-to-notation translation: "bisects" becomes two equal halves, with both `m∠AVD = m∠DVC` and `∠AVD ≅ ∠DVC` accepted. The prompt does state the fact the arcs mark, so there is no extraction to do — but transcription into correct notation is this item's declared job and it does it. Mild overlap with midpoint-halves (the segment analogue) and arcs-equal (same equation shape), justified by the distinct vocabulary.
Criteria at issue: 2, 7

### whole-from-parts — **Tweak**
The angle/segment parallel is the right thing to teach and the "why" names the interiority condition, which is the part students skip. But the toolbar's explicit left-side/right-side slots invite `m∠WVY = m∠WVX + m∠XVY` — the whole stated first — and that correct equation is rejected. Accept it, or compare equations up to side-swap. Secondary: sharing a figure with arcs-equal while keying a different answer is a usability hazard worth a visual cue.
Criteria at issue: 1, 2, 7
BUG: `m∠WVY = m∠WVX + m∠XVY` is correct and rejected.

### three-concurrent — **Tweak**
The "why" is the strongest in the sub-tab — it names the opposite-ray pairs instead of asserting the conclusion — and the far-side twin is a real step up from the two-line case. Two problems: the target angle is labelled **Z** on the figure and its twin carries no label at all, so the student must translate names onto a six-ray drawing; and `∠TVU` is the identical angle to the keyed `∠UVT`, so a correct answer written in the other order is rejected. Normalise the letter order and label the twin region.
Criteria at issue: 1, 2, 4
BUG: `∠TVU ≅ ∠RVS` / `m∠TVU = m∠RVS` name the same angles and are rejected.

### marked-only — **Keep**
The best-built item in the batch. EF is 133 units against BC at 130 and EB at 135 — indistinguishable on screen, and unmarked — so the baited answer `EF ≅ BC` is refused by the one rule the module exists to teach, with a "why" that names EF as the unmarked segment. The deliberately generous acceptance (any one true marked congruence, in either notation) is right, because the skill is reading marks, not picking a pair.
Criteria at issue: 2, 4

### supplements-of-congruent — **Rework**
The item's id, title, arcs and two-vertex layout all set up Congruent Supplements, and then the question asked is just "∠1 and ∠3 are a linear pair" — answerable from the left vertex alone, with the arcs and the whole right-hand figure contributing nothing. A student who reads the setup properly will answer about ∠1 and ∠2, the pair everything is pointing at, and be marked wrong for it. Either ask the intended question (what the figure says about ∠1 and ∠2, given ∠3 ≅ ∠4), or split it into staged steps as the cc-step items do; as a bare linear-pair item it duplicates linear-pair-180.
Criteria at issue: 2, 4, 7

### cc-step1 — **Keep**
Numbered angles keep the build cheap so the attention goes to the relationship, and the "why" tells the student outright that this is line one of a proof rather than an end in itself — that framing is what makes the three-item sequence work. The printed 60/30 baits the numeral reflex as elsewhere, and `m∠AVC = 90` (restating the square instead of decomposing it) is a live second miss.
Criteria at issue: 2, 5

### cc-step2 — **Keep**
Reusing the identical figure with attention moved to the other square is the point, not a shortcut: Congruent Complements turns on two different pairs summing to the same 90, and seeing it twice is how that lands. The "why" closing on "now two different sums both equal 90" sets up the transitive step properly. It is mechanically producible by swapping one token, which is acceptable for a fluency step in a chain; naming ∠2 as the shared piece in the prompt would make cc-step5 less abrupt.
Criteria at issue: 2, 7

### cc-step5 — **Tweak**
The notational point — equal measures are written as a congruence between the angles themselves — is genuinely muddled by students and deserves an item. As built it is bypassed: the prompt hands over the string `m∠1 = m∠3`, and that string is accepted, so the path of least resistance is to rebuild the sentence just read and never meet the notation step. Drop `m∠1 = m∠3` from the accepted list and reject it with a nudge ("true, but write it as a congruence").
Criteria at issue: 2, 5

### double-part — **Tweak**
Word-to-symbol translation of "twice" is worth its own item, and the figure protects against the classic inversion: substituting 76 and 38 shows immediately which side takes the coefficient. But only `m∠AVC = 2 m∠AVD` is accepted, and `2 m∠AVD = m∠AVC` is the same equation with the sides exchanged — the single most predictable alternative build. Accept it and the division form.
Criteria at issue: 1, 2
BUG: `2 m∠AVD = m∠AVC` (and `m∠AVD = m∠AVC / 2`) are correct and rejected.

## Sub-tab: Description → figure

### make-midpoint — **Tweak**
As the first segment drag it has a job, and the "why" does something valuable by naming the gap between a tolerance-checked drag and an exactly equal pair on paper. But with AB and BC printed live to two decimals, the task is completed by watching two numbers converge — a servo loop that never requires the thought "the midpoint is where the halves are equal". Cheapest fix: require a prediction before the drag (or hold the AB/BC readout until Check, leaving AC visible), so the definition has to be used once before the nudging starts.
Criteria at issue: 2, 5

### make-bisector — **Keep**
The interior condition is what lifts this above a number chase: a student who drags D outside ∠AVC can equalise two measures in the reflex sense and is still refused, which is a conceptual catch rather than a numeric one, and the "why" states both halves of the definition exactly as the checker enforces them. The angle-measure convergence remains nudgeable, but the second condition means a passing drag requires the whole definition.
Criteria at issue: 2

### make-right — **Tweak**
One condition, one displayed number, and the number is the answer: nothing here can distinguish a student who knows what a right angle is from one who moves D until the readout says 90. It can still earn its slot as the on-ramp that teaches the interaction — but then it should be sequenced first and framed that way. Also start from a tilted BA: with BA horizontal the student learns the vertical-looking template rather than the measure, and tilting costs nothing.
Criteria at issue: 2, 7

### make-complementary — **Tweak**
The idea is good — one drag, and 30/60 emerges as a consequence — and the "why" names complementarity as a constraint rather than a vocabulary word. As built the student is handed the number to chase, so the reasoning happens only in the after-the-fact explanation. Invert it: ask for m∠DVC = 60 while the checklist displays m∠AVD, and the student must subtract from 90 before moving.
Criteria at issue: 2, 5

### make-double — **Keep**
A ratio target rather than a value target, so there is no single number to converge on — the student has to hold a relationship between two measures while dragging, which is a different mental act from chasing a readout. The live checklist is used well here: the classic inversion (making ∠DVC the double) is caught immediately and is recognisable *as* an inversion, and the "why" names a real method rather than restating the answer.
Criteria at issue: 2, 5

### supp-not-linear — **Tweak**
The design is the sharpest in the sub-tab: the must-stay-false condition is unfalsifiable by construction, because the two angles sit at separate vertices and can never touch, so the lesson "supplementary does not imply linear pair" arrives through the impossibility itself. That entire payload depends on the student seeing it. Show the "not a linear pair" row live and green from the first frame (with a one-line note in the "why" pointing at it); if it is only evaluated at Check, the item collapses into another sum-to-180 chase and most students will never notice the point.
Criteria at issue: 2, 5

### double-part-segment — **Keep**
The ratio target does the same work as make-double, and the "why" goes further than any other in the sub-tab by converting the ratio into a position — B sits two thirds along AC — which is an actionable prediction a student can make *before* the first drag. The betweenness condition is doing real work: B dragged past C could satisfy a length ratio from outside the segment.
Criteria at issue: 2, 5

### not-between — **Keep**
The conceptual high point of the batch, and not a measurement task at all. The two conditions pull against each other, so the instinctive move (drag C off the line) satisfies one and breaks the other visibly, and the student must work out that the escape runs *along* the constraint — C slides past A — which is the shape of every counterexample argument. The "why" names the logic explicitly: honour the hypothesis, break the conclusion.
Criteria at issue: 2, 5

## Sub-tab: What is true?

### fa12-marks — **Tweak**
The figure is the intended strength executed properly: BC at 130, EF at 133 and EB at 135 are indistinguishable on screen while EF carries no tick, so `BC ≅ EF` and `EB ≅ EF` are traps a careful looker falls into and only the marks resolve. The "why" is precise and its closing clause is the sub-tab's thesis. One distractor is dead: `AE ≅ EF` is 165 against 133 and can be eliminated by inspection without invoking the rule at all. Swap it for `AE ≅ FC` — both are exactly 165 and neither is marked, so it fails for the right reason instead of the wrong one.
Criteria at issue: 3, 4

### crossing-truths — **Keep**
The "adjacent" distractor is a fair and well-aimed vocabulary trap: vertical angles do touch at X, and the technical requirement of a shared *side* is precisely what separates the two terms. The second distractor catches "vertical angles" used as a label for any pair made by crossing lines. Worth noting a tension the app never addresses anywhere but perpendicular-truths: nothing here is marked, and the student must accept a drawn segment as asserting collinearity — legitimate, but a different species of given from a tick.
Criteria at issue: 3, 4

### midpoint-truths — **Tweak**
Three-of-four-true is good select-all discipline, and betweenness-from-a-drawn-point is a real given worth including. But the single false claim, `AM ≅ AB`, is a notation slip rather than a live marks-versus-looks trap — nobody is tempted, they are only careless — so criterion 3 is barely exercised. Two cheap changes: replace `AM ≅ AB` with a distractor that fails on marks (add an unmarked point N on AB and offer `AN ≅ NB`), and extend the "why" to say why `M is between A and B` *is* asserted, since a student applying the sub-tab's own rule strictly will refuse to tick it for exactly the right reasons.
Criteria at issue: 3, 5, 7

### perpendicular-truths — **Keep**
The sharpest item in the batch. AP and PB are pixel-for-pixel equal at 160 units each, so a student who measures gets the right answer to the wrong question — a harder line to hold than "the drawing deceives you", and the correct one: the figure is not lying, it simply is not asserting. The "why" then names what *is* given — the square, and P drawn on AB — so the rule reads as a distinction rather than blanket scepticism, which is what keeps it learnable.
Criteria at issue: 2, 4, 5

## Batch summary

**Keep 13 · Tweak 14 · Rework 1 · Cut 0 · BUGs 6.** The authored content is in good shape — the figures do the module's central work honestly and often brilliantly (arcs-equal's 40/44/40, marked-only's three indistinguishable segments, perpendicular-truths' exactly-equal-but-unmarked halves), and the "why" texts are specific far more often than generic. The cross-cutting defect is not pedagogical but mechanical: the Figure → equation checker appears to compare built statements literally, with no normalisation for operand order (`BC + AB`), side-swap (`AC = AB + BC`, `2 m∠AVD = m∠AVC`, `m∠WVY = m∠WVX + m∠XVY`) or vertex-letter order (`∠DBA` for `∠ABD`, `∠TVU` for `∠UVT`) — and in linear-pair-180 the figure prints the very spelling the checker refuses. Six items reject answers that are correct, which by criterion 1 is a bug in each, but the economical fix is one normalisation pass in the comparator rather than sixteen hand-extended lists. The second, milder pattern runs through the drag sub-tab: where a task has one target number on a live checklist (make-right, make-complementary, make-midpoint) the interface converts reasoning into a servo loop, while every task built around a ratio, a competing constraint or a counterexample (make-double, double-part-segment, not-between, make-bisector) survives the live display intact — the fix is to choose targets the student must derive before moving, not to hide the numbers.

# Practice ▸ Solve

## Sub-tab: One answer

### fa4-fraction — **Keep**
The mismatched number formats (fractional coefficient against a decimal) are a real and well-chosen difficulty, and the unit dash is correctly set since x is a bare number. The two hints split cleanly: hint one gives the congruence-to-equation move and leaves the technique, hint two gives the technique and leaves the arithmetic — a student who stops after hint one still has work. The reciprocal error (0.4 × ⅔ = 0.2667) is the obvious wrong entry, but it is already pre-empted in hint two and named in the WHY, so a declared trap would be belt-and-braces rather than a fix; add it if traps are cheap.
Criteria at issue: 6 (satisfied), 5 (minor)

### fa5-midpoint — **Tweak**
The item's entire content is the hidden definition: reading "DG ≅ GE with G on DE" as the midpoint condition and halving 22 before touching the algebra. Hint one states that inference outright ("G is the midpoint") and hint two finishes the setup, so between them nothing is left but 6x = 15 — the clearest criterion 6 failure in the batch. Change hint one to a question that leaves the inference with the student ("G is on DE and the two pieces are congruent — where on DE does that put G?"), and declare 4.33 as a trap (produced by setting 6x − 4 = 22, i.e. doing everything right except reading "G lies on DE"); 11 is a worthwhile second, from reporting the length instead of x.
Criteria at issue: 5, 6

### fa7-linear-pair — **Tweak**
As a one-subtraction definition check this does its job, and the figure earns its place by establishing that A, B, C are collinear — the fact that makes the pair linear — while correctly printing no numerals. The hint restates the definition, which is the whole question, but for a recall item there is no intermediate position for a hint to occupy, so this is a limitation of the format rather than a defect to fix. The one change worth making is declaring 3 as a trap, from a student who confuses supplementary with complementary; 87, from one who thinks a linear pair is congruent, is a reasonable second.
Criteria at issue: 5, 6 (format-limited), 4 (satisfied)

### fa9-building — **Tweak**
The hints are the strongest pair in the sub-tab: hint one supplies the modelling insight ("both measurements start from the same place") without the operation, and hint two states the part-whole relation in words, so a student can stop after either and still do real work. The "three-storey" decoy is deliberately planted and the WHY names it afterwards, which is good practice. Declare the two wrong entries the item invites: 106.25 (adding rather than subtracting, the commonest slip with two decimals of different precision) and 26.83 (80.5 ÷ 3, the payoff of the storey decoy — a planted decoy deserves a correction note that fires when the student takes it). A vertical number-line figure with 0, 25.75 and 80.5 marked would help, but the prose is sufficient and the absence is not a defect.
Criteria at issue: 5, 4 (minor), 6 (satisfied)

### fa10-substitute-back — **Tweak**
The canonical "one step past the x you solved for", executed well: x = 5 is a clean integer so stopping there feels like arriving, the declared trap on 5 is exactly right, and its note points straight at the substitution rather than re-deriving x. Hint two ("Solve for x — then read the question again before answering") is a meta-hint about test behaviour and is the right advice for precisely the student about to submit 5. The gap is a second declared trap on 107 — the student who remembered to substitute but grabbed ∠B; because 107 and 73 are supplements, this error survives any plausibility check the student could apply.
Criteria at issue: 5

### fa11-three-lines — **Tweak**
The figure is load-bearing (∠X, ∠Y, ∠Z exist only as printed labels), the unused third line is honest bait that makes the 360° route look necessary, and running the labels X, Z, Y rather than alphabetically puts the unknown at one end, which is a small deliberate sharpening. The single hint — "Always look for the straight line first" — is the entire trick in one line, so the hint is all-or-nothing: before it the student has nothing, after it the item is over. Add a first hint that asks rather than tells ("Which of the labelled points lie on one straight line through V?") and demote the current one to second, and declare 240 as a trap (360 − 87 − 33, from a student who took the bait and never found the straight line).
Criteria at issue: 5, 6

### fa12-marked — **Tweak**
The figure is the best-constructed in the batch and is the module's lesson in miniature: drawn, AE (165 units) is longer than EB (135), while the true lengths are 10.85 against 16.4, so eyeballing gives the wrong picture and only the marks count — the WHY says exactly that. The problem is that the prompt gives away the figure-reading it was built to require: "the single ticks mark EB ≅ DF" states the fact the student was supposed to extract, leaving only a stated transfer and a subtraction. Cut that clause — the figure already marks the ticks, so the prompt can read "E lies on AB. If AB = 27.25 m and DF = 16.4 m, what is AE in metres?" — and declare 16.4 as a trap (transferred the congruence, forgot the subtraction was still to come), with 43.65 a distant second. Note also that this is Part B of the two-part fa12 verbatim, including the numbers; if both can surface in one session, change this one's figures.
Criteria at issue: 2, 4 (strength), 5, 7

### fa13a-straight — **Tweak**
The disguise — a straight angle wearing three-letter clothing, so students hunt for a value of ∠FXE instead of recognising 180° — is the item, and the hints handle it the right way round: hint one asks a question about ∠FXE rather than answering it, hint two covers the final hop. The unit-terminating ⅝ is a real constraint well met by a numeric keypad. Declare 112.5 as a trap: it is the number the student has just produced and the natural stopping point, and it is also fa13b's correct answer, so leaving it undeclared means the batch's own structure supplies a distractor that no correction note ever answers. Minor note under criterion 2: the figure is drawn exactly to scale, so ∠EXD is visibly acute — a useful check, except that this module spends its time teaching students not to trust the drawing, which disarms the one safeguard against entering 112.5.
Criteria at issue: 5, 7, 2 (minor)

### fa13b-vertical — **Rework**
Structurally this is fa13a with the final hop changed from a subtraction to a copy, which makes it the easier twin, and its lone hint ("∠DXF sits opposite ∠CXE across the crossing") scaffolds that trivial last step while the hard half — recognising ∠FXE as straight — goes entirely unsupported, so a genuinely stuck student is handed help they cannot use. Worse for criterion 2: the answer it rewards, 112.5, is exactly the number produced by the misreading that fails fa13a, so a student who does not understand the question passes this item with the identical wrong reasoning, and the item cannot distinguish them. Reworking means changing the numbers so the twins stop sharing an answer set — e.g. m∠CXE = ⅚ m∠FXE, giving 150 here — and giving it fa13a's first hint ahead of its own, with 30 (or whatever the linear pair yields) declared as its trap. If the pool cannot carry three versions of this configuration, retire it in favour of fa13a plus the two-part fa13.
Criteria at issue: 2, 6, 7

## Sub-tab: Two parts

### fa12 — **Keep**
This is the best item in the batch and the only one where the two-part split genuinely stages one question: Part A forces the student to read the marks before any arithmetic exists to hide behind, and Part B consumes Part A's finding directly — EB ≅ DF is the true claim and EB = 16.4 is precisely what Part B needs. The claim set is well built: both true claims come from tick pairs, all three false claims involve EF, which carries no ticks, and the coordinates make them visually tempting (EF ≈ 133 units against EB 135 and BC 130), so "no mark, no conclusion" is taught by a trap the eye actually falls into. Part A's single hint names the principle without identifying rows, which is the right restraint for a select-all. Two minor observations, neither worth a verdict: the stem's "AB = DC" is never used by either part (it would become live if a claim or a follow-up asked about FC), and Part B's WHY could repeat the not-to-scale warning that fa12-marked's carries.
Criteria at issue: 2 (satisfied), 3 (satisfied), 4 (strength), 7 (see fa12-marked)

### fa13 — **Rework**
Part B does not consume Part A's answer; it consumes 112.5, an *intermediate* of Part A that the student was never asked to report — and Part B's WHY says so out loud ("You already have m∠CXE = 112.5°"), assuming working the interface never captured. The consequences run both ways: a student who answered Part A correctly must reconstruct 112.5 from memory, while a student who failed Part A by answering 112.5 is holding exactly what Part B rewards; and in any case Part B is reachable as 180 − (Part A) by a linear pair along EF, which bypasses the vertical-angle idea it claims to test. The fix is to reorder so the chain is genuine: Part A asks m∠CXE (the straight-angle insight, 112.5), Part B asks m∠EXD (67.5), which cannot be answered without Part A's number. Part B's lone hint carries fa13b's imbalance and should be rewritten for whichever step it ends up staging.
Criteria at issue: 2, 5, 6

### midpoint-two-parts — **Tweak**
The anti-dependency here is deliberate and legible — Part B's WHY says "you did not need x again; the halves were equal from the start" — and it lands as a lesson that the algebra was a detour, with the declared trap on 4.5 catching exactly the habit a two-part format trains. Judged on that intent it works, though it should be acknowledged that the format promises a dependency this item deliberately withholds. The real gap is the mirror hazard the item does not declare: Part A's most likely wrong entry is 21 (reporting the half-length instead of x, the value Part A's own working produces one step early) and 21 is Part B's correct answer, while Part B's declared trap 4.5 is Part A's correct answer — the two parts are each other's distractors in both directions, and only one direction is covered. Declare 21 on Part A with a note that it is the length, not x; 18 (from 4x = 18) is a reasonable second. Also rewrite Part A's hint, which hands over the only insight and leaves 4x + 3 = 21 as pure mechanics — and note the figure's AM ≅ MB ticks already soften it.
Criteria at issue: 2 (intent-dependent), 5, 6

## Batch summary

Verdicts: 2 Keep (fa4-fraction, fa12), 8 Tweak (fa5-midpoint, fa7-linear-pair, fa9-building, fa10-substitute-back, fa11-three-lines, fa12-marked, fa13a-straight, midpoint-two-parts), 2 Rework (fa13b-vertical, fa13), 0 Cut. No criterion 1 failures: every keyed answer is right, and every figure's coordinates are internally consistent and agree with the declared measures. Two patterns run through the batch. First, criterion 6 is failing by a consistent mechanism — the hints are being written as an answer key unrolled in order rather than as staged prompts, so wherever an item has a single make-or-break insight (fa5's hidden midpoint, fa11's straight line, fa13b's straight angle) that insight is either stated in hint one or is the only hint there is; the items that get this right (fa9, fa13a, fa12 Part A) all do the same thing, which is to make the first hint a question or a framing rather than a fact, and that pattern should simply be applied to the rest. Second, declared traps are badly under-used — only two of twelve items declare one — and the omission is costly in a specific way: because sibling items and sibling parts share solution paths, the most likely wrong entry is repeatedly another item's correct answer (112.5 across fa13a/fa13b, 21 and 4.5 across the two halves of midpoint-two-parts), so the pool manufactures its own distractors and then says nothing when a student picks one up. Fixing that means declaring traps at the points where two items touch, and, for fa13b, changing the numbers so the twins stop sharing an answer set at all.

# Practice ▸ Proof

## Build a proof

All eleven worked solutions replay clean through `validateLine` (`replaySolution` returns OK for every proof), so no keyed route is wrong.

Two corrections to the review that bear on verdicts below. First, only **three** items forbid a reason, not four: `vertical-angles`, `congruent-supplements`, `right-angles` (`proofs.ts:53,82,112`). Second, the review is right that the forbidden reason is deleted rather than rejected — `ProofExercise.tsx:162` builds the dropdown as `REASONS.filter(r => !problem.forbid?.includes(r.id))`, which makes the circularity message in `proof.ts:94–100` ("Using it would be circular") unreachable from this sub-tab. A good explanation exists and is never shown. I have folded that into the three items rather than repeating it.

### shared-angle — **Keep**
The offset blue/red lanes put a whole against its own part, which is exactly the relation lines 4–6 exploit, and the goal (`m∠WVY = m∠XVZ`) is not readable off the figure — only the two outer sectors carry arcs, the wholes carry nothing. Hint 1 ("turn the congruence into an equation about measures") leaves lines 3–7 entirely unbuilt, including the Reflexive step nobody invents unaided, so criterion 6 holds at the hint-1 level even though all three hints together are the route.
Criteria at issue: 2, 4, 6

### vertical-angles — **Tweak**
The circularity trap is the point of the item and the figure is honest. The problem is the opening: with `givens: []` the student must write two linear-pair statements under reason **Given**, and although `reasons.ts:158` accepts them ("Read from the figure's markings"), nothing on screen says a picture fact may be written down that way — the Given box (`ProofExercise.tsx:228`) only says to read what you need from the figure, and hint 1 points at ∠2 without saying to write a line. Add a hint 1 ahead of the current one: "A fact the figure marks can be written as a line with reason Given." Criterion 5 also suffers: a student reaching for Vertical Angles Theorem finds nothing, because the reason is stripped from the dropdown.
Criteria at issue: 2, 5, 6

### congruent-supplements — **Tweak**
Putting the two pairs at separate vertices is the right call, since ∠1 and ∠2 are then not vertical and no shortcut exists. But `twoSupplementPairs` draws both configurations identically — `polar(-165,40,65,140)` and `polar(165,40,65,140)` — so ∠1 and ∠2 are both drawn at 115° in the same orientation and the conclusion is visible before line 1. Mirror the second pair (put G on the other side of W, so ∠2 is drawn opening the other way) — the measures stay 115/65 and the congruence stops being a translation you can see. Hints 1–3 map onto lines 4–5, 7 and 8–9, but hint 1 alone still leaves the two Substitutions that are the hard part.
Criteria at issue: 2, 4, 6

### right-angles — **Keep**
Drawing the two right angles in different orientations so they do not look superimposable is the best figure decision in the sub-tab: congruence has to come from measure, not appearance. Six lines, three ideas, and hint 1 gives only the first of them. The one soft spot is criterion 5 — Right Angle Congruence is deleted from the dropdown rather than refused with the circularity message — but that is a family-level fix, not a reason to hold this item.
Criteria at issue: 4, 5, 6

### linear-pair-supp — **Keep**
The figure prints no degrees, so neither 115 nor 65 is visible and the item does not give itself away. Hint 1 ("First say what the figure shows about ∠ABD and ∠DBC") is the model for this batch: it tells the student *that* a picture fact must become a written line, which is the hinge, without saying which fact. The planted near-miss (Definition of a linear pair for Linear Pair Theorem) is the one that recurs in the matching Check-the-reasons item.
Criteria at issue: 2, 6

### bisector-halves — **Keep**
The arcs do mark the two halves congruent, so line 2 is readable off the picture — but line 2 asks for the *citation* (Definition of angle bisector), not the discovery, so criterion 2 is not really in trouble; what the figure gives away is not what the line is graded on. The free-standing Angle Addition line and the Simplify-not-Distributive ending are both genuinely instructive, and the validator explains the Distributive refusal well. Hint 1 alone leaves lines 3–6.
Criteria at issue: 2, 4, 6

### algebra-justify — **Keep**
No figure and none wanted (criterion 4 n/a). The two hints hand over the algebra and withhold every reason name, which is the correct division of labour when the algebra is not what is assessed. Weak as a proof, strong as the drill that establishes that a manipulation and its justification are separate objects — and that habit is what makes the geometric proofs writable.
Criteria at issue: 3 (n/a), 4 (n/a), 6, 7

### midpoint-solve — **Keep**
Eleven lines that genuinely fuse geometry and algebra: the enforced separation between the Segment Addition work that produces AM = 11 and the algebra that turns it into x = 2.5 is something an ordinary solve-for-x exercise cannot ask for. Hint 3 compresses lines 7–11 into a clause, which weights the scaffolding toward the geometry — the right call. Overlaps `halves-of-whole` on lines 1/4/5/6 and shares its figure; they should be adjacent in the list with `halves-of-whole` first.
Criteria at issue: 6, 7

### supplementary-solve — **Tweak**
The richest item here, and hint 2 ("solve for x — but x is not the answer") names the exact failure mode without writing any of the twelve lines. Line 11 is where the arc on the figure finally earns its keep, and the item is built so that stopping at line 10 is the natural mistake. Two text/figure defects: hint 3 refers to "m∠A" and "∠C", which do not exist in a figure whose angles are numbered 1–3 (`proofs.ts:239`), and the figure itself is mirrored wrong (see BUG). Fix both: rewrite hint 3 as "Put x back to get m∠1, then carry it across the congruence to ∠3", and change Z's polar angle from 62 to 118 at `library.ts:211`.
Criteria at issue: 1, 4, 6
BUG: `suppAndCongruent` (`library.ts:200–217`) places both R and Z at 62°, so ∠1 is drawn at ~118°, ∠2 at ~62° and ∠3 at ~62° — the arcs mark ∠1 ≅ ∠3 while the drawing shows ∠3 congruent to ∠2, and the item's own algebra makes ∠1 the acute one (73°) and ∠2 obtuse (107°). The marks are honest so the proof is still solvable, but the drawing invites ∠3 ≅ ∠2 and the item never addresses it. Fix: `polar(150, 30, 118, 62)` for Z.

### segment-transitive — **Tweak**
As an on-ramp it has a real job — first contact with the composer, and Transitive with two citations is a genuine arity to practise — and the rubric is explicit that easy is not thereby bad. But the single hint, "Two congruences share a middle term. That is the hinge.", *is* the entire non-given line, so criterion 6 fails outright. Reword it to something that does not name the move: "Look at what your two givens have in common." Worth noting for the curriculum: at three lines it is below the four-line floor in `reasonCheck.ts:68`, so it generates no Check-the-reasons item, and it contributes exactly one One-step item.
Criteria at issue: 2, 6, 7

### halves-of-whole — **Tweak**
The better of the two midpoint items: stripped of numbers, the proof is nothing but the move the module is built around — relation to congruence to equation to substitution to division. The scaffolding is the problem. There are only two hints for six lines, hint 1 already names the Segment Addition Postulate (two of the five reasons handed over in the first nudge), and hint 2 supplies AM + AM = AB, the hinge. Split into three: "What does being a midpoint tell you about the two halves?", then the postulate, then the substitution.
Criteria at issue: 6, 7

## Check the reasons

Two structural findings govern the whole sub-tab and change several verdicts below.

**Delivery.** `SelectAllExercise.tsx:133` calls `reasonCheckItems(seed, 8)` against a pool of ten qualifying proofs, and `reasonCheck.ts:124` walks that pool in fixed order until it has eight. The last two entries are therefore all but unreachable. Over 400 seeds: `rc-supplementary-solve` appeared 37 times (9%) and `rc-halves-of-whole` **once** (0.25%). Every other item appeared in 96–100% of sessions. The item the review rates highest is effectively not in the app.

**Spoiling is front-loaded, not random.** `reasonCheck.ts:82` walks the proof top-down spoiling each line with p = 0.55 until a quota of `max(2, round(0.4 × length))` is met, so the quota is usually exhausted before the middle of the proof. Measured over 400 seeds, `rc-midpoint-solve` spoils lines 1–4 about 56% of the time each and line 11 6%; `rc-congruent-supplements` spoils lines 1–4 at ~54% and line 10 at 10%; `rc-right-angles` spoils its two given lines at 60%/55% and its "sleeper" line 5 at 14%. Since givens sit at the top and their only possible wrong reason is Reflexive, the transparent errors are also the *most likely* errors — worse than the review's "chosen at random" suggests. One fix repairs every item below: skip `s.reasonId === "given"` in the spoiling branch, so the quota falls on the lines that teach something.

**Feedback.** Every Symmetric plant, and the Substitution plant in `rc-algebra-justify`, is refused on citation count ("Symmetric Property uses at most 1 earlier line"), and the checklist displays no citations. The lines are still wrong on meaning, so the item is answerable; the explanation just names something the student was never shown (criterion 5).

### rc-shared-angle — **Keep**
Three of its planted errors are properly seductive: Segment-for-Angle Addition on lines 5–6 (identical `part + part = whole` shape, only the `m∠` prefixes differ), Definition of congruent *segments* on line 2, and Transitive on `m∠XVY = m∠XVY` — a true statement where transitivity is superficially plausible and the validator's reply ("Both sides of that line are the same quantity") is exactly on target. Only one of its seven rows is a given. The Symmetric plant on line 7 is the citation-count case described above.
Criteria at issue: 3, 4, 5

### rc-vertical-angles — **Keep**
The Definition-of-a-linear-pair-for-Linear-Pair-Theorem swap on lines 3 and 4 is the most valuable plant in the sub-tab and the distinction students most reliably blur; the measured spoil rate on those rows is ~50%/45%, so it actually fires. Addition-for-Subtraction on line 6 is a clean second, since students who think of removing m∠2 as "cancelling" have no instinct about which property that is. Two of seven rows are given-plus-Reflexive throwaways, which is an acceptable ratio.
Criteria at issue: 3, 5

### rc-congruent-supplements — **Tweak**
Supplementary-for-complementary on lines 4–5 is a strong plant and the feedback is unusually good, spelling out that the complementary definition would have produced 90. But three of ten rows are givens, the quota is four, and the front-loading means a typical run puts two of the four errors on those three rows. Ten rows is more reading than the difficulty warrants. Exclude Given lines from the spoiling pool (`reasonCheck.ts:82`); the item then reads at its real difficulty without being shortened.
Criteria at issue: 3, 5, 7

### rc-right-angles — **Tweak**
The Definition-of-perpendicular plant on lines 3–4 is worth drilling and is drilled nowhere else: `m∠1 = 90` justified by a definition that also concerns 90° angles, wrong only because the squares mark right angles and nothing marks perpendicularity. Line 5 (`m∠1 = m∠2` as Reflexive) is a good sleeper. The trouble is the quota of two landing on lines 1–2 at 60%/55% while line 5 fires at 14% — the interesting half of the menu rarely appears. Same one-line fix: exclude givens.
Criteria at issue: 3, 4, 7

### rc-linear-pair-supp — **Keep**
The best ratio in the sub-tab: five rows, one given, and the definition-for-theorem swap on line 2 fires 58% of the time. With five rows a student has to read all of them. Line 3 (`m∠ABD = 115` labelled Reflexive) is more interesting than the usual given case, because the feedback has to make the real point that both sides of a reflexive step must be the *same* quantity, not merely equal. The figure prints no degrees, so nothing on screen confirms or contradicts the numbers.
Criteria at issue: 3, 4

### rc-bisector-halves — **Keep**
Five of the six possible spoilings are real near-misses, and the segment-bisector-for-angle-bisector plant on line 2 is caught by looking at the picture — rays from a vertex with arcs, not a segment with ticks — which is precisely the dependency this sub-tab is built on. Only observation: the Distributive-for-Simplify plant on line 6, arguably the sharpest one here, fires only 9% of the time because of the front-loading, so most runs never show it.
Criteria at issue: 3, 4

### rc-algebra-justify — **Tweak**
Four rows and two always wrong makes it closer to matching than searching, which is fine — it is the fastest item in the sub-tab. The problem is which two. Multiplication-for-Division on line 4 is the plant every algebra teacher wants, and it fires only 20% of the time; the typical run instead pairs the given-plus-Reflexive row with the line-2 Substitution plant, which fails purely on citation count and so cannot be reasoned out from what the checklist shows. Exclude givens from the pool and raise the quota to three of four, so line 4 is nearly always in play.
Criteria at issue: 3, 5

### rc-midpoint-solve — **Tweak**
Line 6 is the flagship — `AM + MB = AB — Angle Addition Postulate`, on a figure containing not one angle — and line 5 (`AM = MB` as Definition of congruent *angles*) is the same trap one level down; together they are the best segment/angle near-miss pair in the batch. But eleven rows with three givens and a quota of four, front-loaded, means line 6 fires 41% and lines 8–11 under 11%: a student can tick eleven boxes on partial reading and land close. Exclude givens from the spoiling pool, which both tightens the item and pushes the quota onto lines 4–7.
Criteria at issue: 3, 7

### rc-supplementary-solve — **Cut**
Twelve rows, four of them givens whose only spoiling is the transparent one, and a quota of five that the front-loading concentrates in rows 1–7 — the richest error menu in the batch and the worst signal-to-noise. Its two good plants are covered better elsewhere: supplementary-for-complementary by `rc-congruent-supplements`, Multiplication-for-Division by `rc-algebra-justify`. It is also already near-invisible (9% of sessions). Dropping it from the pool frees the eighth slot for `rc-halves-of-whole`, which is the trade worth making.
Criteria at issue: 3, 7

### rc-halves-of-whole — **Keep**
Six rows, one given, and five of the six possible spoilings are real near-misses: bisector-for-midpoint, angle-for-segment twice, Multiplication-for-Division. Every row rewards reading, and the plain ticked segment is enough to catch both angle/segment swaps by eye. This is the item to put in front of a student first — and at present it reaches roughly one session in four hundred. The item needs no change; the delivery does (raise the count at `SelectAllExercise.tsx:133` to 10, or reorder the pool so this precedes `rc-supplementary-solve` and `rc-midpoint-solve`).
Criteria at issue: 3, 4, 7

## One step

### One step (family, 37 generated items) — **Tweak**
The generator is the soundest thing in the batch: Given lines are skipped as teaching nothing, a distractor is offered only after `validateLine` confirms it genuinely fails on that exact line, and the confusion table keeps the four options inside one family so the answer is never the odd one out grammatically. Two defects run across all 37. First, criterion 5 fails family-wide: `stepReason.ts:111` stores `reasonById(s.reasonId).short` as `why`, and `StepExercise.tsx:121` renders it whatever the student picked — so a student who chooses Multiplication Property is told what Division Property means, never why their choice was wrong. The validator already computes the specific refusal (`check.why`) during generation and throws it away; store it per option and show the picked one. Second, the citation note ("This line rests on lines 2, 3 and 5") leaks the answer: measured against each reason's declared `cites` range, 4 of 37 items are decidable from the note alone without reading the statement, and 9 more are cut from four live options to two. Third, the pool is lopsided — 8 of 37 items have Substitution as the answer and 5 each have Definition of congruent angles and Division Property, so a 12-item session routinely repeats the same question.
Criteria at issue: 2, 3, 5, 7

Two side effects of `forbid` worth recording: because `stepReason.ts:95` requires three validator-confirmed wrong options, `right-angles` contributes **no** One-step items at all (two of its three candidates per line are either forbidden or genuinely acceptable), and `vertical-angles` contributes only one. The two proofs built entirely around the circularity lesson are the two least represented here.

### shared-angle:2 — **Tweak**
The question is right — the definition that *licenses* the line versus the definition that *describes* its content — and Definition of congruent segments is a genuine near-miss on the wrong kind of object. But two of the three distractors, Vertical Angles Theorem and Right Angle Congruence Theorem, are dead on a fan of four rays with no crossing lines and no squares; the item is really a two-way choice. Replace them in `CONFUSIONS["def-cong-ang"]` (`stepReason.ts:42`) with live alternatives such as `symmetric` or `def-supplementary`.
Criteria at issue: 2, 3

### supplementary-solve:11 — **Tweak**
The line itself is the best moment in its parent proof — where the figure's arc finally does work — but as a One-step item it is the same question as `shared-angle:2`, with the same three distractors, and two more identical twins exist (`bisector-halves:3`, `congruent-supplements:6`, `congruent-supplements:10`): five of the 37 items are this question. The ten lines of context above it add nothing but the pattern-inference the review flags. De-duplicate at selection: allow at most one item per answer reason in a session.
Criteria at issue: 3, 7

### bisector-halves:2 — **Keep**
The strongest of the eight. One line of context, so the student must read the line rather than the table, and every distractor is live: Definition of segment bisector is the same definition on the wrong object, Definition of congruent angles is the definition of what the line *produces* rather than what licenses it, and Angle Addition Postulate is the wrong shape entirely. The four-option format isolates the near-miss cleanly.
Criteria at issue: 2, 3

### midpoint-solve:4 — **Keep**
Same virtues: Definition of midpoint against Segment Addition, Definition of congruent segments and Definition of segment bisector, all four live and all four about segments, so no option is eliminable by type. Three lines of context above it, all givens, which neither helps nor hurts. Worth noting it duplicates `halves-of-whole:2` almost exactly; either is fine, both in one session is not.
Criteria at issue: 2, 3, 7

### algebra-justify:4 — **Keep**
Division-for-Multiplication is the distinction that recurs everywhere in this module, students describe the step as "cancelling the 3", and the two names are mirror images. Three lines of context, no figure, nothing to infer from. This is the item that should carry the Division/Multiplication drill for the whole family.
Criteria at issue: 2, 3

### supplementary-solve:9 — **Cut**
`x = 5` from `37x = 185` is the identical question to `algebra-justify:4` on different numbers, with the same three distractors, and three further twins exist (`midpoint-solve:8`, `midpoint-solve:11`, `halves-of-whole:6`). The only thing it adds is eight lines of context above the question, which the review rightly notes lets a student infer from the pattern of reasons already used rather than from the line. `algebra-justify:4` serves the concept with no context to lean on.
Criteria at issue: 7

### supplementary-solve:8 — **Tweak**
Addition-for-Subtraction on `37x − 5 = 180 → 37x = 185` is worth drilling and the swap is the real confusion. But Reflexive Property is a dead option nobody who has read the line will pick, and Substitution is eliminable from the citation note alone (it needs at least two cited lines; the note says one), so the item collapses to a coin flip between Addition and Subtraction. Replace `reflexive` in `CONFUSIONS["addition-property"]` (`stepReason.ts:35`) with `simplify` or `multiplication-property` — the same dead option currently sits in `algebra-justify:3`, `midpoint-solve:10` and `shared-angle:4`.
Criteria at issue: 3

### supplementary-solve:6 — **Rework**
The review calls this the strongest of the algebra items, and the question it means to ask — Substitution versus Simplify on a line that substitutes but leaves the arithmetic undone — is genuinely one students miss. As built it does not ask that question. The line cites three earlier lines and the note says so; Transitive accepts exactly two, Symmetric and Simplify exactly one, so Substitution is the only option whose arity admits three citations and the item is answerable without reading the statement at all. The same leak affects `shared-angle:3`, `shared-angle:7` and `midpoint-solve:7`. To fix it, either suppress the citation note for items whose answer is arity-unique among its options, or require the generator to include at least one distractor whose `cites` range covers the actual citation count.
Criteria at issue: 2, 3

## Batch summary

Thirty verdicts: **Keep 14, Tweak 13, Rework 1, Cut 2**, plus one BUG (the mirrored angle in `suppAndCongruent`). The authored content is in good shape — all eleven proofs replay clean, the figures mark honestly, and the best items (`linear-pair-supp`, `bisector-halves`, `rc-halves-of-whole`, `bisector-halves:2`) do exactly what the module claims to teach. Almost every problem I found is in the *machinery around* the content rather than in the content itself, and three mechanisms account for nearly all of it. The Check-the-reasons spoiler walks each proof top-down until a quota fills, so the transparent given-plus-Reflexive errors are not merely available but statistically the most likely, while the seductive plants in the middle of each proof fire a third as often; one line excluding Given rows from the pool would repair five items at once. The One-step generator discards the specific refusal the validator computes and shows the correct reason's gloss regardless of what was chosen, so the sub-tab with the most precise error diagnosis available to it gives the least specific feedback, and its citation note hands over the answer outright on the four highest-citation items. And the delivery caps `reasonCheckItems` at eight from a fixed-order pool of ten, which silently drops the sub-tab's two last items — including `rc-halves-of-whole`, the strongest item in it, which reaches roughly one session in four hundred. Underneath those, one authoring pattern recurs in the hints: `segment-transitive`, `halves-of-whole` and to a lesser degree `congruent-supplements` give the hinge away in the first or second nudge, where `linear-pair-supp` and `supplementary-solve` show how to name the shape of the journey without writing a line of it.

---

# Cards

## Conditional forms (classify + produce) — **Tweak**
The drill is well built: the four forms are generated from one authored source, so "classify by form, not by truth" is genuinely what is tested, and the produce shape's symbolic gloss in the prompt is the right scaffold for the harder direction. Two cheap changes. (a) `classifyCard` returns early when the drawn form is `conditional`, so "the original conditional" can never be the keyed answer — make it reachable by sometimes presenting Statement 2 unchanged, or drop to three options (criterion 3). (b) Four of ten sources have a blank topic note, so those cards ship with the generic per-type sentence alone; fill them (handled per source below).
Criteria at issue: 3, 5, 7

### rectangle — **Tweak**
The one source whose converse is both true and named as such, which makes it the purest classify card in the pool. The topic note is garbled — "a true converse does not make a statement the converse" welds two different lessons together and reaches the student verbatim, including on `bicond:rectangle` where the answer is *yes*; rewrite it to "a converse that happens to be true is still the converse, and here it is true in both directions, which is what makes this a definition."

### square — **Tweak**
The canonical false converse, and the only source where converse and inverse fail on the same object (a non-square rectangle), so it is the clearest demonstration that the two stand or fall together. The topic note is blank and should say exactly that; scope is a secondary worry (see criterion 7 note in the summary) but the square/rectangle relation is common vocabulary rather than a fact from another course.

### midpoint — **Keep**
The richest source: a conjunctive conclusion means De Morgan is baked into the inverse and contrapositive, and the note ("Drop 'M lies on AB' and the converse fails") is the most transferable sentence in the tab because it connects the form drill to a proof line.

### linear-pair — **Keep**
False converse, and the note states the reason in one clause ("supplementary angles need not touch"). Pairs deliberately with `linear-supp` and with the `linear` chain, so the same asymmetry is met three ways.

### vertical — **Tweak**
A theorem rather than a definition, and the blank topic note is the costliest of the four: theorem-versus-definition is what decides whether a rule may be run backwards in a proof, and this is the clean negative case sitting directly opposite `right-angle`. Add a note naming it ("a theorem, not a definition — two 50° angles in unrelated figures are congruent and not vertical").

### right-angle — **Tweak**
The best classify card in the pool, because all four forms are true and only shape can decide. The note is correct but mis-targeted on a classify card: "this one really is biconditional" lands one sentence after "Statement 2 is the inverse", inviting the reading that an inverse is equivalent to its conditional. Reword to name the conditional explicitly ("the original is a definition, so its converse is true too").

### collinear — **Keep**
False converse with a concrete reason, and it is the source the `produce:contrapositive` card uses to sit the inverse beside the contrapositive — the right pairing, since both carry two negations.

### congruent-segments — **Tweak**
A definition whose converse is worked in nearly every two-column proof, so it earns its slot. The blank note has a specific cost here rather than a general one: on `equiv:congruent-segments:conditional` the converse and inverse distractors are both *true sentences*, and a student who reasons "that one's true, so it's equivalent" gets back only the generic rule. Add a note distinguishing truth from equivalence.

### obtuse — **Tweak**
The keyed answers are right — a straight angle exceeds 90° without being obtuse, so the converse fails — but this is the one source where a careful student can be wrong for a good reason, having only ever met angles strictly between 0° and 180°. Declare the trap: name the straight angle in the panel or prompt of `bicond:obtuse` rather than only in the after-the-fact explanation.

### bisector — **Tweak**
`converseTrue: true` is defensible on the textbook definition, but the authored `q` is "creates two congruent angles" with no interior clause, while the parallel `midpoint` source carries "M lies on AB" in its `q` and the app builds a whole counterexample card on that clause. Tighten `q` to "divides the angle into two congruent angles" and add the note the midpoint source already has; as shipped the identical subtlety is invisible on one of the two.

## Logical equivalence — **Tweak**
Structurally sound: the panel starts from three different forms across the observed cards, so "pick the one with two negations" does not work. Two defects. (a) `equivalenceCard` offers the other three forms plus "None of these", and `equivalentForm` always maps into those three — so **"None" can never be correct**, on any source, and is a dead fourth option (criterion 3); make it reachable by sometimes dropping the partner form from the pool. (b) The explanation is a fixed rule that never touches the item: on definition-sourced cards the rejected converse and inverse are true statements, and one added clause ("both of these happen to be true; truth alongside is not equivalence") would convert a silent trap into the lesson.
Criteria at issue: 2, 3, 5

## Biconditional — **Keep**
The fixed four-option set is a defensible trade: the student stops re-reading choices and concentrates on evaluating the converse, and both wrong options are nameable misconceptions (every conditional flips; only things labelled "definition" may be biconditional). The second is neatly refuted by `bicond:rectangle`, where definition-hood is shown to follow from the mutual truth rather than the other way round. The cost — the answer collapses to "is the converse false?" plus a reason — is real but acceptable for an untimed, unscored surface.
Criteria at issue: 2, 3

## Negation — **Keep**
The strongest family in the batch: five statements covering a simple property, both connectives, a relation and a collinearity claim, with an authored per-distractor "why" for every wrong option. The per-choice text does surface — `Flashcards.tsx` concatenates `whyPerChoice[picked]` with the base `why` — but only for the option actually chosen, and choices are disabled after one pick. That is good targeted feedback with one consequence worth noting: on `and` and `or` the De Morgan rule is named *only* inside a distractor's why, so a student who answers correctly never meets it by name. Moving the connective rule into the base `why` for those two items would cost nothing.
Criteria at issue: 3, 5

### acute — **Keep**
A well-graded ladder: opposite-not-negation, single-instance, and the subtle "not obtuse" that is grammatically parallel to the right answer and denies the wrong predicate. Each maps to a distinct, nameable slip.

### and — **Keep**
The three distractors isolate the two independent moves a correct negation makes — flip the connective, negate each part — by showing each performed without the other. "Small" is not a geometric predicate, which is odd in a geometry deck but defensible: the vague conjunct forces attention onto the connective.

### or — **Keep**
The mirror of `and`, and the pair is what teaches the symmetry. The "obtuse" distractor is the best moment in the family, since it genuinely defeats the original and so forces the distinction between incompatibility and negation.

### congruent — **Keep**
The `<` / `>` pair presented together makes the negation visible as the union of both one-sided failures; singly either would be much weaker. The parallel distractor is an easy eliminate but checks what congruence is *about*, which is worth one slot.

### collinear — **Tweak**
The collinearity-versus-betweenness target is right, but two of the three distractors make that one point with near-identical whys, so a quarter of the card is redundant (criterion 3). Keep the "in that order" version and replace "Point Y is not between X and Z" with a different slip — an over-negation, or an existential one ("some of them do not lie on a line").

## Always, sometimes, never — **Tweak**
Three options mean a blind guess scores 33%, so the family leans on the authored WHY, and most are well aimed; the per-choice feedback ("for *never* you would have to show it contradicts a definition or theorem") teaches the standard of evidence each verdict demands, which is the right thing to say. Ten of the twelve verdicts are unarguable. The two changes: rephrase `supp-90`, the only item written as a conditional, which admits two defensible answers; and drop or repoint `collinear-xyz`, which duplicates `three-points-collinear`.
Criteria at issue: 1, 5, 7

### two-obtuse — **Tweak**
The verdict is unarguable, but the triangle sum is not Module 2 content, so this is the one item in the twelve that asks the student to supply a fact from another course (criterion 7). Repoint it to the same reasoning inside the module — "Two angles in a linear pair are both obtuse" is *never* for identical arithmetic and costs one line to author.

### collinear-xyz — **Cut**
Substantively the same claim as `three-points-collinear`, whose WHY is strictly better because it locates the boundary ("three is the first number that can fail") rather than explaining *sometimes* in general terms. Two of twelve slots on one idea is a real cost in a deck this small; if a replacement is wanted, "Three points are coplanar" is always true and would be a genuinely different item.

### line-longer — **Tweak**
The keyed *always* is the standard answer and the intended lesson (containment) is worth a card, but the statement says "longer" while the WHY argues containment, and a line has no finite length to compare. Rephrase to "Line MN contains points that are not on segment MN", which keeps the verdict, keeps the lesson, and removes the quibble.

### supp-90 — **Tweak**
Rephrase to a flat statement — "Two supplementary angles each measure 90°" is a clean *sometimes* — or state in the WHY that the question is about instances, not about the rule.
BUG: This is the only item phrased as a conditional, and the tab's other families (conditional forms, counterexamples, syllogism) train the universal reading of "If…then…". Read that way the statement is a rule that fails, and *never* is defensible; read as a claim about instances it is *sometimes*. Two options are defensible and nothing tells the student which reading is wanted.

### vertical-congruent — **Keep**
An anchor item: the right answer is a remembered theorem, and "for any two crossing lines" points at the universal quantifier that *always* means. Positive pole of the pair with `linear-supp` and the `congruent-vertical` counterexample.

### linear-supp — **Keep**
A reversal item that catches the student who matches the two words without noticing the direction has flipped — the same error as `linear-pair`'s converse, tested where nobody is primed to look for a converse. "Two angles on different pages" is the best-turned line in the twelve.

### adjacent-vertical — **Keep**
The WHY sets the two definitions side by side so the incompatibility is visible rather than asserted, which is exactly what the item needs, since the confusion comes from one figure containing both relations at once.

### midpoint-two — **Tweak**
Correct, and it pairs deliberately with `bisector-perp` (one midpoint, infinitely many bisectors). The WHY restates the verdict instead of justifying it (criterion 5); add the one clause that makes it an argument — any other point of the segment is nearer one endpoint than the other.

### bisector-perp — **Keep**
Targets a specific and widespread slip: "perpendicular bisector" is met as a unit and the adjective migrates into the noun. The WHY does containment work, which is the shape of every *sometimes*.

### two-points-collinear — **Keep**
Sounds trivial until you check the definition, which is the point — it forces the student to apply *collinear* where intuition says the word does not apply, and it sets up `three-points-collinear`.

### three-points-collinear — **Keep**
The best-written WHY of the twelve: it locates the verdict rather than merely justifying it, and completes the pair with the two-point case.

### supplementary-acute — **Tweak**
Airtight, and the WHY shows the inequality rather than asserting the verdict. One addition worth making (criterion 5): the error being targeted is supplementary-versus-complementary — under that swap the statement becomes *always* true — so the student is wrong with full confidence and the WHY never names the term they were thinking of.

## Counterexample — **Tweak**
The best-designed family in the batch: every item is built so the distractors fail in exactly one of two ways — confirm the claim, or abandon the hypothesis — and three of the five WHYs name that structure outright. Two changes. (a) `bisector-midpoint` ships a distractor that is a second valid counterexample (below), and its WHY is the only one that never says why the abandoners are wrong. (b) Unlike every other family, `counterexampleCard` does not shuffle: options render in authored order with a fixed key (indices 2, 1, 0, 1, 1), and `segment-addition`'s WHY hard-references "Option D", so the position of each answer is stable across every session a student plays.
Criteria at issue: 1, 2, 3, 5

### segment-addition — **Tweak**
The trap is genuinely tempting — "A, B and C are not collinear" looks like disagreement with the claim — and the WHY names the abandonment principle more explicitly than anywhere else in the batch. One cosmetic fix with a real effect (criterion 2): three options are numeric triples and the keyed one is a bare inequality, so a test-wise student spots the odd one out without reasoning. Write it as a triple: AB = 5, BC = 2, AC = 3.

### supplementary-right — **Keep**
The cleanest-constructed of the five: every option has the same shape, so there is no formatting tell, and deciding whether a pair satisfies the hypothesis requires actually adding — which turns "satisfies the hypothesis" into something you check rather than assent to.

### congruent-vertical — **Keep**
The confirmation trap ("two vertical angles at a crossing") is at its cleanest here, and pinning the adjacent pair at 120° and 60° is what keeps option D a distractor rather than a second answer — an unspecified adjacent pair could be two right angles, congruent and not vertical. The earlier fix is present in the source and correct.

### midpoint-converse — **Tweak**
The strongest item in the batch: one confirmation, one pure hypothesis-denier, and an endpoint near-miss the student has to compute, with an explanation that generalises to the whole perpendicular bisector and then closes the loop back to the `midpoint` conditional. The only change worth making is a figure — segment AB, its perpendicular bisector, two or three points marked on it — since the explanation currently describes a locus in prose (criterion 4).

### bisector-midpoint — **Tweak**
Rewrite option D as "A line crossing the segment at a point other than the midpoint" (see BUG), and extend the WHY — it is the only one in the family that justifies the key without saying why the abandoners are wrong, which is the part the family exists to teach.
BUG: Option D, "A line through an endpoint", is underspecified and admits the line containing the segment itself, which passes through an endpoint *and* the midpoint and is not perpendicular to the segment. That option is therefore a second valid counterexample — the identical defect already fixed in `congruent-vertical`.

## Law of Syllogism — **Tweak**
Linking syllogism to the transitive property "one level up" is exactly the connection a Module 2 student needs, options are shuffled per render so there is no position bias, and the distractor patterns (the converse of the conclusion, one link reversed) force the student to track direction rather than merely spot the shared term. The defect is structural: "Nothing follows — the middle terms do not match" appears on every card, all five authored chains are well-formed, and the option's own explanation tells the student the exact circumstance under which it would be right — so the only real failure mode of the law is never exercised and the honest-looking option is learned to be always wrong (criteria 2, 3). Author one mismatched pair — *linear pair → supplementary* beside *vertical angles → congruent* — which is the highest-value addition to the whole tab. Three of the five chains also share one shape (named relation → definitional unpacking → numeric statement).
Criteria at issue: 2, 3, 7

### rain — **Keep**
The only non-geometric chain and the most valuable for it: with no geometry to fall back on the student must follow the form, and the reversal error is obviously absurd here in a way it is not once geometric content makes a reversed conditional sound plausible. If a session can guarantee one syllogism card, this is the one.

### vertical — **Keep**
The double-reversal distractor is the sharp one: it uses the two outer terms, as the correct answer does, but in the wrong order, catching the student who learned "keep the first and last, drop the middle" without attending to direction. The chain also produces a line a real proof writes.

### midpoint — **Keep**
Not an analogy for a proof step but literally two consecutive proof lines — definition of midpoint, then definition of congruent segments — compressed into one implication. Its converse distractor is the exact claim `midpoint-converse` demolishes, which is good cross-referencing even if sampling cannot guarantee both appear.

### linear — **Keep**
Structurally the third of three identical-shaped chains, but the conclusion (linear pair ⟹ 180°) is the one a student sets up equations with constantly, and seeing it derived rather than memorised earns the slot.

### square — **Tweak**
The one categorical chain, which is a genuine contrast with the other three, and the chain where a reversed link would be a *true* sentence that still does not follow by syllogism — the most instructive trap available in this family. As shipped the generic WHY never mentions it; add a clause for this chain. Squares and rectangles also sit outside the module's stated vocabulary (criterion 7).

## Tab 2 — Definitions and postulates (format only) — **Keep**
As a format this does its job: kind filters let a student narrow to one family, the Term ⇄ Definition toggle is a real choice, and the back shows the concept's figure and caption. Two observations. It is the only place on the Cards page where a figure appears at all, which is pointed given how many Tab 1 items would be improved by one (criterion 4). And with self-graded "Got it", no tracking of direction, and no score, the tab reports nothing back — defensible on a deliberately low-stakes surface, but it means a student who has mastered the deck is indistinguishable from one who clicked through it. Criteria 3 and 6 are not applicable to a reveal card.
Criteria at issue: 4, 7

## Batch summary
**Families (8):** Keep 3, Tweak 5, Rework 0, Cut 0. **Sources (37):** Keep 20, Tweak 16, Rework 0, Cut 1. **BUGs: 2** — `supp-90` (two defensible verdicts) and `bisector-midpoint` (a distractor that is a second valid counterexample).

The cross-cutting pattern is options that can never be keyed. Three of the seven card types ship a fourth choice the generator is structurally incapable of making correct: "the original conditional" in the classify shape (`classifyCard` returns early on that form), "None of these is logically equivalent to it." in the equivalence family (`equivalentForm` always maps into the three offered forms), and "Nothing follows — the middle terms do not match." in syllogism (all five authored chains are well-formed). In each case the dead option is the one that names the family's real failure mode, so the deck simultaneously tells the student what would make it right and guarantees it never is — a student who plays a few sessions learns to discount exactly the case the lesson is about. The second pattern is explanatory: every card's reasoning is a generic per-type sentence plus an optional authored topic note, so the four conditionals with a blank note ship boilerplate only, the equivalence family never argues its own item, and `bisector-midpoint` alone in its family leaves its distractors unexplained. Both patterns are cheap to fix — one authored non-chain, one flag that drops the partner form, five short notes — and neither requires reworking an item. Figures are absent from Tab 1 entirely and are mostly correctly absent (these are sentence-shape problems), with `midpoint-converse` the one place a drawing would carry an argument the prose now has to describe.
