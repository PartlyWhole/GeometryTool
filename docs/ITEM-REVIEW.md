# Item review

Every item in the app, described as a student meets it: what is asked, what the app
explains, what the diagram shows, and what a student is likely to be thinking and
looking at while they work on it.

This is a teaching document, not a test report. It is written to be read by someone
deciding what to change, so it says where an item is weak as readily as where it
works. Each description was written against the item's exact text and its figure's
real geometry — point positions, measures, and which marks the figure asserts — and
against the app's actual presentation, reviewed in a browser rather than inferred
from the code.

## How to read it

Items fall into three pages.

**Concepts** teaches an idea a step at a time. The "item" is the whole walkthrough,
so those are described as a sequence.

**Practice** asks the student to do something and checks it. Five tabs, ten exercise
modes between them. Some items are authored one by one; naming, definitions and most
proof drills are generated from the figures and the concept bank, so those are
described as families with sampled instances.

**Cards** drills recall and the logic of statements. Two tabs: seven generated card
types over 37 authored logic sources, and a reveal-style flashcard over the same 39
concepts.

## Conventions the whole app uses

Figures are drawn in a light card. Points are small open circles labelled with an
italic serif capital. What the figure itself *marks* — tick marks for congruent
segments, arcs for congruent angles, a small square for a right angle, printed
numerals like ∠1, printed degrees — is the only thing a student may treat as given.
That a drawing merely *looks* a certain way is never evidence, and several items
exist specifically to test that distinction.

Highlights are layered over the figure in three colours, and they mean the same thing
everywhere:

| colour | meaning |
| --- | --- |
| blue | the given, or the evidence being pointed at |
| red | what is to be proved, or the conclusion |
| ochre | the shared piece — the part both sides have in common |

A highlight spans exactly the two points it names. Where two would overlap on the
page they are drawn as parallel bars offset at right angles, so a whole can be seen
against its parts.

## What is here

| page | items |
| --- | --- |
| Concepts | 39 concepts, 194 steps |
| Practice ▸ Naming | 412 generated, in 4 question forms |
| Practice ▸ Definitions | 120 generated over the 39 concepts, in 4 kinds |
| Practice ▸ Diagram ↔ equation | 16 read + 8 drag + 4 select-all, all authored |
| Practice ▸ Solve | 9 single-answer + 3 two-part, all authored |
| Practice ▸ Proof | 11 authored proofs + 10 reason-checks + 37 one-step items + 3 generated families |
| Cards ▸ Logic and statements | 7 card types over 37 authored sources |
| Cards ▸ Definitions and postulates | the 39 concepts, as reveal cards |


---

# Concepts

## Points, lines and segments

### Point and line [point-and-line]

**What is asked.** Nothing is asked in the usual sense — this is a four-step take-in. The student is being handed the two undefined terms the rest of the module rests on, and asked only to watch a point become a line.

**What the app says, and when.** The definition line sits under the title from the start: "A point marks a position. A line is the straight path through two points." The steps then re-tell it in slower motion, and the final step is the BECAUSE reused as a step: everything after this is built out of these two. There is no watch-out and no equation box.

**The diagram.** Two figures, swapped between steps 1 and 2. First `justAPoint`: a single open circle labelled *P* at the centre of an otherwise empty stage, with *P* highlighted blue — a blue highlight on a lone point is close to invisible as a *contrast*, since there is nothing unhighlighted to compare it against. Then `aLine`: *A* at x = −110 and *B* at x = +110, dead level, the line through them drawn perfectly horizontal. Step 2 highlights the two points blue; step 3 switches the blue to the whole of AB, so the emphasis visibly travels from the endpoints to the path between them. Step 4 shows exactly the same figure and the same blue AB as step 3.

**The student's thought process.** The eye has nowhere else to go, which is the point. The one genuine visual beat — points blue, then line blue — lands well. The weakness is step 4: the stage does not change at all, so a student clicking "Next step" sees only the text swap and may reasonably wonder what they missed. A student who reads quickly may also take "line AB" as a *name for the picture* rather than as the naming convention it is; the walkthrough asserts the convention (step 3) but never contrasts it with anything, so there is no moment where a wrong name could be noticed.

### Collinear [collinear]

**What is asked.** To see that lying-on-one-line is a property of a *set* of points, and to absorb why "X, Y, Z are collinear" is a *sometimes* statement rather than an always.

**What the app says, and when.** Definition first: points that lie on one line are collinear. Step 2 makes the throwaway-but-important remark that *any* two points are collinear. Step 3 adds B and names three as "the first interesting case". Step 4 delivers the punchline about sometimes-truth. The same sentence is stored as the flashcard WATCH OUT, so a student meets it twice.

**The diagram.** One figure throughout: segment AC drawn horizontally, A at x = −150, C at x = +150, with B sitting at x = −24 — noticeably left of centre, about 42% of the way from A to C. Step 1 shows it with nothing highlighted. Step 2 highlights A and C blue only, deliberately skipping over B even though B is drawn between them. Step 3 adds B in blue so all three points are lit. Steps 3 and 4 are visually identical.

**The student's thought process.** The off-centre B is a good, quiet choice: it stops anyone reading "collinear" as "evenly spaced" or "B is the midpoint". The eye goes to the two endpoints first because they carry the drawn segment, then jumps back inward to B, which is exactly the order step 2 → step 3 imposes.

The real problem is that step 4's claim cannot be checked against anything on screen. The student is told three points "may or may not line up" while looking at three points that plainly do. There is no non-collinear figure anywhere in the concept, so the only case of the contrast that matters is left entirely to imagination — and the step, like step 3 before it, changes nothing in the stage. A student who has not already grasped the point will not get it from the picture.

### Segment Addition Postulate [segment-addition]

**What is asked.** First to accept AB + BC = AC when B is between A and C; then, across the longer back half, to work out *why* the betweenness hypothesis is not decoration.

**What the app says, and when.** Definition under the title, then a ten-step walkthrough in two movements. Steps 1–4 build the postulate: B is between, AB is one part, BC is the other, AC is the whole — and only at step 4 does the equation box appear beneath the figure with `AB + BC = AC`. Steps 5–8 break it. Step 9 repairs it ("The postulate itself is not broken — it is simply not about AB and BC here") with `AC + CB = AB` in the equation box. Step 10 gives the disguise: read backwards it is a subtraction. The WATCH OUT — collinearity alone is not enough — is reserved for the flashcard.

**The diagram.** The `collinear` figure again (A −150, C +150, B at −24, so AB is much the shorter part), then a swap at step 5 to `notBetween`: A at −150, B at +170, C at +26, with the drawn edge now the full AB. The order on the page really does read A, C, B. Colour use is deliberate: B is ochre at steps 1 and 5 as the point the whole question turns on, the parts are blue, the whole is red. Steps 7 and 8 are the best thing in the batch — AB stays blue but moves out to lane 2, CB is drawn ochre in lane 3, and at step 8 AC joins in red in lane 4, so three parallel bars sit under the figure and the overlap is *visible* rather than argued: the blue bar (320 units) and the ochre bar (144) together run far past the red one (176).

**The student's thought process.** In the first movement the eye goes to the drawn segment, then to B, and the postulate feels almost too obvious — which is the trap the second movement is built to spring. At step 5 most students will first notice only that "B moved" and not that the *labels* now run A, C, B; the ochre on B helps, but nothing marks the ordering itself, so the reader has to check the letters left-to-right by hand.

Two honest weaknesses. Ochre is carrying three different jobs here — the between-point (1, 5), then the doubling-back part (7, 8) — where the app's own key reserves it for the shared piece; a student building a colour habit across the module gets a mixed signal. And step 10, the step about the subtraction disguise, shows the same highlights as step 9 *with the equation box gone*. The one step that is explicitly about running the equation backwards is the one step with no algebra on screen. A line like `AB − AC = CB` in the box would cost nothing.

### Congruent segments [congruent-segments]

**What is asked.** To read congruence off tick marks and off nothing else — and, at step 4, to resist a segment that looks congruent but is unmarked.

**What the app says, and when.** Definition first (AB ≅ CD means AB = CD). Step 1 states the governing rule up front: the marks are the only evidence you have. Steps 2 and 3 read the two tick pairs. Step 4 is the watch-out, delivered inline rather than held back: different tick counts say nothing about each other, and EF carries none at all. Step 5 converts congruence to the equation `AD = BC`, shown in the box, and names it "the door into algebra".

**The diagram.** A 300 × 130 rectangle: A and B across the top (y = −60), D and C across the bottom (y = +70), with AD and BC as the short vertical sides. E sits on the top edge just right of centre (x = 15) and F on the bottom edge just left of centre (x = −15), joined by EF — a near-vertical transversal leaning about 13° off true, giving the 77°/103° pair at E and F. Two ticks mark AD ≅ BC, one tick marks EB ≅ DF. Highlights are blue on each congruent pair in turn, then red on EF at step 4, then back to blue on AD/BC for the algebra.

**The student's thought process.** The eye reads the rectangle as a rectangle first and the ticks second — and that is where the figure earns its keep, because EF measures about 133 units against AD and BC at 130. It looks the same length. A student who trusts the drawing will "see" three equal near-vertical segments and be wrong about one of them; the red highlight at step 4 is well aimed precisely because the invitation to misread is real.

One flat contradiction to fix: step 2 says AD and BC "both carry two ticks", while the concept's own second EXAMPLE says AD is 5 cm, BC is 5 cm, "so both carry one tick". A student who meets the example on a flashcard and the step in the walkthrough is being told two different things about the same figure. Separately, step 1 shows the figure with no highlight at all, which means the student's first look is unguided at the busiest figure in the batch — the four ticks are small and easy to miss before anyone points at them.

### Midpoint [midpoint]

**What is asked.** To pin down the two conditions a midpoint must satisfy — on the segment, and equidistant — and then to keep "midpoint" separate from "bisector".

**What the app says, and when.** Definition under the title. Step 2 supplies the condition students routinely drop: "M lies on AB — that part matters. A point equally far from A and B but off the segment is not a midpoint." Step 3 reads the ticks. Step 4 draws the practical consequence — each half is exactly half the whole, "which is usually what a question actually wants". Step 5 is the watch-out, also on the flashcard: a midpoint is a point, a bisector is a line, ray or segment, and "tests blur the two deliberately".

**The diagram.** The simplest figure in the batch: A at −150, B at +150, M exactly at 0, horizontal, with matching ticks on AM and MB. Step 1 shows it clean. Step 2 puts AB in blue and M in ochre — the ochre picking M out as the thing both halves share. Step 3 moves blue onto AM and MB separately. Step 4 flips the whole of AB to red. Step 5 leaves it unchanged.

**The student's thought process.** Nothing here is hard to see, and the blue-parts-to-red-whole move at steps 3 → 4 mirrors the Segment Addition sequence, which is good cross-concept rhyming: parts blue, whole red.

But steps 4 and 5 are where it slips. Step 4 says "each half is exactly half the whole" and then highlights *the whole*, not the halves — the sentence points one way and the colour the other, and a student tracking the highlight will come away with AB emphasised at the moment the halves are being discussed. There is also no equation box anywhere in this walkthrough, even though `AM = MB` or `AM = ½AB` is exactly the algebra step 4 promises a question will want; Congruent segments gets an equation box for a milder claim. And step 5's genuinely useful warning about point-versus-bisector arrives over an unchanged figure that contains no bisector at all, so the distinction is asserted rather than shown.

### Segment bisector [segment-bisector]

**What is asked.** To separate the bisector (a thing that passes through) from the midpoint (a place), and specifically to stop assuming a bisector must be perpendicular.

**What the app says, and when.** Definition: any line, ray or segment through the midpoint. Step 1 states the thesis immediately — a bisector "can cross at any angle it likes". Step 3 repeats it in the strongest form: "A bisector does not have to be perpendicular." Step 4 gives the takeaway that survives regardless of angle — the halves are equal. Step 5 introduces the perpendicular case as the special one, with the one-way arrow spelled out: every perpendicular bisector is a bisector, not the reverse.

**The diagram.** `obliqueBisector`: AB horizontal from −180 to +180, M at the centre with ticks on AM and MB, and two segments from M — MQ running up and to the right to (102, −130) and MR down and to the left to (−102, 130). They are collinear through M (∠QMR = 180°), giving a distinctly slanted crossing at 52°/128°, obviously not square. Highlights: AB blue with M ochre at step 2; then MQ and MR blue with AB dropping to *ochre* at step 3 — the segment being bisected becomes the shared thing; then both halves red at step 4. Step 5 swaps to the `perpendicular` figure with ∠APQ blue.

**The student's thought process.** The 52° crossing is the right call — it is far enough off square that nobody will misread it, and a student's eye goes to the tilt before it goes to the ticks. Step 3's demotion of AB from blue to ochre is subtle and probably lost on a first pass, but it is at least consistent with the colour key.

Two frictions. Step 3 calls it "Line QR", while the figure draws MQ and MR as two separate segments and the highlight lights them as two — so the student is asked to read one object where the page shows two halves of one. Second, step 5's verb is "tilt it to 90°", but nothing tilts: the figure is replaced with a different one, different letters (A, B, P, Q), a *segment* PQ rising only upward from P rather than a full crossing line, and — crucially — no tick marks at all. So the figure offered as the perpendicular-bisector case does not mark P as a midpoint. Having just spent four steps insisting the ticks are what make M a midpoint, the payoff figure withdraws them.

### Perpendicular bisector [perpendicular-bisector]

**What is asked.** To hold two facts at once — halving and 90° — and to know that both are available in a proof.

**What the app says, and when.** Definition line: a bisector that also meets the segment at 90°. Step 1 frames it as "two jobs at once". Step 2 gives job one (through the midpoint, so it halves). Step 3 gives job two (meets at 90°, "marked by the square"). Step 4 restates the one-way implication. The BECAUSE — it gives you *both* facts in a proof — is held back for quiz feedback, which is a shame, because it is the most useful sentence in the concept and never appears during the walkthrough.

**The diagram.** `perpendicular`: AB horizontal from −160 to +160, P at the origin, Q straight up at (0, −150). The shape is a T, not a cross, since PQ only goes one way. A small square is drawn at ∠APQ — the upper-left angle — and it is the figure's *only* mark. Step 1 is unhighlighted; step 2 puts P in ochre; step 3 adds ∠APQ in blue; step 4 leaves both as they are.

**The student's thought process.** The square is what the eye finds first, since it is the only drawn mark on an otherwise plain T. Step 3 therefore confirms what the student already saw, while step 2 — the harder, less visible claim — gets only a small ochre dot.

And that dot is doing work the figure does not support. Step 2 asserts "it passes through the midpoint, so it halves the segment", but there are no ticks on AP and PB. P *is* at the numerical centre of A and B, so it looks like a midpoint; per the app's own stated rule, that appearance is not evidence. The concept whose whole content is "two jobs" marks exactly one of them, and asks the student to read the other off the drawing — which is the habit the module is otherwise trying to break. Adding tick marks to AP and PB would fix this outright. As it stands, a careful student who has internalised step 4 of the *Perpendicular* concept ("only what is marked may be used") should object here, and would be right.

### Perpendicular [perpendicular]

**What is asked.** Not to define perpendicularity so much as to answer one narrow question: what does the little square license you to write down?

**What the app says, and when.** Definition first. Step 1 poses it as a question about the mark itself. Step 2 locates the crossing and reads the square as 90°. Step 3 is the point of the whole concept: "That square is not decoration. It is a given fact worth 90°, usable without proof." Step 4 turns the screw — the *other* angle at P is also 90°, but the figure marks only one, and only what is marked may be used.

**The diagram.** The same T: AB from −160 to +160, P at the origin, PQ rising 150 units straight up, square drawn at ∠APQ on the left. Step 2 and 3 show P in ochre with ∠APQ in blue. Step 4 drops the ochre and blue and highlights ∠QPB — the *unmarked* right-hand angle — in red.

**The student's thought process.** This is the sharpest use of the colour scheme in the batch. Red is the module's colour for "to be proved", and step 4 spends it on an angle that visibly measures 90°, so the student meets the idea that "obviously true from the picture" and "available as a given" are different categories. The eye has already assumed both angles are right; the red is there to interrupt that assumption at exactly the right moment.

Worth flagging honestly: step 4's wording is compressed to the point of ambiguity. "The other angle at P is 90° too" *states* the fact and then forbids using it, in one sentence, with no indication of what a student should do instead — in practice they would cite the Linear Pair Postulate or angle addition, neither of which is mentioned. A student could come away thinking ∠QPB is somehow not really 90°, which is not what the app means. Steps 2 and 3 are also visually identical, so the step that carries the concept's key claim arrives with no change on the stage at all.

## Angles

### Acute angle [acute]

The student is asked simply to take in a classification scheme, and to pin down where "acute" ends. There is no answering to do — this is a three-step read.

The definition line under the title says an acute angle measures more than 0° and less than 90°, with the example `m∠A = 35°`. Step 1 frames the whole set ("These four names cover every angle this module uses"), step 2 restates the definition, and step 3 does the real work by naming the boundary: exactly 90° is right, not acute. The same sentence returns as the quiz feedback line.

The figure, titled "Classifying by measure", shows four separate angles in a row along a common baseline: at P a 40° angle opening up-left, at Q a right angle with its small square, at R a 130° angle, and at S a 180° angle that is simply a horizontal line through S with G to the right and H to the left. Steps 2 and 3 both put ∠APB in blue — the leftmost, narrowest one.

A student's eye lands on the row and almost certainly reads it left-to-right as "small, square, wide, flat" before reading a word, which is exactly the comparison the shared figure is built for. The blue then confirms the leftmost is the one being named. The weakness is that steps 2 and 3 highlight identically, so the boundary warning — the one genuinely difficult idea — arrives with no visual change at all; clicking Next appears to do nothing, and the 40° printed label draws no attention to 90° at all. A student who only watches the picture will learn "acute = the skinny one" and still be unsure at 89° vs 90°.

### Right angle [right]

The ask is to recognise that this class is identified by a mark rather than by measuring.

The definition is "exactly 90°". Step 1 makes the distinctive claim — "of the four classes, this is the one a figure marks rather than measures" — step 2 explains that the small square is a given fact worth 90°, and step 3 extends outward to perpendicularity and to all right angles being congruent. The flashcard back repeats the warning that the square is not decoration.

Same four-angle row. Highlighted in blue throughout is ∠CQD, the second angle: Q sits on the baseline with C to its right and D straight down below it, so the angle opens downward as a clean vertical-meets-horizontal corner, carrying the square mark the batch declares.

Meeting the same picture for the second concept pays off here. The student already knows the layout, so the shift of blue from the first angle to the second reads immediately as "now this one", and having the 40° angle still visible beside it makes the right angle's uprightness feel like a comparison rather than an isolated fact. The step content is good: it is the only concept in the batch that tells the student *how the information reaches them* rather than what the number is.

Two honest gripes. The highlight never changes across all three steps, so step 2's key claim about the square gets no visual pointer — the square is drawn by the figure and blue simply covers the same angle again. And step 3's perpendicular/congruence material has nothing in the figure to attach to; there is no second right angle on screen to be congruent to, so the claim floats.

### Obtuse angle [obtuse]

The student is being asked to hold two boundaries at once: above 90°, but strictly below 180°.

Step 1 sets it up with unusual honesty — "there is a ceiling, and it is where most of the mistakes happen". Step 2 names the trap outright: a straight angle exceeds 90° without being obtuse. Step 3 adds the triangle consequence, that two angles above 90° would already overspend a triangle's 180°.

Blue sits on ∠ERF for all three steps: the third angle in the row, at R, with E out to the right along the baseline and F up and to the left past the vertical, giving the visibly splayed 130° opening.

This is the concept where the shared figure earns its keep most clearly, because the trap it warns about is drawn *right next to* the highlighted angle. The student sees blue on the 130° angle while the 180° straight angle sits immediately to its right, unhighlighted — the contrast that step 2 is arguing for is available to the eye without anyone saying so.

But the app never exploits it. A single step that flashed the straight angle in a second colour while the obtuse one stayed blue would make "this counts, that does not" a picture rather than a sentence; instead the highlight is frozen and all three steps look identical. Step 3's triangle remark is also orphaned — there is no triangle anywhere in the figure, and a student may go looking for one. And with 130° printed on the figure, the "strictly less than 180°" boundary is again asserted rather than shown.

### Straight angle [straight]

The student is asked to accept something counter-intuitive: a thing that looks like a line is an angle.

Step 1 is nicely blunt — "the one that does not look like an angle at all". Step 2 gives the mechanism (its two sides are opposite rays) and insists it is a genuine angle, not a non-angle, echoing the flashcard's watch-out. Step 3 reveals why anyone cares: in problems like "one angle is ⅝ of another", the angle on the right quietly turns out to be the straight one.

Blue covers ∠GSH throughout — the rightmost item, where S sits on the baseline with G at the far right and H well to the *left* of S, so the two rays are collinear and the whole "angle" is just a horizontal segment through S.

Here the shared figure does something the individual concepts cannot: the straight angle has been sitting in the row since the first concept, looking like a stray line, and now it is claimed as a member of the set. That payoff is real.

The problem is that a blue highlight spanning exactly the two named points produces, on a straight angle, a coloured line — visually indistinguishable from simply colouring a segment. The one figure in the batch where the highlight most needs to say "this is an angle" is the one where the highlight can say it least. Step 3's ⅝ warning, meanwhile, is abstract: there is no worked example on screen, so a student is told a trap exists without ever seeing it spring. Expect some to leave still privately thinking a straight angle is a technicality.

### Congruent angles [congruent-angles]

The ask is to read congruence off arc marks and then convert it into an equation.

The definition states that congruent angles have equal measure, `∠A ≅ ∠B` meaning `m∠A = m∠B`. The four steps build steadily: arcs signal congruence; ∠WVX and ∠YVZ each carry one arc, so they are congruent; arc *size* means nothing, only the *number* of arcs; and finally the algebraic payoff, with the equation `m∠WVX = m∠YVZ` appearing in its own box under the figure.

The figure "Shared middle angle" is four rays fanning downward from V at the top: W far left, X inner left, Y inner right, Z far right, symmetric about the vertical. The outer two angles ∠WVX and ∠YVZ are each 40° and carry matching arcs; the middle ∠XVY is 44°. Steps 2–4 highlight both outer angles in blue simultaneously.

A student's eye goes to the symmetry first and reads the two outer wedges as a matched pair before the arcs register — which gets the right answer for the wrong reason. The watch-out about arc size is exactly right pedagogically, but nothing in this figure tests it: both arcs here match in every respect, so the warning has no referent on screen. A figure with one small arc and one large arc on congruent angles would make the point; this one lets it pass as words.

The 44° middle angle is a quiet hazard. It is nearly equal to 40° and sits between two angles the app is busy calling equal, so a student may well conclude all three are the same, or that the fan is evenly divided. Nothing in the figure marks ∠XVY at all, and the step text never mentions it. Step 4's move into algebra is the strongest moment: highlight unchanged, but a new equation box appears, so the change is legible.

### Angle Addition Postulate [angle-addition]

The student is asked to see an angle as a whole made of two parts, and to notice the interior condition that licenses it.

The definition gives the statement outright: if P is in the interior of ∠ABC then `m∠ABP + m∠PBC = m∠ABC`. The five steps walk it: three rays from a vertex with the middle one inside; then the condition — "Ray VB lies in the interior of ∠AVC. That is the condition, and it is easy to skip"; then ∠1 as one part, ∠2 as the other, and ∠3 as the whole, with `m∠1 + m∠2 = m∠3` appearing below the figure. The feedback line adds the caveat: the parts make the whole *provided* the middle ray really lies inside.

The figure "Labelled angles" has V at the top with three rays fanning down: A to the lower left, B down and slightly left of centre, C to the lower right. It prints the numerals ∠1, ∠2, ∠3, so the naming is given. Measures are 54° and 70°, totalling the 124° whole.

The colour work here is the best in the batch. Step 2 puts the outer angle in blue and ray VB in ochre — ochre being the shared-piece colour, and VB is genuinely the side both parts share, so the palette is doing real semantic work. Steps 3 and 4 move blue onto each part in turn, then step 5 switches to red for the whole, marking it as the conclusion. The student's eye follows part, part, whole in exactly the order the equation is written.

One caution: 54° and 70° are close enough that the two parts look nearly equal, and a student primed by nothing may drift toward assuming VB bisects. It does not, and nothing on the figure says otherwise — but nothing warns against it either.

### Angle bisector [angle-bisector]

The student is asked to see bisection as the *special case* of an interior ray, not a separate idea.

Step 1 makes that framing explicit: an interior ray cuts an angle in two, and this is the case where the pieces come out equal. Step 2 establishes VD as interior, step 3 reads the congruence off the arcs, and step 4 delivers the payoff — each half is exactly half the whole, writable as an equation straight away. The feedback line repeats it.

