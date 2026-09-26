import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const AdminModal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-xl',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className={`w-full bg-white rounded-[8px] border border-[#0A0A0A]/16 shadow-2xl flex flex-col max-h-[90vh] ${maxWidth}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0A0A0A]/12 shrink-0">
          <div>
            {title && (
              <h3 className="font-display text-xl text-[#0A0A0A] font-normal leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#66615A] font-body mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#66615A] hover:text-[#0A0A0A] hover:bg-[#F7F5EF] rounded-xs transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 font-body text-xs text-[#0A0A0A]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F7F5EF]/60 border-t border-[#0A0A0A]/12 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
