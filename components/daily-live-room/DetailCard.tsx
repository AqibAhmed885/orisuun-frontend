'use client';

import type { ThemePalette } from './live-room-theme';

type Props = {
  label: string;
  value: string;
  theme: ThemePalette;
};

export default function DetailCard({ label, value, theme }: Props) {
  return (
    <div className={`rounded-[14px] border px-4 py-3 ${theme.border} ${theme.panel}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.softText}`}>
        {label}
      </p>
      <p className={`mt-1 text-sm font-medium leading-6 ${theme.text}`}>{value}</p>
    </div>
  );
}