The figure is V at top with three rays down: A lower left, D straight down, C lower right, symmetric about the vertical. Arcs mark ∠AVD ≅ ∠DVC, at 38° each inside a 76° whole.

The highlight sequence is the most articulate in the batch. Step 2 gives blue to ∠AVC with ochre on VD, so whole-and-shared-ray are distinguished; step 3 moves blue to the two halves; step 4 switches the whole to red. Read as a sequence: here is the whole, here are the equal parts, and the whole is now what you can conclude about. A student following along gets the part/whole relationship enacted rather than described.

Two honest problems. The figure is drawn perfectly symmetric, so the student sees "obviously equal" before the arcs are mentioned — which teaches reliance on appearance, precisely the habit proof work must break. The app's own rule is that only marks are given, and here the marks happen to agree with the picture, so the rule is never stress-tested.

Second, step 4 promises "you can write that as an equation straight away" and then shows no equation, though the same walkthrough style displays one for angle addition and complementary angles. That omission is conspicuous.

### Adjacent angles [adjacent]

The student is asked to distinguish two ways angles at one crossing can relate, and to pin adjacency to *touching*.

Step 1 signals the contrast up front. Steps 2 and 3 give the two conditions: shared vertex X and shared side, then separate interiors. Steps 4 and 5 turn to the counterexample — ∠1 and ∠3 are *not* adjacent, sharing the vertex but no side — closing on the slogan "Adjacent is about touching. Vertical is about facing", which also appears on the flashcard back.

The figure "Crossing lines" is two segments through X: AB running lower-left to upper-right at a shallow tilt, CD running lower-left to upper-right steeply the other way, crossing at 47°/133°. The four angles are printed as ∠1 through ∠4. ∠1 (=∠AXD) is the wide 133° one, ∠2 (=∠CXA) the narrow 47°.

The colour choice in steps 4–5 is a genuine misuse. Red is documented as "what is to be proved / the conclusion", but here it flags a *non-example*. A student who has internalised the palette will read red on ∠1 and ∠3 as "this is the target", which inverts the point. Ochre or a plain neutral would have served; red actively fights the text.

The blue-on-∠1-and-∠2 stages work well, though a student may misread the pair's shared ray as the whole line rather than the single ray XA. As with the other concepts, steps 2–3 and steps 4–5 are highlight-identical, so half the Next clicks change nothing visually.

### Linear pair [linear-pair]

The student is asked to see why two angles on a line are *guaranteed* to total 180° — and that this is a picture fact, not arithmetic.

The four steps are tightly constructed. Ray BD stands on line AC; ∠ABD and ∠DBC are adjacent with shared side BD; their outer sides BA and BC together form a straight line — "that is what makes them a linear pair rather than merely adjacent"; therefore they total 180°, with `m∠ABD + m∠DBC = 180` shown below the figure. The feedback line names it a picture fact that licenses writing "= 180".

The figure is a horizontal segment AC with B at its exact midpoint and D up and to the right at (63,−136), so BD leans right, giving 115° on the left and 65° on the right.

The colour logic is deliberate and mostly good. Step 1 puts blue on AC (the given line) and ochre on BD (the shared ray). Step 2 moves blue to the two angles, keeping BD ochre. Steps 3 and 4 then switch to ochre on AB and BC — the two outer halves — which is the crucial move, because it makes the student see the "straight line" as *two pieces that join*, not as one pre-existing line. The parallel-lane rendering means those two ochre pieces stay visible against the AC they compose.

The weakness is that step 3 drops the angles entirely. At the moment the student most needs to see "these two angles, and *their* outer sides", only the outer sides are coloured — and step 4 delivers "= 180" with the angles still uncoloured. Expect some students to attach the 180 to the line rather than the angle sum, which is the very confusion the concept exists to prevent.

### Vertical angles [vertical-angles]

The student is asked to recognise the facing pairs at a crossing and to understand that opposite *rays*, not visual opposition, is the defining condition.

The five steps run: two lines crossing at X make four angles; ∠1 and ∠3 sit opposite, sharing the vertex and nothing else; what actually makes them vertical is that each side of ∠1 is the opposite ray of a side of ∠3; ∠2 and ∠4 are the other pair; and vertical angles are always congruent, with a pointer to the Vertical Angles Theorem. The flashcard back reprises "Adjacent is about touching; vertical is about facing."

This is the second visit to "Crossing lines", and here the repetition genuinely helps: the student already knows which numeral sits where, so attention goes straight to the pairing. Step 1's ochre on point X alone is a nice touch — the shared-piece colour on the one thing both angles share. Steps 2–3 put blue on the 133° pair (∠1 and ∠3), step 4 moves blue to the 47° pair (∠2 and ∠4). Watching blue jump from one facing pair to the other is the clearest single moment in the batch: the figure holds still and only the pairing changes.

Two problems. Step 3's claim about opposite rays is the definitional heart, and it gets no highlight change from step 2 — the one idea that distinguishes vertical angles from "the ones that look opposite" is delivered with an unchanged picture, so most students will keep the visual rule.

Step 5 asserts congruence with nothing on the figure to support it. The measures 133° and 133° exist in the data but the figure marks no arcs, so by the app's own rule the student is being told to believe something the picture does not give.

### Supplementary angles [supplementary]

The student is asked to separate a numerical relationship from a spatial one: 180° total, with no requirement that the angles touch.

Step 1 states the thesis — a relationship between measures, "nothing at all about where the angles sit". Step 2 anchors it in the familiar linear pair. Step 3 then deliberately breaks the anchor by switching figures: supplementary angles need not touch, or even share a diagram. Step 4 draws the consequence for always/sometimes/never reasoning — "if ∠F and ∠G are supplementary then m∠F = 90°" holds for two right angles and fails for 100° and 80°.

The figure change at step 3 is the strongest design decision in this batch. Steps 1–2 show the linear pair (horizontal AC, B at centre, D leaning right, 115°/65°) with blue on both angles. Step 3 swaps to "Supplements of congruent angles": two separate crossings side by side, V on the left with ray VC dropping to the lower left, W on the right with ray WG dropping to the lower left, each standing on its own horizontal segment, each split 115°/65°. Blue goes on ∠1 (115°, left figure) and red on ∠4 (65°, right figure) — two angles in two different diagrams, which is precisely the claim. The physical gap between them carries the argument.

The colour is questionable, though: red means "to be proved", and nothing is being proved. It reads here as "the other one" rather than as a conclusion.

Note also that the figure marks ∠CVB ≅ ∠GWE with arcs — a congruence the walkthrough never mentions. A student may reasonably wonder whether those arcs are part of the point. They are not.

### Complementary angles [complementary]

The student is asked to transfer the supplementary idea down to 90°, and again to detach the arithmetic from the arrangement.

Step 1 says it plainly: the same idea, at 90° instead of 180°. Step 2 reads the square as marking ∠AVC right — 90° in total. Step 3 introduces ray VD splitting it, making the parts complementary. Step 4 repeats the detachment warning and shows `m∠AVD + m∠DVC = 90` below the figure. The feedback line reinforces that neither angle has to be drawn near the other.

The figure has V at the top, A straight down below it, C to the lower right at the same height as V, and D between them at (86,−43); the square marks ∠AVC. The split is uneven — 35° on the VA side, 55° on the VC side.

The uneven split is a good choice. A symmetric figure here would have invited "complementary means 45° each"; 35/55 blocks it. The colour logic is also coherent: ochre on ∠AVC at step 2 marks it as the containing whole, and step 3 keeps ochre on VD as the shared ray while blue picks out the two parts.

The real tension is between step 4's words and its picture. The text insists the angles need not be near each other, while the only illustration on screen is two angles jammed together inside a right angle — and unlike the supplementary walkthrough, which switched figures to make exactly this point, nothing changes here. A student comes away with a strong visual of "two parts of a corner" and a verbal disclaimer they have no picture for. Given that supplementary solves this problem two concepts earlier, the omission looks like an oversight rather than a choice.

### Angles around a point [angles-around-point]

The student is asked to accept that a full turn closes at 360°, and then — more usefully — to prefer the 180° shortcut when a straight line is available.

Step 1 gives the intuition: go once round and you face the way you started. Step 2 names the four angles that close the turn. Step 3 switches figures and drops to the half-turn case. Step 4 delivers the practical advice, which is also the flashcard watch-out: look for the straight line first, because working round the full 360° gets the same answer and takes twice as long.

"Angles around a point" is V at centre with four rays fanning out to A (right, slightly down), B (up-left of vertical), C (left, slightly up) and D (down-left), with ∠1–∠4 printed; the measures are 80°, 70°, 90° and 120°. All four go blue together at step 2, which does show the turn closing, though four simultaneous highlights on a figure with no straight line through it is visually busy.

Step 3's switch to "Three lines through a point" is the pedagogical move. That figure has six rays from V, with P and Q at the far left and right making PQ a genuine straight line, and prints 87° for ∠RVS and 33° for ∠SVQ. Blue on ∠X, ∠Z and ∠Y shows three angles filling the half-turn above the line — and because two of the three are printed, the student can actually compute the third, which is the first time in this batch the figure supports an inference rather than just illustrating one.

The weakness is that the shortcut is never demonstrated. Step 4 claims the 360° route takes twice as long but shows no comparison; with six rays and ten-plus implicit angles on screen, a student may simply find the second figure harder than the first and take the wrong lesson.

---

**On the shared figures.** Meeting `angleClasses` four times in a row works: the row stays put, the blue moves left to right across it, and the student builds a mental strip of small–square–wide–flat that no single-angle diagram would give. `crossing` works for the same reason on the second visit — the numerals are already familiar, so attention goes to the pairing rather than the labelling.

What undercuts both is that the highlight almost never changes *within* a concept. Nine of the thirteen concepts here hold one highlight state across two or three consecutive steps, and in every case the frozen steps are the ones carrying the boundary condition or the definitional subtlety — exactly the content that most needs a visual hook. The student learns that Next sometimes does nothing, and stops looking at the figure when the text advances.

## Properties of equality

### Reflexive Property [reflexive]

**Asked:** nothing is asked — this is a four-step read-through. The student's job is to accept that `a = a` is a real proof step and to see where it bites.

**Explained:** the definition line under the title is the bare `a = a`. Step 1 restates it with no figure at all — the stage area holds only the equation box. Step 2 supplies the motive ("it looks like it says nothing, and it is doing real work"), step 3 does the geometry, and step 4 is the watch-out: reflexive, never transitive, "a confusion test writers plant on purpose."

**Diagram:** the hinge is step 2, where the *fan* appears and the `a = a` box disappears — the two halves never sit on screen together until step 3. The fan is four rays from vertex V, spread symmetrically: W and Z outermost, X and Y inner, so three wedges of 40°, 44°, 40°. The figure itself prints only arcs on ∠WVX ≅ ∠YVZ; the degrees are not printed, so the student cannot read that ∠WVY and ∠XVZ are both 84°. Step 2 lights the middle wedge ∠XVY ochre alone. Step 3 adds ∠WVY blue and ∠XVZ red, with `m∠XVY = m∠XVY` below.

**Thought process:** the eye goes to the ochre sliver first, then tries to find the blue and red. And that is where it struggles: ∠WVY and ∠XVZ each *contain* the ochre wedge, so three highlights pile onto the same middle strip with no lane separating them — unlike Multiplication and Distributive, which do get a lane for exactly this whole-against-part problem. Worse, blue means "given" and red means "to be proved", but here ∠WVY and ∠XVZ are the two halves of one future conclusion; colouring one blue and one red implies an asymmetry that does not exist. The Addition Property, later, paints both of them red on this same figure. A student comparing the two will be quietly misled.

---

### Symmetric Property [symmetric]

**Asked:** take in that `a = b` and `b = a` are the same fact written two ways, and learn when you would bother.

**Explained:** definition line `If a = b then b = a`. Steps 1 and 2 are pure algebra with no figure: the box shows `a = b`, then `b = a`. Step 3 crosses to the picture, step 4 gives the "why you reach for it" (the next proof line needs BC on the left), step 5 is the summary: "It changes nothing except which side things sit on."

**Diagram:** *markedPair* is a rectangle — A and B on one long side, D and C on the other, with AD and BC as the two short vertical sides — plus a near-vertical transversal EF cutting from E on AB to F on DC, slightly slanted (77°/103° where it meets each side). Two separate tick pairs are printed: EB ≅ DF and AD ≅ BC. From step 3 onwards AD and BC are both BLUE, and they stay both blue, unchanged, for all three figure steps. Step 4 adds `BC ≅ AD` in the box.

**Thought process:** the student lands on a busier figure than the idea needs — four segments, a transversal, two tick pairs — and has to work out that only the AD/BC ticks matter. The EB ≅ DF ticks are noise here.

Then the real problem: symmetric is about *order*, and order is precisely what a highlight cannot show. AD and BC in the same colour, unchanged across three steps, encode nothing about which side of the equation each occupies. The only thing that actually flips is the box — and the box never shows the "before". Step 3 has no equation at all; the claim `AD ≅ BC` lives only in the prose. So the student sees one equation, `BC ≅ AD`, appear from nowhere and is told it is a flip of something they were never shown. This is the weakest figure–algebra hinge in the batch: the picture is present but inert, and a second equation box on step 3 would have done more work than the rectangle does.

---

### Transitive Property [transitive]

**Asked:** follow a chain of equalities through a shared middle term, and learn to distinguish it from substitution.

**Explained:** definition `If a = b and b = c, then a = c`. Steps 1–3 build the chain in the box — `AB = BC`, then `BC = CD`, then `AB = CD` — with step 3 naming the mechanism: "BC is the hinge: it is the right side of one and the left side of the other." Step 4 moves to the figure, step 5 draws the conclusion, step 6 is the watch-out about substitution.

**Diagram:** *fourInARow* is a single horizontal segment AD, 390 units long, with B and C printed on it at the third-points, so AB = BC = CD = 130 and the three parts look identical. Ticks mark all three congruent. Step 4 lights AB blue, BC ochre, CD blue. Step 5 switches AB and CD from blue to RED, keeping BC ochre.

**Thought process:** this is the best-executed hinge in the batch, for two reasons. The algebra half already speaks in segment names rather than `a`, `b`, `c`, so nothing has to be translated at step 4. And the three parts are disjoint and side by side, so three highlights sit cleanly on one line with no overlap and no lane needed — you see hinge-in-the-middle, evidence-either-side, at a glance. The blue→red flip on step 5 genuinely *enacts* the inference: the same two pieces change status while the ochre hinge holds still.

The honest weakness is that the ticks give the game away. They mark AB ≅ BC ≅ CD as a single chain, so a student can read AB ≅ CD straight off the figure without performing the transitive step at all, which blunts step 5's "nobody had to measure AB or CD." A figure ticked only AB ≅ BC and BC ≅ CD, with AD untouched, would have forced the move. Also, steps 4–6 carry no equation box, so at the moment of conclusion the algebra half is gone and `AB = CD` is left three steps behind.

---

### Addition Property of Equality [addition-property]

**Asked:** see that adding the same amount to both sides is both an algebra move and the standard way a shared part enters a proof.

**Explained:** definition `If a = b then a + c = b + c`. Steps 1–2 are the solve-for-x version: `3x − 12 = 18`, then `3x = 30`, with the instruction "Add 12 to each side." Step 3 crosses over, step 4 identifies the amount, step 5 concludes — "which is the whole of the proof."

**Diagram:** the same *fan* as Reflexive: V at the apex, rays to W, X, Y, Z, wedges of 40°, 44°, 40°, with arcs printed on ∠WVX ≅ ∠YVZ and no degrees printed anywhere. Step 3 lights only the two arc-marked outer wedges BLUE. Step 4 drops those and lights only ∠XVY OCHRE. Step 5 drops both and lights ∠WVY and ∠XVZ RED, with `m∠WVY = m∠XVZ` in the box.

**Thought process:** the staging here is much better than Reflexive's on the identical figure. Because each step shows one thing, the student reads it as a sentence: *these two are equal → this is the bit to add → now these two are equal.* Ochre for the shared middle matches the stated convention exactly, and both conclusion angles are red, which is the right call.

Two things work against it. First, the conclusion step drops the evidence: at step 5 the blue arcs are unlit, so the student sees two red angles and has to hold the reason in memory. Second, the two red angles overlap on the middle wedge with no lane, so ∠WVY and ∠XVZ are hard to tell apart as *two* things — and since no degrees are printed, 40 + 44 = 84 = 44 + 40 is never visible. "The two larger angles come out equal" is asserted, and the figure's honest scale is the only corroboration. A student who wants to check the arithmetic cannot.

---

### Subtraction Property of Equality [subtraction-property]

**Asked:** see a shared quantity cancel off both sides, and recognise it as the closing move of the Vertical Angles proof.

**Explained:** definition `If a = b then a − c = b − c`. Unusually, the algebra half is already geometric: step 1's box reads `m∠1 + m∠2 = m∠2 + m∠3` before any figure exists, and step 2 reduces it to `m∠1 = m∠3`. Step 3 then reverses the usual hinge — "Those numbers come off a figure" — and the picture arrives to explain the labels. Step 5 names the context.

**Diagram:** *crossing* is two oblique lines AB and CD meeting at X, printed with the numerals 1, 2, 3, 4 on the four wedges: ∠1 = ∠AXD and ∠3 = ∠BXC are the wide 133° pair, ∠2 = ∠CXA and ∠4 = ∠DXB the narrow 47° pair. Step 3 lights ∠1 BLUE, ∠2 OCHRE, ∠3 BLUE — three adjacent wedges, with ∠4 left dark. Step 4 flips ∠1 and ∠3 to RED.

**Thought process:** the figure is genuinely well chosen. The ochre wedge sits physically *between* the two blue ones, so "the amount both sides carry" is something the eye can see rather than infer, and the two "sides" of the equation are the two straight lines themselves — ∠1 + ∠2 sweeps line CD, ∠2 + ∠3 sweeps line AB. A student who notices that has understood the whole argument.

But nothing in the app points at those two straight angles. This is the place a lane would have paid off most — an ochre bar for ∠DXC against an ochre bar for ∠AXB, each seen against its parts — and it is not used, while Multiplication gets one for a simpler relationship. The pre-loaded labels also cost something: steps 1–2 show ∠1, ∠2, ∠3 with no picture and no statement that they are angles at a crossing, so for two steps they are floating names. And ∠4 is printed but never mentioned, a small live distractor beside three lit wedges.

---

### Multiplication Property of Equality [multiplication-property]

**Asked:** see that multiplying both sides by the same number is what turns "AM is half of AB" into the line a proof can use.

**Explained:** definition `If a = b then ac = bc`. Steps 1–2 clear a fraction: `x/2 = 5`, then `x = 10`. Step 3 crosses to the figure, step 4 states the geometric analogue with `2 AM = AB`, step 5 generalises back to fractions ("to undo a multiplication by ⅔, multiply by 3/2").

**Diagram:** *midpoint* is a 300-unit horizontal segment AB with M at the centre and ticks marking AM ≅ MB. Step 3 lights the point M ochre, AM (the left 150 units) BLUE, and AB OCHRE **in lane 2** — a parallel ochre bar offset below the segment, spanning the full 300. Step 4 drops all of that and lights AB RED only.

**Thought process:** the lane reads, and it reads well. Half-against-whole is a length comparison, so offsetting the whole below means the blue half and the ochre whole do not fight for the same pixels; it is a bar model, and a student recognises it as one. The algebra half also rhymes properly — both halves multiply by 2.

Three things go wrong. Ochre is defined as "the shared piece", but step 3 spends it on two things that are neither: the point M, and the whole segment AB. Two different objects, same colour, same step, neither matching the convention. Then step 4 drops the lane and the blue half at the exact moment the box says `2 AM = AB` — so the doubling is stated in algebra while the figure shows a single red segment and nothing to double. Keeping the blue AM and lighting MB would have made "twice the half" visible in one glance; instead the one step that needs the lane most is the step that loses it. And MB is never highlighted at all, although the ticks marking AM ≅ MB are exactly what licenses the claim. By step 5 the red AB is stranded beside a sentence about ⅔ that has nothing to do with it.

---

### Division Property of Equality [division-property]

**Asked:** see dividing both sides by the same nonzero number, and recognise it as the line bisector proofs need.

**Explained:** definition `If a = b then a/c = b/c, for c ≠ 0`. Steps 1–2 are the solve-for-x version: `3x = 30`, then `x = 10`. Step 3 hinges to the figure, step 4 performs the division with `m∠AVD = m∠AVC/2`, step 5 closes with a good piece of exam advice — "finding x is usually the halfway point, not the answer."

**Diagram:** *bisector* is three rays from V: VA and VC spreading to either side, and VD straight down the middle, directly opposite V. The two halves are 38° each and the whole ∠AVC is 76°, with arcs printed marking ∠AVD ≅ ∠DVC. Step 3 lights both halves BLUE and the whole ∠AVC OCHRE. Step 4 keeps only ∠AVD, now RED.

**Thought process:** the figure is clean and symmetric, and because the arcs really do mark the two halves congruent, "the whole angle is twice either half" is readable rather than asserted.

The hinge is the problem. The algebra divides by **3**; the figure divides by **2**, and no step text bridges the gap. A student following literally sees one move and then a different move, and has to supply the abstraction — precisely the abstraction the two-halves structure was meant to hand them. Multiplication, next door, uses 2 in both halves and is easier for it.

Second, step 3 puts the ochre whole ∠AVC directly on top of the two blue halves with no lane, even though this is the same whole-against-parts relationship that earned a lane in Multiplication and Distributive. The device exists and is not applied here, so the student gets three overlapping arcs in the same corner of the figure. Third, step 4 drops the ochre whole while the box still says `m∠AVC/2` — the equation names an object that is no longer lit. That fade-the-evidence pattern recurs across Addition, Multiplication and Division, and is worth fixing once, globally.

---

### Substitution Property [substitution]

**Asked:** see one quantity replaced by an equal one, and understand that no shared hinge is required — the point that separates it from Transitive.

**Explained:** definition `If a = b, then a may replace b anywhere it appears`. Three algebra steps: `AB = 5`, then `AB + BC = 12`, then `5 + BC = 12`, with "Put 5 where AB stood." Step 4 hinges to the figure with "Suppose this one comes with AB = 5 and AB + BC = 12." Step 5 lands `BC = 7`, step 6 is the watch-out, including the candid admission that substitution and transitive "overlap and either is usually accepted."

**Diagram:** *collinear* is the simplest figure in the batch — a 300-unit segment AC with B marked on it, off-centre at 126 units from A. No ticks, no printed degrees, no numerals. Step 4 lights AB BLUE and BC OCHRE; step 5 flips BC to RED with `BC = 7` below.

**Thought process:** one quiet excellence and one clear error. The excellence: B is placed at 126 of 300, and 5:12 of 300 is 125 — so the figure is drawn essentially true to the numbers in the prose. A student who eyeballs the two parts and thinks "the right one's a bit longer" is already most of the way to 7, and the red step confirms their estimate rather than surprising them. Deliberately not the midpoint, which is the right instinct.

The error is the ochre. Ochre is declared to mean "the shared piece, the thing both sides have in common" — and this is the one concept in the batch whose entire thesis is that **nothing is shared**. Step 6 says so explicitly. Painting the unknown BC in the shared-piece colour contradicts the concept at the level of the colour system, and a student who has just done Transitive (where ochre correctly marked the hinge BC on a four-point line) will read this figure as though BC is again a hinge. Given how close the two figures look, that is an active confusion, not a missed opportunity.

Beyond that the figure is nearly inert: with no ticks and no printed lengths, `AB = 5` and `AB + BC = 12` can only arrive from the step text, so the picture contributes betweenness and scale and nothing else.

---

### Distributive Property [distributive]

**Asked:** see parentheses cleared, and see that the two forms are one length written two ways.

**Explained:** definition `a(b + c) = ab + ac`. Steps 1–2 are algebra: `3(x − 4) = 18`, then `3x − 12 = 18`. Step 3 hinges to the figure, step 4 makes the whole-equals-parts claim with `3(x − 4) = 3x − 12`, and step 5 gives the strongest justification line in the batch: "Neither side has changed in value — only in form. That is why it needs a name of its own in a proof."

**Diagram:** *fourInARow* again — the 390-unit segment AD with B and C at the third-points, three equal 130-unit parts, all three ticked congruent. Step 3 lights AB, BC and CD each BLUE on the line, and AD OCHRE **in lane 2**, a parallel bar offset below spanning the whole 390. Step 4 drops the parts and lights AD RED.

**Thought process:** the lane reads here too — three blue segments above, one continuous ochre bar beneath, and the "three parts make one whole" reading is immediate.

