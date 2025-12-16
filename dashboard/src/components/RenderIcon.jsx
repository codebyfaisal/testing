import React from "react";
import { FaCode } from "react-icons/fa";

const RenderIcon = ({ icon, className = "" }) => {
  if (!icon) return null;
  if (icon.startsWith("http") || icon.startsWith("data:image"))
    return (
      <img
        src={icon}
        className={`w-12 h-12 object-contain rounded-full border-none outline-none ${className}`}
        alt="Service Icon"
      />
    );
  else if (icon.startsWith("<svg "))
    return (
      <div
        className={`h-full grow flex justify-center items-center ${className}`}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  else return <FaCode className={`w-12 h-12 ${className}`} />;
};

export default RenderIcon;
