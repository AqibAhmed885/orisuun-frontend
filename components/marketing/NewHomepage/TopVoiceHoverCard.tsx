'use client';

import Image from 'next/image';
import gsap from 'gsap';
import { useCallback, useLayoutEffect, useRef } from 'react';
import type { FocusEvent } from 'react';
import People from '@/icons/newhomepage/people';
import AdvisoryPlan from '@/icons/newhomepage/advoisry-plan';
import Title from '@/icons/newhomepage/crown';

export type TopVoiceProfile = {
  name: string;
  image: string;
  summary: string;
  gridClass?: string;
};

type TopVoiceHoverCardProps = {
  profile: TopVoiceProfile;
};

const quickBookings = [
  { label: 'Short', time: '15 min' },
  { label: 'Full', time: '60 min', active: true },
  { label: 'Extended', time: '90 min' },
];

const availability = [
  { day: 'Wednesday', time: '9:00 AM (WAT)' },
  { day: 'Wednesday', time: '10:00 AM (WAT)', active: true },
];

function Badge({ variant }: { variant: 'advised' | 'advisor' }) {
  const isAdvised = variant === 'advised';

  return (
    <span
      className={`inline-flex h-[18px] items-center gap-1 rounded-full px-2 text-[8px] font-medium ${
        isAdvised ? 'bg-[#BAD9FF] text-[#07142d]' : 'bg-[#060b16] text-white'
      }`}
    >
      {isAdvised ? 
        <People />
        : 
        <Title/>
       }
      {isAdvised ? '60+ advised' : 'Top Advisor'}
    </span>
  );
}

function BookButton() {
  return (
    <button className="shrink-0 rounded-[10px] bg-[#2357C6] px-5 py-3 text-[11px] font-medium text-white transition hover:bg-[#2555c5]">
      Book now
    </button>
  );
}

