import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components";
import Header from "./Header";
import useDashboardStore from "@/store/useDashboardStore";

const Layout = () => {
  const { isSidebarOpen, closeSidebar } = useDashboardStore();

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar (Fixed 260px left) */}
      <Sidebar />

      {/* Right Area */}
      <div className="flex-1 lg:ml-64 h-screen flex flex-col overflow-hidden w-full min-w-0">
        {/* Fixed Top Header */}
        <Header />

        {/* Scrollable Content Area (flex: 1, overflow-y: auto) */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-7 py-6">
          <div className="max-w-6xl mx-auto">
            <Suspense
              fallback={<div className="text-muted-foreground p-4">Loading...</div>}
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
