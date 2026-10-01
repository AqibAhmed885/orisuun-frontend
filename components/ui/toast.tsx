import React, { useEffect } from 'react';
import classNames from 'classnames';
import WarningIcon from '@/icons/warning-icon';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  duration?: number; // Time in milliseconds for auto-dismiss
  onClose?: () => void;
  fixed?: boolean;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  isVisible,
  duration = 3000,
  onClose,
  fixed,
  className
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const toastStyles = classNames(
    ` ${fixed ? 'fixed bottom-4 right-4 p-4 ' : ''} ${className} rounded-md shadow-md flex items-center gap-2 transition-transform transform`,
    {
      'bg-green-500 text-white': type === 'success',
      'bg-red-500 text-white': type === 'error',
      'bg-blue-500 text-white': type === 'info',
      'bg-yellow-500 text-black': type === 'warning',
    }
  );

  return (
    <div className={toastStyles}>
      <span>
        {type === 'success' && <WarningIcon />}
        {type === 'error' && <WarningIcon />}
        {type === 'info' && <WarningIcon />}
        {type === 'warning' && <WarningIcon />}
      </span>
      <p>{message}</p>
      <button className="ml-auto text-sm font-bold underline" onClick={onClose && onClose}>
        Close
      </button>
    </div>
  );
};

export default Toast;
