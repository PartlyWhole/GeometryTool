# The story: how the concepts build on each other

The Concepts page no longer follows the reference's sections. The sections are a filing system — reasoning in §2, properties in §4, points in §5, segments in §6 — and read in that order most ideas turn up before anything has made them necessary. The same concepts are now told as a ladder: thirteen chapters, six for Module 2 and seven for Module 3, each rung supplying exactly what the next needs.

The data is in [`src/practice/content/story.ts`](../src/practice/content/story.ts). A test ([`tests/story.test.ts`](../tests/story.test.ts)) checks that every concept is told exactly once, in its own module, and never before the concepts it stands on.

## The idea underneath

A figure shows **where** things sit: on a line, beside each other, across a crossing. Every theorem in both modules turns that into a fact about **how big** they are.

| A fact about position (seen or marked) | becomes a fact about size (calculated) | by |
|---|---|---|
| B is between A and C | AB + BC = AC | Segment Addition Postulate |
| two angles form a linear pair | they total 180° | Linear Pair Theorem |
| two angles are vertical | they are congruent | Vertical Angles Theorem |
| two angles are corresponding, *and m ∥ n* | they are congruent | Corresponding Angles Postulate |
| two angles are alternate interior, *and m ∥ n* | they are congruent | Alternate Interior Angles Theorem |
| two angles are consecutive interior, *and m ∥ n* | they total 180° | Consecutive Interior Angles Theorem |

Proof is the machine that does the turning, and the properties of equality are its gears. Chapters 1–3 build the objects, Chapter 4 the gears, Chapter 5 the machine, and Chapters 6–8 run it.

Three threads run through the whole story, and the bridges name them when they come back:

- **Only what is marked counts.** Ticks, then arcs, then squares, then arrowheads. The same rule turns into the gap between induction and deduction: a figure can suggest a rule but can't establish one.
- **The same idea twice.** Angles repeat the segment story (size, parts adding to a whole, halving). Complements repeat supplements. The exterior pairs repeat the interior pairs.
- **The hypothesis does the work.** Segment addition needs *between*, angle addition needs *interior*, and the Corresponding Angles Postulate needs *parallel*. Each walkthrough shows what breaks when that condition is taken away.

## The chapters

| # | Chapter | The question it exists to answer |
|---|---|---|
| 1 | Measuring a segment | A figure is a drawing. How does it become something you can calculate with? |
| 2 | Angles: the same story again | Everything a segment could do — have a size, add up, be halved — can an angle do too? |
| 3 | Where angles sit, and what that makes them | When two angles share a vertex, what does their position alone tell you about their size? |
| 4 | The rules for moving an equation | Once a figure has handed you some equations, what are you allowed to do with them? |
| 5 | How do we know? | Every linear pair you have ever measured totals 180°. Is that enough to be sure? |
| 6 | From where they sit to how big they are | Which facts about position can proof turn into facts about measure? |
| 7 | Foundations *(Module 3)* | Module 3 is about lines that never meet and lines that meet square. What does it lean on that you already have? |
| 8 | Read the figure | Two lines, a transversal, eight angles. How do you say where one angle sits compared with another? |
| 9 | The first assumption | No Module 2 tool reaches from one crossing to another. What is the least that has to be assumed? |
| 10 | Derive and use the angle theorems | With the postulate carrying one angle across, how far can Module 2's two theorems take it? |
| 11 | Reverse it: tests for parallel lines | Every rule so far starts from m ∥ n. What would it take to prove two lines are parallel? |
| 12 | Exactly one line | Through a point off a line, how many lines are parallel to it, how many perpendicular — and how would you draw them? |
| 13 | Distance: the perpendicular bisector | Which points are exactly as far from one end of a segment as from the other? |

Each chapter opens with its question. Each concept opens with a **bridge**: why this idea, and why now, told from what came before. Each chapter ends with a **close**: what can now be done, and what still can't, which is the question the next chapter takes up. Each concept also lists what it **builds on**, and what it is **the same idea as**. Both are links, and a Module 3 concept can link back into Module 2 and return.

### The ladder at its steepest

The spine of the story is one long chain. In the old order it was broken up across four sections.

