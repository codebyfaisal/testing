import React from "react";
import { FaCode } from "react-icons/fa";
import { cn } from "@/utils/cn";

const RenderIcon = ({ icon, className = "" }) => {
  if (!icon) return null;
  if (icon.startsWith("http") || icon.startsWith("data:image"))
    return (
      <img
        src={icon}
        className={cn(
          "w-12 h-12 object-contain rounded-3xl border-none outline-none",
          className
        )}
        alt="Service Icon"
      />
    );
  else if (icon.startsWith("<svg "))
    return (
      <div
        className={cn("grow flex justify-center items-center", className)}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  else if (icon === " " || icon === "")
    return <FaCode className={cn("w-12 h-12", className)} />;
  else return <FaCode className={cn("w-12 h-12", className)} />;
};

export default RenderIcon;
