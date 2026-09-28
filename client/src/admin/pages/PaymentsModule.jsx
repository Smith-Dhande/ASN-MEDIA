import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { AdminModal } from '../components/ui/AdminModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Pagination } from '../components/ui/Pagination';
import { KpiCard } from '../components/ui/KpiCard';
import { ModuleSkeleton } from '../components/ui/LoadingSkeleton';
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  Calendar,
  FileText,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const PaymentsModule = () => {
  const {
    payments,
    clients,
    packages,
    addPayment,
    updatePayment,
    deletePayment,
  } = useAdminData();

  const location = useLocation();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals & Confirm Dialogs
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ isOpen: false, id: '', invoiceNumber: '' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Toast feedback
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  // Form State for Recording Payment / Creating Invoice
  const [paymentForm, setPaymentForm] = useState({
    invoiceNumber: `INV-2026-09${payments.length + 10}`,
    clientName: clients[0]?.name || 'Aura Luxury Beauty',
    packageName: packages[0]?.name || 'Social Media Retainer (Tier A)',
    amount: '4500',
    amountReceived: '4500',
    method: 'Bank Transfer',
    date: new Date().toISOString().split('T')[0],
    dueDate: '2026-10-15',
    status: 'Paid',
    notes: 'Standard retainer invoice',
  });

  // Determine sub-tab route
  const isOutstanding = location.pathname.includes('/outstanding');
  const isDue = location.pathname.includes('/due');

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, location.pathname]);

  const showToast = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 3000);
  };

  // Filter payments based on path + search + status filter
  const filteredPayments = payments.filter((pay) => {
    // Path-based filter
    if (isOutstanding && pay.status !== 'Overdue') return false;
    if (isDue && pay.status !== 'Pending' && pay.status !== 'Partially Paid') return false;

    // Search filter
    const matchesSearch =
      pay.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      pay.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (pay.method && pay.method.toLowerCase().includes(search.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === 'All' || pay.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, p) => acc + (Number(p.amountReceived) || Number(p.amount) || 0), 0);

  const totalOutstanding = payments
    .filter((p) => p.status === 'Overdue' || p.status === 'Pending' || p.status === 'Partially Paid')
    .reduce((acc, p) => {
      const packageVal = Number(p.amount) || 0;
      const rcvd = Number(p.amountReceived) || 0;
      return acc + (packageVal - rcvd);
    }, 0);

  const overdueCount = payments.filter((p) => p.status === 'Overdue').length;

  const handleRowClick = (pay) => {
    setSelectedInvoice(pay);
    setIsDrawerOpen(true);
  };

  const handleMarkAsPaid = (payId) => {
    const target = payments.find((p) => p.id === payId);
    if (!target) return;

    updatePayment(payId, {
      status: 'Paid',
      amountReceived: target.amount,
    });

    if (selectedInvoice && selectedInvoice.id === payId) {
      setSelectedInvoice((prev) => ({
        ...prev,
        status: 'Paid',
        amountReceived: prev.amount,
      }));
    }
    showToast(`Invoice ${target.invoiceNumber} marked as Fully Paid!`);
  };

  const handleOpenCreatePayment = () => {
    setPaymentForm({
      invoiceNumber: `INV-2026-09${payments.length + 10}`,
      clientName: clients[0]?.name || 'Aura Luxury Beauty',
      packageName: packages[0]?.name || 'Social Media Retainer (Tier A)',
      amount: '4500',
      amountReceived: '4500',
      method: 'Bank Transfer',
      date: new Date().toISOString().split('T')[0],
      dueDate: '2026-10-15',
      status: 'Paid',
      notes: 'Standard retainer invoice',
    });
    setIsRecordModalOpen(true);
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const clientObj = clients.find((c) => c.name === paymentForm.clientName);

    addPayment({
      ...paymentForm,
      clientId: clientObj?.id || 'cli_101',
      amount: Number(paymentForm.amount),
      amountReceived: Number(paymentForm.amountReceived),
    });

    setIsRecordModalOpen(false);
    showToast('Payment record added to ledger!');
  };

  const handleOpenEditPayment = (pay) => {
    setSelectedInvoice(pay);
    setPaymentForm({
      invoiceNumber: pay.invoiceNumber,
      clientName: pay.clientName,
      packageName: pay.packageName || packages[0]?.name || 'Social Media Retainer',
      amount: String(pay.amount),
      amountReceived: String(pay.amountReceived || (pay.status === 'Paid' ? pay.amount : 0)),
      method: pay.method || 'Bank Transfer',
      date: pay.date,
      dueDate: pay.dueDate,
      status: pay.status,
      notes: pay.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const updatedObj = {
      ...paymentForm,
      amount: Number(paymentForm.amount),
      amountReceived: Number(paymentForm.amountReceived),
    };

    updatePayment(selectedInvoice.id, updatedObj);
    setSelectedInvoice((prev) => ({ ...prev, ...updatedObj }));
    setIsEditModalOpen(false);
    showToast('Payment record updated.');
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteModal.id) {
      deletePayment(confirmDeleteModal.id);
      setIsDrawerOpen(false);
      setSelectedInvoice(null);
      setConfirmDeleteModal({ isOpen: false, id: '', invoiceNumber: '' });
      showToast('Payment entry deleted from ledger.');
    }
  };

  const columns = [
    {
      header: 'Invoice #',
      key: 'invoiceNumber',
      render: (row) => (
        <span className="font-mono font-semibold text-[#8E722A]">{row.invoiceNumber}</span>
      ),
    },
    {
      header: 'Client Name',
      key: 'clientName',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#111111]">{row.clientName}</div>
          <div className="text-[10px] text-[#685C43] font-mono">{row.packageName || 'Retainer Services'}</div>
        </div>
      ),
    },
    {
      header: 'Package Value',
      key: 'amount',
      render: (row) => (
        <span className="font-mono font-bold text-[#111111]">${Number(row.amount).toLocaleString()}</span>
      ),
    },
    {
      header: 'Recv / Balance',
      key: 'amountReceived',
      render: (row) => {
        const rcvd = Number(row.amountReceived || (row.status === 'Paid' ? row.amount : 0));
        const rem = Number(row.amount) - rcvd;
        return (
          <div className="text-[11px] font-mono">
            <span className="text-emerald-700 font-bold">${rcvd.toLocaleString()}</span>
            {rem > 0 && <span className="text-red-700 block text-[10px]">(${rem.toLocaleString()} Due)</span>}
          </div>
        );
      },
    },
    {
      header: 'Method',
      key: 'method',
      render: (row) => (
        <span className="text-[11px] font-mono text-[#685C43]">{row.method || 'Wire'}</span>
      ),
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (row) => (
        <span className={`font-mono text-[11px] ${row.status === 'Overdue' ? 'text-red-700 font-bold' : 'text-[#685C43]'}`}>
          {row.dueDate}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      key: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'Paid' && (
            <button
              onClick={() => handleMarkAsPaid(row.id)}
              className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors"
            >
              Mark Paid
            </button>
          )}
          <button
            onClick={() => handleRowClick(row)}
            className="px-2 py-1 text-[10px] font-mono text-[#8E722A] hover:text-[#111111] transition-colors"
          >
            View
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

      {/* Quick Stats Summary Grid (4 Cards - Stage 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="TOTAL COLLECTED YTD"
          value={`$${totalCollected.toLocaleString()}`}
          trend={18}
          trendLabel="settled retainer revenue"
          icon={DollarSign}
          accentColor="emerald"
        />
        <KpiCard
          label="OUTSTANDING REVENUE"
          value={`$${totalOutstanding.toLocaleString()}`}
          trend={-5}
          trendLabel="pending collections"
          icon={CreditCard}
          accentColor="amber"
        />
        <KpiCard
          label="OVERDUE INVOICES"
          value={overdueCount}
          trend={-2}
          trendLabel="action required"
          icon={AlertCircle}
          accentColor="crimson"
        />
        <KpiCard
          label="SETTLED INVOICES"
          value={payments.filter((p) => p.status === 'Paid').length}
          trend={12}
          trendLabel="fully paid invoices"
          icon={CheckCircle2}
          accentColor="gold"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search invoice #, client name, payment method..."
        filterOptions={isOutstanding || isDue ? [] : ['All', 'Paid', 'Partially Paid', 'Pending', 'Overdue']}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreatePayment}
              className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          </div>
        }
      />

      {/* Main Ledger Table */}
      <AdminCard noPadding>
        <DataTable
          columns={columns}
          data={paginatedPayments}
          onRowClick={handleRowClick}
          emptyTitle={
            isOutstanding
              ? 'No Outstanding Overdue Invoices'
              : isDue
                ? 'No Due Pending Invoices'
                : 'No Payment Records Found'
          }
          emptyMessage="All clear! No invoices match your current filter parameters."
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPayments.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setPageSize}
        />
      </AdminCard>

      {/* ========================================================= */}
      {/* INVOICE DETAIL SLIDE DRAWER                               */}
      {/* ========================================================= */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedInvoice ? `Invoice Breakdown: ${selectedInvoice.invoiceNumber}` : 'Invoice View'}
      >
        {selectedInvoice && (
          <div className="space-y-6 text-xs font-body">
            {/* Status Header */}
            <div className="p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#685C43] font-bold">Financial Status</span>
                <StatusBadge status={selectedInvoice.status} />
              </div>

              {/* Mock Calculation Box */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#0A0A0A]/08 text-center font-mono">
                <div className="p-2 bg-white rounded-xs border border-[#0A0A0A]/06">
                  <span className="text-[9px] text-[#685C43] block">Package Value</span>
                  <strong className="text-xs text-[#111111]">${Number(selectedInvoice.amount).toLocaleString()}</strong>
                </div>
                <div className="p-2 bg-white rounded-xs border border-[#0A0A0A]/06">
                  <span className="text-[9px] text-[#685C43] block">Received</span>
                  <strong className="text-xs text-emerald-700">
                    ${(Number(selectedInvoice.amountReceived) || (selectedInvoice.status === 'Paid' ? Number(selectedInvoice.amount) : 0)).toLocaleString()}
                  </strong>
                </div>
                <div className="p-2 bg-white rounded-xs border border-[#0A0A0A]/06">
                  <span className="text-[9px] text-[#685C43] block">Remaining</span>
                  <strong className="text-xs text-red-700">
                    ${(Number(selectedInvoice.amount) - (Number(selectedInvoice.amountReceived) || (selectedInvoice.status === 'Paid' ? Number(selectedInvoice.amount) : 0))).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="text-[11px] font-body text-[#685C43]">
                Invoice Issued to <strong className="text-[#111111]">{selectedInvoice.clientName}</strong>
              </div>
            </div>

            {/* General Metadata */}
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08 font-mono">
                <span className="text-[#685C43]">Invoice Reference</span>
                <span className="font-semibold text-[#111111]">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08 font-mono">
                <span className="text-[#685C43]">Associated Package</span>
                <span className="text-[#111111]">{selectedInvoice.packageName || 'Digital Media Retainer'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08 font-mono">
                <span className="text-[#685C43]">Payment Method</span>
                <span className="text-[#111111]">{selectedInvoice.method || 'Bank Transfer'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08 font-mono">
                <span className="text-[#685C43]">Issued Date</span>
                <span className="text-[#111111]">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08 font-mono">
                <span className="text-[#685C43]">Due Date</span>
                <span className={selectedInvoice.status === 'Overdue' ? 'text-red-700 font-bold' : 'text-[#111111]'}>
                  {selectedInvoice.dueDate}
                </span>
              </div>
            </div>

            {/* Installment Schedule Breakdown */}
            <div className="space-y-3 pt-3 border-t border-[#0A0A0A]/10">
              <div className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider">
                Installment Payment Breakdown
              </div>
              <div className="space-y-2">
                {(selectedInvoice.installments || [
                  { number: 1, amount: Number(selectedInvoice.amount), dueDate: selectedInvoice.dueDate, status: selectedInvoice.status }
                ]).map((inst, idx) => (
                  <div key={idx} className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="font-bold text-[#111111]">Installment #{inst.number || idx + 1}</span>
                      <span className="text-[10px] text-[#685C43] block">Due: {inst.dueDate || selectedInvoice.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#111111]">${Number(inst.amount).toLocaleString()}</span>
                      <StatusBadge status={inst.status || selectedInvoice.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#0A0A0A]/10 space-y-2">
              {selectedInvoice.status !== 'Paid' && (
                <button
                  onClick={() => handleMarkAsPaid(selectedInvoice.id)}
                  className="w-full py-2.5 bg-[#8E722A] hover:bg-[#725B20] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Full Settlement (${selectedInvoice.amount.toLocaleString()})</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEditPayment(selectedInvoice)}
                  className="flex-1 py-2 bg-[#FAF8F3] border border-[#0A0A0A]/10 text-xs font-mono font-bold text-[#111111] hover:bg-[#8E722A] hover:text-white transition-colors"
                >
                  Edit Entry
                </button>
                <button
                  onClick={() => setConfirmDeleteModal({ isOpen: true, id: selectedInvoice.id, invoiceNumber: selectedInvoice.invoiceNumber })}
                  className="py-2 px-3 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono font-bold rounded-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* ========================================================= */}
      {/* MODALS: CREATE & EDIT PAYMENT                             */}
      {/* ========================================================= */}
      <AdminModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Payment / Create Invoice"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <FormInput
            label="Invoice Reference #"
            value={paymentForm.invoiceNumber}
            onChange={(e) => setPaymentForm({ ...paymentForm, invoiceNumber: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Client"
              value={paymentForm.clientName}
              onChange={(e) => setPaymentForm({ ...paymentForm, clientName: e.target.value })}
              options={clients.map((c) => c.name)}
            />
            <FormSelect
              label="Associated Package"
              value={paymentForm.packageName}
              onChange={(e) => setPaymentForm({ ...paymentForm, packageName: e.target.value })}
              options={packages.map((p) => p.name)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Total Package Value ($ USD)"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              required
            />
            <FormInput
              label="Amount Received ($ USD)"
              type="number"
              value={paymentForm.amountReceived}
              onChange={(e) => setPaymentForm({ ...paymentForm, amountReceived: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Payment Method"
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              options={['Bank Transfer', 'Wire Transfer', 'Cheque / Wire', 'Credit Card']}
            />
            <FormSelect
              label="Payment Status"
              value={paymentForm.status}
              onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
              options={['Paid', 'Partially Paid', 'Pending', 'Overdue']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Payment Date"
              type="date"
              value={paymentForm.date}
              onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
              required
            />
            <FormInput
              label="Due Date"
              type="date"
              value={paymentForm.dueDate}
              onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider block mb-1">
              Internal Ledger Notes
            </label>
            <textarea
              rows={2}
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs font-body border border-[#0A0A0A]/14 rounded-xs focus:outline-none focus:border-[#8E722A]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 text-xs font-mono text-[#685C43]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors"
            >
              Save Payment Record
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Payment Entry"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <FormInput
            label="Invoice Reference #"
            value={paymentForm.invoiceNumber}
            onChange={(e) => setPaymentForm({ ...paymentForm, invoiceNumber: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Package Value ($)"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
            />
            <FormInput
              label="Amount Received ($)"
              type="number"
              value={paymentForm.amountReceived}
              onChange={(e) => setPaymentForm({ ...paymentForm, amountReceived: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Status"
              value={paymentForm.status}
              onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
              options={['Paid', 'Partially Paid', 'Pending', 'Overdue']}
            />
            <FormSelect
              label="Method"
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              options={['Bank Transfer', 'Wire Transfer', 'Cheque / Wire', 'Credit Card']}
            />
          </div>

          <FormInput
            label="Due Date"
            type="date"
            value={paymentForm.dueDate}
            onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
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
              Update Payment Record
            </button>
          </div>
        </form>
      </AdminModal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ isOpen: false, id: '', invoiceNumber: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment Entry"
        message={`Are you sure you want to delete invoice "${confirmDeleteModal.invoiceNumber}"? This will update ledger balances.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};

