import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Loader2,
  CheckCircle,
  XCircle,
  Code2,
  ListChecks,
  ThumbsUp,
  AlertTriangle,
  Play,
  Terminal,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Brain,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  PROGRAMMING_TOPICS,
  MIN_QUESTIONS_FOR_FULL_COVERAGE,
} from "../data/programmingTopics";
import { saveQuizSession, getQuizProfile } from "../lib/quizProfile";

type MCQuestion = {
  id: number;
  type: "multiple_choice";
  subTopic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  improvementArea?: string;
  strengthArea?: string;
};

type ProgrammingQuestion = {
  id: number;
  type: "programming";
  subTopic: string;
  question: string;
  language: string;
  starterCode?: string;
  testCases?: { input: string; expectedOutput: string }[];
  hint?: string;
  solution?: string;
  improvementArea?: string;
  strengthArea?: string;
  functionName?: string;
};

type Question = MCQuestion | ProgrammingQuestion;

type TestRunResult = {
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  passed: boolean;
  error: string | null;
};

type UserAnswer =
  | { type: "multiple_choice"; selectedIndex: number; isCorrect: boolean }
  | {
      type: "programming";
      code: string;
      isCorrect: boolean;
      score: number;
      feedback: string;
      strengths: string[];
      improvements: string[];
    };

type TopicAnalysis = {
  recognizedTopic: string;
  topicCategory: string;
  quizFormat: "mcq_only" | "mixed" | "programming_heavy";
  includeProgramming: boolean;
  reasoning: string;
  subTopics: string[];
};

type ProPlan = {
  planTitle: string;
  summary: string;
  estimatedWeeks: number;
  phases: { title: string; duration: string; goals: string[]; resources: string[] }[];
  nextSteps: string[];
  strengthHighlight: string[];
};

