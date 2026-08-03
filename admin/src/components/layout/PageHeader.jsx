import React from "react";
import { FaBars } from "react-icons/fa";
import useDashboardStore from "@/store/useDashboardStore";

const PageHeader = ({ title, description, children }) => {
  const { openSidebar } = useDashboardStore();

  return (
    <header className="pb-2 flex items-center justify-between gap-4 page-header pr-1">
      <div>
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="flex justify-end items-end gap-2 flex-wrap-reverse">
        {children}
        <button
          onClick={openSidebar}
          className="p-3 bg-card border border-border rounded-lg lg:hidden text-foreground"
        >
          <FaBars />
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
