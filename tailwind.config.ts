import type { Config } from 'tailwindcss';

const plugin = require('tailwindcss/plugin');

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './layout/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        h1: ['32px', '44px'],
        h2: ['28px', '36px'],
        h3: ['24px', '32px'],
        h4: ['22px', '32px'],
        h5: ['20px', '28px'],
        h6: ['18px', '24px'],
        h7: ['16px', '24px'],
        h8: ['15px', '20px'],
        h9: ['14px', '20px'],
        h10: ['13px', '16px'],
        h11: ['48px', '58px'],
        h12: ['60px', '1'],
        h13: ['72px', '1'],
        h14: ['88px', '110%'],
      },
      spacing: {
        '20vh': '20vh',
        '40vh': '40vh',
        '60vh': '60vh',
        '120': '120px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        frame: "url('/images/navFrame.png')",
        frame2: "url('/images/navFrame.svg')",
        framenav: "url('/images/navframe1.png')",
        frame3: "url('./public/assets/img/bg-gradient-pric.png')",
        footer: "url('/images/orisunn-official-black-logo.png')",
        'sign-up': "url('/bg/join-banner.svg')",
        premium:
          'linear-gradient(88.08deg, #191E38 -86.1%, #3058A5 45.85%, #5FAFDD 160.03%, #5FAFDD 167.65%)',
        standard: 'linear-gradient(122deg, #16357A -21.86%, #69B3E7 109.13%)',
        userType:
          'linear-gradient(263.7deg, #191E38 -55.62%, #3058A5 24.64%, #5FAFDD 94.1%, #5FAFDD 98.73%)',
        about:
          'linear-gradient(90.06deg, #191E38 -62.45%, #3058A5 28.46%, #5FAFDD 130.48%, #5FAFDD 136.45%);',
        'profile-frame': 'linear-gradient(160deg, #737DFE 0%, #00FFB8 100%)',
        mobileGradient:
          'linear-gradient(154.26deg, #737DFE 1.69%, #00FFB8 97.23%);',
        'why-we-created-orisun-bg':
          'linear-gradient(75.26deg, #191E38 -97.69%, #3058A5 4.16%, #5FAFDD 92.29%, #5FAFDD 98.17%)',
        pricebox1:
          'var(--new-grad, linear-gradient(121deg, #74B8E8 -1.35%, #B9D9EB 109.12%))',
      },
      colors: {
        'nav-blue': '#2357C6',
        'blue-strong': '#001E5F',
        'text-gray': '#3D3D3D',
        'blu-ray-300': '#5B657B',
        'gray-300-custom': 'var(--Gray-300, #D8D9D9)',
        'black-500-custom': 'var(--Black-500,#080808)',
        'gray-100-custom': 'var(--Gray-100, #F8F8F8)',
        skyblue: '#B9D9EB',
        'z-black': '#000',
        blueBg: '#1B3C7B',
        lightBlueBg: '#E9EEF9',
        grey: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fcfcfc',
          300: '#fbfbfa',
          400: '#fafaf9',
          500: '#f9f9f8',
          600: '#e3e3e2',
          700: '#b1b1b0',
          800: '#B2B2B2',
          900: '#696968',
        },
        blue: {
          50: '#e8e6fb',
          100: '#B3B8C2',
          200: '#8E95A4',
          300: '#5B657B',
          400: '#3B4761',
          500: '#0A193A',
          600: '#091735',
          700: '#071229',
          800: '#060E20',
          900: '#040B18',
        },
        omblue: {
          25: '#F2F6FF',
          50: '#E9EBF8',
          100: '#BBCBED',
          200: '#9AB2E5',
          300: '#6C8ED9',
          400: '#4F79D1',
          500: '#2357C6',
          600: '#204FB4',
          700: '#193E8D',
          800: '#13306D',
          900: '#0F2553',
        },
        olblue: {
          50: '#F0F7FD',
          100: '#D1E7F8',
          200: '#BADCF4',
          300: '#9BCCEF',
          400: '#87C2EC',
          500: '#69B3E7',
          600: '#60A3D2',
          700: '#4B7FA4',
          800: '#3A627F',
          900: '#2C4B61',
        },
        warning: {
          50: '#FFF9E6',
          75: '#FFF6D9',
          100: '#FFECB2',
          200: '#FFE28D',
          300: '#FFD559',
          400: '#FFCD39',
          500: '#FFC107',
          600: '#E8B006',
          700: '#B58905',
          800: '#8C6A04',
          900: '#6B5103',
        },
        black: {
          50: '#E6E6E6',
          100: '#B2B2B2',
          200: '#8D8D8D',
          300: '#5A5A5A',
          400: '#393939',
          500: '#080808',
          600: '#070707',
          700: '#060606',
          800: '#040404',
          900: '#030303',
        },
        success: {
          50: '#E8F3EE',
          500: '#198754',
        },
        green: {
          100: '#E8FFF8',
          400: '#20B488',
          500: '#1A9E78',
        },
        danger: {
          50: '#FCEBEC',
          100: '#F4C0C5',
          200: '#EFA2A9',
          300: '#E87882',
          400: '#E35D6A',
          500: '#DC3545',
          600: '#C8303F',
          700: '#9C2631',
          800: '#791D26',
          900: '#5C161D',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: '#1D4ED8', // Custom link color
              '&:hover': {
                color: '#1E40AF', // Darker blue for hover
              },
            },
            'ul > li::marker': {
              color: '#000000',
            },
            h1: {
              color: '#080808',
              fontWeight: '500',
            },
            h2: {
              color: '#080808',
              fontWeight: '500',
            },
            h3: {
              color: '#080808',
              fontWeight: '500',
            },
            p: {
              color: '#080808',
              fontWeight: '500',
            },
            li: {
              color: '#080808',
              fontWeight: '500',
            },
          },
        },
      },
      boxShadow: {
        filterLeftbar:
          '0px 0px 10px rgba(131, 148, 185, 0.04), 0px 3px 12px rgba(99, 126, 183, 0.11)',
        price: '0px 2px 4px -2px #1018280F',
        price2: '0px 4px 8px -2px #1018281A',
        priceCard: '0px 12px 16px -4px #10182814',
        'difference-cards':
          '0 -4px 10px rgba(94, 168, 255, 0.5), 0 4px 10px rgba(94, 168, 255, 0.5)',
        'custom-alt':
          '0px 3px 12px 0px rgba(99, 126, 183, 0.11), 0px 0px 10px 0px rgba(131, 148, 185, 0.04)',
        'custom-combined':
          '0px 3px 17px 0px rgba(174, 181, 196, 0.09), 0px 0px 10px 0px rgba(147, 152, 163, 0.04)',
        'filter-primary':
          '0px 3px 12px 0px rgba(99, 126, 183, 0.11), 0px 0px 10px 0px rgba(131, 148, 185, 0.04)',
        'different-shadow': '0px 0px 24px 0px #0000000F',
        'different-shadow-blue-1': '0px 4px 31px -2px #466FB61A',
        'different-shadow-blue-2': '0px 8px 19px -4px #1018280F',
        custom:
          '0px 0px 40px rgba(35, 87, 198, 0.12), 0px 0px 10px rgba(35, 87, 198, 0.2)',
        price3: '0px 4px 25px 0px rgba(0, 0, 0, 0.13)',
        price4: '0px 40px 60px 0px rgba(0, 0, 0, 0.05)',
        price5: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
        calender: '0px 0px 10px 0px rgba(35, 87, 198, 0.20)',
      },
      blur: {
        'custom-blur': '82.44999694824219px',
      },
      lineHeight: {
        110: '110%',
        150: '150%',
      },
      width: {
        container: '1512px',
      },
      height: {
        container: '982px',
        '20vh': '20vh',
        '40vh': '40vh',
        '60vh': '60vh',
      },
      textUnderlineOffset: {
        2: '2px',
        // Add more custom values if needed
      },
      screens: {
        'small-500': { max: '768px' },
        'small-767': { max: '767px' },
        'small-1000': { max: '1023px' },
        ipad: { max: '992px' },
        'sm-ipad': { max: '450px' },
        mobile: { max: '480px' },
        '3xl': '1600px',
        '4xl': '1920px',
        '2k': '2048px',
        xs: '300px',
      },
      backgroundSize: {
        'banner-vector': '24% 80%',
        'banner-vector-sm': '40% 40%',
        full: '100% 100%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({
      addUtilities,
      theme,
      e,
    }: {
      addUtilities: (
        utilities: Record<string, Record<string, string>>,
        variants: string[]
      ) => void;
      theme: (path: string, defaultValue?: unknown) => any;
      e: (selector: string) => string;
    }) {
      const newUtilities: { [key: string]: { [key: string]: string } } = {};

      // Generate scaled utilities for spacing
      Object.entries(theme('spacing') as Record<string, string>).forEach(
        ([key, value]) => {
          newUtilities[`.${e(`w-scaled-${key}`)}`] = {
            width: `calc(${value} * var(--scale-factor))`,
          };
          newUtilities[`.${e(`h-scaled-${key}`)}`] = {
            height: `calc(${value} * var(--scale-factor))`,
          };
        }
      );

      // Generate scaled utilities for font sizes
      Object.entries(
        theme('fontSize') as Record<string, string | [string, string]>
      ).forEach(([key, value]) => {
        if (typeof value === 'string') {
          newUtilities[`.${e(`text-scaled-${key}`)}`] = {
            fontSize: `calc(${value} * var(--scale-factor))`,
          };
        } else if (Array.isArray(value)) {
          const [fontSize, lineHeight] = value;
          newUtilities[`.${e(`text-scaled-${key}`)}`] = {
            fontSize: `calc(${fontSize} * var(--scale-factor))`,
            lineHeight:
              typeof lineHeight === 'string' && lineHeight.includes('px')
                ? `calc(${lineHeight} * var(--scale-factor))`
                : lineHeight,
          };
        }
      });

      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
};
export default config;
