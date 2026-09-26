import React from 'react';
import { Menu, Search, User, LogOut, ExternalLink } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { NotificationDropdown } from '../widgets/NotificationDropdown';
import { Link } from 'react-router-dom';

export const AdminHeader = () => {
  const { toggleSidebar, logoutMock, setGlobalSearchQuery, setIsSearchOpen } = useAdminData();

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#0A0A0A] text-[#F7F5EF] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shadow-md">
      {/* Left: Sidebar Toggle & Quick Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#C8A13A]"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="font-display text-lg text-white font-normal tracking-tight">
            ASN Media
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#C8A13A] uppercase bg-white/10 px-2 py-0.5 rounded-xs border border-[#C8A13A]/30 font-semibold">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Center: Quick Search Trigger */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-xs border border-white/14 text-xs font-mono transition-all focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#C8A13A]" />
            <span className="hidden sm:inline">Search clients, enquiries, projects...</span>
            <span className="sm:hidden">Search...</span>
          </span>
          <kbd className="hidden md:inline-block text-[10px] bg-black/50 px-1.5 py-0.5 rounded-xs border border-white/20 text-white/60">
            Cmd+K
          </kbd>
        </button>
      </div>

      {/* Right Actions: Public site link, Notifications, User session profile */}
      <div className="flex items-center gap-3">
        {/* Link to public website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider rounded-xs border border-white/10 transition-colors"
          title="Open Public Website in new tab"
        >
          <span>VIEW SITE</span>
          <ExternalLink className="w-3 h-3 text-[#C8A13A]" />
        </a>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Session Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/14">
          <Link
            to="/admin/settings/profile"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#C8A13A] text-[#0A0A0A] font-mono text-xs font-bold flex items-center justify-center border border-[#C8A13A] group-hover:scale-105 transition-transform">
              SJ
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-[#C8A13A] transition-colors leading-none">
                Sarah Jenkins
              </span>
              <span className="text-[9px] font-mono text-white/60 uppercase mt-0.5">
                Super Admin
              </span>
            </div>
          </Link>

          <button
            onClick={logoutMock}
            className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-xs transition-colors focus:outline-none"
            aria-label="Logout"
            title="Logout Admin Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
