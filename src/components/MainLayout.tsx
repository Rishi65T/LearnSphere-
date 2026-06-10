import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  Shield,
  BrainCircuit,
  MessageSquare,
  Target,
  Menu,
  X,
  LogOut,
  Video,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { UserAvatar } from "./UserAvatar";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const navItems = [
    ...(user?.role === "student"
      ? [{ name: "Dashboard", path: "/student", icon: BookOpen }]
      : []),
    ...(user?.role === "instructor"
      ? [{ name: "Dashboard", path: "/instructor", icon: BookOpen }]
      : []),
    ...(user?.role === "admin"
      ? [{ name: "Admin Panel", path: "/admin", icon: Shield }]
      : []),
    { name: "My Profile", path: "/profile", icon: User },
    { name: "AI Path Planner", path: "/recommendations", icon: BrainCircuit },
    { name: "Learning Space", path: "/learn/course-101", icon: Video },
    { name: "Smart Quiz", path: "/quiz", icon: Target },
    { name: "AI Tutor", path: "/chatbot", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-[#0F172A] text-slate-200 font-sans">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-800 rounded-lg shadow-sm border border-slate-700 text-slate-200"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-[#1E293B] border-r border-slate-700 shadow-sm flex flex-col p-6 gap-6",
              "lg:translate-x-0 lg:static lg:flex",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BrainCircuit size={24} className="text-white" />
              </div>
              <h1 className="font-display font-bold text-xl tracking-tight text-white">
                LearnSphere<span className="text-indigo-400">AI</span>
              </h1>
            </div>

            <nav className="flex-1 overflow-y-auto w-full custom-scrollbar pr-2 pb-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 font-bold w-full group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-indigo-600/20 via-indigo-500/10 to-transparent text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] border border-indigo-500/20 translate-x-1"
                        : "text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-transparent hover:shadow-lg hover:-translate-y-0.5 hover:shadow-indigo-500/5 border border-transparent hover:border-slate-700/50",
                    )}
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 transition-opacity duration-300 opacity-0 group-hover:opacity-100",
                      isActive && "hidden"
                    )} />
                    <Icon size={18} className={cn("transition-transform duration-300 relative z-10", isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-indigo-300")} />
                    <span className="relative z-10 transition-colors duration-300">{item.name}</span>
                  </NavLink>
                );
              })}

              <div className="pt-6 pb-2">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/50 hover:from-slate-800 hover:to-slate-900 transition-all duration-300 rounded-2xl p-4 mb-4 border border-slate-700/50 hidden lg:block shadow-sm group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                    AI Mentor Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">
                  Based on your last activity, I am here to help you advance your skills.
                </p>
                <button
                  onClick={() => navigate("/chatbot")}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> Ask Mentor
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center p-3 rounded-xl bg-slate-800/30 hover:bg-indigo-500/10 border border-slate-700/40 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-400 transition-all duration-300 w-full shadow-sm group"
                  title="Toggle Theme"
                >
                  {theme === "dark" ? (
                    <Sun size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-500" />
                  ) : (
                    <Moon size={18} className="mr-2 group-hover:-rotate-12 transition-transform duration-500" />
                  )}
                  <span className="text-sm font-bold tracking-tight">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>

                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/40 border border-transparent hover:border-slate-700/40 transition-all duration-300 group">
                  <button 
                    onClick={() => {
                      navigate("/profile");
                      setSidebarOpen(false);
                    }} 
                    className="flex items-center gap-3 text-left flex-1 transition-transform duration-300"
                  >
                    <UserAvatar
                      name={user?.name}
                      avatarUrl={user?.avatarUrl}
                      className="w-10 h-10 shadow-inner ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all"
                      textClassName="text-lg"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate max-w-[100px]">
                        {user?.name || "User"}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-0.5">
                        {user?.role || "Guest"}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 flex items-center justify-center"
                    title="Logout"
                  >
                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:pl-0 w-full overflow-x-hidden min-h-screen">
        <div className="h-full flex flex-col pt-20 pb-12 px-4 md:px-8 lg:pt-8 lg:pb-12 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#1E293B]/95 hover:bg-[#334155] border border-slate-700/80 hover:border-slate-600 text-indigo-400 hover:text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}
