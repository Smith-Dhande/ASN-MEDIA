/**
 * Role-Based Access Control (RBAC) Permission Configuration
 * Defines module permissions per staff role in ASN Digital Media
 */

export const ROLE_PERMISSIONS = {
  'Super Admin': [
    'dashboard',
    'clients',
    'enquiries',
    'packages',
    'projects',
    'payments',
    'scanners',
    'reports',
    'notifications',
    'staff',
    'activity',
    'settings'
  ],
  'Admin': [
    'dashboard',
    'clients',
    'enquiries',
    'packages',
    'projects',
    'payments',
    'scanners',
    'reports',
    'notifications',
    'activity'
  ],
  'Project Manager': [
    'dashboard',
    'clients',
    'enquiries',
    'packages',
    'projects',
    'scanners',
    'reports',
    'notifications'
  ],
  'Creative Director & Lead Editor': [
    'dashboard',
    'projects',
    'notifications'
  ],
  'Video Editor': [
    'projects',
    'notifications'
  ],
  'Motion Designer': [
    'projects',
    'notifications'
  ],
  'Copywriter': [
    'projects',
    'notifications'
  ],
  'Social Media Strategist': [
    'dashboard',
    'clients',
    'enquiries',
    'projects',
    'scanners',
    'notifications'
  ],
  'Content Strategist': [
    'dashboard',
    'clients',
    'enquiries',
    'projects',
    'scanners',
    'notifications'
  ],
  'Content Creator & Designer': [
    'dashboard',
    'projects',
    'notifications'
  ],
  'Accountant': [
    'dashboard',
    'clients',
    'payments',
    'reports',
    'notifications'
  ],
  'Accounts': [
    'dashboard',
    'clients',
    'payments',
    'reports',
    'notifications'
  ],
  'Staff': [
    'dashboard',
    'projects',
    'notifications'
  ]
};

/**
 * Returns whether a given user role has access to a specific module
 * @param {string} userRole - User's role name (e.g. 'Project Manager')
 * @param {string} moduleKey - Module identifier (e.g. 'payments')
 * @returns {boolean}
 */
export const hasModulePermission = (userRole = 'Staff', moduleKey = 'dashboard') => {
  if (!userRole) return false;

  // Direct lookup
  if (ROLE_PERMISSIONS[userRole]) {
    return ROLE_PERMISSIONS[userRole].includes(moduleKey);
  }

  // Normalization lookup
  const roleClean = userRole.toLowerCase().trim();
  if (roleClean.includes('super admin')) {
    return ROLE_PERMISSIONS['Super Admin'].includes(moduleKey);
  }
  if (roleClean.includes('admin')) {
    return ROLE_PERMISSIONS['Admin'].includes(moduleKey);
  }
  if (roleClean.includes('project') || roleClean.includes('pm')) {
    return ROLE_PERMISSIONS['Project Manager'].includes(moduleKey);
  }
  if (roleClean.includes('account') || roleClean.includes('finance')) {
    return ROLE_PERMISSIONS['Accountant'].includes(moduleKey);
  }
  if (roleClean.includes('strategist')) {
    return ROLE_PERMISSIONS['Content Strategist'].includes(moduleKey);
  }
  if (roleClean.includes('editor') || roleClean.includes('designer') || roleClean.includes('copywriter')) {
    return ROLE_PERMISSIONS['Video Editor'].includes(moduleKey);
  }

  return (ROLE_PERMISSIONS['Staff'] || []).includes(moduleKey);
};

/**
 * Get initial landing route for a specific user role
 * @param {string} userRole
 * @returns {string}
 */
export const getDefaultRouteForRole = (userRole = 'Staff') => {
  if (hasModulePermission(userRole, 'dashboard')) return '/admin/dashboard';
  if (hasModulePermission(userRole, 'projects')) return '/admin/projects';
  if (hasModulePermission(userRole, 'payments')) return '/admin/payments';
  if (hasModulePermission(userRole, 'clients')) return '/admin/clients';
  return '/admin/notifications';
};
