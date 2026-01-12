import React from "react";
import { cn } from "@/utils/cn";

const FadeIn = ({ children, className, delay = 0 }) => {
  return (
    <div
      className={cn("animate-fade-in opacity-0", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeIn;
