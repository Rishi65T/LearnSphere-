const PLACEHOLDER_KEYS = new Set([
  "",
  "API_KEY_REQUIRED",
  "MY_GEMINI_API_KEY",
  "your_api_key_here",
  "your-api-key",
]);

export const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
] as const;

export type GeminiStatusReason =
  | "ready"
  | "missing_key"
  | "placeholder_key"
  | "likely_invalid_key";

export function getGeminiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, "");
  return key || undefined;
}

export function getGeminiStatus(): {
  online: boolean;
  reason: GeminiStatusReason;
  message: string;
} {
  const key = getGeminiKey();

  if (!key) {
    return {
      online: false,
      reason: "missing_key",
      message:
        "GEMINI_API_KEY is not set. Add your key to the .env file to enable live SphereBot tutoring.",
    };
  }

  if (PLACEHOLDER_KEYS.has(key)) {
    return {
      online: false,
      reason: "placeholder_key",
      message:
        "GEMINI_API_KEY is still a placeholder. Replace it with a real key from Google AI Studio.",
    };
  }

  // Classic AI Studio keys start with AIza; newer tokens may use other prefixes (e.g. AQ.)
  const looksLikeApiKey =
    (key.startsWith("AIza") && key.length >= 35) ||
    (key.startsWith("AQ.") && key.length >= 20) ||
    key.length >= 30;

  if (!looksLikeApiKey) {
    return {
      online: false,
      reason: "likely_invalid_key",
      message:
        "GEMINI_API_KEY looks invalid. Get a new key at https://aistudio.google.com/apikey and update your .env file.",
    };
  }

  return {
    online: true,
    reason: "ready",
    message: "LearnSphere AI is connected and SphereBot is online.",
  };
}

export function isGeminiConfigured(): boolean {
  return getGeminiStatus().online;
}

export function parseGeminiError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error);

  if (raw.includes("API_KEY_INVALID") || raw.includes("API key not valid")) {
    return "invalid_api_key";
  }
  if (raw.includes("429") || raw.toLowerCase().includes("quota")) {
    return "quota_exceeded";
  }
  if (raw.includes("404") || raw.toLowerCase().includes("not found")) {
    return "model_not_found";
  }
  return "api_error";
}

export function buildSphereBotOfflineResponse(
  message: string,
  errorKind: string,
): string {
  const question = (message || "learning").trim();
  const lower = question.toLowerCase();

  let statusNote: string;
  if (errorKind === "invalid_api_key" || errorKind === "likely_invalid_key") {
    statusNote =
      "**SphereBot status:** Guided study mode — your Gemini API key is missing or invalid. Add a valid `GEMINI_API_KEY` in `.env` (get one free at https://aistudio.google.com/apikey), then restart the server.";
  } else if (errorKind === "missing_key" || errorKind === "placeholder_key") {
    statusNote =
      "**SphereBot status:** Guided study mode — configure `GEMINI_API_KEY` in your `.env` file to enable full AI tutoring.";
  } else if (errorKind === "quota_exceeded") {
    statusNote =
      "**SphereBot status:** Guided study mode — the AI quota was exceeded. Try again later or check your API billing.";
  } else {
    statusNote =
      "**SphereBot status:** Guided study mode — live AI is temporarily unavailable. Here is structured help for your question:";
  }

  let studyTips: string;
  if (/\b(code|coding|program|javascript|python|java|react|function|loop|array)\b/i.test(lower)) {
    studyTips = `For **"${question}"**, try this approach:\n\n1. **Define the problem** — write inputs, outputs, and edge cases.\n2. **Pseudocode first** — plan logic before syntax.\n3. **Test small examples** — use the Smart Quiz Engine coding runner to verify.\n4. **Review one concept** — variables, loops, functions, or data structures as needed.\n5. **Practice** — retake a quiz on this topic at Medium difficulty.`;
  } else if (/\b(quiz|test|exam|assess)\b/i.test(lower)) {
    studyTips = `To prepare for **"${question}"**:\n\n1. Open **Smart Quiz Engine** and enter your exact topic.\n2. Let LearnSphere AI recommend MCQ-only or mixed format.\n3. Review weak areas in the results panel.\n4. Follow the **Pro Learning Path** generated after your quiz.\n5. Use **AI Path Planner** for a full syllabus on your strongest topic.`;
  } else if (/\b(stuck|help|understand|explain|what is|how do)\b/i.test(lower)) {
    studyTips = `To understand **"${question}"**:\n\n1. Break it into 2–3 smaller sub-questions.\n2. Search the topic on your **Dashboard** video tutor for a quick lesson.\n3. Read the chapter notes in **Interactive Learning**.\n4. Ask SphereBot again once your API key is configured for a detailed AI explanation.\n5. Take a short quiz to confirm you understood the core idea.`;
  } else {
    studyTips = `Regarding **"${question}"**:\n\n1. **Clarify your goal** — what do you want to be able to do after studying this?\n2. **Use AI Path Planner** — generate a week-by-week syllabus for this topic.\n3. **Take a topic-focused quiz** — LearnSphere AI will keep questions strictly on your subject.\n4. **Track progress** on your Dashboard as you complete lessons.\n5. **Return to SphereBot** after setting up your API key for personalized, conversational tutoring.`;
  }

  return `${statusNote}\n\n${studyTips}`;
}
