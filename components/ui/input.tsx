'use client';

import { cn } from '@/utils/utils';
import React, {
  forwardRef,
  InputHTMLAttributes,
  useState,
  ReactNode,
} from 'react';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  containerClass?: string;
  isPercentage?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  iconClasses?: string;
  iconControlClasses?: string;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, IProps> = (
  {
    className,
    error,
    type,
    containerClass,
    isPercentage = false,
    icon,
    iconControlClasses,
    disabled = false,
    iconClasses,
    ...rest
  },
  ref
) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPassword = type === 'password';

  return (
    <div className={cn('md:w-auto w-full', containerClass)}>
      <div className="relative">
        {icon && (
          <div
            className={`absolute text-gray-400 -translate-y-1/2 top-1/2 left-3 ${iconClasses}`}
          >
            {icon}
          </div>
        )}
        <input
          ref={ref}
          {...rest}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={cn(
            'border bg-white text-h7 2xl:text-scaled-h9 font-medium py-3 rounded-md w-full',
            'focus:outline-none focus:border-omblue-500 focus:bg-[#f3f7f9]',
            'transition-colors duration-200',
            error ? 'border-red-500' : 'border-black-200',
            icon ? '!pl-10' : 'px-4',
            isPassword ? 'pr-16' : '',
            isPercentage ? 'pr-10' : '',
            className,
            icon && iconControlClasses
          )}
          disabled={disabled}
          autoComplete="off"
        />
        {isPercentage && (
          <div
            className={cn(
              'absolute top-[1px] right-[1px] h-[calc(100%-2px)]',
              'bg-olblue-50 text-black-500 flex items-center justify-center px-3 rounded-tr-md rounded-br-md pointer-events-none'
            )}
          >
            <p aria-label="Percentage" className="text-h9 2xl:text-scaled-h9">
              %
            </p>
          </div>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute text-gray-500 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <p
                aria-label="Hide Password"
                className="text-h10 2xl:text-scaled-h10 text-omblue-500"
              >
                hide
              </p>
            ) : (
              <p
                aria-label="Show Password"
                className="text-h10 2xl:text-scaled-h10 text-omblue-500"
              >
                show
              </p>
            )}
          </button>
        )}
      </div>
      {error && <span className="mx-2 text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default forwardRef(Input);
