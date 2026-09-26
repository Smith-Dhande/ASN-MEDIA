import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

const AdminDataContext = createContext(null);

export const AdminDataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('asn_admin_mock_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse admin mock data from localStorage:', e);
      }
    }
    return mockData;
  });

  // Mock Authentication State (Phase 1 Frontend Structure)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('asn_admin_auth') === 'true';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState('This Month'); // This Month | Last 30 Days | This Quarter | All Time
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('asn_admin_mock_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('asn_admin_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const loginMock = () => {
    setIsAuthenticated(true);
  };

  const logoutMock = () => {
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const markNotificationAsRead = (id) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  };

  const markAllNotificationsAsRead = () => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const value = {
    ...data,
    rawMockData: data,
    isAuthenticated,
    sidebarCollapsed,
    dateRangeFilter,
    globalSearchQuery,
    isSearchOpen,
    loginMock,
    logoutMock,
    toggleSidebar,
    setSidebarCollapsed,
    setDateRangeFilter,
    setGlobalSearchQuery,
    setIsSearchOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
