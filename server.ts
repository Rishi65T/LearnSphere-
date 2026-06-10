import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  buildQuizFromBank,
  deduplicateQuizQuestions,
  PROGRAMMING_TOPICS,
} from "./src/data/quizQuestionBank.ts";
import { runJavaScriptWithTests, gradeFromTestResults } from "./src/lib/codeRunner.ts";
import videoRouter from "./src/routes/videoRouter";
import { GEMINI_MODELS, buildSphereBotOfflineResponse, getGeminiKey, getGeminiStatus, isGeminiConfigured, parseGeminiError } from "./src/lib/geminiHelpers.ts";

function createGeminiClient() {
  return new GoogleGenAI({
    apiKey: getGeminiKey() || "API_KEY_REQUIRED",
    httpOptions: {
      headers: {
        "User-Agent": "LearnSphere-AI",
      },
    },
  });
}

let ai = createGeminiClient();

async function generateWithGemini(
  contents: unknown,
  config?: Record<string, unknown>,
) {
  let lastError: unknown;
  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      if (response.text?.trim()) return response;
    } catch (e) {
      lastError = e;
      const kind = parseGeminiError(e);
      if (kind === "invalid_api_key" || kind === "quota_exceeded") break;
    }
  }
  throw lastError ?? new Error("Gemini request failed");
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3002;

  app.use(express.json());

  // Register API routes
  app.use("/api", videoRouter);

  // In-memory mock database
  const db = {
    users: [
      { id: 1, name: "Student User", role: "student", progress: 65, streak: 12 },
      { id: 2, name: "Instructor User", role: "instructor", courses: 5 },
      { id: 3, name: "Admin User", role: "admin" }
    ],
    courses: [
      { id: 101, title: "Advanced Machine Learning", category: "AI", difficulty: "Hard", rating: 4.8 },
      { id: 102, title: "Data Structures in Python", category: "Programming", difficulty: "Medium", rating: 4.5 },
      { id: 103, title: "Generative AI Foundations", category: "AI", difficulty: "Beginner", rating: 4.9 },
      { id: 104, title: "Full-Stack Web Dev", category: "Web", difficulty: "Medium", rating: 4.6 }
    ],
    recommendations: [],
    quizzes: [],
    chatbot_logs: []
  };

  // API endpoint: Get mock user context
  app.get("/api/user", (req, res) => {
    // Return student directly for demo purposes
    res.json(db.users[0]);
  });
  
  // API endpoint: Get dashboard stats based on role
  app.get("/api/dashboard/:role", (req, res) => {
    const role = req.params.role;
    if (role === "student") {
      res.json({
        enrolledCourses: 4,
        completedCourses: 2,
        overallProgress: 65,
        certificates: 1,
        learningStreak: 12
      });
    } else if (role === "instructor") {
      res.json({
        totalStudents: 1240,
        activeCourses: 5,
        averageRating: 4.7,
        totalRevenue: "$12,450"
      });
    } else if (role === "admin") {
      res.json({
        totalUsers: 4521,
        systemHealth: "100%",
        activeSubscriptions: 3200,
        pendingApprovals: 15
      });
    } else {
      res.status(400).json({ error: "Invalid role" });
    }
  });

  // API endpoint: Get courses
  app.get("/api/courses", (req, res) => {
    res.json(db.courses);
  });

  // AI endpoint: Generate course recommendations
  app.post("/api/ai/recommend", async (req, res) => {
    const { userInterests, currentSkills, goal } = req.body;
    const fallbackRecommendations = [
      { 
        title: `${goal || userInterests?.[0] || "Advanced Engineering Foundations"}`, 
        reason: "Tailored based on your primary goals to master critical concepts with zero overhead.", 
        difficulty: "Medium", 
        duration: "4 Weeks" 
      },
      { 
        title: "System Design and Scalability Models", 
        reason: "Excellent to master structural patterns, caching, concurrency, and real-time execution loops.", 
        difficulty: "Medium", 
        duration: "6 Weeks" 
      },
      { 
        title: "Production Quality & Resilient Code Patterns", 
        reason: "Focuses on high-performance structures and key testing practices to avoid production runtime drops.", 
        difficulty: "Hard", 
        duration: "3 Weeks" 
      }
    ];

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ recommendations: fallbackRecommendations });
      }
      
      const prompt = `Based on the following user profile, recommend 3 personalized courses:
      Interests: ${userInterests?.join(", ")}
      Current Skills: ${currentSkills?.join(", ")}
      Goal: ${goal}
      
      Respond only with JSON data in the following array format:
      [{"title": "Course Title", "reason": "Why it's recommended", "difficulty": "Beginner|Medium|Hard", "duration": "X weeks"}]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      let data = response.text ? JSON.parse(response.text) : [];
      res.json({ recommendations: data });
    } catch (e: any) {
      console.warn("Gemini recommended endpoint warning or quota exceeded, returning elegant fallback:", e);
      res.json({ recommendations: fallbackRecommendations });
    }
  });

  // AI endpoint: LearnSphere AI connection status
  app.get("/api/ai/status", (_req, res) => {
    const status = getGeminiStatus();
    res.json({
      online: status.online,
      reason: status.reason,
      message: status.message,
      setupUrl: "https://aistudio.google.com/apikey",
    });
  });

  // AI endpoint: Chatbot Tutor
  app.post("/api/ai/chat", async (req, res) => {
    const { message, history } = req.body;
    const userMessage = String(message || "").trim();
    const geminiStatus = getGeminiStatus();

    if (!isGeminiConfigured()) {
      return res.json({
        response: buildSphereBotOfflineResponse(userMessage, geminiStatus.reason),
        mode: "guided",
        reason: geminiStatus.reason,
      });
    }

    try {
      ai = createGeminiClient();

      const priorTurns = Array.isArray(history)
        ? history.filter(
            (turn: { role?: string; parts?: { text: string }[] }) =>
              turn?.role && turn?.parts?.[0]?.text,
          )
        : [];

      // Gemini requires conversation to start with a user turn
      while (priorTurns.length > 0 && priorTurns[0].role === "model") {
        priorTurns.shift();
      }

      const contents = [
        ...priorTurns,
        { role: "user", parts: [{ text: userMessage }] },
      ];

      const response = await generateWithGemini(contents, {
        systemInstruction:
          "You are SphereBot, an expert AI tutor for LearnSphere AI. Answer clearly and encouragingly. Focus only on the student's question. Use markdown for structure when helpful.",
      });

      res.json({ response: response.text, mode: "live" });
    } catch (e: unknown) {
      const errorKind = parseGeminiError(e);
      console.warn("SphereBot chat error:", errorKind, e);
      res.json({
        response: buildSphereBotOfflineResponse(userMessage, errorKind),
        mode: "guided",
        reason: errorKind,
      });
    }
  });


  const PROGRAMMING_KEYWORDS = [
    "javascript", "python", "java", "react", "code", "programming", "algorithm",
    "data structure", "typescript", "node", "sql", "c++", "c#", "golang", "rust",
    "html", "css", "angular", "vue", "django", "flask", "spring", "kotlin", "swift",
  ];

  function isProgrammingTopic(topic: string): boolean {
    const lower = topic.toLowerCase();
    return PROGRAMMING_KEYWORDS.some((k) => lower.includes(k));
  }

  function analyzeTopicFallback(topic: string) {
    const programming = isProgrammingTopic(topic);
    return {
      recognizedTopic: topic,
      topicCategory: programming ? "programming" : "conceptual",
      quizFormat: programming ? "mixed" : "mcq_only",
      includeProgramming: programming,
      reasoning: programming
        ? `"${topic}" is a hands-on coding topic. LearnSphere AI recommends a mix of multiple-choice and programming challenges.`
        : `"${topic}" is a conceptual topic. LearnSphere AI recommends MCQ-only questions focused strictly on this subject.`,
      subTopics: programming
        ? PROGRAMMING_TOPICS.slice(0, 8)
        : [`${topic} fundamentals`, `${topic} core concepts`, `${topic} applications`],
    };
  }

  // AI endpoint: Analyze quiz topic and recommend format
  app.post("/api/ai/quiz/analyze-topic", async (req, res) => {
    const { topic } = req.body;
    const quizTopic = (topic || "").trim();
    if (!quizTopic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const fallback = analyzeTopicFallback(quizTopic);

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json(fallback);
      }

      const prompt = `You are LearnSphere AI's topic analyzer. The user wants a quiz ONLY about this exact topic: "${quizTopic}".

