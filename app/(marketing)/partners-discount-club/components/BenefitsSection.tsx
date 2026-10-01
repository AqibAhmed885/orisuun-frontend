import Image from 'next/image';

import {
  discountPortalLandingBenefits,
  discountPortalLandingBenefitsHeader,
} from '@/data/marketing/discount';

import BenefitCard from './BenefitCard';

export default function BenefitsSection() {
  return (
    <section className="bg-[#EEF1F7] px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-[620px] text-center">
          <h2 className="text-[24px] leading-10 text-[#111827] md:text-[42px] lg:text-[42px]"
          >
            
            {discountPortalLandingBenefitsHeader.titlePrefix}{' '}
            <span className="relative inline-flex items-center justify-center px-1.5 leading-none">
              <Image
                src={discountPortalLandingBenefitsHeader.highlightImage}
                alt=""
                fill
                className="object-fill"
                sizes="180px"
              />
              <span className="relative z-10">
                {discountPortalLandingBenefitsHeader.highlightedTitle}
              </span>
            </span>{' '}
            {discountPortalLandingBenefitsHeader.titleSuffix}
          </h2>

          <p className="mx-auto mt-5 max-w-[680px] text-sm font-medium leading-6 text-[#667085] md:text-base">
            {discountPortalLandingBenefitsHeader.description}
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden border border-[#D5DCE8] bg-white md:grid-cols-2 lg:grid-cols-3">
          {discountPortalLandingBenefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
