import React, { useEffect, useState } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { motion, AnimatePresence } from "motion/react";
import {
  FaUsers,
  FaChartLine,
  FaGlobe,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import { UAParser } from "ua-parser-js";
import { ConfirmationModal } from "../components";

const filterOptions = [
  {
    name: "ip",
    priority: 1,
    className: "col-span-4",
  },
  {
    name: "path",
    priority: 2,
    className: "col-span-4",
  },
  {
    name: "ua",
    priority: 3,
    className: "col-span-4",
  },
  {
    name: "country",
    priority: 3,
    className: "col-span-4",
  },
  {
    name: "city",
    priority: 4,
    className: "col-span-4",
  },
  {
    name: "region",
    priority: 5,
    className: "col-span-4",
  },
  {
    name: "startDate",
    priority: 6,
    className: "col-span-4",
  },
  {
    name: "endDate",
    priority: 7,
    className: "col-span-4",
  },
];

const Visitors = () => {
  const {
    data,
    isLoading,
    fetchVisitorStats,
    fetchVisits,
    deleteVisits,
    wipeAllVisits,
  } = useDashboardStore();

  // Query State
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    ip: "",
    country: "",
    region: "",
    city: "",
    path: "",
    ua: "",
  });
  const [sorting, setSorting] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // UI State
  const [selected, setSelected] = useState([]);
  const [viewVisit, setViewVisit] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);

  // Debounced fetch trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVisits({
        page,
        limit: 10,
        ...filters,
        ...sorting,
      });
    }, 500); // 500ms debounce for typing in filters
    return () => clearTimeout(timer);
  }, [page, filters, sorting]);

  // Initial Stats
  useEffect(() => {
    fetchVisitorStats();
  }, []);

  const visits = data?.visits?.visits || [];
  const meta = data?.visits?.meta || {};

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSort = (field) => {
    setSorting((prev) => ({
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(visits.map((v) => v._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selected.length} visits?`)) return;
    try {
      await deleteVisits(selected);
      setSelected([]);
      fetchVisits({ page, limit: 10, ...filters, ...sorting }); // Refresh
      fetchVisitorStats(); // Refresh stats too
    } catch (error) {
      alert("Failed to delete visits");
    }
  };

  const stats = [
    {
      label: "Unique (Today)",
      value: data?.visitorStats?.uniqueVisitorsToday || 0,
      icon: FaUsers,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Visits",
      value: data?.visitorStats?.totalVisits || 0,
      icon: FaChartLine,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Visitor Analytics</h1>
          <p className="text-zinc-400">Track and analyze traffic patterns.</p>
        </div>

        <div className="flex gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center gap-3"
            >
              <div className={`p-2 rounded-md ${stat.bg} ${stat.color}`}>
                <stat.icon />
              </div>
              <div>
                <p className="text-xs text-zinc-400">{stat.label}</p>
                <p className="font-bold text-lg leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  showFilters
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                    : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <FaFilter /> Filters
              </button>
              {selected.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                >
                  <FaTrash /> Delete ({selected.length})
                </button>
              )}
              <button
                onClick={() => setShowWipeModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors ml-auto"
                title="Hard Delete All Data"
              >
                <FaTrash /> Wipe All
              </button>
            </div>
            <div className="text-xs text-zinc-500">
              Showing {visits.length} of {meta.total || 0}
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-12 gap-4 p-4 bg-zinc-950/30 rounded-lg border border-zinc-800/50">
                  {filterOptions
                    .sort((a, b) => a.priority - b.priority)
                    .map((option) => (
                      <input
                        key={option.name}
                        type={
                          option.name.toLowerCase().includes("date")
                            ? "date"
                            : "text"
                        }
                        name={option.name}
                        value={filters[option.name]}
                        onChange={handleFilterChange}
                        placeholder={
                          option.name === "ip"
                            ? "IP Address"
                            : option.name === "path"
                            ? "Page Path"
                            : option.name.charAt(0).toUpperCase() +
                              option.name.slice(1)
                        }
                        className={`bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm rounded-lg p-2 outline-none focus:ring-1 focus:ring-indigo-500 ${option.className}`}
                      />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-3 bg-zinc-950/50 text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-zinc-800 items-center">
          <div className="col-span-1 flex justify-center">
            <input
              type="checkbox"
              checked={visits.length > 0 && selected.length === visits.length}
              onChange={handleSelectAll}
              className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
          <div
            className="col-span-2 cursor-pointer hover:text-indigo-400 flex items-center gap-1"
            onClick={() => handleSort("ip")}
          >
            IP{" "}
            {sorting.sortBy === "ip" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div
            className="col-span-3 cursor-pointer hover:text-indigo-400 flex items-center gap-1"
            onClick={() => handleSort("location.country")}
          >
            Location{" "}
            {sorting.sortBy === "location.country" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div
            className="col-span-3 cursor-pointer hover:text-indigo-400 flex items-center gap-1"
            onClick={() => handleSort("page")}
          >
            Page{" "}
            {sorting.sortBy === "page" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div
            className="col-span-2 cursor-pointer hover:text-indigo-400 flex items-center gap-1"
            onClick={() => handleSort("createdAt")}
          >
            Time{" "}
            {sorting.sortBy === "createdAt" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* List */}
        <div className="divide-y divide-zinc-800">
          {isLoading ? (
            <div className="p-12 text-center text-zinc-500">
              Loading visits...
            </div>
          ) : visits.length > 0 ? (
            visits.map((visit, idx) => (
              <motion.div
                key={visit._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-800/30 transition-colors text-sm ${
                  selected.includes(visit._id) ? "bg-indigo-500/5" : ""
                }`}
              >
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(visit._id)}
                    onChange={() => handleSelectOne(visit._id)}
                    className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-zinc-600 shrink-0" />
                    <p
                      className="text-white font-mono text-xs truncate"
                      title={visit.ip}
                    >
                      {visit.ip}
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <p
                    className="text-zinc-300 truncate text-xs"
                    title={`${visit.location?.city || ""} ${
                      visit.location?.country || ""
                    }`}
                  >
                    {visit.location?.city
                      ? `${visit.location.city}, ${visit.location.country}`
                      : "Unknown Location"}
                  </p>
                </div>
                <div
                  className="col-span-3 text-zinc-300 font-mono text-xs truncate"
                  title={visit.page}
                >
                  {visit.page}
                </div>
                <div className="col-span-2 text-zinc-400 flex items-center gap-2 text-xs">
                  <FaClock className="text-zinc-600 shrink-0" />
                  <span className="truncate">
                    {new Date(visit.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => setViewVisit(visit)}
                    className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors text-center"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-500">
              No visits found matching your filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors text-zinc-300"
          >
            <FaChevronLeft /> Previous
          </button>

          <span className="text-sm text-zinc-400">
            Page <span className="text-white font-medium">{page}</span> of{" "}
            {meta.totalPages || 1}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(meta.totalPages || 1, p + 1))
            }
            disabled={page >= (meta.totalPages || 1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors text-zinc-300"
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {viewVisit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-white">Visit Details</h2>
                <button
                  onClick={() => setViewVisit(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase">
                      IP Address
                    </label>
                    <p className="text-white font-mono text-sm">
                      {viewVisit.ip}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase">
                      Timestamp
                    </label>
                    <div className="text-white text-sm">
                      <p>{new Date(viewVisit.createdAt).toLocaleString()}</p>
                      <p>{new Date(viewVisit.createdAt).toUTCString()}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-500 uppercase">
                      Page
                    </label>
                    <p className="text-white font-mono text-sm break-all">
                      {viewVisit.page}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-500 uppercase">
                      Location
                    </label>
                    <p className="text-white text-sm">
                      {viewVisit.location?.city}, {viewVisit.location?.region},{" "}
                      {viewVisit.location?.country}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-zinc-500 uppercase">
                      User Agent
                    </label>
                    <div className="flex flex-col gap-1">
                      <p className="text-white text-sm font-medium">
                        {(() => {
                          const parser = new UAParser(viewVisit.userAgent);
                          return `${parser.getBrowser().name || "Unknown"} ${
                            parser.getBrowser().version || ""
                          } on ${parser.getOS().name || "Unknown"} ${
                            parser.getOS().version || ""
                          }`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
                <button
                  onClick={() => setViewVisit(null)}
                  className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        onConfirm={() => {
          wipeAllVisits();
          setShowWipeModal(false);
        }}
        isDangerous={true}
        title="Wipe All Data?"
        message="WARNING: This will permanently delete ALL visitor history and force all users to re-log. This action cannot be undone. Are you absolutely sure?"
        confirmText="Yes, Wipe Everything"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Visitors;
