'use client';

import type { ThemePalette } from './live-room-theme';

type Props = {
  theme: ThemePalette;
  title: string;
  message: string;
};

export default function ErrorState({ theme, title, message }: Props) {
  return (
    <section className={`min-h-screen w-full transition-colors duration-300 ${theme.page} ${theme.text}`}>
      <div className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-4 py-12">
        <div className={`w-full max-w-xl rounded-[18px] border p-8 text-center ${theme.panel} ${theme.border} ${theme.cardShadow}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2d5bd1]">Booking Error</p>
          <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
          <p className={`mt-3 text-sm ${theme.softText}`}>{message}</p>
        </div>
      </div>
    </section>
  );
}
