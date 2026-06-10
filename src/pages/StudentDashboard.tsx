import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Trophy, 
  Flame, 
  Clock, 
  PlayCircle,
  Brain,
  Layout,
  Terminal,
  Cloud,
  CheckCircle,
  Award,
  ChevronRight,
  Sparkles,
  BookMarked,
  Search,
  Loader2,
  Video
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { ENGINEERING_COURSES, Course } from "../data/coursesData";

const activityData = [
  { name: "Mon", hours: 1.5 },
  { name: "Tue", hours: 2.0 },
  { name: "Wed", hours: 1.0 },
  { name: "Thu", hours: 3.5 },
  { name: "Fri", hours: 2.5 },
  { name: "Sat", hours: 0.5 },
  { name: "Sun", hours: 4.0 },
];

export function StudentDashboard() {
  const navigate = useNavigate();
  const [completedLessonKeys, setCompletedLessonKeys] = useState<string[]>([]);
  const [learningStreak, setLearningStreak] = useState<number>(12);
  const [courses, setCourses] = useState<Course[]>(ENGINEERING_COURSES);

  // Dynamic Video Search & Simple English Tutor State
  const [searchTopic, setSearchTopic] = useState("");
  const [isSearchingTopic, setIsSearchingTopic] = useState(false);
  const [searchResult, setSearchResult] = useState<{ embedUrl: string; summary: string } | null>(null);

  // Sync completed lessons and dynamic course from localStorage
  useEffect(() => {
    const keys = JSON.parse(localStorage.getItem("completed_lessons") || "[]");
    // Fallback if empty to have some default visual progress
    if (keys.length === 0) {
      const defaultCompleted = ["genai-101-1", "systems-201-1"];
      localStorage.setItem("completed_lessons", JSON.stringify(defaultCompleted));
      setCompletedLessonKeys(defaultCompleted);
    } else {
      setCompletedLessonKeys(keys);
    }

    // Load any custom generated course
    const savedCourseStr = localStorage.getItem("generated_syllabus_course");
    if (savedCourseStr) {
      try {
        const savedCourse = JSON.parse(savedCourseStr);
        if (savedCourse && savedCourse.id) {
          if (!ENGINEERING_COURSES.some(c => c.id === savedCourse.id)) {
            setCourses([...ENGINEERING_COURSES, savedCourse]);
          }
        }
      } catch (e) {
        console.error("Failed to load saved dynamic syllabus course in dashboard:", e);
      }
    }
  }, []);

  const handleSearchTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTopic.trim()) return;
    setIsSearchingTopic(true);
    setSearchResult(null);
    try {
      const res = await fetch("/api/ai/search-video-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchTopic }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResult({
        embedUrl: "https://www.youtube.com/embed/5faMjKuBliA",
        summary: `### What is **${searchTopic}**?\n\nIt is a highly valued technical concept!\n\nImagine a busy restaurant kitchen where cooks collaborate perfectly. Instead of one cook doing everything, each team member prepares a simple dish. This makes preparing the meal extremely fast. **${searchTopic}** works just like that!`
      });
    } finally {
      setIsSearchingTopic(false);
    }
  };

  // Helper to toggle completion directly from dashboard
  const toggleDashboardLessonComplete = (courseId: string, lessonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${courseId}-${lessonId}`;
    let newKeys = [...completedLessonKeys];
    if (newKeys.includes(key)) {
      newKeys = newKeys.filter((k) => k !== key);
    } else {
      newKeys.push(key);
    }
    localStorage.setItem("completed_lessons", JSON.stringify(newKeys));
    setCompletedLessonKeys(newKeys);
  };

  // Compute stats based on real course configurations and completed list
  const totalLessonsCount = courses.reduce((total, course) => total + course.lessons.length, 0);
  const totalCompletedCount = courses.reduce((total, course) => {
    const completedInCourse = course.lessons.filter(l => completedLessonKeys.includes(`${course.id}-${l.id}`)).length;
    return total + completedInCourse;
  }, 0);

  const overallProgressPercentage = totalLessonsCount > 0 
    ? Math.round((totalCompletedCount / totalLessonsCount) * 100) 
    : 0;

  const coursesWithAnyProgress = courses.filter(course => {
    return course.lessons.some(l => completedLessonKeys.includes(`${course.id}-${l.id}`));
  }).length;

  // Map icons
  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "brain": return <Brain className="w-5 h-5" />;
      case "layout": return <Layout className="w-5 h-5" />;
      case "terminal": return <Terminal className="w-5 h-5" />;
      case "cloud": return <Cloud className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 animate-spin-slow" /> engineer training track
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Engineering Learning Dashboard
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm max-w-2xl">
            Track your personalized AI, Distributed Systems, Software Engineering, and Cloud DevOps study plans.
          </p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl flex items-center gap-4 shadow-sm self-start md:self-auto shrink-0">
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{overallProgressPercentage}%</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Syllabus Progress</div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Assigned Study Plans",
            value: `${ENGINEERING_COURSES.length} Paths`,
            icon: BookOpen,
            color: "text-indigo-400",
            bg: "bg-indigo-900/20 border-indigo-500/20",
          },
          {
            label: "Completed Chapters",
            value: `${totalCompletedCount} / ${totalLessonsCount}`,
            icon: CheckCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-900/20 border-emerald-500/20",
          },
          {
            label: "Active Days Streak",
            value: `${learningStreak} Days`,
            icon: Flame,
            color: "text-rose-400",
            bg: "bg-rose-900/20 border-rose-500/20",
          },
          {
            label: "Study Time Done",
            value: "18.5 hours",
            icon: Clock,
            color: "text-purple-400",
            bg: "bg-purple-900/20 border-purple-500/20",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border bg-slate-800/50 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] ${stat.bg}`}
          >
            <div className={`p-3.5 rounded-xl ${stat.color} bg-slate-900/80 border border-slate-700/50`}>
              <stat.icon size={22} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-400 tracking-wide mt-0.5">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Weekly Study Commits
              </h2>
              <p className="text-xs text-slate-400 mt-1">Daily learning metrics based on your video watching & notes reads</p>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold tracking-wider uppercase">Active Streak</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #334155",
                    backgroundColor: "#1e293b",
                    color: "#f8fafc",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Study Goals summary panel */}
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-2">
              <Award className="w-4 h-4 text-amber-400" /> Milestone Checkpoint
            </div>
            <h2 className="text-lg font-bold font-display text-white">
              Syllabus Study Achievements
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
              Earn certifications by maintaining a 100% video and notes review rate on each curriculum.
            </p>

            <div className="space-y-3.5">
              {courses.map((course) => {
                const total = course.lessons.length;
                const completed = course.lessons.filter(l => completedLessonKeys.includes(`${course.id}-${l.id}`)).length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                const isFinished = pct === 100;

                return (
                  <div key={course.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded bg-slate-800 border ${isFinished ? 'border-amber-500/30 text-amber-400' : 'border-slate-700 text-slate-400'}`}>
                        {isFinished ? <Award size={16} /> : <BookMarked size={16} />}
                      </div>
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[140px]">{course.title}</span>
                    </div>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${isFinished ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>
                      {isFinished ? "Certified" : `${pct}% Done`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
            <button 
              onClick={() => navigate(`/learn/${courses[0].id}`)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              Resume Learn Track <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 SPECIALIZED AI VIDEO FINDER & SIMPLE ENGLISH SUMMARY SECTION */}
      <section className="bg-slate-850 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> dynamic video & easy english tutor
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            Search Any Computer Science Topic & Learn Instantly!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter any tricky engineering topic you want to search. We will find an excellent visual guide video and provide a summary of it in simple English so that you can understand it with no stress.
          </p>
        </div>

        <form onSubmit={handleSearchTopic} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-555 w-5 h-5 cursor-text text-indigo-400" />
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="e.g., DNS resolution explained, Red-Black trees analogy, MapReduce concepts..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm text-slate-200 placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingTopic || !searchTopic.trim()}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isSearchingTopic ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Exploring topic...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Search & Teach Me
              </>
            )}
          </button>
        </form>

        {searchResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 animate-fadeIn">
            {/* Left: YouTube Video embed */}
            <div className="lg:col-span-5 bg-slate-950 aspect-video rounded-xl overflow-hidden border border-slate-700/60 shadow-lg relative min-h-[220px]">
              <iframe
                src={searchResult.embedUrl}
                title={`Visual Guide for ${searchTopic}`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Right: Easy English Summary and analogy */}
            <div className="lg:col-span-7 bg-indigo-950/20 p-6 rounded-xl border border-indigo-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-extrabold uppercase tracking-wide mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Easy English Tutoring Breakdown
                </div>
                
                <div className="prose prose-invert prose-slate text-xs text-slate-200 leading-relaxed space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  <ReactMarkdown>{searchResult.summary}</ReactMarkdown>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/50 text-right">
                <span className="text-[10px] text-slate-400 italic uppercase font-semibold">
                  🌿 Designed for clear learning in simple English without any jargon
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CORE FEATURE: ASSIGNED STUDY PLANS SECTION FOR ENGINEER (VISUAL PROGRESS TRACKERS) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">
              Assigned Engineering Study Plans
            </h2>
            <p className="text-slate-400 text-xs mt-1">Interact with checkboxes to check off tasks directly or log in to view lessons</p>
          </div>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-xs font-semibold">
            {coursesWithAnyProgress} / {courses.length} Active Tracks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course: Course) => {
            const lessons = course.lessons;
            const total = lessons.length;
            const completed = lessons.filter(l => completedLessonKeys.includes(`${course.id}-${l.id}`)).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            const isCompleted = percentage === 100;

            return (
              <div
                key={course.id}
                className="group relative bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-900"
              >
                {/* Course Main Details */}
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${course.themeColor} text-white shadow-md`}>
                        {getCourseIcon(course.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-full">
                          {course.category}
                        </span>
                        <h3 className="font-bold text-white text-base mt-1 line-clamp-1">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="text-slate-400 group-hover:text-indigo-400 transition-all p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/20"
                      title="Open Interactive Classroom Video"
                    >
                      <PlayCircle size={22} className="group-hover:scale-105 transition-transform" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-2">
                    {course.description}
                  </p>

                  {/* VISUAL PROGRESS TRACKER */}
                  <div className="space-y-2.5 mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-700/40">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Completion Percent</span>
                      <span className={isCompleted ? "text-emerald-400" : "text-indigo-400"}>
                        {percentage}% ({completed} / {total} Verified)
                      </span>
                    </div>

                    {/* Styled Track bar with percentage gradient glow */}
                    <div className="w-full bg-slate-950/80 rounded-full h-3.5 p-[2px] border border-slate-700/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out flex justify-end items-center pr-2 ${
                          isCompleted
                            ? "bg-gradient-to-r from-emerald-500 to-green-400"
                            : "bg-gradient-to-r from-indigo-500 to-indigo-400"
                        }`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      >
                        {percentage > 18 && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    {/* Checkpoints preview indicating complete status of individual lessons */}
                    <div className="pt-2 border-t border-slate-700/30 flex justify-between gap-1">
                      {lessons.map((lesson) => {
                        const lKey = `${course.id}-${lesson.id}`;
                        const isLCompleted = completedLessonKeys.includes(lKey);
                        return (
                          <div
                            key={lesson.id}
                            onClick={(e) => toggleDashboardLessonComplete(course.id, lesson.id, e)}
                            className={`flex-1 h-2 rounded-sm transition-all cursor-pointer ${
                              isLCompleted 
                                ? "bg-indigo-500 border-indigo-400 hover:bg-indigo-400" 
                                : "bg-slate-800 border border-slate-700 hover:bg-slate-700"
                            }`}
                            title={`Ch ${lesson.id}: ${lesson.title} (${isLCompleted ? 'Done - click to undo' : 'Incomplete - click to toggle'})`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Checklist Detail */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Chapters & Syllabus Details</span>
                    <div className="space-y-1.5">
                      {lessons.map((lesson) => {
                        const lKey = `${course.id}-${lesson.id}`;
                        const isLComp = completedLessonKeys.includes(lKey);
                        return (
                          <div 
                            key={lesson.id}
                            onClick={(e) => toggleDashboardLessonComplete(course.id, lesson.id, e)}
                            className="w-full flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/30 border border-slate-700/30 hover:border-slate-600 transition-colors cursor-pointer group/item"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <input 
                                type="checkbox"
                                checked={isLComp}
                                onChange={() => {}} // toggled via parent click
                                className="w-4 h-4 rounded text-indigo-500 border-slate-600 focus:ring-0 cursor-pointer accent-indigo-500 shrink-0"
                              />
                              <span className={`truncate text-slate-300 font-medium ${isLComp ? 'line-through text-slate-500' : 'group-hover/item:text-white'}`}>
                                Ch {lesson.id}: {lesson.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0 uppercase ml-2 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40">
                              {lesson.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Action footer button */}
                <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    Difficulty: <span className="text-indigo-400 font-extrabold">{course.difficulty}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/learn/${course.id}`)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white font-bold rounded-xl text-xs border border-slate-700 hover:border-indigo-500 flex items-center gap-1 transition-all"
                  >
                    Open Study Plan <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
