'use client';

import React from 'react';
import Image from 'next/image';
import LogoWhite from '@/icons/logo-white';

interface Props {
  visible: boolean;
  firstName?: string;
  onClose: () => void;
}

export default function ProfileCompletionModal({ visible, firstName = 'there', onClose }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-[#0b1220]/55 p-4 flex items-center justify-center">
      <div className="w-full max-w-[520px]  rounded-2xl bg-white  overflow-hidden shadow-2xl">
        <div className="relative h-[260px]  sm:h-[330px]">
          <Image
            src="/signin/welcome.webp"
            alt="Orisuun welcome"
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 " />
          <div className="absolute inset-0 flex items-center justify-center">
            <LogoWhite className="w-[180px] sm:w-[360px] h-auto text-white" />
          </div>
        </div>

        <div className="px-6 sm:px-10 pt-8 pb-9 text-center h-[420px]">
          <h2 className="text-[#0f214f] text-[34px] sm:text-2xl font-semibold leading-[1.1]">
            Welcome {firstName},
          </h2>

          <p className="mt-12 text-[#4b5563] text-sm sm:text-base font-medium leading-tight">
            Please complete your profile
            <br />
            to enter the network
          </p>

          <div className="mt-8 flex flex-col items-center">
            
            <p className="mt-4 text-[#4b5563] text-sm sm:text-lg font-semibold leading-tight">
              5 Minutes
              <br />
              Away
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 w-full sm:w-[360px] rounded-[10px] bg-gradient-to-r from-[#1d4ed8] to-[#4f87ff] text-white text-base sm:text-lg font-medium leading-none py-3"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
