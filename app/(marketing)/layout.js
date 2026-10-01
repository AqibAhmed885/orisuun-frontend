import '@/styles/global.css';
import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from './_layout-components/providers';
import { DeferredAnalytics } from './_layout-components/deferred-analytics';
import AOSWrapper from '../../components/marketing/AOS Wrapper/Aos';
import ScrollProvider from '@/components/scroll/ScrollProvider';

export const metadata = {
  icons: {
    icon: [
      { url: '/favicon96c.png', sizes: '96x96' },
      { url: '/favicon192c.png', sizes: '192x192' },
      { url: '/favicon256c.png', sizes: '256x256' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Resource Hints for Performance */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Font Preloads — paths match /public/fonts/ where the files actually live */}
        <link
          rel="preload"
          href="/fonts/NeueHaasDisplayLight.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/NeueHaasDisplayRoman.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* @font-face declarations are in styles/fonts-family.css — no inline style needed */}

        <link rel="icon" href="/favicon96c.png" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen bg-white overflow-x-hidden w-full">
        {/* GTM NoScript Fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5NDJVLPQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <AOSWrapper>
          <Providers>
            <ScrollProvider>
              {children}
            </ScrollProvider>
          </Providers>
        </AOSWrapper>
        <DeferredAnalytics />
      </body>
    </html>
  );
}
