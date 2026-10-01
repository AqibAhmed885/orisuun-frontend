import Image from 'next/image'
import React from 'react'
import styles from './HeroServerContent.module.css'

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

interface HeroServerContentProps {
  firstLine: string
  secondLine: string
  subtitle: string
  imageSrc: string
}

const HeroServerContent = ({ firstLine, secondLine, subtitle, imageSrc }: HeroServerContentProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 lg:py-14" aria-label="Hero section - Find black-owned businesses">
      <div className="">
        <div className="relative flex flex-col items-center    ">
          <div className='flex space-x-2 w-full justify-center'>
            {/* bolt icon */}

            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <g clipPath="url(#clip0_4898_218706)">
                <g clipPath="url(#clip1_4898_218706)">
                  <path d="M20.6694 41.6552C32.0773 41.6552 41.3251 32.4073 41.3251 20.9995C41.3251 9.59164 32.0773 0.34375 20.6694 0.34375C9.26156 0.34375 0.0136719 9.59164 0.0136719 20.9995C0.0136719 32.4073 9.26156 41.6552 20.6694 41.6552Z" fill="#69B3E7" />
                  <path d="M30.2179 18.246C30.0343 17.8678 29.6496 17.6303 29.2298 17.6303H23.6333L25.7145 10.9904C25.8894 10.6473 25.8719 10.2339 25.662 9.90854C25.4609 9.58315 25.1024 9.38086 24.7177 9.38086H17.687C16.7776 9.38086 15.9556 9.95254 15.6408 10.8144L12.3966 22.7138C12.2217 23.0567 12.2392 23.4701 12.449 23.7955C12.6502 24.1209 13.0087 24.3232 13.3934 24.3232H18.9987L17.0662 32.564C16.9613 33.074 17.2149 33.5929 17.6871 33.8128C17.8357 33.8832 17.9931 33.9095 18.1505 33.9095C18.4915 33.9095 18.8238 33.7513 19.0424 33.461L30.1305 19.4069C30.3841 19.0727 30.4191 18.6154 30.2354 18.2372L30.2179 18.246Z" fill="white" />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_4898_218706">
                  <rect width="42" height="42" fill="white" />
                </clipPath>
                <clipPath id="clip1_4898_218706">
                  <rect width="42" height="41.3115" fill="white" transform="translate(0 0.34375)" />
                </clipPath>
              </defs>
            </svg>

            <div
              className='w-2 mr-2 rounded-full h-[70px] md:h-[130px] bg-[#69B3E7]/30'

            />
            {/* Headline */}
            <div
              className={`text-2xl sm:text-5xl md:text-[64px] font-semibold text-[#001E5F] tracking-wide ${styles['animate-rotate-in']}`}
              aria-live="polite"
            >
              <h1 className="flex flex-col gap-0">  
                <span className={`${styles['fill-highlight']} text-nowrap px-3`}>{firstLine}</span>
                <span className={`inline-flex ${styles['fill-highlight']} px-3`}>{secondLine}</span>
              </h1>
              
              {/* Subtitle */}
              <p className={`mt-6 items-center flex  text-lg md:text-xl font-normal text-gray-500 max-w-xl ${styles['animate-sub-fade']}`}>
                {subtitle}
              </p>
            </div>
            
          </div>
          

          
        </div>

        
        {/* Map / Image frame */}
        <div className="rounded-sm p-0 md:p-4">
          <div className="w-full rounded-sm overflow-hidden relative" style={{aspectRatio: '14/7'}}>
            {/* Use a responsive object-fit image if available. Falls back to placeholder background. */}
            <Image
              src={imageSrc}
              alt="Decorative illustration"
              className="w-full h-full object-contain hidden md:block"
              fill
              priority={true}
            />

            <Image
              src={`${staticUrl}/find/mobile-map.svg`}
              alt="Decorative illustration"
              className="w-full h-full object-contain block md:hidden"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority={true}
            />
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroServerContent
