import { PROGRAMMING_TOPICS } from "./programmingTopics";

export type MCQuestionTemplate = {
  question: string;
  options: string[];
  correctAnswer: number;
  subTopic: string;
  improvementArea: string;
  strengthArea: string;
};

export type ProgrammingChallenge = {
  subTopic: string;
  question: string;
  language: string;
  starterCode: string;
  testCases: { input: string; expectedOutput: string }[];
  hint: string;
  solution: string;
  improvementArea: string;
  strengthArea: string;
  functionName: string;
};

/** Unique multiple-choice templates — each has distinct question text and options. */
export const MC_QUESTION_BANK: MCQuestionTemplate[] = [
  {
    subTopic: "Core Concepts",
    question: "What is the primary purpose of using variables in a program?",
    options: [
      "To store and reference data values during execution",
      "To permanently delete data from memory",
      "To skip compilation steps",
      "To replace all functions in the codebase",
    ],
    correctAnswer: 0,
    improvementArea: "Variables & Data Types — how storage and naming work",
    strengthArea: "Variables & Data Types",
  },
  {
    subTopic: "Type Systems",
    question: "Which scenario best demonstrates strong typing?",
    options: [
      "A language rejects adding a string to a number without conversion",
      "All variables are treated as text regardless of content",
      "Types are ignored until runtime crashes occur",
      "Every value is automatically converted to boolean",
    ],
    correctAnswer: 0,
    improvementArea: "Data type rules and implicit vs explicit conversion",
    strengthArea: "Type Systems",
  },
  {
    subTopic: "Control Flow",
    question: "When should you use an `else if` chain instead of nested `if` statements?",
    options: [
      "When checking mutually exclusive conditions in sequence",
      "When you need infinite loops",
      "When variables cannot be reassigned",
      "When functions must return objects only",
    ],
    correctAnswer: 0,
    improvementArea: "Control Flow — conditionals and branching logic",
    strengthArea: "Control Flow (Conditionals)",
  },
  {
    subTopic: "Loops",
    question: "What is the main advantage of a `for...of` loop over a manual index loop for arrays?",
    options: [
      "It iterates values directly without managing an index variable",
      "It always runs faster on every hardware platform",
      "It prevents arrays from being modified",
      "It converts arrays into strings automatically",
    ],
    correctAnswer: 0,
    improvementArea: "Loops & Iteration — choosing the right loop construct",
    strengthArea: "Loops & Iteration",
  },
  {
    subTopic: "Functions",
    question: "What does 'function scope' mean in most programming languages?",
    options: [
      "Variables declared inside a function are only accessible within that function",
      "All variables are visible everywhere in the program",
      "Functions cannot accept parameters",
      "Scope only applies to global constants",
    ],
    correctAnswer: 0,
    improvementArea: "Functions & Scope — local vs global visibility",
    strengthArea: "Functions & Scope",
  },
  {
    subTopic: "Arrays",
    question: "Which operation adds an element to the END of an array in JavaScript?",
    options: ["push()", "shift()", "unshift()", "pop()"],
    correctAnswer: 0,
    improvementArea: "Arrays & Lists — common mutating methods",
    strengthArea: "Arrays & Lists",
  },
  {
    subTopic: "Strings",
    question: "What does the `split()` method do on a string?",
    options: [
      "Divides a string into an array of substrings by a delimiter",
      "Merges two strings into one object",
      "Encrypts the string contents",
      "Reverses character order in place",
    ],
    correctAnswer: 0,
    improvementArea: "Strings & Text Processing — splitting and joining",
    strengthArea: "Strings & Text Processing",
  },
  {
    subTopic: "OOP",
    question: "In object-oriented programming, what is encapsulation?",
    options: [
      "Bundling data and methods while restricting direct access to internal state",
      "Creating as many public fields as possible",
      "Deleting unused classes at compile time",
      "Running code without any classes",
    ],
    correctAnswer: 0,
    improvementArea: "Object-Oriented Programming — encapsulation principles",
    strengthArea: "Object-Oriented Programming",
  },
  {
    subTopic: "Inheritance",
    question: "What is method overriding in OOP?",
    options: [
      "A subclass provides its own implementation of a method defined in the parent",
      "A parent class deletes child methods",
      "Two unrelated classes share the same variable name",
      "Methods are renamed automatically at runtime",
    ],
    correctAnswer: 0,
    improvementArea: "Inheritance & Polymorphism — overriding vs overloading",
    strengthArea: "Inheritance & Polymorphism",
  },
  {
    subTopic: "Recursion",
    question: "Every recursive function MUST have which property to avoid infinite calls?",
    options: [
      "A base case that stops the recursion",
      "At least ten parameters",
      "A global mutable counter only",
      "No return statement",
    ],
    correctAnswer: 0,
    improvementArea: "Recursion — base cases and call stack",
    strengthArea: "Recursion",
  },
  {
    subTopic: "Sorting",
    question: "What is the average time complexity of Merge Sort?",
    options: ["O(n log n)", "O(n²)", "O(1)", "O(log n)"],
    correctAnswer: 0,
    improvementArea: "Sorting Algorithms — time/space complexity comparison",
    strengthArea: "Sorting Algorithms",
  },
  {
    subTopic: "Searching",
    question: "Binary search requires the input collection to be:",
    options: [
      "Sorted in ascending or descending order",
      "Stored only in linked lists",
      "Empty before searching",
      "Converted to strings first",
    ],
    correctAnswer: 0,
    improvementArea: "Searching Algorithms — prerequisites for binary search",
    strengthArea: "Searching Algorithms",
  },
  {
    subTopic: "Stacks & Queues",
    question: "Which data structure follows LIFO (Last In, First Out)?",
    options: ["Stack", "Queue", "Graph", "Hash Map"],
    correctAnswer: 0,
    improvementArea: "Stacks & Queues — LIFO vs FIFO behavior",
    strengthArea: "Stacks & Queues",
  },
  {
    subTopic: "Trees & Graphs",
    question: "In a binary tree, what is a leaf node?",
    options: [
      "A node with no children",
      "The root node only",
      "Any node with exactly three children",
      "A node that stores strings only",
    ],
    correctAnswer: 0,
    improvementArea: "Trees & Graphs — tree terminology and traversal",
    strengthArea: "Trees & Graphs",
  },
  {
    subTopic: "Hash Maps",
    question: "What is the typical average time complexity for lookup in a hash map?",
    options: ["O(1)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 0,
    improvementArea: "Hash Maps & Dictionaries — collision handling and lookup",
    strengthArea: "Hash Maps & Dictionaries",
  },
  {
    subTopic: "Error Handling",
    question: "What is the purpose of a try/catch block?",
    options: [
      "To handle runtime errors gracefully without crashing the program",
      "To speed up loop execution",
      "To declare global constants",
      "To skip type checking entirely",
    ],
    correctAnswer: 0,
    improvementArea: "Error Handling & Exceptions — try/catch/finally patterns",
    strengthArea: "Error Handling & Exceptions",
  },
  {
    subTopic: "Async",
    question: "What does `await` do inside an async function?",
    options: [
      "Pauses execution until a Promise settles, then returns its result",
      "Deletes pending promises from memory",
      "Converts callbacks into strings",
      "Runs code synchronously on the main thread only",
    ],
    correctAnswer: 0,
    improvementArea: "Async Programming & Concurrency — promises and await",
    strengthArea: "Async Programming & Concurrency",
  },
  {
    subTopic: "APIs",
    question: "Which HTTP method is typically used to retrieve data without modifying server state?",
    options: ["GET", "POST", "DELETE", "PATCH"],
    correctAnswer: 0,
    improvementArea: "APIs & HTTP — REST verbs and idempotency",
    strengthArea: "APIs & HTTP",
  },
  {
    subTopic: "SQL",
    question: "Which SQL clause filters rows AFTER grouping with GROUP BY?",
    options: ["HAVING", "WHERE", "ORDER BY", "LIMIT"],
    correctAnswer: 0,
    improvementArea: "Database & SQL — WHERE vs HAVING vs GROUP BY",
    strengthArea: "Database & SQL",
  },
  {
    subTopic: "Testing",
    question: "What is a unit test designed to verify?",
    options: [
      "A single function or module in isolation",
      "The entire production deployment pipeline",
      "Only visual UI pixel alignment",
      "Network bandwidth limits",
    ],
    correctAnswer: 0,
    improvementArea: "Testing & Debugging — unit vs integration tests",
    strengthArea: "Testing & Debugging",
  },
  {
    subTopic: "Design Patterns",
    question: "The Singleton pattern ensures that:",
    options: [
      "A class has only one instance with global access",
      "Every object is cloned on creation",
      "All methods are static and private",
      "Inheritance is completely forbidden",
    ],
    correctAnswer: 0,
    improvementArea: "Design Patterns — creational vs structural patterns",
    strengthArea: "Design Patterns",
  },
  {
    subTopic: "Functional Programming",
    question: "What is a pure function?",
    options: [
      "A function that returns the same output for the same input with no side effects",
      "A function that modifies global state every call",
      "A function that never accepts parameters",
      "A function that only prints to console",
    ],
    correctAnswer: 0,
    improvementArea: "Functional Programming — immutability and pure functions",
    strengthArea: "Functional Programming",
  },
  {
    subTopic: "Regular Expressions",
    question: "In regex, what does the `\\d` character class match?",
    options: [
      "Any digit character (0-9)",
      "Any whitespace character only",
      "The literal letter d",
      "End of string anchor",
    ],
    correctAnswer: 0,
    improvementArea: "Regular Expressions — character classes and anchors",
    strengthArea: "Regular Expressions",
  },
  {
    subTopic: "File I/O",
    question: "When reading a large file line-by-line, which approach is generally most memory-efficient?",
    options: [
      "Streaming the file instead of loading it entirely into memory",
      "Copying the entire file into a global array first",
      "Converting the file to JSON before reading",
      "Duplicating the file on disk for each read",
    ],
    correctAnswer: 0,
    improvementArea: "File I/O — streaming vs buffered reads",
    strengthArea: "File I/O",
  },
];

/** One unique coding challenge per programming topic — all with runnable test cases. */
export const PROGRAMMING_CHALLENGE_BANK: ProgrammingChallenge[] = [
  {
    subTopic: "Variables & Data Types",
    question: "Write `solve(input)` that receives two numbers as a comma-separated string (e.g. \"3,5\") and returns their sum as a string.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Parse the comma-separated numbers and return their sum\n  \n}`,
    testCases: [
      { input: "3,5", expectedOutput: "8" },
      { input: "10,20", expectedOutput: "30" },
      { input: "-2,7", expectedOutput: "5" },
    ],
    hint: "Use split(',') and parse numbers before adding.",
    solution: `function solve(input) { const [a,b]=input.split(',').map(Number); return String(a+b); }`,
    improvementArea: "Variables & Data Types — parsing and numeric operations",
    strengthArea: "Variables & Data Types",
    functionName: "solve",
  },
  {
    subTopic: "Operators & Expressions",
    question: "Write `solve(input)` that receives \"a,b,op\" where op is +, -, *, or / and returns the result as a string (integer division for /).",
    language: "javascript",
    starterCode: `function solve(input) {\n  // input format: "10,3,+"  → return "13"\n  \n}`,
    testCases: [
      { input: "10,3,+", expectedOutput: "13" },
      { input: "10,3,-", expectedOutput: "7" },
      { input: "4,5,*", expectedOutput: "20" },
    ],
    hint: "Split by comma, parse a and b as numbers, apply the operator.",
    solution: `function solve(input) { const [a,b,op]=input.split(','); const x=+a,y=+b; if(op==='+')return String(x+y); if(op==='-')return String(x-y); if(op==='*')return String(x*y); return String(Math.floor(x/y)); }`,
    improvementArea: "Operators & Expressions — arithmetic and operator selection",
    strengthArea: "Operators & Expressions",
    functionName: "solve",
  },
  {
    subTopic: "Control Flow (Conditionals)",
    question: "Write `solve(input)` that receives a number and returns \"positive\", \"negative\", or \"zero\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Return "positive", "negative", or "zero"\n  \n}`,
    testCases: [
      { input: "5", expectedOutput: "positive" },
      { input: "-3", expectedOutput: "negative" },
      { input: "0", expectedOutput: "zero" },
    ],
    hint: "Compare the parsed number against 0 using if/else.",
    solution: `function solve(input) { const n=Number(input); if(n>0)return 'positive'; if(n<0)return 'negative'; return 'zero'; }`,
    improvementArea: "Control Flow — branching with if/else",
    strengthArea: "Control Flow (Conditionals)",
    functionName: "solve",
  },
  {
    subTopic: "Loops & Iteration",
    question: "Write `solve(input)` that receives a number n and returns the sum 1+2+...+n as a string.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Sum integers from 1 to n using a loop\n  \n}`,
    testCases: [
      { input: "5", expectedOutput: "15" },
      { input: "1", expectedOutput: "1" },
      { input: "10", expectedOutput: "55" },
    ],
    hint: "Use a for loop accumulating a total.",
    solution: `function solve(input) { let n=+input,s=0; for(let i=1;i<=n;i++)s+=i; return String(s); }`,
    improvementArea: "Loops & Iteration — accumulation patterns",
    strengthArea: "Loops & Iteration",
    functionName: "solve",
  },
  {
    subTopic: "Functions & Scope",
    question: "Write `solve(input)` that receives a comma-separated list of numbers and returns the maximum as a string.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Return the largest number in the list\n  \n}`,
    testCases: [
      { input: "3,9,1", expectedOutput: "9" },
      { input: "-5,-1,-10", expectedOutput: "-1" },
      { input: "42", expectedOutput: "42" },
    ],
    hint: "Split, map to numbers, track the max in a helper or loop.",
    solution: `function solve(input) { return String(Math.max(...input.split(',').map(Number))); }`,
    improvementArea: "Functions & Scope — reusable logic and return values",
    strengthArea: "Functions & Scope",
    functionName: "solve",
  },
  {
    subTopic: "Arrays & Lists",
    question: "Write `solve(input)` that receives a comma-separated list and returns the reversed list as a comma-separated string.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Reverse the order of elements\n  \n}`,
    testCases: [
      { input: "a,b,c", expectedOutput: "c,b,a" },
      { input: "1,2,3,4", expectedOutput: "4,3,2,1" },
      { input: "solo", expectedOutput: "solo" },
    ],
    hint: "split → reverse → join.",
    solution: `function solve(input) { return input.split(',').reverse().join(','); }`,
    improvementArea: "Arrays & Lists — split, reverse, join",
    strengthArea: "Arrays & Lists",
    functionName: "solve",
  },
  {
    subTopic: "Strings & Text Processing",
    question: "Write `solve(input)` that receives a string and returns it in UPPERCASE.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Convert the entire string to uppercase\n  \n}`,
    testCases: [
      { input: "hello", expectedOutput: "HELLO" },
      { input: "LearnSphere", expectedOutput: "LEARNSPHERE" },
      { input: "abc123", expectedOutput: "ABC123" },
    ],
    hint: "Use toUpperCase() on the input string.",
    solution: `function solve(input) { return input.toUpperCase(); }`,
    improvementArea: "Strings & Text Processing — case conversion",
    strengthArea: "Strings & Text Processing",
    functionName: "solve",
  },
  {
    subTopic: "Object-Oriented Programming",
    question: "Write `solve(input)` that receives \"name,age\" and returns JSON string {\"name\":\"...\",\"age\":N} with age as number.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Build and return a JSON object string\n  \n}`,
    testCases: [
      { input: "Alice,30", expectedOutput: '{"name":"Alice","age":30}' },
      { input: "Bob,25", expectedOutput: '{"name":"Bob","age":25}' },
    ],
    hint: "Split input, build an object, use JSON.stringify.",
    solution: `function solve(input) { const [name,age]=input.split(','); return JSON.stringify({name,age:Number(age)}); }`,
    improvementArea: "Object-Oriented Programming — objects and properties",
    strengthArea: "Object-Oriented Programming",
    functionName: "solve",
  },
  {
    subTopic: "Inheritance & Polymorphism",
    question: "Write `solve(input)` that receives \"type,name\" where type is \"animal\" or \"dog\". Return \"Animal: name\" or \"Dog: name\" accordingly.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Polymorphic-style response based on type\n  \n}`,
    testCases: [
      { input: "animal,Max", expectedOutput: "Animal: Max" },
      { input: "dog,Buddy", expectedOutput: "Dog: Buddy" },
    ],
    hint: "Use conditional logic to format output by type.",
    solution: `function solve(input) { const [type,name]=input.split(','); return type==='dog'? 'Dog: '+name : 'Animal: '+name; }`,
    improvementArea: "Inheritance & Polymorphism — type-based behavior",
    strengthArea: "Inheritance & Polymorphism",
    functionName: "solve",
  },
  {
    subTopic: "Recursion",
    question: "Write `solve(input)` that receives n and returns n! (factorial) as a string. Use recursion.",
    language: "javascript",
    starterCode: `function factorial(n) {\n  // Base case + recursive case\n}\nfunction solve(input) {\n  return String(factorial(Number(input)));\n}`,
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "3", expectedOutput: "6" },
    ],
    hint: "Base case: n <= 1 returns 1.",
    solution: `function factorial(n){if(n<=1)return 1;return n*factorial(n-1);} function solve(i){return String(factorial(+i));}`,
    improvementArea: "Recursion — base case and recursive calls",
    strengthArea: "Recursion",
    functionName: "solve",
  },
  {
    subTopic: "Sorting Algorithms",
    question: "Write `solve(input)` that receives comma-separated numbers and returns them sorted ascending, comma-separated.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Sort numbers in ascending order\n  \n}`,
    testCases: [
      { input: "3,1,2", expectedOutput: "1,2,3" },
      { input: "10,5,8", expectedOutput: "5,8,10" },
      { input: "7", expectedOutput: "7" },
    ],
    hint: "Parse numbers, sort, join back with commas.",
    solution: `function solve(input) { return input.split(',').map(Number).sort((a,b)=>a-b).join(','); }`,
    improvementArea: "Sorting Algorithms — comparison-based sorting",
    strengthArea: "Sorting Algorithms",
    functionName: "solve",
  },
  {
    subTopic: "Searching Algorithms",
    question: "Write `solve(input)` that receives \"list,target\" where list is sorted comma-separated numbers. Return index of target or \"-1\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Binary search on sorted array\n  \n}`,
    testCases: [
      { input: "1,3,5,7,9,5", expectedOutput: "2" },
      { input: "1,3,5,7,9,10", expectedOutput: "-1" },
      { input: "2,4,6,4", expectedOutput: "1" },
    ],
    hint: "Split by last comma — or format: numbers then target after final comma.",
    solution: `function solve(input) { const parts=input.split(','); const target=+parts.pop(); const arr=parts.map(Number); let l=0,r=arr.length-1; while(l<=r){const m=(l+r>>1); if(arr[m]===target)return String(m); if(arr[m]<target)l=m+1; else r=m-1;} return '-1'; }`,
    improvementArea: "Searching Algorithms — binary search on sorted data",
    strengthArea: "Searching Algorithms",
    functionName: "solve",
  },
  {
    subTopic: "Stacks & Queues",
    question: "Write `solve(input)` that receives a comma-separated sequence of push/pop ops like \"push:1,push:2,pop,pop\" and returns remaining stack top-to-bottom comma-separated (empty → \"\").",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Simulate stack: push:X adds, pop removes top\n  \n}`,
    testCases: [
      { input: "push:1,push:2,pop", expectedOutput: "1" },
      { input: "push:a,push:b,push:c,pop,pop", expectedOutput: "a" },
      { input: "pop", expectedOutput: "" },
    ],
    hint: "Use an array as stack; push adds to end, pop removes from end.",
    solution: `function solve(input) { const s=[]; for(const op of input.split(',')){ if(op.startsWith('push:')) s.push(op.slice(5)); else if(op==='pop') s.pop(); } return s.join(','); }`,
    improvementArea: "Stacks & Queues — LIFO stack simulation",
    strengthArea: "Stacks & Queues",
    functionName: "solve",
  },
  {
    subTopic: "Trees & Graphs",
    question: "Write `solve(input)` that receives a comma-separated level-order tree (use \"null\" for empty nodes) and returns the max depth as string. Example: \"3,9,20,null,null,15,7\" → depth 3.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Compute max depth from level-order array\n  \n}`,
    testCases: [
      { input: "3,9,20,null,null,15,7", expectedOutput: "3" },
      { input: "1,null,2", expectedOutput: "2" },
      { input: "5", expectedOutput: "1" },
    ],
    hint: "Filter nulls and estimate depth from array structure, or BFS level count.",
    solution: `function solve(input) { const nodes=input.split(','); let depth=0,i=0; while(i<nodes.length){depth++; i=Math.pow(2,depth)-1;} return String(depth); }`,
    improvementArea: "Trees & Graphs — depth and level-order representation",
    strengthArea: "Trees & Graphs",
    functionName: "solve",
  },
  {
    subTopic: "Hash Maps & Dictionaries",
    question: "Write `solve(input)` that receives comma-separated \"key:value\" pairs and returns the value for the queried key (last segment). Format: \"a:1,b:2,c:3,b\" → \"2\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Build a map from pairs, lookup the last key\n  \n}`,
    testCases: [
      { input: "a:1,b:2,c:3,b", expectedOutput: "2" },
      { input: "x:10,y:20,x", expectedOutput: "10" },
      { input: "name:Alice,name", expectedOutput: "Alice" },
    ],
    hint: "Last item is the query key; preceding items are key:value pairs.",
    solution: `function solve(input) { const parts=input.split(','); const key=parts.pop(); const map={}; for(const p of parts){const [k,v]=p.split(':'); map[k]=v;} return map[key]??''; }`,
    improvementArea: "Hash Maps & Dictionaries — key-value lookup",
    strengthArea: "Hash Maps & Dictionaries",
    functionName: "solve",
  },
  {
    subTopic: "Error Handling & Exceptions",
    question: "Write `solve(input)` that parses input as a number and returns its double. If input is not a valid number, return \"error\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Return double the number, or "error" if invalid\n  \n}`,
    testCases: [
      { input: "5", expectedOutput: "10" },
      { input: "abc", expectedOutput: "error" },
      { input: "3.5", expectedOutput: "7" },
    ],
    hint: "Use isNaN after Number() conversion.",
    solution: `function solve(input) { const n=Number(input); if(isNaN(n))return 'error'; return String(n*2); }`,
    improvementArea: "Error Handling & Exceptions — validating input",
    strengthArea: "Error Handling & Exceptions",
    functionName: "solve",
  },
  {
    subTopic: "File I/O",
    question: "Write `solve(input)` that simulates reading lines (separated by \\n) and returns the line count as a string.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Count non-empty lines in the input string\n  \n}`,
    testCases: [
      { input: "line1\nline2\nline3", expectedOutput: "3" },
      { input: "only", expectedOutput: "1" },
      { input: "a\nb", expectedOutput: "2" },
    ],
    hint: "Split by newline character and count segments.",
    solution: `function solve(input) { return String(input.split('\\n').length); }`,
    improvementArea: "File I/O — line-based text processing",
    strengthArea: "File I/O",
    functionName: "solve",
  },
  {
    subTopic: "Async Programming & Concurrency",
    question: "Write `solve(input)` that receives comma-separated task durations (ms as numbers) and returns total sequential wait time as string (sum).",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Sum all task durations (sequential execution)\n  \n}`,
    testCases: [
      { input: "100,200,300", expectedOutput: "600" },
      { input: "50,50", expectedOutput: "100" },
      { input: "1000", expectedOutput: "1000" },
    ],
    hint: "Parse and sum all durations.",
    solution: `function solve(input) { return String(input.split(',').map(Number).reduce((a,b)=>a+b,0)); }`,
    improvementArea: "Async Programming — sequential vs parallel timing",
    strengthArea: "Async Programming & Concurrency",
    functionName: "solve",
  },
  {
    subTopic: "APIs & HTTP",
    question: "Write `solve(input)` that receives \"METHOD,path,status\" and returns a log string: \"[METHOD] path → status\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Format: "[GET] /api/users → 200"\n  \n}`,
    testCases: [
      { input: "GET,/api/users,200", expectedOutput: "[GET] /api/users → 200" },
      { input: "POST,/login,401", expectedOutput: "[POST] /login → 401" },
    ],
    hint: "Split by comma — method, path, status.",
    solution: `function solve(input) { const [m,p,s]=input.split(','); return \`[\${m}] \${p} → \${s}\`; }`,
    improvementArea: "APIs & HTTP — request/response logging",
    strengthArea: "APIs & HTTP",
    functionName: "solve",
  },
  {
    subTopic: "Database & SQL",
    question: "Write `solve(input)` that receives \"table,rows\" and returns a simple SQL count query string: \"SELECT COUNT(*) FROM table\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // input: "users,100" → "SELECT COUNT(*) FROM users"\n  \n}`,
    testCases: [
      { input: "users,100", expectedOutput: "SELECT COUNT(*) FROM users" },
      { input: "orders,50", expectedOutput: "SELECT COUNT(*) FROM orders" },
    ],
    hint: "First segment is the table name.",
    solution: `function solve(input) { const [table]=input.split(','); return \`SELECT COUNT(*) FROM \${table}\`; }`,
    improvementArea: "Database & SQL — basic query construction",
    strengthArea: "Database & SQL",
    functionName: "solve",
  },
  {
    subTopic: "Testing & Debugging",
    question: "Write `solve(input)` that receives comma-separated numbers and returns \"pass\" if all are positive, else \"fail\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Test assertion: all values must be > 0\n  \n}`,
    testCases: [
      { input: "1,2,3", expectedOutput: "pass" },
      { input: "1,-2,3", expectedOutput: "fail" },
      { input: "5", expectedOutput: "pass" },
    ],
    hint: "Use every() to check all numbers are positive.",
    solution: `function solve(input) { const nums=input.split(',').map(Number); return nums.every(n=>n>0)?'pass':'fail'; }`,
    improvementArea: "Testing & Debugging — assertion patterns",
    strengthArea: "Testing & Debugging",
    functionName: "solve",
  },
  {
    subTopic: "Design Patterns",
    question: "Write `solve(input)` implementing a simple Factory: input \"circle,5\" or \"square,4\" returns \"Circle:5\" or \"Square:4\".",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Factory pattern: create formatted shape description\n  \n}`,
    testCases: [
      { input: "circle,5", expectedOutput: "Circle:5" },
      { input: "square,4", expectedOutput: "Square:4" },
    ],
    hint: "Split shape and size, capitalize shape name.",
    solution: `function solve(input) { const [shape,size]=input.split(','); return shape.charAt(0).toUpperCase()+shape.slice(1)+':'+size; }`,
    improvementArea: "Design Patterns — factory method pattern",
    strengthArea: "Design Patterns",
    functionName: "solve",
  },
  {
    subTopic: "Functional Programming",
    question: "Write `solve(input)` that receives comma-separated numbers and returns the sum of ONLY even numbers as a string.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Filter evens, then reduce to sum\n  \n}`,
    testCases: [
      { input: "1,2,3,4", expectedOutput: "6" },
      { input: "2,4,6", expectedOutput: "12" },
      { input: "1,3,5", expectedOutput: "0" },
    ],
    hint: "filter(n => n % 2 === 0) then reduce.",
    solution: `function solve(input) { return String(input.split(',').map(Number).filter(n=>n%2===0).reduce((a,b)=>a+b,0)); }`,
    improvementArea: "Functional Programming — filter and reduce",
    strengthArea: "Functional Programming",
    functionName: "solve",
  },
  {
    subTopic: "Regular Expressions",
    question: "Write `solve(input)` that receives a string and returns the count of digits in it as a string.",
    language: "javascript",
    starterCode: `function solve(input) {\n  // Count digit characters using regex or loop\n  \n}`,
    testCases: [
      { input: "abc123", expectedOutput: "3" },
      { input: "no-digits", expectedOutput: "0" },
      { input: "2024", expectedOutput: "4" },
    ],
    hint: "Match with /\\d/g and count matches.",
    solution: `function solve(input) { return String((input.match(/\\d/g)||[]).length); }`,
    improvementArea: "Regular Expressions — digit matching",
    strengthArea: "Regular Expressions",
    functionName: "solve",
  },
];

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildQuizFromBank(
  quizTopic: string,
  questionCount: number,
  includeProgramming: boolean,
) {
  const mcPool = shuffleArray(MC_QUESTION_BANK);
  const progPool = shuffleArray(PROGRAMMING_CHALLENGE_BANK);

  const mcCount = includeProgramming
    ? Math.max(1, Math.floor(questionCount * 0.35))
    : questionCount;
  const progCount = includeProgramming ? questionCount - mcCount : 0;

  const questions: Record<string, unknown>[] = [];
  let id = 1;

  const usedMcTexts = new Set<string>();
  for (let i = 0; i < mcCount; i++) {
    const template = mcPool[i % mcPool.length];
    const suffix = usedMcTexts.has(template.question)
      ? ` (variant ${Math.floor(i / mcPool.length) + 1})`
      : "";
    usedMcTexts.add(template.question);

    questions.push({
      id: id++,
      type: "multiple_choice",
      subTopic: template.subTopic,
      question: `(${quizTopic}) ${template.question}${suffix}`,
      options: [...template.options],
      correctAnswer: template.correctAnswer,
      improvementArea: template.improvementArea,
      strengthArea: template.strengthArea,
    });
  }

  const usedProgTopics = new Set<string>();
  for (let i = 0; i < progCount; i++) {
    const challenge = progPool[i % progPool.length];
    if (usedProgTopics.has(challenge.subTopic) && progPool.length > i) {
      const alt = progPool.find((c) => !usedProgTopics.has(c.subTopic)) ?? challenge;
      usedProgTopics.add(alt.subTopic);
      questions.push({
        id: id++,
        type: "programming",
        ...alt,
        question: `(${quizTopic}) ${alt.question}`,
      });
    } else {
      usedProgTopics.add(challenge.subTopic);
      questions.push({
        id: id++,
        type: "programming",
        ...challenge,
        question: `(${quizTopic}) ${challenge.question}`,
      });
    }
  }

  return {
    overview: `This ${questionCount}-question assessment on ${quizTopic} includes ${mcCount} unique multiple-choice and ${progCount} coding challenges across distinct programming topics.`,
    questions,
  };
}

/** Ensure no duplicate question text or identical option sets in AI-generated quizzes. */
export function deduplicateQuizQuestions(
  questions: Record<string, unknown>[],
): Record<string, unknown>[] {
  const seen = new Set<string>();
  const unique: Record<string, unknown>[] = [];

  for (const q of questions) {
    const key = `${String(q.type)}::${String(q.question).trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (q.type === "multiple_choice" && Array.isArray(q.options)) {
      const opts = q.options as string[];
      const uniqueOpts = [...new Set(opts.map((o) => o.trim()))];
      if (uniqueOpts.length < 4) continue;
      q.options = uniqueOpts.slice(0, 4);
    }

    unique.push(q);
  }

  return unique;
}

export { PROGRAMMING_TOPICS };
