import React from 'react';

export const SectionLabel = ({ children, className = '', dark = false }) => {
  return (
    <div className={`inline-flex items-center gap-2 mb-4 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A13A]" />
      <span
        className={`text-[11px] font-semibold tracking-[0.18em] uppercase ${
          dark ? 'text-[#C8A13A]' : 'text-[#8E722A]'
        }`}
      >
        {children}
      </span>
    </div>
  );
};
