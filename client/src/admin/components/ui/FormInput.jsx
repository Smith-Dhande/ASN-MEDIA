import React from 'react';

export const FormInput = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`px-3.5 py-2 bg-[#F7F5EF]/50 text-xs font-body text-[#0A0A0A] placeholder-[#66615A] rounded-sm border transition-all focus:outline-none focus:ring-1 focus:ring-[#C8A13A] disabled:opacity-50 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-[#0A0A0A]/14 focus:border-[#C8A13A]'
        }`}
        {...props}
      />
      {error && <span className="text-[11px] text-red-600 font-body">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-[#66615A] font-body">{helperText}</span>
      )}
    </div>
  );
};
