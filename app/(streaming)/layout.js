import '@/styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';
import AOSWrapper from '../../components/marketing/AOS Wrapper/Aos';

export const metadata = {
    icons: {
        icon: [
            { url: '/favicon96c.png', sizes: '96x96' },
            { url: '/favicon192c.png', sizes: '192x192' },
            { url: '/favicon256c.png', sizes: '256x256' },
        ],
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* ✅ Lazy-load Google Tag Manager */}
                <link
                    rel="preload"
                    href="/fonts/NeueHaasDisplayBlack.woff2"
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
                <link
                    rel="preload"
                    href="/fonts/NeueHaasDisplayMediu.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <Script
                    id="gtm-script"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5NDJVLPQ');
            `,
                    }}
                />
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
                    {children}
                </AOSWrapper>
            </body>
        </html>
    );
}
