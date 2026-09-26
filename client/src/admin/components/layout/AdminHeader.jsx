import React from 'react';
import { Menu, Search, LogOut, ExternalLink } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { NotificationDropdown } from '../widgets/NotificationDropdown';
import { Link } from 'react-router-dom';

export const AdminHeader = () => {
  const { toggleSidebar, logoutMock, setIsSearchOpen } = useAdminData();

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#E5D9BC] text-[#221C11] border-b border-[#D5C7A5] flex items-center justify-between px-4 sm:px-6 shadow-2xs">
      {/* Left: Sidebar Toggle & Quick Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 text-[#221C11] hover:bg-[#DBCDAA] rounded-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#8E722A]"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="font-display text-lg text-[#111111] font-normal tracking-tight">
            ASN Media
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#8E722A] uppercase bg-[#F7F5EF] px-2 py-0.5 rounded-xs border border-[#D5C7A5] font-bold">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Center: Quick Search Trigger */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-[#F7F5EF] hover:bg-white text-[#221C11] rounded-xs border border-[#D5C7A5] text-xs font-mono transition-all focus:outline-none shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#8E722A]" />
            <span className="hidden sm:inline text-[#685C43]">Search clients, enquiries, projects...</span>
            <span className="sm:hidden text-[#685C43]">Search...</span>
          </span>
          <kbd className="hidden md:inline-block text-[10px] bg-[#E5D9BC] px-1.5 py-0.5 rounded-xs border border-[#D5C7A5] text-[#221C11] font-bold">
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
          className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#F7F5EF] hover:bg-[#111111] hover:text-[#F7F5EF] text-[#221C11] text-xs font-mono uppercase tracking-wider rounded-xs border border-[#D5C7A5] transition-colors"
          title="Open Public Website in new tab"
        >
          <span>VIEW SITE</span>
          <ExternalLink className="w-3 h-3 text-[#8E722A]" />
        </a>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Session Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#D5C7A5]">
          <Link
            to="/admin/settings/profile"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-xs font-bold flex items-center justify-center border border-[#8E722A] group-hover:scale-105 transition-transform">
              SJ
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-[#111111] group-hover:text-[#8E722A] transition-colors leading-none">
                Sarah Jenkins
              </span>
              <span className="text-[9px] font-mono text-[#685C43] uppercase mt-0.5">
                Super Admin
              </span>
            </div>
          </Link>

          <button
            onClick={logoutMock}
            className="p-1.5 text-[#685C43] hover:text-red-700 hover:bg-[#DBCDAA] rounded-xs transition-colors focus:outline-none"
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
