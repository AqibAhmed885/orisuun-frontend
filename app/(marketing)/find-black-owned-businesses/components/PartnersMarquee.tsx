'use client'
import Image from 'next/image'
import React from 'react'

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function PartnersMarquee(){
  // Small, accessible, responsive marquee showing partner logos (text/SVG placeholders)
  const logos = [
    {id: 'nyt', label: 'The New York Times', image: `${staticUrl}/find/partners/1.png`},
    {id: 'usat', label: 'USA TODAY', image: `${staticUrl}/find/partners/2.png`},
    {id: 'wapo', label: 'The Washington Post', image: `${staticUrl}/find/partners/3.png`},
    {id: 'bi', label: 'BUSINESS INSIDER', image: `${staticUrl}/find/partners/4.png`},
    {id: 'huff', label: 'HUFFPOST', image: `${staticUrl}/find/partners/5.png`},
    {id: 'ft', label: 'FINANCIAL TIMES', image: `${staticUrl}/find/partners/6.png`},
    {id: 'inc', label: 'Inc.', image: `${staticUrl}/find/partners/7.png`},
      { id: 'yalec', label: 'YALE CAMPUS PRESS', image: `${staticUrl}/find/partners/8.png` },
    
  ]

  // Duplicate array once so animation is seamless
  const track = [...logos, ...logos]

  return (
    <div className="w-full py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6">
          <div className="shrink-0 text-gray-400 tracking-wider text-xl font-[550]" aria-label="Featured in press">As Seen In</div>

          <div className="relative overflow-hidden w-full">
            {/* marquee track */}
            <div
              className="partners-marquee-track"
              aria-hidden="true"
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                width: 'max-content',
                paddingLeft: '6px',
              }}
            >
              {track.map((l, i) => (
                <div
                  key={`${l.id}-${i}`}
                  role="img"
                  aria-label={l.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '64px',
                    minWidth: '120px',
                    background: 'transparent',
                  }}
                >
                  <Image
                    src={l.image}
                    alt={l.label}
                    width={80}
                    height={60}
                    style={{
                      display: 'block',
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
