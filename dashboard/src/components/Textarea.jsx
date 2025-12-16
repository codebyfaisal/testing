import React from "react";

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  name,
  rows = 3,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[0.9rem] font-medium text-zinc-300">{label}</label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder-zinc-600 resize-none"
      />
    </div>
  );
};

export default Textarea;
