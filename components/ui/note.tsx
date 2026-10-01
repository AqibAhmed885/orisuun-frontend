import InfoIcon from '@/icons/info-icon';
import WarningIcon from '@/icons/warning-icon';
import { cn } from '@/utils/utils';
import React from 'react';

const Note = ({
  text,
  status = 'warning',
}: {
  text: string;
  status?: 'warning' | 'error' | 'success' | 'info';
}) => {
  return (
    <div
      className={cn(
        'flex items-center p-2 border gap-2 rounded-md',
        status === 'warning'
          ? 'bg-warning-50 border-warning-200 text-warning-700'
          : status === 'error'
          ? 'bg-danger-50 border-danger-200 text-danger-700'
          : status === 'info'
          ? 'bg-olblue-50 border-olblue-200 text-olblue-800'
          : ''
      )}
    >
      {status === 'info' ? (
        <InfoIcon className="w-6 h-6" />
      ) : (
        <WarningIcon className="w-6 h-6" />
      )}
      <p className="font-medium text-h10 2xl:text-scaled-h10">{text}</p>
    </div>
  );
};

export default Note;
