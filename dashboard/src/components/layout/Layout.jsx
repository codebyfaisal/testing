import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components";

import useDashboardStore from "@/store/useDashboardStore";

const Layout = () => {
  const { isSidebarOpen, closeSidebar } = useDashboardStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Passed props for mobile control */}
      <Sidebar />

      <main className="flex-1 w-full lg:ml-64 px-3 xs:px-4 lg:px-8 overflow-hidden h-screen transition-all duration-300 y-16 py-6 content1">
        <div className="max-w-6xl mx-auto content2">
          <Suspense
            fallback={<div className="text-muted-foreground">Loading...</div>}
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Layout;
