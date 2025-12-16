import React from "react";

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[0.9rem] font-medium text-zinc-300">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors text-white appearance-none"
        {...props}
      >
        <option value="" selected disabled className="bg-zinc-900">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-zinc-500"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