But the figure and the algebra are not the same statement. `a(b + c) = ab + ac` distributes over a sum of **two** terms; the figure shows **three identical** parts. What the bar actually illustrates is 3k = k + k + k, which is repeated addition, not distribution over a sum. Step 4's wording ("counting the same three parts term by term gives 3x − 12") half-concedes this: distributing 3 over (x − 4) produces 3x and −12, two scaled terms, and neither corresponds to any of the three blue segments the student is looking at. A genuine picture of a(b + c) needs two *unequal* parts and a scaling of both — which the lane device could show, if it were given different geometry.

There is also the minus sign: each part is supposedly x − 4, and a subtraction cannot be a drawn length without pretence, so the student sees three positive bars labelled by nothing. And this is the second appearance of *fourInARow* with a different meaning for the same ticks, which is economical but invites a student to import Transitive's reading of the figure.

## The five theorems, reasoning and proof

### Linear Pair Theorem [linear-pair-theorem]

Nothing is asked. This is a four-step walkthrough whose whole job is to license one move, and it says so in its first line: "This is the bridge from something you can see to something you can write down."

The explanation arrives in the definition line ("If two angles form a linear pair, they are supplementary") and then again, more usefully, in step 2, which names the picture fact precisely — ∠ABD and ∠DBC are adjacent with their outer sides on line AC. Step 3 supplies the number fact in the equation box: m∠ABD + m∠DBC = 180. Step 4 restates the bridge metaphor. The BECAUSE text, reserved for quiz feedback, is the sharpest sentence of the set: seeing two angles sit on a line is what licenses writing "= 180".

The figure is a straight segment from A(−160,0) to C(160,0) with B at the middle and ray BD rising to the right, D at (63,−136). The underlying measures are 115° and 65°, but — and this matters — the figure declares no degrees. Nothing is printed. The student cannot read 115 + 65 off the page, which is exactly right for a theorem that must not depend on measuring. Contrast the inductive-reasoning figures, which do print their degrees.

The highlight holds steady from step 2 onward: AC in ochre, both angles in blue. Ochre is the app's colour for the shared piece, and here the shared piece is the line the two angles stand on rather than a quantity to be subtracted. It is a slight stretch of the convention, but it points at the right thing — the student's eye goes to the straight line first, then to the two blue wedges sitting on it, which is the causal order.

A student's likely path: notice the ray leaning right, register that the two angles are unequal, and wonder briefly whether the theorem needs them equal. Nothing addresses that worry directly, though the asymmetric 115/65 figure quietly does the work. The one oddity is step 4, where the equation disappears while the highlight stays — the summarising step loses the very thing it is summarising.

### Vertical Angles Theorem [vertical-angles-theorem]

The student is asked, in step 1, "Why must the opposite angles at a crossing be equal?" — and warned that the proof's shape is the shape of every argument in the module. That framing is earned.

Six steps run a genuine miniature proof. Two linear pairs give m∠1 + m∠2 = 180 and m∠2 + m∠3 = 180; step 4 sets the sums equal to each other with the reason stated in words ("Two quantities equal to the same thing are equal to each other"); step 5 subtracts the shared m∠2 and lands on m∠1 = m∠3; step 6 closes with the generality claim — no measuring, no special case.

The figure is two segments crossing at X: AB from (−140,−34) to (140,34), rising left to right, and CD from (−120,78) to (120,−78), falling. The four angles carry printed numerals. ∠1 and ∠3 are the 133° pair, opposite each other; ∠2 and ∠4 are the 47° pair. No degrees are printed, so again the conclusion cannot be read off.

The highlight is the best in the batch. Ochre sits on ∠2 from step 2 through step 6 and never moves — the shared supplement, visibly present while it is being used and still there after it has been subtracted away. Blue hops from ∠1 (step 2) to ∠3 (step 3) as each linear pair is cited. At step 5 both turn red together. The colour genuinely tracks the argument: a student who watched only the colours could narrate the proof.

One real flaw. At step 4, the equation is m∠1 + m∠2 = m∠2 + m∠3, but only ∠2 (ochre) and ∠3 (blue) are highlighted; ∠1 has gone dark since step 2. That is the pivotal transitive line, and the student is asked to read an equation about three angles while the figure shows two. A student's eye at that moment goes to the equation box and stays there — the figure stops helping just where the abstraction is hardest.

Could a student reconstruct the argument from the steps alone? Yes, plausibly, provided they already accept the Linear Pair Theorem. The dependency is real and unstated: steps 2 and 3 assert the 180° totals without naming the theorem that grants them, one screen after that theorem was taught.

### Congruent Supplements Theorem [congruent-supplements]

Step 1 poses the difficulty honestly: "Two angles in different places, with nothing in common except what each one is supplementary to." That is the whole content of the theorem, and the figure is built to make the separation unmissable.

Two unconnected straight lines sit side by side. On the left, segment AB from (−290,40) to (−40,40) with V at (−165,40) and ray VC rising to C(−106,−87); ∠1 = ∠AVC is 115°, ∠3 = ∠CVB is 65°. On the right, the same arrangement mirrored: DE with W at (165,40) and ray WG to G(224,−87), giving ∠2 = 115° and ∠4 = 65°. Arcs — drawn by the figure, so genuinely given — mark ∠3 ≅ ∠4. No degrees are printed.

The colour logic shifts here relative to vertical angles, sensibly. Ochre lands on the things being subtracted: ∠3 at step 2, ∠4 at step 3, both together at step 4 when the arcs are invoked. Blue marks ∠1 and ∠2, the angles under investigation, and they turn red at step 5 when the conclusion arrives. Step 5's aside is the important one — "these two never touch — being supplements of congruent angles is enough."

The weakness is arithmetic. Steps 2 and 3 get equations (m∠1 + m∠3 = 180, m∠2 + m∠4 = 180), and then steps 4, 5 and 6 get none. The harder case — where the subtracted quantities are congruent rather than identical, so you need a substitution the vertical-angles proof did not — is exactly where the algebra vanishes and the reasoning becomes prose. A student who followed vertical angles by watching the equation box will find it empty at the two steps that matter most.

Where students go wrong: reading the arcs as marking ∠1 ≅ ∠2 rather than ∠3 ≅ ∠4. The arcs sit on the two 65° wedges, the visually smaller ones, while the eye is drawn to the large 115° angles the conclusion is about. Step 4's text names the arcs explicitly, which helps, but the ochre highlight arrives at the same instant as the sentence rather than before it.

### Congruent Complements Theorem [congruent-complements]

Step 1 tells the student outright that this is the previous argument "run at 90°", and then flags the one structural difference: "Here the two angles sit either side of the one they share."

The figure is a fan of four rays from V at the origin — VA to (165,0), VB to (83,−143), VC to (0,−165), VD to (−143,−82). Numerals mark ∠1 = ∠BVA (60°), ∠2 = ∠CVB (30°), ∠3 = ∠DVC (60°). Two squares are drawn, on ∠CVA and on ∠DVB. Neither square sits on a numbered angle: each spans two of them. That is the figure's real demand — the student must see the square as covering ∠1 + ∠2, and the other as covering ∠2 + ∠3.

The step structure mirrors vertical angles line for line, and this time the equations are all present: 90 = m∠1 + m∠2, 90 = m∠2 + m∠3, then m∠1 + m∠2 = m∠2 + m∠3, then m∠1 = m∠3. Ochre holds on ∠2 from step 2 through step 6, exactly as it held on ∠2 in vertical angles; blue moves from ∠1 to ∠3; both go red at step 5. The parallel is deliberate and a student who did vertical angles will feel it.

Step 6 earns its place: "Unlike that case, these two are not vertical angles — the conclusion needs this theorem." Without that line a student would reasonably assume ∠1 and ∠3, both 60°, are vertical. They are not — they are separated by ∠2, not opposite across a crossing — and the sentence pre-empts the mistake.

The honest cost is visual crowding. Four rays, one vertex, two right-angle squares and three numerals all converge at V, and the squares overlap the numbered angles they contain. The app's parallel-lane offsetting keeps the highlights readable, but the figure's own marks are not offset, and at 330px the region near V is dense. A student's eye goes to the squares first, then has to work outward to find which numerals fall inside which square — which is the right work, but harder than it needs to be.

### Right Angle Congruence Theorem [right-angle-congruence]

Step 1 asks the question flatly: "Two right angles in different places, with nothing else in common. Must they be equal?" Five steps answer it, and step 5 concedes the answer is trivial while defending why the theorem exists — "it is the named reason you cite when a proof needs two right-angle marks to be equal."

The figure is two corners, drawn as mirror images. On the left, A(−230,40) with AB running right to (−70,40) and AC running up to (−230,−90), giving ∠1 = ∠CAB. On the right, E(240,40) with ED running left to (80,40) and EF running up to (240,−90), giving ∠2 = ∠DEF. Both carry squares. Nothing connects them, which is the point.

The highlight is blue on ∠1 at step 2, blue on ∠2 at step 3, then both red at step 4. Note what that means: the two givens are never blue at the same time. Step 3 drops ∠1 entirely, so at the moment the student should be holding two facts side by side, only one is lit. Then both change to red together. A student watching the figure sees one corner light up, then the other, then both — and the middle beat, where they should be comparing, is missing.

More striking: this walkthrough uses no equation box at all. Not one of the five steps shows algebra. The app has the equation lane and uses it freely elsewhere, and this theorem is the purest instance of the transitive move in the whole module — m∠1 = 90, m∠2 = 90, therefore m∠1 = m∠2. Writing those three lines would take three equation boxes and would make explicit the pattern the other four theorems keep gesturing at. Instead step 4 carries it in a single sentence: "Two quantities each equal to 90 are equal to each other."

For most students this will not matter, because the conclusion is obvious before the walkthrough starts. The risk is the opposite one — that a theorem this easy gets skimmed, and then the student cannot name the reason when a proof demands it. Step 5 anticipates exactly that and is the only step doing real work.

### Inductive reasoning [inductive]

The student is asked to watch three measurements and notice what they share. Step 1 sets the frame: "How geometry gets its ideas — and why it can never finish with them."

Three linear-pair figures appear in turn, each with its degrees actually printed on the figure — unlike the theorem figures, which print nothing. Case A tilts the ray right, D at (96,−115), marked 130° and 50°. Case B stands it straight up, D at (0,−150), marked 90° and 90° with squares. Case C leans it left, D at (−123,−86), marked 35° and 145°. Both angles are blue in every case: this is evidence being pointed at. The three tilts — right, vertical, left — span the space deliberately, and the 90/90 case is the one a student already believes, which makes it the weakest of the three as evidence and the most reassuring as a starting point.

Is three enough to provoke the conjecture? For this conjecture, probably yes. The invariant is a single number that stays put while everything visible changes, and 180 is a number students already associate with straight lines. A student will likely see it at case B and have it confirmed by case C.

The "but this is not why it is true" turn is where the item is weakest, and the weakness is structural. Step 5 concedes the conjecture "happens to be true," which is fair but undercuts the lesson: three cases of a true pattern is a poor vehicle for teaching that induction is unreliable. Step 6 reaches for 2, 4, 6, 8 → 10, but that is not a counterexample — it is a case where the pattern is underdetermined, and a student may not feel the difference. The WATCH OUT on the flashcard says "a single counterexample ends it," and no counterexample is ever shown anywhere in the walkthrough.

Compounding this, steps 5, 6 and 7 all display case C with the identical highlight. Three consecutive steps with a frozen picture, while the text does all the arguing. The student's eye leaves the figure at step 5 and does not come back.

### Deductive reasoning [deductive]

Step 1 names the contrast: "The other kind of reasoning: no guessing, and no room left for doubt." Nothing is asked; the student watches one inference happen.

The crossing figure returns, and so do ∠1 and ∠3 — the same two 133° angles from the Vertical Angles walkthrough, at the same positions. That reuse is the best decision in this item. The student is not learning a new configuration, so all their attention is available for the logical move.

The move is carried almost entirely by colour. Step 2 lights ∠1 and ∠3 in blue and calls them vertical angles — evidence. Step 3 cites the Vertical Angles Theorem, turns the same two angles red, and prints ∠1 ≅ ∠3 in the equation box. Nothing on the figure moves; only the hue changes, from given to conclusion, on one pair of objects. As a picture of what deduction does — it adds no new marks, it only changes the status of what is already there — this is elegant.

It is also the risk. A student scanning quickly may register "the angles are still highlighted" and miss that the highlight changed meaning. There is no legend on screen, and the blue-to-red transition is the entire content of step 3. A student who has not yet internalised the colour convention from the theorem walkthroughs will see two coloured wedges and a line of algebra and take the algebra as the point.

Step 4 is the payoff and it is well placed: the conclusion "holds for every crossing ever drawn, which is what measuring three examples could never give you." That is a direct callback to the three measured linear pairs in the inductive walkthrough, and it does the comparison the inductive item could only promise. Step 5 lands it on proof — every line of a two-column proof is a deductive step — which sets up the Proof concept cleanly.

### Law of Syllogism [syllogism]

The definition line is symbolic — "If p → q and q → r, then p → r" — and the EXAMPLE is the rain/pitch/cancelled-match chain, which is the clearest thing in the item and appears nowhere in the walkthrough.

The six steps instead build the chain out of geometry. Rule one: vertical implies congruent. Rule two: congruent implies equal measure. Step 4 names the mechanism — "the conclusion of the first is the hypothesis of the second — 'congruent' is the shared middle term" — and prints m∠1 = m∠3. Step 5 applies it to the figure, step 6 connects it to the transitive property and warns that both fail if the middle terms do not match exactly.

The figure is the crossing again, ∠1 and ∠3 at 133°, blue for steps 2 and 3 and red for steps 4 through 6.

Here is the problem. Steps 2 and 3 are visually identical: same figure, same two angles, same blue. The two rules being chained are distinguished by text alone. And the concept is entirely about a shared middle term — the app has a colour reserved for exactly that idea, ochre, "the shared piece, the thing both sides have in common," used to great effect on ∠2 in the vertical-angles proof and on ∠XVY in the Proof walkthrough. Ochre is never used in this item. The one concept in the module whose whole content is a shared middle term is the one concept that does not colour it.

This is not a small miss. A student arriving at step 4 is told that "congruent" is the shared term, but nothing on screen has ever shown them a shared term as a distinct object. The crossing figure cannot show it — the middle term is a predicate, not a region of the plane — and no other figure is offered. The intermediate fact ∠1 ≅ ∠3 is never written in the equation box either, so the chain's middle link is invisible at both stages.

What a student will actually take away is step 5's practical form: vertical angles, therefore equal measures, "in one move instead of two." That is useful and probably sticks. The logical structure underneath it does not get a picture.

### Proof [proof]

This is the batch's centrepiece: eleven steps walking one real proof — given ∠WVX ≅ ∠YVZ, prove m∠WVY = m∠XVZ.

The figure is a symmetric fan from V(0,60), with four rays running down to W(−132,−10), X(−56,−79), Y(56,−79) and Z(132,−10). The outer angles ∠WVX and ∠YVZ are both 40° and carry arcs — the only given the figure declares. The middle ∠XVY is 44°. The two target angles, ∠WVY and ∠XVZ, are each 84°, and they overlap: each is built from one 40° outer angle plus the shared 44° middle. Nothing but the arcs is printed, so the equality of the two 84s cannot be read off the page.

That overlap is what the presentation layer's parallel-lane offsetting exists for. At step 3, ∠WVY and ∠XVZ are both red and they occupy overlapping territory; at steps 7 and 8 the ochre ∠XVY sits inside both. Drawn in separate offset lanes, a student can see the two wholes and the shared part at the same time, which is the single visual fact the whole proof turns on.

**The order of the steps.** Step 2 reads the given and nothing else, in blue. Step 3 reads the goal, in red, with the warning "never use the goal as a reason for anything." Step 4 — before any line is written — hunts for the connection: "∠XVY lies inside both of the larger angles, and it is the only thing they share. That is the bridge," in ochre. Only then do steps 5 through 10 write the six proof lines, each with its reason: Given, Definition of congruent angles, Reflexive Property, Addition Property of Equality, Angle Addition Postulate, Substitution. Step 11 looks back and names the shape.

As teaching, that order is right, and it is not what a textbook does. A textbook prints the finished six lines and asks the student to follow them; the search that produced them is invisible, which is why students conclude that proofs are things other people already know. Putting the hunt for the shared piece before the first written line, as its own numbered step with its own colour, is the most valuable thing in this module.

**Does the colour carry it?** Largely yes. Blue appears at steps 2, 5 and 6 — the given and the two lines derived directly from it. Ochre at 4, 7 and 8 — the bridge, its reflexive statement, and its addition to both sides. Red at 3, 9, 10 and 11 — the goal, stated at the start and reached at the end. The colours partition the proof into three phases and a student could describe the argument's architecture from the hues alone. Step 7's gloss on the Reflexive Property is unusually good: "It looks like it says nothing. It is what licenses adding the same quantity to both sides." So is step 6's — "Congruence cannot be added; measures can" — which answers a question most students never think to ask.

**Three real weaknesses.** First, only one line of algebra shows at a time. The numbered step text is all visible at once, past steps greyed, but the equation box holds a single line. At step 10, when Substitution combines line 4 with line 5, neither line 4 nor line 5 is on screen. For a concept defined as "a chain of statements," the chain is never visible as a chain, and the student cannot do the one thing the definition asks — look back along it.

Second, step 9 is lopsided. The text says "The left sum is m∠WVY; the right sum is m∠XVZ," but the equation box shows only m∠WVX + m∠XVY = m∠WVY. The right-hand naming is spoken and not written, so the student must hold half of the Angle Addition step in their head while reading the other half off the screen.

Third — and this recurs across the whole batch — at step 8, the Addition Property line, the equation names four angles and only ∠XVY is highlighted. The same narrowing happens at step 4 of the vertical-angles proof. Whenever the walkthrough reaches its purely algebraic move, the highlight contracts to the shared piece and the rest of the figure goes dark, exactly when the student most needs to see the terms as regions of the plane.

Finally, the student watches a search rather than performing one. Step 4 hands over the bridge — "it is the only thing they share" — instead of asking. That is a defensible choice for a first exposure, and the Practice page's Build-a-proof tab presumably takes the other half. But step 11's "Look back at the shape" asks for a transfer that nothing in these eleven steps required the student to earn.

---

# Practice

## Naming

Naming is 412 generated items spread over four question forms. The Practice tab puts the figure on the left, the instruction and the running selection on the right, with Check and Clear beneath. The running selection matters more than it sounds: two of the four forms ask for clicks in a specified order, and the panel is where a student sees that they clicked S, then V, then Q rather than V, S, Q.

The bank is figure-driven almost entirely. The sampled instances draw on about a dozen figures — a linear pair in two variants, four points in a row, a strip of four classified angles, an oblique bisector, a labelled corner, a pair of crossing lines, angles on a line, a complementary pair, two right angles, and two supplement pairs. Every item is a question *about* one of those pictures, so what the student actually learns depends on how legible the picture is at the moment of asking.

### Form "choose" — name the highlighted part

The student sees a figure with one part highlighted and picks its name from four options. Segments and angles both appear, with a fixed explanation per type: for angles, "The middle letter names the vertex, so reordering the letters can name a different angle entirely"; for segments, "Either order names the same segment, but the letters must be its endpoints."

**linearPair:ABD.** A horizontal segment AC with B at its centre, and D rising from B up and slightly to the right, giving ∠DBA = 115° and ∠DBC = 65° with ∠ABC printed as 180°. The options are ∠ABD (correct), ∠BAD, ∠DBC, ∠ABC — and they are three genuinely different errors: right letters in the wrong order so the vertex lands on A, right vertex but the wrong arm, and the whole straight angle offered in place of one of its parts. The fixed explanation about the middle letter answers the ∠BAD trap exactly. This is the best-constructed choose item in the sample.

**linearPairCaseB:ABD.** Structurally the same question on a different picture: D now rises straight up from B, both halves declared 90° with small squares. Same answer, same four options in a different order, same explanation. It is a fine item, but sitting next to the previous one it shows how little the generator has to change to produce another question — the arithmetic differs, the naming problem does not.

**fourInARow:AD.** A, B, C, D evenly spaced on one horizontal segment with ticks marking AB ≅ BC ≅ CD. The highlighted part is the whole, AD, against AB, AC and BC. Every distractor is a real sub-segment, so the discriminator is purely which endpoints the highlight spans — good. The explanation is half-wasted here: no reversed name (DA) is offered, so the "either order" clause addresses a confusion this item never raises.

**angleClasses:BPA.** The crowded strip: four separate angles laid left to right at vertices P, Q, R and S — 40° acute, a 90° with a square, 130° obtuse, and a 180° straight angle — twelve labelled points across the full width of the card. The options are ∠FRE, ∠PBA, ∠BPA and ∠DQC, so the student must first locate which of four sub-figures is highlighted and then reject ∠PBA, which puts the vertex on an arm endpoint. Two distractors are angles elsewhere in the same figure, which is exactly right for a picture this busy.

**obliqueBisector:MR.** A horizontal AB with midpoint M (ticks on AM ≅ MB) and a second straight line through M at a slant, its two halves running to Q and R. The highlighted segment is MR, against AM, AB and MB. This is the weakest sampled choose item: MR is the only option that is not part of the horizontal line, so it can be found without reading letters at all.

### Form "label" — which marked angle is ∠AVB?

Here the three-letter name is given and the student picks the numeral that marks the same angle. This is the form that carries the ∠1-and-∠ABC-are-one-angle idea, and its explanation is generated per item rather than fixed: "∠AVB has vertex V with arms through A and B, which is the region marked ∠1. The two names refer to the same angle and may be used interchangeably." Naming the actual letters and the actual numeral makes a templated sentence read as an answer to the specific question. It is the best explanation pattern in the Naming bank.

**numberedCorner:equiv:1.** Vertex V at the bottom with three arms fanning upward to A, B and C; ∠1 = ∠AVB (54°), ∠2 = ∠BVC (70°), ∠3 = ∠AVC (124°). Only three options are offered, because the figure only carries three labels — worth noting that the guess rate on this form varies with the figure, 1-in-3 here against 1-in-4 elsewhere. The ∠3 distractor is the useful one: ∠AVC shares arm VA with the answer and contains it, so a student tracking one letter rather than two picks it.

**crossing:equiv:1, :2, :3, :4.** Four of the five sampled label items are the same crossing-lines figure asked four times, once per numeral. Two shallow lines cross at X: ∠1 = ∠AXD is the wide top wedge (133°), ∠2 = ∠CXA the narrow left (47°), ∠3 = ∠BXC the wide bottom (133°), ∠4 = ∠DXB the narrow right (47°). The figure has a real virtue — the two wide wedges are equal and the two narrow ones are equal, so size alone never separates ∠1 from ∠3 or ∠2 from ∠4, and the student is forced onto the letters. Distractors here are simply the other three numerals; nothing needs crafting and nothing is wasted.

### Form "click" — click the points that name it

The name is given in the prompt and the student clicks the points on the figure, in order for angles, in either order for a two-point segment. Explanations are fixed: "The middle letter is always the vertex; the outer letters sit on the two arms," and for segments, "A segment is named by its two endpoints, in either order" — which is accurate here, since the segment prompt correspondingly drops the words "in order".

**threeOnLine:SVQ.** P, V, Q on a horizontal with R and S rising symmetrically from V; ∠RVS, ∠RVP and ∠SVQ are all 60°. Because all three visible wedges are the same size, the geometry offers no clue at all — only the labels do. That is a deliberate-looking and good property for a form that is meant to test reading the letters off the figure.

**angleClasses:DQC.** The twelve-point strip again, clicking D, Q, C where Q is one of four candidate vertices. On this figure the find-the-point work is substantial.

**complementary:VD.** V at the bottom with A straight above it, C level to the right, the 90° ∠AVC marked with a square, and an interior ray to D splitting it 35°/55°. The task is the two-point variant: click V and D. Short, and the explanation matches the task.

**twoRightAngles:CAB.** Two mirror-image right angles, one at A on the left and one at E on the right, both drawn with squares and labelled ∠1 and ∠2. Since the two are congruent and mirrored, the only way to click the correct vertex is to read which letter is where.

**twoSupplementPairs:CVB.** Two translated copies of a linear pair — A, V, B on a line with C rising from V, and D, W, E with G rising from W — with arcs marking ∠CVB ≅ ∠GWE (65° each). A student who has the shape but not the letters clicks G, W, E. Strong item for the same reason as the previous one.

### Form "points" — ∠1 is marked; click the three points that name it

The inverse of "label", and the only form where the dump records an explicit ordered answer key. The explanation is again instantiated: "∠1 and ∠AXD are two names for one angle. A label is a shorthand; the three-point name says where the angle is, with the vertex in the middle." That sentence is doing the central conceptual work of the whole exercise type.

