import { cn } from '@/utils/utils';
import React from 'react';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

const PaymentButton: React.FC<IProps> = ({
  icon,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={cn(
        'w-full border border-brand-primary rounded-lg py-4 px-8 max-h-[64px] flex items-center justify-center',
        className
      )}
    >
      {icon ?? null}
    </button>
  );
};

export default PaymentButton;
