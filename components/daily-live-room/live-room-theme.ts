export type ThemeMode = 'light' | 'dark';

export type ThemePalette = {
  page: string;
  panel: string;
  tabPanel: string;
  mutedPanel: string;
  text: string;
  softText: string;
  subtleText: string;
  border: string;
  accent: string;
  tabIdle: string;
  input: string;
  videoBar: string;
  chip: string;
  cardShadow: string;
  overlay: string;
};

export const themeClasses: Record<ThemeMode, ThemePalette> = {
  light: {
    page: 'bg-[#f5f7fb]',
    panel: 'bg-white',
    tabPanel: 'bg-[#f4f7fb]',
    mutedPanel: 'bg-[#f7f9fc]',
    text: 'text-[#162037]',
    softText: 'text-[#667085]',
    subtleText: 'text-[#98A2B3]',
    border: 'border-[#d7e0ef]',
    accent: 'bg-[#2d5bd1] text-white',
    tabIdle: 'bg-transparent text-[#6b7280]',
    input: 'bg-[#eef4ff] text-[#344054] placeholder:text-[#98a2b3]',
    videoBar: 'bg-[#1f2430f2] text-white',
    chip: 'bg-[#edf4ff] text-[#2d5bd1]',
    cardShadow: 'shadow-[0_10px_28px_rgba(16,24,40,0.08)]',
    overlay: 'bg-white/72',
  },
  dark: {
    page: 'bg-[#020203]',
    panel: 'bg-[#050608]',
    tabPanel: 'bg-[#050608]',
    mutedPanel: 'bg-[#17171c]',
    text: 'text-white',
    softText: 'text-[#d1d5db]',
    subtleText: 'text-[#94a3b8]',
    border: 'border-white/10',
    accent: 'bg-[#2d5bd1] text-white',
    tabIdle: 'bg-transparent text-slate-500',
    input: 'bg-[#121317] text-white placeholder:text-slate-500',
    videoBar: 'bg-[#1c1f28f2] text-white',
    chip: 'bg-[#111827] text-[#93c5fd]',
    cardShadow: 'shadow-[0_24px_70px_rgba(0,0,0,0.45)]',
    overlay: 'bg-black/70',
  },
};
