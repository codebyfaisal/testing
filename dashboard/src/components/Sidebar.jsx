import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaProjectDiagram,
  FaServicestack,
  FaCog,
  FaHome,
  FaCommentDots,
  FaEnvelope,
  FaFolder,
  FaMoneyBill,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

import clsx from "clsx";
import useDashboardStore from "../store/useDashboardStore";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useDashboardStore();
  const navItems = [
    { path: "/", icon: FaHome, label: "Overview" },
    { path: "/user", icon: FaUser, label: "User" },
    { path: "/visitors", icon: FaUsers, label: "Visitors" },
    { path: "/services", icon: FaServicestack, label: "Services" },
    { path: "/plans", icon: FaMoneyBill, label: "Plans" },
    { path: "/projects", icon: FaProjectDiagram, label: "Projects" },
    { path: "/testimonials", icon: FaCommentDots, label: "Testimonials" },
    { path: "/messages", icon: FaEnvelope, label: "Messages" },
    { path: "/files", icon: FaFolder, label: "File Manager" },
    { path: "/configuration", icon: FaCog, label: "Configuration" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-xs text-zinc-400">Portfolio Manager</p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-zinc-400 hover:text-white"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768) onClose();
            }}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )
            }
          >
            <item.icon className="text-lg" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {(user?.name?.first || "A").charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {user?.name?.first || "Admin"}
            </p>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
