import React from 'react';

export const AdminCard = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  footer,
  noPadding = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-[6px] border border-[#0A0A0A]/12 shadow-xs transition-shadow ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0A0A0A]/10">
          <div>
            {title && (
              <h3 className="font-body text-sm font-bold text-[#0A0A0A] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#66615A] font-body mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-[#F7F5EF]/60 border-t border-[#0A0A0A]/10 rounded-b-[6px]">
          {footer}
        </div>
      )}
    </div>
  );
};
