import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { MatchingAuthoritySectionContent } from '@/data/marketing/cofounderMatchingData';
import TopAuthoritySection from './top-authority-section';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const defaultSectionContent: MatchingAuthoritySectionContent = {
  layout: 'side',
  image: `${staticUrl}/matching/board.svg`,
  title: 'Ambition Meets Authority.',
  description:
    "The right board member does not just fill a seat; they transform a company's trajectory. We facilitate the connection, providing you with the data you need to make the right appointment with total confidence.",
  points: [
    {
      label: 'Direct Outreach:',
      text: 'Once the algorithm identifies a match, initiate secure, private communication immediately.',
    },
    {
      label: 'Two-Way Discovery:',
      text: 'Both businesses and individuals have the power to search, filter, and be discovered.',
    },
  ],
  cta: {
    label: 'Get Started with Board Matching',
    href: '/signup',
  },
};

export default function AuthoritySection({ content = defaultSectionContent }: { content?: MatchingAuthoritySectionContent }) {
  if (content.layout === 'top') {
    return <TopAuthoritySection content={content} />;
  }

  return (
    <section className="overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1260px] rounded-[24px] bg-white py-8 md:rounded-[56px] md:bg-gradient-to-tr md:from-white md:via-white md:to-[#e9f6ff] md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <div className="relative order-2 min-h-[420px] w-full overflow-hidden rounded-[14px]  md:order-1 md:min-h-[560px] md:w-1/2 md:bg-transparent">
            <Image
              src={content.image}
              alt="Board matching dashboard"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-contain object-center"
            />
          </div>

          <div className="order-1 flex w-full flex-col items-start px-0 md:order-2 md:w-1/2 lg:pr-10">
            <h2 className="text-2xl font-medium leading-[100%] tracking-[0.02em] text-[#151922] md:text-[38px] md:font-medium md:leading-[1.08] md:tracking-normal">
              {content.title}
            </h2>

            <p className="mt-3 text-sm font-normal leading-[150%] tracking-[-0.003em] text-[#657086] md:mt-4 md:text-[15px] md:leading-[1.45] md:tracking-normal lg:text-lg">
              {content.description}
            </p>

            <div className="mt-5 space-y-4 md:mt-4">
              {content.points.map((point) => (
                <div key={point.label} className="flex gap-4 md:gap-5">
                  {point.icon ? (
                    <Image
                      src={point.icon}
                      alt={`${point.label} icon`}
                      width={32}
                      height={32}
                      className="mt-1 size-6 shrink-0 object-contain md:size-8"
                    />
                  ) : (
                    <CheckCircle2 className="mt-1 size-6 shrink-0 fill-[#2357C6] text-white md:size-8" />
                  )}
                  <p className="max-w-[850px] text-sm leading-[150%] text-[#657086] md:text-base md:leading-[1.38] lg:text-lg">
                    <span className="font-semibold text-[#151922]">{point.label}</span>{' '}
                    {point.text}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={content.cta.href}
              className="mt-8 inline-flex h-[46px] items-center justify-center rounded-[10px] bg-[#00395d] px-7 text-sm font-medium text-white shadow-[0_8px_20px_rgba(0,57,93,0.18)] transition hover:bg-[#07527f] md:mt-20 md:h-[52px] md:px-9"
            >
              {content.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
