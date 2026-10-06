import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_DEFAULT_USER = {
  id: 'usr_asn_9041',
  name: 'Alex Morgan',
  email: 'alex@asn.in',
  initials: 'AM',
  role: 'Creative Director / Client Partner',
  isAdmin: true,
  memberSince: 'Jan 2025',
  company: 'Aura Studio Co.'
};

export const checkIsAdmin = (u) => {
  if (!u) return false;
  if (u.isAdmin === true) return true;
  const email = (u.email || '').toLowerCase().trim();
  const role = (u.role || '').toLowerCase();
  if (
    email.endsWith('@asn.in') ||
    email.endsWith('@asnmedia.in') ||
    email.endsWith('@asndigitalmedia.com') ||
    email.includes('alex') ||
    email.includes('admin') ||
    role.includes('admin') ||
    role.includes('director') ||
    role.includes('partner') ||
    role.includes('manager') ||
    role.includes('strategist') ||
    role.includes('editor')
  ) {
    return true;
  }
  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('asn_mock_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isAdmin: checkIsAdmin(parsed)
        };
      }
      return {
        ...MOCK_DEFAULT_USER,
        isAdmin: true
      };
    } catch {
      return {
        ...MOCK_DEFAULT_USER,
        isAdmin: true
      };
    }
  });

  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [authView, setAuthView] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalTab, setAccountModalTab] = useState('profile');

  useEffect(() => {
    if (user) {
      localStorage.setItem('asn_mock_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('asn_mock_user');
    }
  }, [user]);

  const openSignIn = () => {
    setAuthView('signin');
    setIsAuthDrawerOpen(true);
  };

  const openSignUp = () => {
    setAuthView('signup');
    setIsAuthDrawerOpen(true);
  };

  const closeAuthDrawer = () => {
    setIsAuthDrawerOpen(false);
  };

  const switchAuthView = (view) => {
    setAuthView(view);
  };

  const signIn = async (email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 850));

    // Mock validation trigger: error@asnmedia.in tests error state
    if (email.trim().toLowerCase() === 'error@asnmedia.in') {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    // Determine user name from email prefix if provided
    const namePart = email.split('@')[0];
    const formattedName = namePart
      .split(/[._-]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Alex Morgan';

    const initials = formattedName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AM';

    const isAdminUser = checkIsAdmin({ email, name: formattedName });

    const loggedInUser = {
      ...MOCK_DEFAULT_USER,
      email: email,
      name: formattedName,
      initials: initials,
      isAdmin: isAdminUser
    };

    setUser(loggedInUser);
    return loggedInUser;
  };

  const signUp = async (fullName, email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 950));

    if (email.trim().toLowerCase() === 'error@asnmedia.in') {
      throw new Error('An account with this email address already exists.');
    }

    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AM';

    const isAdminUser = checkIsAdmin({ email, name: fullName });

    const newUser = {
      ...MOCK_DEFAULT_USER,
      name: fullName,
      email: email,
      initials: initials,
      isAdmin: isAdminUser
    };

    setUser(newUser);
    return newUser;
  };

  const signOut = () => {
    setUser(null);
    setIsAccountModalOpen(false);
  };

  const openAccountModal = (tab = 'profile') => {
    setAccountModalTab(tab);
    setIsAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  const isAdmin = Boolean(user?.isAdmin || checkIsAdmin(user));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthDrawerOpen,
        authView,
        isAccountModalOpen,
        accountModalTab,
        openSignIn,
        openSignUp,
        closeAuthDrawer,
        switchAuthView,
        signIn,
        signUp,
        signOut,
        openAccountModal,
        closeAccountModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