The five sampled instances are crossing:1 (A, X, D), crossing:2 (C, X, A), numberedCorner:1 (A, V, B), numberedCorner:2 (B, V, C) and numberedCorner:3 (A, V, C) — two figures across five items.

One thing to confirm in the app: the recorded answer for crossing:2 is C, X, A, matching how that label is defined, and for numberedCorner:2 it is B, V, C. Geometrically ∠CXA and ∠AXC are the same angle, and the item's own explanation tells the student the outer letters merely sit on the arms. If the checker requires the stored order, it marks a correct name wrong and contradicts the sentence it then shows. Worth a one-minute check.

### What the four forms cover, and where they overlap

The four forms are best read as two axes: what is given (a highlighted part, a three-letter name, or a numeral label) and what the student produces (a choice or a sequence of clicks). "Choose" is recognition from figure to name. "Label" is recognition from name to numeral. "Click" is production from name to figure. "Points" is production from numeral to name-by-clicking.

None is strictly redundant, but they are not equally valuable. "Label" and "points" are the same conceptual content — one name, two notations — in opposite directions, with "label" the easier recognition version; running both is defensible as a difficulty ladder rather than duplication. The genuinely thin form is "click" with a three-letter name: the answer is written in the prompt, so the item degrades to finding four-to-twelve labelled points and clicking three of them in the order already given. It still drills the ordering habit and the figure-reading, and on crowded figures like angleClasses or mirrored ones like twoSupplementPairs that work is real — but on a sparse figure it is close to free. "Choose" is the only form that starts from the picture with no name supplied anywhere, and it carries the vertex-in-the-middle distractors; it is the load-bearing one.

## Definitions

Four question kinds generated over the 39 concepts, presented without a figure in most cases — four options as full-width lettered rows, A to D. The same concept content backs the Definitions and postulates flashcards on the Cards page, so a student who has worked those cards has, in effect, already read the answer key for two of these four kinds.

### kind "example-to-term"

An instance is given — usually in prose, occasionally as a figure — and the student names the term.

**angles-around-point.** "Four angles at one vertex measuring 90°, 100°, 80° and 90° go once around," against Acute angle, Angles around a point, Angle bisector and Angle Addition Postulate. Only one distractor is alive: the Angle Addition Postulate also adds angle measures at a shared vertex, and that is the confusion worth having. The other two are dead on arrival. The explanation — "Always look for the straight line first, it halves the arithmetic" — is a solving tip for a computation this question never asks, says nothing about why the answer is not the Angle Addition Postulate, and is the weakest note in the batch.

**straight.** The one figure-bearing item sampled: a horizontal line EF through X with a second, clearly slanted line CD crossing there, ∠EXF marked 180°, and a caption saying E and F are opposite ends of a line through X. The figure is doing real work — the crossing line makes a straight angle look like a pair of angles, and because CD is oblique rather than square, "Perpendicular" is a live trap for a glance rather than a look. The explanation, "A straight angle is a genuine 180° angle, not a non-angle," hits the deeper misconception but leaves the perpendicular trap unaddressed.

**vertical-angles-theorem** and **congruent-supplements** are the best pair in the whole batch. They share the same four options — Congruent Supplements, Right Angle Congruence, Congruent Complements, Vertical Angles — with different answers, so neither can be passed by recognising the shape of the option list. Both explanations give the actual argument rather than a restatement: subtracting a shared supplement leaves the remainders equal, which also explains precisely why the two items feel alike. The only caution is scheduling — if the generator can place them adjacently, the second becomes an elimination exercise.

**distributive.** From 3(x − 4) = 18 conclude 3x − 12 = 18, against Transitive, Reflexive, Distributive and Multiplication Property of Equality. One live distractor again, and a good one, since the student did multiply. The explanation describes what distribution does inside a proof step but never draws the line between distributing over parentheses and multiplying both sides — the one sentence this item needed.

### kind "term-to-example"

The term is given and the student picks the instance.

**congruent-complements** is excellent. The correct option — "∠1 and ∠2 are each complements of ∠3, so the two must have equal measure" — sits beside a near-identical sentence with "supplements" in place of "complements". The explanation names that trap directly: identical reasoning, 90° instead of 180°.

**segment-bisector** has a strong option set, including the sharpest available near-miss: "AB = 22, and the point on AB that makes both halves 11," which is a midpoint, not a bisector. Then the explanation talks about perpendicular bisectors, which appear nowhere among the options. It is a true and useful sentence about the concept dropped in regardless of what was asked, and it leaves the midpoint-versus-bisector distinction — the actual error on offer — unexplained.

**addition-property** sets four different properties of equality against each other, with "From AB = 5 and AB + BC = 12 conclude 5 + BC = 12" as the trap, since it shows an addition sign while performing a substitution. The explanation is correct and general but never disarms that option.

**collinear** is the one item I would pull. Two of the four options are bare angle measures ("m∠B = 115°", "m∠A = 35°") and a third is about proof formats; the correct option is the only one that mentions points or lines at all, so it is answerable without knowing the word. It is also barely an example — "Any two points always lie on one line; three is the first interesting case" is a remark about the concept rather than an instance of it — and the explanation simply repeats that remark.

**segment-addition** draws its options from the same segment-fact pool as segment-bisector, rearranged, which is fine in isolation and bad if the two land close together. Its explanation is the most substantial in the batch: the parts make the whole, the usual real-world disguise where the postulate runs backwards as a subtraction, and the warning that collinearity alone is not enough because B must lie on AC.

### kind "def-to-term"

A definition is quoted and the student names it. This is the weakest kind, and for one consistent reason: the distractors come from the right neighbourhood but are not filtered by what sort of thing the definition describes.

**linear-pair** quotes "Two adjacent angles whose outer sides form a straight line" against Angle bisector, Acute angle, Perpendicular and Linear pair. The definition plainly concerns two angles; Acute angle is one angle and Angle bisector is a ray, so both are eliminable without geometry.

**angle-bisector** quotes "A ray that splits an angle into two congruent angles" against Acute angle, Supplementary angles and Obtuse angle — none of which is a ray.

**perpendicular** and **vertical-angles** have the same shape: one semi-live neighbour (Linear pair in each case) and two size classifications that cannot match a two-object relation.

**segment-addition** is the exception and is well built — three of its four options are segment concepts, and its explanation's insistence on betweenness lands precisely because betweenness is what the quoted definition contains.

Notable pattern in the explanations: vertical-angles closes with "Adjacent is about touching; vertical is about facing," which is a genuinely good sentence aimed at a confusion this item does not set up, since "adjacent angles" is not among the options. Same failure mode as segment-bisector — a strong concept note standing in for a targeted rebuttal.

The fix is cheap and mechanical: prefer distractors whose own definitions share the answer's subject type — one angle against one angle, a pair against a pair, a ray against a ray. That single change would lift this kind more than any rewording.

### kind "term-to-def"

The term is given and the student picks its statement. This kind is the most consistently well-formed, because the option pool is naturally type-matched.

**acute** offers three angle-measure ranges (exactly 180°, more than 90° and less than 180°, more than 0° and less than 90°) plus one linear-pair definition, so the student has to read inequalities rather than spot a category. The explanation goes straight at the boundary the ranges create: a 90° angle is right, not acute.

**division-property** is the cleanest item in the batch — subtraction, multiplication, division with the c ≠ 0 rider, and reflexivity, all four genuine properties of equality. The explanation is sound though slightly generic; flagging the nonzero condition would have used the item fully.

**inductive** and **syllogism** mirror each other across a shared option set the way the two theorem items do, and the deductive-reasoning option is the exact confusion for inductive. Both explanations are targeted: a conjecture is not a guarantee and one counterexample ends it; the Law of Syllogism is the transitive move one level up and fails when the middle terms do not match.

**obtuse** is the weak one here. Against "total 180°", "total 90°" and a bisector definition, the correct range is the only option describing a single angle's size, so it wins without reading. The explanation warns that a straight angle exceeds 90° without being obtuse, which is sharp — but no option tests it.

### The skipped direction, and what it costs

The generator declines to build a definition-direction question when the definition restates its term, on the sound grounds that such an item tests reading rather than knowing. That is the right call, and it removes a class of free points.

The consequence is uneven coverage rather than a gap in quality. The terms that get dropped from that direction are the transparent compounds — congruent segments, right angle, straight angle, segment bisector — which are exactly the terms students confuse with their neighbours in practice (midpoint against segment bisector against perpendicular bisector). Those concepts now meet the student only through example-to-term and term-to-example, the two kinds where distractor quality varies most, and segment-bisector above is a live illustration of the risk.

It is also worth noting that the rule evidently keys on wording rather than transparency: angle-bisector survives as a def-to-term item on "A ray that splits an angle into two congruent angles," which no student needs to know a definition to answer once the option set contains no other ray. Transparency leaks through the option set, not only through the definition text, and the skip rule cannot see that. The type-matching fix above closes both leaks at once.

## Repetition across a long sitting

The risk is real for Naming and mild for Definitions, and it is a scheduling problem rather than a content problem.

Naming has 412 items over roughly a dozen figures. The crossing-lines picture alone supports four label items, four points items, and choose and click items on top of that. With the score counter running in the corner and no figure cooldown, a student on a twenty-question run will meet the same drawing repeatedly.

The mitigation is already half-built, because four different forms exist. Seeing crossing-lines asked as "which marked angle is ∠BXC", then as "∠4 is marked, click the three points", then as "which name belongs to the highlighted angle" is not repetition — it is the useful lesson that one picture holds many facts. What wears thin is the same figure in the same form, and the near-clone pairs like linearPair and linearPairCaseB where only the degree measures move. A per-figure cooldown, plus a rule against repeating a form on a figure until the other forms have been used, would take most of the sting out without adding a single new drawing.

Definitions is bounded differently: 39 concepts across four kinds caps the bank at roughly 156 items, and the mirrored pairs (inductive/syllogism, vertical-angles-theorem/congruent-supplements, segment-bisector/segment-addition) share option sets by design. Those pairs are an asset when separated and a giveaway when adjacent, so the one scheduling rule that matters here is to keep items sharing an option pool apart. The correct-answer position is evenly distributed across all four slots, verified over 400 seeds, so the other common shortcut is already closed.

# Practice ▸ Diagram ↔ equation

## Sub-tab: Figure → equation

### between-sum

The prompt states that B lies on AC and asks the student to write the equation the figure gives. The figure is a single horizontal segment from A(-150,0) to C(150,0) with B at (-24,0) — noticeably left of centre, so the two parts are visibly unequal (roughly 126 and 174 units). Nothing else is drawn: no ticks, no arcs, just three open circles on one line, with ∠ABC = 180° confirming collinearity.

The answer is built in the toolbar: AB into the left slot, the + operator, BC, then the = form, then AC on the right. Only one form is accepted, and that is the right call here — AB + BC = AC is the Segment Addition Postulate verbatim.

What the item really tests is whether a student can tell the whole from the parts when nothing is labelled with a number. The likely first attempt is AB = BC, imported from the far more common midpoint figure; B being drawn off-centre is the only defence against that, and it is a good one. A student who reaches for AC + AB = BC has mistaken which point is in the middle, and the deliberately asymmetric placement of B makes that error visible rather than plausible.

The "why" text — parts sum to the whole — is one sentence and does all the work it needs to.

### midpoint-halves

The prompt tells the student outright that the tick marks say M is the midpoint of AB, then asks for the equation. The figure is the same horizontal segment, A(-150,0) to B(150,0), but with M exactly at the origin and a single tick drawn on each half declaring AM ≅ MB.

Four forms are accepted: AM = MB, AM ≅ MB, AM = AB/2, MB = AB/2. This is the most generous acceptance set in the batch and it is appropriate, because "midpoint" genuinely licenses both the equal-halves reading and the half-the-whole reading. The concern is discoverability in the other direction. The observed toolbar offers a form selector reading EQUATION / = and a digit pad with operators; the two divided forms need a division operator and the halves form needs ≅. A student who reaches for AM ≅ MB and cannot find a congruence symbol in this particular builder will fall back to AM = MB, which is accepted, so no harm results — but the accepted list is advertising flexibility the toolbar may not visibly offer.

The likely wrong attempt is AM + MB = AB, which is true, is exactly what the previous item asked for, and is not accepted. That is the one real risk in this item: a correct statement about the figure, rejected. Given the two items sit adjacent in the same sub-tab, accepting it seems worth considering.

### linear-pair-180

Ray BD stands on line AC, and the student writes the equation this gives. The figure shows a horizontal segment A(-160,0) to C(160,0) with B at the origin, and a segment from B up to D(63,-136), leaning right of vertical. The printed measures are ∠DBA = 115° and ∠DBC = 65°; ∠ABC = 180° is what makes it a line rather than a bent path.

The answer is m∠ABD + m∠DBC = 180, built from the two m∠ tokens, the + operator, and 1-8-0 on the digit pad. Only that form is accepted.

The first thing a student notices is the printed 115 and 65, and the likely wrong attempt follows directly: entering 115 + 65 = 180. That is arithmetic about this drawing, not the general statement the figure licenses, and the rejection is pedagogically right even though it will feel unfair in the moment. It would be worth the app saying so explicitly in the feedback.

A second plausible miss is writing the angles in the other order, m∠DBC + m∠ABD = 180, or naming the first angle m∠DBA to match the printed label. Whether either is accepted is not stated, and it should be — the figure itself prints ∠DBA, so a student copying what they see builds the unlisted spelling.

### complementary-90

The square marks ∠AVC as a right angle; write the equation for its two parts. The figure has V at (0,80), A directly above at (0,-70), and C at (150,80) level with V, so the right angle opens up-and-right from V with a small square drawn in the corner. D sits at (86,-43), splitting it into ∠AVD = 35° and ∠DVC = 55°.

The accepted answer is m∠AVD + m∠DVC = 90. The interesting design choice is that the prompt never names D. The student has to look at the figure, find the interior ray, and read its endpoint label off the drawing before they can even start building. The clickable figure helps here — clicking A, V, D produces the m∠AVD token directly — and this is the item where that affordance earns its place.

The likely wrong attempt is 35 + 55 = 90, again reading the printed numerals instead of the relationship. A subtler one is m∠AVC = 90, which is true, is what the square asserts, and is not what was asked; the prompt's phrase "for its two parts" is the only thing steering away from it, and it is easy to skim past.

Only one form is accepted, which is defensible — there is no equivalent phrasing that says the same thing.

### three-on-line

Three angles sit consecutively above line PQ. The figure is a clean symmetric fan: P(-170,0) and Q(170,0) with V at the origin, and rays up to R(-75,-130) and S(75,-130). All three angles measure 60°, and the drawing shows that — the three wedges are visibly identical.

The accepted answer is m∠PVR + m∠RVS + m∠SVQ = 180, a three-term sum. This is the most toolbar-intensive item in the sub-tab: three m∠ tokens, two + operators, and 180. Building it by clicking the figure (P-V-R, then R-V-S, then S-V-Q) is far less error-prone than assembling tokens by name, and a student who has not discovered the click-to-name affordance will find this tedious.

The trap is the symmetry. Three equal-looking 60° angles invite m∠PVR = m∠RVS = m∠SVQ, or the arithmetic 60 + 60 + 60 = 180. Neither is accepted, and the first isn't even asserted by the figure — no arcs mark those angles congruent. That makes this a quietly good marks-versus-appearance item hiding inside an addition item, though nothing in the "why" text points that out. The "why" instead offers a strategy note about looking for the straight line first, which is useful but answers a question this item didn't ask.

### vertical-equal

Two lines cross at X and the student writes what the figure says about ∠1 and ∠3. The figure draws AB from (-140,-34) to (140,34) and CD from (-120,78) to (120,-78), crossing at the origin, with the four regions numbered: ∠1 on top (∠AXD, 133°), ∠2 on the left (47°), ∠3 on the bottom (∠BXC, 133°), ∠4 on the right (47°). No arcs — the numerals and the crossed segments are all there is.

Three forms are accepted: ∠1 ≅ ∠3, m∠1 = m∠3, and the prose form "∠1 and ∠3 are vertical angles". That last one is the problem. The Figure → equation toolbar as observed has a form selector reading EQUATION / = and side slots; the relationship vocabulary (vertical angles, linear pair, supplementary) lives in the Build a proof builder, not here. If a student cannot build the prose form, accepting it is harmless but meaningless. If they can, the toolbar description doesn't show it.

The item is really testing whether the student sees "opposite across the vertex" rather than "adjacent and big". The likely wrong attempt is m∠1 + m∠2 = 180 — true, salient, and about the wrong pair.

### arcs-equal

Matching arcs mark two of the angles; write the equation. V sits at the bottom (0,60) with four rays fanning upward to W(-132,-10), X(-56,-79), Y(56,-79) and Z(132,-10). The arcs mark ∠WVX ≅ ∠YVZ. The measures are 40°, 44°, 40° left to right.

That 44 in the middle is the whole design. Forty and forty-four are indistinguishable by eye at this scale, so the student genuinely cannot pick the congruent pair by looking — they must read the arcs. This is the best-constructed figure in the sub-tab.

Accepted: m∠WVX = m∠YVZ or ∠WVX ≅ ∠YVZ. Both forms of the same claim, which is right.

The likely wrong attempt is picking an adjacent pair — m∠WVX = m∠XVY — because adjacency feels like the natural relationship in a fan, and the middle angle looks the same size. A student who does this and gets rejected has learned exactly the lesson the figure was built to teach. The second likely attempt is a sum: m∠WVX + m∠XVY = m∠WVY, which is true and is the next item's answer, not this one's. Two adjacent items sharing a figure with different accepted answers is a small usability hazard worth noting.

### whole-from-parts

Same figure as arcs-equal — the four-ray fan from V with arcs on the outer two angles — but the prompt names the three angles explicitly and asks for the Angle Addition equation relating ∠WVX, ∠XVY and ∠WVY.

The accepted answer is m∠WVX + m∠XVY = m∠WVY. Naming all three parts in the prompt makes this substantially easier than between-sum, where the student had to work out which was the whole. Here the only real decision is which of the three goes on the right, and the letter pattern gives it away: WVY spans from the first letter to the last.

What the item tests is recognising that angle addition works exactly like segment addition — interior ray plays the role of between point. The "why" text says this in one line and names the interiority condition, which is the right thing to emphasise.

The likely wrong attempt is putting the whole on the left, m∠WVY = m∠WVX + m∠XVY, which is mathematically identical and is not in the accepted list. Given that the toolbar has an explicit "left side" and "right side" slot, students will absolutely build it that way, and a symmetric-equation check would cost little. This is the clearest case in the batch of a correct-but-unaccepted form.

The arcs are present but irrelevant here, which is fine — real figures carry marks you don't need.

### three-concurrent

Three lines pass through V, so ∠RVS has a twin on the far side; the student writes what the figure says about ∠RVS and ∠UVT. The figure is dense: a horizontal line P(-155,0) to Q(155,0), a line R(-75,-130) to T(75,130), and a line S(126,-82) to U(-126,82), all through the origin. The figure labels three angles X, Z and Y above the line, and declares ∠RVS = 87° and ∠SVQ = 33°; ∠PVR is 60°, so the three declared-and-derivable angles fill the straight 180°.

Accepted: the prose "are vertical angles", ∠RVS ≅ ∠UVT, or m∠RVS = m∠UVT.

There is a naming friction here worth flagging. The figure labels the target angle Z, not ∠RVS, and its twin ∠UVT carries no label at all. The student must translate the prompt's three-letter names back onto a crowded figure with six rays, then find an unlabelled region on the opposite side. Clicking the figure to build the token is the only sane route, and it depends on the student hitting the right three points in a figure this busy.

The likely wrong attempt is pairing ∠RVS with ∠TVS (93°) or reading the twin as ∠TVU. Since ∠UVT and ∠TVU are the same angle, whether the checker accepts both orders matters and isn't stated. The "why" text is the strongest in the sub-tab: it names the opposite rays explicitly rather than just asserting the conclusion.

### marked-only

"Only the marks count. Write one congruence this figure actually asserts." The figure is a rectangle — A(-150,-60) and B(150,-60) along the top, D(-150,70) and C(150,70) along the bottom, with all four corners at 90° — plus a near-vertical segment EF from E(15,-60) on the top edge to F(-15,70) on the bottom edge, leaning slightly left as it descends. Double ticks mark AD ≅ BC (the two vertical sides, 130 each); single ticks mark EB ≅ DF (135 each). EF is unmarked and is about 133 units long.

That is the whole item, and it is very well built. EF is within three units of BC and within two of EB. On screen it is indistinguishable from both, and it carries no tick, so nothing relates it to anything. Any of four forms is accepted — AD ≅ BC, EB ≅ DF, or either as an equation — so the student only needs to produce one true marked congruence.

The likely wrong attempt is exactly the one the figure baits: EF ≅ BC. A student who builds it and is told no has met the central rule of the reference head-on. The "why" text states it plainly and names EF as the unmarked one.

The generous acceptance is right here — the item is about recognising marks, not about picking a particular pair.

### supplements-of-congruent

Two separate vertices side by side. On the left, line A(-290,40) to B(-40,40) with V at (-165,40) and a ray up to C(-106,-87); on the right, line D(40,40) to E(290,40) with W at (165,40) and a ray up to G(224,-87). Angles are numbered 1 and 3 at the left vertex, 2 and 4 at the right. Arcs mark ∠3 ≅ ∠4. Measures are 115° and 65° at each vertex.

The student is asked what the figure says about ∠1 and ∠3, and three forms are accepted: supplementary, m∠1 + m∠3 = 180, or "form a linear pair".

This is the weakest item in the sub-tab. The prompt's opening clause — "the arcs mark ∠3 ≅ ∠4" — is entirely irrelevant to the question asked. ∠1 and ∠3 are simply a linear pair at one vertex; the right-hand figure and the congruence arcs contribute nothing. The item's id and title promise the Congruent Supplements setup, and then the interesting conclusion (∠1 ≅ ∠2) is never asked for.

A student will notice this. The likely wrong attempt is answering about ∠1 and ∠2 — the pair the arcs and the two-vertex layout are clearly pointing at. Rejecting that answer punishes the student for reading the setup properly. Either ask the intended question or drop the arcs.

### cc-step1

The square marks ∠AVC as a right angle; write the equation it gives for ∠1 and ∠2. The figure has V at the origin with four rays: A right at (165,0), B up-right at (83,-143), C straight up at (0,-165), and D up-left at (-143,-82). Squares mark ∠CVA and ∠DVB. The numerals are 1 = ∠BVA (60°), 2 = ∠CVB (30°), 3 = ∠DVC (60°).

The answer is m∠1 + m∠2 = 90, built from the two numbered-angle tokens and the digit pad. Only that form is accepted.

Because the angles are numbered, this is easier to build than the three-letter items: no figure-clicking needed, assuming the toolbar exposes m∠1 and m∠2 tokens. The prompt does the translation work — it tells the student which square and which two angles.

The likely wrong attempt is 60 + 30 = 90, the printed-numeral reflex that recurs throughout this sub-tab. A second one is m∠AVC = 90, restating the mark instead of decomposing it.

The item's real function is as step one of a proof rather than as a standalone question, and the "why" text says so explicitly. That framing is good: it tells the student the answer is a line in an argument, not an end in itself.

### cc-step2

Identical figure, and the parallel question: the other square marks ∠BVD, so write the equation for ∠2 and ∠3. The answer is m∠2 + m∠3 = 90.

Repeating the figure and the structure is deliberate and correct — the whole force of the Congruent Complements argument is that two different pairs produce the same total, and seeing the same drawing twice with the attention moved to a different square is how that lands. The "why" text closes with the observation that now two different sums both equal 90, which sets up the transitive step.

The risk is that the second item is mechanical. A student who solved cc-step1 can produce this one by swapping token 1 for token 3 without looking at the figure at all, and will probably do exactly that. Whether that is a flaw depends on the intent: if the goal is fluency and rhythm, repetition is fine; if the goal is a second act of reading the figure, it fails, because the prompt already names the square and both angles.

One small thing the figure does carry that the prompt does not exploit: ∠2 is 30° and sits between the two squares, so it is visibly the shared piece. Naming that in the prompt would make the subtraction in cc-step5 less of a surprise.

### cc-step5

The prompt hands the student the reasoning — both sums equal 90, subtracting the shared ∠2 leaves m∠1 = m∠3 — and asks for the conclusion about ∠1 and ∠3 written as a congruence. Same figure as the two previous items, with 1 and 3 both measuring 60°.

Accepted: ∠1 ≅ ∠3 or m∠1 = m∠3.

