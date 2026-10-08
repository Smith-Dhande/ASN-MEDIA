/**
 * ASN DIGITAL MEDIA - Central API Client Service
 * Connects Frontend directly to Backend REST APIs & MongoDB Database
 */

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('asn_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const json = await res.json();
      errorMsg = json.message || json.error || errorMsg;
    } catch (e) {
      errorMsg = await res.text() || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth API
  auth: {
    login: (credentials) =>
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }).then(handleResponse),
    getMe: () =>
      fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    forgotPassword: (email) =>
      fetch(`${API_BASE}/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(handleResponse),
    resetPassword: (token, password) =>
      fetch(`${API_BASE}/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }).then(handleResponse),
    updateProfile: (profileData) =>
      fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      }).then(handleResponse),
    updatePassword: (passwords) =>
      fetch(`${API_BASE}/auth/updatepassword`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwords),
      }).then(handleResponse),
  },

  // Dashboard KPI Metrics
  dashboard: {
    getMetrics: () =>
      fetch(`${API_BASE}/dashboard/metrics`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Clients API
  clients: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/clients${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse);
    },
    getById: (id) =>
      fetch(`${API_BASE}/clients/${id}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    create: (clientData) =>
      fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(clientData),
      }).then(handleResponse),
    update: (id, clientData) =>
      fetch(`${API_BASE}/clients/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(clientData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/clients/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Leads & Enquiries API
  leads: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/leads${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse);
    },
    create: (leadData) =>
      fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      }).then(handleResponse),
    update: (id, leadData) =>
      fetch(`${API_BASE}/leads/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(leadData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
    addFollowUp: (id, followUpData) =>
      fetch(`${API_BASE}/leads/${id}/follow-up`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(followUpData),
      }).then(handleResponse),
    convert: (id, convertData) =>
      fetch(`${API_BASE}/leads/${id}/convert`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(convertData),
      }).then(handleResponse),
  },

  // Packages API
  packages: {
    getAll: () =>
      fetch(`${API_BASE}/packages`).then(handleResponse),
    create: (pkgData) =>
      fetch(`${API_BASE}/packages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pkgData),
      }).then(handleResponse),
    update: (id, pkgData) =>
      fetch(`${API_BASE}/packages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(pkgData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/packages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Services API
  services: {
    getAll: (category) =>
      fetch(`${API_BASE}/services${category ? `?category=${encodeURIComponent(category)}` : ''}`).then(handleResponse),
    create: (svcData) =>
      fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(svcData),
      }).then(handleResponse),
    update: (id, svcData) =>
      fetch(`${API_BASE}/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(svcData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Projects API
  projects: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/projects${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse);
    },
    create: (prjData) =>
      fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(prjData),
      }).then(handleResponse),
    update: (id, prjData) =>
      fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(prjData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Tasks API
  tasks: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse);
    },
    create: (taskData) =>
      fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      }).then(handleResponse),
    update: (id, taskData) =>
      fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
    addComment: (id, text, user) =>
      fetch(`${API_BASE}/tasks/${id}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text, user }),
      }).then(handleResponse),
  },

  // Payments API
  payments: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/payments${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse);
    },
    create: (payData) =>
      fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payData),
      }).then(handleResponse),
    update: (id, payData) =>
      fetch(`${API_BASE}/payments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/payments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Review Scanners API
  scanners: {
    getAll: () =>
      fetch(`${API_BASE}/scanners`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    getById: (id) =>
      fetch(`${API_BASE}/scanners/${id}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    getBySlug: (slug) =>
      fetch(`${API_BASE}/scanners/public/${slug}`).then(handleResponse),
    create: (scannerData) =>
      fetch(`${API_BASE}/scanners`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scannerData),
      }).then(handleResponse),
    update: (id, scannerData) =>
      fetch(`${API_BASE}/scanners/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(scannerData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/scanners/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
    regenerate: (id) =>
      fetch(`${API_BASE}/scanners/${id}/regenerate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      }).then(handleResponse),
    generateSuggestions: (id, payload) =>
      fetch(`${API_BASE}/scanners/${id}/generate-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(handleResponse),
    submitReview: (slug, reviewData) =>
      fetch(`${API_BASE}/scanners/public/${slug}/submit-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      }).then(handleResponse),
    getReviews: (slug) =>
      fetch(`${API_BASE}/scanners/public/${slug}/reviews`).then(handleResponse),
  },

  // Staff & Roles API
  staff: {
    getAll: () =>
      fetch(`${API_BASE}/staff`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    create: (staffData) =>
      fetch(`${API_BASE}/staff`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(staffData),
      }).then(handleResponse),
    update: (id, staffData) =>
      fetch(`${API_BASE}/staff/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(staffData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/staff/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Activity Logs API
  activity: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/activity${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse);
    },
    create: (logData) =>
      fetch(`${API_BASE}/activity`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(logData),
      }).then(handleResponse),
    clear: () =>
      fetch(`${API_BASE}/activity`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Notifications API
  notifications: {
    getAll: () =>
      fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    markAsRead: (id) =>
      fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      }).then(handleResponse),
    markAllAsRead: () =>
      fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      }).then(handleResponse),
    create: (notifData) =>
      fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(notifData),
      }).then(handleResponse),
    delete: (id) =>
      fetch(`${API_BASE}/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  // Settings API
  settings: {
    get: () =>
      fetch(`${API_BASE}/settings`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    update: (settingsData) =>
      fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settingsData),
      }).then(handleResponse),
  },
};
