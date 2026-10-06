import React from 'react';

export const AdminTabs = ({
  tabs = [], // Array of { id, label, badge, icon: Icon }
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-[#0A0A0A]/12 flex items-center gap-1 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange && onChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 focus:outline-none ${
              isActive
                ? 'border-[#C8A13A] text-[#0A0A0A] font-bold bg-[#F7F5EF]/60'
                : 'border-transparent text-[#66615A] hover:text-[#0A0A0A] hover:border-[#0A0A0A]/20'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 text-[#8E722A]" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-[#0A0A0A] text-[#F7F5EF]'
                    : 'bg-[#0A0A0A]/10 text-[#0A0A0A]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