This is not really a reasoning item; the prompt performs the reasoning and the student transcribes the last line. What it tests is the notation step — that equal measures are written as a congruence between the angles themselves, with no m∠ prefixes on either side. That is a genuine and commonly muddled distinction, and it deserves an item.

But accepting m∠1 = m∠3 undercuts it. The prompt explicitly says "as a congruence", and the previous sentence has already given the student m∠1 = m∠3 to copy. The path of least resistance is to rebuild the sentence they were just handed, which is accepted, and the notational point is never encountered. If the item is about writing a congruence, the measure form should be rejected with a nudge rather than accepted silently.

A further wrinkle: the figure prints 60° for both ∠1 and ∠3, so the conclusion is visible before any reasoning happens.

### double-part

"Suppose m∠AVC is twice m∠AVD. Write that as an equation." The figure is the angle bisector one reused: V at (0,70) with rays down to A(-92,-48), D(0,-80) and C(92,-48), arcs marking ∠AVD ≅ ∠DVC, measures 38°, 38°, and 76° for the whole.

The accepted answer is m∠AVC = 2 m∠AVD, requiring the digit 2 and an implicit or explicit multiplication against an m∠ token.

The word "suppose" is doing something odd. It frames the relationship as hypothetical, but the figure already satisfies it exactly — 76 is twice 38 — so a student who checks the numbers finds the supposition redundant. That is probably fine as scaffolding (it lets them verify their translation), but the framing suggests a condition being imposed on a figure that doesn't yet meet it, and that isn't the case.

What is really tested is word-to-symbol translation: "A is twice B" becomes A = 2B, not 2A = B. The classic wrong attempt is exactly that inversion, and the figure protects against it since a student who substitutes 76 and 38 sees immediately which side needs the 2.

Only one form is accepted. m∠AVD = m∠AVC / 2 and 2 m∠AVD = m∠AVC are both correct restatements a student might build, and both would be rejected. The second especially — it is the same equation with the sides swapped.

## Sub-tab: Description → figure

Each task lists one or more conditions that must **all** hold before it is counted correct, and some add conditions that must all stay false. The checklist on the right shows them as separate rows, ticking each as it is satisfied.

### make-midpoint

The student drags B along until it is the midpoint of AC. The checklist on the right shows the measured lengths live — the observed example format is AC 6.00, AB 2.52, BC 3.48 — with a checkbox for "B is the midpoint of AC" that ticks itself once the tolerance is met.

This is the item where the live checklist question is sharpest, and the honest answer is that it does turn into nudge-until-it-ticks. AB and BC are printed to two decimals and update continuously; the student can close the gap by watching two numbers converge without ever forming the thought "the midpoint is the point where the halves are equal". The reasoning has been replaced by a servo loop.

That said, the loop is not worthless. Converging AB and BC toward each other is a physical enactment of "equal halves", and the numbers make what equality means concrete. What is missing is any moment where the student must predict before moving.

The "why" text is careful and good: it notes that dragging is checked to a tolerance while on paper the halves are exactly equal. That distinction — approximate construction versus exact definition — is the thing a dragging interface most risks blurring, and the app says it out loud.

### make-bisector

Drag D until ray VD bisects ∠AVC. Both conditions must hold together: m∠AVD = m∠DVC, **and** D must lie in the interior of ∠AVC. That second requirement is doing real work — a student who drags D outside the angle can make two measures equal in the reflex sense and will still be told no, which is a conceptual catch rather than a numeric one.

Beyond that the task is a reasonable angular analogue of make-midpoint, with the same live-checklist caveat: two angle measures converging on screen, and a student can close the gap by watching the numbers rather than by thinking about what bisection means. The "why" text states both halves of the definition — congruent angles *and* lying inside — which matches what the checker enforces.

### make-right

Drag D until ∠ABD is a right angle. The single condition is that ∠ABD measures 90°.

This is the thinnest task in the sub-tab. There is one number on the checklist, and the student moves D until it reads 90. No relationship between quantities, no competing constraint, nothing to reason about — the definition is "exactly 90°" and the display says the current value. It is pure nudge-until-it-ticks, and the one-line "why" ("a right angle measures exactly 90°") confirms there was nothing more intended.

It may still earn its place as the first drag task a student meets, teaching the interaction itself before the tasks get harder. If so, it should come first and be framed that way.

One thing it could test and doesn't: whether the student recognises that a right angle can point in any direction. If the figure starts with BA horizontal, D will end up vertical and the student learns the visual template rather than the measure. Starting from a tilted BA would make the same drag require actual attention to the number rather than to the picture, at no cost to the task.

### make-complementary

∠AVC is stated to be a right angle, and the student drags D until m∠AVD measures 30°, with D required to stay in the interior.

Mechanically this is make-right with a different target number, and the checklist makes it a one-number chase. But the framing carries the idea: the "why" text points out that once ∠AVD is 30°, the other part *must* be 60°, because the two parts of a right angle are complementary.

That is the interesting thing here and the interface half-surfaces it. If the checklist shows both m∠AVD and m∠DVC updating together, the student watches 30/60 emerge as a consequence of a single drag and sees complementarity as a constraint rather than a vocabulary word. If it shows only the goal angle, the lesson lives entirely in the after-the-fact explanation and the drag teaches nothing.

The likely first attempt is dragging toward what looks like a third of the right angle by eye and landing near 30 without checking — harmless, and the number corrects it.

What would sharpen this item is asking for the complement instead: drag until ∠DVC is 60°, with the checklist showing ∠AVD. Then the student has to subtract before they drag, and the reasoning precedes the motion.

### make-double

Drag D until m∠AVD is twice m∠DVC, with D in the interior.

This is the best of the angle drags, because the target is a ratio rather than a number. The checklist shows two measures, and there is no single value to chase — the student has to hold a relationship between them while moving. Nudging still works, but nudging toward "this one should be about double that one" is a meaningfully different mental act from nudging toward "this should read 30".

The likely first attempt is dragging D to roughly the two-thirds position by eye, which is actually correct reasoning, and then refining. A student who has done the double-part equation item earlier in the session may compute: if the whole is fixed, the parts are two-thirds and one-third of it.

The classic error — making m∠DVC twice m∠AVD — is caught immediately by the checklist, which is exactly the right use of live feedback: it catches an inversion the student can then recognise as an inversion, rather than doing the work for them.

The "why" text names the method: translate "twice" into a coefficient, then read the figure back to check. That is a real strategy, stated plainly.

### supp-not-linear

∠1 sits on line AB and ∠2 on line DE; drag G until ∠1 and ∠2 are supplementary while staying a pair that is *not* a linear pair. This is the only item in the sub-tab with a must-stay-false condition.

It is also the best item in the sub-tab, and the "why" text explains why in a way that borders on a joke at the student's expense: the two angles are at separate vertices and never touch, so no amount of dragging could ever make them a linear pair. The must-stay-false condition is unfalsifiable by construction. The student spends the task trying to avoid something that was never possible, and the lesson — supplementary does not imply linear pair — arrives through the impossibility rather than through a rule.

The risk is that a student never notices the joke. If they simply drag G until the sum reads 180 and the box ticks, the second condition is invisible and the item collapses into another number chase. It depends entirely on whether the checklist shows the "not a linear pair" condition as a permanently-satisfied row. If it does, and the student sees it green from the start and wonders why, the item works beautifully. If that condition is only evaluated at Check time, most students will miss it.

Either way, this is the one drag task that is genuinely about a definition rather than about a measurement.

### double-part-segment

Drag B until AB is twice BC, with B required to stay between A and C.

The segment analogue of make-double, and the same virtue applies: a ratio target rather than a value target means the student holds two numbers in relation. The live checklist — three lengths, AC, AB, BC — is exactly the display shown in the presentation notes, so this is likely the canonical example of the sub-tab.

What lifts it slightly above make-double is the "why" text, which converts the ratio into a position: with AB twice BC, B sits two thirds of the way along AC. That is an actionable prediction a student can make *before* dragging, and it is the only place in the sub-tab where the explanation gives a method that pre-empts the nudging. A student who reads it will place B near the two-thirds mark on the first move. A student who doesn't will watch AB and BC until one is about double the other.

The likely wrong first attempt is dragging past the midpoint but not far enough — the eye badly underestimates the two-thirds point — and the checklist corrects that immediately.

The betweenness condition matters here: B dragged beyond C could satisfy a length ratio while sitting outside the segment, so the second condition is doing real work.

### not-between

Drag C so that A, B and C stay collinear but B is no longer between A and C. Collinearity must become true; betweenness must stay false.

This is the conceptual high point of the batch. It is not a measurement task at all — it is a counterexample construction, and the "why" text names it as the reference's Fig. 3 counterexample and states the logic explicitly: honour the hypothesis, break the conclusion. That is the shape of every counterexample argument a student will ever be asked to produce, enacted with a mouse.

The student's first instinct is almost certainly to drag C off the line, because "no longer between" reads as "move it away". The collinearity condition then refuses to tick, and the student has to work out that C must slide *along* the line, past B, to the other side of A. That moment — realising the escape is along the constraint, not away from it — is the item.

The live checklist here helps rather than hurts, because the two conditions pull against each other. There is no single number to converge on; dragging C off the line satisfies one and breaks the other, and the student can see both states at once. This is what the drag interface should be used for throughout the sub-tab, and mostly isn't.

## Sub-tab: What is true?

### fa12-marks

Five claims about the marked-segments figure: the rectangle A(-150,-60), B(150,-60), D(-150,70), C(150,70) with the slanted segment EF running from E(15,-60) on the top edge down to F(-15,70) on the bottom. Double ticks mark AD ≅ BC; single ticks mark EB ≅ DF. Two claims are true (AD ≅ BC, EB ≅ DF) and three are false. The provenance tag reads Form A, Q12 · Fig. 18.

The trap is BC ≅ EF, with EB ≅ EF running a close second. BC is 130 units; EF is about 133; EB is 135. On screen these three segments are visually identical in length, and EF sits right between the other two. A student who ticks BC ≅ EF is not being careless — they are measuring by eye and getting the right answer to the wrong question. The figure was built so that looking gives a plausible result and only the ticks give the correct one.

AE ≅ EF is the weak distractor: 165 against 133, different enough to reject by inspection, so a student can eliminate it without invoking the rule at all.

The "why" text is precise — one tick matches one, two match two, and EF carries none — and the closing clause "however the drawing looks" is the sentence the whole sub-tab exists to deliver.

### crossing-truths

Five claims about the crossing lines AB and CD meeting at X, with the four regions numbered: ∠1 on top (133°), ∠2 on the left (47°), ∠3 on the bottom (133°), ∠4 on the right (47°). Three claims are true: ∠1 and ∠3 are vertical, ∠1 and ∠2 form a linear pair, ∠2 and ∠3 form a linear pair.

The trap is "∠1 and ∠3 are adjacent angles". Students hear "adjacent" as "next to each other" or "related", and vertical angles do touch — they share the vertex X. The technical requirement is a shared *side*, which ∠1 and ∠3 do not have. This is a vocabulary trap rather than a marks trap, and it is a fair one: the distinction between sharing a vertex and sharing a side is exactly what separates vertical from adjacent.

The second distractor, "∠1 and ∠2 are vertical angles", catches students who treat "vertical angles" as a label for any pair produced by crossing lines rather than for the opposite pair specifically.

One tension with the sub-tab's stated rule: nothing here is marked. There are no arcs, only numerals. The student must take the two drawn segments as asserting that A, X, B are collinear — which is legitimate, since a segment drawn through a point does assert collinearity, but it is a different kind of given from a tick mark, and the app never distinguishes the two.

### midpoint-truths

Four claims about the midpoint figure — the horizontal segment A(-150,0) to B(150,0) with M at the origin and a tick on each half. Three are true: AM ≅ MB, M is the midpoint of AB, M is between A and B. One is false.

The trap is AM ≅ AB, and it is a different species from the others in this sub-tab. It is not a looks-versus-marks confusion at all; it is a part-versus-whole confusion. A student ticks it because AM and AB share the letter A and both have a tick somewhere in the neighbourhood, or because they have not separated "half" from "whole" in the notation. The "why" text answers it with a flat sentence — a half is never congruent to the whole — which is the right response but a slightly deflating one, since the claim isn't tempting so much as careless.

The more interesting hesitation is on "M is between A and B". A student who has internalised the sub-tab's rule may refuse to tick it on the grounds that betweenness isn't marked — no arc, no numeral, nothing. The app's position, stated in the "why" for the perpendicular item, is that a point drawn on a segment *is* a given fact. That is correct and important, but this item is where a rule-following student gets it wrong for the right reasons, and the "why" text here doesn't address it.

### perpendicular-truths

Four claims about a horizontal segment A(-160,0) to B(160,0) with P at the origin and PQ dropping to Q(0,-150), a square marking ∠APQ. Three true: ∠APQ is a right angle, ∠APQ and ∠QPB form a linear pair, P is between A and B. One false: AP ≅ PB.

This is the sharpest trap in the batch, and deliberately so. P is at the exact centre — AP and PB are both 160 units. They are not merely similar, as EF was to BC in fa12-marks; they are genuinely, measurably, pixel-for-pixel equal. A student who measures with a ruler gets the right answer. A student who reasons from the marks gets a different one, because no tick appears on either half.

That is a harder line to hold than the usual looks-can-deceive case, and it is the correct line. The figure is not lying; it just isn't *asserting*. The distinction between "happens to be true in this drawing" and "is given" is the whole of early proof, and this item isolates it perfectly.

The "why" text says it directly — a drawing is not evidence — and then does something valuable: it names what *is* given, the square and P's position on AB, so the student sees the rule cutting both ways rather than as blanket scepticism about the figure. That symmetry is what keeps the rule learnable.

# Practice ▸ Solve

## Sub-tab: One answer

### fa4-fraction

The prompt gives QR ≅ ST with QR = ⅔x inches and ST = 0.4 inches, and asks for x. The answer is 0.6 and the UNIT field is a dash — correctly, since x is a bare number even though the segments are in inches. This is one of the few items where the thing asked for *is* the thing you compute; the disguise is elsewhere.

The disguise is the mismatched number formats: a fractional coefficient on one side, a decimal on the other. Students trained on integer equations freeze at "⅔x = 0.4" because neither form looks like the other. The two hints attack exactly that, in order: the first supplies the setup (congruent means equal, so set the expressions equal), the second supplies the technique (multiply by 3/2). Together they leave only the arithmetic, which is generous — but the first hint is the genuinely conceptual one and a student who stops there still has work to do. The WHY closes with the right reassurance: decimals are ordinary coefficients.

There is no figure, and none is needed; two congruent segments named by endpoints carry no spatial information worth drawing.

The chain is short: QR = ST → ⅔x = 0.4 → x = 0.6. The common failure is direction of operation — multiplying by ⅔ instead of dividing, producing 0.2667. That number is worth declaring as a trap, since it is the single most likely wrong entry and the correction ("you undid nothing; multiply by the reciprocal") is short. Note too that ⅔ and 0.4 were chosen so the answer terminates, which the numeric keypad requires.

### fa5-midpoint

G lies on DE, DE = 22 m, GE = 6x − 4 m, and the question asks for what value of x makes DG ≅ GE. The answer is 2.5, unitless.

The disguise is a hidden definition: the word *midpoint* never appears. The student must read "DG ≅ GE with G on DE" and recognise that as the midpoint condition, then halve 22 before touching the algebra. That inference is the whole item. The two hints hand it over in sequence — the first names the midpoint outright, the second says each half is half of 22 and tells you to set the expression equal to it. After hint two there is nothing left but 6x = 15. These hints do not scaffold; they solve. A better first hint would ask what DG ≅ GE tells you about G rather than answering it.

There is no figure and no givens list. A simple segment with G marked between D and E would cost little and would make the "two halves" structure visible, which is the step students miss.

The chain: DG ≅ GE → G is the midpoint → each half is 11 → 6x − 4 = 11 → x = 2.5. The dominant error is skipping the halving and writing 6x − 4 = 22, giving x ≈ 4.33; the second is solving correctly and answering 11, the length rather than x. Both deserve declaring, 4.33 especially, because it is produced by a student who did everything except read "G lies on DE".

### fa7-linear-pair

∠ABD and ∠DBC form a linear pair, m∠ABD = 87°, find m∠DBC. Answer 93, in degrees. There is no disguise and no second step: this is a one-subtraction recall check, and it is the easiest item in the batch by a wide margin.

The single hint — "A linear pair is supplementary" — is the entire content of the question. A student who needs the hint did not know the definition; a student who knew the definition needed no hint. There is no middle position for it to scaffold. That is defensible for a definition check, but it means the hint link does no pedagogical work here.

The figure draws A(−180,0), B(0,0), C(180,0) on one line with D below and just left of B, so ∠DBA is visibly the acute-ish one and ∠DBC the obtuse one; the drawing is to scale. Crucially there is no `marks` line, so no numerals are printed on the figure at all — the 87° lives only in the prose, and the 93° in the measures list is internal bookkeeping, not a drawn label. That is the right call, since printing 93° would hand over the answer. But it leaves the figure carrying almost nothing the sentence did not already say. Its one real contribution is showing that A, B, C are collinear, which is what makes the pair linear.

Thought process: linear pair → supplementary → 180 − 87 = 93. The only wrong answer worth naming is 3, from a student who confuses supplementary with complementary. Worth declaring.

### fa9-building

A real-world wrapper over segment addition: the top of a three-storey building is 80.5 ft from the ground, the bottom of the second storey is 25.75 ft from the ground, and the question asks the distance between those two points. Answer 54.75, in feet.

The disguise is threefold. There is a story instead of a diagram; both numbers are decimals with different precision (one decimal place against two), which invites arithmetic slips; and "three-storey" is pure decoration, planted so that a student looking for a reason to divide by 3 finds one. The WHY says so explicitly, which is good practice — naming the decoy after the fact teaches students to expect decoys.

The hints are the strongest pair in the sub-tab. The first ("both measurements start from the same place, the ground") supplies the modelling insight without the operation. The second states the part-whole relation in words. A student can stop after hint one and still do real work. That is what scaffolding should look like.

There is no figure. Here the absence is a genuine loss: the situation is a vertical number line with 0 at the ground, 25.75 and 80.5 marked, and the unknown spanning between them. Drawing it would make this the clearest illustration of the Segment Addition Postulate in the batch. The prose is sufficient to picture it, but only for students who already translate word problems into diagrams — the ones who don't need the help.

The likely wrong answer is 106.25 from adding, and it deserves a declared trap; 26.83 (80.5 ÷ 3) is the payoff of the storey decoy and is worth a second.

### fa10-substitute-back

∠A and ∠B are supplementary, ∠A ≅ ∠C, m∠A = (16x − 7)°, m∠B = (21x + 2)°; find m∠C. Answer 73°.

This is the canonical "one step past the x you solved for", and it is executed well. Solving gives 37x − 5 = 180 and x = 5 — a clean small integer, which is exactly what makes stopping there feel like arriving. The declared trap is 5, and the reason a student produces it is mechanical rather than conceptual: every equation they have ever been set ended at "x = ", so the terminal state of the procedure is mistaken for the answer to the question. The correction note handles this correctly by not re-deriving x but pointing straight at the substitution.

There is a second layer the trap does not cover. Having remembered to substitute, a student must substitute into the *right* expression, and 21(5) + 2 = 107 is a live wrong answer — the student who substituted back but grabbed ∠B. Since 107 and 73 are supplements, this failure is invisible to a plausibility check. It is worth declaring.

The ∠A ≅ ∠C clause is a third misdirection: it adds a final trivial hop so the answer is never the expression you evaluated. Cheap, but it works.

The hints are two and the second is the good one — "Solve for x, then read the question again before answering" is a meta-hint about test behaviour rather than about angles, and it is the right advice for precisely the student about to submit 5. No figure; none is needed, as no configuration is implied beyond the two relations.

### fa11-three-lines

Three lines meet at V; m∠Y = 33°, m∠Z = 87°, find m∠X. Answer 60°.

The disguise is scale. "Three lines intersect" primes the 360°-around-a-point frame, and a student who commits to it spends twice as long chasing vertical angles. The shortcut is that X, Z and Y sit consecutively along one straight line PQ, so they share 180°. The single hint — "Always look for the straight line first" — is the whole trick, delivered in one line, which makes the hint all-or-nothing. A first hint asking which points in the figure are collinear would preserve some of the work.

Unlike fa7, this item cannot be read without the figure: ∠X, ∠Y and ∠Z are single-letter names that exist only as printed labels. The figure gives six rays from V, with the `marks` line declaring 87° on ∠RVS and 33° on ∠SVQ, so those two numerals are drawn. The third line (VT/VU) is drawn but never used — it is the visual bait that makes the 360° route look necessary, and the vertical copies it creates are real. Note the labels run X, Z, Y from P to Q, not in alphabetical order, so the unknown sits at one end rather than between the givens; that is mildly harder and probably deliberate. No givens are listed under the figure.

The chain is: spot PQ straight → 180 − 87 − 33 = 60. The wrong answer worth declaring is 240, from 360 − 87 − 33 by a student who took the bait and never noticed the straight line at all.

### fa12-marked

E lies on AB, single ticks mark EB ≅ DF, AB = 27.25 m, DF = 16.4 m; find AE. Answer 10.85 m.

The disguise is a congruence relay. The given number attaches to DF, a segment on the far side of the figure, and must be transferred to EB by the tick marks before subtraction is possible. Students who reach for "the two numbers in the problem" will subtract successfully by accident here, which slightly blunts the point.

The figure is the best-constructed one in the batch. A, B, C, D form a rectangle with E on AB and F on DC, and the coordinates are deliberately wrong: drawn, AE is longer than EB, while the true lengths are 10.85 against 16.4. A student who eyeballs which part is bigger gets the wrong picture of the situation, and the WHY says so plainly — "only the marks count". That is a lesson worth teaching and this is an honest way to teach it. The givens are also restated as text under the figure (AB = 27.25 m · DF = 16.4 m), duplicating the prompt exactly; harmless, but it adds nothing.

Hints are two and well ordered: the first points at the ticks, the second states Segment Addition backwards. Neither does the arithmetic.

Chain: ticks → EB = 16.4 → AE = 27.25 − 16.4 = 10.85. The wrong answer worth declaring is 16.4 itself, entered by a student who transfers the congruence and then forgets there is a subtraction left; 43.65 (adding) is a distant second.

### fa13a-straight

Lines CD and EF intersect at X with m∠CXE = ⅝ m∠FXE; find m∠EXD. Answer 67.5°.

The disguise is a straight angle wearing three-letter clothing. Because ∠FXE is written the same way as any other angle, students hunt for a value instead of recognising that E, X and F are opposite ends of one line and the angle is simply 180°. That recognition is the item. Once it lands, m∠CXE = ⅝(180) = 112.5° and the linear pair gives 67.5°. The fraction ⅝ is chosen so the result terminates — a real constraint, since the keypad is numeric-only and could not accept an exact fraction.

The figure shows only the two crossed lines with E, F, X, C, D labelled, and no numerals are printed (`∠EXF=180°` is internal). That is exactly right: the figure's whole job is to make the collinearity of E, X, F visible, and any printed measure would leak the answer. The drawing is to scale — ∠CXE really is 112.5° on screen — so a student who measures by eye can shortcut, though they still need the linear pair step. No givens are listed under the figure.

The hints scaffold properly. The first asks a question rather than answering one ("What kind of angle is ∠FXE, given that E and F are ends of one line?"); the second covers the final hop. Good ordering.

The obvious stopping point is 112.5, the number you just produced, and it should be declared as a trap — with the extra hazard noted below, since 112.5 is the correct answer to fa13b.

### fa13b-vertical

Same stem, same figure, but the question asks for m∠DXF. Answer 112.5°.

Structurally this asks the student to reach the same intermediate (m∠CXE = 112.5°) and then apply vertical angles rather than a linear pair. The disguise is identical to fa13a's — the straight angle in three-letter form — but the final hop is a copy rather than a subtraction, which makes this the *easier* of the two despite the larger number.

The single hint is the item's weakness: "∠DXF sits opposite ∠CXE across the crossing" scaffolds the trivial last step while assuming the student already has m∠CXE. That is backwards. The hard part here is recognising ∠FXE as straight, and the hint offers nothing on it, so a genuinely stuck student gets help they cannot use. fa13a's hints do this the right way round; fa13b should inherit fa13a's first hint before its own.

The pairing is worth flagging beyond that. The two items share a stem, a figure and an entire solution path, and their answers are each other's most likely wrong entry: 67.5 and 112.5. If both appear in one session, the second is nearly free — the student already holds both numbers and only has to decide which the wording wants. If they appear separately, a student who failed fa13a by answering 112.5 will "succeed" at fa13b using the identical mistaken reasoning. At minimum, fa13b should declare 67.5 as a trap. Better would be to treat these as a matched pair presented together, which is effectively what the two-part item fa13 does.

