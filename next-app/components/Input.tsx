"use client";

import type { HTMLInputTypeAttribute } from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal" | "search" | "url";
}

export default function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
  error,
  placeholder,
  autoComplete,
  inputMode,
}: InputProps) {
  return (
    <label className="text-sm font-black text-rosedark">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-rosebrand ${
          error ? "border-red-400" : "border-roselight"
        }`}
      />
      {error && (
        <span className="mt-1 block text-xs font-bold text-red-500">{error}</span>
      )}
    </label>
  );
}
