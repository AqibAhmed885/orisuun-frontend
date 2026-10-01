import React from 'react';
import Image from 'next/image';
import { EllipsisSmIcon } from '@/icons/ellipsis';
import { formatPostedLabel, isUrl } from './feed-card-utils';

export const NewsFeedCard = ({ feed, onOpenNews }) => {
  const summaryText = isUrl(feed.Description)
    ? feed.Content || ''
    : feed.Description || feed.Content || '';
  const wordCount = summaryText.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = wordCount ? Math.max(1, Math.round(wordCount / 200)) : 3;
  const postedAt = feed.DateTime || feed.CreateDate;
  const postedLabel = formatPostedLabel(postedAt);
  const newsLink = feed.EventLink;
  const newsImage = null;

  return (
    <div className="flex flex-col mb-4  gap-4 bg-white rounded-2xl shadow-blur overflow-hidden p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF3FF] px-3 py-2 text-base font-semibold text-[#2454C4]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V4C4 3.46956 4.21071 2.96086 4.58579 2.58578C4.96086 2.21071 5.46957 2 6 2H18C18.5304 2 19.0391 2.21071 19.4142 2.58578C19.7893 2.96086 20 3.46956 20 4V16M14 22C14.3166 22.0005 14.6301 21.9384 14.9225 21.8172C15.215 21.6961 15.4806 21.5182 15.704 21.294L19.292 17.706C19.5168 17.4825 19.6952 17.2167 19.8167 16.9238C19.9382 16.631 20.0005 16.317 20 16M14 22V17C14 16.7348 14.1054 16.4804 14.2929 16.2929C14.4804 16.1054 14.7348 16 15 16L20 16M10 15H8M16 11H8M16 7H8" stroke="#2A4F98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {feed.NewsChannel || 'News'}
          </span>
          <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2" cy="2" r="2" fill="#0A193A" />
          </svg>
          <span className="text-sm font-medium text-[#5B657B]">{postedLabel}</span>
        </div>
        <button
          type="button"
          className="text-[#5B657B] transition-colors hover:text-[#0D1B39]"
          aria-label="News card options"
        >
          <EllipsisSmIcon />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[22px] sm:text-[28px] font-bold leading-tight text-[#0A193A]">
          {feed.Title || 'Latest News'}
        </h3>
        <p className="text-sm font-medium text-[#5B657B]">
          {readTimeMinutes} mins read • {feed.Auther || feed.NewsChannel || 'News'}
        </p>
        {summaryText && (
          <p className="text-base leading-relaxed text-[#2C3E66]">
            {summaryText}
            {newsLink && (
              <button
                type="button"
                className="ml-2 font-semibold text-[#0D1B39] hover:underline"
                onClick={() => onOpenNews?.(newsLink, feed.CreateDate)}
              >
                Read more
              </button>
            )}
          </p>
        )}
      </div>
      {newsImage && (
        <button
          type="button"
          className="overflow-hidden rounded-2xl border border-[#EEF2F8] bg-[#F3F6FB]"
          onClick={newsLink ? () => onOpenNews?.(newsLink, feed.CreateDate) : undefined}
        >
          <Image
            src={newsImage}
            alt={feed.Title || 'News preview'}
            width={860}
            height={480}
            className="h-[220px] w-full object-cover"
          />
        </button>
      )}
    </div>
  );
};
