import React from "react";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";

const defaultTitle = { start: "", middle: "", end: "" };

const PageHeader = ({
  title = defaultTitle,
  description = "",
  className = "",
}) => {
  const { rounded } = usePortfolioStore();

  return (
    <div
      className={cn(
        "mb-16 max-w-xl mx-auto transition-colors duration-300 flex flex-col items-center",
        className
      )}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-px text-foreground">
        {title.start} <span className="text-secondary">{title.middle}</span>{" "}
        {title.end}
      </h1>
      <div className={cn("w-24 h-1 bg-secondary mx-auto", rounded)} />
      {description && (
        <p className="max-w-3xl mx-auto mt-4 text-foreground/90">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
