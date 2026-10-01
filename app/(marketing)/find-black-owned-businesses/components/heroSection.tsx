'use client'
import Image from 'next/image'
import React from 'react'

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const HeroSection = ({ firstLines, secondLines, subtitles, images }) => {
  // SEO & Hydration Fix: Pehla element server par render hoga
  const [headlineA, setHeadlineA] = React.useState(firstLines[0]);
  const [headlineB, setHeadlineB] = React.useState(secondLines[0]);
  const [subtitle, setSubtitle] = React.useState(subtitles[0]);
  const [imageSrc, setImageSrc] = React.useState(images[0]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Client-side par randomization
    const idx = Math.floor(Math.random() * Math.min(firstLines.length, secondLines.length));
    const k = Math.floor(Math.random() * subtitles.length);
    const m = Math.floor(Math.random() * images.length);

    setHeadlineA(firstLines[idx]);
    setHeadlineB(secondLines[idx]);
    setSubtitle(subtitles[k]);
    setImageSrc(images[m]);

    setMounted(true);
  }, [firstLines, secondLines, subtitles, images]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 lg:py-14" aria-label="Hero section - Find black-owned businesses">
      <div>
        <div className="relative flex flex-col items-center">
          <div className='flex space-x-2 w-full justify-center'>
            {/* Bolt Icon - Fixed aria-hidden */}
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
              <g clipPath="url(#clip0_hero)">
                <path d="M20.6694 41.6552C32.0773 41.6552 41.3251 32.4073 41.3251 20.9995C41.3251 9.59164 32.0773 0.34375 20.6694 0.34375C9.26156 0.34375 0.0136719 9.59164 0.0136719 20.9995C0.0136719 32.4073 9.26156 41.6552 20.6694 41.6552Z" fill="#69B3E7" />
                <path d="M30.2179 18.246C30.0343 17.8678 29.6496 17.6303 29.2298 17.6303H23.6333L25.7145 10.9904C25.8894 10.6473 25.8719 10.2339 25.662 9.90854C25.4609 9.58315 25.1024 9.38086 24.7177 9.38086H17.687C16.7776 9.38086 15.9556 9.95254 15.6408 10.8144L12.3966 22.7138C12.2217 23.0567 12.2392 23.4701 12.449 23.7955C12.6502 24.1209 13.0087 24.3232 13.3934 24.3232H18.9987L17.0662 32.564C16.9613 33.074 17.2149 33.5929 17.6871 33.8128C17.8357 33.8832 17.9931 33.9095 18.1505 33.9095C18.4915 33.9095 18.8238 33.7513 19.0424 33.461L30.1305 19.4069C30.3841 19.0727 30.4191 18.6154 30.2354 18.2372L30.2179 18.246Z" fill="white" />
              </g>
              <defs><clipPath id="clip0_hero"><rect width="42" height="42" fill="white" /></clipPath></defs>
            </svg>

            <div className='w-2 mr-2 rounded-full h-[70px] md:h-[130px] bg-[#69B3E7]/30 shrink-0' aria-hidden="true" />

            <div className={`text-2xl sm:text-5xl md:text-[64px] font-semibold text-[#001E5F] tracking-wide transition-opacity duration-500 ${mounted ? 'animate-rotate-in opacity-100' : 'opacity-0'}`} aria-live="polite">
              <h1 className="flex flex-col gap-0">
                <span className="fill-highlight inline-flex md:text-nowrap px-3">{headlineA}</span>
                <span className="inline-flex fill-highlight px-3">{headlineB}</span>
              </h1>

              <p className={`mt-6 text-lg md:text-xl font-normal text-gray-500 max-w-xl ${mounted ? 'animate-sub-fade opacity-100' : 'opacity-0'}`}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* CLS Fix: Added aspect ratio container */}
        <div className="rounded-sm p-0 md:p-4 mt-8">
          <div className="w-full rounded-sm overflow-hidden relative aspect-[14/7]">
            {/* Desktop Image with optimized LCP */}
            <Image
              src={imageSrc}
              alt="Find black-owned businesses map view"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={true}
              className="object-contain hidden md:block"
            />
            {/* Mobile Image */}
            <Image
              src={`${staticUrl}/find/mobile-map.svg`}
              alt="Mobile map illustration"
              fill
              sizes="100vw"
              priority={true}
              className="object-contain block md:hidden"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .fill-highlight {
          position: relative;
          display: inline-block;
          border-radius: 4px;
          z-index: 1;
        }

        .fill-highlight::before {
          content: '';
          position: absolute;
          left: 0; top: 0;
          height: 100%; width: 100%;
          background: rgba(105,179,231,0.26);
          transform-origin: left;
          transform: scaleX(0);
          z-index: -1;
          animation: fillX 1.6s ease-in-out forwards;
          will-change: transform;
        }

        h1 .fill-highlight:nth-of-type(2)::before { animation-delay: 260ms; }

        @keyframes fillX { to { transform: scaleX(1); } }

        .animate-rotate-in {
          animation: rotateIn 700ms cubic-bezier(.2,.9,.2,1) both;
          will-change: transform, opacity;
        }

        @keyframes rotateIn {
          0% { transform: perspective(800px) rotateX(-90deg) translateY(-8px); opacity: 0; }
          60% { transform: perspective(800px) rotateX(10deg) translateY(0); opacity: 1; }
          100% { transform: perspective(800px) rotateX(0); opacity: 1; }
        }

        .animate-sub-fade {
          animation: subFade 900ms cubic-bezier(.2,.9,.2,1) both;
        }

        @keyframes subFade {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .fill-highlight::before { animation: none; transform: scaleX(1); }
          .animate-rotate-in, .animate-sub-fade { animation: none; transform: none; opacity: 1; }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
