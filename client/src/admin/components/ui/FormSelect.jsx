import React from 'react';

export const FormSelect = ({
  label,
  id,
  options = [], // Array of { value, label } or strings
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0A0A0A]"
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`px-3.5 py-2 bg-[#F7F5EF]/50 text-xs font-body text-[#0A0A0A] rounded-sm border transition-all focus:outline-none focus:ring-1 focus:ring-[#C8A13A] disabled:opacity-50 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-[#0A0A0A]/14 focus:border-[#C8A13A]'
        }`}
        {...props}
      >
        {options.map((opt, idx) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optValue || idx} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && <span className="text-[11px] text-red-600 font-body">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-[#66615A] font-body">{helperText}</span>
      )}
    </div>
  );
};
