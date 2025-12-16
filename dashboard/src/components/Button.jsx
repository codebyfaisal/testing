import React from "react";

const Button = ({
  label,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  uiType = "primary",
  icon = "",
  ...props
}) => {
  let btnClassName =
    "outline-none border-none flex items-center gap-2 text-white rounded-lg px-4 py-3 h-max focus:outline-none font-semibold transition-colors disabled:opacity-50 w-auto disabled:cursor-not-allowed cursor-pointer";

  if (uiType === "secondary")
    btnClassName +=
      " bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-600";
  else if (uiType === "danger")
    btnClassName +=
      " bg-red-500/10 text-red-500 hover:bg-red-500/20 active:bg-red-500/30";
  else if (uiType === "text")
    btnClassName +=
      " bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50";
  else
    btnClassName += " bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={btnClassName + " " + className}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