Analyze the topic and respond with STRICT JSON:
{
  "recognizedTopic": "Clear normalized name of the topic",
  "topicCategory": "programming" | "conceptual" | "mixed",
  "quizFormat": "mcq_only" | "mixed" | "programming_heavy",
  "includeProgramming": true or false,
  "reasoning": "1-2 sentences explaining why this format fits THIS topic only",
  "subTopics": ["3-8 sub-areas that are STRICTLY within ${quizTopic} — never unrelated subjects"]
}

Rules:
- quizFormat "mcq_only" for theory/history/science/business topics with no coding
- quizFormat "mixed" for programming languages, frameworks, algorithms
- quizFormat "programming_heavy" for pure coding practice topics
- subTopics must ALL relate directly to "${quizTopic}" — do NOT suggest unrelated topics the user may have studied before
- includeProgramming is false when the topic has no coding component`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const data = response.text ? JSON.parse(response.text) : fallback;
      res.json({ ...fallback, ...data, recognizedTopic: data.recognizedTopic || quizTopic });
    } catch (e: unknown) {
      console.warn("Topic analyze fallback:", e);
      res.json(fallback);
    }
  });

  // AI endpoint: Pro learning plan from quiz strengths
  app.post("/api/ai/quiz/pro-plan", async (req, res) => {
    const {
      topic,
      strengths = [],
      improvements = [],
      score = 0,
      totalQuestions = 0,
      difficulty = "Medium",
      historicalStrengths = [],
    } = req.body;

    const quizTopic = topic || "General";
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const allStrengths = [...new Set([...strengths, ...historicalStrengths])];

    const fallbackPlan = {
      planTitle: `Become a Pro in ${quizTopic}`,
      summary: allStrengths.length > 0
        ? `You show strong aptitude in ${allStrengths.slice(0, 3).join(", ")}. This plan builds on your strengths to reach professional mastery in ${quizTopic}.`
        : `Score ${pct}% on ${quizTopic}. Follow this structured plan to build expertise step by step.`,
      estimatedWeeks: difficulty === "Hard" ? 8 : difficulty === "Medium" ? 6 : 4,
      phases: [
        {
          title: "Phase 1: Solidify Foundations",
          duration: "1-2 weeks",
          goals: allStrengths.length > 0
            ? [`Deepen your existing strength in ${allStrengths[0]}`, `Review ${quizTopic} fundamentals`]
            : [`Master core ${quizTopic} concepts`, "Complete beginner practice sets"],
          resources: ["LearnSphere AI Path Planner syllabus", "SphereBot tutor for Q&A"],
        },
        {
          title: "Phase 2: Applied Practice",
          duration: "2-3 weeks",
          goals: improvements.length > 0
            ? improvements.slice(0, 3).map((a: string) => `Improve: ${a}`)
            : [`Build real ${quizTopic} projects`, "Take mixed MCQ + coding quizzes"],
          resources: ["Smart Quiz Engine with coding challenges", "Interactive lesson modules"],
        },
        {
          title: "Phase 3: Pro-Level Mastery",
          duration: "2-3 weeks",
          goals: [
            `Solve advanced ${quizTopic} problems independently`,
            "Teach or explain concepts to others",
            "Build a portfolio piece demonstrating expertise",
          ],
          resources: ["Hard-difficulty quizzes", "AI-generated custom syllabus at Pro level"],
        },
      ],
      nextSteps: [
        "Open AI Path Planner and generate a Pro-level syllabus for your strongest area",
        "Retake quizzes at Hard difficulty focusing on weak spots",
        "Use SphereBot to drill concepts you missed",
      ],
      strengthHighlight: allStrengths.slice(0, 5),
    };

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json(fallbackPlan);
      }

      const prompt = `You are LearnSphere AI's career coach. Create a personalized "Become a Pro" learning plan.

