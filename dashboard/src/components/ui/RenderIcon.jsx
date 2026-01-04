import React from "react";
import { FaCode } from "react-icons/fa";

const RenderIcon = ({ icon, className = "", defaultIcon }) => {
  if (icon) {
    if (icon.startsWith("http") || icon.startsWith("data:image")) {
      return (
        <img
          src={icon}
          className={`w-12 h-12 object-contain rounded-full border-none outline-none ${className}`}
          alt="Service Icon"
        />
      );
    }
    if (icon.startsWith("<svg") || icon.startsWith("<?xml")) {
      return (
        <div
          className={`h-full grow flex justify-center items-center ${className}`}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      );
    }
    return (
      <FaCode
        className={`h-9 w-9 grow flex justify-center items-center ${className}`}
      />
    );
  }

  if (defaultIcon) {
    return (
      <div
        className={`h-full grow flex justify-center items-center ${className}`}
        dangerouslySetInnerHTML={{ __html: defaultIcon }}
      />
    );
  }

  return null;
};

export default RenderIcon;
