import { cn } from '@/utils/utils';
import React from 'react';

const Tag = ({
  status,
  text,
}: {
  status: 'pending' | 'processing' | 'fulfilled' | 'In-Progress' | 'Draft' | 'Completed' | 'Dispute';
  text: string;
}) => {
  return (
    <div
      className={cn(
        'text-h10 2xl:text-scaled-h10 font-semibold inline-flex rounded-md px-2 py-1 text-center',
        (status === 'pending' || status === "In-Progress")
          ? 'text-warning-600 bg-warning-50'
          : (status === 'processing' || status === 'Draft')
          ? 'text-omblue-500 bg-omblue-50':
          (status === 'Dispute' )
          ? 'text-[#60A3D2] bg-[#F0F7FD]'
          : 'text-success-500 bg-success-50'
      )}
    >
      {text}
    </div>
  );
};

export default Tag;
