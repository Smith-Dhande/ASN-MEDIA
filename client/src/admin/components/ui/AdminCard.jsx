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
      className={`bg-white rounded-xl border border-[#0A0A0A]/08 shadow-2xs transition-all duration-200 ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0A0A0A]/06">
          <div>
            {title && (
              <h3 className="font-display text-base font-normal text-[#111111] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-[#685C43] font-body mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>{children}</div>
      {footer && (
        <div className="px-4 py-2.5 bg-[#FAF8F3] border-t border-[#0A0A0A]/06 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};
