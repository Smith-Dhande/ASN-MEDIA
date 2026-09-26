import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  title = 'No records found',
  message = 'There are no items to display right now.',
  action,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[6px] border border-[#0A0A0A]/12 my-2">
      <div className="p-3 bg-[#F7F5EF] rounded-full text-[#8E722A] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-display text-lg text-[#0A0A0A] font-semibold mb-1">
        {title}
      </h4>
      <p className="text-xs text-[#66615A] font-body max-w-sm mb-4">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