Topic: "${quizTopic}"
Difficulty attempted: ${difficulty}
Quiz score: ${score}/${totalQuestions} (${pct}%)
Current session strengths: ${JSON.stringify(strengths)}
Areas to improve: ${JSON.stringify(improvements)}
Historical strengths across quizzes: ${JSON.stringify(historicalStrengths)}

The user is good at certain areas — build the plan around AMPLIFYING those strengths into professional mastery, while addressing gaps.

Return STRICT JSON:
{
  "planTitle": "...",
  "summary": "2-3 motivating sentences",
  "estimatedWeeks": number,
  "phases": [
    { "title": "...", "duration": "...", "goals": ["..."], "resources": ["..."] }
  ],
  "nextSteps": ["3-5 actionable steps using LearnSphere AI features"],
  "strengthHighlight": ["top strengths to double down on"]
}

Keep all content focused ONLY on "${quizTopic}". Do not mention unrelated subjects.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const data = response.text ? JSON.parse(response.text) : fallbackPlan;
      res.json({ ...fallbackPlan, ...data });
    } catch (e: unknown) {
      console.warn("Pro plan fallback:", e);
      res.json(fallbackPlan);
    }
  });

  // AI endpoint: Smart Quiz Generation
  app.post("/api/ai/quiz", async (req, res) => {
    const {
      topic,
      difficulty,
      questionCount: rawCount,
      includeProgramming = true,
      subTopics: requestedSubTopics = [],
    } = req.body;
    const quizTopic = topic || "General Programming";
    const questionCount = Math.min(40, Math.max(5, Number(rawCount) || 10));
    const topicIsProgramming = isProgrammingTopic(quizTopic);
    const effectiveIncludeProgramming = includeProgramming && topicIsProgramming;
    const fallbackQuiz = buildQuizFromBank(quizTopic, questionCount, effectiveIncludeProgramming);

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json(fallbackQuiz);
      }

      const subTopicsList = Array.isArray(requestedSubTopics) && requestedSubTopics.length > 0
        ? requestedSubTopics
        : topicIsProgramming
          ? [...PROGRAMMING_TOPICS]
          : [`${quizTopic} fundamentals`, `${quizTopic} principles`, `${quizTopic} applications`, `${quizTopic} advanced concepts`];

      const topicsList = subTopicsList.map((t: string, i: number) => `${i + 1}. ${t}`).join("\n");
      const mcCount = effectiveIncludeProgramming
        ? Math.max(1, Math.floor(questionCount * 0.35))
        : questionCount;
      const progCount = effectiveIncludeProgramming ? questionCount - mcCount : 0;

      const programmingBlock = progCount > 0 ? `
- ${progCount} programming/coding questions (type: "programming") — ONLY if they test "${quizTopic}" directly
CRITICAL for programming questions:
- Each programming question's "subTopic" must be a sub-area WITHIN "${quizTopic}" from this list:
${topicsList}
- Problems must require writing code related to "${quizTopic}" — not generic unrelated algorithms
- Use functionName "solve" and testCases with string input/expectedOutput` : "";

      const prompt = `You are LearnSphere AI's quiz generator. Generate a quiz EXCLUSIVELY about "${quizTopic}" at "${difficulty}" level.

TOPIC LOCK — MANDATORY:
- EVERY question must test knowledge of "${quizTopic}" ONLY.
- Do NOT include questions about other subjects, previous searches, or unrelated technologies.
- subTopic on each question must be a specific sub-area WITHIN "${quizTopic}".
- If the topic is "${quizTopic}", questions about other fields are FORBIDDEN.

Total questions: exactly ${questionCount}.
- ${mcCount} multiple-choice questions (type: "multiple_choice")${programmingBlock}

Use these sub-areas within "${quizTopic}" for subTopic assignment (distribute evenly):
${topicsList}

CRITICAL — NO DUPLICATES:
- Every question MUST have completely unique question text.
- Every multiple-choice question MUST have 4 distinct, non-repeated options.
- Do NOT reuse the same question or option wording across questions.

Each question needs "subTopic", "improvementArea" (what to study if wrong), and "strengthArea" (what they mastered if correct).

Return strictly JSON:
{
  "overview": "Brief study plan summary.",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "subTopic": "...",
      "question": "...",
      "options": ["A","B","C","D"],
      "correctAnswer": 0,
      "improvementArea": "...",
      "strengthArea": "..."
    },
    {
      "id": 2,
      "type": "programming",
      "subTopic": "Variables & Data Types",
      "question": "Clear problem statement...",
      "language": "javascript",
      "starterCode": "// starter code with TODO",
      "testCases": [{"input": "...", "expectedOutput": "..."}],
      "hint": "Optional hint",
      "solution": "Reference solution for grading",
      "improvementArea": "...",
      "strengthArea": "..."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let quizData = response.text ? JSON.parse(response.text) : fallbackQuiz;
      if (Array.isArray(quizData)) {
        quizData = { questions: quizData, overview: "Review the topic fundamentals." };
      }
      if (!quizData.questions?.length) {
        quizData = fallbackQuiz;
      }
      quizData.questions = deduplicateQuizQuestions(quizData.questions);
      if (quizData.questions.length < questionCount && topicIsProgramming) {
        const bank = buildQuizFromBank(quizTopic, questionCount, effectiveIncludeProgramming);
        const existingIds = new Set(
          quizData.questions.map((q: Record<string, unknown>) =>
            String(q.question).trim().toLowerCase(),
          ),
        );
        for (const bq of bank.questions) {
          if (quizData.questions.length >= questionCount) break;
          const key = String(bq.question).trim().toLowerCase();
          if (!existingIds.has(key)) {
            existingIds.add(key);
            quizData.questions.push(bq);
          }
        }
      }
      quizData.questions = quizData.questions.slice(0, questionCount).map(
        (q: Record<string, unknown>, idx: number) => ({
          ...q,
          id: idx + 1,
          type: q.type ?? "multiple_choice",
          subTopic: q.subTopic ?? quizTopic,
          functionName: q.functionName ?? "solve",
        }),
      );
      res.json(quizData);
    } catch (e: unknown) {
      console.warn("Gemini quiz endpoint warning or quota exceeded, returning custom fallback quiz:", e);
      res.json(fallbackQuiz);
    }
  });

  // AI endpoint: Run code and show output (no grading)
  app.post("/api/ai/quiz/run-code", (req, res) => {
    const {
      userCode,
      testCases = [],
      functionName = "solve",
    } = req.body;

    if (!userCode?.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    const runResult = runJavaScriptWithTests(userCode, testCases, functionName);
    res.json(runResult);
  });

  // AI endpoint: Evaluate programming quiz answers
  app.post("/api/ai/quiz/evaluate-code", async (req, res) => {
    const {
      question,
      userCode,
      language = "javascript",
      testCases = [],
      solution,
      subTopic,
      functionName = "solve",
    } = req.body;

    const runResult = runJavaScriptWithTests(userCode || "", testCases, functionName);
    const testGrade = gradeFromTestResults(runResult, subTopic);

    const responsePayload = {
      ...testGrade,
      consoleOutput: runResult.consoleOutput,
      testResults: runResult.testResults,
      runtimeError: runResult.runtimeError,
    };

    if (testCases.length > 0) {
      return res.json(responsePayload);
    }

    const fallbackEvaluate = () => ({
      ...testGrade,
      consoleOutput: runResult.consoleOutput,
      testResults: runResult.testResults,
      runtimeError: runResult.runtimeError,
    });

    try {
      if (!process.env.GEMINI_API_KEY || !userCode?.trim()) {
        return res.json(fallbackEvaluate());
      }

      const prompt = `You are a programming tutor grading a student's code.

Topic/Sub-topic: ${subTopic || "General Programming"}
Language: ${language}
Problem: ${question}
Reference solution: ${solution || "N/A"}

Student code:
\`\`\`${language}
${userCode}
\`\`\`

Test run results: ${JSON.stringify(runResult.testResults)}

Evaluate the student's code. Be fair — accept logically correct alternatives.
Return JSON only:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "Specific feedback on their approach",
  "strengths": ["topics/concepts they demonstrated well"],
  "improvements": ["specific areas to improve"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const aiResult = response.text ? JSON.parse(response.text) : testGrade;
      res.json({
        ...aiResult,
        consoleOutput: runResult.consoleOutput,
        testResults: runResult.testResults,
        runtimeError: runResult.runtimeError,
      });
    } catch (e: unknown) {
      console.warn("Code evaluation fallback:", e);
      res.json(fallbackEvaluate());
    }
  });

  // AI endpoint: Generate detailed syllabus
  app.post("/api/ai/syllabus", async (req, res) => {
    const { topic, level } = req.body;
    const studyTopic = topic || "Computer Science Fundamentals";
    const fallbackSyllabus = {
      syllabus: {
        title: `${studyTopic} Intensive Study Path`,
        description: `A fast-track path designed for mastering core concepts in ${studyTopic} without unnecessary jargon.`,
        studyPlan: "4 Weeks Route",
        modules: [
          {
            title: "Module 1: Foundations",
            lessons: [
              { title: `Introduction to ${studyTopic}`, duration: "12m", type: "video" },
              { title: `Core Methods and Operational Tradeoffs`, duration: "15m", type: "reading" }
            ]
          },
          {
            title: "Module 2: Advanced Engineering Practical application",
            lessons: [
              { title: "Step-by-step System Caching Concepts", duration: "10m", type: "video" },
              { title: "Optimizing State Loops & Consistency Patterns", duration: "18m", type: "reading" }
            ]
          }
        ]
      }
    };

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json(fallbackSyllabus);
      }

      const prompt = `Act as an expert instructional designer. Generate a detailed, sophisticated syllabus for the topic: "${topic}" geared towards a "${level}" level learner.
      
      Respond STRICTLY in JSON format matching this schema:
      {
        "title": "Course Title",
        "description": "Short description of the course.",
        "studyPlan": "Suggested timeframe (e.g., 4 Weeks)",
        "modules": [
          {
            "title": "Module Title",
            "lessons": [
              {
                "title": "Lesson Title",
                "duration": "Estimated duration (e.g., 10m)",
                "type": "video"
              }
            ]
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let data = response.text ? JSON.parse(response.text) : {};
      res.json({ syllabus: data });
    } catch (e: any) {
      console.warn("Gemini syllabus endpoint warning or quota exceeded, returning custom fallback syllabus:", e);
      res.json(fallbackSyllabus);
    }
  });

  // AI endpoint: Generate detailed textbook, video embeds, and English transcripts for dynamic syllabus lessons
  app.post("/api/ai/generate-lesson-content", async (req, res) => {
    const { courseTitle, lessonTitle, difficulty } = req.body;

    // Dynamically construct high-quality text for requested topic to fulfill user-intent on requested syllabus topic matching
    const dynamicFallback = {
      chapterNotes: `## ${lessonTitle || "Lesson Study"}\n\nWelcome to this comprehensive academic material on **${lessonTitle || "this topic"}**, part of the specialized curriculum for **${courseTitle || "Advanced Engineering"}**.\n\n### Foundational Concepts\n- Master the primary patterns of **${lessonTitle || "this engineering area"}**.\n- Analyze key design trade-offs and runtime speed metrics.\n- Review high-performance architecture pipelines and state consistency.\n\n### Practical Implementation Strategy\n1. Establish robust environment boundaries.\n2. Implement responsive scaling checks.\n3. Verify operational accuracy and runtime latency.`,
      keyPoints: [
        `Introduction to ${lessonTitle || "the core concepts"}`,
        `Analyzing tradeoffs in ${courseTitle || "the wider area"}`,
        `Direct practical validation of ${lessonTitle || "the topic"}`
      ],
      embeds: {
        English: "https://www.youtube.com/embed/5faMjKuBliA"
      },
      transcripts: {
        English: [
          { time: "0:00", text: `Welcome to this technical session exploring the core architecture of ${lessonTitle || "our subject"}.` },
          { time: "1:30", text: `Let us analyze why ${lessonTitle || "this principle"} holds significance inside modern high-performance engineering system loops.` },
          { time: "3:45", text: `Refer to your course text files on ${courseTitle || "the subject"} to compare other system layouts.` },
          { time: "5:10", text: `We will continue our interactive drills and verify dynamic data execution models. Let us continue.` }
        ]
      }
    };

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json(dynamicFallback);
      }

      const prompt = `You are an elite software engineering professor. Generate comprehensive educational content for an engineering student learning about the topic "${lessonTitle}" in the course "${courseTitle}" (Difficulty: ${difficulty}).
      
      Generate details matching the following JSON schema:
      {
        "chapterNotes": "A very detailed, professional, multi-paragraph textbook chapter in Markdown formatting (using ## headers, bold text, code blocks if applicable, bulleted lists, and comprehensive explanations) that an engineer must master. Ensure it is complete, highly informative, and ready for deep academic study.",
        "keyPoints": [
          "Key Takeaway 1",
          "Key Takeaway 2",
          "Key Takeaway 3"
        ],
        "embeds": {
          "English": "A real or highly accurate relevant educational YouTube video embed URL (such as https://www.youtube.com/embed/... from reliable educational channels, e.g. freeCodeCamp, MIT OCW, Traversy Media, fireship, or other top engineering creators)"
        },
        "transcripts": {
          "English": [
            {"time": "0:00", "text": "Welcome to this specialized chapter of our training track. Today we are looking at the foundational principles."},
            {"time": "1:45", "text": "As we dive deeper into this topic context, notice how these design trade-offs affect runtime execution speed."},
            {"time": "3:30", "text": "Make sure to review the code samples and diagram flowcharts mapped inside the accompanying Chapter PDF notes."},
            {"time": "5:15", "text": "In the subsequent tutorials, we will apply these frameworks into production pipelines. Let us continue."}
          ]
        }
      }

      You must return ONLY the requested JSON, and ensure the youtube links are secure embed URLs ('https://www.youtube.com/embed/video_id'). Do not include backticks surrounding the JSON, or output anything else.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let contentData = response.text ? JSON.parse(response.text) : {};
      
      // Ensure only English transcripts are provided as requested
      if (contentData.transcripts) {
        contentData.transcripts = {
          English: contentData.transcripts.English || [
            { time: "0:00", text: `Welcome to this specialized session on ${lessonTitle}.` }
          ]
        };
      } else {
        contentData.transcripts = {
          English: [
            { time: "0:00", text: `Welcome to this specialized session on ${lessonTitle}.` }
          ]
        };
      }

      res.json(contentData);
    } catch (e: any) {
      console.warn("Gemini Error caught, using topic-specific fallback details gracefully:", e);
      res.json(dynamicFallback);
    }
  });

  // AI endpoint: Dynamic Search for Topic Video and Simple English Summary
  app.post("/api/ai/search-video-summary", async (req, res) => {
    const { topic } = req.body;
    const cleanTopic = topic || "Distributed Systems";

    // Highly readable topic specific fallback if API key or networking is down
    const fallback = {
      embedUrl: "https://www.youtube.com/embed/5faMjKuBliA",
      summary: `### What is **${cleanTopic}**?\n\n**${cleanTopic}** is an exciting topic! \n\nImagine a large hive of busy bees. No single bee can make a whole honeycomb by itself. So, they work together as a team! Each bee solves a small task. That is exactly how **${cleanTopic}** is built!\n\n### Why do we need it?\n- **Speed**: It makes tasks finish incredibly quickly by spreading the load.\n- **Safeguard**: If one computer has an issue, the others keep the operations safe.\n- **Simplicity**: Breaking big complex architectures into tiny pieces makes it super easy to understand.\n\n### Simple Analogy to Remember:\nThink of it like washing dishes at home with family. One washes, one dries, and one puts them away. It's much easier and faster together!`
    };

    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json(fallback);
      }

      const prompt = `You are a friendly AI professor who explains complex computer engineering topics using extremely simple, clear, easy English.
      
      For the topic request: "${cleanTopic}"
      
      1. Find a matching, high-quality, real or highly accurate youtube video embed URL (format must be secure: https://www.youtube.com/embed/video_id from reliable, standard computer science channels like freeCodeCamp, MIT, Traversy Media, fireship, CrashCourse, etc.).
      
      2. Write a clear, elementary explanation of this topic. Avoid hard jargon, use very simple words, clear analogies (like recipes, playgrounds, sports, or simple tools), and bullet points to make it super-friendly and easy for any beginner student to understand immediately. Keep it encouraging!
      
      Respond STRICTLY in JSON format matching this schema:
      {
        "embedUrl": "https://www.youtube.com/embed/...",
        "summary": "The simple English summary with analogies"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let content = response.text ? JSON.parse(response.text) : {};
      
      if (content.embedUrl && !content.embedUrl.startsWith("https://www.youtube.com/embed/")) {
        content.embedUrl = "https://www.youtube.com/embed/5faMjKuBliA";
      }
      if (!content.summary) {
        content.summary = fallback.summary;
      }
      res.json(content);
    } catch (e) {
      console.warn("Exception in search-video-summary generation, fallback served:", e);
      res.json(fallback);
    }
  });

  // AI endpoint: Video context interaction (transcripts, summaries, Q&A)
  app.post("/api/ai/video-interaction", async (req, res) => {
    const { action, lessonTitle, query } = req.body;
    const cleanName = lessonTitle || "this active lesson";
    
    const interactionFallbackRes = {
      response: `### Simple English Study Guide for **${cleanName}**\n\n- **Foundations**: Mastering the fundamental architectural principles is key to building durable, resilient solutions.\n- **Real-World Analogy**: Think of it like baking a cake. If you prepare your ingredients and follow step-by-step rules, the final result compiles perfectly without stress!\n- **Actionable Tips**: Keep your variables clean, structure files modularly, and write tests early.\n\nHope this simple explanation encourages your study! Let me know if you want to explore more!`,
      data: [
        {"time": "0:00", "label": "Foundational Introduction"},
        {"time": "1:30", "label": "Analyzing Performance Tradeoffs"},
        {"time": "3:00", "label": "Reviewing Practical Analogy Pattern"},
        {"time": "4:45", "label": "Session Outline & Next Quiz Preview"}
      ]
    };

    try {
      if (!process.env.GEMINI_API_KEY) {
         return res.json(action === "keyMoments" ? { data: interactionFallbackRes.data } : { response: interactionFallbackRes.response });
      }
      
      let prompt = "";
      if (action === "summary") {
        prompt = `Generate a 3-bullet concise summary of a lesson titled "${lessonTitle}". Provide only the summary using very easy, simplified English suitable for a beginner student.`;
      } else if (action === "keyMoments") {
        prompt = `Generate 4 realistic key moments (with timestamps like 0:00, 2:15) for a lesson titled "${lessonTitle}". 
        Format as JSON array of objects: [{"time": "0:00", "label": "Introduction"}, ...]`;
      } else if (action === "chat") {
        prompt = `You are an AI Tutor helping a student who is currently watching a lesson titled "${lessonTitle}". They asked: "${query}". Provide a helpful, concise answer.`;
      } else if (action === "studyPlan") {
        prompt = `Generate a 4-week personalized step-by-step study roadmap for a student mastering "${lessonTitle}". Provide Week 1, Week 2, Week 3, Week 4 milestones. Write concisely in simple, clear English suitable for easy reading. Keeping it format friendly and under 150 words.`;
      }

      let config: any = {};
      if (action === "keyMoments") {
         config.responseMimeType = "application/json";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config,
      });

      if (action === "keyMoments") {
        res.json({ data: JSON.parse(response.text || "[]") });
      } else {
        res.json({ response: response.text });
      }
    } catch (e: any) {
      console.warn("Gemini video interaction endpoint warning or quota exceeded, returning topic fallback:", e);
      if (action === "keyMoments") {
        res.json({ data: interactionFallbackRes.data });
      } else {
        res.json({ response: interactionFallbackRes.response });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
