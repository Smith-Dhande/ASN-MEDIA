import React from 'react';

export const FormToggle = ({
  label,
  id,
  checked = false,
  onChange,
  disabled = false,
  description,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 py-2 ${className}`}>
      <div>
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0A0A0A] cursor-pointer"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="text-[11px] text-[#66615A] font-body mt-0.5">{description}</p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C8A13A] disabled:opacity-50 ${
          checked ? 'bg-[#0A0A0A]' : 'bg-[#0A0A0A]/20'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
