import { cn } from '@/utils/utils';
import React from 'react';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<IProps> = ({
  title,
  variant = 'primary',
  className,
  loading = false,
  startIcon,
  endIcon,
  ...rest
}) => {
  const baseStyles =
    'px-4 py-3 rounded-md bg-omblue-500 text-scaled-h9 text-white w-[170px] font-semibold disabled:bg-omblue-50 disabled:text-omblue-200';

  const variantStyles = {
    primary:
      'min-w-full w-full btn-secondary min-w-[170px] hover:bg-opacity-90 flex items-center justify-center gap-4',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...rest}
    >
      {startIcon && startIcon}
      {loading ? 'Processing...' : title}
      {endIcon && endIcon}

      {loading ? (
        <div className="inline-flex w-5 h-5 border-4 border-t-transparent justify-center border-white border-solid rounded-full animate-spin"></div>
      ) : null}
    </button>
  );
};

export default Button;
