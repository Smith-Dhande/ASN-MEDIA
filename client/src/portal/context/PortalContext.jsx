import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAdminData } from '../../admin/context/AdminDataContext';

const PortalContext = createContext(null);

export const PortalProvider = ({ children }) => {
  const {
    clients,
    projects,
    tasks,
    payments,
    enquiries,
    reviewScanners,
    notifications,
    updateClient,
    addEnquiry,
    updatePayment,
  } = useAdminData();

  // Active mock client ID for portal demonstration
  const [activeClientId, setActiveClientId] = useState(() => {
    return clients[0]?.id || 'cli_101';
  });

  // Currently logged-in client object
  const currentClient = useMemo(() => {
    return clients.find((c) => String(c.id) === String(activeClientId)) || clients[0] || null;
  }, [clients, activeClientId]);

  // Filtered client-specific datasets
  const clientProjects = useMemo(() => {
    if (!currentClient) return [];
    return projects.filter(
      (p) => p.clientName === currentClient.name || String(p.clientId) === String(currentClient.id)
    );
  }, [projects, currentClient]);

  const clientTasks = useMemo(() => {
    if (!currentClient) return [];
    // Only client-visible tasks (exclude internal operational tasks)
    return tasks.filter((t) => t.clientName === currentClient.name);
  }, [tasks, currentClient]);

  const clientPayments = useMemo(() => {
    if (!currentClient) return [];
    return payments.filter(
      (p) => p.clientName === currentClient.name || String(p.clientId) === String(currentClient.id)
    );
  }, [payments, currentClient]);

  const clientEnquiries = useMemo(() => {
    if (!currentClient) return [];
    return enquiries.filter(
      (e) => e.company === currentClient.company || e.email === currentClient.email || e.name === currentClient.contactName
    );
  }, [enquiries, currentClient]);

  const clientNotifications = useMemo(() => {
    if (!currentClient) return [];
    // Filter notifications relevant to client
    return (notifications || []).map((n) => ({
      ...n,
      title: n.title?.replace('Aura Luxury Beauty', currentClient.name) || n.title,
    }));
  }, [notifications, currentClient]);

  const switchClient = (clientId) => {
    setActiveClientId(clientId);
  };

  const handleUpdateProfile = (updatedFields) => {
    if (!currentClient) return;
    updateClient(currentClient.id, updatedFields);
  };

  const handleSubmitEnquiry = (enquiryData) => {
    if (!currentClient) return;
    addEnquiry({
      name: currentClient.contactName,
      email: currentClient.email,
      phone: currentClient.phone,
      company: currentClient.company,
      serviceRequested: enquiryData.serviceRequested || 'General Support',
      budgetTier: enquiryData.budgetTier || 'N/A',
      timeline: enquiryData.timeline || 'Immediate',
      description: enquiryData.description,
      notes: [`Submitted via Client Portal on ${new Date().toLocaleDateString()}`],
    });
  };

  return (
    <PortalContext.Provider
      value={{
        clients,
        currentClient,
        clientProjects,
        clientTasks,
        clientPayments,
        clientEnquiries,
        clientNotifications,
        activeClientId,
        switchClient,
        updateProfile: handleUpdateProfile,
        submitEnquiry: handleSubmitEnquiry,
        updatePayment,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortalClient = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortalClient must be used within a PortalProvider');
  }
  return context;
};
