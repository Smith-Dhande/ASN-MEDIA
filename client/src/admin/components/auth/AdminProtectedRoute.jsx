import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { hasModulePermission, getDefaultRouteForRole } from '../../utils/rbac';

export const AdminProtectedRoute = ({ children, moduleKey }) => {
  const { isAuthenticated, currentUser } = useAdminData();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (moduleKey && !hasModulePermission(currentUser?.role, moduleKey)) {
    const fallbackRoute = getDefaultRouteForRole(currentUser?.role || 'Staff');

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F3] border border-[#D5C7A5] rounded-[10px] my-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-mono tracking-widest uppercase text-[#8E722A] bg-[#E5D9BC] px-3 py-1 rounded border border-[#D5C7A5] font-bold mb-3">
          ROLE-BASED ACCESS CONTROL (RBAC) RESTRICTION
        </span>

        <h2 className="font-display text-2xl sm:text-3xl text-[#111111] mb-2 font-normal">
          Module Access Restricted
        </h2>

        <p className="text-xs sm:text-sm text-[#66615A] max-w-md mb-6 font-body">
          Your current authenticated profile <strong className="text-[#111111]">{currentUser?.name}</strong> has the role <span className="font-mono font-bold text-[#8E722A] uppercase">{currentUser?.role || 'Staff'}</span>, which does not have permission to view the <span className="font-mono font-bold uppercase text-[#111111]">{moduleKey}</span> module.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={fallbackRoute}
            className="px-5 py-2.5 bg-[#111111] text-[#F7F5EF] text-xs font-mono font-bold uppercase tracking-wider rounded-xs hover:bg-[#8E722A] transition-colors flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Permitted Workspace ({currentUser?.role})</span>
          </Link>

          <Link
            to="/admin/dashboard"
            className="px-4 py-2.5 bg-[#E5D9BC] text-[#221C11] text-xs font-mono font-semibold uppercase tracking-wider rounded-xs hover:bg-[#D5C7A5] border border-[#D5C7A5] transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};
