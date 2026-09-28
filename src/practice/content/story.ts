// The order the concepts are told in, and why.
//
// The reference's sections are a filing system: reasoning in §2, properties
// in §4, points in §5, segments in §6. Read in that order, most ideas arrive
// before anything has made them necessary. This file lays the same concepts
// out as a ladder instead — each rung supplies exactly what the next one
// needs, and names what the last one could not reach. That is the structure
// of Terence Tao's cosmic distance ladder, and docs/NARRATIVE.md sets out the
// rest of what is borrowed from his teaching.
//
// One idea runs underneath all eight chapters. A figure shows where things
// sit — on a line, beside each other, across a crossing — and every theorem
// turns that into a fact about how big they are. Proof is the machine that
// does the turning, and the properties of equality are its gears.

/**
 * What a concept stands on: the ideas a student must already have to follow
 * its explanation, as the walkthroughs actually write it. A test checks that
 * every one of them is told earlier in the story.
 */
export const NEEDS: Record<string, string[]> = {
  // Chapter 1
  "point-and-line": [],
  collinear: ["point-and-line"],
  "segment-addition": ["collinear"],
  "congruent-segments": ["point-and-line"],
  midpoint: ["segment-addition", "congruent-segments"],
  "segment-bisector": ["midpoint"],
  // Chapter 2
  right: ["point-and-line"],
  acute: ["right"],
  obtuse: ["right"],
  straight: ["obtuse", "collinear"],
  "congruent-angles": ["right"],
  "angle-addition": ["right"],
  "angle-bisector": ["angle-addition", "congruent-angles"],
  // Chapter 3
  adjacent: ["angle-addition"],
  "linear-pair": ["adjacent", "straight"],
  "vertical-angles": ["linear-pair"],
  supplementary: ["linear-pair"],
  complementary: ["supplementary", "right"],
  perpendicular: ["right", "linear-pair"],
  "perpendicular-bisector": ["segment-bisector", "perpendicular"],
  "angles-around-point": ["angle-addition", "straight"],
  // Chapter 4
  reflexive: ["angle-addition"],
  symmetric: ["congruent-segments"],
  transitive: ["congruent-segments"],
  substitution: ["transitive", "segment-addition"],
  "addition-property": ["reflexive", "congruent-angles", "angle-addition"],
  "subtraction-property": ["addition-property", "linear-pair"],
  "multiplication-property": ["midpoint"],
  "division-property": ["multiplication-property", "angle-bisector"],
  distributive: ["multiplication-property", "segment-addition"],
  // Chapter 5
  inductive: ["linear-pair", "congruent-segments"],
  deductive: ["inductive", "angle-addition", "straight", "substitution"],
  syllogism: ["deductive", "supplementary", "transitive"],
  proof: ["syllogism", "reflexive", "addition-property", "substitution", "congruent-angles"],
  // Chapter 6
  "linear-pair-theorem": ["syllogism", "supplementary"],
  "vertical-angles-theorem": ["linear-pair-theorem", "vertical-angles", "substitution", "subtraction-property", "proof"],
  "congruent-supplements": ["vertical-angles-theorem", "supplementary"],
  "congruent-complements": ["congruent-supplements", "complementary"],
  "right-angle-congruence": ["right", "transitive"],
  // Chapter 7
  transversal: ["point-and-line", "vertical-angles", "linear-pair"],
  "corresponding-angles": ["transversal"],
  "alternate-interior": ["transversal", "linear-pair"],
  "consecutive-interior": ["transversal"],
  "alternate-exterior": ["transversal"],
  "consecutive-exterior": ["transversal"],
  // Chapter 8
  "parallel-lines": ["point-and-line", "congruent-segments"],
  "corresponding-angles-postulate": ["parallel-lines", "corresponding-angles", "congruent-angles"],
  "alt-interior-theorem": ["corresponding-angles-postulate", "alternate-interior", "vertical-angles-theorem", "transitive"],
  "flow-proof": ["proof", "alt-interior-theorem"],
  "alt-exterior-theorem": ["corresponding-angles-postulate", "alternate-exterior", "vertical-angles-theorem", "transitive"],
  "cons-interior-theorem": ["corresponding-angles-postulate", "consecutive-interior", "linear-pair-theorem", "substitution", "supplementary"],
  "cons-exterior-theorem": ["corresponding-angles-postulate", "consecutive-exterior", "linear-pair-theorem", "substitution", "supplementary"],
};