```mermaid
flowchart LR
  LP["Linear pair<br/>(180° read off the picture)"] --> IND["Inductive reasoning<br/>three pairs measured"]
  IND --> DED["Deductive reasoning<br/>straight angle + angle addition<br/>⇒ 180° for every pair"]
  DED --> SYL["Law of Syllogism<br/>180° + definition<br/>⇒ supplementary"]
  SYL --> LPT["Linear Pair Theorem<br/>(already proved; now named)"]
  LPT --> VAT["Vertical Angles Theorem<br/>two linear pairs − shared angle"]
  VAT --> CS["Congruent Supplements<br/>the same proof, stated generally"]
  CAP["Corresponding Angles Postulate<br/>the one link between crossings"] --> AIT["Alternate Interior<br/>= CAP + vertical angles"]
  VAT --> AIT
  CAP --> CIT["Consecutive Interior<br/>= CAP + linear pair"]
  LPT --> CIT
```

The walkthroughs were rewritten so that the chain is real and not just claimed:

- **Deductive reasoning** used to prove its example by citing the Vertical Angles Theorem, three chapters before that theorem is proved. It now proves the exact conjecture that *Inductive reasoning* ends on: every linear pair totals 180°. The proof uses the definition of a straight angle, the Angle Addition Postulate and substitution, and measures nothing.
- **Law of Syllogism** used the same forward reference. It now chains that proved 180° with the definition of supplementary, and what comes out is the Linear Pair Theorem, word for word.
- **Linear Pair Theorem** now opens by saying it has already been proved, and that it gets a name because every later theorem uses it.
- **Linear pair** says its "= 180" is read off the picture for now, and that it will be proved later.

## Module 3 follows the module breakdown

Module 3 covers all three lessons (textbook pp. 78–102): 3.1 parallel lines crossed by a transversal, 3.2 proving lines parallel, and 3.3 perpendicular lines and the perpendicular bisector. It follows the seven-stage progression from the module's four-pass concept breakdown (the `module3-handoff` bundle). That progression was derived by reading its "proved from" links bottom-up. Each stage is one chapter:

1. **Foundations.** One crossing (vertical angles and linear pairs as one tool), parallel and perpendicular lines and their marks, the Pythagorean Theorem, reflection.
2. **Read the figure.** The transversal, the two questions (interior or exterior; alternate or consecutive), and the five pair names they produce.
3. **The first assumption.** The Corresponding Angles Postulate, alone.
4. **Derive and use the angle theorems.** The four theorems, each as the postulate plus one Module 2 step. Then the flow proof, the two-value rule, and solving for an angle.
5. **Reverse it.** The converse, and why converses have to be earned. The Converse of the Corresponding Angles Postulate, assumed. The four converse theorems, proved from it. Finding x to make lines parallel. The Transitive Property of Parallel Lines, and two lines perpendicular to a third.
6. **Exactly one line.** The Parallel and Perpendicular Postulates, the parallel-line construction, and the Perpendicular Transversal Theorem.
7. **The perpendicular bisector.** Equidistance, the theorem and its converse (both proved with the Pythagorean Theorem), the two compass constructions, and length equations.

Practice follows the same stages:

- **Angle pairs** covers stages 2–4.
- **Parallel tests** covers stages 5–6: which test applies (with the forward theorem as the planted wrong answer), whether what is marked is enough, and what x makes the lines parallel.
- **Perpendicular bisector** covers stage 7: whether what is marked puts a point on the bisector, length equations, and why each construction works.
- **Proof** adds the converses, the transitive property, two perpendiculars, and the Perpendicular Transversal Theorem, all replayed through the strict proof checker. The book's reason tables (3.2 Task 3, 3.3 Tasks 1 and 2) become fill-in exercises.

Every generated figure is drawn at its own numbers. In particular, "is there enough to prove m ∥ n?" draws the lines parallel exactly when the measures prove it, and a test checks that.

Three judgment calls:

- **Foundations holds the Pythagorean Theorem and reflection**, as the progression puts them, even though nothing uses them until Chapter 13. Their bridges say so, and Chapter 13's bridges call them back. Moving them into Chapter 13 would make a steeper but tighter final chapter.
- **The Perpendicular Transversal Theorem stays in stage 6**, where the book puts it. The breakdown notes that by dependency it needs only the postulate. Its walkthrough says so; moving it to Chapter 10 would be a one-line change.
- **The two-value rule gets a name.** The book doesn't name it, but it is the idea most of the module's exercises use.

