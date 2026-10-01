'use client'
import Image from 'next/image'
import React from 'react'

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

// Move constant data outside the component to prevent re-creation on every render
const clusters = [
  { title: 'Share', desc: 'Share that special business profile with friends, investors, or anyone in between', image: `${staticUrl}/find/social/social-1.png` },
  { title: 'Follow', desc: 'Follow the profiles you want to keep up with to stay on top of their latest moves', image: `${staticUrl}/find/social/social-2.png` },
  { title: 'Favorite', desc: 'Favorite the businesses you want to come back to again and again', image: `${staticUrl}/find/social/social-4.png` },
  { title: 'Add to Lists', desc: 'One list for restaurants in your city, another list for restaurants in you favorite vacation spot, and a third for possible investments. Create as many lists as you want', image: `${staticUrl}/find/social/social-3.png` }
]

export default function SocialSection() {
  const svgWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  const clusterRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const [visible, setVisible] = React.useState<boolean[]>(new Array(clusters.length).fill(false))

  // Single Effect for Intersection Observers
  React.useEffect(() => {
    // Observer for Top SVG
    const svgObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        svgObs.disconnect();
      }
    }, { threshold: 0.1 });

    if (svgWrapperRef.current) svgObs.observe(svgWrapperRef.current);

    // Observer for Clusters
    const clusterObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          setVisible((v) => {
            const next = [...v];
            next[idx] = true;
            return next;
          });
          clusterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    clusterRefs.current.forEach(el => el && clusterObs.observe(el));

    return () => {
      svgObs.disconnect();
      clusterObs.disconnect();
    };
  }, []);

  return (
    <section className="relative max-w-7xl mx-auto px-6 md:py-10 py-6 overflow-hidden" aria-label="Orisuun social features">
      <style jsx>{`
        .path-draw { stroke-dasharray: 800; stroke-dashoffset: 800; }
        .in-view .path-draw { animation: drawIn 1.5s ease-out forwards; }
        .bounce-container { transform: translateX(-50px); opacity: 0; }
        .in-view .bounce-container { animation: elasticMove 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes drawIn { to { stroke-dashoffset: 0; } }
        @keyframes elasticMove { to { transform: translateX(0); opacity: 1; } }
        .arrow-head { opacity: 0; }
        .in-view .arrow-head { animation: fadeIn 0.3s ease forwards 1.2s; }
        @keyframes fadeIn { to { opacity: 1; } }

        .cluster { transform: translateY(40px); opacity: 0; transition: all 900ms cubic-bezier(.2,.9,.2,1); }
        .cluster.in-view { transform: translateY(0); opacity: 1; }
        .cluster h3 { transition: transform 900ms cubic-bezier(.2,.9,.2,1), color 900ms; transform-origin: left center; }
        .cluster.in-view h3 { transform: scale(1.3); color: #001E5F; }
      `}</style>

      {/* SVG Container with Aspect Ratio to prevent CLS */}
      <div ref={svgWrapperRef} className={`absolute -top-[60px] md:-top-[100px] left-3 aspect-[326/191] w-48 md:w-[326px] ${inView ? 'in-view' : ''}`}>
        <svg viewBox="0 0 326 191" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-full h-full'>
          <g className="bounce-container">
            <path className="path-draw" d="M311.519 170.201C268.065 111.365 199.311 124.536 167.739 183.675C158.631 125.86 120.024 10.1967 3.72412 3.5603"
              stroke="#2357C6" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <g className="arrow-head">
              <path d="M311.518 170.973C306.301 171.088 288.47 168.252 288.47 168.252" stroke="#2357C6" strokeWidth={6} strokeLinecap="round" />
              <path d="M314.353 147.09C314.468 152.308 311.632 170.138 311.632 170.138" stroke="#2357C6" strokeWidth={6} strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>

      <div className='relative z-10'>
        <h2 className='md:text-[70px] text-[40px] font-semibold text-[#001E5F] mt-14'>Orisuun is Social</h2>
        <p className='md:text-xl text-sm mb-12 text-[#5B657B] md:max-w-xl opacity-80'>
          More than a pin on a map. Detailed public business profiles to share, follow, and favorite.
        </p>

        <div className="flex flex-col w-full gap-20">
          {clusters.map((cluster, idx) => (
            <div
              key={idx}
              ref={el => { clusterRefs.current[idx] = el }}
              data-index={idx}
              className={`cluster flex md:flex-row flex-col w-full items-center justify-between gap-8 ${visible[idx] ? 'in-view' : ''}`}
            >
              <div className="md:w-1/2">
                <h3 className="md:text-[40px] text-[24px] font-semibold text-[#001E5F] mb-6">{cluster.title}</h3>
                <p className="md:text-xl text-lg text-[#5B657B] leading-relaxed">{cluster.desc}</p>
              </div>
              <div className="md:w-1/2 flex justify-end">
                <Image
                  src={cluster.image}
                  alt={`Illustration for ${cluster.title} feature`}
                  width={600}
                  height={400}
                  className="w-full h-auto max-w-[500px] object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
