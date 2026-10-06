import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ExternalLink, ChevronDown, Check, Shield, User, ArrowRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { NotificationDropdown } from '../widgets/NotificationDropdown';
import { Link, useNavigate } from 'react-router-dom';

export const AdminHeader = () => {
  const { toggleSidebar, logout, currentUser } = useAdminData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Get initials
  const initials = currentUser?.avatar && currentUser.avatar.length <= 3
    ? currentUser.avatar
    : (currentUser?.name || 'Admin')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

  const getRoleColor = (role = '') => {
    const r = role.toLowerCase();
    if (r.includes('super admin')) return 'bg-amber-500/20 text-amber-900 border-amber-600/40';
    if (r.includes('admin')) return 'bg-orange-500/20 text-orange-900 border-orange-600/40';
    if (r.includes('project') || r.includes('pm')) return 'bg-sky-500/20 text-sky-900 border-sky-600/40';
    if (r.includes('account') || r.includes('finance')) return 'bg-emerald-500/20 text-emerald-900 border-emerald-600/40';
    if (r.includes('editor') || r.includes('creative')) return 'bg-purple-500/20 text-purple-900 border-purple-600/40';
    if (r.includes('strategist')) return 'bg-indigo-500/20 text-indigo-900 border-indigo-600/40';
    return 'bg-stone-500/20 text-stone-900 border-stone-600/40';
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#E5D9BC] text-[#221C11] border-b border-[#D5C7A5] flex items-center justify-between px-4 sm:px-6 shadow-2xs">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 text-[#221C11] hover:bg-[#DBCDAA] rounded-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#8E722A]"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Actions: Public site link, Notifications, Quick Role Switcher, User profile */}
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

        {/* Current Active Role Badge (Display Only - No Switcher) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F5EF] text-[#221C11] text-xs font-mono rounded-xs border border-[#D5C7A5] shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-[#8E722A]" />
          <span className="font-semibold hidden sm:inline">{currentUser?.role || 'Staff'}</span>
        </div>

        {/* User Session Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#D5C7A5]">
          <Link
            to="/admin/settings/profile"
            className="flex items-center gap-2 group focus:outline-none"
            title={`Logged in as ${currentUser?.name || 'Staff'}`}
          >
            <div className="w-7 h-7 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-xs font-bold flex items-center justify-center border border-[#8E722A] group-hover:scale-105 transition-transform shadow-2xs">
              {initials}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-[#111111] group-hover:text-[#8E722A] transition-colors leading-none truncate max-w-[130px]">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[9px] font-mono text-[#685C43] uppercase mt-0.5 truncate max-w-[130px]">
                {currentUser?.role || 'Staff'}
              </span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
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
