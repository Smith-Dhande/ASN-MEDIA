import React, { useState } from 'react';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { EmptyState } from '../../admin/components/ui/EmptyState';
import { Bell, CheckCircle2, Clock, Check, FolderKanban, CreditCard, MessageSquare } from 'lucide-react';

export const PortalNotifications = () => {
  const { clientNotifications } = usePortalClient();
  const [notificationsList, setNotificationsList] = useState(clientNotifications || []);
  const [filter, setFilter] = useState('All'); // All | Unread
  const [toastMsg, setToastMsg] = useState('');

  const filteredNotifications = notificationsList.filter((n) => {
    if (filter === 'Unread') return !n.read;
    return true;
  });

  const handleMarkRead = (id) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMsg('All notifications marked as read.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-body">
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-md flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#0A0A0A]/08">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
            CLIENT NOTIFICATION INBOX
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
            Notifications & Updates
          </h1>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-2 bg-white border border-[#0A0A0A]/14 text-[#111111] text-xs font-mono font-bold rounded-md hover:border-[#8E722A] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5 text-[#8E722A]" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 font-mono text-xs border-b border-[#0A0A0A]/08 pb-2">
        {['All', 'Unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md font-bold uppercase transition-colors ${
              filter === f
                ? 'bg-[#111111] text-[#F7F5EF]'
                : 'text-[#685C43] hover:text-[#111111] hover:bg-[#FAF8F3]'
            }`}
          >
            {f} Notifications
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <AdminCard title={`Inbox (${filteredNotifications.length})`} className="p-5">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer space-y-2 text-xs ${
                  notif.read
                    ? 'bg-white border-[#0A0A0A]/08 opacity-80'
                    : 'bg-[#FAF8F3] border-[#8E722A]/40 shadow-2xs font-semibold'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#8E722A] shrink-0" />
                    )}
                    <h4 className="font-bold text-[#111111]">{notif.title}</h4>
                  </div>
                  <span className="font-mono text-[10px] text-[#685C43] shrink-0">
                    {notif.timestamp || notif.time || 'Today'}
                  </span>
                </div>

                <p className="text-[#685C43] font-normal leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="No Notifications"
            description="Your notification inbox is clean and up to date."
          />
        )}
      </AdminCard>
    </div>
  );
};
