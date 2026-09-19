// Flashcards for §1 and §2: conditional forms, equivalence, negation,
// counterexamples, always/sometimes/never, and the two laws of deduction.
import {
  ALWAYS_SOMETIMES_NEVER,
  CHAINS,
  CONDITIONALS,
  COUNTEREXAMPLES,
  FORM_LABEL,
  FORM_SYMBOLS,
  type FormKind,
  NEGATIONS,
  biconditionalText,
  chainText,
  equivalentForm,
  formText,
  sentenceOf,
} from "./logic";
import { rng } from "./generators";

export type LogicCard = {
  id: string;
  tag: string;
  /** Shown above the question, one line each, e.g. the premises. */
  context?: string[];
  prompt: string;
  choices: string[];
  correct: number;
  why: string;
  /**
   * Feedback aimed at the option actually chosen. Explaining all three wrong
   * answers at once buries the one the student needs.
   */
  whyPerChoice?: Record<number, string>;
};

const FORMS: FormKind[] = ["conditional", "converse", "inverse", "contrapositive"];

const shuffle = <T>(r: () => number, xs: T[]) => {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function logicCards(seed: number, count = 14): LogicCard[] {
  const r = rng(seed);
  const makers = [
    classifyCard,
    produceCard,
    equivalenceCard,
    biconditionalCard,
    negationCard,
    verdictCard,
    counterexampleCard,
    syllogismCard,
  ];
  const out: LogicCard[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 25) {
    const card = makers[Math.floor(r() * makers.length)](r);
    if (card && !out.some((c) => c.id === card.id)) out.push(card);
  }
  return out;
}

function classifyCard(r: () => number): LogicCard | undefined {
  const c = CONDITIONALS[Math.floor(r() * CONDITIONALS.length)];
  const form = FORMS[Math.floor(r() * 4)];
  if (form === "conditional") return;
  const choices = FORMS.map((f) => FORM_LABEL[f]);
  return {
    id: "classify:" + c.id + ":" + form,
    tag: "Conditional forms",
    context: ["Statement 1. " + formText(c, "conditional")],
    prompt: "Statement 2. " + formText(c, form) + "  —  What is Statement 2?",
    choices,
    correct: FORMS.indexOf(form),
    why:
      "Statement 2 is " + FORM_SYMBOLS[form] + ", so it is " + FORM_LABEL[form] +
      ". Classify by form, not by truth — a converse that happens to be true is still the converse." +
      (c.topic ? " " + c.topic : ""),
  };
}

function produceCard(r: () => number): LogicCard | undefined {
  const c = CONDITIONALS[Math.floor(r() * CONDITIONALS.length)];
  const want = FORMS[1 + Math.floor(r() * 3)];
  const choices = shuffle(r, FORMS.map((f) => formText(c, f)));
  return {
    id: "produce:" + c.id + ":" + want,
    tag: "Conditional forms",
    context: [formText(c, "conditional")],
    prompt: "Which statement is " + FORM_LABEL[want] + " (" + FORM_SYMBOLS[want] + ")?",
    choices,
    correct: choices.indexOf(formText(c, want)),
    why:
      FORM_LABEL[want] + " is " + FORM_SYMBOLS[want] + ": " +
      (want === "converse"
        ? "swap the two parts."
        : want === "inverse"
          ? "negate both parts, keeping the order."
          : "swap the parts and negate both."),
  };
}

function equivalenceCard(r: () => number): LogicCard | undefined {
  const c = CONDITIONALS[Math.floor(r() * CONDITIONALS.length)];
  const from = FORMS[Math.floor(r() * 4)];
  const want = equivalentForm[from];
  // The statement itself cannot be offered, so a fourth option keeps the card
  // the same shape as the others.
  const choices = shuffle(r, [
    ...FORMS.filter((f) => f !== from).map((f) => formText(c, f)),
    "None of these is logically equivalent to it.",
  ]);
  return {
    id: "equiv:" + c.id + ":" + from,
    tag: "Logical equivalence",
    context: [formText(c, from)],
    prompt: "Which statement is logically equivalent to the one above?",
    choices,
    correct: choices.indexOf(formText(c, want)),
    why:
      "A conditional and its contrapositive are logically equivalent; so are the converse and the inverse. The two pairs are independent of each other.",
  };
}

function biconditionalCard(r: () => number): LogicCard | undefined {
  const c = CONDITIONALS[Math.floor(r() * CONDITIONALS.length)];
  return {
    id: "bicond:" + c.id,
    tag: "Biconditional",
    context: [
      formText(c, "conditional"),
      "Its converse: " + formText(c, "converse"),
    ],
    prompt:
      "Can these be combined into the biconditional “" + biconditionalText(c) + "”?",
    choices: [
      "Yes — both the conditional and its converse are true",
      "No — the converse is false, so only one direction holds",
      "Yes — every conditional can be written as a biconditional",
      "No — biconditionals only apply to definitions",
    ],
    correct: c.converseTrue ? 0 : 1,
    why:
      "A biconditional is true only when the conditional and its converse are both true. " +
      (c.converseTrue
        ? "Here they are, which is what makes this a definition — usable in both directions."
        : "Here the converse fails, so the two cannot be combined.") +
      (c.topic ? " " + c.topic : ""),
  };
}

function negationCard(r: () => number): LogicCard | undefined {
  const n = NEGATIONS[Math.floor(r() * NEGATIONS.length)];
  const choices = shuffle(r, [n.correct, ...n.wrong.map((w) => w.text)]);
  const whyPerChoice: Record<number, string> = {};
  choices.forEach((text, i) => {
    const wrong = n.wrong.find((w) => w.text === text);
    if (wrong) whyPerChoice[i] = wrong.why;
  });
  return {
    id: "neg:" + n.id,
    tag: "Negation",
    context: [n.statement],
    prompt: "What is the negation of the statement above?",
    choices,
    correct: choices.indexOf(n.correct),
    why: "The negation says only that the statement fails — nothing more.",
    whyPerChoice,
  };
}

function verdictCard(r: () => number): LogicCard | undefined {
  const a = ALWAYS_SOMETIMES_NEVER[Math.floor(r() * ALWAYS_SOMETIMES_NEVER.length)];
  const choices = ["Always true", "Sometimes true", "Never true"];
  const correct = a.verdict === "always" ? 0 : a.verdict === "sometimes" ? 1 : 2;
  // Each verdict needs different evidence, so say what the chosen one would
  // have required rather than reciting all three rules on every card.
  const needs = [
    "For *always* you would have to argue it in every case.",
    "For *sometimes* you would have to produce both an example and a counterexample.",
    "For *never* you would have to show it contradicts a definition or theorem.",
  ];
  const whyPerChoice: Record<number, string> = {};
  choices.forEach((_, i) => {
    if (i !== correct) whyPerChoice[i] = needs[i];
  });
  return {
    id: "verdict:" + a.id,
    tag: "Always, sometimes, never",
    context: [a.statement],
    prompt: "Is this always, sometimes, or never true?",
    choices,
    correct,
    why: a.why,
    whyPerChoice,
  };
}

function counterexampleCard(r: () => number): LogicCard | undefined {
  const c = COUNTEREXAMPLES[Math.floor(r() * COUNTEREXAMPLES.length)];
  return {
    id: "counter:" + c.id,
    tag: "Counterexample",
    context: [c.claim],
    prompt: "Which case is a counterexample to the claim above?",
    choices: c.options,
    correct: c.correct,
    why: c.why,
  };
}

function syllogismCard(r: () => number): LogicCard | undefined {
  const c = CHAINS[Math.floor(r() * CHAINS.length)];
  const target = chainText(c, "p", "r");
  const choices = shuffle(r, [
    target,
    chainText(c, "r", "p"),
    chainText(c, "q", "p"),
    "Nothing follows — the middle terms do not match.",
  ]);
  return {
    id: "syll:" + c.id,
    tag: "Law of Syllogism",
    context: [chainText(c, "p", "q"), chainText(c, "q", "r")],
    prompt: "What follows by the Law of Syllogism?",
    choices,
    correct: choices.indexOf(target),
    why:
      "Syllogism chains two rules through the shared middle term — the same move as the transitive property, one level up. It fails if the middle terms do not match exactly.",
  };
}