export default function TopVoiceHoverCard({ profile }: TopVoiceHoverCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const imageFaceRef = useRef<HTMLDivElement | null>(null);
  const bookingFaceRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const imageFace = imageFaceRef.current;
    const bookingFace = bookingFaceRef.current;

    if (!card || !imageFace || !bookingFace) return undefined;

    const animatedItems = bookingFace.querySelectorAll('.top-voice-animate');
    const ctx = gsap.context(() => {
        gsap.set(card, {
          perspective: 1200,
          transformOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
        });
        gsap.set([imageFace, bookingFace], {
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
        });
        gsap.set(imageFace, { autoAlpha: 1, rotateY: 0 });
        gsap.set(bookingFace, { autoAlpha: 1, rotateY: -180 });
        gsap.set(animatedItems, { autoAlpha: 0, y: 14 });

        timelineRef.current = gsap
          .timeline({
            paused: true,
            defaults: { ease: 'power2.inOut' },
          })
          .to(card, { scale: 1.012, duration: 0.9 }, 0)
          .to(imageFace, { rotateY: 180, duration: 0.9 }, 0)
          .to(bookingFace, { rotateY: 0, duration: 0.9 }, 0)
          .to(
            animatedItems,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.38,
              stagger: 0.045,
              ease: 'power3.out',
            },
            0.58
          );
    }, card);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  const showBookingCard = useCallback(() => {
    timelineRef.current?.play();
  }, []);

  const hideBookingCard = useCallback(() => {
    timelineRef.current?.reverse();
  }, []);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        hideBookingCard();
      }
    },
    [hideBookingCard]
  );

  return (
    <article
      ref={cardRef}
      className={`relative z-0 h-full min-h-[490px] overflow-hidden rounded-[12px] bg-[#07142d] text-white shadow-sm outline-none will-change-transform [transform-style:preserve-3d] hover:z-20 focus-within:z-20 sm:h-[500px] ${profile.gridClass ?? ''}`}
      tabIndex={0}
      onMouseEnter={showBookingCard}
      onMouseLeave={hideBookingCard}
      onFocus={showBookingCard}
      onBlur={handleBlur}
    >
      <div ref={imageFaceRef} className="absolute inset-0 will-change-transform [backface-visibility:hidden]">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#001d33]" />
        <div className="absolute left-4 top-3 flex gap-2">
          <Badge variant="advised" />
          <Badge variant="advisor" />
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <h3 className="flex items-center gap-1.5 text-[22px] font-medium leading-none text-white ">
            {profile.name}
            <Image 
              src="/chat/verified.svg"
              alt="Verified"
              width={16}
              height={16} 
              className="h-4 w-4"
            />
          </h3>
          <p className="mt-2 truncate text-[13px] leading-tight text-white/90">{profile.summary}</p>
        </div>
      </div>

      <div
        ref={bookingFaceRef}
        className="absolute inset-0 flex flex-col bg-[#07142d] px-6 py-5 will-change-transform [backface-visibility:hidden] sm:px-7 sm:py-6"
      >
        <div className="top-voice-animate mb-7 flex gap-3">
          <Badge variant="advised" />
          <Badge variant="advisor" />
        </div>

        <h3 className="top-voice-animate flex items-center gap-2  font-medium leading-none text-white text-[22px]">
          {profile.name}
          <Image
            src="/chat/verified.svg"
            alt="Verified"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        </h3>
        <p className="top-voice-animate mt-2 line-clamp-3 text-sm h-20 leading-[1.25] text-white ">
          {profile.summary}
        </p>

        <div className="top-voice-animate mt-2 flex items-end justify-between gap-4">
          <h4 className="text-xs font-semibold leading-none text-white">Quick Bookings</h4>
          <button type="button" className="text-[11px] font-medium leading-none text-white/45 underline underline-offset-4">
            View all options
          </button>
        </div>
        <div className="top-voice-animate mt-2 grid grid-cols-3 gap-2">
          {quickBookings.map((booking) => (
            <button
              key={booking.label}
              className={`rounded-[10px] border-[0.5px] px-2 py-1 text-center transition ${
                booking.active
                  ? 'border-[#E1E9F4] bg-[#D2EBFF] text-[#07142d]'
                  : 'border-[#E1E9F4] text-white/85'
              }`}
            >
              <span className="block text-[12px] font-medium leading-tight">
                {booking.label}
              </span>
              <span className="block text-[11px] text-[#5d6a80]">({booking.time})</span>
            </button>
          ))}
        </div>

        <div className="top-voice-animate mt-4 flex items-end justify-between gap-4">
          <h4 className="text-xs font-semibold leading-none text-white">Availability</h4>
          <button type="button" className="text-[11px] font-medium leading-none text-white/45 underline underline-offset-4">
            View all availability
          </button>
        </div>
        <div className="top-voice-animate mt-2 grid grid-cols-2 gap-4">
          {availability.map((slot) => (
            <button
              key={slot.time}
              className={`rounded-[10px] border-[0.5px] px-2 py-1 text-center transition ${
                slot.active
                  ? 'border-[#E1E9F4] bg-[#D2EBFF] text-[#07142d]'
                  : 'border-[#E1E9F4] text-white/85'
              }`}
            >
              <span className="block text-[12px] font-medium leading-tight">{slot.day}</span>
              <span className="block text-[11px] text-[#5d6a80]">{slot.time}</span>
            </button>
          ))}
        </div>

        <div className="top-voice-animate space-y-3 pt-3">
          <div className="flex items-center justify-between gap-4 rounded-[10px] bg-[#D2EBFF] px-3 py-2 text-[#07142d]">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium leading-tight">May 14th - 10:00 AM</p>
              <p className="mt-1 text-[11px] leading-tight">
                <span className="font-bold">$80</span>
                <span className="text-[#5d6a80]"> / 60 min</span>
              </p>
            </div>
            <BookButton />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-[10px] border-[0.5px] border-[#E1E9F4] bg-[#05253e] px-3 py-2">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[#D2EBFF]">
                <AdvisoryPlan />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold leading-tight text-white">Advisory plan</p>
                <p className="mt-1 text-[11px] leading-tight text-white">
                  <span className="font-bold">$280</span>
                  <span className="text-white/45"> / six sessions</span>
                </p>
              </div>
            </div>
            <BookButton />
          </div>
        </div>
      </div>
    </article>
  );
}