## Sub-tab: Two parts

### fa12

Stem: line EF crosses AB and DC, AB = DC. Givens under the figure: AB = 27.25 m · DF = 16.4 m. Part A is select-all claims; Part B is numeric, asking AE in metres (10.85).

This split genuinely teaches the two-stage structure, and it is the best of the three. Part A forces the student to read the marks before any arithmetic exists to hide behind, and Part B then consumes Part A's finding directly: EB ≅ DF is the true claim, and EB = 16.4 is precisely what Part B needs. The dependency is real, not cosmetic.

The claim set is carefully built. The two true claims come from the two tick pairs; all three false claims involve EF, which carries no ticks at all, so the lesson is "no mark, no conclusion". And the coordinates make those false claims visually tempting — on screen EF is about 133 units, EB is 135 and BC is 130, so "EB ≅ EF" and "BC ≅ EF" look true to the eye and are false to the marks. That is a well-laid visual trap, and Part A's single hint ("work from the ticks, not from how long the segments look") names the principle without identifying which rows.

Two notes. The stem asserts AB = DC, and nothing in either part uses it or asks about it — dead weight that a careful student will waste time on. And Part B is fa12-marked verbatim, same numbers and nearly the same hints; if both are in the pool, the scaffolded and unscaffolded versions of one question will be met minutes apart.

### fa13

Stem: lines CD and EF intersect at X with m∠CXE = ⅝ m∠FXE. Part A asks m∠EXD (67.5°); Part B asks m∠DXF (112.5°). Both numeric. No givens listed under the figure; the figure is the two crossed lines, unlabelled by measure.

Part B does not really depend on Part A. It depends on m∠CXE = 112.5°, which is an *intermediate* of Part A, not the value Part A asked the student to report. Part B's WHY says so out loud — "you already have m∠CXE = 112.5°" — assuming a working figure the interface never captured. The practical consequences are bad in both directions. A student who solved Part A correctly and reported 67.5 has to reconstruct 112.5 from memory; a student who got Part A wrong by answering 112.5 is holding exactly the number Part B rewards, and will sail through Part B using the same misreading that failed Part A.

The fix is small: make Part A ask for m∠CXE. Then Part A is the straight-angle insight, Part B is "now apply vertical angles to the number you just gave", and the chain is genuine. The current arrangement asks Part A for the linear pair and Part B for the vertical pair, which are siblings rather than stages — two parallel consequences of one shared insight, so the item fragments one question rather than staging it.

The hints are inherited from fa13a and fa13b and carry the same imbalance: Part A's pair scaffolds properly, Part B's lone hint again addresses the easy half.

### midpoint-two-parts

Stem: M is the midpoint of AB, AB = 42 cm, AM = (4x + 3) cm. Part A asks x (4.5); Part B asks MB in centimetres (21), with a declared trap of 4.5.

Part B does not depend on Part A, and the item knows it — Part B's WHY says "you did not need x again; the halves were equal from the start". This is deliberate, and it is the most interesting design decision in the batch. The real chain is 42 → each half is 21 → 4x + 3 = 21 → x = 4.5, so Part A's answer sits one step *past* the number Part B wants. Part B is a step backwards, asking the student to notice that the algebra was a detour and that MB was available from the word "midpoint" alone.

Whether that teaches or baits depends on the student. The trap value 4.5 is well chosen: it is produced by exactly the habit a two-part item trains, carrying Part A's answer into Part B, and the note ("that is x from Part A, not a length") is the right correction. The WHY then explains the joke. I think this lands, but it should be acknowledged that it contradicts the format's own promise — the interface presents Part B as depending on Part A, and here the lesson is that it doesn't.

Part A's single hint ("each half of AB is half of 42") gives away the only insight, leaving 4x + 3 = 21 as pure mechanics. The figure marks AM ≅ MB with ticks, which also softens Part A. A second declared trap on Part B worth adding: 10.5 (42 ÷ 4), from a student improvising with the coefficient.

# Practice ▸ Proof

## Sub-tab: Build a proof

All eleven items share one interface. The figure sits top left, tinted blue for every given and red for the goal, with a third ochre lane carrying the line currently being composed; overlapping highlights are drawn in offset parallel lanes so a whole and its parts stay distinguishable. Beneath the figure is a Given list and a Prove line in the same blue and red, then a hint control that reveals one hint at a time. The right half is the empty statements/reasons table and the **Next step** composer: a token toolbar (EQUATION / CONGRUENCE / ANGLE PAIR / POSITION rows, left-side and right-side slots, digit pad, x), a grouped **Reason** dropdown, and Add step / Clear step / Undo last line / Start over. Line numbers in the table are buttons — clicking one cites it. The figure is clickable too: two points make a segment token, three an angle.

One thing deserves flagging up front. A forbidden reason is not shown-and-rejected; it is **deleted from the dropdown entirely**. The circularity trap is therefore enforced by silent omission. A student who reaches for "Vertical Angles Theorem" simply will not find it, and nothing tells them why. The lesson that you may not prove a thing by citing it is the single most important idea in these four items, and the app teaches it only by absence.

Note also that none of the figures in this batch declares a printed degree value. The measures listed are computed board properties, not drawn labels. On screen a student sees only point letters, segments, tick marks, congruence arcs, right-angle squares and the numerals ∠1–∠4.

### shared-angle — Adding a shared angle

Four rays leave V; arcs mark the two outer angles ∠WVX and ∠YVZ congruent, and the unmarked middle angle ∠XVY belongs to both larger angles. Given is that congruence; prove m∠WVY = m∠XVZ. The student must build all seven lines from the toolbar and attach a reason to each.

The blue/red layering is at its most instructive here. Blue sits on the two outer 40° sectors; red sits on ∠WVY and ∠XVZ, each of which physically contains one blue sector plus the shared middle. Because red and blue overlap, the offset lanes do real work: the picture shows a whole drawn against its own part, which is exactly the relationship the proof exploits.

The three hints scaffold honestly without naming the answer. Hint 1 says to turn the congruence into an equation about measures — a nudge toward the definition of congruent angles, not the definition itself. Hint 2 names Reflexive explicitly, which is the right thing to give away, since "state that the shared thing equals itself" is a move nobody invents unaided. Hint 3 names Addition and Angle Addition. Taken together the hints do hand over the route, but they are staged so a student can stop after one.

The model solution's shape is the canonical one: def-cong-ang, Reflexive on ∠XVY, Addition Property to bolt the shared angle onto both sides, two separate Angle Addition lines renaming each sum, then Substitution to fuse them. The conceptual hinge is line 3. Students will produce lines 1 and 2 quickly and then stall, because nothing in the problem asks them to write m∠XVY = m∠XVY; it looks vacuous. The plausible wrong line is jumping straight from line 2 to m∠WVY = m∠XVZ with reason Substitution, skipping the arithmetic that licenses it.

### vertical-angles — Vertical Angles Theorem

Two segments cross at X, with the four angles numbered 1 to 4. Prove ∠1 ≅ ∠3, and **Vertical Angles Theorem is forbidden**. The Given list is empty, so the Given box reads "Nothing is stated in words — read what you need from the figure" and the only blue on the figure is nothing at all; red marks ∠1 and ∠3.

This is the batch's purest circularity item and also its roughest edge. The model solution opens with two lines — "∠1 and ∠2 form a linear pair" and "∠2 and ∠3 form a linear pair" — both justified as **Given**, when nothing was given. The reason's own gloss ("Stated in the problem, or marked on the figure") covers it, but a student staring at an empty Given box has to work out that "Given" here means "visible in the picture". That is a real stumbling block, and no hint addresses it.

The hints are good once past that. Hint 1 points at ∠2 as the common partner; hint 2 supplies the Linear Pair Theorem; hint 3 describes Substitution and Subtraction without naming them. They scaffold rather than dictate.

The hinge is line 5: two different sums both equal 180, so they equal each other. The intended reason is Substitution. Subtracting the shared m∠2 then finishes, and def-cong-ang converts back to a congruence. The most likely stall is not seeing that ∠2 must be brought in deliberately; the most likely wrong line is asserting ∠1 ≅ ∠3 directly and hunting the dropdown for a reason that is no longer in it.

### congruent-supplements — Congruent Supplements Theorem

Two separate straight lines, each with a ray standing on it: ∠1/∠3 at V and ∠2/∠4 at W, with arcs marking ∠3 ≅ ∠4. Given are the two supplementary statements and that congruence; prove ∠1 ≅ ∠2, with **Congruent Supplements forbidden**. Drawing the two pairs at separate vertices is the right call — ∠1 and ∠2 are not vertical angles, so no shortcut is available.

There is a small leak. Both pairs are drawn at the same 115°/65° split, so ∠1 and ∠2 look plainly equal before any reasoning starts. That is fine for confidence and bad for motivation; a figure with two visibly different-looking-but-equal pairs would have been sharper.

Ten lines makes this the longest authored build. The hints are three and they map exactly onto lines 4–5, 7 and 8–9, so by the third hint the route is fully given away. Used sparingly they are fine; used together they are a solution.

The intended route: each supplementary statement becomes a sum equal to 180, the two sums are equated by Substitution, then ∠3 ≅ ∠4 is used to replace m∠4 with m∠3 so the two sides share a term, and Subtraction removes it. The hinge is line 8 — the second Substitution, the one that manufactures a common term. Students usually reach line 7 and then subtract immediately, getting m∠1 = m∠2 from m∠1 + m∠3 = m∠2 + m∠4, which is the classic wrong line: you cannot cancel unequal-looking terms until you have made them literally identical.

### right-angles — Right Angle Congruence Theorem

Two right angles drawn far apart and in different orientations — ∠1 opening right-and-down at A, ∠2 opening left-and-down at E — each carrying a square. Both are given as right angles; prove ∠1 ≅ ∠2, with **Right Angle Congruence forbidden**. The differing orientations are a deliberate and good choice: the angles do not look superimposable, so congruence has to come from measure rather than from appearance.

Six lines, and the shortest genuinely instructive proof in the set. The hints track the three ideas one-to-one — definition of right angle, transitivity, definition of congruent angles — which means all three hints together are the proof. As a single first hint, hint 1 is well judged.

The intended route is def-right-angle twice, Transitive, def-cong-ang. The hinge is recognising that this is a transitivity argument at all: both measures equal 90, therefore they equal each other. Students who have internalised "congruent means equal measure" often try to write ∠1 ≅ ∠2 straight from the two squares and reach for Definition of congruent angles as the reason, which fails because that definition only converts between an existing congruence and an existing equation. Substitution is also accepted here by the validator, so the Transitive/Substitution choice is not punished — consistent with the app's stated position that the two overlap.

### linear-pair-supp — Using a linear pair

Ray BD stands on line AC. Given m∠ABD = 115; prove m∠DBC = 65. The figure prints no degree labels at all, so 115 comes only from the Given box and 65 is nowhere visible — the item does not give itself away. Red marks ∠DBC, blue marks ∠ABD.

Five lines, and this is the one item where the hints scaffold without leaking. Hint 1 — "First say what the figure shows about ∠ABD and ∠DBC" — tells the student *that* a picture fact must become a written line, which is the real skill, without saying which fact. Hint 2 names the Linear Pair Theorem. Hint 3 points at substitution. That is a genuinely graded sequence.

The intended route is: assert the linear pair as Given, convert it to a sum of 180 by the Linear Pair Theorem, restate the given 115, substitute, subtract. The hinge is the very first line: students want to begin with m∠ABD = 115 because that is what they were handed, and then have nothing to do with it. Beginning instead with the unstated picture fact is the move that unlocks everything.

The plausible wrong line is m∠ABD + m∠DBC = 180 with reason **Definition of a linear pair** rather than the Linear Pair Theorem — the definition says the angles are adjacent with outer sides on a line, the theorem says their measures total 180. That near-miss is planted deliberately in the corresponding Check-the-reasons item.

### bisector-halves — A bisector makes the parts equal

Ray VD bisects ∠AVC, with arcs already marking the two halves congruent. Prove 2 m∠AVD = m∠AVC. Red covers the whole ∠AVC and the doubled part, blue covers the bisector statement, so again the lanes carry a whole against its part.

The figure's arcs slightly undercut the first step: the congruence of the halves is drawn, so line 2 is readable off the picture even though the student must still cite the definition of an angle bisector for it. That is acceptable — the point is the citation, not the discovery.

Hints again map one-to-one onto lines 2, 3 and 4–5. Three hints is the whole proof; one hint is a fair nudge.

The route is def-ang-bisector, def-cong-ang, Angle Addition, Substitution, Simplify. Two features are worth noting. First, Angle Addition is a free-standing line citing nothing — the postulate licenses it from the figure alone, and the composer says as much ("This reason cites no earlier lines"). Students habitually try to cite something and get an error. Second, the final line is reason **Simplify**, for combining m∠AVD + m∠AVD into 2 m∠AVD. Students reach for Distributive there, since the surface looks like factoring; the validator rejects it because no parentheses are cleared or introduced. That is a fair and well-explained distinction.

The hinge is line 5, substituting one half's measure for the other's so the sum becomes a doubling. The likely stall is stopping at m∠AVD = m∠DVC and not seeing what to do next.

### algebra-justify — Justifying an algebra solution

No figure. Given 3(x − 4) = 18; prove x = 10, every line named. Four lines: Distributive, Addition Property, Division Property. With the figure gone the layout collapses to a Given/Prove block, the two hints, and the composer — a student building 3x − 12 = 18 has to assemble it digit by digit from the pad and operator tokens.

This is the clearest answer to what the solve-for-x proofs add over ordinary algebra. Nothing about the arithmetic is hard; a student who can solve this in one line is still forced to say *why* each line follows, and to discover that the names are not decorative. Adding 12 to both sides is the Addition Property of Equality even though the visible operation looks like removing a negative; dividing by 3 is the Division Property, not the Multiplication Property, and the validator says so explicitly. The habit being built is that a manipulation and its justification are separate objects — which is precisely the habit that makes the geometric proofs writable.

Only two hints, and they are terse: clear the parentheses, then undo the −12 and the ×3. They give the algebra away and withhold the names, which is the correct division of labour for this item — the algebra is not what is being assessed.

The likely stall is none at all; the likely wrong line is 3x = 30 justified as Simplify or Subtraction Property. It is the weakest item as a *proof* and one of the strongest as a *drill*.

### midpoint-solve — Midpoint, then solve

M is the midpoint of AB, AB = 22, AM = 6x − 4; prove x = 2.5. The figure is a horizontal segment with M at the centre and ticks already marking AM ≅ MB. Eleven lines — the second-longest in the batch, and the one that genuinely fuses geometry with algebra.

Three hints, mapping to lines 4–5, line 6, and lines 7–11. Hint 3 ("Combine those to find AM, then solve") compresses five lines into a clause, so the hints scaffold the geometry and hurry the algebra — a reasonable weighting.

The route runs: midpoint gives congruent halves, congruence gives equal lengths, Segment Addition gives AM + MB = AB, substitution collapses that to AM + AM = 22, division gives AM = 11, and only then does the algebraic given 6x − 4 = 11 get used. The hinge is line 7, where three separate earlier lines are cited at once — students routinely cite only one and get an arity error.

What this adds over an ordinary "solve for x" exercise is the enforced separation between the geometry that produces the number 11 and the algebra that turns it into 2.5. In a textbook exercise a student writes 6x − 4 = 11 immediately and never articulates that the 11 came from halving a whole via Segment Addition. Here those three lines cannot be skipped.

The plausible wrong line is AM + MB = AB justified as **Angle Addition Postulate**, a slip the validator catches with "The step should name exactly three angles" — the same near-miss the reason-check item plants.

### supplementary-solve — Supplementary, then substitute back

The richest item in the batch. Two vertices: at V a linear pair ∠1/∠2 on line PQ with ray VR; at W a separate angle ∠3, with arcs marking ∠1 ≅ ∠3. Given are the supplementary pair, m∠1 = 16x − 7, m∠2 = 21x + 2, and ∠1 ≅ ∠3; prove m∠3 = 73. Twelve lines.

The hints are unusually good. Hint 2 — "solve for x, but x is not the answer" — names the exact failure mode, which is the student stopping at x = 5 and calling it done. Hint 3 says to put x back and then carry the value across the congruence. These genuinely scaffold rather than dictate, because knowing the shape of the journey does not write any of the twelve lines for you. (Hint 3 refers to "m∠A" and "∠C", which do not exist in this figure — a small authoring slip, since the angles here are numbered.)

The route: supplementary becomes a sum of 180, both expressions are substituted in, Simplify combines like terms, Addition and Division solve for x, substitution back into 16x − 7 gives m∠1 = 73, def-cong-ang turns ∠1 ≅ ∠3 into m∠1 = m∠3, and a final substitution lands on m∠3 = 73.

The conceptual hinge is line 11. Everything up to line 10 is algebra wearing a geometry hat; line 11 is where the congruence mark on the figure finally earns its keep. Students who stop at line 10 have solved the equation and not answered the question — and the item is built so that stopping short is the natural thing to do. That is what elevates it above an ordinary solve-for-x drill: the algebra is a subroutine, and the proof continues past its return value.

### segment-transitive — Passing equality along a chain

A, B, C, D evenly spaced on one segment, with ticks marking AB ≅ BC ≅ CD. Given AB ≅ BC and BC ≅ CD; prove AB ≅ CD. Three lines: two givens and one Transitive step.

This is the weakest item in the sub-tab, and it is worth saying plainly. The figure draws all three congruences with identical ticks, so the conclusion is visible before any reasoning begins. The single hint — "Two congruences share a middle term. That is the hinge." — names the answer in ten words. And the proof contains exactly one non-given line.

It is defensible as an on-ramp: it is the first place a student meets the mechanics of the composer without also having to invent a route, and Transitive with two citations is a real thing to practise. But it should not be counted as a proof exercise, and a teacher scanning the list should know that the second item in the dropdown is a warm-up.

The only plausible error is citing one line instead of two, or reaching for Substitution — which the validator accepts, since the app takes the position that Transitive and Substitution overlap.

### halves-of-whole — Each half is half the whole

M is the midpoint of AB; prove AM = AB/2. Same figure as midpoint-solve, with the halves ticked. Six lines: def-midpoint, def-cong-seg, Segment Addition, Substitution, Division Property.

This is midpoint-solve with the algebra amputated, and it is the better teaching item of the two. Stripped of numbers, the proof is nothing but the core move the whole module is built around: turn a stated relation into a congruence, turn the congruence into an equation about lengths, bring in the whole by the addition postulate, substitute so the two parts become literally the same symbol, then divide.

Two hints, and they are blunt — hint 2 supplies AM + AM = AB outright, which is the hinge. A student who takes both hints has been handed lines 4, 5 and 6. Hint 1 alone is well pitched.

The likely stall is between lines 3 and 4: having established AM = MB, students do not see that the whole has to be introduced by a separate free-standing Segment Addition line rather than derived. The likely wrong line is writing AM = AB/2 directly from the ticks with reason Definition of midpoint — plausible enough that it is arguably the definition's plain-English content, but the app's definition of midpoint yields a congruence, not a fraction, and the validator holds that line.

Curriculum note: the deck runs the two midpoint items as separate entries with the same figure. They would read better adjacent, with this one first.

## Sub-tab: Check the reasons

Ten items, one per authored proof of at least four lines. Each shows the figure (with no blue/red overlay on the drawing itself — the colour appears only on the Given list and the Prove line printed beneath it), and on the right the finished proof as a numbered checklist, each row reading `statement — Reason name`. Tick only the rows whose reason is right, then Check.

Two structural facts govern every item and need stating once.

**The spoiled set is reseeded on every visit, but the substitutions are not free.** Each line has exactly one wrong reason it can ever receive — the first entry in a fixed confusion table that the validator confirms actually fails. Roughly two lines in five are spoiled on any given run, chosen at random from that fixed menu. So a student replaying an item sees the same wrong labels in different places, never new ones. That is a sensible guarantee (no swap is offered as wrong when the validator would have accepted it) and a limit on replay value.

**Transitive-versus-Substitution, the near-miss a teacher would most expect to see tested here, is deliberately absent.** The generator's own note explains why: the two overlap and either is normally accepted, so labelling one of them wrong would be unfair. The consequence is that the sharpest distinction in the equality-properties family is never exercised in this sub-tab. The pairs that *are* exercised are Reflexive versus everything, Symmetric as a catch-all, Segment versus Angle Addition, congruent segments versus congruent angles, midpoint versus segment bisector, supplementary versus complementary, right angle versus perpendicular, Linear Pair Theorem versus definition of a linear pair, Addition versus Subtraction, and Multiplication versus Division.

**The weakness worth acting on:** the only wrong reason a *Given* line can ever receive is **Reflexive Property**. Because every proof opens with one to four given lines, and because those lines are spoiled most often, a large share of the planted errors in every item are of the form "∠1 and ∠3 are supplementary — Reflexive Property", which is not seductive at all. A student who learns only the rule "givens labelled Reflexive are wrong" will score well above chance without reading a single interesting line. The genuinely instructive spoilings live in the middle of each proof and are outnumbered.

A second, subtler defect: several wrong labels are wrong on a *citation-count* technicality rather than on meaning — Symmetric applied to a line that rests on two earlier lines, Reflexive applied to a line that rests on one. The checklist row does not display citations at all, so the app's own explanation ("Symmetric Property uses at most 1 earlier line") refers to something the student was never shown. The lines are still wrong on their meaning, and a student can reason them out, but the feedback misexplains why.

### rc-shared-angle

Seven rows, three spoiled. The fixed menu: line 1 (the given congruence) can be labelled Reflexive; line 2, `m∠WVX = m∠YVZ`, can be labelled **Definition of congruent segments**; line 3, `m∠XVY = m∠XVY`, can be labelled **Transitive**; line 4 Reflexive; lines 5 and 6, the two Angle Addition renamings, can each be labelled **Segment Addition Postulate**; line 7 Symmetric.

This is the best-designed item in the sub-tab, because three of its planted errors are properly seductive. Segment-for-Angle Addition on lines 5 and 6 is a genuine near-miss: the form `part + part = whole` is identical, and only the `m∠` prefixes distinguish them. Definition of congruent *segments* on line 2 is the same trap in the definitions family — the line does exactly what that definition describes, on the wrong kind of object. And line 3 labelled Transitive is the subtlest of all: `m∠XVY = m∠XVY` is a true statement, transitivity is about chaining equalities, and a student who has not internalised that both sides are the *same* quantity will accept it.

The figure helps here. The arcs on the two outer sectors and the unmarked middle sector let a student check by eye which lines are about parts and which about wholes.

### rc-vertical-angles

Seven rows, three spoiled. Lines 1 and 2, the two linear-pair statements, can each be labelled Reflexive. Lines 3 and 4 can be labelled **Definition of a linear pair** in place of the Linear Pair Theorem. Line 5 can be Symmetric; line 6, the subtraction, can be **Addition Property**; line 7 can be Definition of congruent segments.

The definition-versus-theorem swap on lines 3 and 4 is the most valuable plant in the whole sub-tab, and it is the distinction high-school students most reliably blur. The definition tells you what a linear pair *is* — adjacent, outer sides forming a line. The theorem tells you what follows — the measures total 180. A line reading `m∠1 + m∠2 = 180 — Definition of a linear pair` is wrong in precisely the way that matters, and it looks completely fine.

The Addition-for-Subtraction swap on line 6 is also fair: `m∠1 + m∠2 = m∠2 + m∠3` becoming `m∠1 = m∠3` removes m∠2 from both sides, and students who think of it as "cancelling" have no instinct about which property that is.

Lines 1 and 2 labelled Reflexive are the throwaways.

### rc-congruent-supplements

Ten rows, four spoiled — the largest planted set relative to a proof whose middle is genuinely hard. Lines 1, 2 and 3 (all givens) can be Reflexive. Lines 4 and 5 can be **Definition of complementary angles**. Line 6 can be Definition of congruent segments. Lines 7 and 8 can be Symmetric. Line 9 can be Addition Property. Line 10 can be Definition of congruent segments.

Supplementary-for-complementary is the strong plant: the line reads `m∠1 + m∠3 = 180`, the offered reason is a definition about sums of angle measures, and the only thing wrong is the number the definition produces. The app's feedback is unusually good here, spelling out that the complementary definition would have given 90.

But three of the ten rows are givens, and all three can only be spoiled with Reflexive. With four spoilings drawn at random across ten rows, a typical run has one or two of the errors sitting on those trivially-detectable given lines. The item is longer than its difficulty warrants.

Lines 7 and 8 labelled Symmetric are the citation-count cases described above — defensible on meaning (neither line is a left-right flip of anything), poorly explained by the feedback.

