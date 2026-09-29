import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortalClient } from '../../context/PortalContext';
import { Bell, User, ChevronDown, Sparkles, Shield, ArrowRight, Building, Check } from 'lucide-react';

export const PortalNavbar = () => {
  const { clients, currentClient, activeClientId, switchClient, clientNotifications } = usePortalClient();
  const navigate = useNavigate();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const unreadNotificationsCount = (clientNotifications || []).filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#0A0A0A]/10 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand & Client Eyebrow */}
        <div className="flex items-center gap-3">
          <Link to="/portal/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-[#F7F5EF] font-display font-bold text-base flex items-center justify-center border border-[#8E722A]">
              A
            </div>
            <div>
              <span className="font-display font-bold text-base text-[#111111] tracking-tight block group-hover:text-[#8E722A] transition-colors">
                ASN MEDIA
              </span>
              <span className="text-[9px] font-mono font-bold text-[#8E722A] uppercase tracking-widest block -mt-1">
                CLIENT PORTAL
              </span>
            </div>
          </Link>
        </div>

        {/* Center/Right Toolbar: Client Switcher + Notifications + Profile + Admin Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mock Client Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="px-3 py-1.5 bg-white border border-[#0A0A0A]/14 rounded-md text-xs font-mono font-bold text-[#111111] hover:border-[#8E722A] transition-colors flex items-center gap-2 shadow-2xs"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="truncate max-w-[130px] sm:max-w-[180px]">
                {currentClient?.name || 'Client Workspace'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#685C43]" />
            </button>

            {isSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#0A0A0A]/14 rounded-lg shadow-lg z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#8E722A] uppercase tracking-wider">
                  Switch Client Workspace (Demo)
                </div>
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      switchClient(client.id);
                      setIsSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono rounded-md flex items-center justify-between transition-colors ${
                      client.id === activeClientId
                        ? 'bg-[#111111] text-[#F7F5EF] font-bold'
                        : 'text-[#111111] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div>
                      <div className="truncate">{client.name}</div>
                      <div className="text-[10px] opacity-75">{client.company}</div>
                    </div>
                    {client.id === activeClientId && <Check className="w-3.5 h-3.5 text-[#8E722A]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Link */}
          <Link
            to="/portal/notifications"
            className="p-2 bg-white border border-[#0A0A0A]/12 rounded-md hover:border-[#8E722A] text-[#111111] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#685C43]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8E722A] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* Profile Quick Link */}
          <Link
            to="/portal/profile"
            className="w-8 h-8 rounded-full bg-[#E5D9BC] border border-[#8E722A] text-[#111111] font-mono text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-[#8E722A] transition-all"
            title="My Account Profile"
          >
            {currentClient?.contactName ? currentClient.contactName.charAt(0) : 'U'}
          </Link>

          {/* Direct Switch to Admin Panel Link */}
          <Link
            to="/admin/dashboard"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] font-mono text-xs font-bold rounded-md transition-colors shadow-2xs ml-1"
          >
            <Shield className="w-3.5 h-3.5 text-[#C8A13A]" />
            <span>Admin Panel →</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
