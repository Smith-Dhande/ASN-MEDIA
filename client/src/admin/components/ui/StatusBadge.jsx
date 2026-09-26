import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();

  let styleClass = 'bg-[#F7F5EF] text-[#66615A] border-[#0A0A0A]/14'; // Default fallback

  if (['active', 'paid', 'converted', 'completed', 'high'].includes(normalized)) {
    styleClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  } else if (['pending', 'in contact', 'proposal sent', 'in progress', 'medium', 'review'].includes(normalized)) {
    styleClass = 'bg-amber-50 text-amber-900 border-amber-300';
  } else if (['overdue', 'failed', 'lost', 'urgent', 'expiring soon'].includes(normalized)) {
    styleClass = 'bg-red-50 text-red-800 border-red-300';
  } else if (['new', 'planning', 'low', 'draft'].includes(normalized)) {
    styleClass = 'bg-sky-50 text-sky-800 border-sky-300';
  } else if (['archived', 'inactive'].includes(normalized)) {
    styleClass = 'bg-stone-100 text-stone-600 border-stone-300';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-xs border text-[11px] font-mono font-semibold tracking-wider uppercase ${styleClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};
