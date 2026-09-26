import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Pagination } from '../components/ui/Pagination';
import { Shield, UserPlus, Check, X, Mail, CheckCircle2 } from 'lucide-react';

export const StaffRolesModule = () => {
  const { staff: initialStaff } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState(initialStaff || []);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form for New Staff Account
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    role: 'Content Strategist',
  });
  const [addSuccess, setAddSuccess] = useState(false);

  const isPermissionsMode = location.pathname.endsWith('/permissions');

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, location.pathname]);

  const filteredStaff = staffList.filter((stf) => {
    const matchesSearch =
      stf.name.toLowerCase().includes(search.toLowerCase()) ||
      stf.email.toLowerCase().includes(search.toLowerCase()) ||
      stf.role.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'All' || stf.role.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredStaff.length / pageSize) || 1;
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const initials = addForm.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const newStaff = {
      id: `stf_${Date.now()}`,
      name: addForm.name,
      email: addForm.email,
      role: addForm.role,
      avatar: initials || 'ST',
      activeTasksCount: 0,
      status: 'Active',
    };

    setStaffList([...staffList, newStaff]);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setIsAddModalOpen(false);
      setAddForm({ name: '', email: '', role: 'Content Strategist' });
    }, 1200);
  };

  const columns = [
    {
      header: 'Staff Member',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8E722A] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
            {row.avatar}
          </div>
          <div>
            <div className="font-semibold text-[#111111]">{row.name}</div>
            <div className="text-[10px] text-[#66615A] font-mono">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      key: 'role',
      render: (row) => (
        <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[#F7F5EF] border border-[#0A0A0A]/12 text-[#8E722A] rounded-xs">
          {row.role}
        </span>
      ),
    },
    {
      header: 'Active Tasks',
      key: 'activeTasksCount',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-[#111111]">
          {row.activeTasksCount} tasks assigned
        </span>
      ),
    },
    {
      header: 'Account Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      key: 'action',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => navigate('/admin/staff/permissions')}
          className="px-2.5 py-1 text-[10px] font-mono text-[#8E722A] hover:text-[#111111]"
        >
          Manage Permissions
        </button>
      ),
    },
  ];

  const permissionsMatrix = [
    { module: 'Dashboard & Analytics', superAdmin: true, pm: true, strategist: true, editor: false, accountant: false },
    { module: 'Clients Management', superAdmin: true, pm: true, strategist: true, editor: false, accountant: true },
    { module: 'Leads & Enquiries', superAdmin: true, pm: true, strategist: true, editor: false, accountant: false },
    { module: 'Packages & Services', superAdmin: true, pm: true, strategist: false, editor: false, accountant: false },
    { module: 'Projects & Tasks', superAdmin: true, pm: true, strategist: true, editor: true, accountant: false },
    { module: 'Payments & Invoicing', superAdmin: true, pm: false, strategist: false, editor: false, accountant: true },
    { module: 'Review Scanners', superAdmin: true, pm: true, strategist: true, editor: false, accountant: false },
    { module: 'Platform Settings', superAdmin: true, pm: false, strategist: false, editor: false, accountant: false },
  ];

  return (
    <div className="space-y-6">
      {isPermissionsMode ? (
        /* Role Permissions Matrix View */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-[6px] border border-[#0A0A0A]/12">
            <div>
              <h2 className="font-serif font-semibold text-lg text-[#111111]">Role Permissions Matrix</h2>
              <p className="text-xs text-[#66615A] font-body mt-0.5">
                Granular access control map defining administrative module authorization levels.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/staff')}
              className="text-xs font-mono text-[#66615A] hover:text-[#111111]"
            >
              ← Back to Staff Accounts
            </button>
          </div>

          <AdminCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EF] border-b border-[#0A0A0A]/14 text-[#8E722A] font-mono text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4 text-left">Module Subsystem</th>
                    <th className="py-3.5 px-4 text-center">Super Admin</th>
                    <th className="py-3.5 px-4 text-center">Project Manager</th>
                    <th className="py-3.5 px-4 text-center">Content Strategist</th>
                    <th className="py-3.5 px-4 text-center">Video Editor</th>
                    <th className="py-3.5 px-4 text-center">Accountant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A0A0A]/08">
                  {permissionsMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F5EF]/40">
                      <td className="py-3.5 px-4 font-semibold text-[#111111]">{item.module}</td>
                      <td className="py-3.5 px-4 text-center">
                        {item.superAdmin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.pm ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.strategist ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.editor ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.accountant ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>
      ) : (
        /* Staff Accounts View */
        <>
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search staff name, email, or role..."
            filterOptions={['All', 'Admin', 'Strategist', 'Editor']}
            selectedFilter={roleFilter}
            onFilterChange={setRoleFilter}
            actions={
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Staff Member</span>
              </button>
            }
          />

          <AdminCard noPadding>
            <DataTable
              columns={columns}
              data={paginatedStaff}
              emptyTitle="No Staff Accounts Found"
              emptyMessage="No staff members match the selected search criteria."
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredStaff.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setPageSize}
            />
          </AdminCard>
        </>
      )}

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#0A0A0A]/14 rounded-md shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A0A0A]/10 pb-3">
              <h3 className="font-serif font-semibold text-lg text-[#111111]">Provision Staff Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#66615A] hover:text-[#111111] text-sm">✕</button>
            </div>

            {addSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="font-serif text-lg font-semibold text-[#111111]">Account Provisioned</div>
                <div className="text-xs font-mono text-[#66615A]">Invitation link dispatched to user email.</div>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <FormInput
                  label="Full Name"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Sharma"
                  required
                />
                <FormInput
                  label="Email Address"
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="name@asnmedia.in"
                  required
                />
                <FormSelect
                  label="Role Designation"
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  options={[
                    'Super Admin',
                    'Project Manager',
                    'Content Strategist',
                    'Video Editor',
                    'Accountant',
                  ]}
                />

                <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-[#66615A] hover:text-[#111111]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
