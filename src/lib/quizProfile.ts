export type QuizSession = {
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  strengths: string[];
  improvements: string[];
  completedAt: string;
};

export type QuizProfile = {
  sessions: QuizSession[];
  topStrengths: { area: string; count: number }[];
  weakAreas: { area: string; count: number }[];
};

const STORAGE_KEY = "learnsphere_quiz_profile";

function loadSessions(): QuizSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function aggregateAreas(
  sessions: QuizSession[],
  field: "strengths" | "improvements",
): { area: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const session of sessions) {
    for (const area of session[field]) {
      const key = area.trim();
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count);
}

export function saveQuizSession(session: QuizSession): QuizProfile {
  const sessions = loadSessions();
  sessions.unshift(session);
  const trimmed = sessions.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return getQuizProfile();
}

export function getQuizProfile(): QuizProfile {
  const sessions = loadSessions();
  return {
    sessions,
    topStrengths: aggregateAreas(sessions, "strengths"),
    weakAreas: aggregateAreas(sessions, "improvements"),
  };
}

export function getDominantStrengths(minCount = 2): string[] {
  return getQuizProfile()
    .topStrengths.filter((s) => s.count >= minCount)
    .slice(0, 5)
    .map((s) => s.area);
}
