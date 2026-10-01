import React, { forwardRef } from 'react';
import { cn } from '@/utils/utils';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedColor?: string;
  unselectedColor?: string;
  children: React.ReactNode;
  truncate?: boolean;
  loading?: boolean;
  spanColor? :string,
}

const Toggle: React.ForwardRefRenderFunction<HTMLInputElement, ToggleProps> = (
  {
    children,
    selectedColor = 'border border-omblue-100 text-omblue-500 bg-[#F2F7FC]',
    unselectedColor = 'border border-[#B2B3B3] bg-white text-[#3D3D3D]',
    className = '',
    truncate = true,
    loading = false,
    checked = false, // Provide a default value here
    spanColor = "",
    ...props
  },
  ref
) => {
  return (
    <label
      className={cn(
        'w-full h-auto inline-flex items-center p-4 rounded-lg cursor-pointer font-semibold text-h9 2xl:text-scaled-h9 transition-colors duration-200 ease-in-out',
        checked ? selectedColor : unselectedColor,
        className
      )}
    >
      <input
        ref={ref}
        type="radio"
        className="hidden text-h9 2xl:text-scaled-h9"
        checked={checked || false}
        {...props}
      />
      {loading ? (
        <span className="w-full text-h9 2xl:text-scaled-h9">
          <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
        </span>
      ) : (
        <span
          className={cn(`w-full text-h9 2xl:text-scaled-h9 ${checked ? spanColor || ' text-omblue-500 ' : ''}`, {
            truncate: truncate,
          })}
        >
          {children}
        </span>
      )}
    </label>
  );
};

export default forwardRef(Toggle);