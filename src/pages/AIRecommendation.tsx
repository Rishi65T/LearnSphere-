import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  BookOpen,
  Clock,
  Play,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

export function AIRecommendation() {
  const location = useLocation();
  const navState = location.state as { topic?: string; level?: "Beginner" | "Intermediate" | "Pro" } | null;
  const [topic, setTopic] = useState(navState?.topic ?? "");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Pro">(
    navState?.level ?? "Beginner",
  );
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState<any>(null);
  const navigate = useNavigate();

  const generateSyllabus = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level }),
      });
      const data = await res.json();
      if (data.syllabus) {
        setSyllabus(data.syllabus);

        // Map and save the template immediately so that it displays on the main Dashboard automatically
        let lessonCount = 1;
        const lessonsData: any[] = [];
        (data.syllabus.modules || []).forEach((mod: any) => {
          (mod.lessons || []).forEach((les: any) => {
            lessonsData.push({
              id: lessonCount++,
              title: les.title,
              type: (les.type === "reading" ? "READING" : "VIDEO"),
              time: les.duration || "15 min",
              iconName: les.type === "reading" ? "book" : "video",
              chapterNotes: "",
              keyPoints: [],
              embeds: null,
              transcripts: null
            });
          });
        });

        const dynamicCourse = {
          id: "sys-gen-1",
          title: data.syllabus.title || topic,
          description: data.syllabus.description || `Custom syllabus tailored for mastering ${topic}`,
          instructor: "AI Professor",
          category: "AI Engineered Path",
          difficulty: level,
          iconName: "brain",
          themeColor: "from-purple-500 to-indigo-600",
          lessons: lessonsData
        };

        localStorage.setItem("generated_syllabus_course", JSON.stringify(dynamicCourse));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const startDynamicCourse = (targetLessonIdx?: number) => {
    if (!syllabus) return;

    let lessonCount = 1;
    const lessonsData: any[] = [];
    
    (syllabus.modules || []).forEach((mod: any) => {
      (mod.lessons || []).forEach((les: any) => {
        lessonsData.push({
          id: lessonCount++,
          title: les.title,
          type: (les.type === "reading" ? "READING" : "VIDEO"),
          time: les.duration || "15 min",
          iconName: les.type === "reading" ? "book" : "video",
          chapterNotes: "",
          keyPoints: [],
          embeds: null,
          transcripts: null
        });
      });
    });

    const dynamicCourse = {
      id: "sys-gen-1",
      title: syllabus.title || topic,
      description: syllabus.description || `Custom syllabus tailored for mastering ${topic}`,
      instructor: "AI Professor",
      category: "AI Engineered Path",
      difficulty: level,
      iconName: "brain",
      themeColor: "from-purple-500 to-indigo-600",
      lessons: lessonsData
    };

    localStorage.setItem("generated_syllabus_course", JSON.stringify(dynamicCourse));

    if (targetLessonIdx !== undefined) {
      localStorage.setItem("selected_lesson_id", String(targetLessonIdx + 1));
    } else {
      localStorage.removeItem("selected_lesson_id");
    }
    navigate("/learn/sys-gen-1");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 w-full"
    >
      <header className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-900/40 text-indigo-400 rounded-2xl mb-2">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
          AI Syllabus Generator
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Define your learning path. Our AI will craft a sophisticated,
          structured syllabus tailored to your level.
        </p>
      </header>

      <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-sm transition-all focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide">
              Topic to Master
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Advanced Generative AI architectures..."
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-600 rounded-xl focus:outline-none focus:bg-slate-900 transition-all text-lg text-slate-200 placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide">
              Current Level
            </label>
            <div className="flex bg-slate-900/50 rounded-xl border border-slate-600 p-1">
              {(["Beginner", "Intermediate", "Pro"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "flex-1 py-3 px-2 text-xs font-semibold rounded-lg transition-colors",
                    level === l
                      ? "bg-slate-700 text-white shadow"
                      : "text-slate-400 hover:text-slate-300",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={generateSyllabus}
          disabled={loading || !topic.trim()}
          className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Sparkles size={20} />
          )}
          {loading ? "Crafting Syllabus..." : "Generate Syllabus"}
        </button>
      </div>

      <AnimatePresence>
        {syllabus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-6 pt-4"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-700 pb-6">
              <div>
                <h2 className="text-3xl font-bold font-display text-white tracking-tight mb-2">
                  {syllabus.title}
                </h2>
                <p className="text-slate-400 max-w-2xl">
                  {syllabus.description}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-900/30 text-indigo-300 border border-indigo-500/30 rounded-full font-medium">
                <Clock size={18} /> {syllabus.studyPlan}
              </div>
            </div>

            <div className="grid gap-6">
              {syllabus.modules?.map((mod: any, i: number) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className={cn(
                    "bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:bg-slate-700/50 transition-colors relative overflow-hidden group",
                  )}
                >
                  {i === 0 && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-slate-900/50 rounded-xl shrink-0">
                      <BookOpen className="text-indigo-400" size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-indigo-400 mb-1 uppercase tracking-wider">
                        Module {i + 1}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 pl-[3.25rem]">
                    {mod.lessons?.map((lesson: any, j: number) => {
                      const globalLessonIdx = syllabus.modules
                        .slice(0, i)
                        .reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) + j;

                      return (
                        <div
                          key={j}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                              <Play size={14} className="ml-1" />
                            </div>
                            <span className="text-slate-300 font-medium">
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-mono text-slate-500">
                              {lesson.duration}
                            </span>
                            <button
                              onClick={() => startDynamicCourse(globalLessonIdx)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors"
                            >
                              Start Lesson
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 pb-12 text-center">
              <button
                onClick={() => startDynamicCourse(0)}
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-lg flex items-center gap-2 mx-auto"
              >
                <Play className="fill-white" size={20} /> Begin Your Journey
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
