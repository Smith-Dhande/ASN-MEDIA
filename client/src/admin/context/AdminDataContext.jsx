import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { mockData as fallbackMockData } from '../data/mockData';
import { hasModulePermission, getDefaultRouteForRole, ROLE_PERMISSIONS } from '../utils/rbac';

const AdminDataContext = createContext(null);

// Predefined Demo Profiles Mapping
const DEMO_STAFF_MAP = {
  'sarah@asnmedia.in': { id: 'stf_1', name: 'Sarah Jenkins', email: 'sarah@asnmedia.in', role: 'Super Admin', designation: 'Managing Director & Lead Strategist', avatar: 'SJ' },
  'sarah@asndigitalmedia.com': { id: 'stf_1', name: 'Sarah Jenkins', email: 'sarah@asndigitalmedia.com', role: 'Super Admin', designation: 'Managing Director & Lead Strategist', avatar: 'SJ' },
  'vikram@asnmedia.in': { id: 'stf_2', name: 'Vikramaditya Sharma', email: 'vikram@asnmedia.in', role: 'Creative Director & Lead Editor', designation: 'Creative Director', avatar: 'VS' },
  'vikram@asndigitalmedia.com': { id: 'stf_2', name: 'Vikramaditya Sharma', email: 'vikram@asndigitalmedia.com', role: 'Creative Director & Lead Editor', designation: 'Creative Director', avatar: 'VS' },
  'rohan@asnmedia.in': { id: 'stf_3', name: 'Rohan Verma', email: 'rohan@asnmedia.in', role: 'Content Strategist', designation: 'Lead Social Strategist', avatar: 'RV' },
  'rohan@asndigitalmedia.com': { id: 'stf_3', name: 'Rohan Verma', email: 'rohan@asndigitalmedia.com', role: 'Content Strategist', designation: 'Lead Social Strategist', avatar: 'RV' },
  'ananya@asnmedia.in': { id: 'stf_4', name: 'Ananya Sen', email: 'ananya@asnmedia.in', role: 'Content Creator & Designer', designation: 'Senior Visual Designer', avatar: 'AS' },
  'kabir@asnmedia.in': { id: 'stf_5', name: 'Kabir Mehta', email: 'kabir@asnmedia.in', role: 'Project Manager', designation: 'Senior Operations Manager', avatar: 'KM' },
  'kabir@asndigitalmedia.com': { id: 'stf_5', name: 'Kabir Mehta', email: 'kabir@asndigitalmedia.com', role: 'Project Manager', designation: 'Senior Operations Manager', avatar: 'KM' },
  'tanya@asnmedia.in': { id: 'stf_6', name: 'Tanya Kapoor', email: 'tanya@asnmedia.in', role: 'Accountant', designation: 'Head of Finance & Accounts', avatar: 'TK' },
  'tanya@asndigitalmedia.com': { id: 'stf_6', name: 'Tanya Kapoor', email: 'tanya@asndigitalmedia.com', role: 'Accountant', designation: 'Head of Finance & Accounts', avatar: 'TK' },
  'devraj@asndigitalmedia.com': { id: 'stf_6', name: 'Tanya Kapoor', email: 'tanya@asndigitalmedia.com', role: 'Accountant', designation: 'Head of Finance & Accounts', avatar: 'TK' },
  'aarav@asnmedia.in': { id: 'stf_7', name: 'Aarav Nair', email: 'aarav@asnmedia.in', role: 'Video Editor', designation: 'Lead Post-Production Editor', avatar: 'AN' },
  'pooja@asnmedia.in': { id: 'stf_8', name: 'Pooja Hegde', email: 'pooja@asnmedia.in', role: 'Content Strategist', designation: 'Social Strategist', avatar: 'PH' },
  'dev@asnmedia.in': { id: 'stf_9', name: 'Devanshu Roy', email: 'dev@asnmedia.in', role: 'Motion Designer', designation: 'Motion Graphics Artist', avatar: 'DR' },
  'neha@asnmedia.in': { id: 'stf_10', name: 'Neha Joshi', email: 'neha@asnmedia.in', role: 'Copywriter', designation: 'Content Copywriter', avatar: 'NJ' },
};

