import React from "react";

const NotFound = ({ Icon, message, className = "" }) => {
  return (
    <div
      className={`p-12 text-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden text-zinc-500 ${className}`}
    >
      <Icon size={48} className="mx-auto text-4xl mb-4 opacity-20" />
      <p>{message}</p>
    </div>
  );
};

export default NotFound;
