import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-zinc-800 rounded-lg md:hidden text-white"
      >
        <FaBars />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Passed props for mobile control */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main
        className={`flex-1 w-full md:ml-64 px-4 md:px-6 overflow-y-auto h-screen transition-all duration-300 ${
          location.pathname !== "/user" ? "py-16 md:py-6" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <React.Suspense
            fallback={<div className="text-zinc-400">Loading...</div>}
          >
            <Outlet />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};

export default Layout;
