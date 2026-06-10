import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, BookOpen, Star, DollarSign } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", students: 400 },
  { name: "Feb", students: 600 },
  { name: "Mar", students: 800 },
  { name: "Apr", students: 750 },
  { name: "May", students: 1100 },
  { name: "Jun", students: 1240 },
];

export function InstructorDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/instructor")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return <div className="animate-pulse">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">
          Instructor Portal
        </h1>
        <p className="text-slate-400 mt-2">
          Manage your courses and view student engagement.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: stats.totalStudents,
            icon: Users,
            color: "text-indigo-400",
            bg: "bg-indigo-900/30",
          },
          {
            label: "Active Courses",
            value: stats.activeCourses,
            icon: BookOpen,
            color: "text-emerald-400",
            bg: "bg-emerald-900/30",
          },
          {
            label: "Avg Rating",
            value: stats.averageRating,
            icon: Star,
            color: "text-amber-400",
            bg: "bg-amber-900/30",
          },
          {
            label: "Total Revenue",
            value: stats.totalRevenue,
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-900/30",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm font-medium text-slate-400">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
        <h2 className="text-lg font-bold font-display text-white mb-6">
          Student Enrollment Trends
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8" }}
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
                dataKey="students"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorStudents)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
