import { cn } from '@/utils/utils';
import React from 'react';

interface SwitchProps {
  label?: string;
  isOn: boolean;
  onToggle: () => void;
  isTitle?: string;
  size?: 'default' | 'sm';
}

const Switch: React.FC<SwitchProps> = ({ label, isOn, onToggle, isTitle, size = 'default' }) => {
  const isSmall = size === 'sm';

  return (
    <div className={`w-full flex items-center ${label ? 'justify-between' : 'justify-center'} py-2`}>
      {label && (
        <span className="w-[calc(100%-5rem)] text-[14px] 2xl:text-scaled-h9 font-semibold text-[#080808]">
          {label}
        </span>
      )}
      <button
        onClick={onToggle}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ring-0',
          isSmall ? 'h-8 w-14 text-xs' : 'h-[3rem] w-[6rem] text-h9 2xl:text-scaled-h9',
          isOn ? 'text-blue-500 bg-[#B6C2DB33]' : 'bg-[#EAECF0] text-[#344054]'
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full transition duration-200 ease-in-out',
            isSmall ? 'h-8 w-8' : 'h-[3rem] w-[3rem]',
            isOn
              ? isSmall ? 'translate-x-6 bg-omblue-500' : 'translate-x-[3rem] bg-omblue-500'
              : 'translate-x-[0rem] bg-omblue-100'
          )}
        />
        <span
          className={cn(
            'absolute font-medium',
            isSmall ? 'text-[10px]' : 'text-base',
            isOn
              ? isSmall ? 'text-blue-500 left-1.5' : 'text-blue-500 left-[0.5rem]'
              : isSmall ? 'text-blue-100 right-1.5' : 'text-blue-100 right-[0.5rem]'
          )}
        >
          {isOn ? (isTitle ? 'YES' : 'ON') : isTitle ? 'NO' : 'OFF'}
        </span>
      </button>
    </div>
  );
};

export default Switch;
