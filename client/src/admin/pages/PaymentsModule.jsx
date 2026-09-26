import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { CreditCard, DollarSign, AlertCircle, Calendar, FileText, CheckCircle2, ArrowUpRight, Plus, Download } from 'lucide-react';

export const PaymentsModule = () => {
  const { payments: initialPayments, dashboardMetrics } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentsList, setPaymentsList] = useState(initialPayments || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form State for Recording Payment / Creating Invoice
  const [recordForm, setRecordForm] = useState({
    invoiceNumber: `INV-2026-090${(paymentsList.length + 1)}`,
    clientName: 'Aura Luxury Beauty',
    amount: '4500',
    method: 'Bank Transfer',
    dueDate: '2026-10-15',
    notes: 'Standard retainer invoice',
  });
  const [recordSuccess, setRecordSuccess] = useState(false);

  // Determine sub-tab route
  const isOutstanding = location.pathname.includes('/outstanding');
  const isDue = location.pathname.includes('/due');

  // Filter payments based on path + search + status filter
  const filteredPayments = paymentsList.filter((pay) => {
    // Path-based filter
    if (isOutstanding && pay.status !== 'Overdue') return false;
    if (isDue && pay.status !== 'Pending') return false;

    // Search filter
    const matchesSearch =
      pay.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      pay.clientName.toLowerCase().includes(search.toLowerCase()) ||
      pay.method.toLowerCase().includes(search.toLowerCase());

    // Status filter (for general view)
    const matchesStatus =
      statusFilter === 'All' || pay.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalCollected = paymentsList
    .filter((p) => p.status === 'Paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalOutstanding = paymentsList
    .filter((p) => p.status === 'Overdue' || p.status === 'Pending')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const overdueCount = paymentsList.filter((p) => p.status === 'Overdue').length;

  const handleRowClick = (pay) => {
    setSelectedInvoice(pay);
    setIsDrawerOpen(true);
  };

  const handleMarkAsPaid = (payId) => {
    setPaymentsList((prev) =>
      prev.map((p) => (p.id === payId ? { ...p, status: 'Paid' } : p))
    );
    if (selectedInvoice && selectedInvoice.id === payId) {
      setSelectedInvoice((prev) => ({ ...prev, status: 'Paid' }));
    }
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      id: `pay_${Date.now()}`,
      invoiceNumber: recordForm.invoiceNumber,
      clientName: recordForm.clientName,
      clientId: `cli_${Math.floor(Math.random() * 800 + 100)}`,
      amount: parseFloat(recordForm.amount) || 0,
      method: recordForm.method,
      date: new Date().toISOString().split('T')[0],
      dueDate: recordForm.dueDate,
      status: 'Paid',
    };

    setPaymentsList([newPayment, ...paymentsList]);
    setRecordSuccess(true);
    setTimeout(() => {
      setRecordSuccess(false);
      setIsRecordModalOpen(false);
    }, 1200);
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
          <div className="text-[10px] text-[#66615A] font-mono">ID: {row.clientId}</div>
        </div>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (row) => (
        <span className="font-mono font-bold text-[#111111]">${row.amount.toLocaleString()}</span>
      ),
    },
    {
      header: 'Payment Method',
      key: 'method',
      render: (row) => (
        <span className="text-[11px] font-mono text-[#66615A]">{row.method}</span>
      ),
    },
    {
      header: 'Invoice Date',
      key: 'date',
      render: (row) => <span className="font-mono text-[#66615A] text-[11px]">{row.date}</span>,
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (row) => (
        <span className={`font-mono text-[11px] ${row.status === 'Overdue' ? 'text-red-700 font-bold' : 'text-[#66615A]'}`}>
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
    <div className="space-y-6">
      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminCard className="p-4 border-l-4 border-l-[#8E722A]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Total Collected</div>
              <div className="text-2xl font-bold font-mono text-[#111111] mt-1">${totalCollected.toLocaleString()}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#8E722A]/10 flex items-center justify-center text-[#8E722A]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-[#C8A13A]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Outstanding Revenue</div>
              <div className="text-2xl font-bold font-mono text-[#111111] mt-1">${totalOutstanding.toLocaleString()}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C8A13A]/10 flex items-center justify-center text-[#C8A13A]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Overdue Invoices</div>
              <div className="text-2xl font-bold font-mono text-red-700 mt-1">{overdueCount} Alert</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search invoice #, client name, payment method..."
        filterOptions={isOutstanding || isDue ? [] : ['All', 'Paid', 'Pending', 'Overdue']}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          </div>
        }
      />

      {/* Main Ledger Table */}
      <DataTable
        columns={columns}
        data={filteredPayments}
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

      {/* Invoice Detail Drawer */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedInvoice ? `Invoice Details: ${selectedInvoice.invoiceNumber}` : 'Invoice View'}
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#66615A]">Status</span>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <div className="text-2xl font-bold font-mono text-[#111111]">
                ${selectedInvoice.amount.toLocaleString()} <span className="text-xs font-normal text-[#66615A]">USD</span>
              </div>
              <div className="text-xs font-body text-[#66615A]">
                Invoice Issued to <strong className="text-[#111111]">{selectedInvoice.clientName}</strong>
              </div>
            </div>

            <div className="space-y-3 text-xs font-body">
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08">
                <span className="text-[#66615A]">Invoice Number</span>
                <span className="font-mono font-semibold text-[#111111]">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08">
                <span className="text-[#66615A]">Client ID</span>
                <span className="font-mono text-[#111111]">{selectedInvoice.clientId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08">
                <span className="text-[#66615A]">Payment Method</span>
                <span className="font-mono text-[#111111]">{selectedInvoice.method}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08">
                <span className="text-[#66615A]">Invoice Date</span>
                <span className="font-mono text-[#111111]">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0A0A0A]/08">
                <span className="text-[#66615A]">Due Date</span>
                <span className={`font-mono ${selectedInvoice.status === 'Overdue' ? 'text-red-700 font-bold' : 'text-[#111111]'}`}>
                  {selectedInvoice.dueDate}
                </span>
              </div>
            </div>

            {selectedInvoice.status !== 'Paid' && (
              <div className="pt-4 border-t border-[#0A0A0A]/10">
                <button
                  onClick={() => handleMarkAsPaid(selectedInvoice.id)}
                  className="w-full py-2.5 bg-[#8E722A] hover:bg-[#725B20] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payment Received (${selectedInvoice.amount.toLocaleString()})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </SlideDrawer>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#0A0A0A]/14 rounded-md shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A0A0A]/10 pb-3">
              <h3 className="font-serif font-semibold text-lg text-[#111111]">Record Payment / New Invoice</h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-[#66615A] hover:text-[#111111] text-sm">✕</button>
            </div>

            {recordSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="font-serif text-lg font-semibold text-[#111111]">Payment Recorded Successfully</div>
                <div className="text-xs font-mono text-[#66615A]">Ledger updated and receipt queued.</div>
              </div>
            ) : (
              <form onSubmit={handleRecordSubmit} className="space-y-4">
                <FormInput
                  label="Invoice Number"
                  value={recordForm.invoiceNumber}
                  onChange={(e) => setRecordForm({ ...recordForm, invoiceNumber: e.target.value })}
                  required
                />
                <FormInput
                  label="Client Name"
                  value={recordForm.clientName}
                  onChange={(e) => setRecordForm({ ...recordForm, clientName: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Amount ($ USD)"
                    type="number"
                    value={recordForm.amount}
                    onChange={(e) => setRecordForm({ ...recordForm, amount: e.target.value })}
                    required
                  />
                  <FormSelect
                    label="Payment Method"
                    value={recordForm.method}
                    onChange={(e) => setRecordForm({ ...recordForm, method: e.target.value })}
                    options={['Bank Transfer', 'Wire Transfer', 'Cheque / Wire', 'Credit Card']}
                  />
                </div>
                <FormInput
                  label="Due Date"
                  type="date"
                  value={recordForm.dueDate}
                  onChange={(e) => setRecordForm({ ...recordForm, dueDate: e.target.value })}
                  required
                />

                <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
                  <button
                    type="button"
                    onClick={() => setIsRecordModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-[#66615A] hover:text-[#111111]"
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};
