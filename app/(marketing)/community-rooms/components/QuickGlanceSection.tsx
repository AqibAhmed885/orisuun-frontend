import Image from 'next/image';

import { universalCommunityChatQuickGlanceSection } from '@/data/marketing/universalAndCommunityChat';

const quickGlanceRows = [
  {
    title: "Who's In?",
    universal: 'Everyone, automatically',
    community: 'Anyone interested in your topic',
  },
  {
    title: 'The Vibe',
    universal: 'The big-picture "Pulse" of the site',
    community: 'Niche, focused, and deep',
  },
  {
    title: 'Your Role',
    universal: 'Participant & Contributor',
    community: 'Creator, Leader, & Moderator',
  },
  {
    title: 'Visibility',
    universal: 'Climb the list with every chat',
    community: 'Build a loyal following',
  },
];

export default function QuickGlanceSection() {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section
      aria-labelledby="quick-glance-title"
      className="mx-auto w-full max-w-[1380px] px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20"
    >
      <h3
        id="quick-glance-title"
        className="text-center text-[32px] font-medium leading-none tracking-[-0.02em] text-[#0B1220] md:text-[52px]"
      >
        {universalCommunityChatQuickGlanceSection.titleStart}{' '}
        <span className="relative inline-flex items-center justify-center px-2 py-1 leading-none md:px-4">
          <Image
            src={`${staticUrl}/discount-portal-landing/Union.png`}
            alt=""
            fill
            className="object-fill"
            sizes="190px"
          />
          <span className="relative z-10">
            {universalCommunityChatQuickGlanceSection.titleHighlight}
          </span>
        </span>
      </h3>

      <div className="mx-auto mt-8 w-full max-w-[390px] space-y-3 md:hidden">
        {quickGlanceRows.map((row) => (
          <article
            key={row.title}
            className="overflow-hidden rounded-xl border border-[#AAB8C9] bg-[#E8EEF5] text-left"
          >
            <h4 className="bg-[#BAD9FF] px-4 py-3 text-[15px] font-semibold leading-none text-[#0A0A0A]">
              {row.title}
            </h4>
            <div className="grid grid-cols-2 divide-x divide-[#AAB8C9] border-t border-[#AAB8C9]">
              <div className="px-4 py-4">
                <p className="text-[11px] font-bold leading-[130%] text-[#0A0A0A]">Universal Chat</p>
                <p className="mt-2 text-[11px] font-normal leading-[145%] text-[#38465A]">
                  {row.universal}
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="text-[11px] font-bold leading-[130%] text-[#0A0A0A]">Community Rooms</p>
                <p className="mt-2 text-[11px] font-normal leading-[145%] text-[#38465A]">
                  {row.community}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        role="table"
        aria-label="Universal Chat and Community Rooms comparison"
        className="mt-12 hidden grid-cols-[22%_39%_39%] md:grid max-w-[1180px] mx-auto"
      >
        <div role="row" className="contents">
          <div aria-hidden="true" />
          <div
            role="columnheader"
            className="flex min-h-[78px] items-center rounded-tl-2xl border border-[#AAB8C9] bg-[#DCE5EE] px-8 text-[20px] font-semibold text-[#0A0A0A] lg:text-[22px]"
          >
            Universal Chat
          </div>
          <div
            role="columnheader"
            className="flex min-h-[78px] items-center rounded-tr-2xl border-y border-r border-[#AAB8C9] bg-[#DCE5EE] px-8 text-[20px] font-semibold text-[#0A0A0A] lg:text-[22px]"
          >
            Community Rooms
          </div>
        </div>

        {quickGlanceRows.map((row, index) => {
          const isFirst = index === 0;
          const isLast = index === quickGlanceRows.length - 1;

          return (
            <div role="row" className="contents" key={row.title}>
              <div
                role="rowheader"
                className={`flex min-h-[78px] items-center border-x border-b border-[#8FA9C6] bg-[#BAD9FF] px-8 text-[19px] font-semibold leading-tight text-[#0A0A0A] lg:text-lg ${
                  isFirst ? 'rounded-tl-2xl border-t' : ''
                } ${isLast ? 'rounded-bl-2xl' : ''}`}
              >
                {row.title}
              </div>
              <div
                role="cell"
                className="flex min-h-[78px] items-center tracking-wide border-b border-r border-[#AAB8C9] bg-[#E8EEF5] px-8 text-sm font-normal  text-[#18202C] lg:text-base"
              >
                {row.universal}
              </div>
              <div
                role="cell"
                className={`flex min-h-[78px] items-center border-b border-r tracking-wide border-[#AAB8C9] bg-[#E8EEF5] px-8 text-sm font-normal leading-[140%] text-[#18202C] lg:text-base ${
                  isLast ? 'rounded-br-2xl' : ''
                }`}
              >
                {row.community}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
