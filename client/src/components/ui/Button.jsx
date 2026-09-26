import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary', // 'primary' | 'accent' | 'text' | 'secondary'
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#C8A13A] rounded-[4px]';

  const variants = {
    primary:
      'bg-[#0A0A0A] text-[#F7F5EF] px-6 py-3.5 hover:bg-[#C8A13A] hover:text-[#0A0A0A]',
    accent:
      'bg-[#C8A13A] text-[#0A0A0A] px-7 py-4 hover:bg-[#0A0A0A] hover:text-[#F7F5EF]',
    secondary:
      'bg-transparent border border-[#0A0A0A]/20 text-[#0A0A0A] px-6 py-3.5 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F7F5EF]',
    text:
      'bg-transparent text-[#0A0A0A] p-0 font-medium hover:text-[#C8A13A] text-sm lowercase tracking-normal font-body'
  };

  const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {variant === 'text' ? (
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      ) : (
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses} {...props}>
      {content}
    </button>
  );
};