### rc-right-angles

Six rows, two spoiled. Lines 1 and 2 can be Reflexive; lines 3 and 4 can be **Definition of perpendicular lines**; line 5 can be Reflexive; line 6 can be Definition of congruent segments.

The perpendicular plant is good: `m∠1 = 90` justified by a definition that also concerns 90° angles, and wrong only because nothing in the figure asserts perpendicularity — the squares mark right angles, not perpendicular lines. That is a distinction worth drilling and it is drilled nowhere else.

Line 5, `m∠1 = m∠2` labelled Reflexive, is the sleeper. The two sides are different quantities that happen to be equal, which is exactly the confusion Reflexive exists to prevent, and a student who has just read two lines both ending in 90 may nod it through.

With only two spoilings across six rows and half the menu being given-plus-Reflexive, this item is often easy. It is the right length for the proof, though.

### rc-linear-pair-supp

Five rows, two spoiled — the shortest item. Line 1 can be Reflexive; line 2 can be **Definition of a linear pair**; line 3 (`m∠ABD = 115`) can be Reflexive; line 4 can be Symmetric; line 5 can be Addition Property.

Brevity is a virtue here: with five rows a student must actually read all of them. The definition-for-theorem swap on line 2 carries the item, and the Addition-for-Subtraction swap on line 5 is a clean second. Line 3 labelled Reflexive is slightly more interesting than the usual given-plus-Reflexive case, because `m∠ABD = 115` is an equation, and the feedback has to explain that both sides of a reflexive step must be the *same* quantity rather than merely equal — a real point, well made.

The figure carries no printed degrees, so nothing on screen confirms or contradicts the numbers in the proof. Good.

### rc-bisector-halves

Six rows, two spoiled. Line 1 can be Reflexive; line 2 can be **Definition of segment bisector**; line 3 can be Definition of congruent segments; line 4 can be **Segment Addition Postulate**; line 5 can be Symmetric; line 6 can be **Distributive Property**.

Segment-bisector-for-angle-bisector on line 2 is the seductive one, and the figure is what gives it away: rays from a vertex with arcs between them, not a segment with ticks. A student who checks the picture catches it; a student reading only the text does not. That is exactly the right dependency for this sub-tab.

Line 6 is the other good plant: `m∠AVD + m∠AVD = m∠AVC` becoming `2 m∠AVD = m∠AVC` looks like factoring, and Distributive is the name students attach to anything involving a coefficient and a sum. Simplify is correct and feels anticlimactic, which is why the error works.

### rc-algebra-justify

Four rows, two spoiled — the minimum. No figure, so the whole item is four lines of text. Line 1 can be Reflexive; line 2 (`3x − 12 = 18`) can be **Substitution**; line 3 can be Reflexive; line 4 can be **Multiplication Property of Equality**.

Small but sharp. The Multiplication-for-Division swap on line 4 is the plant every algebra teacher wants: `3x = 30` to `x = 10` is division, students describe it as "cancelling the 3", and the two property names are mirror images. The Substitution plant on line 2 is weaker — it fails on a citation technicality that the checklist does not show — but a student can still argue it out, since nothing was substituted *for* anything.

With four rows and two always wrong, this item is closer to a matching exercise than a search. That is fine; it is the fastest item in the sub-tab and it drills the one distinction that recurs everywhere else.

### rc-midpoint-solve

Eleven rows, four spoiled. The menu is the broadest in the batch: lines 1, 2 and 3 (givens) can be Reflexive; line 4 can be Definition of segment bisector; line 5 can be **Definition of congruent angles**; line 6 can be **Angle Addition Postulate**; lines 7 and 9 can be Symmetric; line 8 and line 11 can be **Multiplication Property**; line 10 can be Reflexive.

Line 6 is the flagship: `AM + MB = AB — Angle Addition Postulate`, on a figure containing not a single angle. The part-plus-part-equals-whole shape is identical across the two postulates, and the app's feedback names the exact failure ("should name exactly three angles"). Line 5, `AM = MB` labelled Definition of congruent *angles*, is the same trap one level down. Together they make this the best item for the segment/angle near-miss family.

The cost is length. Eleven rows, three of them givens whose only possible spoiling is the transparent one, and four spoilings scattered at random — a student can tick eleven boxes with only partial reading and still land close. Trimming the three given lines from the checklist, or excluding them from the spoiling pool, would tighten this item considerably.

### rc-supplementary-solve

Twelve rows, five spoiled — the longest. Lines 1–4 (givens) can all be Reflexive. Line 5 can be **Definition of complementary angles**; line 6 can be Symmetric; line 7 can be **Distributive**; line 8 can be Reflexive; line 9 and line 12 can be Multiplication Property or Symmetric respectively; line 10 can be Symmetric; line 11 can be Definition of congruent segments.

The good plants are line 5 (supplementary for complementary, on a line reading `= 180`), line 7 (Distributive for Simplify, on the step that combines 16x and 21x — students genuinely believe combining like terms is distribution), and line 11 (congruent segments for congruent angles, on `m∠1 = m∠3`).

But four of the twelve rows are givens with the one transparent spoiling available, and five errors are drawn across twelve rows. On a typical run two of the five sit on those givens. This item has the richest error menu and the worst signal-to-noise ratio in the sub-tab; it is long enough that a student's attention is spent before the interesting lines arrive.

### rc-halves-of-whole

Six rows, two spoiled. Line 1 can be Reflexive; line 2 can be **Definition of segment bisector**; line 3 can be **Definition of congruent angles**; line 4 can be **Angle Addition Postulate**; line 5 can be Symmetric; line 6 can be Multiplication Property.

This is rc-midpoint-solve distilled, and it is the better item. Six rows, one given, and five of the six possible spoilings are real near-misses: bisector-for-midpoint, angle-for-segment twice, Multiplication-for-Division. Every row rewards reading. It is the item to put in front of a student first, and a teacher choosing between it and rc-midpoint-solve should choose this one.

The figure — a plain ticked segment with M at the centre — is enough to catch both angle/segment swaps by eye, which is the dependency the sub-tab is built on.

## Sub-tab: One step

Thirty-seven generated single-line items. The form is constant: the figure on the left, the Given list, then the proof so far as a compact table with every prior line and its correct reason, the line in question added as a final row whose reason cell reads *which reason?* in ochre, and the cited lines highlighted. A note underneath says which earlier lines the step rests on, or that it rests on the figure and the givens rather than on any earlier line. Four reason options follow; after answering, the chosen reason's one-line gloss is shown as the verdict.

Two design choices make the family work. Lines whose reason is "Given" are never asked about — the generator skips them, on the grounds that they teach nothing. And a distractor is only offered after the validator has confirmed it genuinely fails on that exact line, so no option is arguably-correct-but-marked-wrong. The distractors come from a fixed confusion table per reason, which means the four options are always from the same family: three equality properties plus the right one, or four definitions of similar things, never a scattershot mix.

A sample of eight divides cleanly into two groups.

**The definition items.** `shared-angle:2` asks what justifies `m∠WVX = m∠YVZ` given the congruence above it, offering Definition of congruent angles against Definition of congruent segments, Vertical Angles Theorem and Right Angle Congruence Theorem. `supplementary-solve:11` is the same question on `m∠1 = m∠3` with the same three distractors, but with ten lines of context above it. `bisector-halves:2` asks what justifies `∠AVD ≅ ∠DVC`, offering Definition of angle bisector against Definition of congruent angles, Definition of segment bisector and Angle Addition Postulate. `midpoint-solve:4` asks what justifies `AM ≅ MB`, offering Definition of midpoint against Segment Addition Postulate, Definition of congruent segments and Definition of segment bisector.

These are the better half. In each the correct answer is the definition of the *thing you were given*, and the distractors are either the definition of what the line produces (congruent segments/angles — the very next step in the proof) or the same definition for the wrong kind of object. The near-miss between "the definition that licenses this line" and "the definition that describes this line's content" is a real and useful one, and the four-option format isolates it cleanly.

**The algebra items.** `algebra-justify:4` and `supplementary-solve:9` both ask what justifies a final `x = ` line, offering Division Property against Multiplication Property, Subtraction Property and Simplify. `supplementary-solve:8` asks about `37x = 185`, offering Addition Property against Reflexive, Substitution and Subtraction Property. `supplementary-solve:6` asks about the long substituted line `(16x − 7) + (21x + 2) = 180`, offering Substitution against Transitive, Simplify and Symmetric.

These are more mechanical. The Multiplication/Division and Addition/Subtraction pairs are worth drilling and the items drill them, but two of the four sampled are the identical question on different numbers, and `supplementary-solve:8` includes Reflexive as an option, which no student who has read the line will pick. `supplementary-solve:6` is the strongest of the four, because Substitution versus Simplify on a line that both substitutes *and* leaves the arithmetic undone is a distinction students really do miss.

One observation across the family: because the context table shows every prior line with its correct reason, long proofs produce tall tables — `supplementary-solve:11` shows ten lines above the question. That is generous context, but it also means the student can often infer the answer from the pattern of what has already been used rather than from the line itself. The short-context items (`bisector-halves:2`, with one line above) ask a cleaner question.

---

# Cards

The Cards page is the app's only untimed, low-stakes surface: no score, no figure stage, no builder. A tag chip names the card type, "Card 1 of 16" tells you a session is a *sample* drawn from the authored pool (37 logic sources across seven types), one or two blue-tinted statement panels carry the givens, and four lettered options sit below the question. Everything a student needs is in the text — which is the point of the tab, and also its main risk.

One structural note that runs through everything below: the generated cards append the authored **topic note** to a generic per-type explanation. Where a note exists the "why" is specific and often excellent; where the note is blank (`square`, `vertical`, `congruent-segments`, `bisector`) the student gets only the boilerplate. That is four of ten conditionals shipping with no item-specific reasoning.

## Conditional forms

Two shapes are generated from the same ten sources. The **classify** shape shows "Statement 1" in the panel and puts "Statement 2" inside the prompt, asking *What is Statement 2?* with options "the original conditional / the converse / the inverse / the contrapositive". The **produce** shape shows one conditional and asks *Which statement is the inverse (~p → ~q)?*, with the four forms as options. The produce shape carries the symbolic gloss in the prompt itself — "the inverse (~p → ~q)" — which is a good scaffold, and the classify shape deliberately withholds it.

None of these cards has a figure, and for most of them that is correct: the work is syntactic. The exceptions are flagged per item.

### rectangle — *if has four right angles, then is a rectangle*

Negations: "does not have four right angles" / "is not a rectangle". The instructive form is the **converse**, and this is the one conditional in the set whose converse is both true and *named as such*: a quadrilateral is a rectangle exactly when it has four right angles. Classify-shape cards on this source are the purest test of "classify by form, not by truth", because every option a student might pick is a true sentence — the only thing left to reason about is structure.

