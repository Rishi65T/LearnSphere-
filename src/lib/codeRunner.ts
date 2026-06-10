import vm from "vm";

export type TestCase = { input: string; expectedOutput: string };

export type TestRunResult = {
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  passed: boolean;
  error: string | null;
};

export type CodeRunResult = {
  consoleOutput: string;
  testResults: TestRunResult[];
  runtimeError: string | null;
  allPassed: boolean;
};

function normalizeOutput(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

function outputsMatch(actual: string, expected: string): boolean {
  const a = actual.trim();
  const e = expected.trim();
  if (a === e) return true;
  if (a.toLowerCase() === e.toLowerCase()) return true;
  const aNum = Number(a);
  const eNum = Number(e);
  if (!Number.isNaN(aNum) && !Number.isNaN(eNum) && aNum === eNum) return true;
  return false;
}

export function runJavaScriptWithTests(
  userCode: string,
  testCases: TestCase[],
  functionName = "solve",
): CodeRunResult {
  const logs: string[] = [];
  const sandbox: Record<string, unknown> = {
    console: {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((a) =>
              typeof a === "object" && a !== null ? JSON.stringify(a) : String(a),
            )
            .join(" "),
        );
      },
    },
    __exports__: {} as Record<string, unknown>,
  };

  const testResults: TestRunResult[] = [];
  let runtimeError: string | null = null;

  try {
    const script = `
      "use strict";
      ${userCode}
      if (typeof ${functionName} !== "function") {
        throw new Error('Define a function named "${functionName}(input)" that returns the result.');
      }
      __exports__.fn = ${functionName};
    `;

    vm.runInNewContext(script, sandbox, {
      timeout: 5000,
      displayErrors: true,
    });

    const fn = (sandbox.__exports__ as { fn: (input: string) => unknown }).fn;

    for (const tc of testCases) {
      try {
        const raw = fn(tc.input);
        const actualOutput = normalizeOutput(raw);
        const passed = outputsMatch(actualOutput, tc.expectedOutput);
        testResults.push({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput,
          passed,
          error: null,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        testResults.push({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: null,
          passed: false,
          error: msg,
        });
      }
    }
  } catch (err: unknown) {
    runtimeError = err instanceof Error ? err.message : String(err);
    for (const tc of testCases) {
      testResults.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: null,
        passed: false,
        error: runtimeError,
      });
    }
  }

  const allPassed =
    !runtimeError && testResults.length > 0 && testResults.every((r) => r.passed);

  return {
    consoleOutput: logs.join("\n"),
    testResults,
    runtimeError,
    allPassed,
  };
}

export function gradeFromTestResults(
  runResult: CodeRunResult,
  subTopic?: string,
): {
  isCorrect: boolean;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
} {
  const { testResults, runtimeError, allPassed, consoleOutput } = runResult;
  const passedCount = testResults.filter((r) => r.passed).length;
  const total = testResults.length || 1;
  const score = Math.round((passedCount / total) * 100);
  const topic = subTopic || "this topic";

  if (runtimeError) {
    return {
      isCorrect: false,
      score: 0,
      feedback: `Runtime error: ${runtimeError}`,
      strengths: [],
      improvements: [topic, "Syntax and function definition"],
    };
  }

  if (allPassed) {
    return {
      isCorrect: true,
      score: 100,
      feedback: `All ${total} test cases passed! Your solution correctly handles ${topic}.${consoleOutput ? ` Console output: ${consoleOutput}` : ""}`,
      strengths: [topic, "Test case coverage"],
      improvements: [],
    };
  }

  const failed = testResults.filter((r) => !r.passed);
  const details = failed
    .map(
      (r) =>
        `Input "${r.input}": expected "${r.expectedOutput}", got "${r.actualOutput ?? "error"}"${r.error ? ` (${r.error})` : ""}`,
    )
    .join("; ");

  return {
    isCorrect: false,
    score,
    feedback: `${passedCount}/${total} test cases passed. ${details}`,
    strengths: passedCount > 0 ? [`Partial ${topic} understanding`] : [],
    improvements: [topic, ...failed.map((r) => `Fix case: input "${r.input}"`)],
  };
}
