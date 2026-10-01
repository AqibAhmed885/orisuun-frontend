"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/marketing/Button'
import Image from 'next/image';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function TryOrisuunCTA() {
    const router = useRouter();
    const svgRef = React.useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = React.useState(false);

    React.useEffect(() => {
        const el = svgRef.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.25 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="relative px-6 pb-24" aria-label="Try Orisuun call to action">
            <style>{` /* 1. THE DRAWING EFFECT (Trim Path) */
  /* We use a large dasharray to ensure it covers the whole path */
  .draw-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }

  /* 2. THE BOUNCE EFFECT (Left to Right) */
  .bounce-group {
    transform-origin: center;
    transform: translateX(-40px) scale(0.9);
    opacity: 0;
  }

  /* 3. STAGGERED HEAD (Arrow head appears last) */
  .arrow-head {
    opacity: 0;
  }

  /* Animate only when container gains the 'in-view' class */
  .in-view .draw-line {
    animation: napkinDraw 1.5s ease-out forwards;
  }

  .in-view .bounce-group {
    animation: napkinBounce 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  .in-view .arrow-head {
    animation: fadeIn 0.2s ease forwards 1.3s;
  }

  @keyframes napkinDraw {
    to { stroke-dashoffset: 0; }
  }

  @keyframes napkinBounce {
    0% {
      transform: translateX(-40px) scale(0.9);
      opacity: 0;
    }
    100% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }   `}</style>
            
            <Image
                src={`${staticUrl}/find/top-left.svg`}
                alt="Try Orisuun Background"
                className="absolute md:-top-5 -top-[18px] md:left-0 -left-6 object-cover object-top pointer-events-none w-48 md:w-80 select-none"
                width={336}
                height={336}
                loading="lazy"
            />

            <Image
                src={`${staticUrl}/find/bottom-right.svg`}
                alt="Try Orisuun Background"
                className="absolute bottom-0 right-0 -mt-6 w-48 md:w-80 object-cover object-top pointer-events-none select-none"
                width={336}
                height={336}
                loading="lazy"
            />
            <div ref={svgRef} className={`relative   py-8 px-6 flex flex-col items-center text-center overflow-hidden ${inView ? 'in-view' : ''}`}>
                {/* Decorative arrow */}
                <div className=" mr-10">
                    <svg width="120" height="167" viewBox="0 0 120 167" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g className="bounce-group">
                            <path className="draw-line"
                                d="M90.3349 156.673C99.9986 63.4069 59.3574 36.9921 29.2088 63.4069C-0.939826 89.8217 17.6186 121.004 51.4254 93.8814C80.1922 70.8017 85.1076 33.9847 85.1076 9.60352"
                                stroke="#2357C6" strokeWidth={9.23077} strokeLinecap="round" />

                            <g className="arrow-head">
                                <path d="M90.4551 156.766L73.8462 135.092" stroke="#2357C6" strokeWidth={9.23077} strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M112.988 139.625L91.314 156.234" stroke="#2357C6" strokeWidth={9.23077} strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </g>
                    </svg>

                </div>

                <h2 className="text-4xl lg:text-[64px] mt-12 font-semibold text-blue-strong mb-4" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>
                    Try Orisuun!
                </h2>

                <p className="text-base lg:text-xl mt-2 text-[#5B657B] max-w-2xl leading-relaxed mb-6">
                    Get started instantly — no download necessary. Sign up takes under 5 minutes.
                </p>

                {/* Use router.push from next/navigation on the button to avoid nested interactive elements
                    and prevent unexpected new-tab behavior when the button is clicked. */}
                <div className="w-full sm:w-auto">
                    <Button
                        className="px-8 rounded-full w-full sm:w-auto"
                        size="lg"
                        color="primary"
                        onClick={() => router.push('/signup')}
                    >
                        Sign up now
                    </Button>
                </div>

            </div>
        </section>
    )
}
