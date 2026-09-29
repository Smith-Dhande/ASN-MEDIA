import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePortalClient } from '../../context/PortalContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderKanban,
  CreditCard,
  MessageSquare,
  Bell,
  User,
  HelpCircle,
  Phone,
  Mail,
} from 'lucide-react';

export const PortalSidebar = () => {
  const { currentClient } = usePortalClient();

  const navItems = [
    { to: '/portal/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/portal/packages', label: 'My Package', icon: Package },
    { to: '/portal/services', label: 'My Services', icon: Layers },
    { to: '/portal/projects', label: 'My Projects', icon: FolderKanban },
    { to: '/portal/payments', label: 'Payments & Invoices', icon: CreditCard },
    { to: '/portal/enquiries', label: 'Support & Requests', icon: MessageSquare },
    { to: '/portal/notifications', label: 'Notifications', icon: Bell },
    { to: '/portal/profile', label: 'Account Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#0A0A0A]/10 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-57px)]">
      <div className="p-4 space-y-6">
        {/* Client Business Badge */}
        <div className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-1">
          <span className="text-[10px] font-mono text-[#8E722A] uppercase font-bold tracking-wider block">
            CLIENT ACCOUNT
          </span>
          <div className="font-display font-bold text-sm text-[#111111] truncate">
            {currentClient?.name || 'Maison de Luxe'}
          </div>
          <div className="text-[11px] font-mono text-[#685C43] truncate">
            {currentClient?.company || 'Luxury Hospitality'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold text-[#685C43] uppercase tracking-wider">
            Workspace Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-[#111111] text-[#F7F5EF] font-bold shadow-xs'
                      : 'text-[#685C43] hover:text-[#111111] hover:bg-[#FAF8F3]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Account Manager Support Box */}
      <div className="p-4 border-t border-[#0A0A0A]/08">
        <div className="p-3.5 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#8E722A] font-mono font-bold text-[11px]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>AGENCY LEAD</span>
          </div>
          <div className="font-bold text-[#111111]">
            {currentClient?.accountManager || 'Sarah Jenkins'}
          </div>
          <div className="text-[11px] font-mono text-[#685C43]">Senior Strategist & Lead</div>
          <a
            href="mailto:sarah@asnmedia.in"
            className="text-[11px] font-mono text-[#8E722A] hover:underline flex items-center gap-1 pt-1"
          >
            <Mail className="w-3 h-3" />
            sarah@asnmedia.in
          </a>
        </div>
      </div>
    </aside>
  );
};
