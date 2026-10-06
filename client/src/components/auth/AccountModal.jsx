import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, User, Shield, Briefcase, Mail, Calendar, LogOut, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccountModal = () => {
  const { user, isAdmin, isAccountModalOpen, accountModalTab, closeAccountModal, signOut } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAccountModalOpen) {
        closeAccountModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccountModalOpen, closeAccountModal]);

  if (!isAccountModalOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0A0A]/70 backdrop-blur-sm transition-opacity"
        onClick={closeAccountModal}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-xl bg-[#F7F5EF] text-[#0A0A0A] rounded-[6px] shadow-2xl border border-[#0A0A0A]/10 z-10 overflow-hidden flex flex-col font-body max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#0A0A0A] text-[#F7F5EF] px-6 py-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C8A13A] text-[#0A0A0A] font-bold text-sm flex items-center justify-center font-body shadow-inner">
              {user.initials || 'AM'}
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight tracking-wide font-body text-white">
                {user.name}
              </h3>
              <p className="text-xs text-[#C8A13A] font-body mt-0.5">{user.role || 'ASN Media Client Partner'}</p>
            </div>
          </div>

          <button
            onClick={closeAccountModal}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Admin Banner if Admin */}
          {isAdmin && (
            <div className="p-4 bg-[#C8A13A]/15 rounded-[4px] border border-[#C8A13A]/40 flex items-center justify-between shadow-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Shield className="w-5 h-5 text-[#8E722A] shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                    Admin Privileges Active
                  </span>
                  <span className="text-[11px] text-[#66615A] block truncate">
                    Access agency operations, staff, payments & review scanners
                  </span>
                </div>
              </div>
              <Link
                to="/admin/dashboard"
                onClick={closeAccountModal}
                className="px-3.5 py-1.5 bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] text-xs font-mono font-bold uppercase rounded-[3px] transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Admin Panel</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-white rounded-[4px] border border-[#0A0A0A]/08 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#8E722A]" />
              <div>
                <span className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wider block">
                  Account Status: Active
                </span>
                <span className="text-[11px] text-[#66615A]">Connected to ASN Media Client Portal</span>
              </div>
            </div>
            <span className="text-[10px] tracking-widest font-semibold uppercase px-2.5 py-1 bg-[#C8A13A]/15 text-[#8E722A] rounded-[3px]">
              VERIFIED
            </span>
          </div>

          {/* Account Details Grid */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#66615A]">
              ACCOUNT DETAILS
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-[4px] border border-[#0A0A0A]/08 flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C8A13A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#66615A] block">Email Address</span>
                  <span className="text-xs font-medium text-[#0A0A0A] break-all">{user.email}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-[4px] border border-[#0A0A0A]/08 flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-[#C8A13A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#66615A] block">Company / Brand</span>
                  <span className="text-xs font-medium text-[#0A0A0A]">{user.company || 'ASN Media Network'}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-[4px] border border-[#0A0A0A]/08 flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#C8A13A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#66615A] block">Partner Since</span>
                  <span className="text-xs font-medium text-[#0A0A0A]">{user.memberSince || '2025'}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-[4px] border border-[#0A0A0A]/08 flex items-start gap-3">
                <Shield className="w-4 h-4 text-[#C8A13A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#66615A] block">Portal Access Level</span>
                  <span className="text-xs font-medium text-[#0A0A0A]">
                    {isAdmin ? 'Administrator Access' : 'Standard Client Access'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#0A0A0A]/08 flex items-center justify-between">
          <button
            onClick={() => {
              signOut();
              closeAccountModal();
            }}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-700 hover:text-red-900 hover:bg-red-50 rounded-[3px] transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={closeAccountModal}
            className="px-5 py-2.5 bg-[#0A0A0A] text-[#F7F5EF] hover:bg-[#C8A13A] hover:text-[#0A0A0A] text-xs font-semibold tracking-wider uppercase rounded-[3px] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
