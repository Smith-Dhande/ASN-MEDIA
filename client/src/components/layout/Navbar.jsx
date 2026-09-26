import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
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
          className="group flex items-center gap-3 no-underline focus:outline-none focus:ring-2 focus:ring-[#C8A13A] rounded-sm"
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          {siteConfig.navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8A13A] rounded-sm ${
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

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8A13A] text-[#0A0A0A] text-xs font-bold tracking-widest uppercase rounded-[4px] hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#C8A13A] shadow-lg"
          >
            LET'S TALK
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-[#C8A13A] rounded-sm ${textColorClass}`}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
                className="font-display text-4xl hover:text-[#C8A13A] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-6 pt-8 border-t border-white/10">
            <Link
              to="/contact"
              className="w-full py-4 text-center bg-[#C8A13A] text-[#0A0A0A] font-semibold tracking-widest text-xs uppercase rounded-[4px]"
            >
              LET'S TALK →
            </Link>
            <div className="flex justify-between items-center text-xs text-[#66615A]">
              <span>hello@asnmedia.in</span>
              <span>Mumbai & Global</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
