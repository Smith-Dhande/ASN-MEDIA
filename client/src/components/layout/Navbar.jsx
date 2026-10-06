import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { siteConfig } from '../../data/site';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Determine navbar appearance
  const headerBgClass = isScrolled
    ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 py-4 shadow-xl'
    : 'bg-transparent py-6';

  const textColorClass = isHome && !isScrolled
    ? 'text-[#F7F5EF]'
    : isScrolled
    ? 'text-[#F7F5EF]'
    : 'text-[#0A0A0A]';

  const subtextColorClass = isHome && !isScrolled
    ? 'text-[#C8A13A]'
    : isScrolled
    ? 'text-[#C8A13A]'
    : 'text-[#66615A]';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
      <div className="container-custom flex items-center justify-between h-[52px]">
        {/* Restrained Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 no-underline focus:outline-none focus:ring-0 active:outline-none rounded-sm"
        >
          <img
            src="/favicon.PNG"
            alt="ASN Media Logo"
            className="w-9 h-9 rounded-full object-cover border border-[#C8A13A] shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className={`font-semibold text-sm tracking-[0.18em] font-body leading-none uppercase transition-colors ${textColorClass}`}>
              ASN MEDIA
            </span>
            <span className={`text-[9px] tracking-[0.14em] uppercase mt-0.5 transition-colors ${subtextColorClass}`}>
              SOCIAL • CONTENT • GROWTH
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links & Auth Controls */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <nav className="flex items-center gap-8">
            {siteConfig.navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors duration-200 focus:outline-none focus:ring-0 active:outline-none rounded-sm ${
                    isActive
                      ? 'text-[#C8A13A] font-semibold'
                      : `${textColorClass} opacity-80 hover:opacity-100 hover:text-[#C8A13A]`
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A13A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls Group (Right Side) - Single Sign In Entrypoint */}
          <div className="flex items-center gap-3.5 pl-5 border-l border-current/15">
            <Link
              to="/admin/login"
              className="py-1.5 px-4 text-xs uppercase tracking-[0.15em] font-semibold rounded-[3px] bg-[#C8A13A] text-[#0A0A0A] hover:bg-white transition-all duration-300 shadow-sm flex items-center gap-1.5 font-mono cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Toggle & Compact Auth Action */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            to="/admin/login"
            className="py-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#C8A13A] border border-[#C8A13A]/60 rounded-[3px] flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            <span>Sign In</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 focus:outline-none focus:ring-0 active:outline-none rounded-sm ${textColorClass}`}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[68px] bg-[#0A0A0A] text-[#F7F5EF] z-40 flex flex-col justify-between p-8 animate-fadeIn">
          <div className="flex flex-col gap-6 pt-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C8A13A] font-semibold">
              NAVIGATION
            </span>
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-4xl hover:text-[#C8A13A] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 text-center bg-[#C8A13A] text-[#0A0A0A] font-bold tracking-widest text-xs uppercase rounded-[4px] flex items-center justify-center gap-2 shadow-lg"
            >
              <Shield className="w-4 h-4" />
              <span>Enter Admin Panel</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-center bg-white text-[#0A0A0A] hover:bg-[#C8A13A] font-semibold tracking-widest text-xs uppercase rounded-[4px] transition-colors"
            >
              LET'S TALK →
            </Link>

            <div className="flex justify-between items-center text-xs text-[#66615A] pt-2">
              <span>hello@asnmedia.in</span>
              <span>Mumbai & Global</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
