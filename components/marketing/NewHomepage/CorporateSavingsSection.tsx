'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const SAVINGS_TOTAL = 1500000;
const SAVINGS_ANIMATION_DURATION = 4000;
const SAVINGS_OBSERVER_OPTIONS = { threshold: 0.4 };

const AnimatedSavingsTotal = () => {
  const { ref, hasIntersected } = useIntersectionObserver(
    SAVINGS_OBSERVER_OPTIONS
  );
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!hasIntersected) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(SAVINGS_TOTAL);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / SAVINGS_ANIMATION_DURATION,
        1
      );
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(SAVINGS_TOTAL * easedProgress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [hasIntersected]);

  return (
    <span
      ref={ref}
      className="inline-block min-w-[8.3ch] tabular-nums"
      aria-label={`$${SAVINGS_TOTAL.toLocaleString('en-US')}`}
    >
      ${value.toLocaleString('en-US')}
    </span>
  );
};

export default function CorporateSavingsSection() {
  return (
    <section className="px-6 py-16 text-center md:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <p className="mb-5 rounded-full bg-[#D8EAFE] px-4 py-1 text-xs font-medium text-gray-700">
          Premium perks without premium prices
        </p>

        <h1
          className="max-w-4xl text-center text-[42px] font-medium leading-[100%] tracking-[0.02em] text-gray-950"
        >
          288 corporate partners are offering our
          <br className="hidden md:block" /> community over{' '}
          <span className="relative inline-block whitespace-nowrap px-3">
            <Image
              src="/discount-portal-landing/Union.png"
              alt=""
              fill
              sizes="234px"
              className="object-fill"
              aria-hidden="true"
            />
            <span className="relative z-10">
              <AnimatedSavingsTotal />
            </span>
          </span>{' '}
          in savings.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-6 text-gray-600 md:text-lg">
          For $49 a year, you get wholesale-level discounts on tools you
          <br className="hidden md:block" /> already use daily. Your first deal
          pays for the entire year.
        </p>

        <Link
          href="/signup"
          className="mt-8 rounded-md bg-[#B8DAFF] px-7 py-3 text-sm font-medium text-gray-950 transition-colors hover:bg-[#A3CEFF]"
        >
          Claim Your Discounts
        </Link>
      </div>
    </section>
  );
}
