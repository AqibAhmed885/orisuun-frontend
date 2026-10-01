
'use client';

import React from 'react';
import Image from 'next/image';
import LogoWhite from '@/icons/logo-white';

interface Props {
  visible?: boolean;
  firstName?: string;
  onClose?: () => void;
}

export default function NewUserWelcomeModal({ visible, firstName = 'There', onClose }: Props) {

  return (
    <div className=" mb-6 bg-white rounded-2xl shadow-blur overflow-hidden  flex items-center justify-center">
      <div className="w-full  h-auto md:h-[640px] max-h-[90vh] rounded-2xl bg-white overflow-hidden shadow-2xl">
        <div className="relative h-[300px] sm:h-[360px] md:h-[420px] overflow-visible">
          <Image
            src="/signin/welcome.svg"
            alt="Orisuun welcome"
            fill
            sizes="(max-width: 768px) 100vw, 860px"
            className="object-cover overflow-visible"
          />

          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
            <LogoWhite className="h-10 md:h-36 w-auto text-white" />
          </div>
        </div>

        <div className="px-5 sm:px-6 md:px-12 py-8 md:py-7 text-center justify-center">
          <h2 className="text-[#102148] text-3xl md:text-4xl font-semibold leading-tight text-center">
            Welcome {firstName},
          </h2>
          <p className="mt-4 text-[#4B5563] text-base md:text-lg space-y-3 text-center">
            We&apos;re so glad you&apos;re here! Orisuun is made for you. We&apos;re here to make Orisuun exactly what you need it to be. So don&apos;t hesitate to let us know what you&apos;re thinking.
          </p>
        </div>
      </div>
    </div>
  );
}
