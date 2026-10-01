import Image from 'next/image';
import Link from 'next/link';

import { universalCommunityChatHero } from '@/data/marketing/universalAndCommunityChat';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#BAD9FF] aspect-[1/3]  md:aspect-[1260/820]">
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[400px]  items-center gap-5 pt-10 md:pt-20 lg:pt-32">
          <h1
            className="max-w-[668px] text-[55px] font-medium leading-[100%] tracking-[-1.72px] text-[#0B3658]"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro', sans-serif", fontWeight: 500 }}
          >
            {universalCommunityChatHero.titleStart}{' '}
            <span className="text-[#8DA0B5]">{universalCommunityChatHero.titleHighlight}</span>{' '}
            {universalCommunityChatHero.titleEnd}
          </h1>

          <div className="pb-1 md:pb-3 md:pt-3">
              <p
                className="w-full max-w-[493px] min-h-[72px] text-[16px] font-normal leading-[150%] tracking-[0px] text-[#284A66]"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                {universalCommunityChatHero.description}
              </p>

            <Link
              href={universalCommunityChatHero.ctaHref}
              className="mt-5 inline-flex rounded bg-[#071B3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#11345F]"
            >
              {universalCommunityChatHero.ctaLabel}
            </Link>
          </div>
        </div>

        <div className="absolute left-0 right-0 t z-10 flex justify-center md:bottom-0 ">
          <Image
            src={universalCommunityChatHero.image}
            alt={universalCommunityChatHero.imageAlt}
            width={1120}
            height={650}
            className="h-auto w-full max-w-[1120px] translate-y-1 md:translate-y-2"
            priority
          />
        </div>
      </div>
    </section>
  );
}
