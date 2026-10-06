import React, { useState } from 'react';
import { Bell, Check, ArrowRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAdminData();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#221C11] hover:bg-[#DBCDAA] rounded-xs transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#8E722A] ring-2 ring-[#E5D9BC] animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-[6px] border border-[#0A0A0A]/16 shadow-2xl z-50 text-[#0A0A0A] font-body text-xs overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] text-white">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#C8A13A]">
                  NOTIFICATIONS
                </span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#C8A13A] text-black font-mono text-[10px] font-bold rounded-xs">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] font-mono text-white/70 hover:text-[#C8A13A] flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="divide-y divide-[#0A0A0A]/08 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-[#66615A] text-xs">
                  No notifications to display.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      setIsOpen(false);
                    }}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                      notif.read ? 'bg-white hover:bg-[#F7F5EF]/50' : 'bg-[#F7F5EF] hover:bg-[#F7F5EF]/90'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        notif.read ? 'bg-transparent' : 'bg-[#C8A13A]'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#0A0A0A] text-xs">
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#66615A]">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#66615A] mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-[#F7F5EF] border-t border-[#0A0A0A]/12 text-center">
              <Link
                to="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#0A0A0A] inline-flex items-center gap-1 uppercase tracking-wider"
              >
                <span>VIEW ALL NOTIFICATIONS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
