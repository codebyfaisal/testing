import React from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const rounded = usePortfolioStore((state) => state.rounded);

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 bg-secondary/10 border border-border",
        rounded,
        className
      )}
    >
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-1.5 transition-all",
          rounded,
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Light Mode"
      >
        <FaSun size={14} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-1.5 transition-all",
          rounded,
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Dark Mode"
      >
        <FaMoon size={14} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-1.5 transition-all",
          rounded,
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="System Preference"
      >
        <FaDesktop size={14} />
      </button>
    </div>
  );
};

export default ThemeToggle;
