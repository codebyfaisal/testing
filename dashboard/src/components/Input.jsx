import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  name,
  className = "",
  children,
  ...props
}) => {
  const id = crypto.randomUUID().split("-")[0];
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[0.9rem] font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        id={id}
        {...props}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {children}
    </div>
  );
};

export default Input;
