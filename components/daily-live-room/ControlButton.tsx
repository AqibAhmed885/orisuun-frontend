'use client';

import type { ReactNode } from 'react';
import { cloneElement, isValidElement, type ReactElement } from 'react';

type Props = {
  label: string;
  icon: ReactNode;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  badge?: number;
};

function FeatureIconRenderer({ icon, className = '' }: { icon: ReactNode; className?: string }) {
  if (isValidElement(icon)) {
    return cloneElement(icon as ReactElement<{ className?: string }>, {
      className,
    });
  }

  return <>{icon}</>;
}

export default function ControlButton({
  label,
  icon,
  active = false,
  danger = false,
  disabled = false,
  onClick,
  badge,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex min-w-[72px] flex-col items-center gap-1 text-xs md:text-xs ${
        danger || active ? 'text-white' : 'text-white'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <span
        className={`flex items-center justify-center rounded-full text-lg ${
          danger
            ? 'bg-[#f44336] h-[46px] w-[46px]'
            : active
              ? 'bg-[#2d5bd1] h-[34px] w-[34px]'
              : 'bg-[#626b81] h-[34px] w-[34px]'
        }`}
      >
        <FeatureIconRenderer icon={icon} className="" />
      </span>
      <span>{label}</span>
      {badge && badge > 0 ? (
        <span className="absolute -right-1 top-0 rounded-full bg-[#f44336] px-1.5 py-0.5 text-[10px] text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  );
}
