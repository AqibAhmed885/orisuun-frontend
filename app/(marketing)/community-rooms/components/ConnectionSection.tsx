import Image from 'next/image';

import { universalCommunityChatConnectionSection } from '@/data/marketing/universalAndCommunityChat';
import MomentumSection from './MomentumSection';
import QuickGlanceSection from './QuickGlanceSection';

export default function ConnectionSection() {
  return (
    <section className="bg-white min-h-[630px]">
      <div className="">

        <div className="w-full overflow-hidden rounded-2xl max-w-[1260px] mx-auto px-5 py-14">
          <div className="grid gap-5 md:grid-cols-[1fr_1fr] md:items-start md:gap-12 lg:gap-16">
            <div className="">
              <Image
                src={universalCommunityChatConnectionSection.image}
                alt={universalCommunityChatConnectionSection.imageAlt}
                width={560}
                height={380}
                className="h-auto w-full md:h-full object-contain"
              />
            </div>

            <div className="relative flex h-full w-full max-w-[600px] p-8 flex-col justify-between  rounded-3xl md:gap-0">
              <div className="absolute top-0 z-0 right-0 tracking-wide rounded-tr-3xl h-[70%] w-full bg-gradient-to-bl to-[40%] from-[#2382C6]/20 to-transparent"/>
              <div className="">
                <h3
                  className="mx-auto w-full max-w-[557px] text-left text-[14px] font-medium leading-[100%]  text-[#1A2A4F] md:mx-0 md:min-h-[76px] md:text-[38px] tracking-wide"
                >
                  {universalCommunityChatConnectionSection.featureTitle}
                </h3>

                <p
                  className="mt-2 text-left text-[9px] font-normal tracking-wide text-[#5B657B] md:mt-0 md:text-lg"
                >
                  {universalCommunityChatConnectionSection.featureDescription}
                </p>
              </div>

              <p
                className="text-left text-[9px] tracking-wide font-normal leading-[150%] text-[#5B657B] md:text-lg"
              >
                <span className="font-bold text-[#1A2A4F]" >
                  {universalCommunityChatConnectionSection.featureHighlightLabel}:
                </span>{' '}
                {universalCommunityChatConnectionSection.featureHighlightDescription}
              </p>
            </div>
          </div>
        </div>

        <MomentumSection />
        <QuickGlanceSection />
      </div>
    </section>
  );
}