The authored topic note is "The reference's worked example — a true converse does not make a statement the converse." That sentence is garbled; it appears to be two lessons welded together (a true converse doesn't stop something being the converse; a true converse *does* make this one a biconditional). Since notes are concatenated onto the card's explanation verbatim, this reaches the student as written. It should read something closer to "a converse that happens to be true is still the converse."

The subject is also missing in the source ("if has four right angles") and supplied by the renderer ("If a quadrilateral has four right angles…"), which is fine but means the authored strings can't be proofread in isolation.

### square — *if is a square, then is a rectangle*

Negations: "is not a square" / "is not a rectangle". The instructive form is the **converse**, and this is the canonical false-converse: every square is a rectangle, no rectangle need be a square. Its inverse ("if it is not a square, then it is not a rectangle") is false for exactly the same object — a non-square rectangle — which makes this source the best available demonstration that converse and inverse stand or fall together. The contrapositive ("if it is not a rectangle, then it is not a square") is true and quietly useful.

No figure, and none needed; a student who can picture a square already has the counterexample. Two real reservations. First, the topic note is blank, so cards from this source explain nothing beyond the form rule — a waste, given it is the clearest converse/inverse pairing in the pool. Second, squares and rectangles are outside Module 2's stated territory of segments, angles and proof; the source is borrowed from quadrilateral vocabulary the student may not have met in this course.

### midpoint — *if M is the midpoint of AB, then M lies on AB and AM ≅ MB*

The richest source in the batch. Its conclusion is a conjunction, so the authored notQ is "M does not lie on AB, or AM is not congruent to MB" — De Morgan is baked into the inverse and contrapositive without ever being announced. The observed `produce:midpoint:inverse` card offers all four forms and the student must recognise that negating "and" produced an "or"; the distractor list includes the contrapositive with the same "or" phrasing, so the shuffle is genuinely hard.

The instructive form is the **converse**, and the topic note says why in one line: "A definition works in both directions — which is why you may apply it forwards or backwards in a proof. Drop 'M lies on AB' and the converse fails." That is the single most transferable sentence in the whole tab — it connects the form drill to what the student will actually do on a proof line.

A figure would help here more than anywhere else in the family: "M lies on AB" versus "M is equidistant from A and B" is a picture of a segment against a perpendicular bisector, and the counterexample card on the same idea (below) describes that picture in prose alone.

### linear-pair — *if form a linear pair, then are supplementary*

Negations: "do not form a linear pair" / "are not supplementary". The instructive form is the **converse**, and the topic note is exact: "Supplementary angles need not touch, so the converse fails." The proof consequence is the thing to hold onto — a student may cite this rule forwards (linear pair, therefore supplementary) and never backwards, and the always/sometimes/never item `linear-supp` tests the same asymmetry from the other side.

The contrapositive ("if two angles are not supplementary, then they do not form a linear pair") is true and is the form most students find counterintuitive here, because it feels like it is "about" supplementary angles when it is really about linear pairs.

No figure. A small one would earn its place: two angles meeting at a point on a line beside two unrelated angles of 100° and 80° in different corners of the page makes "need not touch" instant. Without it, the student has to generate that second picture from the phrase alone.

### vertical — *if are vertical angles, then are congruent*

Negations: "are not vertical angles" / "are not congruent". A theorem, not a definition, and that is the whole lesson: the instructive form is the **converse**, which is false — two 50° angles in unrelated figures are congruent and not vertical. This is the contrast partner to `right-angle` and `congruent-segments`, where the converse does hold, and it is the exact claim attacked by the `congruent-vertical` counterexample card.

The topic note is blank. That is the most costly omission in the ten, because theorem-versus-definition is precisely what determines whether a student may run a rule backwards in a proof, and this source is the clean negative case. A student who has just done `right-angle` and learned "definitions work both ways" has nothing here telling them why this one does not.

No figure; an X of two crossing lines would make the *forward* direction obvious but does nothing for the converse, which needs the absence of a picture — two angles that have no figure in common. Arguably correct to ship without one.

### right-angle — *if measures 90°, then is a right angle*

Negations: "does not measure 90°" / "is not a right angle". A definition, so all four forms are true, and the observed `classify:right-angle:inverse` card exploits that deliberately: the panel shows the original, the prompt shows "If an angle does not measure 90°, then it is not a right angle", and the answer is "the inverse". Truth is no help at all; only shape is. That is an excellent design choice and the best classify card in the pool.

The explanation reads "Statement 2 is ~p → ~q, so it is the inverse. Classify by form, not by truth — a converse that happens to be true is still the converse." Then the topic note is appended: "A definition, so it works in both directions — this one really is biconditional." There is a small hazard in that concatenation. A student who has just been told the sentence is the inverse and then reads "this one really is biconditional" may conclude that an inverse is equivalent to its conditional. The note is true and belongs on the biconditional card; on a classify card it sits one sentence too close to a different lesson.

### collinear — *if B is between A and C, then A, B and C are collinear*

Negations: "B is not between A and C" / "A, B and C are not collinear". The instructive form is the **converse**, false because three points can sit on one line in any order — the note cites the reference's Fig. 3. The observed `produce:collinear:contrapositive` card asks for ~q → ~p and puts the inverse ("If B is not between A and C, then A, B and C are not collinear") directly beside it as a distractor, which is the right pairing: those two sentences differ only in which part was moved, and a student reading too fast sees "two negations, that's the one".

This is the source most improved by a figure, and it has none. Three collinear points labelled A, C, B in that left-to-right order settle the converse in under a second; described in words, the student must both imagine the line and notice that the labels may be permuted. The same idea is retested by `bicond:collinear` and by two always/sometimes/never items, so it is well covered in quantity — just never drawn.

### congruent-segments — *if are congruent, then have equal length*

Negations: "are not congruent" / "do not have equal length". A definition, so the converse holds, and that converse is worked in nearly every two-column proof the student will write: from AB = CD conclude AB ≅ CD, "definition of congruent segments". The instructive form is therefore the **converse**, with the **contrapositive** close behind because the observed `equiv:congruent-segments:conditional` card uses it as the answer.

The topic note is blank, and here the cost is specific rather than general. Because this is a definition, the converse and inverse offered as distractors on the equivalence card are both *true sentences*. A student who reasons "that one's true, so it's equivalent" lands on the wrong option and receives only the generic rule in return, with nothing addressing the trap the item itself set.

No figure needed; two tick-marked segments would add nothing the symbols don't already say.

### obtuse — *if is obtuse, then measures more than 90°*

Negations: "is not obtuse" / "does not measure more than 90°". The instructive form is the **converse**, and the topic note supplies the counterexample: "A straight angle exceeds 90° without being obtuse."

This is the shakiest source in the ten, and worth flagging. The note is defensible in a course that treats straight angles as angles — this module does, since linear pairs and 180° totals are core content. But an obtuse angle is standardly defined as one measuring between 90° and 180°, and a student who has only ever met angles in that range will reason that "more than 90°" and "obtuse" coincide, answer that the biconditional holds, and be marked wrong on a boundary case the card never shows them in advance. The `bicond:obtuse` card's explanation does name the straight angle, so the reasoning is recoverable after the fact; it is still the one item where a thoughtful student can be wrong for a good reason.

A figure — a 180° straight angle drawn as an angle, with its arms opposite — would defuse this entirely and is the clearest missing diagram after `midpoint`.

### bisector — *if bisects an angle, then creates two congruent angles*

Negations: "does not bisect an angle" / "does not create two congruent angles". The instructive form is the **converse**, used as the correct answer on the observed `equiv:bisector:inverse` card.

The topic note is blank, and this one hides a genuine subtlety that the parallel `midpoint` source handles explicitly. A ray that creates two congruent angles bisects the angle only if it lies in the angle's interior — exactly as M is the midpoint only if it lies on the segment. The app states that clause for midpoints, builds a whole counterexample card around it, and then says nothing about the identical clause for bisectors, leaving the converse looking unconditionally true. A student who learned the midpoint lesson well has no way to apply it here.

No figure. A ray drawn inside an angle beside one drawn outside it would make the missing clause visible; as shipped, the omission is invisible.

## Logical equivalence

The family asks *Which statement is logically equivalent to the one above?* over one conditional in the panel. The option set is consistently the other three forms plus "None of these is logically equivalent to it." — and the "None" option is real rather than decorative, because a converse or inverse prompt with no matching partner in the list would make it correct. The three observed cards start from three different forms (a contrapositive, an original, an inverse), which is the right variety: the student cannot learn "always pick the one with two negations".

**Does the pairing land? Structurally, yes. Explanatorily, no.** All three cards carry the identical sentence: "A conditional and its contrapositive are logically equivalent; so are the converse and the inverse. The two pairs are independent of each other." That states the rule correctly and even names the independence, which many textbooks skip. What it never does is *demonstrate* it on the item at hand — there is no truth table, no "suppose the original is true and see", no reasoning about the particular content.

That matters most because several sources are definitions, where all four forms are true. On `equiv:congruent-segments:conditional` the distractors "If two segments have equal length, then they are congruent" (converse) and "If two segments are not congruent, then they do not have equal length" (inverse) are both true statements. The card marks them wrong — correctly, since truth is not equivalence — and then explains with a generic rule that never mentions the distinction the item just exercised. Same on `equiv:bisector:inverse`. This is the clearest fixable gap in the batch: one added clause per definition-sourced card ("both of these happen to be true, but a statement that is merely true alongside another is not equivalent to it") would convert a silent trap into the lesson.

`equiv:midpoint:contrapositive` deserves separate credit. The panel shows the contrapositive with its De Morgan'd "or", and the correct answer restores the original with "and". The student has to run De Morgan backwards to see the match — a real piece of work, entirely unremarked in the explanation. No figures anywhere in this family, and none would help; these are sentence-shape problems.

## Biconditional

Two panels: the conditional, then "Its converse: …" spelled out for the student rather than left to be derived. The question always names the proposed biconditional in full — *Can these be combined into the biconditional "…"?* — and the four options are fixed across every card: "Yes — both the conditional and its converse are true", "No — the converse is false, so only one direction holds", "Yes — every conditional can be written as a biconditional", "No — biconditionals only apply to definitions".

The fixed option set is a defensible trade. It lets the student stop re-reading the choices and concentrate on evaluating the converse, and both wrong options are genuine misconceptions worth naming: the over-generaliser who thinks any conditional flips, and the over-restricter who thinks only things *labelled* definitions may be biconditional. The latter is neatly refuted by `bicond:rectangle`, where the answer is yes and the explanation says the mutual truth "is what makes this a definition" — definition-hood follows from the logic, not the other way round.

The cost is that the answer collapses to a binary plus a reason, and after three or four cards a student can score well by asking only "is the converse false?" The three observed cards are `collinear` (no), `obtuse` (no) and `rectangle` (yes) — a two-to-one split. With `midpoint`, `right-angle` and `congruent-segments` also available as yes-cases and `square`, `linear-pair`, `vertical` and `bisector` as no-cases, the pool is balanced even if a short session may not be.

No figures. `bicond:collinear` and `bicond:obtuse` are the two that would benefit, for the reasons given under those conditionals — both turn on a single picture the student has to conjure unaided.

## Negation

*What is the negation of the statement above?*, one statement in the panel, four options. The per-card explanation is always the same line — "The negation says only that the statement fails — nothing more." — which is a good, compact statement of the principle and does most of the work, because four of the five items fail in the direction of saying *too much*.

Each distractor also carries an authored "why". These are the best-written explanations in the batch. The one thing the presentation record does not establish is **where that per-distractor text appears** — the observed card layout is a statement panel, a question and four lettered options, with no visible reveal of the per-option reasoning. If it surfaces only after a wrong pick, then a student who guesses the bland correct answer never meets the reasoning, and on the two connective items that means never meeting De Morgan. Worth checking against the implementation; it changes how much of this family actually teaches.

### acute — *∠A is acute*

Correct: "∠A is not acute". Distractors: "∠A is obtuse" ("That leaves out right and straight angles"), "∠A is a right angle" ("One particular non-acute case, not the negation"), "∠A is not obtuse" ("That denies a different property. An angle can be neither acute nor obtuse").

A well-graded ladder. The first distractor is the opposite-not-negation error; the second is the single-instance error; the third is the subtlest and the best — it looks like a proper negation, is grammatically parallel to the right answer, and denies the wrong predicate. A student who takes it is treating acute and obtuse as a two-valued partition, which is the actual misconception underneath the first distractor too, now stated positively.

What the student must hold: that the negation of a property is *everything else*, a set rather than a competing property. No figure, and one would hurt — drawing a particular angle invites reasoning about that angle instead of about the sentence.

### and — *∠A is acute and small*

Correct: "∠A is not acute, or it is not small". Distractors: "∠A is not acute and not small" ("Negating 'and' gives 'or', not 'and'"), "∠A is obtuse or large" ("Opposites are not negations"), "∠A is acute or small" ("That weakens the original rather than denying it").

**The De Morgan lesson is taught, explicitly and by name**, in the first distractor's explanation. The distractor set is well chosen: one keeps the connective and negates the parts, one swaps the connective but substitutes opposites for negations, one swaps the connective and negates nothing. Between them they isolate the two independent moves a correct negation makes — flip the connective, negate each part — and show what happens when you do one without the other.

"Small" is not a geometric predicate and has no definition, which sits oddly in a geometry deck. It is defensible: a vague second conjunct forces attention onto the connective rather than onto whether the geometry is true. But a student may reasonably stall on what "not small" means. No figure; the item is pure form and a picture would be a distraction.

### or — *The angle is acute or right*

Correct: "The angle is not acute and not right". Distractors: "The angle is not acute or not right" ("Negating 'or' gives 'and'"), "The angle is obtuse" ("One way to fail both, but a straight angle fails them too"), "The angle is acute and right" ("No angle is both; this denies nothing").

The mirror of the previous item and the pair is what makes both work — a student who meets only one learns a swap, a student who meets both learns the symmetry. Again the connective rule is named outright in the first distractor's why.

The second distractor is the strongest teaching moment in the family: "obtuse" does defeat the original statement, so a student who checks only whether the option is *incompatible* with the panel will accept it, and the explanation has to distinguish incompatibility from negation via the straight-angle case — the same boundary case the `obtuse` conditional leans on. The third distractor is close to a freebie, since "acute and right" is impossible; its why says so plainly. No figure needed.

### congruent — *AB ≅ CD*

Correct: "AB is not congruent to CD". Distractors: "AB < CD" ("One of several ways to fail congruence, not the negation"), "AB > CD" ("The other one-sided case, equally incomplete"), "AB and CD are not parallel" ("Congruence is about length, not direction").

The `<` / `>` pair is the point: presented together, they make visible that either alone covers half the failure space, and that the negation is their union. Presented singly they would be much weaker, so pairing them is deliberate and right. The third distractor is a category check rather than a logic check — it tests whether the student knows what congruence of segments is *about*, which is worth one slot, though it is the easiest option to eliminate.

The pull here is aesthetic: "not congruent" feels like a non-answer, and students reach for the informative option. Naming that pull is what the explanation does. No figure, and deliberately so — two drawn segments would have a visible length relation, which would let the student answer from the picture instead of from the sentence.

### collinear — *Points X, Y and Z are collinear*

Correct: "Points X, Y and Z are not collinear". Distractors: "Point Y is not between X and Z" ("Betweenness is a different claim: three points can lie on one line without Y being the middle one"), "Points X, Y and Z are not congruent" ("Congruence applies to segments and angles, not to points, so this denies nothing"), "No line passes through X, Y and Z in that order" ("Betweenness is a different claim from collinearity").

The collinearity/betweenness distinction is the right target — it is the same confusion behind the `collinear` conditional, the `bicond:collinear` card and the `segment-addition` counterexample. But **two of the three distractors make that one point**, with near-identical explanations, so a quarter of the card is redundant. The "in that order" phrasing of the third is the more interesting of the two and could carry the idea alone, freeing the other slot for something like an existential slip ("Points X, Y and Z do not all lie on a line" versus "some of them do not") or an over-negation.

A figure would be genuinely useful here and is absent: three points on a line with Y at one end is a two-second refutation of both betweenness distractors.

## Always, sometimes, never

One statement in the panel, *Is this always, sometimes, or never true?*, and three options in fixed order — Always / Sometimes / Never. Three options rather than four means a blind guess scores 33%, so the family leans hard on the explanation to do the teaching, and the authored WHY lines are short but almost all well aimed.

The twelve split four always, five sometimes, three never, which is a reasonable balance. Two structural observations before the items: `collinear-xyz` and `three-points-collinear` are the same statement twice, and `supp-90` is the only item phrased as a conditional, which quietly changes what "sometimes" is quantifying over.

### two-obtuse — *A triangle has two obtuse angles.* — never

Two angles each above 90° already overspend the 180° a triangle has, as the WHY says. A student answering "sometimes" is picturing a very wide, flat triangle and reading "obtuse" as "big"; they have not converted the word into the inequality. A student answering "always" has misread the statement as a definition of some triangle type.

The verdict is not arguable, but the item's *provenance* is: the triangle sum is not part of a module on segments, angles and proof, so the student is asked to supply a fact from elsewhere. Every other item in the twelve is answerable from Module 2 vocabulary. It is a fine question, slightly out of place.

No figure, and correctly none — any drawn triangle would be a single instance, and the reasoning is arithmetic over all triangles. A figure here would actively mislead by inviting the student to judge from one picture.

### collinear-xyz — *Points X, Y and Z are collinear.* — sometimes

"Three points may or may not line up. You can produce both an example and a counterexample." The WHY teaches the meaning of *sometimes* itself — a sometimes-verdict is a demand for two constructions, not a hedge — and that is worth saying once in the family.

A student answering "always" is over-generalising from the two-point case; one answering "never" has confused collinear with some stronger relation. Both errors are addressed better by the paired items `two-points-collinear` and `three-points-collinear` than by this one.

Which is the problem: this item and `three-points-collinear` are the same claim with different phrasing, and the latter's explanation is strictly better because it names why three is the interesting number. Two of twelve slots on one idea is a real cost in a deck this small. If one goes, this is the one — or repoint it at four points, or at "three points are coplanar", which is always true and would make a genuinely different item.

No figure; the two constructions the WHY demands are exactly what the student should be drawing themselves.

### line-longer — *Line MN is longer than segment MN.* — always

**The one verdict I would call arguable.** The intended reasoning is correct and the WHY states it well: "A segment is a bounded part of the line through its endpoints, and the line carries on past both of them." A student who answers "sometimes" thinking the line might stop, or who answers "never" because they have conflated line and segment, is exactly the student this item is for, and that confusion is worth a card.

The trouble is the word "longer". A line has no length; it is unbounded. Comparing its length to a segment's is a category slip, and a sharper student may answer "never" on the grounds that "longer" presupposes a measurement the line does not have, or that infinity is not a length. The intended lesson is containment, not measurement — the segment is a proper part of the line — and the WHY says containment even though the statement says length.

Rephrasing to "Line MN contains points that are not on segment MN" would preserve the lesson and remove the quibble. A figure would help here as much as anywhere: a segment drawn with arrows continuing past both endpoints makes the containment visible in one glance, and it is the app's own convention for lines.

### supp-90 — *If ∠F and ∠G are supplementary, then m∠F = 90°.* — sometimes

"It holds when both are right angles and fails for 100° and 80°." The reasoning is right and the two instances are the right two to name.

This is the only item in the twelve that is a conditional rather than a flat statement, and that changes the game without telling the student. For the other eleven, "sometimes" means the statement holds of some configurations and not others. Here, read as a general claim — which is how conditionals are read everywhere else in this tab, including the conditional-forms and counterexample families — the statement is simply **false**, and "never" becomes a defensible answer: there is no reading on which the *rule* is true. The card's sense of "sometimes" is "true of some instances", which requires the student to switch from the universal reading they have been trained on two card types over.

Worth either rephrasing to a flat statement ("Supplementary angles each measure 90°"), which would make it a clean *sometimes*, or keeping it and saying in the WHY that we are asking about instances, not about the rule.

No figure needed; the numbers do the work.

### vertical-congruent — *Vertical angles are congruent.* — always

"It follows from the Vertical Angles Theorem, for any two crossing lines." One of the few items where the right answer is simply a remembered theorem, and it functions as an anchor — a student who is unsure what *always* is supposed to feel like gets a clear case.

The WHY does one useful extra thing by saying "for any two crossing lines": it points at the universal quantifier, which is what *always* means. A student answering "sometimes" is either not recalling the theorem or is imagining that the congruence depends on the crossing angle — a misconception the phrase directly addresses.

The item is the positive pole of the pair with `linear-supp` and with the `congruent-vertical` counterexample: this direction always holds, the converse does not. A student who meets all three and notices the pattern has learned something structural rather than three separate facts. No figure; a crossing-lines diagram would be pleasant but the theorem is the load-bearing part.

### linear-supp — *Supplementary angles form a linear pair.* — sometimes

"A linear pair is always supplementary, but two angles on different pages can be supplementary without touching." The phrase "on different pages" is the best-turned line in the twelve — it makes the point about adjacency vividly and without jargon.

This is a reversal item: the student knows *linear pair ⟹ supplementary* cold, reads this statement too quickly, matches the two words, and answers "always". That is precisely the error the `linear-pair` conditional's converse is about, now tested in a context where the student is not primed to look for a converse. Good placement.

"Never" would come from a student who has decided supplementary angles must be separate, over-correcting from a diagram where they always were. The verdict correctly allows both: a linear pair *is* a supplementary pair, so the statement does hold sometimes.

A figure would strengthen this one — adjacent angles on a line beside a 100° and an 80° in unrelated corners — but the "different pages" phrasing substitutes for it better than most.

### adjacent-vertical — *Two angles are both adjacent and vertical.* — never

"Adjacent angles share a side; vertical angles share only the vertex." The verdict is solid and the WHY is exactly the right two clauses, set side by side so the incompatibility is visible rather than asserted.

A student answering "sometimes" is looking at the X of two crossing lines and seeing four angles that all seem to touch — the vertical pair does meet, at the vertex, and "adjacent" gets read as "nearby" rather than as the technical term. That is the whole confusion, and it is a common one, because the same figure contains both relations: adjacent pairs *and* vertical pairs live in one X, and the student must keep track of which pair is which.

This is a strong candidate for a figure, and it has none. One crossing with the vertical pair marked in one colour and an adjacent pair in another would settle it permanently. In text, the student has to build the X themselves and then run two definitions over it, which is more working memory than the question deserves.

### midpoint-two — *A segment has exactly one midpoint.* — always

"Only one point divides it into two congruent halves." Correct and unglamorous.

The value is in what it rules out, and it pairs deliberately with `bisector-perp`: a segment has exactly one midpoint but infinitely many bisectors, because a bisector is any line through that point. A student who answers "sometimes" is usually thinking of bisectors and has fused the two ideas; one who answers "never" has misread "exactly one" as some uniqueness claim they doubt.

The WHY is thin, though. "Only one point divides it into two congruent halves" restates the verdict more than it justifies it — the student is not shown *why* a second such point is impossible (any other point is nearer one endpoint than the other). One more clause would turn an assertion into an argument, and this is an item where the argument is short enough to give.

No figure; the statement is about uniqueness, and a drawn midpoint shows existence, not uniqueness.

### bisector-perp — *A segment bisector is perpendicular to the segment.* — sometimes

"Every perpendicular bisector is a bisector, but a bisector may cross at any angle." Correct, and the sentence is doing containment work: perpendicular bisectors are a subset, so the property holds on part of the range and fails on the rest, which is the shape of every *sometimes*.

The error this targets is specific and widespread: students meet the phrase "perpendicular bisector" as a unit, and the adjective quietly migrates into the noun. A student answering "always" has done exactly that. One answering "never" has over-corrected after being told a bisector need not be perpendicular.

The item is the natural partner to `midpoint-two` and to the `bisector-midpoint` counterexample, which asks the same question in constructive form. Three passes at one idea, from three angles, is good design — unlike the collinearity duplication, these three are genuinely different tasks.

A figure would help: two or three lines through one midpoint at different angles, one of them square-marked. Text alone asks the student to imagine a pencil rotating about a point.

### two-points-collinear — *Two points are collinear.* — always

"A line can always be drawn through any two points." This is the postulate doing work, and the item is better than it looks: it forces the student to apply the definition of collinear to a case where their intuition says the word does not apply.

A student answering "sometimes" almost always thinks *collinear* requires three points, or requires the points to be "lined up" in some way that two points could fail — they are treating collinearity as a coincidence rather than as a fact about whether a line exists. That is the misconception, and it is worth a card precisely because the statement sounds trivial or even malformed until you check the definition.

It is also the setup for `three-points-collinear`, and the two together make the sharpest point in the family: two is guaranteed, three is the first number that can fail. Sequencing matters here; a session that shows one without the other loses half the value, and the deck's sampling does not guarantee both appear.

No figure; drawing it would give the answer away.

### three-points-collinear — *Three points are collinear.* — sometimes

"Two points always line up; three is the first number that can fail." The best-written WHY of the twelve, because it does not just justify the verdict — it locates it, explaining where the boundary sits and why this particular number is interesting.

As noted, this duplicates `collinear-xyz` in substance. Given that, this is the version to keep: it explicitly references the two-point case and so completes the pair with `two-points-collinear`, whereas `collinear-xyz` stands alone and explains the meaning of *sometimes* in general terms that could sit on any item.

A student answering "always" has generalised the two-point postulate one step too far, which is exactly the trap the pairing sets and then springs. A student answering "never" has assumed three arbitrary points must be in general position — the opposite over-generalisation, and rarer.

No figure, correctly: the *sometimes* verdict requires the student to produce two pictures, and being handed one would collapse the task.

### supplementary-acute — *Two supplementary angles are both acute.* — never

"Each acute angle is under 90°, so two of them total less than 180° and cannot be supplementary." Airtight, and the WHY shows the inequality rather than asserting the verdict — the best-argued of the three *never* items.

The confusion targeted is supplementary-versus-complementary, and it is a good target because the statement becomes *always* true under the swap: two complementary angles are indeed both acute, necessarily. So a student who mixes the terms does not merely get the wrong answer, they get the opposite answer with full confidence. That is the most instructive possible failure mode, and it is worth the explanation saying so — as written, the WHY proves the *never* but never names the complementary case the student was probably thinking of.

A student answering "sometimes" is likely picturing 90° and 90° and miscounting a right angle as acute. No figure needed; the arithmetic is the argument, and two drawn angles would only be one instance.

## Counterexample

*Which case is a counterexample to the claim above?*, with the claim in a single quoted panel and four cases below. The family teaches one move — satisfy the hypothesis, break the conclusion — and every item is built so that the distractors fail in one of two distinct ways: they **confirm** the claim, or they **abandon the hypothesis**. That two-way structure is the best thing about this family, and the explanations name it explicitly on three of the five.

### segment-addition

Claim: "If A, B and C are collinear, then AB + BC = AC." Options: AB = 3, BC = 1, AC = 4 · AB = 2, BC = 2, AC = 4 · AB > AC · A, B and C are not collinear. Correct: **AB > AC**.

**The trap is option D**, "A, B and C are not collinear", and the WHY says so by name: it "abandons the hypothesis instead of testing it." This is the most explicit statement of the principle anywhere in the batch, and it earns its place because option D is genuinely tempting — it looks like disagreement with the claim, and a student who has not internalised that a counterexample must live *inside* the hypothesis will take it. Options A and B are confirmations: both sum correctly, so both illustrate the claim rather than testing it.

The right answer works because collinearity does not imply betweenness — put C between A and B and AB exceeds AC. That is the `collinear` conditional's converse, cashed out numerically. My one reservation is cosmetic: three options are numeric triples and the correct one is a bare inequality, so a test-wise student can spot the odd one out without reasoning. No figure, and a figure would give it away outright.

### supplementary-right

Claim: "If two angles are supplementary, then each measures 90°." Options: 90° and 90° · 100° and 80° · 45° and 45° · 120° and 70°. Correct: **100° and 80°**.

Every option is the same shape, so there is no formatting tell — the cleanest-constructed item of the five. The failure modes are well distributed: 90/90 satisfies both hypothesis and conclusion and is therefore a confirmation; 45/45 totals 90° and 120/70 totals 190°, so neither pair is supplementary at all and neither tests anything. The WHY states this precisely: they "never satisfy the hypothesis and test nothing."

Here the hypothesis-abandoning trap is arithmetic rather than rhetorical — the student has to actually add. That is a virtue: it makes "satisfies the hypothesis" a thing you *check* rather than a thing you assent to. A student who picks 45/45 is probably reasoning "these aren't 90°, so they break the conclusion" and never testing the antecedent, which is the exact half-a-job this family exists to correct.

No figure. Drawing the angle pairs would let the student answer by eye and skip the arithmetic that is the point.

### congruent-vertical

Claim: "If two angles are congruent, then they are vertical angles." Options: two 50° angles in different figures · two vertical angles at a crossing · a 50° angle and a 130° angle · two adjacent angles on a line measuring 120° and 60°. Correct: **two 50° angles in different figures**.

**The trap is option B**, "two vertical angles at a crossing", and the WHY names it: it confirms the claim rather than attacking it. That is the other failure mode, and this item is where it is cleanest — option B satisfies hypothesis *and* conclusion, so a student who is only checking "is this consistent with the claim?" will choose it. Options C and D are not congruent pairs and so fail the hypothesis; pinning D's measures at 120° and 60° is what keeps it a distractor rather than a second correct answer, since an unspecified adjacent pair could be two right angles, which would be congruent and not vertical.

A figure would suit the *wrong* half of this item and is rightly absent; the correct answer's whole force is that the two angles are in different figures, which no single drawing shows.

### midpoint-converse

Claim: "If AM ≅ MB, then M is the midpoint of AB." Options: M is the point of AB with AM = MB · M sits off the segment, the same distance from A as from B · M is one of the endpoints A or B · AM and MB have different lengths. Correct: **M sits off the segment, equidistant**.

The best item in the batch. Option A is a confirmation — it is the midpoint, described. Option D, "different lengths", is the pure hypothesis-abandoner: it denies the antecedent outright. Option C is the interesting near-miss: an endpoint gives AM = 0 and MB = AB, so it fails the hypothesis too, but a student has to compute that rather than see it.

The explanation is the longest and most substantial in the tab, and it does three things at once: it gives the counterexample, generalises it to the whole perpendicular bisector ("every point of the perpendicular bisector of AB is equally far from A and from B, and only one of them is the midpoint"), and then closes the loop back to the `midpoint` conditional — "this is why the definition of a midpoint says the point lies on the segment — with that clause it works in both directions, and without it the converse fails." That is the tab teaching across its own card types, which nothing else here does.

**This is the single strongest case for a figure anywhere in the batch, and there is none.** The explanation describes a locus in prose; one drawing — segment AB, its perpendicular bisector, two or three points marked on it — would carry the whole argument.

### bisector-midpoint

Claim: "If a line passes through the midpoint of a segment, it is perpendicular to it." Options: a line through the midpoint at 90° · a line through the midpoint at 40° · a line that misses the segment · a line through an endpoint. Correct: **a line through the midpoint at 40°**.

Structurally the tidiest of the five: one confirmation (at 90°), two hypothesis-abandoners (misses the segment; through an endpoint), one true counterexample. Having *two* abandoners makes the pattern hard to miss if the student is paying attention, and the pair of them fail in different ways — one never meets the segment at all, the other meets it at the wrong point.

The WHY is the thinnest in the family: "It passes through the midpoint, honouring the hypothesis, but meets at 40° rather than 90°." That justifies the right answer but never says why options C and D are wrong, which is the part the family is supposed to be teaching, and which `segment-addition` and `congruent-vertical` both do explicitly for their traps. The inconsistency is the thing to fix — one added clause ("C and D never pass through the midpoint, so they leave the hypothesis untested") would bring it into line.

A figure would help: a midpoint with a square-marked line and a slanted one through it. It would also make the 40° concrete rather than nominal.

## Law of Syllogism

Two context lines in the panel — the two conditionals of the chain — then *What follows by the Law of Syllogism?* and four options. The option set always includes "Nothing follows — the middle terms do not match.", and the correct answer, when there is one, is p → r. The explanation is the same on every card: "Syllogism chains two rules through the shared middle term — the same move as the transitive property, one level up. It fails if the middle terms do not match exactly."

That sentence is good — linking syllogism to the transitive property is exactly the connection a Module 2 student needs, since they already run *if a = b and b = c then a = c* mechanically and do not realise they are doing the same thing. Naming it "one level up" is the right framing.

**The structural problem is the "Nothing follows" option.** It appears on every card and, across the observed sample, is never correct. Its own explanation tells the student the exact circumstance under which it *would* be — mismatched middle terms — and the deck then never produces that circumstance, because all five authored sources are well-formed chains. A student learns within three cards that the honest-looking option is always wrong, and the mismatch case, which is the only real failure mode of the law, is never actually exercised. One authored non-chain (say, *linear pair → supplementary* paired with *vertical angles → congruent*) would fix this and would be the highest-value addition to the whole tab.

Two positives on the mechanics. Options are shuffled per render — the sample shows `syll:midpoint` twice with different orderings and different correct indices — so there is no position bias to exploit. And the distractor patterns are well chosen: the converse of the conclusion (r → p) recurs, as does the reversal of one link, so the student must track direction and not merely spot the shared term.

No figures anywhere in this family, and none are wanted: a syllogism is a shape, and the chains that have figures available (`vertical`, `midpoint`, `linear`) would invite the student to answer from geometric knowledge instead of from the form.

### rain — *it rains → the pitch floods → the match is cancelled*

The only non-geometric chain, and the most valuable one for that reason. With no geometry to fall back on, the student cannot recognise the conclusion as a fact they already know; they have to follow the form. Every other chain in the set can be answered by a student who simply knows the endpoint is true, which means those cards test recall as much as reasoning.

It also makes the *direction* problem visible. "If the match is cancelled, then it rained" is obviously wrong here in a way that "if two angles have equal measure, then they are vertical angles" is not — geometric content can make a reversed conditional sound plausible, whereas everyday content makes it sound absurd. A student who meets `rain` first has a clear model of what the reversal error feels like before hitting the cases where it is camouflaged.

Nothing to hold in the head but p, q and r. Obviously no figure. If the deck can only guarantee one syllogism card per session, this is the one to guarantee.

### vertical — *are vertical angles → are congruent → have equal measure*

From the observed card: the panel shows both links, the answer is "If two angles are vertical angles, then they have equal measure", and the distractors are the converse of link one, the double reversal ("If two angles have equal measure, then they are vertical angles"), and "Nothing follows".

The double-reversal distractor is the sharp one — it uses the two *outer* terms, which is what the correct answer does, but in the wrong order. A student who has learned "keep the first and last, drop the middle" without attending to direction takes it. That is a real and specific error, and this card isolates it well.

The content is worth chaining, too: it joins the Vertical Angles Theorem to the definition of congruence, producing the line a proof actually writes. And the false converse the distractor offers is the same claim the `congruent-vertical` counterexample demolishes, so a student who has done both meets it twice in different clothes.

No figure, deliberately — an X would let a student answer from the picture.

### midpoint — *M is the midpoint of AB → AM ≅ MB → AM = MB*

The best chain for transfer, because it is not an analogy for a proof step — it *is* two consecutive proof lines. A student writing a two-column proof cites definition of midpoint, then definition of congruent segments, and the syllogism says those two citations compress into one implication. Making that explicit is the most useful thing this card type does.

The observed cards offer the converse of link two ("If AM ≅ MB, then M is the midpoint of AB") as a distractor — which is exactly the claim the `midpoint-converse` counterexample card proves false. A student who has seen both should reject it instantly; one who has not may find it plausible, since it is true only with the "lies on AB" clause the chain never mentions. That cross-reference is good deck design, but it depends on the sampling actually showing both cards in a session, which sixteen cards drawn from thirty-seven sources does not guarantee.

Both observed renders of this source were correct, with shuffled options. No figure needed.

### linear — *form a linear pair → are supplementary → have measures totalling 180°*

Structurally identical to `vertical` and `midpoint`: a named geometric relation, then a definitional unpacking, then a numeric statement. The conclusion — linear pair implies measures totalling 180° — is the one a student uses constantly when setting up an equation, and seeing it derived rather than memorised is worth something.

The item's hidden risk is the converse, which is false and well documented elsewhere in this batch (`linear-pair`'s topic note, `linear-supp`'s verdict). If the shuffled distractors include "If two angles have measures totalling 180°, then they form a linear pair", the student meets the third pass at that misconception. The chain itself, though, gives no warning that the links are one-directional — the Law of Syllogism as taught here says nothing about whether you may walk back up the chain, and a student might assume the composed conditional inherits reversibility from nowhere.

No figure. That three of five chains share this exact shape is the main variety complaint about the family.

### square — *is a square → is a rectangle → has four right angles*

The one categorical chain: containment between classes rather than unpacking a relation into a measure. That makes it a useful contrast with the other three geometric chains, and it pairs with the `square` conditional and `bicond:rectangle`, so the student sees the same three terms in three different logical roles across the tab.

It is also the chain where the reversal error is most seductive, because the second link's converse is *true* — a quadrilateral with four right angles is a rectangle. So a distractor running backwards through link two would be a true sentence that nevertheless does not follow by syllogism, which is the same "true but not licensed" trap the logical-equivalence family sets and under-explains. Handled well, this is a strong card; handled with only the generic WHY, the student who picks it learns nothing about why a true statement can still be the wrong answer.

Same caveat as the `square` conditional: squares and rectangles sit outside this module's vocabulary. No figure wanted.

## Tab 2 — Definitions and postulates

A true reveal-style flashcard over the same 39 concepts documented elsewhere, so only the format is at issue here. Kind filter chips (Everything / Definitions / Postulates / Properties / Theorems / Reasoning) let a student narrow to one family; a "Front: Term | Definition" toggle chooses the direction; the front shows one side with "Click to reveal", and the back shows the other side **plus the concept's figure and its caption**. Buttons are Show again / Got it.

Two observations. First, this is the only place in the Cards page where a figure appears at all, and it appears on the back — so the drill is verbal and the picture arrives as confirmation. Given how many Tab 1 items would be improved by a diagram, it is a little pointed that the figures exist and are used only here.

Second, the direction toggle is a real pedagogical choice handed to the student. Term → Definition is recall and is hard; Definition → Term is recognition and is much easier. Students left to choose will choose the easier direction, and the app does not nudge, alternate, or track which they used. With "Got it" self-graded and no score anywhere on the page, nothing distinguishes a student who has mastered the deck from one who has clicked through it. That is defensible for a deliberately low-stakes surface, but it means Tab 2 reports nothing back.
