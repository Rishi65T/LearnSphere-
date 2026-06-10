import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video,
  AlignLeft,
  Sparkles,
  Clock,
  MessageSquare,
  Play,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Download,
  Languages,
  BookOpenCheck,
  FileText,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ListRestart,
  Loader2
} from "lucide-react";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import { ENGINEERING_COURSES, Course, Lesson } from "../data/coursesData";

export function InteractiveLearning() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  // Map route course parameter or fallback to first course
  const courseLookup: Record<string, string> = {
    "course-101": "genai-101",
    "course-102": "systems-201",
    "course-103": "dsa-301",
    "course-104": "devops-401",
  };
  const activeCourseId = courseLookup[courseId || ""] || courseId || "genai-101";

  // Try loading dynamic syllabus course from localStorage if current courseId is sys-gen-1
  const activeCourse = useMemo<Course>(() => {
    let course = ENGINEERING_COURSES.find(c => c.id === activeCourseId) || ENGINEERING_COURSES[0];
    if (activeCourseId === "sys-gen-1") {
      const savedCourseStr = localStorage.getItem("generated_syllabus_course");
      if (savedCourseStr) {
        try {
          course = JSON.parse(savedCourseStr);
        } catch (e) {
          console.error("Failed to parse saved dynamic course:", e);
        }
      }
    }
    return course;
  }, [activeCourseId]);

  const [activeLesson, setActiveLesson] = useState<Lesson>(activeCourse.lessons[0]);
  const [videoLang, setVideoLang] = useState<string>("English");
  
  // Learning tabs
  const [activeTab, setActiveTab] = useState<"transcript" | "keymoments" | "chat" | "summary">("transcript");
  
  // Center pane primary mode (Toggle between Video Lecture and Chapter PDF Notes)
  const [centerMode, setCenterMode] = useState<"video" | "notes">("video");

  const [aiData, setAiData] = useState<any>({});
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);

  // Local storage completion persistence
  const [completedLessonKeys, setCompletedLessonKeys] = useState<string[]>([]);
  const [videoStartSeconds, setVideoStartSeconds] = useState<number>(0);

  // PDF Viewer simulated properties
  const [pdfZoom, setPdfZoom] = useState<number>(100);

  // Dynamic content fetching states for the generated syllabus course
  const [activeLessonDetails, setActiveLessonDetails] = useState<{
    chapterNotes: string;
    keyPoints: string[];
    embeds: any;
    transcripts: any;
  } | null>(null);
  const [isLessonContentLoading, setIsLessonContentLoading] = useState<boolean>(false);

  // Dynamic content generation & caching for dynamic syllabus course
  useEffect(() => {
    if (activeCourse.id !== "sys-gen-1") {
      setActiveLessonDetails(null);
      return;
    }

    const cacheKey = `${activeCourse.title}-${activeLesson.title}`;
    const cache = JSON.parse(localStorage.getItem("generated_lessons_details_cache") || "{}");

    if (cache[cacheKey]) {
      setActiveLessonDetails(cache[cacheKey]);
    } else {
      const fetchDynamicContent = async () => {
        setIsLessonContentLoading(true);
        try {
          const res = await fetch("/api/ai/generate-lesson-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseTitle: activeCourse.title,
              lessonTitle: activeLesson.title,
              difficulty: activeCourse.difficulty
            })
          });
          const data = await res.json();
          if (data && !data.error) {
            const newCache = { ...cache, [cacheKey]: data };
            localStorage.setItem("generated_lessons_details_cache", JSON.stringify(newCache));
            setActiveLessonDetails(data);
          } else {
            throw new Error("Invalid response");
          }
        } catch (e) {
          console.error("Error loading chapter notes and video links:", e);
          const fallback = {
            chapterNotes: `## ${activeLesson.title}\n\nThis core lesson focuses entirely on **${activeLesson.title}** as part of the specialized study of **${activeCourse.title}**.\n\n### Foundations of ${activeLesson.title}\nIn this section, we study how the key architectural and software designs of **${activeLesson.title}** should be implemented inside production systems. Master the primary methodologies and ensure optimized real-time validation of your state loops.\n\n### Key Trade-offs:\n- System overhead and efficiency analysis for ${activeLesson.title}.\n- Best-practice engineering models integrated directly into ${activeCourse.title}.\n- Scalability metrics and robust distributed pipelines.`,
            keyPoints: [
              `Core principles of ${activeLesson.title}`,
              `Analyzing tradeoffs and designs inside ${activeCourse.title}`,
              `Step-by-step practical implementation guide`
            ],
            embeds: {
              English: "https://www.youtube.com/embed/5faMjKuBliA",
              Tamil: "https://www.youtube.com/embed/p10yW0mMyw8",
              Hindi: "https://www.youtube.com/embed/f3A88XlGisI",
              Telugu: "https://www.youtube.com/embed/MAlS9O5Kqrc",
              Spanish: "https://www.youtube.com/embed/5faMjKuBliA"
            },
            transcripts: {
              English: [
                { time: "0:00", text: `Welcome to this specialized session of our syllabus path. Today we are looking at ${activeLesson.title}.` },
                { time: "1:45", text: `As we dive deeper into this subject context, notice how these design choices shape our understanding of ${activeCourse.title}.` },
                { time: "3:30", text: `Make sure to review the code sample patterns and step-by-step notes mapped inside this chapter.` }
              ]
            }
          };
          setActiveLessonDetails(fallback);
        } finally {
          setIsLessonContentLoading(false);
        }
      };

      fetchDynamicContent();
    }
  }, [activeLesson, activeCourse]);

  // Compute resolved properties
  const activeChapterNotes = activeCourse.id === "sys-gen-1" ? (activeLessonDetails?.chapterNotes || "Loading textbook notes...") : activeLesson.chapterNotes;
  const activeKeyPoints = activeCourse.id === "sys-gen-1" ? (activeLessonDetails?.keyPoints || []) : activeLesson.keyPoints;
  
  // Guarantee activeEmbeds is NEVER null/undefined so that a video is ALWAYS available for every single topic!
  const rawEmbeds = activeCourse.id === "sys-gen-1" ? (activeLessonDetails?.embeds || activeLesson.embeds) : activeLesson.embeds;
  const activeEmbeds = rawEmbeds && rawEmbeds.English 
    ? rawEmbeds 
    : { English: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(activeLesson.title + " explained computer science tutorial")}` };

  const activeTranscripts = activeCourse.id === "sys-gen-1" ? (activeLessonDetails?.transcripts || activeLesson.transcripts) : activeLesson.transcripts;

  // Reset states on active lesson switch
  useEffect(() => {
    setVideoStartSeconds(0);
    setAiData({});
    // Reset chat messages with context
    setChatMessages([
      {
        role: "model",
        content: `Hi! I am your AI Study Coach for **${activeCourse.title}**. Ask me any technical questions about the lecture, custom prompts, or code in **Chapter ${activeLesson.id} Notes**!`,
      },
    ]);
    
    // Automatically default study mode to active video lecture for all topics
    setCenterMode("video");
  }, [activeLesson, activeCourse]);

  // Load completion states
  useEffect(() => {
    const keys = JSON.parse(localStorage.getItem("completed_lessons") || "[]");
    setCompletedLessonKeys(keys);
  }, []);

  // Sync state and select first lesson if course changes (supporting target sublesson direct route)
  useEffect(() => {
    if (activeCourse.lessons.length > 0) {
      const savedLessonIdStr = localStorage.getItem("selected_lesson_id");
      if (savedLessonIdStr && activeCourse.id === "sys-gen-1") {
        const savedLd = parseInt(savedLessonIdStr, 10);
        const savedLesson = activeCourse.lessons.find(l => l.id === savedLd);
        if (savedLesson) {
          setActiveLesson(savedLesson);
          localStorage.removeItem("selected_lesson_id");
          return;
        }
      }
      setActiveLesson(activeCourse.lessons[0]);
    }
  }, [activeCourse]);

  // Handle marking complete
  const handleMarkCompleteToggle = () => {
    const key = `${activeCourse.id}-${activeLesson.id}`;
    let newKeys = [...completedLessonKeys];
    if (newKeys.includes(key)) {
      newKeys = newKeys.filter(k => k !== key);
    } else {
      newKeys.push(key);
    }
    localStorage.setItem("completed_lessons", JSON.stringify(newKeys));
    setCompletedLessonKeys(newKeys);
  };

  const isCurrentLessonCompleted = completedLessonKeys.includes(`${activeCourse.id}-${activeLesson.id}`);

  // Fetch AI content dynamically based on topic, translating simulated models to active text
  const fetchAiSummary = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/video-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "summary", 
          lessonTitle: `${activeCourse.title} - ${activeLesson.title}` 
        }),
      });
      const data = await res.json();
      setAiData((prev: any) => ({ ...prev, aiSummaryDetails: data.response }));
    } catch (e) {
      console.error(e);
      setAiData((prev: any) => ({ ...prev, aiSummaryDetails: "Failed to generate AI synthesis. Check key points tab instead." }));
    }
    setIsAiLoading(false);
  };

  // Chat conversation
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", content: chatInput };
    const currentMsgs = [...chatMessages, userMsg];
    setChatMessages(currentMsgs);
    setChatInput("");

    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/video-interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "chat", 
          lessonTitle: `${activeCourse.title}: ${activeLesson.title}`,
          query: chatInput 
        }),
      });
      const data = await res.json();
      setChatMessages([...currentMsgs, { role: "model", content: data.response || "I am analyzing this topic chapter structure. Let me review that context for you!" }]);
    } catch (err) {
      setChatMessages([...currentMsgs, { role: "model", content: "I encountered a routing error. However, based on the chapter notes, this deals with the core computational models." }]);
    }
    setIsAiLoading(false);
  };

  // Convert "M:SS" to seconds for video player manipulation
  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.trim().split(":");
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return minutes * 60 + seconds;
    }
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10) || 0;
      const minutes = parseInt(parts[1], 10) || 0;
      const seconds = parseInt(parts[2], 10) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  // Trigger timeline jump
  const handleJumpToTimestamp = (timeStr: string) => {
    const seconds = parseTimeToSeconds(timeStr);
    setVideoStartSeconds(seconds);
    setCenterMode("video");
  };

  // Export Study Package file download (.txt)
  const handleExportFullStudyPack = () => {
    let text = `========================================================================\n`;
    text    += `               OFFLINE LESSON ACADEMIC STUDY PACK               \n`;
    text    += `        Course: ${activeCourse.title} - ${activeCourse.category}\n`;
    text    += `========================================================================\n\n`;
    text    += `Active Lesson: Ch ${activeLesson.id} - ${activeLesson.title}\n`;
    text    += `Assigned Track Estimated Time: ${activeLesson.time}\n`;
    text    += `Format Type: ${activeLesson.type}\n\n`;

    text    += `------------------------------------------------------------------------\n`;
    text    += `1. OFFICIAL KEY HIGHLIGHT POINTS\n`;
    text    += `------------------------------------------------------------------------\n`;
    activeKeyPoints.forEach((point: string, idx: number) => {
      text += `${idx + 1}. [INDEX HIGHLIGHT] - ${point}\n`;
    });
    text    += `\n\n`;

    text    += `------------------------------------------------------------------------\n`;
    text    += `2. DETAILED REFERENCE NOTES / CHAPTER TEXTBOOK\n`;
    text    += `------------------------------------------------------------------------\n`;
    text    += activeChapterNotes.replace(/#{1,6}\s/g, ""); // strip header markdown characters for text output
    text    += `\n\n`;

    text    += `------------------------------------------------------------------------\n`;
    text    += `3. MULTILINGUAL ACCESS INFO\n`;
    text    += `------------------------------------------------------------------------\n`;
    if (activeEmbeds) {
      text += `This chapter supports multi-language audio streaming in:\n`;
      Object.entries(activeEmbeds).forEach(([lang, url]) => {
        text += `- ${lang}: ${url}\n`;
      });
    } else {
      text += `This chapter is a reading syllabus guide text.\n`;
    }
    text    += `\n\n`;

    text    += `------------------------------------------------------------------------\n`;
    text    += `4. CO-WATCHER CLASSROOM NOTES CHAT LOGS\n`;
    text    += `------------------------------------------------------------------------\n`;
    if (chatMessages.length <= 1) {
      text += `No custom questions asked with AI Coach during this session.\n`;
    } else {
      chatMessages.forEach((msg) => {
        text += `${msg.role === 'user' ? 'Student' : 'AI Coach'}: ${msg.content}\n\n`;
      });
    }

    text    += `========================================================================\n`;
    text    += `Generated via LearnSphere AI - Indian Engineering Track Portal\n`;
    text    += `========================================================================\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeCourse.id}_ch${activeLesson.id}_export_pack.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate dynamic stats for this specific Course Plan
  const courseLessons = activeCourse.lessons;
  const courseTotalCount = courseLessons.length;
  const courseCompletedCount = courseLessons.filter(l => completedLessonKeys.includes(`${activeCourse.id}-${l.id}`)).length;
  const courseProgressPercentage = courseTotalCount > 0 
    ? Math.round((courseCompletedCount / courseTotalCount) * 100) 
    : 0;

  // Render correct English video embed
  const videoSrc = activeEmbeds
    ? `${activeEmbeds.English}${activeEmbeds.English.includes("?") ? "&" : "?"}autoplay=1&hl=en${videoStartSeconds > 0 ? `&start=${videoStartSeconds}` : ""}`
    : "";

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)] lg:h-[calc(100vh-4rem)] max-h-[900px] overflow-hidden">
      
      {/* LEFT COLUMN: Course Navigation */}
      <div className="hidden lg:flex w-80 flex-col bg-slate-800 rounded-2xl border border-slate-700 shadow-xl shrink-0">
        <div className="p-6 border-b border-slate-700 relative z-10">
          <button
            onClick={() => navigate("/student")}
            className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          
          <div className="flex items-start gap-2.5">
            <div className={`p-2 bg-gradient-to-br ${activeCourse.themeColor} rounded-lg text-white shrink-0 shadow-md`}>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-white leading-snug text-sm tracking-tight line-clamp-1" title={activeCourse.title}>
                {activeCourse.title}
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">{activeCourse.instructor} • {activeCourse.category}</p>
            </div>
          </div>

          <div className="mt-5 bg-slate-900/40 p-3 rounded-xl border border-slate-700/60">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-bold">
              <span>Track Completed</span> 
              <span className="text-indigo-400">{courseCompletedCount} / {courseTotalCount} Chapters</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${courseProgressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-black text-white">{courseProgressPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Chapters listing list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1 px-1">Curriculum Roadmap</div>
          {courseLessons.map((lesson) => {
            const isSelected = activeLesson.id === lesson.id;
            const isLessonComp = completedLessonKeys.includes(`${activeCourse.id}-${lesson.id}`);
            
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group/btn",
                  isSelected
                    ? "bg-indigo-900/20 border-indigo-500/50"
                    : "bg-slate-900/30 border-transparent hover:border-slate-700 hover:bg-slate-800/80",
                )}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {isLessonComp ? (
                      <CheckCircle className="text-emerald-500 shrink-0" size={15} />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 shrink-0 group-hover/btn:border-indigo-400" />
                    )}
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-wider",
                      isSelected ? "text-indigo-400" : "text-slate-500"
                    )}>
                      Chapter {lesson.id}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                    {lesson.type}
                  </span>
                </div>
                
                <h3 className={cn(
                  "font-bold text-xs line-clamp-1 leading-tight",
                  isSelected ? "text-white" : "text-slate-300 group-hover/btn:text-white"
                )}>
                  {lesson.title}
                </h3>
                
                <div className="flex items-center gap-1 mt-2 text-slate-600 text-[10px] font-medium">
                  <Clock size={11} /> {lesson.time}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MIDDLE COLUMN: Video & Chapter Notes Section */}
      <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-700/40">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 mb-1 tracking-wider uppercase">
              <span className="text-indigo-400">Chapter {activeLesson.id} syllabus</span>
              <span>•</span>
              <span>{activeLesson.type}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {activeLesson.time}</span>
            </div>
            <h1 className="text-2xl font-black font-display text-white tracking-tight">
              {activeLesson.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportFullStudyPack}
              className="px-3.5 py-2 bg-slate-850 hover:bg-slate-750 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm"
              title="Download offline syllabus & classroom questions guide"
            >
              <Download size={15} /> Export Study Pack
            </button>
            
            <button 
              onClick={handleMarkCompleteToggle}
              className={cn(
                "px-4 py-2 font-bold rounded-xl flex items-center gap-1.5 text-xs transition-colors shadow-md",
                isCurrentLessonCompleted
                  ? "bg-slate-750 text-emerald-400 border border-emerald-500/30"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              )}
            >
              <CheckCircle size={15} /> 
              {isCurrentLessonCompleted ? "Completed" : "Mark Complete"}
            </button>
          </div>
        </div>

        {/* STUDY MODE TOGGLE CARDS (🎥 Video Lecture vs 📖 Academic Chapter PDF Notes) */}
        <div className="flex gap-2">
          {activeEmbeds && (
            <button
              onClick={() => setCenterMode("video")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all",
                centerMode === "video"
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              )}
            >
              <Video size={14} /> Interactive Video
            </button>
          )}
          <button
            onClick={() => setCenterMode("notes")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all",
              centerMode === "notes"
                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            )}
          >
            <FileText size={14} /> Chapter Notes (PDF View)
          </button>
        </div>

        {/* PRIMARY DISPLAY VIEWPORT */}
        <div className="w-full aspect-video bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl relative">
          
          {centerMode === "video" ? (
            isLessonContentLoading ? (
              <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
                <p className="font-bold text-xs uppercase tracking-wider text-slate-500">Retrieving interactive video lecture...</p>
              </div>
            ) : (
              <iframe
                key={`${activeLesson.id}-${videoStartSeconds}`}
                src={videoSrc}
                title={`${activeLesson.title} Lecture Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            /* HIGH QUALITY BOOK CHAPTER PDF SIMULATOR */
            <div className="absolute inset-0 bg-slate-900 flex flex-col">
              {/* PDF Header controls toolbar */}
              <div className="bg-slate-850 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black rounded uppercase">PDF</div>
                  <span className="text-xs font-bold text-slate-300 truncate max-w-sm">
                    {activeCourse.id}_ch_0{activeLesson.id}_syllabus_notes.pdf
                  </span>
                </div>
                
                {/* Simulated PDF tools */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                    <button onClick={() => setPdfZoom(prev => Math.max(prev - 10, 60))} className="text-slate-400 hover:text-white p-0.5"><ZoomOut size={13} /></button>
                    <span className="text-[10px] text-slate-400 font-mono w-9 text-center">{pdfZoom}%</span>
                    <button onClick={() => setPdfZoom(prev => Math.min(prev + 10, 150))} className="text-slate-400 hover:text-white p-0.5"><ZoomIn size={13} /></button>
                  </div>
                  <button onClick={handleExportFullStudyPack} className="text-slate-400 hover:text-white p-1" title="Download Offline Chapter Guide"><Download size={14} /></button>
                  <button onClick={() => window.print()} className="text-slate-400 hover:text-white p-1" title="Print Notes"><Printer size={14} /></button>
                </div>
              </div>

              {/* PDF Creamy Canvas Paper */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fbfaef] text-[#1a1a1a] custom-scrollbar selection:bg-amber-100">
                <div 
                  className="mx-auto transition-all duration-300 shadow-sm leading-relaxed"
                  style={{ width: `${pdfZoom}%`, maxWidth: "100%" }}
                >
                  {/* Watermark/Academic stamp */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-serif border-b border-slate-300/60 pb-2 mb-6 font-semibold">
                    <span>LEARNSPHERE ACADEMIC TRAINING TRACK</span>
                    <span>INDIA CAMPUS ROADMAP</span>
                  </div>

                  {/* Markdown Notes */}
                  {isLessonContentLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                      <Loader2 className="animate-spin text-indigo-500" size={32} />
                      <p className="font-bold text-xs uppercase tracking-wider text-slate-400">Loading dynamic chapter syllabus notes...</p>
                    </div>
                  ) : (
                    <div className="prose prose-sm font-sans prose-slate text-[13px] text-slate-800">
                      <ReactMarkdown>{activeChapterNotes}</ReactMarkdown>
                    </div>
                  )}

                  <div className="mt-8 pt-4 border-t border-slate-300/60 text-center text-[9px] text-slate-500 font-serif">
                    © Academic Syllabus &copy; LearnSphere 2026. All rights reserved. Do not distribute outside engineer campus.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STEP CONTROLS */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-700/30">
          <button 
            disabled={activeLesson.id === 1}
            onClick={() => {
              const prev = courseLessons.find(l => l.id === activeLesson.id - 1);
              if (prev) setActiveLesson(prev);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Previous Chapter
          </button>
          
          <button
            disabled={activeLesson.id === courseLessons.length}
            onClick={() => {
              const next = courseLessons.find(l => l.id === activeLesson.id + 1);
              if (next) setActiveLesson(next);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            Next Chapter <Play size={14} className="fill-white" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Sidebar (Transcript, Key moments, Ask AI, and Summary) */}
      <div className="w-full lg:w-[360px] flex flex-col bg-slate-805 rounded-2xl border border-slate-700 overflow-hidden shadow-xl shrink-0">
        <div className="flex border-b border-slate-700 bg-slate-900/50 relative">
          <button
            onClick={() => setActiveTab("transcript")}
            className={cn(
              "group flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all duration-300",
              activeTab === "transcript"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50",
            )}
          >
            <AlignLeft size={15} className={cn("transition-transform duration-300", activeTab === "transcript" ? "scale-110" : "group-hover:scale-110")} /> Transcript
          </button>
          <button
            onClick={() => setActiveTab("keymoments")}
            className={cn(
              "group flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all duration-300",
              activeTab === "keymoments"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50",
            )}
          >
            <Clock size={15} className={cn("transition-transform duration-300", activeTab === "keymoments" ? "scale-110" : "group-hover:scale-110")} /> Key Moments
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "group flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all duration-300",
              activeTab === "chat"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50",
            )}
          >
            <MessageSquare size={15} className={cn("transition-transform duration-300", activeTab === "chat" ? "scale-110" : "group-hover:scale-110")} /> AI Tutor
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={cn(
              "group flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all duration-300",
              activeTab === "summary"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50",
            )}
          >
            <Sparkles size={15} className={cn("transition-transform duration-300", activeTab === "summary" ? "scale-110" : "group-hover:scale-110")} /> Summary
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden bg-slate-800/80">
            
            {/* TRANSCRIPTION VIEW */}
            <div
              className={cn(
                "absolute inset-0 overflow-y-auto p-5 custom-scrollbar transition-all duration-300 ease-in-out space-y-4 text-[12.5px]",
                activeTab === "transcript" ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none z-0 translate-y-4"
              )}
            >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Audio Transcription</span>
                  <span className="text-[10px] bg-slate-900/60 border border-slate-700 px-2 py-0.5 rounded text-indigo-400 font-bold uppercase">
                    English Only
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Render English only transcripts as requested by user */}
                  {activeTranscripts && activeTranscripts.English ? (
                    (activeTranscripts.English as any[]).map((tr, index) => (
                      <div 
                        key={index}
                        onClick={() => handleJumpToTimestamp(tr.time)}
                        className="p-3 rounded-xl bg-slate-900/30 border border-slate-700/30 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all cursor-pointer group"
                      >
                        <span className="text-[9px] font-black tracking-widest text-indigo-400 block mb-1 group-hover:text-indigo-300">
                          CO-INSTRUCTOR • {tr.time}
                        </span>
                        <p className="text-slate-300 italic">"{tr.text}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                      <div className="p-3 rounded-xl bg-indigo-950/25 border border-indigo-500/20">
                        <span className="text-[9px] font-black tracking-widest text-indigo-400 block mb-1">INSTRUCTOR • 0:00</span>
                        Welcome to this comprehensive micro-module of {activeCourse.title}. This track guides engineers on target execution.
                      </div>
                      <div className="text-slate-400">
                        <span className="text-[9px] font-black tracking-widest text-slate-500 block mb-1">INSTRUCTOR • 3:20</span>
                        Open the **Chapter Notes** tab to view formatted diagrams, parameters, and algorithms alongside the reference materials.
                      </div>
                    </div>
                  )}
                </div>
              </div>

            {/* KEY TIMESTAMPS / KEY MOMENTS TAB */}
            <div
              className={cn(
                "absolute inset-0 overflow-y-auto p-5 custom-scrollbar transition-all duration-300 ease-in-out space-y-4",
                activeTab === "keymoments" ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none z-0 translate-y-4"
              )}
            >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Key Sub-Topics</span>
                  <span className="text-[10px] text-slate-400">Click to jump in video</span>
                </div>

                <div className="space-y-2.5">
                  {(activeTranscripts && activeTranscripts.English ? 
                    (activeTranscripts.English as any[]).map((t) => ({ time: t.time, label: t.text.substring(0, 30) + "..." })) : 
                    [
                      { time: "0:00", label: `Definition of ${activeLesson.title}` },
                      { time: "1:30", label: "Fundamental Theoretical Architecture" },
                      { time: "4:50", label: "Production Case Studies and Metrics" }
                    ]
                  ).map((m: any, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleJumpToTimestamp(m.time)}
                      className="w-full text-left p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-750 border border-slate-750/30 hover:border-indigo-500/30 transition-all flex items-center gap-3.5 group cursor-pointer"
                    >
                      <span className="text-slate-300 font-mono text-xs bg-slate-900 border border-slate-700 px-2 py-0.5 rounded group-hover:text-indigo-400 transition-colors">
                        {m.time}
                      </span>
                      <span className="text-slate-300 text-xs group-hover:text-white transition-colors truncate">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            {/* AI COACH TUTOR CHAT */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col transition-all duration-300 ease-in-out",
                activeTab === "chat" ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none z-0 translate-y-4"
              )}
            >
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar pb-24">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-3 max-w-[90%]",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                      )}
                    >
                      <div
                        className={cn(
                          "p-3 rounded-2xl text-[12px] shadow-sm leading-normal",
                          msg.role === "user"
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-slate-900/50 border border-slate-700/60 text-slate-200 rounded-tl-none",
                        )}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="animate-pulse flex space-x-2 p-3 bg-slate-905/30 rounded-xl max-w-[70%]">
                      <div className="h-2.5 bg-slate-700 rounded-full w-full"></div>
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 border-t border-slate-700/80 bg-slate-800/95 backdrop-blur-md">
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask AI tutor about notes..."
                      className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-xs text-slate-200 placeholder:text-slate-500"
                    />
                  </form>
                </div>
              </div>

            {/* CORE SUMMARY REQUIREMENT (Key points of notes must be produced) */}
            <div
              className={cn(
                "absolute inset-0 overflow-y-auto p-5 custom-scrollbar transition-all duration-300 ease-in-out space-y-4",
                activeTab === "summary" ? "opacity-100 z-10 translate-y-0" : "opacity-0 pointer-events-none z-0 translate-y-4"
              )}
            >
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-200">Chapter notes key points</span>
                </div>

                {/* Real curated key points extracted directly from notes */}
                <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900/40 p-4 rounded-xl border border-indigo-500/15 space-y-3.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Extracted from Chapter Text PDF:
                  </div>
                  <ul className="space-y-2.5">
                    {activeKeyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12px] text-slate-300 leading-normal">
                        <span className="text-indigo-400 font-black mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Extended helper */}
                <div className="pt-3 border-t border-slate-700/40">
                  {aiData.aiSummaryDetails ? (
                    <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl space-y-2">
                      <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight flex items-center gap-1">
                        <Sparkles size={11} /> AI Generated Extended Summary
                      </div>
                      <p className="text-[12px] text-slate-300 leading-relaxed italic">
                        {aiData.aiSummaryDetails}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={fetchAiSummary}
                      disabled={isAiLoading}
                      className="w-full py-2.5 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 text-indigo-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      {isAiLoading ? "AI is processing..." : "Generate Extended AI Summary"}
                    </button>
                  )}
                </div>
              </div>

        </div>
      </div>

    </div>
  );
}
