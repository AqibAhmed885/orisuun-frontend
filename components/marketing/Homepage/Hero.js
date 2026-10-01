'use client';
import { useState, useEffect } from 'react';
import { Button } from '..';
import Image from 'next/image';
import { Dialog, DialogPanel } from '@headlessui/react';
import DemoEmbed from '../DemoEmbed';
import Link from 'next/link';
import WistiaEmbed from './WitsiaEmbed';

const HERO_MEDIA_OPTIONS = [
  { type: 'image', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/illustration-home.png` },
  { type: 'image', src: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/illustration-home-two.png` },
  { type: 'video', videoId: 'j7eh2674jx' },
];

const Hero = ({ initialSeed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const content = [
    {
      heading: 'We connect business owners and growth-minded collaborators',
      subtext:
        'We connect Black-owned businesses with a vast network of investors, mentors, clients, and professionals eager to support their journey.'
    },
    {
      heading: 'The only hub for building, finding, and supporting Black-owned businesses, globally',
      subtext:
        'Orisuun connects Black-owned businesses to the people who matter — investors, mentors, clients, and supporters — all for $5/month.'
    },
    {
      heading: 'You Run Your Business. We’ll Help The Right People Find it',
      subtext:
        'We connect Black-owned businesses with a vast network of investors, mentors, clients, and professionals eager to support their journey. Just $5/month.'
    },
    {
      heading: 'Grow Your Business with the Right Connections',
      subtext:
        'We connect Black-owned businesses with a vast network of investors, mentors, clients, and professionals eager to support their journey. Just $5/month.'
    },
    {
      heading: 'Grow Your Business. Expand Your Reach.',
      subtext:
        'Orisuun connects Black-owned businesses to the people who matter — investors, mentors, clients, and supporters — all for $5/month.'
    },
    {
      heading: `You Run Your Business. 
    We’ll Help the Right People Find It.`,
      subtext:
        'Orisuun connects Black-owned businesses to the people who matter — investors, mentors, clients, and supporters — all for $5/month.'
    },
    {
      heading: 'Let the Right People Discover Your Business',
      subtext:
        'We help Black-owned businesses connect with investors, mentors, and customers who are ready to engage — all for just $5/month.'
    },
    {
      heading: 'Visibility That Leads to Opportunity',
      subtext:
        'Orisuun connects Black-owned businesses to the people who matter — investors, mentors, clients, and supporters — all for $5/month.'
    }
  ];

  // Keep hero selection deterministic across server and client to avoid hydration mismatches.
  const hashToIndex = (seed, length) => {
    if (!length) return 0;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % length;
  };

  const stableSeed = initialSeed || 'orisuun-hero-v1';
  const selectedContent = content[hashToIndex(`${stableSeed}-content`, content.length)];

  // Rotate media on each refresh: image1 -> image2 -> video -> repeat.
  useEffect(() => {
    const storageKey = 'orisuun-hero-media-index';
    const rawIndex = window.localStorage.getItem(storageKey);
    const parsedIndex = Number.parseInt(rawIndex ?? '-1', 10);
    const nextIndex = Number.isNaN(parsedIndex)
      ? 0
      : (parsedIndex + 1) % HERO_MEDIA_OPTIONS.length;

    window.localStorage.setItem(storageKey, String(nextIndex));
    setSelectedMedia(HERO_MEDIA_OPTIONS[nextIndex]);
  }, []);

  return (
    <section className="px-4 lg:pl-[80px] w-full min-h-[900px] overflow-hidden">
      {/* Demo Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen bg-[#111] bg-opacity-80 items-center justify-center">
          <DialogPanel className="space-y-4">
            <div className="w-[925px] 2xl:w-[1200px] 2k:w-[1300px] max-w-[90vw] rounded-xl overflow-hidden">
              <DemoEmbed />
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row  lg:gap-4 justify-center 2xl:scale-105 2k:scale-110 relative">
        {/* Left Text Content */}
        <div className="mt-7 md:mt-[111px] md:max-w-[593px] mx-auto lg:mx-0 text-start">
          <p className="text-[#8E95A4] text-base font-semibold leading-[110%] uppercase mb-4">
            Welcome to Orisuun!
          </p>
          <h1 className="text-blue-strong text-[30px] leading-[33.6px] md:text-[55px] capitalize font-[450px] md:leading-[110%] mb-6 max-w-[80%] md:max-w-[593px]">
            {selectedContent.heading}
          </h1>
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/home-curve.svg`}
            alt="curve"
            width={100}
            height={120}
            loading="lazy"
            className="absolute top-0 -right-10 small-500:-right-10 md:hidden small-500:overflow-x-clip"
          />
          <p className="text-[#5B657B] text-xl font-[450px] leading-[150%] mx-auto lg:mx-0 lg:max-w-[459px] mb-[60px] text-left">
            {selectedContent.subtext}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 flex-row justify-center items-center lg:justify-start">
            <Link href="/signup">
              <Button className="text-base font-bold leading-[150%] text-white py-2 lg:py-2.5 px-2 lg:px-5">
                Join the community
              </Button>
            </Link>
            <Button
              onClick={() => setIsOpen(true)}
              className="gap-1 bg-white text-[#2357C6] text-[16px] font-bold leading-[150%] py-2 lg:py-2.5 px-2 lg:px-5 border border-[#A9C4FF]"
            >
              Watch demo{' '}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM6.62988 5.0625C6.35441 4.89214 6 5.09164 6 5.41699V10.583C6 10.9084 6.35441 11.1079 6.62988 10.9375L10.8027 8.35449C11.0651 8.19206 11.0651 7.80794 10.8027 7.64551L6.62988 5.0625Z"
                  fill="#2357C6"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Right: rotate between two images and one video on each refresh */}
        <div className="mt-[20px] lg:w-[768px] w-full flex justify-center items-start">
          <div className="">
            {!selectedMedia ? (
              <div className="lg:w-[660px] w-[350px] mt-24" />
            ) : selectedMedia.type === 'video' ? (
              <div className="lg:w-[660px] w-[350px] mt-24 border-2 border-blue-strong">
                <WistiaEmbed videoId={selectedMedia.videoId} autoLoad />
              </div>
            ) : (
              <Image
                    src={selectedMedia.src}
                  alt="illustration-home"
                  width={796}
                  height={796}
                  priority
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 796px"
                  loading="eager"
                />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;