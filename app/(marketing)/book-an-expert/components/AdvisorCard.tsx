'use client';

import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';

interface AdvisorCardProps {
  name: string;
  tag: string;
  tagIcon?: string;
  description: string;
  date: string;
  price: string;
  planPrice: string;
  image: string;
}

export default function AdvisorCard({
  name,
  tag,
  tagIcon,
  description,
  date,
  price,
  planPrice,
  image,
}: AdvisorCardProps) {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
  const getImageSrc = (src: string) =>
    src.startsWith('/') ? `${staticUrl}${src}` : src;

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-[#BAD9FF]/40 bg-white p-3.5 shadow-[0_0_14px_rgba(0,0,0,0.06)] sm:p-4">
      {/* Header */}
      <div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:gap-3">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={getImageSrc(image)}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="truncate text-sm font-semibold text-[#101828]">
              {name}
            </h3>
            <BadgeCheck className="h-4 w-4 flex-shrink-0 fill-[#17B26A] text-white" />
          </div>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#F5FAFF] px-2 py-0.5 text-[10px] font-medium text-[#2357C6]">
            {tagIcon && (
              <Image
                src={getImageSrc(tagIcon)}
                alt=""
                width={12}
                height={12}
                className="h-3 w-3 object-contain"
              />
            )}
            {tag}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-2 line-clamp-3 min-h-[54px] text-xs leading-[1.5] text-[#475467]">
        {description}
      </p>

      {/* Session row */}
      <div className="mb-2 flex items-center justify-between rounded-xl border border-[#E1E9F4] bg-white p-2.5 sm:mb-3 sm:p-3">
        <div>
          <p className="text-[10px] font-medium text-[#101828]">{date}</p>
          <p className="text-[10px] text-[#475467]">{price}</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#2357C6] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#1B44B1]"
        >
          Book now
        </button>
      </div>

      {/* Plan row */}
      <div className="flex items-center justify-between rounded-xl border border-[#B2DDFF]/60 bg-[#F5FAFF] p-2.5 sm:p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D2EBFF]">
            <svg
              className="h-3.5 w-3.5 text-[#2357C6]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#101828]">Advisory plan</p>
            <p className="whitespace-nowrap text-[10px] text-[#475467]">
              <span className="font-semibold text-[#101828]">
                {planPrice.split(' / ')[0]}
              </span>
              {' / '}
              {planPrice.split(' / ')[1]}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#2357C6] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#1B44B1]"
        >
          Book now
        </button>
      </div>
    </article>
  );
}