export function AIQuiz() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(24);
  const [includeProgramming, setIncludeProgramming] = useState(true);
  const [topicAnalysis, setTopicAnalysis] = useState<TopicAnalysis | null>(null);
  const [analyzingTopic, setAnalyzingTopic] = useState(false);
  const [proPlan, setProPlan] = useState<ProPlan | null>(null);
  const [loadingProPlan, setLoadingProPlan] = useState(false);
  const analyzeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [running, setRunning] = useState(false);
  const [quiz, setQuiz] = useState<{
    overview: string;
    questions: Question[];
  } | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<(UserAnswer | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState<{
    isCorrect: boolean;
    score: number;
    feedback: string;
  } | null>(null);
  const [runOutput, setRunOutput] = useState<{
    consoleOutput: string;
    testResults: TestRunResult[];
    runtimeError: string | null;
  } | null>(null);

  const currentQ = quiz?.questions[currentQuestion];

  useEffect(() => {
    if (analyzeTimer.current) clearTimeout(analyzeTimer.current);
    const trimmed = topic.trim();
    if (!trimmed || trimmed.length < 2) {
      setTopicAnalysis(null);
      return;
    }

    setAnalyzingTopic(true);
    analyzeTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/ai/quiz/analyze-topic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: trimmed }),
        });
        const data = await res.json();
        setTopicAnalysis(data);
      } catch {
        setTopicAnalysis(null);
      }
      setAnalyzingTopic(false);
    }, 700);

    return () => {
      if (analyzeTimer.current) clearTimeout(analyzeTimer.current);
    };
  }, [topic]);

  const applyTopicRecommendation = () => {
    if (!topicAnalysis) return;
    setIncludeProgramming(topicAnalysis.includeProgramming);
    if (topicAnalysis.quizFormat === "mcq_only") {
      setQuestionCount(Math.min(questionCount, 20));
    } else if (topicAnalysis.quizFormat === "programming_heavy") {
      setQuestionCount(Math.max(questionCount, MIN_QUESTIONS_FOR_FULL_COVERAGE));
      setIncludeProgramming(true);
    }
  };

  const generateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicAnalysis?.recognizedTopic || topic,
          difficulty,
          questionCount,
          includeProgramming,
          subTopics: topicAnalysis?.subTopics ?? [],
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuiz(data);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setCodeAnswer("");
        setUserAnswers([]);
        setShowResults(false);
        setIsAnswered(false);
        setCodeFeedback(null);
        setRunOutput(null);
        const first = data.questions[0];
        if (first?.type === "programming" && first.starterCode) {
          setCodeAnswer(first.starterCode);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleMCAnswer = (index: number) => {
    if (isAnswered || !currentQ || currentQ.type !== "multiple_choice") return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === currentQ.correctAnswer;
    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = { type: "multiple_choice", selectedIndex: index, isCorrect };
      return next;
    });
  };

  const handleRunCode = async () => {
    if (!currentQ || currentQ.type !== "programming") return;
    setRunning(true);
    setRunOutput(null);
    try {
      const res = await fetch("/api/ai/quiz/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userCode: codeAnswer,
          testCases: currentQ.testCases ?? [],
          functionName: currentQ.functionName ?? "solve",
        }),
      });
      const result = await res.json();
      setRunOutput({
        consoleOutput: result.consoleOutput ?? "",
        testResults: result.testResults ?? [],
        runtimeError: result.runtimeError ?? null,
      });
    } catch (e) {
      console.error(e);
      setRunOutput({
        consoleOutput: "",
        testResults: [],
        runtimeError: "Failed to run code. Please try again.",
      });
    }
    setRunning(false);
  };

  const handleCodeSubmit = async () => {
    if (isAnswered || !currentQ || currentQ.type !== "programming") return;
    setEvaluating(true);
    try {
      const res = await fetch("/api/ai/quiz/evaluate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ.question,
          userCode: codeAnswer,
          language: currentQ.language,
          testCases: currentQ.testCases,
          solution: currentQ.solution,
          subTopic: currentQ.subTopic,
          functionName: currentQ.functionName ?? "solve",
        }),
      });
      const result = await res.json();
      setRunOutput({
        consoleOutput: result.consoleOutput ?? "",
        testResults: result.testResults ?? [],
        runtimeError: result.runtimeError ?? null,
      });
      setCodeFeedback({
        isCorrect: result.isCorrect,
        score: result.score ?? (result.isCorrect ? 100 : 0),
        feedback: result.feedback ?? "",
      });
      setIsAnswered(true);
      setUserAnswers((prev) => {
        const next = [...prev];
        next[currentQuestion] = {
          type: "programming",
          code: codeAnswer,
          isCorrect: result.isCorrect,
          score: result.score ?? (result.isCorrect ? 100 : 0),
          feedback: result.feedback ?? "",
          strengths: result.strengths ?? [],
          improvements: result.improvements ?? [],
        };
        return next;
      });
    } catch (e) {
      console.error(e);
    }
    setEvaluating(false);
  };

  const nextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      const nextIdx = currentQuestion + 1;
      setCurrentQuestion(nextIdx);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCodeFeedback(null);
      setRunOutput(null);
      const nextQ = quiz.questions[nextIdx];
      setCodeAnswer(
        nextQ.type === "programming" && nextQ.starterCode ? nextQ.starterCode : "",
      );
    } else {
      setShowResults(true);
    }
  };

  const { score, totalAnswered, strengths, improvements } = useMemo(() => {
    if (!quiz) return { score: 0, totalAnswered: 0, strengths: [] as string[], improvements: [] as string[] };

    let correct = 0;
    const strengthSet = new Set<string>();
    const improveSet = new Set<string>();

    quiz.questions.forEach((q, i) => {
      const ans = userAnswers[i];
      if (!ans) return;

      if (ans.type === "multiple_choice") {
        if (ans.isCorrect) {
          correct++;
          strengthSet.add(q.strengthArea || q.subTopic);
        } else {
          improveSet.add(q.improvementArea || q.subTopic);
        }
      } else {
        if (ans.isCorrect) {
          correct++;
          ans.strengths.forEach((s) => strengthSet.add(s));
          strengthSet.add(q.strengthArea || q.subTopic);
        } else {
          ans.improvements.forEach((s) => improveSet.add(s));
          improveSet.add(q.improvementArea || q.subTopic);
        }
      }
    });

    for (const s of strengthSet) improveSet.delete(s);

    return {
      score: correct,
      totalAnswered: userAnswers.filter(Boolean).length,
      strengths: Array.from(strengthSet),
      improvements: Array.from(improveSet),
    };
  }, [quiz, userAnswers]);

  const minQuestionsHint = includeProgramming
    ? `Use at least ${MIN_QUESTIONS_FOR_FULL_COVERAGE} questions to cover all ${PROGRAMMING_TOPICS.length} programming topics.`
    : null;

  const formatLabel = (fmt: TopicAnalysis["quizFormat"]) => {
    if (fmt === "mcq_only") return "MCQ Only";
    if (fmt === "programming_heavy") return "Mostly Coding";
    return "MCQ + Coding";
  };

  useEffect(() => {
    if (!showResults || !quiz) return;

    saveQuizSession({
      topic: topicAnalysis?.recognizedTopic || topic,
      difficulty,
      score,
      total: quiz.questions.length,
      strengths,
      improvements,
      completedAt: new Date().toISOString(),
    });

    const profile = getQuizProfile();
    const historicalStrengths = profile.topStrengths.slice(0, 5).map((s) => s.area);

    setLoadingProPlan(true);
    fetch("/api/ai/quiz/pro-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topicAnalysis?.recognizedTopic || topic,
        strengths,
        improvements,
        score,
        totalQuestions: quiz.questions.length,
        difficulty,
        historicalStrengths,
      }),
    })
      .then((res) => res.json())
      .then((data) => setProPlan(data))
      .catch(() => setProPlan(null))
      .finally(() => setLoadingProPlan(false));
  }, [showResults]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 w-full"
    >
      <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="p-3 bg-indigo-900/40 text-indigo-400 rounded-xl">
          <Target size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            Smart Quiz Engine
          </h1>
          <p className="text-slate-400">
            LearnSphere AI generates topic-focused quizzes with personalized pro learning plans.
          </p>
        </div>
      </header>

      {!quiz && (
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Quiz Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Python Data Structures, React Hooks, JavaScript"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {(analyzingTopic || topicAnalysis) && topic.trim().length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-indigo-900/20 border border-indigo-500/30 rounded-2xl space-y-3"
            >
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                {analyzingTopic ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Brain size={16} />
                )}
                LearnSphere AI Topic Recognition
              </div>
              {analyzingTopic ? (
                <p className="text-sm text-slate-400">Analyzing your topic...</p>
              ) : topicAnalysis ? (
                <>
                  <p className="text-white font-medium">
                    Recognized: {topicAnalysis.recognizedTopic}
                  </p>
                  <p className="text-sm text-slate-300">{topicAnalysis.reasoning}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-slate-900/60 border border-slate-600 rounded-full text-xs text-slate-300">
                      Format: {formatLabel(topicAnalysis.quizFormat)}
                    </span>
                    <span className="px-3 py-1 bg-slate-900/60 border border-slate-600 rounded-full text-xs text-slate-300 capitalize">
                      {topicAnalysis.topicCategory}
                    </span>
                    {topicAnalysis.subTopics.slice(0, 4).map((st) => (
                      <span
                        key={st}
                        className="px-2 py-0.5 bg-indigo-900/40 border border-indigo-500/30 rounded-full text-[10px] text-indigo-300"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={applyTopicRecommendation}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Apply recommended format ({formatLabel(topicAnalysis.quizFormat)})
                  </button>
                </>
              ) : null}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={5}
                max={40}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="flex-1 accent-indigo-500"
              />
              <span className="w-12 text-center font-bold text-indigo-400 text-lg">
                {questionCount}
              </span>
            </div>
            {minQuestionsHint && (
              <p className="text-xs text-slate-500 mt-2">{minQuestionsHint}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Difficulty
            </label>
            <div className="flex gap-3">
              {["Beginner", "Medium", "Hard"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={cn(
                    "flex-1 py-3 rounded-xl border text-sm font-medium transition-all",
                    difficulty === lvl
                      ? "border-indigo-500 bg-indigo-900/20 text-indigo-400 font-bold"
                      : "border-slate-600 text-slate-400 hover:bg-slate-700/50",
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeProgramming}
              onChange={(e) => setIncludeProgramming(e.target.checked)}
              className="w-5 h-5 rounded accent-indigo-500"
            />
            <div>
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                Include coding challenges
              </span>
              <p className="text-xs text-slate-500">
                Covers all {PROGRAMMING_TOPICS.length} programming topics — variables, OOP,
                algorithms, async, SQL, design patterns, and more.
              </p>
            </div>
          </label>

          <button
            onClick={generateQuiz}
            disabled={loading || !topic.trim()}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Generate Assessment"
            )}
          </button>
        </div>
      )}

      {quiz && !showResults && currentQ && (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm font-medium text-slate-400">
            <span>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold border",
                  currentQ.type === "programming"
                    ? "bg-emerald-900/30 border-emerald-500/40 text-emerald-400"
                    : "bg-indigo-900/30 border-indigo-500/40 text-indigo-400",
                )}
              >
                {currentQ.type === "programming" ? (
                  <span className="flex items-center gap-1">
                    <Code2 size={14} /> Coding
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ListChecks size={14} /> Multiple Choice
                  </span>
                )}
              </span>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
                {currentQ.subTopic}
              </span>
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6">{currentQ.question}</h2>

            {currentQ.type === "multiple_choice" && (
              <div className="space-y-3">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === currentQ.correctAnswer;
                  const showStatus = isAnswered;

                  return (
                    <button
                      key={i}
                      onClick={() => handleMCAnswer(i)}
                      disabled={isAnswered}
                      className={cn(
                        "w-full text-left px-6 py-4 rounded-xl border flex items-center justify-between transition-all",
                        !showStatus &&
                          "hover:border-indigo-500/50 hover:bg-indigo-900/10 border-slate-600 text-slate-200",
                        showStatus &&
                          isCorrect &&
                          "bg-emerald-900/20 border-emerald-500/50 text-emerald-400",
                        showStatus &&
                          isSelected &&
                          !isCorrect &&
                          "bg-rose-900/20 border-rose-500/50 text-rose-400",
                        showStatus &&
                          !isSelected &&
                          !isCorrect &&
                          "opacity-50 bg-slate-900/50 border-slate-700 text-slate-500",
                      )}
                    >
                      <span>{opt}</span>
                      {showStatus && isCorrect && (
                        <CheckCircle className="text-emerald-400" size={20} />
                      )}
                      {showStatus && isSelected && !isCorrect && (
                        <XCircle className="text-rose-400" size={20} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === "programming" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="uppercase font-bold tracking-wide">
                    {currentQ.language}
                  </span>
                  {currentQ.hint && !isAnswered && (
                    <span className="text-indigo-400 italic">Hint: {currentQ.hint}</span>
                  )}
                </div>
                <textarea
                  value={codeAnswer}
                  onChange={(e) => {
                    setCodeAnswer(e.target.value);
                    if (!isAnswered) setRunOutput(null);
                  }}
                  disabled={isAnswered}
                  spellCheck={false}
                  rows={14}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-600 rounded-xl font-mono text-sm text-emerald-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 resize-y disabled:opacity-70"
                />
                {currentQ.testCases && currentQ.testCases.length > 0 && (
                  <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Test Cases
                    </p>
                    <div className="space-y-1 font-mono text-xs text-slate-400">
                      {currentQ.testCases.map((tc, i) => (
                        <div key={i}>
                          Input: <span className="text-slate-300">{tc.input}</span> → Expected:{" "}
                          <span className="text-emerald-400">{tc.expectedOutput}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!isAnswered && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleRunCode}
                      disabled={running || !codeAnswer.trim()}
                      className="px-6 py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {running ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                      Run Code
                    </button>
                    <button
                      onClick={handleCodeSubmit}
                      disabled={evaluating || !codeAnswer.trim()}
                      className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {evaluating ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Code2 size={18} />
                      )}
                      Submit & Check Answer
                    </button>
                  </div>
                )}

                {runOutput && (
                  <div className="p-4 bg-slate-950 border border-slate-600 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                      <Terminal size={16} className="text-emerald-400" />
                      Program Output
                    </div>

                    {runOutput.runtimeError && (
                      <div className="p-3 bg-rose-900/30 border border-rose-500/40 rounded-lg font-mono text-xs text-rose-300">
                        Error: {runOutput.runtimeError}
                      </div>
                    )}

                    {runOutput.consoleOutput && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase mb-1">Console</p>
                        <pre className="p-3 bg-black/40 rounded-lg font-mono text-xs text-yellow-300 whitespace-pre-wrap">
                          {runOutput.consoleOutput}
                        </pre>
                      </div>
                    )}

                    {runOutput.testResults.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500 uppercase">Test Results</p>
                        {runOutput.testResults.map((tr, i) => (
                          <div
                            key={i}
                            className={cn(
                              "p-3 rounded-lg border font-mono text-xs",
                              tr.passed
                                ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-300"
                                : "bg-rose-900/20 border-rose-500/30 text-rose-300",
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1 font-bold">
                              {tr.passed ? (
                                <CheckCircle size={14} />
                              ) : (
                                <XCircle size={14} />
                              )}
                              Test {i + 1}
                            </div>
                            <div>
                              Input: <span className="text-slate-200">{tr.input}</span>
                            </div>
                            <div>
                              Expected:{" "}
                              <span className="text-emerald-400">{tr.expectedOutput}</span>
                            </div>
                            <div>
                              Your Output:{" "}
                              <span className={tr.passed ? "text-emerald-400" : "text-rose-400"}>
                                {tr.actualOutput ?? (tr.error ? `Error: ${tr.error}` : "(no output)")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!runOutput.runtimeError &&
                      !runOutput.consoleOutput &&
                      runOutput.testResults.length === 0 && (
                        <p className="text-xs text-slate-500">No output produced.</p>
                      )}
                  </div>
                )}

                {codeFeedback && (
                  <div
                    className={cn(
                      "p-4 rounded-xl border text-sm",
                      codeFeedback.isCorrect
                        ? "bg-emerald-900/20 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-900/20 border-rose-500/40 text-rose-300",
                    )}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {codeFeedback.isCorrect ? (
                        <CheckCircle size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}
                      Score: {codeFeedback.score}%
                    </div>
                    <p>{codeFeedback.feedback}</p>
                  </div>
                )}
              </div>
            )}

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-8 flex justify-end"
                >
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors"
                  >
                    {currentQuestion < quiz.questions.length - 1
                      ? "Next Question"
                      : "View Results"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {showResults && quiz && (
        <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="lg:col-span-2 bg-slate-800 p-12 rounded-3xl border border-slate-700 shadow-sm text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="w-24 h-24 bg-indigo-900/40 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-indigo-400">
                {Math.round((score / quiz.questions.length) * 100)}%
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-white">
              Quiz Completed!
            </h2>
            <p className="text-slate-400 max-w-lg">
              You scored {score} out of {quiz.questions.length} on {topic}.
            </p>

            <div className="flex gap-4 text-sm text-slate-500">
              <span>
                {quiz.questions.filter((q) => q.type === "multiple_choice").length} MC
              </span>
              <span>·</span>
              <span>
                {quiz.questions.filter((q) => q.type === "programming").length} Coding
              </span>
            </div>

            <button
              onClick={() => setQuiz(null)}
              className="mt-8 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors inline-block"
            >
              Create New Quiz
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-sm space-y-6"
          >
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="text-indigo-400" size={24} /> Performance Review
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed border-b border-slate-700 pb-4">
              {quiz.overview}
            </p>

            {strengths.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                  <ThumbsUp size={16} /> Strong Areas
                </h4>
                {strengths.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-sm text-emerald-300"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle size={16} /> Areas to Improve
              </h4>
              {improvements.length > 0 ? (
                improvements.map((area, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-900/50 border border-rose-500/20 rounded-xl text-sm text-slate-200"
                  >
                    {area}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium text-center">
                  Perfect score! No specific areas to improve.
                </div>
              )}
            </div>

            {includeProgramming && (
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 mb-2">
                  Programming topics covered ({PROGRAMMING_TOPICS.length} total):
                </p>
                <div className="flex flex-wrap gap-1">
                  {PROGRAMMING_TOPICS.map((t) => {
                    const covered = quiz.questions.some(
                      (q) => q.subTopic === t || q.subTopic.includes(t),
                    );
                    const mastered = strengths.some(
                      (s) => s === t || s.includes(t),
                    );
                    return (
                      <span
                        key={t}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          mastered
                            ? "bg-emerald-900/30 border-emerald-500/40 text-emerald-400"
                            : covered
                              ? "bg-slate-900/50 border-slate-600 text-slate-400"
                              : "bg-rose-900/20 border-rose-500/30 text-rose-400",
                        )}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 p-8 rounded-3xl border border-indigo-500/30 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 rounded-xl">
              <GraduationCap className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Pro Learning Path</h3>
              <p className="text-sm text-slate-400">
                LearnSphere AI builds a mastery plan from your strengths
              </p>
            </div>
          </div>

          {loadingProPlan ? (
            <div className="flex items-center gap-2 text-slate-400 py-6">
              <Loader2 className="animate-spin" size={20} />
              Generating your personalized pro plan...
            </div>
          ) : proPlan ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-indigo-300">{proPlan.planTitle}</h4>
                <p className="text-slate-300 mt-2 leading-relaxed">{proPlan.summary}</p>
                <p className="text-xs text-slate-500 mt-2">
                  Estimated timeline: {proPlan.estimatedWeeks} weeks
                </p>
              </div>

              {proPlan.strengthHighlight?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {proPlan.strengthHighlight.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-emerald-900/30 border border-emerald-500/40 rounded-full text-xs text-emerald-300"
                    >
                      Strength: {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proPlan.phases.map((phase, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl space-y-2"
                  >
                    <p className="text-xs text-indigo-400 font-bold uppercase">
                      {phase.duration}
                    </p>
                    <h5 className="font-semibold text-white text-sm">{phase.title}</h5>
                    <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                      {phase.goals.slice(0, 3).map((g, j) => (
                        <li key={j}>{g}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() =>
                    navigate("/recommendations", {
                      state: {
                        topic: topicAnalysis?.recognizedTopic || topic,
                        level: strengths.length >= 2 ? "Pro" : "Intermediate",
                      },
                    })
                  }
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors flex items-center gap-2"
                >
                  Open AI Path Planner
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => setQuiz(null)}
                  className="px-6 py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Practice Another Topic
                </button>
              </div>
            </div>
          ) : null}
        </motion.div>
        </div>
      )}
    </motion.div>
  );
}
