import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const SlideDrawer = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${width} bg-white shadow-2xl border-l border-[#0A0A0A]/16 flex flex-col`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#0A0A0A]/12 shrink-0 bg-[#0A0A0A] text-[#F7F5EF]">
            <div>
              {title && (
                <h3 className="font-display text-xl text-white font-normal leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#C8A13A] font-body mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-xs transition-colors focus:outline-none"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 font-body text-xs text-[#0A0A0A]">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 bg-[#F7F5EF] border-t border-[#0A0A0A]/12 flex items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
