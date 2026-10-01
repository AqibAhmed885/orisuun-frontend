'use client';

import type { ThemePalette } from './live-room-theme';

type Props = {
  theme: ThemePalette;
};

export default function LoadingState({ theme }: Props) {
  return (
    <section className={`min-h-screen w-full transition-colors duration-300 ${theme.page} ${theme.text}`}>
      <div className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-4 py-8">
        <div className={`w-full max-w-2xl h-[340px] rounded-[18px] border p-8 bg-[url('/loader-logo.svg')] bg-cover object-bottom text-center ${theme.panel} ${theme.border} ${theme.cardShadow}`}>
          {/* <h1 className="mt-4 text-2xl font-semibold">Loading booking details...</h1> */}
          <p className={`mt-3 text-sm ${theme.softText}`}>We are connecting this live page to the booking record now.</p>
        </div>
      </div>
    </section>
  );
}
