'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GrowthBeyondRoomsSection({
  title,
  description,
  ctaLabel,
  ctaLink,
}) {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL ?? '';
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const image = imageRef.current;
    const rail = railRef.current;
    const content = contentRef.current;

    if (!section || !image || !rail || !content) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) return;

      gsap.from(rail, {
        autoAlpha: 0,
        x: 70,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(content.children, {
        autoAlpha: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 68%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.fromTo(
        image,
        { scale: 1.02, yPercent: -2 },
        {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100vh] bg-[#DCEAF5] md:h-[100vh]">
      <Image
        ref={imageRef}
        src={`${staticUrl}/businessDevelopment/growth-business-district.png`}
        alt="Business professional walking through a modern business district"
        fill
        sizes="100vw"
        className="object-cover object-center will-change-transform "
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#13344A]/10 via-transparent to-[#EAF5FD]/5" />

      <div
        ref={railRef}
        className="ml-auto flex h-[100svh] w-full flex-col border-x border-white/80 sm:mr-[3%] sm:w-[62%] md:w-[44%] lg:w-[37%]"
      >
        <div className="flex sticky top-24  min-h-[410px] basis-[48%] flex-col bg-white/90 px-7 py-9 backdrop-blur-[3px] md:px-9 md:py-8 lg:px-11">
          <div ref={contentRef} className="flex h-full flex-col">
            <h2 className="max-w-[500px] text-2xl font-medium leading-[0.98]  text-[#07142D] md:text-[30px] lg:text-[32px]">
              {title}
              
            </h2>
            <p className="mt-4 max-w-[500px] text-[14px] leading-[1.38] text-[#5E6B7F] md:text-[15px]">
              {description}
              
            </p>
            <Link
              href={ctaLink}
              className="mt-auto inline-flex w-fit items-center gap-5 rounded-md bg-[#00395D] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#07527F]"
            >
              {ctaLabel}
              
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="min-h-0 flex-1 border-b border-t border-white/80 bg-transparent"
        />
      </div>
    </section>
  );
}
