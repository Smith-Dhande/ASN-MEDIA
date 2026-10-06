import React from 'react';
import { AdminModal } from './AdminModal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action? This step cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-semibold uppercase border border-[#0A0A0A]/20 rounded-xs text-[#0A0A0A] hover:bg-[#F7F5EF]"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm && onConfirm();
              onClose && onClose();
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-xs text-white shadow-xs ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#0A0A0A] hover:bg-[#C8A13A] hover:text-[#0A0A0A]'
            }`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div className={`p-2.5 rounded-full ${isDanger ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
          <AlertTriangle className="w-5 h-5 shrink-0" />
        </div>
        <p className="text-xs text-[#66615A] font-body leading-relaxed pt-1">
          {message}
        </p>
      </div>
    </AdminModal>
  );
};
