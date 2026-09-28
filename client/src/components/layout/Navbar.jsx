import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Settings, LogOut, Lock } from 'lucide-react';
import { siteConfig } from '../../data/site';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const {
    user,
    openSignIn,
    openSignUp,
    signOut,
    openAccountModal,
  } = useAuth();

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
    setUserDropdownOpen(false);
  }, [location]);

  // Handle clicking outside user dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Auth Controls Group (Right Side) */}
          <div className="flex items-center gap-3.5 pl-5 border-l border-current/15">
            {!user ? (
              <>
                {/* Sign In Action */}
                <button
                  type="button"
                  onClick={openSignIn}
                  className={`py-1.5 px-2.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-200 focus:outline-none rounded-sm cursor-pointer ${textColorClass} opacity-85 hover:opacity-100 hover:text-[#C8A13A]`}
                >
                  Sign In
                </button>

                {/* Sign Up Action (Refined Emphasis) */}
                <button
                  type="button"
                  onClick={openSignUp}
                  className="py-1.5 px-4 text-xs uppercase tracking-[0.15em] font-semibold rounded-[3px] border border-[#C8A13A] text-[#C8A13A] hover:bg-[#C8A13A] hover:text-[#0A0A0A] transition-all duration-300 shadow-sm cursor-pointer focus:outline-none active:scale-[0.98]"
                >
                  Sign Up
                </button>
              </>
            ) : (
              /* Signed-In State: Compact User Account Control */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 py-1 px-2 rounded-full border border-[#C8A13A]/50 hover:border-[#C8A13A] bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-all duration-200 focus:outline-none cursor-pointer group"
                  aria-expanded={userDropdownOpen}
                  aria-label="User profile menu"
                >
                  <div className="w-7 h-7 rounded-full bg-[#C8A13A] text-[#0A0A0A] font-bold text-[11px] font-body flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                    {user.initials || 'AM'}
                  </div>
                  <span className={`text-xs font-semibold tracking-wider font-body max-w-[100px] truncate ${textColorClass}`}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#C8A13A] transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Minimal Luxury Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-[#F7F5EF] text-[#0A0A0A] rounded-[4px] shadow-2xl border border-[#0A0A0A]/12 py-2 z-50 animate-fadeIn font-body">
                    <div className="px-4 py-3 border-b border-[#0A0A0A]/08 bg-[#0A0A0A]/03">
                      <p className="text-xs font-semibold text-[#0A0A0A] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#66615A] truncate mt-0.5">{user.email}</p>
                      <span className="inline-block mt-2 text-[9px] tracking-widest font-semibold uppercase text-[#8E722A] bg-[#C8A13A]/15 px-2 py-0.5 rounded-[2px]">
                        CLIENT PARTNER
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAccountModal('profile');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#0A0A0A] hover:bg-[#0A0A0A]/06 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-[#C8A13A]" />
                        <span>Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAccountModal('account');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#0A0A0A] hover:bg-[#0A0A0A]/06 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#C8A13A]" />
                        <span>My Account</span>
                      </button>
                    </div>

                    <div className="border-t border-[#0A0A0A]/08 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle & Compact Auth Action */}
        <div className="md:hidden flex items-center gap-3">
          {!user ? (
            <button
              type="button"
              onClick={openSignIn}
              className="py-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#C8A13A] border border-[#C8A13A]/60 rounded-[3px]"
            >
              Sign In
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAccountModal('profile')}
              className="w-7 h-7 rounded-full bg-[#C8A13A] text-[#0A0A0A] font-bold text-[11px] font-body flex items-center justify-center border border-[#C8A13A]"
            >
              {user.initials || 'AM'}
            </button>
          )}

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
                className="font-display text-4xl hover:text-[#C8A13A] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignIn();
                  }}
                  className="py-3.5 text-center border border-white/20 text-[#F7F5EF] font-semibold tracking-widest text-xs uppercase rounded-[4px]"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignUp();
                  }}
                  className="py-3.5 text-center bg-[#C8A13A] text-[#0A0A0A] font-semibold tracking-widest text-xs uppercase rounded-[4px]"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white/05 rounded-[4px] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8A13A] text-[#0A0A0A] font-bold text-xs flex items-center justify-center">
                    {user.initials || 'AM'}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-[#C8A13A] truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAccountModal('profile');
                    }}
                    className="py-2 text-center bg-white/10 text-xs font-medium uppercase rounded-[3px]"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="py-2 text-center bg-red-900/40 text-red-200 text-xs font-medium uppercase rounded-[3px]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            <Link
              to="/contact"
              className="w-full py-4 text-center bg-white text-[#0A0A0A] hover:bg-[#C8A13A] font-semibold tracking-widest text-xs uppercase rounded-[4px] transition-colors"
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

