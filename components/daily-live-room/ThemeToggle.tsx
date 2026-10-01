'use client';

import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from './live-room-theme';

type Props = {
  mode: ThemeMode;
  onToggle: () => void;
};

export default function ThemeToggle({ mode, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-3.5 w-[34px] items-center rounded-full border transition ${
        mode === 'dark' ? 'border-white/60 bg-[#414141]' : 'border-[#414141] bg-white'
      }`}
      aria-label="Toggle theme"
    >
      <span
        className={`absolute flex h-5 w-5 items-center justify-center rounded-full text-xs transition ${
          mode === 'dark'
            ? 'translate-x-4 bg-[#2d5bd1] text-white'
            : '-translate-x-2 bg-[#2d5bd1] text-white'
        }`}
      >
        {mode === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
