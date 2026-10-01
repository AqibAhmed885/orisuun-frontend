import baseConfig from './tailwind.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  ...baseConfig,
  content: [
    './app/(homepage)/**/*.{js,ts,jsx,tsx,mdx}',
    './app/(marketing)/_layout-components/providers.tsx',
    './app/(marketing)/_layout-components/deferred-analytics.tsx',
    './components/marketing/NewHomepage/**/*.{js,ts,jsx,tsx,mdx}',
    './components/marketing/Navbar/**/*.{js,ts,jsx,tsx,mdx}',
    './components/marketing/Footer/**/*.{js,ts,jsx,tsx,mdx}',
    './components/marketing/Button/**/*.{js,ts,jsx,tsx,mdx}',
    './components/marketing/Dropdown/**/*.{js,ts,jsx,tsx,mdx}',
    './components/marketing/DemoEmbed.{js,jsx,ts,tsx}',
    './components/marketing/SVG/**/*.{js,ts,jsx,tsx,mdx}',
    './components/scroll/**/*.{js,ts,jsx,tsx,mdx}',
    './components/ui/profile-type.{js,jsx,ts,tsx}',
    './data/marketing/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/useGSAPScroll.ts',
    './hooks/useOutsideClick.tsx',
    './icons/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
