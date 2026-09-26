import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { FilterBar } from '../components/ui/FilterBar';
import { AdminCard } from '../components/ui/AdminCard';
import { Pagination } from '../components/ui/Pagination';
import { Bell, CheckCheck, Clock, Mail, AlertTriangle, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

export const NotificationsModule = () => {
  const { notifications: initialNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useAdminData();
  const navigate = useNavigate();

  const [notificationsList, setNotificationsList] = useState(initialNotifications || []);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  const handleMarkRead = (id) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    markNotificationAsRead(id);
  };

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllNotificationsAsRead();
  };

  const filteredNotifications = notificationsList.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());

    if (categoryFilter === 'Unread') return matchesSearch && !n.read;
    if (categoryFilter === 'Package Alerts') return matchesSearch && n.type === 'EXPIRING_PACKAGE';
    if (categoryFilter === 'Enquiries') return matchesSearch && n.type === 'NEW_ENQUIRY';
    if (categoryFilter === 'Payments') return matchesSearch && n.type === 'OVERDUE_PAYMENT';

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getIcon = (type) => {
    switch (type) {
      case 'EXPIRING_PACKAGE':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'NEW_ENQUIRY':
        return <Mail className="w-5 h-5 text-[#8E722A]" />;
      case 'OVERDUE_PAYMENT':
        return <CreditCard className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#111111]" />;
    }
  };

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-[6px] border border-[#0A0A0A]/12 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-semibold text-lg text-[#111111]">Notifications Inbox</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#8E722A] text-white rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-[#66615A] font-body mt-0.5">
            System notifications, package expiry reminders, and new enquiry alerts.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="px-3.5 py-1.5 text-xs font-mono font-semibold bg-[#F7F5EF] border border-[#0A0A0A]/14 hover:bg-[#0A0A0A] hover:text-[#F7F5EF] text-[#111111] rounded-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCheck className="w-4 h-4 text-[#8E722A]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notifications..."
        filterOptions={['All', 'Unread', 'Package Alerts', 'Enquiries', 'Payments']}
        selectedFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
      />

      {/* Notification List */}
      <div className="space-y-3">
        {paginatedNotifications.length === 0 ? (
          <AdminCard className="p-8 text-center text-xs font-mono text-[#66615A]">
            No notifications found matching your filter criteria.
          </AdminCard>
        ) : (
          paginatedNotifications.map((n) => (
            <AdminCard
              key={n.id}
              className={`p-4 transition-colors ${
                !n.read ? 'bg-white border-l-4 border-l-[#8E722A]' : 'bg-[#F7F5EF]/40 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/08 shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-[#111111]">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#8E722A] inline-block" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#66615A]">
                      <Clock className="w-3 h-3" />
                      <span>{n.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#66615A] font-body">{n.message}</p>

                  <div className="flex items-center justify-between pt-2">
                    {n.link && (
                      <button
                        onClick={() => {
                          handleMarkRead(n.id);
                          navigate(n.link);
                        }}
                        className="text-[11px] font-mono font-semibold text-[#8E722A] hover:text-[#111111] flex items-center gap-1 no-underline"
                      >
                        <span>View Action</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-[10px] font-mono text-[#66615A] hover:text-[#111111] ml-auto"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </AdminCard>
          ))
        )}

        <AdminCard noPadding>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNotifications.length}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setPageSize}
          />
        </AdminCard>
      </div>
    </div>
  );
};
