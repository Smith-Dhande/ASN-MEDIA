import React from 'react';

export const ActivityTimeline = ({ logs = [], limit = 5 }) => {
  const displayLogs = limit ? logs.slice(0, limit) : logs;

  if (!displayLogs || displayLogs.length === 0) {
    return (
      <p className="text-xs text-[#66615A] font-body p-4 text-center">
        No recent system activity recorded.
      </p>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#0A0A0A]/14">
      {displayLogs.map((item) => (
        <div key={item.id} className="relative group">
          {/* Dot */}
          <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-[#0A0A0A] border-2 border-white ring-2 ring-[#0A0A0A]/10 group-hover:bg-[#C8A13A] transition-colors" />

          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-xs font-bold text-[#0A0A0A]">
              {item.actor}
            </span>
            <span className="text-[10px] font-mono text-[#66615A] shrink-0">
              {item.timestamp}
            </span>
          </div>

          <p className="text-xs text-[#0A0A0A] font-body mt-0.5 font-medium">
            {item.action}: <span className="text-[#66615A] font-normal">{item.entity}</span>
          </p>
        </div>
      ))}
    </div>
  );
};