/**
 * The same idea met again in different clothing — Tao's "have I seen this
 * problem before?". Each points back to the earlier of the two.
 */
export const ECHOES: Record<string, string[]> = {
  "congruent-angles": ["congruent-segments"],
  "angle-addition": ["segment-addition"],
  "angle-bisector": ["midpoint"],
  complementary: ["supplementary"],
  "perpendicular-bisector": ["segment-bisector"],
  "division-property": ["multiplication-property"],
  "subtraction-property": ["addition-property"],
  syllogism: ["transitive"],
  "congruent-complements": ["congruent-supplements"],
  "consecutive-interior": ["alternate-interior"],
  "alternate-exterior": ["alternate-interior"],
  "consecutive-exterior": ["consecutive-interior"],
  "parallel-lines": ["congruent-segments", "congruent-angles"],
  "flow-proof": ["proof"],
  "alt-exterior-theorem": ["alt-interior-theorem"],
  "cons-interior-theorem": ["vertical-angles-theorem"],
  "cons-exterior-theorem": ["cons-interior-theorem"],
};

export type Stop = {
  conceptId: string;
  /**
   * Why this concept, now — told from what came before. It names what the
   * previous rung could not do, or which old idea is about to return.
   */
  bridge: string;
};

export type Chapter = {
  id: string;
  module: 2 | 3;
  title: string;
  /** The question the chapter exists to answer. */
  question: string;
  stops: Stop[];
  /** What can now be done, and what still cannot — which the next chapter takes up. */
  close: string;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "segments",
    module: 2,
    title: "Measuring a segment",
    question: "A figure is a drawing. How does it become something you can calculate with?",
    stops: [
      { conceptId: "point-and-line", bridge: "Start with the least there is: a position, and the one straight path through two of them." },
      { conceptId: "collinear", bridge: "With a line in hand, the first thing to ask of some points is whether they lie on it. Two always do; three is where it gets interesting." },
      { conceptId: "segment-addition", bridge: "When three points share a line, one of them sits between the other two — and then the lengths start doing arithmetic. The condition is the whole story: watch what happens when it fails." },
      { conceptId: "congruent-segments", bridge: "Lengths can be added. The next question about two lengths is whether they are equal — and how a figure can say so without anyone measuring." },
      { conceptId: "midpoint", bridge: "Put the last two ideas together: a point between A and B whose two parts are congruent." },
      { conceptId: "segment-bisector", bridge: "A midpoint is a point. Whatever passes through it — a line, a ray, a segment, at any angle at all — is a bisector." },
    ],
    close: "A segment is now a number. Parts add up to the whole, tick marks say when two are equal, and a midpoint halves it. Every one of those ideas is about to happen again — to angles.",
  },
  {
    id: "angles",
    module: 2,
    title: "Angles: the same story again",
    question: "Everything a segment could do — have a size, add up, be halved — can an angle do too?",
    stops: [
      { conceptId: "right", bridge: "An angle's size is how far it opens. One size matters so much that a figure marks it rather than measures it." },
      { conceptId: "acute", bridge: "Held against the right angle, every other angle is smaller or larger. Smaller first." },
      { conceptId: "obtuse", bridge: "Larger than a right angle — but only up to a ceiling, and the ceiling is where the mistakes live." },
      { conceptId: "straight", bridge: "The ceiling itself: an angle whose sides run opposite ways. It looks like the line from the last chapter, and it is also an angle, of 180°." },
      { conceptId: "congruent-angles", bridge: "As with segments, the useful question about two angles is whether they are equal. Arcs do for angles what ticks did for segments." },
      { conceptId: "angle-addition", bridge: "The parts-and-whole of the last chapter, again: a ray inside an angle splits it and the measures add — provided the ray really is inside, just as B had to be between." },
      { conceptId: "angle-bisector", bridge: "And the midpoint, again: the one ray that splits an angle into two congruent parts." },
    ],
    close: "Angles now do everything segments did. They can also do something segments cannot: sit beside one another at a shared vertex. Where two angles sit turns out to decide how big they are.",
  },
  {
    id: "position",
    module: 2,
    title: "Where angles sit, and what that makes them",
    question: "When two angles share a vertex, what does their position alone tell you about their size?",
    stops: [
      { conceptId: "adjacent", bridge: "Angle addition put two angles side by side. That arrangement needs a name of its own." },
      { conceptId: "linear-pair", bridge: "Open adjacent angles until their outer sides form one straight line, and together they fill a straight angle: 180°. For now that number comes from the picture; it will be proved later." },
      { conceptId: "vertical-angles", bridge: "Two lines crossing make two linear pairs at once. Look across the crossing instead of along a line, and a different pair appears." },
      { conceptId: "supplementary", bridge: "A linear pair totals 180°. Keep the 180° and throw away the position, and the relationship that is left has its own name." },
      { conceptId: "complementary", bridge: "The same move at 90°." },
      { conceptId: "perpendicular", bridge: "Split a straight angle evenly and both halves are right angles. The two lines that make them are perpendicular." },
      { conceptId: "perpendicular-bisector", bridge: "The first chapter's bisector, turned to 90°: one line that carries two facts." },
      { conceptId: "angles-around-point", bridge: "Keep turning past the straight line and come all the way round the point: 360°." },
    ],
    close: "You have been writing “= 180” for a linear pair, and “≅” for vertical angles, because the pictures look that way. The pictures are right — but nothing yet says they must be. Earning that takes two new things: rules for moving equations about, and a way of reasoning that cannot be wrong.",
  },
  {
    id: "rules",
    module: 2,
    title: "The rules for moving an equation",
    question: "Once a figure has handed you some equations, what are you allowed to do with them?",
    stops: [
      { conceptId: "reflexive", bridge: "The smallest rule there is: a quantity equals itself. It sounds empty. Watch where it gets used." },
      { conceptId: "symmetric", bridge: "An equation read the other way round is still true." },
      { conceptId: "transitive", bridge: "Two equations that share a middle term chain into one." },
      { conceptId: "substitution", bridge: "A cousin of the chain that needs no shared middle: put in anything equal, wherever the old thing stood." },
      { conceptId: "addition-property", bridge: "Now change both sides at once. Add the same amount to each and the balance holds — the shared angle from angle addition, added to both parts." },
      { conceptId: "subtraction-property", bridge: "The same balance, run backwards: take the same amount away. It is the move that removes a shared piece." },
      { conceptId: "multiplication-property", bridge: "Scale both sides: the half that a midpoint gives becomes the whole." },
      { conceptId: "division-property", bridge: "And back again: the whole of a bisected angle becomes its half." },
      { conceptId: "distributive", bridge: "The last rule changes how an expression looks without changing what it is worth." },
    ],
    close: "These are the moves. What is still missing is the reason to trust a chain of them over a careful measurement — and that is the next chapter.",
  },
  {
    id: "knowing",
    module: 2,
    title: "How do we know?",
    question: "Every linear pair you have ever measured totals 180°. Is that enough to be sure?",
    stops: [
      { conceptId: "inductive", bridge: "Measure examples and a pattern appears. That is how ideas arrive — and it is not how they are settled." },
      { conceptId: "deductive", bridge: "Settle the linear-pair pattern for good, from a definition and a postulate, with nothing measured at all." },
      { conceptId: "syllogism", bridge: "Two rules that meet in the middle chain into a third. Chain the 180° you just proved with the definition of supplementary, and a theorem falls out." },
      { conceptId: "proof", bridge: "Write the chain down in full — what you were given, what you want, and a reason on every line between them." },
    ],
    close: "A pattern you measured has become a theorem you proved. The same method, applied to the other things the pictures claimed, gives the theorems of the next chapter — each one built from the one before.",
  },
  {
    id: "theorems",
    module: 2,
    title: "From where they sit to how big they are",
    question: "Which facts about position can proof turn into facts about measure?",
    stops: [
      { conceptId: "linear-pair-theorem", bridge: "You proved this in the last chapter. Here it gets its name, because every theorem after it leans on it." },
      { conceptId: "vertical-angles-theorem", bridge: "The other claim the pictures made: opposite angles at a crossing are equal. Two linear pairs and a subtraction prove it." },
      { conceptId: "congruent-supplements", bridge: "Look at what that proof actually used: two angles, each supplementary to a shared one. Say only that, and the same proof covers angles that never touch." },
      { conceptId: "congruent-complements", bridge: "The same theorem at 90°." },
      { conceptId: "right-angle-congruence", bridge: "The smallest theorem of all: two things each equal to 90 are equal to each other." },
    ],
    close: "Every theorem here takes something you can see — a line, a crossing, a square — and returns something you can calculate with. Module 3 does the same with a second crossing, and needs one new idea to do it.",
  },
  {
    id: "transversals",
    module: 3,
    title: "One line across two",
    question: "At one crossing you already know everything. What can be said about an angle at one crossing and an angle at another?",
    stops: [
      { conceptId: "transversal", bridge: "Add a line that crosses two others. Now there are two crossings and eight angles — and at each crossing, vertical angles and linear pairs already tell you everything." },
      { conceptId: "corresponding-angles", bridge: "The simplest link between the crossings is the same corner at each. Slide one crossing along t and it lands on the other." },
      { conceptId: "alternate-interior", bridge: "Two questions place any angle: which side of t, and between the lines or outside them. Between the lines, on opposite sides of t: that pair is next." },
      { conceptId: "consecutive-interior", bridge: "Change only the side: still between the lines, now on the same side of t." },
      { conceptId: "alternate-exterior", bridge: "Now move outside the lines, on opposite sides — the alternate interior pair, turned inside out." },
      { conceptId: "consecutive-exterior", bridge: "And outside the lines, on the same side. Two questions with two answers each, plus the same corner: every name there is." },
    ],
    close: "Five names, and every one is about position. None says anything about size: on lines that are not parallel, corresponding angles are not even equal. Something has to link one crossing to the other.",
  },
  {
    id: "parallel",
    module: 3,
    title: "What parallel lines buy",
    question: "What does it take to carry an angle from one crossing to the other — and once you can, what follows?",
    stops: [
      { conceptId: "parallel-lines", bridge: "The missing ingredient: two lines that never meet. As with ticks and arcs, only the mark counts." },
      { conceptId: "corresponding-angles-postulate", bridge: "No Module 2 tool reaches from one crossing to another. This one is accepted without proof: on parallel lines, corresponding angles are congruent." },
      { conceptId: "alt-interior-theorem", bridge: "One step across the lines with the postulate, one step within a crossing with a Module 2 theorem — vertical angles — and there is a new theorem." },
      { conceptId: "flow-proof", bridge: "The same proof drawn as boxes and arrows, the way the reference writes it, so its shape can be seen at once." },
      { conceptId: "alt-exterior-theorem", bridge: "The same two steps, outside the lines." },
      { conceptId: "cons-interior-theorem", bridge: "Swap the vertical pair for a linear pair, and the congruence becomes a supplement." },
      { conceptId: "cons-exterior-theorem", bridge: "And the same again, outside the lines." },
    ],
    close: "The postulate carried one angle across; Module 2's two theorems did everything else. Every angle is now either equal to ∠1 or makes 180° with it — two families you can read off any such figure at a glance.",
  },
];

/** Concept ids in the order the story tells them, for one module or both. */
export function storyOrder(module?: 2 | 3): string[] {
  return CHAPTERS.filter((c) => !module || c.module === module).flatMap((c) =>
    c.stops.map((s) => s.conceptId),
  );
}

export type Place = {
  chapter: Chapter;
  /** Position within the chapter. */
  index: number;
  stop: Stop;
  /** The next concept in the same module's story, if any. */
  next?: { chapter: Chapter; stop: Stop };
};

/** Where a concept sits in the story. */
export function placeOf(conceptId: string): Place | undefined {
  for (const chapter of CHAPTERS) {
    const index = chapter.stops.findIndex((s) => s.conceptId === conceptId);
    if (index < 0) continue;
    const later = chapter.stops[index + 1];
    let next: Place["next"];
    if (later) next = { chapter, stop: later };
    else {
      const following = CHAPTERS[CHAPTERS.indexOf(chapter) + 1];
      if (following && following.module === chapter.module)
        next = { chapter: following, stop: following.stops[0] };
    }
    return { chapter, index, stop: chapter.stops[index], next };
  }
  return undefined;
}

export const chapterNumber = (c: Chapter) => CHAPTERS.indexOf(c) + 1;
