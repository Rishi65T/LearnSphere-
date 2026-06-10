/** Comprehensive programming topics — every quiz with coding must cover all of these. */
export const PROGRAMMING_TOPICS = [
  "Variables & Data Types",
  "Operators & Expressions",
  "Control Flow (Conditionals)",
  "Loops & Iteration",
  "Functions & Scope",
  "Arrays & Lists",
  "Strings & Text Processing",
  "Object-Oriented Programming",
  "Inheritance & Polymorphism",
  "Recursion",
  "Sorting Algorithms",
  "Searching Algorithms",
  "Stacks & Queues",
  "Trees & Graphs",
  "Hash Maps & Dictionaries",
  "Error Handling & Exceptions",
  "File I/O",
  "Async Programming & Concurrency",
  "APIs & HTTP",
  "Database & SQL",
  "Testing & Debugging",
  "Design Patterns",
  "Functional Programming",
  "Regular Expressions",
] as const;

export type ProgrammingTopic = (typeof PROGRAMMING_TOPICS)[number];

export const MIN_QUESTIONS_FOR_FULL_COVERAGE = PROGRAMMING_TOPICS.length;
