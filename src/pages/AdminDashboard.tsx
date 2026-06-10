import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Activity, ShieldCheck, Database, Server } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/admin")
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
          Admin Console
        </h1>
        <p className="text-slate-400 mt-2">
          Platform health and global metrics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            icon: Activity,
            color: "text-indigo-400",
            bg: "bg-indigo-900/30",
          },
          {
            label: "System Health",
            value: stats.systemHealth,
            icon: Server,
            color: "text-emerald-400",
            bg: "bg-emerald-900/30",
          },
          {
            label: "Active Subs",
            value: stats.activeSubscriptions,
            icon: Database,
            color: "text-amber-400",
            bg: "bg-amber-900/30",
          },
          {
            label: "Pending Approvals",
            value: stats.pendingApprovals,
            icon: ShieldCheck,
            color: "text-rose-400",
            bg: "bg-rose-900/30",
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
    </motion.div>
  );
}
