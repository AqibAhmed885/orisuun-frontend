'use client';

import React from 'react';

interface BadgeProps {
  title: string; // Text to display in the badge
  rounded?: string; // Tailwind class for rounded corners
  color?: string; // Text color (e.g., 'text-red-500')
  bgColor?: string; // Background color (e.g., 'bg-red-100')
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ title, rounded, color, bgColor, className }) => {
  return (
    <span
      className={`inline-flex items-center px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        rounded || 'rounded-full'
      } ${color || 'text-nav-blue'} ${bgColor || 'bg-[#F2F7FC]'} ${className}`}
    >
      {title}
    </span>
  );
};

export default Badge;