## What is borrowed from Terence Tao

As far as I could find, Tao hasn't published a school geometry sequence, so none of this reproduces a course of his. What it applies is the teaching he describes in his own writing.

**The ladder.** His public lecture *The Cosmic Distance Ladder* is built so that each rung supplies what the next rung measures with. That is the structure here: the bridges exist to say what the previous rung couldn't reach, and the chapter closes say what is still missing. ([lecture](https://terrytao.wordpress.com/2010/10/10/the-cosmic-distance-ladder-ver-4-1/), [the book](https://terrytao.wordpress.com/books/climbing-the-cosmic-distance-ladder/), [with 3Blue1Brown](https://www.3blue1brown.com/lessons/cosmic-distance-1/))

**Pre-rigorous, rigorous, post-rigorous.** Tao describes mathematical learning in three stages: intuition from examples; then formal proof; then intuition again, now backed by the proof. He also writes that rigour is there to destroy bad intuition while clarifying good intuition, not to replace intuition. ([There's more to mathematics than rigour and proofs](https://terrytao.wordpress.com/career-advice/theres-more-to-mathematics-than-rigour-and-proofs/)) The story moves through those stages on purpose:

1. Chapter 3 uses "= 180" and "vertical angles are equal" because the pictures show it. That is the pre-rigorous stage, and the text admits it.
2. Chapters 5 and 6 earn both claims. That is the rigorous stage.
3. Chapter 8 ends on a post-rigorous view: every angle in the figure equals ∠1 or makes 180° with it, readable at a glance.

The nearly-parallel figure and the tick marks that go missing in the inductive walkthrough are examples of rigour destroying bad intuition.

**Ask yourself dumb questions.** Tao recommends asking what happens if a hypothesis is removed, where a proof uses each hypothesis, and what the degenerate cases are. ([Ask yourself dumb questions – and answer them!](https://terrytao.wordpress.com/career-advice/ask-yourself-dumb-questions-and-answer-them/)) Three walkthrough steps were added to ask them:

- *Alternate Interior Angles Theorem*: "Where did the proof use m ∥ n?" Only in its first step. Then the same pair is shown on lines that aren't parallel.
- *Consecutive Interior Angles Theorem*: the degenerate case, a perpendicular transversal, where every pair is congruent and supplementary at once. It has its own figure.
- *Corresponding Angles Postulate*: why this rule is the one accepted without proof, when any of the five could be. This is Tao's question of whether method X can be replaced by method Y. It is also the reference's Turn and Talk.

Removing the hypothesis was already in place in several walkthroughs: B outside AC for segment addition, lines that aren't parallel for the postulate, a point equidistant from A and B but off the segment for the midpoint.

**Recognise an old problem.** Tao's problem-solving advice is to look for an earlier problem with the same structure, and to find the objective before the method. ([Solving Mathematical Problems](https://terrytao.wordpress.com/books/solving-mathematical-problems/)) That is where the "The same idea as" links come from, and why Chapter 2's title calls it the same story again. It is also why each Module 3 theorem is presented as the postulate plus one Module 2 theorem, rather than as something new. The *Proof* walkthrough already reads the given and the goal before writing any lines.

**Dependencies as a graph.** In Tao's Lean formalisation projects, the proof is organised as a "blueprint": a graph of which results rest on which. ([blueprint posts](https://terrytao.wordpress.com/tag/blueprint/)) `NEEDS` in `story.ts` is that graph for this curriculum, and the test is what keeps the story honest about it.

## Every dependency

An arrow means the later concept's explanation uses the earlier one. The graph is generated from `NEEDS`; `ECHOES` (same idea, different clothing) is kept separately and is not drawn here.

<details>
<summary>The full graph (78 concepts)</summary>

```mermaid
flowchart TB
  subgraph ch1["1 · Measuring a segment"]
    point_and_line["Point and line"]
    collinear["Collinear"]
    segment_addition["Segment Addition Postulate"]
    congruent_segments["Congruent segments"]
    midpoint["Midpoint"]
    segment_bisector["Segment bisector"]
  end
  subgraph ch2["2 · Angles: the same story again"]
    right["Right angle"]
    acute["Acute angle"]
    obtuse["Obtuse angle"]
    straight["Straight angle"]
    congruent_angles["Congruent angles"]
    angle_addition["Angle Addition Postulate"]
    angle_bisector["Angle bisector"]
  end
  subgraph ch3["3 · Where angles sit, and what that makes them"]
    adjacent["Adjacent angles"]
    linear_pair["Linear pair"]
    vertical_angles["Vertical angles"]
    supplementary["Supplementary angles"]
    complementary["Complementary angles"]
    perpendicular["Perpendicular"]
    perpendicular_bisector["Perpendicular bisector"]
    angles_around_point["Angles around a point"]
  end
  subgraph ch4["4 · The rules for moving an equation"]
    reflexive["Reflexive Property"]
    symmetric["Symmetric Property"]
    transitive["Transitive Property"]
    substitution["Substitution Property"]
    addition_property["Addition Property of Equality"]
    subtraction_property["Subtraction Property of Equality"]
    multiplication_property["Multiplication Property of Equality"]
    division_property["Division Property of Equality"]
    distributive["Distributive Property"]
  end
  subgraph ch5["5 · How do we know?"]
    inductive["Inductive reasoning"]
    deductive["Deductive reasoning"]
    syllogism["Law of Syllogism"]
    proof["Proof"]
  end
  subgraph ch6["6 · From where they sit to how big they are"]
    linear_pair_theorem["Linear Pair Theorem"]
    vertical_angles_theorem["Vertical Angles Theorem"]
    congruent_supplements["Congruent Supplements Theorem"]
    congruent_complements["Congruent Complements Theorem"]
    right_angle_congruence["Right Angle Congruence Theorem"]
  end
  subgraph ch7["7 · Foundations"]
    angles_at_a_crossing["Four angles at a crossing"]
    parallel_lines["Parallel lines"]
    perpendicular_lines["Perpendicular lines"]
    pythagorean["Pythagorean Theorem"]
    reflection["Reflection"]
  end
  subgraph ch8["8 · Read the figure"]
    transversal["Transversal"]
    interior_exterior["Interior and exterior angles"]
    alternate_consecutive["Alternate and consecutive angles"]
    corresponding_angles["Corresponding angles"]
    alternate_interior["Alternate interior angles"]
    consecutive_interior["Consecutive interior angles"]
    alternate_exterior["Alternate exterior angles"]
    consecutive_exterior["Consecutive exterior angles"]
  end
  subgraph ch9["9 · The first assumption"]
    corresponding_angles_postulate["Corresponding Angles Postulate"]
  end
  subgraph ch10["10 · Derive and use the angle theorems"]
    alt_interior_theorem["Alternate Interior Angles Theorem"]
    flow_proof["Flow proof"]
    alt_exterior_theorem["Alternate Exterior Angles Theorem"]
    cons_interior_theorem["Consecutive Interior Angles Theorem"]
    cons_exterior_theorem["Consecutive Exterior Angles Theorem"]
    two_value_rule["The two-value rule"]
    angle_equations["Solving for an unknown angle"]
  end
  subgraph ch11["11 · Reverse it: tests for parallel lines"]
    converse["Converse"]
    converse_cap["Converse of the Corresponding Angles Postulate"]
    converse_ait["Converse of the Alternate Interior Angles Theorem"]
    converse_aet["Converse of the Alternate Exterior Angles Theorem"]
    converse_cit["Converse of the Consecutive Interior Angles Theorem"]
    converse_cet["Converse of the Consecutive Exterior Angles Theorem"]
    parallel_equations["Finding x that makes lines parallel"]
    transitive_parallel["Transitive Property of Parallel Lines"]
    perp_to_same_line["Two lines perpendicular to a third"]
  end
  subgraph ch12["12 · Exactly one line"]
    parallel_postulate["Parallel Postulate"]
    construct_parallel["Constructing a parallel through a point"]
    perpendicular_postulate["Perpendicular Postulate"]
    perp_transversal_theorem["Perpendicular Transversal Theorem"]
  end
  subgraph ch13["13 · Distance: the perpendicular bisector"]
    equidistant["Equidistant"]
    perp_bisector_theorem["Perpendicular Bisector Theorem"]
    converse_perp_bisector["Converse of the Perpendicular Bisector Theorem"]
    construct_perp_bisector["Constructing a perpendicular bisector"]
    construct_perp_through_point["Constructing a perpendicular through a point"]
    length_equations["Solving for an unknown length"]
  end
  point_and_line --> collinear
  collinear --> segment_addition
  point_and_line --> congruent_segments
  segment_addition --> midpoint
  congruent_segments --> midpoint
  midpoint --> segment_bisector
  point_and_line --> right
  right --> acute
  right --> obtuse
  obtuse --> straight
  collinear --> straight
  right --> congruent_angles
  right --> angle_addition
  angle_addition --> angle_bisector
  congruent_angles --> angle_bisector
  angle_addition --> adjacent
  adjacent --> linear_pair
  straight --> linear_pair
  linear_pair --> vertical_angles
  linear_pair --> supplementary
  supplementary --> complementary
  right --> complementary
  right --> perpendicular
  linear_pair --> perpendicular
  segment_bisector --> perpendicular_bisector
  perpendicular --> perpendicular_bisector
  angle_addition --> angles_around_point
  straight --> angles_around_point
  angle_addition --> reflexive
  congruent_segments --> symmetric
  congruent_segments --> transitive
  transitive --> substitution
  segment_addition --> substitution
  reflexive --> addition_property
  congruent_angles --> addition_property
  angle_addition --> addition_property
  addition_property --> subtraction_property
  linear_pair --> subtraction_property
  midpoint --> multiplication_property
  multiplication_property --> division_property
  angle_bisector --> division_property
  multiplication_property --> distributive
  segment_addition --> distributive
  linear_pair --> inductive
  congruent_segments --> inductive
  inductive --> deductive
  angle_addition --> deductive
  straight --> deductive
  substitution --> deductive
  deductive --> syllogism
  supplementary --> syllogism
  transitive --> syllogism
  syllogism --> proof
  reflexive --> proof
  addition_property --> proof
  substitution --> proof
  congruent_angles --> proof
  syllogism --> linear_pair_theorem
  supplementary --> linear_pair_theorem
  linear_pair_theorem --> vertical_angles_theorem
  vertical_angles --> vertical_angles_theorem
  substitution --> vertical_angles_theorem
  subtraction_property --> vertical_angles_theorem
  proof --> vertical_angles_theorem
  vertical_angles_theorem --> congruent_supplements
  supplementary --> congruent_supplements
  congruent_supplements --> congruent_complements
  complementary --> congruent_complements
  right --> right_angle_congruence
  transitive --> right_angle_congruence
  vertical_angles_theorem --> angles_at_a_crossing
  linear_pair_theorem --> angles_at_a_crossing
  point_and_line --> parallel_lines
  congruent_segments --> parallel_lines
  angles_at_a_crossing --> perpendicular_lines
  perpendicular --> perpendicular_lines
  right --> perpendicular_lines
  right --> pythagorean
  perpendicular_lines --> pythagorean
  midpoint --> reflection
  perpendicular_bisector --> reflection
  congruent_segments --> reflection
  point_and_line --> transversal
  angles_at_a_crossing --> transversal
  transversal --> interior_exterior
  transversal --> alternate_consecutive
  interior_exterior --> corresponding_angles
  alternate_consecutive --> corresponding_angles
  interior_exterior --> alternate_interior
  alternate_consecutive --> alternate_interior
  linear_pair --> alternate_interior
  interior_exterior --> consecutive_interior
  alternate_consecutive --> consecutive_interior
  interior_exterior --> alternate_exterior
  alternate_consecutive --> alternate_exterior
  interior_exterior --> consecutive_exterior
  alternate_consecutive --> consecutive_exterior
  parallel_lines --> corresponding_angles_postulate
  corresponding_angles --> corresponding_angles_postulate
  congruent_angles --> corresponding_angles_postulate
  corresponding_angles_postulate --> alt_interior_theorem
  alternate_interior --> alt_interior_theorem
  vertical_angles_theorem --> alt_interior_theorem
  transitive --> alt_interior_theorem
  proof --> flow_proof
  alt_interior_theorem --> flow_proof
  corresponding_angles_postulate --> alt_exterior_theorem
  alternate_exterior --> alt_exterior_theorem
  vertical_angles_theorem --> alt_exterior_theorem
  transitive --> alt_exterior_theorem
  corresponding_angles_postulate --> cons_interior_theorem
  consecutive_interior --> cons_interior_theorem
  linear_pair_theorem --> cons_interior_theorem
  substitution --> cons_interior_theorem
  supplementary --> cons_interior_theorem
  corresponding_angles_postulate --> cons_exterior_theorem
  consecutive_exterior --> cons_exterior_theorem
  linear_pair_theorem --> cons_exterior_theorem
  substitution --> cons_exterior_theorem
  supplementary --> cons_exterior_theorem
  alt_interior_theorem --> two_value_rule
  alt_exterior_theorem --> two_value_rule
  cons_interior_theorem --> two_value_rule
  cons_exterior_theorem --> two_value_rule
  angles_at_a_crossing --> two_value_rule
  two_value_rule --> angle_equations
  subtraction_property --> angle_equations
  division_property --> angle_equations
  deductive --> converse
  vertical_angles_theorem --> converse
  congruent_angles --> converse
  corresponding_angles_postulate --> converse
  converse --> converse_cap
  corresponding_angles_postulate --> converse_cap
  converse_cap --> converse_ait
  alternate_interior --> converse_ait
  vertical_angles_theorem --> converse_ait
  transitive --> converse_ait
  converse_cap --> converse_aet
  alternate_exterior --> converse_aet
  vertical_angles_theorem --> converse_aet
  transitive --> converse_aet
  converse_cap --> converse_cit
  consecutive_interior --> converse_cit
  linear_pair_theorem --> converse_cit
  congruent_supplements --> converse_cit
  converse_cap --> converse_cet
  consecutive_exterior --> converse_cet
  linear_pair_theorem --> converse_cet
  congruent_supplements --> converse_cet
  converse_ait --> parallel_equations
  converse_cit --> parallel_equations
  angle_equations --> parallel_equations
  converse_cap --> transitive_parallel
  corresponding_angles_postulate --> transitive_parallel
  transitive --> transitive_parallel
  converse_cap --> perp_to_same_line
  perpendicular_lines --> perp_to_same_line
  right_angle_congruence --> perp_to_same_line
  converse_cap --> parallel_postulate
  parallel_lines --> parallel_postulate
  parallel_postulate --> construct_parallel
  converse_cap --> construct_parallel
  perpendicular_lines --> perpendicular_postulate
  parallel_postulate --> perpendicular_postulate
  corresponding_angles_postulate --> perp_transversal_theorem
  perpendicular_lines --> perp_transversal_theorem
  congruent_segments --> equidistant
  reflection --> equidistant
  equidistant --> perp_bisector_theorem
  perpendicular_bisector --> perp_bisector_theorem
  pythagorean --> perp_bisector_theorem
  perp_bisector_theorem --> converse_perp_bisector
  perpendicular_postulate --> converse_perp_bisector
  converse --> converse_perp_bisector
  pythagorean --> converse_perp_bisector
  converse_perp_bisector --> construct_perp_bisector
  construct_perp_bisector --> construct_perp_through_point
  converse_perp_bisector --> construct_perp_through_point
  perp_bisector_theorem --> length_equations
  converse_perp_bisector --> length_equations
  angle_equations --> length_equations
```

</details>

## Decisions worth revisiting

- **Reasoning comes after the objects, not first.** The reference opens with §2 and §3. Here inductive and deductive reasoning arrive in Chapter 5, once there are claims worth doubting. That is when "is that enough to be sure?" has something to be about.
- **The properties of equality come before reasoning.** Deduction uses substitution, so the gears have to exist before the machine does.
- **The perpendicular bisector moved to Chapter 3.** It needs *perpendicular*, and it lands there as a callback to Chapter 1's bisector.
- **Chapter numbering runs across both modules.** Module 3 opens at Chapter 7 and runs to 13. That is deliberate: it says Module 3 continues the story rather than starting a new one.
- **The Definitions flip deck is dealt in story order** on its first pass. The Practice quizzes stay shuffled, because retrieval practice benefits from mixing.
