import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Filter out 'admin' from segment path displays
  const adminIndex = pathnames.indexOf('admin');
  const breadcrumbSegments = adminIndex !== -1 ? pathnames.slice(adminIndex + 1) : pathnames;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs font-mono text-[#66615A] py-1 overflow-x-auto">
      <Link
        to="/admin/dashboard"
        className="flex items-center gap-1.5 hover:text-[#0A0A0A] transition-colors focus:outline-none"
      >
        <Home className="w-3.5 h-3.5 text-[#8E722A]" />
        <span>Admin</span>
      </Link>

      {breadcrumbSegments.map((segment, index) => {
        const routeTo = `/admin/${breadcrumbSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === breadcrumbSegments.length - 1;
        const formattedName = segment
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-[#0A0A0A]/30 mx-1 shrink-0" />
            {isLast ? (
              <span className="font-bold text-[#0A0A0A] uppercase tracking-wider">
                {formattedName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-[#0A0A0A] uppercase tracking-wider transition-colors focus:outline-none"
              >
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
