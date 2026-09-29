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

  // Helper to recompute dashboard metrics dynamically
  const computeMetrics = (currentData) => {
    const clients = currentData.clients || [];
    const enquiries = currentData.enquiries || [];
    const projects = currentData.projects || [];
    const tasks = currentData.tasks || [];
    const payments = currentData.payments || [];
    const scanners = currentData.reviewScanners || [];

    return {
      ...currentData.dashboardMetrics,
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.status === 'Active').length,
      pendingClients: clients.filter((c) => c.status === 'Pending').length,
      completedClients: clients.filter((c) => c.status === 'Completed').length,
      newEnquiries: enquiries.filter((e) => e.status === 'New').length,
      activeProjects: projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length,
      pendingTasks: tasks.filter((t) => t.status !== 'Completed').length,
      totalPaymentCollected: payments.filter((p) => p.status === 'Paid').reduce((acc, p) => acc + (Number(p.amount) || 0), 0),
      outstandingPayments: payments.filter((p) => p.status === 'Overdue' || p.status === 'Pending').reduce((acc, p) => acc + (Number(p.amount) || 0), 0),
      activeReviewScanners: scanners.filter((s) => s.status === 'Active').length,
    };
  };

  // CLIENT HANDLERS
  const addClient = (newClient) => {
    const generatedId = newClient.id || `cli_${Date.now()}`;
    setData((prev) => {
      const clientObj = {
        id: generatedId,
        name: newClient.name,
        contactName: newClient.contactName || newClient.name,
        email: newClient.email,
        phone: newClient.phone || '+91 98765 00000',
        company: newClient.company || newClient.name,
        status: newClient.status || 'Active',
        packageAssigned: newClient.packageAssigned || 'Social Media Retainer (Tier A)',
        monthlyRetainer: Number(newClient.monthlyRetainer) || 4500,
        startDate: newClient.startDate || new Date().toISOString().split('T')[0],
        expiryDate: newClient.expiryDate || '2027-03-31',
        assignedStaff: newClient.assignedStaff || ['Sarah Jenkins'],
        activeProjectsCount: 1,
        pendingTasksCount: 0,
        totalPaid: Number(newClient.monthlyRetainer) || 4500,
        outstandingDue: 0,
        reviewScannerId: null,
        internalNotes: newClient.internalNotes || [],
        joiningDate: newClient.startDate || new Date().toISOString().split('T')[0],
        accountManager: newClient.accountManager || 'Sarah Jenkins',
        website: newClient.website || 'https://asnmedia.in',
        socialLinks: newClient.socialLinks || { instagram: '@client', linkedin: 'company/client' },
        activityHistory: [
          { id: `act_${Date.now()}`, action: 'Client Profile Onboarded', timestamp: new Date().toLocaleString(), actor: 'System' }
        ]
      };
      const updatedClients = [clientObj, ...prev.clients];
      const updated = { ...prev, clients: updatedClients };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
    return generatedId;
  };

  const updateClient = (id, updatedFields) => {
    setData((prev) => {
      const updatedClients = prev.clients.map((c) =>
        c.id === id ? { ...c, ...updatedFields } : c
      );
      const updated = { ...prev, clients: updatedClients };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const archiveClient = (id) => {
    updateClient(id, { status: 'Archived' });
  };

  const deleteClient = (id) => {
    setData((prev) => {
      const updatedClients = prev.clients.filter((c) => c.id !== id);
      const updated = { ...prev, clients: updatedClients };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // ENQUIRY & FOLLOW-UP HANDLERS
  const addEnquiry = (enquiry) => {
    setData((prev) => {
      const enqObj = {
        id: `enq_${Date.now()}`,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone || '+91 98000 11122',
        company: enquiry.company || 'Direct Inquiry',
        serviceRequested: enquiry.serviceRequested || 'Social Media Management',
        budgetTier: enquiry.budgetTier || '$5,000 - $10,000',
        timeline: enquiry.timeline || 'Within 1 Month',
        description: enquiry.description || '',
        status: 'New',
        dateSubmitted: new Date().toISOString().replace('T', ' ').slice(0, 16),
        assignedTo: enquiry.assignedTo || 'Sarah Jenkins',
        notes: enquiry.notes || ['Initial inquiry submitted.'],
        followUps: [],
      };
      const updatedEnquiries = [enqObj, ...prev.enquiries];
      const updated = { ...prev, enquiries: updatedEnquiries };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const updateEnquiry = (id, updatedFields) => {
    setData((prev) => {
      const updatedEnquiries = prev.enquiries.map((e) =>
        e.id === id ? { ...e, ...updatedFields } : e
      );
      const updated = { ...prev, enquiries: updatedEnquiries };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const addFollowUpToEnquiry = (enquiryId, followUpItem) => {
    setData((prev) => {
      const updatedEnquiries = prev.enquiries.map((e) => {
        if (e.id === enquiryId) {
          const followUps = e.followUps || [];
          const newFollowUp = {
            id: `flw_${Date.now()}`,
            date: followUpItem.date || new Date().toISOString().split('T')[0],
            staff: followUpItem.staff || 'Sarah Jenkins',
            notes: followUpItem.notes || '',
            outcome: followUpItem.outcome || 'Pending',
            completed: Boolean(followUpItem.completed),
          };
          return { ...e, followUps: [newFollowUp, ...followUps], status: e.status === 'New' ? 'In Contact' : e.status };
        }
        return e;
      });
      const updated = { ...prev, enquiries: updatedEnquiries };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const convertEnquiryToClient = (enquiryId, clientData) => {
    const newId = `cli_${Date.now()}`;
    // 1. Mark enquiry as Converted
    updateEnquiry(enquiryId, { status: 'Converted' });

    // 2. Create corresponding Client
    addClient({
      id: newId,
      name: clientData.name,
      contactName: clientData.contactName || clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      company: clientData.company,
      status: 'Active',
      packageAssigned: clientData.packageAssigned || 'Social Media Retainer (Tier A)',
      monthlyRetainer: Number(clientData.monthlyRetainer) || 4500,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-03-31',
      assignedStaff: clientData.assignedStaff || ['Sarah Jenkins'],
    });

    return newId;
  };

  // PACKAGE HANDLERS
  const addPackage = (newPkg) => {
    setData((prev) => {
      const pkgObj = {
        id: `pkg_${Date.now()}`,
        name: newPkg.name,
        type: newPkg.type || 'Monthly Retainer',
        monthlyFee: Number(newPkg.monthlyFee) || 3500,
        deliverablesCount: Number(newPkg.deliverablesCount) || 10,
        description: newPkg.description || '',
        activeSubscribers: 0,
        includedServices: newPkg.includedServices || ['Social Media Management'],
        status: newPkg.status || 'Active',
        publicVisibility: newPkg.publicVisibility !== false,
      };
      const updatedPackages = [pkgObj, ...prev.packages];
      const updated = { ...prev, packages: updatedPackages };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const updatePackage = (id, updatedFields) => {
    setData((prev) => {
      const updatedPackages = prev.packages.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p
      );
      const updated = { ...prev, packages: updatedPackages };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deletePackage = (id) => {
    setData((prev) => {
      const updatedPackages = prev.packages.filter((p) => p.id !== id);
      const updated = { ...prev, packages: updatedPackages };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // SERVICE HANDLERS
  const addService = (newSvc) => {
    setData((prev) => {
      const svcObj = {
        id: `svc_${Date.now()}`,
        name: newSvc.name,
        code: newSvc.code || newSvc.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
        status: newSvc.status || 'Active',
        category: newSvc.category || 'Digital Media',
        description: newSvc.description || '',
        deliverables: newSvc.deliverables || [],
        internalInstructions: newSvc.internalInstructions || '',
        turnaroundTime: newSvc.turnaroundTime || '5 business days',
      };
      const updatedServices = [svcObj, ...prev.services];
      const updated = { ...prev, services: updatedServices };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const updateService = (id, updatedFields) => {
    setData((prev) => {
      const updatedServices = prev.services.map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s
      );
      const updated = { ...prev, services: updatedServices };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deleteService = (id) => {
    setData((prev) => {
      const updatedServices = prev.services.filter((s) => s.id !== id);
      const updated = { ...prev, services: updatedServices };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // PROJECT HANDLERS
  const addProject = (newProj) => {
    setData((prev) => {
      const projObj = {
        id: `prj_${Date.now()}`,
        title: newProj.title,
        clientName: newProj.clientName,
        clientId: newProj.clientId || 'cli_101',
        serviceName: newProj.serviceName || 'Social Media Management',
        description: newProj.description || '',
        status: newProj.status || 'Planning',
        progressPct: Number(newProj.progressPct) || 0,
        startDate: newProj.startDate || new Date().toISOString().split('T')[0],
        dueDate: newProj.dueDate || '2026-10-31',
        priority: newProj.priority || 'Medium',
        leadStaff: newProj.leadStaff || 'Sarah Jenkins',
        deliverables: newProj.deliverables || ['Project Deliverable Pack'],
        milestones: newProj.milestones || [
          { id: 'm1', title: 'Initial Strategy & Concept', completed: false, dueDate: newProj.startDate || '2026-10-05' },
          { id: 'm2', title: 'Content Production & Assets', completed: false, dueDate: newProj.dueDate || '2026-10-25' }
        ],
        files: [],
        activity: [{ id: `pa_${Date.now()}`, title: 'Project Created', timestamp: new Date().toLocaleString() }]
      };
      const updatedProjects = [projObj, ...prev.projects];
      const updated = { ...prev, projects: updatedProjects };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const updateProject = (id, updatedFields) => {
    setData((prev) => {
      const updatedProjects = prev.projects.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p
      );
      const updated = { ...prev, projects: updatedProjects };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deleteProject = (id) => {
    setData((prev) => {
      const updatedProjects = prev.projects.filter((p) => p.id !== id);
      const updated = { ...prev, projects: updatedProjects };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // TASK HANDLERS
  const addTask = (newTask) => {
    setData((prev) => {
      const taskObj = {
        id: `tsk_${Date.now()}`,
        title: newTask.title,
        projectId: newTask.projectId || 'prj_401',
        clientName: newTask.clientName || 'Aura Luxury Beauty',
        assignee: newTask.assignee || 'Sarah Jenkins',
        status: newTask.status || 'To Do',
        priority: newTask.priority || 'Medium',
        dueDate: newTask.dueDate || '2026-10-15',
        expectedCompletion: newTask.expectedCompletion || '2026-10-15',
        comments: newTask.comments || [],
        history: [{ id: `th_${Date.now()}`, text: 'Task initialized', timestamp: new Date().toLocaleString() }]
      };
      const updatedTasks = [taskObj, ...prev.tasks];
      const updated = { ...prev, tasks: updatedTasks };

      // Recalculate linked project progress if applicable
      if (newTask.projectId) {
        const projTasks = updatedTasks.filter((t) => t.projectId === newTask.projectId);
        const completedCount = projTasks.filter((t) => t.status === 'Completed').length;
        const progressPct = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;
        updated.projects = updated.projects.map((p) =>
          p.id === newTask.projectId ? { ...p, progressPct } : p
        );
      }

      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const updateTask = (id, updatedFields) => {
    setData((prev) => {
      const updatedTasks = prev.tasks.map((t) =>
        t.id === id ? { ...t, ...updatedFields } : t
      );
      const updated = { ...prev, tasks: updatedTasks };

      // Recalculate project progress for target task
      const targetTask = updatedTasks.find((t) => t.id === id);
      if (targetTask && targetTask.projectId) {
        const projTasks = updatedTasks.filter((t) => t.projectId === targetTask.projectId);
        const completedCount = projTasks.filter((t) => t.status === 'Completed').length;
        const progressPct = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;
        updated.projects = updated.projects.map((p) =>
          p.id === targetTask.projectId ? { ...p, progressPct } : p
        );
      }

      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deleteTask = (id) => {
    setData((prev) => {
      const updatedTasks = prev.tasks.filter((t) => t.id !== id);
      const updated = { ...prev, tasks: updatedTasks };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // PAYMENT HANDLERS
  const addPayment = (newPay) => {
    setData((prev) => {
      const payObj = {
        id: `pay_${Date.now()}`,
        invoiceNumber: newPay.invoiceNumber || `INV-2026-09${prev.payments.length + 10}`,
        clientName: newPay.clientName,
        clientId: newPay.clientId || 'cli_101',
        packageName: newPay.packageName || 'Social Media Retainer (Tier A)',
        amount: Number(newPay.amount) || 4500,
        amountReceived: Number(newPay.amountReceived) || (newPay.status === 'Paid' ? Number(newPay.amount) || 4500 : 0),
        method: newPay.method || 'Bank Transfer',
        date: newPay.date || new Date().toISOString().split('T')[0],
        dueDate: newPay.dueDate || '2026-10-15',
        status: newPay.status || 'Paid',
        notes: newPay.notes || 'Recorded invoice payment.',
        installments: newPay.installments || [
          { number: 1, amount: Number(newPay.amount) || 4500, dueDate: newPay.dueDate || '2026-10-15', status: newPay.status || 'Paid' }
        ],
      };
      const updatedPayments = [payObj, ...prev.payments];
      const updated = { ...prev, payments: updatedPayments };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const updatePayment = (id, updatedFields) => {
    setData((prev) => {
      const updatedPayments = prev.payments.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p
      );
      const updated = { ...prev, payments: updatedPayments };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deletePayment = (id) => {
    setData((prev) => {
      const updatedPayments = prev.payments.filter((p) => p.id !== id);
      const updated = { ...prev, payments: updatedPayments };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
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

  // SCANNER HANDLERS
  const addScanner = (newScn) => {
    const slug = newScn.slug || (newScn.name || newScn.placeName || 'scanner').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
    const scnObj = {
      id: newScn.id || `scn_${Date.now()}`,
      clientName: newScn.clientName,
      name: newScn.name || newScn.placeName || `${newScn.clientName} Review`,
      placeName: newScn.placeName || newScn.name || `${newScn.clientName} Review`,
      placeId: newScn.placeId || `ChIJN_${Date.now()}`,
      slug,
      googleUrl: newScn.googleUrl || newScn.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${newScn.placeId || 'ChIJN'}`,
      googleReviewUrl: newScn.googleReviewUrl || newScn.googleUrl || `https://search.google.com/local/writereview?placeid=${newScn.placeId || 'ChIJN'}`,
      ratingRequired: newScn.ratingRequired !== false,
      questions: newScn.questions || [
        {
          id: 'q1',
          question: 'What did you like most?',
          type: 'dropdown',
          required: true,
          options: [
            { id: 'o1', label: 'Food & Quality', value: 'Food & Quality', isActive: true },
            { id: 'o2', label: 'Customer Service', value: 'Customer Service', isActive: true },
            { id: 'o3', label: 'Ambience & Vibe', value: 'Ambience & Vibe', isActive: true },
            { id: 'o4', label: 'Staff Attention', value: 'Staff Attention', isActive: true }
          ]
        },
        {
          id: 'q2',
          question: 'What stood out to you?',
          type: 'dropdown',
          required: true,
          options: [
            { id: 'o5', label: 'Friendly Staff', value: 'Friendly Staff', isActive: true },
            { id: 'o6', label: 'Quick Service', value: 'Quick Service', isActive: true },
            { id: 'o7', label: 'Great Presentation', value: 'Great Presentation', isActive: true },
            { id: 'o8', label: 'Clean Environment', value: 'Clean Environment', isActive: true }
          ]
        },
        {
          id: 'q3',
          question: 'How was your overall experience?',
          type: 'dropdown',
          required: true,
          options: [
            { id: 'o9', label: 'Excellent', value: 'Excellent', isActive: true },
            { id: 'o10', label: 'Very Good', value: 'Very Good', isActive: true },
            { id: 'o11', label: 'Good', value: 'Good', isActive: true },
            { id: 'o12', label: 'Satisfactory', value: 'Satisfactory', isActive: true }
          ]
        }
      ],
      aiSettings: newScn.aiSettings || { tone: 'Friendly & Professional', length: 'Medium' },
      avgRating: newScn.avgRating || 4.9,
      totalReviewsScraped: newScn.totalReviewsScraped || 0,
      status: newScn.status || 'Active',
      metrics: newScn.metrics || { scans: 42, formStarted: 35, formSubmitted: 30, reviewsGenerated: 28, googleClicked: 24 }
    };

    setData((prev) => {
      const updatedScanners = [scnObj, ...(prev.reviewScanners || [])];
      const updated = { ...prev, reviewScanners: updatedScanners };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });

    // Async POST to backend API
    fetch('http://localhost:5000/api/review-scanners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scnObj)
    }).catch((e) => console.warn('API sync warning:', e.message));

    return scnObj;
  };

  const updateScanner = (id, updatedFields) => {
    setData((prev) => {
      const updatedScanners = (prev.reviewScanners || []).map((s) =>
        s.id === id || s._id === id ? { ...s, ...updatedFields } : s
      );
      const updated = { ...prev, reviewScanners: updatedScanners };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });

    // Async PATCH to backend API
    fetch(`http://localhost:5000/api/review-scanners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    }).catch((e) => console.warn('API sync warning:', e.message));
  };

  const deleteScanner = (id) => {
    setData((prev) => {
      const updatedScanners = (prev.reviewScanners || []).filter((s) => s.id !== id && s._id !== id);
      const updated = { ...prev, reviewScanners: updatedScanners };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });

    // Async DELETE to backend API
    fetch(`http://localhost:5000/api/review-scanners/${id}`, {
      method: 'DELETE'
    }).catch((e) => console.warn('API sync warning:', e.message));
  };

  // STAFF & PERMISSIONS HANDLERS
  const addStaff = (newStaff) => {
    setData((prev) => {
      const staffObj = {
        id: `stf_${Date.now()}`,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role || 'Content Strategist',
        avatar: newStaff.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
        activeTasksCount: 0,
        status: newStaff.status || 'Active',
      };
      const updatedStaff = [staffObj, ...(prev.staff || [])];
      return { ...prev, staff: updatedStaff };
    });
  };

  const updateStaff = (id, updatedFields) => {
    setData((prev) => {
      const updatedStaff = (prev.staff || []).map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s
      );
      return { ...prev, staff: updatedStaff };
    });
  };

  const deleteStaff = (id) => {
    setData((prev) => {
      const updatedStaff = (prev.staff || []).filter((s) => s.id !== id);
      return { ...prev, staff: updatedStaff };
    });
  };

  const addActivityLog = (logItem) => {
    setData((prev) => {
      const newLog = {
        id: `log_${Date.now()}`,
        actor: logItem.actor || 'Sarah Jenkins',
        action: logItem.action || 'System Update',
        entity: logItem.entity || 'General Record',
        category: logItem.category || 'General',
        timestamp: new Date().toLocaleString(),
        metadata: logItem.metadata || null,
        beforeState: logItem.beforeState || null,
        afterState: logItem.afterState || null,
      };
      return { ...prev, activityLogs: [newLog, ...(prev.activityLogs || [])] };
    });
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
    // Context CRUD Methods
    addClient,
    updateClient,
    archiveClient,
    deleteClient,
    addEnquiry,
    updateEnquiry,
    addFollowUpToEnquiry,
    convertEnquiryToClient,
    addPackage,
    updatePackage,
    deletePackage,
    addService,
    updateService,
    deleteService,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addPayment,
    updatePayment,
    deletePayment,
    addScanner,
    updateScanner,
    deleteScanner,
    addStaff,
    updateStaff,
    deleteStaff,
    addActivityLog,
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

