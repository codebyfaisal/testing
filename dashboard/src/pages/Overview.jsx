import React, { useEffect, use } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { motion } from "motion/react";
import { StatsSkeleton } from "../components";
import {
  FaProjectDiagram,
  FaServicestack,
  FaEnvelope,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Overview = () => {
  const {
    data,
    isLoading,
    getUser,
    fetchOverviewStats,
    fetchVisitorStats,
    markMessageRead,
  } = useDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    fetchOverviewStats();
    fetchVisitorStats();
  }, []);

  const stats = [
    {
      label: "Unique Visitors (Today)",
      value: data?.visitorStats?.uniqueVisitorsToday || 0,
      icon: FaUsers,
      color: "text-blue-500",
    },
    {
      label: "Total Visits",
      value: data?.visitorStats?.totalVisits || 0,
      icon: FaChartLine,
      color: "text-purple-500",
    },
    {
      label: "Total Projects",
      value: data?.overview?.counts?.projects || 0,
      icon: FaProjectDiagram,
      color: "text-indigo-500",
    },
    {
      label: "Active Services",
      value: data?.overview?.counts?.services || 0,
      icon: FaServicestack,
      color: "text-emerald-500",
    },
    {
      label: "Total Messages",
      value: data?.overview?.counts?.messages || 0,
      icon: FaEnvelope,
      color: "text-amber-500",
    },
  ];

  const handleMarkRead = async (id) => {
    await markMessageRead(id);
    fetchOverviewStats();
    toast.success("Message marked as read");
  };

  if (isLoading || !data.overview) return <StatsSkeleton />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">
          Welcome back, {data?.user?.name?.first || "User"}
        </h1>
        <p className="text-zinc-400">
          Here's what's happening with your portfolio today.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-colors"
            >
              <div>
                <h3 className="text-zinc-400 text-sm font-medium">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div
                className={`p-3 rounded-full bg-zinc-800 ${stat.color} group-hover:bg-zinc-700 transition-colors`}
              >
                <stat.icon size={24} />
              </div>
            </motion.div>
          ))}
        </div>
        {/* Right Column */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 font-medium text-lg">
              Profile Health
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                data?.overview?.health?.status === "Perfect"
                  ? "bg-emerald-500/20 text-emerald-500"
                  : data?.overview?.health?.status === "Good"
                  ? "bg-indigo-500/20 text-indigo-500"
                  : data?.overview?.health?.status === "Weak"
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {data?.overview?.health?.status || "Loading"}
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-1000 ${
                data?.overview?.health?.status === "Perfect"
                  ? "bg-emerald-500"
                  : data?.overview?.health?.status === "Good"
                  ? "bg-indigo-500"
                  : data?.overview?.health?.status === "Weak"
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${data?.overview?.health?.score || 0}%` }}
            ></div>
          </div>

          {data?.overview?.health?.checklist?.length > 0 ? (
            <div className="space-y-2">
              <p className="text-zinc-400 uppercase font-bold">To Do List</p>
              <ul className="space-y-2">
                {data.overview.health.checklist.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-zinc-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-emerald-500 font-medium">All systems go! 🚀</p>
              <p className="text-xs text-zinc-500">
                Your profile is fully optimized.
              </p>
            </div>
          )}
        </div>
        {/* Recent Messages */}
        <div className="col-span-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Messages</h2>
            <Button
              label="View All"
              uiType="text"
              onClick={() => navigate("/messages")}
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            {data?.overview?.recentMessages?.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {data.overview.recentMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                        {(msg.from || "A").charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {msg.from || "Anonymous"}
                        </h4>
                        <p className="text-sm text-zinc-400 line-clamp-1">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {msg.status !== "read" && (
                        <button
                          onClick={() => handleMarkRead(msg._id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                          title="Mark as Read"
                        >
                          Mark Read
                        </button>
                      )}
                      <span className="text-xs text-zinc-500">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500">
                No recent messages.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
