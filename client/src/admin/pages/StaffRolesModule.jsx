import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AdminCard } from '../components/ui/AdminCard';
import { AdminModal } from '../components/ui/AdminModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Pagination } from '../components/ui/Pagination';
import { Shield, UserPlus, Check, X, Mail, CheckCircle2, Edit2, Power, Save } from 'lucide-react';

export const StaffRolesModule = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [confirmStatusModal, setConfirmStatusModal] = useState({ isOpen: false, staff: null });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Feedback Toast
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  // Form State
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    role: 'Content Strategist',
    status: 'Active',
  });

  // Interactive Permission Matrix State
  const [matrixState, setMatrixState] = useState([
    { module: 'Dashboard & Analytics', superAdmin: true, pm: true, strategist: true, editor: false, accountant: false },
    { module: 'Clients Management', superAdmin: true, pm: true, strategist: true, editor: false, accountant: true },
    { module: 'Leads & Enquiries', superAdmin: true, pm: true, strategist: true, editor: false, accountant: false },
    { module: 'Packages & Services', superAdmin: true, pm: true, strategist: false, editor: false, accountant: false },
    { module: 'Projects & Tasks', superAdmin: true, pm: true, strategist: true, editor: true, accountant: false },
    { module: 'Payments & Invoicing', superAdmin: true, pm: false, strategist: false, editor: false, accountant: true },
    { module: 'Review Scanners', superAdmin: true, pm: true, strategist: true, editor: false, accountant: false },
    { module: 'Platform Settings', superAdmin: true, pm: false, strategist: false, editor: false, accountant: false },
  ]);

  const [isMatrixDirty, setIsMatrixDirty] = useState(false);

  const isPermissionsMode = location.pathname.endsWith('/permissions');

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, location.pathname]);

  const showToast = (message) => {
    setFeedback({ show: true, message });
    setTimeout(() => setFeedback({ show: false, message: '' }), 3000);
  };

  const filteredStaff = staff.filter((stf) => {
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

  const handleOpenAdd = () => {
    setStaffForm({ name: '', email: '', role: 'Content Strategist', status: 'Active' });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addStaff(staffForm);
    setIsAddModalOpen(false);
    showToast('New staff member account provisioned!');
  };

  const handleOpenEdit = (member) => {
    setSelectedStaff(member);
    setStaffForm({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedStaff) return;
    updateStaff(selectedStaff.id, staffForm);
    setIsEditModalOpen(false);
    showToast('Staff profile details updated.');
  };

  const handleToggleStatusConfirm = () => {
    if (!confirmStatusModal.staff) return;
    const newStatus = confirmStatusModal.staff.status === 'Active' ? 'Inactive' : 'Active';
    updateStaff(confirmStatusModal.staff.id, { status: newStatus });
    setConfirmStatusModal({ isOpen: false, staff: null });
    showToast(`Staff account status updated to ${newStatus}.`);
  };

  const handleMatrixCellToggle = (rowIndex, roleKey) => {
    if (roleKey === 'superAdmin') return; // Super admin permissions locked
    setMatrixState((prev) => {
      const copy = [...prev];
      copy[rowIndex] = { ...copy[rowIndex], [roleKey]: !copy[rowIndex][roleKey] };
      return copy;
    });
    setIsMatrixDirty(true);
  };

  const handleSaveMatrix = () => {
    setIsMatrixDirty(false);
    showToast('Role permissions matrix saved successfully!');
  };

  const columns = [
    {
      header: 'Staff Member',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-[#8E722A] border border-[#8E722A] flex items-center justify-center font-mono font-bold text-xs shrink-0">
            {row.avatar}
          </div>
          <div>
            <div className="font-semibold text-[#111111]">{row.name}</div>
            <div className="text-[10px] text-[#685C43] font-mono">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      key: 'role',
      render: (row) => (
        <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[#FAF8F3] border border-[#0A0A0A]/12 text-[#8E722A] rounded-xs">
          {row.role}
        </span>
      ),
    },
    {
      header: 'Active Tasks',
      key: 'activeTasksCount',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-[#111111]">
          {row.activeTasksCount || 0} active tasks
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
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 text-[#685C43] hover:text-[#111111]"
            title="Edit Staff Member"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmStatusModal({ isOpen: true, staff: row })}
            className={`px-2 py-1 text-[10px] font-mono font-bold rounded-xs transition-colors border ${
              row.status === 'Active'
                ? 'border-amber-300 text-amber-800 hover:bg-amber-50'
                : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {/* Toast Feedback */}
      {feedback.show && (
        <div className="fixed top-4 right-4 z-50 bg-[#111111] text-[#F7F5EF] px-4 py-3 rounded-md shadow-xl font-mono text-xs flex items-center gap-2 border border-[#8E722A] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
          <span>{feedback.message}</span>
        </div>
      )}

      {isPermissionsMode ? (
        /* Role Permissions Matrix View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-[6px] border border-[#0A0A0A]/12 gap-3">
            <div>
              <h2 className="font-serif font-semibold text-lg text-[#111111]">Interactive Role Permissions Matrix</h2>
              <p className="text-xs text-[#685C43] font-body mt-0.5">
                Toggle cellular permissions to configure module authorization for team roles.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isMatrixDirty && (
                <button
                  onClick={handleSaveMatrix}
                  className="px-3.5 py-1.5 bg-[#8E722A] text-white hover:bg-[#725B20] text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Permission Matrix</span>
                </button>
              )}
              <button
                onClick={() => navigate('/admin/staff')}
                className="text-xs font-mono text-[#685C43] hover:text-[#111111]"
              >
                ← Back to Staff Accounts
              </button>
            </div>
          </div>

          <AdminCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#0A0A0A]/14 text-[#8E722A] font-mono text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4 text-left">Module Subsystem</th>
                    <th className="py-3.5 px-4 text-center">Super Admin</th>
                    <th className="py-3.5 px-4 text-center">Project Manager</th>
                    <th className="py-3.5 px-4 text-center">Content Strategist</th>
                    <th className="py-3.5 px-4 text-center">Video Editor</th>
                    <th className="py-3.5 px-4 text-center">Accountant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A0A0A]/08">
                  {matrixState.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F3]/40">
                      <td className="py-3.5 px-4 font-semibold text-[#111111] font-mono">{item.module}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="p-1 rounded-xs bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px]">LOCKED FULL</span>
                      </td>
                      {['pm', 'strategist', 'editor', 'accountant'].map((roleKey) => (
                        <td key={roleKey} className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleMatrixCellToggle(idx, roleKey)}
                            className={`p-1.5 rounded-xs transition-transform hover:scale-110 ${
                              item[roleKey]
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-50 text-red-500 border border-red-200'
                            }`}
                          >
                            {item[roleKey] ? (
                              <Check className="w-4 h-4 text-emerald-700" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                          </button>
                        </td>
                      ))}
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
            filterOptions={['All', 'Admin', 'Strategist', 'Editor', 'Manager']}
            selectedFilter={roleFilter}
            onFilterChange={setRoleFilter}
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/admin/staff/permissions')}
                  className="px-3 py-2 text-xs font-mono font-bold bg-[#FAF8F3] border border-[#0A0A0A]/14 text-[#111111] hover:bg-[#8E722A] hover:text-white rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Permission Matrix</span>
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Staff Member</span>
                </button>
              </div>
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
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision New Staff Member Account"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            value={staffForm.name}
            onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
            placeholder="e.g. Vikramaditya Sharma"
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            value={staffForm.email}
            onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
            placeholder="name@asnmedia.in"
            required
          />
          <FormSelect
            label="Role Designation"
            value={staffForm.role}
            onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
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
              className="px-4 py-2 text-xs font-mono text-[#685C43]"
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
      </AdminModal>

      {/* Edit Staff Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Staff Member Details"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            value={staffForm.name}
            onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            value={staffForm.email}
            onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
            required
          />
          <FormSelect
            label="Role Designation"
            value={staffForm.role}
            onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
            options={[
              'Super Admin',
              'Project Manager',
              'Content Strategist',
              'Video Editor',
              'Accountant',
            ]}
          />
          <FormSelect
            label="Account Status"
            value={staffForm.status}
            onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value })}
            options={['Active', 'Inactive']}
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-mono text-[#685C43]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </AdminModal>

      {/* CONFIRM STATUS DIALOG */}
      <ConfirmDialog
        isOpen={confirmStatusModal.isOpen}
        onClose={() => setConfirmStatusModal({ isOpen: false, staff: null })}
        onConfirm={handleToggleStatusConfirm}
        title={`${confirmStatusModal.staff?.status === 'Active' ? 'Deactivate' : 'Activate'} Staff Account`}
        message={`Are you sure you want to change the status of ${confirmStatusModal.staff?.name} to ${confirmStatusModal.staff?.status === 'Active' ? 'Inactive' : 'Active'}?`}
        confirmText="Confirm Status Update"
      />
    </div>
  );
};

