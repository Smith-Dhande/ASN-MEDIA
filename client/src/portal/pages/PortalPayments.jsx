import React, { useState } from 'react';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { KpiCard } from '../../admin/components/ui/KpiCard';
import { CreditCard, DollarSign, AlertCircle, Download, CheckCircle2, Calendar, FileText } from 'lucide-react';

export const PortalPayments = () => {
  const { currentClient, clientPayments } = usePortalClient();
  const [toastMsg, setToastMsg] = useState('');

  const totalPaid = clientPayments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, p) => acc + (Number(p.amountReceived) || Number(p.amount) || 0), 0);

  const outstanding = clientPayments
    .filter((p) => p.status === 'Overdue' || p.status === 'Pending' || p.status === 'Partially Paid')
    .reduce((acc, p) => acc + (Number(p.amount) - (Number(p.amountReceived) || 0)), 0);

  const overdueCount = clientPayments.filter((p) => p.status === 'Overdue').length;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-body">
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-md flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-3 border-b border-[#0A0A0A]/08">
        <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
          FINANCIAL LEDGER & BILLING
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
          Payments & Invoice Records
        </h1>
      </div>

      {/* 4 Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="MONTHLY AGREEMENT"
          value={`₹${currentClient?.monthlyRetainer?.toLocaleString('en-IN')}/mo`}
          trendLabel="active contract rate"
          icon={DollarSign}
          accentColor="gold"
        />
        <KpiCard
          label="TOTAL SETTLED YTD"
          value={`₹${totalPaid.toLocaleString('en-IN')}`}
          trendLabel="total payments completed"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <KpiCard
          label="OUTSTANDING BALANCE"
          value={`₹${outstanding.toLocaleString('en-IN')}`}
          trendLabel="money owed on active invoices"
          icon={CreditCard}
          accentColor={outstanding > 0 ? 'amber' : 'emerald'}
        />
        <KpiCard
          label="OVERDUE INVOICES"
          value={overdueCount}
          trendLabel={overdueCount > 0 ? 'past due date' : 'no overdue payments'}
          icon={AlertCircle}
          accentColor={overdueCount > 0 ? 'crimson' : 'emerald'}
        />
      </div>

      {/* Invoice History Table Card */}
      <AdminCard title={`Invoice History (${clientPayments.length})`} className="p-5">
        {clientPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#0A0A0A]/10 text-[10px] text-[#685C43] uppercase bg-[#FAF8F3]">
                  <th className="py-2.5 px-3">INVOICE #</th>
                  <th className="py-2.5 px-3">DATE</th>
                  <th className="py-2.5 px-3">DUE DATE</th>
                  <th className="py-2.5 px-3">AMOUNT (₹)</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A0A0A]/06">
                {clientPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#8E722A]">{pay.invoiceNumber}</td>
                    <td className="py-3 px-3 text-[#685C43]">{pay.date}</td>
                    <td className="py-3 px-3 text-[#685C43]">{pay.dueDate || 'N/A'}</td>
                    <td className="py-3 px-3 font-bold text-[#111111]">
                      ₹{pay.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={pay.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => showToast(`Generating PDF receipt for invoice ${pay.invoiceNumber}...`)}
                        className="px-2.5 py-1 text-[11px] bg-white border border-[#0A0A0A]/12 hover:border-[#8E722A] text-[#111111] rounded flex items-center gap-1 ml-auto"
                      >
                        <Download className="w-3 h-3 text-[#8E722A]" />
                        <span>PDF Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#685C43] font-mono italic">No billing records found for your account.</p>
        )}
      </AdminCard>
    </div>
  );
};
