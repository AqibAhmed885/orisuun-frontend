import React from 'react';

interface NotificationBadgeProps {
  number: number;
  className?: string;
  expanded?: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  number,
  className,
  expanded,
}) => {
  return (
    <div
      className={`flex items-center px-1 justify-center ${
        expanded
          ? 'min-w-6 w-max h-3'
          : 'min-w-3 !h-3 w-max absolute top-0.5 right-1.5'
      } bg-olblue-500 text-white text-[10px] rounded-full ${className}`}
    >
      {number}
    </div>
  );
};

export default NotificationBadge;
