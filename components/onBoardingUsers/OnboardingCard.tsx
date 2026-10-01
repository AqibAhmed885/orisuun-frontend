'use client';

import Image from "next/image";

interface OnboardingCardProps {
  icon: string; // Changed from React.ReactNode to string
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function OnboardingCard({ icon, title, description, selected = false, onClick }: OnboardingCardProps) {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      onClick={onClick}
    >
      <div>
        <span className="inline-flex items-center justify-center p-2 rounded-lg ">
          <Image
            src={icon}
            alt={title}
            className="w-4 h-4  object-contain"
            width={80}
            height={80}
            loading="eager"
            quality={85}
          />
        </span>
        {/* Responsive title: smaller on mobile, base (16px) on desktop */}
        <h3 className="font-semibold text-[14px] text-[#101828] mb-0.5 ">
          {title}
        </h3>
        {/* Responsive description: smaller on mobile, up to 12px on desktop */}
        <p className="text-[11px]  text-[#667085] ">
          {description}
        </p>
      </div>
    </div>
  );
}