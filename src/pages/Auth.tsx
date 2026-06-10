import { useState } from "react";
import { motion } from "motion/react";
import { BrainCircuit, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor" | "admin">(
    "student",
  );
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, role);
    navigate(`/${role}`);
  };


  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 text-slate-200 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mx-auto mb-4 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <BrainCircuit size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            LearnSphere<span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {isLogin
              ? "Sign in to continue your journey."
              : "Create an account to start learning."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder:text-slate-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder:text-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["student", "instructor", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "py-2 rounded-lg text-xs font-semibold capitalize border transition-all",
                      role === r
                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                        : "bg-slate-900/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 mt-4"
          >
            {isLogin ? "Sign In" : "Create Account"}
            <ArrowRight size={18} />
          </button>
        </form>



        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="text-sm border-none bg-transparent text-slate-400 hover:text-indigo-400 font-medium transition-colors cursor-pointer"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