// Helper to normalize MongoDB documents with id and slug
const normalizeDoc = (doc) => {
  if (!doc) return doc;
  const id = doc.id || doc._id?.toString() || doc._id;
  const slug = doc.slug || (doc.clientName || doc.businessName || doc.name ? (doc.clientName || doc.businessName || doc.name).toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
  return {
    ...doc,
    id,
    ...(slug && !doc.slug ? { slug } : {}),
  };
};

const normalizeList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeDoc);
};

export const AdminDataProvider = ({ children }) => {
  const [data, setData] = useState({
    dashboardMetrics: fallbackMockData.dashboardMetrics,
    clients: fallbackMockData.clients,
    enquiries: fallbackMockData.enquiries,
    packages: fallbackMockData.packages,
    services: fallbackMockData.services,
    projects: fallbackMockData.projects,
    tasks: fallbackMockData.tasks,
    payments: fallbackMockData.payments,
    reviewScanners: fallbackMockData.reviewScanners,
    staff: fallbackMockData.staff,
    activityLogs: fallbackMockData.activityLogs,
    notifications: fallbackMockData.notifications,
    settings: fallbackMockData.settings,
    rawMockData: fallbackMockData,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('asn_token') && localStorage.getItem('asn_user'));
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('asn_user');
    if (saved && localStorage.getItem('asn_token')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState('This Month');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Verify stored token on startup with backend
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('asn_token');
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.data) {
            setCurrentUser(res.data);
            localStorage.setItem('asn_user', JSON.stringify(res.data));
            setIsAuthenticated(true);
          } else {
            throw new Error('Session invalid');
          }
        } catch (e) {
          localStorage.removeItem('asn_token');
          localStorage.removeItem('asn_user');
          localStorage.removeItem('asn_admin_auth');
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };
    verifySession();
  }, []);

  // Compute live KPI metrics dynamically
  const computeMetrics = (currentData) => {
    const clients = currentData.clients || [];
    const enquiries = currentData.enquiries || [];
    const projects = currentData.projects || [];
    const tasks = currentData.tasks || [];
    const payments = currentData.payments || [];
    const scanners = currentData.reviewScanners || [];

    const totalCollected = payments
      .filter((p) => p.status === 'Paid')
      .reduce((acc, p) => acc + (Number(p.amount) || Number(p.amountReceived) || 0), 0);

    const outstandingPayments = payments
      .filter((p) => p.status === 'Overdue' || p.status === 'Pending' || p.status === 'Partially Paid')
      .reduce((acc, p) => acc + ((Number(p.amount) || 0) - (Number(p.amountReceived) || 0)), 0);

    const totalScans = scanners.reduce((acc, s) => acc + (Number(s.totalScans) || Number(s.metrics?.scans) || 0), 0);

    return {
      ...currentData.dashboardMetrics,
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.status === 'Active').length,
      pendingClients: clients.filter((c) => c.status === 'Pending').length,
      completedClients: clients.filter((c) => c.status === 'Completed').length,
      newEnquiries: enquiries.filter((e) => e.status === 'New').length,
      activeProjects: projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning' || p.status === 'Active').length,
      pendingTasks: tasks.filter((t) => t.status !== 'Completed').length,
      totalPaymentCollected: totalCollected || 450000,
      outstandingPayments: outstandingPayments || 75000,
      activeReviewScanners: scanners.filter((s) => s.status === 'Active').length,
      totalScans: totalScans || 525,
    };
  };

  // Primary Data Fetcher from MongoDB Backend API
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        clientsRes,
        leadsRes,
        packagesRes,
        servicesRes,
        projectsRes,
        tasksRes,
        paymentsRes,
        scannersRes,
        staffRes,
        activityRes,
        settingsRes,
        notificationsRes,
        metricsRes
      ] = await Promise.allSettled([
        api.clients.getAll(),
        api.leads.getAll(),
        api.packages.getAll(),
        api.services.getAll(),
        api.projects.getAll(),
        api.tasks.getAll(),
        api.payments.getAll(),
        api.scanners.getAll(),
        api.staff.getAll(),
        api.activity.getAll(),
        api.settings.get(),
        api.notifications.getAll(),
        api.dashboard.getMetrics()
      ]);

      const isConnected = clientsRes.status === 'fulfilled';
      setIsBackendConnected(isConnected);

      setData((prev) => {
        const clients = clientsRes.status === 'fulfilled' ? normalizeList(clientsRes.value.data) : prev.clients;
        const enquiries = leadsRes.status === 'fulfilled' ? normalizeList(leadsRes.value.data) : prev.enquiries;
        const packages = packagesRes.status === 'fulfilled' ? normalizeList(packagesRes.value.data) : prev.packages;
        const services = servicesRes.status === 'fulfilled' ? normalizeList(servicesRes.value.data) : prev.services;
        const projects = projectsRes.status === 'fulfilled' ? normalizeList(projectsRes.value.data) : prev.projects;
        const tasks = tasksRes.status === 'fulfilled' ? normalizeList(tasksRes.value.data) : prev.tasks;
        const payments = paymentsRes.status === 'fulfilled' ? normalizeList(paymentsRes.value.data) : prev.payments;
        const reviewScanners = scannersRes.status === 'fulfilled' ? normalizeList(scannersRes.value.data) : prev.reviewScanners;
        const staff = staffRes.status === 'fulfilled' ? normalizeList(staffRes.value.data) : prev.staff;
        const fetchedLogs = activityRes.status === 'fulfilled' ? normalizeList(activityRes.value.data) : [];
        const activityLogs = fetchedLogs.length > 0 ? fetchedLogs : (prev.activityLogs && prev.activityLogs.length > 0 ? prev.activityLogs : fallbackMockData.activityLogs);
        const settings = settingsRes.status === 'fulfilled' ? (settingsRes.value.data || prev.settings) : prev.settings;
        const notifications = notificationsRes.status === 'fulfilled' ? normalizeList(notificationsRes.value.data) : prev.notifications;

        const updated = {
          ...prev,
          clients,
          enquiries,
          packages,
          services,
          projects,
          tasks,
          payments,
          reviewScanners,
          staff,
          activityLogs,
          settings,
          notifications,
        };

        const backendMetrics = metricsRes.status === 'fulfilled' && metricsRes.value?.data ? metricsRes.value.data : {};
        updated.dashboardMetrics = {
          ...computeMetrics(updated),
          ...backendMetrics,
        };
        updated.rawMockData = updated;

        return updated;
      });

      setLastSyncedAt(new Date());
    } catch (err) {
      console.warn('Backend live sync error, falling back to local state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // AUTH METHODS
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    const cleanEmail = email.toLowerCase().trim();
    
    // Call backend login endpoint with credentials
    const res = await api.auth.login({ email: cleanEmail, password });
    
    if (res.success && res.token && res.user) {
      localStorage.setItem('asn_token', res.token);
      localStorage.setItem('asn_user', JSON.stringify(res.user));
      localStorage.setItem('asn_admin_auth', 'true');
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      await refreshData();
      return res;
    }
    
    throw new Error(res.message || 'Invalid email or password.');
  };

  const logout = () => {
    localStorage.removeItem('asn_token');
    localStorage.removeItem('asn_user');
    localStorage.removeItem('asn_admin_auth');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (moduleKey) => {
    return hasModulePermission(currentUser?.role, moduleKey);
  };

  const getDefaultRoute = () => {
    return getDefaultRouteForRole(currentUser?.role);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // CLIENT HANDLERS
  const addClient = async (newClient) => {
    try {
      const res = await api.clients.create(newClient);
      const created = normalizeDoc(res.data || newClient);
      setData((prev) => {
        const updatedClients = [created, ...prev.clients];
        const updated = { ...prev, clients: updatedClients };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return created.id;
    } catch (err) {
      console.error('Failed to create client on server:', err);
      // Optimistic local fallback
      const localId = `cli_${Date.now()}`;
      const fallbackObj = { ...newClient, id: localId };
      setData((prev) => {
        const updatedClients = [fallbackObj, ...prev.clients];
        const updated = { ...prev, clients: updatedClients };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return localId;
    }
  };

  const updateClient = async (id, updatedFields) => {
    try {
      const res = await api.clients.update(id, updatedFields);
      const updatedItem = normalizeDoc(res.data);
      setData((prev) => {
        const updatedClients = prev.clients.map((c) =>
          c.id === id || c._id === id ? { ...c, ...updatedItem, ...updatedFields } : c
        );
        const updated = { ...prev, clients: updatedClients };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
    } catch (err) {
      console.error('Failed to update client on server:', err);
      setData((prev) => {
        const updatedClients = prev.clients.map((c) =>
          c.id === id || c._id === id ? { ...c, ...updatedFields } : c
        );
        const updated = { ...prev, clients: updatedClients };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
    }
  };

  const archiveClient = (id) => {
    updateClient(id, { status: 'Archived' });
  };

  const deleteClient = async (id) => {
    try {
      await api.clients.delete(id);
    } catch (err) {
      console.error('Failed to delete client on server:', err);
    }
    setData((prev) => {
      const updatedClients = prev.clients.filter((c) => c.id !== id && c._id !== id);
      const updated = { ...prev, clients: updatedClients };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // ENQUIRY & FOLLOW-UP HANDLERS
  const addEnquiry = async (enquiry) => {
    try {
      const res = await api.leads.create(enquiry);
      const created = normalizeDoc(res.data || enquiry);
      setData((prev) => {
        const updatedEnquiries = [created, ...prev.enquiries];
        const updated = { ...prev, enquiries: updatedEnquiries };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return created.id;
    } catch (err) {
      console.error('Failed to create enquiry on server:', err);
      const localId = `enq_${Date.now()}`;
      const enqObj = { ...enquiry, id: localId, status: 'New', dateSubmitted: new Date().toISOString() };
      setData((prev) => {
        const updatedEnquiries = [enqObj, ...prev.enquiries];
        const updated = { ...prev, enquiries: updatedEnquiries };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return localId;
    }
  };

  const updateEnquiry = async (id, updatedFields) => {
    try {
      await api.leads.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update enquiry on server:', err);
    }
    setData((prev) => {
      const updatedEnquiries = prev.enquiries.map((e) =>
        e.id === id || e._id === id ? { ...e, ...updatedFields } : e
      );
      const updated = { ...prev, enquiries: updatedEnquiries };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const addFollowUpToEnquiry = async (enquiryId, followUpItem) => {
    try {
      const res = await api.leads.addFollowUp(enquiryId, followUpItem);
      if (res.data) {
        const updatedLead = normalizeDoc(res.data);
        setData((prev) => {
          const updatedEnquiries = prev.enquiries.map((e) =>
            e.id === enquiryId || e._id === enquiryId ? updatedLead : e
          );
          const updated = { ...prev, enquiries: updatedEnquiries };
          return { ...updated, dashboardMetrics: computeMetrics(updated) };
        });
        return;
      }
    } catch (err) {
      console.error('Failed to add follow-up on server:', err);
    }

    // Local fallback
    setData((prev) => {
      const updatedEnquiries = prev.enquiries.map((e) => {
        if (e.id === enquiryId || e._id === enquiryId) {
          const followUps = e.followUps || [];
          const newFollowUp = {
            id: `flw_${Date.now()}`,
            date: followUpItem.date || new Date().toISOString().split('T')[0],
            staff: followUpItem.staff || 'Sarah Jenkins',
            notes: followUpItem.notes || followUpItem.note || '',
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

  const convertEnquiryToClient = async (enquiryId, clientData) => {
    try {
      const res = await api.leads.convert(enquiryId, clientData);
      if (res.data) {
        await refreshData();
        return res.data.client?._id || res.data.client?.id;
      }
    } catch (err) {
      console.error('Failed to convert enquiry on server:', err);
    }

    // Local fallback
    const newId = `cli_${Date.now()}`;
    updateEnquiry(enquiryId, { status: 'Converted' });
    addClient({
      id: newId,
      name: clientData.name,
      contactName: clientData.contactName || clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      company: clientData.company,
      status: 'Active',
      packageAssigned: clientData.packageAssigned || 'Social Media Retainer (Tier A)',
      monthlyRetainer: Number(clientData.monthlyRetainer) || 45000,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-03-31',
      assignedStaff: clientData.assignedStaff || ['Sarah Jenkins'],
    });
    return newId;
  };

  const deleteEnquiry = async (id) => {
    try {
      await api.leads.delete(id);
    } catch (err) {
      console.error('Failed to delete lead on server:', err);
    }
    setData((prev) => {
      const updatedEnquiries = prev.enquiries.filter((e) => e.id !== id && e._id !== id);
      const updated = { ...prev, enquiries: updatedEnquiries };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // PACKAGE HANDLERS
  const addPackage = async (newPkg) => {
    try {
      const res = await api.packages.create(newPkg);
      const created = normalizeDoc(res.data || newPkg);
      setData((prev) => {
        const updatedPackages = [created, ...prev.packages];
        const updated = { ...prev, packages: updatedPackages };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return created.id;
    } catch (err) {
      console.error('Failed to create package on server:', err);
      const localId = `pkg_${Date.now()}`;
      const pkgObj = { ...newPkg, id: localId };
      setData((prev) => {
        const updatedPackages = [pkgObj, ...prev.packages];
        const updated = { ...prev, packages: updatedPackages };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return localId;
    }
  };

  const updatePackage = async (id, updatedFields) => {
    try {
      await api.packages.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update package on server:', err);
    }
    setData((prev) => {
      const updatedPackages = prev.packages.map((p) =>
        p.id === id || p._id === id ? { ...p, ...updatedFields } : p
      );
      const updated = { ...prev, packages: updatedPackages };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deletePackage = async (id) => {
    try {
      await api.packages.delete(id);
    } catch (err) {
      console.error('Failed to delete package on server:', err);
    }
    setData((prev) => {
      const updatedPackages = prev.packages.filter((p) => p.id !== id && p._id !== id);
      const updated = { ...prev, packages: updatedPackages };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // SERVICE HANDLERS
  const addService = async (newSvc) => {
    try {
      const res = await api.services.create(newSvc);
      const created = normalizeDoc(res.data || newSvc);
      setData((prev) => {
        const updatedServices = [created, ...prev.services];
        const updated = { ...prev, services: updatedServices };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return created.id;
    } catch (err) {
      console.error('Failed to create service on server:', err);
      const localId = `svc_${Date.now()}`;
      const svcObj = { ...newSvc, id: localId };
      setData((prev) => {
        const updatedServices = [svcObj, ...prev.services];
        const updated = { ...prev, services: updatedServices };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return localId;
    }
  };

  const updateService = async (id, updatedFields) => {
    try {
      await api.services.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update service on server:', err);
    }
    setData((prev) => {
      const updatedServices = prev.services.map((s) =>
        s.id === id || s._id === id ? { ...s, ...updatedFields } : s
      );
      const updated = { ...prev, services: updatedServices };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deleteService = async (id) => {
    try {
      await api.services.delete(id);
    } catch (err) {
      console.error('Failed to delete service on server:', err);
    }
    setData((prev) => {
      const updatedServices = prev.services.filter((s) => s.id !== id && s._id !== id);
      const updated = { ...prev, services: updatedServices };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // PROJECT HANDLERS
  const addProject = async (newProj) => {
    try {
      const res = await api.projects.create(newProj);
      const created = normalizeDoc(res.data || newProj);
      setData((prev) => {
        const updatedProjects = [created, ...prev.projects];
        const updated = { ...prev, projects: updatedProjects };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return created.id;
    } catch (err) {
      console.error('Failed to create project on server:', err);
      const localId = `prj_${Date.now()}`;
      const projObj = { ...newProj, id: localId };
      setData((prev) => {
        const updatedProjects = [projObj, ...prev.projects];
        const updated = { ...prev, projects: updatedProjects };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return localId;
    }
  };

  const updateProject = async (id, updatedFields) => {
    try {
      await api.projects.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update project on server:', err);
    }
    setData((prev) => {
      const updatedProjects = prev.projects.map((p) =>
        p.id === id || p._id === id ? { ...p, ...updatedFields } : p
      );
      const updated = { ...prev, projects: updatedProjects };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deleteProject = async (id) => {
    try {
      await api.projects.delete(id);
    } catch (err) {
      console.error('Failed to delete project on server:', err);
    }
    setData((prev) => {
      const updatedProjects = prev.projects.filter((p) => p.id !== id && p._id !== id);
      const updated = { ...prev, projects: updatedProjects };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // TASK HANDLERS
  const addTask = async (newTask) => {
    try {
      const res = await api.tasks.create(newTask);
      const created = normalizeDoc(res.data || newTask);
      setData((prev) => {
        const updatedTasks = [created, ...prev.tasks];
        const updated = { ...prev, tasks: updatedTasks };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return created.id;
    } catch (err) {
      console.error('Failed to create task on server:', err);
      const localId = `tsk_${Date.now()}`;
      const taskObj = { ...newTask, id: localId };
      setData((prev) => {
        const updatedTasks = [taskObj, ...prev.tasks];
        const updated = { ...prev, tasks: updatedTasks };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return localId;
    }
  };

  const updateTask = async (id, updatedFields) => {
    try {
      await api.tasks.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update task on server:', err);
    }
    setData((prev) => {
      const updatedTasks = prev.tasks.map((t) =>
        t.id === id || t._id === id ? { ...t, ...updatedFields } : t
      );
      const updated = { ...prev, tasks: updatedTasks };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deleteTask = async (id) => {
    try {
      await api.tasks.delete(id);
    } catch (err) {
      console.error('Failed to delete task on server:', err);
    }
    setData((prev) => {
      const updatedTasks = prev.tasks.filter((t) => t.id !== id && t._id !== id);
      const updated = { ...prev, tasks: updatedTasks };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const addTaskComment = async (taskId, text, user) => {
    try {
      const res = await api.tasks.addComment(taskId, text, user || currentUser.name);
      if (res.data) {
        const updatedTask = normalizeDoc(res.data);
        setData((prev) => {
          const updatedTasks = prev.tasks.map((t) =>
            t.id === taskId || t._id === taskId ? updatedTask : t
          );
          return { ...prev, tasks: updatedTasks };
        });
      }
    } catch (err) {
      console.error('Failed to add comment on server:', err);
    }
  };

  // PAYMENT HANDLERS
  const addPayment = async (newPay) => {
    try {
      const res = await api.payments.create(newPay);
      const created = normalizeDoc(res.data || newPay);
      setData((prev) => {
        const updatedPayments = [created, ...prev.payments];
        const updated = { ...prev, payments: updatedPayments };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      await refreshData();
      return created.id;
    } catch (err) {
      console.error('Failed to create payment on server:', err);
      const localId = `pay_${Date.now()}`;
      const payObj = { ...newPay, id: localId };
      setData((prev) => {
        const updatedPayments = [payObj, ...prev.payments];
        const updated = { ...prev, payments: updatedPayments };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return localId;
    }
  };

  const updatePayment = async (id, updatedFields) => {
    try {
      await api.payments.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update payment on server:', err);
    }
    setData((prev) => {
      const updatedPayments = prev.payments.map((p) =>
        p.id === id || p._id === id ? { ...p, ...updatedFields } : p
      );
      const updated = { ...prev, payments: updatedPayments };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const deletePayment = async (id) => {
    try {
      await api.payments.delete(id);
    } catch (err) {
      console.error('Failed to delete payment on server:', err);
    }
    setData((prev) => {
      const updatedPayments = prev.payments.filter((p) => p.id !== id && p._id !== id);
      const updated = { ...prev, payments: updatedPayments };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // NOTIFICATION HANDLERS
  const markNotificationAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
    } catch (err) {}
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id || n._id === id ? { ...n, read: true } : n
      ),
    }));
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
    } catch (err) {}
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  // SCANNER HANDLERS
  const addScanner = async (newScn) => {
    try {
      const res = await api.scanners.create(newScn);
      const created = normalizeDoc(res.data || newScn);
      setData((prev) => {
        const updatedScanners = [created, ...(prev.reviewScanners || [])];
        const updated = { ...prev, reviewScanners: updatedScanners };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return created;
    } catch (err) {
      console.error('Failed to create scanner on server:', err);
      const localId = `scn_${Date.now()}`;
      const scnObj = { ...newScn, id: localId, status: 'Active' };
      setData((prev) => {
        const updatedScanners = [scnObj, ...(prev.reviewScanners || [])];
        const updated = { ...prev, reviewScanners: updatedScanners };
        return { ...updated, dashboardMetrics: computeMetrics(updated) };
      });
      return scnObj;
    }
  };

  const updateScanner = async (id, updatedFields) => {
    try {
      await api.scanners.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update scanner on server:', err);
    }
    setData((prev) => {
      const updatedScanners = (prev.reviewScanners || []).map((s) =>
        s.id === id || s._id === id ? { ...s, ...updatedFields } : s
      );
      const updated = { ...prev, reviewScanners: updatedScanners };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  const regenerateScannerCode = async (id) => {
    try {
      const res = await api.scanners.regenerate(id);
      if (res.data) {
        const updated = normalizeDoc(res.data);
        setData((prev) => ({
          ...prev,
          reviewScanners: prev.reviewScanners.map((s) => (s.id === id || s._id === id ? updated : s)),
        }));
        return updated;
      }
    } catch (err) {
      console.error('Failed to regenerate scanner on server:', err);
    }
  };

  const deleteScanner = async (id) => {
    try {
      await api.scanners.delete(id);
    } catch (err) {
      console.error('Failed to delete scanner on server:', err);
    }
    setData((prev) => {
      const updatedScanners = (prev.reviewScanners || []).filter((s) => s.id !== id && s._id !== id);
      const updated = { ...prev, reviewScanners: updatedScanners };
      return { ...updated, dashboardMetrics: computeMetrics(updated) };
    });
  };

  // STAFF HANDLERS
  const addStaff = async (newStaff) => {
    try {
      const res = await api.staff.create(newStaff);
      const created = normalizeDoc(res.data || newStaff);
      setData((prev) => ({
        ...prev,
        staff: [created, ...(prev.staff || [])],
      }));
      return created.id;
    } catch (err) {
      console.error('Failed to create staff on server:', err);
      const localId = `stf_${Date.now()}`;
      const staffObj = { ...newStaff, id: localId, status: 'Active' };
      setData((prev) => ({
        ...prev,
        staff: [staffObj, ...(prev.staff || [])],
      }));
      return localId;
    }
  };

  const updateStaff = async (id, updatedFields) => {
    try {
      await api.staff.update(id, updatedFields);
    } catch (err) {
      console.error('Failed to update staff on server:', err);
    }
    setData((prev) => ({
      ...prev,
      staff: (prev.staff || []).map((s) => (s.id === id || s._id === id ? { ...s, ...updatedFields } : s)),
    }));
  };

  const deleteStaff = async (id) => {
    try {
      await api.staff.delete(id);
    } catch (err) {
      console.error('Failed to delete staff on server:', err);
    }
    setData((prev) => ({
      ...prev,
      staff: (prev.staff || []).filter((s) => s.id !== id && s._id !== id),
    }));
  };

  // ACTIVITY LOGS HANDLERS
  const addActivityLog = async (logItem) => {
    const formattedLog = {
      actor: logItem.actor || logItem.user || 'Admin',
      user: logItem.user || logItem.actor || 'Admin',
      userRole: logItem.userRole || 'Admin',
      action: logItem.action || 'System Action',
      entity: logItem.entity || logItem.target || logItem.details || 'System',
      target: logItem.target || logItem.entity || 'System',
      details: logItem.details || logItem.action || 'Action recorded in admin panel',
      category: logItem.category || 'General',
      timestamp: logItem.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    try {
      const res = await api.activity.create(formattedLog);
      const created = normalizeDoc(res.data || formattedLog);
      setData((prev) => ({
        ...prev,
        activityLogs: [{ ...formattedLog, ...created }, ...(prev.activityLogs || [])],
      }));
    } catch (err) {
      const localId = `log_${Date.now()}`;
      const logObj = { ...formattedLog, id: localId };
      setData((prev) => ({
        ...prev,
        activityLogs: [logObj, ...(prev.activityLogs || [])],
      }));
    }
  };

  // SETTINGS & PROFILE HANDLERS
  const updateAdminProfile = async (profileData) => {
    try {
      // 1. Send update to backend MongoDB Auth / Staff Profile API
      let updatedUser = null;
      try {
        const res = await api.auth.updateProfile(profileData);
        if (res.data) {
          updatedUser = res.data;
        }
      } catch (err) {
        console.error('Failed to update profile on /auth/profile endpoint:', err);
      }

      // 2. Prepare normalized updated profile
      const newName = profileData.name || updatedUser?.name || currentUser?.name;
      const newEmail = profileData.email || updatedUser?.email || currentUser?.email;
      const newDesignation = profileData.designation || updatedUser?.designation || currentUser?.designation;
      const newPhone = profileData.phone || updatedUser?.phone || currentUser?.phone;
      const newRole = profileData.role || updatedUser?.role || currentUser?.role || 'Super Admin';
      const newAvatar = newName ? newName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : (currentUser?.avatar || 'SA');

      const fullUpdatedUser = {
        ...(currentUser || {}),
        ...(updatedUser || {}),
        name: newName,
        email: newEmail,
        designation: newDesignation,
        phone: newPhone,
        role: newRole,
        avatar: newAvatar
      };

      // 3. Update Current User in State & LocalStorage
      setCurrentUser(fullUpdatedUser);
      localStorage.setItem('asn_user', JSON.stringify(fullUpdatedUser));
      localStorage.setItem('asn_mock_user', JSON.stringify(fullUpdatedUser));

      // 4. Also update Staff roster in memory/state
      setData((prev) => {
        const updatedStaff = (prev.staff || []).map((s) => {
          if (
            (currentUser?.id && (s.id === currentUser.id || s._id === currentUser.id)) ||
            (newEmail && s.email?.toLowerCase() === newEmail.toLowerCase()) ||
            s.role === 'Super Admin'
          ) {
            return {
              ...s,
              name: newName,
              email: newEmail,
              designation: newDesignation,
              phone: newPhone,
              avatar: newAvatar
            };
          }
          return s;
        });

        const updatedSettings = {
          ...(prev.settings || {}),
          adminProfile: {
            ...(prev.settings?.adminProfile || {}),
            name: newName,
            email: newEmail,
            designation: newDesignation,
            phone: newPhone,
            role: newRole,
            avatarUrl: newAvatar
          }
        };

        return {
          ...prev,
          staff: updatedStaff,
          settings: updatedSettings
        };
      });

      // 5. Also persist to global settings API
      try {
        await api.settings.update({
          adminProfile: {
            name: newName,
            email: newEmail,
            designation: newDesignation,
            phone: newPhone,
            role: newRole,
            avatarUrl: newAvatar
          }
        });
      } catch (e) {}

      return fullUpdatedUser;
    } catch (err) {
      console.error('Failed to update admin profile:', err);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const res = await api.settings.update(newSettings);
      const updatedSettingsObj = res.data || { ...data.settings, ...newSettings };
      
      // If adminProfile was part of settings, sync currentUser and staff roster dynamically
      if (newSettings.adminProfile) {
        const p = newSettings.adminProfile;
        const newName = p.name || currentUser?.name;
        const newEmail = p.email || currentUser?.email;
        const newDesignation = p.designation || currentUser?.designation;
        const newPhone = p.phone || currentUser?.phone;
        const newAvatar = newName ? newName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : currentUser?.avatar;

        const updatedUser = {
          ...(currentUser || {}),
          name: newName,
          email: newEmail,
          designation: newDesignation,
          phone: newPhone,
          role: p.role || currentUser?.role || 'Super Admin',
          avatar: newAvatar
        };

        setCurrentUser(updatedUser);
        localStorage.setItem('asn_user', JSON.stringify(updatedUser));
        localStorage.setItem('asn_mock_user', JSON.stringify(updatedUser));
      }

      setData((prev) => ({
        ...prev,
        settings: updatedSettingsObj,
      }));
    } catch (err) {
      console.error('Failed to update settings on server:', err);
      setData((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      }));
    }
  };

  const value = {
    ...data,
    rawMockData: data,
    isLoading,
    isBackendConnected,
    lastSyncedAt,
    isAuthenticated,
    currentUser,
    setCurrentUser,
    sidebarCollapsed,
    dateRangeFilter,
    globalSearchQuery,
    isSearchOpen,
    login,
    logout,
    hasPermission,
    getDefaultRoute,
    ROLE_PERMISSIONS,
    refreshData,
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
    deleteEnquiry,
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
    addTaskComment,
    addPayment,
    updatePayment,
    deletePayment,
    addScanner,
    addReviewScanner: addScanner,
    updateScanner,
    deleteScanner,
    regenerateScannerCode,
    addStaff,
    updateStaff,
    deleteStaff,
    addActivityLog,
    updateSettings,
    updateAdminProfile,
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
